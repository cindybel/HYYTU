# Clips originaux — vérifications

Six MP4 créés localement, H.264, 1280 × 720, 30 fps, 8 secondes, 240 images chacun, sans audio. Générateur reproductible conservé dans tools/build-original-clips.py.

Vérifiés : décodage intégral FFmpeg ; raccord comparé numériquement aux écarts entre images adjacentes ; six sélections et fondus par les boutons de Resolute 8 ; passage à la fin puis retour au début pour chacun ; dimensions et durée dans Chrome ; aucune erreur JavaScript. Installation du contrat injectée dans un profil de test isolé : ce test vise les médias et le mélangeur, pas un nouveau parcours de carrière complet. Captures de projection enregistrées et capture Orbites examinée visuellement.

Correction associée : après transfert preview/programme, le retrait du nœud vidéo pouvait interrompre sa lecture dans Chrome. Reprise au prochain rafraîchissement, en respectant la pause et le mode visuels fixes. Les six transferts vérifiés continuent à lire.

Rapports : original-clips-encoding.json et original-clips-playback.json. Les anciens médias et les indices des sauvegardes sont conservés. Aucun achat requis pour ce pack.
