# VJ Simulator — référence de travail

Version choisie par Cindy : **vjSIMUFINALE 2** (15 septembre 2026).

La référence de gameplay est `documentation/references/VJ_Simulator_Game_Design_Master_Refonte_Physique_v4.pdf`, copie exacte du document fourni par Cindy. Lire ce document avant toute évolution des règles. Le suivi d'implémentation et les vérifications se trouvent dans `documentation/physical-v4/`.

Conserver le monde 3D, les personnages, les pièces, les couleurs et la navigation. Les changements de géométrie/UI doivent servir une interaction précise. La refonte esthétique globale et le logiciel Resolute sont suspendus pour cette phase ; préserver leurs sources.

Les gigs reposent sur des objets distincts, manipulables, transportés réellement, reliés par des câbles compatibles et alimentés. Une tour exige écran, clavier et souris ; un laptop les intègre. Les anciennes sauvegardes doivent être conservées avant migration. Tester les erreurs autant que les réussites et vérifier les interactions rendues dans un navigateur isolé.
