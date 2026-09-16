# Vêtements portés — 15 septembre 2026

Les poches en blocs, le cadre rigide sur le torse, les anneaux aux chaussures et les gants ajoutés par-dessus les mains ont été remplacés par des détails sur les surfaces animées du personnage. Coutures, bandes réfléchissantes, éclairage discret, poches et gants suivent donc les mouvements du corps.

Nova porte maintenant un pantalon complet quand un pantalon est équipé ou essayé. La géométrie reprend le pantalon du modèle, descend jusqu’aux chevilles et suit les os des jambes. Retirer le pantalon restaure le short de départ. Eli et Sam utilisent leurs pantalons complets existants.

Les accessoires rigides (casquette, casque, masque) restent des objets fixés à la tête. Les coupes de hauts utilisent toujours les vêtements du personnage : ceci ne simule pas la physique du tissu et ne constitue pas une nouvelle coupe 3D par article.

## Vérifications

- Trois personnages, trois styles et trois angles : 27 rendus inspectables.
- Douze poses de marche, contrôle du rendu non vide et des dimensions du pantalon.
- Déplacement réel au clavier, sauvegarde/rechargement de la tenue et essayage réversible.
- Vérification de 51 combinaisons personnage/article et de sept inspecteurs de matériel.
- Aucune erreur JavaScript relevée dans ces tests.

Voir `tests.cjs`, `motion.cjs`, `motion.json` et les captures dans ce dossier.
