const {extract} = require('tar');
const {execFileSync, execSync} = require('child_process');
const path = require('path');
const isImage = require('is-image');

const unsupportedExtensions = new Set(['ai', 'emf', 'eps', 'gif', 'ico', 'psd', 'svg']);
const inputPath = path.join(__dirname, '..', 'bin', 'tt.tar.gz');
const outputPath = '/tmp/tesseract-standalone/tesseract';

module.exports.getExecutablePath = async function() {
  await extract({file: inputPath, cwd: '/tmp'});

  return outputPath;
};

module.exports.getTextFromImage = async function(filePath) {
  await extract({file: inputPath, cwd: '/tmp'});

  const stdout = execFileSync(outputPath, [filePath, 'stdout', '-l', 'eng'], {
    cwd: '/tmp/tesseract-standalone',
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
