# Parcours physique du studio au contrat — 14 septembre 2026

## Changement

L'accueil ouvre le studio 3D. Depuis l'ordinateur, le joueur choisit un contrat et son matériel. Valider la préparation le ramène dans la pièce : les caisses se trouvent à droite, puis la porte de sortie permet de partir. Le retour du bilan ramène au studio 3D.

La préparation en attente est sauvegardée : contrat, choix du matériel, devis et état des caisses. Les frais sont toujours débités par la transaction de départ existante, pas au moment de préparer ou de regrouper. Le départ vérifie de nouveau la disponibilité des choix et le montant du devis. Un changement impose une nouvelle vérification du setup.

Les caisses et la porte sont des objets Three.js, avec une zone d'interaction à proximité. Les caisses ont une limite de collision. L'action regroupe le matériel ; il n'y a pas encore d'animation de portage ni de simulation du véhicule.

## Accès à la bonne version

Le serveur sur le port 5173 renvoie actuellement `studio-entry-button`, sans `first-show-button`. Cela prouve la version servie, pas le contenu d'un ancien onglet déjà ouvert. Les ressources ont été versionnées `journey-20260914`, et le raccourci ouvre la même origine avec `?build=journey-20260914`. Les sauvegardes restent sur la même origine, sans effacement.

## Vérification

`documentation/qa/qa-journey.cjs` crée une carrière par l'interface, marche vers l'ordinateur, prépare un contrat, rejoint les caisses, sauvegarde/recharge, marche vers la sortie, joue un live de 60 secondes puis revient dans le studio. Aucun état de carrière n'est injecté dans ce scénario. Résultat observé : `passed: true`, zéro erreur JavaScript, préparation conservée après rechargement, débit uniquement à la porte et retour au studio après un vrai live de 60 secondes. Deux passes complètes ont réussi.

`qa-studio-world.cjs` a aussi validé les déplacements, la collision du bureau, l’ordinateur, la sauvegarde de la position et de l’horloge, ainsi que l’absence du bouton de changement de journée.

`qa-journey-guards.cjs` a validé, avec des états de test injectés dans une carrière isolée, le blocage du départ lorsque le devis change ou qu’un équipement disparaît : préparation ouverte, aucun débit. Le premier essai de ce script a échoué car il envoyait les touches avant que le monde soit prêt ; la synchronisation a été corrigée puis le scénario a réussi. Ces tests n’ont pas touché aux sauvegardes de la joueuse.

La nouvelle boucle n’a pas fait l’objet d’une session continue de dix minutes ; le test de dix minutes antérieur concernait l’ancien parcours.

## Limites

Cette passe relie le garage et le premier contrat. Elle ne transforme pas encore tous les logements en intérieurs distincts et n'ajoute pas les conversations avec les techniciens, les trajets jouables ou une animation de manutention. L'horloge continue de représenter le temps du monde sans déclencher le calendrier économique historique. Le plaisir de jeu n'est pas mesuré par les tests automatiques.
