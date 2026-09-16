# Progression des gigs, plume et fixations — 14 septembre 2026

## Parcours appliqué

| Gigs | Palier | Objectif du bilan | Nouvelle difficulté |
|---|---|---|---|
| 1–5 | Écran simple | 60 % | Un rectangle, un projecteur ; sans masque ni chrono |
| 6–10 | Formes et plume | 68 % | Contours, ronds, découpes ; précision minimale 55 % quand un masque est requis |
| 11–15 | Deux projecteurs | 75 % | Plusieurs sorties et surfaces ; masque 65 % |
| 16–20 | Fixations au plafond | 82 % | Points A/B/C imposés ; réglages horizontaux et profondeur verrouillés après fixation ; masque 75 % |
| 21–25 | Trois projecteurs | 88 % | Coordination de trois sorties ; masque 82 % |
| 26–30 | Architecture avancée | 92 % | Combinaison fixations, contours et jusqu’à six surfaces ; masque 88 % |

Deux gigs distincts réussis au palier précédent ouvrent le palier suivant. Les prérequis de matériel et compétences existants restent applicables. DMTEAM conserve son accès total. Les contrats déjà acceptés sont préservés. Les nouvelles réussites de progression exigent un live terminé ; le meilleur score qualifié reste conservé après un essai moins réussi. Les anciennes sauvegardes peuvent utiliser leur score historique, faute de nouvelle preuve détaillée.

Le parcours est consultable dans Booking, avec un palier sur chaque carte. Le premier groupe a été normalisé dès la création des gigs, pas seulement à l’affichage. Les contrats existants non engagés sont également normalisés.

## Plume réellement fonctionnelle

- Ancien calcul supprimé : quatre clics n’accordent plus automatiquement 100 %.
- Comparaison par échantillonnage de l’intersection et de l’union du contour avec la cible.
- Découpe effective de la texture projetée, par shader, pour chaque projecteur.
- Écrans physiques découpés : rectangles, ronds, hexagones et compositions mixtes.
- Jusqu’à deux surfaces par sortie, soit six pour trois projecteurs.
- Clic gauche pour ajouter un sommet ; glisser une poignée pour le déplacer ; bouton Surface suivante et Refaire ce contour.
- Masques polygonaux de 3 à 32 sommets. Il ne s’agit pas d’un moteur Bézier complet identique à Resolume.
- Déplacement des points, contours, zone sélectionnée et fixations sauvegardés/repris.
- Choix de fixation A/B/C modifie effectivement la distance et la géométrie projetée. Support suspendu et rail ajoutés, câble remontant vers le matériel.

## Tests exécutés dans Chrome isolé

`difficulty-tests.cjs` :

- Les cinq premiers gigs sont rectangulaires, à une sortie, sans masque ni chrono.
- Deux scores qualifiés distincts ouvrent le palier suivant ; un seul ne suffit pas ; un contrat accepté reste accessible.
- Contrat 26 lancé dans une carrière de test DMTEAM : trois connexions, trois choix de fixation via interface, six contours tracés à la souris, tous à 100 % au dernier passage.
- Fixations A et B produisent des géométries de projection différentes.
- Déplacement libre verrouillé après fixation.
- Live bloqué avant préparation requise, puis démarré après tracé.
- Sauvegarde/reprise des six masques et des trois positions suspendues.
- Aucune erreur JavaScript ou compilation shader relevée.

`difficulty-circle-tests.cjs` :

- Gig 8, cercle réel, 20 points à la souris.
- Un sommet déplacé par glisser-déposer, puis corrigé ; nombre de points inchangé et précision rétablie à au moins 95 % (100 % avant déplacement).
- Live démarré, masques sauvegardés et repris.
- Capture `mapping-circle-drag-tested.png` inspectée.

Le contrat débutant a également été rejoué en continu pendant ses 60 secondes de live. Les contrôles de syntaxe et de présence des ressources ne sont pas considérés comme une preuve de fonctionnement du gameplay.

## Limites restantes

- Les trente contrats n’ont pas été tous joués du début à la fin. L’équilibrage global des revenus, compétences et temps d’apprentissage reste à éprouver sur une carrière complète.
- Les supports en hauteur constituent une simulation simplifiée de points de fixation ; aucun calcul structurel ou procédé professionnel d’accrochage n’est enseigné.
- Les calibrations restent le modèle simplifié existant, pas une simulation optique physique complète.
- Les courbes Bézier, poignées tangentes, feathering et mélange des bords ne sont pas implémentés.
- Les travaux précédents de réalisme des lieux et des vêtements restent en cours, conformément au rapport PROGRESS.md.
