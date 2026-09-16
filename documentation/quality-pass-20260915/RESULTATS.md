# Passe qualité, ordinateur et régie — 15 septembre 2026

[Voir les captures](apercu.html) · [Direction à conserver](../DIRECTION-JEU.md)

## Problèmes traités et résultat

| Problème observé | Changement intégré |
| --- | --- |
| Vêtements ajoutés comme des blocs rigides | Détails sur les surfaces animées ; pantalon complet de Nova ; contrôle sur les trois personnages |
| Informations coupées et fenêtres trop larges | Dispositions selon la largeur de la fenêtre, contenu adaptable, boutons accessibles et position bornée |
| Ordinateur sans repères de système d’exploitation | Raccourcis, fond d’écran, barre des tâches, Démarrer, réduction/restauration et explorateur |
| Bibliothèque difficile à parcourir | Dossiers du jeu, recherche, historique, affichages icônes/liste, vignettes réelles et ouverture des fichiers |
| Régie peu organisée | Clips en haut avec leur couche, préview et programme, fondus, intensité et effets ; conseils dans une colonne dédiée |
| Consignes du show difficiles à suivre | Action courante, progression du geste, cible d’intensité et résultat de chaque passage |
| Répétition trop longue pour un geste précis | Quatre exercices de 15 secondes, bilan, record et bouton pour retravailler le passage ; set complet toujours disponible |

Le poste de l’appartement et la seconde partie des gigs utilisent tous deux `VJLiveShow`. La pratique conserve ses résultats et peut être reprise après rechargement. Elle ne donne ni argent ni expérience et ne termine aucun contrat. La suggestion d’ambiance filtre les clips ; le joueur choisit et lance lui-même ses images.

Le petit jeu Pause n’anime plus son écran lorsqu’il n’a pas été ouvert. Aucun gain de fréquence d’images n’est affirmé sans mesure.

## Références et choix

Le [démarrage rapide officiel de Resolume](https://www.resolume.com/support/en/quickstart-tutorial) explique les clips organisés par couches et leur lancement, les paramètres et le mixage. Sa [documentation des dispositions](https://www.resolume.com/support/en/layouts) montre l’importance des panneaux et de leur organisation. Ces repères ont guidé la disposition commune du poste et du show.

[PC Building Simulator 2](https://www.pcbuildingsim.com/) distingue l’apprentissage en carrière et l’expérimentation en atelier. Le choix retenu ici est de permettre de pratiquer les vrais outils du show dans le local, puis de rejouer seulement le passage qui pose problème.

Ce sont des choix de conception inspirés de ces références. La régie actuelle comporte une couche active et un mixeur préview/programme ; elle ne reproduit pas l’ensemble des fonctions professionnelles de Resolume.

## Vérifications terminées

- `npm test` : 45 ressources HTML présentes et 42 fichiers JavaScript valides.
- Audit des applications : 257 cas avec contenu rempli, dont 149 fiches d’articles et 2 941 contrôles interactifs ; aucun problème détecté. [Détail des fenêtres](../desktop-layout-20260915/RESULTATS.md).
- Explorateur : 30 vues, toutes les miniatures vidéo chargées, recherche, historique, lecture réelle, inspection 3D, ouverture de courriel et sauvegarde par Démarrer.
- Fenêtres : glisser, agrandir, restaurer, réduire, rouvrir par la barre des tâches et réduire l’écran à 390 px.
- Pratique : véritable passage de 15 secondes, fondu synchronisé, arrêt à la fin du passage, geste validé, bilan, record sauvegardé/rechargé, nouvel essai et retour au set complet. Argent, expérience, jour et contrats inchangés.
- Contrat payant rejoué avec la nouvelle disposition : achat de projecteur, acceptation et déplacement, show réel de 60 secondes, pause/reprise, versement et rechargement. Deux prestations conservées, niveau 3 et projecteur standard toujours équipé dans la carrière de test.
- Vêtements : 27 vues sur trois personnages et trois tenues, 12 poses de marche et déplacement réel ; essayage réversible et sauvegarde. [Détail](../natural-wardrobe-20260915/RESULTATS.md).

Aucune erreur JavaScript dans les parcours terminés. Tests réalisés dans des profils de navigateur isolés. Ces contrôles ne constituent pas un équilibrage complet des trente contrats.

## Prochaines améliorations de fond

1. **Composition VJ plus riche** : ajouter de véritables couches superposées, leur opacité et leurs modes de fusion, avec apprentissage progressif.
2. **Musique et dramaturgie** : arrangements plus longs, variations de structures et briefs artistiques plus distincts ; la suggestion actuelle utilise le profil du contrat et son passage, pas une analyse musicale automatique.
3. **Personnages et salles** : nouvelles coupes de vêtements modélisées pour chaque corps, matières plus abouties, animations de travail et lieux avec davantage d’identité. Les hauts utilisent encore les coupes des modèles existants.
4. **Carrière longue** : tester l’économie et les rythmes de progression sur plusieurs parcours complets, puis ajuster les récompenses et les coûts.

Les anciennes boucles restent disponibles et les niveaux de qualité déjà créés sont conservés. Les captures de cette passe montrent le jeu réel, avec des carrières de test.
