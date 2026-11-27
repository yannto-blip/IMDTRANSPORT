# Migration Vercel → Cloudflare Pages — plan (27/11/2026)

**Statut : préparation uniquement.** Branche `feat/cloudflare-pages` (issue de `feat/imd-website-redesign`). Aucune modification DNS, aucun projet Cloudflare créé, aucune fusion dans `main`, aucune dépense.

## 1. Audit du compte Cloudflare (lecture seule, partiel)

Réalisé avec le connecteur « Cloudflare Developer Platform » déjà relié à Claude (connecteur signalé comme obsolète par Cloudflare au profit de `https://mcp.cloudflare.com/mcp`).

| Élément | Résultat |
|---|---|
| Workers | 0 |
| KV | 0 namespace |
| D1 | 0 base |
| Hyperdrive | 0 configuration |
| R2 | non activé sur le compte (donc aucune facturation R2) |
| Domaines (zones) | **non visible** avec ce connecteur |
| Projets Pages | **non visible** |
| Abonnements / facturation | **non visible** |
| Compte concerné | **non identifiable** (pas d'outil de liste des comptes dans ce connecteur) |

Conclusion provisoire : aucune application Workers, base ni stockage n'existe sur le compte relié ; rien ne risque d'être perturbé côté Developer Platform. Pour compléter (zones, Pages, abonnements), relier le serveur MCP officiel `https://mcp.cloudflare.com/mcp` (OAuth), puis relancer l'audit.

## 2. Compatibilité avec l'offre gratuite

| Limite Cloudflare Pages Free | IMD Transport |
|---|---|
| 500 builds / mois, 1 build à la fois | quelques builds par mois |
| 20 000 fichiers par site, 25 Mio par fichier | ~50 fichiers, le plus gros ≈ 200 Ko |
| 100 domaines personnalisés par projet | 2 (apex + www) |
| `_headers` : 100 règles, `_redirects` : 2 100 | 5 règles d'en-têtes, 6 redirections |
| Previews illimitées | oui |

Le site est 100 % statique (aucune fonction serveur) : aucune consommation Workers, donc rien de facturable. Usage commercial : contrairement au plan Hobby de Vercel, l'offre gratuite Cloudflare n'est pas présentée comme réservée à un usage non commercial — à confirmer à la lecture des conditions en vigueur au moment de la bascule.

## 3. Ce qui est déjà prêt dans la branche `feat/cloudflare-pages`

- `build.mjs` génère `dist/_headers` et `dist/_redirects` **depuis `vercel.json`** (source unique : en-têtes de sécurité, CSP avec `data.geopf.fr`, cache, 6 redirections 301). Ces fichiers ne sont produits que pour un build Cloudflare (`CF_PAGES=1`), pas sur Vercel.
- Détection des previews Cloudflare : toute branche autre que `main` (`CF_PAGES_BRANCH`) → `noindex, nofollow`, `robots.txt` bloquant et en-tête `X-Robots-Tag: noindex`.
- Testé avec l'émulateur officiel `wrangler pages dev` : URL propres (`/page.html` et `/page/` → 308 vers `/page`), 6 redirections 301, page 404 avec statut 404, tous les en-têtes de sécurité et de cache, CSP réelle (API IGN autorisée, tout autre domaine bloqué), 57 tests de parcours + 61 tests d'autocomplétion, axe-core 0 violation, aucun débordement.

## 4. Point structurant : le domaine

Pour servir l'**apex** `imdtransport.fr` depuis Pages, le domaine doit devenir une zone Cloudflare, donc **changer les serveurs de noms chez Hostinger** vers ceux de Cloudflare (offre DNS gratuite). Sans ce changement, seul un sous-domaine (`www`) pourrait pointer vers Pages par CNAME. → Modification DNS soumise à votre validation.

Avant la bascule, relever **tous** les enregistrements DNS actuels chez Hostinger (A/CNAME Vercel, `www`, TXT de vérification Google/Search Console, éventuels MX ou SPF) pour les recréer à l'identique dans la zone Cloudflare.

## 5. Plan de migration

**Phase 0 — Décisions (vous)** : valider Cloudflare Pages ; relier le MCP officiel et terminer l'audit ; confirmer le compte Cloudflare cible.

**Phase 1 — Projet Pages (aucun impact production)**
1. Workers & Pages → Créer → Pages → connecter GitHub, dépôt `yannto-blip/IMDTRANSPORT` (autoriser l'application Cloudflare sur ce seul dépôt).
2. Branche de production : `main` ; build : `node build.mjs` ; sortie : `dist` ; aucune variable nécessaire (`CF_PAGES` est fourni par Cloudflare).
3. Previews : branches `feat/*` → URL `*.pages.dev` non indexées. Option : protéger les previews par Cloudflare Access (gratuit jusqu'à 50 utilisateurs).
4. Tester la preview de `feat/cloudflare-pages` sur mobile et ordinateur (formulaire WhatsApp/e-mail, autocomplétion IGN, en-têtes).

**Phase 2 — Zone DNS préparée (aucun impact tant que les NS ne changent pas)**
5. Ajouter `imdtransport.fr` comme zone (offre Free), importer/recréer les enregistrements relevés chez Hostinger, sans activer.

**Phase 3 — Bascule (sur validation explicite, créneau calme)**
6. Fusionner `feat/cloudflare-pages` dans `main` → build de production Pages.
7. Pages → Domaines personnalisés : `imdtransport.fr` et `www.imdtransport.fr`.
8. Redirection `www` → apex : règle de redirection de zone (Redirect Rules, incluses dans l'offre Free), car `_redirects` ne gère pas les redirections de domaine.
9. Chez Hostinger : remplacer les serveurs de noms par ceux indiqués par Cloudflare. Propagation : quelques minutes à 48 h ; le site reste servi par Vercel ou Cloudflare pendant la transition (même contenu).
10. Contrôles : accueil, pages prestations, redirections, `robots.txt`, `sitemap.xml`, en-têtes, formulaire, certificat HTTPS.

**Phase 4 — Après bascule**
11. Garder le projet Vercel 2 semaines pour retour arrière (rétablir les NS Hostinger), puis le supprimer.
12. Search Console : propriété domaine (TXT dans la zone Cloudflare), soumission du sitemap.

**Référencement préservé** : mêmes URL, mêmes canonicals, même sitemap, mêmes 301 ; pas de changement de domaine.

**Coût prévu : 0 €** (Pages Free + DNS Free).

## 6. Annexe — intégration Cloudflare pour Claude Code et Codex (à lancer sur le Mac)

Principes Stravion Studio : vérifier l'existant, pas d'installation globale massive de skills, pas de CLI `cf` pour l'instant.

```bash
# 1. Vérifier l'existant
claude mcp list
claude plugin list 2>/dev/null
codex mcp list
grep -n -i cloudflare ~/.codex/config.toml 2>/dev/null
ls ~/.agents/skills 2>/dev/null | grep -i cloudflare

# 2. Claude Code : uniquement le serveur MCP officiel (pas le plugin complet ni les skills)
claude mcp add --transport http cloudflare https://mcp.cloudflare.com/mcp --scope user
#   puis dans Claude Code : /mcp → cloudflare → Authenticate (OAuth dans le navigateur)

# 3. Codex : uniquement le serveur MCP officiel (pas de « skills add --skill '*' --global »)
codex mcp add cloudflare --url https://mcp.cloudflare.com/mcp
codex mcp login cloudflare
```

Lors de l'autorisation OAuth, ne sélectionner que le compte Cloudflare concerné. Les skills Cloudflare pourront être ajoutés plus tard, un par un et au niveau du projet, si un besoin réel apparaît.
