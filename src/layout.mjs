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


// Pictogrammes sécurité / réassurance (trait 2px, currentColor)
const PI = d => `<svg class="pi" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
export const PICTO = {
  shield: PI('<path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'),
  people: PI('<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5.6M17.5 14.2A5.5 5.5 0 0 1 20.5 19"/>'),
  strap: PI('<rect x="3" y="13" width="18" height="6" rx="1"/><path d="M7 13 10 5M17 13l-3-8M10 5h4"/><path d="M12 13v6"/>'),
  helmet: PI('<path d="M4 16a8 8 0 0 1 16 0"/><path d="M2.5 16h19v2.5h-19z"/><path d="M10 8.5V6h4v2.5"/>'),
  clock: PI('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  wrench: PI('<path d="M14.5 6.5a4 4 0 0 0-5.3 5.2L4 17l3 3 5.3-5.2a4 4 0 0 0 5.2-5.3l-2.4 2.4-2.6-.6-.6-2.6 2.6-2.2Z"/>'),
  alert: PI('<path d="M12 3.5 2.5 20h19L12 3.5Z"/><path d="M12 10v4.5M12 17.2v.1"/>'),
  truck: PI('<path d="M2.5 7h11v9h-11zM13.5 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>'),
  check: PI('<path d="M5 3.5h10l4 4v13H5z"/><path d="m8.5 13.5 2.3 2.3 4.7-4.8"/>')
};

// ---------- Photos (emplacements remplaçables via site.json) ----------
export const photo = (key, { eager = false, cls = '', sizes = '(min-width: 1000px) 50vw, 100vw' } = {}) => {
  const im = site.images[key];
  if (!im.src) return `<div class="ph ${cls}" aria-hidden="true"><span class="ph-in"><svg class="ph-ico" viewBox="0 0 24 24"><path fill="currentColor" d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2v8.6l4-4 3 3 2.5-2.5L19 16.6V7H5Zm10.5 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/></svg><span>${esc(im.label)}</span></span></div>`;
  return `<figure class="photo ${cls}">
  <img src="${im.src}"${/-1600\.webp$/.test(im.src) ? ` srcset="${im.src.replace('-1600.webp', '-640.webp')} 640w, ${im.src.replace('-1600.webp', '-800.webp')} 800w, ${im.src} 1600w" sizes="${sizes}"` : ''} width="${im.w}" height="${im.h}" alt="${esc(im.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  ${im.illustrative ? '<figcaption class="fig-tag">Illustration non contractuelle</figcaption>' : ''}
</figure>`;
};

// ---------- Formulaire de devis → WhatsApp (sans backend) ----------
const TYPES = [
  ['minipelle', 'Mini-pelle'], ['engins', 'Autre engin de chantier'], ['nacelle', 'Nacelle / plateforme élévatrice'],
  ['compacteur', 'Compacteur / rouleau'], ['echafaudage', 'Échafaudage'], ['materiel', 'Poutres IPN / matériel de construction'],
  ['vehicules', 'Véhicule utilitaire'], ['nonroulant', 'Véhicule non roulant'], ['autre', 'Autre']
];
export const quoteForm = (svc = 'general', { title = 'Demande de devis', intro = '' } = {}) => {
  const pre = { minipelle: 'minipelle', nacelle: 'nacelle', engins: 'engins', materiel: 'materiel', vehicules: 'vehicules' }[svc] || '';
  return `
<section class="section quote" id="devis" aria-labelledby="devis-t">
  <div class="wrap quote-grid">
    <div class="quote-side">
      <p class="kicker">Devis par WhatsApp ou e-mail</p>
      <h2 id="devis-t" class="h2">${title}</h2>
      <p>${intro || 'Pas disponible au téléphone ? Décrivez votre transport : votre demande nous arrive structurée, par WhatsApp ou par e-mail, et nous la traitons dès que possible.'}</p>
      <ol class="quote-steps">
        <li><b>Remplissez</b> les informations que vous connaissez.</li>
        <li><b>Choisissez WhatsApp ou e-mail</b> : votre message s'ouvre, prêt à partir.</li>
        <li><b>Joignez vos photos</b> si besoin, puis <b>envoyez</b> depuis WhatsApp ou votre messagerie.</li>
      </ol>
      <p class="small">Aucune donnée n'est enregistrée par ce site : la demande ne part que lorsque vous l'envoyez vous-même depuis WhatsApp ou votre messagerie.</p>
    </div>
    <form class="qform" data-quote novalidate data-wa="${C.whatsapp}" data-email="${C.email}" data-svc="${svc}">
      <p class="qf-req"><span aria-hidden="true">*</span> Champs obligatoires</p>
      <fieldset>
        <legend>Le matériel</legend>
        <div class="qf-row">
          <div class="qf"><label for="qf-type">Type de matériel</label>
            <select id="qf-type" name="type"><option value="">Choisir…</option>${TYPES.map(([v, l]) => `<option value="${esc(l)}"${v === pre ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
          <div class="qf"><label for="qf-model">Marque, modèle ou description</label>
            <input id="qf-model" name="model" type="text" maxlength="160" autocomplete="off"></div>
        </div>
        <div class="qf-row">
          <div class="qf"><label for="qf-weight">Poids <span class="opt">(facultatif)</span></label>
            <input id="qf-weight" name="weight" type="text" maxlength="40" placeholder="ex. 2,5 t" autocomplete="off"></div>
          <div class="qf"><label for="qf-dims">Dimensions <span class="opt">(facultatif)</span></label>
            <input id="qf-dims" name="dims" type="text" maxlength="80" placeholder="L × l × h" autocomplete="off"></div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Le trajet</legend>
        <div class="qf-row">
          <div class="qf"><label for="qf-from">Lieu de chargement <span class="req" aria-hidden="true">*</span></label>
            <input id="qf-from" name="from" type="text" maxlength="160" required aria-required="true" aria-describedby="qf-from-err" placeholder="Ville ou adresse" autocomplete="off">
            <p class="qf-err" id="qf-from-err" hidden>Indiquez le lieu de chargement.</p></div>
          <div class="qf"><label for="qf-to">Lieu de livraison <span class="req" aria-hidden="true">*</span></label>
            <input id="qf-to" name="to" type="text" maxlength="160" required aria-required="true" aria-describedby="qf-to-err" placeholder="Ville ou adresse" autocomplete="off">
            <p class="qf-err" id="qf-to-err" hidden>Indiquez le lieu de livraison.</p></div>
        </div>
        <div class="qf qf-half"><label for="qf-date">Date souhaitée <span class="opt">(facultatif)</span></label>
          <input id="qf-date" name="date" type="date"></div>
      </fieldset>
      <fieldset>
        <legend>Vous</legend>
        <div class="qf-row">
          <div class="qf"><label for="qf-name">Nom ou société</label>
            <input id="qf-name" name="name" type="text" maxlength="120" autocomplete="organization"></div>
          <div class="qf"><label for="qf-phone">Téléphone <span class="opt">(pour vous rappeler)</span></label>
            <input id="qf-phone" name="phone" type="tel" maxlength="30" inputmode="tel" autocomplete="tel" placeholder="06 12 34 56 78"></div>
        </div>
        <div class="qf"><label for="qf-info">Informations complémentaires</label>
          <textarea id="qf-info" name="info" rows="3" maxlength="600" placeholder="Accès, horaires, engin roulant ou non…"></textarea></div>
      </fieldset>
      <div class="qf-actions">
        <button type="submit" name="via" value="whatsapp" class="btn btn-wa btn-lg">${ICON.wa}<span>Envoyer par WhatsApp</span></button>
        <button type="submit" name="via" value="email" class="btn btn-call btn-lg">${ICON.mail}<span>Envoyer par e-mail</span></button>
      </div>
      <p class="qf-note">Vous pourrez joindre vos photos directement dans WhatsApp ou dans votre e-mail avant l'envoi.</p>
      <p class="qf-copy">Pas de WhatsApp ni de messagerie configurée sur cet appareil ?
        <button type="button" class="linkbtn" data-copy="quote">Copier la demande</button> ·
        <button type="button" class="linkbtn" data-copy="email">Copier l'adresse e-mail</button></p>
      <div class="qf-status" role="status" aria-live="polite" data-quote-status></div>
    </form>
  </div>
</section>`;
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
const logo = (where) => {
  const L = site.logo;
  const h = where === 'footer' ? 72 : 64;
  const w = Math.round(L.width * h / L.height);
  return `<img src="${L.src}" srcset="${L.src} 1x, ${L.src2x} 2x" width="${w}" height="${h}" alt="${esc(site.name)} — ${esc(site.tagline)}" class="logo-img"${where === 'header' ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
};

// ---------- Navigation ----------
export const SERVICES_NAV = [
  { path: '/transport-engins-chantier', label: 'Engins de chantier' },
  { path: '/transport-mini-pelle', label: 'Mini-pelles' },
  { path: '/transport-nacelle', label: 'Nacelles élévatrices' },
  { path: '/transport-materiel-btp', label: 'Matériel BTP' },
  { path: '/transport-vehicules', label: 'Véhicules' }
];
const MAIN_NAV = [
  { path: '/#devis', label: 'Devis' },
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
      <a href="/" class="brand brand-card" aria-label="${esc(site.name)} — accueil">${logo('footer')}</a>
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
export const documentHtml = ({ page, body, assets, jsonld, noindexAll = false }) => {
  const url = site.url + (page.path === '/' ? '/' : page.path);
  const og = site.url + '/assets/img/og-imd-transport.png';
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${noindexAll ? '<meta name="robots" content="noindex, nofollow">' : page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
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
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/barlow-condensed-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
${page.heroImg && site.images[page.heroImg].src ? (() => { const s = site.images[page.heroImg].src; return `<link rel="preload" as="image" href="${s}" imagesrcset="${s.replace('-1600.webp', '-640.webp')} 640w, ${s.replace('-1600.webp', '-800.webp')} 800w, ${s} 1600w" imagesizes="${page.path === '/' ? '(min-width: 1000px) 560px, 100vw' : '(min-width: 1000px) 50vw, 100vw'}" fetchpriority="high">\n`; })() : ''}<link rel="stylesheet" href="${assets.css}">
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
