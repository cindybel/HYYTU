# Phase 7 — Environnements

## Réalisé
- Les familles de lieux possèdent maintenant une ambiance lumière distincte au lieu de partager le même comportement live.
- Profils ajoutés pour garage, cour extérieure, bar, sous-sol, club, hangar, festival, architecture, grande salle, Signal Lab, studio, galerie, loft et salle générique.
- Chaque profil contrôle la luminosité de base, la réponse pendant le live, la teinte générale et une micro-variation très légère.
- Les quatre passages du show (warm-up, montée, peak, break) continuent d'influencer l'éclairage, mais l'intensité est maintenant adaptée au type de lieu.
- Les réglages « mouvements réduits » et « visuels fixes » coupent les variations lumineuses de confort.
- Le type de lieu actif est exposé dans `body.dataset.venueFamily` pour permettre aux futures couches UI et audio de s'adapter sans dupliquer la logique du décor.

## Principe
L'environnement doit modifier la sensation du show sans donner artificiellement de points au joueur. Le décor et la lumière créent du contexte ; l'évaluation reste liée aux actions observables du gameplay.
