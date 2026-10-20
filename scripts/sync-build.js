import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const docsDir = path.resolve(rootDir, 'docs');

// Clean docs/ and copy entire fresh dist/ to docs/ for GitHub Pages
if (fs.existsSync(distDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
  fs.cpSync(distDir, docsDir, { recursive: true });
  console.log('✓ Cleaned and synced dist/ to /docs');
}

// Ensure .nojekyll in root, dist, and docs
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '# Disable Jekyll\n');
if (fs.existsSync(distDir)) fs.writeFileSync(path.join(distDir, '.nojekyll'), '# Disable Jekyll\n');
if (fs.existsSync(docsDir)) fs.writeFileSync(path.join(docsDir, '.nojekyll'), '# Disable Jekyll\n');
console.log('✓ Ensured .nojekyll across root, dist, and docs');
