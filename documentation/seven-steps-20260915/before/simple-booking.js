/* Career booking flow: gigs are discovered, applied to, answered later, then played on their scheduled day. */
function canBookSession(gig) {
  const client = getClientProfile(gig);
  return !getMissingSkills(gig).length
    && !getGigWorldRequirements(gig).length
    && profile.stats.reputation + profile.stats.network + profile.stats.style * .35 + client.acceptanceBonus >= gig.minRep;
}

function getSimpleGigBlockers(gig) {
  const blockers = [];
  const missingSkills = getMissingSkills(gig);
  const missingWorld = getGigWorldRequirements(gig);
  if (missingSkills.length) blockers.push(...missingSkills.map(label => `Skill: ${label}`));
  if (missingWorld.length) blockers.push(...missingWorld.map(label => `Matériel: ${label}`));
  const client = getClientProfile(gig);
  const careerScore = profile.stats.reputation + profile.stats.network + profile.stats.style * .35 + client.acceptanceBonus;
  if (careerScore < gig.minRep) blockers.push(`Réputation / réseau: ${Math.floor(careerScore)} / ${gig.minRep}`);
  const conflict = getGigDateConflict(gig);
  if (conflict) blockers.push(conflict.message);
  return blockers;
}

function prepareSessionGig(id) {
  if (profile.activeRun) {
    resumeActiveRun();
    return;
  }
  const gig = profile.gigs.find(g => g.id === id);
  if (!gig) return;

  if (gig.status === 'pending') {
    notify('Ta candidature est envoyée. Le client doit encore répondre.');
    openApp('email');
    return;
  }
  if (gig.status === 'offered') {
    notify('Le client t’a répondu. Accepte le contrat dans Email avant de préparer le show.');
    openApp('email');
    return;
  }
  if (!['accepted', 'scheduled'].includes(gig.status)) {
    notify('Ce show doit d’abord être obtenu via le réseau de booking.');
    return;
  }
  if (getMissingSkills(gig).length || getGigWorldRequirements(gig).length) {
    notify('Vérifie les compétences et le matériel demandés dans le brief.');
    return;
  }
  if (!canPlayGig(gig)) {
    notify(`Contrat confirmé pour ${formatScheduledDay(getGigAbsoluteDay(gig))}. Prépare-toi d’ici là.`);
    return;
  }

  startGig(id);
}

function retryCancelledGig(id) {
  const gig = profile.gigs.find(g => g.id === id);
  if (!gig || gig.status !== 'cancelled') return;

  const missingSkills = getMissingSkills(gig);
  const missingWorld = getGigWorldRequirements(gig);
  const client = getClientProfile(gig);
  const careerScore = profile.stats.reputation + profile.stats.network + profile.stats.style * .35 + client.acceptanceBonus;
  if (missingSkills.length || missingWorld.length || careerScore < gig.minRep) {
    notify('Tu peux retenter ce gig, mais il faut d’abord retrouver les prérequis demandés.');
    return;
  }

  if (gig.lastCancelledRetryRefusalDay === profile.day) {
    notify('Ce client vient déjà de refuser aujourd’hui. Retente un autre jour.');
    return;
  }

  gig.cancelledRetryAttempts = (Number(gig.cancelledRetryAttempts) || 0) + 1;

  // Exact rule requested: after cancelling this client, every retry has a 1-in-5 refusal risk.
  if (Math.random() < .20) {
    gig.lastCancelledRetryRefusalDay = profile.day;
    saveSlots();
    addEmail(
      'Client',
      `Nouvelle demande refusée : ${gig.title}`,
      'Tu avais déjà annulé ce contrat. Le client ne veut pas reprendre le risque cette fois-ci. Tu pourras retenter un autre jour.'
    );
    notify('Le client refuse cette nouvelle demande à cause de la précédente annulation. Tu pourras retenter demain.');
    renderSimpleBookings();
    return;
  }

  // A retry gets a fresh date; the old cancelled date must not keep blocking the calendar.
  gig.status = 'open';
  gig.responseIn = null;
  gig.responseDay = null;
  gig.scheduledDay = null;
  gig.eventDay = 0;
  delete gig.contractBudget;
  gig.lastCancelledRetryRefusalDay = null;
  saveSlots();

  applyToGig(id);
  if (gig.status === 'pending') {
    gig.retryAfterCancellation = true;
    saveSlots();
    addEmail(
      'Client',
      `Nouvelle candidature : ${gig.title}`,
      'Tu redemandes ce contrat après l’avoir annulé. Le client étudie ta nouvelle candidature.'
    );
    notify('Nouvelle candidature envoyée. Cette fois, le client accepte de reconsidérer le contrat.');
  }
}

function ensureBookingCalendarStyle() {
  if (document.querySelector('#booking-calendar-style')) return;
  const style = document.createElement('style');
  style.id = 'booking-calendar-style';
  style.textContent = `
    .gig-calendar{margin:16px 0 22px;padding:14px;border:1px solid #496270;border-radius:8px;background:#10212c}
    .gig-calendar-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:10px}.gig-calendar-head h2{margin:0}.gig-calendar-head small{color:#a9bdc8}
    .gig-calendar-weekdays,.gig-calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}.gig-calendar-weekdays span{text-align:center;font-size:10px;color:#9db3be;padding:4px}
    .gig-calendar-day{min-height:78px;border:1px solid #314a58;border-radius:6px;padding:6px;background:#162a36;color:#eaf2f3;text-align:left;overflow:hidden}.gig-calendar-day.is-today{border-color:#e4bf75;box-shadow:inset 0 0 0 1px #e4bf75}.gig-calendar-day.is-past{opacity:.55}.gig-calendar-day.empty{background:transparent;border-color:transparent}
    .gig-calendar-date{display:flex;justify-content:space-between;gap:6px;font-size:11px}.gig-calendar-date b{font-size:14px}.gig-calendar-event{display:block;margin-top:5px;padding:4px 5px;border-radius:4px;background:#254454;font-size:10px;line-height:1.25}.gig-calendar-event.confirmed{background:#24513f}.gig-calendar-event.pending{background:#4a3b24}.gig-calendar-event.offered{background:#49365a}.gig-calendar-event.done{background:#303a42}
    .gig-calendar-legend{display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;font-size:10px;color:#a9bdc8}.gig-calendar-legend i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px;vertical-align:-1px}.gig-calendar-legend .confirmed{background:#24513f}.gig-calendar-legend .pending{background:#4a3b24}.gig-calendar-legend .offered{background:#49365a}
    .cancelled-retry-note{margin:10px 0;padding:9px 10px;border:1px solid #8c6744;border-radius:6px;background:#33271d;color:#ffd9a0;font-size:12px;line-height:1.35}
    @media(max-width:760px){.gig-calendar-day{min-height:58px;padding:4px}.gig-calendar-event{font-size:8px}.gig-calendar-weekdays span{font-size:8px}}
  `;
  document.head.append(style);
}

function renderGigCalendar() {
  ensureBookingCalendarStyle();
  const monthStart = profile.day - (getDayOfMonth(profile.day) - 1);
  const monthName = getMonthName(profile.day);
  const yearNumber = getYearNumber(profile.day);
  const firstOffset = getWeekdayIndex(monthStart);
  const activeStatuses = new Set(['pending', 'offered', 'accepted', 'scheduled', 'done']);
  const gigsByDay = new Map();
  profile.gigs.filter(g => activeStatuses.has(g.status)).forEach(g => {
    const day = getGigAbsoluteDay(g);
    if (day < monthStart || day > monthStart + 29) return;
    if (!gigsByDay.has(day)) gigsByDay.set(day, []);
    gigsByDay.get(day).push(g);
  });
  const cells = [];
  for (let i = 0; i < firstOffset; i++) cells.push('<div class="gig-calendar-day empty" aria-hidden="true"></div>');
  for (let date = 1; date <= 30; date++) {
    const absoluteDay = monthStart + date - 1;
    const gigs = gigsByDay.get(absoluteDay) || [];
    const events = gigs.slice(0, 3).map(g => {
      const cls = ['accepted', 'scheduled'].includes(g.status) ? 'confirmed' : g.status;
      const prefix = ['accepted', 'scheduled'].includes(g.status) ? '✓' : g.status === 'pending' ? '…' : g.status === 'offered' ? '!' : '•';
      return `<span class="gig-calendar-event ${cls}" title="${escapeHtml(g.title)} · ${escapeHtml(g.venue)}">${prefix} ${escapeHtml(g.title)}</span>`;
    }).join('');
    cells.push(`<div class="gig-calendar-day ${absoluteDay === profile.day ? 'is-today' : ''} ${absoluteDay < profile.day ? 'is-past' : ''}"><div class="gig-calendar-date"><b>${date}</b><span>${getWeekdayName(absoluteDay)}</span></div>${events}${gigs.length > 3 ? `<small>+${gigs.length - 3} autre${gigs.length > 4 ? 's' : ''}</small>` : ''}</div>`);
  }
  return `<section class="gig-calendar" aria-label="Calendrier des gigs"><div class="gig-calendar-head"><div><small>CALENDRIER</small><h2>${escapeHtml(monthName)} ${yearNumber}</h2></div><small>Aujourd’hui : ${escapeHtml(formatScheduledDay(profile.day))}</small></div><div class="gig-calendar-weekdays">${['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d => `<span>${d}</span>`).join('')}</div><div class="gig-calendar-grid">${cells.join('')}</div><div class="gig-calendar-legend"><span><i class="confirmed"></i>Gig confirmé</span><span><i class="pending"></i>Candidature</span><span><i class="offered"></i>Réponse reçue</span></div></section>`;
}

function renderSimpleBookings() {
  document.body.classList.add('choosing-show');
  refreshAvailableGigPool();

  const active = profile.gigs.filter(g => ['pending', 'offered', 'accepted', 'scheduled'].includes(g.status));
  const discoverable = profile.gigs
    .filter(g => ['open', 'locked'].includes(g.status))
    .sort((a, b) => getGigUnlockLevel(a) - getGigUnlockLevel(b) || getGigProjectorCount(a) - getGigProjectorCount(b))
    .slice(0, 8);
  const replay = profile.gigs.filter(g => g.status === 'done' && getReplayWaitDays(g) <= 0).slice(0, 3);
  const cancelled = profile.gigs.filter(g => g.status === 'cancelled').slice(0, 5);

  const goal = g => getGigMaskRequirement(g) > 0
    ? 'Adapter l’image à une forme'
    : getGigProjectorCount(g) > 1
      ? 'Coordonner plusieurs projections'
      : 'Cadrer un écran et accompagner la musique';

  const card = (g, current = false) => {
    const blockers = g.status === 'cancelled' ? [] : getSimpleGigBlockers(g);
    const date = formatScheduledDay(getGigAbsoluteDay(g));
    const statusText = g.status === 'pending'
      ? 'Candidature envoyée · réponse attendue'
      : g.status === 'offered'
        ? 'Réponse reçue · vérifie tes emails'
        : ['accepted', 'scheduled'].includes(g.status)
          ? (canPlayGig(g) ? 'Contrat confirmé · prêt à partir' : `Contrat confirmé · ${date}`)
          : g.status === 'done'
            ? 'Client déjà connu · tu peux relancer'
            : g.status === 'cancelled'
              ? 'Contrat annulé · tu peux demander une deuxième chance'
              : blockers.length
                ? 'Pas encore admissible'
                : 'Tu peux postuler';

    let action = '';
    if (g.status === 'open') {
      action = blockers.length
        ? '<button class="secondary-action" disabled>Prérequis manquants</button>'
        : `<button class="primary-action" data-simple-apply="${g.id}">Postuler à ce gig →</button>`;
    } else if (g.status === 'pending') {
      action = '<button class="secondary-action" disabled>En attente du client</button>';
    } else if (g.status === 'offered') {
      action = '<button class="primary-action" data-simple-email>Ouvrir la réponse →</button>';
    } else if (['accepted', 'scheduled'].includes(g.status)) {
      action = `<button class="primary-action" data-simple-id="${g.id}" ${canPlayGig(g) ? '' : 'disabled'}>${canPlayGig(g) ? 'Préparer et partir →' : `Prévu ${date}`}</button>`;
    } else if (g.status === 'done') {
      action = blockers.length
        ? '<button class="secondary-action" disabled>Prérequis insuffisants</button>'
        : `<button class="secondary-action" data-simple-reapply="${g.id}">Relancer ce client</button>`;
    } else if (g.status === 'cancelled') {
      action = `<div class="cancelled-retry-note">Tu as annulé ce gig. Tu peux le redemander, mais le client a <strong>1 chance sur 5</strong> de refuser à cause de cette annulation.</div><button class="primary-action" data-simple-retry-cancelled="${g.id}">Redemander ce gig →</button>`;
    } else {
      action = '<button class="secondary-action" disabled>Verrouillé</button>';
    }

    return `<article class="simple-gig ${current ? 'recommended' : ''}">
      <small>${current ? 'TON PARCOURS ACTUEL' : 'RÉSEAU DE BOOKING'}</small>
      <h2>${escapeHtml(g.title)}</h2>
      <p class="simple-gig-place">${escapeHtml(g.venue)} · ${escapeHtml(getStyleMeta(g.style).label)}</p>
      <p><strong>${escapeHtml(GigDifficulty.label(g))}</strong></p><p>${escapeHtml(goal(g))}</p>
      <div class="simple-gig-facts">
        <span>Cachet prévu <b>${g.contractBudget ?? g.budget} $</b></span>
        <span>${getGigProjectorCount(g)} projecteur${getGigProjectorCount(g) > 1 ? 's' : ''}</span>
        <span>${escapeHtml(date)}</span>
      </div>
      <p class="simple-gig-next">${escapeHtml(statusText)}</p>
      ${blockers.length ? `<div class="gig-date-conflict"><strong>Il te manque :</strong><br>${blockers.slice(0, 4).map(escapeHtml).join('<br>')}</div>` : ''}
      ${action}
      <details>
        <summary>Brief et prérequis</summary>
        <p>${escapeHtml(g.requirement || 'Prépare une projection adaptée à la salle.')}</p>
        ${renderGigQuickRequirements(g)}
      </details>
    </article>`;
  };

  appWindow.innerHTML = `<div class="app-heading"><div><h1>Réseau VJ Booking</h1><p>Trouve un gig, vérifie les prérequis, postule et attends la réponse du client.</p></div><button data-simple-back>Retour au bureau</button></div>
    ${GigDifficulty.roadmap()}
    ${renderGigCalendar()}
    <ol class="simple-gig-steps"><li>Trouver</li><li>Postuler</li><li>Attendre</li><li>Préparer</li><li>Jouer</li></ol>
    ${profile.activeRun ? '<button class="primary-action" data-session-resume>Reprendre mon show en pause →</button>' : ''}
    ${active.length ? `<section><h2>Mes candidatures et contrats</h2><div class="simple-gig-grid">${active.map(g => card(g, true)).join('')}</div></section>` : ''}
    ${cancelled.length ? `<section><h2>Gigs annulés · deuxième chance</h2><p>Une annulation ne supprime plus le contrat pour toujours.</p><div class="simple-gig-grid">${cancelled.map(g => card(g, true)).join('')}</div></section>` : ''}
    <section><h2>Opportunités</h2><div class="simple-gig-grid">${discoverable.map(g => card(g, false)).join('') || '<p>Aucune nouvelle offre aujourd’hui.</p>'}</div></section>
    ${replay.length ? `<details class="simple-other"><summary>Anciens clients</summary><div class="simple-gig-grid">${replay.map(g => card(g, false)).join('')}</div></details>` : ''}
    <div class="simple-gig-footer"><button data-simple-practice>Pratique VJ libre</button><button data-session-learning>Développer mes skills</button><button data-simple-all>Vue détaillée du réseau</button><small>Les candidatures ne donnent jamais un contrat instantanément : les clients répondent avec le temps du jeu.</small></div>`;

  appWindow.querySelectorAll('[data-simple-apply]').forEach(button => button.onclick = () => applyToGig(button.dataset.simpleApply));
  appWindow.querySelectorAll('[data-simple-id]').forEach(button => button.onclick = () => prepareSessionGig(button.dataset.simpleId));
  appWindow.querySelectorAll('[data-simple-reapply]').forEach(button => button.onclick = () => reapplyGig(button.dataset.simpleReapply));
  appWindow.querySelectorAll('[data-simple-retry-cancelled]').forEach(button => button.onclick = () => retryCancelledGig(button.dataset.simpleRetryCancelled));
  appWindow.querySelectorAll('[data-simple-email]').forEach(button => button.onclick = () => openApp('email'));
  appWindow.querySelector('[data-session-resume]')?.addEventListener('click', resumeActiveRun);
  appWindow.querySelector('[data-simple-back]').onclick = () => closeAppWindow();
  appWindow.querySelector('[data-simple-practice]').onclick = () => {
    document.querySelector('#academy-launch').click();
    document.querySelector('#academy [data-free]').click();
  };
  appWindow.querySelector('[data-session-learning]').onclick = () => openApp('skills');
  appWindow.querySelector('[data-simple-all]').onclick = () => {
    renderSocialDetailed();
    addWindowControls();
  };
  addWindowControls();
}
