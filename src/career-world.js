/* Phase 7 · Living career
   Sector reputation, negotiation risk, deposits and recurring callbacks. */
window.CareerWorld=(()=>{
  const sectors=['techno','psytrance','corporate','festival','club','underground'];
  const labels={techno:'Techno',psytrance:'Psytrance',corporate:'Corporate',festival:'Festivals',club:'Clubs',underground:'Underground'};
  const clamp100=value=>Math.max(0,Math.min(100,Math.round(Number(value)||0)));

  function sectorFor(gig){
    const style=String(gig?.style||'').toLowerCase(),client=String(gig?.clientType||'').toLowerCase(),venue=String(gig?.venue||'').toLowerCase();
    if(client==='festival'||/festival|outdoor|parc|stage/.test(venue))return 'festival';
    if(client==='corpo'||/corporate|gala|hotel|conference|brand/.test(venue))return 'corporate';
    if(style.includes('psy'))return 'psytrance';
    if(style.includes('techno'))return 'techno';
    if(client==='underground'||/warehouse|sous-sol|underground/.test(venue))return 'underground';
    return 'club';
  }
  function state(){
    profile.careerWorld ||= {sectorRep:{},contacts:{},negotiations:{},lastCallbackDay:0};
    for(const id of sectors)if(!Number.isFinite(profile.careerWorld.sectorRep[id]))profile.careerWorld.sectorRep[id]=0;
    return profile.careerWorld;
  }
  function rep(gigOrSector){const id=typeof gigOrSector==='string'?gigOrSector:sectorFor(gigOrSector);return clamp100(state().sectorRep[id]);}
  function contact(gig){
    const key=String(gig?.venue||gig?.id||'client');
    return state().contacts[key] ||= {shows:0,successful:0,trust:0,lastDay:0,sector:sectorFor(gig)};
  }
  function recordResult(gig,result,live){
    if(!gig||!result)return;
    const s=state(),id=sectorFor(gig),c=contact(gig),complete=(live?.completion??0)>=1,passed=complete&&result.score>=getGigMinimumScore(gig);
    const delta=passed?Math.max(2,Math.round((result.score-50)/10)):complete?-3:-6;
    s.sectorRep[id]=clamp100((s.sectorRep[id]||0)+delta);
    c.shows++;c.lastDay=profile.day;c.trust=Math.max(0,Math.min(10,c.trust+(passed?2:-1)));if(passed)c.successful++;
    gig.careerSector=id;gig.lastSectorRepDelta=delta;
    return {sector:id,delta,rep:s.sectorRep[id]};
  }
  function negotiationChance(gig){
    const trust=Math.max(0,Number(window.ClientRelations?.get?.(gig)?.trust||contact(gig).trust||0));
    return Math.max(.35,Math.min(.9,.52+rep(gig)/220+trust*.025+Math.min(20,Number(profile.stats?.network)||0)/400));
  }
  function tryNegotiation(gig){
    if(!gig||gig.status!=='offered')return false;
    const s=state(),key=`${gig.id}:${profile.day}`;
    if(s.negotiations[key]){notify('Tu as déjà négocié cette offre aujourd’hui.');return false;}
    const chance=negotiationChance(gig),roll=Math.random();s.negotiations[key]={chance,roll,day:profile.day};
    if(roll<=chance){
      gig.budget=Math.round(gig.budget*1.1);gig.negotiated=true;gig.negotiationAccepted=true;
      const day=scheduleAcceptedGig(gig);profile.stats.network=clamp100((profile.stats.network||0)+1);
      addEmail(gig.venue||'Client',`Négociation acceptée · ${gig.title}`,`Le client accepte +10 %. Cachet total : ${gig.contractBudget||gig.budget} $. Le contrat est réservé pour ${formatScheduledDay(day)}.`,{unique:false});
      notify(`Négociation acceptée : ${gig.title} · +10 %.`);deposit(gig);saveSlots();return true;
    }
    gig.negotiationAccepted=false;
    addEmail(gig.venue||'Client',`Négociation refusée · ${gig.title}`,'Le client garde son offre initiale. Tu peux encore l’accepter ou la refuser.',{unique:false});
    notify('Le client refuse la hausse, mais son offre initiale reste disponible.');saveSlots();renderEmail?.();return false;
  }
  function deposit(gig){
    if(!gig||gig.depositPaid)return 0;
    const total=Math.max(0,Number(gig.contractBudget??gig.budget)||0);if(!total)return 0;
    const amount=Math.max(1,Math.round(total*.25));
    gig.contractBudget=total;gig.depositPaid=amount;gig.depositDay=profile.day;gig.budget=Math.max(0,total-amount);
    profile.money+=amount;
    if(typeof recordFinance==='function')recordFinance(amount,`Acompte ${gig.title}`);
    addEmail(gig.venue||'Client',`Acompte reçu · ${gig.title}`,`Acompte de 25 % reçu : ${amount} $. Solde prévu après la prestation : ${gig.budget} $.`,{unique:false});
    return amount;
  }
  function maybeCallback(){
    const s=state();if(s.lastCallbackDay===profile.day)return;
    s.lastCallbackDay=profile.day;
    const candidates=profile.gigs.filter(g=>['open','done'].includes(g.status)&&rep(g)>=25&&!getGigDateConflict(g));
    if(!candidates.length)return;
    const index=Math.abs((profile.day*17+(profile.showSessions||0)*11))%candidates.length,gig=candidates[index];
    if(profile.day%5!==Math.abs(sectors.indexOf(sectorFor(gig)))%5)return;
    if(gig.status==='done'&&typeof getReplayWaitDays==='function'&&getReplayWaitDays(gig)>0)return;
    gig.status='offered';gig.referredBy=gig.referredBy||`${labels[sectorFor(gig)]} · bouche-à-oreille`;
    addEmail(gig.venue||'Producteur',`On pense à toi · ${gig.title}`,`Ta réputation ${labels[sectorFor(gig)]} commence à circuler (${rep(gig)}/100). Le client te propose directement ce mandat.`,{type:'gig-offer',gigId:gig.id,unique:false});
    notify(`Un contact ${labels[sectorFor(gig)]} t’a envoyé une offre directe.`);saveSlots();
  }
  function summaryMarkup(){
    const s=state();return `<section class="career-world-panel"><small>RÉPUTATION PAR MILIEU</small><div class="career-world-reps">${sectors.map(id=>`<span><b>${labels[id]}</b><i>${clamp100(s.sectorRep[id])}/100</i></span>`).join('')}</div><p>Les bons shows construisent une réputation locale par milieu. Elle influence les négociations et les rappels de producteurs.</p></section>`;
  }
  function injectStyles(){if(document.querySelector('#career-world-style'))return;const style=document.createElement('style');style.id='career-world-style';style.textContent=`.career-world-panel{margin:14px 0;padding:12px;border:1px solid #405b69;border-radius:8px;background:#10232e}.career-world-panel>small{letter-spacing:.12em;color:#8fe5dd}.career-world-reps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:9px 0}.career-world-reps span{display:flex;justify-content:space-between;gap:8px;padding:7px 8px;border:1px solid #2f4855;border-radius:5px;background:#162c38;font-size:11px}.career-world-reps i{font-style:normal;color:#e4bf75}.career-world-panel p{margin:6px 0 0;color:#a9bdc8;font-size:11px}@media(max-width:760px){.career-world-reps{grid-template-columns:1fr 1fr}}`;document.head.append(style);}

  function patch(){
    injectStyles();
    if(window.ClientRelations?.complete&&!window.ClientRelations.__careerWorldPatched){
      const original=window.ClientRelations.complete.bind(window.ClientRelations);
      window.ClientRelations.complete=(gig,result,live)=>{const feedback=original(gig,result,live);const update=recordResult(gig,result,live);if(update)addEmail('Carrière',`Réputation ${labels[update.sector]} ${update.delta>=0?'+':''}${update.delta}`,`Réputation ${labels[update.sector]} : ${update.rep}/100.`,{unique:false});saveSlots();return feedback;};
      window.ClientRelations.__careerWorldPatched=true;
    }
    if(typeof window.handleEmailAction==='function'&&!window.handleEmailAction.__careerWorldPatched){
      const original=window.handleEmailAction;
      const wrapped=function(action,gigId){const gig=profile.gigs.find(item=>item.id===gigId);if(action==='negotiate-gig'&&gig?.status==='offered')return tryNegotiation(gig);const before=gig?.status;const value=original(action,gigId);if(action==='accept-gig'&&before==='offered'&&gig&&!gig.depositPaid&&['accepted','scheduled'].includes(gig.status))deposit(gig);saveSlots();return value;};
      wrapped.__careerWorldPatched=true;window.handleEmailAction=wrapped;
    }
    if(typeof window.renderSimpleBookings==='function'&&!window.renderSimpleBookings.__careerWorldPatched){
      const original=window.renderSimpleBookings;
      const wrapped=function(){maybeCallback();const value=original();const calendar=appWindow.querySelector('.gig-calendar');calendar?.insertAdjacentHTML('afterend',summaryMarkup());return value;};
      wrapped.__careerWorldPatched=true;window.renderSimpleBookings=wrapped;
    }
  }
  patch();
  return {sectorFor,rep,contact,recordResult,negotiationChance,deposit,maybeCallback,summaryMarkup};
})();
