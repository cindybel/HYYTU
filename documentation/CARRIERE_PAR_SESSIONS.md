# Carrière par sessions — 14 septembre 2026

La voie principale passe de candidature → attente → lendemain → date de show à choix → préparation → prestation → déblocage. Les cartes proposent directement « Préparer ce show ». Le conseil du bureau renvoie au même parcours.

Les contrats ouverts restent filtrés selon les compétences, le matériel et les critères du client. Il n'y a plus de quota quotidien d'emails sur ce parcours. La sélection marque le contrat comme prêt pour une session, sans modifier la date de carrière ni dépenser d'argent. Transport et location restent affichés et débités au départ. Les paiements de show ne changent pas.

Une candidature existante peut être convertie en contrat jouable si le profil convient. Seule sa propre réponse en attente est retirée ; les autres demandes restent présentes. Les champs de date d'origine sont conservés, et la disponibilité immédiate est sauvegardée séparément. La préparation et le live déjà sauvegardés restent reprenables.

Le compteur de sessions progresse au bilan. Un lieu terminé peut être rejoué après un autre show ; la pratique libre reste immédiate et gratuite. Le calendrier et l'administration historique sont conservés en accès facultatif. Le temps ne défile pas automatiquement : les anciens prélèvements mensuels ne sont donc pas déclenchés par le lancement d'une session. Les statistiques de fatigue et la gestion détaillée existantes sont conservées ; leur conversion complète en système de sessions ne fait pas partie de cette correction.

Tests :
- `qa-session-legacy.cjs` : ancienne candidature au jour 29, date de contrat au jour 40, loyer et prêt présents ; conversion, rechargement, date et solde inchangés, autre candidature intacte.
- `qa-session-shows.cjs` : création par l'interface, préparation immédiate sans débit, rechargement, live de 60 secondes, bilan et accès au prochain show sans changer de jour. Test réussi : journée inchangée et prochain contrat disponible immédiatement.

Sauvegarde du code précédent : `.local-backup-sessions-20260914`.


## Studio 3D, après clarification

L'accueil « Jouer mon premier show » a été retiré. « Ouvrir mon studio » mène au garage 3D pour un profil existant, ou à la création du personnage pour une sauvegarde vide. Les exercices restent facultatifs depuis l'ordinateur. L'ancienne icône Calendar ouvre désormais les sessions ; son ancienne fonction de calendrier est conservée dans le code, sans bouton Next Day dans ce parcours.

Le garage existant est explorable à hauteur des yeux. ZQSD/WASD/flèches et boutons tactiles permettent de marcher ; glisser la souris tourne le regard. Une zone de proximité devant le bureau permet d'utiliser l'ordinateur avec E ou le bouton affiché. Le bureau, le lit et l'étagère ont des limites de collision simples. Le personnage et les vêtements restent disponibles dans les autres vues ; le déplacement du studio est à la première personne.

L'heure du monde avance à ×12 pendant le jeu actif dans le studio, sur l'ordinateur et pendant les gigs. Elle se sauvegarde avec la position et l'orientation. L'onglet inactif et l'écran d'accueil ne font pas avancer cette horloge. La lampe du studio varie progressivement selon cette heure. Cette horloge est distincte du calendrier économique historique ; elle ne déclenche pas encore les loyers ni une simulation de rendez-vous horaires. Les autres logements ne disposent pas encore d'intérieurs distincts.

`qa-studio-world.cjs` : création depuis le nouvel accueil, mouvement réel, accès ordinateur seulement à proximité, collision du bureau, retour dans la pièce, horloge et position retrouvées après rechargement, absence de Next Day dans Sessions. Capture `qa/qa-world-studio.png` inspectée. L'opacité sombre auparavant appliquée au bureau a été retirée dans la vue exploratoire. Le raccourci Windows a été adapté et vérifié avec `-CheckOnly`.
