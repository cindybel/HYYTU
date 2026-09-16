const canvas = document.querySelector('#game');
const slotButtons = document.querySelectorAll('.career-slot');
const deleteSlotButton = document.querySelector('#delete-slot-button');
const openOptionsButton = document.querySelector('#open-options-button');
const closeOptionsButton = document.querySelector('#close-options-button');
const godModeEntry = document.querySelector('#god-mode-entry');
const godPasswordModal = document.querySelector('#god-password-modal');
const godPasswordInput = document.querySelector('#god-password-input');
const godPasswordSubmit = document.querySelector('#god-password-submit');
const godPasswordCancel = document.querySelector('#god-password-cancel');
const slotConfirmModal = document.querySelector('#slot-confirm-modal');
const slotConfirmTitle = document.querySelector('#slot-confirm-title');
const slotConfirmText = document.querySelector('#slot-confirm-text');
const slotConfirmYes = document.querySelector('#slot-confirm-yes');
const slotConfirmNo = document.querySelector('#slot-confirm-no');
const backSlotsButton = document.querySelector('#back-slots-button');
const createVjButton = document.querySelector('#create-vj-button');
const vjNameInput = document.querySelector('#vj-name');
const shirtStyleInput = document.querySelector('#shirt-style');
const shirtColorInput = document.querySelector('#shirt-color');
const pantsColorInput = document.querySelector('#pants-color');
const shoeStyleInput = document.querySelector('#shoe-style');
const hairStyleInput = document.querySelector('#hair-style');
const hairColorInput = document.querySelector('#hair-color');
const headphonesInput = document.querySelector('#headphones');
const creatorLanguageInput = document.querySelector('#creator-language');
const languageSelect = document.querySelector('#language-select');
const desktopName = document.querySelector('#desktop-name');
const desktopDay = document.querySelector('#desktop-day');
const desktopWidget = document.querySelector('#desktop-widget');
const menuTrack = document.querySelector('#menu-track');
const menuBattery = document.querySelector('#menu-battery');
const osGameMenu = document.querySelector('#os-game-menu');
const moneyPill = document.querySelector('#money-pill');
const repPill = document.querySelector('#rep-pill');
const fatiguePill = document.querySelector('#fatigue-pill');
const emailBadge = document.querySelector('#email-badge');
const appWindow = document.querySelector('#app-window');
const appButtons = document.querySelectorAll('[data-app]');
const toastList = document.querySelector('#toast-list');
const globalToastList = document.querySelector('#global-toast-list');
const gigTitle = document.querySelector('#gig-title');
const hudName = document.querySelector('#hud-name');
const coverageCount = document.querySelector('#coverage-count');
const trapezeCount = document.querySelector('#trapeze-count');
const maskCount = document.querySelector('#mask-count');
const coverageMeter = coverageCount.closest('.meter');
const trapezeMeter = trapezeCount.closest('.meter');
const maskMeter = maskCount.closest('.meter');
const connectedCount = document.querySelector('#connected-count');
const connectedMeter = connectedCount.closest('.meter');
const gigTimer = document.querySelector('#gig-timer');
const projectorSlots = document.querySelectorAll('.projector-slot');
const signalBars = document.querySelectorAll('.signal-bar');
const installPrompt = document.querySelector('#install-prompt');
const objectiveText = document.querySelector('#objective-text');
const objectivePanel = document.querySelector('.objective');
const message = document.querySelector('#message');
const openComputerButton = document.querySelector('#open-computer-button');
const returnDesktopButton = document.querySelector('#return-desktop-button');
const closeGigComputerButton = document.querySelector('#close-gig-computer-button');
const gigComputer = document.querySelector('#gig-computer');
const connectProjectorButton = document.querySelector('#connect-projector-button');
const toggleHelpButton = document.querySelector('#toggle-help-button');
const maskToolButton = document.querySelector('#mask-tool-button');
const undoButton = document.querySelector('#undo-button');
const resetButton = document.querySelector('#reset-button');
const cancelGigButton = document.querySelector('#cancel-gig-button');
const finishGigButton = document.querySelector('#finish-gig-button');
const clipList = document.querySelector('#clip-list');
const resultModal = document.querySelector('#result-modal');
const resultContent = document.querySelector('#result-content');
const resultCloseButton = document.querySelector('#result-close-button');
const gigSetupModal = document.querySelector('#gig-setup-modal');
const gigSetupTitle = document.querySelector('#gig-setup-title');
const gigSetupSubtitle = document.querySelector('#gig-setup-subtitle');
const gigSetupContent = document.querySelector('#gig-setup-content');
const gigSetupSummary = document.querySelector('#gig-setup-summary');
const gigSetupStartButton = document.querySelector('#gig-setup-start-button');
const gigSetupCloseButton = document.querySelector('#gig-setup-close-button');

const TEXT = {
  fr: {
    saved: 'Partie sauvegardee.',
    noTrack: 'Aucune track',
    settings: 'Parametres',
    music: 'Music Player',
    inventory: 'Inventaire',
  },
  en: {
    saved: 'Game saved.',
    noTrack: 'No track',
    settings: 'Settings',
    music: 'Music Player',
    inventory: 'Inventory',
  },
};

function t(key) {
  const language = profile?.settings?.language || 'fr';
  return TEXT[language]?.[key] || TEXT.fr[key] || key;
}

const SCREEN_Z = -7.12;
const WALL_Z = -7.34;
const SCREEN_Y = 3.75;
const TARGET_Z = 4.9;
const SAVE_KEY = 'vj-simulator-careers-v1';
const ACTIVE_SLOT_KEY = 'vj-simulator-active-slot';
const MONTH_NAMES = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];
const ACTION_LABELS = {
  practice: 'Pratique VJ',
  study: 'Etude technique',
  network: 'Recherche clients',
  job: 'Jobine',
  'rest-free': 'Repos gratuit',
  'rest-creative': 'Sortie inspiration',
  'rest-premium': 'Repos premium',
  gig: 'Gig',
  skill: 'Competence',
  prep: 'Preparation gig',
};

const DAILY_ENERGY_MAX = 2;
const ACTION_ENERGY_COST = {
  practice: 1,
  study: 1,
  job: 1,
  'rest-free': 1,
  'rest-creative': 1,
  'rest-premium': 1,
  skill: 1,
  prep: 1,
  gig: 2,
};

const ESSENTIAL_GEAR_TYPES = new Set(['computer', 'projector', 'bag', 'cable']);
const GOD_MODE_PASSWORD = 'FIRE2026';
const GOD_MODE_MONEY = 9999999;

const CLIENT_TYPES = {
  chill: {
    label: 'Client chill',
    description: 'Facile a convaincre, paie moins, pardonne les petits defauts.',
    budgetMultiplier: 0.88,
    acceptanceBonus: 18,
    weights: { technical: 0.28, artistic: 0.42, professional: 0.3 },
  },
  corpo: {
    label: 'Client corpo',
    description: 'Exige un setup propre, paie bien, pardonne peu la technique.',
    budgetMultiplier: 1.24,
    acceptanceBonus: -4,
    weights: { technical: 0.44, artistic: 0.22, professional: 0.34 },
  },
  underground: {
    label: 'Client underground',
    description: 'Aime le style et l audace, tolere un peu de chaos.',
    budgetMultiplier: 0.98,
    acceptanceBonus: 8,
    weights: { technical: 0.24, artistic: 0.54, professional: 0.22 },
  },
  festival: {
    label: 'Client festival',
    description: 'Gros potentiel, demande fiabilite, reputation et gear solide.',
    budgetMultiplier: 1.38,
    acceptanceBonus: -10,
    weights: { technical: 0.36, artistic: 0.3, professional: 0.34 },
  },
};

const STYLE_CATALOG = {
  techno: { label: 'Techno', color: '#1df6e3', soft: 'rgba(29, 246, 227, 0.16)' },
  hiphop: { label: 'HipHop', color: '#ffb43b', soft: 'rgba(255, 180, 59, 0.16)' },
  chill: { label: 'Chill', color: '#7ddcff', soft: 'rgba(125, 220, 255, 0.16)' },
  psytrance: { label: 'Psytrance', color: '#ff4fd8', soft: 'rgba(255, 79, 216, 0.16)' },
  rock: { label: 'Rock', color: '#ff5f57', soft: 'rgba(255, 95, 87, 0.16)' },
};

const PREP_OPTIONS = {
  loops: { label: 'Preparer loops', description: '+ artistique: meilleure vibe et transitions.', bonus: { artistic: 8 }, fatigue: 4 },
  gear: { label: 'Tester gear', description: '+ technique/pro: moins de problemes de cable et signal.', bonus: { technical: 6, professional: 4 }, fatigue: 3 },
  plan: { label: 'Plan projection', description: '+ technique: meilleur placement et trapeze.', bonus: { technical: 8 }, fatigue: 2 },
  rest: { label: 'Se reposer', description: '+ pro: moins de fatigue le soir du gig.', bonus: { professional: 7 }, fatigue: -16 },
  client: { label: 'Relance client', description: '+ pro/reseau: client plus confiant.', bonus: { professional: 5 }, network: 1 },
};

const GIG_EVENTS = [
  { id: 'cable-short', label: 'Cable trop court', description: 'Il faut improviser un chemin de cable.', penalty: { technical: 8 } },
  { id: 'projector-dim', label: 'Projecteur faible', description: 'La projection manque un peu de punch.', penalty: { artistic: 7 } },
  { id: 'laptop-lag', label: 'Ordinateur qui lag', description: 'Les transitions live deviennent plus fragiles.', penalty: { professional: 7 } },
  { id: 'client-change', label: 'Client change d idee', description: 'Le style demande ne colle plus parfaitement aux loops.', penalty: { artistic: 6, professional: 3 } },
  { id: 'crooked-wall', label: 'Mur pas droit', description: 'Le trapeze devient plus dur a corriger.', penalty: { technical: 6 } },
];

const CLOTHING_COLORS = {
  black: 0x0b0d12,
  charcoal: 0x1d222b,
  white: 0xf6f1df,
  cyan: 0x1df6e3,
  pink: 0xff3f9c,
  magenta: 0xff3f9c,
  purple: 0x8e5cff,
  blue: 0x216bff,
  green: 0x43ff9b,
  yellow: 0xffc857,
  red: 0xff4e5f,
};

const HAIR_COLORS = {
  black: 0x08090d,
  brown: 0x4a2c1a,
  blond: 0xd8b15f,
  cyan: 0x1df6e3,
  magenta: 0xff3f9c,
};

const videoClips = [
  {
    label: 'Blue Red Waves',
    src: '/video/vecteezy_blue-and-red-random-shapes-waves-background-vj-loop-in-4k_63180364.mp4',
  },
  {
    label: 'Green Tunnel',
    src: '/video/vecteezy_green-slow-strobe-grate-tunnel-background-vj-loop-in-4k_75291098.mp4',
  },
  {
    label: 'Hex Neon',
    src: '/video/vecteezy_red-and-blue-hexagonal-neon-line-moving-lighting_78239514.mp4',
  },
  {label: 'Aurore · warm-up', src: '/video/originals/aurora.mp4', energy: 'warmup', poster: '/video/originals/aurora.jpg'},
  {label: 'Rubans · break', src: '/video/originals/ribbons.mp4', energy: 'warmup', poster: '/video/originals/ribbons.jpg'},
  {label: 'Orbites · groove', src: '/video/originals/orbits.mp4', energy: 'groove', poster: '/video/originals/orbits.jpg'},
  {label: 'Grille · montée', src: '/video/originals/grid.mp4', energy: 'rise', poster: '/video/originals/grid.jpg'},
  {label: 'Tunnel · peak', src: '/video/originals/tunnel.mp4', energy: 'peak', poster: '/video/originals/tunnel.jpg'},
  {label: 'Prisme · peak', src: '/video/originals/kaleido.mp4', energy: 'peak', poster: '/video/originals/kaleido.jpg'},
  ...window.OriginalClipLibrary,
];

const GUIDE_SECTIONS = [
  {
    id: 'start',
    label: 'Depart',
    title: 'But du jeu',
    kicker: 'Créer des shows, apprendre les gestes du VJ et découvrir de nouvelles scènes.',
    points: [
      'Tu commences avec peu d argent, un setup simple et des petits contrats.',
      'Depuis ton studio, pratique librement ou prépare un contrat à l’ordinateur. Le temps avance naturellement ; les shows se lancent quand tu pars.',
      'Les gigs demandent du materiel, des VJ loops, des skills et une bonne preparation.',
      'Plus tu reussis, plus tu gagnes argent, reputation, XP, hype et acces a de meilleurs contrats.',
    ],
    tip: 'Commence par accepter les petits gigs, acheter du gear utile et garder ta fatigue basse.',
  },
  {
    id: 'day',
    label: 'Journee',
    title: 'Calendrier et energie',
    kicker: 'Le calendrier gere le temps, les activites et les dates de show.',
    points: [
      'Chaque jour donne 2 actions.',
      'Pratiquer VJ coute 1 energie et donne creativite, XP et un peu de fatigue.',
      'Jobine coute 1 action et donne de l argent. Le salaire monte de 10$ apres 20 jours travailles.',
      'Repos contient plusieurs choix: repos gratuit, sortie inspiration ou repos premium.',
      'Choisis une session, prépare ton matériel et joue. Les contrats accessibles se lancent sans attendre une date.',
      'Les gigs confirmes tombent surtout vendredi ou samedi. Tu dois attendre la date avant d entrer en salle.',
    ],
    tip: 'Si tu es fatigue avant une gig, prends un repos. La fatigue peut ruiner un bon setup.',
  },
  {
    id: 'booking',
    label: 'Booking',
    title: 'VJ Booking, email et clients',
    kicker: 'Les contrats viennent de VJ Booking et les reponses arrivent par email.',
    points: [
      'Dans Booking, tu peux envoyer 3 candidatures par jour.',
      'La reponse client arrive apres 1 a 3 jours.',
      'Chaque candidature reserve une date de soiree. Tu ne peux pas postuler a deux gigs sur la meme date.',
      'Quand un client accepte, tu peux accepter, negocier ou refuser dans Email.',
      'Un gig deja fait peut etre rejoue, mais il faut attendre 7 jours et renvoyer une candidature.',
      'Les clients ont des profils: chill, corpo, underground et festival. Chaque profil juge le show differemment.',
      'Plus ton niveau monte, plus VJ Booking affiche des gigs hauts, mais tu peux aussi revenir aux petits contrats.',
    ],
    tip: 'Un client corpo veut surtout une projection propre. Un client underground pardonne plus si le visuel a du style.',
  },
  {
    id: 'gear',
    label: 'Gear',
    title: 'Materiel, inventaire et achats',
    kicker: 'Chaque item doit servir a survivre a une difficulte future.',
    points: [
      'Avant chaque gig, le brief te montre le minimum demande par le client.',
      'Ton inventaire est utilise automatiquement: gear, fils, adaptateurs, projecteurs et packs VJ.',
      'Les VJ loops ne se louent plus: il faut les acheter ou recevoir du materiel prete sur les premiers gigs.',
      'Les 5 premiers gigs pretent du gear de base, mais ce gear ne donne aucun bonus.',
      'Les gros gigs demandent projecteurs, ordinateur/carte graphique, fils longs, adaptateurs, routeurs, console, ecran de controle, sac et outils de mapping.',
      'Les locations coutent environ un tiers du prix de l item.',
    ],
    tip: 'Acheter un cable long, une plume/mapping kit et un bon ordinateur ouvre beaucoup plus de contrats.',
  },
  {
    id: 'inventory-flow',
    label: 'Inventaire',
    title: 'Inventaire avant la salle',
    kicker: 'Toute la gestion de materiel passe par Inventaire et Shop.',
    points: [
      'Le joueur voit son gear, ses loops, ses objets equipes et son stock.',
      'Acheter dans Shop ajoute l item dans Inventaire.',
      'Vendre du gear retire l item et rembourse 70% du prix.',
      'Les loops, vetements, skills et progressions ne se vendent pas.',
      'Dans les sessions, la note dépend du cadrage, de l’intensité et du fondu réellement exécuté. Posséder du matériel ne donne pas de points.',
    ],
    tip: 'Si un gig reste bloque, regarde les manques dans Inventaire, Shop ou Skills.',
  },
  {
    id: 'gig3d',
    label: 'Gig 3D',
    title: 'Projection 3D',
    kicker: 'Dans la salle, le gameplay est centre sur les projecteurs, pas sur le personnage.',
    points: [
      'Selectionne un projecteur en cliquant dessus ou avec les touches 1, 2, 3.',
      'Connecte le projecteur avant de projeter le vrai clip. Sinon tu vois le test card.',
      'Les fleches deplacent le projecteur/rack.',
      'W/S et A/D ajustent les angles et le trapeze.',
      'Souris inversee: clic gauche deplace/pan, clic droit tourne et selectionne, clic molette te promene librement.',
      'La plume sert aux formes avancees: rond, hexagone, multi-zones et contours.',
      'Après le mapping, clique Lancer la prestation : 60 secondes de mix vidéo avec consignes du DJ.',
      'Prépare un clip en préview, règle le fondu puis envoie-le en programme. Le fader règle la sortie en salle.',
      'Tu peux terminer plus tôt, mais une prestation non jouée ne rapporte aucun cachet. Une prestation interrompue réduit le paiement.',
    ],
    tip: 'Place le rack, branche les sorties, corrige le mapping, puis joue la prestation. Le montage se verrouille au passage en live.',
  },
  {
    id: 'score',
    label: 'Score',
    title: 'Scoring du show',
    kicker: 'Le score doit expliquer pourquoi tu as reussi ou rate.',
    points: [
      'Technique compte pour 40%: alignement, trapeze, connexions, placement, temps de setup.',
      'Artistique compte pour 35% : préparation artistique (30%) et respect des consignes d’intensité pendant le live (70%).',
      'Sans sortie connectée : résultat nul. Sans prestation : aucun paiement. Le temps de montage est arrêté au début du live.',
      'Professionnel compte pour 25%: preparation, bon gear, fatigue basse, contraintes respectees et reputation.',
      'Le client calcule aussi sa satisfaction selon son profil.',
      'Les notes finales sont Legendary, Excellent, Solid, Messy ou Disaster.',
      'L ecran de resultat montre argent, XP, reputation, fatigue, nouveaux contacts et feedback.',
    ],
    tip: 'Si tu perds des points, regarde les penalites: cable, fatigue, style, mauvais rack ou gear debutant.',
  },
  {
    id: 'skills',
    label: 'Skills',
    title: 'Competences',
    kicker: 'Les skills debloquent la capacite de prendre des gigs plus difficiles.',
    points: [
      'Cablage propre: fils longs, tension, routes au sol et setups propres.',
      'Mapping trapeze: angles, profondeur, murs croche et projection precise.',
      'Multi-projecteurs: splitter, matrix, adaptateurs et plusieurs sorties video.',
      'Pression live: timer, stress client et setup rapide.',
      'Plume contour: decoupe de formes, ecrans ronds, hexagones et zones multiples.',
      'Acheter/apprendre une competence remplit la journee et coute de l energie.',
    ],
    tip: 'Quand une nouvelle difficulte apparait dans les gigs, apprends le skill correspondant avant de viser trop haut.',
  },
  {
    id: 'shop',
    label: 'Shop',
    title: 'Atazone et progression RPG',
    kicker: 'Le shop doit sentir comme un vrai marche VJ, pas juste une liste.',
    points: [
      'Gear contient projecteurs, ordinateurs, GPU, fils, adaptateurs, routeurs, consoles, ecrans et sacs.',
      'Vetements ouvre le magasin 3D pour changer le look du personnage.',
      'VJ Loop vend des packs par style musical. Acheter un pack monte le style correspondant.',
      'Les items ont avantages et inconvenients proportionnels au prix.',
      'Aucun item ne devrait etre inutile: chaque categorie devient importante dans un moment de la progression.',
      'Appartement/logement influence confort, fatigue, reputation et argent mensuel.',
    ],
    tip: 'Achete selon le prochain obstacle, pas seulement selon le plus gros bonus.',
  },
  {
    id: 'progression',
    label: 'Prerequis gigs',
    title: 'Prerequis des 30 gigs',
    kicker: 'Chaque ligne montre quoi atteindre avant de viser le contrat: niveau, skills, gear, loops, objectif et contraintes.',
    points: [
      'Gigs 1-5: bases, gear prete, premiers contours, rond et hexagone.',
      'Gigs 6-10: placement, zoom, plume, split et premier stress.',
      'Gigs 11-17: deux projecteurs, cables longs, formes mixtes, console et mapping niveau 2.',
      'Gigs 18-20: no rental, mauvais murs, gros gig avec penalites plus fortes.',
      'Gigs 21-25: trois projecteurs, adaptateurs, matrix, sidewalls et pression festival.',
      'Gigs 26-30: plume 3, GPU pro, matrix 4x4, full setup pro et toutes les mecaniques combinees.',
    ],
    tip: 'Utilise cette page comme checklist: si un gig est cache ou risque, regarde le niveau, les skills, les loops du style et le gear requis.',
  },
];

const GIG_BLUEPRINTS = [
  [1, 'Party Garage', 1, '1 rectangle', 'Base projection', 'aucune', 'starter laptop + 1 HDMI', 'prete', 'aucune', 'non'],
  [2, 'Neon Wall', 1, '1 rectangle', 'Plume intro', 'decoupe simple', 'plume basic', 'prete', 'plume 1', 'non'],
  [3, 'Rush Setup', 1, '1 rectangle', 'Premier stress', 'setup rapide', 'starter gear', 'prete', 'aucune', 'facile'],
  [4, 'Moon Circle', 1, '1 rond', 'Forme ronde', 'contour precis', 'plume basic', 'prete', 'plume 1', 'non'],
  [5, 'Hexa Pulse', 1, '1 hexagone', 'Angles', 'precision trapeze', 'plume basic', 'prete', 'mapping 1', 'leger'],
  [6, 'Bad Placement', 1, '1 rectangle', '3 positions possibles', 'mauvais angle possible', 'ton projo conseille', 'oui', 'cablage 1', 'non'],
  [7, 'Zoom Test', 1, '1 rectangle', 'Zoom projection', 'distance trop longue', 'software zoom', 'oui', 'mapping 1', 'non'],
  [8, 'Far Circle', 1, '1 rond', 'Zoom + plume', 'placement serre', 'zoom + plume', 'oui', 'plume 1', 'leger'],
  [9, 'Split Vision', 1, '2 zones', '2 ecrans avec 1 projo', 'decoupe precise', 'plume niv.1', 'oui', 'plume 1', 'non'],
  [10, 'Dual Rush', 1, '2 zones', 'Timer + split', 'stress setup', 'laptop correct', 'oui', 'pression live 1', 'moyen'],
  [11, 'Twin Screens', 2, '2 rectangles', 'Intro 2 projos', 'double connexion', 'splitter duo', 'oui', 'multi-projo 1', 'non'],
  [12, 'Long Cable', 2, '2 rectangles', 'Distance', 'cable trop court sinon', 'cable 75 pieds', 'oui', 'cablage 1', 'non'],
  [13, 'Triple Shape', 2, '3 zones', '1 projo split', 'formes mixtes', 'plume niv.1', 'oui', 'plume 1', 'leger'],
  [14, 'Tight Venue', 2, '3 zones', 'Salle serree', 'peu de place', 'zoom + cable long', 'oui', 'mapping 1', 'moyen'],
  [15, 'Quad Layout', 2, '4 zones', '2 splits simultanes', 'precision forte', 'plume niv.2', 'oui', 'plume 2', 'non'],
  [16, 'Club Pressure', 2, '4 zones', 'Stress live', 'timer agressif', 'console MIDI mini', 'oui', 'pression live 1', 'moyen'],
  [17, 'Mixed Geometry', 2, '4 zones', 'Rond + hexa + rectangle', 'angles complexes', 'meilleur laptop', 'oui', 'mapping 2', 'moyen'],
  [18, 'No Rental Night', 2, '4 zones', 'Plus de location', 'doit posseder gear', '2 projos perso', 'non', 'multi-projo 1', 'moyen'],
  [19, 'Crooked Walls', 2, '4 zones', 'Mauvais murs', 'trapeze fort', 'zoom + plume 2', 'non', 'mapping 2', 'moyen'],
  [20, 'Warehouse Major', 2, '4 zones', 'Premier gros gig', 'grosses penalites', 'laptop VJ + splitter', 'oui', 'pression live 1', 'difficile'],
  [21, 'Triple Intro', 3, '3 rectangles', 'Intro 3 projos', 'outputs multiples', 'routeur triple', 'oui', 'multi-projo 2', 'non'],
  [22, 'Output Crisis', 3, '3 zones', 'Ports limites', 'adaptateurs requis', 'DP-HDMI adapters', 'oui', 'multi-projo 2', 'moyen'],
  [23, 'Triple Split', 3, '4 zones', 'Split avance', 'synchronisation', 'plume niv.2', 'oui', 'plume 2', 'moyen'],
  [24, 'Festival Sidewalls', 3, '5 zones', 'Grande couverture', 'mauvaise distance', 'matrix + zoom', 'oui', 'mapping 2', 'moyen'],
  [25, 'Psy Main Room', 3, '5 zones', 'Stress intense', 'timer severe', 'VJ Deck', 'oui', 'pression live 2', 'difficile'],
  [26, 'Mapping Cathedral', 3, '6 zones', '2 zones/projo', 'architecture complexe', 'plume niv.3', 'non', 'plume 3', 'difficile'],
  [27, 'Geometry Overload', 3, '6 zones', 'Toutes formes mixtes', 'precision extreme', 'GPU pro', 'non', 'mapping 3', 'difficile'],
  [28, 'Technical Nightmare', 3, '6 zones', 'Tres peu de placements', 'mauvais angles partout', 'matrix 4x4', 'non', 'multi-projo 3', 'tres difficile'],
  [29, 'Festival Headliner', 3, '6 zones', 'Aucun droit erreur', 'pas de location', 'full setup pro', 'non', 'pression live 3', 'extreme'],
  [30, 'Legendary AV Show', 3, '6 zones', 'Toutes mecaniques combinees', 'timer + placement + plume + zoom + stress', 'setup premium complet', 'non', 'toutes skills niv.3', 'brutal'],
];

const starterGigs = GIG_BLUEPRINTS.map(createCareerGigFromBlueprint);
configureGigProgression(starterGigs);
starterGigs.forEach(g=>window.GigDifficulty?.configure(g));

function createCareerGigFromBlueprint(row) {
  const [number, title, projectorCount, zoneLabel, difficulty, constraints, gearText, rental, skillText, timer] = row;
  const styleCycle = ['techno', 'chill', 'hiphop', 'psytrance', 'rock'];
  const requirements = getBlueprintGearRequirements(number, gearText);
  const budget = Math.round((130 + number * 82 + projectorCount * 110 + getZoneCount(zoneLabel) * 42) * getTimerBudgetMultiplier(timer));
  return {
    id: `gig-${String(number).padStart(2, '0')}-${slugify(title)}`,
    number,
    title,
    type: difficulty,
    date: `Jour ${2 + number * 2}`,
    baseBudget: budget,
    budget,
    venue: getVenueForGig(number),
    style: styleCycle[(number - 1) % styleCycle.length],
    minRep: Math.max(0, Math.min(94, (number - 1) * 3)),
    minGear: number >= 26 ? 'pro' : number >= 18 ? 'rare' : number >= 10 ? 'standard' : 'starter',
    requirement: `${difficulty}: ${constraints}. ${zoneLabel}, ${projectorCount} projecteur${projectorCount > 1 ? 's' : ''}.`,
    projectorCount,
    zoneLabel,
    zoneCount: getZoneCount(zoneLabel),
    zoneShape: getZoneShape(zoneLabel, difficulty),
    newDifficulty: difficulty,
    constraints,
    gearText,
    rentalRule: rental,
    skillText,
    timerLabel: timer,
    loanerGear: rental === 'prete',
    allowRent: rental !== 'non',
    cooldownDays: 7,
    timeLimitSeconds: getTimerSeconds(timer),
    placementOptions: getPlacementOptionsForBlueprint(number, difficulty, constraints),
    correctPlacement: 'center',
    lockedDepth: /distance|placement serre|mauvaise distance|peu de place/i.test(constraints),
    lockedHorizontal: /tres peu de placements|mauvais angles partout/i.test(difficulty) || /mauvais angles partout/i.test(constraints),
    minScore: getBlueprintMinScore(number, timer),
    maskRequired: getBlueprintMaskRequirement(number, zoneLabel, skillText),
    requiredSkills: getSkillsFromText(skillText),
    status: number === 1 ? 'open' : 'locked',
    responseIn: null,
    ...requirements,
  };
}

function configureGigProgression(gigs) {
  gigs.forEach((gig, index) => {
    gig.number = gig.number || index + 1;
    gig.loanerGear = gig.loanerGear ?? gig.number <= 5;
    gig.allowRent = gig.allowRent ?? (gig.number <= 20 || gig.number % 3 !== 0);
    gig.cooldownDays = gig.cooldownDays || 7;
    gig.timeLimitSeconds = gig.timeLimitSeconds ?? getTimerSeconds(gig.timerLabel || 'non');
    gig.placementOptions = gig.placementOptions || getPlacementOptionsForBlueprint(gig.number, gig.newDifficulty || '', gig.constraints || '');
    gig.correctPlacement = gig.correctPlacement || gig.placementOptions[0]?.id || 'center';
    gig.lockedHorizontal = gig.lockedHorizontal ?? false;
    gig.requiredSkills = gig.requiredSkills || getSkillsFromText(gig.skillText || '');
  });
}

function getBlueprintGearRequirements(number, gearText) {
  const req = { requiredAccessories: [] };
  req.requiredComputer = getComputerRequirementForGig(number);
  req.requiredProjector = getProjectorRequirementForGig(number);
  req.requiredCable = getCableRequirementForGig(number);
  req.requiredBag = getBagRequirementForGig(number);
  if (/plume|mapping kit/i.test(gearText)) req.requiredAccessories.push('mapping-kit');
  if (/zoom/i.test(gearText)) req.requiredAccessories.push('wide-lens');
  if (/laptop correct/i.test(gearText)) req.requiredComputer = 'vj-laptop-gtx';
  if (/meilleur laptop|laptop VJ/i.test(gearText)) req.requiredComputer = 'creator-laptop-rtx';
  if (/GPU pro|full setup pro|premium complet/i.test(gearText)) req.requiredGpu = 'gpu-desktop-pro';
  if (/75 pieds|cable long/i.test(gearText)) req.requiredCable = '75ft-active';
  if (/full setup pro|premium complet/i.test(gearText)) req.requiredCable = 'loom-3pack-150';
  if (/DP-HDMI|adaptateurs/i.test(gearText)) req.requiredAdapter = 'dp-hdmi-pro-3pack';
  if (/splitter duo|splitter/i.test(gearText)) req.requiredRouter = 'splitter-duo';
  if (/routeur triple/i.test(gearText)) req.requiredRouter = 'mapper-triple';
  if (/matrix 4x4|full setup pro|premium complet/i.test(gearText)) req.requiredRouter = 'matrix-4x4';
  if (/console MIDI/i.test(gearText)) req.requiredConsole = 'midi-mini';
  if (/VJ Deck/i.test(gearText)) req.requiredConsole = 'vj-deck';
  if (/full setup pro|premium complet/i.test(gearText)) req.requiredConsole = 'show-control-pro';
  if (/2 projos perso/i.test(gearText)) req.requiredProjector = 'standard';
  if (/full setup pro|premium complet/i.test(gearText)) req.requiredProjector = 'pro-6500';
  if (number >= 18) req.requiredScreen = req.requiredScreen || 'monitor-24';
  if (number >= 29) req.requiredBag = 'road-backpack';
  req.requiredLoopPacks = number >= 26 ? 3 : number >= 15 ? 2 : 1;
  req.requiredAccessories = [...new Set(req.requiredAccessories)];
  if (req.requiredAccessories.length) req.requiredAccessory = req.requiredAccessories[0];
  return req;
}

function getComputerRequirementForGig(number) {
  if (number >= 28) return 'desktop-rtx4080';
  if (number >= 21) return 'desktop-rtx4060';
  if (number >= 13) return 'creator-laptop-rtx';
  if (number >= 6) return 'vj-laptop-gtx';
  return 'starter-laptop';
}

function getProjectorRequirementForGig(number) {
  if (number >= 29) return 'ultra-4k';
  if (number >= 23) return 'pro-6500';
  if (number >= 16) return 'laser-entry';
  if (number >= 8) return 'standard';
  return 'cheap';
}

function getCableRequirementForGig(number) {
  if (number >= 29) return 'loom-3pack-150';
  if (number >= 21) return 'loom-3pack-75';
  if (number >= 12) return '75ft-active';
  return '25ft-basic';
}

function getBagRequirementForGig(number) {
  if (number >= 28) return 'road-backpack';
  if (number >= 15) return 'vj-backpack';
  return 'messenger-basic';
}

function getSkillsFromText(text) {
  const skills = {};
  const normalized = String(text).toLowerCase();
  if (normalized.includes('toutes')) {
    return { cabling: 3, mapping: 3, multiOutput: 3, timePressure: 3, penTool: 3 };
  }
  const level = Number(normalized.match(/\d+/)?.[0]) || 1;
  if (normalized.includes('plume')) skills.penTool = level;
  if (normalized.includes('mapping')) skills.mapping = level;
  if (normalized.includes('cablage')) skills.cabling = level;
  if (normalized.includes('multi-projo')) skills.multiOutput = level;
  if (normalized.includes('pression')) skills.timePressure = level;
  return skills;
}

function getPlacementOptionsForBlueprint(number, difficulty, constraints) {
  if (number < 6) return [{ id: 'center', label: 'Centre standard', penalty: 0 }];
  const options = [
    { id: 'center', label: 'Centre standard', penalty: 0 },
    { id: 'left', label: 'Rack gauche', penalty: 18 },
  ];
  if (/3 positions|placement|salle serree|distance|mauvais angle/i.test(`${difficulty} ${constraints}`) || number >= 14) {
    options.push({ id: 'deep', label: 'Rack au fond', penalty: 24 });
  }
  if (/tres peu|nightmare|legendary/i.test(`${difficulty} ${constraints}`)) {
    return [
      { id: 'center', label: 'Point risque centre', penalty: 8 },
      { id: 'left', label: 'Angle serre gauche', penalty: 22 },
      { id: 'deep', label: 'Fond de salle', penalty: 30 },
    ];
  }
  return options;
}

function getTimerSeconds(label) {
  const timers = {
    non: 0,
    leger: 380,
    facile: 430,
    moyen: 310,
    difficile: 240,
    'tres difficile': 190,
    extreme: 160,
    brutal: 130,
  };
  return timers[label] ?? 0;
}

function getTimerBudgetMultiplier(label) {
  return getTimerSeconds(label) ? 1.12 : 1;
}

function getBlueprintMinScore(number, timer) {
  const timerPressure = getTimerSeconds(timer) ? 2 : 0;
  return Math.min(99, 82 + Math.floor(number * 0.52) + timerPressure);
}

function getBlueprintMaskRequirement(number, zoneLabel, skillText) {
  const zones = getZoneCount(zoneLabel);
  const needsPlume = /plume|rond|hexa|split|zones/i.test(`${zoneLabel} ${skillText}`);
  if (!needsPlume) return 0;
  return Math.min(96, 45 + zones * 7 + Math.floor(number * 0.85));
}

function getZoneCount(label) {
  return Number(String(label).match(/\d+/)?.[0]) || 1;
}

function getZoneShape(label, difficulty) {
  const text = `${label} ${difficulty}`.toLowerCase();
  if (text.includes('rond')) return 'rond';
  if (text.includes('hex')) return 'hexagone';
  if (text.includes('mix')) return 'mixte';
  if (text.includes('zone')) return 'multi-zone';
  return 'rectangle';
}

function getVenueForGig(number) {
  const venues = [
    'Garage de quartier', 'Mur neon local', 'Bar rush', 'Salle lune', 'Club Hexa',
    'Sous-sol etroit', 'Studio long', 'Loft rond', 'Galerie split', 'Club minute',
    'Twin Hall', 'Salle longue', 'Atelier formes', 'Petit venue', 'Layout room',
    'Club pression', 'Galerie geometry', 'Private no-rental', 'Crooked warehouse', 'Warehouse major',
    'Triple room', 'Output lab', 'Split lab', 'Festival sidewall', 'Psy main room',
    'Mapping cathedral', 'Geometry arena', 'Technical hall', 'Festival headliner', 'Legendary AV stage',
  ];
  return venues[number - 1] || `Venue ${number}`;
}

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const shopItems = createShopItems();

const defaultGear = {
  projector: {
    slug: 'cheap',
    label: 'Binq StarterBeam 2200',
    description: 'Petit projecteur d entree, inspire des gammes budget 1080p. Suffisant pour apprendre, limite en puissance.',
    scoreBonus: 0,
    rentCost: 70,
  },
  computer: {
    slug: 'starter-laptop',
    label: 'Lenovox FieldPad iGPU',
    description: 'Portable simple avec graphique integre. Une sortie HDMI, clips legers seulement.',
    scoreBonus: 0,
    rentCost: 120,
  },
  cable: {
    slug: '25ft-basic',
    label: 'Kramark HDMI Run 25',
    description: 'Cable HDMI court pour petit garage et projecteur proche du bureau.',
    scoreBonus: 0,
    rentCost: 20,
  },
  adapter: {
    slug: 'none',
    label: 'Aucun adaptateur',
    description: 'OK seulement si toutes les sorties matchent deja.',
    scoreBonus: 0,
    rentCost: 0,
  },
  router: {
    slug: 'none',
    label: 'Aucune boite multi-projo',
    description: 'OK pour un seul projecteur branche direct.',
    scoreBonus: 0,
    rentCost: 0,
  },
  console: {
    slug: 'none',
    label: 'Aucune console',
    description: 'Pas de controle live avance.',
    scoreBonus: 0,
    rentCost: 0,
  },
  screen: {
    slug: 'none',
    label: 'Aucun ecran externe',
    description: 'OK avec un laptop, moins pratique avec une tour.',
    scoreBonus: 0,
    rentCost: 0,
  },
  bag: {
    slug: 'messenger-basic',
    label: 'RoadVault Messenger 12',
    description: 'Transport minimal du laptop, des adaptateurs et des fils courts.',
    scoreBonus: 0,
    rentCost: 18,
  },
  accessory: {
    slug: 'none',
    label: 'Aucun accessoire',
    description: 'Pas de kit special.',
    scoreBonus: 0,
    rentCost: 0,
  },
};

const skillCatalog = [
  { id: 'cabling', label: 'Cablage propre', description: 'Lire les distances, eviter la surtension et gerer les fils au sol.', costs: [0, 240, 620] },
  { id: 'mapping', label: 'Mapping trapeze', description: 'Corriger angles, trapeze et profondeur quand le rack est mal place.', costs: [120, 420, 980] },
  { id: 'multiOutput', label: 'Multi-projecteurs', description: 'Boites, matrix, sorties HDMI/DisplayPort et synchronisation.', costs: [220, 720, 1500] },
  { id: 'timePressure', label: 'Pression live', description: 'Rester efficace quand le client impose une limite de temps.', costs: [180, 560, 1200] },
  { id: 'penTool', label: 'Plume contour', description: 'Delimitation des formes, ecrans ronds et masques propres.', costs: [260, 820, 1700] },
];

const GEAR_PROGRESSIONS = {
  projector: ['cheap', 'standard', 'short-throw', 'laser-entry', 'pro-6500', 'ultra-4k'],
  computer: ['starter-laptop', 'vj-laptop-gtx', 'creator-laptop-rtx', 'desktop-rtx4060', 'desktop-rtx4080'],
  gpu: ['gpu-mobile', 'gpu-desktop-mid', 'gpu-desktop-pro'],
  cable: ['25ft-basic', '75ft-active', '150ft-fiber', 'loom-3pack-75', 'loom-3pack-150'],
  adapter: ['dp-hdmi-basic', 'dp-hdmi-pro-3pack'],
  router: ['splitter-duo', 'mapper-triple', 'matrix-4x4'],
  console: ['midi-mini', 'vj-deck', 'show-control-pro'],
  screen: ['monitor-24', 'monitor-27', 'portable-touch'],
  bag: ['messenger-basic', 'vj-backpack', 'road-backpack'],
};

function createShopItems() {
  const items = [];
  const gearQualityCounters = {};
  const rarityByCost = (cost) => cost >= 1800 ? 'pro' : cost >= 900 ? 'rare' : cost >= 360 ? 'standard' : 'starter';
  const balancedStats = (category, type, cost, stats = {}) => {
    const balanced = { ...stats };
    const tier = cost >= 1800 ? 4 : cost >= 900 ? 3 : cost >= 360 ? 2 : cost >= 160 ? 1 : 0;
    if (category === 'gear') {
      balanced.gear = balanced.gear ?? Math.max(1, Math.round(cost / 180));
      balanced.fatigue = balanced.fatigue ?? (type === 'accessory' ? 0 : Math.min(9, 1 + tier * 2));
      balanced.network = balanced.network ?? (tier >= 2 ? -1 : 0);
    }
    if (category === 'housing') {
      balanced.comfort = balanced.comfort ?? 0;
      balanced.loyer = balanced.loyer ?? 0;
      balanced.fatigue = balanced.fatigue ?? -Math.max(1, Math.round(balanced.comfort / 8));
      balanced.creativity = balanced.creativity ?? Math.max(0, Math.round(balanced.comfort / 12));
      balanced.reputation = balanced.reputation ?? (tier >= 3 ? 2 : 0);
      balanced.network = balanced.network ?? (tier >= 2 ? -1 : 0);
    }
    if (category === 'clothing') {
      balanced.style = balanced.style ?? Math.max(2, Math.round(cost / 85));
      balanced.technique = balanced.technique ?? (tier >= 2 ? -1 : 0);
      balanced.fatigue = balanced.fatigue ?? (tier >= 3 ? 2 : 0);
    }
    if (category === 'vjloop') {
      balanced.creativity = balanced.creativity ?? Math.max(1, Math.round(cost / 180));
      balanced.technique = balanced.technique ?? -Math.max(1, Math.round(cost / 520));
      balanced.fatigue = balanced.fatigue ?? Math.max(1, Math.round(cost / 420));
    }
    const hasDrawback = Object.entries(balanced).some(([key, value]) => {
      if (!Number(value)) return false;
      return key === 'fatigue' || key === 'loyer' ? value > 0 : value < 0;
    });
    if (!hasDrawback) {
      if (category === 'clothing') balanced.technique = (balanced.technique || 0) - 1;
      else if (category === 'housing') balanced.loyer = Math.max(1, balanced.loyer || 1);
      else balanced.fatigue = (balanced.fatigue || 0) + 1;
    }
    return balanced;
  };
  const formatEffectTag = (key, value) => {
    const labels = {
      creativity: 'creativite',
      technique: 'technique',
      fatigue: 'fatigue',
      reputation: 'reputation',
      style: 'style',
      network: 'reseau',
      gear: 'gear',
      comfort: 'confort',
      loyer: 'loyer',
      styleXp: 'style XP',
    };
    if (key === 'loyer') return `${labels[key]} ${Math.abs(value)}$/mois`;
    return `${labels[key] || key} ${value > 0 ? '+' : ''}${value}`;
  };
  const statTags = (stats, styleLabel = null, styleXp = 0) => {
    const tags = Object.entries(stats)
      .filter(([, value]) => Number(value) !== 0)
      .map(([key, value]) => formatEffectTag(key, value));
    if (styleLabel) tags.unshift(`${styleLabel} +${styleXp || 8}`);
    return tags;
  };
  const splitEffects = (stats) => {
    const advantages = [];
    const disadvantages = [];
    Object.entries(stats).forEach(([key, value]) => {
      if (!Number(value)) return;
      const negative = key === 'fatigue' || key === 'loyer'
        ? value > 0
        : value < 0;
      const label = formatEffectTag(key, value);
      if (negative) disadvantages.push(label);
      else advantages.push(label);
    });
    return {
      advantages: advantages.length ? advantages : ['progression stable'],
      disadvantages: disadvantages.length ? disadvantages : ['prix eleve'],
    };
  };
  const makeItem = (item) => {
    const effects = splitEffects(item.stats || {});
    return {
      ...item,
      advantages: item.advantages || effects.advantages,
      disadvantages: item.disadvantages || effects.disadvantages,
      tags: item.tags || statTags(item.stats || {}, item.styleTarget, item.styleXp),
      scoreBonus: Number(item.stats?.gear || 0),
    };
  };
  const addGear = (type, slug, label, cost, description, stats = {}) => {
    const finalStats = balancedStats('gear', type, cost, stats);
    const qualityStars = Math.min(5, (gearQualityCounters[type] || 0) + 1);
    gearQualityCounters[type] = qualityStars;
    items.push(makeItem({
      id: `${type}-${slug}`,
      label,
      type,
      category: 'gear',
      cost,
      description,
      rarity: rarityByCost(cost),
      qualityStars,
      stats: finalStats,
      stackable: ['projector', 'cable', 'adapter'].includes(type),
      apply(target) {
        target.gear[type] = slug;
      },
    }));
  };
  const addHousing = (slug, label, cost, rent, comfort, description, stats = {}) => {
    const finalStats = balancedStats('housing', 'housing', cost, { comfort, loyer: rent, ...stats });
    items.push(makeItem({
      id: `housing-${slug}`,
      label,
      type: 'housing',
      category: 'housing',
      rent, comfort,
      cost,
      description,
      rarity: rarityByCost(cost),
      stats: finalStats,
      apply(target) {
        target.housing = { type: label, rent, comfort };
        target.location = label;
        applyShopStatEffects(target, finalStats);
      },
    }));
  };
  const addClothing = (slug, label, cost, slot, value, description, stats = {}) => {
    const finalStats = balancedStats('clothing', 'clothing', cost, stats);
    items.push(makeItem({
      id: `clothing-${slug}`,
      label,
      type: 'clothing',
      category: 'clothing',
      cost,
      description,
      rarity: rarityByCost(cost),
      stats: finalStats,
      clothingSlot: slot,
      clothingValue: value,
      apply(target) {
        equipWear({id:`clothing-${slug}`,clothingSlot:slot,clothingValue:value},target);
      },
    }));
  };
  const addClip = (slug, label, cost, style, description, stats = {}) => {
    const styleXp = stats.styleXp || Math.max(6, Math.round(cost / 35));
    const finalStats = balancedStats('vjloop', 'vjloop', cost, stats);
    items.push(makeItem({
      id: `clip-${slug}`,
      label,
      type: 'vjloop',
      category: 'vjloop',
      cost,
      description,
      rarity: rarityByCost(cost),
      stats: finalStats,
      styleTarget: style,
      styleXp,
      apply(target) {
        // Ownership unlocks actual live content; practice supplies skill progression.
      },
    }));
  };

  [
    ['cheap', 'Binq StarterBeam 2200', 180, 'Projecteur bas de gamme du debut: suffisant pour Garage, faible puissance et peu de marge.', { technique: 1 }],
    ['standard', 'Epsun EB-Lo 4200 3LCD', 280, 'Image stable et couleurs propres, proche des gammes installation 3LCD.', { technique: 4 }],
    ['short-throw', 'Optomix ShortCast ST-4', 680, 'Optique courte pour petites salles et garages ou le recul manque.', { technique: 6 }],
    ['laser-entry', 'Panasound PT-Rave LZ320', 760, 'Laser compact, meilleur contraste et demarrage rapide pour bars.', { technique: 5, style: 2 }],
    ['pro-6500', 'Christalux Boxer Mini 6500', 1450, 'Modele scene moyenne: beaucoup plus de lumiere et chassis plus fiable.', { technique: 10, reputation: 3 }],
    ['ultra-4k', 'Barq UDMini 4K Laser', 2400, 'Projecteur premium inspire des machines evenementielles 4K/laser.', { technique: 14, reputation: 6 }],
  ].forEach((entry) => addGear('projector', ...entry));

  [
    ['starter-laptop', 'Lenovox FieldPad iGPU', 360, 'Niveau 1: portable simple, 1 HDMI, clips legers seulement.', { technique: 2 }],
    ['vj-laptop-gtx', 'M-Synth StageMini GTX 1 HDMI', 860, 'Niveau 2: vraie carte graphique mobile, bon pour deux petits projecteurs avec boite.', { technique: 6, creativity: 2 }],
    ['creator-laptop-rtx', 'Azus ProArtish RTX 2 sorties', 1580, 'Niveau 3: GPU mobile solide, HDMI + USB-C/DP pour mapping propre.', { technique: 11, creativity: 4 }],
    ['desktop-rtx4060', 'Raytrix Tower 4060 DP3', 1980, 'Niveau 4: desktop avec carte graphique dediee, demande ecran et adaptateurs DP vers HDMI.', { technique: 14, reputation: 2 }],
    ['desktop-rtx4080', 'Raytrix Tower 4080 Show DP3', 3600, 'Niveau 5: tour pro pour 3 projecteurs, clips lourds et shows rapides.', { technique: 22, creativity: 7, reputation: 5 }],
  ].forEach((entry) => addGear('computer', ...entry));

  [
    ['gpu-mobile', 'Raytrix Mobile VJ Core', 520, 'Upgrade compact pour laptop: meilleurs loops, mais sorties limitees.', { technique: 4 }],
    ['gpu-desktop-mid', 'Raytrix Desktop DP Duo', 960, '1 HDMI + 2 DisplayPort. Demande souvent des adaptateurs.', { technique: 8 }],
    ['gpu-desktop-pro', 'Raytrix Desktop DP Quad Pro', 1760, '1 HDMI + 3 DisplayPort, stable pour mapping multi-projecteurs.', { technique: 13, reputation: 2 }],
  ].forEach((entry) => addGear('gpu', ...entry));

  [
    ['25ft-basic', 'Kramark HDMI Run 25', 60, 'Grandeur 1: petit setup, projo proche de la table.', { technique: 1 }],
    ['75ft-active', 'Kramark ActiveRun 75', 180, 'Grandeur 2: scene moyenne, moins de tension dans le fil.', { technique: 3, reputation: 1 }],
    ['150ft-fiber', 'Kramark FiberRun 150', 420, 'Grandeur 3: long run propre jusqu au mur du fond.', { technique: 6, reputation: 2 }],
    ['loom-3pack-75', 'LiteWire Trio Loom 75', 480, 'Trois runs identiques pour deux ou trois projecteurs.', { technique: 7, style: 2 }],
    ['loom-3pack-150', 'LiteWire Fiber Trio 150', 1120, 'Pack pro pour gros lieux et racks eloignes.', { technique: 12, reputation: 4 }],
  ].forEach((entry) => addGear('cable', ...entry));

  [
    ['dp-hdmi-basic', 'PortSmith DP-HDMI Solo', 45, 'Indispensable avec les cartes desktop: souvent 1 HDMI et le reste en DisplayPort.', { technique: 1 }],
    ['usb-c-hdmi', 'PortSmith USB-C Active HDMI', 85, 'Sortie video fiable pour laptop creator.', { technique: 2 }],
    ['dp-hdmi-pro-3pack', 'PortSmith DP-HDMI Triple Pro', 210, 'Necessaire pour brancher plusieurs projecteurs depuis une tour.', { technique: 4, reputation: 1 }],
    ['edid-locker', 'SignalLock EDID Box', 260, 'Evite les pertes de signal quand un projo redemarre.', { technique: 5 }],
  ].forEach((entry) => addGear('adapter', ...entry));

  [
    ['gaff-pocket', 'StageTack Pocket Roll', 55, 'Petit rouleau utile pour les setups rapides.', { technique: 1, reputation: 1 }],
    ['wide-lens', 'Optomix WideKit 0.8', 380, 'Permet de couvrir plus large sans reculer autant.', { technique: 3 }],
    ['mapping-kit', 'MapLab Marker Kit', 540, 'Reperes et outils pour ajuster les masques plus vite.', { technique: 5, creativity: 2 }],
    ['roadcase-pro', 'RoadVault Flight XL', 620, 'Look pro et moins de stress avant un gig.', { reputation: 3, style: 2 }],
    ['mini-controller', 'A-KAI PadMix Mini', 450, 'Controleur compact pour declencher clips et effets.', { creativity: 5, style: 2 }],
  ].forEach((entry) => addGear('accessory', ...entry));

  [
    ['splitter-duo', 'DataPatch Duo Split', 260, 'Permet deux projecteurs avec un seul signal miroir.', { technique: 3 }],
    ['mapper-triple', 'BlackMagi MapBox Triple', 720, 'Sortie propre vers trois projecteurs avec controle rapide.', { technique: 8, creativity: 2 }],
    ['matrix-4x4', 'AnalogWhey Matrix 4x4 Pro', 1450, 'Route plusieurs sources et projecteurs pour les gros gigs.', { technique: 13, reputation: 4 }],
  ].forEach((entry) => addGear('router', ...entry));

  [
    ['midi-mini', 'A-KAI PadMix Mini', 280, 'Controle live simple: opacity, clip suivant, strobe.', { creativity: 4, style: 2 }],
    ['vj-deck', 'ElGateau StreamPad VJ 8', 740, 'Controle plus rapide pour styles et transitions.', { creativity: 8, technique: 3, style: 3 }],
    ['show-control-pro', 'Rezolume ShowDeck Pro', 1580, 'Controle premium pour multi-projecteurs et gigs rapides.', { creativity: 12, technique: 6, reputation: 3 }],
  ].forEach((entry) => addGear('console', ...entry));

  [
    ['monitor-24', 'Delle ViewDesk 24', 220, 'Necessaire avec une tour, pratique pour previsualiser les loops.', { technique: 2 }],
    ['monitor-27', 'Azus ProArtish 27', 420, 'Plus de place pour timeline, preview et mapping.', { technique: 4, creativity: 1 }],
    ['portable-touch', 'ViewSonic-ish TouchStage 15', 680, 'Ajoute une surface de controle meme avec laptop.', { technique: 5, creativity: 3 }],
  ].forEach((entry) => addGear('screen', ...entry));

  [
    ['messenger-basic', 'RoadVault Messenger 12', 55, 'Transporte laptop et fils courts.', { style: 1 }],
    ['vj-backpack', 'RoadVault VJ Pack 32', 180, 'Compartiments pour adaptateurs, fils et controleur.', { technique: 2, reputation: 1 }],
    ['road-backpack', 'RoadVault Flight Backpack', 360, 'Transport propre et protege pour gear de niveau pro.', { technique: 3, reputation: 3 }],
  ].forEach((entry) => addGear('bag', ...entry));

  [
    ['micro-room', 'Micro studio sous-sol', 240, 140, 6, 'Un coin cheap pour pratiquer sans pression.', { style: 1 }],
    ['econo', 'Appartement econo', 300, 220, 8, 'Demarrage autonome avec un vrai bureau.', { reputation: 2 }],
    ['loft-small', 'Petit loft creatif', 620, 420, 14, 'Espace plus beau pour preparer les shows.', { style: 4 }],
    ['medium', 'Appartement medium', 750, 520, 18, 'Meilleur espace de travail, fatigue plus stable.', { style: 5 }],
    ['shared-studio', 'Studio partage VJ', 900, 600, 20, 'Rencontres et contacts avec autres artistes.', { network: 6, reputation: 2 }],
    ['warehouse-room', 'Chambre warehouse', 1120, 680, 22, 'Ambiance underground et place pour le gear.', { style: 8 }],
    ['soundproof', 'Studio insonorise', 1450, 820, 28, 'Pratique tard le soir sans perdre de reputation.', { technique: 4, reputation: 4 }],
    ['luxe', 'Appartement luxe', 1600, 1100, 30, 'Gros boost social pour gigs premium.', { style: 10, reputation: 5 }],
    ['artist-loft', 'Loft artiste premium', 2200, 1400, 36, 'Grand espace de creation avec mur test.', { style: 12, network: 5 }],
    ['penthouse', 'Penthouse scene view', 3600, 2100, 44, 'Adresse impressionnante pour clients haut niveau.', { style: 16, reputation: 10 }],
  ].forEach((entry) => addHousing(...entry));

  [
    ['pin-vj', 'Pin VJ neon', 35, 'shirt', 'pin', 'Petit detail visible sur le hoodie.', { style: 1, network: 1 }],
    ['beanie-black', 'Tuque noire VJ', 65, 'shirt', 'beanie', 'Look simple pour debuter.', { style: 2 }],
    ['hoodie-vj', 'Hoodie VJ classic', 130, 'shirt', 'neon', 'Logo VJ visible, simple et efficace.', { style: 8 }],
    ['jacket-blackout', 'Veste Blackout', 190, 'shirt', 'blackout', 'Look technique pour montage en salle.', { style: 7, reputation: 1 }],
    ['jacket-reflective', 'Veste reflective', 260, 'shirt', 'reflective', 'Details qui reagissent aux lumieres.', { style: 10 }],
    ['cap-low', 'Casquette low profile', 85, 'headphones', true, 'Silhouette plus proche du VJ pro.', { style: 4 }],
    ['pants-cargo', 'Cargo noir scene', 160, 'pants', 'cargo', 'Poches pour adaptateurs et gaff.', { style: 5 }],
    ['pants-tech', 'Pantalon techwear', 240, 'pants', 'techwear', 'Plus premium, plus credible en setup.', { style: 8, reputation: 1 }],
    ['shoes-cyan', 'Sneakers cyan LED', 120, 'shoes', 'cyan', 'Accent lumineux sur le personnage.', { style: 6 }],
    ['shoes-magenta', 'Sneakers magenta', 150, 'shoes', 'magenta', 'Look club plus colore.', { style: 7 }],
    ['headphones-basic', 'Casque monitoring basic', 110, 'headphones', true, 'Accessoire essentiel pour le VJ.', { technique: 1, style: 3 }],
    ['headphones-pro', 'Casque monitoring pro', 340, 'headphones', true, 'Plus pro sur la table et sur le perso.', { technique: 3, style: 6 }],
    ['gloves-stage', 'Gants stage noir', 95, 'shirt', 'gloves', 'Petit detail visuel de technicien.', { style: 3 }],
    ['mask-club', 'Masque club neon', 180, 'shirt', 'mask', 'Signature visuelle pour reseaux sociaux.', { style: 9, network: 2 }],
    ['coat-tour', 'Manteau tour manager', 420, 'shirt', 'tour', 'Look haut niveau pour gros contrats.', { style: 12, reputation: 3 }],
    ['vest-led', 'Veste LED VJ', 680, 'shirt', 'led', 'Veste lumineuse signature.', { style: 16, reputation: 4 }],
    ['full-fit-pro', 'Fit complet Pro VJ', 980, 'shirt', 'pro-fit', 'Tenue premium coordonnee.', { style: 20, reputation: 6 }],
  ].forEach((entry) => addClothing(...entry));

  [
    ['starter-loop', 'Pack Starter Loop', 60, 'techno', 'Quelques boucles simples pour pratiquer.', { style: 1, creativity: 1, styleXp: 4 }],
    ['garage-noise', 'Pack Garage Noise', 75, 'hiphop', 'Textures brutes pour petits gigs.', { style: 2, creativity: 1, styleXp: 5 }],
    ['liquid-lines', 'Pack Liquid Lines', 220, 'chill', 'Boucles fluides pour bars et lounge.', { style: 4, creativity: 2, styleXp: 8 }],
    ['psy-grid', 'Pack Psy Grid', 340, 'psytrance', 'Grilles rapides et patterns hypnotiques.', { style: 5, creativity: 3, styleXp: 14 }],
    ['techno-strobe', 'Pack Techno Strobe', 280, 'techno', 'Visuels durs pour kick et strobes.', { style: 4, creativity: 2, styleXp: 12 }],
    ['hiphop-chrome', 'Pack HipHop Chrome', 260, 'hiphop', 'Chrome, glitch et typographies urbaines.', { style: 5, creativity: 2, styleXp: 10 }],
    ['ambient-clouds', 'Pack Ambient Clouds', 190, 'chill', 'Textures lentes pour setup plus doux.', { style: 3, creativity: 2, styleXp: 8 }],
    ['laser-cave', 'Pack Laser Cave', 420, 'techno', 'Tunnels lasers et mouvements profonds.', { style: 6, creativity: 4, styleXp: 16 }],
    ['fractal-bloom', 'Pack Fractal Bloom', 520, 'psytrance', 'Fractales propres pour mapping avance.', { style: 8, creativity: 5, styleXp: 18 }],
    ['city-glitch', 'Pack City Glitch', 360, 'hiphop', 'Buildings, glitches et motion rapide.', { style: 5, creativity: 3, styleXp: 13 }],
    ['premium-opener', 'Pack Premium Opener', 880, 'techno', 'Intro visuelle qui impressionne les clients.', { style: 10, creativity: 8, styleXp: 20 }],
    ['festival-rush', 'Pack Festival Rush', 1200, 'psytrance', 'Boucles plus riches pour grosses scenes.', { style: 14, creativity: 10, styleXp: 24 }],
    ['neon-water', 'Pack Neon Water', 310, 'chill', 'Reflets liquides et couleurs propres.', { style: 5, creativity: 3, styleXp: 12 }],
    ['black-white', 'Pack Noir Blanc Impact', 250, 'techno', 'Contraste fort pour murs simples.', { style: 4, creativity: 2, styleXp: 9 }],
    ['retro-crt', 'Pack Retro CRT', 290, 'hiphop', 'Scanlines, VHS et textures old school.', { style: 5, creativity: 3, styleXp: 11 }],
    ['organic-tunnel', 'Pack Organic Tunnel', 460, 'psytrance', 'Tunnels organiques pour projections profondes.', { style: 7, creativity: 5, styleXp: 16 }],
    ['gold-show', 'Pack Gold Show', 760, 'chill', 'Palette luxueuse pour clients corporatifs.', { style: 9, creativity: 5, styleXp: 18 }],
  ].forEach((entry) => addClip(...entry));

  const loopStyles = ['techno', 'hiphop', 'chill', 'psytrance', 'rock'];
  const loopMoods = [
    'Signal', 'Laser', 'Chrome', 'Liquid', 'Tunnel', 'Pulse', 'Prism', 'Grid',
    'Neon', 'Smoke', 'Orbit', 'Fractal', 'Glass', 'Strobe', 'Depth',
  ];
  loopStyles.forEach((style, styleIndex) => {
    loopMoods.forEach((mood, moodIndex) => {
      const number = styleIndex * loopMoods.length + moodIndex + 1;
      const tier = Math.floor(moodIndex / 3) + 1;
      const cost = 90 + tier * 85 + styleIndex * 18 + moodIndex * 11;
      addClip(
        `${style}-${String(number).padStart(2, '0')}-${mood.toLowerCase()}`,
        `VJ Loop ${String(number).padStart(2, '0')} ${mood} ${style}`,
        cost,
        style,
        `Pack numerote ${number}/75 pour gigs ${style}. Les contrats avancent demandent 1, 2 puis 3 packs du bon style.`,
        {
          creativity: 1 + tier,
          style: Math.max(1, tier - 1),
          technique: tier >= 4 ? -2 : -1,
          styleXp: 5 + tier * 3,
        }
      );
    });
  });

  return items;
}

function applyShopStatEffects(target, stats = {}) {
  const s = target.stats;
  if (stats.creativity) s.creativity = clamp(s.creativity + stats.creativity, 0, 100);
  if (stats.technique) s.technique = clamp(s.technique + stats.technique, 0, 100);
  if (stats.fatigue) s.fatigue = clamp(s.fatigue + stats.fatigue, 0, 100);
  if (stats.reputation) s.reputation = clamp(s.reputation + stats.reputation, 0, 100);
  if (stats.style) s.style = clamp(s.style + stats.style, 0, 100);
  if (stats.network) s.network = clamp(s.network + stats.network, 0, 100);
  if (stats.xp) addXp(stats.xp);
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111216);
scene.fog = new THREE.Fog(0x111216, 18, 60);

const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const textureLoader = new THREE.TextureLoader();
const laptopScreenTexture = textureLoader.load('/image/ee5bea38-f7a7-4313-9c20-1025dba65ed1.png');
laptopScreenTexture.colorSpace = THREE.SRGBColorSpace;
laptopScreenTexture.anisotropy = 4;
const testCardTexture = createTestCardTexture();

const clock = new THREE.Clock();
const keys = new Set();
const rigs = [];
const history = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const connectButtonMeshes = [];

const cameraControl = {
  target: new THREE.Vector3(0, 2.2, -1.5),
  yaw: 0,
  pitch: 0.54,
  distance: 18.4,
  dragging: false,
  mode: 'orbit',
  lastX: 0,
  lastY: 0,
  moved: false,
};

const roomBounds = {
  minX: -15.2,
  maxX: 15.2,
  minY: 1.1,
  maxY: 10.5,
  minZ: -10.8,
  maxZ: 27.8,
};

let slots = loadSlots();
let activeSlot = loadActiveSlot();
let profile = slots[activeSlot];
let currentApp = null;
let selectedEmailId = null;
let selectedCalendarDay = null;
let guideSection = 'start';
let bookingStyleFilter = 'all';
let currentVideoIndex = 0;
let shopView = 'home';
let shopGearFilter = 'all';
let shopLoopFilter = 'all';
let shopDetailItemId = null;
let pendingSlotIndex = null;
let clothingPreview = null;
let jobWindowMode = 'home';
let restWindowMode = 'home';
let musicAudio = new Audio();
let musicTrackName = '';
let musicPlaying = false;
let musicPlaylist = [];
let musicTrackIndex = -1;
let musicAudioContext = null;
let musicAnalyser = null;
let musicSourceNode = null;
let musicFrequencyData = null;
let videoElement = null;
let clipTexture = null;
let liveShow = null;
let liveTexture = null;
let liveSetupElapsed = null;
let liveFrameAt = performance.now();
let player = null;
let deskStation = null;
let stageGroup = null;
let clothingStoreGroup = null;
let activeRigIndex = 0;
let aggregateScore = { coverage: 0, trapeze: 0, mask: 0 };
let controlWasActive = false;
let currentGig = null;
let pendingGigSetup = null;
let activeGigLoadout = null;
let runFinished = false;
let penMode = false;
let gigStartedAt = null;
let applyingWindowBounds = false;
let windowBoundsSaveTimer = null;
let appWindowDrag = null;
let floatingWindowZ = 18;
const inactiveWindows = [];
const appWindowResizeObserver = typeof ResizeObserver !== 'undefined'
  ? new ResizeObserver(handleAppWindowResizeObserved)
  : null;
appWindowResizeObserver?.observe(appWindow);

initializeCatalogRules();
setupScene();
buildClipPicker();
loadVideoTexture(videoClips[currentVideoIndex].src);
buildGigScene();
renderSlots();
updateProfileChrome();
showScreen('slots');
animate();

slotButtons.forEach((button) => {
  button.addEventListener('click', () => openSlotConfirm(Number(button.dataset.slot)));
});
deleteSlotButton.addEventListener('click', deleteActiveSlot);
openOptionsButton.addEventListener('click', () => showScreen('options'));
closeOptionsButton.addEventListener('click', () => showScreen('slots'));
backSlotsButton.addEventListener('click', () => showScreen('slots'));
createVjButton.addEventListener('click', createCareer);
godModeEntry?.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  event.stopPropagation();
  openGodModePrompt();
});
godModeEntry?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
});
godPasswordCancel?.addEventListener('click', closeGodPasswordModal);
godPasswordSubmit?.addEventListener('click', submitGodPassword);
godPasswordInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') submitGodPassword();
  if (event.key === 'Escape') closeGodPasswordModal();
});
slotConfirmNo?.addEventListener('click', closeSlotConfirm);
slotConfirmYes?.addEventListener('click', () => {
  if (pendingSlotIndex === null) return;
  const index = pendingSlotIndex;
  closeSlotConfirm();
  chooseSlot(index);
});
[shirtStyleInput, shirtColorInput, pantsColorInput, shoeStyleInput, hairStyleInput, hairColorInput, headphonesInput, creatorLanguageInput].forEach((input) => {
  input.addEventListener('input', updateCreatorPreview);
  input.addEventListener('change', updateCreatorPreview);
});
languageSelect?.addEventListener('change', () => {
  profile.settings.language = languageSelect.value;
  saveSlots();
  renderDesktop();
});
appButtons.forEach((button) => {
  button.addEventListener('click', () => {
    closeOsGameMenu();
    openApp(button.dataset.app);
  });
});
document.querySelector('.os-menu-bar')?.addEventListener('click', (event) => {
  const openButton = event.target.closest('[data-os-open]');
  const actionButton = event.target.closest('[data-menu-action]');
  event.stopPropagation();
  if (openButton) {
    closeOsGameMenu();
    openApp(openButton.dataset.osOpen);
    return;
  }
  if (actionButton) {
    handleOsMenuAction(actionButton.dataset.menuAction);
  }
});
document.querySelector('.desktop-icons').addEventListener('click', (event) => {
  const button = event.target.closest('[data-app]');
  if (button) {
    closeOsGameMenu();
    openApp(button.dataset.app);
  }
});
document.addEventListener('pointerdown', (event) => {
  if (osGameMenu.hidden) return;
  if (event.target.closest('.os-menu-bar')) return;
  closeOsGameMenu();
});
openComputerButton.addEventListener('click', () => {
  gigComputer.hidden = false;
});
returnDesktopButton.addEventListener('click', () => returnToDesktopFromGig());
closeGigComputerButton.addEventListener('click', () => {
  gigComputer.hidden = true;
});
connectProjectorButton.addEventListener('click', connectActiveProjector);
toggleHelpButton.addEventListener('click', toggleGigHelp);
maskToolButton.addEventListener('click', togglePenMode);
undoButton.addEventListener('click', undoCalibration);
resetButton.addEventListener('click', resetGigRun);
cancelGigButton.addEventListener('click', () => cancelCurrentGig());
finishGigButton.addEventListener('click', finishGig);
document.querySelector('#start-live-button').addEventListener('click', startLivePerformance);
resultCloseButton.addEventListener('click', () => {
  resultModal.hidden = true;
  currentGig = null;
  activeGigLoadout = null;
  saveSlots();
  closeAppWindow(false);
  clearInactiveWindows();
  showScreen('desktop');
});
musicAudio.addEventListener('ended', () => {
  if (musicPlaylist.length > 1) {
    playPlaylistTrack((musicTrackIndex + 1) % musicPlaylist.length);
    return;
  }
  musicPlaying = false;
  updateProfileChrome();
  if (currentApp === 'music') renderMusicPlayer();
});
gigSetupCloseButton.addEventListener('click', closeGigSetup);
gigSetupStartButton.addEventListener('click', beginGigFromSetup);

canvas.addEventListener('contextmenu', (event) => event.preventDefault());
canvas.addEventListener('pointerdown', onCanvasPointerDown);
appWindow.addEventListener('pointerdown', onAppWindowPointerDown);
appWindow.addEventListener('dblclick',e=>{if(e.target.closest('.app-heading,.atazone-bar')&&!e.target.closest('button,input,select'))toggleAppWindowMaximized();});
window.addEventListener('pointermove', onCanvasPointerMove);
window.addEventListener('pointermove', onAppWindowPointerMove);
window.addEventListener('pointerup', onCanvasPointerUp);
window.addEventListener('pointerup', onAppWindowPointerUp);
canvas.addEventListener('wheel', onCanvasWheel, { passive: false });

window.addEventListener('keydown', (event) => {
  if (event.target.closest('input,select,textarea,button')) return;
  const key = event.key.toLowerCase();
  const inGig = document.body.classList.contains('screen-gig');
  if (key === 'escape' && !osGameMenu.hidden) {
    closeOsGameMenu();
    return;
  }
  if (key === 'escape' && document.body.classList.contains('screen-desktop') && currentApp !== null) {
    closeAppWindow();
    return;
  }
  if (inGig && key === 'e') {
    event.preventDefault();
    connectActiveProjector();
    return;
  }
  if (inGig && /^[1-3]$/.test(key)) {
    event.preventDefault();
    selectRigByIndex(Number(key) - 1);
    return;
  }
  keys.add(key);
  if (inGig && key === 'tab') {
    event.preventDefault();
    cycleActiveRig();
  }
  if (inGig && key === 'r') resetGigRun();
  if (inGig && key === 'z') undoCalibration();
});

window.addEventListener('keyup', (event) => {
  keys.delete(event.key.toLowerCase());
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (currentApp !== null) applySavedWindowSize();
});

function makeEmptySlot(index) {
  return {
    created: false,
    slotName: `Slot ${index + 1}`,
    name: `VJ`,
    day: 1,
    location: 'Garage des parents',
    money: 0,
    orientation: 'balanced',
    appearance: {
      shirt: 'neon',
      shirtColor: 'black',
      pants: 'black',
      shoes: 'cyan',
      hairStyle: 'cap',
      hairColor: 'black',
      headphones: true,
    },
    stats: {
      creativity: 100,
      technique: 0,
      fatigue: 0,
      reputation: 0,
      style: 0,
      network: 0,
      jobine: 120,
      xp: 0,
      level: 1,
    },
    skills: Object.fromEntries(skillCatalog.map((skill) => [skill.id, 0])),
    skillPractice: {},
    gear: {
      projector: 'cheap',
      computer: 'starter-laptop',
      laptop: 'basic',
      cable: '25ft-basic',
      adapter: 'none',
      router: 'none',
      console: 'none',
      screen: 'none',
      bag: 'messenger-basic',
      accessory: 'none',
    },
    housing: {
      type: 'Chez tes parents - garage',
      rent: 0,
      comfort: 2,
    },
    styleXp: {
      techno: 0,
      hiphop: 0,
      chill: 0,
      psytrance: 0,
      rock: 0,
    },
    hype: {
      underground: 0,
      corporate: 0,
      artistic: 0,
      social: 0,
      festival: 0,
    },
    emails: [],
    phoneMessages: [],
    notifications: [],
    calendarLog: {},
    energyLog: { day: 1, remaining: DAILY_ENERGY_MAX },
    prepPlans: {},
    socialEmailLog: { day: 1, count: 0 },
    settings: {
      language: 'fr',
      volume: 70,
      graphics: 'balanced',
      windowBounds: { width: 1160, height: 680 },
    },
    loans: [],
    financeLog: [],
    gigs: starterGigs.map((gig) => ({ ...gig })),
    pendingResponses: [],
    ownedItems: getStarterOwnedItems(),
    inventory: {},
    jobDays: 0,
  };
}

function makeFreshCareerSlot(index) {
  const slot = makeEmptySlot(index);
  slot.created = false;
  slot.slotName = `Slot ${index + 1}`;
  slot.name = 'VJ';
  slot.day = 1;
  slot.location = 'Garage des parents';
  slot.money = 0;
  slot.stats = {
    creativity: 100,
    technique: 0,
    fatigue: 0,
    reputation: 0,
    style: 0,
    network: 0,
    jobine: 120,
    xp: 0,
    level: 1,
  };
  slot.jobDays = 0;
  slot.calendarLog = {};
  slot.energyLog = { day: 1, remaining: DAILY_ENERGY_MAX };
  slot.financeLog = [];
  slot.loans = [];
  slot.pendingResponses = [];
  slot.gigs = starterGigs.map((gig) => ({ ...gig }));
  syncGigClientTypes(slot);
  return slot;
}

function getStarterOwnedItems() {
  return [
    'computer-starter-laptop',
    'projector-cheap',
    'cable-25ft-basic',
    'bag-messenger-basic',
    'clip-starter-loop',
  ];
}

function ensureStarterInventory(target) {
  if (!target.created && !target.slotName) return target;
  target.ownedItems = Array.isArray(target.ownedItems) ? target.ownedItems : [];
  target.ownedItems = target.ownedItems.filter((itemId) => !itemId.startsWith('laptop-'));
  if (target.inventory && typeof target.inventory === 'object') {
    Object.keys(target.inventory).forEach((itemId) => {
      if (itemId.startsWith('laptop-')) delete target.inventory[itemId];
      const item = shopItems.find((entry) => entry.id === itemId);
      if (item && item.category === 'gear' && !item.stackable) delete target.inventory[itemId];
    });
  }
  getStarterOwnedItems().forEach((itemId) => {
    if (!target.ownedItems.includes(itemId)) target.ownedItems.push(itemId);
  });
  target.gear = {
    ...target.gear,
    projector: target.gear?.projector || 'cheap',
    computer: target.gear?.computer || 'starter-laptop',
    cable: target.gear?.cable || '25ft-basic',
    bag: target.gear?.bag || 'messenger-basic',
  };
  target.styleXp = {
    ...target.styleXp,
    techno: Number(target.styleXp?.techno) || 0,
  };
  return target;
}

function loadSlots() {
  for (const key of [SAVE_KEY, `${SAVE_KEY}-backup`]) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (Array.isArray(saved)) {
      return [0, 1, 2].map((index) => normalizeSlot(saved[index], index));
    }
  } catch {
    // Try the previous valid copy before creating a fresh career.
  }
  }
  return [0, 1, 2].map(makeFreshCareerSlot);
}

function normalizeSlot(data, index) {
  const base = makeEmptySlot(index);
  if (!data || typeof data !== 'object') return base;
  const merged = {
    ...base,
    ...data,
    appearance: { ...base.appearance, ...(data.appearance || {}) },
    stats: { ...base.stats, ...(data.stats || {}) },
    skills: { ...base.skills, ...(data.skills || {}) },
    skillPractice: data.skillPractice && typeof data.skillPractice === 'object' ? data.skillPractice : base.skillPractice,
    gear: { ...base.gear, ...(data.gear || {}) },
    housing: { ...base.housing, ...(data.housing || {}) },
    styleXp: { ...base.styleXp, ...(data.styleXp || {}) },
    hype: { ...base.hype, ...(data.hype || {}) },
    emails: Array.isArray(data.emails) ? data.emails : base.emails,
    phoneMessages: Array.isArray(data.phoneMessages) ? data.phoneMessages : base.phoneMessages,
    notifications: Array.isArray(data.notifications) ? data.notifications : base.notifications,
    calendarLog: data.calendarLog && typeof data.calendarLog === 'object' ? data.calendarLog : base.calendarLog,
    energyLog: data.energyLog && typeof data.energyLog === 'object' ? data.energyLog : base.energyLog,
    prepPlans: data.prepPlans && typeof data.prepPlans === 'object' ? data.prepPlans : base.prepPlans,
    socialEmailLog: data.socialEmailLog && typeof data.socialEmailLog === 'object' ? data.socialEmailLog : base.socialEmailLog,
    settings: data.settings && typeof data.settings === 'object' ? { ...base.settings, ...data.settings } : base.settings,
    loans: Array.isArray(data.loans) ? data.loans : base.loans,
    financeLog: Array.isArray(data.financeLog) ? data.financeLog : base.financeLog,
    gigs: Array.isArray(data.gigs) ? data.gigs.map((gig) => ({ ...gig })) : base.gigs,
    pendingResponses: Array.isArray(data.pendingResponses) ? data.pendingResponses : base.pendingResponses,
    ownedItems: Array.isArray(data.ownedItems) ? data.ownedItems : base.ownedItems,
    inventory: data.inventory && typeof data.inventory === 'object' ? data.inventory : base.inventory,
    jobDays: Number(data.jobDays) || 0,
  };
  ensureStarterInventory(merged);
  merged.gear.computer = merged.gear.computer || migrateLaptopToComputer(merged.gear.laptop) || base.gear.computer;
  merged.gear.cable = merged.gear.cable === 'short' ? '25ft-basic' : merged.gear.cable;
  merged.gear.adapter = merged.gear.adapter || base.gear.adapter;
  merged.gear.router = merged.gear.router || base.gear.router;
  merged.gear.console = merged.gear.console || base.gear.console;
  merged.gear.screen = merged.gear.screen || base.gear.screen;
  merged.gear.bag = merged.gear.bag || base.gear.bag;
  merged.gear.accessory = merged.gear.accessory || base.gear.accessory;
  if (merged.housing.type === 'Chez ta mere') {
    merged.housing.type = 'Chez tes parents - garage';
    merged.housing.comfort = Math.max(Number(merged.housing.comfort) || 0, 2);
    merged.location = 'Garage des parents';
  }
  merged.day = Number(merged.day) || 1;
  merged.money = Number(merged.money) || 0;
  syncGigClientTypes(merged);
  merged.energyLog.day = Number(merged.energyLog.day) || merged.day;
  merged.energyLog.remaining = Number.isFinite(Number(merged.energyLog.remaining)) ? Number(merged.energyLog.remaining) : DAILY_ENERGY_MAX;
  merged.socialEmailLog.day = Number(merged.socialEmailLog.day) || merged.day;
  merged.socialEmailLog.count = Number(merged.socialEmailLog.count) || 0;
  merged.stats.jobine = Number(merged.stats.jobine) || getJobPay(merged);
  merged.emails = merged.emails.filter(isUsefulEmail).map((email, emailIndex) => ({
    id: email.id || `mail-${merged.day}-${emailIndex}-${Math.random().toString(16).slice(2)}`,
    read: email.read ?? !email.unread,
    type: email.type || 'info',
    gigId: email.gigId || null,
    ...email,
  }));
  merged.gigs = mergeStarterGigData(merged.gigs);
  normalizeGigScheduleData(merged);
  return merged;
}

function migrateLaptopToComputer(slug) {
  const map = {
    basic: 'starter-laptop',
    standard: 'vj-laptop-gtx',
    'vj-mini': 'vj-laptop-gtx',
    'render-pro': 'creator-laptop-rtx',
    'touch-deck': 'creator-laptop-rtx',
    'max-rig': 'desktop-rtx4080',
  };
  return map[slug] || null;
}

function syncGigClientTypes(target = profile) {
  if (!target?.gigs) return;
  const typeIds = Object.keys(CLIENT_TYPES);
  target.gigs.forEach((gig, index) => {
    if (!gig.clientType || !CLIENT_TYPES[gig.clientType]) {
      if (gig.venue?.toLowerCase().includes('festival')) gig.clientType = 'festival';
      else if (gig.type?.toLowerCase().includes('corporatif') || gig.budget >= 1300) gig.clientType = 'corpo';
      else if (gig.venue?.toLowerCase().includes('warehouse') || gig.venue?.toLowerCase().includes('entrepot')) gig.clientType = 'underground';
      else gig.clientType = typeIds[index % typeIds.length];
    }
    const client = CLIENT_TYPES[gig.clientType] || CLIENT_TYPES.chill;
    if (!gig.baseBudget) gig.baseBudget = gig.budget;
    if (['accepted','scheduled'].includes(gig.status) && !gig.contractBudget) gig.contractBudget = gig.budget;
    gig.budget = gig.contractBudget ?? Math.max(80, Math.round(gig.baseBudget * client.budgetMultiplier));
  });
}

function getClientProfile(gig) {
  return CLIENT_TYPES[gig?.clientType] || CLIENT_TYPES.chill;
}

function isUsefulEmail(email) {
  if (!email) return false;
  if (email.from === 'Moi') return false;
  if (email.from === 'Finance' && /Rappel logement|Premier du mois/.test(email.subject || '')) return false;
  return true;
}

function mergeStarterGigData(gigs) {
  const savedById = new Map((Array.isArray(gigs) ? gigs : []).map((gig) => [gig.id, gig]));
  return starterGigs.map((starter) => {
    const gig = savedById.get(starter.id);
    if (!gig) return { ...starter };
    return {
      ...starter,
      ...gig,
      status: gig.status || starter.status,
      responseIn: gig.responseIn ?? starter.responseIn,
      baseBudget: starter.baseBudget,
      budget: gig.contractBudget ?? gig.budget ?? starter.budget,
      contractBudget: gig.contractBudget,
    };
  });
}

function loadActiveSlot() {
  let saved;
  try { saved = Number(localStorage.getItem(ACTIVE_SLOT_KEY)); } catch { return 0; }
  return Number.isInteger(saved) && saved >= 0 && saved < 3 ? saved : 0;
}

function saveSlots() {
  if(profile?.godMode)profile.money=GOD_MODE_MONEY;
  captureActiveRun();
  slots[activeSlot] = profile;
  try {
    const previous = localStorage.getItem(SAVE_KEY);
    if(previous) localStorage.setItem(`${SAVE_KEY}-backup`,previous);
    localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
    localStorage.setItem(ACTIVE_SLOT_KEY, String(activeSlot));
  } catch {
    notify('Sauvegarde impossible : le stockage du navigateur est plein ou indisponible. Garde cette page ouverte.');
    return false;
  }
  renderSlots();
  updateProfileChrome();
}

function closeOsGameMenu() {
  if (osGameMenu) osGameMenu.hidden = true;
}

function handleOsMenuAction(action) {
  if (action === 'game') {
    osGameMenu.hidden = !osGameMenu.hidden;
    return;
  }
  closeOsGameMenu();
  if (action === 'save') {
    saveSlots();
    notify(t('saved'));
    return;
  }
  if (action === 'load') {
    closeAppWindow(false);
    clearInactiveWindows();
    showScreen('slots');
    return;
  }
  if (action === 'new') {
    closeAppWindow(false);
    clearInactiveWindows();
    showScreen('creator');
    return;
  }
  if (action === 'quit') {
    saveSlots();
    closeAppWindow(false);
    clearInactiveWindows();
    showScreen('slots');
  }
}

function openSlotConfirm(index) {
  pendingSlotIndex = index;
  activeSlot = index;
  profile = slots[activeSlot];
  localStorage.setItem(ACTIVE_SLOT_KEY, String(activeSlot));
  renderSlots();
  const slot = slots[index];
  if (slot.created) {
    slotConfirmTitle.textContent = `Ouvrir ${slot.name}?`;
    slotConfirmText.textContent = `Voulez-vous continuer cette carriere de VJ? Jour ${slot.day}, niveau ${slot.stats.level}, ${slot.money}$.`;
  } else {
    slotConfirmTitle.textContent = 'Commencer la carriere?';
    slotConfirmText.textContent = `Voulez-vous commencer votre carriere de VJ avec le slot ${index + 1}?`;
  }
  slotConfirmModal.hidden = false;
}

function closeSlotConfirm() {
  pendingSlotIndex = null;
  slotConfirmModal.hidden = true;
}

function chooseSlot(index) {
  activeSlot = index;
  profile = slots[activeSlot];
  localStorage.setItem(ACTIVE_SLOT_KEY, String(activeSlot));
  renderSlots();
  if (profile.created) {
    closeAppWindow(false);
    clearInactiveWindows();
    showScreen('desktop');
  } else {
    fillCreatorFromProfile();
    setupHumanSelector();
    showScreen('creator');
  }
}

function deleteActiveSlot() {
  const label = profile.created ? profile.name : `Slot ${activeSlot + 1}`;
  if (!window.confirm(`Effacer "${label}" et toute sa carriere?`)) return;
  slots[activeSlot] = makeFreshCareerSlot(activeSlot);
  profile = slots[activeSlot];
  resetRuntimeForFreshSlot();
  localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
  localStorage.setItem(ACTIVE_SLOT_KEY, String(activeSlot));
  renderSlots();
  updateProfileChrome();
  fillCreatorFromProfile();
  showScreen('slots');
  notify('Slot efface: stats, argent, gigs, inventaire, dettes et progression remis au depart.');
}

function resetRuntimeForFreshSlot() {
  closeAppWindow(false);
  clearInactiveWindows();
  currentGig = null;
  pendingGigSetup = null;
  activeGigLoadout = null;
  runFinished = false;
  gigStartedAt = null;
  selectedEmailId = null;
  selectedCalendarDay = null;
  shopView = 'home';
  shopGearFilter = 'all';
  shopLoopFilter = 'all';
  bookingStyleFilter = 'all';
  clothingPreview = null;
  keys.clear();
  gigSetupModal.hidden = true;
  resultModal.hidden = true;
  showScreen('slots');
  applyAppearanceToPlayer();
}

function fillCreatorFromProfile() {
  vjNameInput.value = profile.created ? profile.name : 'VJ';
  setSelectValue(shirtStyleInput, getCreatorShirtValue(profile.appearance.shirt), 'neon');
  setSelectValue(shirtColorInput, profile.appearance.shirtColor, 'black');
  setSelectValue(pantsColorInput, getCreatorPantsValue(profile.appearance.pants), 'black');
  setSelectValue(shoeStyleInput, profile.appearance.shoes, 'cyan');
  setSelectValue(hairStyleInput, profile.appearance.hairStyle, 'cap');
  setSelectValue(hairColorInput, profile.appearance.hairColor, 'black');
  setSelectValue(creatorLanguageInput, profile.settings?.language || 'fr', 'fr');
  setSelectValue(languageSelect, profile.settings?.language || 'fr', 'fr');
  headphonesInput.checked = profile.appearance.headphones;
  applyAppearanceToPlayer();
}

function getCreatorShirtValue(value) {
  const supported = ['neon', 'minimal', 'glitch', 'wave', 'laser', 'cube', 'equalizer', 'orbit', 'prism', 'chrome'];
  return supported.includes(value) ? value : 'neon';
}

function getCreatorPantsValue(value) {
  const supported = ['black', 'charcoal', 'blue', 'white', 'cyan', 'magenta', 'purple', 'green', 'yellow', 'red'];
  return supported.includes(value) ? value : 'black';
}

function setSelectValue(select, value, fallback) {
  if(!select)return;
  select.value = value ?? fallback;
  if (select.value !== String(value ?? fallback)) select.value = fallback;
}

function updateCreatorPreview() {
  if (!profile) return;
  if(!headphonesInput.checked&&profile.equippedWear)delete profile.equippedWear.headphones;
  profile.appearance = {
    ...profile.appearance,
    character: profile.appearance.character||'nova',
    shirt: shirtStyleInput.value,
    shirtColor: shirtColorInput.value,
    pants: pantsColorInput.value,
    shoes: shoeStyleInput.value,
    hairStyle: hairStyleInput.value,
    hairColor: hairColorInput.value,
    headphones: headphonesInput.checked,
  };
  applyAppearanceToPlayer();
}

function createCareer() {
  const name = normalizeVjName(vjNameInput.value);
  const selectedCharacter=profile.appearance.character||'nova';
  profile = makeFreshCareerSlot(activeSlot);
  profile.created = true;
  profile.name = name;
  profile.orientation = 'balanced';
  profile.settings.academy={lesson:0,best:0,completed:0,roomWins:[]};
  profile.settings.language = creatorLanguageInput?.value || 'fr';
  profile.appearance = {
    character: profile.appearance.character||'nova',
    shirt: shirtStyleInput.value,
    shirtColor: shirtColorInput.value,
    pants: pantsColorInput.value,
    shoes: shoeStyleInput.value,
    hairStyle: hairStyleInput.value,
    hairColor: hairColorInput.value,
    headphones: headphonesInput.checked,
  };
  profile.appearance.character=selectedCharacter;
  profile.money = 75;
  const dmteam=name.replace(/^vj\s+/i,'').trim().toLowerCase()==='dmteam';
  if(dmteam)activateGodMode();
  addEmail('Maman', 'Ton garage est pret', `${profile.name}, ton setup cheap est dans le garage. Ouvre Booking pour trouver ton premier petit gig.`);
  profile.notifications.push('Premier email recu.');
  slots[activeSlot] = profile;
  saveSlots();
  applyAppearanceToPlayer();
  notify(dmteam?'DMTEAM : argent illimité, tous les objets et contrats débloqués, compétences au maximum.':'Carriere creee. Tu commences dans le garage avec 75$.');
  closeAppWindow(false);
  clearInactiveWindows();
  showScreen('desktop');
}

function normalizeVjName(value) {
  const raw = (value || '').trim();
  if (raw.toLowerCase().startsWith('vj')) return raw.length > 2 ? raw : 'VJ Neon';
  return `VJ ${raw || 'Neon'}`;
}

function renderSlots() {
  slotButtons.forEach((button) => {
    const index = Number(button.dataset.slot);
    const slot = slots[index];
    button.classList.toggle('selected', index === activeSlot);
    if (slot.created) {
      button.innerHTML = `
        <strong>${escapeHtml(slot.name)}</strong>
        <span>Jour ${slot.day} - ${slot.location}</span>
        <em>${slot.money}$ | Rep ${Math.round(slot.stats.reputation)} | Niveau ${slot.stats.level}</em>
      `;
    } else {
      button.innerHTML = `
        <strong>Slot ${index + 1}</strong>
        <span>Nouvelle carriere</span>
        <em>Commencer de zero</em>
      `;
    }
  });
}

function showScreen(screen) {
  if (screen !== 'gig') captureActiveRun();
  document.body.classList.remove('screen-slots', 'screen-creator', 'screen-options', 'screen-desktop', 'screen-gig');
  document.body.classList.add(`screen-${screen}`);
  if (screen !== 'gig') stopLivePerformance();
  keys.clear();
  controlWasActive = false;
  if (screen !== 'desktop') clearInactiveWindows();
  if (screen === 'options') renderSettings(document.querySelector('#options-content'));
  if (screen === 'creator') {
    setPlayerPose('look');
    focusCreatorCamera();
    updateCreatorPreview();
  }
  if (screen === 'desktop' || screen === 'slots') {
    setPlayerPose('room');
    focusRoomCamera();
  }
  if (screen === 'slots') {
    cameraControl.target.set(-3.8, 2.8, -3);
    cameraControl.yaw = -0.16;
    cameraControl.pitch = 0.2;
    cameraControl.distance = 23;
  }
  if (screen === 'gig') {
    setPlayerPose('gig');
    focusGigCamera();
    document.body.classList.remove('hide-gig-help');
    updateHelpButtonLabel();
  }
  updateSceneContextVisibility();
  applyGamePreferences();
  renderCareerCompass();
}

function focusCreatorCamera() {
  if (!player) return;
  cameraControl.target.set(-2.45, 1.04, 8.35);
  cameraControl.yaw = 0;
  cameraControl.pitch = 0.16;
  cameraControl.distance = 3.9;
}

function focusRoomCamera() {
  cameraControl.target.set(0, 2.2, -1.5);
  cameraControl.yaw = 0;
  cameraControl.pitch = 0.54;
  cameraControl.distance = 18.4;
}

function focusGigCamera() {
  cameraControl.target.set(0, 1.75, 6.45);
  cameraControl.yaw = 0;
  cameraControl.pitch = 0.34;
  cameraControl.distance = 15.5;
}

function setPlayerPose(mode) {
  if (!player) return;
  if (mode === 'look') {
    player.position.set(-2.45, 0, 8.35);
    player.rotation.y = 0;
    return;
  }
  if (mode === 'gig') {
    player.position.set(-1.16, 0, 8.78);
    player.rotation.y = Math.PI;
    return;
  }
  player.position.set(-1.25, 0, 8.65);
  player.rotation.y = -0.08;
}

function updateSceneContextVisibility() {
  const choosingLook = document.body.classList.contains('screen-creator') ||
    document.body.classList.contains('shop-closet');
  const clothingStore = document.body.classList.contains('shop-closet');
  // Contract rigs belong to the venue, never to the smaller studio shell.
  if (stageGroup) stageGroup.visible = !choosingLook && !document.body.classList.contains('screen-desktop');
  if (clothingStoreGroup) clothingStoreGroup.visible = clothingStore;
  if(deskStation)deskStation.visible=!choosingLook;
}

const minimizedWindows = new Map();
function rememberWindowLayout(){if(!currentApp||appWindow.hidden||!profile?.settings)return;profile.settings.windowLayouts ||= {};profile.settings.windowLayouts[currentApp]=getInactiveWindowState(appWindow);}

function openApp(app) {
  window.StudioWorld?.showComputer();
  if (app === "booking") app = "social";
  if (minimizedWindows.has(app)) {const state=minimizedWindows.get(app);minimizedWindows.delete(app);if(currentApp&&currentApp!==app)preserveInactiveWindow();restoreWindowState(app,state);return;}
  const inactiveIndex = inactiveWindows.findIndex((entry) => entry.app === app);
  if (inactiveIndex >= 0) {
    focusInactiveWindow(inactiveIndex);
    return;
  }
  if (currentApp === app) {
    appWindow.classList.remove('window-minimizing', 'window-closing');
    appWindow.hidden = false;
    appWindow.style.zIndex = String(++floatingWindowZ);
    appButtons.forEach((button) => button.classList.toggle('selected', button.dataset.app === app));
    return;
  }
  if (currentApp && currentApp !== app) {
    const rect = appWindow.getBoundingClientRect();
    const bounds = clampWindowBounds(rect.width, rect.height);
    const cascade = clampWindowPosition(rect.left + 28, rect.top + 28, bounds);
    preserveInactiveWindow();
    if (profile?.settings) {
      profile.settings.windowBounds = bounds;
      profile.settings.windowPosition = cascade;
    }
  }
  rememberWindowLayout();
  currentApp = app;
  const savedLayout=profile.settings.windowLayouts?.[app];
  if(savedLayout){profile.settings.windowBounds=clampWindowBounds(savedLayout.width,savedLayout.height);profile.settings.windowPosition=clampWindowPosition(savedLayout.left,savedLayout.top,profile.settings.windowBounds);}
  appWindow.classList.remove('window-minimizing', 'window-closing');
  appWindow.style.zIndex = String(++floatingWindowZ);
  clothingPreview = null;
  if (app !== 'calendar') selectedCalendarDay = null;
  if (app === 'shop') {
    if(window.StudioWardrobe)StudioWardrobe.ownedMode=false;
    shopView = 'home';
    shopGearFilter = 'all';
    shopLoopFilter = 'all';
  }
  document.body.classList.toggle('shop-closet', app === 'shop' && shopView === 'clothing');
  updateSceneContextVisibility();
  appButtons.forEach((button) => button.classList.toggle('selected', button.dataset.app === app));
  renderDesktop();
}

function closeAppWindow(promoteNext = true) {
  rememberWindowLayout();
  currentApp = null;
  selectedCalendarDay = null;
  shopView = 'home';
  shopLoopFilter = 'all';
  clothingPreview = null;
  applyAppearanceToPlayer();
  document.body.classList.remove('shop-closet');
  appWindow.classList.remove('window-minimizing', 'window-closing', 'window-maximized');
  appWindowDrag = null;
  updateSceneContextVisibility();
  focusRoomCamera();
  appButtons.forEach((button) => button.classList.remove('selected'));
  if (promoteNext && restoreTopInactiveWindow()) return;
  renderDesktop();
}

function preserveInactiveWindow() {
  if (!currentApp || appWindow.hidden || !appWindow.innerHTML.trim()) return;
  removeInactiveWindow(currentApp);
  const rect = appWindow.getBoundingClientRect();
  const clone = appWindow.cloneNode(true);
  clone.removeAttribute('id');
  clone.classList.remove('window-minimizing', 'window-closing');
  clone.classList.add('inactive-app-window');
  clone.dataset.app = currentApp;
  clone.dataset.left = String(Math.round(rect.left));
  clone.dataset.top = String(Math.round(rect.top));
  clone.dataset.width = String(Math.round(rect.width));
  clone.dataset.height = String(Math.round(rect.height));
  clone.dataset.scrollTop = String(Math.round(appWindow.scrollTop || 0));
  clone.style.left = `${Math.round(rect.left)}px`;
  clone.style.top = `${Math.round(rect.top)}px`;
  clone.style.width = `${Math.round(rect.width)}px`;
  clone.style.height = `${Math.round(rect.height)}px`;
  clone.style.zIndex = String(++floatingWindowZ);
  clone.querySelectorAll('.day-modal-backdrop').forEach((node) => node.remove());
  clone.querySelectorAll('button, input, select, textarea, a').forEach((control) => {
    control.setAttribute('tabindex', '-1');
    control.setAttribute('aria-hidden', 'true');
  });
  clone.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    if(event.target.closest('.traffic.red')){removeInactiveWindow(clone.dataset.app);return;}
    if(event.target.closest('.traffic.yellow')){minimizedWindows.set(clone.dataset.app,getInactiveWindowState(clone));removeInactiveWindow(clone.dataset.app);return;}
    const index = inactiveWindows.findIndex((entry) => entry.element === clone);
    if (index >= 0) {focusInactiveWindow(index);if(event.target.closest('.traffic.green'))toggleAppWindowMaximized();else if(event.target.closest('.app-heading,.atazone-bar'))onAppWindowPointerDown(event);}
  });
  document.querySelector('#desktop-screen')?.append(clone);
  inactiveWindows.push({ app: currentApp, element: clone });
  while (inactiveWindows.length > 5) {
    const old = inactiveWindows.shift();
    old?.element?.remove();
  }
}

function openGodModePrompt() {
  if (!godPasswordModal || !godPasswordInput) {
    const password = window.prompt('Mot de passe God Mode');
    if (normalizeGodPassword(password) !== GOD_MODE_PASSWORD) {
      if (password !== null) notify('Mot de passe invalide.');
      return;
    }
    enterGodMode();
    return;
  }
  godPasswordInput.value = '';
  godPasswordModal.hidden = false;
  window.setTimeout(() => godPasswordInput.focus(), 30);
}

function closeGodPasswordModal() {
  if (godPasswordModal) godPasswordModal.hidden = true;
  if (godPasswordInput) godPasswordInput.value = '';
}

function submitGodPassword() {
  const password = normalizeGodPassword(godPasswordInput?.value);
  if (password !== GOD_MODE_PASSWORD) {
    notify('Mot de passe invalide. Utilise FIRE2026.');
    godPasswordInput?.select();
    return;
  }
  closeGodPasswordModal();
  enterGodMode();
}

function normalizeGodPassword(value) {
  return String(value || '').trim().toUpperCase();
}

function enterGodMode() {
  activeSlot = Number.isInteger(activeSlot) ? activeSlot : 0;
  profile = slots[activeSlot]?.created ? slots[activeSlot] : makeFreshCareerSlot(activeSlot);
  activateGodMode();
  slots[activeSlot] = profile;
  saveSlots();
  renderSlots();
  notify('God Mode active: argent illimite, tous les items, skills max et gigs ouverts.');
  closeAppWindow(false);
  clearInactiveWindows();
  showScreen('desktop');
}

function activateGodMode() {
  profile.created = true;
  profile.name = profile.name && profile.name !== 'VJ' ? profile.name : 'VJ God Mode';
  profile.godMode = true;
  profile.money = GOD_MODE_MONEY;
  profile.stats = {
    ...profile.stats,
    creativity: 100,
    technique: 100,
    fatigue: 0,
    reputation: 100,
    style: 100,
    network: 100,
    jobine: getJobPay(profile),
    xp: 0,
    level: 99,
  };
  profile.skills = Object.fromEntries(skillCatalog.map((skill) => [skill.id, 5]));
  profile.settings.progression={version:1,skillXp:Object.fromEntries(skillCatalog.map(skill=>[skill.id,1200])),learning:Object.fromEntries(['mix','wall','energy','cable','client','contract'].map(id=>[id,true])),practiceLog:{},history:[],legacyLearningMigrated:true};
  profile.skillPractice = Object.fromEntries(skillCatalog.map((skill) => [skill.id, 999]));
  profile.ownedItems = [...new Set(shopItems.map((item) => item.id))];
  profile.inventory = {};
  shopItems.forEach((item) => {
    if (item.stackable || item.category==='gear') profile.inventory[item.id] = 6;
  });
  Object.entries(GEAR_PROGRESSIONS).forEach(([type, chain]) => {
    const best = [...chain].reverse().find((slug) => shopItems.some((item) => item.id === `${type}-${slug}`));
    if (best) profile.gear[type] = best;
  });
  profile.gear.accessory = 'mapping-kit';
  profile.styleXp = Object.fromEntries(Object.keys(STYLE_CATALOG).map((style) => [style, 999]));
  profile.hype = {
    underground: 100,
    corporate: 100,
    artistic: 100,
    social: 100,
    festival: 100,
  };
  profile.gigs = starterGigs.map((gig) => ({
    ...gig,
    status: 'open',
    eventDay: Math.max(profile.day + 1, Number(gig.eventDay) || profile.day + 1),
    date: `Jour ${Math.max(profile.day + 1, Number(gig.eventDay) || profile.day + 1)}`,
    responseIn: null,
  }));
  addEmail('Systeme', 'God Mode active', 'Tous les paliers sont ouverts. Tu peux tester le jeu complet sans grind.', { unique: false });
}

function focusInactiveWindow(index) {
  const entry = inactiveWindows[index];
  if (!entry) return;
  const state = getInactiveWindowState(entry.element);
  entry.element.remove();
  inactiveWindows.splice(index, 1);
  if (currentApp && currentApp !== entry.app) preserveInactiveWindow();
  restoreWindowState(entry.app, state);
}

function restoreTopInactiveWindow() {
  if (!inactiveWindows.length) return false;
  const topIndex = inactiveWindows.reduce((bestIndex, entry, index) => {
    const bestZ = Number(inactiveWindows[bestIndex]?.element?.style?.zIndex) || 0;
    const nextZ = Number(entry.element.style.zIndex) || 0;
    return nextZ >= bestZ ? index : bestIndex;
  }, 0);
  const entry = inactiveWindows[topIndex];
  const state = getInactiveWindowState(entry.element);
  entry.element.remove();
  inactiveWindows.splice(topIndex, 1);
  restoreWindowState(entry.app, state);
  return true;
}

function getInactiveWindowState(element) {
  const rect = element.getBoundingClientRect();
  return {
    left: Number(element.dataset.left) || rect.left,
    top: Number(element.dataset.top) || rect.top,
    width: Number(element.dataset.width) || rect.width,
    height: Number(element.dataset.height) || rect.height,
    scrollTop: Number(element.dataset.scrollTop) || 0,
  };
}

function restoreWindowState(app, state) {
  currentApp = app;
  if (profile?.settings) {
    profile.settings.windowBounds = clampWindowBounds(state.width, state.height);
    profile.settings.windowPosition = clampWindowPosition(state.left, state.top, profile.settings.windowBounds);
    delete profile.settings.windowSize;
  }
  appWindow.classList.add('window-snap');
  appWindow.classList.remove('window-minimizing', 'window-closing');
  appWindow.style.zIndex = String(++floatingWindowZ);
  clothingPreview = null;
  if (app !== 'calendar') selectedCalendarDay = null;
  document.body.classList.toggle('shop-closet', app === 'shop' && shopView === 'clothing');
  updateSceneContextVisibility();
  appButtons.forEach((button) => button.classList.toggle('selected', button.dataset.app === app));
  renderDesktop();
  appWindow.scrollTop = state.scrollTop || 0;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => appWindow.classList.remove('window-snap'));
  });
}

function removeInactiveWindow(app) {
  for (let index = inactiveWindows.length - 1; index >= 0; index -= 1) {
    if (inactiveWindows[index].app === app) {
      inactiveWindows[index].element.remove();
      inactiveWindows.splice(index, 1);
    }
  }
}

function clearInactiveWindows() {
  inactiveWindows.splice(0).forEach((entry) => entry.element.remove());
}

function snapWindowChange(callback) {
  appWindow.classList.add('window-snap');
  callback();
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => appWindow.classList.remove('window-snap'));
  });
}

function closeAppWindowAnimated(mode = 'close', promoteNext = true) {
  if (mode === 'minimize') {
    appWindow.classList.add('window-minimizing');
    const app=currentApp,state=getInactiveWindowState(appWindow);
    window.setTimeout(() => {if(currentApp!==app)return;minimizedWindows.set(app,state);closeAppWindow(promoteNext);}, profile.settings.reducedMotion?0:160);
    return;
  }
  if (promoteNext && inactiveWindows.length) {
    snapWindowChange(() => closeAppWindow(true));
    return;
  }
  appWindow.classList.add('window-closing');
  const app=currentApp;window.setTimeout(() => {if(currentApp===app)closeAppWindow(promoteNext);},profile.settings.reducedMotion?0:120);
}

function renderDesktop() {
  window.DesktopFocus?.update();
  document.body.classList.toggle("choosing-show", currentApp === "social");
  updateProfileChrome();
  appWindow.hidden = currentApp === null;
  appWindow.classList.toggle('shop-closet-window', currentApp === 'shop' && shopView === 'clothing');
  applySavedWindowSize();
  updateSceneContextVisibility();
  if (currentApp === null) {
    appWindow.innerHTML = '';
    return;
  }
  if (currentApp === 'calendar') renderCalendar();
  if (currentApp === 'guide') renderGuide();
  if (currentApp === 'phone') renderPhone();
  if (currentApp === 'email') renderEmail();
  if (currentApp === 'social') renderSocial();
  if (currentApp === 'transport') renderTransport();
  if (currentApp === 'music') renderMusicPlayer();
  if (currentApp === 'settings') renderSettings();
  if (currentApp === 'stats') renderStats();
  if (currentApp === 'job') renderJobWindow();
  if (currentApp === 'rest') renderRestWindow();
  if (currentApp === 'inventory') renderInventory();
  if (currentApp === 'finance') renderFinance();
  if (currentApp === 'housing') renderHousing();
  if (currentApp === 'skills') renderSkills();
  if (currentApp === 'shop') renderShop();
  addWindowControls();
}

function addWindowControls() {
  const heading = appWindow.querySelector('.app-heading') || appWindow.querySelector('.atazone-bar');
  if (!heading || heading.querySelector('.traffic-controls')) return;
  const controls = document.createElement('div');
  controls.className = 'traffic-controls';
  controls.innerHTML = `
    <button class="traffic red" type="button" aria-label="Fermer" title="Fermer">×</button>
    <button class="traffic yellow" type="button" aria-label="Minimiser" title="Réduire">—</button>
    <button class="traffic green" type="button" aria-label="Agrandir ou restaurer" title="Agrandir ou restaurer">□</button>
  `;
  controls.querySelector('.red').addEventListener('click', () => closeAppWindowAnimated('close'));
  controls.querySelector('.yellow').addEventListener('click', () => closeAppWindowAnimated('minimize'));
  controls.querySelector('.green').addEventListener('click', () => {
    toggleAppWindowMaximized();
  });
  heading.append(controls);
}

function applySavedWindowSize() {
  if (!profile?.settings) return;
  const bounds = getSavedWindowBounds();
  const clamped = clampWindowBounds(bounds.width, bounds.height);
  const position = getSavedWindowPosition(clamped);
  applyingWindowBounds = true;
  appWindow.style.left = `${position.left}px`;
  appWindow.style.top = `${position.top}px`;
  appWindow.style.width = `${clamped.width}px`;
  appWindow.style.height = `${clamped.height}px`;
  appWindow.classList.remove('window-size-compact', 'window-size-normal', 'window-size-large');
  window.requestAnimationFrame(() => {
    applyingWindowBounds = false;
  });
}

function getSavedWindowBounds() {
  const saved = profile?.settings?.windowBounds;
  if (saved && Number.isFinite(Number(saved.width)) && Number.isFinite(Number(saved.height))) {
    return { width: Number(saved.width), height: Number(saved.height) };
  }
  const legacySize = profile?.settings?.windowSize || 'normal';
  if (legacySize === 'compact') return { width: 760, height: 620 };
  if (legacySize === 'large') return { width: window.innerWidth - 32, height: window.innerHeight - 152 };
  return { width: 1160, height: 680 };
}

function clampWindowBounds(width, height) {
  const maxWidth = Math.max(360, window.innerWidth - 48);
  const maxHeight = Math.max(360, window.innerHeight - 150);
  return {
    width: Math.round(clamp(Number(width) || 1160, 520, maxWidth)),
    height: Math.round(clamp(Number(height) || 680, 420, maxHeight)),
  };
}

function saveWindowBounds(width, height) {
  if (!profile?.settings) return;
  const bounds = clampWindowBounds(width, height);
  profile.settings.windowBounds = bounds;
  delete profile.settings.windowSize;
  saveSlots();
}

function getSavedWindowPosition(bounds = getSavedWindowBounds()) {
  const saved = profile?.settings?.windowPosition;
  const fallback = { left: Math.round(Math.max(24, window.innerWidth * 0.05)), top: 66 };
  return clampWindowPosition(
    Number(saved?.left) || fallback.left,
    Number(saved?.top) || fallback.top,
    bounds
  );
}

function clampWindowPosition(left, top, bounds = getSavedWindowBounds()) {
  const width = Number(bounds.width) || 1160;
  const height = Number(bounds.height) || 680;
  const maxLeft = Math.max(8, window.innerWidth - width - 16);
  const maxTop = Math.max(48, window.innerHeight - height - 96);
  return {
    left: Math.round(clamp(left, 8, maxLeft)),
    top: Math.round(clamp(top, 48, maxTop)),
  };
}

function saveWindowPosition(left, top) {
  if (!profile?.settings) return;
  const rect = appWindow.getBoundingClientRect();
  profile.settings.windowPosition = clampWindowPosition(left, top, { width: rect.width, height: rect.height });
  saveSlots();
}

function handleAppWindowResizeObserved() {
  if (applyingWindowBounds || currentApp === null || appWindow.hidden) return;
  window.clearTimeout(windowBoundsSaveTimer);
  windowBoundsSaveTimer = window.setTimeout(() => {
    const rect = appWindow.getBoundingClientRect();
    saveWindowBounds(rect.width, rect.height);
  }, 120);
}

function toggleAppWindowMaximized() {
  const rect = appWindow.getBoundingClientRect();
  const max = clampWindowBounds(window.innerWidth - 32, window.innerHeight - 152);
  const isNearMax = rect.width >= max.width - 10 && rect.height >= max.height - 10;
  if (isNearMax) {
    const restored = profile.settings.windowRestoreBounds || { width: 1160, height: 680 };
    profile.settings.windowBounds = clampWindowBounds(restored.width, restored.height);
  } else {
    profile.settings.windowRestoreBounds = clampWindowBounds(rect.width, rect.height);
    profile.settings.windowBounds = max;
  }
  saveSlots();
  applySavedWindowSize();
}

function onAppWindowPointerDown(event) {
  if (!appWindow.hidden && currentApp !== null) {
    appWindow.style.zIndex = String(++floatingWindowZ);
  }
  const handle = event.target.closest('.app-heading, .atazone-bar');
  if (!handle || event.target.closest('button, input, select, textarea, a')) return;
  if (appWindow.hidden || currentApp === null) return;
  const rect = appWindow.getBoundingClientRect();
  appWindowDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    left: rect.left,
    top: rect.top,
  };
  appWindow.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function onAppWindowPointerMove(event) {
  if (!appWindowDrag || event.pointerId !== appWindowDrag.pointerId) return;
  const rect = appWindow.getBoundingClientRect();
  const next = clampWindowPosition(
    appWindowDrag.left + event.clientX - appWindowDrag.startX,
    appWindowDrag.top + event.clientY - appWindowDrag.startY,
    { width: rect.width, height: rect.height }
  );
  appWindow.style.left = `${next.left}px`;
  appWindow.style.top = `${next.top}px`;
}

function onAppWindowPointerUp(event) {
  if (!appWindowDrag || event.pointerId !== appWindowDrag.pointerId) return;
  const rect = appWindow.getBoundingClientRect();
  saveWindowPosition(rect.left, rect.top);
  rememberWindowLayout();
  try {
    appWindow.releasePointerCapture?.(event.pointerId);
  } catch {
    // Pointer may already be released by the browser.
  }
  appWindowDrag = null;
}

function updateProfileChrome() {
  if (!profile) return;
  desktopName.textContent = profile.created ? profile.name : 'VJ';
  desktopDay.textContent = `Jour ${profile.day} - ${profile.location}`;
  moneyPill.textContent = `${Math.round(profile.money)}$`;
  repPill.textContent = `Rep ${Math.round(profile.stats.reputation)}`;
  fatiguePill.textContent = `Fatigue ${Math.round(profile.stats.fatigue)}`;
  emailBadge.textContent = String(profile.emails.filter((email) => !email.read).length);
  if (languageSelect) setSelectValue(languageSelect, profile.settings?.language || 'fr', 'fr');
  if (menuTrack) menuTrack.textContent = musicTrackName || t('noTrack');
  document.body.classList.toggle('music-playing', isMusicActive());
  if (menuBattery) {
    const energy = Math.round((getRemainingEnergy() / DAILY_ENERGY_MAX) * 100);
    menuBattery.title = `Batterie setup ${energy}%`;
    menuBattery.querySelector('b').style.width = `${clamp(energy, 5, 100)}%`;
  }
  hudName.textContent = profile.name;
  renderDesktopWidget();
  renderCareerCompass();
}

function renderDesktopWidget() {
  if (!desktopWidget || !profile) return;
  const s = profile.stats;
  const nextGig = getNextAcceptedGig();
  const xpTarget = Math.max(100, s.level * 100);
  const xpPercent = clamp((s.xp / xpTarget) * 100, 0, 100);
  desktopWidget.innerHTML = `
    <section id="career-compass" class="career-compass" aria-label="Prochaine étape de carrière"></section>
    <details class="desktop-details"><summary>Ma carrière en détail</summary>
    <div class="widget-head">
      <strong>${escapeHtml(profile.name || 'VJ')}</strong>
      <span>Niveau ${s.level}<br>${getMonthName(profile.day)} ${getDayOfMonth(profile.day)}</span>
    </div>
    <div class="widget-money">
      <strong>${Math.round(profile.money)}$</strong>
      <span>Jobine ${getJobPay()}$ | Fatigue ${Math.round(s.fatigue)}</span>
    </div>
    <div class="widget-level">
      <div><strong>Experience VJ</strong><span>${s.xp}/${xpTarget} XP</span></div>
      <i><b style="width:${xpPercent}%"></b></i>
    </div>
    <div class="widget-stat-grid">
      ${desktopStat('Creativite', s.creativity)}
      ${desktopStat('Technique', s.technique)}
      ${desktopStat('Style', s.style)}
      ${desktopStat('Reseau', s.network)}
      ${desktopStat('Reputation', s.reputation)}
      ${desktopStat('Job jours', Math.min(100, ((profile.jobDays || 0) % 20) * 5))}
    </div>
    <div class="widget-next">
      <strong>Prochain gig</strong>
      <span>${nextGig ? `${escapeHtml(nextGig.title)} - ${formatScheduledDay(getGigAbsoluteDay(nextGig))}` : 'Aucun gig confirme'}</span>
    </div></details>
  `;
}

function desktopStat(label, value) {
  return `
    <span>
      <b>${label}</b>
      <i style="width:${clamp(value, 0, 100)}%"></i>
      <em>${Math.round(value)}</em>
    </span>
  `;
}

function renderCalendar() { renderSimpleBookings(); }

function renderCalendarLegacy() {
  refreshAvailableGigPool();
  syncEnergyLog();
  const dayOfMonth = getDayOfMonth(profile.day);
  const monthName = getMonthName(profile.day);
  const yearNumber = getYearNumber(profile.day);
  const dayDone = canAdvanceDay();
  const monthStart = getMonthStartDay(profile.day);
  const monthEnd = monthStart + 29;
  if (selectedCalendarDay && (selectedCalendarDay < monthStart || selectedCalendarDay > monthEnd)) {
    selectedCalendarDay = null;
  }
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Calendar</h1>
        <p>${monthName} - Annee ${yearNumber} - Jour ${dayOfMonth}. Actions ${getRemainingEnergy()} / ${DAILY_ENERGY_MAX}. Clique une case pour ouvrir tes choix.</p>
      </div>
      <button class="primary-action" data-action="next-day" ${dayDone ? '' : 'disabled'}>Next Day</button>
    </div>
    <div class="calendar-board">
      <div class="calendar-weekdays">
        <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
      </div>
      <div class="month-grid">
        ${renderMonthDays()}
      </div>
    </div>
    ${renderDayPopup()}
  `;
  appWindow.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => handleDayAction(button.dataset.action));
  });
  appWindow.querySelectorAll('[data-calendar-day]').forEach((button) => {
    button.addEventListener('click', () => selectCalendarDay(Number(button.dataset.calendarDay)));
  });
  appWindow.querySelectorAll('[data-close-day-popup]').forEach((button) => {
    button.addEventListener('click', closeDayPopup);
  });
  appWindow.querySelectorAll('[data-play-gig]').forEach((button) => {
    button.addEventListener('click', () => startGig(button.dataset.playGig));
  });
  appWindow.querySelectorAll('[data-cancel-booking]').forEach((button) => {
    button.addEventListener('click', () => cancelBookedGig(button.dataset.cancelBooking));
  });
  appWindow.querySelectorAll('[data-open-email]').forEach((button) => {
    button.addEventListener('click', () => openApp('email'));
  });
}

function renderMonthDays() {
  const monthStart = getMonthStartDay(profile.day);
  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const absoluteDay = monthStart + index;
    const current = day === getDayOfMonth(profile.day);
    const selected = selectedCalendarDay === absoluteDay;
    const completed = profile.calendarLog?.[absoluteDay];
    const events = getCalendarEventsForDay(day, absoluteDay);
    const eventHtml = events.map((event) => `<span class="calendar-event ${event.kind}${event.style ? ` style-${escapeHtml(event.style)}` : ''}">${escapeHtml(event.label)}</span>`).join('');
    return `
      <button class="calendar-day${current ? ' today' : ''}${completed ? ' completed' : ''}${selected ? ' selected' : ''}" type="button" data-calendar-day="${absoluteDay}">
        <strong>${day}</strong>
        ${completed ? `<span class="calendar-event done">X ${escapeHtml(completed.label)}</span>` : ''}
        ${eventHtml || '<span class="calendar-empty">Libre</span>'}
      </button>
    `;
  }).join('');
}

function selectCalendarDay(day) {
  selectedCalendarDay = day;
  renderDesktop();
}

function closeDayPopup() {
  selectedCalendarDay = null;
  renderDesktop();
}

function renderDayPopup() {
  if (!selectedCalendarDay) return '';
  syncEnergyLog();
  const selectedDayOfMonth = getDayOfMonth(selectedCalendarDay);
  const selectedMonth = getMonthName(selectedCalendarDay);
  const selectedYear = getYearNumber(selectedCalendarDay);
  const isToday = selectedCalendarDay === profile.day;
  const completed = profile.calendarLog?.[selectedCalendarDay];
  const energy = getRemainingEnergy();
  const events = getCalendarEventsForDay(selectedDayOfMonth, selectedCalendarDay);
  const dueGig = isToday ? getDueGig() : null;
  const eventHtml = events.length
    ? events.map((event) => `<span class="calendar-event ${event.kind}${event.style ? ` style-${escapeHtml(event.style)}` : ''}">${escapeHtml(event.label)}</span>`).join('')
    : '<span class="calendar-empty">Libre</span>';
  const dailyChoices = !isToday
    ? '<div class="calendar-lock-note">Tu peux regarder cette date, mais tu peux agir seulement sur aujourd hui.</div>'
    : energy <= 0
      ? '<div class="calendar-lock-note done">Actions terminees. Appuie sur Next Day pour avancer.</div>'
      : `
        <div class="day-energy-bar">
          <span>Actions restantes</span>
          <strong>${energy} / ${DAILY_ENERGY_MAX}</strong>
          <i><b style="width:${(energy / DAILY_ENERGY_MAX) * 100}%"></b></i>
        </div>
        <h3>Activite du jour</h3>
        <div class="action-grid day-modal-actions">
          ${actionButton('open-skills', 'Pratique', 'Ouvre Competences: pratique gratuite ou formation.', energy < 1)}
          ${actionButton('open-job', 'Jobine', `Ouvre Travail: aller travailler pour +${getJobPay()}$.`, energy < 1)}
          ${actionButton('open-rest', 'Repos', 'Ouvre Repos: recuperation gratuite ou activites payantes.', energy < 1)}
          ${dueGig ? actionButton('go-gig', 'Go a la gig', `${dueGig.title} est prevue aujourd hui.`, false) : ''}
        </div>
        <button class="primary-action compact" data-action="next-day" ${canAdvanceDay() ? '' : 'disabled'}>Next Day</button>
      `;
  return `
    <div class="day-modal-backdrop" role="presentation">
      <section class="day-modal" role="dialog" aria-modal="true" aria-label="Choix de la journee">
        <div class="day-modal-head">
          <div>
            <span>${selectedMonth} - Annee ${selectedYear}</span>
            <h2>Jour ${selectedDayOfMonth}</h2>
          </div>
          <button class="traffic red" type="button" data-close-day-popup aria-label="Fermer"></button>
        </div>
        <div class="day-modal-events">${eventHtml}</div>
        ${dailyChoices}
      </section>
    </div>
  `;
}

function getCalendarEventsForDay(day, absoluteDay = getMonthStartDay(profile.day) + day - 1) {
  const events = [];
  if (day === 1) {
    events.push({ kind: 'rent', label: profile.housing.rent > 0 ? `Loyer ${profile.housing.rent}$` : 'Pas de loyer' });
  }
  profile.gigs.forEach((gig) => {
    const gigDay = getGigAbsoluteDay(gig);
    if (gigDay === absoluteDay && ['accepted', 'scheduled', 'done', 'pending', 'offered'].includes(gig.status)) {
      const statusLabel = gig.status === 'pending' ? 'Candidature' : gig.status === 'offered' ? 'Offre' : gig.status === 'done' ? 'Termine' : 'Gig';
      events.push({ kind: gig.status === 'done' ? 'done' : 'gig', style: gig.style, label: `${statusLabel}: ${gig.title}` });
    }
  });
  profile.pendingResponses.forEach((pending) => {
    const gig = profile.gigs.find((item) => item.id === pending.gigId);
    const responseDay = Number(pending.responseDay) || profile.day + pending.days;
    if (gig && responseDay === absoluteDay) events.push({ kind: 'email', style: gig.style, label: `Email ${gig.title}` });
  });
  if (profile.calendarLog?.[absoluteDay]) {
    events.push({ kind: 'done', label: 'Journee finie' });
  }
  return events.slice(0, 3);
}

function getGigDay(gig) {
  return getDayOfMonth(getGigAbsoluteDay(gig));
}

function getGigAbsoluteDay(gig) {
  if (Number(gig?.scheduledDay)) return Number(gig.scheduledDay);
  if (Number(gig?.eventDay)) return Number(gig.eventDay);
  const match = String(gig?.date || '').match(/\d+/);
  return match ? Number(match[0]) : 1;
}

function getNextAcceptedGig() {
  return profile.gigs
    .filter((gig) => gig.status === 'accepted' || gig.status === 'scheduled')
    .sort((a, b) => getGigAbsoluteDay(a) - getGigAbsoluteDay(b))[0] || null;
}

function getWeekdayIndex(absoluteDay) {
  return (absoluteDay - 1) % 7;
}

function getWeekdayName(absoluteDay) {
  return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][getWeekdayIndex(absoluteDay)];
}

function getNextWeekendDay(fromDay = (profile?.day || 1) + 1, currentDay = profile?.day || 1) {
  let day = Math.max(currentDay + 1, fromDay);
  while (![4, 5].includes(getWeekdayIndex(day))) day += 1;
  return day;
}

function getNthWeekendNight(fromDay, index = 0, preferSaturday = false) {
  let friday = Math.max(1, fromDay);
  while (getWeekdayIndex(friday) !== 4) friday += 1;
  friday += Math.max(0, index) * 7;
  return preferSaturday ? friday + 1 : friday;
}

function getDefaultGigEventDay(gig, prof = profile) {
  const number = Number(gig?.number) || 1;
  const visibleWave = Math.floor((number - 1) / 3);
  const preferSaturday = number % 3 === 0;
  return getNthWeekendNight((prof?.day || 1) + 2, visibleWave, preferSaturday);
}

function normalizeGigScheduleData(prof = profile) {
  if (!prof?.gigs) return;
  prof.gigs.forEach((gig) => {
    if (!gig.style || !STYLE_CATALOG[gig.style]) gig.style = 'techno';
    if (gig.status === 'done' && Number(gig.lastCompletedDay)) {
      gig.eventDay = Number(gig.scheduledDay) || Number(gig.eventDay) || Number(gig.lastCompletedDay);
      gig.date = `Jour ${gig.eventDay}`;
      return;
    }
    if (gig.status === 'cancelled' && Number(gig.scheduledDay || gig.eventDay)) {
      gig.eventDay = Number(gig.scheduledDay) || Number(gig.eventDay);
      gig.date = `Jour ${gig.eventDay}`;
      return;
    }
    if (!Number(gig.eventDay) || (gig.status === 'open' && Number(gig.eventDay) < prof.day)) {
      gig.eventDay = getDefaultGigEventDay(gig, prof);
    }
    if (!Number(gig.responseDay) && gig.status === 'pending') {
      gig.responseDay = prof.day + (Number(gig.responseIn) || 1);
    }
    if (['accepted', 'scheduled'].includes(gig.status)) {
      const planned = Number(gig.scheduledDay) || Number(gig.eventDay) || getGigAbsoluteDay(gig);
      gig.scheduledDay = [4, 5].includes(getWeekdayIndex(planned))
        ? planned
        : getNextWeekendDay(Math.max(prof.day + 1, planned), prof.day);
      gig.eventDay = gig.scheduledDay;
      gig.date = `Jour ${gig.scheduledDay}`;
    }
  });
  repairGigDateConflicts(prof);
  prof.pendingResponses = (prof.pendingResponses || []).map((pending) => {
    const gig = prof.gigs.find((item) => item.id === pending.gigId);
    const responseDay = Number(pending.responseDay) || prof.day + (Number(pending.days) || 1);
    const eventDay = Number(pending.eventDay) || Number(gig?.eventDay) || getDefaultGigEventDay(gig, prof);
    return { ...pending, responseDay, eventDay };
  });
}

function repairGigDateConflicts(prof = profile) {
  const reserved = new Map();
  (prof?.gigs || []).forEach((gig) => {
    if (!['pending', 'offered', 'accepted', 'scheduled'].includes(gig.status)) return;
    let day = Number(gig.scheduledDay) || Number(gig.eventDay) || getDefaultGigEventDay(gig, prof);
    while (reserved.has(day)) {
      day = getNextWeekendDay(day + 1, day);
    }
    reserved.set(day, gig.id);
    gig.eventDay = day;
    if (['accepted', 'scheduled'].includes(gig.status)) {
      gig.scheduledDay = day;
      gig.date = `Jour ${day}`;
    }
  });
}

function getReservedGigDays(excludeGigId = null) {
  return profile.gigs
    .filter((gig) =>
      gig.id !== excludeGigId &&
      ['pending', 'offered', 'accepted', 'scheduled'].includes(gig.status)
    )
    .map((gig) => Number(gig.scheduledDay) || Number(gig.eventDay))
    .filter(Boolean);
}

function isGigNightReserved(day, excludeGigId = null) {
  return getReservedGigDays(excludeGigId).includes(Number(day));
}

function getGigApplicationDay(gig) {
  if (!Number(gig.eventDay) || Number(gig.eventDay) < profile.day) {
    gig.eventDay = getDefaultGigEventDay(gig);
  }
  return Number(gig.eventDay);
}

function getGigDateConflict(gig) {
  const eventDay = getGigApplicationDay(gig);
  if (!isGigNightReserved(eventDay, gig.id)) return null;
  const other = profile.gigs.find((item) =>
    item.id !== gig.id &&
    ['pending', 'offered', 'accepted', 'scheduled'].includes(item.status) &&
    (Number(item.scheduledDay) || Number(item.eventDay)) === eventDay
  );
  return {
    day: eventDay,
    other,
    message: `Tu as deja une candidature ou un gig pour ${formatScheduledDay(eventDay)}${other ? ` (${other.title})` : ''}. Une seule soiree par date.`,
  };
}

function formatScheduledDay(absoluteDay) {
  return `${getWeekdayName(absoluteDay)} ${getDayOfMonth(absoluteDay)} ${getMonthName(absoluteDay)}`;
}

function getDayOfMonth(day) {
  return ((day - 1) % 30) + 1;
}

function getMonthNumber(day) {
  return Math.floor((day - 1) / 30) + 1;
}

function getMonthStartDay(day) {
  return Math.floor((day - 1) / 30) * 30 + 1;
}

function getMonthName(day) {
  return MONTH_NAMES[(getMonthNumber(day) - 1) % 12];
}

function getYearNumber(day) {
  return Math.floor((getMonthNumber(day) - 1) / 12) + 1;
}

function renderTodaySummary() {
  if (hasCompletedToday()) return `Actions: ${profile.calendarLog[profile.day].label}. Energie ${getRemainingEnergy()}/${DAILY_ENERGY_MAX}.`;
  const events = getCalendarEventsForDay(getDayOfMonth(profile.day));
  if (events.length === 0) return `Jour libre. Tu as ${getRemainingEnergy()} points d'energie.`;
  return `Evenements: ${events.map((event) => event.label).join(', ')}. Energie ${getRemainingEnergy()}/${DAILY_ENERGY_MAX}.`;
}

function actionButton(action, title, body, disabled = false) {
  return `<button class="secondary-action action-button" data-action="${action}" ${disabled ? 'disabled' : ''}><strong>${title}</strong><span>${body}</span></button>`;
}

function renderCalendarStatsWidget() {
  const s = profile.stats;
  const nextGig = getNextAcceptedGig();
  return `
    <div class="calendar-stat-widget">
      <span><strong>${Math.round(s.creativity)}</strong> Creativite</span>
      <span><strong>${Math.round(s.network)}</strong> Reseau</span>
      <span><strong>${Math.round(s.fatigue)}</strong> Fatigue</span>
      <span><strong>${Math.round(s.style)}</strong> Style</span>
      <span><strong>${s.level}</strong> Niveau</span>
      <span><strong>${getJobPay()}$</strong> Jobine</span>
      <span><strong>${20 - ((profile.jobDays || 0) % 20)}</strong> Jours avant +10$</span>
      <span><strong>${nextGig ? formatScheduledDay(getGigAbsoluteDay(nextGig)) : '-'}</strong> Gig</span>
    </div>
  `;
}

function renderGuide() {
  const section = GUIDE_SECTIONS.find((item) => item.id === guideSection) || GUIDE_SECTIONS[0];
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Guide du VJ</h1>
        <p>Tout le fonctionnement du jeu est ici: moins de texte partout, plus d infos quand tu en as besoin.</p>
      </div>
    </div>
    <section class="guide-layout">
      <nav class="guide-tabs" aria-label="Sections du guide">
        ${GUIDE_SECTIONS.map((item) => `
          <button class="${item.id === section.id ? 'selected' : ''}" type="button" data-guide-section="${escapeHtml(item.id)}">
            <span>${escapeHtml(item.label)}</span>
          </button>
        `).join('')}
      </nav>
      <article class="guide-reader">
        <div class="guide-hero">
          <span>VJOS MANUEL</span>
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.kicker)}</p>
        </div>
        <div class="guide-points">
          ${section.points.map((point, index) => `
            <div class="guide-point">
              <strong>${String(index + 1).padStart(2, '0')}</strong>
              <p>${escapeHtml(point)}</p>
            </div>
          `).join('')}
        </div>
        <div class="guide-tip">
          <strong>Conseil VJ</strong>
          <p>${escapeHtml(section.tip)}</p>
        </div>
        ${section.id === 'progression' ? renderGuideGigTable() : ''}
      </article>
    </section>
  `;
  appWindow.querySelectorAll('[data-guide-section]').forEach((button) => {
    button.addEventListener('click', () => {
      guideSection = button.dataset.guideSection;
      renderGuide();
      addWindowControls();
    });
  });
}

function renderGuideGigTable() {
  return `
    <section class="guide-gig-table">
      <h3>Checklist complete des gigs</h3>
      <p class="guide-gig-intro">Chaque carte montre ce qu'il faut atteindre avant de viser le contrat. Les premiers shows enseignent les bases, les derniers demandent gear, skills et precision.</p>
      <div class="guide-gig-rows">
        ${starterGigs.map((gig, index) => renderGuideGigCard(gig, index)).join('')}
      </div>
    </section>
  `;
}

function renderGuideGigCard(gig, index) {
  const specific = getGigSpecificRequirements(gig);
  const style = getStyleMeta(gig.style).label;
  const skills = gig.skillText && gig.skillText !== 'aucune' ? gig.skillText : 'aucune';
  const rental = gig.loanerGear ? 'fourni debut' : gig.allowRent === false ? 'location non' : 'location oui';
  const timer = gig.timerLabel === 'non' ? 'sans timer' : `timer ${gig.timerLabel}`;
  const unlockLevel = getGigUnlockLevel(gig, index);
  const styleNeed = getGigStyleRequirement(gig);
  const projectorCount = getGigProjectorCount(gig);
  const loopCount = specific.vjloop || 1;
  const mandatory = getGigMandatoryRequirements(gig, specific, index);
  const recommended = getGigRecommendedRequirements(gig, specific);
  return `
    <article class="guide-gig-card">
      <div class="guide-gig-card-head">
        <span class="guide-gig-number">${String(gig.number).padStart(2, '0')}</span>
        <div>
          <strong>${escapeHtml(gig.title)}</strong>
          <p>${escapeHtml(gig.newDifficulty || gig.type)} · ${escapeHtml(gig.constraints || 'standard')}</p>
        </div>
      </div>
      <div class="guide-gig-pill-row">
        <span>${projectorCount} projo${projectorCount > 1 ? 's' : ''}</span>
        <span>${escapeHtml(gig.zoneLabel || '1 rectangle')}</span>
        <span>${timer}</span>
        <span>${getGigMinimumScore(gig)}% min</span>
      </div>
      <div class="guide-gig-detail-grid">
        <div>
          <b>Debloquer</b>
          <span>Niveau ${unlockLevel}, reputation ${gig.minRep || 0}+, style ${styleNeed}+</span>
        </div>
        <div>
          <b>Loops</b>
          <span>${loopCount} pack${loopCount > 1 ? 's' : ''} ${style}</span>
        </div>
        <div>
          <b>Skills</b>
          <span>${escapeHtml(skills)}</span>
        </div>
        <div>
          <b>Location</b>
          <span>${escapeHtml(rental)}</span>
        </div>
      </div>
      <div class="guide-gig-gear">
        <b>Obligatoire pour acceder</b>
        <span>${mandatory.map((item) => `<em>${escapeHtml(item)}</em>`).join('')}</span>
      </div>
      <div class="guide-gig-gear recommended">
        <b>Conseille pour 2-3 etoiles</b>
        <span>${recommended.map((item) => `<em>${escapeHtml(item)}</em>`).join('')}</span>
      </div>
    </article>
  `;
}

function getGigMandatoryRequirements(gig, specific = getGigSpecificRequirements(gig), index = profile.gigs.findIndex((item) => item.id === gig.id)) {
  const number = Number(gig?.number) || index + 1;
  const required = [
    `Niveau ${getGigUnlockLevel(gig, index)}`,
    `Reputation/reseau ${gig.minRep || 0}+`,
  ];
  const styleNeed = getGigStyleRequirement(gig);
  if (styleNeed > 0) required.push(`Style ${styleNeed}+`);
  if (gig.skillText && gig.skillText !== 'aucune') required.push(`Skill ${gig.skillText}`);
  required.push(`${specific.vjloop || 1} pack${(specific.vjloop || 1) > 1 ? 's' : ''} ${getStyleMeta(gig.style).label}`);
  required.push(...getRequiredGearLabels(gig, specific));
  const clothingNeed = getGigClothingRequirement(gig);
  if (clothingNeed.count) required.push(clothingNeed.label);
  if (gig.allowRent === false) required.push('ton propre materiel');
  return [...new Set(required)];
}

function getRequiredGearLabels(gig, specific = getGigSpecificRequirements(gig)) {
  const projectorCount = getGigProjectorCount(gig);
  const labels = [];
  const minLabel = (type, slug, label, quantity = 1) => {
    if (!slug) return;
    labels.push(`${label}: ${getGearMeta(type, slug).label}${quantity > 1 ? ` x${quantity}` : ''} ou mieux`);
  };
  minLabel('projector', specific.projector, 'Projecteur', projectorCount);
  minLabel('computer', specific.computer, 'Ordinateur');
  minLabel('cable', specific.cable, 'Fils video', projectorCount);
  minLabel('bag', specific.bag, 'Sac');
  minLabel('gpu', specific.gpu, 'GPU');
  minLabel('adapter', specific.adapter, 'Adaptateurs');
  minLabel('router', specific.router, 'Boite routing');
  minLabel('console', specific.console, 'Controleur');
  minLabel('screen', specific.screen, 'Ecran controle');
  (specific.accessories || []).forEach((slug) => labels.push(`Outil: ${getGearMeta('accessory', slug).label}`));
  return labels;
}

function getGigRecommendedRequirements(gig, specific = getGigSpecificRequirements(gig)) {
  const recommended = [];
  const number = Number(gig?.number) || 1;
  if (gig.allowRent !== false) recommended.push('Louer un palier superieur si budget OK');
  if (getGigMinimumScore(gig) >= 90) recommended.push('viser setup 2-3 etoiles minimum');
  if (gig.timeLimitSeconds) recommended.push('fatigue basse avant le show');
  if (specific.console) recommended.push('console live equipee pour transitions');
  if (specific.router) recommended.push('tester routing avant la salle');
  if (getGigMaskRequirement(gig) > 0) recommended.push('pratiquer plume/contour');
  if (number >= 18) recommended.push('avoir backup cable/adaptateur');
  return recommended.length ? recommended : ['gear propre, fatigue basse, bon style musical'];
}

function hasCompletedToday() {
  return Boolean(profile.calendarLog?.[profile.day]);
}

function canAdvanceDay() {
  return hasCompletedToday() || getRemainingEnergy() < DAILY_ENERGY_MAX;
}

function syncEnergyLog() {
  if (!profile.energyLog || typeof profile.energyLog !== 'object') {
    profile.energyLog = { day: profile.day, remaining: DAILY_ENERGY_MAX };
  }
  if (profile.energyLog.day !== profile.day) {
    profile.energyLog.day = profile.day;
    profile.energyLog.remaining = DAILY_ENERGY_MAX;
  }
  profile.energyLog.remaining = clamp(Number(profile.energyLog.remaining), 0, DAILY_ENERGY_MAX);
}

function getRemainingEnergy() {
  syncEnergyLog();
  return profile.energyLog.remaining;
}

function spendEnergy(action, overrideCost = null) {
  syncEnergyLog();
  const cost = overrideCost ?? ACTION_ENERGY_COST[action] ?? 1;
  if (profile.energyLog.remaining < cost) {
    notify(`Pas assez d'energie. Il te reste ${profile.energyLog.remaining}/${DAILY_ENERGY_MAX}.`);
    return false;
  }
  profile.energyLog.remaining = clamp(profile.energyLog.remaining - cost, 0, DAILY_ENERGY_MAX);
  return true;
}

function drainDayEnergy() {
  syncEnergyLog();
  profile.energyLog.remaining = 0;
}

function getJobPay(target = profile) {
  const days = Number(target?.jobDays) || 0;
  return 120 + Math.floor(days / 20) * 10;
}

function renderNextGigBlock() {
  const accepted = getNextAcceptedGig();
  if (!accepted) return '<p>Aucun gig confirme. Va dans Booking et postule sur un evenement.</p>';
  const canGo = canPlayGig(accepted);
  const transport = calculateTransportCost(accepted);
  return `
    <div class="gig-card">
      <h3>${escapeHtml(accepted.title)}</h3>
      <p>${escapeHtml(accepted.type)} - ${escapeHtml(accepted.venue)} - ${accepted.budget}$</p>
      <p>Date: ${formatScheduledDay(getGigAbsoluteDay(accepted))}. Uver estime: ${transport.cost}$. ${canGo ? 'Tu peux appeler le transport aujourd hui.' : 'Tu dois attendre cette journee.'}</p>
      <div class="row-actions">
        <button class="primary-action" data-play-gig="${accepted.id}" ${canGo ? '' : 'disabled'}>Transport Uver</button>
      </div>
    </div>
  `;
}

function renderTransport() {
  const accepted = getNextAcceptedGig();
  const due = getDueGig();
  const gig = due || accepted;
  const transport = gig ? calculateTransportCost(gig) : null;
  const specific = gig ? getGigSpecificRequirements(gig) : null;
  const canGo = gig && canPlayGig(gig);
  appWindow.innerHTML = `
    <div class="app-heading transport-heading">
      <div>
        <h1>Uver</h1>
        <p>Transport pour tes projecteurs, fils, ordinateur et controleurs avant un show.</p>
      </div>
      <div class="uver-icon-large">U</div>
    </div>
    ${gig ? `
      <section class="uver-card">
        <div>
          <span>Prochain transport</span>
          <h2>${escapeHtml(gig.title)}</h2>
          <p>${escapeHtml(formatScheduledDay(getGigAbsoluteDay(gig)))} - ${escapeHtml(gig.venue)}</p>
        </div>
        <strong>${transport.cost}$</strong>
      </section>
      <div class="uver-grid">
        <div><span>Vehicule</span><strong>${escapeHtml(transport.vehicle)}</strong></div>
        <div><span>Charge</span><strong>${transport.units} unites</strong></div>
        <div><span>Projecteurs</span><strong>${getGigProjectorCount(gig)}</strong></div>
        <div><span>Packs VJ</span><strong>${specific.vjloop || 1}</strong></div>
      </div>
      <p class="uver-note">${escapeHtml(transport.label)}</p>
      <div class="row-actions">
        <button class="primary-action" data-play-gig="${gig.id}" ${canGo ? '' : 'disabled'}>${canGo ? 'Appeler Uver et aller au gig' : 'Disponible le jour du gig'}</button>
        <button class="secondary-action" data-open-booking>Voir Booking</button>
        <button class="secondary-action danger" data-cancel-booking="${gig.id}">Annuler gig</button>
      </div>
    ` : `
      <section class="uver-empty">
        <h2>Aucun show reserve</h2>
        <p>Postule dans Booking. Quand un client accepte, Uver calcule automatiquement le prix selon la quantite de gear.</p>
        <button class="primary-action" data-open-booking>Ouvrir Booking</button>
      </section>
    `}
  `;
  appWindow.querySelector('[data-play-gig]')?.addEventListener('click', (event) => startGig(event.currentTarget.dataset.playGig));
  appWindow.querySelectorAll('[data-open-booking]').forEach((button) => {
    button.addEventListener('click', () => openApp('social'));
  });
  appWindow.querySelectorAll('[data-cancel-booking]').forEach((button) => {
    button.addEventListener('click', () => cancelBookedGig(button.dataset.cancelBooking));
  });
}

function renderMusicPlayer() {
  const energy = Math.round((getRemainingEnergy() / DAILY_ENERGY_MAX) * 100);
  const active = isMusicActive();
  appWindow.innerHTML = `
    <div class="app-heading music-heading">
      <div>
        <h1>${t('music')}</h1>
        <p>Lecteur local pour tester une vibe pendant que tu geres ta carriere.</p>
      </div>
      <div class="music-battery"><span>Batterie</span><strong>${energy}%</strong><i><b style="width:${energy}%"></b></i></div>
    </div>
    <section class="music-player-card ${active ? 'is-playing' : 'is-idle'}">
      <div class="track-orb"></div>
      <div class="track-info">
        <span>Track</span>
        <h2>${escapeHtml(musicTrackName || t('noTrack'))}</h2>
        <input class="music-file" type="file" accept="audio/*" data-audio-file multiple />
      </div>
      <div class="music-controls">
        <button class="secondary-action" type="button" data-music-action="prev">Prev</button>
        <button class="primary-action" type="button" data-music-action="play">Play</button>
        <button class="secondary-action" type="button" data-music-action="pause">Pause</button>
        <button class="secondary-action" type="button" data-music-action="stop">Stop</button>
        <button class="secondary-action" type="button" data-music-action="next">Next</button>
      </div>
      <label class="music-volume"><span>Volume</span><input type="range" min="0" max="100" value="${profile.settings.volume || 70}" data-music-volume /></label>
      <div class="music-visualizer ${active ? 'is-playing' : 'is-idle'}">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="music-eq ${active ? 'is-playing' : 'is-idle'}" aria-hidden="true">
        ${Array.from({ length: 18 }, (_, index) => `<i style="--i:${index}"></i>`).join('')}
      </div>
      <div class="playlist-panel">
        <div class="playlist-head"><strong>Playlist</strong><span>${musicPlaylist.length} tracks</span></div>
        ${musicPlaylist.length ? musicPlaylist.map((track, index) => `
          <button class="${index === musicTrackIndex ? 'active' : ''}" type="button" data-play-track="${index}">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <strong>${escapeHtml(track.name)}</strong>
          </button>
        `).join('') : '<p>Ajoute plusieurs fichiers audio pour construire une playlist.</p>'}
      </div>
    </section>
  `;
  appWindow.querySelector('[data-audio-file]')?.addEventListener('change', (event) => {
    const files = [...(event.target.files || [])];
    if (!files.length) return;
    musicPlaylist.forEach((track) => URL.revokeObjectURL(track.url));
    musicPlaylist = files.map((file) => ({
      name: file.name.replace(/\.[^.]+$/, ''),
      url: URL.createObjectURL(file),
    }));
    playPlaylistTrack(0);
    renderMusicPlayer();
    updateProfileChrome();
  });
  appWindow.querySelectorAll('[data-music-action]').forEach((button) => {
    button.addEventListener('click', () => handleMusicAction(button.dataset.musicAction));
  });
  appWindow.querySelector('[data-music-volume]')?.addEventListener('input', (event) => {
    profile.settings.volume = Number(event.target.value);
    musicAudio.volume = profile.settings.volume / 100;
    saveSlots();
  });
  appWindow.querySelectorAll('[data-play-track]').forEach((button) => {
    button.addEventListener('click', () => playPlaylistTrack(Number(button.dataset.playTrack)));
  });
}

function handleMusicAction(action) {
  if (action === 'play') {
    if (!musicAudio.src && musicPlaylist.length) {
      playPlaylistTrack(Math.max(0, musicTrackIndex));
    } else if (musicAudio.src) {
      playMusicAudio();
    } else {
      notify('Choisis un fichier audio pour lancer le player.');
    }
  }
  if (action === 'prev') playPlaylistTrack(musicTrackIndex <= 0 ? musicPlaylist.length - 1 : musicTrackIndex - 1);
  if (action === 'next') playPlaylistTrack((musicTrackIndex + 1) % Math.max(1, musicPlaylist.length));
  if (action === 'pause') {
    musicAudio.pause();
    musicPlaying = false;
  }
  if (action === 'stop') {
    musicAudio.pause();
    musicAudio.currentTime = 0;
    musicPlaying = false;
  }
  updateProfileChrome();
  renderMusicPlayer();
}

function playPlaylistTrack(index) {
  if (!musicPlaylist.length) return;
  musicTrackIndex = clamp(index, 0, musicPlaylist.length - 1);
  const track = musicPlaylist[musicTrackIndex];
  musicTrackName = track.name;
  musicAudio.src = track.url;
  musicAudio.volume = (profile.settings.volume ?? 70) / 100;
  playMusicAudio();
  updateProfileChrome();
}

function isMusicActive() {
  return Boolean(musicAudio?.src && musicPlaying && !musicAudio.paused && !musicAudio.ended);
}

function setupMusicAnalyser() {
  if (musicAnalyser) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  musicAudioContext = musicAudioContext || new AudioContextClass();
  musicSourceNode = musicSourceNode || musicAudioContext.createMediaElementSource(musicAudio);
  musicAnalyser = musicAudioContext.createAnalyser();
  musicAnalyser.fftSize = 64;
  musicAnalyser.smoothingTimeConstant = 0.78;
  musicSourceNode.connect(musicAnalyser);
  musicAnalyser.connect(musicAudioContext.destination);
  musicFrequencyData = new Uint8Array(musicAnalyser.frequencyBinCount);
}

function playMusicAudio() {
  setupMusicAnalyser();
  if (musicAudioContext?.state === 'suspended') {
    musicAudioContext.resume().catch(() => {});
  }
  musicAudio.play()
    .then(() => {
      musicPlaying = true;
      updateProfileChrome();
      if (currentApp === 'music') renderMusicPlayer();
      updateMusicEqualizer();
    })
    .catch(() => {
      musicPlaying = false;
      updateProfileChrome();
      notify('Le navigateur bloque la lecture. Clique Play encore une fois.');
    });
}

function updateMusicEqualizer() {
  const active = isMusicActive() && musicAnalyser && musicFrequencyData;
  document.body.classList.toggle('music-playing', active);
  const menuBars = [...document.querySelectorAll('.menu-eq i')];
  const playerBars = [...document.querySelectorAll('.music-eq i')];
  const towers = [...document.querySelectorAll('.music-visualizer span')];
  if (!active) {
    [...menuBars, ...playerBars].forEach((bar, index) => {
      const idle = 8 + (index % 4) * 3;
      bar.style.height = `${idle}px`;
      bar.style.opacity = '0.34';
    });
    towers.forEach((bar, index) => {
      bar.style.height = `${18 + index * 4}%`;
      bar.style.opacity = '0.34';
      bar.style.transform = 'scaleY(0.42)';
    });
    return;
  }
  musicAnalyser.getByteFrequencyData(musicFrequencyData);
  const getLevel = (index, count) => {
    const bucket = Math.floor((index / Math.max(1, count)) * musicFrequencyData.length);
    const value = musicFrequencyData[Math.min(musicFrequencyData.length - 1, bucket)] || 0;
    return clamp(value / 255, 0.05, 1);
  };
  menuBars.forEach((bar, index) => {
    const level = getLevel(index, menuBars.length);
    bar.style.height = `${Math.round(5 + level * 15)}px`;
    bar.style.opacity = String(0.5 + level * 0.5);
  });
  playerBars.forEach((bar, index) => {
    const level = getLevel(index, playerBars.length);
    bar.style.height = `${Math.round(10 + level * 120)}px`;
    bar.style.opacity = String(0.45 + level * 0.55);
  });
  towers.forEach((bar, index) => {
    const level = getLevel(index, towers.length);
    bar.style.height = `${Math.round(20 + level * 76)}%`;
    bar.style.opacity = String(0.55 + level * 0.45);
    bar.style.transform = `scaleY(${0.5 + level * 0.55})`;
  });
}

function renderSettings(host = appWindow) {
  host.innerHTML = `
    <div class="app-heading"><div><h1>Réglages de jeu</h1><p>Les réglages s’appliquent à ce profil et sont sauvegardés.</p></div></div>
    <div class="settings-panel">
      <label><span>Langue</span><select data-setting="language"><option value="fr">Français</option><option value="en">English (traduction partielle)</option></select></label>
      <label><span>Musique <output>${profile.settings.volume ?? 70} %</output></span><input type="range" min="0" max="100" value="${profile.settings.volume ?? 70}" data-setting="volume" /></label>
      <label><span>Qualité graphique</span><select data-setting="graphics"><option value="balanced">Équilibré</option><option value="performance">Performance · sans ombres</option><option value="quality">Qualité · résolution maximale</option></select></label>
      <label><span>Sensibilité de la caméra <output>${profile.settings.lookSensitivity ?? 100} %</output></span><input type="range" min="40" max="160" value="${profile.settings.lookSensitivity ?? 100}" data-setting="lookSensitivity" /></label>
      <label><span>Mouvements réduits</span><input type="checkbox" data-setting="reducedMotion" ${profile.settings.reducedMotion?'checked':''} /></label>
      <label><span>Visuels fixes + fondus<br><small>Remplace l’animation des loops par des images fixes pour réduire les flashs.</small></span><input type="checkbox" data-setting="stillVisuals" ${profile.settings.stillVisuals?'checked':''} /></label>
      <label><span>Volume des boutons <output>${profile.settings.uiVolume ?? 35} %</output></span><input type="range" min="0" max="100" value="${profile.settings.uiVolume ?? 35}" data-setting="uiVolume" /></label>
      <label><span>Sons discrets des boutons</span><input type="checkbox" data-setting="uiSounds" ${profile.settings.uiSounds?'checked':''} /></label>
      <button class="primary-action" type="button" data-save-now>Sauvegarder maintenant</button>
      <p data-save-feedback role="status"></p>
    </div>`;
  setSelectValue(host.querySelector('[data-setting="language"]'), profile.settings.language || 'fr', 'fr');
  setSelectValue(host.querySelector('[data-setting="graphics"]'), profile.settings.graphics || 'balanced', 'balanced');
  host.querySelectorAll('[data-setting]').forEach(input=>{
    const apply=()=>{
      profile.settings[input.dataset.setting]=input.type==='checkbox'?input.checked:input.type==='range'?Number(input.value):input.value;
      if(input.type==='range')input.closest('label').querySelector('output').textContent=`${input.value} %`;
      applyGamePreferences();saveSlots();
    };
    input.addEventListener(input.type==='range'?'input':'change',apply);
  });
  host.querySelector('[data-save-now]').addEventListener('click',()=>{host.querySelector('[data-save-feedback]').textContent=saveSlots()===false?'Sauvegarde impossible. Le stockage est indisponible.':'Partie sauvegardée.';});
}

function handleDayAction(action) {
  if (action === 'next-day') {
    advanceDay();
    return;
  }
  if (action === 'open-skills') {
    selectedCalendarDay = null;
    openApp('skills');
    return;
  }
  if (action === 'open-job') {
    selectedCalendarDay = null;
    jobWindowMode = 'home';
    openApp('job');
    return;
  }
  if (action === 'open-rest') {
    selectedCalendarDay = null;
    restWindowMode = 'home';
    openApp('rest');
    return;
  }
  if (action === 'go-gig') {
    const dueGig = getDueGig();
    if (dueGig) startGig(dueGig.id);
    else notify('Aucune gig a jouer aujourd hui.');
    return;
  }
  const cost = ACTION_ENERGY_COST[action] ?? 1;
  if (getRemainingEnergy() < cost) {
    notify(`Pas assez d'energie pour cette action (${cost}). Appuie sur Next Day ou choisis repos si possible.`);
    renderDesktop();
    return;
  }
  const dueGig = getDueGig();
  if (!fromWorld && dueGig) {
    notify(`Impossible de faire une autre action: ${dueGig.title} est aujourd'hui.`);
    renderDesktop();
    return;
  }
  const s = profile.stats;
  if (action === 'practice') {
    s.creativity = clamp(s.creativity + randomInt(3, 6), 0, 100);
    s.fatigue = clamp(s.fatigue + 10, 0, 100);
    addXp(30);
    notify('Pratique VJ terminee: creativite et XP augmentent.');
  }
  if (action === 'study') {
    s.technique = clamp(s.technique + randomInt(4, 8), 0, 100);
    s.fatigue = clamp(s.fatigue + 10, 0, 100);
    addXp(25);
    notify('Pratique technique terminee: moins d erreurs en gig.');
  }
  if (action === 'network') {
    s.network = clamp(s.network + randomInt(2, 4), 0, 100);
    s.fatigue = clamp(s.fatigue + 6, 0, 100);
    unlockGigs();
    if (maybeFindClientLead()) {
      notify('Cherche clients: ton reseau monte et un client vient de repondre par email.');
    } else {
      notify('Cherche clients: ton reseau augmente. Aucun client solide pour aujourd hui.');
    }
  }
  if (action === 'job') {
    const pay = getJobPay();
    profile.money += pay;
    recordFinance(pay, 'Jobine');
    profile.jobDays = (profile.jobDays || 0) + 1;
    s.jobine = getJobPay();
    s.fatigue = clamp(s.fatigue + 15, 0, 100);
    const beforeRaise = 20 - ((profile.jobDays || 0) % 20);
    notify(`Jobine faite: +${pay}$. Salaire actuel ${s.jobine}$${beforeRaise === 20 ? ' avec une augmentation debloquee.' : `, +10$ dans ${beforeRaise} jours de travail.`}`);
  }
  if (action === 'rest-free') {
    s.fatigue = clamp(s.fatigue - 18, 0, 100);
    notify('Repos simple: fatigue reduite, aucun cout.');
  }
  if (action === 'rest-creative') {
    const cost = 45;
    if (profile.money < cost) {
      notify(`Pas assez d'argent pour cette sortie inspiration (${cost}$).`);
      renderDesktop();
      return;
    }
    profile.money -= cost;
    recordFinance(-cost, 'Repos inspiration');
    s.creativity = clamp(s.creativity + randomInt(3, 6), 0, 100);
    s.fatigue = clamp(s.fatigue + 4, 0, 100);
    addXp(10);
    notify(`Sortie inspiration: -${cost}$, creativite augmente, un peu de fatigue.`);
  }
  if (action === 'rest-premium') {
    const cost = 140;
    if (profile.money < cost) {
      notify(`Pas assez d'argent pour le repos premium (${cost}$).`);
      renderDesktop();
      return;
    }
    profile.money -= cost;
    recordFinance(-cost, 'Repos premium');
    s.creativity = clamp(s.creativity + randomInt(6, 10), 0, 100);
    s.fatigue = clamp(s.fatigue - 32, 0, 100);
    addXp(18);
    notify(`Repos premium: -${cost}$, grosse recuperation et vraie inspiration.`);
  }
  if (!spendEnergy(action, cost)) {
    renderDesktop();
    return;
  }
  recordDayActivity(action);
  saveSlots();
  if (action === 'job') {
    closeAppWindowAnimated('close');
    return;
  }
  renderDesktop();
}

function maybeFindClientLead() {
  const chance = Math.min(72, 22 + profile.stats.network * 0.55);
  if (randomInt(1, 100) > chance) return false;
  const lead = profile.gigs.find((gig) => gig.status === 'open');
  if (!lead) return false;
  lead.status = 'offered';
  addEmail(
    'Client',
    `Contact trouve: ${lead.title}`,
    `Ton reseautage a marche. Le client est interesse pour ${lead.title}. Reponds a cet email pour accepter, refuser ou negocier.`,
    { type: 'gig-offer', gigId: lead.id, unique: false }
  );
  return true;
}

function recordDayActivity(action, detail = '') {
  const label = detail || ACTION_LABELS[action] || action;
  const existing = profile.calendarLog[profile.day];
  const activities = Array.isArray(existing?.activities) ? existing.activities.slice() : [];
  activities.push({ action, label, energy: ACTION_ENERGY_COST[action] || 0 });
  profile.calendarLog[profile.day] = {
    label: activities.map((item) => item.label).join(' + '),
    detail: label,
    activities,
  };
}

function advanceDay({ fromWorld = false } = {}) {
  if (!fromWorld && !hasCompletedToday()) {
    notify('Fais une action avant de passer au lendemain.');
    renderDesktop();
    return;
  }
  const dueGig = getDueGig();
  if (!fromWorld && dueGig) {
    addEmail(
      'Planning',
      `Gig a faire: ${dueGig.title}`,
      `Tu ne peux pas passer la journee sans jouer ou canceler ${dueGig.title}. Canceler coute de l argent et de la reputation.`
    );
    notify(`Gig obligatoire aujourd'hui: ${dueGig.title}. Joue-le ou cancelle-le.`);
    saveSlots();
    renderDesktop();
    return;
  }
  const previousDayOfMonth = getDayOfMonth(profile.day);
  profile.day += 1;
  if (!fromWorld && profile.studioWorld) {
    profile.studioWorld.seconds = (profile.day - 1) * 86400 + profile.studioWorld.seconds % 86400;
  }
  profile.energyLog = { day: profile.day, remaining: DAILY_ENERGY_MAX };
  selectedCalendarDay = null;
  processPendingResponses();
  const newDayOfMonth = getDayOfMonth(profile.day);
  if (newDayOfMonth === 1 && previousDayOfMonth !== 1) {
    processRent();
    processLoanPayments();
  }
  saveSlots();
  if (!fromWorld) renderDesktop();
  else updateProfileChrome();
}

function getDueGig() {
  return profile.gigs.find((gig) =>
    (gig.status === 'accepted' || gig.status === 'scheduled') && getGigAbsoluteDay(gig) <= profile.day
  );
}

function processRent() {
  const rent = profile.housing.rent || 0;
  if (rent <= 0) {
    notify('Premier du mois: aucun loyer.');
    return;
  }
  if (profile.money >= rent) {
    profile.money -= rent;
    recordFinance(-rent, `Loyer ${profile.housing.type}`);
    addEmail('Finance', 'Loyer paye', `Ton loyer de ${rent}$ pour ${profile.housing.type} est paye.`);
    notify(`Loyer paye: -${rent}$.`);
  } else {
    const missing = rent - profile.money;
    const paid = profile.money;
    profile.money = 0;
    if (paid > 0) recordFinance(-paid, `Loyer partiel ${profile.housing.type}`);
    profile.stats.fatigue = clamp(profile.stats.fatigue + 18, 0, 100);
    profile.stats.reputation = clamp(profile.stats.reputation - 4, 0, 100);
    addEmail('Finance', 'Loyer impaye', `Il manque ${missing}$. Penalites: fatigue +18, reputation -4.`);
    notify('Loyer impaye: fatigue et reputation penalisees.');
  }
}

function processLoanPayments() {
  if (!profile.loans?.length) return;
  profile.loans.forEach((loan) => {
    const interest = Math.round(loan.balance * (loan.interest / 100));
    loan.balance += interest;
    const payment = Math.min(loan.balance, loan.minimum);
    if (profile.money >= payment) {
      profile.money -= payment;
      loan.balance -= payment;
      recordFinance(-payment, `Paiement pret ${loan.label}`);
    } else {
      profile.stats.reputation = clamp(profile.stats.reputation - 5, 0, 100);
      profile.stats.fatigue = clamp(profile.stats.fatigue + 8, 0, 100);
      addEmail('Finance', 'Paiement de pret manque', `La banque attendait ${payment}$ pour ${loan.label}. Reputation -5, fatigue +8.`);
    }
  });
  profile.loans = profile.loans.filter((loan) => loan.balance > 0);
}

function processPendingResponses() {
  profile.pendingResponses.forEach((pending) => {
    pending.days -= 1;
  });
  const ready = profile.pendingResponses.filter((pending) => pending.days <= 0);
  profile.pendingResponses = profile.pendingResponses.filter((pending) => pending.days > 0);
  ready.forEach((pending) => {
    const gig = profile.gigs.find((item) => item.id === pending.gigId);
    if (!gig) return;
    const isReplay = Boolean(pending.replay || gig.timesCompleted > 0);
    const client = getClientProfile(gig);
    const accepted = isReplay || profile.stats.reputation + profile.stats.network + profile.stats.style * 0.35 + client.acceptanceBonus >= gig.minRep;
    gig.status = accepted ? 'offered' : (pending.previousStatus || 'open');
    gig.responseIn = null;
    gig.responseDay = null;
    if (Number(pending.eventDay)) {
      gig.eventDay = Number(pending.eventDay);
      gig.date = `Jour ${gig.eventDay}`;
    }
    if (accepted) {
      const loyalty=ClientRelations.offerBonus(gig);
      if(loyalty)addEmail(gig.venue||'Client','Offre fidélité',`Ton nouveau cachet annoncé inclut ${loyalty}$ de fidélité.`,{unique:false});
      addEmail(
        'Client',
        isReplay ? `Retour possible: ${gig.title}` : `Offre: ${gig.title}`,
        isReplay
          ? `On peut te reprendre pour ${gig.title} le ${formatScheduledDay(gig.eventDay)}. Comme tu as deja fait ce gig, on te repond le lendemain, mais tu dois accepter l'offre avant de repartir.`
          : `On veut te booker pour ${gig.title} le ${formatScheduledDay(gig.eventDay)}. Reponds a cet email pour accepter, refuser ou negocier le budget.`,
        { type: 'gig-offer', gigId: gig.id }
      );
      notify(`${isReplay ? 'Relance acceptee' : 'Nouvelle offre client'}: ${gig.title}. Confirme ton show dans Booking.`);
    } else {
      gig.eventDay = getDefaultGigEventDay(gig);
      gig.date = `Jour ${gig.eventDay}`;
      addEmail('Client', `Refus: ${gig.title}`, `Merci pour ton message. On cherche quelqu'un avec plus de reputation pour cette date.`, { type: 'gig-refusal', gigId: gig.id });
      notify(`Refus pour ${gig.title}. Continue a progresser.`);
    }
  });
  unlockGigs();
}

function renderPhone() {
  const messages = profile.phoneMessages.slice(-12).reverse();
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Contacts</h1>
        <p>Promoters, clients, DM et petites histoires de scene.</p>
      </div>
    </div>
    <div class="phone-app">
      <section class="phone-panel">
        <h2>Hype VJ</h2>
        ${hypeMeter('Underground', profile.hype.underground)}
        ${hypeMeter('Corporate', profile.hype.corporate)}
        ${hypeMeter('Artistique', profile.hype.artistic)}
        ${hypeMeter('Presence', profile.hype.social)}
        ${hypeMeter('Festival', profile.hype.festival)}
      </section>
      <section class="phone-messages">
        <h2>Messages</h2>
        ${messages.length ? messages.map((message) => `
          <article class="phone-message ${message.kind || 'dm'}">
            <span>${escapeHtml(message.from)} | Jour ${message.day}</span>
            <strong>${escapeHtml(message.title)}</strong>
            <p>${escapeHtml(message.body)}</p>
          </article>
        `).join('') : '<p>Aucun contact actif pour le moment. Les histoires arrivent avec les gigs.</p>'}
      </section>
      <section class="phone-panel">
        <h2>Stories</h2>
        <div class="story-bubble">Setup</div>
        <div class="story-bubble">Backstage</div>
        <div class="story-bubble">Clips</div>
      </section>
    </div>
  `;
}

function hypeMeter(label, value) {
  return `
    <div class="phone-hype-row">
      <span>${escapeHtml(label)}</span>
      <strong>${Math.round(value)}</strong>
      <i><b style="width:${clamp(value, 0, 100)}%"></b></i>
    </div>
  `;
}

function renderEmail() {
  if (!selectedEmailId && profile.emails.length > 0) selectedEmailId = profile.emails[profile.emails.length - 1].id;
  const selected = profile.emails.find((email) => email.id === selectedEmailId) || profile.emails[profile.emails.length - 1] || null;
  if (selected) {
    selectedEmailId = selected.id;
    selected.read = true;
    selected.unread = false;
  }
  saveSlots();
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Email</h1>
        <p>Inbox VJ Mail. Clique un message pour le lire, puis reponds aux offres importantes.</p>
      </div>
    </div>
    <div class="email-app">
      <aside class="email-sidebar">
        <button class="primary-action compose-button" type="button" disabled>Nouveau</button>
        <span>Inbox</span>
        <span>Clients</span>
        <span>Finance</span>
        <span>Archives</span>
      </aside>
      <section class="email-list">
        ${profile.emails.length === 0 ? '<div class="email-card"><p>Aucun email pour l instant.</p></div>' : profile.emails.slice().reverse().map((email) => `
          <button class="email-row${email.id === selectedEmailId ? ' selected' : ''}${email.read ? '' : ' unread'}" type="button" data-email="${email.id}">
            <span>${email.read ? '' : '●'} ${escapeHtml(email.from)}</span>
            <strong>${escapeHtml(email.subject)}</strong>
            <em>Jour ${email.day}</em>
          </button>
        `).join('')}
      </section>
      <article class="email-reader">
        ${selected ? renderEmailReader(selected) : '<p>Aucun message selectionne.</p>'}
      </article>
    </div>
  `;
  appWindow.querySelectorAll('[data-email]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedEmailId = button.dataset.email;
      renderEmail();
    });
  });
  appWindow.querySelectorAll('[data-email-action]').forEach((button) => {
    button.addEventListener('click', () => handleEmailAction(button.dataset.emailAction, button.dataset.gigId));
  });
  updateProfileChrome();
  addWindowControls();
}

function renderEmailReader(email) {
  const gig = email.gigId ? profile.gigs.find((item) => item.id === email.gigId) : null;
  const canRespond = email.type === 'gig-offer' && gig?.status === 'offered';
  return `
    <div class="email-reader-head">
      <span>${escapeHtml(email.from)}</span>
      <h2>${escapeHtml(email.subject)}</h2>
      <p>Jour ${email.day}</p>
    </div>
    <p>${escapeHtml(email.body)}</p>
    ${gig ? `
      <div class="email-gig-box">
        <strong>${escapeHtml(gig.title)}</strong>
        <span>${escapeHtml(gig.venue)} | ${gig.budget}$ | minimum ${getGigMinimumScore(gig)}%</span>
      </div>
    ` : ''}
    <div class="row-actions">
      ${canRespond ? `<button class="primary-action" data-email-action="accept-gig" data-gig-id="${gig.id}">Accepter</button>` : ''}
      ${canRespond ? `<button class="secondary-action danger" data-email-action="refuse-gig" data-gig-id="${gig.id}">Refuser</button>` : ''}
      ${canRespond ? `<button class="secondary-action" data-email-action="negotiate-gig" data-gig-id="${gig.id}">Negocier</button>` : ''}
    </div>
  `;
}

function handleEmailAction(action, gigId) {
  const gig = profile.gigs.find((item) => item.id === gigId);
  if (!gig || gig.status !== 'offered') return;
  if (action === 'accept-gig') {
    const day = scheduleAcceptedGig(gig);
    notify(`Gig accepte: ${gig.title}. Il est bloque ${formatScheduledDay(day)}.`);
  }
  if (action === 'refuse-gig') {
    gig.status = gig.timesCompleted ? 'done' : 'open';
    profile.stats.reputation = clamp(profile.stats.reputation - 1, 0, 100);
    notify(`Offre refusee: ${gig.title}. Petite perte de reputation.`);
  }
  if (action === 'negotiate-gig') {
    gig.budget = Math.round(gig.budget * 1.08);
    const day = scheduleAcceptedGig(gig);
    profile.stats.network = clamp(profile.stats.network + 1, 0, 100);
    notify(`Negociation acceptee: ${gig.title}, budget ${gig.budget}$, date ${formatScheduledDay(day)}.`);
  }
  saveSlots();
  renderEmail();
}

function scheduleAcceptedGig(gig) {
  gig.contractBudget = gig.budget;
  let scheduledDay = Number(gig.eventDay) || getNextWeekendDay(profile.day + 1);
  if (scheduledDay <= profile.day) scheduledDay = getNextWeekendDay(profile.day + 1);
  while (isGigNightReserved(scheduledDay, gig.id)) {
    scheduledDay = getNextWeekendDay(scheduledDay + 1, scheduledDay);
  }
  gig.status = 'accepted';
  gig.scheduledDay = scheduledDay;
  gig.eventDay = scheduledDay;
  gig.date = `Jour ${scheduledDay}`;
  return scheduledDay;
}

function renderSocial() { renderSimpleBookings(); }

function renderSocialDetailed() {
  refreshAvailableGigPool();
  const socialGigs = getSocialGigs().filter((entry) => bookingStyleFilter === 'all' || entry.gig.style === bookingStyleFilter);
  const remainingEmails = getRemainingSocialEmails();
  const pendingCount = profile.gigs.filter((gig) => gig.status === 'pending').length;
  const offeredCount = profile.gigs.filter((gig) => gig.status === 'offered').length;
  const confirmedCount = profile.gigs.filter((gig) => gig.status === 'accepted' || gig.status === 'scheduled').length;
  const nextGig = getNextAcceptedGig();
  appWindow.innerHTML = `
    <div class="app-heading booking-heading">
      <div>
        <h1>VJ Booking</h1>
      </div>
      <div class="social-email-meter">
        <span>Emails</span>
        <strong>${remainingEmails} / 3</strong>
      </div>
    </div>
    <div class="booking-toolbar">
      <label class="booking-search">
        <span>Recherche</span>
        <input type="text" value="Gigs disponibles" readonly />
      </label>
      <button class="booking-filter ${bookingStyleFilter === 'all' ? 'active' : ''}" type="button" data-booking-style="all">Tous</button>
      ${Object.entries(STYLE_CATALOG).map(([style, meta]) => `
        <button class="booking-filter style-${escapeHtml(style)} ${bookingStyleFilter === style ? 'active' : ''}" type="button" data-booking-style="${escapeHtml(style)}">${escapeHtml(meta.label)}</button>
      `).join('')}
    </div>
    <div class="booking-stats">
      <div><span>Opportunites</span><strong>${socialGigs.filter((entry) => entry.gig.status === 'open').length}</strong></div>
      <div><span>En attente</span><strong>${pendingCount}</strong></div>
      <div><span>Offres</span><strong>${offeredCount}</strong></div>
      <div><span>Confirmes</span><strong>${confirmedCount}</strong></div>
    </div>
    <div class="social-layout">
      <aside class="social-sidebar">
        <div class="social-profile-card">
          <span class="social-avatar">${escapeHtml(profile.name.slice(0, 2).toUpperCase())}</span>
          <strong>${escapeHtml(profile.name)}</strong>
          <span>Niveau ${profile.stats.level} | Rep ${Math.round(profile.stats.reputation)}</span>
        </div>
        <div class="booking-profile-meters">
          ${desktopStat('Reseau', profile.stats.network)}
          ${desktopStat('Style', profile.stats.style)}
          ${desktopStat('Technique', profile.stats.technique)}
        </div>
      </aside>
      <section class="social-feed">
        ${socialGigs.map((entry) => renderGigCard(entry.gig, entry.featured, entry.levelGap)).join('')}
      </section>
      <aside class="social-suggestions booking-pipeline">
        <h3>Pipeline</h3>
        <p><strong>${nextGig ? formatScheduledDay(getGigAbsoluteDay(nextGig)) : '-'}</strong><span>Prochain gig</span></p>
        <p><strong>${Math.round(profile.stats.network)}</strong><span>Reseau</span></p>
        <p><strong>${Math.round(profile.stats.reputation)}</strong><span>Reputation</span></p>
        <p><strong>${getRemainingSocialEmails()}</strong><span>Emails restants</span></p>
      </aside>
    </div>
  `;
  appWindow.querySelectorAll('[data-apply]').forEach((button) => {
    button.addEventListener('click', () => applyToGig(button.dataset.apply));
  });
  appWindow.querySelectorAll('[data-booking-style]').forEach((button) => {
    button.addEventListener('click', () => {
      bookingStyleFilter = button.dataset.bookingStyle;
      renderSocial();
      addWindowControls();
    });
  });
  appWindow.querySelectorAll('[data-reapply-gig]').forEach((button) => {
    button.addEventListener('click', () => reapplyToGig(button.dataset.reapplyGig));
  });
  appWindow.querySelectorAll('[data-play-gig]').forEach((button) => {
    button.addEventListener('click', () => startGig(button.dataset.playGig));
  });
  appWindow.querySelectorAll('[data-open-email]').forEach((button) => {
    button.addEventListener('click', () => openApp('email'));
  });
}

function getStyleMeta(style) {
  return STYLE_CATALOG[style] || STYLE_CATALOG.techno;
}

function renderStyleBadge(style) {
  const meta = getStyleMeta(style);
  return `<b class="style-badge style-${escapeHtml(style || 'techno')}">${escapeHtml(meta.label)}</b>`;
}

function renderGigCard(gig, featured = false, levelGap = 0) {
  const locked = gig.status === 'locked';
  const pending = gig.status === 'pending';
  const offered = gig.status === 'offered';
  const accepted = gig.status === 'accepted' || gig.status === 'scheduled';
  const cancelled = gig.status === 'cancelled';
  const done = gig.status === 'done';
  const replayWait = getReplayWaitDays(gig);
  const replayReady = done && replayWait <= 0;
  const estimated = calculateCareerScore(78, gig);
  const applicationDay = getGigApplicationDay(gig);
  const gigDateLabel = accepted || pending || offered || gig.status === 'open'
    ? formatScheduledDay(getGigAbsoluteDay(gig))
    : gig.date;
  const playableToday = accepted && canPlayGig(gig);
  const statusLabel = locked ? 'Verrouille' : pending ? 'En attente' : offered ? 'Offre email' : accepted ? 'Confirme' : done ? 'Termine' : cancelled ? 'Cancelle' : 'Ouvert';
  const statusClass = locked ? 'locked' : pending ? 'pending' : offered ? 'offered' : accepted ? 'accepted' : done ? 'done' : cancelled ? 'cancelled' : 'open';
  const canEmailToday = getRemainingSocialEmails() > 0;
  const levelPenalty = getGigLevelPenalty(gig);
  const client = getClientProfile(gig);
  const conflict = gig.status === 'open' || replayReady ? getGigDateConflict(gig) : null;
  const applicationDisabled = !canEmailToday || Boolean(conflict);
  return `
    <article class="social-post gig-card ${statusClass}${featured ? ' featured-gig' : ''} style-${escapeHtml(gig.style)}">
      <div class="post-header">
        <span class="social-avatar">${escapeHtml(gig.venue.slice(0, 2).toUpperCase())}</span>
        <div>
          <h3>${escapeHtml(gig.title)}</h3>
          <div class="post-meta">${escapeHtml(gig.type)} - ${escapeHtml(gigDateLabel)} - ${escapeHtml(gig.venue)}</div>
        </div>
        <span class="status-badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="booking-contract-strip">
        <span><b>${gig.budget}$</b>Budget</span>
        <span><b>${escapeHtml(client.label.replace('Client ', ''))}</b>Client</span>
        <span>${renderStyleBadge(gig.style)}</span>
        <span><b>${getGigProjectorCount(gig)}</b>Projo</span>
        <span><b>${escapeHtml(formatScheduledDay(applicationDay))}</b>Date</span>
      </div>
      ${featured ? `<div class="gig-level-banner">Opportunite +${levelGap} niveau${levelGap > 1 ? 'x' : ''}: possible, mais risque -${levelPenalty} pts et paiement reduit si tu n'es pas pret.</div>` : ''}
      ${conflict ? `<div class="gig-date-conflict">${escapeHtml(conflict.message)}</div>` : ''}
      <p>${escapeHtml(gig.requirement)}</p><p>${escapeHtml(ShowProfiles.brief(gig))}</p>${ClientRelations.markup(gig)}
      ${renderGigQuickRequirements(gig)}
      ${done ? `<p>Deja joue ${gig.timesCompleted || 1} fois. ${replayReady ? 'Rejouable maintenant.' : `Rejouable dans ${replayWait} jour${replayWait > 1 ? 's' : ''}.`}</p>` : ''}
      <div class="post-reactions">
        <span>${statusLabel}</span>
        <span>${escapeHtml(gig.zoneLabel || '1 rectangle')} | ${getGigProjectorCount(gig)} projo</span>
        <span>${escapeHtml(gig.timerLabel === 'non' ? 'sans timer' : `timer ${gig.timerLabel}`)}</span>
      </div>
      <div class="row-actions">
        ${locked ? '<button class="secondary-action" disabled>Bloque</button>' : ''}
        ${gig.status === 'open' ? `<button class="primary-action" data-apply="${gig.id}" ${applicationDisabled ? 'disabled' : ''}>Envoyer email</button>` : ''}
        ${pending ? '<button class="secondary-action" disabled>Reponse en attente</button>' : ''}
        ${offered ? '<button class="primary-action" data-open-email="true">Repondre email</button>' : ''}
        ${accepted ? `<button class="primary-action" data-play-gig="${gig.id}" ${playableToday ? '' : 'disabled'}>${playableToday ? 'Transport Uver' : 'Attendre la date'}</button><button class="secondary-action danger" data-cancel-booking="${gig.id}">Annuler gig</button>` : ''}
        ${done ? (replayReady ? `<button class="primary-action" data-reapply-gig="${gig.id}" ${applicationDisabled ? 'disabled' : ''}>Relancer client</button>` : `<button class="secondary-action" disabled>Repos ${replayWait}j</button>`) : ''}
        ${cancelled ? '<button class="secondary-action danger" disabled>Cancelle</button>' : ''}
      </div>
    </article>
  `;
}

function renderGigQuickRequirements(gig) {
  const specific = getGigSpecificRequirements(gig);
  const missingSkills = getMissingSkills(gig);
  const chips = [
    `Objectif ${getGigMinimumScore(gig)}%`,
    `${getGigProjectorCount(gig)} projo${getGigProjectorCount(gig) > 1 ? 's' : ''}`,
    `${specific.vjloop || 1} pack${(specific.vjloop || 1) > 1 ? 's' : ''} ${getStyleMeta(gig.style).label}`,
    gig.skillText && gig.skillText !== 'aucune' ? `Skill ${gig.skillText}` : 'Skill libre',
    gig.gearText ? `Gear ${gig.gearText}` : 'Gear starter',
    gig.timerLabel && gig.timerLabel !== 'non' ? `Timer ${gig.timerLabel}` : 'Sans timer',
  ];
  if (specific.router) chips.push('Boite routing');
  if (specific.adapter) chips.push('Adaptateurs');
  if (getGigMaskRequirement(gig) > 0) chips.push(`Plume ${getGigMaskRequirement(gig)}`);
  return `
    <div class="gig-requirement-chips">
      ${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')}
    </div>
    ${missingSkills.length ? `<div class="gig-date-conflict">Skill manquant: ${escapeHtml(missingSkills.join(', '))}</div>` : ''}
  `;
}

function applyToGig(gigId) {
  const gig = profile.gigs.find((item) => item.id === gigId);
  if (!gig || gig.status !== 'open') return;
  const missingSkills = getMissingSkills(gig);
  if (missingSkills.length) {
    notify(`Tu ne peux pas postuler: competence manquante (${missingSkills.join(', ')}).`);
    openApp('skills');
    return;
  }
  const missingWorld = getGigWorldRequirements(gig);
  if (missingWorld.length) {
    notify(`Ce booking n est pas encore dans ton monde: ${missingWorld.slice(0, 2).join(', ')}.`);
    return;
  }
  const conflict = getGigDateConflict(gig);
  if (conflict) {
    notify(conflict.message);
    return;
  }
  if (!useSocialEmail()) return;
  submitGigRequest(gig, false);
}

function getGigLevelPenalty(gig) {
  const index = profile.gigs.findIndex((item) => item.id === gig.id);
  const gap = Math.max(0, getGigUnlockLevel(gig, index) - (profile.stats.level || 1));
  return gap * 8;
}

function reapplyToGig(gigId) {
  const gig = profile.gigs.find((item) => item.id === gigId);
  if (!gig || gig.status !== 'done') return;
  const missingSkills = getMissingSkills(gig);
  if (missingSkills.length) {
    notify(`Tu ne peux pas relancer: competence manquante (${missingSkills.join(', ')}).`);
    openApp('skills');
    return;
  }
  const missingWorld = getGigWorldRequirements(gig);
  if (missingWorld.length) {
    notify(`Tu ne peux pas relancer: ${missingWorld.slice(0, 2).join(', ')}.`);
    return;
  }
  const wait = getReplayWaitDays(gig);
  if (wait > 0) {
    notify(`Tu dois attendre encore ${wait} jour${wait > 1 ? 's' : ''} avant de relancer ce client.`);
    return;
  }
  const conflict = getGigDateConflict(gig);
  if (conflict) {
    notify(conflict.message);
    return;
  }
  if (!useSocialEmail()) return;
  submitGigRequest(gig, true);
}

function submitGigRequest(gig, replay) {
  const conflict = getGigDateConflict(gig);
  if (conflict) {
    notify(conflict.message);
    return;
  }
  gig.status = 'pending';
  const days = replay ? 1 : randomInt(1, 3);
  const eventDay = getGigApplicationDay(gig);
  const responseDay = profile.day + days;
  gig.responseIn = days;
  gig.responseDay = responseDay;
  gig.eventDay = eventDay;
  gig.date = `Jour ${eventDay}`;
  profile.stats.network = clamp(profile.stats.network + 1, 0, 100);
  addXp(replay ? 6 : 10);
  profile.pendingResponses.push({
    gigId: gig.id,
    days,
    responseDay,
    eventDay,
    replay,
    previousStatus: replay ? 'done' : 'open',
  });
  notify(replay
    ? `Email de relance envoye pour ${formatScheduledDay(eventDay)}. Reponse demain.`
    : `Candidature envoyee pour ${formatScheduledDay(eventDay)}. Reponse possible dans ${days} jour${days > 1 ? 's' : ''}.`
  );
  saveSlots();
  renderSocial();
}

function syncSocialEmailLog() {
  if (!profile.socialEmailLog || typeof profile.socialEmailLog !== 'object') {
    profile.socialEmailLog = { day: profile.day, count: 0 };
  }
  if (profile.socialEmailLog.day !== profile.day) {
    profile.socialEmailLog.day = profile.day;
    profile.socialEmailLog.count = 0;
  }
}

function getRemainingSocialEmails() {
  syncSocialEmailLog();
  return Math.max(0, 3 - (Number(profile.socialEmailLog.count) || 0));
}

function useSocialEmail() {
  syncSocialEmailLog();
  if (getRemainingSocialEmails() <= 0) {
    notify('Tu as deja envoye tes 3 emails de candidature aujourd hui. Passe au lendemain.');
    renderSocial();
    return false;
  }
  profile.socialEmailLog.count = (Number(profile.socialEmailLog.count) || 0) + 1;
  return true;
}

function getReplayWaitDays(gig) {
  if (!gig?.lastCompletedDay) return 0;
  const elapsed = profile.day - gig.lastCompletedDay;
  return Math.max(0, (gig.cooldownDays || 7) - elapsed);
}

function canPlayGig(gig) {
  if (!gig) return false;
  if (gig.status === 'accepted' || gig.status === 'scheduled') return Boolean(gig.sessionReady) || profile.day >= getGigAbsoluteDay(gig);
  return false;
}

function getMissingSkills(gig) {
  return Object.entries(gig?.requiredSkills || {})
    .filter(([id, level]) => (profile.skills?.[id] || 0) < level)
    .map(([id, level]) => {
      const skill = skillCatalog.find((entry) => entry.id === id);
      return `${skill?.label || id} niv. ${level}`;
    });
}

function getGigWorldRequirements(gig) {
  const specific = getGigSpecificRequirements(gig);
  const missing = [];
  const progression=window.GigDifficulty?.blocker(gig);if(progression)missing.push(progression);
  const number = Number(gig?.number) || 1;
  const loaner = Boolean(gig?.loanerGear);
  const gearChecks = [
    ['projector', specific.projector, getGigProjectorCount(gig), 'projecteur'],
    ['computer', specific.computer, 1, 'ordinateur'],
    ['gpu', specific.gpu, 1, 'carte graphique'],
    ['cable', specific.cable, getGigProjectorCount(gig), 'fils video'],
    ['adapter', specific.adapter, 1, 'adaptateur'],
    ['router', specific.router, 1, 'boite multi-projecteur'],
    ['console', specific.console, 1, 'console VJ'],
    ['screen', specific.screen, 1, 'ecran de controle'],
    ['bag', specific.bag, 1, 'sac transport'],
  ];
  if (!loaner) {
    gearChecks.forEach(([type, slug, quantity, label]) => {
      if (!slug) return;
      if (getOwnedGearUnitCountAtLeast(type, slug) < quantity) missing.push(`${label}: ${getGearMeta(type, slug).label} ou mieux`);
    });
    (specific.accessories || []).forEach((slug) => {
      if (getOwnedGearUnitCount('accessory', slug) < 1) missing.push(`outil: ${getGearMeta('accessory', slug).label}`);
    });
    if (countOwnedVjLoopPacks(gig.style) < specific.vjloop) {
      missing.push(`${specific.vjloop} pack${specific.vjloop > 1 ? 's' : ''} VJ ${getStyleMeta(gig.style).label}`);
    }
  }
  const minStyle = getGigStyleRequirement(gig);
  if ((profile.stats.style || 0) < minStyle) missing.push(`look/style ${minStyle}+`);
  const clothingNeed = getGigClothingRequirement(gig);
  if (clothingNeed.count && countOwnedClothingItems() < clothingNeed.count) missing.push(clothingNeed.label);
  return missing;
}

function getGigStyleRequirement(gig) {
  const number = Number(gig?.number) || 1;
  if (number < 8) return 0;
  return Math.min(78, 18 + Math.floor(number * 1.55));
}

function getGigClothingRequirement(gig) {
  const number = Number(gig?.number) || 1;
  const clientType = gig?.clientType || 'chill';
  // The five introductory gigs teach performance before requiring a wardrobe.
  if (number <= 5) return { count: 0, label: '' };
  if (number >= 25 || clientType === 'festival') return { count: 3, label: 'look pro complet: 3 vetements VJ' };
  if (number >= 18 || clientType === 'corpo') return { count: 2, label: 'look client serieux: 2 vetements VJ' };
  if (number >= 10) return { count: 1, label: 'au moins 1 vetement VJ achete' };
  return { count: 0, label: '' };
}

function countOwnedClothingItems() {
  return profile.ownedItems.filter((id) => id.startsWith('clothing-')).length;
}

function isGigWorldUnlocked(gig, index = profile.gigs.findIndex((item) => item.id === gig.id)) {
  if (profile.godMode) return true;
  if (!gig || ['pending', 'offered', 'accepted', 'scheduled', 'done', 'cancelled'].includes(gig.status)) return true;
  const levelReady = profile.stats.level >= getGigUnlockLevel(gig, index);
  const socialReady = profile.stats.reputation >= gig.minRep || profile.stats.network >= gig.minRep;
  const stretchReady = getGigUnlockLevel(gig, index) <= profile.stats.level + 1;
  return (levelReady || socialReady || stretchReady) &&
    getMissingSkills(gig).length === 0 &&
    getGigWorldRequirements(gig).length === 0;
}

function unlockGigs() {
  refreshAvailableGigPool(true);
}

function refreshAvailableGigPool(showNotifications = false) {
  profile.gigs.forEach(g=>window.GigDifficulty?.configure(g));
  let openedCount = 0;
  profile.gigs.forEach((gig) => {
    if (gig.status !== 'open') return;
    const index = profile.gigs.findIndex((item) => item.id === gig.id);
    if (!isGigWorldUnlocked(gig, index)) {
      gig.status = 'locked';
      return;
    }
    if (!Number(gig.eventDay) || Number(gig.eventDay) < profile.day) {
      gig.eventDay = getDefaultGigEventDay(gig);
      gig.date = `Jour ${gig.eventDay}`;
    }
  });
  profile.gigs.forEach((gig) => {
    if (gig.status !== 'locked') return;
    const index = profile.gigs.findIndex((item) => item.id === gig.id);
    if (isGigWorldUnlocked(gig, index)) {
      gig.status = 'open';
      gig.eventDay = getDefaultGigEventDay(gig);
      gig.date = `Jour ${gig.eventDay}`;
      openedCount += 1;
      if (showNotifications) announceUnlockedGig(gig);
    }
  });
  let openGigs = profile.gigs.filter((gig) => gig.status === 'open').length;
  if (openGigs >= 3) return openedCount;
  profile.gigs
    .map((gig, index) => ({ gig, index }))
    .filter(({ gig, index }) => gig.status === 'locked' && isGigWorldUnlocked(gig, index))
    .sort((a, b) => getGigUnlockLevel(a.gig, a.index) - getGigUnlockLevel(b.gig, b.index) || a.index - b.index)
    .some(({ gig }) => {
      gig.status = 'open';
      gig.eventDay = getDefaultGigEventDay(gig);
      gig.date = `Jour ${gig.eventDay}`;
      openGigs += 1;
      openedCount += 1;
      if (showNotifications) announceUnlockedGig(gig);
      return openGigs >= 3;
    });
  return openedCount;
}

function announceUnlockedGig(gig) {
  if (gig.unlockNotified) return;
  gig.unlockNotified = true;
  const style = getStyleMeta(gig.style).label;
  addEmail(
    'Booking',
    `Nouvelle opportunite: ${gig.title}`,
    `Ta reputation, ton setup ou ton style ouvrent une nouvelle scene: ${gig.title}. Style demande: ${style}. Date possible: ${formatScheduledDay(getGigApplicationDay(gig))}.`,
    { unique: true }
  );
  addPhoneMessage(
    'Promoter',
    `Nouveau booking ${style}`,
    `On commence a entendre parler de toi. ${gig.title} vient d apparaitre dans Booking.`,
    'dm'
  );
  notify(`Nouveau gig debloque: ${gig.title}.`);
}

function getGigUnlockLevel(gig, index = profile.gigs.findIndex((item) => item.id === gig.id)) {
  return Math.max(1, Math.ceil((index + 1) / 3));
}

function getFeaturedSocialGigs(limit = 3) {
  refreshAvailableGigPool();
  const level = profile.stats.level || 1;
  const openEntries = profile.gigs
    .map((gig, index) => ({ gig, index, unlockLevel: getGigUnlockLevel(gig, index) }))
    .filter(({ gig }) => gig.status === 'open');
  const stretch = openEntries
    .filter(({ unlockLevel }) => unlockLevel > level)
    .sort((a, b) => a.unlockLevel - b.unlockLevel || a.gig.budget - b.gig.budget);
  const fallback = openEntries
    .filter((entry) => !stretch.some((item) => item.gig.id === entry.gig.id))
    .sort((a, b) => b.unlockLevel - a.unlockLevel || b.gig.budget - a.gig.budget);
  return [...stretch, ...fallback]
    .slice(0, limit)
    .map((entry) => ({
      gig: entry.gig,
      featured: true,
      levelGap: Math.max(0, entry.unlockLevel - level),
    }));
}

function getAvailableApplicationGigs(limit = 3) {
  return profile.gigs
    .map((gig, index) => ({ gig, index }))
    .filter(({ gig }) => gig.status === 'open')
    .sort((a, b) => getGigUnlockLevel(a.gig, a.index) - getGigUnlockLevel(b.gig, b.index) || b.gig.budget - a.gig.budget)
    .slice(0, limit)
    .map(({ gig }) => gig);
}

function getSocialGigs() {
  const featured = getFeaturedSocialGigs(3);
  const featuredIds = new Set(featured.map((entry) => entry.gig.id));
  const previousAndActive = profile.gigs
    .map((gig, index) => ({ gig, index, unlockLevel: getGigUnlockLevel(gig, index) }))
    .filter(({ gig }) =>
      !featuredIds.has(gig.id) &&
      ['open', 'pending', 'offered', 'accepted', 'scheduled', 'done', 'cancelled'].includes(gig.status)
    )
    .sort((a, b) => a.unlockLevel - b.unlockLevel || a.gig.budget - b.gig.budget)
    .map((entry) => ({
      gig: entry.gig,
      featured: false,
      levelGap: Math.max(0, entry.unlockLevel - (profile.stats.level || 1)),
    }));
  return [...featured, ...previousAndActive];
}

function renderFinanceManagement() {
  const nextGig = getNextAcceptedGig();
  const pendingPayments = profile.gigs.filter((gig) => ['accepted', 'scheduled'].includes(gig.status));
  const doneGigs = profile.gigs.filter((gig) => gig.status === 'done');
  const monthSpent = profile.housing.rent || 0;
  const loans = profile.loans || [];
  const debt = loans.reduce((sum, loan) => sum + loan.balance, 0);
  const minPayments = loans.reduce((sum, loan) => sum + loan.minimum, 0);
  const revenue = doneGigs.reduce((sum, gig) => sum + Math.round(gig.lastPayout || 0), 0);
  const monthlyRows = getCurrentMonthFinanceRows();
  const monthIncome = monthlyRows.reduce((sum, row) => sum + (row.amount > 0 ? row.amount : 0), 0);
  const monthExpenses = monthlyRows.reduce((sum, row) => sum + (row.amount < 0 ? Math.abs(row.amount) : 0), 0);
  const projectedMonthCost = monthSpent + minPayments;
  const netMonthly = monthIncome - monthExpenses;
  const projectedBalance = Math.round(profile.money - projectedMonthCost);
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Finance</h1>
        <p>Argent, loyer, jobine et revenus de gigs. Le loyer est gere ici, pas dans le calendrier.</p>
      </div>
      <div class="shop-wallet">
        <span>Solde</span>
        <strong>${Math.round(profile.money)}$</strong>
      </div>
    </div>
    <div class="finance-grid">
      <section class="finance-card balance">
        <span>Compte VJ</span>
        <strong>${Math.round(profile.money)}$</strong>
        <p>Niveau ${profile.stats.level} | Reputation ${Math.round(profile.stats.reputation)} | Dette ${debt}$</p>
      </section>
      <section class="finance-card">
        <span>Revenus</span>
        <strong>${monthIncome}$</strong>
        <p>Ce mois. Carriere gigs: ${revenue}$.</p>
      </section>
      <section class="finance-card">
        <span>Depenses</span>
        <strong>${monthExpenses}$</strong>
        <p>Ce mois: achats, Uver, loyer et paiements de dettes.</p>
      </section>
      <section class="finance-card">
        <span>Paiements a venir</span>
        <strong>${minPayments}$</strong>
        <p>${nextGig ? `${escapeHtml(nextGig.title)} | contrat ${nextGig.budget}$` : 'Aucun contrat confirme.'}</p>
      </section>
    </div>
    <div class="dashboard-grid finance-details">
      <section class="card">
        <h2>Banque VJ</h2>
        <p>Maximum 3 prets actifs, un seul de chaque type. Les paiements minimums sortent le 1er du mois.</p>
        <div class="loan-grid">
          ${renderLoanButton(300, 8, 35, 'Micro pret')}
          ${renderLoanButton(800, 12, 85, 'Gear bridge')}
          ${renderLoanButton(1600, 18, 170, 'Studio credit')}
        </div>
        ${loans.length ? loans.map((loan) => `
          <div class="finance-row">
            <span>${escapeHtml(loan.label)}</span>
            <strong>${loan.balance}$</strong>
            <em>min ${loan.minimum}$ / ${loan.interest}%</em>
            <button class="secondary-action compact" data-pay-loan="${escapeHtml(loan.id)}">Payer min</button>
            <button class="primary-action compact" data-pay-loan-all="${escapeHtml(loan.id)}">Payer tout</button>
          </div>
        `).join('') : '<p>Aucun pret actif.</p>'}
      </section>
      <section class="card">
        <h2>Contrats en cours</h2>
        ${pendingPayments.length ? pendingPayments.map((gig) => `
          <div class="finance-row">
            <span>${escapeHtml(gig.title)}</span>
            <strong>${gig.budget}$</strong>
            <em>${formatScheduledDay(getGigAbsoluteDay(gig))}</em>
            <button class="secondary-action danger compact" data-cancel-booking="${gig.id}">Annuler</button>
          </div>
        `).join('') : '<p>Aucun contrat accepte pour le moment.</p>'}
      </section>
      <section class="card">
        <h2>Planification</h2>
        <div class="finance-row"><span>Loyer prevu</span><strong>-${monthSpent}$</strong><em>Jour 1</em></div>
        <div class="finance-row"><span>Gigs termines</span><strong>${doneGigs.length}</strong><em>Total carriere</em></div>
        <div class="finance-row"><span>Salaire jobine</span><strong>${getJobPay()}$</strong><em>Action quotidienne</em></div>
        <div class="finance-row"><span>Dettes</span><strong>-${debt}$</strong><em>minimum ${minPayments}$</em></div>
        <div class="finance-row"><span>Bilan du mois</span><strong>${netMonthly >= 0 ? '+' : ''}${netMonthly}$</strong><em>revenus encaissés - dépenses payées</em></div>
        <div class="finance-row"><span>Solde projete</span><strong>${projectedBalance}$</strong><em>après le prochain loyer et les minimums</em></div>
      </section>
      <section class="card">
        <h2>Calcul du mois</h2>
        <div class="finance-row"><span>Solde actuel</span><strong>${Math.round(profile.money)}$</strong><em>compte VJ</em></div>
        <div class="finance-row"><span>+ Revenus faits</span><strong>+${monthIncome}$</strong><em>jobine, gigs, revente, prets</em></div>
        <div class="finance-row"><span>- Depenses faites</span><strong>-${monthExpenses}$</strong><em>shop, Uver, repos, paiements</em></div>
        <div class="finance-row"><span>- Loyer prevu</span><strong>-${monthSpent}$</strong><em>jour 1</em></div>
        <div class="finance-row"><span>- Minimum dettes</span><strong>-${minPayments}$</strong><em>${loans.length}/3 prets actifs</em></div>
        <div class="finance-row total-row"><span>Total mensuel</span><strong>${netMonthly >= 0 ? '+' : ''}${netMonthly}$</strong><em>bilan des opérations payées</em></div>
      </section>
      <section class="card">
        <h2>Activite du mois</h2>
        ${monthlyRows.length ? monthlyRows.slice(-8).reverse().map((row) => `
          <div class="finance-row">
            <span>Jour ${row.day} - ${escapeHtml(row.label)}</span>
            <strong>${row.amount >= 0 ? '+' : ''}${row.amount}$</strong>
            <em>${row.amount >= 0 ? 'revenu' : 'depense'}</em>
          </div>
        `).join('') : '<p>Aucune transaction ce mois.</p>'}
      </section>
    </div>
  `;
  appWindow.querySelectorAll('[data-loan]').forEach((button) => {
    button.addEventListener('click', () => takeLoan(button.dataset.loan));
  });
  appWindow.querySelectorAll('[data-pay-loan]').forEach((button) => {
    button.addEventListener('click', () => payLoan(button.dataset.payLoan));
  });
  appWindow.querySelectorAll('[data-pay-loan-all]').forEach((button) => {
    button.addEventListener('click', () => payLoan(button.dataset.payLoanAll, true));
  });
  appWindow.querySelectorAll('[data-cancel-booking]').forEach((button) => {
    button.addEventListener('click', () => cancelBookedGig(button.dataset.cancelBooking));
  });
}

function renderLoanButton(amount, interest, minimum, label) {
  const blocked = (profile.loans || []).length >= 3 || (profile.loans || []).some((loan) => loan.label === label);
  const reason = (profile.loans || []).some((loan) => loan.label === label) ? 'deja actif' : (profile.loans || []).length >= 3 ? 'max 3 prets' : 'disponible';
  return `<button class="loan-button" type="button" data-loan="${amount}|${interest}|${minimum}|${escapeHtml(label)}" ${blocked ? 'disabled' : ''}><strong>${amount}$</strong><span>${interest}% | min ${minimum}$</span><em>${escapeHtml(label)} - ${reason}</em></button>`;
}

function takeLoan(payload) {
  const [amount, interest, minimum, label] = payload.split('|');
  if ((profile.loans || []).length >= 3) {
    notify('Maximum 3 prets actifs.');
    return;
  }
  if ((profile.loans || []).some((loan) => loan.label === label)) {
    notify('Ce type de pret est deja actif.');
    return;
  }
  const loan = {
    id: `loan-${Date.now()}`,
    label,
    amount: Number(amount),
    balance: Number(amount),
    interest: Number(interest),
    minimum: Number(minimum),
    day: profile.day,
  };
  profile.loans.push(loan);
  profile.money += loan.amount;
  profile.stats.reputation = clamp(profile.stats.reputation - Math.ceil(loan.amount / 900), 0, 100);
  recordFinance(loan.amount, `Pret ${label}`);
  saveSlots();
  notify(`Pret accepte: +${loan.amount}$.`);
  renderFinance();
  addWindowControls();
}

function payLoan(loanId, payAll = false) {
  const loan = profile.loans.find((entry) => entry.id === loanId);
  if (!loan) return;
  if (payAll && profile.money < loan.balance) {
    notify(`Pas assez d argent pour fermer cette dette (${loan.balance}$).`);
    return;
  }
  const wanted = payAll ? loan.balance : Math.min(loan.balance, loan.minimum);
  if (profile.money < wanted) {
    notify('Pas assez d argent pour payer cette dette.');
    return;
  }
  const amount = Math.min(loan.balance, wanted);
  profile.money -= amount;
  loan.balance -= amount;
  recordFinance(-amount, `Paiement dette ${loan.label}`);
  if (loan.balance <= 0) {
    profile.loans = profile.loans.filter((entry) => entry.id !== loan.id);
    profile.stats.reputation = clamp(profile.stats.reputation + 2, 0, 100);
    notify(`Dette terminee: ${loan.label}. Reputation +2.`);
  } else {
    notify(`Dette payee: -${amount}$. Reste ${loan.balance}$.`);
  }
  saveSlots();
  renderFinance();
  addWindowControls();
}

function getCurrentMonthFinanceRows() {
  const start = getMonthStartDay(profile.day);
  const end = start + 29;
  return (profile.financeLog || []).filter((row) => row.day >= start && row.day <= end);
}

function recordFinance(amount, label, details = {}) {
  if(profile.godMode)profile.money=GOD_MODE_MONEY;
  const bankTransfer = window.VJBank?.record(amount, label, details);
  if (!profile.financeLog) profile.financeLog = [];
  profile.financeLog.push({ day: profile.day, amount: Math.round(amount), label, ...(bankTransfer ? {reference:bankTransfer.reference} : {}) });
  profile.financeLog = profile.financeLog.slice(-80);
  return bankTransfer;
}

function cancelBookedGig(gigId) {
  const gig = profile.gigs.find((item) => item.id === gigId);
  if (!gig || !['accepted', 'scheduled', 'pending', 'offered'].includes(gig.status)) return;
  const confirmed = gig.status === 'accepted' || gig.status === 'scheduled';
  const dueToday = confirmed && getGigAbsoluteDay(gig) <= profile.day;
  const penalty = confirmed
    ? Math.max(dueToday ? 110 : 70, Math.round(gig.budget * (dueToday ? 0.48 : 0.32)))
    : Math.max(20, Math.round(gig.budget * 0.08));
  const paid = Math.min(Math.round(profile.money), penalty);
  profile.money = Math.max(0, Math.round(profile.money) - paid);
  if (paid > 0) recordFinance(-paid, `Annulation ${gig.title}`);
  profile.stats.reputation = clamp(profile.stats.reputation - (confirmed ? (dueToday ? 14 : 9) : 3), 0, 100);
  profile.stats.fatigue = clamp(profile.stats.fatigue + (dueToday ? 10 : 4), 0, 100);
  profile.pendingResponses = (profile.pendingResponses || []).filter((pending) => pending.gigId !== gig.id);
  gig.status = 'cancelled';
  gig.responseIn = null;
  gig.responseDay = null;
  gig.lastCancelledDay = profile.day;
  if (dueToday) recordDayActivity('gig', `Cancelle: ${gig.title}`);
  addEmail(
    'Client',
    `Gig annule: ${gig.title}`,
    `Contrat annule. Penalite ${penalty}$${paid < penalty ? `, ${penalty - paid}$ reste impaye dans ta reputation client` : ''}. Reputation et fatigue impactees.`
  );
  addPhoneMessage(
    gig.venue || 'Client',
    'Annulation confirmee',
    dueToday
      ? 'Annulation de derniere minute. Le client va s en souvenir.'
      : 'Contrat retire du calendrier. Tu liberes la date, mais ta fiabilite descend.'
  );
  unlockGigs();
  saveSlots();
  notify(`Gig annule: -${paid}$, reputation penalisee.`);
  if (currentApp === 'social') renderSocial();
  else if (currentApp === 'transport') renderTransport();
  else if (currentApp === 'finance') renderFinance();
  else renderDesktop();
  addWindowControls();
}

function renderJobWindow() {
  const energy = getRemainingEnergy();
  const pay = getJobPay();
  const beforeRaise = 20 - ((profile.jobDays || 0) % 20);
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Jobine</h1>
        <p>Travail alimentaire pour financer ton gear VJ. Une action par quart.</p>
      </div>
      <div class="shop-wallet"><span>Salaire</span><strong>${pay}$</strong></div>
    </div>
    <section class="day-action-window">
      <div class="day-energy-bar">
        <span>Actions restantes</span>
        <strong>${energy} / ${DAILY_ENERGY_MAX}</strong>
        <i><b style="width:${(energy / DAILY_ENERGY_MAX) * 100}%"></b></i>
      </div>
      <div class="gig-card">
        <h3>Aller travailler</h3>
        <p>Tu gagnes ${pay}$, fatigue +15. Ton salaire monte de 10$ apres chaque 20 jours travailles.</p>
        <p>${beforeRaise === 20 ? 'Prochaine augmentation prete au prochain cycle.' : `Encore ${beforeRaise} jour${beforeRaise > 1 ? 's' : ''} avant +10$.`}</p>
        <button class="primary-action" data-action="job" ${energy < 1 ? 'disabled' : ''}>Aller travailler</button>
      </div>
    </section>
  `;
  appWindow.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => handleDayAction(button.dataset.action));
  });
}

function renderRestWindow() {
  const energy = getRemainingEnergy();
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Repos</h1>
        <p>Choisis comment recuperer ou nourrir ton inspiration avant les shows.</p>
      </div>
      <div class="shop-wallet"><span>Fatigue</span><strong>${Math.round(profile.stats.fatigue)}</strong></div>
    </div>
    <section class="day-action-window">
      <div class="day-energy-bar">
        <span>Actions restantes</span>
        <strong>${energy} / ${DAILY_ENERGY_MAX}</strong>
        <i><b style="width:${(energy / DAILY_ENERGY_MAX) * 100}%"></b></i>
      </div>
      <div class="action-grid day-modal-actions">
        ${actionButton('rest-free', 'Repos simple', '1 action | - fatigue, gratuit', energy < 1)}
        ${actionButton('rest-creative', 'Sortie inspiration', '1 action | + creativite, 45$', energy < 1 || profile.money < 45)}
        ${actionButton('rest-premium', 'Repos premium', '1 action | grosse recuperation, 140$', energy < 1 || profile.money < 140)}
      </div>
    </section>
  `;
  appWindow.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => handleDayAction(button.dataset.action));
  });
}

function renderStats() {
  const s = profile.stats;
  const projected = calculateCareerScore(0, currentGig || starterGigs[0]);
  const jobDays = Number(profile.jobDays) || 0;
  const jobProgress = Math.min(100, (jobDays % 20) * 5);
  const daysBeforeRaise = jobDays % 20 === 0 && jobDays > 0 ? 20 : 20 - (jobDays % 20);
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Stats</h1>
        <p>Chaque jauge influence un calcul reel: score, argent, reputation ou opportunites.</p>
      </div>
    </div>
    <div class="stats-grid">
      ${statCard('Creativite', s.creativity, '+ score artistique')}
      ${statCard('Technique', s.technique, 'reduit les erreurs')}
      ${statCard('Fatigue', s.fatigue, 'penalise tout')}
      ${statCard('Reputation', s.reputation, 'debloque gigs et paiement')}
      ${statCard('Style', s.style, 'acces gigs et booking')}
      ${statCard('Reseau', s.network, 'opportunites et invitations')}
      ${statCard('Jobine', jobProgress, `${jobDays} jours travailles. Salaire ${getJobPay()}$ / jour. +10$ dans ${daysBeforeRaise} jours.`)}
      <div class="stat-card">
        <h3>XP / Niveau</h3>
        <p>Niveau ${s.level} - ${s.xp}/${s.level * 100} XP</p>
        <div class="progress"><span style="width:${Math.min(100, (s.xp / (s.level * 100)) * 100)}%"></span></div>
      </div>
      <div class="stat-card">
        <h3>Projection score</h3>
        <div class="score-preview">
          <strong>${Math.round(projected.score)}%</strong>
          ${renderStars(projected.score >= 88 ? 5 : projected.score >= 74 ? 4 : projected.score >= 58 ? 3 : projected.score >= 42 ? 2 : 1, 'resultat estime')}
        </div>
        <div class="score-breakdown">
          <span>Technique <b>40%</b></span>
          <span>Artistique <b>35%</b></span>
          <span>Professionnel <b>25%</b></span>
        </div>
        <p>Le score monte avec un mapping propre, les bons loops, du gear stable et peu de fatigue.</p>
      </div>
      <div class="stat-card">
        <h3>Styles musicaux</h3>
        ${renderStyleLevels()}
      </div>
      <div class="stat-card">
        <h3>Logement</h3>
        <p>${escapeHtml(profile.housing.type)} - loyer ${profile.housing.rent}$</p>
        <p>Récupération au lit : ${window.StudioLife?.sleepRecovery() ?? 7} points de fatigue / heure. Le loyer est traite le 1er du mois.</p>
      </div>
    </div>
  `;
}

function renderInventory() {
  const gearItems = shopItems.filter((item) => item.category === 'gear' && getOwnedGearUnitCount(item.type, item.id.replace(`${item.type}-`, '')) > 0);
  const loops = shopItems.filter((item) => item.category === 'vjloop' && profile.ownedItems.includes(item.id));
  const clothes = shopItems.filter((item) => item.category === 'clothing' && profile.ownedItems.includes(item.id));
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Inventaire</h1><p>Rangement : ${window.StudioStorage?.used() ?? 0} / ${window.StudioStorage?.capacity() ?? 24} places · ${escapeHtml(profile.housing.type)}</p>
        <p>Ton stock reel: gear, fils, adaptateurs, loops et vetements. Les items stackables peuvent etre achetes plusieurs fois.</p>
      </div>
    </div>
    <div class="inventory-summary">
      <span><strong>${gearItems.length}</strong> types gear</span>
      <span><strong>${getTotalOwnedUnits('cable')}</strong> fils</span>
      <span><strong>${getTotalOwnedUnits('adapter')}</strong> adaptateurs</span>
      <span><strong>${loops.length}</strong> packs VJ</span>
      <span><strong>${clothes.length}</strong> vetements</span>
    </div>
    <section class="shop-section">
      <div class="shop-section-head"><div><h2>Gear possede</h2></div><span>${gearItems.length}</span></div>
      <div class="inventory-list">
        ${gearItems.length ? gearItems.map((item) => renderInventoryItem(item)).join('') : '<p>Aucun gear achete encore.</p>'}
      </div>
    </section>
    <section class="shop-section">
      <div class="shop-section-head"><div><h2>VJ loops</h2><button data-owned-clips>Voir mes clips et mes packs achetés</button></div><span>${loops.length}</span></div>
      <div class="inventory-style-grid">
        ${Object.entries(STYLE_CATALOG).map(([style]) => `
          <div class="style-${escapeHtml(style)}">
            ${renderStyleBadge(style)}
            <strong>${countOwnedVjLoopPacks(style)}</strong>
            <span>packs</span>
          </div>
        `).join('')}
      </div>
    </section>
    <section class="shop-section"><h2>Tenue portée · bonus actifs</h2>${renderEquippedWear()||'<p>Tenue de départ, sans bonus acheté.</p>'}</section>
    <section class="shop-section">
      <div class="shop-section-head"><div><h2>Vetements</h2></div><span>${clothes.length}</span></div>
      <div class="inventory-list">
        ${clothes.length ? clothes.map((item) => renderInventoryItem(item)).join('') : '<p>Aucun vetement achete encore.</p>'}
      </div>
    </section>
  `;
  appWindow.querySelectorAll('[data-unwear]').forEach(button=>button.addEventListener('click',()=>unequipWear(button.dataset.unwear)));
  appWindow.querySelectorAll('[data-sell-gear]').forEach((button) => {
    button.addEventListener('click', () => sellGearItem(button.dataset.sellGear));
  });
}

function renderInventoryItem(item) {
  const slug = item.id.replace(`${item.type}-`, '');
  const count = item.category === 'gear' ? getOwnedGearUnitCount(item.type, slug) : profile.inventory[item.id] || 1;
  const equipped = item.category === 'gear' && profile.gear[item.type] === slug;
  const sellCheck = getGearSellCheck(item);
  return `
    <article class="inventory-row" data-item-id="${escapeHtml(item.id)}">
      <div class="product-preview mini product-${escapeHtml(item.type)} product-${escapeHtml(item.id)}" style="${getShopVisualStyle(item)}">
        <span></span>
        <i>${escapeHtml(getProductInitials(item.label))}</i>
      </div>
      <div>
        <strong>${escapeHtml(item.label)}</strong>
        ${renderStars(getItemStars(item), 'qualite item')}
        <span>${escapeHtml(item.type)}${item.stackable ? ` | quantite ${count}` : ''} | ${equipped ? 'Equipped' : 'Owned'}</span>
      </div>
      <div class="inventory-actions">
        <b>${item.category==='gear'?`${item.scoreBonus||0} capacité matérielle`: "Pièce de tenue"}</b>
        ${sellCheck.canSell
          ? `<button class="secondary-action compact" data-sell-gear="${item.id}">Vendre ${getResaleValue(item)}$</button>`
          : sellCheck.reason ? `<small class="inventory-lock">${escapeHtml(sellCheck.reason)}</small>` : ''}
      </div>
    </article>
  `;
}

function getResaleValue(item) {
  return Math.max(1, Math.round((Number(item?.cost) || 0) * 0.7));
}

function getGearSellCheck(item) {
  if(profile.activeRun && item?.category==='gear')return {canSell:false,reason:'Matériel réservé pour la prestation en pause'};
  if (!item || item.category !== 'gear' || item.cost <= 0 || !profile.ownedItems.includes(item.id)) {
    return { canSell: false, reason: '' };
  }
  const slug = item.id.replace(`${item.type}-`, '');
  if (ESSENTIAL_GEAR_TYPES.has(item.type) && getRemainingGearUnitsAfterSale(item.type, slug) < 1) {
    return { canSell: false, reason: 'Garde au moins 1 pour ton setup' };
  }
  return { canSell: true, reason: '' };
}

function getRemainingGearUnitsAfterSale(type, slug) {
  const itemId = `${type}-${slug}`;
  const item = shopItems.find((entry) => entry.id === itemId && entry.category === 'gear');
  const unitMultiplier = getGearUnitMultiplier(slug);
  if (item?.stackable && (profile.inventory?.[itemId] || 0) > 0) {
    return Math.max(0, getTotalOwnedUnits(type) - unitMultiplier);
  }
  return Math.max(0, getTotalOwnedUnits(type) - getOwnedGearUnitCount(type, slug));
}

function sellGearItem(itemId) {
  const item = shopItems.find((entry) => entry.id === itemId && entry.category === 'gear');
  if (!item || !profile.ownedItems.includes(item.id)) return;
  const sellCheck = getGearSellCheck(item);
  if (!sellCheck.canSell) {
    notify(sellCheck.reason || 'Cet item ne peut pas etre vendu.');
    return;
  }
  const slug = item.id.replace(`${item.type}-`, '');
  const value = getResaleValue(item);
  profile.money += value;
  if (item.stackable && (profile.inventory?.[item.id] || 0) > 1) {
    profile.inventory[item.id] -= 1;
  } else {
    profile.ownedItems = profile.ownedItems.filter((id) => id !== item.id);
    if (profile.inventory?.[item.id]) delete profile.inventory[item.id];
  }
  if (profile.gear[item.type] === slug) {
    profile.gear[item.type] = getBestRemainingGearSlug(item.type) || defaultGear[item.type]?.slug || 'none';
  }
  recordFinance(value, `Revente ${item.label}`);
  saveSlots();
  notify(`${item.label} vendu: +${value}$.`);
  renderInventory();
  addWindowControls();
}

function getTotalOwnedUnits(type) {
  return shopItems
    .filter((item) => item.category === 'gear' && item.type === type)
    .reduce((sum, item) => sum + getOwnedGearUnitCount(type, item.id.replace(`${type}-`, '')), 0);
}

function getBestRemainingGearSlug(type) {
  const candidates = shopItems
    .filter((item) => item.category === 'gear' && item.type === type)
    .filter((item) => getOwnedGearUnitCount(type, item.id.replace(`${type}-`, '')) > 0)
    .sort((a, b) => (b.scoreBonus || 0) - (a.scoreBonus || 0) || (b.cost || 0) - (a.cost || 0));
  return candidates[0]?.id.replace(`${type}-`, '') || null;
}

function renderStyleLevels() {
  return Object.entries(profile.styleXp).map(([style, xp]) => {
    const level = Math.min(10, Math.floor(xp / 10));
    const packs = countOwnedVjLoopPacks(style);
    return `
      <p>${renderStyleBadge(style)} niveau ${level}/10 | ${packs} pack${packs > 1 ? 's' : ''}</p>
      <div class="progress"><span style="width:${level * 10}%"></span></div>
    `;
  }).join('');
}

function renderHousing() {
  const items = shopItems.filter(item => item.category === 'housing');
  appWindow.innerHTML = `<div class="app-heading"><div><h1>Locaux</h1><p>Un espace pour vivre, créer et ranger ton matériel.</p></div><div class="shop-wallet"><span>Disponible</span><strong>${profile.godMode ? '∞' : profile.money + '$'}</strong></div></div>
    <div class="housing-current"><div><span>Ton lieu actuel</span><strong>${escapeHtml(profile.housing.type)}</strong></div><div><span>Loyer mensuel</span><strong>${profile.housing.rent}$</strong></div><div><span>Rangement utilisé</span><strong>${window.StudioStorage?.used() ?? 0} / ${window.StudioStorage?.capacity() ?? 24}</strong></div></div>
    <p>Le loyer est prélevé le 1er du mois dans Banque. Tes objets et ta progression restent avec toi. Les frais d’installation sont payés une seule fois par lieu.</p>
    <div class="shop-grid">${items.map(item => {
      const current = profile.housing.type === item.label;
      const owned = profile.ownedItems.includes(item.id);
      const cost = owned ? 0 : item.cost;
      const level = getItemUnlockLevel(item);
      const locked = !profile.godMode && !owned && profile.stats.level < level;
      const issue = window.StudioStorage?.check(item);
      const insufficient = !profile.godMode && profile.money < cost;
      return `<article class="shop-card"><div class="shop-card-body"><h2>${escapeHtml(item.label)}</h2><p>${escapeHtml(window.StudioLayouts?.describe(item.id)||item.description)}</p><p><strong>${item.rent}$ / mois</strong> · ${window.StudioStorage?.capacity(item.label) ?? 24} places</p><p>Sommeil : −${window.StudioLife?.sleepRecovery(item) ?? 7} fatigue / heure</p><p>Installation : ${cost}$${owned ? ' · déjà débloqué' : ''}</p>${issue ? `<p>${escapeHtml(issue)}</p>` : ''}</div><div class="row-actions"><button data-home-preview="${item.id}">Visiter en 3D</button><button class="primary-action" data-home-move="${item.id}" ${current || locked || issue || insufficient ? 'disabled' : ''}>${current ? 'Lieu actuel' : locked ? 'Niveau ' + level + ' requis' : insufficient ? 'Budget insuffisant' : 'Choisir ce lieu'}</button></div></article>`;
    }).join('')}</div>`;
  appWindow.querySelectorAll('[data-home-preview]').forEach(button => button.onclick = () => StudioWorld.visitHome(button.dataset.homePreview));
  appWindow.querySelectorAll('[data-home-move]').forEach(button => button.onclick = () => {
    const item = items.find(entry => entry.id === button.dataset.homeMove);
    if (!item || profile.housing.type === item.label) return;
    const issue = window.StudioStorage?.check(item);
    if (issue) { notify(issue); return; }
    const owned = profile.ownedItems.includes(item.id);
    if (!profile.godMode && ((!owned && profile.stats.level < getItemUnlockLevel(item)) || profile.money < (owned ? 0 : item.cost))) return;
    if (!owned) {
      if (!profile.godMode) { profile.money -= item.cost; recordFinance(-item.cost, `Installation · ${item.label}`, {counterparty:'Agence des locaux'}); }
      profile.ownedItems.push(item.id);
    }
    profile.housing = {type:item.label, rent:item.rent, comfort:item.comfort};
    profile.location = item.label;
    saveSlots(); updateProfileChrome(); renderHousing();
    notify(`Tu t’installes dans ${item.label}. Ton matériel est conservé.`);
  });
  addWindowControls();
}

function statCard(label, value, detail) {
  return `
    <div class="stat-card">
      <h3>${label}</h3>
      <p>${Math.round(value)}/100 - ${detail}</p>
      <div class="progress"><span style="width:${clamp(value, 0, 100)}%"></span></div>
    </div>
  `;
}

function renderSkills() {
  appWindow.innerHTML=`<div class="app-heading"><div><h1>Apprendre un geste</h1><p>Ateliers gratuits : réussis le geste pour gagner un niveau. Aucun achat, aucune énergie quotidienne.</p></div></div><div class="shop-grid">${skillCatalog.map(skill=>`<article class="shop-card"><div class="shop-card-body"><h2>${escapeHtml(skill.label)}</h2><p>${escapeHtml(skill.description)}</p><p>Niveau ${profile.skills[skill.id]||0} / 3</p><button data-workshop="${skill.id}" ${(profile.skills[skill.id]||0)>=3?'disabled':''}>${(profile.skills[skill.id]||0)>=3?'Maîtrisé':'Ouvrir l’atelier'}</button></div></article>`).join('')}</div>`;
  appWindow.querySelectorAll('[data-workshop]').forEach(b=>b.onclick=()=>SkillWorkshop.open(b.dataset.workshop));
}
function renderSkillsLegacy() {
  appWindow.innerHTML = `
    <div class="app-heading">
      <div>
        <h1>Competences</h1>
        <p>Chaque nouvelle difficulte doit etre apprise. Les skills ont 3 niveaux et debloquent les gigs plus exigeants.</p>
      </div>
      <div class="shop-wallet"><span>Budget</span><strong>${profile.money}$</strong></div>
    </div>
    <div class="shop-grid">
      ${skillCatalog.map((skill) => renderSkillCard(skill)).join('')}
    </div>
  `;
  appWindow.querySelectorAll('[data-learn-skill]').forEach((button) => {
    button.addEventListener('click', () => learnSkill(button.dataset.learnSkill));
  });
  appWindow.querySelectorAll('[data-practice-skill]').forEach((button) => {
    button.addEventListener('click', () => practiceSkill(button.dataset.practiceSkill));
  });
}

function renderSkillCard(skill) {
  const level = profile.skills?.[skill.id] || 0;
  const nextCost = skill.costs[level] ?? null;
  const practice = profile.skillPractice?.[skill.id] || 0;
  const practiceTarget = getSkillPracticeTarget(level);
  return `
    <article class="shop-card">
      <div class="shop-card-body">
        <h3>${escapeHtml(skill.label)}</h3>
        <p>${escapeHtml(skill.description)}</p>
      </div>
      <div class="progress"><span style="width:${level * 33.33}%"></span></div>
      <div class="shop-tags">
        <span>Niveau ${level}/3</span>
        ${level < 3 ? `<span>Pratique ${practice}/${practiceTarget}</span>` : ''}
        ${nextCost !== null ? `<span>Prochain ${nextCost}$</span>` : '<span>Max</span>'}
      </div>
      <button class="primary-action" data-learn-skill="${skill.id}" ${nextCost === null || profile.money < nextCost ? 'disabled' : ''}>
        ${nextCost === null ? 'Maitrise' : nextCost === 0 ? 'Apprendre gratuit' : `Apprendre ${nextCost}$`}
      </button>
      <button class="secondary-action" data-practice-skill="${skill.id}" ${level >= 3 || getRemainingEnergy() < 1 ? 'disabled' : ''}>
        Pratique gratuite
      </button>
    </article>
  `;
}

function practiceSkill(skillId) {
  if(window.SkillWorkshop){SkillWorkshop.open(skillId);return;}
  const skill = skillCatalog.find((entry) => entry.id === skillId);
  if (!skill) return;
  const dueGig = getDueGig();
  if (!fromWorld && dueGig) {
    notify(`Impossible de pratiquer aujourd'hui: ${dueGig.title} est a faire ou a canceler.`);
    return;
  }
  const level = profile.skills[skillId] || 0;
  if (level >= 3) return;
  if (!spendEnergy('practice', 1)) return;
  profile.skillPractice[skillId] = (profile.skillPractice[skillId] || 0) + 1;
  profile.stats.technique = clamp(profile.stats.technique + 1, 0, 100);
  profile.stats.creativity = clamp(profile.stats.creativity + 1, 0, 100);
  profile.stats.fatigue = clamp(profile.stats.fatigue + 4, 0, 100);
  addXp(8);
  recordDayActivity('practice', `Pratique: ${skill.label}`);
  notify(`Pratique gratuite: ${skill.label} progresse lentement.`);
  saveSlots();
  renderDesktop();
}

function learnSkill(skillId) {
  if(window.SkillWorkshop){SkillWorkshop.open(skillId);return;}
  const skill = skillCatalog.find((entry) => entry.id === skillId);
  if (!skill) return;
  const dueGig = getDueGig();
  if (!fromWorld && dueGig) {
    notify(`Impossible d'apprendre aujourd'hui: ${dueGig.title} est a faire ou a canceler.`);
    return;
  }
  if (getRemainingEnergy() < ACTION_ENERGY_COST.skill) {
    notify(`Pas assez d'energie pour apprendre une competence (${ACTION_ENERGY_COST.skill}).`);
    return;
  }
  const level = profile.skills[skillId] || 0;
  const cost = skill.costs[level];
  if (cost === undefined || profile.money < cost) return;
  if (!spendEnergy('skill')) return;
  profile.money -= cost;
  recordFinance(-cost, `Formation VJ · ${skill.label}`);
  profile.skills[skillId] = level + 1;
  profile.stats.technique = clamp(profile.stats.technique + 2, 0, 100);
  notify(`${skill.label} niveau ${level + 1} appris.`);
  recordDayActivity('skill', `Appris: ${skill.label} niv. ${level + 1}`);
  unlockGigs();
  saveSlots();
  renderDesktop();
}

function getSkillPracticeTarget(level) {
  return [2, 3, 4][level] || 4;
}

function rewardSkillPracticeFromGig(gig, score, minScore) {
  if(window.SessionRules && liveShow)return SessionRules.reward(gig);
  if (score < minScore || !gig?.requiredSkills) return [];
  const gained = [];
  Object.keys(gig.requiredSkills).forEach((skillId) => {
    const level = profile.skills?.[skillId] || 0;
    if (level >= 3) return;
    profile.skillPractice[skillId] = (profile.skillPractice[skillId] || 0) + 1;
    const target = getSkillPracticeTarget(level);
    if (profile.skillPractice[skillId] >= target) {
      profile.skillPractice[skillId] = 0;
      profile.skills[skillId] = level + 1;
      const skill = skillCatalog.find((entry) => entry.id === skillId);
      gained.push(`${skill?.label || skillId} niv. ${level + 1}`);
    }
  });
  return gained;
}

function renderShop() {
  const categories = {
    gear: {
      title: 'Gear',
      description: '',
      cta: 'Entrer gear',
      icon: 'projector',
    },
    vjloop: {
      title: 'VJ Loop',
      description: '',
      cta: 'Voir loops',
      icon: 'clip',
    },
    clothing: {
      title: 'Vetements',
      description: '',
      cta: 'Ouvrir perso 3D',
      icon: 'clothing',
    },
  };
  const activeCategory = categories[shopView];
  document.body.classList.toggle('shop-closet', shopView === 'clothing');
  if (shopView === 'clothing') {
    setPlayerPose('look');
    focusCreatorCamera();
    applyAppearanceToPlayer();
  } else {
    clothingPreview = null;
    applyAppearanceToPlayer();
    setPlayerPose('room');
    focusRoomCamera();
  }
  updateSceneContextVisibility();
  if (shopDetailItemId) {
    const detailItem = shopItems.find((item) => item.id === shopDetailItemId);
    if (detailItem) {
      renderShopDetail(detailItem);
      return;
    }
    shopDetailItemId = null;
  }
  if (!activeCategory) {
    appWindow.innerHTML = `
      ${renderAtazoneHeader('Tous les departements', 'Choisis un departement comme dans un vrai site d achat.')}
      <section class="shop-marketing-hero">
        <div class="shop-marketing-copy">
          <span>VJ MARKET PRO</span>
          <h2>Equipe ta carriere comme un vrai artiste de scene.</h2>
          <p>Achète du gear, ameliore ton espace de creation et developpe un look reconnaissable. Chaque item change tes stats avec un avantage et un compromis.</p>
          <div class="shop-marketing-actions">
            <button class="primary-action" type="button" data-shop-view="gear">Voir le gear</button>
            <button class="secondary-action" type="button" data-shop-view="vjloop">VJ Loop</button>
            <button class="secondary-action" type="button" data-shop-view="clothing">Cabine vêtements</button>
          </div>
        </div>
        <div class="shop-showcase" aria-hidden="true">
          <span class="showcase-light"></span>
          <span class="showcase-projector"></span>
          <span class="showcase-laptop"></span>
          <span class="showcase-jacket"></span>
        </div>
      </section>
      <div class="shop-market-stats">
        <span><strong>${shopItems.filter((item) => item.category !== 'housing').length}</strong> articles shop</span>
        <span><strong>${shopItems.filter((item) => (item.category || 'gear') === 'gear').length}</strong> gear</span>
        <span><strong>${shopItems.filter((item) => (item.category || 'gear') === 'vjloop').length}</strong> VJ loops</span>
        <span><strong>${shopItems.filter((item) => (item.category || 'gear') === 'clothing').length}</strong> vêtements</span>
      </div>
      <div class="shop-portals premium-portals">
        ${Object.entries(categories).map(([category, data]) => `
          <button class="shop-portal shop-portal-${escapeHtml(data.icon)}" type="button" data-shop-view="${category}">
            <span class="shop-portal-art product-${escapeHtml(data.icon)}"><i></i></span>
            <span class="shop-portal-content">
              <em>${shopItems.filter((item) => (item.category || 'gear') === category).length} articles</em>
              <strong>${escapeHtml(data.title)}</strong>
              <small>${escapeHtml(data.description)}</small>
              <b>${escapeHtml(data.cta)}</b>
            </span>
          </button>
        `).join('')}
      </div>
    `;
    appWindow.querySelectorAll('[data-shop-view]').forEach((button) => {
      button.addEventListener('click', () => {
        shopDetailItemId = null;
        shopView = button.dataset.shopView;
        if (shopView !== 'gear') shopGearFilter = 'all';
        if (shopView !== 'vjloop') shopLoopFilter = 'all';
        renderDesktop();
      });
    });
    appWindow.scrollTop = 0;
    return;
  }
  const items = shopItems.filter((item) => (item.category || 'gear') === shopView && !(shopView==='clothing'&&window.StudioWardrobe?.ownedMode&&!profile.ownedItems.includes(item.id)));
  appWindow.innerHTML = `
    ${shopView==='clothing'&&window.StudioWardrobe?.ownedMode?'<div class="app-heading"><h1>Ma garde-robe</h1><button data-closet-store>Aller au magasin</button></div>':renderAtazoneHeader(activeCategory.title, activeCategory.description, true)}
    ${shopView === 'clothing' ? `
      <div class="closet-store-panel">
        <div class="closet-note">
          <strong>${window.StudioWardrobe?.ownedMode?'Ton miroir · tenue portée':'Magasin · essayage 3D'}</strong>
          <span>Choisis un article à droite pour le voir sur ton personnage. « Porter » conserve ton choix.</span>
        </div>
        <div class="clothing-store-list">
          ${items.length?items.map((item) => renderClothingStoreItem(item)).join(''):'<p>Ta tenue de départ est visible dans le miroir. Tes achats apparaîtront ici.</p>'}
        </div>
      </div>
    ` : `
      <div class="shop-hero">
      <div class="shop-hero-copy">
        <h2>Equipe ton VJ comme un vrai pro</h2>
        <p>Compare les objets, achete progressivement et construis une carriere plus credible pour les gigs premium.</p>
      </div>
      <div class="shop-hero-stage" aria-hidden="true">
        <span class="hero-projector"></span>
        <span class="hero-laptop"></span>
        <span class="hero-case"></span>
      </div>
    </div>`}
    ${shopView === 'clothing' ? '' : `<div class="shop-sections">
      ${shopView === 'gear' ? renderGearShopSections(items) : shopView === 'vjloop' ? renderVjLoopShopSections(items) : `<section class="shop-section">
        <div class="shop-section-head">
          <div>
            <h2>${escapeHtml(activeCategory.title)}</h2>
          </div>
          <span>${items.length} items</span>
        </div>
        <div class="shop-grid">
          ${items.map((item) => renderShopItem(item)).join('')}
        </div>
      </section>`}
    </div>`}
  `;
  appWindow.querySelector('[data-shop-back]')?.addEventListener('click', () => {
    shopView = 'home';
    shopGearFilter = 'all';
    shopLoopFilter = 'all';
    shopDetailItemId = null;
    renderDesktop();
  });
  appWindow.querySelectorAll('[data-shop-view]').forEach((button) => {
    button.addEventListener('click', () => {
      shopDetailItemId = null;
      shopView = button.dataset.shopView;
      if (shopView !== 'gear') shopGearFilter = 'all';
      if (shopView !== 'vjloop') shopLoopFilter = 'all';
      renderDesktop();
    });
  });
  appWindow.querySelectorAll('[data-gear-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      shopGearFilter = button.dataset.gearFilter;
      renderDesktop();
    });
  });
  appWindow.querySelectorAll('[data-loop-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      shopLoopFilter = button.dataset.loopFilter;
      renderDesktop();
    });
  });
  appWindow.querySelectorAll('[data-detail]').forEach((element) => {
    element.addEventListener('click', (event) => {
      if (event.target.closest('button, select, input, a')) return;
      shopDetailItemId = element.dataset.detail;
      renderDesktop();
    });
  });
  appWindow.querySelectorAll('[data-open-detail]').forEach((button) => {
    button.addEventListener('click', () => {
      shopDetailItemId = button.dataset.openDetail;
      renderDesktop();
    });
  });
  appWindow.querySelectorAll('[data-buy]').forEach((button) => {
    button.addEventListener('click', () => buyItem(button.dataset.buy));
  });
  appWindow.querySelectorAll('[data-wear]').forEach((button) => {
    button.addEventListener('click', () => wearClothingItem(button.dataset.wear));
  });
  appWindow.querySelectorAll('[data-preview]').forEach((button) => {
    button.addEventListener('click', () => previewClothingItem(button.dataset.preview));
  });
  appWindow.scrollTop = 0;
}

function renderAtazoneHeader(title, subtitle = '', showBack = false) {
  return `
    <div class="atazone-bar">
      <div class="atazone-brand">
        <strong>Atazone</strong>
        <span>VJ gear market</span>
      </div>
      <div class="atazone-search" aria-label="Recherche Atazone">
        <button type="button" data-shop-view="gear">Gear</button>
        <span>${escapeHtml(title)}</span>
        <i>Recherche dans ${escapeHtml(title)}</i>
      </div>
      <div class="atazone-wallet">
        <span>Budget</span>
        <strong>${profile.money}$</strong>
      </div>
      ${showBack ? '<button class="secondary-action atazone-back" type="button" data-shop-back>Retour</button>' : ''}
    </div>
    <div class="atazone-subnav">
      <button type="button" data-shop-view="gear" ${shopView === 'gear' ? 'class="selected"' : ''}>Gear</button>
      <button type="button" data-shop-view="vjloop" ${shopView === 'vjloop' ? 'class="selected"' : ''}>VJ Loop</button>
      <button type="button" data-shop-view="clothing" ${shopView === 'clothing' ? 'class="selected"' : ''}>Vetements</button>
    </div>
  `;
}

function renderGearShopSections(items) {
  const groups = [
    ['projector', 'Projecteurs'],
    ['computer', 'Ordinateurs'],
    ['gpu', 'Cartes graphiques'],
    ['cable', 'Fils video'],
    ['adapter', 'Adaptateurs'],
    ['router', 'Boites multi-projecteur'],
    ['console', 'Consoles VJ'],
    ['screen', 'Ecrans de controle'],
    ['bag', 'Sacs et transport'],
    ['accessory', 'Accessoires scene'],
  ];
  const buttons = `
    <div class="gear-filter-bar" aria-label="Rayons gear">
      <button type="button" data-gear-filter="all" ${shopGearFilter === 'all' ? 'class="selected"' : ''}>Tous</button>
      ${groups.map(([type, title]) => `
        <button type="button" data-gear-filter="${type}" ${shopGearFilter === type ? 'class="selected"' : ''}>${escapeHtml(title)}</button>
      `).join('')}
    </div>
  `;
  const selectedGroups = shopGearFilter === 'all' ? groups : groups.filter(([type]) => type === shopGearFilter);
  return buttons + selectedGroups.map(([type, title]) => {
    const groupItems = items.filter((item) => item.type === type);
    if (!groupItems.length) return '';
    return `
      <section class="shop-section">
        <div class="shop-section-head">
          <div>
            <h2>${escapeHtml(title)}</h2>
          </div>
          <span>${groupItems.length} items</span>
        </div>
        <div class="shop-grid">
          ${groupItems.map((item) => renderShopItem(item)).join('')}
        </div>
      </section>
    `;
  }).join('');
}

function renderVjLoopShopSections(items) {
  const buttons = `
    <div class="gear-filter-bar loop-filter-bar" aria-label="Styles de VJ loops">
      <button type="button" data-loop-filter="all" ${shopLoopFilter === 'all' ? 'class="selected"' : ''}>Tous</button>
      ${Object.entries(STYLE_CATALOG).map(([style, meta]) => `
        <button class="style-${escapeHtml(style)}" type="button" data-loop-filter="${escapeHtml(style)}" ${shopLoopFilter === style ? 'class="selected"' : ''}>${escapeHtml(meta.label)}</button>
      `).join('')}
    </div>
  `;
  const styles = shopLoopFilter === 'all'
    ? Object.entries(STYLE_CATALOG)
    : Object.entries(STYLE_CATALOG).filter(([style]) => style === shopLoopFilter);
  return buttons + styles.map(([style, meta]) => {
    const groupItems = items.filter((item) => item.styleTarget === style);
    if (!groupItems.length) return '';
    return `
      <section class="shop-section loop-style-section style-${escapeHtml(style)}">
        <div class="shop-section-head">
          <div>
            <h2>${escapeHtml(meta.label)}</h2>
          </div>
          <span>${groupItems.length} packs</span>
        </div>
        <div class="shop-grid">
          ${groupItems.map((item) => renderShopItem(item)).join('')}
        </div>
      </section>
    `;
  }).join('');
}

function renderGigRequirementLine(gig) {
  const count = getGigProjectorCount(gig);
  const specific = getGigSpecificRequirements(gig);
  const requiredStars = Math.max(
    getGearStarsBySlug('computer', specific.computer),
    getGearStarsBySlug('projector', specific.projector),
    getGearStarsBySlug('cable', specific.cable),
    getGearStarsBySlug('bag', specific.bag)
  );
  const details = [
    `Gig ${gig.number || '?'}: ${gig.newDifficulty || gig.type}`,
    `niveau gear ${requiredStars}/5`,
    `${gig.zoneLabel || '1 rectangle'}`,
    `contrainte: ${gig.constraints || 'standard'}`,
    `gear: ${gig.gearText || 'setup VJ'}`,
    `location: ${gig.rentalRule || (gig.allowRent === false ? 'non' : 'oui')}`,
    `skills: ${gig.skillText || 'aucune'}`,
    `timer: ${gig.timerLabel || 'non'}`,
    `reputation ${gig.minRep}+`,
    `${count} projo${count > 1 ? 's' : ''}`,
    `${specific.vjloop} pack${specific.vjloop > 1 ? 's' : ''} ${gig.style}`,
    `objectif ${getGigMinimumScore(gig)} pts`,
  ];
  if (specific.router) details.push('boite multi-projo');
  if (specific.adapter) details.push('adaptateurs video');
  if (specific.console) details.push('console VJ');
  if (specific.screen) details.push('ecran controle');
  if (getGigMaskRequirement(gig) > 0) details.push(`plume ${getGigMaskRequirement(gig)} pts`);
  if (gig.lockedDepth) details.push('profondeur projo bloquee');
  if (specific.accessory) details.push('kit mapping recommande');
  return escapeHtml(details.join(' | '));
}

function renderShopDetail(item) {
  const owned = profile.ownedItems.includes(item.id);
  const equipped = item.category === 'gear' && profile.gear[item.type] === item.id.replace(`${item.type}-`, '');
  const count = profile.inventory?.[item.id] || (owned ? 1 : 0);
  const unlockLevel = getItemUnlockLevel(item);
  const lockedByLevel = !profile.godMode && !owned && (profile.stats.level || 1) < unlockLevel;
  const canBuy = !lockedByLevel && (profile.godMode || profile.money >= item.cost) && (!owned || item.stackable);
  const visualStyle = getShopVisualStyle(item);
  appWindow.innerHTML = `
    ${renderAtazoneHeader(item.label, 'Fiche article detaillee', true)}
    <section class="product-detail-page">
      <div class="product-detail-visual product-${escapeHtml(item.type)} product-${escapeHtml(item.id)}" style="${visualStyle}">
        <span></span>
        <i>${escapeHtml(getProductInitials(item.label))}</i>
      </div>
      <div class="product-detail-info">
        <span class="product-kicker">Atazone verified</span>
        <h2>${escapeHtml(item.label)}</h2>
        ${item.styleTarget ? renderStyleBadge(item.styleTarget) : ''}
        ${renderStars(getItemStars(item), 'qualite generale')}
        <p>${escapeHtml(item.description)}</p><p class="gear-capability">${escapeHtml(GearCapabilities.describe(item))}</p><small class="effect-scope">${escapeHtml(item.effectScope||'')}</small>
        <div class="product-detail-price">
          <strong>${item.cost}$</strong>
          <span>${owned ? (equipped ? 'Equipped' : `Owned${item.stackable ? ` x${count}` : ''}`) : lockedByLevel ? `Niveau ${unlockLevel} requis` : 'Disponible'}</span>
        </div>
        <div class="product-detail-grid">
          <div>
            <b>Avantages</b>
            ${(item.advantages || ['Progression VJ']).map((effect) => `<em>${escapeHtml(effect)}</em>`).join('')}
          </div>
          <div>
            <b>Compromis</b>
            ${(item.disadvantages || ['Aucun compromis majeur']).map((effect) => `<em>${escapeHtml(effect)}</em>`).join('')}
          </div>
          <div>
            <b>Stats</b>
            ${Object.entries(item.stats || {}).length ? Object.entries(item.stats || {}).map(([key, value]) => `<em>${escapeHtml(key)} ${value >= 0 ? '+' : ''}${value}</em>`).join('') : '<em>Qualite materiel</em>'}
          </div>
          <div>
            <b>Progression</b>
            <em>Palier ${unlockLevel}</em>
            <em>${item.category === 'gear' ? 'Revendable a 70%' : 'Collection permanent'}</em>
          </div>
        </div>
        <div class="row-actions product-detail-actions">
          <button class="secondary-action" type="button" data-detail-back>Retour liste</button>
          ${item.category === 'clothing' ? `<button class="secondary-action" type="button" data-preview="${item.id}">Essayer</button>` : ''}
          ${owned && item.category === 'clothing' ? `<button class="primary-action" type="button" data-wear="${item.id}">Porter</button>` : `<button class="primary-action" type="button" data-buy="${item.id}" ${canBuy ? '' : 'disabled'}>${lockedByLevel ? `Niveau ${unlockLevel}` : owned && !item.stackable ? 'Owned' : 'Acheter'}</button>`}
        </div>
      </div>
    </section>
  `;
  appWindow.querySelector('[data-shop-back]')?.addEventListener('click', () => {
    shopDetailItemId = null;
    renderDesktop();
  });
  appWindow.querySelectorAll('[data-shop-view]').forEach((button) => {
    button.addEventListener('click', () => {
      shopDetailItemId = null;
      shopView = button.dataset.shopView;
      if (shopView !== 'gear') shopGearFilter = 'all';
      if (shopView !== 'vjloop') shopLoopFilter = 'all';
      renderDesktop();
    });
  });
  appWindow.querySelector('[data-detail-back]')?.addEventListener('click', () => {
    shopDetailItemId = null;
    renderDesktop();
  });
  appWindow.querySelectorAll('[data-buy]').forEach((button) => {
    button.addEventListener('click', () => buyItem(button.dataset.buy));
  });
  appWindow.querySelectorAll('[data-wear]').forEach((button) => {
    button.addEventListener('click', () => wearClothingItem(button.dataset.wear));
  });
  appWindow.querySelectorAll('[data-preview]').forEach((button) => {
    button.addEventListener('click', () => previewClothingItem(button.dataset.preview));
  });
  appWindow.scrollTop = 0;
}

function getGearStarsBySlug(type, slug) {
  if (!slug || slug === 'none') return 0;
  const item = shopItems.find((entry) => entry.id === `${type}-${slug}`);
  return item ? getItemStars(item) : 0;
}

function renderClothingStoreItem(item) {
  const owned = profile.ownedItems.includes(item.id);
  const tagList = (item.tags || []).slice(0, 2);
  const visualStyle = getShopVisualStyle(item);
  return `
    <article class="clothing-list-item" data-detail="${escapeHtml(item.id)}">
      <div class="clothing-list-thumb product-${escapeHtml(item.type)} product-${escapeHtml(item.id)}" style="${visualStyle}">
        <span></span>
        <i>${escapeHtml(getProductInitials(item.label))}</i>
      </div>
      <div class="clothing-list-copy">
        <strong>${escapeHtml(item.label)}</strong>
        ${renderStars(getItemStars(item), 'qualite item')}
        <span>${escapeHtml(item.description)}</span>
        <small>${tagList.map((tag) => escapeHtml(tag)).join(' | ')}</small>
      </div>
      <div class="clothing-list-buy">
        <b>${item.cost}$</b>
        <button class="secondary-action" data-open-detail="${item.id}">Fiche</button>
        <button class="secondary-action" data-preview="${item.id}">Essayer</button>
        ${owned ? `<button class="primary-action" data-wear="${item.id}">Porter</button>` : `<button class="primary-action" data-buy="${item.id}">Acheter</button>`}
      </div>
    </article>
  `;
}

function renderShopItem(item) {
  if(item.category==='housing'&&window.StudioStorage&&!item.description.includes('places de rangement'))item.description+=` · ${StudioStorage.capacity(item.label)} places de rangement.`;
  const owned = profile.ownedItems.includes(item.id) ||
    profile.gear[item.type] === item.id.replace(`${item.type}-`, '') ||
    (item.type === 'housing' && profile.housing.type.toLowerCase() === item.label.toLowerCase());
  const count = profile.inventory?.[item.id] || (owned ? 1 : 0);
  const lockedByOwned = owned && !item.stackable;
  const equipped = item.category === 'gear' && profile.gear[item.type] === item.id.replace(`${item.type}-`, '');
  const unlockLevel = getItemUnlockLevel(item);
  const lockedByLevel = !owned && (profile.stats.level || 1) < unlockLevel;
  const ownedLabel = lockedByLevel
    ? `Niveau ${unlockLevel} requis`
    : equipped ? 'Equipped' : owned ? 'Already owned' : profile.money >= item.cost ? 'Available' : 'Budget trop bas';
  const tagList = (item.tags || []).slice(0, 3);
  const visualStyle = getShopVisualStyle(item);
  return `
    <article class="shop-card rarity-${escapeHtml(item.rarity || 'starter')}${item.styleTarget ? ` style-${escapeHtml(item.styleTarget)}` : ''}" data-detail="${escapeHtml(item.id)}">
      <div class="product-preview product-${escapeHtml(item.type)} product-${escapeHtml(item.id)}" style="${visualStyle}">
        <span></span>
        <i>${escapeHtml(getProductInitials(item.label))}</i>
      </div>
      <div class="shop-card-body">
        <h3>${escapeHtml(item.label)}</h3>
        ${item.styleTarget ? renderStyleBadge(item.styleTarget) : ''}
        ${renderStars(getItemStars(item), 'qualite item')}
        <p>${escapeHtml(item.description)}</p>
      </div>
      <div class="shop-tags">
        <span>Palier ${unlockLevel}</span>
        ${tagList.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
      </div>
      <div class="shop-balance">
        <div>
          <strong>Avantage</strong>
          ${(item.advantages || []).slice(0, 3).map((effect) => `<span>${escapeHtml(effect)}</span>`).join('')}
        </div>
        <div>
          <strong>Compromis</strong>
          ${(item.disadvantages || []).slice(0, 3).map((effect) => `<span>${escapeHtml(effect)}</span>`).join('')}
        </div>
      </div>
      <div class="shop-buy-row">
        <strong>${item.cost}$</strong>
        <small>${ownedLabel}${item.stackable && owned ? ` x${count}` : ''}</small>
      </div>
      <div class="row-actions">
        <button class="secondary-action" data-open-detail="${item.id}">Fiche</button>
        <button class="primary-action" data-buy="${item.id}" ${lockedByOwned || lockedByLevel ? 'disabled' : ''}>${lockedByLevel ? `Niveau ${unlockLevel}` : lockedByOwned ? (equipped ? 'Equipped' : 'Owned') : item.stackable && owned ? 'Acheter +' : 'Acheter'}</button>
      </div>
    </article>
  `;
}

function getItemUnlockLevel(item) {
  const stars = getItemStars(item);
  if (item.category === 'gear') return [1, 2, 4, 6, 8][stars - 1] || 1;
  if (item.category === 'vjloop') return clamp(stars, 1, 8);
  if (item.category === 'clothing') return clamp(stars, 1, 6);
  if (item.category === 'housing') return clamp(stars + 1, 1, 8);
  return 1;
}

function getProductInitials(label) {
  return String(label)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function getItemStars(item) {
  if (Number(item?.qualityStars)) return clamp(Number(item.qualityStars), 1, 5);
  const cost = Number(item?.cost) || 0;
  const bonus = Number(item?.scoreBonus || item?.stats?.style || item?.stats?.creativity || 0);
  if (cost >= 1600 || bonus >= 14 || item?.rarity === 'pro') return 5;
  if (cost >= 900 || bonus >= 9 || item?.rarity === 'rare') return 4;
  if (cost >= 360 || bonus >= 5 || item?.rarity === 'standard') return 3;
  if (cost >= 120 || bonus >= 2) return 2;
  return 1;
}

function renderStars(count, label = 'etoiles') {
  const value = clamp(Number(count) || 1, 1, 5);
  return `
    <span class="star-rating" title="${value}/5 ${escapeHtml(label)}" aria-label="${value} sur 5 ${escapeHtml(label)}">
      ${Array.from({ length: 5 }, (_, index) => `<i class="${index < value ? 'filled' : 'empty'}">&#9733;</i>`).join('')}
      <b>${value}/5</b>
    </span>
  `;
}

function getShopVisualStyle(item) {
  const seed = [...item.id].reduce((total, char) => total + char.charCodeAt(0), 0);
  const hue = seed % 360;
  const hue2 = (hue + 72 + (item.cost % 97)) % 360;
  const hue3 = (hue + 184) % 360;
  const tilt = (seed % 18) - 9;
  return `--product-hue:${hue};--product-hue-2:${hue2};--product-hue-3:${hue3};--product-tilt:${tilt}deg`;
}

function buyItem(itemId) {
  const item = shopItems.find((entry) => entry.id === itemId);
  if (!item || (profile.ownedItems.includes(item.id) && !item.stackable)) return;
  if(profile.activeRun && ['gear','clothing'].includes(item.category)){notify('Ton setup est réservé au contrat en pause. Termine-le avant de modifier l’équipement.');return;}
  const storageIssue=window.StudioStorage?.check(item);if(storageIssue){notify(storageIssue);return;}
  const unlockLevel = getItemUnlockLevel(item);
  if (!profile.godMode && (profile.stats.level || 1) < unlockLevel) {
    notify(`Palier verrouille: ${item.label} demande le niveau ${unlockLevel}.`);
    return;
  }
  if (!profile.godMode && profile.money < item.cost) {
    notify('Pas assez d argent.');
    return;
  }
  if (!profile.godMode) {
    profile.money -= item.cost;
    recordFinance(-item.cost, `Achat ${item.label}`);
  } else {
    profile.money = GOD_MODE_MONEY;
  }
  if (!profile.ownedItems.includes(item.id)) profile.ownedItems.push(item.id);
  if (item.stackable) {
    profile.inventory[item.id] = (profile.inventory[item.id] || 0) + 1;
  }
  item.apply(profile);
  if (item.category === 'clothing') {
    clothingPreview = null;
    applyAppearanceToPlayer();
  }
  unlockGigs();
  updateProfileChrome();
  notify(`${item.label} achete: ${item.advantages?.[0] || 'bonus'} / ${item.disadvantages?.[0] || 'compromis'}.`);
  saveSlots();
  renderDesktop();
}

function wearClothingItem(itemId) {
  const item = shopItems.find((entry) => entry.id === itemId && entry.category === 'clothing');
  if (!item || !profile.ownedItems.includes(item.id) || !item.clothingSlot) return;
  if(profile.activeRun){notify('La tenue reste réservée au contrat en pause.');return;}
  clothingPreview = null;
  equipWear(item);
  applyAppearanceToPlayer();
  saveSlots();
  notify(`${item.label} equipe.`);
  renderDesktop();
}

function previewClothingItem(itemId) {
  const item = shopItems.find((entry) => entry.id === itemId && entry.category === 'clothing');
  if (!item || !item.clothingSlot) return;
  clothingPreview = {
    itemId,
    ...profile.appearance,
    [item.clothingSlot]: item.clothingValue,
  };
  applyAppearanceToPlayer();
}

function addEmail(from, subject, body, options = {}) {
  const duplicate = profile.emails.some((email) =>
    email.subject === subject && email.day === profile.day && email.from === from
  );
  if (duplicate && options.unique !== false) return null;
  const email = {
    id: `mail-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    day: profile.day,
    from,
    subject,
    body,
    read: false,
    type: options.type || 'info',
    gigId: options.gigId || null,
  };
  profile.emails.push(email);
  return email;
}

function addPhoneMessage(from, title, body, kind = 'dm') {
  if (!profile.phoneMessages) profile.phoneMessages = [];
  profile.phoneMessages.push({
    id: `phone-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    day: profile.day,
    from,
    title,
    body,
    kind,
  });
  if (profile.phoneMessages.length > 60) profile.phoneMessages = profile.phoneMessages.slice(-60);
}

function notify(text) {
  profile.notifications.push(text);
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = text;
  const target = globalToastList || toastList;
  target.append(toast);
  while (target.children.length > 2) target.firstElementChild.remove();
  window.setTimeout(() => toast.remove(), 3600);
  if (document.body.classList.contains('screen-gig')) {
    message.textContent = text;
  }
  updateProfileChrome();
}

function addXp(amount) {
  const s = profile.stats;
  s.xp += amount;
  while (s.xp >= s.level * 100) {
    s.xp -= s.level * 100;
    s.level += 1;
    s.technique = clamp(s.technique + 2, 0, 100);
    s.creativity = clamp(s.creativity + 1, 0, 100);
    if (s.level % 2 === 0) s.reputation = clamp(s.reputation + 1, 0, 100);
    if (s.level % 3 === 0) s.network = clamp(s.network + 1, 0, 100);
    if (s.level % 4 === 0) s.style = clamp(s.style + 1, 0, 100);
    const bonus = [
      'technique +2',
      'creativite +1',
      s.level % 2 === 0 ? 'reputation +1' : null,
      s.level % 3 === 0 ? 'reseau +1' : null,
      s.level % 4 === 0 ? 'style +1' : null,
    ].filter(Boolean).join(', ');
    addEmail('Carriere', `Niveau ${s.level}`, `Tu gagnes un niveau. Bonus de progression: ${bonus}. De nouveaux paliers Atazone peuvent se debloquer.`);
    notify(`Niveau ${s.level} atteint: ${bonus}.`);
  }
}

function startGig(gigId) {
  if (profile.activeRun) { resumeActiveRun(); return; }
  const gig = profile.gigs.find((item) => item.id === gigId);
  if (!gig) return;
  if (!canPlayGig(gig)) {
    if (gig.status === 'accepted' || gig.status === 'scheduled') {
      notify(`Ce gig est prevu ${formatScheduledDay(getGigAbsoluteDay(gig))}. Tu dois attendre cette journee.`);
      return;
    }
    notify('Ce gig doit etre confirme avant de partir.');
    return;
  }
  const missingSkills = getMissingSkills(gig);
  if (missingSkills.length) {
    notify(`Competence manquante: ${missingSkills.join(', ')}.`);
    openApp('skills');
    return;
  }
  pendingGigSetup = gig;
  renderGigSetup(gig);
  if(gig.sessionReady)SessionRules.simplifySetup(gig);
  window.StudioJourney?.offerSavedSetup();
  gigSetupModal.hidden = false;
}

function closeGigSetup() {
  pendingGigSetup = null;
  gigSetupModal.hidden = true;
}

function renderGigSetup(gig) {
  const projectorCount = getGigProjectorCount(gig);
  const specific = getGigSpecificRequirements(gig);
  const client = getClientProfile(gig);
  const transport = calculateTransportCost(gig, specific);
  const accessoryRows = (specific.accessories || (specific.accessory ? [specific.accessory] : []))
    .map((slug, index) => renderGearLoadoutRow('accessory', `Outil special ${index + 1}`, 1, slug, `accessory-${index}`))
    .join('');
  gigSetupTitle.textContent = `${gig.title} - ${gig.venue}`;
  gigSetupSubtitle.textContent = gig.sessionReady?'Un setup compatible, un objectif clair. Les frais seront payés à la sortie.':'Prépare ton intervention et vérifie les frais.';
  gigSetupContent.innerHTML = `
    <div class="production-strip" aria-label="Étapes du show">
      <span class="active"><b>01</b> Préproduction</span><span><b>02</b> Installation & mapping</span><span><b>03</b> Prestation & bilan</span>
    </div>
    <div class="production-metrics">
      <div><small>CACHET ANNONCÉ</small><strong>${gig.budget}$</strong><span>Avant frais · paiement selon résultat</span></div>
      <div><small>DIRECTION VISUELLE</small><strong>${escapeHtml(getStyleMeta(gig.style).label)}</strong><span>${projectorCount} sortie${projectorCount > 1 ? 's' : ''} de projection</span></div>
      <div><small>FENÊTRE DE MONTAGE</small><strong>${gig.timeLimitSeconds ? `${Math.round(gig.timeLimitSeconds / 60)} min` : 'Sans chrono'}</strong><span>Durée de jeu, pas une durée réelle</span></div>
    </div>
    <div class="gear-setup-grid">
      <section class="gear-contract-card">
        <h2>Brief client</h2>
        <p>${escapeHtml(gig.requirement)}</p><p>${escapeHtml(ShowProfiles.brief(gig))}</p>${ClientRelations.markup(gig)}
        <div class="transport-card">
          <strong>Uver transport</strong>
          <span>${transport.cost}$</span>
          <p>${escapeHtml(transport.label)}</p>
        </div>
        <div class="client-brief">
          <strong>${escapeHtml(client.label)}</strong>
          <span>${escapeHtml(client.description)}</span>
        </div>
        ${renderClientRequirementChecklist(gig, specific, projectorCount)}
        <section class="production-prep">
          <h2>Priorité avant le départ</h2>
          <p>Une préparation ciblée. Son effet est appliqué au départ, puis au bilan.</p>
          <label class="field"><span>Travail de préproduction</span>
            <select data-loadout-type="prep">
              ${Object.entries(PREP_OPTIONS).map(([id, prep]) => `<option value="choice:${id}">${escapeHtml(prep.label)}</option>`).join('')}
            </select>
          </label>
          <p id="production-prep-effect" aria-live="polite"></p>
          <div class="production-note"><strong>Repères métier</strong><p>Confirmer le format des surfaces et les horaires avec la régie. Prévoir une mire, tester les sorties vidéo et garder un visuel de secours. Le jeu simule ici la préparation et le mapping.</p></div>
        </section>
      </section>
      <section class="gear-choice-card">
        <div class="gear-choice-head">
          <div>
            <h2>Mon setup pour ce gig</h2>
            <p>Utilise ton stock, loue du gear plus fort quand le client l'autorise, ou va acheter dans Atazone.</p>
          </div>
          <button class="secondary-action compact" type="button" data-open-shop-from-setup>Shop</button>
        </div>
        ${renderGearLoadoutRow('projector', 'Projecteur', projectorCount, specific.projector)}
        ${renderGearLoadoutRow('computer', 'Ordinateur', 1, specific.computer)}
        ${specific.gpu ? renderGearLoadoutRow('gpu', 'Carte graphique', 1, specific.gpu) : ''}
        ${renderGearLoadoutRow('cable', 'Fils video', projectorCount, specific.cable)}
        ${specific.adapter ? renderGearLoadoutRow('adapter', 'Adaptateur video', 1, specific.adapter) : ''}
        ${specific.router ? renderGearLoadoutRow('router', 'Boite multi-projecteur', 1, specific.router) : ''}
        ${specific.console ? renderGearLoadoutRow('console', 'Controleur live', 1, specific.console) : ''}
        ${specific.screen ? renderGearLoadoutRow('screen', 'Ecran monitoring', 1, specific.screen) : ''}
        ${renderGearLoadoutRow('bag', 'Sac de transport', 1, specific.bag)}
        ${accessoryRows}
        ${renderVjLoopLoadoutRow(gig, specific)}
        ${renderPlacementLoadoutRow(gig)}
      </section>
    </div>
  `;
  gigSetupContent.querySelectorAll('[data-loadout-type]').forEach((input) => {
    input.addEventListener('change', updateGigSetupSummary);
  });
  gigSetupContent.querySelector('[data-open-shop-from-setup]')?.addEventListener('click', () => {
    closeGigSetup();
    openApp('shop');
  });
  updateGigSetupSummary();
}

function renderGearLoadoutRow(type, label, quantity, requiredSlug = null, loadoutKey = type) {
  const options = getGearOptions(type, requiredSlug);
  return `
    <label class="gear-loadout-row">
      <span>
        <strong>${escapeHtml(label)}</strong>
        <small>${quantity > 1 ? `${quantity} unites necessaires` : '1 unite necessaire'}${requiredSlug ? ' - modele exige/recommande' : ''}</small>
      </span>
      <select data-loadout-type="${escapeHtml(loadoutKey)}" data-loadout-gear-type="${escapeHtml(type)}" data-loadout-quantity="${quantity}" data-loadout-required="${escapeHtml(requiredSlug || '')}">
        ${options.map((option) => `
          <option value="${escapeHtml(option.value)}" ${option.selected ? 'selected' : ''}>
            ${escapeHtml(option.label)}
          </option>
        `).join('')}
      </select>
    </label>
  `;
}

function renderVjLoopLoadoutRow(gig, specific) {
  const style = gig.style || 'techno';
  const needed = specific.vjloop || 1;
  const owned = countOwnedVjLoopPacks(style);
  const meta = getStyleMeta(style);
  const options = [];
  if (owned >= needed) {
    options.push({
      value: `owned:${style}`,
      label: `Utiliser mes packs ${meta.label} x${needed} - 0$`,
      selected: true,
    });
  }
  if (gig.loanerGear && owned < needed) {
    options.push({
      value: `loan:${style}`,
      label: `Packs ${meta.label} fournis par le client - 0$ / aucun bonus`,
      selected: true,
    });
  }
  if (!options.length) {
    options.push({
      value: `missing:${style}`,
      label: `Manquant: ${needed} pack${needed > 1 ? 's' : ''} ${meta.label} - achat requis`,
      selected: true,
    });
  }
  return `
    <label class="gear-loadout-row vjloop-row">
      <span>
        <strong>VJ loops ${escapeHtml(meta.label)}</strong>
        <small>${owned}/${needed} possede${owned > 1 ? 's' : ''}. Les loops ne sont jamais en location.</small>
      </span>
      <select data-loadout-type="vjloop" data-loadout-style="${escapeHtml(style)}" data-loadout-quantity="${needed}">
        ${options.map((option) => `<option value="${escapeHtml(option.value)}" ${option.selected ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}
      </select>
    </label>
  `;
}

function renderClientRequirementChecklist(gig, specific, projectorCount) {
  const contract = [
    `Gig ${gig.number || '?'} - ${gig.newDifficulty || gig.type}`,
    `${gig.zoneLabel || '1 rectangle'} (${gig.zoneShape || 'rectangle'})`,
    `Contrainte: ${gig.constraints || 'standard'}`,
    `Objectif client ${getGigMinimumScore(gig)}%`,
  ];
  const required = getGigMandatoryRequirements(gig, specific);
  const recommended = getGigRecommendedRequirements(gig, specific);
  if (gig.lockedDepth) contract.push('projecteur bloque en profondeur');
  if (gig.lockedHorizontal) contract.push('rack bloque lateralement');
  if (gig.timeLimitSeconds) contract.push(`temps client ${formatGigTime(gig.timeLimitSeconds * 1000)}`);
  if (gig.loanerGear) contract.push(gig.sessionReady ? 'Matériel prêté par le client' : 'materiel prete par le client: aucun bonus gear');
  if (gig.allowRent === false) contract.push('location interdite');
  return `
    <div class="gear-need-list client-checklist split-checklist">
      <strong>Brief client</strong>
      ${contract.map((item) => `<label><input type="checkbox" checked disabled /><span>${escapeHtml(item)}</span></label>`).join('')}
      <strong>Obligatoire pour entrer</strong>
      ${required.map((item) => `<label class="must-have"><input type="checkbox" checked disabled /><span>${escapeHtml(item)}</span></label>`).join('')}
      <strong>${gig.sessionReady ? 'Conseils de préparation' : 'Conseille pour mieux scorer'}</strong>
      ${recommended.map((item) => `<label class="nice-have"><input type="checkbox" checked disabled /><span>${escapeHtml(item)}</span></label>`).join('')}
    </div>
  `;
}

function calculateTransportCost(gig, specific = getGigSpecificRequirements(gig)) {
  const projectorCount = getGigProjectorCount(gig);
  const accessoryCount = specific.accessories?.length || (specific.accessory ? 1 : 0);
  const heavyUnits =
    projectorCount * 2.2 +
    projectorCount * 0.7 +
    (specific.router ? 1.4 : 0) +
    (specific.console ? 0.9 : 0) +
    (specific.screen ? 1.2 : 0) +
    (specific.gpu ? 0.6 : 0) +
    accessoryCount * 0.45 +
    (specific.vjloop || 1) * 0.18 +
    Math.max(0, getZoneCount(gig.zoneLabel || '1') - 1) * 0.25;
  const budget = Number(gig?.budget) || 180;
  const ratio = clamp(0.045 + heavyUnits * 0.008, 0.06, 0.18);
  const cost = Math.max(18, Math.round((budget * ratio + heavyUnits * 5) / 5) * 5);
  const van = heavyUnits >= 8 ? 'Uver Van XL' : heavyUnits >= 5 ? 'Uver Gear' : 'Uver Compact';
  return {
    cost,
    units: Number(heavyUnits.toFixed(1)),
    vehicle: van,
    label: `${van}: ${projectorCount} projo, ${projectorCount} fil${projectorCount > 1 ? 's' : ''}, ${specific.vjloop || 1} pack${(specific.vjloop || 1) > 1 ? 's' : ''} VJ et accessoires.`,
  };
}

function renderPlacementLoadoutRow(gig) {
  const options = gig.placementOptions || [{ id: 'center', label: 'Centre standard', penalty: 0 }];
  if (options.length <= 1) return '';
  return `
    <label class="gear-loadout-row">
      <span>
        <strong>Position du rack</strong>
        <small>Le client propose ${options.length} points. Un seul fit parfaitement.</small>
      </span>
      <select data-loadout-type="placement" data-loadout-quantity="1">
        ${options.map((option) => `<option value="${escapeHtml(option.id)}">${escapeHtml(option.label)}</option>`).join('')}
      </select>
    </label>
  `;
}

function getGearOptions(type, requiredSlug = null) {
  const canRent = pendingGigSetup?.allowRent !== false;
  const canLoan = Boolean(pendingGigSetup?.loanerGear);
  const ownedSlug = profile.gear[type] || defaultGear[type]?.slug || 'none';
  const shopOptions = shopItems
    .filter((item) => item.category === 'gear' && item.type === type)
    .map((item) => getGearMeta(type, item.id.replace(`${type}-`, '')));
  const options = [];
  const ownedOptions = shopOptions
    .filter((meta) => gearMeetsRequirement(type, meta.slug, requiredSlug) && getOwnedGearUnitCount(type, meta.slug) > 0)
    .sort((a, b) => getGearQualityRank(type, a.slug) - getGearQualityRank(type, b.slug));
  const selectedOwnedSlug = gearMeetsRequirement(type, ownedSlug, requiredSlug)
    ? ownedSlug
    : ownedOptions[0]?.slug;
  ownedOptions.forEach((meta) => {
    const ownedUnits = getOwnedGearUnitCount(type, meta.slug);
    options.push({
      value: `owned:${meta.slug}`,
      label: `Utiliser mon ${meta.label}${ownedUnits > 1 ? ` x${ownedUnits}` : ''} - 0$`,
      selected: meta.slug === selectedOwnedSlug,
    });
  });
  if (!requiredSlug && ownedSlug === 'none') {
    const ownedMeta = getGearMeta(type, ownedSlug);
    options.push({
      value: `owned:${ownedSlug}`,
      label: `Utiliser mon ${ownedMeta.label} - 0$`,
      selected: true,
    });
  }
  if (canLoan && requiredSlug && !selectedOwnedSlug) {
    const loanMeta = getGearMeta(type, requiredSlug);
    options.push({
      value: `loan:${requiredSlug}`,
      label: `Pret client ${loanMeta.label} minimum - 0$ / aucun bonus`,
      selected: true,
    });
  }
  shopOptions.forEach((meta) => {
    if (!gearMeetsRequirement(type, meta.slug, requiredSlug)) return;
    if (getOwnedGearUnitCount(type, meta.slug) > 0) return;
    const owned = profile.ownedItems.includes(`${type}-${meta.slug}`) || profile.gear[type] === meta.slug;
    if (!owned && !canRent) return;
    options.push({
      value: `${owned ? 'owned' : 'rent'}:${meta.slug}`,
      label: `${owned ? 'Utiliser mon' : 'Louer'} ${meta.label} - ${owned ? '0' : meta.rentCost}$`,
      selected: !canLoan && !selectedOwnedSlug && requiredSlug === meta.slug,
    });
  });
  if (type === 'accessory' && !requiredSlug) {
    options.unshift({
      value: 'owned:none',
      label: 'Aucun accessoire - 0$',
      selected: true,
    });
  }
  return options.length ? options : [{
    value: `missing:${requiredSlug || ownedSlug}`,
    label: `Manquant: ${getGearMeta(type, requiredSlug || ownedSlug).label}`,
    selected: true,
  }];
}

function countOwnedVjLoopPacks(style) {
  return profile.ownedItems.filter((id) => {
    const item = shopItems.find((entry) => entry.id === id);
    return item?.category === 'vjloop' && item.styleTarget === style;
  }).length;
}

function getOwnedGearUnitCount(type, slug) {
  const itemId = `${type}-${slug}`;
  const stackCount = profile.inventory?.[itemId] || 0;
  const baseCount = profile.ownedItems.includes(itemId) || profile.gear[type] === slug ? 1 : 0;
  const unitMultiplier = getGearUnitMultiplier(slug);
  return Math.max(baseCount, stackCount) * unitMultiplier;
}

function getOwnedGearUnitCountAtLeast(type, requiredSlug) {
  if (!requiredSlug) return 0;
  return shopItems
    .filter((item) => item.category === 'gear' && item.type === type && gearMeetsRequirement(type, item.id.replace(`${type}-`, ''), requiredSlug))
    .reduce((total, item) => total + getOwnedGearUnitCount(type, item.id.replace(`${type}-`, '')), 0);
}

function getBestOwnedGearSlug(type, requiredSlug = null) {
  const options = shopItems
    .filter((item) => item.category === 'gear' && item.type === type && gearMeetsRequirement(type, item.id.replace(`${type}-`, ''), requiredSlug))
    .map((item) => item.id.replace(`${type}-`, ''))
    .filter((slug) => getOwnedGearUnitCount(type, slug) > 0)
    .sort((a, b) => getGearQualityRank(type, b) - getGearQualityRank(type, a));
  return options[0] || null;
}

function gearMeetsRequirement(type, slug, requiredSlug = null) {
  if (!requiredSlug) return true;
  if (!slug || slug === 'none') return false;
  if (slug === requiredSlug) return true;
  if (type === 'accessory') return false;
  const requiredRank = getGearProgressionRank(type, requiredSlug);
  const ownedRank = getGearProgressionRank(type, slug);
  return requiredRank > 0 && ownedRank >= requiredRank;
}

function getGearQualityRank(type, slug) {
  const progressionRank = getGearProgressionRank(type, slug);
  if (progressionRank > 0) return progressionRank;
  if (!slug || slug === 'none') return 0;
  const item = shopItems.find((entry) => entry.id === `${type}-${slug}`);
  if (item) return getItemStars(item);
  return 0;
}

function getGearProgressionRank(type, slug) {
  const order = GEAR_PROGRESSIONS[type];
  if (!order || !slug) return 0;
  const index = order.indexOf(slug);
  return index >= 0 ? index + 1 : 0;
}

function getGearUnitMultiplier(slug = '') {
  return String(slug).includes('3pack') ? 3 : 1;
}

function getVjLoopRentCost(item) {
  return Math.max(18, Math.round(item.cost / 3));
}

function buildAutoGigLoadout(gig) {
  const selected = {};
  const labels = [];
  const extraRentals = [];
  let rentalCost = 0;
  let scoreBonus = 0;
  const specific = getGigSpecificRequirements(gig);
  const addGear = (type, quantity = 1, requiredSlug = null, key = type) => {
    if (!requiredSlug && ['gpu', 'adapter', 'router', 'console', 'screen', 'bag', 'accessory'].includes(type)) return;
    const ownedSlug = requiredSlug
      ? (getBestOwnedGearSlug(type, requiredSlug) || profile.gear[type] || defaultGear[type]?.slug || 'none')
      : (profile.gear[type] || defaultGear[type]?.slug || 'none');
    const slug = requiredSlug && !gearMeetsRequirement(type, ownedSlug, requiredSlug) ? requiredSlug : ownedSlug;
    const meta = getGearMeta(type, slug);
    const ownedCount = requiredSlug ? getOwnedGearUnitCountAtLeast(type, requiredSlug) : (slug === 'none' ? 0 : getOwnedGearUnitCount(type, slug));
    if (gig.loanerGear && requiredSlug && ownedCount < quantity) {
      const loanMeta = getGearMeta(type, requiredSlug);
      selected[key] = { source: 'loan', slug: requiredSlug, quantity, rentCount: 0, cost: 0, label: `${loanMeta.label} prete`, scoreBonus: 0 };
      labels.push(`${loanMeta.label} prete${quantity > 1 ? ` x${quantity}` : ''}`);
      return;
    }
    if (ownedCount >= quantity || !requiredSlug) {
      selected[key] = { source: 'owned', slug, quantity, rentCount: 0, cost: 0, label: meta.label, scoreBonus: meta.scoreBonus };
      labels.push(`${meta.label}${quantity > 1 ? ` x${quantity}` : ''}`);
      scoreBonus += meta.scoreBonus + Math.max(0, quantity - 1);
      return;
    }
    if (gig.allowRent !== false) {
      const rentCount = Math.max(0, quantity - ownedCount);
      const cost = rentCount * meta.rentCost;
      rentalCost += cost;
      selected[key] = { source: 'rent', slug, quantity, rentCount, cost, label: meta.label, scoreBonus: meta.scoreBonus };
      labels.push(`${meta.label}${quantity > 1 ? ` x${quantity}` : ''}`);
      extraRentals.push(`${rentCount} location${rentCount > 1 ? 's' : ''} ${meta.label}: ${cost}$`);
      scoreBonus += meta.scoreBonus;
      return;
    }
    rentalCost = 999999;
    extraRentals.push(`Manquant: ${meta.label} x${quantity}`);
    selected[key] = { source: 'missing', slug, quantity, rentCount: quantity, cost: 999999, label: meta.label, scoreBonus: 0 };
  };
  addGear('projector', getGigProjectorCount(gig), specific.projector);
  addGear('computer', 1, specific.computer);
  addGear('gpu', 1, specific.gpu);
  addGear('cable', getGigProjectorCount(gig), specific.cable);
  addGear('adapter', 1, specific.adapter);
  addGear('router', 1, specific.router);
  addGear('console', 1, specific.console);
  addGear('screen', 1, specific.screen);
  addGear('bag', 1, specific.bag);
  (specific.accessories || (specific.accessory ? [specific.accessory] : [])).forEach((slug, index) => {
    addGear('accessory', 1, slug, `accessory-${index}`);
  });
  const ownedLoops = countOwnedVjLoopPacks(gig.style);
  if (ownedLoops >= specific.vjloop) {
    selected.vjloop = { source: 'owned', slug: gig.style, style: gig.style, quantity: specific.vjloop, rentCount: 0, cost: 0, label: `Packs ${gig.style}`, scoreBonus: Math.min(10, ownedLoops * 2) };
    labels.push(`Packs ${getStyleMeta(gig.style).label} x${specific.vjloop}`);
    scoreBonus += Math.min(10, ownedLoops * 2);
  } else if (gig.loanerGear) {
    selected.vjloop = { source: 'loan', slug: gig.style, style: gig.style, quantity: specific.vjloop, rentCount: 0, cost: 0, label: `Packs ${gig.style} pretes`, scoreBonus: 0 };
    labels.push(`Packs ${getStyleMeta(gig.style).label} pretes`);
  } else {
    rentalCost = 999999;
    extraRentals.push(`Manquant: ${specific.vjloop} pack${specific.vjloop > 1 ? 's' : ''} ${getStyleMeta(gig.style).label}`);
    selected.vjloop = { source: 'missing', slug: gig.style, style: gig.style, quantity: specific.vjloop, rentCount: specific.vjloop, cost: 999999, label: `Manquant ${gig.style}`, scoreBonus: 0 };
  }
  selected.placement = { source: 'choice', slug: 'center', quantity: 1, rentCount: 0, cost: 0, label: 'Rack centre', scoreBonus: 0, penalty: 0 };
  const qualityLabel = scoreBonus >= 18 ? 'Setup premium' : scoreBonus >= 10 ? 'Setup solide' : scoreBonus >= 4 ? 'Setup correct' : 'Setup debutant';
  const transport = calculateTransportCost(gig);
  const transportCost = transport.cost;
  const totalCost = rentalCost >= 999999 ? rentalCost : rentalCost + transportCost;
  return { selected, labels, rentalCost, transportCost, transport, totalCost, scoreBonus, qualityLabel, extraRentals };
}

function updateGigSetupSummary() {
  const loadout = readGigLoadoutFromSetup();
  const unavailable = Object.values(loadout.selected).some((item) => item.source === 'missing');
  const missing = unavailable || loadout.totalCost > profile.money;
  const gig = pendingGigSetup || currentGig;
  const margin = gig.budget - loadout.totalCost;
  const prep = PREP_OPTIONS[loadout.selected.prep?.slug];
  const prepEffect = document.querySelector('#production-prep-effect');
  if (prepEffect && prep) prepEffect.textContent = `${prep.description} ${prep.fatigue ? `Fatigue : ${prep.fatigue > 0 ? '+' : ''}${prep.fatigue}.` : 'Réseau : +1.'}`;
  gigSetupSummary.innerHTML = `
    <div class="gear-summary">
      <span>Gear auto: <strong>${loadout.rentalCost >= 999999 ? 'manquant' : `${loadout.rentalCost}$`}</strong></span>
      <span>Transport Uver: <strong>${loadout.transportCost}$</strong></span>
      <span>Frais au départ : <strong>${unavailable ? "À compléter" : `${loadout.totalCost}$`}</strong></span>
      <span>Trésorerie restante : <strong>${unavailable ? "—" : `${profile.money - loadout.totalCost}$`}</strong></span>
      <span>Marge si cachet payé à 100 % : <strong>${unavailable ? "—" : `${margin}$`}</strong></span>
      <span>${loadout.qualityLabel}</span>
    </div>
    ${loadout.extraRentals.length ? `<p class="gear-extra-note">${escapeHtml(loadout.extraRentals.join(' | '))}</p>` : ''}
    ${!unavailable && margin < 0 ? '<p class="gear-warning">Les frais dépassent le cachet annoncé. Ce contrat peut te coûter de l’argent même avec un bon résultat.</p>' : ''}
    ${missing ? '<p class="gear-warning">Inventaire insuffisant ou pas assez d argent pour Uver. Va dans Inventaire, Shop ou Finance.</p>' : ''}
  `;
  gigSetupStartButton.disabled = missing;
  if(missing&&gigSetupContent.querySelector('.setup-advanced'))gigSetupContent.querySelector('.setup-advanced').open=true;
}

function readGigLoadoutFromSetup() {
  const gig = pendingGigSetup || currentGig;
  const rows = [...gigSetupContent.querySelectorAll('[data-loadout-type]')];
  const selected = {};
  let rentalCost = 0;
  let scoreBonus = 0;
  const labels = [];
  const extraRentals = [];
  rows.forEach((select) => {
    const key = select.dataset.loadoutType;
    const type = select.dataset.loadoutGearType || key;
    const quantity = Number(select.dataset.loadoutQuantity) || 1;
    const [source, slug] = select.value.split(':');
    if (type === 'vjloop') {
      const style = select.dataset.loadoutStyle;
      const ownedCount = countOwnedVjLoopPacks(style);
      if (source === 'missing' || (source === 'owned' && ownedCount < quantity)) {
        rentalCost = 999999;
        extraRentals.push(`Manquant: ${quantity} pack${quantity > 1 ? 's' : ''} VJ ${getStyleMeta(style).label}. Va dans Shop > VJ Loop.`);
        selected[type] = { source: 'missing', slug, style, quantity, rentCount: 0, cost: 999999, label: `Manquant ${style}`, scoreBonus: 0 };
        return;
      }
      if (source === 'loan') {
        selected[type] = { source, slug, style, quantity, rentCount: 0, cost: 0, label: `Packs ${style} fournis`, scoreBonus: 0 };
        labels.push(`Packs ${getStyleMeta(style).label} fournis x${quantity}`);
        return;
      }
      const loopBonus = Math.min(10, ownedCount * 2);
      scoreBonus += loopBonus + Math.min(6, ownedCount * 2);
      selected[type] = { source: 'owned', slug, style, quantity, rentCount: 0, cost: 0, label: `Packs ${style}`, scoreBonus: loopBonus };
      labels.push(`Mes packs ${getStyleMeta(style).label} x${quantity}`);
      return;
    }
    if (type === 'placement') {
      const option = (currentGig?.placementOptions || pendingGigSetup?.placementOptions || []).find((entry) => entry.id === slug);
      const correct = (currentGig?.correctPlacement || pendingGigSetup?.correctPlacement || 'center') === slug;
      selected[type] = {
        source: 'choice',
        slug,
        quantity: 1,
        rentCount: 0,
        cost: 0,
        label: option?.label || slug,
        scoreBonus: 0,
        penalty: correct ? 0 : option?.penalty || 18,
      };
      labels.push(`Position: ${option?.label || slug}`);
      return;
    }
    if (type === 'prep') {
      const prep = PREP_OPTIONS[slug] || PREP_OPTIONS.loops;
      selected[type] = {
        source: 'choice',
        slug,
        quantity: 1,
        rentCount: 0,
        cost: 0,
        label: prep.label,
        scoreBonus: 0,
        bonus: prep.bonus || {},
      };
      labels.push(`Prep: ${prep.label}`);
      return;
    }
    const meta = getGearMeta(type, slug);
    if (source === 'missing') {
      rentalCost = 999999;
      extraRentals.push(`Manquant: ${meta.label}`);
      selected[key] = { source, slug, quantity, rentCount: quantity, cost: 999999, label: meta.label, scoreBonus: 0 };
      return;
    }
    if (source === 'loan') {
      selected[key] = { source, slug, quantity, rentCount: 0, cost: 0, label: `${meta.label} prete`, scoreBonus: 0 };
      labels.push(`${meta.label} prete${quantity > 1 ? ` x${quantity}` : ''}`);
      return;
    }
    const requiredSlug = select.dataset.loadoutRequired || '';
    const ownedCount = source === 'owned' && slug !== 'none'
      ? (requiredSlug ? getOwnedGearUnitCountAtLeast(type, requiredSlug) : getOwnedGearUnitCount(type, slug))
      : 0;
    const rentCount = source === 'rent' ? quantity : Math.max(0, quantity - ownedCount);
    if (rentCount > 0 && gig?.allowRent === false) {
      rentalCost = 999999;
      extraRentals.push(`Manquant: ${meta.label} x${quantity}`);
      selected[key] = { source: 'missing', slug, quantity, rentCount: quantity, cost: 999999, label: meta.label, scoreBonus: 0 };
      return;
    }
    if (rentCount > 0 && source === 'owned') {
      extraRentals.push(`${rentCount} location${rentCount > 1 ? 's' : ''} extra ${meta.label}: ${rentCount * meta.rentCost}$`);
    }
    const cost = rentCount * meta.rentCost;
    rentalCost += cost;
    const rentedPenalty = 0; // Identical gear performs identically whether owned or rented.
    scoreBonus += Math.max(0, meta.scoreBonus - rentedPenalty);
    if (quantity > 1) scoreBonus += Math.max(0, quantity - 1);
    selected[key] = { source, slug, quantity, rentCount, cost, label: meta.label, scoreBonus: Math.max(0, meta.scoreBonus - rentedPenalty) };
    labels.push(`${meta.label}${quantity > 1 ? ` x${quantity}` : ''}`);
    if (source === 'rent' && rentCount > 0) extraRentals.push(`${rentCount} location${rentCount > 1 ? 's' : ''} ${meta.label}: ${cost}$`);
  });
  const qualityLabel = scoreBonus >= 18 ? 'Setup premium' : scoreBonus >= 10 ? 'Setup solide' : scoreBonus >= 4 ? 'Setup correct' : 'Setup debutant';
  const transport = calculateTransportCost(gig);
  const transportCost = transport.cost;
  const totalCost = rentalCost >= 999999 ? rentalCost : rentalCost + transportCost;
  return { selected, labels, rentalCost, transportCost, transport, totalCost, scoreBonus, qualityLabel, extraRentals };
}

function beginGigFromSetup() {
  const gig = pendingGigSetup;
  if (!gig) return;
  const loadout = readGigLoadoutFromSetup();
  if (loadout.rentalCost >= 999999) {
    notify('Materiel manquant: ce contrat ne permet pas cette selection.');
    return;
  }
  if (loadout.totalCost > profile.money) {
    notify('Pas assez d argent pour ce setup et Uver. Change la selection, va au Shop ou Finance.');
    return;
  }
  if(gig.sessionReady&&window.StudioJourney&&!StudioJourney.departing){StudioJourney.queue(gig);return;}
  if(!gig.sessionReady)applyPrepChoice(loadout.selected.prep?.slug);
  profile.money -= loadout.totalCost;
  if(loadout.transportCost)recordFinance(-loadout.transportCost, `Transport · ${gig.title}`, {counterparty:'Uver',balanceAfter:profile.money+loadout.rentalCost});
  if(loadout.rentalCost)recordFinance(-loadout.rentalCost, `Location de matériel · ${gig.title}`, {counterparty:'Atazone Location'});
  loadout.equippedWear={...(profile.equippedWear||{})};
  loadout.randomEvent = gig.sessionReady ? null : maybeCreateGigEvent(gig, loadout);
  if(!gig.sessionReady)drainDayEnergy();
  activeGigLoadout = loadout;
  delete profile.preparedDeparture;
  currentGig = gig;
  runFinished = false;
  gigStartedAt = performance.now();
  gigTitle.textContent = `${gig.title} - ${gig.venue}`;
  buildGigScene();
  resetGigRun();
  pendingGigSetup = null;
  gigSetupModal.hidden = true;
  showScreen('gig');
  message.textContent = loadout.randomEvent
    ? `${loadout.randomEvent.label}: ${loadout.randomEvent.description}`
    : `Uver ${loadout.transportCost}$${loadout.rentalCost > 0 ? ` + gear auto ${loadout.rentalCost}$` : ''}. Test Card Damien actif tant que les projecteurs ne sont pas connectes.`;
  saveSlots();
  updateGigHud();
}

function applyPrepChoice(prepId) {
  const prep = PREP_OPTIONS[prepId];
  if (!prep) return;
  if (prep.fatigue) profile.stats.fatigue = clamp(profile.stats.fatigue + prep.fatigue, 0, 100);
  if (prep.network) profile.stats.network = clamp(profile.stats.network + prep.network, 0, 100);
}

function maybeCreateGigEvent(gig, loadout) {
  const prepId = loadout?.selected?.prep?.slug;
  const prepProtection = prepId === 'gear' || prepId === 'plan' ? 10 : 0;
  const chance = Math.max(8, 24 - prepProtection + Math.max(0, getGigLevelPenalty(gig) / 2));
  if (randomInt(1, 100) > chance) return null;
  return GIG_EVENTS[randomInt(0, GIG_EVENTS.length - 1)];
}

function getGearMeta(type, slug) {
  if (!slug || slug === 'none') return defaultGear[type] || defaultGear.accessory;
  const item = shopItems.find((entry) => entry.id === `${type}-${slug}`);
  if (!item) return defaultGear[type] || defaultGear.accessory;
  return {
    slug,
    label: item.label,
    description: item.description,
    scoreBonus: item.scoreBonus || 0,
    rentCost: Math.max(12, Math.round(item.cost / 3)),
  };
}

function getGigSpecificRequirements(gig) {
  const count = getGigProjectorCount(gig);
  const budget = Number(gig?.budget) || 0;
  const minScore = getGigMinimumScore(gig);
  const accessoryNeeds = [
    ...(Array.isArray(gig?.requiredAccessories) ? gig.requiredAccessories : []),
    gig?.requiredAccessory || null,
  ];
  if (getGigMaskRequirement(gig) > 0) accessoryNeeds.push('mapping-kit');
  if (gig?.lockedDepth || /zoom|distance/i.test(`${gig?.gearText || ''} ${gig?.constraints || ''}`)) {
    accessoryNeeds.push('wide-lens');
  }
  const accessories = [...new Set(accessoryNeeds.filter(Boolean))];
  return {
    projector: gig?.requiredProjector || null,
    computer: gig?.requiredComputer || getComputerRequirementForGig(gig?.number || 1),
    gpu: gig?.requiredGpu || ((gig?.number || 1) >= 21 ? 'gpu-desktop-mid' : null),
    cable: gig?.requiredCable || (count >= 3 ? '150ft-fiber' : count >= 2 ? '75ft-active' : '25ft-basic'),
    adapter: gig?.requiredAdapter || (count >= 3 ? 'dp-hdmi-pro-3pack' : count >= 2 ? 'dp-hdmi-basic' : null),
    router: gig?.requiredRouter || (count >= 3 ? 'mapper-triple' : count >= 2 ? 'splitter-duo' : null),
    console: gig?.requiredConsole || ((gig?.number || 1) >= 25 ? 'vj-deck' : (gig?.number || 1) >= 16 ? 'midi-mini' : null),
    screen: gig?.requiredScreen || ((gig?.number || 1) >= 18 || gig?.lockedDepth ? 'monitor-24' : null),
    bag: gig?.requiredBag || getBagRequirementForGig(gig?.number || 1),
    accessory: accessories[0] || null,
    accessories,
    vjloop: Number(gig?.requiredLoopPacks) || (budget >= 1000 ? 3 : count >= 2 ? 2 : 1),
  };
}

function returnToDesktopFromGig() {
  captureActiveRun();
  gigComputer.hidden = true;
  saveSlots();
  closeAppWindow(false);
  clearInactiveWindows();
  showScreen('desktop');
  gigStartedAt = null;
  currentGig=null;activeGigLoadout=null;
  renderCareerCompass();
  notify('Prestation mise en pause. Reprends-la depuis le tableau de carrière, sans repayer.');
}

function cancelCurrentGig() {
  if (!currentGig || runFinished) return;
  const penalty = Math.max(90, Math.round(currentGig.budget * 0.55));
  const paid = Math.min(Math.round(profile.money), penalty);
  profile.money = Math.max(0, Math.round(profile.money) - paid);
  if (paid > 0) recordFinance(-paid, `Annulation live ${currentGig.title}`);
  profile.stats.reputation = clamp(profile.stats.reputation - 14, 0, 100);
  profile.stats.fatigue = clamp(profile.stats.fatigue + 10, 0, 100);
  currentGig.status = 'cancelled';
  profile.activeRun=null;
  runFinished = true;
  gigStartedAt = null;
  drainDayEnergy();
  recordDayActivity('gig', `Cancelle: ${currentGig.title}`);
  addEmail(
    'Client',
    `Gig annule: ${currentGig.title}`,
    `Annulation de derniere minute. Penalites: -${penalty}$${paid < penalty ? ` (${penalty - paid}$ impaye)` : ''}, reputation -14, fatigue +10.`
  );
  notify(`Gig cancelle: -${penalty}$ et grosse perte de reputation.`);
  saveSlots();
  currentGig = null;
  activeGigLoadout = null;
  gigComputer.hidden = true;
  closeAppWindow(false);
  clearInactiveWindows();
  showScreen('desktop');
}

function setupScene() {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(34, 0.28, 54),
    new THREE.MeshStandardMaterial({ color: 0x1b2330, roughness: 0.55, metalness: 0.28, map: createVenueFloorTexture() })
  );
  floor.name = 'Venue base floor';
  floor.position.y = -0.16;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(54, 54, 0x414349, 0x303137);
  grid.visible = false;
  grid.position.y = 0.005;
  scene.add(grid);

  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(34, 15),
    new THREE.MeshStandardMaterial({ color: 0x101217, roughness: 0.78, metalness: 0.05 })
  );
  backWall.position.set(0, 5.85, WALL_Z - 0.04);
  scene.add(backWall);

  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0x151820,
    roughness: 0.82,
    metalness: 0.03,
    transparent: true,
    opacity: 0.62,
    side: THREE.DoubleSide,
  });
  [-16.75, 16.75].forEach((x) => {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(43, 10.8), sideMaterial);
    wall.position.set(x, 5.2, 5.8);
    wall.rotation.y = Math.PI / 2;
    scene.add(wall);
  });

  [-8.8, 8.8].forEach((x) => {
    const truss = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 6.8, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x7a7b80, metalness: 0.75, roughness: 0.25 })
    );
    truss.position.set(x, 3.35, -6.65);
    truss.castShadow = true;
    truss.userData.legacyTruss=true;
    scene.add(truss);
  });

  const topTruss = new THREE.Mesh(
    new THREE.BoxGeometry(18.8, 0.22, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x83848a, metalness: 0.72, roughness: 0.24 })
  );
  topTruss.position.set(0, 6.8, -6.65);
  topTruss.castShadow = true;
  topTruss.userData.legacyTruss=true;
  scene.add(topTruss);

  scene.add(new THREE.HemisphereLight(0xb7d8ff, 0x0b0b0e, 1.4));
  addSpot(-8, 7, 2, 0x32e4d0, 1.7);
  addSpot(8, 7, 3, 0xffb64d, 1.5);
  addSpot(0, 7.5, 4, 0xff4fb8, 1.1);

  deskStation = createDeskStation();
  deskStation.position.set(0, 0, 7.45);
  scene.add(deskStation);

  player = createVj();
  player.position.set(-1.25, 0, 8.65);
  scene.add(player);
  applyAppearanceToPlayer();
  createRoomProps();
  clothingStoreGroup = createClothingStoreProps();
  clothingStoreGroup.visible = false;
  scene.add(clothingStoreGroup);
  createQuestStageProps();
  createVenueDetails();
}

function createVenueFloorTexture() {
  const tile = document.createElement('canvas');
  tile.width = tile.height = 256;
  const ctx = tile.getContext('2d');
  ctx.fillStyle = '#68707b'; ctx.fillRect(0, 0, 256, 256);
  // Deterministic brushed concrete; no imported asset or random scene state.
  for (let i = 0; i < 1800; i++) {
    const x = (i * 73) % 256, y = (i * 139) % 256;
    ctx.fillStyle = i % 2 ? '#737a85' : '#59616d';
    ctx.fillRect(x, y, 1 + i % 5, 1);
  }
  ctx.strokeStyle = '#424b57'; ctx.lineWidth = 2; ctx.strokeRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(tile);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 18);
  return texture;
}

function createVenueDetails() {
  const venue = new THREE.Group();
  venue.name = 'Production venue details';
  const steel = new THREE.MeshStandardMaterial({color:0x8795a6,metalness:.85,roughness:.3});
  const black = new THREE.MeshStandardMaterial({color:0x0c111a,metalness:.25,roughness:.7});
  const rubber = new THREE.MeshStandardMaterial({color:0x202734,roughness:.94});
  function box(w,h,d,x,y,z,material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; venue.add(mesh); return mesh;
  }
  function strut(a,b,r=.035) {
    const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r,r,from.distanceTo(to),6),steel);
    mesh.position.copy(from).add(to).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),to.sub(from).normalize());
    venue.add(mesh);
  }
  // Square truss chords and alternating cross braces around the existing rig.
  for (const x of [-8.8,8.8]) {
    for (const dx of [-.2,.2]) for(const dz of [-.2,.2]) strut([x+dx,.1,-6.65+dz],[x+dx,6.8,-6.65+dz]);
    for(let y=.2;y<6.5;y+=.65) {
      strut([x-.2,y,-6.45],[x+.2,y+.65,-6.45]);
      strut([x+.2,y,-6.85],[x-.2,y+.65,-6.85]);
      strut([x+.2,y,-6.85],[x+.2,y+.65,-6.45]);
    }
    box(.9,.12,.9,x,.07,-6.65,black);
  }
  for(const y of [6.6,7]) for(const z of [-6.85,-6.45]) strut([-9.1,y,z],[9.1,y,z]);
  for(let x=-9;x<9;x+=.75) {
    strut([x,6.6,-6.45],[x+.75,7,-6.45]);
    strut([x,7,-6.85],[x+.75,6.6,-6.85]);
  }
  // Suspended speaker arrays, with recessed drivers and cabinet seams.
  for(const side of [-1,1]) {
    for(let i=0;i<4;i++) {
      const x=side*10.2, y=5.7-i*.62;
      box(1.25,.56,.78,x,y,-5.8,black);
      box(1.12,.43,.04,x,y,-5.38,rubber);
      for(const dx of [-.32,.32]) {
        const cone=new THREE.Mesh(new THREE.CylinderGeometry(.18,.15,.045,20),black);
        cone.rotation.x=Math.PI/2;cone.position.set(x+dx,y,-5.34);venue.add(cone);
      }
    }
    strut([side*10.2,6.8,-5.8],[side*10.2,6,-5.8],.022);
    box(1.7,1.05,1.15,side*10.2,.53,-5.5,black);
    box(1.52,.85,.03,side*10.2,.53,-4.9,rubber);
  }
  // Architectural LED battens and overhead fixture lenses.
  for(const side of [-1,1]) {
    const color=side<0?0x4de8df:0xb275ff;
    const glow=new THREE.MeshBasicMaterial({color});
    for(let i=0;i<4;i++) {
      box(.16,3.8,.18,side*(11.7+i*.65),2.6,-7.05,black);
      box(.045,3.55,.04,side*(11.7+i*.65),2.6,-6.93,glow);
    }
    const wash=new THREE.PointLight(color,1.4,11,2);wash.position.set(side*10,3,-4);venue.add(wash);
  }
  for(let i=0;i<7;i++) {
    const x=-7.5+i*2.5;
    box(.32,.36,.4,x,6.34,-6.55,black);
    const glow=new THREE.MeshBasicMaterial({color:i%2?0xab78ff:0x72fff0});
    const hazeMaterial = new THREE.MeshBasicMaterial({color:i%2?0xa174f0:0x55d9d0,transparent:true,opacity:.022,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
    const haze = new THREE.Mesh(new THREE.ConeGeometry(1.3,5.8,20,1,true),hazeMaterial);
    haze.position.set(x,3.3,-5.2); haze.rotation.x = -.28; venue.add(haze);
    const lens=new THREE.Mesh(new THREE.CircleGeometry(.12,16),glow);
    lens.position.set(x,6.3,-6.32);venue.add(lens);
  }
  // Back wall acoustic ribs and low stage edge, clear of projection surfaces.
  for(let x=-16;x<=16;x+=.8) box(.06,10,.12,x,5,-7.33,black);
  box(17,.22,1.4,0,.12,-6.4,black);
  box(16.8,.025,.03,0,.25,-5.68,new THREE.MeshBasicMaterial({color:0x548486}));
  const sign=document.createElement('canvas');sign.width=1024;sign.height=128;
  const ctx=sign.getContext('2d');ctx.fillStyle='#0e1723';ctx.fillRect(0,0,1024,128);
  ctx.fillStyle='#a0b8ce';ctx.font='600 42px monospace';ctx.textAlign='center';ctx.fillText('VJ  /  SIGNAL LAB',512,78);
  const label=new THREE.Mesh(new THREE.PlaneGeometry(6.4,.8),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sign)}));
  label.position.set(0,8,-7.2);venue.add(label);
  scene.add(venue);
}

function createRoomProps() {
  const wood = new THREE.MeshStandardMaterial({ color: 0x171a20, roughness: 0.72, metalness: 0.05 });
  const fabric = new THREE.MeshStandardMaterial({ color: 0x202738, roughness: 0.82 });
  const neon = new THREE.MeshBasicMaterial({ color: 0x1df6e3, transparent: true, opacity: 0.76 });

  const bed = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.34, 2.0), wood);
  frame.position.y = 0.32;
  frame.castShadow = true;
  frame.receiveShadow = true;
  bed.add(frame);
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.18, 0.28, 1.78), fabric);
  mattress.position.y = 0.62;
  mattress.castShadow = true;
  bed.add(mattress);
  const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.18, 0.46), new THREE.MeshStandardMaterial({ color: 0xd8d2c3, roughness: 0.9 }));
  pillow.position.set(-1.05, 0.86, -0.52);
  bed.add(pillow);
  bed.position.set(-11.8, 0, 15.2);
  bed.rotation.y = Math.PI / 2;
  scene.add(bed);

  const shelf = new THREE.Group();
  [0.45, 1.25, 2.05].forEach((y) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.12, 0.68), wood);
    board.position.y = y;
    board.castShadow = true;
    shelf.add(board);
  });
  [-1.34, 1.34].forEach((x) => {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.0, 0.68), wood);
    side.position.set(x, 1.25, 0);
    side.castShadow = true;
    shelf.add(side);
  });
  [-0.9, 0, 0.9].forEach((x, index) => {
    const gearCase = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.36, 0.46),
      new THREE.MeshStandardMaterial({ color: index === 1 ? 0x30323a : 0x10131a, roughness: 0.46, metalness: 0.18 })
    );
    gearCase.position.set(x, 1.52, 0);
    gearCase.castShadow = true;
    shelf.add(gearCase);
  });
  shelf.position.set(11.7, 0, 14.5);
  shelf.rotation.y = -Math.PI / 2;
  scene.add(shelf);

  const rug = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), neon);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.012, 12.8);
  scene.add(rug);
}

function createClothingStoreProps() {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x6b707c, roughness: 0.32, metalness: 0.72 });
  const glowCyan = new THREE.MeshBasicMaterial({ color: 0x1df6e3, transparent: true, opacity: 0.9 });

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.42, 0.12, 42),
    new THREE.MeshStandardMaterial({ color: 0x10151f, roughness: 0.48, metalness: 0.16 })
  );
  platform.position.set(-1.25, 0.03, 8.65);
  platform.receiveShadow = true;
  group.add(platform);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.025, 8, 64), glowCyan);
  ring.position.set(-1.25, 0.12, 8.65);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  [-2.25, -0.25].forEach((x) => {
    const lightPost = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.35, 12), metal);
    lightPost.position.set(x, 1.25, 7.68);
    lightPost.castShadow = true;
    group.add(lightPost);

    const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.72, 0.05), glowCyan.clone());
    lightStrip.position.set(x, 1.32, 7.62);
    group.add(lightStrip);
  });

  return group;
}

function createClothingRack(metal, darkMetal, colors) {
  const rack = new THREE.Group();
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.1, 12), metal);
  rail.rotation.z = Math.PI / 2;
  rail.position.y = 1.75;
  rail.castShadow = true;
  rack.add(rail);

  [-0.98, 0.98].forEach((x) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.58, 12), metal);
    pole.position.set(x, 0.9, 0);
    pole.castShadow = true;
    rack.add(pole);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.58), darkMetal);
    foot.position.set(x, 0.06, 0);
    foot.castShadow = true;
    rack.add(foot);
  });

  colors.forEach((colorName, index) => {
    const hanger = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.012, 6, 16, Math.PI), metal);
    hanger.position.set(-0.72 + index * 0.48, 1.62, 0);
    hanger.rotation.z = Math.PI;
    rack.add(hanger);
    const shirt = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.52, 0.08),
      new THREE.MeshStandardMaterial({ color: CLOTHING_COLORS[colorName] || 0x1df6e3, roughness: 0.58 })
    );
    shirt.position.set(-0.72 + index * 0.48, 1.28, 0.02);
    shirt.castShadow = true;
    rack.add(shirt);
  });

  return rack;
}

function createQuestStageProps() {
  const caseMaterial = new THREE.MeshStandardMaterial({ color: 0x11141b, roughness: 0.42, metalness: 0.22 });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x6a6d75, roughness: 0.32, metalness: 0.72 });
  const markMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.72, side: THREE.DoubleSide });
  const cableMaterial = new THREE.MeshStandardMaterial({ color: 0x050609, roughness: 0.82, metalness: 0.18 });

  [
    [-7.2, 0.65, -0.4, 0.05],
    [7.45, 0.65, -0.65, -0.08],
    [-10.8, 0.65, -4.8, 0.32],
    [10.6, 0.65, -4.95, -0.28],
    [12.8, 0.65, 5.4, 0.18],
  ].forEach(([x, y, z, rotation]) => {
    const roadCase = createRoadCase(caseMaterial, edgeMaterial);
    roadCase.position.set(x, y, z);
    roadCase.rotation.y = rotation;
    scene.add(roadCase);
  });

  [-5.8, 0, 5.8].forEach((x) => {
    const pad = createDashedFloorPad(markMaterial);
    pad.position.set(x, 0.024, 3.95);
    scene.add(pad);
  });

  [
    [[-0.5, 0.06, 7.3], [-2.4, 0.055, 6.4], [-5.8, 0.055, 4.2]],
    [[0.1, 0.06, 7.2], [2.2, 0.055, 6.0], [5.8, 0.055, 4.0]],
    [[0.7, 0.055, 7.2], [4.5, 0.05, 7.8], [9.5, 0.05, 5.0]],
  ].forEach((points) => {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'catmullrom', 0.45);
    const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 42, 0.035, 7, false), cableMaterial);
    cable.receiveShadow = true;
    scene.add(cable);
  });
}

function createRoadCase(caseMaterial, edgeMaterial) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.82, 1.0), caseMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);
  [[0, 0.42, 0], [0, -0.42, 0]].forEach(([x, y, z]) => {
    const band = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.045, 1.04), edgeMaterial);
    band.position.set(x, y, z);
    group.add(band);
  });
  [-0.55, 0.55].forEach((x) => {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.06), edgeMaterial);
    handle.position.set(x, 0.05, -0.53);
    group.add(handle);
  });
  return group;
}

function createDashedFloorPad(material) {
  const group = new THREE.Group();
  const pieces = [
    [1.6, 0.055, 0, 0.85], [1.6, 0.055, 0, -0.85],
    [0.055, 1.2, -0.85, 0], [0.055, 1.2, 0.85, 0],
  ];
  pieces.forEach(([width, depth, x, z]) => {
    const piece = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material);
    piece.rotation.x = -Math.PI / 2;
    piece.position.set(x, 0, z);
    group.add(piece);
  });
  return group;
}

function addSpot(x, y, z, color, intensity) {
  const light = new THREE.SpotLight(color, intensity, 32, Math.PI / 6, 0.5, 1.2);
  light.position.set(x, y, z);
  light.target.position.set(0, 1.3, -5);
  light.castShadow = true;
  scene.add(light);
  scene.add(light.target);
}

function buildGigScene() {
  if (stageGroup) {
    scene.remove(stageGroup);
    const geometries=new Set(),materials=new Set();
    stageGroup.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m)materials.add(m);});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    // Textures are shared with the video player, desk and subsequent rigs.
  }
  stageGroup = new THREE.Group();
  scene.add(stageGroup);
  rigs.length = 0;
  activeRigIndex = 0;

  const count = getGigProjectorCount(currentGig);
  const spacing = 5.4;
  const screenWidth = 4.6;
  const screenHeight = 3.25;
  const startX = -((count - 1) * spacing) / 2;
  for (let i = 0; i < count; i += 1) {
    const rig = createRig(i, startX + i * spacing, screenWidth, screenHeight);
    rigs.push(rig);
    stageGroup.add(rig.group);
  }
  window.VenueDesign?.build(stageGroup,currentGig);
  updateActiveVisuals();
}

function getGigProjectorCount(gig) {
  if (Number(gig?.projectorCount)) return Number(gig.projectorCount);
  const level = profile?.stats?.level || 1;
  if (level <= 3) return 1;
  if (level <= 6) return 2;
  return 3;
}

function getGigMinimumScore(gig) {
  return window.GigDifficulty ? GigDifficulty.spec(gig).score : Number(gig?.minScore) || 100;
}

function getGigMaskRequirement(gig) {
  return Number(gig?.maskRequired)>0 ? Math.max(50,window.GigDifficulty?.spec(gig).mask||50) : 0;
}

function createRig(index, screenX, screenWidth, screenHeight) {
  const group = new THREE.Group();
  const screen = { x: screenX, width: screenWidth, height: screenHeight };
  const lockedDepth = Boolean(currentGig?.lockedDepth);
  const placement = activeGigLoadout?.selected?.placement?.slug || currentGig?.correctPlacement || 'center';
  const placementOffset = placement === 'left' ? -1.4 : placement === 'deep' ? 0.9 : 0;
  const initialProjectorZ = lockedDepth ? 4.25 + placementOffset * 0.25 : 4.05 + index * 0.18 + placementOffset * 0.35;
  const calibration = {
    projectorX: screenX - 1.2 + (placement === 'left' ? -1.05 : 0),
    projectorZ: initialProjectorZ,
    yaw: 0.24,
    pitch: -0.18,
    coverage: 0,
    trapeze: 0,
  };

  const wallProjection = createProjectionMesh(0.1, true);
  wallProjection.position.set(screen.x, SCREEN_Y, WALL_Z);
  wallProjection.userData.rigIndex = index;
  group.add(wallProjection);

  const screenPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(screen.width, screen.height),
    new THREE.MeshStandardMaterial({ color: 0xf4f0df, roughness: 0.45, emissive: 0x17140c })
  );
  screenPlane.position.set(screen.x, SCREEN_Y, -7.22);
  screenPlane.userData.rigIndex = index;
  screenPlane.userData.screen = true;
  group.add(screenPlane);
  const screenHitArea=new THREE.Mesh(new THREE.PlaneGeometry(screen.width,screen.height),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));screenHitArea.position.set(screen.x,SCREEN_Y,SCREEN_Z);screenHitArea.userData.rigIndex=index;screenHitArea.visible=false;group.add(screenHitArea);
  if(!getGigMaskRequirement(currentGig)){addScreenFrame(group, screen);addScreenGuides(group, screen);}

  const screenProjection = createProjectionMesh(0.82, false);
  screenProjection.position.set(screen.x, SCREEN_Y, SCREEN_Z);
  screenProjection.userData.rigIndex = index;
  group.add(screenProjection);

  const projector = createProjector(calibration.projectorX, calibration.projectorZ);
  projector.selectable.forEach((mesh) => {
    mesh.userData.rigIndex = index;
  });
  group.add(projector.group);

  const beam = createBeam();
  group.add(beam);

  const cable = createCable();
  group.add(cable.mesh);

  const maskContour = new THREE.LineLoop(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0xffc857, transparent: true, opacity: 0.95 })
  );
  maskContour.position.set(screen.x, SCREEN_Y, SCREEN_Z + 0.045);
  maskContour.visible = false;
  group.add(maskContour);

  return {
    group,
    index,
    screen,
    calibration,
    projector,
    beam,
    cable,
    screenProjection,
    screenPlane,
    screenHitArea,
    wallProjection,
    maskContour,
    corners: [],
    maskPoints: [],
    maskQuality: 0,
    lockedDepth,
    lockedHorizontal: Boolean(currentGig?.lockedHorizontal),
    initialProjectorX: calibration.projectorX,
    initialProjectorZ,
    lastProjectorX: calibration.projectorX,
    lastProjectorZ: calibration.projectorZ,
  };
}

function addScreenFrame(group, screen) {
  const edgeMaterial = new THREE.MeshBasicMaterial({ color: 0x43ff9b, transparent: true, opacity: 0.76 });
  const pieces = [
    [screen.width, 0.05, 0, screen.height / 2],
    [screen.width, 0.05, 0, -screen.height / 2],
    [0.05, screen.height, -screen.width / 2, 0],
    [0.05, screen.height, screen.width / 2, 0],
  ];
  pieces.forEach(([width, height, x, y]) => {
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(width, height), edgeMaterial);
    edge.position.set(screen.x + x, SCREEN_Y + y, -7.08);
    group.add(edge);
  });
}

function addScreenGuides(group, screen) {
  const guideMaterial = new THREE.MeshBasicMaterial({ color: 0x2d2a24, transparent: true, opacity: 0.23 });
  const crossMaterial = new THREE.MeshBasicMaterial({ color: 0x2d2a24, transparent: true, opacity: 0.42 });
  [
    [screen.width * 0.96, 0.025, 0, 0],
    [0.025, screen.height * 0.9, 0, 0],
    [screen.width * 0.96, 0.018, 0, screen.height * 0.28],
    [screen.width * 0.96, 0.018, 0, -screen.height * 0.28],
  ].forEach(([width, height, x, y]) => {
    const guide = new THREE.Mesh(new THREE.PlaneGeometry(width, height), guideMaterial);
    guide.position.set(screen.x + x, SCREEN_Y + y, -7.055);
    group.add(guide);
  });
  [
    [-screen.width / 2 + 0.18, screen.height / 2 - 0.18],
    [screen.width / 2 - 0.18, screen.height / 2 - 0.18],
    [-screen.width / 2 + 0.18, -screen.height / 2 + 0.18],
    [screen.width / 2 - 0.18, -screen.height / 2 + 0.18],
  ].forEach(([x, y]) => {
    const h = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.025), crossMaterial);
    const v = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 0.28), crossMaterial);
    h.position.set(screen.x + x, SCREEN_Y + y, -7.05);
    v.position.copy(h.position);
    group.add(h, v);
  });
}

function createProjectionMesh(opacity, additive) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(0), 2));
  return new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      map: testCardTexture,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    })
  );
}

function createBeam() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(36), 3));
  geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(
      new Float32Array([
        0.5, 0.5, 0.44, 1, 0.56, 1,
        0.5, 0.5, 0.56, 1, 0.56, 0,
        0.5, 0.5, 0.56, 0, 0.44, 0,
        0.5, 0.5, 0.44, 0, 0.44, 1,
      ]),
      2
    )
  );
  return new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      map: testCardTexture,
      color: 0x9dfff1,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
}

function createProjector(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const pad = new THREE.Mesh(
    new THREE.RingGeometry(0.9, 1.1, 44),
    new THREE.MeshBasicMaterial({ color: 0xffc857, transparent: true, opacity: 0.68, side: THREE.DoubleSide })
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.y = 0.03;
  group.add(pad);

  const rack = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.22, 0.92),
    new THREE.MeshStandardMaterial({ color: 0x20232b, metalness: 0.34, roughness: 0.42 })
  );
  rack.position.y = 0.74;
  rack.castShadow = true;
  group.add(rack);

  const wheels = [];
  [-0.52, 0.52].forEach((wx) => {
    [-0.34, 0.34].forEach((wz) => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16),
        new THREE.MeshStandardMaterial({ color: 0x0a0b0f, roughness: 0.35 })
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.18, wz);
      wheel.castShadow = true;
      wheels.push(wheel);
      group.add(wheel);
    });
  });

  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.07, 0.84, 12),
    new THREE.MeshStandardMaterial({ color: 0xb5b8c3, metalness: 0.8, roughness: 0.26 })
  );
  stand.position.y = 1.18;
  stand.castShadow = true;
  group.add(stand);

  const head = new THREE.Group();
  head.position.y = 1.68;
  group.add(head);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.46, 0.72),
    new THREE.MeshStandardMaterial({ color: 0x30323a, roughness: 0.44, metalness: 0.2 })
  );
  body.castShadow = true;
  head.add(body);

  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.16, 24),
    new THREE.MeshStandardMaterial({ color: 0x75f7e4, emissive: 0x0a4540, roughness: 0.18 })
  );
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, 0, -0.45);
  head.add(lens);

  return { group, head, pad, wheels, selectable: [rack, body, lens, pad] };
}

function createCable() {
  const mesh = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshStandardMaterial({ color: 0x07090d, roughness: 0.72, metalness: 0.18, emissive: 0x031d1b })
  );
  mesh.visible = false;
  mesh.castShadow = true;
  return { mesh, connected: false };
}

function createDeskStation() {
  const group = new THREE.Group();
  const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x15171d, roughness: 0.64, metalness: 0.08 });
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x0c0d12, roughness: 0.58, metalness: 0.12 });

  const top = new THREE.Mesh(new THREE.BoxGeometry(4.45, 0.2, 1.65), tableMaterial);
  top.position.y = 0.82;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  [-1.9, 1.9].forEach((x) => {
    [-0.62, 0.62].forEach((z) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.82, 0.22), legMaterial);
      leg.position.set(x, 0.38, z);
      leg.castShadow = true;
      group.add(leg);
    });
  });

  const laptop = new THREE.Group();
  laptop.position.set(0.35, 0.97, -0.06);
  laptop.rotation.y = -0.08;
  group.add(laptop);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.48, 0.08, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x0d1016, roughness: 0.34, metalness: 0.22 })
  );
  base.castShadow = true;
  laptop.add(base);

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.014, 0.42),
    new THREE.MeshBasicMaterial({ color: 0x07090d })
  );
  keyboard.position.set(-0.05, 0.048, 0.08);
  laptop.add(keyboard);

  const trackpad = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.016, 0.18),
    new THREE.MeshBasicMaterial({ color: 0x1df6e3, transparent: true, opacity: 0.86 })
  );
  trackpad.position.set(-0.08, 0.054, 0.36);
  laptop.add(trackpad);

  const screenShell = new THREE.Mesh(
    new THREE.BoxGeometry(1.48, 0.88, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x11151d, roughness: 0.28, metalness: 0.18 })
  );
  screenShell.position.set(0, 0.55, -0.46);
  screenShell.rotation.x = -0.18;
  screenShell.castShadow = true;
  laptop.add(screenShell);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.25, 0.64),
    new THREE.MeshBasicMaterial({ map: laptopScreenTexture, side: THREE.DoubleSide, toneMapped: false })
  );
  screen.position.set(0, 0.56, -0.405);
  screen.rotation.x = -0.18;
  laptop.add(screen);

  const connectPad = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.05, 0.28),
    new THREE.MeshBasicMaterial({ color: 0x1df6e3, transparent: true, opacity: 0.92 })
  );
  connectPad.position.set(1.42, 0.96, 0.18);
  connectPad.userData.action = 'connect-projector';
  connectButtonMeshes.push(connectPad);
  group.add(connectPad);

  const controller = new THREE.Mesh(
    new THREE.BoxGeometry(0.82, 0.08, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x10131a, roughness: 0.4, metalness: 0.18 })
  );
  controller.position.set(-1.12, 0.96, 0.04);
  controller.castShadow = true;
  group.add(controller);

  [-1.38, -1.2, -1.02, -0.84].forEach((x, index) => {
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.016, 0.11),
      new THREE.MeshBasicMaterial({ color: index % 2 === 0 ? 0x23f5df : 0xff3f9c })
    );
    pad.position.set(x, 1.01, -0.05);
    group.add(pad);
  });

  return group;
}

function createLegacyVj() {
  const group = new THREE.Group();
  const fabricTexture = createFabricTexture();
  const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffbd90, roughness: 0.45, metalness: 0.02 });
  const fabricMaterial = new THREE.MeshStandardMaterial({
    color: 0x11141a,
    roughness: 0.76,
    metalness: 0.02,
    map: fabricTexture,
  });
  const blackTrim = new THREE.MeshStandardMaterial({ color: 0x05070b, roughness: 0.62, metalness: 0.03 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x111722, roughness: 0.42, metalness: 0.2 });

  const hoodie = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.4, 0.86, 12, 24),
    fabricMaterial.clone()
  );
  hoodie.name = 'hoodie';
  hoodie.position.y = 1.08;
  hoodie.scale.set(1.05, 1, 0.86);
  hoodie.castShadow = true;
  group.add(hoodie);

  const shoulders = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.12, 0.74, 8, 18),
    fabricMaterial.clone()
  );
  shoulders.name = 'shirt-detail';
  shoulders.position.set(0, 1.46, 0.02);
  shoulders.rotation.z = Math.PI / 2;
  shoulders.scale.z = 0.78;
  shoulders.castShadow = true;
  group.add(shoulders);

  const hood = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.055, 14, 36, Math.PI * 1.46),
    fabricMaterial.clone()
  );
  hood.name = 'shirt-detail';
  hood.position.set(0, 1.7, -0.08);
  hood.rotation.x = Math.PI * 0.5;
  hood.rotation.z = Math.PI * 0.18;
  hood.castShadow = true;
  group.add(hood);

  const pocket = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.05, 0.42, 6, 16),
    blackTrim.clone()
  );
  pocket.name = 'shirt-detail';
  pocket.position.set(0, 0.94, 0.395);
  pocket.rotation.z = Math.PI / 2;
  pocket.scale.z = 0.28;
  pocket.castShadow = true;
  group.add(pocket);

  [-0.08, 0.08].forEach((x) => {
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.36, 8),
      new THREE.MeshStandardMaterial({ color: 0xf7f3e6, roughness: 0.52 })
    );
    cord.name = 'drawstring';
    cord.position.set(x, 1.34, 0.43);
    cord.rotation.x = x > 0 ? 0.12 : -0.12;
    group.add(cord);
  });

  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.52),
    new THREE.MeshBasicMaterial({ map: createVjLogoTexture('neon'), transparent: true, side: THREE.DoubleSide })
  );
  logo.name = 'logo';
  logo.position.set(0, 1.18, 0.43);
  group.add(logo);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.22, 20), skinMaterial.clone());
  neck.name = 'skin';
  neck.position.y = 1.58;
  neck.castShadow = true;
  group.add(neck);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.27, 32, 22),
    skinMaterial.clone()
  );
  head.name = 'skin';
  head.position.y = 1.8;
  head.scale.set(0.92, 1.08, 0.95);
  head.castShadow = true;
  group.add(head);

  [-0.255, 0.255].forEach((x) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 10), skinMaterial.clone());
    ear.name = 'skin';
    ear.position.set(x, 1.8, 0.015);
    ear.scale.set(0.72, 1, 0.5);
    ear.castShadow = true;
    group.add(ear);
  });

  [-0.09, 0.09].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 10), new THREE.MeshBasicMaterial({ color: 0x07090d }));
    eye.position.set(x, 1.84, 0.245);
    group.add(eye);

    const brow = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.014, 0.018),
      new THREE.MeshStandardMaterial({ color: 0x08090d, roughness: 0.55 })
    );
    brow.position.set(x, 1.895, 0.242);
    brow.rotation.z = x > 0 ? -0.14 : 0.14;
    group.add(brow);
  });

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 16), skinMaterial.clone());
  nose.name = 'skin';
  nose.position.set(0, 1.79, 0.275);
  nose.rotation.x = Math.PI / 2;
  nose.castShadow = true;
  group.add(nose);

  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.014, 0.012), new THREE.MeshBasicMaterial({ color: 0x6b2f2a }));
  mouth.position.set(0, 1.705, 0.248);
  group.add(mouth);

  const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x08090d, roughness: 0.55 });
  const cap = new THREE.Group();
  cap.name = 'hair-cap';
  const capCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.16, 32), new THREE.MeshStandardMaterial({ color: 0x15161b, roughness: 0.38 }));
  capCrown.position.y = 2.03;
  const capPeak = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.22), new THREE.MeshStandardMaterial({ color: 0x0b0d12, roughness: 0.42 }));
  capPeak.position.set(0, 2.0, -0.26);
  cap.add(capCrown, capPeak);
  group.add(cap);

  const hairShort = new THREE.Mesh(
    new THREE.SphereGeometry(0.305, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52),
    hairMaterial.clone()
  );
  hairShort.name = 'hair-short';
  hairShort.position.y = 1.95;
  hairShort.scale.set(1.03, 0.48, 0.92);
  hairShort.castShadow = true;
  group.add(hairShort);

  const hairFade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.27, 0.31, 0.18, 32),
    hairMaterial.clone()
  );
  hairFade.name = 'hair-fade';
  hairFade.position.y = 1.98;
  hairFade.scale.set(1, 0.75, 0.9);
  hairFade.castShadow = true;
  group.add(hairFade);

  const curls = new THREE.Group();
  curls.name = 'hair-curls';
  [-0.22, -0.14, -0.06, 0.03, 0.12, 0.21].forEach((x, index) => {
    const curl = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10), hairMaterial.clone());
    curl.position.set(x, 1.99 + (index % 2) * 0.035, index % 3 === 0 ? 0.085 : 0.02);
    curl.castShadow = true;
    curls.add(curl);
  });
  group.add(curls);

  const mohawk = new THREE.Group();
  mohawk.name = 'hair-mohawk';
  [-0.14, 0, 0.14].forEach((z, index) => {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.34 - index * 0.025, 16), hairMaterial.clone());
    spike.position.set(0, 2.1, z);
    spike.rotation.x = index === 0 ? -0.18 : index === 2 ? 0.18 : 0;
    spike.castShadow = true;
    mohawk.add(spike);
  });
  group.add(mohawk);

  const clothingLooks = createVjClothingLooks();
  clothingLooks.forEach((look) => group.add(look));

  const headphones = new THREE.Group();
  headphones.name = 'headphones';
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(0.31, 0.025, 8, 18, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x05070b, roughness: 0.34, metalness: 0.28 })
  );
  band.rotation.z = Math.PI;
  band.position.y = 1.95;
  headphones.add(band);
  [-0.3, 0.3].forEach((x) => {
    const cup = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.24, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x111722, roughness: 0.45, metalness: 0.15 })
    );
    cup.position.set(x, 1.84, 0.02);
    cup.castShadow = true;
    headphones.add(cup);
  });
  group.add(headphones);

  [-0.32, 0.32].forEach((x) => {
    const arm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.075, 0.54, 10, 20),
      fabricMaterial.clone()
    );
    arm.name = 'sleeve';
    arm.position.set(x * 1.04, 1.02, 0.035);
    arm.rotation.z = x > 0 ? -0.26 : 0.26;
    arm.castShadow = true;
    group.add(arm);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.092, 0.07, 20), blackTrim.clone());
    cuff.name = 'shirt-detail';
    cuff.position.set(x * 1.06, 0.68, 0.04);
    cuff.rotation.x = Math.PI / 2;
    cuff.rotation.z = arm.rotation.z;
    group.add(cuff);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 12), skinMaterial.clone());
    hand.name = 'skin';
    hand.position.set(x * 1.08, 0.56, 0.05);
    hand.rotation.z = arm.rotation.z;
    hand.castShadow = true;
    group.add(hand);
  });

  [-0.16, 0.16].forEach((x) => {
    const leg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.085, 0.62, 10, 20),
      new THREE.MeshStandardMaterial({ color: 0x0b0d12, roughness: 0.6 })
    );
    leg.name = 'pants';
    leg.position.set(x, 0.36, 0.02);
    leg.castShadow = true;
    group.add(leg);

    const knee = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.035, 20), new THREE.MeshStandardMaterial({ color: 0x171b24, roughness: 0.68 }));
    knee.name = 'pants-detail';
    knee.position.set(x, 0.43, 0.13);
    knee.rotation.x = Math.PI / 2;
    group.add(knee);

    ['cargo', 'techwear'].forEach((style) => {
      const side = new THREE.Group();
      side.name = `pants-look-${style}`;
      const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.035), new THREE.MeshStandardMaterial({ color: style === 'cargo' ? 0x111723 : 0x05070b, roughness: 0.66 }));
      pocket.position.set(x * 1.18, 0.48, 0.13);
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.035, 0.035), new THREE.MeshStandardMaterial({ color: style === 'techwear' ? 0x1df6e3 : 0x2a303a, roughness: 0.45 }));
      strap.position.set(x, 0.62, 0.13);
      side.add(pocket, strap);
      group.add(side);
    });

    const shoeBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.085, 0.26, 8, 18),
      new THREE.MeshStandardMaterial({ color: 0x06080d, roughness: 0.48, metalness: 0.05 })
    );
    shoeBody.name = 'shoe-body';
    shoeBody.position.set(x, 0.08, 0.06);
    shoeBody.rotation.x = Math.PI / 2;
    shoeBody.scale.set(1.24, 1, 0.62);
    shoeBody.castShadow = true;
    group.add(shoeBody);

    const shoeGlow = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.025, 0.24, 6, 12),
      new THREE.MeshBasicMaterial({ color: 0x1df6e3 })
    );
    shoeGlow.name = 'shoeGlow';
    shoeGlow.position.set(x, 0.155, 0.16);
    shoeGlow.rotation.x = Math.PI / 2;
    shoeGlow.scale.set(1.18, 1, 0.45);
    group.add(shoeGlow);
  });

  return group;
}

function createVjClothingLooks() {
  const looks = [];
  const addLook = (name, parts) => {
    const look = new THREE.Group();
    look.name = `shirt-look-${name}`;
    parts.forEach((part) => look.add(part));
    looks.push(look);
  };
  const material = (color, emissive = 0x000000) => new THREE.MeshStandardMaterial({
    color,
    emissive,
    roughness: 0.5,
    metalness: 0.05,
  });
  const box = (name, color, size, pos, emissive = 0x000000) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, emissive));
    mesh.name = name;
    mesh.position.set(...pos);
    mesh.castShadow = true;
    return mesh;
  };
  addLook('pin', [
    box('pin-badge', 0x1df6e3, [0.08, 0.08, 0.018], [-0.2, 1.36, 0.455], 0x063a36),
  ]);
  addLook('beanie', [
    new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.58), material(0x10131a)),
  ]);
  looks[looks.length - 1].children[0].position.y = 2.02;
  looks[looks.length - 1].children[0].scale.set(1, 0.62, 0.9);
  addLook('blackout', [
    box('blackout-vest', 0x05070b, [0.74, 0.68, 0.06], [0, 1.08, 0.44]),
    box('blackout-zip', 0x2b313b, [0.03, 0.62, 0.018], [0, 1.08, 0.48]),
  ]);
  addLook('reflective', [
    box('reflective-left', 0xf7f3e6, [0.05, 0.64, 0.018], [-0.23, 1.1, 0.48], 0x222222),
    box('reflective-right', 0x1df6e3, [0.05, 0.64, 0.018], [0.23, 1.1, 0.48], 0x063a36),
    box('reflective-belt', 0x8e5cff, [0.6, 0.04, 0.018], [0, 0.78, 0.48], 0x17102e),
  ]);
  addLook('gloves', [
    box('glove-left', 0x05070b, [0.17, 0.15, 0.17], [-0.35, 0.56, 0.08]),
    box('glove-right', 0x05070b, [0.17, 0.15, 0.17], [0.35, 0.56, 0.08]),
  ]);
  addLook('mask', [
    box('face-mask', 0x05070b, [0.23, 0.08, 0.035], [0, 1.71, 0.265]),
    box('mask-line', 0xff3f9c, [0.19, 0.016, 0.04], [0, 1.72, 0.29], 0x3d071f),
  ]);
  addLook('tour', [
    box('tour-coat-body', 0x0a0d13, [0.82, 0.9, 0.07], [0, 0.98, 0.435]),
    box('tour-coat-tail', 0x0a0d13, [0.68, 0.42, 0.06], [0, 0.48, -0.08]),
    box('tour-id', 0xffc857, [0.16, 0.1, 0.018], [0.24, 1.32, 0.49], 0x3a2604),
  ]);
  addLook('led', [
    box('led-strip-l', 0x1df6e3, [0.045, 0.76, 0.025], [-0.27, 1.08, 0.49], 0x0aaea0),
    box('led-strip-r', 0xff3f9c, [0.045, 0.76, 0.025], [0.27, 1.08, 0.49], 0xa61053),
    box('led-waist', 0x43ff9b, [0.62, 0.045, 0.025], [0, 0.78, 0.49], 0x15914f),
  ]);
  addLook('pro-fit', [
    box('pro-chest', 0x0c1018, [0.78, 0.76, 0.07], [0, 1.08, 0.45]),
    box('pro-panel', 0x1df6e3, [0.18, 0.44, 0.025], [-0.18, 1.14, 0.5], 0x0aaea0),
    box('pro-panel-2', 0xff3f9c, [0.18, 0.44, 0.025], [0.18, 1.14, 0.5], 0xa61053),
    box('pro-shoulder-left', 0x2b313b, [0.26, 0.1, 0.25], [-0.42, 1.48, 0.02]),
    box('pro-shoulder-right', 0x2b313b, [0.26, 0.1, 0.25], [0.42, 1.48, 0.02]),
  ]);
  looks.forEach((look) => {
    look.visible = false;
    look.traverse((part) => {
      if (part.isMesh) part.castShadow = true;
    });
  });
  return looks;
}

function applyAppearanceToPlayer() {
  if(player?.userData.realistic){applyHumanAppearance();return;}
  if (!player || !profile) return;
  const appearance = clothingPreview || profile.appearance;
  const shirtColor = CLOTHING_COLORS[appearance.shirtColor] || 0x11141a;
  const pantsColor = CLOTHING_COLORS[appearance.pants] || 0x0b0d12;
  const shoeColor = CLOTHING_COLORS[appearance.shoes] || 0x1df6e3;
  const hairStyle = appearance.hairStyle || 'cap';
  const hairColor = HAIR_COLORS[appearance.hairColor] || 0x08090d;
  const shirtStyle = appearance.shirt || 'neon';
  const activeShirtLooks = new Set([shirtStyle]);
  if (shirtStyle === 'pro-fit') activeShirtLooks.add('led');
  player.children.forEach((child) => {
    if (['hoodie', 'shirt-detail', 'sleeve'].includes(child.name)) {
      child.traverse((part) => {
        if (part.material?.color) part.material.color.set(shirtColor);
      });
    }
    if (['pants', 'pants-detail'].includes(child.name)) child.material.color.set(pantsColor);
    if (child.name === 'shoe-body') child.material.color.set(new THREE.Color(shoeColor).multiplyScalar(0.16));
    if (child.name === 'shoeGlow') child.material.color.set(shoeColor);
    if (child.name === 'headphones') child.visible = Boolean(profile.appearance.headphones);
    if (child.name?.startsWith('shirt-look-')) {
      const lookName = child.name.replace('shirt-look-', '');
      child.visible = activeShirtLooks.has(lookName);
    }
    if (child.name?.startsWith('pants-look-')) {
      child.visible = child.name === `pants-look-${appearance.pants}`;
    }
    if (child.name?.startsWith('hair-')) {
      child.visible = child.name === `hair-${hairStyle}`;
      child.traverse((part) => {
        if (part.material?.color) part.material.color.set(hairStyle === 'cap' ? 0x15161b : hairColor);
      });
    }
    if (child.name === 'logo') {
      child.material.map = createVjLogoTexture(appearance.shirt || 'neon');
      child.material.needsUpdate = true;
    }
  });
}

function createFabricTexture() {
  const fabricCanvas = document.createElement('canvas');
  fabricCanvas.width = 128;
  fabricCanvas.height = 128;
  const ctx = fabricCanvas.getContext('2d');
  ctx.fillStyle = '#252a33';
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 760; i += 1) {
    const shade = 24 + Math.floor(Math.random() * 40);
    ctx.fillStyle = `rgba(${shade}, ${shade + 2}, ${shade + 10}, 0.18)`;
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 2, 1);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.035)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 128; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(128, y + 2);
    ctx.stroke();
  }
  for (let x = 0; x < 128; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 2, 128);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(fabricCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.4, 2.4);
  texture.anisotropy = 4;
  return texture;
}

function buildClipPicker() {
  clipList.innerHTML='';
  ClipBrowser.mount(clipList,videoClips,index=>selectVideo(index),currentVideoIndex);
}

function selectVideo(index) {
  if (liveShow) { liveShow.prepare(index); return; }
  currentVideoIndex = index;
  document.querySelectorAll('.clip-card').forEach((button) => {
    button.classList.toggle('selected', Number(button.dataset.clip) === index);
  });
  loadVideoTexture(videoClips[index].src);
  rigs.forEach((rig) => applyProjectionTexture(rig));
  message.textContent = 'Clip change. Les projecteurs connectes recoivent le nouveau signal.';
}

function loadVideoTexture(src) {
  if (videoElement) {
    videoElement.pause();
    videoElement.src = '';
  }
  if (clipTexture) clipTexture.dispose();
  videoElement = document.createElement('video');
  videoElement.src = src;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.autoplay = true;
  videoElement.playsInline = true;
  videoElement.preload = 'auto';
  if (!profile.settings.stillVisuals) videoElement.play().catch(() => {});
  window.addEventListener('pointerdown', () => {if(!profile.settings.stillVisuals)videoElement.play().catch(() => {});}, { once: true });
  clipTexture = new THREE.VideoTexture(videoElement);
  clipTexture.colorSpace = THREE.SRGBColorSpace;
  clipTexture.anisotropy = 4;
}

function createTestCardTexture() {
  const cardCanvas = document.createElement('canvas');
  cardCanvas.width = 1024;
  cardCanvas.height = 576;
  const ctx = cardCanvas.getContext('2d');
  ctx.fillStyle = '#05070b';
  ctx.fillRect(0, 0, 1024, 576);
  ['#ffffff', '#f7e84f', '#29e6df', '#28d950', '#e43cff', '#f13c4f', '#2936ff'].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(index * (1024 / 7), 0, 1024 / 7 + 1, 260);
  });
  ctx.fillStyle = '#10131a';
  ctx.fillRect(0, 260, 1024, 316);
  ctx.strokeStyle = '#1df6e3';
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, 968, 520);
  ctx.strokeStyle = '#ff3f9c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(62, 520);
  ctx.lineTo(962, 308);
  ctx.moveTo(62, 308);
  ctx.lineTo(962, 520);
  ctx.stroke();
  ctx.fillStyle = '#fff8e8';
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('TEST CARD DAMIEN', 512, 392);
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#1df6e3';
  ctx.fillText('CONNECTE LE PROJECTEUR POUR ENVOYER LE CLIP VJ', 512, 444);
  const texture = new THREE.CanvasTexture(cardCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createVjLogoTexture(variant = 'neon') {
  const variants = {
    neon: ['#16d9d0', '#ff3f9c', 'triangle'],
    minimal: ['#f7f3e6', '#8a8d96', 'bars'],
    glitch: ['#ff3f9c', '#8e5cff', 'glitch'],
    wave: ['#1df6e3', '#216bff', 'wave'],
    laser: ['#43ff9b', '#1df6e3', 'laser'],
    cube: ['#ffc857', '#ff4e5f', 'cube'],
    equalizer: ['#1df6e3', '#43ff9b', 'equalizer'],
    orbit: ['#8e5cff', '#1df6e3', 'orbit'],
    prism: ['#ffc857', '#ff3f9c', 'prism'],
    chrome: ['#f7f3e6', '#7d8596', 'chrome'],
  };
  const [primary, secondary, shape] = variants[variant] || variants.neon;
  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = 256;
  logoCanvas.height = 256;
  const ctx = logoCanvas.getContext('2d');
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = shape === 'chrome' ? '#dfe5ee' : '#f7f3e6';
  ctx.font = 'bold 74px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('VJ', 128, 76);
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = secondary;
  ctx.fillStyle = primary;
  if (shape === 'bars') {
    [78, 104, 130, 156, 182].forEach((x, index) => {
      ctx.fillStyle = index % 2 ? secondary : primary;
      ctx.fillRect(x, 118 - index * 7, 15, 86 + index * 7);
    });
  } else if (shape === 'glitch') {
    ctx.fillRect(66, 118, 94, 18);
    ctx.fillStyle = secondary;
    ctx.fillRect(96, 150, 96, 18);
    ctx.fillStyle = primary;
    ctx.fillRect(76, 184, 74, 16);
    ctx.strokeStyle = '#f7f3e6';
    ctx.beginPath();
    ctx.moveTo(62, 112);
    ctx.lineTo(194, 204);
    ctx.stroke();
  } else if (shape === 'wave') {
    ctx.beginPath();
    ctx.moveTo(48, 158);
    for (let x = 48; x <= 208; x += 20) {
      ctx.quadraticCurveTo(x + 10, x % 40 === 0 ? 105 : 205, x + 20, 158);
    }
    ctx.strokeStyle = primary;
    ctx.stroke();
    ctx.strokeStyle = secondary;
    ctx.beginPath();
    ctx.moveTo(50, 192);
    ctx.lineTo(206, 116);
    ctx.stroke();
  } else if (shape === 'laser') {
    [78, 116, 154].forEach((x) => {
      ctx.strokeStyle = x === 116 ? secondary : primary;
      ctx.beginPath();
      ctx.moveTo(x, 112);
      ctx.lineTo(128, 214);
      ctx.stroke();
    });
  } else if (shape === 'cube') {
    ctx.strokeStyle = primary;
    ctx.strokeRect(72, 122, 80, 80);
    ctx.strokeStyle = secondary;
    ctx.strokeRect(104, 100, 80, 80);
    ctx.beginPath();
    ctx.moveTo(72, 122);
    ctx.lineTo(104, 100);
    ctx.moveTo(152, 122);
    ctx.lineTo(184, 100);
    ctx.moveTo(152, 202);
    ctx.lineTo(184, 180);
    ctx.stroke();
  } else if (shape === 'equalizer') {
    [64, 90, 116, 142, 168, 194].forEach((x, index) => {
      ctx.fillStyle = index % 2 ? secondary : primary;
      ctx.fillRect(x, 198 - index * 15, 16, 22 + index * 15);
    });
  } else if (shape === 'orbit') {
    ctx.strokeStyle = primary;
    ctx.beginPath();
    ctx.ellipse(128, 158, 82, 30, -0.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = secondary;
    ctx.beginPath();
    ctx.ellipse(128, 158, 82, 30, 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.arc(178, 120, 14, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'prism') {
    ctx.beginPath();
    ctx.moveTo(128, 104);
    ctx.lineTo(204, 208);
    ctx.lineTo(52, 208);
    ctx.closePath();
    ctx.strokeStyle = primary;
    ctx.stroke();
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.moveTo(128, 124);
    ctx.lineTo(168, 190);
    ctx.lineTo(88, 190);
    ctx.closePath();
    ctx.fill();
  } else if (shape === 'chrome') {
    const gradient = ctx.createLinearGradient(54, 112, 206, 210);
    gradient.addColorStop(0, primary);
    gradient.addColorStop(0.45, '#6e778a');
    gradient.addColorStop(1, secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(62, 112, 132, 92);
    ctx.clearRect(82, 132, 92, 52);
  } else {
    ctx.beginPath();
    ctx.moveTo(76, 104);
    ctx.lineTo(76, 205);
    ctx.lineTo(158, 156);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.moveTo(160, 156);
    ctx.lineTo(180, 205);
    ctx.lineTo(76, 205);
    ctx.closePath();
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(logoCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const liveDelta = Math.min((now - liveFrameAt) / 1000, 0.25);
  liveFrameAt = now;
  if (liveShow && !runFinished && !document.hidden && document.body.classList.contains('screen-gig')) {
    liveShow.tick(liveDelta);
    if (liveTexture) liveTexture.needsUpdate = true;
  }
  const delta = Math.min(clock.getDelta(), 0.033);
  updateControls(delta);
  updateRigs();
  updateCamera();
  updateMusicEqualizer();
  updateGigHud();
  const t = clock.elapsedTime;
  if (player?.children[0] && !player.userData.realistic && !profile.settings.reducedMotion) player.children[0].position.y = 1.05 + Math.sin(t * 7) * 0.018;
  updateHumanCharacter(delta);
  if ((document.body.classList.contains('screen-creator') || document.body.classList.contains('shop-closet')) && player) {
    player.rotation.y = document.body.classList.contains('shop-closet')?0:Math.sin(t * 0.42) * 0.18;
  } else if (document.body.classList.contains('screen-gig') && player) {
    player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, Math.PI, 0.08);
  } else if (player) {
    player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, -0.08, 0.08);
  }
  rigs.forEach((rig) => {
    if (!profile.settings.reducedMotion) rig.projector.pad.rotation.z += 0.025;
    rig.beam.material.opacity = rig.cable.connected ? 0.08 + Math.sin(t * 4 + rig.index) * 0.012 : 0.045;
  });
  window.StudioWorld?.tick(liveDelta);
  window.FirstShowCoach?.tick(liveDelta);
  window.ClubAtmosphere?.tick();
  window.VenueDesign?.tick();
  renderer.render(scene, camera);
}

function updateControls(delta) {
  if (!document.body.classList.contains('screen-gig') || rigs.length === 0 || runFinished || liveShow) return;
  const rig = rigs[activeRigIndex];
  const c = rig.calibration;
  const moveSpeed = delta * 2.15;
  const angleSpeed = delta * 0.44;
  const controlActive = hasProjectorInput();
  if (controlActive && !controlWasActive) pushHistory();
  controlWasActive = controlActive;

  if (!rig.lockedHorizontal && keys.has('arrowleft')) c.projectorX -= moveSpeed;
  if (!rig.lockedHorizontal && keys.has('arrowright')) c.projectorX += moveSpeed;
  if (!rig.lockedDepth && keys.has('arrowup')) c.projectorZ -= moveSpeed;
  if (!rig.lockedDepth && keys.has('arrowdown')) c.projectorZ += moveSpeed;
  if (keys.has('a')) c.yaw += angleSpeed;
  if (keys.has('d')) c.yaw -= angleSpeed;
  if (keys.has('w')) c.pitch += angleSpeed;
  if (keys.has('s')) c.pitch -= angleSpeed;

  c.projectorX = rig.lockedHorizontal ? rig.initialProjectorX : THREE.MathUtils.clamp(c.projectorX, rig.screen.x - 3.2, rig.screen.x + 3.2);
  c.projectorZ = rig.lockedDepth ? rig.initialProjectorZ : THREE.MathUtils.clamp(c.projectorZ, 3.1, 6.2);
  c.yaw = THREE.MathUtils.clamp(c.yaw, -0.42, 0.42);
  c.pitch = THREE.MathUtils.clamp(c.pitch, -0.42, 0.42);
  if (!controlActive) {
    if (!rig.lockedHorizontal) c.projectorX = snapTo(c.projectorX, rig.screen.x, 0.055);
    if (!rig.lockedDepth) c.projectorZ = snapTo(c.projectorZ, TARGET_Z, 0.055);
    c.yaw = snapTo(c.yaw, 0, 0.012);
    c.pitch = snapTo(c.pitch, 0, 0.012);
  }
}

function updateRigs() {
  if (rigs.length === 0) return;
  const scores = rigs.map((rig) => {
    updateProjector(rig);
    rig.corners = calculateProjectionCorners(rig);
    updateProjectionMeshes(rig);
    updateBeam(rig);
    updateScore(rig);
    window.PolygonMapping?.update(rig);
    return rig.calibration;
  });
  aggregateScore.coverage = Math.round(scores.reduce((sum, score) => sum + score.coverage, 0) / scores.length);
  aggregateScore.trapeze = Math.round(scores.reduce((sum, score) => sum + score.trapeze, 0) / scores.length);
  aggregateScore.mask = Math.round(rigs.reduce((sum, rig) => sum + rig.maskQuality, 0) / rigs.length);
}

function updateProjector(rig) {
  const c = rig.calibration;
  const movement = Math.hypot(c.projectorX - rig.lastProjectorX, c.projectorZ - rig.lastProjectorZ);
  rig.projector.group.position.x = c.projectorX;
  rig.projector.group.position.z = c.projectorZ;
  rig.projector.group.rotation.y = c.yaw * 0.68;
  rig.projector.head.rotation.x = -c.pitch * 0.55;
  rig.projector.wheels.forEach((wheel) => {
    wheel.rotation.x += movement * 4.5;
  });
  updateCable(rig);
  rig.lastProjectorX = c.projectorX;
  rig.lastProjectorZ = c.projectorZ;
}

function calculateProjectionCorners(rig) {
  const c = rig.calibration;
  const localX = c.projectorX - rig.screen.x;
  const distanceScale = 1 + (c.projectorZ - TARGET_Z) * 0.18;
  const baseW = rig.screen.width * distanceScale;
  const baseH = rig.screen.height * distanceScale;
  const centerX = localX * 0.72 + c.yaw * 2.15;
  const centerY = (c.projectorZ - TARGET_Z) * 0.24 - c.pitch * 1.05;
  const topW = baseW * (1 + c.pitch * 0.62);
  const bottomW = baseW * (1 - c.pitch * 0.62);
  const leftH = baseH * (1 + c.yaw * 0.58);
  const rightH = baseH * (1 - c.yaw * 0.58);
  const skewX = c.yaw * 0.72;
  const skewY = c.pitch * 0.42;
  return [
    new THREE.Vector2(centerX - topW / 2 + skewX, centerY + leftH / 2 + skewY),
    new THREE.Vector2(centerX + topW / 2 + skewX, centerY + rightH / 2 - skewY),
    new THREE.Vector2(centerX + bottomW / 2 - skewX, centerY - rightH / 2 - skewY),
    new THREE.Vector2(centerX - bottomW / 2 - skewX, centerY - leftH / 2 + skewY),
  ];
}

function updateProjectionMeshes(rig) {
  applyProjectionTexture(rig);
  setProjectionGeometry(rig.wallProjection, rig.corners, false, rig.screen);
  setProjectionGeometry(rig.screenProjection, rig.corners, true, rig.screen);
  const ready = rig.calibration.coverage >= 96 && rig.calibration.trapeze >= 96;
  rig.screenProjection.material.opacity = (ready ? 0.96 : 0.62 + rig.calibration.coverage / 300) * GearCapabilities.brightness(GearCapabilities.selected('projector'));
  rig.wallProjection.material.opacity = rig.cable.connected ? 0.22 : 0.09;
}

function applyProjectionTexture(rig) {
  const texture = rig.cable.connected ? (liveTexture || clipTexture) : testCardTexture;
  [rig.screenProjection, rig.wallProjection, rig.beam].forEach((mesh) => {
    if (mesh.material.map !== texture) {
      mesh.material.map = texture;
      mesh.material.needsUpdate = true;
    }
  });
}

function setProjectionGeometry(mesh, corners, clipToScreen, screen) {
  const source = [
    { position: corners[0], uv: new THREE.Vector2(0, 1) },
    { position: corners[1], uv: new THREE.Vector2(1, 1) },
    { position: corners[2], uv: new THREE.Vector2(1, 0) },
    { position: corners[3], uv: new THREE.Vector2(0, 0) },
  ];
  const vertices = clipToScreen ? clipPolygonToScreen(source, screen) : source;
  if (vertices.length < 3) {
    mesh.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
    mesh.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(0), 2));
    mesh.geometry.setIndex([]);
    return;
  }
  const positions = [];
  const uvs = [];
  const indices = [];
  vertices.forEach((vertex) => {
    positions.push(vertex.position.x, vertex.position.y, 0);
    uvs.push(vertex.uv.x, vertex.uv.y);
  });
  for (let i = 1; i < vertices.length - 1; i += 1) indices.push(0, i, i + 1);
  mesh.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  mesh.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
  mesh.geometry.setIndex(indices);
  mesh.geometry.computeBoundingSphere();
}

function clipPolygonToScreen(vertices, screen) {
  const left = -screen.width / 2;
  const right = screen.width / 2;
  const bottom = -screen.height / 2;
  const top = screen.height / 2;
  let output = vertices;
  output = clipAgainst(output, (p) => p.x >= left, (a, b) => intersectAtX(a, b, left));
  output = clipAgainst(output, (p) => p.x <= right, (a, b) => intersectAtX(a, b, right));
  output = clipAgainst(output, (p) => p.y >= bottom, (a, b) => intersectAtY(a, b, bottom));
  output = clipAgainst(output, (p) => p.y <= top, (a, b) => intersectAtY(a, b, top));
  return output;
}

function clipAgainst(vertices, inside, intersect) {
  if (vertices.length === 0) return [];
  const output = [];
  for (let i = 0; i < vertices.length; i += 1) {
    const current = vertices[i];
    const previous = vertices[(i + vertices.length - 1) % vertices.length];
    const currentInside = inside(current.position);
    const previousInside = inside(previous.position);
    if (currentInside) {
      if (!previousInside) output.push(intersect(previous, current));
      output.push(current);
    } else if (previousInside) {
      output.push(intersect(previous, current));
    }
  }
  return output;
}

function intersectAtX(a, b, x) {
  return interpolateVertex(a, b, (x - a.position.x) / (b.position.x - a.position.x || 0.00001));
}

function intersectAtY(a, b, y) {
  return interpolateVertex(a, b, (y - a.position.y) / (b.position.y - a.position.y || 0.00001));
}

function interpolateVertex(a, b, t) {
  return {
    position: new THREE.Vector2(
      THREE.MathUtils.lerp(a.position.x, b.position.x, t),
      THREE.MathUtils.lerp(a.position.y, b.position.y, t)
    ),
    uv: new THREE.Vector2(
      THREE.MathUtils.lerp(a.uv.x, b.uv.x, t),
      THREE.MathUtils.lerp(a.uv.y, b.uv.y, t)
    ),
  };
}

function updateBeam(rig) {
  const lens = rig.projector.head.localToWorld(new THREE.Vector3(0, 0, -0.45));
  const worldCorners = rig.corners.map((corner) => new THREE.Vector3(rig.screen.x + corner.x, SCREEN_Y + corner.y, SCREEN_Z));
  const triangles = [
    lens, worldCorners[0], worldCorners[1],
    lens, worldCorners[1], worldCorners[2],
    lens, worldCorners[2], worldCorners[3],
    lens, worldCorners[3], worldCorners[0],
  ];
  const position = rig.beam.geometry.attributes.position;
  triangles.forEach((point, index) => position.setXYZ(index, point.x, point.y, point.z));
  position.needsUpdate = true;
  rig.beam.geometry.computeBoundingSphere();
}

function updateCable(rig) {
  if (!rig.cable.connected) {
    rig.cable.mesh.visible = false;
    return;
  }
  const start = getLaptopPortPosition();
  const c = rig.calibration;
  const end = new THREE.Vector3(c.projectorX + Math.sin(c.yaw) * 0.22, c.mountIndex!=null?4.98:0.82, c.projectorZ + 0.58);
  const startFloor = new THREE.Vector3(start.x, 0.055, start.z + 0.12);
  const endFloor = new THREE.Vector3(end.x, 0.055, end.z + 0.22);
  const dx = endFloor.x - startFloor.x;
  const dz = endFloor.z - startFloor.z;
  const length = Math.hypot(dx, dz);
  const side = new THREE.Vector3(-dz || 0.1, 0, dx || 0.1).normalize();
  const slack = THREE.MathUtils.clamp(length * 0.18, 0.42, profile.gear.cable === 'long' ? 1.8 : 1.1);
  const points = [
    start,
    new THREE.Vector3(start.x, 0.28, start.z + 0.06),
    startFloor,
    new THREE.Vector3(startFloor.x + dx * 0.28 + side.x * slack, 0.045, startFloor.z + dz * 0.28 + side.z * slack),
    new THREE.Vector3(startFloor.x + dx * 0.55 - side.x * slack * 0.8, 0.045, startFloor.z + dz * 0.55 - side.z * slack * 0.8),
    new THREE.Vector3(startFloor.x + dx * 0.78 + side.x * slack * 0.55, 0.045, startFloor.z + dz * 0.78 + side.z * slack * 0.55),
    endFloor,
    new THREE.Vector3(end.x, 0.34, end.z + 0.1),
    end,
  ];
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.45);
  const nextGeometry = new THREE.TubeGeometry(curve, 56, 0.025, 7, false);
  rig.cable.mesh.geometry.dispose();
  rig.cable.mesh.geometry = nextGeometry;
  rig.cable.mesh.visible = true;
}

function getLaptopPortPosition() {
  return new THREE.Vector3((deskStation?.position.x ?? 0) - 0.42, 1.02, (deskStation?.position.z ?? 7.45) - 0.52);
}

function updateScore(rig) {
  const targetCorners = [
    new THREE.Vector2(-rig.screen.width / 2, rig.screen.height / 2),
    new THREE.Vector2(rig.screen.width / 2, rig.screen.height / 2),
    new THREE.Vector2(rig.screen.width / 2, -rig.screen.height / 2),
    new THREE.Vector2(-rig.screen.width / 2, -rig.screen.height / 2),
  ];
  const c = rig.calibration;
  const cornerError = rig.corners.reduce((sum, corner, index) => sum + corner.distanceTo(targetCorners[index]), 0) / 4;
  const angleError = Math.abs(c.yaw) + Math.abs(c.pitch);
  const distanceError = Math.abs(c.projectorZ - TARGET_Z) * 0.18;
  c.coverage = Math.max(0, Math.round(100 - cornerError * 26 - distanceError * 35));
  c.trapeze = Math.max(0, Math.round(100 - angleError * 165));
  if (c.coverage >= 98 && c.trapeze >= 99) {
    c.coverage = 100;
    c.trapeze = 100;
  }
}

function updateGigHud() {
  if (rigs.length === 0) return;
  window.CeilingMounts?.sync();
  const connected = rigs.filter((rig) => rig.cable.connected).length;
  const minScore = getGigMinimumScore(currentGig);
  const maskRequired = getGigMaskRequirement(currentGig);
  if (gigTimer) gigTimer.textContent = getGigTimerText();
  coverageCount.textContent = `${aggregateScore.coverage}%`;
  trapezeCount.textContent = `${aggregateScore.trapeze}%`;
  maskCount.textContent = `${aggregateScore.mask}%`;
  connectedCount.textContent = `${connected} / ${rigs.length}`;
  setMeterState(coverageMeter, aggregateScore.coverage, minScore);
  setMeterState(trapezeMeter, aggregateScore.trapeze, minScore);
  setMeterState(maskMeter, aggregateScore.mask, maskRequired);
  connectedMeter.classList.toggle('good', connected === rigs.length);
  connectedMeter.classList.toggle('warning', connected > 0 && connected < rigs.length);
  connectedMeter.classList.toggle('bad', connected === 0);
  updateQuestHudVisuals(connected, minScore);
  hudName.textContent = profile.name;
  undoButton.disabled = history.length === 0 || runFinished;
  connectProjectorButton.disabled = rigs[activeRigIndex]?.cable.connected || runFinished;
  connectProjectorButton.textContent = rigs[activeRigIndex]?.cable.connected ? 'Projo connecte' : 'Connecter projo';
  maskToolButton.classList.toggle('ready', penMode);
  maskToolButton.hidden = maskRequired === 0;
  maskMeter.hidden = maskRequired === 0;
  if(!document.querySelector('#mapping-zone-next')){
    const next=document.createElement('button');next.id='mapping-zone-next';next.textContent='Surface suivante';next.onclick=()=>PolygonMapping.next();maskToolButton.after(next);
    const clear=document.createElement('button');clear.id='mapping-zone-clear';clear.textContent='Refaire ce contour';clear.onclick=()=>PolygonMapping.clear();next.after(clear);
  }
  for(const id of ['mapping-zone-next','mapping-zone-clear']){const button=document.getElementById(id);button.hidden=!maskRequired||Boolean(liveShow);}

  if (maskRequired === 0 && penMode) penMode = false;
  const readyScore = connected === rigs.length &&
    aggregateScore.coverage >= minScore &&
    aggregateScore.trapeze >= minScore &&
    aggregateScore.mask >= maskRequired;
  const liveButton = document.querySelector('#start-live-button');
  liveButton.disabled = connected !== rigs.length || runFinished || Boolean(liveShow);
  liveButton.hidden = Boolean(liveShow);
  resetButton.disabled = Boolean(liveShow) || runFinished;
  const canFinish = Boolean(currentGig) && !runFinished;
  finishGigButton.textContent=liveShow?.completed?'Voir mon bilan':liveShow?'Arrêter le show':'Terminer';
  finishGigButton.hidden = !canFinish;
  finishGigButton.disabled = !canFinish;
  finishGigButton.classList.toggle('ready', readyScore && canFinish);
  if (document.body.classList.contains('screen-gig')) {
    objectiveText.textContent = getObjectiveLine(connected, minScore, maskRequired, readyScore);
    objectivePanel.classList.toggle('ready', readyScore && canFinish);
    objectivePanel.classList.toggle('warning', canFinish && !readyScore);
  }
}

function updateQuestHudVisuals(connected, minScore) {
  projectorSlots.forEach((slot, index) => {
    const rig = rigs[index];
    slot.hidden = index >= rigs.length;
    slot.classList.toggle('active', index === activeRigIndex && Boolean(rig));
    slot.classList.toggle('connected', Boolean(rig?.cable.connected));
  });
  const signalScore = Math.round(100 * connected / Math.max(1, rigs.length));
  const activeBars = Math.round((signalScore / 100) * signalBars.length);
  signalBars.forEach((bar, index) => {
    bar.classList.toggle('active', index < activeBars);
    bar.classList.toggle('ready', signalScore >= minScore);
  });
  if (installPrompt) {
    const activeRig = rigs[activeRigIndex];
    installPrompt.hidden = runFinished || !activeRig || activeRig.cable.connected;
    installPrompt.classList.toggle('ready', connected === rigs.length);
  }
}

function getObjectiveLine(connected, minScore, maskRequired, perfect) {
  if (liveShow) return liveShow.completed ? 'Prestation terminée. Ouvre le bilan avec Terminer.' : 'Suis les consignes du DJ dans la régie. Prépare tes clips en préview, puis envoie-les en fondu.';
  const activeRig = rigs[activeRigIndex];
  if(penMode&&maskRequired)return `Projecteur ${activeRigIndex+1}/${rigs.length} · surface ${(activeRig?.mappingZone||0)+1}/${activeRig?.mappingTargets?.length||1}. Suis le contour vert dans l’ordre. Précision ${activeRig?.maskQuality||0}/${maskRequired} %.`;
  if (connected < rigs.length) {
    return `${getTimeObjectivePrefix()}Brancher les sorties : ${connected}/${rigs.length}. Sans sortie connectée, aucun show livré et aucun paiement. Une connexion partielle plafonne le résultat.`;
  }
  if(CeilingMounts.required()&&activeRig?.calibration.mountIndex==null)return `Projecteur ${activeRigIndex+1} : choisis une fixation au plafond (A, B ou C). Les déplacements seront ensuite limités à ces points.`;
  if (aggregateScore.coverage < minScore || aggregateScore.trapeze < minScore) {
    const lockText = activeRig?.lockedDepth ? ' Profondeur bloquee: utilise surtout les angles W/S/A/D.' : '';
    return `${getTimeObjectivePrefix()}Mapper l'image: score ${aggregateScore.coverage} et trapeze ${aggregateScore.trapeze} sur objectif ${minScore}. Tu peux finir quand tu veux.${lockText}`;
  }
  if (aggregateScore.mask < maskRequired) {
    return `Tracer le contour avec la plume: ${aggregateScore.mask}/${maskRequired}. Le contour visible limite la projection, mais Terminer reste disponible.`;
  }
  if (perfect) {
    return 'Installation prête. Clique Lancer la prestation, puis accompagne les quatre moments musicaux.';
  }
  return `Projecteur ${activeRigIndex + 1}/${rigs.length}. Ajuste le mapping ou termine maintenant pour accepter la note actuelle.`;
}

function getTimeObjectivePrefix() {
  if (!currentGig?.timeLimitSeconds || !gigStartedAt) return '';
  const remaining = currentGig.timeLimitSeconds * 1000 - (performance.now() - gigStartedAt);
  if (remaining >= 0) return `Temps client ${formatGigTime(remaining)}. `;
  return `Temps depasse ${formatGigTime(Math.abs(remaining))}. `;
}

function formatGigTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function setMeterState(element, value, target) {
  if (!element) return;
  const safeTarget = Math.max(1, Number(target) || 1);
  const ratio = value / safeTarget;
  element.classList.toggle('good', ratio >= 1);
  element.classList.toggle('warning', ratio >= 0.72 && ratio < 1);
  element.classList.toggle('bad', ratio < 0.72);
}

function connectActiveProjector() {
  if (!document.body.classList.contains('screen-gig') || rigs.length === 0 || runFinished) return;
  const rig = rigs[activeRigIndex];
  if (rig.cable.connected) {
    message.textContent = `Projecteur ${activeRigIndex + 1} deja connecte. Choisis un autre projecteur ou commence le mapping.`;
    return;
  }
  rig.cable.connected = true;
  applyProjectionTexture(rig);
  updateCable(rig);
  updateActiveVisuals();
  const nextRig = rigs.findIndex((item) => !item.cable.connected);
  if (nextRig >= 0) {
    activeRigIndex = nextRig;
    updateActiveVisuals();
    message.textContent = `Projecteur connecte. Projecteur ${activeRigIndex + 1} selectionne: appuie sur E pour le brancher.`;
  } else {
    message.textContent = 'Tous les projecteurs sont connectes. Maintenant aligne le clip sur les ecrans.';
  }
  updateGigHud();
}

function togglePenMode() {
  if (liveShow) return;
  if (!document.body.classList.contains('screen-gig') || runFinished) return;
  penMode = !penMode;
  maskToolButton.classList.toggle('ready', penMode);
  message.textContent = penMode
    ? 'Plume : clique pour tracer (3 à 32 points), puis glisse les poignées jaunes pour corriger. Surface suivante change de zone.'
    : 'Plume inactive. Tu peux selectionner les projecteurs normalement.';
}

function toggleGigHelp() {
  if (!document.body.classList.contains('screen-gig')) return;
  document.body.classList.toggle('hide-gig-help');
  updateHelpButtonLabel();
}

function updateHelpButtonLabel() {
  if (!toggleHelpButton) return;
  const hidden = document.body.classList.contains('hide-gig-help');
  toggleHelpButton.textContent = hidden ? 'Afficher aide' : 'Cacher aide';
}

function addMaskPointFromHit(hit) {
  const rigIndex = hit.object.userData.rigIndex;
  const rig = rigs[rigIndex];
  if (!rig || runFinished) return true;
  activeRigIndex = rigIndex;
  const local = hit.point.clone();
  rig.screenProjection.worldToLocal(local);
  rig.maskPoints.push({ x: local.x, y: local.y });
  if (rig.maskPoints.length > 32) rig.maskPoints.pop();
  PolygonMapping.update(rig);
  updateMaskContour(rig);
  updateActiveVisuals();
  message.textContent = `Point plume ajoute sur projecteur ${rigIndex + 1}. Contour ${rig.maskQuality}%.`;
  return true;
}

function updateMaskContour(rig) {
  if (!rig?.maskContour) return;
  window.PolygonMapping?.update(rig);
  if (rig.maskPoints.length < 2) {
    rig.maskContour.visible = false;
    rig.maskContour.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
    return;
  }
  const positions = [];
  rig.maskPoints.forEach((point) => positions.push(point.x, point.y, 0));
  rig.maskContour.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  rig.maskContour.geometry.computeBoundingSphere();
  rig.maskContour.visible = true;
}

function resetGigRun() {
  if (liveShow) { notify('Le mapping est verrouillé pendant la prestation.'); return; }
  history.length = 0;
  controlWasActive = false;
  runFinished = false;
  if (document.body.classList.contains('screen-gig')) gigStartedAt = performance.now();
  rigs.forEach((rig) => {
    if(rig.mountOriginal){Object.assign(rig,rig.mountOriginal);rig.projector.group.position.y=0;rig.projector.group.children.forEach(o=>o.visible=o!==rig.mountBracket);}
    delete rig.calibration.mountIndex;
    rig.cable.connected = false;
    rig.cable.mesh.visible = false;
    rig.calibration.projectorX = rig.initialProjectorX;
    rig.calibration.projectorZ = rig.initialProjectorZ;
    rig.calibration.yaw = 0.24;
    rig.calibration.pitch = -0.18;
    rig.calibration.coverage = 0;
    rig.calibration.trapeze = 0;
    rig.maskPoints = [];
    if(rig.maskZones){rig.maskZones=rig.mappingTargets.map(()=>[]);rig.mappingZone=0;rig.maskPoints=rig.maskZones[0];}
    rig.maskQuality = getGigMaskRequirement(currentGig) === 0 ? 100 : 0;
    updateMaskContour(rig);
    applyProjectionTexture(rig);
  });
  updateRigs();
  updateActiveVisuals();
  message.textContent = 'Gig remis au depart. Test Card Damien active tant que les projecteurs ne sont pas connectes.';
  updateGigHud();
}

function pushHistory() {
  history.push(rigs.map((rig) => ({ ...rig.calibration })));
  if (history.length > 80) history.shift();
}

function undoCalibration() {
  if (liveShow || runFinished) return;
  const snapshot = history.pop();
  if (!snapshot || runFinished) return;
  snapshot.forEach((state, index) => Object.assign(rigs[index].calibration, state));
  updateRigs();
  message.textContent = 'Retour applique.';
  updateGigHud();
}

function startLivePerformance({restoring=false}={}) {
  if (!currentGig || runFinished || liveShow) return;
  if (!rigs.length || rigs.some(rig => !rig.cable.connected)) { notify('Branche toutes les sorties avant la prestation.'); return; }
  if(!restoring&&CeilingMounts.required()&&rigs.some(r=>r.calibration.mountIndex==null)){notify('Choisis un point de fixation au plafond pour chaque projecteur.');return;}
  if(!restoring&&getGigMaskRequirement(currentGig)>0&&rigs.some(r=>r.maskQuality<getGigMaskRequirement(currentGig))){notify(`Trace chaque surface : précision minimale ${getGigMaskRequirement(currentGig)} %. Utilise Plume, puis Surface suivante.`);return;}
  penMode = false;
  liveSetupElapsed = gigStartedAt ? performance.now() - gigStartedAt : 0;
  const root = document.querySelector('#live-show-desk');
  liveShow = new VJLiveShow(root, videoClips);
  liveShow.start(currentVideoIndex);
  liveTexture = new THREE.CanvasTexture(liveShow.canvas);
  liveTexture.colorSpace = THREE.SRGBColorSpace;
  root.hidden = false;
  document.body.classList.add('live-performance');
  keys.clear();
  message.textContent = 'La salle est en programme. Prépare le prochain visuel hors diffusion puis envoie-le en fondu.';
  rigs.forEach(applyProjectionTexture);
  updateGigHud();
}

function stopLivePerformance() {
  if (liveShow) liveShow.dispose();
  liveShow = null;
  if (liveTexture) liveTexture.dispose();
  liveTexture = null;
  liveSetupElapsed = null;
  document.body.classList.remove('live-performance');
  document.querySelector('#live-show-desk').hidden = true;
  rigs.forEach(applyProjectionTexture);
}

function finishGig() {
  if (!currentGig || runFinished) return;
  const connected = rigs.filter((rig) => rig.cable.connected).length;
  const minScore = getGigMinimumScore(currentGig);
  const maskRequired = getGigMaskRequirement(currentGig);
  const elapsed = liveSetupElapsed ?? (gigStartedAt ? performance.now() - gigStartedAt : 0);
  const liveResult = liveShow?.result() || {score:0, completion:0, transitions:0, seconds:0};
  runFinished = true;
  profile.activeRun = null;
  const connectedRatio = rigs.length ? connected / rigs.length : 0;
  const maskScore = maskRequired > 0 ? aggregateScore.mask : 100;
  const mappingScore = Math.round(
    aggregateScore.coverage * 0.45 +
    aggregateScore.trapeze * 0.35 +
    maskScore * 0.2
  );
  const connectionPenalty = Math.round((1 - connectedRatio) * 42);
  const placementPenalty = activeGigLoadout?.selected?.placement?.penalty || 0;
  const timePenalty = currentGig.timeLimitSeconds && elapsed / 1000 > currentGig.timeLimitSeconds
    ? Math.min(22, Math.round((elapsed / 1000 - currentGig.timeLimitSeconds) / 12))
    : 0;
  const baseSkill = Math.round(clamp(mappingScore * connectedRatio - connectionPenalty - placementPenalty - timePenalty, 0, 100));
  const result = calculateCareerScore(baseSkill, currentGig, activeGigLoadout, {
    mappingScore,
    live: liveResult,
    connectedRatio,
    connectionPenalty,
    placementPenalty,
    timePenalty,
    elapsed,
  });
  if(liveResult.completion===1&&result.score>=minScore)window.VJLearning?.complete('contract');
  const runGrade = result.grade;
  gigStartedAt = null;
  const rentalCost = activeGigLoadout?.rentalCost || 0;
  const transportCost = activeGigLoadout?.transportCost || 0;
  const finalQuality = getFinalGigQuality(result.score);
  const paymentRatio = connected === 0 ? 0 : getPaymentRatioFromScore(result.score, profile.stats.reputation) * liveResult.completion;
  const money = Math.max(0, Math.round(currentGig.budget * paymentRatio));
  const xp = liveResult.completion === 0 ? 0 : finalQuality.stars === 3 ? 165 : finalQuality.stars === 2 ? 110 : 55;
  const repGain = liveResult.completion === 0 ? 0 : finalQuality.stars === 3 ? 9 : finalQuality.stars === 2 ? 3 : -6;
  const creativityGain = Math.round(result.score / 28);
  const creativitySpend = Math.min(24, 5 + rigs.length * 2 + Math.max(0, Number(currentGig.zoneCount) - 1) + (currentGig.timeLimitSeconds ? 3 : 0));
  const creativityDelta = creativityGain - creativitySpend;
  const techniqueGain = Math.round(result.score / 25);
  const fatigueGain = clamp(12 + rigs.length * 2 + Math.round((100 - result.professional) / 18), 10, 26);
  const clipsUsed = activeGigLoadout?.selected?.vjloop?.quantity || 1;
  profile.money += money;
  const paymentTransfer = recordFinance(money, `Cachet · ${currentGig.title}`, {counterparty:currentGig.venue||currentGig.title});
  profile.stats.reputation = clamp(profile.stats.reputation + repGain, 0, 100);
  profile.stats.fatigue = clamp(profile.stats.fatigue + fatigueGain, 0, 100);
  profile.stats.creativity = clamp(profile.stats.creativity + creativityDelta, 0, 100);
  profile.stats.technique = clamp(profile.stats.technique + techniqueGain, 0, 100);
  applyHypeFromGig(currentGig, result);
  profile.styleXp[currentGig.style] = (profile.styleXp[currentGig.style] || 0) + Math.round(result.score / 12);
  const gainedSkills = rewardSkillPracticeFromGig(currentGig, result.score, minScore);
  addXp(xp);
  recordDayActivity('gig', `${currentGig.title} ${result.score} pts`);
  addEmail('Client', `Paiement: ${currentGig.title}`, `Merci pour le gig. Resultat ${result.gradeLabel}, satisfaction client ${result.clientSatisfaction}/100. Location ${rentalCost}$ et Uver ${transportCost}$ payes avant entree. Paiement recu: ${money}$.`);
  addPhoneMessage(
    currentGig.venue,
    result.gradeLabel,
    result.clientSatisfaction >= 84
      ? `Le show a circule dans les stories. ${result.bonuses[0] || 'Belle reaction du crowd'}.`
      : `Le client a des notes pour toi: ${result.penalties[0] || 'show correct mais perfectible'}.`,
    'story'
  );
  currentGig.status = 'done';
  currentGig.lastCompletedDay = profile.day;
  currentGig.timesCompleted = (currentGig.timesCompleted || 0) + 1;
  profile.showSessions=Number(profile.showSessions||0)+1;currentGig.lastSessionNumber=profile.showSessions;
  currentGig.lastPayout = money;
  currentGig.lastScore = result.score;
  currentGig.bestScore = Math.max(currentGig.bestScore||0,result.score);
  currentGig.bestQualifiedScore = Math.max(currentGig.bestQualifiedScore||0,liveResult.completion>=1?result.score:0);
  unlockGigs();
  const clientFeedback=ClientRelations.complete(currentGig,result,liveResult);
  saveSlots();
  const observedPhases=(liveResult.phases||[]).filter(p=>p.seconds>1);
  const weakestPhase=[...observedPhases].sort((a,b)=>a.matched/a.seconds-b.matched/b.seconds)[0];
  const energyAdvice=weakestPhase&&weakestPhase.matched/weakestPhase.seconds<.8?`Travaille le ${weakestPhase.name.toLowerCase()} : ton intensité était dans la zone pendant ${Math.round(weakestPhase.matched)} s sur ${Math.round(weakestPhase.seconds)} s observées.`:'';
  resultContent.innerHTML = `
    <div class="result-list">
      <div class="contract-debrief"><section class="client-reaction"><small>TON CLIENT</small><p>${escapeHtml(clientFeedback)}</p>${ClientRelations.markup(currentGig)}</section>
        <p class="performance-coaching">${liveResult.completion >= 1 ? 'Tu as livré ton show jusqu’au bout.' : liveResult.seconds > 0 ? 'Tu as commencé à jouer en live. Termine la prestation au prochain essai.' : 'Le live n’a pas été lancé. Connecte le projecteur, puis démarre le show.'}</p>
        <div><small>CE QUI A FONCTIONNÉ</small><p>${liveResult.seconds > 0 && liveResult.score >= 80 ? 'Tu as bien accompagné l’énergie musicale.' : connectedRatio >= 1 ? 'Tes projecteurs reçoivent le signal.' : 'Tu as repéré les étapes de préparation du contrat.'} ${liveResult.transitions > 0 ? 'Tu as réalisé un changement en fondu.' : ''} ${liveResult.syncedTransitions > 0 ? `${liveResult.syncedTransitions} fondu(s) terminé(s) sur le temps 1.` : ''}</p></div>
        <div><small>AU PROCHAIN ESSAI</small><p>${connectedRatio < 1 ? 'Vérifie chaque connexion avant de lancer le show.' : aggregateScore.trapeze < 80 ? 'Corrige le trapèze avant le live pour cadrer l’image sur le mur.' : energyAdvice ? energyAdvice : liveResult.score < 80 ? 'Ajuste l’intensité dès que le moment musical change.' : liveResult.transitions === 0 ? 'Prépare une deuxième image, puis termine un fondu.' : 'Rejoue avec d’autres visuels en conservant ce contrôle de l’intensité.'}</p></div>
        ${gainedSkills.length ? `<p class="contract-practiced">Progression des compétences : ${escapeHtml(gainedSkills.join(', '))}.</p>` : ''}
        <p class="contract-earned">Cachet reçu <strong>${money} $</strong><span>Après transport et location : ${money - rentalCost - transportCost} $</span></p>
        ${paymentTransfer ? '<button class="secondary-action" data-payment-receipt>Voir le reçu bancaire</button>' : ''}
        <p class="contract-practiced">Gestes travaillés : connexion, cadrage${liveResult.seconds > 0 ? ', intensité en live' : ''}${liveResult.transitions > 0 ? ', transition' : ''}.</p>
      </div>
      <details class="contract-details"><summary>Voir les critères et les dépenses</summary>
      <div class="result-row big-result"><span>Qualite finale</span><strong>${renderShowStars(finalQuality.stars)} ${escapeHtml(finalQuality.label)}</strong></div>
      <div class="result-row"><span>Résultat détaillé</span><strong>${result.gradeLabel}</strong></div>
      <div class="result-row"><span>${result.observed ? 'Installation et cadrage · 45 %' : 'Qualité de projection'}</span><strong>${result.technical}/100</strong></div>
      <div class="result-row"><span>${result.observed ? 'Intensité musicale · 45 %' : 'Préparation et consignes live'}</span><strong>${result.artistic}/100</strong></div>
      <div class="result-row"><span>Satisfaction du client</span><strong>${result.clientSatisfaction}/100</strong></div>
      <div class="result-row"><span>${result.observed ? 'Fondu terminé · 10 %' : 'Conditions de prestation'}</span><strong>${result.professional}/100</strong></div>
      <div class="result-row"><span>Résultat du show</span><strong>${result.score}/100</strong></div>
      <div class="result-row"><span>Rang live</span><strong>${runGrade}</strong></div>
      <div class="result-row"><span>Temps de montage</span><strong>${formatGigTime(elapsed)}</strong></div>
      <div class="result-row"><span>Prestation jouée</span><strong>${liveResult.seconds} / 60 s (${Math.round(liveResult.completion * 100)} %)</strong></div>
      <div class="result-row"><span>Respect des consignes d’intensité</span><strong>${liveResult.score}/100</strong></div>
      <div class="result-row"><span>Fondus réalisés</span><strong>${liveResult.transitions}</strong></div>
      <div class="result-row"><span>Objectif contrat</span><strong>${minScore}/100</strong></div>
      <div class="result-row"><span>Projecteurs connectes</span><strong>${connected}/${rigs.length}</strong></div>
      <div class="result-row"><span>Plume / contour</span><strong>${aggregateScore.mask}/100</strong></div>
      <div class="result-row"><span>Bon coups</span><strong>${escapeHtml(result.bonuses.join(', ') || 'Aucun bonus special')}</strong></div>
      <div class="result-row"><span>A ameliorer</span><strong>${escapeHtml(result.penalties.join(', ') || 'Aucune pénalité supplémentaire')}</strong></div>
      <div class="result-row"><span>Location avant gig</span><strong>-${rentalCost}$</strong></div>
      <div class="result-row"><span>Transport Uver</span><strong>-${transportCost}$</strong></div>
      <div class="result-row"><span>Argent gagne</span><strong>+${money}$ (${Math.round(paymentRatio * 100)}%)</strong></div>
      <div class="result-row"><span>Résultat net du contrat</span><strong>${money - rentalCost - transportCost}$</strong></div>
      <div class="result-row"><span>XP</span><strong>+${xp}</strong></div>
      <div class="result-row"><span>Reputation</span><strong>${repGain >= 0 ? '+' : ''}${repGain}</strong></div>
      <div class="result-row"><span>Creativite</span><strong>${creativityDelta >= 0 ? '+' : ''}${creativityDelta} (${creativityGain} inspire - ${creativitySpend} depense)</strong></div>
      <div class="result-row"><span>Technique gagnee</span><strong>+${techniqueGain}</strong></div>
      <div class="result-row"><span>Fatigue</span><strong>+${fatigueGain}</strong></div>
      <div class="result-row"><span>Clips utilises</span><strong>${clipsUsed}</strong></div>
      ${gainedSkills.length ? `<div class="result-row"><span>Competence gagnee</span><strong>${escapeHtml(gainedSkills.join(', '))}</strong></div>` : ''}
      </details>
    </div>
  `;
  resultContent.querySelector('[data-payment-receipt]')?.addEventListener('click',()=>VJBank.receipt(paymentTransfer.reference));
  resultModal.hidden = false;
}

function getGigTimerText() {
  if (liveShow) return liveShow.completed ? 'FIN' : `LIVE ${formatGigTime(liveShow.elapsed * 1000)}`;
  const elapsed = gigStartedAt ? performance.now() - gigStartedAt : 0;
  if (!currentGig?.timeLimitSeconds) return formatGigTime(elapsed);
  const remaining = currentGig.timeLimitSeconds * 1000 - elapsed;
  return remaining >= 0 ? `-${formatGigTime(remaining)}` : `+${formatGigTime(Math.abs(remaining))}`;
}

function calculateCareerScore(baseSkill, gig, loadout = null, run = {}) {
  if(window.SessionRules && run.live)return SessionRules.score(baseSkill,gig,run);
  const s = getEffectiveStats(loadout);
  const gearBonus = Math.min(12, loadout ? loadout.scoreBonus : getGearBonus());
  const hasStylePack = gig && (profile.styleXp[gig.style] > 0 || countOwnedVjLoopPacks(gig.style) > 0);
  const styleBonus = hasStylePack ? 10 : 0;
  const levelPenalty = gig ? getGigLevelPenalty(gig) : 0;
  const prep = loadout?.selected?.prep;
  const prepBonus = prep?.bonus || {};
  const event = loadout?.randomEvent || null;
  const eventPenalty = event?.penalty || {};
  const client = getClientProfile(gig);
  const connectionPenalty = run.connectionPenalty || 0;
  const placementPenalty = run.placementPenalty || 0;
  const timePenalty = run.timePenalty || 0;
  const signalRatio = clamp(run.connectedRatio ?? 1, 0, 1);
  const technical = Math.round(clamp(
    baseSkill + (s.technique * 0.16 + Math.min(12, gearBonus) * 0.45) * signalRatio + (prepBonus.technical || 0) - (eventPenalty.technical || 0) - levelPenalty * 0.35 - Math.max(0, s.fatigue - 70) * 0.12,
    0,
    100
  ));
  const preparationArtistic = Math.round(clamp(
    baseSkill * 0.38 + s.creativity * 0.36 + s.style * 0.18 + styleBonus + (prepBonus.artistic || 0) - (eventPenalty.artistic || 0) - (styleBonus ? 0 : 8) - Math.max(0, s.fatigue - 60) * 0.1,
    0,
    100
  ));
  const artistic = run.live ? Math.round(preparationArtistic * 0.3 + run.live.score * 0.7) : preparationArtistic;
  const professional = Math.round(clamp(
    72 + s.reputation * 0.18 + gearBonus * 0.35 + (prepBonus.professional || 0) - (eventPenalty.professional || 0) - s.fatigue * 0.45 - timePenalty - connectionPenalty * 0.25 - placementPenalty * 0.25 - levelPenalty * 0.4,
    0,
    100
  ));
  const score = Math.round(clamp(technical * 0.4 + artistic * 0.35 + professional * 0.25, 0, 100 * signalRatio * (run.live?.completion ?? 1)));
  const clientSatisfaction = Math.round(clamp(
    technical * client.weights.technical + artistic * client.weights.artistic + professional * client.weights.professional,
    0,
    100 * signalRatio * (run.live?.completion ?? 1)
  ));
  const minScore = getGigMinimumScore(gig);
  const bonuses = [];
  const penalties = [];
  if (technical >= 92) bonuses.push('Projection ultra clean');
  if (artistic >= 88) bonuses.push('Client impressionne');
  if (professional >= 86) bonuses.push('Setup professionnel');
  if (prep?.label) bonuses.push(prep.label);
  if (gearBonus >= 14) bonuses.push('Gear solide');
  if (run.live && run.live.completion < 1) penalties.push(`Prestation incomplète (${Math.round(run.live.completion * 100)} %)`);
  if (connectionPenalty > 0) penalties.push('Connexions incompletes');
  if (placementPenalty > 0) penalties.push('Mauvais point de rack');
  if (timePenalty > 0) penalties.push('Setup trop lent');
  if (levelPenalty > 0) penalties.push('Gig au-dessus du niveau');
  if (s.fatigue >= 62) penalties.push('Stress/fatigue');
  if (s.creativity <= 24) penalties.push('Creativite basse');
  if (!styleBonus) penalties.push('Style musical peu prepare');
  // Starter equipment is not itself a performance fault.
  if (event) penalties.push(event.label);
  const gradeLabel = getShowGradeLabel(score, clientSatisfaction);
  return {
    score,
    technical,
    artistic,
    professional,
    clientSatisfaction,
    gearBonus,
    styleBonus,
    levelPenalty,
    bonuses,
    penalties,
    grade: getShowGrade(score, run.elapsed || 0),
    gradeLabel,
    stars: `${getFinalGigQuality(score).stars} etoile${getFinalGigQuality(score).stars > 1 ? 's' : ''}`,
  };
}

function calculateRunGrade(score, elapsed) {
  const seconds = elapsed / 1000;
  if (score >= 98 && seconds <= 180) return 'S';
  if (score >= 94 && seconds <= 260) return 'A';
  if (score >= 88 && seconds <= 420) return 'B';
  if (score >= 75) return 'C';
  return 'D';
}

function getFinalGigQuality(score) {
  if (score >= 80) return { stars: 3, label: 'Excellent', note: 'bonus possible, reputation forte' };
  if (score >= 50) return { stars: 2, label: 'Correct', note: 'paiement stable, client satisfait' };
  return { stars: 1, label: 'Faible', note: 'paiement reduit, client peu satisfait' };
}

function getPaymentRatioFromScore(score, reputation = 0) {
  if (score >= 80) return clamp(1 + (score - 80) / 100 + reputation / 500, 1, 1.24);
  if (score >= 50) return clamp(0.75 + (score - 50) / 120, 0.75, 1);
  return clamp(0.5 + score / 196, 0.5, 0.75);
}

function renderShowStars(count) {
  const value = clamp(Number(count) || 1, 1, 3);
  return `
    <span class="show-stars" aria-label="${value} sur 3 etoiles">
      ${Array.from({ length: 3 }, (_, index) => `<i class="${index < value ? 'filled' : 'empty'}">&#9733;</i>`).join('')}
    </span>
  `;
}

function getShowGrade(score, elapsed) {
  const seconds = elapsed / 1000;
  if (score >= 96 && seconds <= 210) return 'Legendary';
  if (score >= 84) return 'Excellent';
  if (score >= 68) return 'Solid';
  if (score >= 48) return 'Messy';
  return 'Disaster';
}

function getShowGradeLabel(score, clientSatisfaction) {
  const combined = Math.round(score * 0.7 + clientSatisfaction * 0.3);
  if (combined >= 96) return 'LEGENDARY SHOW';
  if (combined >= 84) return 'EXCELLENT SHOW';
  if (combined >= 68) return 'SOLID SET';
  if (combined >= 48) return 'MESSY NIGHT';
  return 'DISASTER';
}

function applyHypeFromGig(gig, result) {
  if (!profile.hype) return;
  const gain = result.clientSatisfaction >= 84 ? 5 : result.clientSatisfaction >= 68 ? 2 : 0;
  const clientType = gig?.clientType || 'chill';
  if (clientType === 'underground') profile.hype.underground = clamp(profile.hype.underground + gain + 1, 0, 100);
  if (clientType === 'corpo') profile.hype.corporate = clamp(profile.hype.corporate + gain + 1, 0, 100);
  if (clientType === 'festival') profile.hype.festival = clamp(profile.hype.festival + gain + 1, 0, 100);
  profile.hype.artistic = clamp(profile.hype.artistic + (result.artistic >= 84 ? 4 : gain), 0, 100);
  profile.hype.social = clamp(profile.hype.social + (result.clientSatisfaction >= 76 ? 3 : 1), 0, 100);
}

function getGearBonus() {
  return ['projector', 'computer', 'gpu', 'cable', 'adapter', 'router', 'console', 'screen', 'bag', 'accessory'].reduce((sum, type) => {
    const slug = profile.gear[type];
    if (!slug) return sum;
    const item = shopItems.find((entry) => entry.id === `${type}-${slug}`);
    return sum + (item?.scoreBonus || 0);
  }, 0);
}

function updateActiveVisuals() {
  rigs.forEach((rig, index) => {
    const active = index === activeRigIndex;
    rig.projector.pad.material.color.set(rig.cable.connected ? 0x1df6e3 : active ? 0x43ff9b : 0xffc857);
    rig.projector.pad.material.opacity = active ? 0.82 : 0.52;
  });
}

function cycleActiveRig() {
  if (rigs.length <= 1 || runFinished) return;
  activeRigIndex = (activeRigIndex + 1) % rigs.length;
  updateActiveVisuals();
  message.textContent = `Projecteur actif: ${activeRigIndex + 1}/${rigs.length}.`;
  updateGigHud();
}

function selectRigByIndex(index) {
  if (!document.body.classList.contains('screen-gig') || runFinished || !rigs[index]) return;
  activeRigIndex = index;
  updateActiveVisuals();
  message.textContent = `Projecteur actif: ${activeRigIndex + 1}/${rigs.length}.`;
  updateGigHud();
}

function onCanvasPointerDown(event) {
  if (!document.body.classList.contains('screen-gig')) return;
  canvas.tabIndex=0;canvas.focus({preventScroll:true});
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  if(PolygonMapping.beginDrag(event)){cameraControl.dragging=false;return;}
  cameraControl.dragging = true;
  cameraControl.lastX = event.clientX;
  cameraControl.lastY = event.clientY;
  cameraControl.moved = false;
  cameraControl.mode = event.button === 1 ? 'free' : event.button === 2 ? 'orbit' : 'pan';
}

function onCanvasPointerMove(event) {
  if(PolygonMapping.drag(event))return;
  if (!cameraControl.dragging) return;
  const dx = event.clientX - cameraControl.lastX;
  const dy = event.clientY - cameraControl.lastY;
  cameraControl.lastX = event.clientX;
  cameraControl.lastY = event.clientY;
  if (Math.abs(dx) + Math.abs(dy) > 3) cameraControl.moved = true;
  if (cameraControl.mode === 'free') {
    const right = new THREE.Vector3(Math.cos(cameraControl.yaw), 0, -Math.sin(cameraControl.yaw));
    const forward = new THREE.Vector3(Math.sin(cameraControl.yaw), 0, Math.cos(cameraControl.yaw));
    const scale = cameraControl.distance * 0.0032;
    cameraControl.target.addScaledVector(forward, dy * scale);
    cameraControl.target.addScaledVector(right, -dx * scale * 0.72);
    cameraControl.target.y = THREE.MathUtils.clamp(cameraControl.target.y + dy * scale * 0.18, roomBounds.minY, roomBounds.maxY - 1);
  } else if (cameraControl.mode === 'pan') {
    const right = new THREE.Vector3(Math.cos(cameraControl.yaw), 0, -Math.sin(cameraControl.yaw));
    const forward = new THREE.Vector3(Math.sin(cameraControl.yaw), 0, Math.cos(cameraControl.yaw));
    const scale = cameraControl.distance * 0.0018;
    cameraControl.target.addScaledVector(right, -dx * scale);
    cameraControl.target.addScaledVector(forward, dy * scale);
  } else {
    cameraControl.yaw -= dx * 0.006;
    cameraControl.pitch = THREE.MathUtils.clamp(cameraControl.pitch + dy * 0.0045, 0.18, 1.08);
  }
  clampCameraTarget();
}

function onCanvasPointerUp(event) {
  if(PolygonMapping.endDrag()){try{canvas.releasePointerCapture(event.pointerId);}catch{}return;}
  if (!cameraControl.dragging) return;
  cameraControl.dragging = false;
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer may already be released.
  }
  if (!cameraControl.moved && (event.button === 2 || (penMode && event.button === 0))) selectFromPointer(event);
}

function onCanvasWheel(event) {
  if (!document.body.classList.contains('screen-gig')) return;
  event.preventDefault();
  cameraControl.distance = THREE.MathUtils.clamp(cameraControl.distance + event.deltaY * 0.014, 5.5, 48);
}

function selectFromPointer(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  raycaster.setFromCamera(pointer, camera);
  if (penMode) {
    const screenHit = raycaster.intersectObjects(rigs.map((rig) => rig.screenHitArea), true)[0] ||
      raycaster.intersectObjects(rigs.map((rig) => rig.screenProjection), true)[0] ||
      raycaster.intersectObjects(rigs.map((rig) => rig.wallProjection), true)[0];
    if (screenHit) {
      addMaskPointFromHit(screenHit);
      return;
    }
  }
  const actionHit = raycaster.intersectObjects(connectButtonMeshes, true)[0];
  if (actionHit?.object?.userData.action === 'connect-projector') {
    connectActiveProjector();
    return;
  }
  const hit = raycaster.intersectObjects(rigs.flatMap((rig) => rig.projector.selectable), true)[0];
  if (!hit) return;
  let object = hit.object;
  while (object && object.userData.rigIndex === undefined) object = object.parent;
  const rigIndex = object?.userData.rigIndex ?? hit.object.userData.rigIndex;
  if (rigIndex === undefined) return;
  activeRigIndex = rigIndex;
  updateActiveVisuals();
  message.textContent = `Projecteur actif: ${activeRigIndex + 1}/${rigs.length}.`;
}

function updateCamera() {
  clampCameraTarget();
  const cp = cameraControl;
  const cosPitch = Math.cos(cp.pitch);
  const nextPosition = new THREE.Vector3(
    cp.target.x + Math.sin(cp.yaw) * cosPitch * cp.distance,
    cp.target.y + Math.sin(cp.pitch) * cp.distance,
    cp.target.z + Math.cos(cp.yaw) * cosPitch * cp.distance
  );
  nextPosition.x = THREE.MathUtils.clamp(nextPosition.x, roomBounds.minX, roomBounds.maxX);
  nextPosition.y = THREE.MathUtils.clamp(nextPosition.y, roomBounds.minY, roomBounds.maxY);
  nextPosition.z = THREE.MathUtils.clamp(nextPosition.z, roomBounds.minZ, roomBounds.maxZ);
  camera.position.copy(nextPosition);
  camera.lookAt(cp.target);
}

function clampCameraTarget() {
  cameraControl.target.x = THREE.MathUtils.clamp(cameraControl.target.x, roomBounds.minX + 1, roomBounds.maxX - 1);
  cameraControl.target.y = THREE.MathUtils.clamp(cameraControl.target.y, roomBounds.minY, roomBounds.maxY - 1);
  cameraControl.target.z = THREE.MathUtils.clamp(cameraControl.target.z, roomBounds.minZ + 0.3, roomBounds.maxZ - 1);
}

function hasProjectorInput() {
  return keys.has('arrowleft') || keys.has('arrowright') || keys.has('arrowup') || keys.has('arrowdown') ||
    keys.has('w') || keys.has('s') || keys.has('a') || keys.has('d');
}

function snapTo(value, target, threshold) {
  return Math.abs(value - target) <= threshold ? target : value;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
