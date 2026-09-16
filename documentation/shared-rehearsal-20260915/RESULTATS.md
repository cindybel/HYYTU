# Même régie dans le local et en gig

## Changements

Le poste physique VJ du local et la nouvelle icône « Régie VJ » sur l'ordinateur ouvrent maintenant `VJLiveShow`, le même moteur et les mêmes commandes que les contrats. Le joueur peut choisir le live d'un contrat à répéter. Le mode guidé commence en pause et s'arrête entre les quatre passages ; le mode sans guidage déroule les 60 secondes comme une gig.

La régie annonce une action à la fois, avec le contrôle correspondant mis en évidence :

1. Installer l'ambiance : cinq secondes dans la cible d'intensité.
2. Changer l'image : terminer un fondu pendant le deuxième passage.
3. Jouer le rythme : terminer un fondu synchronisé pendant le troisième passage.
4. Accompagner la finale : cinq secondes dans sa cible d'intensité.

Les réussites sont constatées à partir des actions et du rendu du live. Un compteur et le bilan affichent les défis réussis. Ces défis fournissent des objectifs pédagogiques ; la note existante conserve ses pondérations (cadrage, intensité, fondu terminé). Une image déjà préparée peut être envoyée sans imposer de sélection artificielle supplémentaire.

Le plan détaillé des passages est repliable. L'ancien guide du premier show reste limité au montage afin d'éviter deux séries de consignes contradictoires en live.

La répétition est conservée dans la carrière : passage, pause, visuels, effets, fondus et gestes validés. Fermer puis rouvrir permet de reprendre. Elle ne verse aucun cachet, ne termine aucun contrat et arrête l'horloge du monde.

## Vérifications

- `tests.cjs` : répétition réelle de quatre passages ; quatre défis réussis par les commandes de l'interface ; pause à chaque frontière ; fermeture/rechargement/reprise au deuxième passage ; argent, contrats, jour et nombre de prestations inchangés ; sortie et commandes sur mobile.
- `physical.cjs` : ouverture par le bouton du poste dans la pièce, horloge immobile pendant la répétition, captures ordinateur et mobile inspectées.
- `gig-regression.cjs` : contrat payant de 60 secondes, pause/reprise, bilan automatique, versement et sauvegarde ; deux prestations conservées et projecteur acheté toujours équipé.
- `npm test` : 38 ressources HTML présentes et 35 scripts JavaScript valides.

Tests effectués avec des carrières isolées. Fichiers antérieurs conservés dans `before/`.

La pratique couvre la régie live. Le déplacement, les branchements et le cadrage dans la salle restent des exercices distincts.
