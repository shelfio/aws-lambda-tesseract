# aws-lambda-tesseract [![CircleCI](https://circleci.com/gh/shelfio/aws-lambda-tesseract/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/aws-lambda-tesseract/tree/master) ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) [![Tesseract](https://img.shields.io/badge/tesserract-6_MB-brightgreen.svg)](bin/)

> 6 MB Tesseract (with English training data) to fit inside AWS Lambda

Inspired by [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda) & [lambda-scanner-ocr](https://github.com/philippkeller/lambda-scanner-ocr)

## Install

```
$ yarn add @shelf/aws-lambda-tesseract
```

`1.x` versions of this library were compiled for Node 8.10.

`2.x` was compiled for Node 10.x runtime.

## How does it work?

This package contains an archive with [Tesseract 4.0](https://github.com/tesseract-ocr/tesseract) compiled for usage in AWS Lambda environment.

When a Lambda starts, it unpacks an archive with a binary to the `/tmp` folder and makes sure it's done only once per Lambda cold start.

## Usage

```js
const {getTextFromImage, isSupportedFile} = require('@shelf/aws-lambda-tesseract');

module.exports.handler = async event => {
  // assuming there is a photo.jpg inside /tmp dir
  // original file will be deleted afterwards

  if (!isSupportedFile('/tmp/photo.jpg')) {
    return false;
  }

  return getTextFromImage('/tmp/photo.jpg');
};
```

`isSupportedFile` checks that file has image-like file extension and it's not in the list of
unsupported by Tesseract file extensions.

## Compile It Yourself

See [compile-tesseract.sh](compile-tesseract.sh)

Smoke test that it works by running `test.sh` script

## See Also

- [aws-lambda-libreoffice](https://github.com/shelfio/aws-lambda-libreoffice)
- [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

## License

MIT © [Shelf](https://shelf.io)
