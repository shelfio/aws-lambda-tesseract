import {extract} from 'tar';
import {execFileSync, execSync} from 'child_process';
import path from 'path';
import isImage from 'is-image';

const unsupportedExtensions = new Set(['ai', 'emf', 'eps', 'gif', 'ico', 'psd', 'svg']);
const inputPath = path.join(__dirname, '..', 'bin', 'tt.tar.gz');
const outputPath = '/tmp/tesseract-standalone/tesseract';

export async function getExecutablePath(): Promise<string> {
  await extract({file: inputPath, cwd: '/tmp'});

  return outputPath;
}

export async function getTextFromImage(filePath: string): Promise<string> {
  await extract({file: inputPath, cwd: '/tmp'});

  const stdout = execFileSync(outputPath, [filePath, 'stdout', '-l', 'eng'], {
    cwd: '/tmp/tesseract-standalone',
    env: {
      LD_LIBRARY_PATH: './lib',
      TESSDATA_PREFIX: './tessdata'
    }
  });

  execSync(`rm ${filePath}`);

  return stdout.toString();
}

export function isSupportedFile(filePath: string): boolean {
  // Reject all non-image files for OCR
  if (!isImage(filePath)) {
    return false;
  }

  return !isUnsupportedFileExtension(filePath);
}

function isUnsupportedFileExtension(filePath: string): boolean {
  const ext = path
    .extname(filePath)
    .slice(1)
    .toLowerCase();

  return unsupportedExtensions.has(ext);
}
