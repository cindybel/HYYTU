# Parcours, choix des gigs et fenêtres — validation du 13 septembre 2026

## Changements de cette étape

- Le mini-show dure désormais 96 secondes : quatre passages de 24 secondes, alignés avec les repères de huit temps à 120 BPM. Les anciennes réussites sont conservées.
- Le premier écran projeté attend l’envoi du joueur ; la preview ne change pas cette sortie.
- Une reprise de show ne réactive plus les consignes des premiers gestes au premier fondu.
- Volume de l’atelier et mouvements réduits persistants. Un gain audio commun applique le volume aux notes déjà en cours.
- Choix des gigs : trois propositions accessibles au maximum, une proposition mise en avant, lieu, objectif pédagogique et cachet. Le brief technique reste dépliable.
- Candidature, réponse, confirmation et préparation accessibles depuis la même fenêtre. Une journée sans activité propose explicitement de se reposer puis passer au lendemain. Les règles de calendrier, coûts et paiement sont conservées.
- Les vues détaillées restent accessibles. Le raccourci booking ouvre désormais correctement l’application interne social, au lieu d’une fenêtre vide.
- Le bloc de prochaine étape est intégré au panneau du bureau à droite. Les chiffres détaillés sont repliés. Le bloc ne recouvre plus les icônes.
- Fenêtres déplaçables, boutons rectangulaires réduire/agrandir/fermer, retour depuis le dock après réduction, fermeture d’une fenêtre inactive sans fermer celle au premier plan.
- Les positions des différentes applications sont mémorisées dans les réglages. Le plein écran forcé de Booking a été retiré pour respecter le comportement de bureau demandé.
- Les boutons d’atelier appartiennent désormais au bureau et ne capturent plus les clics destinés aux fenêtres placées devant eux.

## Tests réellement exécutés

### Essai continu de 603 secondes
`documentation/qa/qa-ten-minute.cjs`, résultat détaillé dans `qa-ten-minute-result.json`.

Navigateur Chrome et stockage isolés : aucun accès aux sauvegardes personnelles.
- Premier envoi et second fondu, réglage d’intensité, déblocage de Prisme.
- Premier show complet de 96 secondes.
- Garage : absence de signal puis connexion et cadrage.
- Câble : mauvais choix puis solution dans le budget.
- Client : clarification, proposition incorrecte puis réglage conforme.
- Deuxième show complet, pause, rechargement et reprise ; aucune réapparition erronée du tutoriel pendant un fondu.
- Volume et mouvements réduits conservés.
- Création d’une carrière après l’apprentissage et pratique libre avec manipulations répétées jusqu’à dix minutes.
- Vérification finale des compétences et de la carrière après rechargement.
- Aucune erreur JavaScript.

Ce test est une session automatisée de fonctionnement et de stabilité. Les clics des exercices courts sont rapides et connus à l’avance : ce n’est pas une observation de vraie débutante, ni une mesure de plaisir ou de compréhension.

### Choix des gigs
`qa-simple-gigs.cjs` : choix limité, candidature réelle, passage au lendemain depuis la carte, confirmation au même endroit, conservation du montant lors de l’acceptation, accès à la vue détaillée et à la pratique. L’offre client est injectée dans le profil de test pour vérifier cette branche sans dépendre d’un résultat aléatoire. Aucune erreur JavaScript.

### Fenêtres
`qa-windows.cjs` : absence d’intersection entre le bloc d’aide et les icônes, ouverture via dock, déplacement à la souris de (72,66) à (172,126), réduction, restauration à (172,126), agrandissement/restauration, ouverture d’une seconde application, déplacement pour exposer la fenêtre arrière, fermeture de cette dernière et fermeture de la fenêtre active. Aucune erreur JavaScript.

Captures `qa-desktop-clear.png`, `qa-window-gigs.png` et `qa-simple-gigs.png` examinées visuellement. La barre de titre a été ajustée après détection de boutons partiellement coupés.

## Limites restantes

- L’expérience utilisateur doit encore être essayée par une vraie débutante, notamment choix du gig et compréhension du calendrier.
- La carrière conserve ses réponses différées et ses dates de contrat. Le bouton d’entraînement permet de jouer sans attendre ; il ne remplace pas un contrat rémunéré.
- L’apprentissage est enregistré séparément des anciennes statistiques de carrière. Il ne prouve pas une maîtrise d’un logiciel VJ professionnel.
- Le catalogue 3D complet, les vêtements, les cours avancés, la traduction intégrale et la variété des situations live restent incomplets.
- La musique synthétisée n’a pas fait l’objet d’un contrôle d’écoute humain sur le dispositif de l’utilisatrice.
- Les derniers ajustements de fenêtres et de Booking ont des tests ciblés séparés ; ils n’ont pas tous été présents pendant l’intégralité de la session de dix minutes.
