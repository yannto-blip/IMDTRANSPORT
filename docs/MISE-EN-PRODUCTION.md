# Mise en production — procédure

État au 27/11/2026 : site validé par le dirigeant. Branche `feat/imd-website-redesign` prête, pull request ouverte vers `main`, **non fusionnée**. La production (imdtransport.fr) sert toujours l'ancien site.

## Avant de fusionner (bloquant)
1. **Hébergement** : le projet Vercel est très probablement sur l'offre Hobby, réservée à un usage non commercial. Choisir :
   - Vercel Pro (20 $/mois) : rien d'autre à changer ;
   - ou Cloudflare Pages / Netlify (gratuits, usage commercial autorisé) : migration du dossier `dist/` (commande `node build.mjs`), transposition des en-têtes de `vercel.json`, puis bascule DNS chez Hostinger.
2. **Droit à l'image** : autorisation écrite du chauffeur photographié (usage sur le site, durée, retrait possible).
3. **Mentions légales** : confirmer les données de l'entreprise et fournir le n° d'inscription au registre des transporteurs (`legal.transportLicence` dans `site.json`).
4. **Logos clients** : accords écrits de Kiloutou, Loxam, Colas et Bouygues Bâtiment (sinon `"logo": ""` → affichage en texte).

## Mise en ligne (si l'hébergement Vercel est conservé)
1. Fusionner la pull request dans `main` (bouton « Merge » sur GitHub).
2. Vercel construit automatiquement la production (`VERCEL_ENV=production` → pages indexables, `robots.txt` et sitemap de production).
3. Vérifier sur https://imdtransport.fr : accueil, une page prestation, formulaire (WhatsApp + e-mail), `https://imdtransport.fr/robots.txt`, `https://imdtransport.fr/sitemap.xml`, redirection `www`.
4. Retour arrière si besoin : dans Vercel, « Instant Rollback » vers le déploiement du 16/04/2026, ou revert du merge.

## Après la mise en ligne
- Google Search Console : propriété « domaine » imdtransport.fr (TXT chez Hostinger), soumission de `/sitemap.xml`, demande d'indexation de l'accueil.
- Fiche Google Business : renseigner l'URL du site ; ajouter son URL dans `site.json` (`googleBusinessUrl`).
- Mesurer les Core Web Vitals réels après quelques semaines.
