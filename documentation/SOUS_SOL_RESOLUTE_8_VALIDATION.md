# Le Sous-sol et Resolute 8 — validation du 13 septembre 2026

## Réalisé

- Nouvelle salle dessinée dans Canvas : projection réelle du programme, structure de scène, enceintes, DJ, public stylisé, sol et reflets. Les faisceaux suivent le niveau de sortie ; la preview n'est jamais envoyée à la salle avant le fondu.
- Régie nommée **Resolute 8** : bandeau de composition, couche à gauche, grille de clips, moniteurs preview/sortie séparés et paramètres dessous. Même organisation adaptée au live de carrière. Une seule couche est réellement implémentée ; aucun bouton de couche fictive.
- Trois défis de 32 secondes : fondu terminé, montée accompagnée, break et transition. Les changements musicaux sont placés sur des phrases de la boucle préparée à 120 BPM. La musique synthétique change de densité selon le passage.
- Progression explicite : prochain défi, nouvelle tentative, choix d'un autre défi, pratique libre et garage. Le visuel Aurore est débloqué après les trois réussites et devient immédiatement jouable.
- Les retours portent sur les gestes observés. La première mission ne juge pas l'intensité. Les deux autres demandent au moins 80 % du temps dans les plages annoncées ; la dernière demande aussi un fondu terminé. Le public est décoratif et ne donne aucun score de créativité.
- Les retours dans l'atelier sautent les gestes déjà appris. Les anciens défis de 96 secondes restent disponibles via l'atelier et leurs sauvegardes restent compatibles. Correction de la restauration d'une intensité de 0 %.
- Écran de bilan allégé, commandes visibles sur le portable testé, contrastes de boutons corrigés. Mouvements réduits et volume conservés.

## Vérifications terminées

- `qa-room-missions.cjs` : trois missions réellement jouées, déblocages, pause/rechargement, sauvegarde. Cas d'échec supplémentaire avec une sauvegarde de test proche de la fin.
- `qa-room-edges.cjs` : comparaison des pixels avec mouvements réduits, accès garage, Aurore envoyée en salle, retour sans tutoriel, largeur mobile, ancienne sauvegarde 96 s et intensité 0 %. Scénarios de sauvegarde préparés dans un profil de test isolé.
- `qa-resolute.cjs` : pixels de sortie inchangés lors d'une sélection en preview, pixels modifiés après un vrai fondu ; sélection et fondu également testés dans le live de carrière. Bouton pause visible à 1366 × 768.
- `qa-live.cjs` : contrat joué pendant 60 secondes, quatre consignes, résultat calculé et paiement. Résultat de ce passage : live 98, bilan 78, paiement 358.
- `qa-windows.cjs` : déplacement, réduction/réouverture à la même position, agrandissement et fermeture.
- `qa-simple-gigs.cjs` : sélection limitée, candidature, progression du jour et acceptation ; l'offre de contrat utilise une fixture.
- `qa-wardrobe.cjs` et `qa-wardrobe-shop.cjs` : changements de couleurs sur les trois personnages, 51 routes de prévisualisation, équipement/retrait, bonus et sauvegarde. Ces vérifications ne constituent pas une inspection visuelle exhaustive de chaque combinaison pendant chaque animation.
- Captures de l'atelier et du live inspectées. Pas d'erreur JavaScript dans ces tests.

## Test long

**Terminé : 601 secondes, `passed: true`, aucune erreur JavaScript.** Résultat enregistré dans `qa/qa-complete-ten-minutes.json`. Partie vierge, gestes à 6 s, échec réel sans fondu à 39 s, nouvelle tentative puis trois défis réussis à 138 s, garage/câble/client à 139 s, carrière créée à 140 s, pratique libre avec cinq visuels jusqu'à la fin. Les contrôles rapides du garage et du client sont des clics automatisés ; ces durées ne décrivent pas le rythme d'une débutante humaine.

La reprise au milieu de la montée, les cinq compétences, les trois succès de salle et le personnage ont été vérifiés après rechargement. Le nouveau bilan de carrière a été modifié pendant la partie prolongée ; il a donc été validé séparément ensuite par un nouveau contrat complet de 60 secondes sans fixture. Ce dernier a pris quatre jours de carrière via les boutons de Booking, s'est terminé avec un cachet de 358 $ et un net de 318 $, puis a été retrouvé comme terminé après rechargement.

## Limites et jugement de conception

Le début est désormais jouable sans gestion de carrière ; les récompenses et changements d'objectif arrivent sur des séquences courtes. Cela valide la structure du parcours, pas le plaisir ressenti par une personne. Il reste à faire jouer une débutante sans aide et observer ses hésitations.

La salle de l'atelier est un décor 2D stylisé, pas un nouvel environnement 3D photoréaliste. Resolute 8 ne reproduit pas toutes les fonctions d'un logiciel professionnel : multicouche, import vidéo personnel, routage MIDI et bibliothèque d'effets complète restent absents de cette régie. Le catalogue entier n'a pas reçu de nouveaux modèles 3D haut de gamme. Les délais et écrans de gestion de carrière existent toujours. La musique a été testée côté exécution, pas évaluée par écoute humaine dans cette session.

Référence de disposition consultée : [documentation officielle des dispositions de Resolume](https://www.resolume.com/support/en/layouts), notamment la distinction des moniteurs de composition et de preview. Le nom, le décor et la présentation du jeu sont propres à Resolute 8.

## Mesure de fluidité

`qa-room-frame-times.cjs` a observé 601 images en dix secondes de pratique libre : moyenne 60 images/s, médiane 17 ms, 95e percentile 17 ms, aucune image au-delà de 50 ms. Mesure dans Chrome sans fenêtre à 1366 × 768 sur cette machine ; ce n'est pas une garantie sur tout appareil ni un test humain du plaisir de jeu.

## Correction issue du test de carrière

Le bilan de contrat affichait encore de nombreux chiffres et des intitulés anglais avant le conseil utile. Il affiche désormais d'abord une réussite observée, une seule amélioration prioritaire, le cachet, le net et les gestes travaillés. Les chiffres existants sont conservés dans un panneau « Voir les scores, dépenses et bonus » fermé par défaut. Une notification d'offre renvoie maintenant à Booking, où l'acceptation est possible directement.

`qa-contract-debrief.cjs` vérifie l'ouverture du panneau et la conservation du détail, avec une fixture proche de la fin du live. La capture `qa/qa-contract-debrief.png` a été inspectée. Le contrat complet sans fixture est testé séparément par `qa-contract-real.cjs` ; il crée le personnage et utilise les boutons de candidature, réponse, départ, connexion et live.
