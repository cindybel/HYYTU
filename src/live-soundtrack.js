/* Locally synthesized learning track, aligned to the same timeline as the cues. */
window.LiveSoundtrack=class {
 constructor(context=null){this.lastBeat=-1;this.voices=new Set();const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;this.context=context||new AC();this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);this.context.resume().catch(()=>{});}
 tone(hz,duration,volume,type='sine',slide=false){const a=this.context;if(!a||(a.state!=='running'&&!a.startRendering))return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime;o.type=type;o.frequency.setValueAtTime(hz,t);if(slide)o.frequency.exponentialRampToValueAtTime(42,t+.12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master);o.onended=()=>{o.disconnect();g.disconnect();this.voices.delete(o);};this.voices.add(o);o.start();o.stop(t+duration+.02);}
 noise(duration,volume,frequency=4500){const a=this.context;if(!a)return;const buffer=a.createBuffer(1,Math.ceil(a.sampleRate*duration),a.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/data.length*7);const source=a.createBufferSource(),filter=a.createBiquadFilter(),gain=a.createGain();source.buffer=buffer;filter.type='highpass';filter.frequency.value=frequency;gain.gain.value=volume;source.connect(filter);filter.connect(gain);gain.connect(this.master);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();this.voices.delete(source);};this.voices.add(source);source.start();}
 tick(show){
  if(!this.context)return;const muted=show.paused||show.completed||document.hidden||profile.settings.liveMusic===false||isMusicActive();this.master.gain.setTargetAtTime(muted?0:(profile.settings.volume??70)/100,this.context.currentTime,.03);if(muted)return;
  const pulse=Math.floor(show.elapsed*(show.showProfile?.bpm||120)/60*4);if(pulse===this.lastBeat)return;this.lastBeat=pulse;
  const phase=Math.min(3,Math.floor(show.elapsed/15)),step=pulse%16,beat=Math.floor(pulse/4),genre=show.genre||'techno',quarter=step%4===0,energy=phase===2?1:phase===1?.8:.6;
  const kick=()=>this.tone(140,.23,.11*energy,'sine',true),snare=()=>{this.noise(.16,.045*energy,1100);this.tone(185,.08,.025*energy,'triangle');},hat=(open=false)=>this.noise(open?.16:.055,.012*energy,6500);
  if(phase!==3){
   if(genre==='techno'){if(quarter)kick();if(step%4===2)hat();if(phase>0&&[4,12].includes(step))snare();if(step%4===3)this.tone([65.4,65.4,77.8,58.3][Math.floor(step/4)],.15,.034*energy,'sawtooth');}
   else if(genre==='hiphop'){if([0,6,10].includes(step))kick();if([4,12].includes(step))snare();if(step%2===0)hat();if([0,6,10].includes(step))this.tone([49,58.27,65.4][[0,6,10].indexOf(step)],.44,.05*energy);}
   else if(genre==='chill'){if(step===0)kick();if(step===8)this.noise(.21,.016,1900);if([2,6,10,14].includes(step))hat();if(quarter)this.tone([261.6,329.6,392,493.9][Math.floor(step/4)],.75,.016);}
   else if(genre==='psytrance'){if(quarter)kick();else this.tone(65.4,.105,.032*energy,'sawtooth');if(step%2)hat();if(phase>0&&step%4===2)this.tone([523.3,622.3,784,932.3][Math.floor(step/4)],.10,.018,'triangle');}
   else{if([0,2,8,10].includes(step))kick();if([4,12].includes(step))snare();if(step%2===0)hat(step===0);if(quarter){this.tone(82.4,.32,.022*energy,'sawtooth');this.tone(123.47,.31,.012*energy,'sawtooth');}}
  }
  if(pulse%32===0){const chord=genre==='chill'?[130.81,164.81,196,246.94]:genre==='hiphop'?[98,116.54,146.83]:[130.81,155.56,196];chord.forEach(hz=>this.tone(hz,phase===3?3.6:2.8,.011));}
  if(phase===3&&pulse%16===0)this.tone(genre==='rock'?329.6:392,.9,.019);
 }
 crowd(){const a=this.context;if(!a)return;const buffer=a.createBuffer(1,Math.floor(a.sampleRate*.65),a.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++){const t=i/a.sampleRate;data[i]=(Math.random()*2-1)*Math.exp(-t*6)*(Math.sin(t*47)**2);}
 const source=a.createBufferSource(),filter=a.createBiquadFilter(),gain=a.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=1400;gain.gain.value=.045;source.connect(filter);filter.connect(gain);gain.connect(this.master);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();this.voices.delete(source);};this.voices.add(source);source.start();}
 mute(){if(this.context)this.master.gain.setTargetAtTime(0,this.context.currentTime,.015);}
 resume(){this.context?.resume().catch(()=>{});}
 dispose(){for(const v of this.voices){try{v.stop();}catch{}}this.voices.clear();this.context?.close().catch(()=>{});}
};
