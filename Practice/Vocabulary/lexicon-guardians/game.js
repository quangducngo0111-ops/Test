(()=>{
"use strict";
const $=id=>document.getElementById(id),canvas=$("board"),ctx=canvas.getContext("2d");
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],normalize=s=>String(s||"").normalize("NFKC").trim().toLowerCase().replace(/[.!?,;:]+$/,"").replace(/\s+/g," ");
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const seed=[
["protect","bảo vệ","We must protect our planet.","guard","harm"],["reduce","giảm","We should reduce plastic waste.","decrease","increase"],
["recycle","tái chế","Many families recycle plastic bottles.","reuse","discard"],["pollution","ô nhiễm","Air pollution harms public health.","contamination","purity"],
["sustainable","bền vững","Our city needs sustainable development.","lasting","temporary"],["habitat","môi trường sống","A forest is the natural habitat of many animals.","home","wasteland"],
["climate","khí hậu","Climate change threatens wildlife.","weather conditions",""],["conserve","bảo tồn","We should conserve our natural resources.","preserve","waste"],
["ecosystem","hệ sinh thái","The marine ecosystem is vulnerable to pollution.","ecological system",""],["renewable","có thể tái tạo","Solar power is a renewable source of energy.","replenishable","finite"],
["drought","hạn hán","A severe drought destroyed crops.","water shortage","flood"],
["biodiversity","đa dạng sinh học","Biodiversity is important for healthy ecosystems.","biological diversity",""],
["carbon","cacbon","Many industries produce carbon emissions.","",""],["emissions","khí thải","Countries must cut harmful emissions.","discharges",""],
["deforestation","nạn phá rừng","Deforestation destroys animal habitats.","forest loss","reforestation"],
["restore","khôi phục","Volunteers plan to restore the forest.","repair","destroy"],["adapt","thích nghi","Communities must adapt to a changing climate.","adjust","resist"],
["resource","tài nguyên","Fresh water is a precious resource.","supply",""],["efficient","hiệu quả","Public transport can be more efficient.","effective","inefficient"],
["prevent","ngăn chặn","We must prevent further environmental damage.","stop","cause"],
["wildlife","động vật hoang dã","Protected areas help local wildlife.","wild animals",""],
["impact","tác động","Plastic waste has a negative impact on marine life.","effect",""],
["consume","tiêu thụ","Households consume electricity each day.","use","save"],
["compost","phân hữu cơ","Food scraps can be turned into compost.","organic fertiliser",""],
["organic","hữu cơ","Organic farming avoids many artificial chemicals.","natural","synthetic"],
["fragile","mong manh","Coral reefs are fragile ecosystems.","delicate","strong"],
["awareness","nhận thức","Schools can raise awareness about waste.","understanding","ignorance"],
["mitigate","giảm nhẹ","Trees can help mitigate climate impacts.","alleviate","aggravate"],
["preserve","gìn giữ","We need to preserve the rainforest.","maintain","destroy"],
["vulnerable","dễ bị tổn thương","Young animals are particularly vulnerable.","at risk","protected"]
].map(([word,meaning,example,syn,ant])=>({word,meaning,example,syn,ant}));
let imported=[];try{imported=JSON.parse(sessionStorage.getItem("LEXICON_GUARDIANS_WORDS")||"[]")}catch{}
let words=Array.isArray(imported)?imported.map(w=>({word:String(w.word||"").trim(),meaning:String(w.meaning||"").trim(),example:String(w.example||"").trim(),collocation:String(w.collocation||"").trim(),syn:String(w.syn||""),ant:String(w.ant||"")})).filter(w=>w.word&&w.meaning):[];
words=[...new Map(words.map(w=>[normalize(w.word),w])).values()];
if(words.length<8)words=seed;
words=words.slice(0,50);
const shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
words=shuffle(words);
const TOWERS={
quill:{name:"Tháp Bút Lông",short:"Bút Lông",price:50,damage:12,range:155,rate:.52,kind:"meaning",symbol:"✒",color:"#6bdbd2",desc:"Bắn mực nhanh · hiểu đúng nghĩa",special:"ink"},
spell:{name:"Tháp Chính Tả",short:"Chính Tả",price:75,damage:23,range:125,rate:.9,kind:"spell",symbol:"✧",color:"#b0a0fc",desc:"Tia pha lê xuyên giáp · chính tả",special:"pierce"},
echo:{name:"Tháp Âm Vang",short:"Âm Vang",price:100,damage:25,range:215,rate:1.28,kind:"pronounce",symbol:"♫",color:"#9de4ff",desc:"Tầm xa · đẩy lùi khi nghe đúng",special:"push"},
ice:{name:"Tháp Băng Nghĩa",short:"Băng Nghĩa",price:120,damage:10,range:185,rate:1.1,kind:"synonym",symbol:"❄",color:"#92e9e4",desc:"Làm chậm và đóng băng quái",special:"freeze"},
fire:{name:"Tháp Lửa Trái Nghĩa",short:"Lửa Trái Nghĩa",price:150,damage:39,range:145,rate:1.25,kind:"antonym",symbol:"♨",color:"#ffc06b",desc:"Sát thương cao · gây bỏng",special:"burn"},
well:{name:"Giếng Mực",short:"Giếng Mực",price:90,damage:0,range:0,rate:99,kind:"meaning",symbol:"◈",color:"#ffdf86",desc:"+35 Mực Phép mỗi đợt · chỉ ô giếng",special:"economy"}
};
const E_TYPES={
shade:{name:"Bóng Mờ",hp:45,speed:67,damage:7,reward:8,color:"#8d72bb"},
worm:{name:"Sâu Chữ",hp:95,speed:34,damage:12,reward:13,color:"#78b98b"},
bat:{name:"Dơi Nhầm Lẫn",hp:58,speed:92,damage:9,reward:11,color:"#7390bc"},
spider:{name:"Nhện Ngữ Pháp",hp:135,speed:45,damage:15,reward:18,color:"#9c7cb1"},
golem:{name:"Golem Đá Sách",hp:310,speed:24,damage:23,reward:32,color:"#b69b87"},
boss:{name:"Vua Quên Lãng",hp:1100,speed:20,damage:40,reward:180,color:"#d5a1d9"}
};
const paths=[[-60,368],[174,368],[174,195],[388,195],[388,435],[617,435],[617,243],[862,243],[862,365],[1170,365]];
const pads=[
{x:92,y:210,type:"stone"},{x:110,y:482,type:"hill"},{x:260,y:293,type:"stone"},
{x:275,y:90,type:"hill"},{x:449,y:92,type:"stone"},{x:507,y:329,type:"water"},
{x:504,y:536,type:"well"},{x:709,y:524,type:"stone"},{x:738,y:124,type:"hill"},
{x:947,y:136,type:"stone"},{x:944,y:491,type:"water"},{x:800,y:445,type:"locked"}
];
const polyline=[];let totalLength=0;for(let i=0;i<paths.length-1;i++){const a=paths[i],b=paths[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]);polyline.push({a,b,len,from:totalLength});totalLength+=len}
function coordAt(d){d=clamp(d,0,totalLength);for(const p of polyline){if(d<=p.from+p.len){const t=(d-p.from)/p.len;return{x:p.a[0]*(1-t)+p.b[0]*t,y:p.a[1]*(1-t)+p.b[1]*t}}}return{x:1170,y:365}}
const S={phase:"study",paused:false,speed:1,wave:0,maxWave:5,health:100,ink:220,score:0,combo:0,correct:0,attempts:0,studyIndex:0,studySet:words.slice(0,10),seen:new Set(),selectedType:"quill",selectedPad:null,towers:[],enemies:[],bullets:[],fx:[],floating:[],misses:[],nextEnemyId:1,spawned:0,targetSpawn:0,spawnClock:0,reviewQueue:[],last:0,time:0,challengeLock:false,sound:true,finished:false,progressWave:0};
const recordKey="LEXICON_GUARDIANS_V2_RESULTS";
const gamePanel=$("towerList");
function log(t){$("battleLog").textContent=t;$("floatingNotice").textContent=t}
function announce(t){const element=$("waveNotice");element.textContent=t;element.hidden=false;clearTimeout(S.noticeTimeout);S.noticeTimeout=setTimeout(()=>element.hidden=true,1750)}
function randWord(){return pick(S.studySet)}
function multiplier(){return S.combo>=8?3:S.combo>=5?2:S.combo>=3?1.5:1}
function sound(f=650,d=.13){if(!S.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;S.audio=S.audio||new C;let osc=S.audio.createOscillator(),vol=S.audio.createGain();osc.type="sine";osc.frequency.setValueAtTime(f,S.audio.currentTime);osc.frequency.exponentialRampToValueAtTime(f*.72,S.audio.currentTime+d);vol.gain.setValueAtTime(.035,S.audio.currentTime);vol.gain.exponentialRampToValueAtTime(.001,S.audio.currentTime+d);osc.connect(vol);vol.connect(S.audio.destination);osc.start();osc.stop(S.audio.currentTime+d)}catch{}}
function speak(text){if(!("speechSynthesis" in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=.86;speechSynthesis.speak(u)}catch{}}
function addFX(x,y,color,num=10){for(let i=0;i<num;i++){const a=rnd(0,Math.PI*2),v=rnd(40,200);S.fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rnd(.35,.85),max:.85,color,size:rnd(1.8,5)})}}
function floater(x,y,text,color="#fff3b8"){S.floating.push({x,y,text,color,life:1.35})}
function updateHUD(){
$("hpText").textContent=Math.max(0,Math.ceil(S.health))+" / 100";$("hpFill").style.width=clamp(S.health,0,100)+"%";
$("inkText").textContent=Math.floor(S.ink);$("waveText").textContent=S.wave+" / "+S.maxWave;
$("scoreText").textContent=S.score.toLocaleString("vi-VN");$("comboText").textContent="×"+multiplier();
$("accuracyText").textContent=S.attempts?Math.round(100*S.correct/S.attempts)+"%":"—";
$("studyProgress").textContent=S.seen.size+"/"+Math.min(8,S.studySet.length);
$("studyFill").style.width=clamp(100*S.seen.size/Math.min(8,S.studySet.length),0,100)+"%";
$("studyHint").textContent=S.phase==="study"?"Ôn "+Math.min(8,S.studySet.length)+" thẻ để mở khóa phòng thủ":"Sách Phép đã sẵn sàng!";
$("waveBtn").disabled=S.phase!=="build"||!S.towers.some(t=>TOWERS[t.type].damage>0);
$("waveBtn").textContent=S.phase==="battle"?"⚔ Đang chiến đấu":S.phase==="done"?"Đã hoàn thành":"▶ Bắt đầu đợt "+(S.wave+1);
$("criticalBtn").disabled=S.phase!=="battle"||!S.enemies.length||S.challengeLock;
$("pauseBtn").disabled=S.phase!=="battle";$("pauseBtn").textContent=S.paused?"▶":"Ⅱ";
$("speedBtn").textContent=S.speed+"×";
$("phaseText").textContent={study:"📖 Đang học từ vựng",build:"🛠 Đang chuẩn bị tháp",battle:"⚔ Đang chiến đấu",done:"🏆 Kết thúc"}[S.phase];
const list=[...new Set(S.misses.map(m=>m.word.word))];
$("missedCount").textContent=list.length;
$("missedList").innerHTML=list.length?list.map(w=>"<span>"+esc(w)+"</span>").join(""):"Chưa có từ cần ôn";
}
function showWord(){
const w=S.studySet[S.studyIndex],revealed=S.seen.has(S.studyIndex);
$("wordText").textContent=w.word;$("wordIndex").textContent=String(S.studyIndex+1).padStart(2,"0")+" / "+S.studySet.length;
$("wordMeaning").textContent=revealed?w.meaning:"✦ Nhấn “Lật thẻ” để khám phá nghĩa";
$("wordExample").textContent=revealed?(w.example||w.collocation||"Use this word in a meaningful sentence."):"Ghi nhớ từ trước khi xem câu ví dụ.";
}
function flipCard(){
S.seen.add(S.studyIndex);showWord();sound(740,.12);updateHUD();
if(S.phase==="study"&&S.seen.size>=Math.min(8,S.studySet.length)){S.phase="build";announce("SÁCH PHÉP ĐÃ THỨC TỈNH");log("✨ Chọn tháp trong Kho Tháp và chạm một bệ sáng trên bản đồ để xây.");updateHUD()}
}
$("flipCardBtn").onclick=flipCard;
$("prevWord").onclick=()=>{S.studyIndex=(S.studyIndex-1+S.studySet.length)%S.studySet.length;showWord()};
$("nextWord").onclick=()=>{S.studyIndex=(S.studyIndex+1)%S.studySet.length;showWord()};
$("pronounceBtn").onclick=()=>speak(S.studySet[S.studyIndex].word);
$("soundBtn").onclick=()=>{S.sound=!S.sound;$("soundBtn").textContent=S.sound?"🔊":"🔇"};
$("helpBtn").onclick=()=>infoDialog("Cách chơi","1. Lật 8 thẻ Sách Phép để bắt đầu. 2. Chọn tháp, chạm bệ trên bản đồ. 3. Trả lời thử thách để triệu hồi tháp. 4. Nâng cấp tối đa cấp 3 hoặc bán tháp hoàn 70% giá. 5. Bắt đầu đợt quái và dùng Phép Chí Mạng. Từ sai sẽ thành Boss ở đợt sau.");
function renderArsenal(){
gamePanel.innerHTML=Object.entries(TOWERS).map(([id,t])=>'<button type="button" data-type="'+id+'" class="tower-choice '+(S.selectedType===id?"selected":"")+'"><span class="tower-art" style="color:'+t.color+'">'+t.symbol+'</span><span><strong>'+t.name+'</strong><small>'+t.desc+'</small></span><b>🖋️ '+t.price+'</b></button>').join("");
gamePanel.querySelectorAll("[data-type]").forEach(b=>b.onclick=()=>{S.selectedType=b.dataset.type;renderArsenal();log("Chọn "+TOWERS[S.selectedType].name+" · "+TOWERS[S.selectedType].price+" Mực. Chạm bệ trống trên bản đồ.")});
}
function selectedTower(){return S.towers.find(t=>t.pad===S.selectedPad)}
function upgradeCost(t){return Math.round(TOWERS[t.type].price*(t.level===1?.8:1.15))}
function renderSelected(){
const t=selectedTower();const pad=S.selectedPad===null?null:pads[S.selectedPad];
$("slotTitle").textContent=pad?"Bệ #"+String(S.selectedPad+1).padStart(2,"0"):"Chưa chọn bệ";
if(t){
$("towerDetails").innerHTML='<strong>'+TOWERS[t.type].name+' · Cấp '+t.level+'/3</strong><p>'+(t.faded?"🌫️ Tháp Mờ, chỉ còn 30% sức mạnh. Hãy sửa bằng từ vựng.":"✨ Tháp đã được kích hoạt.")+'</p><small>Đã đầu tư: '+t.spent+' Mực Phép</small>';
$("upgradeBtn").disabled=t.level>=3||S.ink<upgradeCost(t);$("upgradeBtn").textContent=t.level>=3?"Đã đạt cấp 3":"⬆ Nâng cấp "+upgradeCost(t)+" 🖋️";
$("repairBtn").disabled=!t.faded;$("sellBtn").disabled=false;$("sellBtn").textContent="Bán 70% · +"+Math.floor(t.spent*.7)+" 🖋️";
}else{
$("towerDetails").textContent=pad?"Bệ "+{stone:"đá thường",hill:"đồi cao +25% tầm bắn",water:"bến nước +20% sát thương",well:"Giếng Mực chỉ dành cho tháp hỗ trợ",locked:"bệ bị khóa, cần giải mã"}[pad.type]+". Chọn loại tháp rồi xây.":"Chạm bệ trên bản đồ để xây hoặc nâng cấp tháp.";
$("upgradeBtn").disabled=true;$("repairBtn").disabled=true;$("sellBtn").disabled=true;
}
}
$("upgradeBtn").onclick=()=>{
const t=selectedTower();if(!t||t.level>=3||S.ink<upgradeCost(t))return;
quiz(randWord(),TOWERS[t.type].kind,(good)=>{if(good){S.ink-=upgradeCost(t);t.spent+=upgradeCost(t);t.level++;addFX(t.x,t.y,TOWERS[t.type].color,40);announce("TĂNG CẤP "+t.level);log("⬆ "+TOWERS[t.type].name+" đã đạt cấp "+t.level+"!") }else log("Cần trả lời đúng để nâng cấp tháp. Không mất Mực Phép.");renderSelected()});
};
$("repairBtn").onclick=()=>{const t=selectedTower();if(!t||!t.faded)return;quiz(t.word||randWord(),TOWERS[t.type].kind,good=>{if(good){t.faded=false;addFX(t.x,t.y,"#f5d88d",34);log("✨ Tháp Mờ đã khôi phục 100% sức mạnh.")}else log("Chưa khôi phục được, có thể thử lại.");renderSelected()})};
$("sellBtn").onclick=()=>{const t=selectedTower();if(!t)return;S.ink+=Math.floor(.7*t.spent);S.towers=S.towers.filter(a=>a!==t);addFX(t.x,t.y,"#f7d8a9",16);log("Đã bán tháp và hoàn 70% Mực Phép.");renderSelected();updateHUD()};
let modalActive=false;
function modalClose(){modalActive=false;$("modal").hidden=true;S.challengeLock=false}
function infoDialog(title,description){
$("modal").hidden=false;modalActive=true;S.challengeLock=true;$("modalKicker").textContent="GRIMOIRE HELP";$("modalTitle").textContent=title;$("modalDesc").textContent=description;$("modalQuestion").innerHTML="";$("modalFeedback").innerHTML="";$("answerBtn").textContent="Đã hiểu";$("answerBtn").disabled=false;$("skipBtn").hidden=true;$("closeModal").hidden=false;$("answerBtn").onclick=modalClose;$("closeModal").onclick=modalClose;
}
function quiz(w,kind,onDone){
if(modalActive)return;modalActive=true;S.challengeLock=true;$("modal").hidden=false;
let prompt="",answer=w.word,options=null;
if(kind==="meaning"||((kind==="synonym"&&!w.syn)||(kind==="antonym"&&!w.ant))) {
 prompt="Từ “"+w.word+"” mang nghĩa nào?";options=shuffle([w.meaning,...shuffle(words.filter(a=>a.word!==w.word)).slice(0,3).map(x=>x.meaning)]);answer=options.indexOf(w.meaning)
}else if(kind==="synonym"){
prompt="Chọn từ đồng nghĩa với “"+w.word+"”";options=shuffle([w.syn,...shuffle(words.filter(a=>a.word!==w.word)).slice(0,3).map(x=>x.word)]);answer=options.indexOf(w.syn)
}else if(kind==="antonym"){
prompt="Chọn từ trái nghĩa với “"+w.word+"”";options=shuffle([w.ant,...shuffle(words.filter(a=>a.word!==w.word)).slice(0,3).map(x=>x.word)]);answer=options.indexOf(w.ant)
}else if(kind==="context"){
const example=w.example||"The correct word is "+w.word+".";
const at=example.toLowerCase().indexOf(w.word.toLowerCase());
prompt="Điền từ còn thiếu: "+(at<0?"Từ có nghĩa “"+w.meaning+"” là ______.":example.slice(0,at)+"________"+example.slice(at+w.word.length));
}else if(kind==="pronounce"){
prompt="🔊 Nghe và viết lại chính xác từ được phát âm. (Chế độ luyện nghe–chép trên trình duyệt này)";setTimeout(()=>speak(w.word),280)
}else prompt="Viết từ tiếng Anh tương ứng nghĩa: "+w.meaning;
$("modalKicker").textContent="MAGIC TRIAL · "+({meaning:"MEANING",spell:"SPELLING",pronounce:"ECHO",synonym:"SYNONYM",antonym:"ANTONYM",context:"CONTEXT"}[kind]||"VOCABULARY");
$("modalTitle").textContent="Thử thách ngôn từ";$("modalDesc").textContent="Trả lời đúng để giải phóng năng lượng. Đáp án sai sẽ trở lại trong các đợt quái sau.";
$("modalQuestion").innerHTML='<div class="prompt">'+esc(prompt)+'</div>'+(options?'<div class="answer-options">'+options.map((opt,i)=>'<label><input type="radio" name="lexAnswer" value="'+i+'"><span>'+esc(opt)+'</span></label>').join("")+'</div>':'<input id="lexInput" class="answer-input" type="text" autocomplete="off" spellcheck="false" placeholder="Nhập đáp án tiếng Anh...">')+(kind==="pronounce"?'<button id="replayWord" class="btn secondary" type="button" style="margin-top:10px">🔊 Nghe lại từ</button>':"");
if($("replayWord"))$("replayWord").onclick=()=>speak(w.word);
$("answerBtn").textContent="Kích hoạt phép ✨";$("answerBtn").disabled=false;$("skipBtn").hidden=false;$("closeModal").hidden=false;$("modalFeedback").innerHTML="";
const cancel=()=>{modalClose();onDone(false,true)};$("skipBtn").onclick=cancel;$("closeModal").onclick=cancel;
$("answerBtn").onclick=()=>{
const value=options?document.querySelector('input[name="lexAnswer"]:checked')?.value:$("lexInput")?.value;
if(value===undefined||value===null||String(value).trim()===""){$("modalFeedback").innerHTML='<div class="feedback bad">Hãy nhập hoặc chọn một đáp án.</div>';return}
const good=options?Number(value)===answer:normalize(value)===normalize(answer);
S.attempts++;
if(good){S.correct++;S.combo++;const reward=Math.round(8*multiplier());S.ink+=reward;S.score+=Math.round(20*multiplier());sound(730,.14)}
else{S.combo=0;S.misses.push({word:w,at:S.wave});S.reviewQueue.push(w);sound(210,.18)}
$("modalFeedback").innerHTML='<div class="feedback '+(good?"ok":"bad")+'">'+(good?"✓ Chính xác! Combo ×"+multiplier()+" · +Mực Phép.":"✕ "+esc(w.word)+" — "+esc(w.meaning)+" · từ này sẽ xuất hiện lại.")+'</div>';
$("answerBtn").disabled=true;$("skipBtn").hidden=true;$("closeModal").hidden=true;
setTimeout(()=>{modalClose();onDone(good,false);updateHUD()},720);
};
if($("lexInput")){$("lexInput").focus();$("lexInput").onkeydown=e=>{if(e.key==="Enter")$("answerBtn").click()}}
}
function canBuildOn(type,pad){return type==="well"?pad.type==="well":pad.type!=="well"}
function build(i){
if(S.phase==="study"){log("Hãy lật ít nhất 8 thẻ để đánh thức phép thuật.");return}
if(S.phase==="done")return;
S.selectedPad=i;
const existing=selectedTower();renderSelected();if(existing)return;
const pad=pads[i],def=TOWERS[S.selectedType];
if(pad.type==="locked"){quiz(randWord(),"spell",good=>{if(good){pad.type="stone";addFX(pad.x,pad.y,"#ffe9a0",32);log("🔓 Đã phá chướng ngại! Bệ bí mật được mở.")}else log("Bệ bí mật chưa mở. Thử lại để giải mã.");renderSelected()});return}
if(!canBuildOn(S.selectedType,pad)){log(pad.type==="well"?"Giếng Mực chỉ cho phép xây Tháp Giếng Mực.":"Tháp Giếng Mực chỉ được xây trên ô Giếng.");return}
if(S.ink<def.price){log("Chưa đủ "+def.price+" Mực Phép để xây tháp này.");return}
const type=S.selectedType;
quiz(randWord(),def.kind,(good,cancelled)=>{
if(cancelled)return;
S.ink-=def.price;S.towers.push({pad:i,type,x:pad.x,y:pad.y,level:1,spent:def.price,faded:!good,word:randWord(),cooldown:rnd(0,.5),aim:0,glow:0});
addFX(pad.x,pad.y,good?"#fff4b8":"#c7c0d9",35);floater(pad.x,pad.y,good?"✨ SUMMON!":"🌫 THÁP MỜ");log(good?"Triệu hồi thành công "+def.name+"!":"Trả lời chưa đúng: tháp Mờ chỉ có 30% sức mạnh. Chạm tháp và nhấn Sửa.");renderSelected();updateHUD();
});
}
canvas.addEventListener("click",event=>{
const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*canvas.width/rect.width,y=(event.clientY-rect.top)*canvas.height/rect.height;
const target=pads.map((p,i)=>({i,dist:Math.hypot(x-p.x,y-p.y)})).sort((a,b)=>a.dist-b.dist)[0];
if(target.dist<38)build(target.i);else{S.selectedPad=null;renderSelected()}
});
$("waveBtn").onclick=()=>startWave();
function startWave(){
if(S.phase!=="build"||!S.towers.some(t=>TOWERS[t.type].damage>0))return;
S.phase="battle";S.paused=false;S.wave++;S.spawned=0;S.spawnClock=0;S.targetSpawn=8+S.wave*3;S.progressWave=0;
announce(S.wave===5?"FINAL WAVE · VUA QUÊN LÃNG":"WAVE "+S.wave+" · FORGETLINGS");
log("⚔️ Quái đang tràn tới! Nhấn Phép Chí Mạng để giải khiên từ vựng.");
updateHUD()
}
$("pauseBtn").onclick=()=>{S.paused=!S.paused;log(S.paused?"⏸ Đã tạm dừng.":"▶ Trận đấu tiếp tục.");updateHUD()};
$("speedBtn").onclick=()=>{S.speed=S.speed===1?1.5:S.speed===1.5?2:1;updateHUD()};
function critical(){
if(S.phase!=="battle"||S.challengeLock||!S.enemies.length||S.paused)return;
const target=[...S.enemies].sort((a,b)=>b.distance-a.distance)[0];
const w=target.word||randWord(),kind=pick(["spell","meaning","context","synonym"]);
quiz(w,kind,good=>{
if(good){target.hp-=target.boss?270:155;target.hit=1;addFX(target.x,target.y,"#ffe08a",40);floater(target.x,target.y,"⚡ CRITICAL!");log("⚡ Chính xác! Phép chí mạng phá khiên và gây sát thương lớn.");}
else log("Chưa kích hoạt được chí mạng. Hãy ghi nhớ từ này cho lần sau.");
})
}
$("criticalBtn").onclick=critical;
window.addEventListener("keydown",e=>{if(e.code==="Space"&&S.phase==="battle"&&!S.challengeLock&&!/INPUT|TEXTAREA/.test(document.activeElement?.tagName||"")){e.preventDefault();critical()}});
function spawn(){
const id=S.nextEnemyId++,last=S.wave===5&&S.spawned===S.targetSpawn-1;
let type=last?"boss":S.wave===1?pick(["shade","worm"]):S.wave===2?pick(["shade","worm","bat"]):S.wave===3?pick(["shade","worm","spider","bat"]):pick(["worm","bat","spider","golem"]);
let word=null;
if(S.reviewQueue.length&&S.spawned%5===3){word=S.reviewQueue.shift();type="golem"}
const def=E_TYPES[type],scale=1+(S.wave-1)*.16,full=Math.round(def.hp*scale);
S.enemies.push({id,type,boss:last||!!word,word,distance:0,x:-60,y:368,hp:full,maxHp:full,speed:def.speed*(last?.70:1),slow:0,freeze:0,burn:0,hit:0,stun:0,seed:rnd(0,6),escaped:false});
S.spawned++;
}
function defeat(enemy){
if(enemy.escaped)return;const reward=enemy.boss?55:E_TYPES[enemy.type].reward;
S.ink+=reward;S.score+=reward*2;floater(enemy.x,enemy.y,"+"+reward+" 🖋️","#ffe39d");addFX(enemy.x,enemy.y,enemy.boss?"#f7b9f9":"#bdf6d9",18);sound(520,.07);
}
function update(dt){
if(S.phase!=="battle"||S.paused||S.challengeLock)return;
S.spawnClock+=dt;
const cadence=Math.max(.55,1.1-S.wave*.065);
if(S.spawned<S.targetSpawn&&S.spawnClock>=cadence){spawn();S.spawnClock-=cadence}
for(const e of S.enemies){
e.hit=Math.max(0,e.hit-dt*4);e.freeze=Math.max(0,e.freeze-dt);e.slow=Math.max(0,e.slow-dt);e.stun=Math.max(0,e.stun-dt);
const speed=e.stun>0?0:e.freeze>0?0:e.slow>0?e.speed*.46:e.speed;
e.distance+=speed*dt;const p=coordAt(e.distance);e.x=p.x;e.y=p.y;
if(e.burn>0){e.hp-=11*dt;e.burn=Math.max(0,e.burn-dt)}
if(e.distance>=totalLength){e.escaped=true;e.hp=0;S.health-=E_TYPES[e.type].damage*(e.boss?1.3:1);addFX(1050,365,"#fdaf89",22);log("💔 Quái lọt vào thành! Hãy thay đổi chiến thuật tháp.")}
}
for(const tower of S.towers){
const def=TOWERS[tower.type];if(def.damage===0)continue;tower.cooldown-=dt;tower.glow=Math.max(0,tower.glow-dt*2);
let range=def.range*(pads[tower.pad].type==="hill"?1.25:1)*(1+(tower.level-1)*.12);
let candidates=S.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-tower.x,e.y-tower.y)<range).sort((a,b)=>b.distance-a.distance);
if(candidates.length&&tower.cooldown<=0){
const target=candidates[0],rate=def.rate/(1+.21*(tower.level-1));tower.cooldown=rate;tower.aim=Math.atan2(target.y-tower.y,target.x-tower.x);tower.glow=1;
const damage=def.damage*(tower.faded?.30:1)*(1+(tower.level-1)*.75)*(pads[tower.pad].type==="water"?1.2:1);
S.bullets.push({x:tower.x,y:tower.y-20,target,damage,speed:tower.type==="echo"?430:590,type:tower.type,life:2});
}
}
for(const b of S.bullets){
if(b.target.hp<=0){b.life=0;continue}
const dx=b.target.x-b.x,dy=b.target.y-b.y,dist=Math.hypot(dx,dy);
if(dist<18){b.target.hp-=b.damage;b.target.hit=1;b.life=0;
if(b.type==="ice")b.target.slow=2.2;
if(b.type==="echo"){b.target.distance=Math.max(0,b.target.distance-24);b.target.stun=.23}
if(b.type==="fire")b.target.burn=3;
if(b.type==="spell"&&b.target.type==="golem")b.target.hp-=b.damage*.35;
addFX(b.target.x,b.target.y,TOWERS[b.type].color,6)
}else{b.x+=dx/dist*Math.min(dist,b.speed*dt);b.y+=dy/dist*Math.min(dist,b.speed*dt);b.life-=dt}
}
S.bullets=S.bullets.filter(b=>b.life>0);
for(const e of S.enemies)if(e.hp<=0&&!e.escaped)defeat(e);
S.enemies=S.enemies.filter(e=>e.hp>0);
if(S.health<=0){S.health=0;finish(false);return}
if(S.spawned>=S.targetSpawn&&S.enemies.length===0){
for(const t of S.towers)if(t.type==="well")S.ink+=35*t.level;
S.ink+=35;S.phase="build";S.paused=false;S.score+=120*S.wave;
if(S.wave===5){finish(true);return}
announce("WAVE "+S.wave+" CLEARED");
log("🌟 Qua đợt "+S.wave+"! Nhận Mực Phép. Nâng cấp tháp hoặc bán 70% để thay đổi chiến thuật.");
}
}
function saveResult(win){
try{const arr=JSON.parse(localStorage.getItem(recordKey)||"[]");arr.unshift({time:new Date().toISOString(),win,score:S.score,wave:S.wave,accuracy:S.attempts?Math.round(100*S.correct/S.attempts):0,wrong:[...new Set(S.misses.map(a=>a.word.word))]});localStorage.setItem(recordKey,JSON.stringify(arr.slice(0,30)))}catch{}
}
function finish(win){
S.phase="done";S.finished=true;saveResult(win);sound(win?880:190,.32);
$("modal").hidden=false;S.challengeLock=true;modalActive=true;
$("modalKicker").textContent=win?"KINGDOM SAVED":"THE KINGDOM NEEDS YOU";
$("modalTitle").textContent=win?"🏆 Lexica đã được cứu!":"🏰 Cổ Thành thất thủ";
$("modalDesc").textContent="Hoàn thành "+S.wave+"/5 đợt · "+S.score.toLocaleString("vi-VN")+" điểm · Chính xác "+(S.attempts?Math.round(100*S.correct/S.attempts):0)+"%.";
$("modalQuestion").innerHTML='<div class="prompt">Mỗi lần chơi lại là một lần ghi nhớ từ vựng tốt hơn. Hãy thử chiến thuật mới!</div>';
$("modalFeedback").innerHTML="";$("skipBtn").hidden=true;$("closeModal").hidden=true;$("answerBtn").disabled=false;$("answerBtn").textContent="↻ Chơi lại";
$("answerBtn").onclick=()=>{modalClose();restart()};
}
function restart(){
Object.assign(S,{phase:"study",paused:false,speed:1,wave:0,health:100,ink:220,score:0,combo:0,correct:0,attempts:0,studyIndex:0,studySet:shuffle(words).slice(0,10),seen:new Set(),selectedType:"quill",selectedPad:null,towers:[],enemies:[],bullets:[],fx:[],floating:[],misses:[],spawned:0,targetSpawn:0,spawnClock:0,reviewQueue:[],finished:false,challengeLock:false});
pads[11].type="locked";showWord();renderArsenal();renderSelected();log("Lật 8 thẻ Sách Phép, rồi xây tháp chuẩn bị cho 5 đợt quái.");updateHUD();
}
$("restartBtn").onclick=()=>{if(S.phase==="battle"&&!confirm("Bắt đầu lại sẽ xóa tiến độ ván chơi hiện tại. Tiếp tục?"))return;restart()};
function rounded(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function line(points,color,width){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin="round";ctx.lineCap="round";ctx.stroke()}
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function strokeCircle(x,y,r,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke()}
function polygon(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill()}
function tree(x,y,scale,twist){
ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.rotate(Math.sin(S.time*.65+twist)*.024);ellipse(0,15,18,7,"#194d5680");polygon([[-6,9],[7,9],[6,-34],[-4,-36]],"#865948");
for(const [ox,oy,r] of [[-14,-45,22],[12,-52,24],[0,-65,25]]){ellipse(ox+3,oy+5,r+3,r*.82,"#2e826e");ellipse(ox,oy,r,r*.8,"#40987a");ellipse(ox-5,oy-6,r*.52,r*.39,"#77bf8b")}
ctx.restore()
}
function drawBackdrop(){
const sky=ctx.createLinearGradient(0,0,0,660);sky.addColorStop(0,"#a3c6d9");sky.addColorStop(.37,"#c8e5d1");sky.addColorStop(1,"#8ab7a6");ctx.fillStyle=sky;ctx.fillRect(0,0,1120,660);
const t=S.time;
for(let i=0;i<6;i++){const x=(i*260+Math.sin(t*.07+i)*22)%1300-50,y=42+i%3*31;ellipse(x,y,78,16,"#ffffff52");ellipse(x+37,y-12,46,23,"#ffffff66")}
ctx.fillStyle="#8fc2b9";polygon([[0,140],[155,65],[300,145],[405,94],[600,160],[710,86],[910,165],[1060,82],[1120,132],[1120,360],[0,340]],"#91bdb8");
polygon([[0,207],[105,168],[260,230],[423,139],[620,250],[744,175],[940,242],[1120,169],[1120,365],[0,353]],"#80ada9");
ellipse(1010,94,70,70,"#ffecb180");ellipse(1010,94,50,50,"#ffe9b5a8");
}
function drawIsland(){
const y=35+Math.sin(S.time*.48)*2;
polygon([[14,127+y],[132,100+y],[390,128+y],[630,91+y],[956,113+y],[1098,170+y],[1078,586+y],[880,616+y],[650,600+y],[432,630+y],[182,602+y],[25,555+y]],"#5c7d89");
polygon([[14,99+y],[132,72+y],[390,100+y],[630,62+y],[956,85+y],[1098,143+y],[1078,558+y],[880,589+y],[650,571+y],[432,600+y],[182,574+y],[25,528+y]],"#8fc49c");
polygon([[19,106+y],[136,78+y],[387,107+y],[632,69+y],[954,92+y],[1091,149+y],[1071,551+y],[878,581+y],[650,565+y],[431,590+y],[184,565+y],[32,522+y]],"#9ed2a0");
const dirt=ctx.createLinearGradient(0,90,0,600);dirt.addColorStop(0,"#b6df9f");dirt.addColorStop(1,"#91c6a0");ctx.fillStyle=dirt;polygon([[35,125],[143,99],[391,129],[621,99],[940,117],[1068,167],[1050,536],[871,560],[640,542],[438,565],[193,541],[55,507]],dirt);
for(let i=0;i<24;i++){const x=48+(i*171)%1030,y=120+(i*129)%420;ellipse(x,y,25+i%3*5,8,"#65b89744")}
}
function drawWater(){
const t=S.time;ctx.save();ctx.globalAlpha=.87;
polygon([[0,523],[120,501],[220,522],[320,545],[400,581],[436,660],[0,660]],"#5daeb9");
for(let i=0;i<13;i++){const x=(i*47+Math.sin(t*.8+i)*8)%420,y=556+i%4*29;line([[x,y],[x+23,y-2]],"#c8f5e7aa",2)}
ctx.restore();
}
function drawPath(){
const shifted=paths.map(([x,y])=>[x,y]);
line(shifted,"#52788b",76);line(shifted,"#f6d8a2",66);line(shifted,"#d4a980",57);line(shifted,"#e8c499",47);
ctx.setLineDash([4,17]);line(shifted,"#fff2c18a",3);ctx.setLineDash([]);
for(let d=30;d<totalLength;d+=32){const a=coordAt(d),b=coordAt(d+8);ellipse(a.x,a.y,2,2,"#bf9877aa");ctx.fillStyle="#ffefca4d";ctx.beginPath();ctx.arc(b.x,b.y,1.3,0,7);ctx.fill()}
}
function drawStructures(){
const st=S.time;
for(const [x,y,s] of [[48,194,.8],[68,455,.85],[295,490,.65],[322,142,.63],[498,198,.55],[690,91,.7],[915,543,.7],[1010,220,.6],[985,450,.8],[73,302,.58],[729,580,.5]] )tree(x,y,s,x*.1);
for(let i=0;i<37;i++){const x=35+(i*197)%1050,y=108+(i*127)%478;if(i%4===0){ctx.fillStyle="#f6d893";ellipse(x,y,3,2,"#f2cf90");ellipse(x+9,y+3,2,2,"#e4b7c2")}}
for(const [x,y] of [[508,436],[788,243]]){
ctx.save();ctx.translate(x,y);ctx.fillStyle="#886c75";rounded(-37,-26,74,14,3);ctx.fill();ctx.fillStyle="#f6dfaf";rounded(-34,-31,68,9,2);ctx.fill();line([[-32,-28],[-32,-42],[-20,-42]],"#9e6e56",4);line([[32,-28],[32,-42],[20,-42]],"#9e6e56",4);ctx.restore()
}
// Ink wells and glowing crystals
const x=514,y=536;
ellipse(x,y+10,38,16,"#71578d");ellipse(x,y+4,31,12,"#c2a8e7");
ellipse(x,y,25,8,"#6747b0");ctx.fillStyle="#f1d17a";ctx.font="20px serif";ctx.fillText("✦",x-9,y+4);
for(const [cx,cy] of [[350,76],[740,154],[920,505]]){polygon([[cx,cy-19],[cx+12,cy-3],[cx+3,cy+17],[cx-11,cy+7]],"#c1a0f5");polygon([[cx,cy-19],[cx+2,cy+17],[cx-11,cy+7]],"#8e76d5")}
}
function drawCastle(){
const x=1056,y=356;ellipse(x,y+28,72,26,"#4d5a7f80");
polygon([[1012,304],[1059,273],[1108,302],[1107,391],[1012,392]],"#746a9e");
polygon([[1006,298],[1059,261],[1112,297],[1112,317],[1006,317]],"#997ebe");
for(const dx of [-33,31]){const ax=x+dx;ctx.fillStyle="#786799";rounded(ax-15,254,30,100,5);ctx.fill();polygon([[ax-18,259],[ax,225],[ax+18,259]],"#bd81b8");ctx.fillStyle="#d6beed";rounded(ax-5,286,10,21,4);ctx.fill()}
ctx.fillStyle="#3a345f";rounded(x-20,338,40,54,18);ctx.fill();ctx.fillStyle="#ffe3a2";rounded(x-8,342,16,31,7);ctx.fill();strokeCircle(x,324,36,"#fbdf9c77",2);
ctx.fillStyle="#fff5c1";ctx.font="17px Baloo 2";ctx.textAlign="center";ctx.fillText("LEXICA",x,312);ctx.textAlign="left";
}
function drawPad(p,i){
const tower=S.towers.find(t=>t.pad===i);
const isActive=S.selectedPad===i;ctx.save();ctx.translate(p.x,p.y);
const color={stone:"#d9cae9",hill:"#f7d88c",water:"#7ce1ee",well:"#ffa975",locked:"#8394a1"}[p.type];
ellipse(0,11,42,17,"#31536b66");ellipse(0,5,38,16,"#65547d");ellipse(0,0,34,13,color);
strokeCircle(0,0,28,isActive?"#fff6ba":"#a18dba",isActive?4:2);
if(tower){drawTower(tower,0,-4)}
else if(p.type==="locked"){ctx.fillStyle="#6b6592";ctx.font="26px serif";ctx.textAlign="center";ctx.fillText("🔒",0,6)}
else{ctx.fillStyle=isActive?"#fff":"#5c4b8d";ctx.font="28px serif";ctx.textAlign="center";ctx.fillText("✦",0,8)}
ctx.restore();
}
function drawTower(t,x,y){
const def=TOWERS[t.type],lvl=t.level,tm=S.time;ctx.save();ctx.translate(x,y);if(t.faded)ctx.globalAlpha=.65;
let outline=t.type==="fire"?"#a44950":t.type==="ice"?"#4c9cbb":t.type==="well"?"#ac7b50":"#66529b";
ctx.fillStyle=outline;rounded(-20,-39,40,43,7);ctx.fill();
ctx.fillStyle=lvl===3?"#f3e9bd":"#bfb2d8";rounded(-15,-44,30,15,4);ctx.fill();
ctx.fillStyle=def.color;ctx.shadowColor=def.color;ctx.shadowBlur=14+t.glow*21;
switch(t.type){
case"quill":line([[-4,-37],[7,-69-lvl*4]],"#f7ecd4",7);polygon([[6,-72-lvl*4],[17,-91-lvl*5],[17,-60-lvl*5]],"#55ccbc");ctx.font="24px serif";ctx.fillText("✒",-13,-44);break;
case"spell":polygon([[0,-88-lvl*6],[20,-61],[8,-40],[-14,-40],[-22,-61]],"#b9a3ff");polygon([[0,-88-lvl*6],[20,-61],[0,-48]],"#f1d7ff");break;
case"echo":ctx.strokeStyle="#ffd889";ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,-62,20+lvl*3,Math.PI,0);ctx.stroke();ellipse(0,-56,12+lvl*2,17,"#d8ad62");ctx.font="15px serif";ctx.fillText("♫",17,-72);break;
case"ice":for(let i=0;i<6;i++){const a=i*Math.PI/3;line([[0,-59],[Math.cos(a)*(20+lvl*3),-59+Math.sin(a)*(20+lvl*3)]],"#c6fdff",6)}ellipse(0,-59,12,12,"#8df3ef");break;
case"fire":polygon([[-18,-45],[4,-99-lvl*4],[14,-72],[22,-48],[0,-42]],"#f9a557");polygon([[-5,-45],[7,-82],[15,-48]],"#ffdf7c");break;
case"well":ellipse(0,-38,22,9,"#9775c2");ellipse(0,-39,16,6,"#ffda78");ctx.font="18px serif";ctx.fillText("✦",-7,-46);break;
}
ctx.shadowBlur=0;if(lvl===3){ctx.strokeStyle=def.color;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-55,33,10,Math.sin(tm)*.15,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#f4e6a5";ctx.font="15px serif";ctx.textAlign="center";ctx.fillText("✦",0,-108)}
if(lvl>=2){ctx.fillStyle="#ffdf93";ctx.font="14px serif";ctx.textAlign="center";ctx.fillText("✦".repeat(lvl-1),0,14)}
if(t.faded){ctx.fillStyle="#aea9b6bb";rounded(-25,-90,50,90,8);ctx.fill();ctx.fillStyle="#fbf8fc";ctx.font="12px sans-serif";ctx.fillText("MỜ",-13,-46)}
ctx.restore();
}
function drawEnemy(e){
ctx.save();const bob=Math.sin(S.time*4+e.seed)*5;ctx.translate(e.x,e.y+bob);let scale=e.boss?1.45:1;ctx.scale(scale,scale);
ellipse(0,21,29,9,"#294a5e55");const color=e.hit>0?"#fff5c7":E_TYPES[e.type].color;
ctx.fillStyle=color;ctx.strokeStyle="#443e69";ctx.lineWidth=2;
if(e.type==="worm"){for(let i=0;i<4;i++){ellipse(-20+i*11,7+Math.sin(S.time*9+i)*4,14,12,i%2?"#8fc69a":"#68b58c")}ellipse(18,-1,18,18,color)}
else if(e.type==="bat"){polygon([[-8,-4],[-43,-25+Math.sin(S.time*10)*12],[-28,13],[0,0],[28,13],[43,-25+Math.sin(S.time*10)*12],[8,-4]],color);ellipse(0,-2,17,17,"#7a84bc")}
else if(e.type==="spider"){for(let a=0;a<4;a++){const y=-7+a*7;line([[-10,y],[-31,y-7]],"#554d7a",4);line([[10,y],[31,y-7]],"#554d7a",4)}ellipse(0,0,25,21,color)}
else if(e.type==="golem"){polygon([[-23,-19],[20,-27],[35,-1],[20,28],[-22,22],[-31,0]],"#9d8fa1");ctx.fillStyle="#ded0c5";rounded(-22,-14,44,24,5);ctx.fill();line([[-20,-18],[-8,5],[17,-11]],"#81779c",3)}
else if(e.type==="boss"){ellipse(0,-5,37,35,"#9e6bba");polygon([[-27,-28],[-23,-54],[-8,-38],[0,-58],[13,-36],[24,-57],[31,-28]],"#f3c77f");ellipse(0,-6,27,24,color)}
else ellipse(0,0,22,23,color);
if(e.type!=="golem"){ellipse(-8,-4,5,6,"#fff2d5");ellipse(8,-4,5,6,"#fff2d5");ellipse(-7,-3,2.5,3,"#373058");ellipse(9,-3,2.5,3,"#373058")}
if(e.boss){ctx.fillStyle="#f6d690";ctx.font="22px serif";ctx.textAlign="center";ctx.fillText("♛",0,-39)}
ctx.fillStyle="#3a3458";rounded(-23,-38,46,6,3);ctx.fill();ctx.fillStyle="#9af3bf";rounded(-22,-37,44*clamp(e.hp/e.maxHp,0,1),4,2);ctx.fill();
ctx.restore();
}
function render(){
S.time+=.016;drawBackdrop();drawIsland();drawWater();drawPath();drawStructures();
for(let i=0;i<pads.length;i++)drawPad(pads[i],i);
drawCastle();const enemies=[...S.enemies].sort((a,b)=>a.y-b.y);for(const e of enemies)drawEnemy(e);
for(const b of S.bullets){ctx.save();ctx.shadowBlur=18;ctx.shadowColor=TOWERS[b.type].color;ctx.fillStyle=TOWERS[b.type].color;ellipse(b.x,b.y,b.type==="ice"?8:5,b.type==="ice"?8:5,TOWERS[b.type].color);ctx.restore()}
for(const p of S.fx){ctx.globalAlpha=clamp(p.life/p.max,0,1);ellipse(p.x,p.y,p.size,p.size,p.color)}ctx.globalAlpha=1;
ctx.textAlign="center";ctx.font="800 16px Nunito";for(const p of S.floating){ctx.globalAlpha=clamp(p.life,0,1);ctx.fillStyle=p.color;ctx.shadowColor="#41305c";ctx.shadowBlur=8;ctx.fillText(p.text,p.x,p.y)}ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.textAlign="left";
}
function loop(now){
let dt=S.last?Math.min(.04,(now-S.last)/1000):0;S.last=now;
if(!S.paused){if(!S.challengeLock)update(dt*S.speed);for(const f of S.fx){f.x+=f.vx*dt;f.y+=f.vy*dt;f.life-=dt}for(const p of S.floating){p.y-=27*dt;p.life-=dt}}
S.fx=S.fx.filter(f=>f.life>0);S.floating=S.floating.filter(f=>f.life>0);
render();if(!S.lastHUD||now-S.lastHUD>=200){updateHUD();S.lastHUD=now}requestAnimationFrame(loop);
}
showWord();renderArsenal();renderSelected();updateHUD();log("📖 Lật 8 thẻ Sách Phép để bắt đầu. Mỗi từ đúng sẽ tạo nên sức mạnh cho Lexica.");requestAnimationFrame(loop);
})();
