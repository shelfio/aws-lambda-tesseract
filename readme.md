# aws-lambda-tesseract ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) [![Tesseract](https://img.shields.io/badge/tesserract-11_MB-brightgreen.svg)](bin/)

> 11 MB Tesseract (with English training data) to fit inside AWS Lambda compressed with Brotli

Inspired by [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda) & [lambda-scanner-ocr](https://github.com/philippkeller/lambda-scanner-ocr)

## Install

```
$ yarn add @shelf/aws-lambda-tesseract
```

## How does it work?

This package contains an archive with [Tesseract 4.0 beta](https://github.com/tesseract-ocr/tesseract) compiled for usage in AWS Lambda environment.

When a Lambda starts, it unpacks an archive with a binary to the `/tmp` folder and makes sure it's done only once per Lambda cold start.

## Usage

#### Using a path

```js
const {getTextFromImage, isSupportedFile} = require('@shelf/aws-lambda-tesseract');

module.exports.handler = async event => {
  // assuming there is a photo.jpg inside /tmp dir
  if (!isSupportedFile('/tmp/photo.jpg')) {
    return false;
  }

  getTextFromImage('/tmp/photo.jpg').then(result => console.log(result));
};
```

#### Using a stream

This is useful for when you want to stream the file data from a remote source like a URL.

```js
const https = require('https');
const {getTextFromImage, isSupportedFile} = require('@shelf/aws-lambda-tesseract');

module.exports.handler = async event => {
  // assuming that the url exists and is readable.
  const url = 'https://d.pr/i/9X4IIL.png';
  const fileStream = await new Promise(resolve => https.get(url, resolve));
  getTextFromImage(fileStream).then(result => console.log(result));
};
```

#### Extracting words and their coordinates

The `getWordsAndBounds` function returns a JSON object of extracted words and their coordinates on the page.

```js
const {getWordsAndBounds} = require('@shelf/aws-lambda-tesseract');

module.exports.handler = async event => {
  // assuming that photo.jpg exists and is readable.
  const file = fs.createReadStream(__dirname + '/photo.jpg');

  getWordsAndBounds(file).then(result => console.log(result));
};
```

`isSupportedFile` checks that file has image-like file extension and it's not in the list of
unsupported by Tesseract file extensions.

## Compile It Yourself

Compile Tesseract for deployment on Lambda. Requires [Docker](https://www.docker.com/) & [Make](https://www.gnu.org/software/make/manual/html_node/Introduction.html) to be installed.

`$ make build`: Builds Docker image, compiles Tesseract 4.0.0, and compresses result into the `tt.tar.br` archive.

`$ make build-tesseract`: Compiles Tesseract 4.0.0 and creates `tesseract.tar.gz` file as output.

`$ make compress-tesseract`: Runs brotli compression on built Tesseract and compresses `tesseract.tar.gz` into `tt.tar.bz`.

**Note:** After compiling and compressing you need to copy the latest `tt.tar.bz` into the `/bin` directory. `$ cp ./build/tt.tar.bz ./bin`

## See Also

- [aws-lambda-libreoffice](https://github.com/shelfio/aws-lambda-libreoffice)
- [aws-lambda-brotli-unpacker](https://github.com/shelfio/aws-lambda-brotli-unpacker)
- [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

## License

MIT © [Shelf](https://shelf.io)
