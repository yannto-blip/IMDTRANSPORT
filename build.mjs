// Générateur statique IMD Transport — Node ≥ 18, aucune dépendance.
// Usage : node build.mjs  →  produit le site dans dist/
import { mkdirSync, rmSync, writeFileSync, readFileSync, cpSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { site, documentHtml } from './src/layout.mjs';
import { pages } from './src/pages.mjs';

const OUT = 'dist';
// Prévisualisations Vercel (VERCEL_ENV=preview) : noindex partout + robots.txt bloquant.
const IS_PREVIEW = process.env.VERCEL_ENV === 'preview' || process.env.IMD_PREVIEW === '1';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 1. Assets statiques (polices, images) + CSS/JS empreintés pour le cache longue durée
cpSync('src/assets', join(OUT, 'assets'), { recursive: true });
cpSync('public', OUT, { recursive: true });
const hashed = (rel) => {
  const buf = readFileSync(join('src/assets', rel));
  const h = createHash('sha256').update(buf).digest('hex').slice(0, 10);
  const name = rel.replace(/(\.\w+)$/, `.${h}$1`);
  writeFileSync(join(OUT, 'assets', name), buf);
  rmSync(join(OUT, 'assets', rel));
  return `/assets/${name}`;
};
const assets = { css: hashed('css/main.css'), js: hashed('js/main.js') };

// 2. Données structurées
const ORG_ID = `${site.url}/#organisation`;
const C = site.contact;
const areaServed = [
  ...site.departments.map(d => ({ '@type': 'AdministrativeArea', name: `${d.name} (${d.code})` })),
  { '@type': 'AdministrativeArea', name: 'Île-de-France' }
];
const org = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': ORG_ID,
  name: site.name,
  legalName: site.legalName,
  url: site.url + '/',
  slogan: site.tagline,
  description: 'Transport d\'engins de chantier, de matériel BTP et de véhicules sur poids lourds porteurs plateau en Île-de-France, pour les professionnels et les particuliers.',
  telephone: C.phoneIntl,
  email: C.email,
  image: `${site.url}/assets/img/og-imd-transport.png`,
  logo: site.url + site.logo.png,
  address: { '@type': 'PostalAddress', addressLocality: site.baseCity, postalCode: site.basePostalCode, addressRegion: 'Île-de-France', addressCountry: 'FR' },
  areaServed,
  vatID: site.legal.vat,
  identifier: { '@type': 'PropertyValue', propertyID: 'SIREN', value: site.legal.siren.replace(/\s/g, '') },
  knowsAbout: ['Transport d\'engins de chantier', 'Transport de mini-pelle', 'Transport de nacelle élévatrice', 'Transport de matériel BTP', 'Transport de véhicules utilitaires', 'Camion plateau'],
  contactPoint: { '@type': 'ContactPoint', telephone: C.phoneIntl, email: C.email, contactType: 'customer service', availableLanguage: 'French', areaServed: 'FR' },
  ...(site.googleBusinessUrl ? { sameAs: [site.googleBusinessUrl] } : {})
};
const website = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url + '/', name: site.name, inLanguage: 'fr-FR', publisher: { '@id': ORG_ID } };
const crumbsLd = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: site.url + (it.path === '/' ? '/' : it.path) })) });
const faqLd = faq => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
const serviceLd = p => ({ '@context': 'https://schema.org', '@type': 'Service', name: p.serviceName, serviceType: p.serviceName, url: site.url + p.path, description: p.description, provider: { '@id': ORG_ID }, areaServed });

// Typographie française : espaces fines insécables avant ? ! : ; » et après «, sans toucher aux balises.
const typo = html => html
  .replace(/>([^<]+)</g, (m, t) => '>' + t.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ').replace(/(\d) (t|m|m²|tonnes|mètres|km)(?![\wÀ-ÿ])/g, '$1 $2') + '<')
  .replace(/(<h[1-3][^>]*>[^]*?<\/h[1-3]>|<p class="kicker[^"]*">[^]*?<\/p>)/g, h => h.replace(/(l'Île-de-France|Île-de-France)/g, '<span class="nowrap">$1</span>'));

// 3. Pages
const sitemap = [];
const today = new Date().toISOString().slice(0, 10);
for (const p of pages) {
  const jsonld = [];
  if (p.path === '/') jsonld.push(org, website);
  if (p.crumbs) jsonld.push(crumbsLd(p.crumbs));
  if (p.serviceName) jsonld.push(serviceLd(p));
  if (p.faq?.length) jsonld.push(faqLd(p.faq));
  const html = documentHtml({ page: p, body: typo(p.body(p)), assets, jsonld, noindexAll: IS_PREVIEW });
  writeFileSync(join(OUT, p.file), html);
  if (p.sitemap !== false && !p.noindex) sitemap.push(site.url + (p.path === '/' ? '/' : p.path));
}

// 4. sitemap.xml, robots.txt, llms.txt
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);

writeFileSync(join(OUT, 'robots.txt'), IS_PREVIEW ? 'User-agent: *\nDisallow: /\n' : `# IMD Transport — robots.txt
# Moteurs de recherche et robots de recherche des assistants IA : autorisés.
User-agent: *
Allow: /

# Robots d'entraînement de modèles IA : autorisés par défaut (choix à valider).
# Pour les bloquer sans affecter la recherche, décommenter les lignes ci-dessous.
# User-agent: GPTBot
# Disallow: /
# User-agent: Google-Extended
# Disallow: /
# User-agent: CCBot
# Disallow: /
# User-agent: ClaudeBot
# Disallow: /

Sitemap: ${site.url}/sitemap.xml
`);

const S = site.specs;
writeFileSync(join(OUT, 'llms.txt'), `# ${site.name}

> Entreprise de transport routier basée à ${site.baseCity} (${site.basePostalCode}, ${site.baseDepartment}). Transport d'engins de chantier, de matériel BTP et de véhicules sur poids lourds porteurs plateau, dans toute l'Île-de-France et, sur demande, en France métropolitaine.

## Faits clés
- Activité : transport (pas de location de matériel, pas de porte-char, pas de transport exceptionnel, pas de dépannage, pas de levage).
- Véhicules : poids lourds porteurs plateau ${S.brands}, flotte en propre, chauffeurs salariés de l'entreprise.
- Plateau : ${S.deckLength} de longueur utile × ${S.deckWidth} de largeur utile (surface utile indicative ${S.deckArea}).
- Charge : ${S.maxLoad}, sous réserve de faisabilité.
- Équipement : rampes de chargement et treuil. Pas de grue embarquée.
- Amplitude : ${S.schedule}.
- Zone : Paris (75), Seine-et-Marne (77), Yvelines (78), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d'Oise (95).
- Clients : professionnels (loueurs de matériel, BTP, artisans) et particuliers. Transports ponctuels et réguliers.
- Contact : téléphone ${C.phoneIntl}, WhatsApp https://wa.me/${C.whatsapp}, e-mail ${C.email}.

## Pages
${pages.filter(p => !p.noindex && !['/mentions-legales', '/politique-confidentialite'].includes(p.path)).map(p => `- [${p.h1}](${site.url}${p.path === '/' ? '/' : p.path}) : ${p.description}`).join('\n')}
`);

// 5. Rapport
const size = dir => readdirSync(dir).reduce((s, f) => { const st = statSync(join(dir, f)); return s + (st.isDirectory() ? size(join(dir, f)) : st.size); }, 0);
console.log(`${IS_PREVIEW ? '[PREVIEW noindex] ' : ''}✓ ${pages.length} pages générées dans ${OUT}/ (${(size(OUT) / 1024).toFixed(0)} Ko) — CSS ${assets.css}, JS ${assets.js}`);
