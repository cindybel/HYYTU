# Phase 3 — Carrière

État : flux de journée et continuité du parcours consolidés.

## Changements

- Le lit du garage ne prétend plus qu’une nouvelle journée a commencé lorsque `advanceDay()` bloque réellement la transition.
- Le jour n’est confirmé qu’après vérification que `profile.day` a effectivement avancé.
- Lors d’un vrai passage au lendemain, l’horloge 3D est synchronisée vers 08:00 au lieu de conserver une heure incohérente de la veille.
- Réponses clients, livraisons, calendrier, loyer et prêts continuent de passer par la logique historique `advanceDay()` : aucune duplication de transactions financières.
- La branche conserve la reprise d’une prestation, les candidatures différées, la négociation/acceptation par email et le prochain objectif de carrière déjà en place.

## Régressions évitées

- Aucun changement aux montants des contrats.
- Aucun changement aux scores de performance.
- Aucun reset de sauvegarde ou d’inventaire.
- Un contrat dû continue de bloquer le passage au lendemain et reste jouable.

## Validation

- GitHub Actions `Foundation checks` : succès après la modification de carrière.
- Vérification syntaxique de tous les scripts `src/*.js`.

## Suite

La phase suivante se concentre sur le gameplay VJ lui-même : plus de décisions observables pendant le show, sans récompenser artificiellement la possession de matériel.
