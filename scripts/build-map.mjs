// Génère src/data/idf-map.json (tracés SVG des 8 départements d'Île-de-France).
// Source : france-geojson (G. David) — tracés IGN Admin Express COG, Licence Ouverte Etalab.
// https://github.com/gregoiredavid/france-geojson
// Usage : node scripts/build-map.mjs chemin/vers/departements-version-simplifiee.geojson
import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
if (!src) { console.error('Chemin du GeoJSON requis'); process.exit(1); }
const geo = JSON.parse(readFileSync(src, 'utf8'));
const CODES = ['75', '77', '78', '91', '92', '93', '94', '95'];
const feats = geo.features.filter(f => CODES.includes(f.properties.code));

const W = 600, PAD = 12;
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
const lat0 = 48.7 * Math.PI / 180;
const proj = ([lon, lat]) => [lon * Math.cos(lat0), -lat];
const rings = f => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates);
for (const f of feats) for (const poly of rings(f)) for (const ring of poly) for (const p of ring) {
  const [x, y] = proj(p);
  minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
}
const s = (W - 2 * PAD) / (maxX - minX);
const H = Math.round((maxY - minY) * s + 2 * PAD);
const tx = p => { const [x, y] = proj(p); return [(x - minX) * s + PAD, (y - minY) * s + PAD]; };

const out = feats.map(f => {
  let d = '', area = 0, cx = 0, cy = 0;
  for (const poly of rings(f)) poly.forEach((ring, ri) => {
    const pts = ring.map(tx);
    d += 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L') + 'Z';
    if (ri === 0) for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], c = x1 * y2 - x2 * y1;
      area += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c;
    }
  });
  area /= 2;
  return { code: f.properties.code, name: f.properties.nom, d, cx: +(cx / (6 * area)).toFixed(1), cy: +(cy / (6 * area)).toFixed(1) };
}).sort((a, b) => a.code.localeCompare(b.code));

writeFileSync(new URL('../src/data/idf-map.json', import.meta.url), JSON.stringify({ width: W, height: H, source: 'IGN Admin Express COG via france-geojson — Licence Ouverte Etalab', departments: out }));
console.log('OK', W, H, out.map(o => `${o.code}:${o.d.length}`).join(' '));
