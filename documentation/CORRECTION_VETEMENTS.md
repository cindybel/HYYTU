# Correction des vêtements et accessoires — 13 septembre 2026

Cause : applyHumanAppearance ne mettait à jour que le portrait. Les matériaux des modèles humains et les choix du magasin n’étaient plus reliés. Les anciens clothingSlot mélangeaient également les casquettes, les casques et les hauts.

Modifications :
- Couleurs appliquées aux matériaux wardrobe_top, wardrobe_pants et wardrobe_shoes, sans recolorer les matériaux de peau.
- Texture textile désaturée pour permettre des couleurs lisibles tout en gardant son détail.
- Accessoires attachés aux os : casque, couvre-chef, masque, badge, éléments de tenue, poches, gants et bordures de chaussures.
- Essayage distinct de l’équipement enregistré ; fermeture de l’essayage restaure la tenue portée.
- Équipement par emplacement ; retirer un casque le retire visuellement et enlève ses bonus.
- Case casque à nouveau utilisable dans la création. Décocher retire aussi le casque équipé.
- Les changements de couleur restent visibles avec une veste équipée.
- Correction de la sélection de personnage pendant un chargement et libération des ressources de l’ancien modèle.
- Éclairage de présentation renforcé et ajustements de poitrine selon la silhouette.

Tests :
- qa-wardrobe.cjs : Nova, Eli, Sam ; changement cyan/magenta via les contrôles, case casque, ajout/retrait d’accessoires, sauvegarde de la silhouette et des couleurs. Captures des trois personnages examinées.
- qa-wardrobe-shop.cjs : 17 articles essayés par personnage (51 cas de liaison de données/rendu), boutons Essayer et Porter testés dans le magasin, essayage sans modifier l’équipement sauvegardé, casque porté conservé après rechargement, attache à un os, retrait visuel et retrait du bonus, persistance du retrait.
- Aucune erreur JavaScript dans ces tests. Profils de navigateur isolés.

Limites : les coupes complètes des vêtements utilisent encore les trois silhouettes de base ; cette correction ne crée pas 17 vêtements entièrement remodelés et animés. Les portraits de sélection représentent la silhouette de base, pas chaque tenue équipée. Les captures représentatives ne constituent pas un contrôle de toutes les combinaisons d’accessoires et de toutes les animations.
