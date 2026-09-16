# Refonte physique v4 — suivi vérifié

**Copie de travail : vjSIMUFINALE 2. Mise à jour : 16 septembre 2026.**

Référence : [PDF original conservé dans le jeu](../references/VJ_Simulator_Game_Design_Master_Refonte_Physique_v4.pdf). [Captures et résultats](apercu.html).

## Départ, rangement et manipulation — mise à jour du 16 septembre

- Nouvelle partie : bureau vide, laptop et paire de haut-parleurs à taille constante sur une étagère de trois niveaux (0,40 / 0,98 / 1,56 m). Câbles utilisables suspendus au mur, étiquetés.
- Le rack déjà présent est devenu un objet physique. Son ancien double décoratif est masqué. Le projecteur repose sur son plateau ; E prend le rack avec le projecteur, R les tourne ensemble. Prendre seulement le projecteur le sépare. Débrancher avant de déplacer.
- Laptop : une sortie VGA, une HDMI, alimentation, USB et jack audio. Premier projecteur VGA. Les petites enceintes n’exigent pas de secteur ; les actives doivent aussi être alimentées et allumées.
- Chaque laptop/tour/projecteur acheté fournit une multiprise, un câble secteur et une rallonge. Au départ : deux ensembles d’alimentation, prise double murale réelle, appareils éteints.
- E prend/pose ; molette, Page haut/bas ou boutons règlent la hauteur ; R/Maj+R tourne ; glisser la souris regarde à 360°. Pose validée sur le dessus solide du sol, bureau, établi, étagère ou rack. Le vert indique un contact valide.
- Un sac fermé s’ouvre au premier clic avec un objet en main ; un second clic le range si poids et volume le permettent. Annulation conserve le contenant d’origine.
- Les prises sont sur les côtés du laptop et derrière le projecteur. Les étiquettes ne capturent plus les clics des autres prises. Les fils sont fins avec une zone de sélection élargie.
- Projection d’atelier suivant la direction de l’objectif : alimentation et signal requis, écran devant le projecteur. Le guide en jeu contient les nouvelles commandes sans modifier le PDF original.

Les placements déjà faits par le joueur sont conservés. Le bureau vide concerne une nouvelle partie.

## Ce qui fonctionne

| Partie du PDF | Mise en place |
| --- | --- |
| 0–2 : univers et boucle de jeu | Pièces, personnages et navigation conservés. Ancienne prestation Resolute suspendue dans le parcours joueur. Préparation dans le garage, chargement, installation et bilan. |
| 3–4 : signal et standards | Instances distinctes, ports IN/OUT, VGA/HDMI/DP/USB-C/SDI, alimentation, état ON et input. Splitter miroir et matrice avec routage séparé de chaque sortie. |
| Câbles physiques | Prendre le câble puis cliquer ses deux prises. Fiches et gaine visibles, première extrémité reliée à la main. Déconnexion en prenant le câble. Longueur mesurée le long du trajet quand les modèles sont présents. |
| Contact avec le bureau | Trajets au-dessus du plateau et autour de ses bords pour rejoindre le sol. Anciennes lignes automatiques masquées. Prises des projecteurs à l’arrière, hors de l’objectif. |
| 5 : microphone | Micro filaire, XLR, console, micro sans fil et récepteur. Test reçu et vumètre. Alimentation, input et batterie vérifiés. |
| 6 : projection et mapping | Placement, orientation et keystone conservés. Contours dessinés à la souris. Le kit de repères aide seulement les clics proches des sommets ; il ne dessine pas le contour. |
| 7–8 et 15 : progression | 24 contrats en 8 paliers ; 15 noms de lieux réutilisant les familles de scènes existantes. VGA, HDMI, micro, sorties indépendantes, SDI, mapping et tours. |
| 9, 14 et 17.5 : équipement | Laptops ; tours nécessitant GPU, moniteur alimenté, clavier et souris USB ; convertisseurs alimentés ; carte SDI réservée à la tour compatible. Retrait des cartes hors tension et sorties débranchées. |
| Accessoires | Gaffer visible sur les câbles branchés et déplacement contraint ; lentille grand-angle montée sur l’axe de l’objectif, agrandissement de 25 %, retrait possible. |
| 10–13 : économie et identité | Prix et déblocages par gig, clips à 20–35 $ et points visuels à 1–5, bonus vestimentaires plafonnés, dress codes et sécurité. Location à l’unité au départ, revente à 50 %. |
| Clips et sorties | Sélection avant la gig. Une vidéo décodée par sortie source : un splitter duplique la même vidéo, des sorties indépendantes peuvent afficher des clips différents. |
| 16 : bilan | Validation du signal, surfaces, cadrage, keystone, mapping, audio, temps et préparation. Un prérequis obligatoire manquant empêche la réussite. |
| 17 : objets et transport | Positions et connexions persistantes, sacs ouverts pour ranger, poids ET volume contrôlés, chargement réel. Retrait des locations au retour en préservant les objets personnels. |
| 18–20 : intégration | Sauvegardes anciennes conservées avant migration, PDF intégré à l’application Guide et à Documents. Fenêtres testées à trois tailles ; titre et nom du joueur séparés en gig. |

## Vérifications exécutées

Chrome installé, profils de navigateur isolés ; les sauvegardes personnelles ne servent pas aux tests.

| Vérification | Résultat et portée |
| --- | --- |
| `node scripts/foundation-smoke.mjs` | 58 ressources HTML, 9 modules dynamiques et syntaxe de 64 fichiers JavaScript. |
| `node documentation/physical-v4/workshop-tests.cjs` | Pose sol/bureau/étagère, hauteur, vue 360°, sacs, projection orientée, coupure secteur et sauvegarde. |
| `node documentation/physical-v4/starter-pointer.cjs` | Six branchements par clics sur les prises, boutons d’alimentation et ouverture du laptop alimenté. L’installation est disposée par une fixture avant les clics. |
| `node documentation/physical-v4/storage-controls.cjs` | Prise réelle sur l’étagère et au mur, taille inchangée, rack unique déplacé avec son projecteur, séparation/repose et rechargement. |
| `node documentation/physical-v4/core-tests.cjs` | 15 cas de règles : alimentation, ports, longueur, sacs, tours, SDI, USB-C, RF, matrice, retrait GPU, gaffer. |
| `node documentation/physical-v4/cable-collision.cjs` | 6 trajets échantillonnés : aucun sommet de la gaine dans le plateau du bureau. |
| `node documentation/physical-v4/desk.cjs` | Géométrie réelle : VGA + deux alimentations sans intersection avec le plateau ; passage vers le sol capturé. |
| `node documentation/physical-v4/cable-pointer.cjs` | Clics réels sur câble et prises, mauvais connecteur refusé, sauvegarde/rechargement, gaffer, déconnexion et sac. |
| `node documentation/physical-v4/advanced.cjs` | Boutons de routage distincts, retrait GPU, lentille montée à la souris et démontée. |
| `node documentation/physical-v4/session.cjs` | Triangle tracé à la souris, repères non automatiques, contour conservé après rechargement, annulation sans perte des objets personnels. |
| `node documentation/physical-v4/campaign.cjs` | 24 installations techniques équipées par des fixtures, 8 situations d’échec, bilan/paiement, pause/reprise et vidéos décodées en miroir/indépendantes. |
| `node documentation/physical-v4/ui-audit.cjs` | 17 applications × 3 tailles = 51 fenêtres ; 70 modèles avec dimensions valides ; 17 pages du guide décodées ; prix de 92 entrées de clips. |
| `node documentation/physical-v4/hud-audit.cjs` | Nom, titre et boutons dans le cadre à 1440×900, 1116×717 et 960×600. |

Les fichiers `*-results.json` et les captures dans ce dossier contiennent les résultats. Les tests navigateur ci-dessus n’ont rapporté aucune exception JavaScript. La géométrie numérique seule ne prouve pas la qualité visuelle : les captures des câbles, de la lentille et du mapping ont aussi été examinées.

## À terminer ou à approfondir

La refonte entière n’est pas déclarée terminée, ni le jeu « parfait ».

1. Jouer une carrière complète avec le budget et les achats normaux. Les 24 fixtures fournissent l’équipement ; elles ne valident pas l’équilibrage économique ni la compréhension d’un débutant.
2. Généraliser l’évitement des câbles aux autres meubles et obstacles. Le correctif actuel connaît le bureau principal et le sol ; ce n’est pas un moteur universel de collision.
3. Compléter les variantes audio et leurs prix du PDF : kits RF basique/pro, console 8 canaux et sélection de véritables entrées multiples.
4. Développer les pannes et la fiabilité avancées, l’extérieur et ses contraintes. Les niveaux de qualité et l’usure existent ; toutes les conséquences prévues ne sont pas simulées.
5. Tester les stocks très volumineux et adapter le rangement : les quatre baies physiques offrent actuellement 36 emplacements standards. Le débordement des grandes collections reste à revoir.
6. Vérifier toutes les variantes de chaque page, les très longs textes et les autres tailles d’écran. L’audit des applications couvre leurs vues principales aux trois tailles indiquées.

## Lancement local

Le raccourci du Bureau **VJ Simulator - Refonte physique.lnk** cible `lancer-jeu.pyw` dans cette copie. Ce lanceur démarre ou réutilise le serveur local sur `127.0.0.1:5187`, vérifie la copie du jeu et ouvre le navigateur. Le serveur utilisé pour ces tests répond actuellement sur ce port. L’activation du raccourci par l’agent avait été refusée par le contrôle automatique ; le double-clic lui-même n’est pas revendiqué comme un test automatique réussi.

Après mise à jour du code : Ctrl+F5 dans le jeu. Les tests utilisent des profils isolés, jamais les sauvegardes du joueur.

## Sources de l’implémentation

- `src/physical-core.js` : objets, connexions et règles sans rendu.
- `src/physical-career.js` : catalogue, contrats, migration et guide.
- `src/physical-models.js` : modèles d’équipements complémentaires.
- `src/physical-cables.js` : prises, fiches, gaines et trajets.
- `src/physical-outputs.js` : médias par canal vidéo.
- `src/physical-storage.js` : taille réelle, étagères et crochets muraux.
- `src/physical-placement.js` : contact avec les surfaces et hauteur.
- `src/workshop-projection.js` : projection directionnelle et haut-parleurs dans le garage.
- `src/physical-v4.js` : intégration des interactions et de la carrière.
- `before/` : copies de fichiers avant la refonte physique.
