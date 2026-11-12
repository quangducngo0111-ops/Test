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
$("audioFile").onchange=e=>{const f=e.target.files?.[0];if(f){audio.src=URL.createObjectURL(f);audio.load();$("audioStatus").textContent="Đang dùng audio từ thiết bị: "+f.name}};
$("speed").onchange=e=>audio.playbackRate=Number(e.target.value);
function lcs(a,b){const x=words(a),y=words(b);let prev=Array(y.length+1).fill(0);for(let i=1;i<=x.length;i++){let cur=Array(y.length+1).fill(0);for(let j=1;j<=y.length;j++)cur[j]=x[i-1]===y[j-1]?prev[j-1]+1:Math.max(cur[j-1],prev[j]);prev=cur}return prev[y.length]/Math.max(x.length,y.length,1)}
function pct(){return Math.round(100*L.dictations.reduce((s,t,i)=>s+lcs(state.dict[i]||"",t),0)/L.dictations.length)}
function header(){const allowed=[true,state.gapsDone,state.unlocked];$("steps").innerHTML=["1 · Nghe điền từ","2 · Dictation (≥80%)","3 · Bài nghe chính"].map((x,i)=>'<button '+(!allowed[i]?'disabled':'')+' data-stage="'+i+'" class="'+(state.stage===i?'active':'')+'">'+x+(!allowed[i]?' 🔒':'')+'</button>').join("");document.querySelectorAll("[data-stage]").forEach(e=>e.onclick=()=>{state.stage=+e.dataset.stage;save();render()})}
function renderGaps(){let n=0;let body=L.turns.map(turn=>'<div class="turn"><b>'+esc(turn.speaker)+'</b><div>'+esc(turn.text).replace(/\[\[([^\]]+)\]\]/g,()=>{let i=n++;return '<input class="gap" data-i="'+i+'" value="'+esc(state.gaps[i]||"")+'" placeholder="Điền từ" aria-label="Chỗ trống '+(i+1)+'">'})+'</div></div>').join("");
$("panel").innerHTML='<h2>Giai đoạn 1 · Nghe điền từ</h2><p>Nghe audio và hoàn thành những từ bị khuyết trong transcript, sau đó chuyển sang Dictation.</p>'+body+'<button class="primary" id="gapDone">Chấm bài và chuyển sang Dictation</button>';
document.querySelectorAll(".gap").forEach(e=>e.oninput=()=>{state.gaps[e.dataset.i]=e.value;save()});
$("gapDone").onclick=()=>{let count=0;const fields=[...document.querySelectorAll(".gap")];fields.forEach(e=>{let ok=same(e.value,L.gapAnswers[+e.dataset.i]);if(ok)count++;e.style.background=ok?"#e9f8ef":"#fff0f2";e.title=ok?"Chính xác":"Đáp án đúng: "+L.gapAnswers[+e.dataset.i]});state.gapScore=count;state.gapTotal=fields.length;state.gapsDone=true;state.stage=1;save();render();};}
function renderDict(){let score=state.dictChecked?pct():null;
$("panel").innerHTML='<h2>Giai đoạn 2 · Dictation</h2><p class="score">Điểm Gap-fill: '+(state.gapScore??0)+'/'+(state.gapTotal??L.gapAnswers.length)+'</p><p>Chép đầy đủ các đoạn sau. Chấm theo tỷ lệ từ chính xác (không tính hoa/thường và dấu câu); phải đạt ít nhất 80% trung bình toàn bộ các đoạn để mở bài nghe chính.</p><div class="score">'+(score===null?'Chưa chấm':"Độ chính xác: "+score+"%")+(state.unlocked?" · Đã mở khóa":" · Mục tiêu: 80%")+'</div>'+L.dictations.map((t,i)=>'<div class="card"><h3>Đoạn '+(i+1)+'/'+L.dictations.length+'</h3><textarea data-dict="'+i+'" placeholder="Gõ lại những gì em nghe được...">'+esc(state.dict[i]||"")+'</textarea>'+(state.dictChecked?'<div class="review"><b>Chính xác: '+Math.round(lcs(state.dict[i]||"",t)*100)+'%</b><p>'+esc(t)+'</p></div>':'')+'</div>').join("")+'<button class="primary" id="dictGrade">Chấm lại Dictation</button>'+(state.unlocked?'<button class="primary" id="toExam">Vào bài Listening →</button>':'');
document.querySelectorAll("[data-dict]").forEach(e=>e.oninput=()=>{state.dict[e.dataset.dict]=e.value;state.dictChecked=false;save()});
$("dictGrade").onclick=()=>{state.dictChecked=true;state.dictScore=pct();if(state.dictScore>=80)state.unlocked=true;save();render()};
if($("toExam"))$("toExam").onclick=()=>{state.stage=2;save();render()};}
function correct(q){const v=state.exam[q.n];if(q.type==="two"){return Array.isArray(v)&&v.length===2&&v.every(x=>q.answers.includes(x))&&new Set(v).size===2}return q.answers.some(a=>words(a).join(" ")===words(v||"").join(" "))}

function formatTime(t){t=Math.max(0,Math.floor(Number(t)||0));return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0")}
let segmentEnd=0;
audio.addEventListener("timeupdate",()=>{if(segmentEnd>0&&audio.currentTime>=segmentEnd){audio.pause();segmentEnd=0}});
function replayCue(n){
 const q=L.exam.find(x=>x.n===n);
 if(!q?.cue)return;
 if(!audio.src){$("audioStatus").textContent="Chưa có audio: hãy chọn MP3 để phát trích đoạn";return}
 segmentEnd=q.cue.end;audio.currentTime=Math.max(0,q.cue.start-1);
 audio.play().catch(()=>{$("audioStatus").textContent="Không phát được audio, hãy chọn MP3 rồi thử lại."});
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

function renderExam(){if(!state.unlocked){state.stage=1;render();return}let total=L.exam.reduce((n,q)=>n+(q.type==="two"?2:1),0),score=L.exam.reduce((n,q)=>{
 if(q.type==="two"){const choices=Array.isArray(state.exam[q.n])?state.exam[q.n]:[];return n+choices.filter(x=>q.answers.includes(x)).length}
 return n+(correct(q)?1:0)
},0),done=state.submitted;
let body=L.exam.map(q=>{const value=state.exam[q.n];let field="";
if(q.type==="blank")field='<div class="question">'+esc(q.text).replace(/_{4,}|\{gap\}/,'<input class="inline" data-q="'+q.n+'" value="'+esc(value||"")+'" '+(done?"disabled":"")+' placeholder="Điền từ">')+'</div>';
if(q.type==="mc"||q.type==="two")field='<p>'+esc(q.text)+'</p>'+q.options.map((t,i)=>{let a=String.fromCharCode(65+i),checked=q.type==="two"?(Array.isArray(value)&&value.includes(a)):value===a;return '<label class="option"><input data-q="'+q.n+'" type="'+(q.type==="two"?"checkbox":"radio")+'" name="q'+q.n+'" value="'+a+'" '+(checked?"checked":"")+' '+(done?"disabled":"")+'>'+a+'. '+esc(t)+'</label>'}).join("");
if(q.type==="match")field='<p>'+esc(q.text)+'</p><select data-q="'+q.n+'" '+(done?"disabled":"")+'><option value="">Chọn đáp án</option>'+L.matchOptions.map((t,i)=>{let a=String.fromCharCode(65+i);return '<option value="'+a+'" '+(value===a?"selected":"")+'>'+a+'. '+esc(t)+'</option>'}).join("")+'</select>';
return '<div class="card"><b>Câu '+q.n+(q.type==="two"?"–"+(q.n+1):"")+'</b>'+field+(done?'<p class="'+(correct(q)?"right":"wrong")+'">'+(correct(q)?"✓ Đúng":"Đáp án: "+esc(q.answers.join(" / ")))+'</p>'+reviewHTML(q):"")+'</div>'}).join("");
$("panel").innerHTML='<h2>Giai đoạn 3 · Bài nghe chính</h2><p>Làm bài như đề Listening thông thường. Tổng '+total+' câu.</p>'+(done?'<div class="score">Kết quả: '+score+'/'+total+' · '+Math.round(score/total*100)+'%</div>':"")+body+(done?transcriptHTML():"")+(done?'<button class="secondary" id="retry">Làm lại bài nghe</button>':'<button class="primary" id="submit">Nộp bài và xem đáp án</button>');
if(done)attachReplay();document.querySelectorAll("[data-q]").forEach(e=>e.onchange=()=>{const q=L.exam.find(x=>x.n===+e.dataset.q);if(q.type==="two"){let arr=Array.isArray(state.exam[q.n])?[...state.exam[q.n]]:[];if(e.checked){if(arr.length>=2){e.checked=false;return}arr.push(e.value)}else arr=arr.filter(x=>x!==e.value);state.exam[q.n]=arr}else state.exam[q.n]=e.value;save()});
if($("submit"))$("submit").onclick=()=>{state.submitted=true;save();render()};if($("retry"))$("retry").onclick=()=>{state.submitted=false;state.exam={};save();render()};}

// Styles for detailed answer review and evidence replay
const evidenceStyle=document.createElement("style");evidenceStyle.textContent=`.evidence-details{margin-top:10px;background:#faf8ff;border:1px solid #e1d8ff;border-radius:12px;padding:11px}.evidence-details summary{cursor:pointer;color:#4d2da2;font-size:12px;font-weight:850}.evidence-details p{font-size:12px}.evidence-quote{margin:10px 0;padding:10px 14px;border-left:3px solid #7954d8;background:#fff;color:#29344b;line-height:1.75}.evidence-details small{font-size:11px;color:#69758c}.evidence-play{font-size:12px;padding:8px 12px}.transcript-jump{font-size:12px;padding:8px 12px}.transcript-all{background:white;border:1px solid #d8d9ec;border-radius:13px;padding:15px;margin-top:22px}.transcript-all summary{font-weight:850;color:#4a2d93;cursor:pointer}.transcript-turn{border-bottom:1px solid #e9eaf4;padding:12px 0}.transcript-turn b{font-size:11px;color:#6e4cbe}.transcript-turn p{margin:2px 0;white-space:pre-wrap;color:#29354e}.active-evidence{background:#fff7c7;border-left:4px solid #e49d23;padding-left:8px}`;document.head.appendChild(evidenceStyle);
function render(){header();if(state.stage===0)renderGaps();else if(state.stage===1)renderDict();else renderExam();$("progress").textContent="Giai đoạn "+(state.stage+1)+"/3"+(state.unlocked?" · Listening đã mở khóa":"");}
render();
})();