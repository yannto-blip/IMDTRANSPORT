// Gabarits partagés : <head>, header, footer, boutons de contact, figures, schéma, carte.
import { readFileSync } from 'node:fs';

export const site = JSON.parse(readFileSync(new URL('./data/site.json', import.meta.url), 'utf8'));
export const map = JSON.parse(readFileSync(new URL('./data/idf-map.json', import.meta.url), 'utf8'));
const C = site.contact;

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- Contact ----------
const WA_BASE = 'Bonjour, je souhaiterais obtenir un devis pour un transport.\n\nMatériel à transporter : {m}\nLieu de départ : \nLieu de livraison : \nDate souhaitée : \n\nMerci.';
export const WA_SUBJECT = {
  general: '',
  engins: 'engin de chantier (type, poids : )',
  minipelle: 'mini-pelle (modèle, poids : )',
  nacelle: 'nacelle / plateforme élévatrice (modèle, poids : )',
  materiel: 'matériel de chantier (nature, quantité : )',
  vehicules: 'véhicule (modèle, roulant ou non : )',
  pros: 'besoin régulier / tournées (fréquence : )'
};
export const telHref = `tel:${C.phoneE164}`;
export const waHref = (svc = 'general') => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(WA_BASE.replace('{m}', WA_SUBJECT[svc] ?? ''))}`;
export const mailHref = `mailto:${C.email}?subject=${encodeURIComponent('Demande de transport')}`;

export const ICON = {
  phone: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>',
  wa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  mail: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.4L4 7.2V17h16V7.2l-8 5.2Zm7.3-5.4H4.7l7.3 4.7L19.3 7Z"/></svg>',
  arrow: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.2 5.3 19.9 12l-6.7 6.7-1.4-1.4 4.3-4.3H4v-2h12.1l-4.3-4.3 1.4-1.4Z"/></svg>'
};

export const ctaPair = (loc, svc = 'general', { size = '' } = {}) => `
<div class="cta-pair">
  <a class="btn btn-call ${size}" href="${telHref}" data-track="click_phone" data-loc="${loc}" data-svc="${svc}">${ICON.phone}<span>Appeler <span class="nowrap">${esc(C.phoneDisplay)}</span></span></a>
  <a class="btn btn-wa ${size}" href="${waHref(svc)}" target="_blank" rel="noopener" data-track="click_whatsapp" data-loc="${loc}" data-svc="${svc}">${ICON.wa}<span>Échanger sur WhatsApp</span></a>
</div>`;

export const mailLink = loc => `<a class="link-mail" href="${mailHref}" data-track="click_email" data-loc="${loc}">${ICON.mail}<span>${esc(C.email)}</span></a>`;

// ---------- Images ----------
export const figure = (key, { eager = false, cls = '', caption = '' } = {}) => {
  const im = site.images[key];
  return `<figure class="fig ${cls}">
  <img src="${im.src}" width="${im.w}" height="${im.h}" alt="${esc(im.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  ${im.illustrative ? '<figcaption class="fig-tag">Illustration non contractuelle</figcaption>' : (caption ? `<figcaption>${esc(caption)}</figcaption>` : '')}
</figure>`;
};

// ---------- Schéma technique du plateau ----------
export const plateSchema = () => `
<figure class="schema">
<svg viewBox="0 0 760 300" role="img" aria-labelledby="schema-t schema-d" class="schema-svg">
  <title id="schema-t">Schéma du plateau vu de dessus</title>
  <desc id="schema-d">Plateau de 10 mètres de longueur utile sur 2,48 mètres de largeur utile, soit une surface utile indicative de 24,8 mètres carrés. Rampes à l'arrière, treuil à l'avant.</desc>
  <defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#171B20"/></marker></defs>
  <rect x="60" y="90" width="600" height="149" fill="#FFFFFF" stroke="#171B20" stroke-width="3"/>
  <g stroke="#E2E6EA" stroke-width="1">${Array.from({ length: 9 }, (_, i) => `<line x1="${120 + i * 60}" y1="92" x2="${120 + i * 60}" y2="237"/>`).join('')}</g>
  <rect x="34" y="104" width="26" height="44" fill="#F1F3F5" stroke="#171B20" stroke-width="2"/>
  <rect x="34" y="181" width="26" height="44" fill="#F1F3F5" stroke="#171B20" stroke-width="2"/>
  <rect x="660" y="84" width="14" height="161" fill="#171B20"/>
  <rect x="628" y="150" width="26" height="30" rx="3" fill="#F58225"/>
  <path d="M674 100 L730 100 Q744 100 744 114 L744 216 Q744 230 730 230 L674 230 Z" fill="#F1F3F5" stroke="#171B20" stroke-width="2"/>
  <line x1="60" y1="52" x2="660" y2="52" stroke="#171B20" stroke-width="2" marker-start="url(#ar)" marker-end="url(#ar)"/>
  <line x1="60" y1="40" x2="60" y2="86" stroke="#9AA3AE" stroke-width="1"/><line x1="660" y1="40" x2="660" y2="86" stroke="#9AA3AE" stroke-width="1"/>
  <text x="360" y="40" text-anchor="middle" class="sv-dim">10 m — longueur utile</text>
  <line x1="18" y1="90" x2="18" y2="239" stroke="#171B20" stroke-width="2" marker-start="url(#ar)" marker-end="url(#ar)"/>
  <text x="10" y="164" text-anchor="middle" class="sv-dim" transform="rotate(-90 10 164)">2,48 m</text>
  <text x="360" y="160" text-anchor="middle" class="sv-big">24,8 m²</text>
  <text x="360" y="186" text-anchor="middle" class="sv-small">surface utile indicative</text>
  <text x="47" y="270" text-anchor="middle" class="sv-small">Rampes</text>
  <text x="641" y="270" text-anchor="middle" class="sv-small">Treuil</text>
  <text x="709" y="270" text-anchor="middle" class="sv-small">Cabine</text>
</svg>
<figcaption>Schéma indicatif, non à l'échelle des équipements. Les dimensions du plateau ne valent pas autorisation de transporter tout chargement de taille équivalente.</figcaption>
</figure>`;

// ---------- Carte Île-de-France ----------
const LABEL_OFFSET = { '75': [0, 2], '92': [-8, 6], '93': [6, -2], '94': [6, 6] };
export const idfMap = ({ headingId = 'carte-titre' } = {}) => {
  const deps = map.departments;
  return `
<div class="map-wrap" data-map>
  <svg class="idf-map" viewBox="0 0 ${map.width} ${map.height}" role="group" aria-labelledby="${headingId}">
    ${deps.map(d => {
      const [ox, oy] = LABEL_OFFSET[d.code] || [0, 0];
      const small = ['75', '92', '93', '94'].includes(d.code);
      return `<a href="/zones-intervention#dep-${d.code}" class="dep" data-code="${d.code}" data-name="${esc(d.name)}" aria-label="${esc(d.name)} (${d.code})">
      <path d="${d.d}"/>
      <text x="${(d.cx + ox).toFixed(1)}" y="${(d.cy + oy).toFixed(1)}" class="dep-num${small ? ' sm' : ''}" aria-hidden="true">${d.code}</text></a>`;
    }).join('')}
  </svg>
  <p class="map-info" aria-live="polite" data-map-info>Survolez ou touchez un département</p>
</div>`;
};

// ---------- Fil d'Ariane ----------
export const breadcrumb = items => `
<nav class="crumbs" aria-label="Fil d'Ariane"><ol>
  ${items.map((it, i) => i < items.length - 1 ? `<li><a href="${it.path}">${esc(it.name)}</a></li>` : `<li aria-current="page">${esc(it.name)}</li>`).join('')}
</ol></nav>`;

// ---------- Logo ----------
const logo = (where) => site.logo.src
  ? `<img src="${site.logo.src}" width="${site.logo.width}" height="${site.logo.height}" alt="${esc(site.name)}" class="logo-img">`
  : `<span class="wordmark${where === 'footer' ? ' wm-light' : ''}"><span class="wm-a">IMD</span> <span class="wm-b">Transport</span></span>`;

// ---------- Navigation ----------
export const SERVICES_NAV = [
  { path: '/transport-engins-chantier', label: 'Engins de chantier' },
  { path: '/transport-mini-pelle', label: 'Mini-pelles' },
  { path: '/transport-nacelle', label: 'Nacelles élévatrices' },
  { path: '/transport-materiel-btp', label: 'Matériel BTP' },
  { path: '/transport-vehicules', label: 'Véhicules' }
];
const MAIN_NAV = [
  { path: '/nos-moyens-techniques', label: 'Moyens techniques' },
  { path: '/transport-professionnels', label: 'Professionnels' },
  { path: '/zones-intervention', label: 'Zones' },
  { path: '/a-propos', label: 'À propos' }
];

const header = (cur) => `
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header" data-header>
  <div class="wrap hdr">
    <a href="/" class="brand" aria-label="${esc(site.name)} — accueil">${logo('header')}</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu" data-nav-toggle><span class="bars" aria-hidden="true"></span><span class="sr">Menu</span></button>
    <nav class="nav" id="menu" aria-label="Navigation principale" data-nav>
      <ul class="nav-list">
        <li class="has-sub">
          <button class="sub-toggle" type="button" aria-expanded="false" aria-controls="sub-prestations" data-sub-toggle>Prestations</button>
          <ul class="sub" id="sub-prestations">
            ${SERVICES_NAV.map(n => `<li><a href="${n.path}"${cur === n.path ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('')}
          </ul>
        </li>
        ${MAIN_NAV.map(n => `<li><a href="${n.path}"${cur === n.path ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('')}
      </ul>
      <div class="nav-cta">
        <a class="btn btn-wa btn-sm" href="${waHref()}" target="_blank" rel="noopener" data-track="click_whatsapp" data-loc="header">${ICON.wa}<span>WhatsApp</span></a>
        <a class="btn btn-call btn-sm" href="${telHref}" data-track="click_phone" data-loc="header">${ICON.phone}<span>${esc(C.phoneDisplay)}</span></a>
      </div>
    </nav>
  </div>
</header>`;

const footer = () => `
<footer class="site-footer">
  <div class="wrap ftr">
    <div class="ftr-brand">
      <a href="/" class="brand" aria-label="${esc(site.name)} — accueil">${logo('footer')}</a>
      <p class="ftr-sign">« ${esc(site.tagline)} »</p>
      <p>Transport d'engins, de matériel de chantier et de véhicules sur poids lourds plateau. Basée à ${esc(site.baseCity)} (${esc(site.basePostalCode.slice(0, 2))}), intervention dans toute l'Île-de-France.</p>
    </div>
    <div>
      <p class="ftr-h">Contact</p>
      <ul class="ftr-list">
        <li><a href="${telHref}" data-track="click_phone" data-loc="footer">${ICON.phone}${esc(C.phoneDisplay)}</a></li>
        <li><a href="${waHref()}" target="_blank" rel="noopener" data-track="click_whatsapp" data-loc="footer">${ICON.wa}WhatsApp</a></li>
        <li><a href="${mailHref}" data-track="click_email" data-loc="footer">${ICON.mail}${esc(C.email)}</a></li>
        ${site.googleBusinessUrl ? `<li><a href="${site.googleBusinessUrl}" target="_blank" rel="noopener">Fiche Google</a></li>` : ''}
      </ul>
    </div>
    <div>
      <p class="ftr-h">Prestations</p>
      <ul class="ftr-list">
        ${SERVICES_NAV.map(n => `<li><a href="${n.path}">${n.label}</a></li>`).join('')}
        <li><a href="/transport-professionnels">Solutions professionnelles</a></li>
        <li><a href="/nos-moyens-techniques">Moyens techniques</a></li>
      </ul>
    </div>
    <div>
      <p class="ftr-h">Zones d'intervention</p>
      <ul class="ftr-list ftr-deps">
        ${site.departments.map(d => `<li><a href="/zones-intervention#dep-${d.code}">${esc(d.name)} (${d.code})</a></li>`).join('')}
      </ul>
    </div>
  </div>
  <div class="wrap ftr-bottom">
    <p>© ${new Date().getFullYear()} ${esc(site.name)} — SIREN ${esc(site.legal.siren)}</p>
    <ul>
      <li><a href="/a-propos">À propos</a></li>
      <li><a href="/mentions-legales">Mentions légales</a></li>
      <li><a href="/politique-confidentialite">Politique de confidentialité</a></li>
    </ul>
  </div>
</footer>
<div class="mobile-bar" role="region" aria-label="Contact rapide">
  <a class="mb-call" href="${telHref}" data-track="click_phone" data-loc="mobile_bar">${ICON.phone}<span>Appeler</span></a>
  <a class="mb-wa" href="${waHref()}" target="_blank" rel="noopener" data-track="click_whatsapp" data-loc="mobile_bar">${ICON.wa}<span>WhatsApp</span></a>
</div>`;

// ---------- Document complet ----------
export const documentHtml = ({ page, body, assets, jsonld }) => {
  const url = site.url + (page.path === '/' ? '/' : page.path);
  const og = site.url + '/assets/img/og-imd-transport.png';
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
${page.noindex ? '' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#171B20">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.name)} — transport d'engins et de matériel BTP sur camion plateau">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/barlow-condensed-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${assets.css}">
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
<script src="${assets.js}" defer></script>
</head>
<body class="${page.bodyClass || ''}" data-page="${esc(page.path)}" data-svc="${page.service || ''}">
${header(page.path)}
<main id="contenu" tabindex="-1">
${body}
</main>
${footer()}
</body>
</html>
`;
};
