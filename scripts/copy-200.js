import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/200.html');
console.log('Wrote dist/200.html for Surge SPA routing');
