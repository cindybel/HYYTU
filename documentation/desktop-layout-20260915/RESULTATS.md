# Applications de l’ordinateur — 15 septembre 2026

## Corrections intégrées

- Les fenêtres s’adaptent à leur propre largeur, y compris une fenêtre étroite sur un grand écran. Leur position et leur taille sont bornées par l’écran.
- Les titres, boutons et textes longs reviennent à la ligne. Les fiches de boutique passent sur une colonne au besoin et les images restent dans leur cadre.
- Les cartes de compétences et de locaux prennent la hauteur de leur contenu. Les boutons du bas sont accessibles.
- Calendrier, courriels, banque, inventaire, musique, réservation des gigs, ateliers et dialogues ont des dispositions adaptées aux petites fenêtres.
- Les notifications et le bouton pour quitter l’ordinateur ne recouvrent plus les actions principales.
- La boutique ne rouvre plus une ancienne fiche par erreur ; le filtre de style de la liste détaillée des gigs conserve cette liste.
- Le nouvel explorateur propose dossiers, recherche, historique, vues icônes/liste, lecture des vidéos, inspection 3D et ouverture des documents. Les trois clips initiaux ont maintenant leurs véritables miniatures.

## Contrôles effectués

| Ensemble | Couverture | Résultat |
| --- | --- | --- |
| Audit général | 175 états, 16 applications et sous-pages, cinq tailles de 390 à 1680 px | Aucun débordement détecté dans la passe finale |
| Contenu rempli | 257 cas, textes longs, dialogues, filtres, ateliers et 149 fiches matériel/clips/vêtements ; 10 locaux dans leur catalogue | Aucun texte coupé, débordement ou contrôle masqué détecté |
| Commandes | 2 941 contrôles d’éléments interactifs après défilement | Accessibles au point testé |
| Explorateur | 30 vues : cinq dossiers, deux affichages, trois tailles | Géométrie valide et miniatures vidéo chargées |
| Fenêtres | Déplacement hors écran, agrandir/restaurer, réduire/rouvrir, passage à 390 px | Fenêtre et contrôles conservés dans l’écran |
| Pause | Ouverture/fermeture et fenêtre à 1280 et 390 px | Accessible |

L’explorateur a également été utilisé pour lire une vidéo, ouvrir un objet en 3D, chercher un fichier, revenir en arrière, ouvrir un courriel au clavier et sauvegarder par Démarrer. Aucune erreur JavaScript dans les parcours terminés.

## Preuves

- `content.cjs` et `content.json` : dernière passe complète sur la disposition actuelle.
- `audit.cjs`, `before.json`, `final.json` : diagnostic initial et audit général. La passe initiale détectait 16 états problématiques.
- `../quality-pass-20260915/explorer.cjs`, `explorer.json`, `windows.cjs`, `windows.json` : navigation et manipulation des fenêtres.
- Captures `content-*.png` et `../quality-pass-20260915/explorer-*.png`.

Les contrôles couvrent les états préparés et les tailles indiquées, pas toutes les combinaisons possibles de données. Le défilement vertical est volontaire : un contenu sous la partie visible de la fenêtre reste accessible en faisant défiler. Les tests utilisent leurs propres carrières de démonstration.
