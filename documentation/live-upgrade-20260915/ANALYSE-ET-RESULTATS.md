# Live et ordinateur : améliorations du 15 septembre 2026

## Analyse des jeux

Analyse documentaire, sans prétendre avoir joué à ces jeux pendant cette session.

- FUSER : préparation en préécoute et choix du moment de diffusion. L'annonce officielle décrit notamment les Hot Clips. Principe adapté : préparer le visuel, puis choisir une transition immédiate ou au prochain temps fort. [Annonce de l'équipe](https://store.steampowered.com/news/posts/?appids=1331440%2C1356690&enddate=1614711060&feed=steam_community_announcements).
- Beat Saber : repères temporels et événements lumineux organisés sur les temps. Principe adapté : rendre le rythme et les changements à venir visibles. [Terminologie officielle](https://beatsaber.com/documentation/terminology/index.html), [événements lumineux](https://beatsaber.com/documentation/the-static-event-system/index.html).

Les visuels restent choisis par le joueur. Aucune ressource graphique ou musicale de ces jeux n'a été copiée.

## Changements

- Frise des quatre passages, durée et intensité attendue ; compte à rebours jusqu'au suivant.
- Repère de quatre temps suivant le BPM de la bande-son du jeu.
- Cible d'intensité près du curseur et proportion du passage effectivement accompagnée.
- Fondu optionnel au prochain temps 1, annulable et conservé pendant la pause ou dans une sauvegarde. Le fondu immédiat reste disponible.
- Mention au bilan des fondus synchronisés réellement terminés, sans bonus artificiel au score.
- Effets avancés dans une section repliable ; préview, programme, fondu et intensité présentés avant les effets.
- Régie défilable dans la hauteur de l'écran et en-tête de pause accessible.
- Cartes de compétences à hauteur automatique : suppression de la rangée d'image de boutique qui coupait les boutons. Boutons sur plusieurs lignes si nécessaire. Les compétences maîtrisées affichent des boutons désactivés explicites.

## Vérifications

`tests.cjs` : cinq cartes aux niveaux 0 et 5 sur 1116 × 717, 1280 × 720 et 390 × 844. Boutons contenus dans les cartes ; dernière action atteignable sans recouvrement. Captures inspectées.

Fondu synchronisé testé avant/après le temps cible, à l'annulation, en pause et après restauration. Le compteur augmente uniquement après le fondu terminé. Commandes live accessibles sur mobile.

`career-loop.cjs` réussi : deux prestations de 60 secondes, fondu synchronisé confirmé au bilan, achat du projecteur à 280 $, seconde offre, pause/reprise, paiements et sauvegarde. Niveau final 3, solde 620 $, projecteur standard conservé. Le solde varie avec la prestation.

`npm test` : 37 ressources HTML présentes, 34 scripts valides.

Le rythme affiché correspond à la bande-son synthétisée, sans analyse automatique de musique importée. Le son a été rendu en WAV et vérifié numériquement, sans écoute subjective. L'équilibrage couvre le début de carrière, pas une traversée des 30 contrats.

Sauvegardes du code antérieur dans `before/`. Les tests utilisent une carrière isolée.
