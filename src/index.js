const {execFile} = require('child_process');
const path = require('path');
const fs = require('fs');
const isImage = require('is-image');
const {unpack} = require('@shelf/aws-lambda-brotli-unpacker');

const unsupportedExtensions = new Set(['ai', 'emf', 'eps', 'gif', 'ico', 'psd', 'svg']);
const inputPath = path.join(__dirname, '..', 'bin', 'tt.tar.br');
const outputPath = '/tmp/tesseract/tesseract';

async function runTesseract(file, opts) {
  const ttBinary = process.env.TESSERACT_BINARY_PATH || (await unpack({inputPath, outputPath}));
  let processFile = 'stdin';
  if (typeof file === 'string' && fs.existsSync(file)) processFile = file;
  if (!file) processFile = false;

  const options = {
    env: {}
  };
  if (!process.env.TESSERACT_BINARY_PATH) {
    options.env.LD_LIBRARY_PATH =
      `${process.env.LD_LIBRARY_PATH}:/tmp/tesseract/lib` || `/tmp/tesseract/lib`;
    options.env.TESSDATA_PREFIX = process.env.TESSDATA_PREFIX || `/tmp/tesseract/tessdata`;
  }
  console.log('Running with options: ', options, opts);
  if (!process.env.TESSERACT_BINARY_PATH) options.cwd = '/tmp/tesseract';
  return new Promise((resolve, reject) => {
    const finalOpts = processFile ? [processFile, ...opts] : opts;
    const child = execFile(ttBinary, finalOpts, options, (error, stdout, stderr) => {
      if (error) return reject(error);
      return resolve(stdout);
    });
    if (processFile === 'stdin') file.pipe(child.stdin);
  });
}

function isUnsupportedFileExtension(filePath) {
  const ext = path
    .extname(filePath)
    .slice(1)
    .toLowerCase();

  return unsupportedExtensions.has(ext);
}

function tsvJSON(tsv) {
  const lines = tsv.split('\n');
  const result = [];
  const headers = lines[0].split('\t');

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split('\t');
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}

module.exports.getExecutablePath = async function() {
  return unpack({inputPath, outputPath});
};

module.exports.getTextFromImage = async function(file) {
  const result = await runTesseract(file, ['stdout', '-l', 'eng']);
  return result.toString();
};

module.exports.getWordsAndBounds = async function(file) {
  const result = await runTesseract(file, ['stdout', '-l', 'eng', 'tsv']);
  const object = tsvJSON(result.toString());
  return object;
};

module.exports.version = async function() {
  const result = await runTesseract(false, ['--version']);
  return result.toString();
};

module.exports.isSupportedFile = function(filePath) {
  // Reject all non-image files for OCR
  if (!isImage(filePath)) {
    return false;
  }

  return !isUnsupportedFileExtension(filePath);
};
