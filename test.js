/* eslint-disable @typescript-eslint/no-var-requires */
const {execSync} = require('child_process');
const {getTextFromImage} = require('./src');

module.exports.handler = async () => {
  execSync(`cp ./test.png /tmp/test.png`);

  return getTextFromImage('/tmp/test.png');
};
