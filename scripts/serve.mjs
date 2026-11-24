// Serveur local de prévisualisation (URLs propres comme sur Vercel). Usage : node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = new URL('../dist/', import.meta.url).pathname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const exists = async p => { try { return (await stat(p)).isFile(); } catch { return false; } };

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.includes('..')) { res.writeHead(400).end(); return; }
  let file = join(ROOT, path === '/' ? 'index.html' : path);
  if (!(await exists(file)) && await exists(file + '.html')) file += '.html';
  if (await exists(file)) {
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } else {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(await readFile(join(ROOT, '404.html')));
  }
}).listen(+process.argv[2] || 4173, () => console.log(`http://localhost:${+process.argv[2] || 4173}`));
