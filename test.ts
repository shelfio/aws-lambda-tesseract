import {execSync} from 'child_process';
import {getTextFromImage} from './src';

export async function handler(): Promise<string> {
  execSync(`cp ./test.png /tmp/test.png`);

  return getTextFromImage('/tmp/test.png');
}
