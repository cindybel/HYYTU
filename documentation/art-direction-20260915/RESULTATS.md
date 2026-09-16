# Collections progressives et modèles de vêtements — 15 septembre 2026

## Livré

- Tous les 51 clips précédents sont conservés, aux mêmes chemins. 20 nouvelles boucles portent le total à 71.
- Niveau 1 : 30 clips Essentiels. Niveau 3 : 21 Compositions supplémentaires. Niveau 5 : 20 nouvelles boucles Matières & profondeur. Les déblocages sont cumulatifs.
- Les nouvelles sources sont rendues en 1920 × 1080, 30 images/seconde, H.264. Chaque boucle dure huit temps à son tempo de référence. Sa vitesse de lecture suit le tempo de la régie.
- Cinq directions : architecture industrielle techno ; disque et collage urbain hip-hop ; matière atmosphérique chill ; motifs psychédéliques psytrance ; matière électrique rock. Quatre énergies par direction.
- Les rythmes synthétisés distinguent les cinq styles : grosse caisse régulière, rythme hip-hop, accompagnement doux, basse roulante psytrance, accents rock. Ils restent des accompagnements pédagogiques synthétisés.
- Gigs et répétitions utilisent les mêmes clips accessibles, sélectionnés pour le style du contrat. La bibliothèque permet de regarder les aperçus des collections futures avec leur niveau requis.
- Les packs présentent les images de leur collection réelle. Leur palier est explicite et détermine le niveau d'achat. Posséder un pack ne contourne pas le niveau d'utilisation des clips.
- Un passage aux niveaux 3 ou 5 annonce la collection débloquée dans la notification et le courrier interne du jeu.
- 17 modèles de vêtements/accessoires retravaillés : sections courbes, manches et jambes profilées, poches, lacets, fermetures, matière textile et casques à arceau ouvert. Images de catalogue et inspection 3D utilisent ces modèles.
- Les casquettes, tuques, casques, masques et badges portés utilisent les mêmes modèles, ajustés aux squelettes. Les hauts et pantalons portés gardent les coupes des trois personnages GLB existants ; leurs palettes et détails sont adaptés. Il ne s'agit pas encore d'un système complet de vêtements déformables interchangeables.
- Correction du chevauchement entre les images et les noms dans le magasin de vêtements. Nettoyage des textures de tissu lors de la fermeture des aperçus.

## Vérification

- `npm test` : 42 ressources HTML présentes, 39 scripts JavaScript valides.
- `progression-tests.cjs` : 25 combinaisons niveau/style, quatre énergies accessibles, déblocages cumulatifs, blocage des clips futurs, aperçus consultables, cinq styles en pratique, sauvegarde/rechargement sans paiement ni XP, reprise des anciens indices de sauvegarde.
- 20 vidéos vérifiées par ffprobe et réellement lues dans Chrome : dimensions, cadence, mouvement entre images et retour de boucle.
- `visual-check.cjs` : rendu des 17 modèles et des trois personnages. Captures inspectées ; amélioration supplémentaire des ourlets et des lacets après inspection.
- Test catalogue complet : 159 images, aucun échec, aucun doublon de fichier image, fiche/inventaire et inspecteur fonctionnels.
- Test équipement : 51 combinaisons personnage/article, fixations et volumes valides, bonus non doublés.
- Répétition réelle de 60 secondes : quatre actions réussies, pauses guidées et reprise après rechargement, contrôles mobiles accessibles.
- Contrat rémunéré réel de 60 secondes : pause/reprise, bilan, paiement puis rechargement. Deux shows au total dans le profil de test, niveau 3, solde 620 $.
- `final-check.cjs` : progression réelle par attribution d'XP jusqu'au niveau 5, notifications/courriers des collections 3 et 5, concordance de tous les packs avec leur palier et style, lecture du comparatif pour les cinq styles, affichage mobile sans débordement.

## Limites de la validation

La préférence artistique reste à juger en regardant les extraits. Les anciennes formes sont conservées volontairement ; le palier 3 reprend leurs variantes existantes. Aucun morceau importé n'est analysé automatiquement. La résolution en salle reste celle du matériel sélectionné, indépendamment de la résolution de la vidéo source. Les tests s'exécutent dans des profils Chrome isolés et n'altèrent pas la sauvegarde de la joueuse.

## Revoir les résultats

Ouvrir `apercu.html` avec le serveur du jeu pour comparer les trois collections en lecture et voir les vêtements. Les captures sont dans ce dossier. Les sauvegardes avant intervention se trouvent dans `before`.
