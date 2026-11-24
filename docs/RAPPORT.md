# Rapport — refonte imdtransport.fr

## État pour la recette (24/11/2026, 21 h)

Branche `feat/imd-website-redesign` uniquement. `main` et la production imdtransport.fr inchangées (dernier déploiement de production : 16/04/2026, ancien site). Aucun DNS modifié, aucune dépense.

### Points restant à valider avant publication (liste définitive)
1. **Recette du dirigeant** : relecture des textes, réception effective d'un devis test par WhatsApp et par e-mail.
2. **Engagements sécurité** : valider les 6 axes affichés et la réponse FAQ (« chaque chargement est sécurisé et arrimé avant le départ »).
3. **Mentions légales** : confirmer forme, capital, siège, présidente/directrice de publication ; fournir le **n° d'inscription au registre des transporteurs** (DRIEAT) ; confirmer que l'adresse du siège peut être publiée.
4. **Logos clients** : autorisations écrites de Kiloutou, Loxam, Colas et Bouygues Bâtiment (`docs/autorisations.md`) ; sinon repasser en texte.
5. **Logo IMD Transport** : confirmer les droits d'usage commercial des éléments Canva du logo.
6. **Visuels** : visuels IA marqués « Illustration non contractuelle » ; flouter/remplacer le logo Renault du fourgon si souhaité ; idéalement remplacer progressivement par de vraies photos.
7. **Hébergement** : plan Vercel très probablement Hobby (usage non commercial). Choisir Vercel Pro (20 $/mois) ou une offre gratuite autorisant l'usage commercial (Cloudflare Pages, Netlify) avant la mise en production.
8. **Robots d'entraînement IA** : décider de les autoriser (défaut actuel) ou de les bloquer (lignes prêtes dans `robots.txt`).
9. **Fiche Google Business** : fournir l'URL (footer + `sameAs`).
10. **Mise en production** : après validation, fusion de la branche dans `main`, puis Google Search Console (propriété domaine, sitemap).

---

## Autocomplétion IGN et liens Google Maps (24/11, 21 h)

API publique Géoplateforme IGN `data.geopf.fr/geocodage/completion/` (pas l'ancienne API BAN, pas Google). Vérifié en conditions réelles : réponse JSON, accès CORS depuis une autre origine autorisé, limite publiée de 50 requêtes/s par IP. L'API ignore `maxSuggestions` (10 résultats renvoyés) : filtrage côté client (doublons et lieux non pertinents écartés, 5 maximum). Déclenchement à 3 caractères, temporisation 400 ms, annulation des requêtes obsolètes, délai maximum 4 s, `terr=METROPOLE`. Liste accessible (combobox ARIA, clavier, souris, tactile, annonces vocales). Saisie libre toujours possible ; une panne d'API ne bloque rien. Mention : une adresse trouvée ne garantit pas l'accès poids lourds. Champs « Complément d'adresse / accès chantier » sous chaque adresse. Messages WhatsApp/e-mail enrichis de 3 liens Google Maps publics (prise en charge, livraison, itinéraire indicatif « non validé pour les poids lourds »), coordonnées GPS si une suggestion est choisie, adresse texte sinon. Seul le texte du champ adresse est envoyé à l'IGN, rien n'est stocké. CSP : `connect-src 'self' https://data.geopf.fr`. Politique de confidentialité mise à jour. Aucun calcul de prix ni de distance.

## Sprint 2 — finition premium et conversion (24/11/2026)

**Visuel** : illustrations SVG de camions supprimées (schéma technique du plateau conservé). Emplacements photo remplaçables pour chaque prestation (hero, mini-pelle, nacelle, compacteur, matériel, véhicule, plateau, pros) via `site.json` ; cadre neutre tant que la photo manque. Hero recomposé (texte + grande photo + bloc orange décalé), titres en casse normale (majuscules supprimées), espacements et hiérarchie revus, header agrandi.

**Logo officiel** : extrait du PDF (camion noir, « IMD TRANSPORT » bordeaux, signature), fond rendu transparent, recadré, WebP 1×/2× + PNG. Header, footer (cartouche blanc pour conserver les couleurs sur fond anthracite), données structurées (`logo`), favicon (camion du logo), image de partage. Charte orange inchangée. Remarque : le truck du logo est une image matricielle intégrée au PDF Canva (800 × 360 px) : rendu net jusqu'à ~2× la taille d'affichage du header, pas de version vectorielle exploitable.

**Références** : logos Kiloutou, Loxam, Colas, Bouygues Bâtiment (fichiers fournis), détourés du fond, sur fond blanc, hauteurs équilibrées. Autorisations écrites des 4 marques **à obtenir** — voir `docs/autorisations.md`.

**Formulaire de devis WhatsApp** : principe du Tally d'origine repris (matériel, adresses, date, nom) sans dépendance. Champs du cahier des charges ; seuls lieu de chargement et lieu de livraison sont obligatoires. Message structuré, champs vides omis, date JJ/MM/AAAA, ouverture `wa.me` ; le client confirme l'envoi dans WhatsApp et y joint ses photos. Aucun message de confirmation trompeur. Présent sur l'accueil, les 5 pages prestations et la page pros ; accès depuis le hero et chaque page prestation.

**Chiffres clés** : 16 t / 10 m / Jour & nuit / 6j/7 avec les libellés demandés, 4 colonnes desktop, 2×2 mobile, valeurs jamais coupées de leur unité (espaces insécables automatiques dans tout le site).

**Preview** : la branche est poussée ; build en mode preview = `noindex, nofollow` + robots.txt bloquant.

**Tests sprint 2 (exécutés)** : contrôle automatique 13 pages ✓ ; aucun débordement 12 pages × 6 largeurs ✓ ; 0 erreur JS ✓ ; axe-core 0 violation ✓ ; formulaire : validation, focus, accents, apostrophes, symboles, retours à la ligne, encodage, date, champs vides, redirection mobile ✓ ; Lighthouse mobile (local, sans photos) accueil 100/100/100/100, LCP 1,1 s, 221 Ko. **Les performances devront être remesurées une fois les photos intégrées** (budget : hero WebP < 200 Ko).

**Plan Vercel** : l'API de facturation répond « plan not found » pour l'équipe, ce qui indique très probablement l'offre Hobby (usage non commercial). La preview de revue est possible techniquement ; la mise en production commerciale sur Hobby reste non conforme aux conditions Vercel (options : Pro 20 $/mois, ou Cloudflare Pages / Netlify gratuits).

**Visuels intégrés (24/11, 19 h 30)** : 6 visuels IA fournis → WebP 640/800/1600 px (28 à 198 Ko), `srcset` responsive, photo hero préchargée, autres en différé, mention « Illustration non contractuelle ». Affectation : mini-pelle DAF → hero + mini-pelle + engins ; compacteur DAF → compacteurs ; fourgon DAF → véhicules ; matériel Iveco → matériel BTP + pros ; Iveco vide → moyens techniques ; nacelle Iveco → nacelles (nacelle **articulée** : textes ajustés « articulées ou à ciseaux »).
Points de vigilance sur les visuels : logo **Renault** visible sur le fourgon (marque tierce, à flouter ou remplacer si souhaité) ; pseudo-inscriptions générées par l'IA sur la pelle et la calandre Iveco (illisibles de loin) ; essieux multiples (4 essieux sur certains porteurs) : cohérent avec un porteur lourd mais pas forcément identique à la flotte réelle.
Lighthouse mobile (local, gzip, 3 passages) : accueil Perf 94–97, LCP 2,4–2,8 s (simulation 4G lente), CLS 0 ; pages prestations Perf 99–100, LCP ≈ 1,8–2,3 s. Accessibilité, bonnes pratiques et SEO : 100. Les mesures terrain (Core Web Vitals réels) viendront de la Search Console après mise en ligne.

**Positionnement sécurité (24/11, 20 h)** : section « La sécurité n'est pas une option. C'est notre priorité. » sur l'accueil (après les moyens techniques), 6 axes avec pictogrammes au trait, signature « Chaque transport. Chaque chantier. La même exigence. » ; réassurance sous le hero (Sécurité prioritaire · Flotte en propre · Marchandises assurées) ; bloc sécurité sur la page Professionnels et paragraphe « Sécurité du chargement et du transport » sur Moyens techniques ; nouvelle question FAQ (accueil, pros, moyens) ; meta descriptions, données structurées (`knowsAbout`) et `llms.txt` enrichis (sécurité du transport, arrimage, prévention des risques). Aucune certification, formation diplômante, statistique ni procédure inventée.
**À valider par le dirigeant** : les 6 axes affichés (sensibilisation régulière, arrimage, consignes de chantier, temps de conduite et de repos, vigilance sur véhicules et équipements, prévention des risques) et la réponse FAQ qui affirme que chaque chargement est arrimé avant le départ.
Tests : contrôle automatique ✓, 12 pages × 6 largeurs sans débordement ✓, 34 tests d'interaction/formulaire ✓, axe-core 0 violation ✓, Lighthouse mobile accueil 100/100/100/100 (LCP 0,8 s), pros 99–100.

**Formulaire : envoi WhatsApp ou e-mail (24/11, 20 h 15)** : formulaire unique mutualisé (`quoteForm()` + `main.js`) sur l'accueil, les 5 pages prestations et la page pros. Deux boutons : « Envoyer par WhatsApp » (vert, wa.me) et « Envoyer par e-mail » (orange, mailto vers imdtransport92@gmail.com, objet « Demande de devis transport — type — départ → arrivée », corps complet). Nouveau champ téléphone (facultatif). Liens discrets « Copier la demande » / « Copier l'adresse e-mail » pour les postes sans WhatsApp ni messagerie. Mention des photos à joindre dans WhatsApp ou l'e-mail. Aucun message de réception avant envoi réel ; avertissement si la demande est très longue (lien mailto > 1 900 caractères, risque de coupure dans certaines messageries). Événements préparés, inactifs : `submit_quote_whatsapp`, `submit_quote_email`, `copy_quote`, `copy_email` (sans donnée personnelle). Politique de confidentialité mise à jour.
Tests : 57 tests automatisés ✓ dont les deux parcours sur ordinateur et mobile (validation, contenu, accents, symboles, retours à la ligne, encodage, objet, longueur, copie, suivi) et le comportement réel (ouverture wa.me sur mobile, appel mailto sans erreur) ; 12 pages × 6 largeurs sans débordement ; axe-core 0 violation ; Lighthouse mini-pelle 100/100/100/100.
Limite connue : un lien mailto ouvre l'application de messagerie par défaut de l'appareil ; sur un poste sans client configuré, rien ne s'ouvre (d'où la copie).

---

# Sprint 1

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
