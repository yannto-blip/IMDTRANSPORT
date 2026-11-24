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

## Remplacer les images

Les visuels actuels sont des **illustrations SVG provisoires** (marquées « Illustration non contractuelle »).
1. Déposer la photo optimisée dans `src/assets/img/photos/` (WebP, ~1600 px de large, < 200 Ko).
2. Dans `site.json` → `images`, changer `src`, `w`, `h`, `alt` de l'emplacement voulu et mettre `illustrative` à `false` s'il s'agit d'une photo authentique de la flotte.

Logo officiel : déposer le PNG transparent dans `src/assets/img/` et renseigner `logo.src`, `logo.width`, `logo.height`. Logos clients : champ `logo` de chaque entrée `references` (après accord écrit).

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

## Mesure d'audience (désactivée)

Aucun traceur n'est chargé. Les boutons portent des attributs `data-track` (`click_phone`, `click_whatsapp`, `click_email`) avec emplacement et prestation. Pour activer GA4/Google Ads : ajouter un bandeau de consentement conforme CNIL, charger gtag **après consentement**, définir `window.IMD_ANALYTICS = true`, et ajouter les domaines Google dans la CSP de `vercel.json`. Aucune donnée personnelle n'est transmise.

## Sources et licences

- Carte : tracés IGN Admin Express COG via [france-geojson](https://github.com/gregoiredavid/france-geojson), Licence Ouverte Etalab. Régénérer : `node scripts/build-map.mjs departements-version-simplifiee.geojson`.
- Polices : Barlow Condensed et Inter, SIL Open Font License (fichiers de licence dans `src/assets/fonts/`).
- Illustrations : dessins originaux générés par `scripts/build-illus.mjs`.
