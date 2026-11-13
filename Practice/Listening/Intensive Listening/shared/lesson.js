(()=>{"use strict";
const L=window.INTENSIVE_LESSON;if(!L)return;
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const words=s=>String(s??"").normalize("NFKC").toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9' ]/g," ").trim().split(/\s+/).filter(Boolean);
const same=(a,b)=>words(a).join(" ")===words(b).join(" ");
let student={};try{student=JSON.parse(localStorage.getItem("IELTS_PRACTICE_STUDENT")||"{}")}catch{}
const isValidStudent=obj=>obj&&typeof obj.name==="string"&&obj.name.trim()&&typeof obj.className==="string"&&obj.className.trim();
const identityStyle=document.createElement("style");
identityStyle.textContent=String.raw`
#ilIdentityGate{max-width:620px;margin:22px auto;background:#fff;border:1px solid #dcd4f1;border-radius:16px;padding:24px;box-shadow:0 12px 40px #28126018}
#ilIdentityGate h2{margin:0 0 5px;color:#281260}
#ilIdentityGate p{font-size:13px;color:#6c7085;margin:4px 0 18px}
#ilIdentityGate .fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}
#ilIdentityGate label{display:block;font-weight:800;color:#44356d;font-size:12px}
#ilIdentityGate input{display:block;width:100%;margin-top:5px;border:1px solid #c7c4df;padding:11px;border-radius:9px;background:#fff}
#ilIdentityGate button{background:#5834ae;color:#fff;border:0;border-radius:9px;padding:12px 18px;font-weight:850;cursor:pointer;margin-top:15px}
#ilIdentityGate .error{color:#b83448;font-size:12px;margin-top:9px;min-height:18px}
.il-student-edit{margin-left:7px;border:1px solid #ddd2f3;background:#f8f5ff;color:#56389b;border-radius:7px;font-size:11px;padding:4px 8px;cursor:pointer}
@media(max-width:540px){#ilIdentityGate .fields{grid-template-columns:1fr}#ilIdentityGate{padding:17px}}
`;
document.head.appendChild(identityStyle);
function showIdentityForm(){
 const panel=document.getElementById("panel"),steps=document.getElementById("steps");
 if(steps)steps.hidden=true;
 const savedName=student.name||"",savedClass=student.className||"";
 if(panel)panel.innerHTML='<section id="ilIdentityGate"><h2>Thông tin học sinh</h2><p>Nhập họ tên và lớp trước khi bắt đầu bài Intensive Listening. Kết quả sẽ gắn với đúng học sinh khi nộp bài.</p><form id="ilStudentForm"><div class="fields"><label>Họ và tên *<input id="ilStudentName" name="studentName" maxlength="100" required autocomplete="name" placeholder="Nguyễn Văn A"></label><label>Lớp *<input id="ilStudentClass" name="studentClass" maxlength="70" required placeholder="VD: XD25A02.1"></label></div><div class="error" id="ilStudentError" role="alert"></div><button type="submit">Bắt đầu luyện nghe →</button></form></section>';
 const nameInput=document.getElementById("ilStudentName"),classInput=document.getElementById("ilStudentClass");
 if(nameInput)nameInput.value=savedName;
 if(classInput)classInput.value=savedClass;
 const form=document.getElementById("ilStudentForm");
 if(form)form.onsubmit=event=>{
  event.preventDefault();
  const name=(nameInput.value||"").trim().replace(/\s+/g," "),className=(classInput.value||"").trim().replace(/\s+/g," ");
  if(!name||!className){document.getElementById("ilStudentError").textContent="Vui lòng nhập đủ họ tên và lớp.";return}
  localStorage.setItem("IELTS_PRACTICE_STUDENT",JSON.stringify({...student,name,className}));
  window.location.reload();
 };
}
if(!isValidStudent(student)){showIdentityForm();return}
const studentBar=document.getElementById("student");
if(studentBar){
 studentBar.innerHTML='<span id="ilStudentLabel"></span> <button id="ilChangeStudent" type="button" class="il-student-edit">Đổi học sinh</button>';
 document.getElementById("ilStudentLabel").textContent=student.name+" · "+student.className;
 document.getElementById("ilChangeStudent").onclick=()=>{showIdentityForm();const a=document.getElementById("audio");if(a)a.pause()};
}
const key="INTENSIVE_STAGE_V2_"+L.id+"_"+String(student.name||"guest").toLowerCase()+"_"+(student.className||"");
let state={stage:0,gaps:{},gapsDone:false,dict:{},dictChecked:false,dictScore:0,unlocked:false,exam:{},submitted:false};try{state={...state,...JSON.parse(localStorage.getItem(key)||"{}")}}catch{}
// Reset only Phase 1 progress when the actual gap set changes, to avoid old indices and grades.
if(L.gapRevision&&state.gapRevision!==L.gapRevision){
 state.gaps={};state.gapChecked=false;state.gapsDone=false;state.gapScore=0;state.gapTotal=L.gapAnswers.length;
 state.dict={};state.dictChecked=false;state.dictScore=0;state.dictRetrying={};state.unlocked=false;
 state.stage=0;
 state.gapRevision=L.gapRevision;
 localStorage.setItem(key,JSON.stringify(state));
}
// When a lesson receives an authoritative transcript/cue revision, discard only stale Dictation data
// and old browser-specific clip overrides; preserve completed Gap-fill and Listening answers.
if(L.dictationRevision&&state.dictationRevision!==L.dictationRevision){
 state.dict={};
 state.dictChecked=false;
 state.dictScore=0;
 state.dictRetrying={};
 state.clipOverrides={};
 state.unlocked=false;
 if(state.stage>=2)state.stage=state.gapsDone?1:0;
 state.dictationRevision=L.dictationRevision;
 localStorage.setItem(key,JSON.stringify(state));
}
const save=()=>localStorage.setItem(key,JSON.stringify(state));
// Student name/class and switch control are populated by the entry form above.
$("heading").textContent="Part "+L.part+" · Bài "+String(L.number).padStart(2,"0")+" · "+L.title;
const audio=$("audio");if(L.audio)audio.src=L.audio;
/* Audio is provided by the lesson itself; the shared sidebar owns all playback controls. */

/* Contextual Vietnamese vocabulary: select/double-click a word or phrase in transcript. */
const meaningMap=Object.fromEntries(Object.entries(L.dictionary||{}).map(([k,v])=>[k.toLowerCase().trim(),v]));
function meaningFor(raw){
 const k=String(raw||"").toLowerCase().replace(/[“”"‘’]/g,"'").replace(/[.,!?;:()[\]{}]/g," ").replace(/\s+/g," ").trim();
 if(!k)return "";
 if(meaningMap[k])return meaningMap[k];
 for(const variant of [k.replace(/ies$/,"y"),k.replace(/s$/,""),k.replace(/ing$/,""),k.replace(/ing$/,"e"),k.replace(/ed$/,""),k.replace(/ed$/,"e")])if(meaningMap[variant])return meaningMap[variant];
 return "";
}
const vocabPopup=document.createElement("div");vocabPopup.id="intensiveVocabPopup";vocabPopup.setAttribute("role","status");vocabPopup.hidden=true;document.body.appendChild(vocabPopup);
function hideVocab(){vocabPopup.hidden=true}
function showVocab(){
 const selection=window.getSelection();if(!selection||selection.isCollapsed||!selection.rangeCount)return;
 const range=selection.getRangeAt(0),text=selection.toString().trim();
 if(!text||text.length>80)return;
 const region=range.commonAncestorContainer;const node=region.nodeType===1?region:region.parentElement;
 if(!node||!$("panel")?.contains(node)||state.stage!==0)return;
 const meaning=meaningFor(text);if(!meaning){hideVocab();return}
 vocabPopup.innerHTML="<b>"+esc(text)+"</b><span>"+esc(meaning)+"</span><small>Nghĩa theo ngữ cảnh bài nghe</small>";
 vocabPopup.hidden=false;
 const rect=range.getBoundingClientRect();
 requestAnimationFrame(()=>{const w=vocabPopup.offsetWidth,h=vocabPopup.offsetHeight;vocabPopup.style.left=Math.max(10,Math.min(innerWidth-w-10,rect.left+rect.width/2-w/2))+"px";vocabPopup.style.top=Math.max(65,rect.bottom+h+12>innerHeight?rect.top-h-10:rect.bottom+9)+"px"});
}
document.addEventListener("mouseup",()=>setTimeout(showVocab,15));
document.addEventListener("touchend",()=>setTimeout(showVocab,80),{passive:true});
document.addEventListener("pointerdown",event=>{if(!vocabPopup.contains(event.target))hideVocab()});
window.addEventListener("scroll",hideVocab,{passive:true});
const vocabStyle=document.createElement("style");vocabStyle.textContent="#intensiveVocabPopup{position:fixed;z-index:9999;max-width:min(340px,90vw);min-width:130px;background:#fff;border:1px solid #d8c7fa;border-radius:12px;box-shadow:0 9px 32px #28126030;padding:11px 14px;color:#21164b;font-size:12px;line-height:1.5}#intensiveVocabPopup[hidden]{display:none!important}#intensiveVocabPopup b,#intensiveVocabPopup span,#intensiveVocabPopup small{display:block}#intensiveVocabPopup b{font-weight:900;color:#3b0e90;font-size:13px}#intensiveVocabPopup small{color:#8585a0;font-size:10px;margin-top:5px}.vocab-tip{border:1px solid #e5ddff;background:#faf8ff;border-radius:9px;padding:9px 11px;color:#574287;font-size:11px;margin:10px 0 16px}";document.head.appendChild(vocabStyle);

function lcs(a,b){const x=words(a),y=words(b);let prev=Array(y.length+1).fill(0);for(let i=1;i<=x.length;i++){let cur=Array(y.length+1).fill(0);for(let j=1;j<=y.length;j++)cur[j]=x[i-1]===y[j-1]?prev[j-1]+1:Math.max(cur[j-1],prev[j]);prev=cur}return prev[y.length]/Math.max(x.length,y.length,1)}
function pct(){return 100*L.dictations.reduce((s,t,i)=>s+lcs(state.dict[i]||"",t),0)/L.dictations.length}
function header(){const allowed=[true,!!state.gapsDone&&state.gapScore/state.gapTotal>0.8,!!state.unlocked];$("steps").innerHTML=["1 · Nghe điền từ (>80%)","2 · Dictation (>80%)","3 · Bài nghe chính"].map((x,i)=>'<button '+(!allowed[i]?'disabled':'')+' data-stage="'+i+'" class="'+(state.stage===i?'active':'')+'">'+x+(!allowed[i]?' 🔒':'')+'</button>').join("");document.querySelectorAll("[data-stage]").forEach(e=>e.onclick=()=>{state.stage=+e.dataset.stage;save();render()})}
function renderGaps(){
 const reviewed=state.gapChecked===true;
 let n=0;
 const body=L.turns.map(turn=>'<div class="turn"><b>'+esc(turn.speaker)+'</b><div>'+esc(turn.text).replace(/\[\[([^\]]+)\]\]/g,()=>{
  const i=n++,correct=reviewed&&same(state.gaps[i]||"",L.gapAnswers[i]);
  return '<span class="gap-field"><input class="gap '+(reviewed?(correct?"correct":"wrong"):"")+'" data-i="'+i+'" value="'+esc(state.gaps[i]||"")+'" placeholder="Điền từ" aria-label="Chỗ trống '+(i+1)+'" autocomplete="off" spellcheck="false" '+(reviewed?'readonly aria-readonly="true"':'')+'>'+(reviewed?'<small class="'+(correct?"right":"wrong")+'">'+(correct?"✓ Đúng":"✕ Sai · "+esc(L.gapAnswers[i]))+'</small>':"")+'</span>';
 })+'</div></div>').join("");
 const count=Number(state.gapScore)||0,total=L.gapAnswers.length,percent=total?count/total*100:0;
 const passed=reviewed&&count/total>0.8;
 $("panel").innerHTML='<h2>Giai đoạn 1 · Nghe điền từ</h2><p>Nghe và điền vào transcript. Bài chỉ được chấm sau khi nộp; cần đạt <b>trên 80%</b> để mở Dictation.</p><div class="vocab-tip">🔎 <b>Tra từ tiếng Việt:</b> bôi đen hoặc nháy đúp vào từ/cụm từ trong transcript để xem nghĩa theo ngữ cảnh.</div>'+(reviewed?'<div class="score '+(passed?"right":"wrong")+'">Kết quả: '+count+'/'+total+' · '+percent.toFixed(1)+'% · '+(passed?"Đã đạt, có thể tiếp tục Dictation.":"Chưa đạt yêu cầu. Nhấn Làm lại để bắt đầu với các ô trống mới.")+'</div><p class="help">Đây là kết quả của lượt vừa nộp. Ô trả lời được khóa để không sửa đáp án sau khi xem chữa bài.</p>':'')+body+'<div class="toolbar">'+(reviewed?'<button type="button" class="secondary" id="retryGap">↻ Làm lại Gap-fill (xóa toàn bộ câu trả lời)</button>': '<button type="button" class="primary" id="gapDone">Nộp Gap-fill & xem kết quả</button>')+(passed?'<button type="button" class="primary" id="toDict">Tiếp tục Dictation →</button>':"")+'</div>';
 if(!reviewed){
  document.querySelectorAll(".gap").forEach(e=>e.oninput=()=>{state.gaps[e.dataset.i]=e.value;save()});
  $("gapDone").onclick=()=>{
   state.gapScore=L.gapAnswers.filter((ans,i)=>same(state.gaps[i]||"",ans)).length;
   state.gapTotal=L.gapAnswers.length;state.gapChecked=true;state.gapsDone=state.gapScore/state.gapTotal>0.8;
   if(!state.gapsDone)state.unlocked=false;
   save();render();
  };
 }else{
  $("retryGap").onclick=()=>{
   if(passed&&!confirm("Làm lại sẽ xóa kết quả Gap-fill và tiến độ Dictation/Listening hiện tại. Tiếp tục?"))return;
   state.stage=0;state.gaps={};state.gapChecked=false;state.gapsDone=false;state.gapScore=0;state.gapTotal=0;
   state.dict={};state.dictChecked=false;state.dictScore=0;state.unlocked=false;
   state.exam={};state.submitted=false;state.reportedAt=null;state.examStartedAt=null;
   save();render();
   const first=document.querySelector(".gap");if(first)first.focus({preventScroll:true});
  };
 }
 if($("toDict"))$("toDict").onclick=()=>{state.stage=1;save();render()};
}
function renderDict(){
const pending=Object.values(state.dictRetrying||{}).some(Boolean);
const score=state.dictChecked&&!pending?pct():null;
const fmt=t=>{t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")};
state.clipOverrides=state.clipOverrides||{};
state.dictRetrying=state.dictRetrying||{};
const cues=L.dictationCues||[];
const effectiveCue=i=>state.clipOverrides[i]||cues[i]||null;
const cards=L.dictations.map((t,i)=>{
 const cue=effectiveCue(i), duration=cue?Math.max(0,cue.end-cue.start):0;
 const checked=state.dictChecked&&!state.dictRetrying[i];
 const cardScore=(lcs(state.dict[i]||"",t)*100).toFixed(1);
 const calibrated=!!state.clipOverrides[i];
 return '<article class="dictation-card card" data-dict-card="'+i+'"><div class="dictation-top"><div class="q-label">Dictation '+String(i+1).padStart(2,"0")+'</div><span class="duration">'+(cue?fmt(duration):"Chưa định vị")+'</span></div>'+
 '<div class="clip-player"><button type="button" class="play-clip" data-clip-action="toggle" data-i="'+i+'">▶ Nghe đoạn</button><input type="range" class="clip-progress" data-clip-seek="'+i+'" min="0" max="'+(duration||1)+'" step=".1" value="0" '+(!cue?"disabled":"")+'><span class="clip-time" data-clip-time="'+i+'">0:00 / '+fmt(duration)+'</span></div>'+
 '<div class="clip-controls"><button type="button" class="speed-btn" data-clip-action="back" data-i="'+i+'">↶ 3s</button><button type="button" class="speed-btn" data-clip-action="replay" data-i="'+i+'">↻ Nghe lại</button><button type="button" class="speed-btn" data-clip-action="forward" data-i="'+i+'">3s ↷</button><span class="speed-label">Tốc độ:</span>'+[0.5,0.75,1].map(rate=>'<button type="button" class="speed-btn '+(rate===1?"active":"")+'" data-speed="'+rate+'" data-i="'+i+'">'+rate+'×</button>').join("")+'</div>'+
 '<details class="clip-tune"><summary>⚙ Chỉnh mốc audio nếu đoạn nghe chưa khớp'+(calibrated?" · đã lưu":"")+'</summary><div class="clip-tune-controls"><label>Bắt đầu <input data-cue-start="'+i+'" type="number" min="0" max="9999" step=".5" value="'+(cue?.start??0)+'"> giây</label><label>Kết thúc <input data-cue-end="'+i+'" type="number" min="0" max="9999" step=".5" value="'+(cue?.end??0)+'"> giây</label><button type="button" data-cue-save="'+i+'" class="speed-btn">Lưu & nghe thử</button><button type="button" data-cue-reset="'+i+'" class="speed-btn">Khôi phục mốc</button></div><small>Chỉnh mốc chỉ ảnh hưởng câu này và được lưu trên thiết bị. Mốc gốc có thể lệch nếu chưa được căn chỉnh theo audio.</small></details>'+
 '<textarea class="dictation-input" data-dict="'+i+'" placeholder="Chép lại chính xác những gì bạn nghe được...">'+esc(state.dict[i]||"")+'</textarea>'+
 (checked?'<div class="review"><b>Chính xác: '+cardScore+'%</b><p>'+esc(t)+'</p></div>':'')+
 '<div class="dictation-retry-row"><button type="button" class="secondary dict-retry" data-dict-retry="'+i+'">↻ Làm lại câu '+(i+1)+'</button><span class="dictation-attempt-state">'+(state.dictRetrying[i]?"Đã xóa câu này, các câu khác được giữ nguyên.":checked?"Đã chấm":"Đang luyện tập")+'</span></div></article>';
}).join("");
$("panel").innerHTML='<h2>Giai đoạn 2 · Dictation</h2><p class="score">Điểm Gap-fill: '+(state.gapScore??0)+'/'+(state.gapTotal??L.gapAnswers.length)+'</p><p>Nghe từng đoạn, tua và điều chỉnh tốc độ rồi chép chính tả. <b>Phải đạt trên 80%</b> độ chính xác trung bình mới mở Listening chính. Nhấn <b>Làm lại câu</b> để xóa riêng câu đó, không mất bài đã làm.</p><div class="score">'+(pending?"Có câu đang làm lại · Chấm Dictation để cập nhật điểm":score===null?"Chưa chấm":"Độ chính xác: "+score.toFixed(1)+"%")+(state.unlocked?" · Đã mở khóa":" · Mục tiêu: trên 80%")+'</div>'+cards+'<button class="primary" id="dictGrade">Chấm Dictation</button>'+(state.unlocked?'<button class="primary" id="toExam">Vào bài Listening →</button>':"");
document.querySelectorAll("[data-dict]").forEach(el=>el.oninput=()=>{state.dict[el.dataset.dict]=el.value;state.dictRetrying[el.dataset.dict]=true;state.unlocked=false;state.dictScore=0;save()});
document.querySelectorAll("[data-dict-retry]").forEach(btn=>btn.onclick=()=>{
 const i=Number(btn.dataset.dictRetry);
 state.dict[i]="";state.dictRetrying[i]=true;state.dictScore=0;state.unlocked=false;save();render();
 const input=document.querySelector('[data-dict="'+i+'"]');if(input){input.scrollIntoView({block:"center"});input.focus({preventScroll:true})}
});
let activeClip=null;
function listen(i,offset=0){
 const cue=effectiveCue(i);if(!cue||!audio.src)return;
 if(!Number.isFinite(cue.start)||!Number.isFinite(cue.end)||cue.end<=cue.start)return;
 activeClip=i;segmentEnd=cue.end;
 const start=Math.max(0,cue.start+offset);
 const seek=()=>{audio.currentTime=Math.max(cue.start,Math.min(cue.end-0.1,start));audio.play().catch(error=>console.warn("Cannot play Dictation clip",error))};
 if(audio.readyState===0)audio.addEventListener("loadedmetadata",seek,{once:true,signal:clipEvents.signal});else seek();
}
document.querySelectorAll("[data-clip-action]").forEach(button=>button.onclick=()=>{
 const i=Number(button.dataset.i),act=button.dataset.clipAction,cue=effectiveCue(i);if(!cue)return;
 if(act==="toggle"){if(activeClip===i&&!audio.paused){audio.pause();return}listen(i)}
 if(act==="replay")listen(i);
 if(act==="back"||act==="forward"){const offset=activeClip===i?audio.currentTime-cue.start:0;listen(i,offset+(act==="back"?-3:3))}
});
document.querySelectorAll("[data-clip-seek]").forEach(el=>el.oninput=()=>{const i=Number(el.dataset.clipSeek);listen(i,Number(el.value))});
document.querySelectorAll("[data-speed]").forEach(button=>button.onclick=()=>{
 const speed=Number(button.dataset.speed);audio.playbackRate=speed;
 document.querySelectorAll('[data-speed][data-i="'+button.dataset.i+'"]').forEach(b=>b.classList.toggle("active",Number(b.dataset.speed)===speed));
 const mainSpeed=document.getElementById("ilSpeed");if(mainSpeed)mainSpeed.value=String(speed)
});
document.querySelectorAll("[data-cue-save]").forEach(button=>button.onclick=()=>{
 const i=Number(button.dataset.cueSave);
 const start=Number(document.querySelector('[data-cue-start="'+i+'"]').value),end=Number(document.querySelector('[data-cue-end="'+i+'"]').value);
 if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end-start<0.5||(Number.isFinite(audio.duration)&&end>audio.duration+1)){alert("Mốc không hợp lệ. Vui lòng đặt thời điểm kết thúc sau thời điểm bắt đầu và trong thời lượng audio.");return}
 state.clipOverrides[i]={start,end};save();render();listen(i);
});
document.querySelectorAll("[data-cue-reset]").forEach(button=>button.onclick=()=>{
 const i=Number(button.dataset.cueReset);delete state.clipOverrides[i];save();render();listen(i)
});
const onTime=()=>{
 if(activeClip===null)return;
 const cue=effectiveCue(activeClip);if(!cue)return;
 const elapsed=Math.max(0,Math.min(cue.end-cue.start,audio.currentTime-cue.start));
 const seek=document.querySelector('[data-clip-seek="'+activeClip+'"]'),time=document.querySelector('[data-clip-time="'+activeClip+'"]');
 if(seek)seek.value=String(elapsed);
 if(time)time.textContent=fmt(elapsed)+" / "+fmt(cue.end-cue.start);
 if(audio.currentTime>=cue.end){audio.pause();activeClip=null}
};
audio.addEventListener("timeupdate",onTime,{signal:clipEvents.signal});
$("dictGrade").onclick=()=>{state.dictRetrying={};state.dictChecked=true;state.dictScore=pct();state.unlocked=state.dictScore>80;save();render()};
if($("toExam"))$("toExam").onclick=()=>{state.stage=2;state.examStartedAt=state.examStartedAt||Date.now();save();render()};
}
function correct(q){const v=state.exam[q.n];if(q.type==="two"){return Array.isArray(v)&&v.length===2&&v.every(x=>q.answers.includes(x))&&new Set(v).size===2}return q.answers.some(a=>words(a).join(" ")===words(v||"").join(" "))}

function formatTime(t){t=Math.max(0,Math.floor(Number(t)||0));return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0")}
let segmentEnd=0;
audio.addEventListener("timeupdate",()=>{if(segmentEnd>0&&audio.currentTime>=segmentEnd){audio.pause();segmentEnd=0}});
function replayCue(n){
 const q=L.exam.find(x=>x.n===n);
 if(!q?.cue)return;
 if(!audio.src)return
 segmentEnd=q.cue.end;audio.currentTime=Math.max(0,q.cue.start-1);
 audio.play().catch(error=>console.warn("Audio unavailable",error));
 audio.scrollIntoView({behavior:"smooth",block:"center"});
}
function reviewHTML(q){
 const v=state.exam[q.n],correctAnswer=q.answers.join(" / ");
 const answerText=Array.isArray(v)?v.join(", "):(v||"Chưa trả lời");
 const cue=q.cue?'<button type="button" class="secondary evidence-play" data-cue="'+q.n+'">▶ Nghe đoạn chứa đáp án (≈'+formatTime(q.cue.start)+'–'+formatTime(q.cue.end)+')</button>':'';
 const sentence=q.evidence?'<blockquote class="evidence-quote">'+esc(q.evidence)+'</blockquote>':'';
 const jump=Number.isInteger(q.turnIndex)?'<button class="secondary transcript-jump" type="button" data-turn="'+q.turnIndex+'">📍 Xem trong transcript đầy đủ</button>':'';
 return '<details class="evidence-details" '+(!correct(q)?"open":"")+'><summary>📝 Giải thích & trích dẫn âm thanh</summary><p><b>Đáp án của em:</b> '+esc(answerText)+' · <b>Đáp án đúng:</b> '+esc(correctAnswer)+'</p>'+cue+jump+sentence+'<p><b>Giải thích:</b> '+esc(q.explanation||"Đối chiếu từ khóa và nội dung đã nghe với transcript.")+'</p><small>Thời điểm phát lại được căn theo nội dung nghe, có thể lệch vài giây. Nhấn Play để đối chiếu trong MP3.</small></details>';
}
function transcriptHTML(){return '<details class="transcript-all" id="transcriptAll"><summary>📄 Xem transcript đầy đủ sau khi nộp</summary>'+L.turns.map((t,i)=>'<div class="transcript-turn" id="transcriptTurn'+i+'"><b>'+esc(t.speaker)+'</b><p>'+esc(t.text.replaceAll("[[","").replaceAll("]]",""))+'</p></div>').join("")+'</details>'}
function attachReplay(){document.querySelectorAll("[data-cue]").forEach(b=>b.onclick=()=>replayCue(+b.dataset.cue));document.querySelectorAll("[data-turn]").forEach(b=>b.onclick=()=>{const t=document.getElementById("transcriptAll");t.open=true;const target=document.getElementById("transcriptTurn"+b.dataset.turn);if(target){target.scrollIntoView({behavior:"smooth",block:"center"});target.classList.add("active-evidence");setTimeout(()=>target.classList.remove("active-evidence"),3800)}})}


const RESULT_ENDPOINT="https://script.google.com/macros/s/AKfycbwfwWjJ7Q3VTJEF5ldKGnFKYoziQdntAzRjq1Yqy6HSmbZSc69ijSdOvMCC_Zogbpcm/exec";
async function reportListening(score,total){
 if(!student.name||!student.className)return;
 const details=JSON.stringify({title:L.title,part:L.part,exercise:"Intensive Listening",gapScore:state.gapScore,dictationPercent:state.dictScore,answers:L.exam.map(q=>({question:q.n,answer:state.exam[q.n]??"",correct:correct(q),key:q.answers}))});
 const data=new URLSearchParams({mode:"PRACTICE",name:student.name,className:student.className,skill:"Listening",practiceType:"Intensive Listening · Part "+L.part,practiceId:String(L.number).padStart(2,"0"),score:String(score),total:String(total),durationSeconds:String(Math.round((Date.now()-(state.examStartedAt||Date.now()))/1000)),details});
 try{await fetch(RESULT_ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:data.toString()});state.reportedAt=new Date().toISOString();save();const e=$("sheetStatus");if(e)e.textContent="✓ Đã gửi yêu cầu lưu kết quả. Hãy kiểm tra tab PRACTICE_RESULTS."}
 catch(e){const x=$("sheetStatus");if(x)x.textContent="Không thể gửi kết quả. Vui lòng kiểm tra kết nối và nộp lại bài.";console.warn("Sheet request failed",e)}
}

function renderExam(){if(!state.unlocked||!(state.gapScore/state.gapTotal>0.8)||!(Number(state.dictScore)>80)){state.stage=state.gapsDone?1:0;render();return}let total=L.exam.reduce((n,q)=>n+(q.type==="two"?2:1),0),score=L.exam.reduce((n,q)=>{
 if(q.type==="two"){const choices=Array.isArray(state.exam[q.n])?state.exam[q.n]:[];return n+choices.filter(x=>q.answers.includes(x)).length}
 return n+(correct(q)?1:0)
},0),done=state.submitted;
let body=L.exam.map(q=>{const value=state.exam[q.n];let field="";
if(q.type==="blank")field='<div class="question">'+esc(q.text).replace(/_{4,}|\{gap\}/,'<input class="inline" data-q="'+q.n+'" value="'+esc(value||"")+'" '+(done?"disabled":"")+' placeholder="Điền từ">')+'</div>';
if(q.type==="mc"||q.type==="two")field='<p>'+esc(q.text)+'</p>'+q.options.map((t,i)=>{let a=String.fromCharCode(65+i),checked=q.type==="two"?(Array.isArray(value)&&value.includes(a)):value===a;return '<label class="option"><input data-q="'+q.n+'" type="'+(q.type==="two"?"checkbox":"radio")+'" name="q'+q.n+'" value="'+a+'" '+(checked?"checked":"")+' '+(done?"disabled":"")+'>'+a+'. '+esc(t)+'</label>'}).join("");
if(q.type==="match")field='<p>'+esc(q.text)+'</p><select data-q="'+q.n+'" '+(done?"disabled":"")+'><option value="">Chọn đáp án</option>'+L.matchOptions.map((t,i)=>{let a=String.fromCharCode(65+i);return '<option value="'+a+'" '+(value===a?"selected":"")+'>'+a+'. '+esc(t)+'</option>'}).join("")+'</select>';
return '<div class="card"><b>Câu '+q.n+(q.type==="two"?"–"+(q.n+1):"")+'</b>'+field+(done?'<p class="'+(correct(q)?"right":"wrong")+'">'+(correct(q)?"✓ Đúng":"Đáp án: "+esc(q.answers.join(" / ")))+'</p>'+reviewHTML(q):"")+'</div>'}).join("");
$("panel").innerHTML='<h2>Giai đoạn 3 · Bài nghe chính</h2><p>Làm bài như đề Listening thông thường. Tổng '+total+' câu.</p>'+(done?'<div class="score">Kết quả: '+score+'/'+total+' · '+Math.round(score/total*100)+'%</div><p class="help" id="sheetStatus">'+(state.reportedAt?"Đã gửi yêu cầu lưu kết quả.":"Kết quả chưa được gửi.")+'</p>':"")+body+(done?transcriptHTML():"")+(done?'<button class="secondary" id="retry">Làm lại bài nghe</button>':'<button class="primary" id="submit">Nộp bài và xem đáp án</button>');
if(done)attachReplay();document.querySelectorAll("[data-q]").forEach(e=>e.onchange=()=>{const q=L.exam.find(x=>x.n===+e.dataset.q);if(q.type==="two"){let arr=Array.isArray(state.exam[q.n])?[...state.exam[q.n]]:[];if(e.checked){if(arr.length>=2){e.checked=false;return}arr.push(e.value)}else arr=arr.filter(x=>x!==e.value);state.exam[q.n]=arr}else state.exam[q.n]=e.value;save()});
if($("submit"))$("submit").onclick=()=>{const freshScore=L.exam.reduce((n,q)=>q.type==="two"?n+(Array.isArray(state.exam[q.n])?state.exam[q.n].filter(x=>q.answers.includes(x)).length:0):n+(correct(q)?1:0),0);state.submitted=true;save();render();reportListening(freshScore,total)};if($("retry"))$("retry").onclick=()=>{state.submitted=false;state.exam={};state.reportedAt=null;state.examStartedAt=Date.now();save();render()};}

// Styles for detailed answer review and evidence replay
const evidenceStyle=document.createElement("style");evidenceStyle.textContent=`.evidence-details{margin-top:10px;background:#faf8ff;border:1px solid #e1d8ff;border-radius:12px;padding:11px}.evidence-details summary{cursor:pointer;color:#4d2da2;font-size:12px;font-weight:850}.evidence-details p{font-size:12px}.evidence-quote{margin:10px 0;padding:10px 14px;border-left:3px solid #7954d8;background:#fff;color:#29344b;line-height:1.75}.evidence-details small{font-size:11px;color:#69758c}.evidence-play{font-size:12px;padding:8px 12px}.transcript-jump{font-size:12px;padding:8px 12px}.transcript-all{background:white;border:1px solid #d8d9ec;border-radius:13px;padding:15px;margin-top:22px}.transcript-all summary{font-weight:850;color:#4a2d93;cursor:pointer}.transcript-turn{border-bottom:1px solid #e9eaf4;padding:12px 0}.transcript-turn b{font-size:11px;color:#6e4cbe}.transcript-turn p{margin:2px 0;white-space:pre-wrap;color:#29354e}.active-evidence{background:#fff7c7;border-left:4px solid #e49d23;padding-left:8px}`;document.head.appendChild(evidenceStyle);
let clipEvents=new AbortController();function render(){
clipEvents.abort();clipEvents=new AbortController();
const gapPassed=!!state.gapsDone&&Number(state.gapTotal)>0&&Number(state.gapScore)/Number(state.gapTotal)>0.8;
if(!gapPassed){state.unlocked=false;if(state.stage>0)state.stage=0}
else if(!(Number(state.dictScore)>80)){state.unlocked=false;if(state.stage>1)state.stage=1}
header();if(state.stage===0)renderGaps();else if(state.stage===1)renderDict();else renderExam();$("progress").textContent="Giai đoạn "+(state.stage+1)+"/3"+(state.unlocked?" · Listening đã mở khóa":"");}
render();
})();