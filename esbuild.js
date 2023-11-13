// eslint-disable-next-line @typescript-eslint/no-var-requires
require('esbuild').buildSync({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'lib/index.js',
});
