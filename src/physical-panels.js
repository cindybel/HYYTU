/* Physical interactions use shared career data in a dedicated panel, not the computer desktop. */
window.PhysicalPanels=(()=>{
 let current=null;const back=document.createElement('button');back.id='physical-panel-back';back.textContent='Retour au studio';back.hidden=true;document.body.append(back);
 function open(kind){current=kind;document.body.classList.add('physical-panel-open');document.body.dataset.physicalPanel=kind;back.hidden=false;}
 function close(){current=null;document.body.classList.remove('physical-panel-open');delete document.body.dataset.physicalPanel;back.hidden=true;closeAppWindow(false);clearInactiveWindows();StudioWorld.enter();}
 back.onclick=close;window.addEventListener('keydown',e=>{if(e.key==='Escape'&&current&&!document.querySelector('dialog[open]')){e.preventDefault();close();}});
 function tick(){if(current&&!currentApp){current=null;document.body.classList.remove('physical-panel-open');back.hidden=true;StudioWorld.enter();}}
 return {open,close,tick,get current(){return current;}};
})();

/* GOD99 editor is part of the normal game build on the dedicated editor branch. */
(()=>{
 if(window.God99SceneEditor||document.querySelector('script[data-god99-editor]'))return;
 const script=document.createElement('script');
 script.defer=true;
 script.dataset.god99Editor='';
 script.src='./src/god99-scene-editor.js?v=20260916c';
 document.head.append(script);
})();
