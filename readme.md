# aws-lambda-tesseract ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) [![Tesseract](https://img.shields.io/badge/tesserract-11_MB-brightgreen.svg)](bin/)

> 11 MB Tesseract (with English training data) to fit inside AWS Lambda compressed with Brotli

Inspired by [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda) & [lambda-scanner-ocr](https://github.com/philippkeller/lambda-scanner-ocr)

## Install

```
$ yarn add @shelf/aws-lambda-tesseract
```

## How does it work?

This package contains an archive with [Tesseract 4.0 beta](https://github.com/tesseract-ocr/tesseract) compiled for usage in AWS Lambda environment.

When Lambda starts, it unpacks an archive with a binary to the `/tmp` folder and makes sure it's done only once per Lambda cold start.

You can import a path to the Tesseract binary and spawn a child process to do the OCR magic ✨

## Usage

```js
const {getExecutablePath} = require('@shelf/aws-lambda-tesseract');
const {execSync} = require('child_process');

module.exports.handler = async event => {
  const ttBinary = await getExecutablePath();

  // assuming there is a photo.jpg inside /tmp dir

  const stdout = execSync(`${ttBinary} /tmp/photo.jpg ${defaultArgs.join(' ')}`);
  execSync(`rm /tmp/photo.jpg`);

  return stdout.toString();
};
```

## Compile It Yourself

See [compile-tesseract.sh](compile-tesseract.sh) & [compress-with-brotli.sh](compress-with-brotli.sh) files

## See Also

* [aws-lambda-libreoffice](https://github.com/vladgolubev/aws-lambda-libreoffice)
* [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

## License

MIT © [Shelf](https://shelf.io)
