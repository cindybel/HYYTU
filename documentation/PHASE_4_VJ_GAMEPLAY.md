# Phase 4 — VJ Gameplay

État : la régie live possède maintenant davantage de décisions visuelles réellement observables.

## Changements

- Ajout de quatre traitements qui modifient directement le programme diffusé : saturation, rotation de teinte, zoom/crop centré et miroir horizontal.
- Les effets sont calculés sur le canvas programme ; ils ne sont pas de simples statistiques de menu.
- Les effets s’appliquent pendant un fondu aux deux sources du mix.
- Le blackout reste prioritaire et coupe réellement le rendu.
- Les réglages live sont sauvegardés dans la reprise de prestation avec le clip programme, la preview, l’intensité et le fondu.
- Les réglages sont restaurés après un rechargement.
- Le compteur `effectChanges` est enregistré pour permettre aux phases suivantes d’observer la pratique sans donner de points automatiques.
- Le fondu utilise maintenant une composition source-over plus prévisible au lieu d’un mélange additif systématique.

## Principe de score conservé

Les nouveaux effets ne donnent aucun bonus simplement parce qu’ils sont utilisés. La réussite reste liée aux gestes demandés par la session : signal, cadrage, intensité et fondu. Une phase ultérieure pourra vérifier un effet seulement lorsqu’un brief le demande explicitement.

## Validation

GitHub Actions `Foundation checks` : succès sur le commit des nouveaux contrôles. La vérification couvre notamment la syntaxe JavaScript et l’intégrité des assets chargés par la page.

## Suite

La phase Progression va transformer certains apprentissages prouvés en capacités visibles dans la régie, afin que progresser ouvre des possibilités au lieu d’ajouter seulement un chiffre.
