/* Simplify the beginner Resolut workspace: only show controls that actually work. */
(() => {
  function setLeadingText(label, text) {
    if (!label) return;
    const node = [...label.childNodes].find(child => child.nodeType === Node.TEXT_NODE);
    if (node) node.textContent = text;
    else label.prepend(document.createTextNode(text));
  }

  function installStyles() {
    if (document.querySelector('#resolut-beginner-style')) return;
    const style = document.createElement('style');
    style.id = 'resolut-beginner-style';
    style.textContent = `
      .resolut-beginner .resolut-pro-workspace{grid-template-columns:105px minmax(280px,.9fr) minmax(360px,1.2fr) 300px;min-height:520px}
      .resolut-beginner .resolut-layer-card,.resolut-beginner .resolut-add{display:none!important}
      .resolut-beginner .resolut-layers{padding:10px 7px}
      .resolut-beginner .resolute-layer{min-height:92px!important;border-left-color:#2ce7f5!important}
      .resolut-beginner .resolute-layer small{color:#63e7ef!important}
      .resolut-beginner .resolut-tabs{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:8px;margin-bottom:10px;padding:8px;border:1px solid #164859;border-radius:5px;background:#091c25}
      .resolut-beginner .resolut-tabs strong{color:#31eff8;font-size:11px;letter-spacing:.04em}
      .resolut-beginner .resolut-tabs span{padding:0!important;background:transparent!important;color:#a8c0c7!important;font-size:9px!important;line-height:1.3}
      .resolut-beginner .resolut-preview-slot{margin-top:10px;padding:10px;border:1px solid #175163;border-radius:5px;background:#07131a}
      .resolut-beginner .resolut-preview-slot label{color:#5beefa!important;font-weight:900!important}
      .resolut-beginner .resolut-program-head{padding:7px 9px;border:1px solid #175467;border-radius:5px;background:#08202a}
      .resolut-beginner .resolut-program-head span:first-child{font-size:12px}
      .resolut-beginner .resolut-program-head span:last-child{color:#55ffb2}
      .resolut-beginner .resolut-params{padding:10px;background:#08141c}
      .resolut-simple-head{display:grid;gap:6px;margin-bottom:10px;padding:11px;border:1px solid #176377;border-radius:6px;background:#0b2530}
      .resolut-simple-head small{color:#38eaf6;font-size:10px;font-weight:900;letter-spacing:.08em}
      .resolut-simple-head strong{color:#f1fbfc;font-size:14px}
      .resolut-simple-head p{margin:0;color:#a8c0c8;font-size:10px;line-height:1.45}
      .resolut-beginner .academy-controls{display:grid!important;gap:9px!important}
      .resolut-beginner .academy-controls>div{padding:12px!important;border:1px solid #176176!important;border-radius:6px!important;background:#0a202a!important}
      .resolut-beginner .academy-controls label{display:grid!important;gap:7px!important;color:#d8e8ec!important;font-size:11px!important}
      .resolut-beginner .academy-controls select,.resolut-beginner .academy-controls input{width:100%}
      .resolut-beginner [data-take]{min-height:52px!important;background:#27d9e9!important;color:#062229!important;border-color:#73f5ff!important;font-weight:900!important;line-height:1.25}
      .resolut-control-help{display:block;margin-top:5px;color:#92b1ba;font-size:9px;line-height:1.35}
      .resolut-advanced-note{margin-top:10px;padding:10px;border:1px dashed #355c68;border-radius:6px;color:#91aab2;font-size:10px;line-height:1.45;background:#07151d}
      .resolut-advanced-note strong{display:block;margin-bottom:4px;color:#c9dde2}
      .resolut-learning-path{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding:8px;background:#061018;border-bottom:1px solid #174a5a}
      .resolut-learning-step{display:flex;align-items:center;gap:8px;min-width:0;padding:8px 10px;border:1px solid #194e5f;border-radius:5px;background:#0a1d26;color:#b9cbd1;font-size:10px}
      .resolut-learning-step b{display:grid;place-items:center;flex:0 0 auto;width:24px;height:24px;border-radius:50%;background:#25dfef;color:#06242b;font-size:12px}
      .resolut-learning-step strong{display:block;color:#ecf7f8;font-size:10px}
      .resolut-practice-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:9px}
      .resolut-practice-actions button{min-height:36px!important;padding:8px 11px!important}
      .resolut-beginner .resolut-coach aside{grid-template-columns:minmax(220px,.8fr) minmax(260px,1fr)!important}
      @media(max-width:1150px){.resolut-beginner .resolut-pro-workspace{grid-template-columns:90px minmax(250px,1fr) minmax(300px,1.1fr)}.resolut-beginner .resolut-params{grid-column:1/-1}.resolut-beginner .academy-controls{grid-template-columns:repeat(2,minmax(0,1fr))!important}.resolut-beginner .resolut-simple-head,.resolut-beginner .resolut-advanced-note{grid-column:1/-1}}
      @media(max-width:760px){.resolut-learning-path{grid-template-columns:1fr}.resolut-beginner .resolut-pro-workspace{grid-template-columns:1fr}.resolut-beginner .resolut-layers{display:none}.resolut-beginner .resolut-params{grid-column:auto}.resolut-beginner .academy-controls{grid-template-columns:1fr!important}}
    `;
    document.head.append(style);
  }

  function simplify() {
    const academy = document.querySelector('#academy');
    const consolePanel = academy?.querySelector('.resolute-console');
    const workspace = consolePanel?.querySelector('.resolut-pro-workspace');
    if (!academy || !consolePanel || !workspace || workspace.dataset.beginnerClean === '1') return;

    workspace.dataset.beginnerClean = '1';
    academy.classList.add('resolut-beginner');
    installStyles();

    const titlebar = consolePanel.querySelector('.resolute-titlebar');
    const title = titlebar?.querySelector('strong');
    if (title) title.innerHTML = '<i>A</i> Resolut 8 <small style="font-size:9px;color:#68eaf4;font-weight:700">MODE DÉBUTANT</small>';
    titlebar?.querySelector('.res-menu')?.remove();
    const comp = titlebar?.querySelector('.res-comp');
    if (comp) comp.textContent = 'Le Sous-sol · apprendre le mix';

    const path = document.createElement('div');
    path.className = 'resolut-learning-path';
    path.innerHTML = '<div class="resolut-learning-step"><b>1</b><span><strong>Choisis un clip</strong>Il va seulement dans la preview.</span></div><div class="resolut-learning-step"><b>2</b><span><strong>Vérifie la preview</strong>Le public ne la voit pas encore.</span></div><div class="resolut-learning-step"><b>3</b><span><strong>Envoie en fondu</strong>Le clip devient le programme.</span></div>';
    workspace.before(path);

    const layers = workspace.querySelector('.resolut-layers');
    layers?.querySelector('.resolut-section-title')?.remove();
    layers?.querySelectorAll('.resolut-layer-card').forEach(card => card.remove());
    const layer = layers?.querySelector('.resolute-layer');
    if (layer) layer.innerHTML = '<small>COUCHE 1</small><strong>VISUELS</strong><span>La seule couche utile pour commencer.</span>';

    const browser = workspace.querySelector('.resolut-browser');
    const tabs = browser?.querySelector('.resolut-tabs');
    if (tabs) tabs.innerHTML = '<strong>1 · CHOISIS UN CLIP</strong><span>Clique une vignette : elle se prépare dans PREVIEW.</span>';
    const previewLabel = browser?.querySelector('.resolut-preview-slot label');
    setLeadingText(previewLabel, '2 · PREVIEW / HORS PUBLIC ');
    const clipSelect = previewLabel?.querySelector('[data-clip]');
    if (clipSelect) clipSelect.setAttribute('aria-label', 'Clip préparé en preview');

    const programHead = workspace.querySelector('.resolut-program-head');
    if (programHead) programHead.innerHTML = '<span>PROGRAMME / CE QUE LE PUBLIC VOIT</span><span>● EN DIRECT</span>';
    const programLabel = workspace.querySelector('.resolut-program-stage label');
    setLeadingText(programLabel, 'SORTIE EN SALLE ');

    const params = workspace.querySelector('.resolut-params');
    if (!params) return;
    params.querySelectorAll('.resolut-param-card').forEach(card => card.remove());
    const controls = params.querySelector('.academy-controls');

    const head = document.createElement('div');
    head.className = 'resolut-simple-head';
    head.innerHTML = '<small>3 · MIXER SIMPLE</small><strong>Seulement les contrôles qui fonctionnent</strong><p>Commence avec trois gestes : choisir le temps du fondu, envoyer la preview, puis ajuster l’énergie. Les effets avancés viendront plus tard.</p>';
    params.prepend(head);

    if (controls) {
      const duration = controls.querySelector('[data-duration]');
      const durationLabel = duration?.closest('label');
      setLeadingText(durationLabel, 'Durée du fondu ');
      const fadeHelp = document.createElement('small');
      fadeHelp.className = 'resolut-control-help';
      fadeHelp.textContent = '1 s = rapide · 2 s = doux · 4 s = très progressif.';
      durationLabel?.append(fadeHelp);

      const take = controls.querySelector('[data-take]');
      if (take) take.textContent = '3 · ENVOYER LA PREVIEW → PROGRAMME';
      const takeHelp = document.createElement('small');
      takeHelp.className = 'resolut-control-help';
      takeHelp.textContent = 'C’est le geste principal : le clip préparé devient visible au public.';
      take?.after(takeHelp);

      const intensity = controls.querySelector('[data-intensity]');
      const intensityLabel = intensity?.closest('label');
      setLeadingText(intensityLabel, 'Énergie / intensité ');
      const intensityHelp = document.createElement('small');
      intensityHelp.className = 'resolut-control-help';
      intensityHelp.textContent = 'Bas pendant un break, plus haut pendant une montée ou un peak.';
      intensityLabel?.append(intensityHelp);

      const coach = academy.querySelector('.resolut-coach aside');
      const practiceActions = document.createElement('div');
      practiceActions.className = 'resolut-practice-actions';
      const play = controls.querySelector('[data-play]');
      const free = controls.querySelector('[data-free]');
      if (play) practiceActions.append(play);
      if (free) practiceActions.append(free);
      if (coach && practiceActions.children.length) coach.append(practiceActions);
    }

    const advanced = document.createElement('div');
    advanced.className = 'resolut-advanced-note';
    advanced.innerHTML = '<strong>Effets avancés</strong>Glow, Colorize, distorsion, échelle et rotation ne sont plus affichés ici tant qu’ils ne sont pas réellement utilisables. Le tutoriel reste simple et logique.';
    params.append(advanced);

    const coachTitle = academy.querySelector('.resolut-coach [data-title]');
    const coachTask = academy.querySelector('.resolut-coach [data-task]');
    if (coachTitle && !coachTitle.textContent.trim()) coachTitle.textContent = 'Apprends un geste à la fois';
    if (coachTask && !coachTask.textContent.trim()) coachTask.textContent = '1. Choisis un clip · 2. Vérifie la preview · 3. Envoie-le en fondu.';
  }

  if (document.readyState === 'complete') setTimeout(simplify, 0);
  else window.addEventListener('load', () => setTimeout(simplify, 0), { once: true });
})();
