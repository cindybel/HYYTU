/* The account uses the existing career balance. Recording never moves money twice. */
window.VJBank=(()=>{
 const money=n=>`${Number(n||0).toLocaleString('fr-CA',{minimumFractionDigits:2,maximumFractionDigits:2})} $`;
 function counterparty(label,amount){
  if(/^Achat|^Revente/.test(label))return 'Atazone';
  if(/^Formation|^Appris/.test(label))return 'École VJ';
  if(/^Loyer/.test(label))return profile.housing?.type||'Propriétaire';
  if(/^Pret|^Paiement dette|^Paiement pret/.test(label))return 'Banque Signal · Crédit';
  if(/^Uver|^Transport/.test(label))return 'Uver';
  if(/^Jobine/.test(label))return 'Employeur';
  if(/^Repos/.test(label))return 'Services bien-être';
  return label.replace(/^Paiement |^Cachet · |^Annulation live |^Annulation /,'') || (amount>0?'Client':'Prestataire');
 }
 function ensure(){
  if(!profile.bank||typeof profile.bank!=='object')profile.bank={version:1,accountId:`VJ-${crypto.randomUUID().slice(0,8).toUpperCase()}`,sequence:0,transactions:[]};
  const bank=profile.bank;
  bank.transactions ||= [];
  bank.sequence=Math.max(Number(bank.sequence)||0,bank.transactions.length);
  if(!bank.legacyImported){
   for(const row of profile.financeLog||[]){
    bank.sequence++;
    bank.transactions.push({reference:`ARCH-${bank.sequence.toString().padStart(6,'0')}`,day:row.day,amount:row.amount,label:row.label,counterparty:counterparty(row.label,row.amount),status:'archive',balanceAfter:null,time:null});
   }
   bank.legacyImported=true;
  }
  return bank;
 }
 function record(amount,label,details={}){
  if(!Number.isFinite(Number(amount))||Number(amount)===0)return null;
  const bank=ensure();bank.sequence++;
  const clock=profile.studioWorld?.seconds;
  const time=Number.isFinite(clock)?`${String(Math.floor(clock/3600)%24).padStart(2,'0')}:${String(Math.floor(clock/60)%60).padStart(2,'0')}`:null;
  const row={reference:`SIG-${bank.sequence.toString().padStart(6,'0')}`,day:profile.day,time,amount:Math.round(Number(amount)),label:String(label),counterparty:details.counterparty||counterparty(String(label),amount),status:'completed',balanceAfter:Number.isFinite(details.balanceAfter)?details.balanceAfter:profile.money};
  bank.transactions.push(row);return row;
 }
 function receipt(reference){
  const bank=ensure(),row=bank.transactions.find(r=>r.reference===reference);if(!row)return;
  document.querySelector('#bank-receipt')?.remove();
  const modal=document.createElement('dialog');modal.id='bank-receipt';modal.className='bank-receipt';
  const incoming=row.amount>0,holder=profile.name||'VJ';
  modal.innerHTML=`<header><span>BANQUE SIGNAL</span><button aria-label="Fermer le reçu">×</button></header><span class="bank-status">${row.status==='archive'?'Opération historique':'Virement effectué'}</span><h2>${money(Math.abs(row.amount))}</h2><p>${escapeHtml(row.label)}</p><dl><dt>De</dt><dd>${escapeHtml(incoming?row.counterparty:holder)}</dd><dt>Vers</dt><dd>${escapeHtml(incoming?holder:row.counterparty)}</dd><dt>Compte VJ</dt><dd>${escapeHtml(bank.accountId)}</dd><dt>Date du jeu</dt><dd>${formatScheduledDay(row.day)}${row.time?' · '+row.time:''}</dd><dt>Référence</dt><dd>${escapeHtml(row.reference)}</dd><dt>Solde après opération</dt><dd>${row.balanceAfter===null?'Non enregistré dans l’ancienne sauvegarde':money(row.balanceAfter)}</dd></dl><small>Reçu de simulation · aucune opération bancaire réelle.</small>`;
  modal.querySelector('button').onclick=()=>modal.close();modal.addEventListener('close',()=>modal.remove());modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});document.body.append(modal);modal.showModal();
 }
 function rowsHtml(rows){return rows.length?rows.map(row=>`<button class="bank-transfer" data-bank-receipt="${escapeHtml(row.reference)}"><span class="bank-direction ${row.amount>0?'incoming':''}" aria-hidden="true">${row.amount>0?'↙':'↗'}</span><span class="bank-transfer-description"><strong>${escapeHtml(row.counterparty)}</strong><small>${escapeHtml(row.label)}</small><small>${formatScheduledDay(row.day)}${row.time?' · '+row.time:''} · ${row.status==='archive'?'Archive':'Effectué'}</small></span><strong class="bank-amount ${row.amount>0?'incoming':''}">${row.amount>0?'+':'−'}${money(Math.abs(row.amount))}</strong><span aria-hidden="true">›</span></button>`).join(''):'<div class="bank-empty"><strong>Ton compte est prêt.</strong><p>Les paiements et les cachets apparaîtront ici dès ta première opération.</p></div>';}
 function render(){
  const bank=ensure();saveSlots();
  // Preserve the existing loan, repayment, cancellation and budgeting controls.
  renderFinanceManagement();const management=document.createElement('div');while(appWindow.firstChild)management.append(appWindow.firstChild);
  const all=[...bank.transactions].reverse(),monthStart=getMonthStartDay(profile.day),month=all.filter(r=>r.day>=monthStart&&r.day<=profile.day);
  const incoming=month.reduce((sum,r)=>sum+Math.max(0,r.amount),0),outgoing=month.reduce((sum,r)=>sum+Math.max(0,-r.amount),0);
  const contracts=profile.gigs.filter(g=>['accepted','scheduled'].includes(g.status));
  appWindow.innerHTML=`<div class="app-heading"><div><h1>Banque Signal</h1><p>Ton compte professionnel VJ.</p></div></div><div class="bank-app"><section class="bank-account-card"><div><span>COMPTE COURANT · CAD</span><h2>${profile.godMode?'∞':money(profile.money)}</h2><p>${profile.godMode?'Argent illimité · tous les déblocages':'Solde disponible'}</p></div><div class="bank-card-mark" aria-hidden="true">S /</div><footer><strong>${escapeHtml(profile.name||'VJ')}</strong><button data-bank-account>Informations du compte ↗</button></footer></section><nav class="bank-tabs" aria-label="Sections de la banque"><button data-bank-tab="overview" aria-pressed="true">Aperçu</button><button data-bank-tab="transfers" aria-pressed="false">Virements</button><button data-bank-tab="account" aria-pressed="false">Mon compte</button><button data-bank-tab="management" aria-pressed="false">Crédits & budget</button></nav><section data-bank-panel="overview"><div class="bank-metrics"><div><small>Entrées ce mois</small><strong class="incoming">+${money(incoming)}</strong></div><div><small>Sorties ce mois</small><strong>−${money(outgoing)}</strong></div></div><div class="bank-section-title"><h2>Dernières opérations</h2><button data-bank-all>Tout voir</button></div>${rowsHtml(all.slice(0,5))}<details class="bank-pending"><summary>Cachets attendus · ${contracts.length}</summary><p>Un contrat accepté n’est pas encore de l’argent disponible. Le paiement dépend du bilan du show.</p>${contracts.map(g=>`<p><strong>${escapeHtml(g.title)}</strong> · ${money(g.budget)} prévus · ${formatScheduledDay(getGigAbsoluteDay(g))}</p>`).join('')||'<p>Aucun contrat en attente de paiement.</p>'}</details></section><section data-bank-panel="transfers" hidden><div class="bank-section-title"><h2>Historique des virements</h2><label>Afficher <select data-bank-filter><option value="all">Tout</option><option value="in">Entrées</option><option value="out">Sorties</option></select></label></div><div data-bank-history></div><button data-bank-more hidden>Afficher les opérations précédentes</button></section><section data-bank-panel="account" hidden><h2>Informations bancaires</h2><dl class="bank-account-details"><dt>Banque</dt><dd>Banque Signal</dd><dt>Titulaire</dt><dd>${escapeHtml(profile.name||'VJ')}</dd><dt>Compte</dt><dd>${escapeHtml(bank.accountId)}</dd><dt>Type</dt><dd>Compte courant professionnel</dd><dt>Devise</dt><dd>Dollars du jeu · CAD</dd><dt>Paiements clients</dt><dd>Virement après le bilan du contrat</dd></dl><p class="bank-note">Compte fictif lié à ce profil de jeu. Il est sauvegardé avec ta carrière.</p></section><section data-bank-panel="management" hidden></section><footer class="bank-footer">BANQUE SIGNAL · Simulation bancaire VJ</footer></div>`;
  // The legacy view is accessible here; there is only one bank entry on the desktop.
  appWindow.querySelector('[data-bank-panel="management"]').append(management);
  management.querySelector('.app-heading')?.remove();
  const selectTab=tab=>{appWindow.querySelectorAll('[data-bank-panel]').forEach(el=>el.hidden=el.dataset.bankPanel!==tab);appWindow.querySelectorAll('[data-bank-tab]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.bankTab===tab)));};
  appWindow.querySelectorAll('[data-bank-tab]').forEach(b=>b.onclick=()=>selectTab(b.dataset.bankTab));appWindow.querySelector('[data-bank-account]').onclick=()=>selectTab('account');appWindow.querySelector('[data-bank-all]').onclick=()=>selectTab('transfers');
  let shown=20;const history=appWindow.querySelector('[data-bank-history]'),filter=appWindow.querySelector('[data-bank-filter]'),more=appWindow.querySelector('[data-bank-more]');
  const updateHistory=()=>{const filtered=all.filter(r=>filter.value==='all'||(filter.value==='in'?r.amount>0:r.amount<0));history.innerHTML=rowsHtml(filtered.slice(0,shown));more.hidden=shown>=filtered.length;};filter.onchange=()=>{shown=20;updateHistory();};more.onclick=()=>{shown+=20;updateHistory();};updateHistory();
  appWindow.querySelector('.bank-app').addEventListener('click',e=>{const button=e.target.closest('[data-bank-receipt]');if(button)receipt(button.dataset.bankReceipt);});
  addWindowControls();
 }
 return {ensure,record,render,receipt};
})();
function renderFinance(){VJBank.render();}

window.addEventListener('vj-world-day',()=>{if(typeof currentApp!=='undefined'&&currentApp==='finance'&&document.body.classList.contains('screen-desktop'))renderFinance();});
