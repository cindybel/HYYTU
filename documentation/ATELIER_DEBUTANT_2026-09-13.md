# Atelier débutant — livraison et validation du 13 septembre 2026

## Modifications
- Atelier accessible depuis l’accueil et le bureau sans créer ni payer un contrat.
- Quatre étapes : préparation, fondu, intensité, repères à 120 BPM.
- Démonstrations, validation des gestes, explications consultables, pratique libre.
- Trois compositions procédurales originales (courbes, perspective et mosaïque), pas de média externe dans cet atelier.
- Défi de 90 secondes : trois ambiances, consignes explicites, bilan et reprise immédiate.
- Note : respect de l’intensité (70 %) et au moins un fondu à ±350 ms d’un repère de huit temps (30 %). Pas de jugement de beauté.
- Pulsation synthétisée et repère visuel basés sur la même horloge audio. Il s’agit d’un exercice préparé, pas d’une détection de musique importée.
- Sauvegarde séparée vj-simulator-academy-v1 : étapes, meilleur résultat, nombre de prestations et défi en cours. Les sauvegardes de carrière sont conservées.
- Pause et reprise après rechargement ; réduction des mouvements, volume atelier et navigation clavier native avec maintien du focus dans la fenêtre.
- Volume des boutons séparé de la musique dans les réglages de carrière.
- Correction du temps de montage perdu au retour au bureau ; rendu explicite de la vidéo lors de la reprise d’un live déjà terminé.
- Bilan carrière : intitulés plus précis, retrait du reproche automatique lié au matériel débutant.
- Fiches de packs : suppression de la promesse inexacte de génération procédurale dans la régie de carrière. Les packs existants ne sont pas supprimés.

## Vérifications exécutées dans Chrome isolé
- qa-academy.cjs : gestes du tutoriel, défi joué pendant 90 secondes, bilan, recommencer, pause, persistance des étapes et pratique libre.
- qa-academy-resume.cjs : rechargement à 2,58 s, reprise à 4 s ; musique à zéro et boutons à 60 indépendants ; aucune erreur JavaScript.
- qa-preview.cjs : création, préparation (5000 → 4960), absence de paiement sans live, sauvegarde du profil, contrôle de largeur mobile ; aucune erreur JavaScript.
- qa-live.cjs : live carrière joué pendant 60 s, fondu et blackout, note live 99, résultat carrière 77 et paiement 355 ; aucune erreur JavaScript.
- qa-career-resume.cjs : temps de montage conservé, reprise live sans double débit, pixels vidéo présents après restauration d’une prestation terminée ; aucune erreur JavaScript.
- Captures qa-academy.png et qa-academy-result.png examinées visuellement.

## Limites explicites
- Ces essais automatisés ne remplacent pas un test avec une vraie débutante. La durée de dix minutes pour une découverte humaine n’est pas validée.
- Le son est une pulsation pédagogique, pas encore une bande musicale complète. Qualité d’écoute et latence matérielle non validées à l’oreille.
- L’atelier est distinct de la carrière : ses leçons ne remplacent pas encore les compteurs de compétences et ne débloquent pas des contrats.
- Le catalogue complet et les tenues 3D restent à finaliser. Les packs de carrière ne fournissent pas chacun un clip réel au mixer.
- Les anciennes sources vidéo de carrière conservent leurs questions de droits ; aucun changement à leur contenu.
- L’atelier est en français. Traduction complète, réglage de latence, couches/fusion et cours avancés restent à réaliser.
- Aucune revendication de compatibilité mobile ou de performance commerciale. Le mode réduit de l’atelier fige les motifs et conserve les fondus ; les médias de carrière demandent un audit séparé des flashs.

## Essai utilisateur recommandé
Ouvrir Mon premier mix, suivre les quatre étapes sans aide, jouer le défi, lire le conseil, recommencer et recharger au milieu d’un essai. Noter où l’objectif ou le vocabulaire n’est pas clair. Écouter la pulsation sur le dispositif réellement utilisé.
