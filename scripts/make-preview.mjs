// Crée une copie de dist/ avec des chemins relatifs (prévisualisation hors Vercel, ex. hébergement de test).
// Usage : node scripts/make-preview.mjs  →  dist-preview/
import { cpSync, rmSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'dist', OUT = 'dist-preview';
rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });
const walk = d => readdirSync(d).flatMap(f => statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]);
for (const f of walk(OUT)) {
  if (f.endsWith('.html')) {
    let h = readFileSync(f, 'utf8');
    h = h.replace(/(href|src)="\/(assets\/[^"]+|favicon[^"]*|apple-touch-icon\.png|site\.webmanifest)"/g, '$1="$2"')
      .replace(/href="\/"/g, 'href="index.html"')
      .replace(/href="\/([a-z0-9-]+)(#[^"]*)?"/g, (m, p, a) => `href="${p}.html${a || ''}"`)
      .replace(/<link rel="manifest"[^>]*>\n?/, '');
    writeFileSync(f, h);
  } else if (f.endsWith('.css')) {
    writeFileSync(f, readFileSync(f, 'utf8').replace(/url\(\/assets\/fonts\//g, 'url(../fonts/'));
  }
}
console.log('✓ dist-preview/ prêt');
