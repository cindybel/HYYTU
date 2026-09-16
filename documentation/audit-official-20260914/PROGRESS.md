# Audit en cours — 14 septembre 2026

Projet officiel : vj-simulator-final-integration-audit. Aucun report dans l’ancien projet.

## Corrections réalisées et vérifiées

- Horloge et calendrier synchronisés ; sauvegardes conservées. Voir continuity-tests et données de test existantes.
- Banque fictive : compte, reçus, opérations, prêts, remboursements, frais, achats. bank-tests.cjs a passé ses 9 vérifications dans Chrome, sans erreur JavaScript.
- DMTEAM : les 159 articles, compétences au niveau 5, contrats accessibles et argent illimité ; profil voisin dmteam2 conservé à 75 $. dmteam-projector-tests.cjs passé.
- Projecteur du studio hors du mur, placé sur un support à 1,12 m ; capture inspectée.
- Contrat Party Garage joué jusqu’au bilan avec connexion, fondu et intensité en quatre phases. Dernier test : transport 45 $, cachet 431 $, solde final 461 $, reçu et sauvegarde contrôlés. Le cachet dépend des actions, ce montant n’est pas une constante.
- Bilan fondé sur les actions observables, progression +36 XP de câblage constatée lors du contrat.
- Académie sauvegardée par carrière, retour au studio accessible ; learning-tests.cjs passé avant les dernières modifications des décors.
- Garde-robe et étagère : ouverture et retour testés. 51 combinaisons de personnage/article vérifiées pour valeurs finies et absence de double bonus ; ce test ne certifie pas l’absence de toute collision pendant toutes les animations.
- Sept modèles d’accessoires et matériel créés ou différenciés, ouverts/fermés dans l’inspecteur 3D. Pas de doublon géométrique physique dans l’audit des 159 articles ; les collections numériques gardent leur format commun de pochette.
- Application Locaux ajoutée au bureau et au dock. Loyer, rangement, frais d’installation uniques, maquette, changement de lieu accessible même si déjà débloqué.
- locaux-tests.cjs : 7 contrôles passés, dont deux déménagements DMTEAM, préservation des objets/compétences, sauvegarde, frais bancaires en carrière normale et retour sans double facturation.
- Bureau défilable sur les écrans courts ; défaut reproduit en 1280×720 puis test réussi après correction.
- Première passe garage : échelle des briques, béton texturé, joints et prises. Captures inspectées.
- Les locations changent désormais l’habillage architectural : fenêtres hautes de sous-sol, grandes baies, éléments industriels ou panneaux acoustiques. rooms-tests.cjs a ouvert les 10 lieux via l’interface puis rejoint le monde 3D, sans erreur JavaScript. Trois captures inspectées.
- Notifications visuelles limitées à deux, historique conservé ; vérifié après dix déménagements rapides.
- Dernier npm test réussi : 34 ressources HTML présentes et 31 scripts syntaxiquement valides. Ce contrôle ne remplace pas les tests en jeu.

## Limites et travail à poursuivre

L’audit complet demandé n’est pas terminé. Ne pas présenter le jeu comme prêt à vendre ou son plaisir comme prouvé.

- Les dix locations ont maintenant des aménagements distincts et une vue extérieure (voir REPRISE-20260915.md), mais partagent toujours la même enveloppe et plusieurs postes interactifs. La qualité des personnages, des vêtements et le réalisme final restent à approfondir.
- Visite immersive ajoutée le 15 septembre : voir REPRISE-20260915.md. Les plans intérieurs partagés restent à différencier davantage.
- Les frais d’installation sont une dépense initiale unique, pas un dépôt remboursable. Le paiement mensuel continue à utiliser le système de loyer existant.
- Le catalogue Locaux affiche les aménagements construits et le taux réel de récupération au lit. Les autres présentations historiques du catalogue restent à réauditer. Le nouveau déménagement n’empile aucun bonus permanent en changeant de lieu.
- Les vêtements ont des accessoires attachés aux os, mais certaines tenues restent des recolorations de la géométrie du personnage. Vérifier les animations en mouvement et produire les vêtements manquants.
- Vérifier l’utilité réelle de tous les bonus d’équipement avec le nouveau score fondé sur les gestes, les plafonds et le retrait à la désactivation.
- Reste le parcours continu de dix minutes d’une débutante, les contrats avancés, pause/reprise live, accessibilité et régressions complètes.
- Continuer les phases sans solliciter une autorisation à chaque étape. Priorité demandée ensuite : réalisme 3D.

Les tests utilisent des contextes Chrome isolés ; la sauvegarde personnelle de la joueuse n’a pas été réinitialisée.
