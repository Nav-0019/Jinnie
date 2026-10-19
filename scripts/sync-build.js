import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const docsDir = path.resolve(rootDir, 'docs');
const assetsDir = path.resolve(rootDir, 'assets');

// Copy dist/assets to root assets/
if (fs.existsSync(path.join(distDir, 'assets'))) {
  fs.cpSync(path.join(distDir, 'assets'), assetsDir, { recursive: true });
  console.log('✓ Synced dist/assets to root /assets');
}

// Copy built HTML (either index.dev.html or index.html) to root index.html
const builtHtmlPath = fs.existsSync(path.join(distDir, 'index.dev.html'))
  ? path.join(distDir, 'index.dev.html')
  : path.join(distDir, 'index.html');

if (fs.existsSync(builtHtmlPath)) {
  fs.copyFileSync(builtHtmlPath, path.join(rootDir, 'index.html'));
  fs.copyFileSync(builtHtmlPath, path.join(distDir, 'index.html'));
  console.log('✓ Synced built HTML to root index.html and dist/index.html');
}

// Copy entire dist to docs/ for GitHub Pages docs/ option
fs.cpSync(distDir, docsDir, { recursive: true });
if (fs.existsSync(builtHtmlPath)) {
  fs.copyFileSync(builtHtmlPath, path.join(docsDir, 'index.html'));
}
console.log('✓ Synced dist to /docs');

// Ensure .nojekyll exists in root and docs
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '# Disable Jekyll\n');
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '# Disable Jekyll\n');
console.log('✓ Ensured .nojekyll in root and /docs');
