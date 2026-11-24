// Contrôles automatiques du site généré (dist/). Usage : node scripts/check.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const D = 'dist';
const files = readdirSync(D).filter(f => f.endsWith('.html'));
const errors = [], titles = new Map(), descs = new Map(), external = new Set();
const FORBIDDEN = [/17\s?t(onnes)?\b/i, /trois camions|3 camions|trois chauffeurs|3 chauffeurs/i, /lorem|TODO|XXX|placeholder/i, /24h\/24|24 ?h ?sur ?24/i, /AggregateRating|ratingValue/i, /tally\.so/i];
const resolve = href => {
  const p = href.split('#')[0].split('?')[0];
  if (p === '/' || p === '') return existsSync(join(D, 'index.html'));
  return existsSync(join(D, p)) || existsSync(join(D, p + '.html'));
};

for (const f of files) {
  const html = readFileSync(join(D, f), 'utf8');
  const body = html.split('<body')[1] || '';
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const h1 = (body.match(/<h1[\s>]/g) || []).length;
  if (!title) errors.push(`${f}: title manquant`);
  if (!desc) errors.push(`${f}: description manquante`);
  if (desc && (desc.length < 70 || desc.length > 170)) errors.push(`${f}: description ${desc.length} car.`);
  if (title && title.length > 75) errors.push(`${f}: title ${title.length} car.`);
  if (h1 !== 1) errors.push(`${f}: ${h1} h1`);
  if (f !== '404.html' && !html.includes('rel="canonical"')) errors.push(`${f}: canonical manquant`);
  titles.set(title, [...(titles.get(title) || []), f]);
  descs.set(desc, [...(descs.get(desc) || []), f]);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([^]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { errors.push(`${f}: JSON-LD invalide`); }
  }
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (u.startsWith('http')) { external.add(u.split('?')[0]); continue; }
    if (u.startsWith('tel:') || u.startsWith('mailto:') || u.startsWith('#') || u.startsWith('data:')) continue;
    if (!resolve(u)) errors.push(`${f}: lien interne cassé ${u}`);
    const anchor = u.split('#')[1];
    if (anchor) {
      const target = u.split('#')[0] || '/' + f.replace('.html', '');
      const tf = target === '/' ? 'index.html' : target.slice(1) + '.html';
      if (existsSync(join(D, tf)) && !readFileSync(join(D, tf), 'utf8').includes(`id="${anchor}"`)) errors.push(`${f}: ancre absente ${u}`);
    }
  }
  for (const m of body.matchAll(/<img [^>]*>/g)) {
    if (!/alt="[^"]+"/.test(m[0])) errors.push(`${f}: image sans alt`);
    if (!/width="\d+"/.test(m[0]) || !/height="\d+"/.test(m[0])) errors.push(`${f}: image sans dimensions`);
  }
  if (/ style="/.test(body)) errors.push(`${f}: attribut style inline (bloqué par la CSP)`);
  const text = body.replace(/<[^>]+>/g, ' ');
  for (const r of FORBIDDEN) if (r.test(text) || r.test(html)) errors.push(`${f}: contenu interdit ${r}`);
  if (/porte-char/i.test(text) && !/ne (réalisons|proposons) (pas|ni)[^.]*porte-char|ni porte-char/i.test(text)) errors.push(`${f}: porte-char mentionné positivement`);
}
for (const [t, fs] of titles) if (fs.length > 1) errors.push(`title dupliqué : ${fs.join(', ')}`);
for (const [d, fs] of descs) if (fs.length > 1) errors.push(`description dupliquée : ${fs.join(', ')}`);
for (const f of ['sitemap.xml', 'robots.txt', 'llms.txt', 'favicon.svg', 'assets/img/og-imd-transport.png']) if (!existsSync(join(D, f))) errors.push(`${f} manquant`);
const sm = readFileSync(join(D, 'sitemap.xml'), 'utf8');
for (const m of sm.matchAll(/<loc>https:\/\/imdtransport\.fr([^<]*)<\/loc>/g)) if (!resolve(m[1] || '/')) errors.push(`sitemap : ${m[1]} introuvable`);

console.log(`Pages contrôlées : ${files.length}`);
console.log(`Liens externes : ${[...external].join(' | ')}`);
console.log(errors.length ? `✗ ${errors.length} problème(s) :\n- ` + errors.join('\n- ') : '✓ Aucun problème détecté');
process.exit(errors.length ? 1 : 0);
