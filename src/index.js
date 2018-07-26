const fs = require('fs');
const path = require('path');
const tar = require('tar-fs');
const defaultArgs = require('./args');

module.exports.defaultArgs = defaultArgs;

// see https://github.com/alixaxel/chrome-aws-lambda
module.exports.getExecutablePath = function() {
  return new Promise((resolve, reject) => {
    let input = path.join(__dirname, '..', 'bin');
    let output = '/tmp/tesseract/tesseract';

    if (fs.existsSync(output) === true) {
      return resolve(
        `cd /tmp && LD_LIBRARY_PATH=/tmp/tesseract/lib TESSDATA_PREFIX=/tmp/tesseract/tessdata ${output}`
      );
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

        if (fs.existsSync('/tmp/tesseract/libs/libtesseract.so.4')) {
          return resolve(output);
        }

        // TODO investigate occasional "cannot open shared object file: No such file or directory"
        // but it exists on the 2nd lambda call
        setTimeout(function() {
          return resolve(output);
        }, 200);
      });
    });

    source.pipe(require(`${__dirname}/iltorb`).decompressStream()).pipe(target);
  });
};
