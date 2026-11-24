# Visuels à produire

Aucune génération d'image payante n'a été lancée. Le site utilise des illustrations SVG d'attente. Chaque emplacement se remplace dans `src/data/site.json` → `images`, sans toucher à la structure.

**Consignes communes à ajouter à chaque prompt** : photographie réaliste, lumière naturelle, poids lourd porteur rigide (pas de semi-remorque) de marque DAF ou Iveco, cabine blanche, carrosserie plateau long d'environ 10 m, rampes de chargement arrière, treuil à l'avant du plateau, **aucune grue**, aucun logo ni texte sur le camion, plaques illisibles, arrimage par sangles/chaînes réaliste, cales sous les roues/chenilles, environnement de chantier ou zone industrielle d'Île-de-France crédible, cadrage 3/4 avant, format 16:9, pas de personne identifiable.

| Fichier cible | Emplacement | Prompt spécifique |
|---|---|---|
| `photos/hero-mini-pelle.webp` | Hero accueil, page mini-pelle | Camion plateau blanc transportant une mini-pelle orange de 2–3 t, godet posé sur le plateau, arrimage en 4 points, sur une voie d'accès de chantier, ciel clair. |
| `photos/nacelle.webp` | Carte + page nacelle | Même camion transportant une nacelle élévatrice à ciseaux repliée, arrimée, devant un bâtiment en construction. |
| `photos/compacteur.webp` | Carte compacteurs | Même camion transportant un compacteur tandem, cylindres calés, sur un chantier routier. |
| `photos/materiel.webp` | Page matériel BTP | Même camion chargé d'échafaudages en cadres et de poutres IPN sanglées, dans une cour de dépôt. |
| `photos/utilitaire.webp` | Page véhicules | Même camion transportant un fourgon utilitaire blanc sans marquage, roues sanglées, rampes relevées. |
| `photos/plateau-vide.webp` | Moyens techniques, pros | Même camion, plateau vide, vue latérale, rampes arrière abaissées au sol, treuil visible. |
| `photos/ambiance-nuit.webp` | Option | Même camion chargé d'une mini-pelle, de nuit, éclairage de chantier, gyrophares orange. |

Export : WebP qualité ~78, 1600 × 900 px, < 200 Ko. Renseigner `w: 1600, h: 900` et un `alt` descriptif. Garder `illustrative: true` pour les images générées par IA (mention « Illustration non contractuelle » affichée automatiquement) ; `false` uniquement pour de vraies photos de la flotte.

**Le mieux** : quelques photos réelles prises au téléphone par les chauffeurs (camion chargé, de jour, sans plaque lisible) seront plus crédibles que toute image générée.
