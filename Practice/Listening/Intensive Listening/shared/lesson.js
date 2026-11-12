(()=>{"use strict";
const L=window.INTENSIVE_LESSON;if(!L)return;
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const words=s=>String(s??"").normalize("NFKC").toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9' ]/g," ").trim().split(/\s+/).filter(Boolean);
const same=(a,b)=>words(a).join(" ")===words(b).join(" ");
let student={};try{student=JSON.parse(localStorage.getItem("IELTS_PRACTICE_STUDENT")||"{}")}catch{}
const key="INTENSIVE_STAGE_V1_"+L.id+"_"+String(student.name||"guest").toLowerCase()+"_"+(student.className||"");
let state={stage:0,gaps:{},gapsDone:false,dict:{},dictChecked:false,dictScore:0,unlocked:false,exam:{},submitted:false};try{state={...state,...JSON.parse(localStorage.getItem(key)||"{}")}}catch{}
const save=()=>localStorage.setItem(key,JSON.stringify(state));
$("student").textContent=student.name?student.name+" · "+(student.className||""):"";
$("heading").textContent="Part "+L.part+" · Bài "+String(L.number).padStart(2,"0")+" · "+L.title;
const audio=$("audio");if(L.audio)audio.src=L.audio;
/* Audio is provided by the lesson itself; the shared sidebar owns all playback controls. */
function lcs(a,b){const x=words(a),y=words(b);let prev=Array(y.length+1).fill(0);for(let i=1;i<=x.length;i++){let cur=Array(y.length+1).fill(0);for(let j=1;j<=y.length;j++)cur[j]=x[i-1]===y[j-1]?prev[j-1]+1:Math.max(cur[j-1],prev[j]);prev=cur}return prev[y.length]/Math.max(x.length,y.length,1)}
function pct(){return 100*L.dictations.reduce((s,t,i)=>s+lcs(state.dict[i]||"",t),0)/L.dictations.length}
function header(){const allowed=[true,!!state.gapsDone&&state.gapScore/state.gapTotal>0.8,!!state.unlocked];$("steps").innerHTML=["1 · Nghe điền từ (>80%)","2 · Dictation (>80%)","3 · Bài nghe chính"].map((x,i)=>'<button '+(!allowed[i]?'disabled':'')+' data-stage="'+i+'" class="'+(state.stage===i?'active':'')+'">'+x+(!allowed[i]?' 🔒':'')+'</button>').join("");document.querySelectorAll("[data-stage]").forEach(e=>e.onclick=()=>{state.stage=+e.dataset.stage;save();render()})}
function renderGaps(){
let n=0;
const body=L.turns.map(turn=>'<div class="turn"><b>'+esc(turn.speaker)+'</b><div>'+esc(turn.text).replace(/\[\[([^\]]+)\]\]/g,()=>{const i=n++;const ok=same(state.gaps[i]||"",L.gapAnswers[i]);const attempted=!!state.gapChecked;return '<span class="gap-field"><input class="gap '+(attempted?(ok?"correct":"wrong"):"")+'" data-i="'+i+'" value="'+esc(state.gaps[i]||"")+'" placeholder="Điền từ" aria-label="Chỗ trống '+(i+1)+'">'+(attempted?'<small class="'+(ok?"right":"wrong")+'">'+(ok?"✓ Đúng":"✕ Sai · "+esc(L.gapAnswers[i]))+'</small>':"")+'</span>'})+'</div></div>').join("");
const count=Number(state.gapScore)||0,total=L.gapAnswers.length,percent=total?count/total*100:0;
const passed=state.gapsDone&&percent>80;
$("panel").innerHTML='<h2>Giai đoạn 1 · Nghe điền từ</h2><p>Điền đáp án trực tiếp trong transcript. Sau khi chấm sẽ biết từng câu đúng/sai. Cần đạt <b>trên 80%</b> để vào Dictation.</p>'+(state.gapChecked?'<div class="score '+(passed?"right":"wrong")+'">Kết quả: '+count+'/'+total+' · '+percent.toFixed(1)+'% · '+(passed?"Đạt, đã mở Dictation":"Chưa đạt 80%, hãy sửa các ô sai rồi chấm lại")+'</div>':'')+body+'<button class="primary" id="gapDone">Chấm lại Gap-fill</button>'+(passed?'<button class="primary" id="toDict">Tiếp tục Dictation →</button>':"");
document.querySelectorAll(".gap").forEach(e=>e.oninput=()=>{state.gaps[e.dataset.i]=e.value;state.gapChecked=false;state.gapsDone=false;state.unlocked=false;state.dictChecked=false;save();});
$("gapDone").onclick=()=>{state.gapScore=L.gapAnswers.filter((ans,i)=>same(state.gaps[i]||"",ans)).length;state.gapTotal=L.gapAnswers.length;state.gapChecked=true;state.gapsDone=state.gapScore/state.gapTotal>0.8;if(!state.gapsDone)state.unlocked=false;save();render()};
if($("toDict"))$("toDict").onclick=()=>{state.stage=1;save();render()};
}
function renderDict(){
const score=state.dictChecked?pct():null;
const fmt=t=>{t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")};
const cards=L.dictations.map((t,i)=>{
 const cue=L.dictationCues?.[i],duration=cue?Math.max(0,cue.end-cue.start):0;
 return '<article class="dictation-card card" data-dict-card="'+i+'"><div class="dictation-top"><div class="q-label">Dictation '+String(i+1).padStart(2,"0")+'</div><span class="duration">'+(cue?fmt(duration):"Nghe cả bài")+'</span></div><div class="clip-player"><button class="play-clip" data-clip-action="toggle" data-i="'+i+'">▶ Nghe đoạn</button><input type="range" class="clip-progress" data-clip-seek="'+i+'" min="0" max="'+(duration||1)+'" step=".1" value="0" '+(!cue?"disabled":"")+'><span class="clip-time" data-clip-time="'+i+'">0:00 / '+fmt(duration)+'</span></div><div class="clip-controls"><button type="button" class="speed-btn" data-clip-action="back" data-i="'+i+'">↶ 3s</button><button type="button" class="speed-btn" data-clip-action="replay" data-i="'+i+'">↻ Nghe lại</button><button type="button" class="speed-btn" data-clip-action="forward" data-i="'+i+'">3s ↷</button><span class="speed-label">Tốc độ:</span>'+[0.5,0.75,1].map(rate=>'<button type="button" class="speed-btn '+(rate===1?"active":"")+'" data-speed="'+rate+'" data-i="'+i+'">'+rate+'×</button>').join("")+'</div><textarea class="dictation-input" data-dict="'+i+'" placeholder="Chép lại chính xác những gì bạn nghe được...">'+esc(state.dict[i]||"")+'</textarea>'+(state.dictChecked?'<div class="review"><b>Chính xác: '+(lcs(state.dict[i]||"",t)*100).toFixed(1)+'%</b><p>'+esc(t)+'</p></div>':'')+'</article>'
}).join("");
$("panel").innerHTML='<h2>Giai đoạn 2 · Dictation</h2><p class="score">Điểm Gap-fill: '+(state.gapScore??0)+'/'+(state.gapTotal??L.gapAnswers.length)+'</p><p>Nghe từng đoạn, tua và điều chỉnh tốc độ rồi chép chính tả. <b>Phải đạt trên 80%</b> độ chính xác trung bình mới mở Listening chính.</p><div class="score">'+(score===null?"Chưa chấm":"Độ chính xác: "+score.toFixed(1)+"%")+(state.unlocked?" · Đã mở khóa":" · Mục tiêu: trên 80%")+'</div>'+cards+'<button class="primary" id="dictGrade">Chấm Dictation</button>'+(state.unlocked?'<button class="primary" id="toExam">Vào bài Listening →</button>':"");
document.querySelectorAll("[data-dict]").forEach(e=>e.oninput=()=>{state.dict[e.dataset.dict]=e.value;state.dictChecked=false;save()});
let activeClip=null;
const cues=L.dictationCues||[];
function cueFor(i){return cues[i]||null}
function listen(i,offset=0){const cue=cueFor(i);if(!cue||!audio.src)return;activeClip=i;segmentEnd=cue.end;audio.currentTime=Math.max(cue.start,Math.min(cue.end-0.1,cue.start+offset));audio.play().catch(error=>console.warn("Cannot play dictation clip",error))}
document.querySelectorAll("[data-clip-action]").forEach(button=>button.onclick=()=>{const i=+button.dataset.i,act=button.dataset.clipAction,cue=cueFor(i);if(!cue)return;
if(act==="toggle"){if(activeClip===i&&!audio.paused){audio.pause();return}listen(i)}
if(act==="replay")listen(i);
if(act==="back"||act==="forward"){const offset=activeClip===i?audio.currentTime-cue.start:0;listen(i,offset+(act==="back"?-3:3))}});
document.querySelectorAll("[data-clip-seek]").forEach(e=>e.oninput=()=>{const i=+e.dataset.clipSeek;listen(i,+e.value)});
document.querySelectorAll("[data-speed]").forEach(button=>button.onclick=()=>{const speed=+button.dataset.speed;audio.playbackRate=speed;document.querySelectorAll('[data-speed][data-i="'+button.dataset.i+'"]').forEach(b=>b.classList.toggle("active",+b.dataset.speed===speed));const mainSpeed=document.getElementById("ilSpeed");if(mainSpeed)mainSpeed.value=String(speed)});
const onTime=()=>{if(activeClip===null)return;const cue=cueFor(activeClip);if(!cue)return;const elapsed=Math.max(0,Math.min(cue.end-cue.start,audio.currentTime-cue.start));const seek=document.querySelector('[data-clip-seek="'+activeClip+'"]');const time=document.querySelector('[data-clip-time="'+activeClip+'"]');if(seek)seek.value=String(elapsed);if(time)time.textContent=fmt(elapsed)+" / "+fmt(cue.end-cue.start);if(audio.currentTime>=cue.end){audio.pause();activeClip=null}};
audio.addEventListener("timeupdate",onTime,{signal:clipEvents.signal});
$("dictGrade").onclick=()=>{state.dictChecked=true;state.dictScore=pct();state.unlocked=state.dictScore>80;save();render()};
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

function renderExam(){if(!state.unlocked){state.stage=1;render();return}let total=L.exam.reduce((n,q)=>n+(q.type==="two"?2:1),0),score=L.exam.reduce((n,q)=>{
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
let clipEvents=new AbortController();function render(){clipEvents.abort();clipEvents=new AbortController();header();if(state.stage===0)renderGaps();else if(state.stage===1)renderDict();else renderExam();$("progress").textContent="Giai đoạn "+(state.stage+1)+"/3"+(state.unlocked?" · Listening đã mở khóa":"");}
render();
})();