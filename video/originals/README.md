# Pack original — VJ Simulator

Six animations procédurales créées pour ce projet avec le script `tools/build-original-clips.py`. Aucun média tiers n’est incorporé à ces six animations. Les anciens clips du jeu sont conservés séparément et gardent leurs propres conditions.

- Aurore : warm-up, ambiance douce.
- Rubans : break, respiration.
- Orbites : groove, composition centrale.
- Grille : montée, perspective.
- Tunnel : peak, profondeur géométrique.
- Prisme : peak, motifs radiaux.

Format : MP4 H.264, 1280 × 720, 30 images/s, 8 secondes, sans piste audio. Les animations sont cycliques ; la dernière image est le pas précédant le début, sans image terminale dupliquée. Le saut numérique au raccord est comparé aux variations entre images ordinaires par `tools/check-original-clips.py`.

Les six clips sont ajoutés après les trois existants afin de conserver les indices des anciennes sauvegardes. Ils sont accessibles dans Resolute 8 sans achat de pack. Vignettes JPG et catalogue manifest.json inclus.
