# VJ Simulator — Audit complet et plan de production

14 septembre 2026 — version examinée : **modern-20260914**

Projet : `C:\Users\VJs DMTeam\Documents\01_JEUX_ET_SIMULATIONS\jeu vj simulation`

**Diagnostic : un prototype jouable étendu, pas encore un jeu indépendant premium prêt à vendre.** Le mapping, la séparation preview/programme, les fondus et la sauvegarde de prestation constituent de bonnes fondations. Mais la carrière promet davantage de variété que la performance ne permet actuellement d’en jouer.

Le problème principal n’est pas le manque de menus, d’articles ou de contrats : c’est leur faible effet sur les gestes accomplis, les images créées et les situations rencontrées. Ajouter du catalogue avant de résoudre ce lien augmenterait le travail sans améliorer suffisamment le plaisir.

Direction recommandée : **un simulateur de création de shows, incarné dans un petit monde 3D, où chaque progression débloque une possibilité visible et où les contrats évaluent des engagements compréhensibles.** La gestion soutient cette activité.

Aucun système du jeu n’a été modifié ou supprimé pendant cet audit. Seuls les documents, captures, inventaires et scripts d’inspection ont été créés.

## Méthode et niveau de preuve

- Lecture de l’architecture et des chemins principaux : scènes, fenêtres, contrats, catalogue, compétences, économie, mapping, personnages, vêtements, régies, horloge, sauvegarde et préférences.
- Extraction des données chargées : **159 articles, 30 contrats, 5 compétences de carrière, 3 personnages et 3 sources vidéo live**.
- Inspection rendue de l’accueil, du créateur, du studio, du bureau, de la préparation et ouverture des **13 applications du bureau**, dans Chrome 1440 × 900 avec une carrière isolée.
- Mesure courte de la scène et sondes ciblées des scores et ressources graphiques. Les injections d’état sont signalées ; elles ne remplacent pas des parties complètes.
- Les tests de live, pause/reprise, fondu et sauvegarde de la passe précédente sont consignés dans `MODERNISATION_2026-09-14.md`. Ils ne sont pas présentés comme rejoués intégralement dans cet audit.
- Aucune sauvegarde de la joueuse utilisée ou effacée. Aucune étude utilisateurs, écoute humaine complète, validation manette, carrière longue ni certification commerciale de droits effectuée.

Les preuves brutes sont dans `documentation/audit-2026-09-14/` : `static-inventory.json`, `runtime-catalog.json`, `runtime-audit.json`, `technical-probes.json`, captures et `CATALOGUE_159_ENTREES.md`.

## A. Audit du projet actuel

### A1. Architecture

| Domaine | État vérifié | Diagnostic |
|---|---|---|
| Application | HTML/CSS/JavaScript global, Three.js local, serveur Python. Pas de dépendances npm de production déclarées. | Prototype fonctionnel ; distribution et fabrication non préparées. |
| Code central | `main.js` : **8 627 lignes** ; `styles.css` : **5 697 lignes**. | Fort couplage entre affichage, règles, données et transactions. |
| Modules | Régie, carrière, catalogue, personnages, atelier, terrain, studio, départ, ambiance. | Bonne amorce de séparation, dépendances globales et ordre de chargement implicites. |
| Navigation | Classes du body, fenêtres DOM, panneaux plein écran, scène Three partagée. | Plusieurs méthodes coexistent ; focus et priorité des overlays à unifier. |
| Temps | Horloge studio ×12 ; carrière historique par `profile.day`. | Deux calendriers avec des effets différents. |
| Apprentissage | Atelier et terrain avec leurs progressions, plus cinq skills de carrière. | Absence d’une source de vérité unique pour la maîtrise. |
| Sauvegarde | Trois slots, copie précédente, état du live, rigs, tenue, départ. | Bonne base ; format produit, migration et export à construire. |
| Maintenance | Sauvegardes de code locales et scripts QA ; nombreux fichiers non suivis dans Git. | Historique de livraison et reproductibilité à établir. |

Références : `main.js:108`, `main.js:1480`, `main.js:1621`, `main.js:1950`, `career-runtime.js`, `studio-world.js`, `index.html:8` ; chemins relatifs à `src` sauf index.

**Ne pas changer de moteur immédiatement.** Isoler d’abord simulation, sauvegardes et rendu. Un essai comparatif limité pourra ensuite établir si animation, 3D et distribution justifient une migration. Une réécriture totale maintenant risque de perdre les acquis sans démontrer un gain de jeu.

### A2. Gameplay / performance VJ

La régie possède un programme, une preview, trois vidéos, trois durées de fondu, une intensité et un blackout. Le live dure 60 secondes sur quatre passages. Pause et reprise sont sauvegardées. Préparer sans diffuser puis mixer est un vrai geste à conserver.

Limites :

- Le clip n’est pas comparé à une palette, un logo ou une restriction de brief.
- Pas de pile d’effets ni de couches réellement routables dans le live de carrière.
- Pas de banque préparée spécifiquement pour le contrat.
- La bande-son pédagogique suit les consignes ; ce n’est ni une analyse audio ni une musique distincte par artiste.
- Le timing précis du fondu n’entre pas dans la note de carrière ; son nombre est enregistré. L’atelier possède ses repères de phrase séparés.
- Les mêmes quatre fenêtres d’intensité deviennent une séquence à mémoriser.
- Aucun comportement jouable de foule identifié dans les chemins examinés ; les messages sociaux ne démontrent pas une réaction simulée.

**Verdict : exercice interactif utile, trop étroit pour une carrière longue.** Sources : `live-show.js`, `live-soundtrack.js`, `academy.js`, `main.js:8169`.

### A3. Progression, difficulté et récompenses

Les 30 contrats ajoutent progressivement 1 à 3 projecteurs, formes, masques, contraintes de placement, matériel et limites de montage. Ces variations techniques ont de la valeur. Mais 30 noms de lieux ne représentent pas 30 décors : `buildGigScene()` utilise la même base.

Les cinq skills sont câblage, mapping, multi-projecteurs, pression live et plume. Trois niveaux, avec coûts. La « pratique gratuite » reste une consommation d’énergie qui peut augmenter les statistiques par clic. Le terrain enseigne davantage, mais ne remplace pas ce système partout.

Le niveau d’ouverture dépend notamment de la position du gig dans la liste : `ceil((index + 1) / 3)`, puis des conditions sociales, skills et équipement. Réordonner du contenu peut donc changer sa progression. Il manque des objectifs explicites de maîtrise et des déblocages visibles dans la console.

**Verdict : progression de données plus développée que progression de savoir-faire.** Sources : `main.js:706`, `main.js:4106`, `main.js:4784`, `simple-booking.js`, `field-school.js`.

### A4. Équipement, vêtements et catalogue

| Famille | Nombre | Réalité actuelle |
|---|---:|---|
| Matériel | 40 | 10 familles, quantités/location/conditions/bonus ; silhouettes de scène largement génériques. |
| Vêtements | 17 | Emplacements, teintes, matières et accessoires attachés aux os ; coupes de base conservées. |
| Packs visuels | 92 | Collection et conditions de carrière ; pas 92 banques ajoutées au live. |
| Logements | 10 | Effets de carrière et loyer ; pas 10 intérieurs distincts. |

Les fiches produit sont en HTML/CSS. `createProjector(x,z)` ne choisit pas une géométrie selon le modèle acheté. Les différences matérielles reposent surtout sur statistiques et conditions d’entrée, beaucoup moins sur des capacités observables.

Exemple : « StageCue Footswitch Duo » annonce un changement de clip mains libres ; aucune commande de pédalier correspondante intégrée à la régie n’a été identifiée. Les noms de sorties et d’appareils promettent parfois plus que le graphe de signal actuel.

Les effets portés sont dérivés, dédupliqués et plafonnés ; acheter ne donne pas directement une compétence permanente. À conserver. Mais faire dépendre un jugement artistique de possessions reste contraire à l’apprentissage par gestes.

La revue des **159 entrées**, avec prix, palier, location et effets déclarés, est fournie dans `audit-2026-09-14/CATALOGUE_159_ENTREES.md`. Elle ne certifie pas l’ajustement visuel de toutes les tenues sur toutes les animations.

Sources : `catalog-runtime.js`, `human-wardrobe.js`, `main.js:5220`, `main.js:5385`, `main.js:6841`.

### A5. Personnages / animation / direction artistique

Trois GLB, chacun avec un squelette et une animation nommée « Animation ». Le chargeur joue le premier clip. La capture du créateur montre les bras écartés : la présence d’une animation ne constitue pas un ensemble d’animations de métier.

Conserver Nova/Eli/Sam, les régions peau/vêtement et les accessoires liés aux os. Refaire poses détendues, assise, mains au contrôleur, branchement et manutention. Les options de coiffure et tenue doivent correspondre à des résultats visibles.

Les objets procéduraux simples, les personnages plus réalistes, les vidéos lumineuses, le bureau aux icônes dégradées et la console sombre n’ont pas encore une finition commune. Ajouter des néons ne résout pas cette rupture.

Sources : `characters.js`, `human-wardrobe.js`, `studio-set.js`, capture `02-creator.png`.

### A6. Interface / onboarding

Le studio et les objectifs de proximité incarnent mieux l’entrée. La vue salle améliore la visibilité du live. Mais ouvrir le PC expose immédiatement **13 applications**, des doublons dans le dock et la barre supérieure ; Sessions et Booking ouvrent le même écran.

La préparation du premier show reste un long formulaire : brief répété, seuils, location, choix de préproduction, conseils et sélecteurs. « Me lever de l’ordinateur » se superpose visuellement à la zone Retour du setup. Dans le créateur à 1440 × 900, le champ de nom et le sélecteur de couleur se chevauchent.

**Verdict : des améliorations locales, mais une interface encore composite.** Il faut une action principale, une méthode de retour et des détails facultatifs par étape.

### A7. Économie / temps

Carrière isolée inspectée : 75 $ de départ ; premier contrat à 364 $ ; transport 40 $ ; 35 $ restants avant paiement ; net nominal 324 $ si le cachet est intégralement payé. Ce sont des valeurs de jeu, pas des tarifs professionnels.

La location vaut généralement environ un tiers de l’achat, avec minimum. Les paliers reposent sur prix, seuils et bonus ; aucune simulation de longue carrière n’établit leur équilibre.

Loyer/prêts sont traités dans `advanceDay()`. Les sessions modernes n’exigent plus cet avancement, mais peuvent consommer l’énergie quotidienne et augmenter la fatigue. L’horloge studio ne règle pas cette contradiction. Les contraintes anciennes risquent de ramener le joueur vers des menus qu’il ne comprend pas.

**Verdict : unifier le temps et simuler l’économie avant d’élargir la carrière.** Sources : `main.js:3464`, `main.js:3502`, `main.js:6110`, `main.js:8210`.

### A8. Feedback / clients / public / imprévus

Les retours d’intensité, le bilan par passage, les fondus visibles et l’éclairage musical servent réellement le joueur.

À l’inverse, câble trop court, ordinateur qui ralentit et demande tardive sont surtout des descriptions/pénalités tirées au départ. Les exercices terrain ne réparent pas directement ces événements dans les contrats. Les clients sont des archétypes de pondération ; le brief n’est pas encore vérifié sur le contenu affiché.

**Verdict : trop de conséquences comptables à la place de situations réparables.** Sources : `main.js:144`, `main.js:191`, `main.js:6170`, `main.js:8332`, `field-school.js`.

### A9. Technique / sauvegarde / performance

Studio, Chrome headless 1440 × 900, ratio pixel 1 : **600 images en 10,001 s**, environ **60 images/s**, p95 **16,9 ms**, aucune image au-delà de 50 ms. Environ **399 appels de rendu**, 9 782 triangles, 386 géométries et 23 textures. Cette mesure courte ne définit pas une configuration minimale vendable.

Sonde isolée : 12 reconstructions rendues du rig font passer les géométries de **374 à 693**, +29 à chaque reconstruction, textures stables à 20. `buildGigScene()` retire le groupe sans libérer ses ressources. Accumulation reproduite ; aucun crash long terme provoqué.

56 fichiers dans les dossiers de ressources inspectés, environ 395 Mio **sources de travail comprises**. Trois GLB d’environ 14–19 Mio ; une vidéo dépasse 35 Mio. Ce n’est pas la taille d’un installateur. Budgets, variantes optimisées et chargement progressif restent à construire.

La carrière dispose d’une copie précédente et d’un message d’échec. Atelier et terrain utilisent des clés globales séparées des slots : décider explicitement si l’apprentissage doit être partagé entre carrières. Migrations et export manquent.

Licences locales Three et Rocketbox présentes. Les preuves de droits commerciaux des vidéos et autres médias doivent être rassemblées avant publication ; une preuve absente du dossier ne signifie pas une utilisation illégale.

## B. Problèmes classés

| ID | Gravité | Problème / preuve | Effet joueur |
|---|---|---|---|
| C1 | CRITIQUE | 92 packs, trois sources live fixes. | Achats et progression ne diversifient pas suffisamment le show. |
| C2 | CRITIQUE | Même performance mesurée, ajout d’un pack : note **85 → 87**, artistique **84 → 89**. | Possession récompensée sans changement d’image. |
| C3 | CRITIQUE | Temps continu et énergie/finance quotidiennes. | Incohérence et blocages potentiels. |
| C4 | CRITIQUE | Imprévus surtout traités en pénalités. | Frustration plutôt que diagnostic. |
| C5 | CRITIQUE avant release | Géométries accumulées lors des reconstructions. | Dégradation possible des sessions longues. |
| C6 | CRITIQUE avant release | Distribution, migrations et inventaire des droits non finalisés. | Produit non prêt à publier. |
| I1 | IMPORTANT | Même structure de live/décor derrière beaucoup de contrats. | Répétition. |
| I2 | IMPORTANT | 13 apps tôt, doublons, setup dense. | Désorientation. |
| I3 | IMPORTANT | Maîtrise et skills achetés séparés. | Apprentissage contourné. |
| I4 | IMPORTANT | Matériel sans capacités suffisamment distinctes. | Peu de stratégie. |
| I5 | IMPORTANT | Clients numériques, public sans réaction jouable identifiée. | Show sans destinataires crédibles. |
| I6 | IMPORTANT | Animation/tenues/décors encore disparates. | Crédibilité visuelle faible. |
| I7 | IMPORTANT | Progressions globales et slots, interfaces multiples. | Continuité inégale. |
| I8 | IMPORTANT | Parcours manette/remappage non complet. | Accessibilité limitée. |
| A1 | AMÉLIORATION | Pas de bibliothèque par show. | Préparation peu créative. |
| A2 | AMÉLIORATION | Pas de deux couches et quelques effets ciblés en live. | Expression limitée. |
| A3 | AMÉLIORATION | Peu de demandes incarnées et de spécialisation des contrats. | Mandats interchangeables. |
| P1 | POLISH | Langues mélangées, répétitions, chevauchements. | Finition et lecture faibles. |
| P2 | POLISH | « Gear solide » exige 14 alors que son bonus est plafonné à 12 dans le calcul. | Retour inaccessible. |

## C. Supprimer, simplifier, conserver, repenser

| Décision proposée | Systèmes | Justification |
|---|---|---|
| Conserver | Preview/programme, fondus, intensité, blackout, mapping, reprise, contrôle des frais. | Actions réelles et continuité utile. |
| Conserver avec finition | Studio, personnages, fenêtres, confort, exercices terrain. | Bons supports de l’expérience. |
| Simplifier | Bureau, setup, inventaire, finance, transport. | Trois entrées de départ ; détails à la demande. |
| Retirer du parcours principal | Sessions/Booking en double, skills par clic, lendemain obligatoire, stats permanentes. | Réduire les frictions sans effacer les données. |
| Suspendre comme promesse | Packs non jouables, logements sans lieu distinct, fonctions matérielles absentes. | Chaque achat doit avoir un résultat démontrable. |
| Repenser entièrement | Note artistique abstraite, pénalités non réparables, temps/énergie, capacités du gear. | Contradictions de fond. |
| Garder pour développement | God Mode et diagnostics. | QA utile ; accès public à décider avant release. |
| Différer | Monde ouvert, longues conduites, international, PTZ/Kinect, multijoueur. | Coût trop élevé avant validation du cœur. |

Retirer signifie remplacer un chemin après migration, pas effacer maintenant achats, sauvegardes ou fichiers. Prévoir conversion ou remboursement en monnaie de jeu des possessions sans équivalent.

## D. Direction artistique cohérente

**Un atelier visuel montréalais, du backstage chaleureux à la scène électrique.** Réalisme stylisé, proportions crédibles, silhouettes lisibles ; détail concentré sur les objets regardés et manipulés.

- **Studio :** graphite, bois chaud, textiles, petites sources pratiques, affiches d’événements, traces d’usage. La nuit ne cache pas les commandes.
- **Backstage :** métal peint, câbles attachés, étiquettes de signal, caisses, ruban de repérage et lumière de service. Le décor explique le travail.
- **Club :** architecture reconnaissable, projection dominante, public périphérique et lumière de spectacle maîtrisée.
- **Interface :** anthracite `#111820`, blanc chaud `#EEEAE1`, turquoise `#70D9C5` pour l’action, ambre `#EAC28A` pour l’attention, corail `#EE887A` pour un incident. Jamais la couleur seule pour informer.
- **Typographie :** une famille sans sérif lisible ; chasse fixe pour temps et signal. Corps cible 16 px à 1080p, secondaire rarement sous 14 px ; taille ajustable et validation sur écran de jeu.
- **Iconographie :** symboles métier communs aux scènes et écrans. Éviter les initiales décoratives qui obligent à lire chaque bouton.
- **Mouvement :** transitions courtes qui orientent ; version instantanée propre en mouvements réduits. Aucun flash nécessaire pour comprendre.
- **Personnages :** poses détendues, silhouettes choisies, streetwear technique cohérent ; pas de LED et brillance systématiques.

Règle de finition : un objet doit être reconnaissable sans son étiquette et une action principale sans lire tout le panneau. Les travaux graphiques dépendent des capacités et lieux retenus ; lots P12–P14 du registre.

## E. Nouvelle boucle de gameplay

```text
Brief concret
→ banque de visuels et setup
→ arrivée dans un lieu reconnaissable
→ connexion, cadrage, soundcheck
→ performance avec choix et demandes
→ incident compréhensible et réparable
→ bilan utile
→ récompense réellement utilisable
→ prochain contrat / amélioration visible
```

### Première tranche de 20–30 minutes proposée

| Temps cible | Expérience | Choix / résultat |
|---|---|---|
| 0–3 min | Studio, identité rapide, premier contrat suggéré. | Trois visuels, une sortie ; la gestion attend. |
| 3–6 min | Extrait musical et préparation. | Choisir calme, énergique et secours ; setup prêté compatible. |
| 6–10 min | Installation. | Sortie → entrée, cadrage simple, mire puis signal valide. |
| 10–15 min | Show de 2–3 minutes. | Fondu, montée, break, demande DJ annoncée. |
| 15–17 min | Bilan. | Une réussite, un point concret à travailler, un média ou outil nouveau. |
| 17–25 min | Variante ou essai libre. | Reprendre le setup, autre brief, un imprévu simple. |

Durées de conception à mesurer avec des débutants, pas durées actuelles ni test validé.

### Choix qui méritent d’exister

- Clip plus énergique ou composition calme pour laisser sa place à l’artiste.
- Fondu anticipé ou coupe assumée sur un moment précis.
- Garder une couche lisible ou ajouter une texture/logo avec un coût de calcul connu.
- Louer une deuxième sortie ou concevoir un bon show sur un écran.
- Garder le programme de secours pendant le remplacement d’un média absent.

Évaluer les engagements : logo visible dans la zone, restriction de flash respectée, signal stable, intensité attendue sur un passage annoncé. Une création inhabituelle mais conforme reste valable. Le timing peut recevoir un encouragement sans transformer chaque coupe hors repère en faute.

## F. Progression professionnelle détaillée

| Étape | Compétence prouvée / contrat | Capacité débloquée | Objectif | Priorité / dépendances |
|---|---|---|---|---|
| Studio / garage | Premier mix et signal lisible. | Banque sauvegardée, secours, fondu. | Court : finir sans guide. | P0 ; P03–P06. |
| Petit bar | Énergie et visibilité de l’artiste. | Un effet, palette de show, contrôleur simple. | Court : demande annoncée réussie. | P0 ; P05–P08. |
| Club résident | Plusieurs ambiances, panne simple. | Deux couches, presets, deuxième sortie. | Moyen : deux briefs différents maîtrisés. | P1 ; P06–P10. |
| Salle / marque | Logo, zones, timing et validation. | Masques sauvegardés, routing, cue de logo. | Moyen : répétition puis show conforme. | P1 ; P08–P11. |
| Petit festival | Plusieurs artistes/surfaces. | Compositions multiples, fiche technique, secours. | Long : continuité entre artistes. | P1 après les premiers lieux. |
| Grande scène | Charge, redondance, coordination. | Serveur de secours, plusieurs zones. | Long : production plus complexe, UI contextuelle. | P2 ; P09–P11, P15. |
| Tournée | Adapter le même projet aux lieux. | Projet transportable, variantes, relations suivies. | Long : cohérence entre dates. | Extension ; lieux et contrats profonds. |
| International | Rider/équipe/moyens variables. | Contrats spécialisés et prestige visuel. | Horizon de carrière. | Extension à coût de contenu très élevé. |

Objectif court toujours visible : **le prochain geste**. Moyen : **le prochain type de show**. Long : **la prochaine responsabilité professionnelle**.

Les compétences s’ouvrent sur des réussites observables, avec aide autorisée, puis se consolident par variantes. L’argent finance capacités et identité, il ne prouve pas la maîtrise. Pas de quota quotidien de clics. Toujours garder un essai libre et un petit contrat compatible après un échec.

## G. UI/UX écran par écran

Efforts et dépendances : P04–P06, P13 et P16 du registre ; changements de données après P01–P03. Aucun écran n’est supprimé pendant cet audit.

| Écran | Problème actuel | Proposition | Critère d’acceptation |
|---|---|---|---|
| Accueil | Promesse de session peu concrète. | Continuer le studio ; nouvelle carrière secondaire ; options présentes. | Une action pour reprendre sans perte de slot. |
| Créateur | Formulaire et pose ; chevauchement observé. | Nom + silhouettes, détails reportables, pose détendue. | Pas de chevauchement à 1280 × 720 / 1440 × 900. |
| Studio | Peu d’objets utilisables. | Ordinateur, setup, sortie avec même interaction. | Action et retour clairs pour chaque objet. |
| Bureau | 13 apps, dock/barre/icônes redondants. | Shows, Visuels, Réglages au départ. | Trouver le prochain show sans guide. |
| Sessions / Booking | Même écran, deux noms. | Une app Shows : Prêt / À préparer / Plus tard. | Trois propositions pertinentes, aucun doublon. |
| Guide | Architecture ancienne encore présente. | Aide liée à l’étape, glossaire, guide complet facultatif. | Explication courte qui mène au bon outil. |
| Contacts / Email | Canaux séparés pour relation peu jouable. | Fil de contrat : brief, question, confirmation, bilan. | Aucun message à chercher pour démarrer. |
| Préparation | Long formulaire et overlay concurrent. | Trois contraintes, banque, setup recommandé et coûts ; avancé replié. | Départ simple sans fiche technique entière. |
| Inventaire | Liste de possessions. | Vue sources → composition → sorties. | Comprendre l’élément manquant et sa fonction. |
| Shop | Catalogue déconnecté de fonctions. | Montrer capacité et démonstration avant stats/prix. | Chaque achat change le lieu ou la régie. |
| Logement | Achat sans nouveau lieu distinct. | Un atelier améliorable avant plusieurs adresses. | Usage et résultat visibles, sinon différer. |
| Transport | Détour administratif. | Résumé au départ ; défi seulement si problème réel. | Pas d’application obligatoire pour trajet ordinaire. |
| Installation | Commandes simultanées. | Connexion, cadrage, test, une étape active. | Débrancher/rebrancher correspond au signal montré. |
| Resolute 8 | Base utile, possibilités limitées. | Console commune entraînement/contrat, outils progressifs. | Preview indépendante, programme fiable. |
| Bilan | Note encore statistique malgré les conseils. | Preuves du brief, un conseil, récompense utilisable. | Le joueur peut expliquer son résultat. |
| Stats / Skills | Achat/accumulation de niveaux. | Carnet des gestes pratiqués et prochain défi. | Pas de maîtrise accordée pour un clic. |
| Finance | Dates incompatibles avec temps du monde. | Cachet, coûts, net et prévisions entre contrats. | Pas de prélèvement surprise pendant show/pause. |
| Music Player | Lecture importée distincte du guidage. | Séparer musique de contrat et écoute libre. | Aucune analyse BPM annoncée si absente. |
| Réglages / Pause | Contrôles pas unifiés partout. | Taille, remappage, volumes, sensibilité, confort et reprise. | Toutes les actions accessibles et lisibles. |

## H. Améliorations graphiques nécessaires

1. **Kit de lieu cohérent** : sol, architecture, backstage, points d’interaction, lumière de service et spectacle. Distances crédibles avant décoration.
2. **Objets de premier plan finis** : laptop, contrôleur, projecteur, connecteurs, flight case. Silhouette, pièces et matières distinctes ; même identité dans inventaire et scène.
3. **Pipeline personnage** : squelette de référence, animations métier, ajustement par silhouette, couches et collisions. Un manteau doit avoir une coupe de manteau, pas seulement des poches ajoutées.
4. **Public léger et expressif** : diversité limitée mais cohérente ; attitudes visibles de loin avant détails des visages.
5. **Éclairage et exposition communs** : projection lisible ; effets volumétriques facultatifs ; budgets mesurés.
6. **UI de métier harmonisée** : source, preview, programme et signal partagent leurs symboles partout.

Acceptation d’un asset : identifiable sans texte, bonne échelle, usage clair, coût de rendu mesuré, licence enregistrée. Difficulté élevée : P12/P14 ; public dépend de P11 ; budgets de P17.

## I. Systèmes manquants à forte valeur

À construire : **projet de show sauvegardé, vraie bibliothèque, console commune, briefs observables, graphe de signal, incidents réparables, progression par gestes, clients/public compréhensibles**.

À différer : éditeur nodal complet, codecs complexes, PTZ/Kinect et appareils exotiques, longues conduites, monde ouvert, réseau social autonome et multijoueur. Ce ne sont pas des conditions de réussite du premier show.

Les capacités professionnelles peuvent être simulées simplement : sorties, charge, résolution utile, secours. Ne pas réellement ralentir le PC du joueur pour représenter un GPU surchargé ; montrer une dégradation contrôlée et une cause explicable.

## J. Analyse détaillée des systèmes centraux

| Système | Conception cible | Conséquence observable | Limite |
|---|---|---|---|
| Performance | Deux decks, preview, une puis deux couches, intensité, cues. | Programme réellement modifié ; fondu validé à sa fin. | Pas de clone intégral d’un logiciel pro. |
| Clips | Palette, énergie indicative, logo, contraste, disponibilité ; banque de show. | Sa sélection se retrouve sur place. | Tags pour le brief, pas beauté universelle. |
| Effets | Teinte, crop/masque, une transformation lisible et presets. | Effet vu en preview avant diffusion. | Quelques outils profonds plutôt que dizaines de sliders. |
| BPM / timing | Tempo écrit pour les musiques du jeu, phrases, aide activable. | Retour de timing sur des repères connus. | Coupes créatives hors repère autorisées hors contrainte explicite. |
| Matériel | Sources, sorties, compatibilité, distances, charge et secours. | Splitter duplique un signal ; deuxième composition nécessite une autre capacité. | Simulation à la profondeur utile au jeu. |
| Contrats | Brief, lieu, ressources, phases, incident, récompense. | Stratégies différentes avec le même matériel. | Chaque contrat apporte une décision, pas seulement un seuil. |
| Clients | Quelques personnages récurrents et clarification courte. | Logo protégé, palette et restriction vérifiables. | Pas de dialogue généré nécessaire. |
| Public | Réactions aux phases et incidents perceptibles. | Attitudes, mouvement, orientation, sons ponctuels. | Ne juge pas arbitrairement un style. |
| Imprévus | Symptôme → indice → options → réparation → retour. | Secours maintenu pendant diagnostic. | Une panne maximum au début, jamais sans solution disponible. |
| Mapping | Surface, coins/keystone, sauvegarde, puis masques et sorties. | Crop et débordement visibles sur support. | Placement physique distingué de correction numérique. |
| Compétences | Preuves associées aux gestes réellement pratiqués. | Outils et contrats expliquent ce qu’ils demandent. | Aide/accessibilité ne suppriment pas automatiquement une réussite. |
| Carrière | Mandats distincts, relations, responsabilités. | Rappels clients et nouveaux lieux/rôles. | Pas de grind pour allonger artificiellement la durée. |

### Incidents exemplaires

**Câble trop court :** voir distance et longueur ; déplacer la régie, emprunter un câble adapté ou changer le placement ; coût et compromis explicites. Aucun raccord universel fictif.

**Média manquant :** preview en défaut, programme stable ; prendre le secours puis remplacer la source. La préparation devient utile.

**« Plus intense » :** une question distingue mouvement, présence du logo et luminosité. La réponse convenue est évaluée, pas le maximum de tous les curseurs.

### Familles de mandats

| Mandat | Contrainte | Geste |
|---|---|---|
| Bar / DJ local | Peu de surface, artiste visible. | Intensité et lisibilité. |
| Club électronique | Évolution musicale. | Transition de phrase. |
| Corporate / lancement | Logo, palette, zones interdites. | Composition et masques. |
| Rock / danse / théâtre | Moments précis. | Cues et breaks. |
| Mapping culturel | Géométrie physique. | Calibration et zones. |
| Petit festival | Changements d’artistes/surfaces. | Routing, presets et secours. |

## Registre des propositions : pourquoi, impact, difficulté, priorité, dépendances

**P0** : nécessaire pour prouver le cœur. **P1** : nécessaire à la démo représentative ou au produit réduit. **P2** : après validation. Difficulté F faible, M moyenne, E élevée, TE très élevée, intégration/tests compris. Estimations relatives, pas engagements de durée. Les détails des sections D–J sont des déclinaisons de ces lots.

| ID | Proposition | Pourquoi / impact joueur | Difficulté | Priorité | Dépendances |
|---|---|---|---|---|---|
| P01 | Isoler simulation, contrats, inventaire, rendu ; historique Git propre. | Comportements cohérents et changements fiables. | E | P0 | Inventaire. |
| P02 | Sauvegarde versionnée, migrations et tests. | Progression et achats conservés. | E | P0 | P01. |
| P03 | Temps et politique de sessions/repos/coûts uniques. | Fin des contradictions et contraintes cachées. | E | P0 | P01–P02. |
| P04 | Compétences fondées sur les gestes. | Apprendre ouvre une capacité réelle. | E | P0 | P02–P03, missions P08. |
| P05 | Projet de show et banque de médias. | Préparation et achats influencent le live. | E | P0 | P01–P02, droits P18. |
| P06 | Console commune atelier/contrat. | Transfert des gestes sans réapprentissage. | E | P0 | P01, P05. |
| P07 | Tempo, cues, fondus et trois effets utiles. | Expression et décisions musicales. | E | P1 | P05–P06, musique P14. |
| P08 | Briefs vérifiables et bilan sans note esthétique opaque. | Réussite compréhensible, créativité libre. | E | P0 | P01 et mesures P06. |
| P09 | Capacités matérielles et graphe de signal. | Une pièce débloque une stratégie. | TE | P1 | P01–P02, P05–P06. |
| P10 | Incidents réparables. | Imprévu utile plutôt que punition. | E | P1 | P08–P09. |
| P11 | Clients récurrents et public réactif. | Le joueur voit pour qui il joue. | E | P1 | P07–P08, animation P14. |
| P12 | Kit de lieu et objets finis. | Espace et manipulations crédibles. | E | P1 | Capacités P09, budgets P17. |
| P13 | Design system, navigation par tâche. | Moins de clics, de texte, d’overlays. | E | P0/P1 | P03, étapes P05–P08. |
| P14 | Animations métier, tenues et son. | Présence et finition constante. | TE | P1 | Squelette/pipeline, P12, droits P18. |
| P15 | Économie simulée et contrats spécialisés. | Choix d’achat, pas de grind obligatoire. | E | P1 | P03–P10. |
| P16 | Accessibilité/contrôles unifiés. | Parcours complet confortable ; manette testable. | E | P1 | P06, P13. |
| P17 | Cycle GPU, budgets, mesures multi-configurations. | Fluidité durable. | E | P0 fuite, P1 suite | P01, P12. |
| P18 | Droits, provenance, paquets et installation autonome. | Produit distribuable, promesse vérifiable. | E | P0 inventaire, P1 release | P02, P14, P17. |
| P19 | Tests avec débutants : compréhension et envie de rejouer. | Décisions fondées sur l’expérience réelle. | M récurrente | P0 | Boucle P05–P08. |
| P20 | Tournées, international, artistes avancés. | Horizon de carrière si le cœur mérite plus de contenu. | TE | P2 extension | P15, P19, budget de contenu. |

## K. Plan par phases

| Phase | Travail concret | Condition vérifiable pour continuer |
|---|---|---|
| **1 — Fondations** | P01–P03, fuite P17, inventaire P18. Extraire règles, états du contrat, temps et sauvegardes. | Ancien slot repris ; 50 reconstructions sans accumulation comparable ; règles temporelles cohérentes ; code traçable. |
| **2 — Gameplay principal** | P04–P05, P08. Banque, brief, installation, bilan, récompense dans un lieu. | Un débutant comprend sa préparation ; une décision change le résultat visible. |
| **3 — Performance VJ** | P06–P07, début P09–P10. Console commune, couches progressives, cues et incident. | Preview isolée ; reprise pendant fondu ; pas de score gagné par possession seule ; secours utilisable. |
| **4 — UI/UX et DA** | P12–P14, P16. Studio et lieu représentatifs, rig, gestes, interface et son. Lisibilité travaillée dès phase 2. | Cohérence de capture, commandes accessibles, action visible, confort réduit utilisable. |
| **5 — Progression et contenu** | P15, suite P04/P09. Contrats distincts, capacités, vrais médias, économie. | Carrières novice/moyenne/experte sans impasse ; achat et contrat ont un usage clair. |
| **6 — Immersion et carrière** | P11, transitions, petites relations récurrentes. | Réactions liées à des faits ; setup repris ; trajet ordinaire rapide. |
| **7 — Polish** | P19, corrections de tests, textes, animations, son, erreurs. | Essais sans assistance ; confusions majeures résolues ; envie de rejouer observée. |
| **8 — Optimisation / release** | P17–P18, configs, installeur, migrations, builds et boutique. | PC propre, sauvegardes robustes, performance mesurée, droits complets, annonces fidèles. |

### Périmètre réaliste

**Démo d’abord :** un studio, un lieu, trois missions liées, environ huit visuels distincts, console commune, panne réparable, bilan, récompense. Cible 20–30 minutes comprenant exploration/reprise, sans attente artificielle.

**Produit réduit à dimensionner après la démo :** hypothèse de quatre lieux, une douzaine de contrats distincts, 12–24 médias originaux/validés et un petit catalogue fonctionnel. Cibles de contenu, pas promesses de durée ou de vente. L’international n’est pas nécessaire à la première sortie.

Une petite équipe expérimentée a un travail de plusieurs mois, surtout en assets, animation, tests et finition. Sans budget, disponibilité et plateformes cibles, une date précise serait trompeuse. Une migration de moteur serait un chantier distinct, à décider par un essai limité.

### Premier lot concret proposé après l’audit

1. Figer une version de référence et des sauvegardes de test ; organiser le suivi Git et les exclusions du futur paquet.
2. Corriger la destruction des rigs, tester 50 reconstructions et obtenir un plateau de ressources.
3. Extraire `ContractState`, `ShowProject`, `Inventory`, `SaveRepository`, avec identifiants stables et sans perte de fonctions utiles.
4. Fixer une règle unique : temps vivant en jeu, pause explicite, contrats lancés volontairement, frais annoncés, aucune progression hors ligne imposée.
5. Migrer énergie/dates/apprentissages ; garder les possessions et contrats acquis.
6. Réduire le bureau initial et la préparation, avec fonctions avancées accessibles.
7. Relier trois banques réelles à trois briefs. Vérifier que la banque change la régie et que chaque récompense a une raison annoncée.
8. Remplacer l’artistique abstrait par brief et continuité ; recalibrer les paiements séparément pour ne pas ruiner l’économie des anciens slots.
9. Tester la tranche avec des débutants avant multiplication des lieux/appareils.

## Références commerciales 2024–2026

Il n’existe pas un standard universel « graphique 2026 » imposant photoréalisme, moteur ou multijoueur. Les repères utiles sont la clarté de la promesse, les manipulations, les conséquences visibles, la progression et la qualité d’usage.

- **Supermarket Simulator**, version complète en 2025 : chaîne explicite entre achat sur ordinateur, déballage, mise en rayon et expansion. Transposition proposée : relier menus, objets et résultats, sans copier son commerce. [Page officielle Steam](https://store.steampowered.com/app/2670630/Supermarket_Simulator/).
- **TCG Card Shop Simulator**, accès anticipé depuis 2024 : boutique, ouverture de packs, collection, événements. Transposition proposée : une collection doit alimenter une activité visible. Cela n’impose aucun hasard de récompense ni loot box au VJ Simulator. [Page officielle Steam](https://store.steampowered.com/app/3070070/TCG_Card_Shop_Simulator/).
- Steam examine page et build ; les fonctions futures doivent être distinguées de ce qui est disponible. Ce contrôle ne certifie pas le plaisir du jeu. [Steamworks — Review Process](https://partner.steamgames.com/doc/store/review_process).

Pages officielles consultées pour cet audit. Aucun de ces jeux n’a été rejoué ici ; ce n’est pas un comparatif visuel exhaustif. Les propositions sont une analyse originale du projet inspecté.

## Décision finale de production

Connecter **médias, brief, matériel, gestes et conséquences** dans une tranche courte et soignée est la priorité. Le nombre d’articles et les néons ne remplacent pas ce lien.

Le projet possède des fondations utiles. Il faut réduire certaines promesses, remplacer des règles abstraites et mesurer le plaisir avant de multiplier le contenu. L’objectif commercial devient crédible quand le joueur comprend ce qu’il apprend, voit ce qu’il crée et souhaite refaire le show avec une autre idée.
