(()=>{
"use strict";
const E=id=>document.getElementById(id),c=E("board"),g=c.getContext("2d"),N=s=>String(s||"").toLowerCase().trim().replace(/[.!?,;:]+$/,""),R=a=>a[Math.floor(Math.random()*a.length)];
const defaultWords=[["protect","bảo vệ","We must protect our planet."],["reduce","giảm","We should reduce plastic waste."],["recycle","tái chế","People recycle plastic bottles."],["pollution","ô nhiễm","Air pollution harms health."],["sustainable","bền vững","The city needs sustainable development."],["habitat","môi trường sống","Many animals lose their habitat."],["climate","khí hậu","Climate change threatens wildlife."],["conserve","bảo tồn","We must conserve natural resources."],["ecosystem","hệ sinh thái","Plastic affects the marine ecosystem."],["renewable","tái tạo được","Solar power is renewable energy."]].map(([word,meaning,example])=>({word,meaning,example}));
let selected=[];try{selected=JSON.parse(sessionStorage.getItem("LEXICON_GUARDIANS_WORDS")||"[]")}catch(e){}
let words=(Array.isArray(selected)?selected:[]).filter(w=>w.word&&w.meaning).slice(0,40);
if(words.length<6)words=defaultWords;
words=words.sort(()=>Math.random()-.5);
let study=words.slice(0,Math.min(10,words.length)),phase="study",seen=new Set(),current=0,hp=100,mana=130,score=0,wave=0,correct=0,attempts=0,paused=false,last=0,spawns=0,toSpawn=0,clock=0,sound=true,selectedTower="spell",wrong=[],towers=[],enemies=[],effects=[],shots=[];
const pads=[[105,205],[320,255],[370,60],[620,245],[680,535],[890,390],[885,165],[425,530]];
const route=[[-40,320],[215,320],[215,130],[520,130],[520,445],[790,445],[790,280],[1040,280]];
const types={spell:{cost:45,damage:24,rate:1.4,range:140,icon:"📜"},meaning:{cost:50,damage:16,rate:.95,range:170,icon:"🔮"},context:{cost:65,damage:30,rate:1.7,range:125,icon:"🌱"}};
const critical=document.createElement("button");critical.className="primary";critical.textContent="⚡ Phép chí mạng";critical.style.display="none";document.querySelector(".bottom").appendChild(critical);
const esc=s=>String(s||"").replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
function say(t){E("gameStatus").textContent=t;E("boardTip").textContent=t}
function speak(s){if(!speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang="en-US";u.rate=.85;speechSynthesis.speak(u)}
function drawCards(){E("grimoire").innerHTML=study.map((w,i)=>'<button class="wordCard '+(seen.has(i)?"seen":"")+'" data-i="'+i+'"><b>'+esc(w.word)+'</b><small>'+(seen.has(i)||current===i?esc(w.meaning):"📖 Xem nghĩa")+'</small></button>').join("");document.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>reveal(+b.dataset.i))}
function reveal(i){current=i;seen.add(i);drawCards();if(phase==="study"&&seen.size>=Math.min(6,study.length)){phase="ready";say("Đã nạp Sách Phép. Chọn tháp rồi chạm ô ✦ để xây.")}else say(study[i].word+" — "+study[i].meaning+". "+(study[i].example||""));updateHUD()}
E("nextCardBtn").onclick=()=>reveal((current+1)%study.length);E("speakBtn").onclick=()=>speak(study[current].word);E("soundBtn").onclick=()=>{sound=!sound;E("soundBtn").textContent=sound?"🔊":"🔇"};
document.querySelectorAll("[data-tower]").forEach(b=>b.onclick=()=>{selectedTower=b.dataset.tower;document.querySelectorAll("[data-tower]").forEach(x=>x.classList.toggle("selected",x===b));say("Đã chọn tháp. Chạm ô ✦ trên bản đồ.")});
function updateHUD(){E("hpText").textContent=Math.max(0,Math.ceil(hp))+" / 100";E("hpFill").style.width=Math.max(0,hp)+"%";E("mana").textContent=Math.floor(mana);E("score").textContent=score;E("wave").textContent=wave+" / 5";E("accuracy").textContent=attempts?Math.round(100*correct/attempts)+"%":"0%";E("learnedCount").textContent=seen.size+" / "+study.length;E("waveBtn").disabled=phase!=="ready"||!towers.length;E("stageBadge").textContent={study:"Sách Phép",ready:"Xây tháp",battle:"Chiến đấu",done:"Hoàn thành"}[phase];E("wrongWords").textContent=[...new Set(wrong.map(w=>w.word))].join(" · ")||"Chưa có từ cần ôn";critical.style.display=phase==="battle"?"":"none"}
const overlay=E("modal");
function question(w,kind,done){
 paused=true;overlay.hidden=false;E("modalTitle").textContent="✨ Phép thuật từ vựng";E("modalDesc").textContent="Trả lời đúng để kích hoạt sức mạnh. Từ sai sẽ trở lại ở các đợt sau.";E("modalFeedback").textContent="";E("closeModal").hidden=true;E("skipBtn").hidden=true;E("answerBtn").disabled=false;
 const other=study.filter(x=>x.word!==w.word);
 let options=null,answer=w.word,prompt="";
 if(kind==="meaning"){options=[w.meaning,...other.slice(0,3).map(x=>x.meaning)].sort(()=>Math.random()-.5);answer=options.indexOf(w.meaning);prompt="Từ “"+w.word+"” có nghĩa là gì?"}
 else if(kind==="context"){const sentence=w.example||"People use "+w.word+" in English.";let at=sentence.toLowerCase().indexOf(w.word.toLowerCase());prompt="Điền từ thiếu: "+(at<0?sentence:sentence.slice(0,at)+"________"+sentence.slice(at+w.word.length))}
 else prompt="Viết từ tiếng Anh tương ứng với nghĩa: "+w.meaning;
 E("modalQuestion").innerHTML='<div class="question">'+esc(prompt)+'</div>'+(options?'<div class="choices">'+options.map((x,i)=>'<label><input type="radio" name="answer" value="'+i+'">'+esc(x)+'</label>').join("")+'</div>':'<input type="text" class="answerInput" id="textAnswer" placeholder="Nhập từ tiếng Anh..." autocomplete="off">');
 E("answerBtn").onclick=()=>{const value=options?document.querySelector('input[name="answer"]:checked')?.value:E("textAnswer")?.value;if(value===undefined||value===null||!String(value).trim())return;
 const good=options?Number(value)===answer:N(value)===N(answer);attempts++;if(good){correct++;score+=25;mana+=5}else wrong.push(w);
 E("modalFeedback").innerHTML='<div class="'+(good?"correctMsg":"wrongMsg")+'">'+(good?"✓ Chính xác!":"✕ Cần ghi nhớ: "+esc(w.word)+" = "+esc(w.meaning))+'</div>';E("answerBtn").disabled=true;setTimeout(()=>{overlay.hidden=true;paused=false;done(good);updateHUD()},650)};
 let input=E("textAnswer");if(input){input.focus();input.onkeydown=e=>{if(e.key==="Enter")E("answerBtn").click()}}
}
c.onclick=e=>{if(phase==="study"){say("Hãy mở ít nhất 6 thẻ từ trong Sách Phép.");return}if(phase==="done")return;let rect=c.getBoundingClientRect(),x=(e.clientX-rect.left)*1000/rect.width,y=(e.clientY-rect.top)*610/rect.height;let nearest=pads.map(([a,b],i)=>({i,d:Math.hypot(a-x,b-y)})).sort((a,b)=>a.d-b.d)[0];if(nearest.d>48||towers.some(t=>t.i===nearest.i))return;let type=selectedTower,s=types[type];if(mana<s.cost){say("Không đủ năng lượng 💎 để xây tháp.");return}question(R(study),type,good=>{mana-=s.cost;towers.push({i:nearest.i,x:pads[nearest.i][0],y:pads[nearest.i][1],type,damage:s.damage*(good?1:.45),range:s.range,clock:0,strong:good});say(good?"Tháp đã được triệu hồi với sức mạnh tối đa!":"Tháp yếu hơn vì từ chưa chính xác. Từ sẽ được ôn lại.")})};
E("waveBtn").onclick=()=>{if(phase!=="ready"||!towers.length)return;wave++;phase="battle";spawns=0;toSpawn=4+wave*2+Math.min(2,wrong.length);clock=0;say("⚔ Đợt "+wave+" bắt đầu! Bấm Phép chí mạng để hỗ trợ.")};
function strike(){if(phase!=="battle"||!enemies.length)return;let e=enemies.reduce((a,b)=>a.t>b.t?a:b);question(e.word||R(study),R(["spell","meaning","context"]),good=>{e.hp-=good?85:5;effect(e.x,e.y,good?"#ffd480":"#c9b6e9");if(good){score+=40;say("⚡ Phép chí mạng trúng đích!")}})}
critical.onclick=strike;
window.onkeydown=e=>{if(e.code==="Space"&&phase==="battle"&&overlay.hidden&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();strike()}};
function place(t){let distances=[],sum=0;for(let i=1;i<route.length;i++){let v=Math.hypot(route[i][0]-route[i-1][0],route[i][1]-route[i-1][1]);sum+=v;distances.push(v)}let left=t*sum;for(let i=0;i<distances.length;i++){if(left<=distances[i]){let a=left/distances[i];return{x:route[i][0]*(1-a)+route[i+1][0]*a,y:route[i][1]*(1-a)+route[i+1][1]*a}}left-=distances[i]}return{x:1040,y:280}}
function spawn(){let w=wrong.length&&spawns%4===3?wrong.shift():null,boss=!!w,life=50+wave*14+(boss?85:0);enemies.push({t:0,x:-40,y:320,hp:life,full:life,boss,word:w,speed:(boss?.5:.85),flash:0});spawns++}
function effect(x,y,color){for(let i=0;i<13;i++){const a=Math.random()*Math.PI*2;effects.push({x,y,vx:Math.cos(a)*90,vy:Math.sin(a)*90,color,life:.7})}}
function finish(win){phase="done";paused=true;updateHUD();try{let log=JSON.parse(localStorage.getItem("LEXICON_GUARDIANS_RESULTS")||"[]");log.unshift({wave,score,correct,attempts,win,date:new Date().toISOString()});localStorage.setItem("LEXICON_GUARDIANS_RESULTS",JSON.stringify(log.slice(0,25)))}catch(e){}
 overlay.hidden=false;E("modalTitle").textContent=win?"🎉 Lexica đã an toàn!":"🏰 Thành trì thất thủ";E("modalDesc").textContent="Điểm: "+score+" · Đúng "+correct+"/"+attempts+" lần.";E("modalQuestion").innerHTML='<div class="question">Chơi lại để củng cố từ vựng?</div>';E("modalFeedback").textContent="";E("closeModal").hidden=true;E("skipBtn").hidden=true;E("answerBtn").disabled=false;E("answerBtn").textContent="Chơi lại";E("answerBtn").onclick=()=>{overlay.hidden=true;paused=false;phase="study";wave=0;hp=100;mana=130;score=0;correct=0;attempts=0;seen=new Set();wrong=[];towers=[];enemies=[];shots=[];effects=[];say("Ôn 6 từ rồi xây lại thành trì.");drawCards()}}
function update(dt){if(phase!=="battle"||paused)return;clock+=dt;if(spawns<toSpawn&&clock>1.6){spawn();clock=0}
 for(let e of enemies){e.t+=dt*e.speed/37;Object.assign(e,place(e.t));e.flash=Math.max(0,e.flash-dt);if(e.t>=1){hp-=e.boss?25:12;e.hp=0;e.escaped=true}}
 for(let tower of towers){tower.clock-=dt;let target=enemies.filter(e=>e.hp>0&&Math.hypot(tower.x-e.x,tower.y-e.y)<tower.range).sort((a,b)=>b.t-a.t)[0];if(target&&tower.clock<=0){tower.clock=types[tower.type].rate;shots.push({x:tower.x,y:tower.y,target,damage:tower.damage,life:1,color:types[tower.type].icon})}}
 for(let s of shots){let dx=s.target.x-s.x,dy=s.target.y-s.y,d=Math.hypot(dx,dy);if(s.target.hp<=0){s.life=0;continue}if(d<18){s.target.hp-=s.damage;s.target.flash=.5;s.life=0;effect(s.x,s.y,"#fce3a6")}else{s.x+=dx/d*dt*550;s.y+=dy/d*dt*550;s.life-=dt}}
 shots=shots.filter(x=>x.life>0);for(let e of enemies.filter(x=>x.hp<=0&&!x.escaped)){score+=e.boss?65:12;mana+=e.boss?25:9;effect(e.x,e.y,"#e8c6ff")}enemies=enemies.filter(x=>x.hp>0);
 if(hp<=0){hp=0;finish(false)}else if(spawns>=toSpawn&&!enemies.length){mana+=25;phase="ready";if(wave>=5)finish(true);else say("Vượt đợt "+wave+"! +25 💎. Xây thêm tháp rồi bắt đầu đợt kế tiếp.")}}
function render(){
 g.fillStyle="#a6d6b2";g.fillRect(0,0,1000,610);
 for(let i=0;i<27;i++){let x=(i*139+39)%1000,y=(i*173+25)%610;g.fillStyle=i%2?"#76af94":"#c0e6b0";g.beginPath();g.ellipse(x,y,26,14,0,0,7);g.fill();if(i%3===0){g.font="23px serif";g.fillText("🌲",x-12,y+7)}}
 g.lineCap="round";g.lineJoin="round";g.beginPath();route.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokeStyle="#557e89";g.lineWidth=75;g.stroke();g.strokeStyle="#e9c49b";g.lineWidth=52;g.stroke();g.strokeStyle="#fff1cf";g.lineWidth=41;g.stroke();
 g.font="58px serif";g.fillText("🏰",923,292);
 for(let i=0;i<pads.length;i++){let [x,y]=pads[i],t=towers.find(z=>z.i===i);g.fillStyle="#638b8c";g.beginPath();g.ellipse(x,y+9,40,17,0,0,7);g.fill();g.fillStyle="#f5e7c5";g.beginPath();g.ellipse(x,y+2,34,14,0,0,7);g.fill();g.fillStyle="#5c418c";g.font="29px sans-serif";g.fillText(t?types[t.type].icon:"✦",x-14,y+6);if(t){g.font="15px sans-serif";g.fillText(t.strong?"✦✦":"✦",x-12,y-27)}}
 for(let e of enemies){g.fillStyle=e.boss?"#c17ac9":"#8178cc";g.beginPath();g.ellipse(e.x,e.y,e.boss?29:21,e.boss?27:19,0,0,7);g.fill();g.fillStyle="#fff";g.beginPath();g.arc(e.x-7,e.y-4,5,0,7);g.arc(e.x+7,e.y-4,5,0,7);g.fill();g.fillStyle="#32265e";g.beginPath();g.arc(e.x-6,e.y-4,2,0,7);g.arc(e.x+8,e.y-4,2,0,7);g.fill();g.fillStyle="#4c336f";g.fillRect(e.x-16,e.y-30,32,5);g.fillStyle="#89e4b6";g.fillRect(e.x-16,e.y-30,32*Math.max(0,e.hp/e.full),5);if(e.boss){g.font="20px serif";g.fillText("👑",e.x-14,e.y-36)}}
 for(let s of shots){g.font="21px serif";g.fillText(s.color,s.x-10,s.y+7)}
 for(let p of effects){g.globalAlpha=Math.min(1,p.life);g.fillStyle=p.color;g.beginPath();g.arc(p.x,p.y,4,0,7);g.fill()}g.globalAlpha=1;
}
function frame(now){let dt=last?Math.min(.05,(now-last)/1000):0;last=now;update(dt);for(let p of effects){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}effects=effects.filter(p=>p.life>0);render();updateHUD();requestAnimationFrame(frame)}
drawCards();say("Mở ít nhất 6 thẻ từ, xây 3 loại tháp và bảo vệ Lexica qua 5 đợt quái.");requestAnimationFrame(frame);
})();