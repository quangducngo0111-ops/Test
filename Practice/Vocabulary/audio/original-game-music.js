/* Original, royalty-free procedural game music.
   Composed for Vocabulary Arcade using Web Audio synthesis; no third-party audio files.
   Music begins only after a user gesture. */
(function(global){
"use strict";
const STORAGE="VOCABULARY_MUSIC_ENABLED_V2";
const SONGS={
 whack:{bpm:148,root:60,notes:[0,4,7,12,7,4,2,7],bass:[0,0,5,7],wave:"square"},
 catcher:{bpm:112,root:62,notes:[0,2,4,7,9,7,4,2],bass:[0,5,7,5],wave:"sine"},
 racer:{bpm:172,root:57,notes:[0,7,12,7,5,7,10,7],bass:[0,5,7,3],wave:"sawtooth"},
 match:{bpm:102,root:64,notes:[0,4,7,11,9,7,4,2],bass:[0,5,9,7],wave:"triangle"},
 flappy:{bpm:134,root:65,notes:[0,4,7,4,2,5,9,7],bass:[0,5,7,5],wave:"sine"},
 balloon:{bpm:125,root:60,notes:[0,7,4,12,9,7,4,2],bass:[0,5,9,7],wave:"triangle"},
 shark:{bpm:136,root:55,notes:[0,3,7,10,7,3,5,7],bass:[0,3,5,7],wave:"triangle"},
 monkey:{bpm:118,root:62,notes:[0,4,7,9,7,4,2,0],bass:[0,5,7,5],wave:"square"},
 penalty:{bpm:138,root:60,notes:[0,7,12,7,5,9,12,7],bass:[0,5,7,5],wave:"triangle"},
 dungeon:{bpm:94,root:50,notes:[0,3,7,10,7,5,3,-2],bass:[0,3,5,2],wave:"triangle"},
 guardians:{bpm:110,root:55,notes:[0,3,7,12,10,7,5,3],bass:[0,5,3,7],wave:"triangle"},
 atelier:{bpm:108,root:64,notes:[0,4,7,11,7,4,2,7],bass:[0,5,9,7],wave:"sine"}
};
let ctx=null,bus=null,timer=null,active="",step=0,nextTime=0,enabled=true;
try{enabled=localStorage.getItem(STORAGE)!=="false"}catch(e){}
const midi=n=>440*Math.pow(2,(n-69)/12);
function setup(){
 const C=global.AudioContext||global.webkitAudioContext;if(!C)return false;
 try{
  if(!ctx){ctx=new C();bus=ctx.createGain();bus.gain.value=.34;bus.connect(ctx.destination);}
  if(ctx.state==="suspended")ctx.resume().catch(()=>{});
  return true;
 }catch(e){return false;}
}
function note(midiNumber,start,length,type,level){
 if(!ctx||!bus)return;
 const osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type=type;osc.frequency.setValueAtTime(midi(midiNumber),start);
 gain.gain.setValueAtTime(.0001,start);
 gain.gain.exponentialRampToValueAtTime(Math.max(.0002,level),start+.015);
 gain.gain.exponentialRampToValueAtTime(.0001,start+Math.max(.06,length));
 osc.connect(gain);gain.connect(bus);osc.start(start);osc.stop(start+length+.05);
}
function schedule(){
 if(!active||!enabled||!ctx)return;
 const song=SONGS[active]||SONGS.catcher;
 const beat=60/song.bpm,sub=beat/2;
 while(nextTime<ctx.currentTime+.16){
  const n=step%song.notes.length;
  note(song.root+12+song.notes[n],nextTime,sub*.74,song.wave,.075);
  if(step%2===0)note(song.root-12+song.bass[Math.floor(step/2)%song.bass.length],nextTime,beat*.82,"triangle",.09);
  if(step%4===2)note(song.root+7,nextTime,sub*.38,"sine",.018);
  nextTime+=sub;step++;
 }
}
function stop(){active="";if(timer){clearInterval(timer);timer=null;}if(bus&&ctx){bus.gain.cancelScheduledValues(ctx.currentTime);bus.gain.setTargetAtTime(.0001,ctx.currentTime,.06);}}
function start(name){
 if(!name)return;name=SONGS[name]?name:"catcher";
 if(!enabled){active=name;return;}
 if(!setup())return;
 if(active===name&&timer)return;
 stop();active=name;step=0;nextTime=ctx.currentTime+.06;
 bus.gain.setTargetAtTime(.34,ctx.currentTime,.07);
 schedule();timer=setInterval(schedule,90);
}
function setEnabled(value){
 enabled=!!value;
 try{localStorage.setItem(STORAGE,String(enabled));}catch(e){}
 if(!enabled){const last=active;stop();active=last;}
 else if(active){const last=active;active="";start(last);}
 return enabled;
}
global.OriginalGameMusic={start,stop,setEnabled,isEnabled:()=>enabled,tracks:Object.keys(SONGS)};
global.addEventListener("pagehide",stop);
document.addEventListener("visibilitychange",()=>{if(document.hidden&&ctx)ctx.suspend().catch(()=>{});});
})(window);
