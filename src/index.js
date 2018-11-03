const {unpack} = require('@shelf/aws-lambda-brotli-unpacker');
const {execFileSync, execSync} = require('child_process');
const path = require('path');
const isImage = require('is-image');

const unsupportedExtensions = new Set(['ai', 'emf', 'eps', 'gif', 'ico', 'psd', 'svg']);
const inputPath = path.join(__dirname, '..', 'bin', 'tt.tar.br');
const outputPath = '/tmp/tesseract/tesseract';

module.exports.getExecutablePath = async function() {
  return unpack({inputPath, outputPath});
};

module.exports.getTextFromImage = async function(filePath) {
  const ttBinary = await unpack({inputPath, outputPath});

  const stdout = execFileSync(ttBinary, [filePath, 'stdout', '-l', 'eng'], {
    cwd: '/tmp/tesseract',
    env: {
      LD_LIBRARY_PATH: './lib',
      TESSDATA_PREFIX: './tessdata'
    }
  });

  execSync(`rm ${filePath}`);

  return stdout.toString();
};

module.exports.isSupportedFile = function(filePath) {
  // Reject all non-image files for OCR
  if (!isImage(filePath)) {
    return false;
  }

  return !isUnsupportedFileExtension(filePath);
};

function isUnsupportedFileExtension(filePath) {
  const ext = path
    .extname(filePath)
    .slice(1)
    .toLowerCase();

  return unsupportedExtensions.has(ext);
}
