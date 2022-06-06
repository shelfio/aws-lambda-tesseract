import {execSync} from 'child_process';
import {getTextFromImage} from './lib';

export function handler(): Promise<string> {
  execSync(`cp ./test.png /tmp/test.png`);

  return getTextFromImage('/tmp/test.png');
}
