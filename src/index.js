const {execFileSync, execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const tar = require('tar-fs');
const isImage = require('is-image');

const unsupportedExtensions = new Set(['gif', 'psd', 'eps', 'svg']);

// see https://github.com/alixaxel/chrome-aws-lambda
module.exports.getExecutablePath = function() {
  return new Promise((resolve, reject) => {
    let input = path.join(__dirname, '..', 'bin');
    let output = '/tmp/tesseract/tesseract';

    if (fs.existsSync(output) === true) {
      return resolve(output);
    }

    for (let file of fs.readdirSync(input)) {
      if (file.endsWith('.br') === true) {
        input = path.join(input, file);
      }
    }

    const source = fs.createReadStream(input);
    const target = tar.extract('/tmp');

    source.on('error', error => {
      return reject(error);
    });

    target.on('error', error => {
      return reject(error);
    });

    target.on('finish', () => {
      fs.chmod(output, '0755', error => {
        if (error) {
          return reject(error);
        }

        return resolve(output);
      });
    });

    source.pipe(require(`${__dirname}/iltorb`).decompressStream()).pipe(target);
  });
};

module.exports.getTextFromImage = async function(filePath) {
  const ttBinary = await module.exports.getExecutablePath();

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
