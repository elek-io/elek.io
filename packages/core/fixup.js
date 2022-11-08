import Fs from 'fs-extra';

// Add package.json files to esm/cjs subfolders in dist after build
Fs.writeFileSync(
  './dist/esm/package.json',
  JSON.stringify({
    type: 'module',
  })
);
Fs.writeFileSync(
  './dist/cjs/package.json',
  JSON.stringify({
    type: 'commonjs',
  })
);
