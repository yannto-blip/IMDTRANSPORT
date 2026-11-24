// Contenu des pages. Chaque page : path, title, description, h1, crumbs, service, faq, body().
// Pour modifier un texte : éditer ce fichier puis lancer `node build.mjs`.
import { site, esc, ctaPair, mailLink, photo, quoteForm, plateSchema, idfMap, breadcrumb, ICON, PICTO, SERVICES_NAV } from './layout.mjs';

const S = site.specs;
const DEPS = site.departments;
const PREP = { '75': 'à Paris', '77': 'en Seine-et-Marne', '78': 'dans les Yvelines', '91': 'dans l\'Essonne', '92': 'dans les Hauts-de-Seine', '93': 'en Seine-Saint-Denis', '94': 'dans le Val-de-Marne', '95': 'dans le Val-d\'Oise' };
const FEAS = 'La faisabilité dépend des caractéristiques du chargement (poids, dimensions, répartition) et des conditions d\'accès, de chargement et de transport.';

// ---------- FAQ ----------
export const FAQ = {
  poids: { q: 'Quel poids maximum pouvez-vous transporter ?', a: `Jusqu'à 16 tonnes, sous réserve de compatibilité du chargement et de faisabilité. ${FEAS}` },
  dims: { q: 'Quelles sont les dimensions de vos plateaux ?', a: '10 mètres de longueur utile et 2,48 mètres de largeur utile, soit une surface utile indicative de 24,8 m². Ces dimensions ne valent pas autorisation de transporter tout chargement de taille équivalente.' },
  minipelle: { q: 'Pouvez-vous transporter une mini-pelle ou une nacelle ?', a: 'Oui, selon les dimensions, le poids et les conditions de chargement de l\'engin.' },
  nonroulant: { q: 'Pouvez-vous transporter un véhicule non roulant ?', a: 'Oui, sous réserve de faisabilité. Nos camions disposent de rampes de chargement et d\'un treuil.' },
  grue: { q: 'Disposez-vous d\'une grue embarquée ?', a: 'Non. Nos véhicules sont équipés de rampes de chargement et d\'un treuil, sans grue embarquée.' },
  nuit: { q: 'Travaillez-vous de nuit et le samedi ?', a: 'Des transports peuvent être organisés de jour comme de nuit, du lundi au samedi, selon les disponibilités et dans le respect de la réglementation.' },
  assurance: { q: 'Les marchandises sont-elles assurées ?', a: 'Oui, les marchandises transportées sont assurées selon les conditions et limites de notre contrat d\'assurance transport.' },
  regulier: { q: 'Proposez-vous des transports réguliers pour les professionnels ?', a: 'Oui. Nous adaptons l\'organisation de nos tournées aux besoins récurrents de nos clients : loueurs de matériel, entreprises du BTP, artisans.' },
  france: { q: 'Intervenez-vous en dehors de l\'Île-de-France ?', a: 'Oui, des transports ponctuels dans toute la France métropolitaine peuvent être étudiés sur demande.' },
  securite: { q: 'Quelle importance IMD Transport accorde-t-elle à la sécurité ?', a: 'La sécurité est notre priorité. Nos chauffeurs sont régulièrement sensibilisés aux risques liés au transport, aux opérations de chargement et de déchargement et aux interventions sur chantier. Chaque chargement est sécurisé et arrimé avant le départ, dans le respect des consignes de sécurité du chantier et des temps de conduite et de repos.' },
  devis: { q: 'Comment obtenir un devis ?', a: 'Contactez-nous directement par téléphone ou WhatsApp en précisant le matériel, les lieux de départ et de livraison ainsi que la date souhaitée. Vous pouvez joindre des photos ou la fiche technique de l\'engin.' }
};
const ALL_FAQ = Object.values(FAQ);

const faqBlock = (items, { title = 'Questions fréquentes', id = 'faq' } = {}) => `
<section class="section" aria-labelledby="${id}-t">
  <div class="wrap narrow">
    <h2 id="${id}-t" class="h2">${title}</h2>
    <div class="faq">
      ${items.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
    </div>
  </div>
</section>`;

const contactBlock = (svc = 'general', loc = 'contact_final', title = 'Un transport à organiser ?') => `
<section class="section contact-final" aria-labelledby="cf-${loc}">
  <div class="wrap cf">
    <div>
      <h2 id="cf-${loc}" class="h2">${title}</h2>
      <p class="lead">Décrivez-nous le matériel, le lieu de départ, le lieu de livraison et la date souhaitée. Vous échangez directement avec un interlocuteur qui connaît ses camions.</p>
    </div>
    <div class="cf-actions">
      ${ctaPair(loc, svc, { size: 'btn-lg' })}
      <p class="cf-mail"><a href="${svc === 'general' && loc === 'contact_page' ? '/#devis' : '#devis'}">Formulaire de devis</a> · Par e-mail : ${mailLink(loc)}</p>
    </div>
  </div>
</section>`;

const pageHero = (p, figKey, intro) => `
<section class="phero">
  <div class="wrap">
    ${breadcrumb(p.crumbs)}
    <div class="phero-grid">
      <div>
        <h1 class="h1">${p.h1}</h1>
        <p class="lead">${intro}</p>
        ${ctaPair('page_hero', p.service)}
        <a class="link-arrow quote-link" href="${p.service === 'general' ? '/#devis' : '#devis'}">Demander un devis via le formulaire ${ICON.arrow}</a>
      </div>
      ${photo(figKey, { eager: true, cls: 'phero-fig' })}
    </div>
  </div>
</section>`;

const specStrip = () => `
<ul class="spec-strip" aria-label="Caractéristiques des plateaux">
  <li><strong>16 t</strong><span>charge maximale annoncée</span></li>
  <li><strong>10 m</strong><span>longueur utile</span></li>
  <li><strong>2,48 m</strong><span>largeur utile</span></li>
  <li><strong>Rampes + treuil</strong><span>sans grue embarquée</span></li>
</ul>`;

const related = (exclude) => `
<section class="section bg-light" aria-labelledby="rel-t">
  <div class="wrap">
    <h2 id="rel-t" class="h3">Nos autres prestations</h2>
    <ul class="rel-list">
      ${SERVICES_NAV.filter(n => n.path !== exclude).map(n => `<li><a href="${n.path}">${n.label}${ICON.arrow}</a></li>`).join('')}
      ${exclude !== '/transport-professionnels' ? `<li><a href="/transport-professionnels">Solutions professionnelles${ICON.arrow}</a></li>` : ''}
    </ul>
  </div>
</section>`;

// ---------- Sécurité ----------
const SAFETY = [
  ['people', 'Sensibilisation régulière des chauffeurs', 'Risques du transport, du chargement, du déchargement et des interventions sur chantier.'],
  ['strap', 'Sécurisation et arrimage des chargements', 'Chaque engin ou matériel est calé et arrimé sur le plateau avant le départ.'],
  ['helmet', 'Respect des consignes de chantier', 'Nos chauffeurs appliquent les règles de sécurité propres à chaque site.'],
  ['clock', 'Temps de conduite et de repos', 'Une organisation des tournées qui respecte la réglementation.'],
  ['wrench', 'Véhicules et équipements surveillés', 'Vigilance sur l\'état des camions, des rampes, du treuil et des moyens d\'arrimage.'],
  ['alert', 'Prévention des risques professionnels', 'Anticiper les risques pour protéger nos équipes, vos équipes et votre matériel.']
];
const safetySection = () => `
<section class="section safety" id="securite" aria-labelledby="safety-t">
  <div class="wrap">
    <div class="safety-head">
      <div>
        <p class="kicker kicker-light">Sécurité</p>
        <h2 id="safety-t" class="h2">La sécurité n'est pas une option. C'est notre priorité.</h2>
      </div>
      <p class="safety-lead">Chez IMD Transport, la sécurité fait partie intégrante de notre métier. Nos chauffeurs sont régulièrement sensibilisés aux risques liés au transport, aux opérations de chargement et de déchargement ainsi qu'aux interventions sur chantier.</p>
    </div>
    <ul class="safety-grid">
      ${SAFETY.map(([ic, t, d]) => `<li><span class="safety-ic">${PICTO[ic]}</span><h3 class="h4">${t}</h3><p>${d}</p></li>`).join('')}
    </ul>
    <p class="safety-sign">Chaque transport. Chaque chantier. La même exigence.</p>
  </div>
</section>`;
const reassure = () => `
<ul class="reassure" aria-label="Nos engagements">
  <li>${PICTO.shield}<span>Sécurité prioritaire</span></li>
  <li>${PICTO.truck}<span>Flotte en propre</span></li>
  <li>${PICTO.check}<span>Marchandises assurées</span></li>
</ul>`;

const crumbs = (...items) => [{ name: 'Accueil', path: '/' }, ...items];

// ---------- Cartes prestations (accueil) ----------
const CARDS = [
  { href: '/transport-mini-pelle', img: 'minipelle', t: 'Engins BTP et mini-pelles', d: 'Mini-pelles et engins de chantier compatibles avec nos plateaux.' },
  { href: '/transport-nacelle', img: 'nacelle', t: 'Nacelles et plateformes élévatrices', d: 'Nacelles articulées ou à ciseaux, chargées par rampes.' },
  { href: '/transport-engins-chantier#compacteurs', img: 'compacteur', t: 'Compacteurs', d: 'Rouleaux compresseurs et compacteurs, arrimés et calés.' },
  { href: '/transport-materiel-btp', img: 'materiel', t: 'Matériel de chantier', d: 'Échafaudages, poutres IPN, matériel de construction.' },
  { href: '/transport-vehicules', img: 'vehicule', t: 'Véhicules utilitaires', d: 'Utilitaires, véhicules roulants ou non roulants selon faisabilité.' }
];

const WHY = [
  ['Flotte en propre', 'Nos camions, entretenus et exploités par nos soins.'],
  ['Nos propres chauffeurs', 'Des chauffeurs de l\'entreprise, habitués au matériel de chantier.'],
  ['Marchandises assurées', 'Selon les conditions et limites de notre contrat d\'assurance.'],
  ['Organisation flexible', 'De jour comme de nuit, du lundi au samedi, selon disponibilités.'],
  ['Interlocuteur direct', 'Vous parlez à celui qui organise le transport, sans intermédiaire.'],
  ['Ponctuel ou régulier', 'Un transfert unique ou des tournées adaptées à vos besoins.']
];

// =====================================================================
export const pages = [
  // ------------------------------------------------------------- ACCUEIL
  {
    path: '/', file: 'index.html',
    title: 'Transport d\'engins et matériel BTP sur camion plateau | IMD Transport',
    description: 'Transport de mini-pelles, nacelles, compacteurs, matériel de chantier et véhicules sur poids lourds plateau en Île-de-France. Jusqu\'à 16 t, plateau de 10 m.',
    h1: 'Vous construisez. Nous transportons.',
    bodyClass: 'home', service: 'general', faq: ALL_FAQ, heroImg: 'hero',
    body: p => `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-txt">
      <p class="kicker">Transport sur poids lourds plateau en Île-de-France</p>
      <h1 class="h1 hero-h1">Vous construisez. <span class="accent">Nous transportons.</span></h1>
      <p class="lead">Transport d'engins, de matériel BTP et de véhicules sur camion plateau en Île-de-France, avec nos camions et nos chauffeurs.</p>
      ${ctaPair('hero', 'general', { size: 'btn-lg' })}
      <a class="link-arrow quote-link" href="#devis">Pas le temps d'appeler ? Demandez un devis par formulaire ${ICON.arrow}</a>
      ${reassure()}
    </div>
    <div class="hero-media">${photo('hero', { eager: true, cls: 'hero-photo', sizes: '(min-width: 1000px) 560px, 100vw' })}</div>
  </div>
</section>

<section class="keyfigs" aria-label="Chiffres clés">
  <ul class="wrap kf-list">
    ${site.keyfigs.map(k => `<li><strong class="kf-v">${esc(k.value)}</strong><span class="kf-l">${esc(k.label)}</span><span class="kf-n">${esc(k.note)}</span></li>`).join('')}
  </ul>
</section>

<section class="refs" aria-labelledby="refs-t">
  <div class="wrap refs-in">
    <h2 id="refs-t" class="refs-h">Ils nous font confiance</h2>
    <ul class="refs-list">
      ${site.references.map(r => `<li>${r.logo ? `<img src="${r.logo}" alt="${esc(r.name)}" width="${Math.round(r.w * r.display / r.h)}" height="${r.display}" loading="lazy" decoding="async">` : esc(r.name)}</li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" id="prestations" aria-labelledby="presta-t">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker">Prestations</p>
      <h2 id="presta-t" class="h2">Que souhaitez-vous transporter ?</h2>
    </div>
    <ul class="cards">
      ${CARDS.map(c => `<li class="card">
        <a href="${c.href}" class="card-link">
          ${photo(c.img, { cls: 'card-photo', sizes: '(min-width: 1040px) 400px, (min-width: 640px) 50vw, 100vw' })}
          <span class="card-body"><span class="card-t">${c.t}</span><span class="card-d">${c.d}</span><span class="card-more">Voir la prestation ${ICON.arrow}</span></span>
        </a></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section bg-light" aria-labelledby="moyens-t">
  <div class="wrap split">
    <div>
      <p class="kicker">Nos moyens techniques</p>
      <h2 id="moyens-t" class="h2">Des porteurs plateau pensés pour le chantier</h2>
      <p>Poids lourds porteurs plateau ${esc(S.brands)}, équipés de rampes de chargement et d'un treuil. Pas de grue embarquée : le chargement se fait par roulage ou treuillage.</p>
      ${specStrip()}
      <p class="small">${FEAS}</p>
      <p><a class="link-arrow" href="/nos-moyens-techniques">Toutes les caractéristiques ${ICON.arrow}</a></p>
    </div>
    ${plateSchema()}
  </div>
</section>

${safetySection()}

<section class="section why" aria-labelledby="why-t">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker">Pourquoi IMD Transport</p>
      <h2 id="why-t" class="h2">Vos engins. Nos camions. Nos chauffeurs.</h2>
    </div>
    <ul class="why-grid">
      ${WHY.map(([t, d], i) => `<li><span class="why-n" aria-hidden="true"></span><h3 class="h4">${t}</h3><p>${d}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section bg-light" aria-labelledby="carte-titre">
  <div class="wrap split split-map">
    <div>
      <p class="kicker">Zones d'intervention</p>
      <h2 id="carte-titre" class="h2">Toute l'Île-de-France, et au-delà.</h2>
      <p>Depuis ${esc(site.baseCity)}, nous intervenons dans les huit départements franciliens.</p>
      <ul class="dep-list">${DEPS.map(d => `<li><a href="/zones-intervention#dep-${d.code}"><b>${d.code}</b> ${esc(d.name)}</a></li>`).join('')}</ul>
      <p class="small">Sur demande, nous réalisons également des transports ponctuels dans toute la France métropolitaine.</p>
    </div>
    ${idfMap()}
  </div>
</section>

<section class="section pros" aria-labelledby="pros-t">
  <div class="wrap pros-in">
    <div>
      <p class="kicker kicker-light">Solutions professionnelles</p>
      <h2 id="pros-t" class="h2">Loueurs, BTP, artisans : un transporteur pour vos besoins réguliers</h2>
      <p>Transferts entre agences et chantiers, livraisons et reprises de matériel loué, tournées récurrentes : nous construisons avec vous une organisation adaptée à votre activité.</p>
      <p><a class="link-arrow link-light" href="/transport-professionnels">Découvrir les solutions pros ${ICON.arrow}</a></p>
    </div>
    <div class="pros-cta">
      <p class="pros-cta-t">Parlons de vos besoins récurrents</p>
      ${ctaPair('pros_home', 'pros')}
    </div>
  </div>
</section>

${quoteForm('general')}
${faqBlock(ALL_FAQ)}
${contactBlock('general', 'contact_final')}`
  },

  // ------------------------------------------------------------- ENGINS
  {
    path: '/transport-engins-chantier', heroImg: 'minipelle', file: 'transport-engins-chantier.html',
    title: 'Transport d\'engins de chantier en Île-de-France | IMD Transport',
    description: 'Transport et transfert d\'engins de chantier sur camion plateau : mini-pelles, nacelles, compacteurs, rouleaux. Jusqu\'à 16 t, plateau de 10 m, rampes et treuil.',
    h1: 'Transport d\'engins de chantier en Île-de-France',
    crumbs: crumbs({ name: 'Transport d\'engins de chantier', path: '/transport-engins-chantier' }),
    service: 'engins', serviceName: 'Transport d\'engins de chantier', faq: [FAQ.poids, FAQ.grue, FAQ.nuit, FAQ.devis],
    body: p => `
${pageHero(p, 'minipelle', 'Transferts d\'engins entre dépôts, agences de location et chantiers, sur nos poids lourds porteurs plateau. Chargement par rampes ou treuil, arrimage par nos chauffeurs.')}
<section class="section">
  <div class="wrap prose-grid">
    <div class="prose">
      <h2 class="h2">Les engins que nous transportons</h2>
      <p>Nous transportons les engins de chantier compatibles avec les capacités de nos véhicules : ${S.maxLoad} et un plateau de ${S.deckLength} sur ${S.deckWidth}.</p>
      <ul class="checks">
        <li><a href="/transport-mini-pelle">Mini-pelles</a> et engins de terrassement compacts</li>
        <li><a href="/transport-nacelle">Nacelles élévatrices et plateformes élévatrices</a></li>
        <li id="compacteurs">Rouleaux compresseurs et compacteurs</li>
        <li>Autres engins de chantier compatibles avec nos plateaux</li>
      </ul>
      <h3 class="h3">Transfert d'engins de chantier : comment ça se passe</h3>
      <ol class="steps">
        <li><b>Vous nous décrivez l'engin</b> : modèle, poids, dimensions, adresses et date. Une photo ou la fiche technique suffit souvent.</li>
        <li><b>Nous vérifions la faisabilité</b> : poids, gabarit, accès au site de chargement et de livraison.</li>
        <li><b>Nos chauffeurs chargent et arriment</b> l'engin par les rampes ou au treuil, en sécurisant le chargement avant le départ.</li>
        <li><b>Livraison sur le lieu convenu</b>, de jour comme de nuit selon disponibilités.</li>
      </ol>
      <h3 class="h3" id="compacteurs-detail">Transport de compacteur et de rouleau compresseur</h3>
      <p>Compacteurs tandem, rouleaux monocylindre ou compacteurs de tranchée : ces engins lourds et compacts se chargent par les rampes et sont calés puis arrimés sur le plateau. Indiquez-nous le modèle et le poids en ordre de marche.</p>
      <p class="note">${FEAS} Nous ne réalisons pas de transport exceptionnel ni de prestation de porte-char.</p>
    </div>
    <aside class="aside-card">
      <p class="aside-t">Caractéristiques</p>
      ${specStrip()}
      <a class="link-arrow" href="/nos-moyens-techniques">Moyens techniques ${ICON.arrow}</a>
    </aside>
  </div>
</section>
${quoteForm(p.service)}
${faqBlock(p.faq)}
${related(p.path)}
${contactBlock(p.service, 'contact_page', 'Un engin à transférer ?')}`
  },

  // ------------------------------------------------------------- MINI-PELLE
  {
    path: '/transport-mini-pelle', heroImg: 'minipelle', file: 'transport-mini-pelle.html',
    title: 'Transport de mini-pelle sur camion plateau — Île-de-France | IMD Transport',
    description: 'Transport de mini-pelle en Île-de-France sur poids lourd plateau avec rampes et treuil. Devis par téléphone ou WhatsApp selon modèle, poids et adresses.',
    h1: 'Transport de mini-pelle',
    crumbs: crumbs({ name: 'Engins de chantier', path: '/transport-engins-chantier' }, { name: 'Transport de mini-pelle', path: '/transport-mini-pelle' }),
    service: 'minipelle', serviceName: 'Transport de mini-pelle', faq: [FAQ.minipelle, FAQ.poids, FAQ.devis, FAQ.nuit],
    body: p => `
${pageHero(p, 'minipelle', 'Livraison et reprise de mini-pelles entre agences de location, dépôts et chantiers en Île-de-France, sur nos porteurs plateau équipés de rampes.')}
<section class="section">
  <div class="wrap prose-grid">
    <div class="prose">
      <h2 class="h2">Une mini-pelle chargée par rampes, arrimée par nos chauffeurs</h2>
      <p>La mini-pelle monte sur le plateau par les rampes arrière. Nos chauffeurs la positionnent, la calent et l'arriment avant le départ. Le treuil permet d'assister le chargement si nécessaire.</p>
      <h3 class="h3">Ce dont nous avons besoin pour le devis</h3>
      <ul class="checks">
        <li>Modèle ou poids de la mini-pelle (et accessoires éventuels : godets, BRH)</li>
        <li>Adresse de chargement et adresse de livraison</li>
        <li>Date et créneau souhaités</li>
        <li>Contraintes d'accès connues : rue étroite, hauteur limitée, horaires de chantier</li>
      </ul>
      <h3 class="h3">Prix d'un transport de mini-pelle</h3>
      <p>Le prix dépend de la distance, du poids de l'engin, des conditions d'accès et du créneau. Nous établissons un devis au cas par cas : appelez-nous ou envoyez les informations sur WhatsApp.</p>
      <p class="note">${FEAS}</p>
    </div>
    <aside class="aside-card">
      <p class="aside-t">Nos plateaux</p>
      ${specStrip()}
    </aside>
  </div>
</section>
${quoteForm(p.service)}
${faqBlock(p.faq)}
${related(p.path)}
${contactBlock(p.service, 'contact_page', 'Une mini-pelle à transporter ?')}`
  },

  // ------------------------------------------------------------- NACELLE
  {
    path: '/transport-nacelle', heroImg: 'nacelle', file: 'transport-nacelle.html',
    title: 'Transport de nacelle élévatrice en Île-de-France | IMD Transport',
    description: 'Transport de nacelles élévatrices à ciseaux et plateformes élévatrices sur camion plateau en Île-de-France. Chargement par rampes, arrimage sécurisé.',
    h1: 'Transport de nacelle élévatrice',
    crumbs: crumbs({ name: 'Engins de chantier', path: '/transport-engins-chantier' }, { name: 'Transport de nacelle', path: '/transport-nacelle' }),
    service: 'nacelle', serviceName: 'Transport de nacelle élévatrice', faq: [FAQ.minipelle, FAQ.grue, FAQ.regulier, FAQ.devis],
    body: p => `
${pageHero(p, 'nacelle', 'Nacelles articulées ou à ciseaux, plateformes élévatrices mobiles de personnes : nous les livrons sur vos chantiers et les reprenons en fin de location.')}
<section class="section">
  <div class="wrap prose-grid">
    <div class="prose">
      <h2 class="h2">Livraison et reprise de nacelles</h2>
      <p>Les nacelles et plateformes élévatrices sont chargées par roulage sur les rampes, puis arrimées sur le plateau. Nos véhicules n'ont pas de grue embarquée.</p>
      <ul class="checks">
        <li>Nacelles élévatrices articulées et à ciseaux</li>
        <li>Plateformes élévatrices compatibles avec nos plateaux</li>
        <li>Transferts entre agences de location et chantiers</li>
        <li>Livraisons de jour comme de nuit, du lundi au samedi, selon disponibilités</li>
      </ul>
      <p class="note">${FEAS} Indiquez-nous le modèle, le poids et les dimensions repliées de la machine.</p>
    </div>
    <aside class="aside-card">
      <p class="aside-t">Nos plateaux</p>
      ${specStrip()}
    </aside>
  </div>
</section>
${quoteForm(p.service)}
${faqBlock(p.faq)}
${related(p.path)}
${contactBlock(p.service, 'contact_page', 'Une nacelle à livrer ?')}`
  },

  // ------------------------------------------------------------- MATÉRIEL BTP
  {
    path: '/transport-materiel-btp', heroImg: 'materiel', file: 'transport-materiel-btp.html',
    title: 'Transport de matériel BTP : échafaudages, poutres IPN | IMD Transport',
    description: 'Transport de matériel de chantier en Île-de-France sur plateau de 10 m : échafaudages, poutres IPN, matériel de construction. Transport ponctuel ou régulier.',
    h1: 'Transport de matériel de chantier et BTP',
    crumbs: crumbs({ name: 'Transport de matériel BTP', path: '/transport-materiel-btp' }),
    service: 'materiel', serviceName: 'Transport de matériel de chantier', faq: [FAQ.dims, FAQ.poids, FAQ.regulier, FAQ.devis],
    body: p => `
${pageHero(p, 'materiel', 'Échafaudages, poutres IPN, matériel de construction et équipements de chantier, transportés sur un plateau de 10 mètres de longueur utile.')}
<section class="section">
  <div class="wrap prose-grid">
    <div class="prose">
      <h2 class="h2">Le matériel que nous transportons</h2>
      <ul class="checks">
        <li><b>Échafaudages</b> : cadres, planchers, garde-corps</li>
        <li><b>Poutres IPN</b> et profilés métalliques, dans la limite de la longueur utile</li>
        <li><b>Matériel de construction</b> et équipements de chantier</li>
        <li>Autres matériels compatibles avec les capacités de nos plateaux</li>
      </ul>
      <h3 class="h3">Transferts entre chantiers</h3>
      <p>Vous terminez un chantier et en ouvrez un autre ? Nous transférons votre matériel d'un site à l'autre, ou depuis votre dépôt, en une ou plusieurs rotations selon le volume.</p>
      <p class="note">${FEAS}</p>
    </div>
    <aside class="aside-card">
      <p class="aside-t">Nos plateaux</p>
      ${specStrip()}
    </aside>
  </div>
</section>
${quoteForm(p.service)}
${faqBlock(p.faq)}
${related(p.path)}
${contactBlock(p.service, 'contact_page', 'Du matériel à déplacer ?')}`
  },

  // ------------------------------------------------------------- VÉHICULES
  {
    path: '/transport-vehicules', heroImg: 'vehicule', file: 'transport-vehicules.html',
    title: 'Transport de véhicule utilitaire ou non roulant sur plateau | IMD Transport',
    description: 'Transport de véhicules utilitaires, roulants ou non roulants (sous réserve de faisabilité) sur poids lourd plateau avec rampes et treuil, en Île-de-France.',
    h1: 'Transport de véhicules utilitaires',
    crumbs: crumbs({ name: 'Transport de véhicules', path: '/transport-vehicules' }),
    service: 'vehicules', serviceName: 'Transport de véhicules', faq: [FAQ.nonroulant, FAQ.grue, FAQ.france, FAQ.devis],
    body: p => `
${pageHero(p, 'vehicule', 'Véhicules utilitaires et véhicules roulants, ou non roulants sous réserve de faisabilité, transportés sur nos poids lourds plateau.')}
<section class="section">
  <div class="wrap prose-grid">
    <div class="prose">
      <h2 class="h2">Utilitaires, roulants et non roulants</h2>
      <ul class="checks">
        <li><b>Véhicules utilitaires</b> : fourgons, camionnettes</li>
        <li><b>Véhicules roulants</b> chargés par les rampes</li>
        <li><b>Véhicules non roulants</b>, sous réserve de faisabilité, chargés au treuil</li>
      </ul>
      <p>Le transport de véhicules se fait sur le même type de porteur plateau que nos autres prestations. Il s'agit d'un transport planifié : nous ne proposons pas de dépannage ou de remorquage d'urgence.</p>
      <p class="note">${FEAS} Précisez-nous le modèle, l'état du véhicule et s'il peut rouler ou être dirigé.</p>
    </div>
    <aside class="aside-card">
      <p class="aside-t">Équipement</p>
      ${specStrip()}
    </aside>
  </div>
</section>
${quoteForm(p.service)}
${faqBlock(p.faq)}
${related(p.path)}
${contactBlock(p.service, 'contact_page', 'Un véhicule à transporter ?')}`
  },

  // ------------------------------------------------------------- PROS
  {
    path: '/transport-professionnels', heroImg: 'pros', file: 'transport-professionnels.html',
    title: 'Transport régulier de matériel BTP pour professionnels | IMD Transport',
    description: 'Transport régulier et sécurisé pour loueurs de matériel, entreprises du BTP et des travaux publics : tournées, transferts entre chantiers, arrimage maîtrisé.',
    h1: 'Solutions de transport pour les professionnels',
    crumbs: crumbs({ name: 'Professionnels', path: '/transport-professionnels' }),
    service: 'pros', serviceName: 'Transport régulier de matériel pour professionnels', faq: [FAQ.securite, FAQ.regulier, FAQ.nuit, FAQ.assurance, FAQ.devis],
    body: p => `
${pageHero(p, 'pros', 'Loueurs de matériel, entreprises du bâtiment et des travaux publics, artisans, gestionnaires de flottes : nous organisons vos transports ponctuels et réguliers.')}
<section class="section">
  <div class="wrap">
    <h2 class="h2">Pour qui ?</h2>
    <ul class="why-grid">
      <li><h3 class="h4">Loueurs de matériel</h3><p>Livraisons et reprises de matériel loué, transferts entre agences.</p></li>
      <li><h3 class="h4">Travaux publics</h3><p>Transferts d'engins entre dépôts et chantiers.</p></li>
      <li><h3 class="h4">Entreprises du bâtiment</h3><p>Matériel, échafaudages et engins compacts sur vos chantiers.</p></li>
      <li><h3 class="h4">Artisans et constructeurs</h3><p>Transport ponctuel de matériel et d'engins.</p></li>
      <li><h3 class="h4">Gestionnaires de flottes</h3><p>Transport de véhicules utilitaires.</p></li>
      <li><h3 class="h4">Besoins récurrents</h3><p>Tournées organisées selon vos volumes et vos horaires.</p></li>
    </ul>
  </div>
</section>
<section class="section bg-light">
  <div class="wrap prose-grid">
    <div class="prose">
      <h2 class="h2">Une organisation adaptée à votre activité</h2>
      <p>Avec une flotte en propre et nos propres chauffeurs, nous adaptons l'organisation de nos tournées à vos besoins : créneaux de livraison, transports de nuit selon disponibilités, transferts répétés entre vos sites.</p>
      <ul class="checks">
        <li>La sécurité comme priorité : chauffeurs régulièrement sensibilisés, chargements arrimés, consignes de vos chantiers respectées</li>
        <li>Un interlocuteur direct pour planifier</li>
        <li>Transport ponctuel ou régulier</li>
        <li>Transferts de matériel entre chantiers</li>
        <li>Marchandises assurées selon les conditions et limites de notre contrat</li>
      </ul>
    </div>
    <aside class="aside-card">
      <p class="aside-t">Échangeons sur vos besoins</p>
      <p>Volumes, fréquences, sites : un appel suffit pour poser les bases.</p>
      ${ctaPair('pros_aside', 'pros')}
    </aside>
  </div>
</section>
<section class="section" aria-labelledby="pros-safety-t">
  <div class="wrap split">
    <div>
      <p class="kicker">Sécurité</p>
      <h2 id="pros-safety-t" class="h2">Un transporteur qui partage vos exigences de sécurité</h2>
      <p>Sur vos chantiers comme dans vos agences, nos chauffeurs interviennent dans le respect de vos consignes. Ils sont régulièrement sensibilisés aux risques liés au chargement, au déchargement et à la circulation sur site.</p>
      <p>Pour un loueur ou une entreprise de travaux publics, c'est l'assurance d'un matériel livré sécurisé, d'une intervention maîtrisée et d'une prévention des risques prise au sérieux.</p>
    </div>
    <ul class="safety-mini">
      ${SAFETY.slice(0, 4).map(([ic, t, d]) => `<li><span class="safety-ic">${PICTO[ic]}</span><span><b>${t}</b><br>${d}</span></li>`).join('')}
    </ul>
  </div>
</section>
${quoteForm(p.service, { title: 'Décrivez votre besoin' })}
${faqBlock(p.faq)}
${contactBlock(p.service, 'contact_page', 'Un besoin régulier ?')}`
  },

  // ------------------------------------------------------------- MOYENS
  {
    path: '/nos-moyens-techniques', heroImg: 'plateau', file: 'nos-moyens-techniques.html',
    title: 'Camion plateau 16 tonnes, 10 mètres : nos moyens techniques | IMD Transport',
    description: 'Porteurs plateau DAF et Iveco : plateau de 10 m × 2,48 m, jusqu\'à 16 tonnes, rampes, treuil et arrimage sécurisé des chargements. Sans grue embarquée.',
    h1: 'Nos moyens techniques',
    crumbs: crumbs({ name: 'Moyens techniques', path: '/nos-moyens-techniques' }),
    service: 'general', faq: [FAQ.poids, FAQ.dims, FAQ.grue, FAQ.securite, FAQ.nonroulant],
    body: p => `
${pageHero(p, 'plateau', 'Des poids lourds porteurs plateau DAF et Iveco, équipés de rampes et d\'un treuil, conduits par nos propres chauffeurs.')}
<section class="section">
  <div class="wrap">
    <h2 class="h2">Caractéristiques des plateaux</h2>
    <div class="table-wrap">
      <table class="spec-table">
        <caption class="sr">Caractéristiques techniques des véhicules</caption>
        <tbody>
          <tr><th scope="row">Type de véhicule</th><td>Poids lourds porteurs plateau</td></tr>
          <tr><th scope="row">Marques</th><td>${esc(S.brands)}</td></tr>
          <tr><th scope="row">Longueur utile du plateau</th><td>${S.deckLength}</td></tr>
          <tr><th scope="row">Largeur utile</th><td>${S.deckWidth}</td></tr>
          <tr><th scope="row">Surface utile indicative</th><td>${S.deckArea}</td></tr>
          <tr><th scope="row">Charge maximale annoncée</th><td>${S.maxLoad}</td></tr>
          <tr><th scope="row">Équipements</th><td>Rampes de chargement, treuil</td></tr>
          <tr><th scope="row">Grue embarquée</th><td>Non</td></tr>
          <tr><th scope="row">Assurance</th><td>Marchandises transportées assurées selon les conditions et limites du contrat</td></tr>
          <tr><th scope="row">Amplitude</th><td>${esc(S.schedule)}</td></tr>
        </tbody>
      </table>
    </div>
    <p class="note">${FEAS} Les dimensions du plateau ne valent pas autorisation de transporter tout chargement de taille équivalente.</p>
  </div>
</section>
<section class="section bg-light">
  <div class="wrap split">
    <div>
      <h2 class="h2">Camion plateau 10 mètres</h2>
      <p>Un plateau long permet de charger un engin avec ses accessoires, des poutres IPN ou des échafaudages en une seule rotation, dans la limite de la charge et des règles d'arrimage.</p>
      <h3 class="h3">Rampes et treuil, sans grue</h3>
      <p>Les engins roulants montent par les rampes. Le treuil assiste le chargement des véhicules non roulants, sous réserve de faisabilité. Nos véhicules ne disposent pas de grue embarquée : le matériel à lever doit pouvoir être chargé par un moyen de levage présent sur site.</p>
      <h3 class="h3">Sécurité du chargement et du transport</h3>
      <p>Avant chaque départ, le chargement est calé et arrimé sur le plateau. Nos chauffeurs, régulièrement sensibilisés aux risques du chargement et du déchargement, restent vigilants sur l'état des véhicules, des rampes, du treuil et des moyens d'arrimage.</p>
    </div>
    ${plateSchema()}
  </div>
</section>
${faqBlock(p.faq)}
${contactBlock('general', 'contact_page')}`
  },

  // ------------------------------------------------------------- ZONES
  {
    path: '/zones-intervention', file: 'zones-intervention.html',
    title: 'Zones d\'intervention : toute l\'Île-de-France et au-delà | IMD Transport',
    description: 'Transport d\'engins et de matériel BTP dans les 8 départements d\'Île-de-France : Paris, 77, 78, 91, 92, 93, 94, 95. Transports ponctuels en France métropolitaine.',
    h1: 'Toute l\'Île-de-France, et au-delà.',
    crumbs: crumbs({ name: 'Zones d\'intervention', path: '/zones-intervention' }),
    service: 'general', faq: [FAQ.france, FAQ.nuit, FAQ.devis],
    body: p => `
<section class="phero">
  <div class="wrap">
    ${breadcrumb(p.crumbs)}
    <div class="phero-grid">
      <div>
        <h1 class="h1">${p.h1}</h1>
        <p class="lead">Basée à ${esc(site.baseCity)}, IMD Transport intervient dans les huit départements d'Île-de-France, pour des transports ponctuels comme réguliers.</p>
        ${ctaPair('page_hero', 'general')}
      </div>
      ${idfMap({ headingId: 'zones-map-t' }).replace('<svg', '<svg aria-describedby="zones-map-d"')}
    </div>
    <h2 id="zones-map-t" class="sr">Carte des départements desservis</h2>
    <p id="zones-map-d" class="sr">Carte des huit départements d'Île-de-France : ${DEPS.map(d => `${d.name} (${d.code})`).join(', ')}.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <h2 class="h2">Les départements desservis</h2>
    <ul class="dep-cards">
      ${DEPS.map(d => `<li id="dep-${d.code}" class="dep-card">
        <span class="dep-code">${d.code}</span>
        <h3 class="h4">${esc(d.name)}</h3>
        <p>Engins, matériel de chantier et véhicules transportés ${esc(PREP[d.code])}, au départ ou à destination de vos chantiers, dépôts et agences.</p>
      </li>`).join('')}
    </ul>
    <div class="beyond">
      <h2 class="h3">Au-delà de l'Île-de-France</h2>
      <p>Sur demande, nous réalisons également des transports ponctuels dans toute la France métropolitaine. Contactez-nous avec le détail du trajet pour étudier la faisabilité.</p>
    </div>
  </div>
</section>
${faqBlock(p.faq)}
${contactBlock('general', 'contact_page')}`
  },

  // ------------------------------------------------------------- À PROPOS
  {
    path: '/a-propos', file: 'a-propos.html',
    title: 'À propos d\'IMD Transport, transporteur sur plateau à Suresnes',
    description: 'IMD Transport, entreprise de transport basée à Suresnes (92) : transport d\'engins, de matériel de chantier et de véhicules sur poids lourds plateau en Île-de-France.',
    h1: 'À propos d\'IMD Transport',
    crumbs: crumbs({ name: 'À propos', path: '/a-propos' }),
    service: 'general',
    body: p => `
<section class="phero phero-simple">
  <div class="wrap narrow">
    ${breadcrumb(p.crumbs)}
    <h1 class="h1">${p.h1}</h1>
    <p class="lead">IMD Transport est une entreprise de transport routier basée à ${esc(site.baseCity)}, dans les Hauts-de-Seine. Elle transporte des engins, du matériel de chantier et des véhicules sur poids lourds plateau, pour les professionnels et les particuliers.</p>
  </div>
</section>
<section class="section">
  <div class="wrap narrow prose">
    <h2 class="h2">Ce que nous faisons</h2>
    <p>Nous réalisons des transports ponctuels, des transports réguliers et des tournées adaptées aux besoins de nos clients : loueurs de matériel, entreprises du bâtiment et des travaux publics, artisans.</p>
    <h2 class="h2">Ce que nous ne faisons pas</h2>
    <p>Pour être clairs avec nos clients : IMD Transport exerce une activité de transport. Nous ne louons pas de matériel et ne proposons ni porte-char, ni transport exceptionnel, ni dépannage autoroutier, ni levage.</p>
    <h2 class="h2">Notre organisation</h2>
    <ul class="checks">
      <li>La sécurité comme priorité : chauffeurs régulièrement sensibilisés, chargements arrimés</li>
      <li>Une flotte en propre de poids lourds porteurs plateau</li>
      <li>Nos propres chauffeurs</li>
      <li>Une organisation flexible, de jour comme de nuit selon disponibilités</li>
      <li>Un interlocuteur direct</li>
    </ul>
    <h2 class="h2">Informations sur l'entreprise</h2>
    <p>${esc(site.legal.form)} — SIREN ${esc(site.legal.siren)} — TVA ${esc(site.legal.vat)}. Voir les <a href="/mentions-legales">mentions légales</a>.</p>
  </div>
</section>
${contactBlock('general', 'contact_page')}`
  },

  // ------------------------------------------------------------- MENTIONS
  {
    path: '/mentions-legales', file: 'mentions-legales.html',
    title: 'Mentions légales | IMD Transport',
    description: 'Mentions légales du site imdtransport.fr : éditeur, hébergeur, propriété intellectuelle.',
    h1: 'Mentions légales',
    crumbs: crumbs({ name: 'Mentions légales', path: '/mentions-legales' }),
    body: p => {
      const L = site.legal;
      return `
<section class="phero phero-simple"><div class="wrap narrow">${breadcrumb(p.crumbs)}<h1 class="h1">${p.h1}</h1></div></section>
<section class="section"><div class="wrap narrow prose legal">
  <h2 class="h3">Éditeur du site</h2>
  <p><b>${esc(L.form.includes('SAS') ? site.legalName : site.name)}</b><br>
  ${esc(L.form)} au capital de ${esc(L.capital)}<br>
  Siège social : ${esc(L.address)}<br>
  ${esc(L.rcs)} — SIRET du siège : ${esc(L.siret)}<br>
  N° TVA intracommunautaire : ${esc(L.vat)}<br>
  Téléphone : <a href="tel:${site.contact.phoneE164}">${esc(site.contact.phoneDisplay)}</a> — E-mail : <a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></p>
  ${L.transportLicence ? `<p>Inscription au registre des entreprises de transport public routier de marchandises : ${esc(L.transportLicence)}</p>` : ''}
  <h2 class="h3">Directeur de la publication</h2>
  <p>${esc(L.president)}, en qualité de présidente de la société.</p>
  <h2 class="h3">Hébergeur</h2>
  <p>${esc(L.host.name)} — ${esc(L.host.address)} — <a href="${L.host.url}" rel="noopener">${L.host.url.replace('https://', '')}</a></p>
  <h2 class="h3">Propriété intellectuelle</h2>
  <p>Les textes, illustrations et éléments graphiques de ce site sont la propriété d'${esc(site.name)} ou utilisés avec autorisation. Les illustrations présentes sur le site sont des visuels d'illustration et ne représentent pas nécessairement les véhicules de l'entreprise. Les noms et marques des entreprises citées appartiennent à leurs titulaires respectifs.</p>
  <h2 class="h3">Données personnelles</h2>
  <p>Voir la <a href="/politique-confidentialite">politique de confidentialité</a>.</p>
  <h2 class="h3">Crédits</h2>
  <p>Carte des départements : tracés IGN Admin Express COG, via le projet france-geojson, sous Licence Ouverte Etalab. Polices Barlow Condensed et Inter sous licence SIL Open Font License.</p>
</div></section>`;
    }
  },

  // ------------------------------------------------------------- CONFIDENTIALITÉ
  {
    path: '/politique-confidentialite', file: 'politique-confidentialite.html',
    title: 'Politique de confidentialité | IMD Transport',
    description: 'Politique de confidentialité du site imdtransport.fr : données traitées, finalités, durée de conservation, droits RGPD.',
    h1: 'Politique de confidentialité',
    crumbs: crumbs({ name: 'Politique de confidentialité', path: '/politique-confidentialite' }),
    body: p => `
<section class="phero phero-simple"><div class="wrap narrow">${breadcrumb(p.crumbs)}<h1 class="h1">${p.h1}</h1></div></section>
<section class="section"><div class="wrap narrow prose legal">
  <h2 class="h3">Responsable du traitement</h2>
  <p>${esc(site.legalName)}, ${esc(site.legal.form)}, ${esc(site.legal.address)}. Contact : <a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a>.</p>
  <h2 class="h3">Aucune collecte par le site, aucun compte</h2>
  <p>Ce site n'a ni espace client ni base de données. Le formulaire de devis ne transmet rien à notre serveur : il prépare un message que vous envoyez vous-même par WhatsApp ou par e-mail, depuis votre propre application. Lorsque vous nous contactez par téléphone, WhatsApp ou e-mail, nous traitons les informations que vous nous communiquez (nom, coordonnées, détail du transport, photos) uniquement pour répondre à votre demande, établir un devis et réaliser la prestation.</p>
  <h2 class="h3">Base légale et conservation</h2>
  <p>Ces traitements reposent sur les mesures précontractuelles prises à votre demande et sur l'exécution du contrat. Les échanges sont conservés le temps nécessaire au traitement de la demande et, pour les clients, pendant la durée de la relation commerciale augmentée des délais de prescription et des obligations comptables applicables.</p>
  <h2 class="h3">WhatsApp</h2>
  <p>Le bouton WhatsApp ouvre l'application WhatsApp (service de WhatsApp LLC / Meta) avec un message prérempli que vous êtes libre de modifier. Les échanges via WhatsApp sont soumis à la politique de confidentialité de ce service.</p>
  <h2 class="h3">Cookies et mesure d'audience</h2>
  <p>Ce site n'utilise aucun cookie publicitaire ni outil de mesure d'audience nécessitant votre consentement. Si un tel outil était ajouté, il ne serait activé qu'après recueil de votre consentement, et cette page serait mise à jour.</p>
  <h2 class="h3">Hébergement</h2>
  <p>Le site est hébergé par ${esc(site.legal.host.name)} (${esc(site.legal.host.address)}), qui peut traiter des données techniques de connexion (adresse IP, journaux) nécessaires au fonctionnement et à la sécurité du service.</p>
  <h2 class="h3">Vos droits</h2>
  <p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition sur vos données. Pour l'exercer : <a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a>. Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).</p>
</div></section>`
  },

  // ------------------------------------------------------------- 404
  {
    path: '/404', file: '404.html', noindex: true, sitemap: false,
    title: 'Page introuvable | IMD Transport',
    description: 'Cette page n\'existe pas ou a été déplacée. Retrouvez nos prestations de transport d\'engins et de matériel BTP.',
    h1: 'Page introuvable',
    body: p => `
<section class="phero phero-simple"><div class="wrap narrow">
  <h1 class="h1">Page introuvable</h1>
  <p class="lead">Cette page n'existe pas ou a été déplacée. Vous cherchez peut-être :</p>
  <ul class="rel-list">
    <li><a href="/">Accueil${ICON.arrow}</a></li>
    ${SERVICES_NAV.map(n => `<li><a href="${n.path}">${n.label}${ICON.arrow}</a></li>`).join('')}
    <li><a href="/zones-intervention">Zones d'intervention${ICON.arrow}</a></li>
  </ul>
  ${ctaPair('404', 'general')}
</div></section>`
  }
];
