/* Equipped effects are derived, never purchased into permanent skill points. */
const WEAR_SLOTS={
 'pin-vj':'badge','beanie-black':'headwear','cap-low':'headwear','hoodie-vj':'top','jacket-blackout':'top','jacket-reflective':'top','pants-cargo':'pants','pants-tech':'pants','shoes-cyan':'shoes','shoes-magenta':'shoes','headphones-basic':'headphones','headphones-pro':'headphones','gloves-stage':'hands','mask-club':'face','coat-tour':'top','vest-led':'top','full-fit-pro':'top',
};
function equipWear(item,target=profile) {
 target.equippedWear ||= {};
 target.equippedWear[WEAR_SLOTS[item.id.replace('clothing-','')]||'top']=item.id;
 // Wear selection stays separate from the creator base appearance, so removal restores it.
 if(WEAR_SLOTS[item.id.replace('clothing-','')]==='headphones')target.appearance.headphones=true;
}
function unequipWear(slot) {if(profile.activeRun){notify('Termine ou reprends le contrat avant de changer sa tenue.');return;}delete profile.equippedWear?.[slot];if(slot==='headphones')profile.appearance.headphones=false;clothingPreview=null;applyHumanAppearance();saveSlots();renderDesktop();}
function getEquipmentEffects(loadout=null,target=profile) {
 const result={technique:0,creativity:0,style:0,reputation:0,network:0,fatigue:0};
 const ids=new Set();
 if(loadout){for(const [key,choice] of Object.entries(loadout.selected||{})){
  if(choice.source==='missing'||choice.source==='loan')continue;
  const type=key.startsWith('accessory')?'accessory':key;ids.add(`${type}-${choice.slug}`);
 }}else for(const [type,slug] of Object.entries(target.gear||{}))ids.add(`${type}-${slug}`);
 const wear=loadout?.equippedWear||target.equippedWear||{};Object.values(wear).forEach(id=>ids.add(id));
 for(const id of ids){const item=shopItems.find(i=>i.id===id);if(!item||!['gear','clothing'].includes(item.category))continue;
  for(const key of Object.keys(result))result[key]+=Number(item.stats?.[key])||0;
 }
 for(const key of Object.keys(result))result[key]=clamp(result[key],-12,key==='fatigue'?16:18);
 return result;
}
function getEffectiveStats(loadout=null) {
 const effects=getEquipmentEffects(loadout);const result={...profile.stats};
 for(const key of Object.keys(effects))result[key]=clamp((Number(result[key])||0)+effects[key],0,100);
 return result;
}
function initializeCatalogRules() {
 for(const item of shopItems){
  if(item.category==='gear')item.effectScope='Bonus actif quand ce matériel est équipé ou sélectionné pour le contrat. Une seule fois par modèle, quelle que soit la quantité.';
  if(item.category==='clothing')item.effectScope='Bonus actif uniquement quand cette pièce est portée. Une pièce par emplacement ; aucun gain permanent à l’achat.';
  if(item.category==='vjloop'){
   item.effectScope='Sélection de trois clips parmi les 48 inclus, consultable dans Inventaire. Aucun fichier exclusif ni gain de compétence à l’achat.';
   item.stats={};item.scoreBonus=0;item.styleXp=0;item.tags=[getStyleMeta(item.styleTarget).label,'Bibliothèque live'];item.advantages=['Collection de style'];item.disadvantages=['Aucun gain de compétence automatique'];
  }
 }
 const duplicate=shopItems.find(i=>i.id==='accessory-mini-controller');
 if(duplicate){duplicate.label='StageCue Footswitch Duo';duplicate.description='Pédalier à deux commandes : change de clip en gardant les mains disponibles pour le mapping.';}
}
function renderEquippedWear() {
 return Object.entries(profile.equippedWear||{}).map(([slot,id])=>{const item=shopItems.find(i=>i.id===id);return item?`<div class="inventory-row"><span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.effectScope)}</small></span><button type="button" data-unwear="${slot}">Retirer</button></div>`:''}).join('');
}
