import {execSync} from 'child_process';
// @ts-ignore
import {getTextFromImage} from './lib';

export function handler(): Promise<string> {
  execSync(`cp ./test.png /tmp/test.png`);

  return getTextFromImage('/tmp/test.png');
}
