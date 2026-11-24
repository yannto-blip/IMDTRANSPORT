# IMD Transport — site vitrine

Site statique multipage, sans framework ni dépendance npm. Un petit script Node (`build.mjs`) assemble les pages à partir de gabarits et d'un fichier de données central, puis Vercel sert le dossier `dist/`.

```
src/data/site.json      ← coordonnées, caractéristiques, références, images, infos légales
src/pages.mjs           ← textes de toutes les pages
src/layout.mjs          ← header, footer, boutons, carte, schéma
src/assets/             ← CSS, JS, polices (auto-hébergées), images
public/                 ← favicon, manifest (copiés tels quels)
scripts/                ← outils : carte, illustrations, serveur local, contrôles
build.mjs               ← génère dist/ (+ sitemap.xml, robots.txt, llms.txt)
vercel.json             ← build, URLs propres, redirections, en-têtes de sécurité et cache
archive/                ← ancien site (index.html, camion.jpg, logo.PNG), non publié
```

## Travailler en local

```bash
node build.mjs            # génère dist/
node scripts/serve.mjs    # http://localhost:4173
node scripts/check.mjs    # liens, titres, h1, canonical, JSON-LD, contenus interdits
```

Node 18 ou plus. Aucune installation (`npm install`) n'est nécessaire.

## Modifier les coordonnées

Tout est dans `src/data/site.json` → bloc `contact` (téléphone affiché, format international, numéro WhatsApp sans `+`, e-mail). Relancer `node build.mjs` : header, boutons, barre mobile, footer, données structurées et `llms.txt` sont mis à jour.

## Ajouter / remplacer les photos

Chaque prestation a un emplacement photo (`site.json` → `images` : hero, minipelle, nacelle, compacteur, materiel, vehicule, plateau, pros). Tant que `src` est vide, un cadre neutre « Photo — … » s'affiche.
1. Exporter la photo en WebP en trois largeurs nommées `nom-640.webp`, `nom-800.webp`, `nom-1600.webp` (qualité ~70–76, < 200 Ko pour la 1600 ; ex. `cwebp -q 74 -resize 800 0 photo.jpg -o nom-800.webp`).
2. Les déposer dans `src/assets/img/photos/`.
3. Dans `site.json`, renseigner `src` (`/assets/img/photos/nom-1600.webp` : le `srcset` 640/800/1600 est généré automatiquement), `w`, `h` réels et un `alt` descriptif. `illustrative: true` affiche « Illustration non contractuelle » (images IA) ; `false` pour une vraie photo de la flotte.
4. `node build.mjs`. La photo hero est chargée en priorité, les autres en différé.

## Logos

- Logo officiel : `src/assets/img/logo-imd-transport(.webp|@2x.webp|.png)`, converti depuis le PDF fourni (dessin et couleurs inchangés, fond rendu transparent). Le footer le présente sur un cartouche blanc pour garder ses couleurs d'origine sur fond anthracite.
- Logos clients : `src/assets/img/logos/`, déclarés dans `site.json` → `references` (`display` = hauteur affichée en px, à ajuster pour l'équilibre visuel).

## Modifier un texte

Ouvrir `src/pages.mjs`, chercher la page (`path: '/transport-mini-pelle'`…) et modifier le texte. Les questions de FAQ sont regroupées en haut du fichier (`FAQ`).

## Ajouter une prestation

1. Copier un bloc de page dans `src/pages.mjs` (ex. `/transport-nacelle`), changer `path`, `file`, `title`, `description`, `h1`, `crumbs`, `service`, `serviceName` et le contenu.
2. Ajouter le lien dans `SERVICES_NAV` (`src/layout.mjs`) pour le menu et le footer.
3. Optionnel : ajouter un message WhatsApp dédié dans `WA_SUBJECT` (`src/layout.mjs`).
4. `node build.mjs && node scripts/check.mjs`. Le sitemap est régénéré automatiquement.

## Déployer

Le projet Vercel `imdtransport` est relié au dépôt GitHub.
- Pousser une branche → Vercel crée une **prévisualisation** (URL `*-git-<branche>-*.vercel.app`).
- Fusionner dans `main` → **mise en production** sur imdtransport.fr.

Réglages : `vercel.json` définit `buildCommand: node build.mjs` et `outputDirectory: dist`.

## Formulaire de devis (WhatsApp ou e-mail)

Un seul gabarit, `quoteForm()` dans `src/layout.mjs`, utilisé sur l'accueil, les 5 pages prestations et la page pros. Aucun backend ni service tiers : `main.js` construit le message à partir des champs remplis (champs vides omis, date JJ/MM/AAAA) puis ouvre :
- **Envoyer par WhatsApp** (vert) → `https://wa.me/<numéro>?text=…`
- **Envoyer par e-mail** (orange) → `mailto:<email>?subject=…&body=…` (objet « Demande de devis transport — type — départ → arrivée »)
- liens discrets **Copier la demande** / **Copier l'adresse e-mail** pour les postes sans WhatsApp ni messagerie configurée.

Le client confirme lui-même l'envoi et peut joindre ses photos. Aucun message de confirmation n'est affiché avant l'envoi réel. Construction du message : `buildQuoteMessage()` / `buildSubject()` dans `src/assets/js/main.js`. Événements prêts (inactifs sans `window.IMD_ANALYTICS`) : `submit_quote_whatsapp`, `submit_quote_email`, `copy_quote`, `copy_email`.

## Prévisualisations

Sur Vercel, chaque branche autre que `main` donne une preview. Le build détecte `VERCEL_ENV=preview` et ajoute `noindex, nofollow` sur toutes les pages + un `robots.txt` qui bloque tout. Pour tester ce mode en local : `IMD_PREVIEW=1 node build.mjs`.

## Mesure d'audience (désactivée)

Aucun traceur n'est chargé. Les boutons portent des attributs `data-track` (`click_phone`, `click_whatsapp`, `click_email`) avec emplacement et prestation. Pour activer GA4/Google Ads : ajouter un bandeau de consentement conforme CNIL, charger gtag **après consentement**, définir `window.IMD_ANALYTICS = true`, et ajouter les domaines Google dans la CSP de `vercel.json`. Aucune donnée personnelle n'est transmise.

## Sources et licences

- Carte : tracés IGN Admin Express COG via [france-geojson](https://github.com/gregoiredavid/france-geojson), Licence Ouverte Etalab. Régénérer : `node scripts/build-map.mjs departements-version-simplifiee.geojson`.
- Polices : Barlow Condensed et Inter, SIL Open Font License (fichiers de licence dans `src/assets/fonts/`).
- Logos clients : fichiers fournis par IMD Transport ; autorisations d'usage de marque à conserver dans `docs/autorisations.md`.
