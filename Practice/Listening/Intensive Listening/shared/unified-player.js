/* Shared right-column audio control for every Intensive Listening lesson. */
(()=>{
"use strict";
const ready=()=>{
 const stage=document.querySelector(".page,.wrap");
 const player=document.getElementById("part1Audio")||document.getElementById("audio");
 if(!stage||!player||document.getElementById("intensiveAudioSidebar"))return;
 const panels=[...stage.children].filter(el=>el.classList?.contains("panel"));
 if(!panels.length)return;
 const layout=document.createElement("div");layout.className="intensive-layout";
 const main=document.createElement("div");main.className="intensive-main";
 const aside=document.createElement("aside");aside.className="intensive-aside";aside.id="intensiveAudioSidebar";
 stage.insertBefore(layout,panels[0]);layout.append(main,aside);
 panels.forEach(panel=>main.appendChild(panel));
 // Modern lessons have a #panel inside the 3-stage engine.
 // Legacy lessons keep both original panels, so their event handlers and states remain untouched.
 const oldBox=player.closest(".audio-box,.audio-panel");
 if(oldBox){oldBox.style.display="none";}
 player.controls=false;player.preload="metadata";
 const widget=document.createElement("div");widget.className="intensive-audio";
 widget.innerHTML='<h3><span aria-hidden="true">🎧</span> Audio luyện tập</h3><p class="intensive-audio-sub">Nghe lại, tua và điều chỉnh tốc độ.</p><div class="intensive-audio-controls"><button id="ilBack" type="button" title="Tua lùi 10 giây">↶ 10s</button><button class="intensive-audio-play" id="ilPlay" type="button" aria-label="Phát audio">▶ Phát</button><button id="ilForward" type="button" title="Tua tới 10 giây">10s ↷</button></div><input class="intensive-audio-timeline" id="ilSeek" type="range" min="0" max="100" step="0.1" value="0" aria-label="Kéo đến vị trí nghe"><div class="intensive-audio-footer"><span id="ilTime" class="intensive-audio-time">0:00 / 0:00</span><label class="intensive-audio-speed">Tốc độ <select id="ilSpeed" aria-label="Chọn tốc độ phát"><option value="0.5">0.5×</option><option value="0.75">0.75×</option><option value="0.85">0.85×</option><option value="1" selected>1×</option><option value="1.1">1.1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label></div><p id="ilStatus" class="intensive-audio-status" role="status"></p>';
 aside.appendChild(widget);
 widget.insertBefore(player,widget.querySelector(".intensive-audio-controls"));
 const byId=id=>document.getElementById(id);
 const fmt=n=>{n=Number.isFinite(n)?Math.floor(Math.max(0,n)):0;return Math.floor(n/60)+":"+String(n%60).padStart(2,"0")};
 const status=byId("ilStatus");const seek=byId("ilSeek"),time=byId("ilTime"),play=byId("ilPlay");
 const update=()=>{
  const d=player.duration,valid=Number.isFinite(d)&&d>0;
  time.textContent=fmt(player.currentTime)+" / "+fmt(valid?d:0);
  if(!seek.matches(":active"))seek.value=valid?String(player.currentTime/d*100):"0";
  seek.disabled=!valid;
  play.textContent=player.paused?"▶ Phát":"❚❚ Tạm dừng";
  play.setAttribute("aria-label",player.paused?"Phát audio":"Tạm dừng audio");
 };
 byId("ilBack").onclick=()=>{if(Number.isFinite(player.duration))player.currentTime=Math.max(0,player.currentTime-10)};
 byId("ilForward").onclick=()=>{if(Number.isFinite(player.duration))player.currentTime=Math.min(player.duration,player.currentTime+10)};
 play.onclick=async()=>{try{if(player.paused)await player.play();else player.pause();status.textContent=""}catch(e){status.textContent="Không phát được audio. Hãy kiểm tra tệp âm thanh và kết nối.";update()}};
 seek.oninput=()=>{if(Number.isFinite(player.duration)&&player.duration>0)player.currentTime=player.duration*Number(seek.value)/100};
 byId("ilSpeed").onchange=e=>{player.playbackRate=Number(e.target.value);const original=document.getElementById("speed");if(original)original.value=e.target.value};
 for(const event of ["loadedmetadata","durationchange","timeupdate","play","pause","ended","ratechange"])player.addEventListener(event,update);
 player.addEventListener("error",()=>{status.textContent="Không tải được audio của bài. Vui lòng tải lại trang.";update()});
 const originalStatus=document.getElementById("audioStatus");
 if(originalStatus)originalStatus.textContent="";
 player.addEventListener("loadedmetadata",()=>{status.textContent=""});
 update();
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});else ready();
})();