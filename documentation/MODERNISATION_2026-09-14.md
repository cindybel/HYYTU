# Modernisation du studio et du live — 14 septembre 2026

## Livré

- Intérieur privé séparé visuellement du lieu de spectacle : mur et panneaux de bois, fenêtre de nuit illustrée, affiches originales, lampe et objets de bureau. Géométrie procédurale Three.js ; aucun nouvel asset téléchargé.
- Caméra du studio à 72 degrés, regard horizontal et vertical à la souris, sensibilité réglable. Orientation sauvegardée. Commandes secondaires repliées.
- Vue « salle » par défaut pendant le live : projection plus grande, régie compacte, boutons de montage masqués pendant cette vue. « Régie complète » retrouve les panneaux existants. Les commandes de sortie restent accessibles.
- Bande-son synthétisée localement à 120 BPM sur la même chronologie que les quatre passages. Le break retire le kick, la montée ajoute des notes. Interrupteur facultatif dans « Pourquoi ? », volume musical du profil respecté. La bande-son s'efface lorsqu'une musique du lecteur existant est active. Aucune analyse de cette musique importée.
- Éclairage du lieu suivant les phases musicales, sans attribuer de note esthétique. Modulation lente et limitée désactivée avec mouvements réduits ou visuels fixes.
- Pause/reprise : arrêt du temps du live, de l'horloge du monde pendant cette pause et du son synthétisé. Pause automatique si la page est masquée. Reprise sauvegardée sans nouvelle facturation.
- Retour d'intensité immédiat et historique par passage : le bilan peut indiquer le nombre de secondes dans la zone attendue au passage le moins maîtrisé. L'ancien calcul économique reste préservé.
- Dernier setup réutilisable après vérification des choix disponibles et des frais. Une sélection identique déjà regroupée peut aller directement à la sortie. Le premier regroupement reste nécessaire. Changement de prix ou matériel absent : révision, aucun débit.
- Mise à jour du guide de départ et du raccourci vers `?build=modern-20260914` sur la même origine.

## Tests réellement effectués

Chrome headless / Playwright, profils isolés. Aucune sauvegarde de la joueuse effacée ou modifiée par les tests.

| Script | Résultat observé |
| --- | --- |
| `qa-studio-world.cjs` | Réussi : marche, collision du bureau, ordinateur, temps et position sauvegardés, aucun bouton Next Day dans les sessions. |
| `qa-modern.cjs` | Deux passes réussies : nouvelle carrière, trajet physique, regroupement, rechargement, départ, live de 60 secondes, un fondu, retours d'intensité, bilan, retour 3D, réutilisation du setup proposée. Aucun état de carrière injecté. |
| `qa-modern.cjs`, contrôles audio | Signal Web Audio mesuré non nul ; silence mesuré pendant la pause. Temps du live et du monde figés. Ne constitue pas une écoute humaine de la qualité du mix. |
| `qa-modern-resume.cjs` | Réussi, puis répété après ajustement responsive : reprise en pause après rechargement, historique conservé, aucun second débit, bascule salle/régie et capture à 800 × 600. |
| `qa-modern-camera-setup.cjs` | Réussi : regard vertical à la souris et persistance après rechargement ; même setup déjà regroupé reconnu et sauvegardé. Interaction de regroupement appelée avec des coordonnées de test pour isoler cette vérification. |
| `qa-journey-guards.cjs` | Réussi : changement de prix et matériel indisponible bloquent le départ sans débit. États de test injectés. |
| `qa-session-legacy.cjs` | Réussi : contrat ancien en attente utilisable ; dates, autre demande, argent et prêt conservés. États de test injectés. |
| Lanceur `-CheckOnly` | `VJ_SIMULATOR_READY http://127.0.0.1:5173/`. |

Captures examinées : `qa-world-studio.png`, `qa-modern-live.png`, `qa-modern-small-screen.png`. Les scripts sont sous `documentation/qa/`.

## Limites et suite commerciale

Cette livraison n'est pas une version finie à vendre. Les décors utilisent encore beaucoup de primitives ; les autres logements ne possèdent pas tous un intérieur spécifique. Il reste notamment :

1. Modèles et animations de manipulation de câbles, projecteurs et portage ; personnages et dialogues de terrain.
2. Direction artistique finale des pièces, éclairage plus abouti, habillage et modèles uniques du catalogue. Les vêtements existants sont conservés, pas remplacés dans cette passe.
3. Davantage de lieux, contrats et possibilités créatives déblocables, avec équilibrage économique complet. Le calcul historique des bonus et revenus n'a pas été refondu ici.
4. Musique finale composée/mixée et écoute humaine ; la piste livrée est un accompagnement synthétique pédagogique. Les trois vidéos existantes restent en usage et leurs droits commerciaux restent à vérifier avant publication.
5. Réaffectation complète des touches, parcours clavier et manette de bout en bout, performances sur plusieurs configurations et installation autonome.
6. Démo de 20–30 minutes et tests avec de nouvelles personnes pour mesurer compréhension et envie de rejouer. La nouvelle boucle n'a pas été validée dix minutes consécutives dans cette passe ; les précédents tests de dix minutes concernaient l'ancien atelier.

Le plaisir et la qualité commerciale ne sont pas établis par les tests automatiques. La bande-son importée, si utilisée, continue de relever du lecteur existant et n'est pas analysée par les consignes.

Sauvegarde du code antérieur : `.local-backup-modern-20260914/`. Aucun commit ou publication effectué.
