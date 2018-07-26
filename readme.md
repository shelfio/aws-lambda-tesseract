# aws-lambda-tesseract ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> 11 MB Tesseract (with English training data) to fit inside AWS Lambda compressed with Brotli

Inspired by [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda) & [lambda-scanner-ocr](https://github.com/philippkeller/lambda-scanner-ocr)

## Install

```
$ yarn add aws-lambda-tesseract
```

## Usage

```js
const {getExecutablePath} = require('aws-lambda-tesseract');
const {execSync} = require('child_process');
const ttBinary = await getExecutablePath();

module.exports.handler = (event) => {
  // assuming there is a photo.jpg inside /tmp dir

  const stdout = execSync(`${ttBinary} /tmp/photo.jpg ${defaultArgs.join(' ')}`);
  execSync(`rm /tmp/photo.jpg`);

  return stdout.toString();
}
```

## See Also

- [aws-lambda-libreoffice](https://github.com/vladgolubev/aws-lambda-libreoffice)
- [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)

## License

MIT © [Shelf](https://shelf.io)
