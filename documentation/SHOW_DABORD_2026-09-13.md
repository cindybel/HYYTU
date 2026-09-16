# Départ « Show d’abord » — 13 septembre 2026

Le premier écran ouvre directement « Jouer mon premier show ». Les carrières sont conservées derrière « Retrouver mes carrières ». Aucun achat, profil, email ou calendrier n’est requis pour jouer ce premier mix.

Le joueur envoie deux visuels, réussit un fondu et règle une montée. Une composition Prisme devient disponible et reste acquise après rechargement. Un mini-show de 90 secondes suit quatre moments : warm-up, montée, peak, break. La sortie occupe la majorité de l’écran, les réglages apparaissent progressivement et les explications sont facultatives.

Un accompagnement synthétique original ajoute des accords à la pulsation à 120 BPM. La qualité sonore sur le matériel réel reste à écouter ; aucun test auditif humain n’est revendiqué.

Le parcours de terrain contient un exercice visuel de sortie HDMI et cadrage, un dépannage de câble sous contrainte budgétaire, puis une demande client à clarifier avec aperçu de composition. Ce sont des exercices simplifiés : le câble et les tarifs appartiennent au scénario, le trapèze utilise un seul réglage, les critères de composition suivent le brief plutôt qu’un jugement universel de beauté.

Les réussites sont enregistrées localement dans vj-field-learning-v1, séparément des profils de carrière. Les missions suivantes se débloquent sans achat. Le premier contrat renvoie vers la carrière existante, avec création du VJ si nécessaire. La pression live et la variété des imprévus restent à approfondir.

Tests effectués :
- qa-field.cjs : premier fondu réel, déblocage du garage, absence de signal, mauvais trapèze, cadrage réussi, mauvais choix de câble, solution budgétée, clarification client, persistance. Le déblocage énergie utilisait une fixture isolée dans ce test uniquement.
- qa-academy.cjs : défi musical de 90 secondes joué réellement, quatre moments, énergie 97/100, déblocage énergie vérifié, reprise et sauvegarde ; aucune erreur JavaScript.
- qa-live.cjs : contrat existant joué 60 secondes, score 78, paiement 358, aucune erreur JavaScript.
- qa-quick-resume.cjs : checkpoint isolé à 32 secondes repris à au moins 33 secondes via le nouveau bouton principal.
- Captures du départ et du garage examinées.

Le plaisir, la facilité pour une vraie débutante et la durée de découverte de dix minutes ne sont pas prouvés par ces tests automatisés. Un essai utilisateur reste nécessaire. L’ajustement des vêtements, le catalogue 3D complet, la traduction et les cours avancés restent incomplets.

Validation finale : qa-first-show.cjs a joué le départ simplifié et le mini-show complet de 90 secondes, vérifié Prisme après rechargement et l’accès aux carrières, sans erreur JavaScript. qa-quick-bilan.cjs a vérifié séparément, avec un checkpoint isolé à 89 s, le bilan court et le bouton vers le garage. Capture qa-quick-bilan.png examinée.
