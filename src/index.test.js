const {isSupportedFile} = require('./');

describe('#isSupportedFile', () => {
  it('should export isSupportedFile function', () => {
    expect(isSupportedFile).toBeInstanceOf(Function);
  });

  it.each`
    filePath            | expected
    ${'/tmp/file.mp3'}  | ${false}
    ${'/tmp/file.docx'} | ${false}
    ${'/tmp/file'}      | ${false}
    ${''}               | ${false}
    ${'/tmp/file.jpg'}  | ${true}
    ${'/tmp/file.png'}  | ${true}
    ${'/tmp/file.svg'}  | ${false}
    ${'/tmp/file.gif'}  | ${false}
    ${'/tmp/file.psd'}  | ${false}
    ${'/tmp/file.ico'}  | ${false}
    ${'/tmp/file.eps'}  | ${false}
    ${'/tmp/file.ai'}   | ${false}
  `('should return $expected for file $filePath', ({filePath, expected}) => {
    expect(isSupportedFile(filePath)).toEqual(expected);
  });
});
