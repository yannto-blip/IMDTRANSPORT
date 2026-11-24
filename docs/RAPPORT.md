# Rapport — refonte imdtransport.fr

Branche : `feat/imd-website-redesign` · Date : 24/11/2026 · Production **non modifiée**.

## 1. Audit de l'existant

- Dépôt : 3 fichiers (`index.html`, `camion.jpg`, `logo.PNG`), déploiements Vercel depuis `main`, dernier en production le 16/04/2026.
- Domaines Vercel : `imdtransport.fr` (vérifié) et `www` → redirection 308 vers l'apex. OK.
- Problèmes de l'ancien site : formulaire Tally en iframe, mention « porte-char » (non proposé), « intervention rapide » (promesse), SIREN affiché comme « SIRET ».
- **`camion.jpg` inutilisable** : semi-remorque porte-engins jaune MAN, marquage « CONVOI EXCEPTIONNEL » et « IMD Transport » fictif, pelle Volvo. Contraire à toutes les consignes visuelles → archivé, non publié.
- **`logo.PNG` ≠ logo officiel décrit** : c'est un logo bleu (camion bleu, « IMD TRANSPORT » blanc/bleu), sans la signature. Le PDF officiel (camion noir, nom bordeaux, signature) **n'a pas été fourni**. Le header affiche un mot-symbole typographique neutre en attendant.

## 2. Architecture retenue

HTML/CSS/JS statique généré par un script Node de ~150 lignes, **zéro dépendance npm**, zéro service tiers au chargement. Toutes les données réutilisées sont centralisées dans `src/data/site.json`. Voir `README.md`.

Pages (12 + 404) : `/`, `/transport-engins-chantier` (intègre compacteurs/rouleaux), `/transport-mini-pelle`, `/transport-nacelle`, `/transport-materiel-btp`, `/transport-vehicules` (intègre utilitaires, non roulants), `/transport-professionnels`, `/nos-moyens-techniques` (intègre « camion plateau 10 m / 16 t »), `/zones-intervention` (8 départements en ancres, pas de pages départementales pauvres), `/a-propos`, `/mentions-legales`, `/politique-confidentialite`.
Fusions : `/transport-compacteur`, `/transport-plateau`, `/transport-vehicule-utilitaire` → redirections 301 vers les pages qui couvrent ces intentions.

## 3. Fonctionnalités

- CTA Appeler + WhatsApp : header, hero, chaque page (hero + bloc final + encart), section pros, footer, 404 ; barre fixe mobile avec `safe-area-inset`.
- WhatsApp : lien `wa.me` + message prérempli modifiable, adapté à la prestation (mini-pelle, nacelle, matériel, véhicule, besoins réguliers).
- Carte SVG de l'IDF aux contours réels (IGN Admin Express, Licence Ouverte), 6 Ko, survol desktop, 1er appui = nom / 2e appui = fiche sur mobile, navigation clavier, liste textuelle alternative.
- Schéma technique du plateau (10 m × 2,48 m, 24,8 m², rampes, treuil, pas de grue).
- Illustrations SVG originales cohérentes (porteur plateau blanc, rampes, treuil, pas de grue, pas de marquage), étiquetées « Illustration non contractuelle ».
- FAQ métier (10 questions du cahier des charges), en `<details>` accessibles.
- Suivi `click_phone` / `click_whatsapp` / `click_email` préparé (emplacement, page, prestation, UTM), **inactif** : aucun traceur, donc aucun bandeau cookies nécessaire.

## 4. SEO / GEO

Titres et descriptions uniques, un H1 par page, canonical vers `https://imdtransport.fr`, fil d'Ariane, sitemap.xml, robots.txt, Open Graph + image 1200×630, favicon, 404 dédiée, URLs propres (`cleanUrls`), maillage entre prestations.
Données structurées : `LocalBusiness` (adresse limitée à Suresnes 92150, sans rue ; zone = 8 départements ; SIREN, TVA), `WebSite`, `Service` par page prestation, `BreadcrumbList`, `FAQPage`. Aucune note/avis. `llms.txt` factuel.
robots.txt : tout autorisé ; lignes prêtes (commentées) pour bloquer les robots d'**entraînement** (GPTBot, Google-Extended, CCBot, ClaudeBot) sans toucher aux robots de recherche — **décision à prendre par le dirigeant**.

## 5. Tests réellement exécutés (local, Chrome headless)

| Test | Résultat |
|---|---|
| `scripts/check.mjs` : liens internes, ancres, titres/descriptions uniques, 1 H1, canonical, JSON-LD parsable, images alt + dimensions, contenus interdits (17 t, nb de camions, 24h/24, notes, Tally, porte-char positif) | ✓ 0 problème, 13 pages |
| Débordement horizontal : 13 pages × 320 / 375 / 390 / 768 / 1024 / 1440 px | ✓ aucun |
| Erreurs JavaScript console | ✓ aucune |
| Menu mobile (ouverture, aria-expanded, Échap), sous-menu Prestations | ✓ |
| Barre mobile : visible, ancrée, `tel:+33688494533`, `wa.me/33688494533` + message | ✓ |
| Zones tactiles ≥ 44 px | ✓ (min 48 px) |
| Carte : survol, appui tactile, Tab clavier, focus visible | ✓ |
| Suivi : aucun envoi par défaut ; si activé, aucun numéro transmis | ✓ |
| Requêtes tierces au chargement | ✓ 0 |
| axe-core WCAG 2.1 AA + bonnes pratiques, 12 pages × 2 largeurs | ✓ 0 violation |
| Lighthouse mobile (labo, serveur local non compressé) — accueil | Perf 99 · A11y 100 · BP 100 · SEO 100 · LCP 2,1 s · CLS 0,026 · TBT 50 ms |
| Lighthouse mobile — mini-pelle / zones | 100 / 100 / 100 / 100 (LCP 1,8 s et 0,9 s, CLS 0) |

Non testé : rendu sur vrais appareils iOS/Android, données terrain (CrUX/INP réel — pas encore de trafic), validateur Google Rich Results (non accessible depuis l'environnement), envoi réel d'un WhatsApp.

## 6. Prévisualisation

- Le dépôt GitHub n'a **pas pu être poussé** : accès en écriture refusé à cette session. Aucune preview Vercel n'a donc été créée.
- Prévisualisation privée publiée sur claude.ai (copie avec chemins relatifs, mêmes contenus).
- Pour obtenir la preview Vercel : autoriser le dépôt dans la session puis pousser la branche (Vercel crée l'URL automatiquement), ou pousser vous-même le bundle Git fourni.

## 7. Hébergement Vercel — point bloquant à trancher

Les conditions Vercel réservent le plan **Hobby** (gratuit) à un usage « personnel ou non commercial ». Le plan de l'équipe `morpheusdevil-1640s-projects` n'est pas lisible via l'API ; s'il s'agit de Hobby, le site commercial d'IMD Transport n'est pas conforme. Options (rien n'a été souscrit) :
1. Vercel Pro : 20 $/mois par membre.
2. Cloudflare Pages (offre gratuite autorisant l'usage commercial) : site 100 % statique, migration simple (`node build.mjs`, dossier `dist`), en-têtes à transposer dans un fichier `_headers`.
3. Netlify (offre gratuite) : même principe.

## 8. Informations légales

Source : registre public via societe.com (fiche officielle annuaire-entreprises.data.gouv.fr inaccessible depuis l'environnement). **À confirmer par le dirigeant avant mise en ligne** :
SAS IMD TRANSPORT, capital 30 000 €, siège 20 allée des Jonquilles 92150 Suresnes, SIREN 978 360 477, SIRET siège 978 360 477 00019, RCS Nanterre, TVA FR56978360477, NAF 49.41B, présidente Messaouda Slama (directrice de la publication par défaut).

Manquant / à vérifier :
- Numéro d'inscription au **registre des transporteurs** (DRIEAT) : non affiché (champ `legal.transportLicence` prêt).
- L'adresse du siège semble résidentielle : elle est légalement requise dans les mentions légales (LCEN) mais **n'est pas** reprise dans les données structurées ni ailleurs. Si une domiciliation existe, mettre à jour `legal.address`.
- Conditions générales de vente / transport (contrat type) : non fournies, non créées.
- Conditions et plafonds du contrat d'assurance : formulation volontairement générale.

## 9. Références clients

Kiloutou, Loxam, Colas, Bouygues Bâtiment affichés **en texte** (aucun logo). Accord du dirigeant mentionné dans le brief ; avant d'afficher des logos, obtenir l'autorisation écrite de chaque entreprise (usage de marque) et la conserver (dossier `docs/autorisations/` à créer).

## 10. Avant la mise en production

1. Fournir le logo officiel (PDF vectoriel) → PNG transparent → `site.json`.
2. Confirmer les mentions légales + n° de registre transporteur.
3. Trancher l'hébergement (plan Vercel).
4. Remplacer au moins le visuel hero par une vraie photo ou un visuel IA conforme (`docs/visuels-a-produire.md`).
5. Renseigner l'URL de la fiche Google Business (`googleBusinessUrl`) — elle apparaîtra dans le footer et `sameAs`.
6. Décider pour les robots d'entraînement IA.
7. Valider la preview, fusionner dans `main`.
8. Google Search Console : ajouter la propriété « domaine » `imdtransport.fr` (enregistrement TXT chez Hostinger), soumettre `https://imdtransport.fr/sitemap.xml`, demander l'indexation de l'accueil.

Coûts engagés : 0 €.
