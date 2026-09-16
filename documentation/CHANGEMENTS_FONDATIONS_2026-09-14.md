# VJ Simulator — changements du 14 septembre 2026

Cette livraison applique une première partie des priorités de l’audit. Les clips personnels restent à ajouter plus tard. Aucune sauvegarde utilisateur n’a été effacée ; les tests ont utilisé des navigateurs isolés. Sauvegardes des fichiers modifiés dans `.local-backup-foundations-20260914`.

## Changements réalisés

- Bureau simplifié : Shows, Guide VJ et Réglages visibles. « Tous mes outils » donne accès aux applications conservées. Le choix est sauvegardé dans la carrière.
- Préparation : objectif court, matériel présélectionné et frais visibles. Les réglages détaillés sont repliés, et s’ouvrent si la préparation est bloquée. Le bouton de sortie du PC ne chevauche plus cette fenêtre.
- Sessions modernes : score basé sur installation/cadrage (45 %), intensité observée (45 %) et fondu terminé (10 %). Le signal et la durée réellement jouée plafonnent le résultat. Les possessions, les vêtements et les statistiques ne donnent plus de points gratuits dans ces sessions. Les anciennes règles restent disponibles pour les anciens contrats.
- Les nouvelles sessions ne consomment plus d’énergie journalière au départ et n’appliquent plus de pénalités aléatoires sans action corrective. Les données financières historiques sont conservées.
- Cinq ateliers gratuits : sens du signal, cadrage et trapèze, contour au clic, routage indépendant et intensité montée/break. Trois niveaux définis par atelier. La réussite accorde une compétence sauvegardée. Les contrats peuvent aussi accorder des compétences après des gestes observés ; une même preuve de contrat ne se cumule pas à l’infini.
- Le bilan nomme les critères et affiche les nouvelles compétences hors des détails.
- Libération des géométries et matériaux des anciennes scènes, en conservant les textures partagées.
- Lanceur mis à jour vers `?build=foundations-20260914`.

## Tests réellement effectués

Chrome headless, nouveaux profils isolés ; interactions dans le jeu avec Playwright. Ces tests ne remplacent pas une évaluation du plaisir par une joueuse.

1. Parcours sans injection d’état : création, déplacement jusqu’au PC, sélection d’un show, préparation, rangement, rechargement de sauvegarde, départ, connexion, live de 60 secondes, intensité, fondu, pause et audio, bilan, retour au studio et réutilisation du setup. Réussi, aucune erreur JavaScript capturée (`qa-modern.cjs`).
2. Reprise après rechargement en pause : temps et historique conservés, absence de double paiement, reprise, changement de vue et contrôle de pause visible à 800 × 600. Réussi (`qa-modern-resume.cjs`).
3. Cinq ateliers joués via leurs contrôles au niveau 1. Quatre mauvaises tentatives refusées, cinq réussites, argent et énergie inchangés, compétences et préférence du bureau conservées après rechargement. Réussi (`foundations-workshops.json`).
4. Cas synthétiques dans le navigateur pour isoler la formule : 91 points avec installation/intensité à 90 et fondu, toujours 91 avec statistiques et bonus gonflés, 81 sans fondu, zéro sans signal ou sans durée jouée. Réussi (`foundations-score.json`). Ce contrôle n’est pas une partie complète.
5. Cinquante reconstructions de scène : 345 géométries et 20 textures à chaque mesure (`foundations-resources.json`). Cela vérifie cette fuite précise, pas toutes les ressources du jeu.
6. Captures examinées : atelier mapping et préparation compacte à 1440 × 900. Vérification syntaxique des scripts modifiés. Lanceur CheckOnly : serveur local prêt, lancement graphique du raccourci non retesté.

## À essayer personnellement

Recharger le jeu puis choisir un show sur l’ordinateur. Vérifier si la prochaine action se comprend sans guide. Essayer un atelier, fermer et revenir. Juger le rythme, le plaisir et le confort avec ton écran et ta souris.

## Limites et suite

- Ce n’est pas encore la réalisation complète des huit phases de l’audit ni une version certifiée commercialisable.
- Le parcours testé couvre le contrat complet et les ateliers, pas dix minutes continues observées avec une vraie débutante.
- Les niveaux 2 et 3 des ateliers sont implémentés mais n’ont pas encore été joués dans cette vérification. Le tracé de contour nécessite actuellement un pointeur.
- Les ateliers sont des exercices 2D ; le studio reste en 3D. Les vrais modèles distincts pour tout le catalogue, animations de tenues et nouveaux décors ne sont pas livrés ici.
- La finance historique, les loyers mensuels et l’ancien calendrier ne sont pas encore unifiés avec le temps continu du studio. Les progrès de certains anciens guides restent globaux au navigateur.
- Les anciens incidents statistiques sont désactivés pour les nouvelles sessions ; leur remplacement complet par des pannes physiques réparables reste à faire.
- L’intégration des futurs clips, les droits commerciaux des médias existants, les performances sur plusieurs machines et l’équilibrage long de carrière restent à vérifier.
