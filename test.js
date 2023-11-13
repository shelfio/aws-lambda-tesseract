const {execSync} = require('child_process');
const {getTextFromImage} = require('./lib/index.js');

module.exports = {
  handler() {
    execSync(`cp ./test.png /tmp/test.png`);

    return getTextFromImage('/tmp/test.png');
  }
}
