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
function renderExam(){if(!state.unlocked){state.stage=1;render();return}let total=L.exam.reduce((n,q)=>n+(q.type==="two"?2:1),0),score=L.exam.reduce((n,q)=>n+(correct(q)?(q.type==="two"?2:1):0),0),done=state.submitted;
let body=L.exam.map(q=>{const value=state.exam[q.n];let field="";
if(q.type==="blank")field='<div class="question">'+esc(q.text).replace(/_{4,}|\{gap\}/,'<input class="inline" data-q="'+q.n+'" value="'+esc(value||"")+'" '+(done?"disabled":"")+' placeholder="Điền từ">')+'</div>';
if(q.type==="mc"||q.type==="two")field='<p>'+esc(q.text)+'</p>'+q.options.map((t,i)=>{let a=String.fromCharCode(65+i),checked=q.type==="two"?(Array.isArray(value)&&value.includes(a)):value===a;return '<label class="option"><input data-q="'+q.n+'" type="'+(q.type==="two"?"checkbox":"radio")+'" name="q'+q.n+'" value="'+a+'" '+(checked?"checked":"")+' '+(done?"disabled":"")+'>'+a+'. '+esc(t)+'</label>'}).join("");
if(q.type==="match")field='<p>'+esc(q.text)+'</p><select data-q="'+q.n+'" '+(done?"disabled":"")+'><option value="">Chọn đáp án</option>'+L.matchOptions.map((t,i)=>{let a=String.fromCharCode(65+i);return '<option value="'+a+'" '+(value===a?"selected":"")+'>'+a+'. '+esc(t)+'</option>'}).join("")+'</select>';
return '<div class="card"><b>Câu '+q.n+(q.type==="two"?"–"+(q.n+1):"")+'</b>'+field+(done?'<p class="'+(correct(q)?"right":"wrong")+'">'+(correct(q)?"✓ Đúng":"Đáp án: "+esc(q.answers.join(" / ")))+'</p>':"")+'</div>'}).join("");
$("panel").innerHTML='<h2>Giai đoạn 3 · Bài nghe chính</h2><p>Làm bài như đề Listening thông thường. Tổng '+total+' câu.</p>'+(done?'<div class="score">Kết quả: '+score+'/'+total+' · '+Math.round(score/total*100)+'%</div>':"")+body+(done?'<button class="secondary" id="retry">Làm lại bài nghe</button>':'<button class="primary" id="submit">Nộp bài và xem đáp án</button>');
document.querySelectorAll("[data-q]").forEach(e=>e.onchange=()=>{const q=L.exam.find(x=>x.n===+e.dataset.q);if(q.type==="two"){let arr=Array.isArray(state.exam[q.n])?[...state.exam[q.n]]:[];if(e.checked){if(arr.length>=2){e.checked=false;return}arr.push(e.value)}else arr=arr.filter(x=>x!==e.value);state.exam[q.n]=arr}else state.exam[q.n]=e.value;save()});
if($("submit"))$("submit").onclick=()=>{state.submitted=true;save();render()};if($("retry"))$("retry").onclick=()=>{state.submitted=false;state.exam={};save();render()};}
function render(){header();if(state.stage===0)renderGaps();else if(state.stage===1)renderDict();else renderExam();$("progress").textContent="Giai đoạn "+(state.stage+1)+"/3"+(state.unlocked?" · Listening đã mở khóa":"");}
render();
})();