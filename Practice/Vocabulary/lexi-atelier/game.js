(function(){
"use strict";
const $=id=>document.getElementById(id);
const clean=s=>String(s||"").trim().toLowerCase();
const safe=s=>String(s||"").replace(/[&<>"]/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[x]));
let list=[];try{list=JSON.parse(sessionStorage.getItem("LEXI_ATELIER_WORDS")||"[]")}catch(err){}
if(!Array.isArray(list)||list.filter(w=>w.word&&w.meaning).length<4){list=[{word:"elegant",meaning:"thanh lịch"},{word:"bloom",meaning:"nở hoa"},{word:"cozy",meaning:"ấm cúng"},{word:"fabric",meaning:"vải"},{word:"flavor",meaning:"hương vị"},{word:"traditional",meaning:"truyền thống"},{word:"patience",meaning:"kiên nhẫn"},{word:"confident",meaning:"tự tin"}]}
list=list.filter(w=>w.word&&w.meaning).slice(0,50);
let student="guest";try{const v=JSON.parse(localStorage.getItem("IELTS_PRACTICE_STUDENT")||"{}");student=(v.name||"guest")+"/"+(v.className||"")}catch(err){}
const key="LEXI_ATELIER_V1_"+student;
let data={coins:60,fabric:2,learned:{},garden:{},looks:[],friends:{Mia:0,Hana:0,Rosa:0,Linh:0},history:[],decor:[],done:0};
try{data=Object.assign(data,JSON.parse(localStorage.getItem(key)||"{}"))}catch(err){}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(data))}catch(err){}};
let place="",guest=null,answers={},gardenTurns=0,voice=true;
const clients={
atelier:[{name:"Mia",avatar:"👩🏻‍🎨",line:"I'd love an elegant dress in a warm color for my first fashion show.",need:["elegant","warm","dress"],hint:"Váy thanh lịch, tông ấm."},{name:"Linh",avatar:"👩🏽‍💼",line:"I need a professional blazer in a cool color for my interview.",need:["professional","cool","blazer"],hint:"Blazer chuyên nghiệp, màu lạnh."}],
cafe:[{name:"Hana",avatar:"👩🏻‍🎓",line:"Could I have a warm matcha latte with less sugar, please?",need:["matcha","warm","less"],hint:"Matcha ấm, ít đường."},{name:"Mia",avatar:"👩🏻‍🎨",line:"A cold strawberry smoothie, please. I'd like it sweet.",need:["strawberry","cold","sweet"],hint:"Sinh tố dâu lạnh, vị ngọt."}],
garden:[{name:"Rosa",avatar:"👵🏽",line:"Every seed needs patience. Let's make this garden bloom together!",need:[],hint:"Luyện từ để gieo hạt và nở hoa."}]
};
const groups={style:["elegant","professional","cozy"],color:["warm","cool","pastel"],item:["dress","blazer","sweater"],base:["matcha","strawberry","coffee"],temperature:["warm","cold"],sweet:["less","sweet"]};
const label={elegant:"Thanh lịch",professional:"Chuyên nghiệp",cozy:"Ấm cúng",warm:"Ấm",cool:"Màu lạnh",pastel:"Pastel",dress:"👗 Váy",blazer:"🧥 Blazer",sweater:"🧶 Áo len",matcha:"🍵 Matcha",strawberry:"🍓 Dâu",coffee:"☕ Cà phê",cold:"Lạnh",less:"Ít đường",sweet:"Ngọt"};
function stats(){$("coins").textContent=data.coins;$("fabric").textContent=data.fabric;$("learned").textContent=Object.keys(data.learned).length;$("lookSummary").textContent=data.looks.length+" thiết kế đã lưu.";$("friendSummary").textContent=Object.entries(data.friends).map(([k,v])=>k+" ♡"+v).join(" · ")}
function speak(t){if(!voice||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=.86;speechSynthesis.cancel();speechSynthesis.speak(u)}
function show(title,body){$("sceneTitle").textContent=title;$("sceneOverline").textContent="PHỐ LEXI · LITTLE STORIES";$("sceneBody").innerHTML=body;$("scene").hidden=false;document.body.style.overflow="hidden"}
function close(){$("scene").hidden=true;document.body.style.overflow="";place="";guest=null;stats()}
$("backToTown").onclick=close;
$("welcomePlay").onclick=()=>$("town").scrollIntoView({behavior:"smooth"});
$("sound").onclick=()=>{voice=!voice;$("sound").textContent=voice?"🔊":"🔇"};
function card(left,right){return '<div class="page-grid"><section class="paper-card">'+left+'</section><section class="paper-card">'+right+'</section></div>'}
function person(){return '<div class="character"><span class="portrait">'+guest.avatar+'</span><div><strong>'+guest.name+'</strong><small>Friend of Lexi Town</small></div></div><div class="speech">“'+safe(guest.line)+'”</div>'}
function begin(type){place=type;guest=clients[type][data.done%clients[type].length];answers={};gardenTurns=0;intro()}
function intro(){
show("Welcome to "+({atelier:"Atelier",cafe:"Café Lexi",garden:"Flower Garden"}[place]),card(person()+'<p class="translation">'+guest.hint+'</p><button id="listen" class="scene-cta secondary">🔊 Nghe khách nói</button>','<div class="work-preview"><span class="preview-large">'+({atelier:"👗",cafe:"☕",garden:"🌸"}[place])+'</span></div><h3>Bạn sẽ trả lời thế nào?</h3><button id="accept" class="choice">Of course! I would love to help!</button><button id="decline" class="choice">No, I do not want to help.</button>'));
$("listen").onclick=()=>speak(guest.line);
$("accept").onclick=()=>{if(place==="garden")garden();else work()};
$("decline").onclick=()=>{alert("Oliver: Hãy thử một lời đáp lịch sự hơn nhé!")};
speak(guest.line);
}
document.querySelectorAll("[data-place]").forEach(el=>el.onclick=()=>begin(el.dataset.place));
function work(){
const fashion=place==="atelier",fields=fashion?["style","color","item"]:["base","temperature","sweet"];
let left=person()+'<h3>'+(fashion?"Thiết kế trang phục":"Pha chế đồ uống")+'</h3>';
fields.forEach(field=>{left+='<label class="field-label">'+field.toUpperCase()+'</label><div class="style-options">';groups[field].forEach(val=>{left+='<button class="swatch" data-field="'+field+'" data-value="'+val+'">'+label[val]+'</button>'});left+='</div>'});
left+='<p class="translation">Chọn đúng ba thành phần theo lời khách.</p><button class="scene-cta" id="submit" disabled>✨ Hoàn thành</button>';
const right='<div class="work-preview"><span id="product" class="preview-large">'+(fashion?"👗":"☕")+'</span><span id="productLabel" class="preview-caption">Your little creation</span></div><button id="repeat" class="scene-cta secondary">🔊 Nghe lại yêu cầu</button>';
show(fashion?"Mia's Atelier":"Café Lexi",card(left,right));
$("repeat").onclick=()=>speak(guest.line);
$("sceneBody").querySelectorAll("[data-field]").forEach(el=>el.onclick=()=>{answers[el.dataset.field]=el.dataset.value;$("sceneBody").querySelectorAll('[data-field="'+el.dataset.field+'"]').forEach(b=>b.classList.toggle("active",b===el));$("submit").disabled=!fields.every(f=>answers[f]);$("product").textContent=fashion?({dress:"👗",blazer:"🧥",sweater:"🧶"}[answers.item]||"👗"):({matcha:"🍵",strawberry:"🍓",coffee:"☕"}[answers.base]||"☕");$("productLabel").textContent=fields.map(f=>label[answers[f]]).filter(Boolean).join(" · ")});
$("submit").onclick=()=>{const correct=fields.filter((f,i)=>answers[f]===guest.need[i]).length;const stars=[1,2,3,5][correct];if(fashion&&stars===5){data.fabric++;data.looks.unshift({style:answers.style,color:answers.color,item:answers.item})}finish(stars,correct+"/3 lựa chọn đúng. "+guest.hint)};
}
function garden(){
const sample=list.slice(0,9);
let left=person()+'<h3>Gieo từ, trồng hoa 🌷</h3><p>Chạm hạt giống để chọn đúng nghĩa. Ôn lại giúp cây lớn và nở hoa.</p><div class="garden-plots">';
sample.forEach(w=>{left+='<button class="plot" data-seed="'+safe(w.word)+'"><span class="plant">'+["🌰","🌱","🌿","🌷","🌸"][Math.min(4,data.garden[clean(w.word)]||0)]+'</span><small>'+safe(w.word)+'</small></button>'});left+='</div>';
show("Vườn Từ Vựng",card(left,'<div class="work-preview"><span class="preview-large" id="flower">🪴</span></div><div id="quiz">Chọn một hạt giống để bắt đầu.</div>'));
$("sceneBody").querySelectorAll("[data-seed]").forEach(el=>el.onclick=()=>test(sample.find(w=>w.word===el.dataset.seed)));
}
function test(w){
let options=[w.meaning,...list.filter(x=>x.word!==w.word).sort(()=>Math.random()-.5).slice(0,3).map(x=>x.meaning)].sort(()=>Math.random()-.5);
let html='<h3>'+safe(w.word)+' có nghĩa là gì?</h3><button id="hear" class="scene-cta secondary">🔊 Nghe từ</button><div class="choices">';
options.forEach((o,i)=>{html+='<button class="choice" data-answer="'+i+'">'+safe(o)+'</button>'});html+='</div><div id="result"></div>';$("quiz").innerHTML=html;
$("hear").onclick=()=>speak(w.word);
$("quiz").querySelectorAll("[data-answer]").forEach(el=>el.onclick=()=>{const right=options[Number(el.dataset.answer)]===w.meaning;$("quiz").querySelectorAll("[data-answer]").forEach(b=>b.disabled=true);if(right){data.garden[clean(w.word)]=Math.min(4,(data.garden[clean(w.word)]||0)+1);data.learned[clean(w.word)]=(data.learned[clean(w.word)]||0)+1;data.coins+=8;$("flower").textContent=["🌰","🌱","🌿","🌷","🌸"][data.garden[clean(w.word)]]}gardenTurns++;save();stats();$("result").innerHTML='<p class="reward">'+(right?"✓ Chính xác! +8 Hoa Vàng.":"Chưa đúng. "+safe(w.word)+" = "+safe(w.meaning))+'</p><button class="scene-cta" id="continueGarden">Tiếp tục →</button>';$("continueGarden").onclick=()=>{if(gardenTurns>=4)finish(Math.min(5,2+Object.keys(data.garden).length),"Vườn của bạn đã phát triển!");else garden()}})}
function finish(stars,feedback){
const earned=10+stars*8;data.coins+=earned;data.done++;data.friends[guest.name]=(data.friends[guest.name]||0)+stars;data.history.unshift({name:guest.name,place,stars,quote:guest.line});save();stats();
let left=person()+'<div class="result-stars">'+("★".repeat(stars))+("☆".repeat(5-stars))+'</div><p>'+safe(feedback)+'</p><p class="reward">🌼 +'+earned+' Hoa Vàng</p><button id="again" class="scene-cta">Nhiệm vụ tiếp →</button> <button id="leave" class="scene-cta secondary">Về phố</button>';
show("A lovely result ✿",card(left,'<div class="work-preview"><span class="preview-large">💐</span></div><p>Độ thân thiết ♡ '+data.friends[guest.name]+'</p>'));$("again").onclick=()=>begin(place);$("leave").onclick=close;
}
function journal(title,html){show(title,'<section class="paper-card">'+html+'<p><button id="backJournal" class="scene-cta secondary">← Về phố</button></p></section>');$("backJournal").onclick=close}
$("openStories").onclick=()=>{let html="<h3>Nhật ký những người bạn</h3>";data.history.forEach(x=>html+='<p class="reward">'+safe(x.name)+' · '+x.stars+'★ · '+safe(x.quote)+'</p>');journal("Nhật ký câu chuyện",html)};
$("openLookbook").onclick=()=>{let html="<h3>My Lookbook</h3>";data.looks.forEach(x=>html+='<p class="reward">👗 '+safe(x.style)+' · '+safe(x.color)+' · '+safe(x.item)+'</p>');journal("Lookbook",html)};
const decor=[["🏮","Đèn lồng",35],["🪑","Ghế gỗ",45],["🌺","Chậu hoa",25],["⛲","Đài phun",90]];
$("openDecor").onclick=()=>{let html="<h3>Trang trí phố bằng Hoa Vàng</h3>";decor.forEach((x,i)=>html+='<button class="choice" data-buy="'+i+'">'+x[0]+" "+x[1]+" · "+x[2]+' 🌼</button>');journal("Tiệm trang trí",html);$("sceneBody").querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>{const x=decor[Number(b.dataset.buy)];if(data.coins<x[2]){alert("Chưa đủ Hoa Vàng");return}data.coins-=x[2];data.decor.push(x[0]);save();stats();b.textContent="✓ Đã thêm "+x[0]})};
$("oliverTip").onclick=()=>{const w=list[Math.floor(Math.random()*list.length)];journal("Câu đố Oliver",'<div class="speech">Which word means: '+safe(w.meaning)+'?</div><input id="owlAnswer" style="width:100%;padding:12px" placeholder="English word"><p><button class="scene-cta" id="owlCheck">Kiểm tra</button></p><div id="owlResult"></div>');$("owlCheck").onclick=()=>{const ok=clean($("owlAnswer").value)===clean(w.word);$("owlResult").textContent=ok?"✓ Chính xác! +5 🌼":"Đáp án: "+w.word;if(ok){data.coins+=5;data.learned[clean(w.word)]=(data.learned[clean(w.word)]||0)+1;save();stats()}$("owlCheck").disabled=true}};
stats();
})();