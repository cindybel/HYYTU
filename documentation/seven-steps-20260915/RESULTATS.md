# Sept améliorations du jeu — 15 septembre 2026

## Livraison

1. **Premier contrat guidé** : aide contextuelle en six étapes, liée aux branchements, au cadrage, aux passages et au fondu réellement exécutés. Guide repliable, intégré à la régie pendant le live.
2. **Clients persistants** : confiance par lieu, retour par courriel, recommandation vers un prochain contrat accessible, bonus de 10 % sur une prochaine offre avec une confiance suffisante. Événements protégés contre les doubles récompenses et sauvegardés.
3. **Spectacles variés** : cinq directions (initiation, bar, club, festival et événement client), tempos de 96 à 140 BPM, quatre consignes d’intensité distinctes. Le brief annonce les exigences.
4. **Matériel utile** : les cinq ordinateurs produisent réellement de 640 × 360 à 1920 × 1080 pixels ; les six projecteurs changent la luminosité projetée. Aucune note gratuite ne remplace les gestes du joueur.
5. **Personnages** : caméra à la troisième personne optionnelle, marche articulée, bras abaissés, pieds repositionnés au sol, éclairage de proximité et collision du bureau. Les trois modèles existants sont conservés.
6. **Ambiance** : tempo de la bande-son et pulsation lumineuse liés au spectacle ; réaction sonore synthétisée lors du fondu. Les réglages de volume, pause et mouvements réduits restent applicables.
7. **Progression et économie** : contrôle d’un parcours depuis une nouvelle carrière jusqu’à deux prestations, avec une amélioration achetée entre les deux. Types de clients initialisés dès la création pour rester cohérents après rechargement ; aucune obligation vestimentaire dans les cinq contrats d’initiation. Premier projecteur amélioré à 280 $ pour garder une réserve de transport après le premier cachet dans le parcours testé.

## Vérifications

- `features.cjs` : trois personnages en marche, cinq profils musicaux, cinq résolutions, six niveaux de luminosité, persistance et idempotence des relations, perte du bonus après échec ; types de clients, budgets et exigences inchangés après rechargement des 30 contrats.
- `render-tests.cjs` : clips réellement décodés et dessinés aux cinq résolutions, pixels non noirs.
- `career-loop.cjs` : deux prestations de 60 secondes sans accélération, commandes par interface, paiements et achat, recommandation, pause/reprise et rechargement. Réussi : niveau 3, deux prestations, projecteur standard conservé, solde final 614 $. Résultat détaillé dans `career-loop.json`.
- Régressions : équipement, difficulté avancée, visites des dix logements et implantation/collisions vérifiés pendant cette livraison.
- `npm test` : 37 ressources HTML présentes et 34 scripts JavaScript valides.
- Captures inspectées : guide d’installation, guide en régie et personnages en marche.

## Limites précises

L’équilibrage vérifié porte sur le début de carrière, pas sur une traversée complète des 30 contrats. Les animations améliorent les personnages existants ; aucun nouveau personnage ou public cinématique n’a été ajouté. Le son a été rendu dans un WAV et vérifié numériquement, sans écoute subjective.

## Bureau

`C:\Users\VJs DMTeam\Desktop\VJ Simulator.url` ouvre `http://127.0.0.1:5181/`. Le serveur local doit être actif. La création du lanceur automatique a été refusée par le contrôle automatique avec le message générique « blocked by policy » ; le raccourci Internet a été créé et son contenu vérifié.

Les sauvegardes de code antérieures aux changements se trouvent dans `before/`. Les tests de navigateur utilisent des profils isolés et ne remplacent pas la carrière personnelle.
