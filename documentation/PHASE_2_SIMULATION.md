# Phase 2 — Simulation

État : stabilisée pour servir de base aux phases carrière et gameplay.

## Changements

- Mouvement du personnage rendu indépendant des grosses variations de frame time.
- Déplacement sous-divisé afin d’éviter de traverser un obstacle lors d’un ralentissement.
- Collision avec un rayon joueur au lieu d’un simple point central.
- Horloge du monde isolée derrière une petite API (`getClock`, `advanceMinutes`).
- Avancement du temps plafonné par frame afin qu’un onglet ralenti ou un freeze ne fasse pas bondir artificiellement l’heure.
- Pitch caméra conservé dans l’état du monde au lieu d’être remplacé par une valeur fixe.
- Sauvegarde périodique conservée, ainsi que les interactions existantes du garage.

## Compatibilité conservée

- Les anciennes sauvegardes du loft sont toujours ramenées dans le garage.
- Les interactions ordinateur, garde-robe, inventaire, départ et objets de vie restent prioritaires comme avant.
- Aucun changement de contrat, score, économie ou progression n’est introduit dans cette phase.

## Validation

- Vérification syntaxique automatisée de tous les scripts `src/*.js`.
- Vérification automatisée des assets HTML et de l’ordre de chargement.
- GitHub Actions : `Foundation checks` réussi sur le commit de stabilisation de la simulation.

## Suite

La phase Carrière pourra maintenant consommer l’horloge du monde au lieu de multiplier les sources de temps. L’objectif est de réduire progressivement les contradictions entre `studioWorld.seconds`, `profile.day`, dates de contrats et coûts financiers sans casser les sauvegardes existantes.
