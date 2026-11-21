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
 quill:{name:"Nỏ Lôi Điện",short:"Nỏ Sét",price:50,damage:12,range:155,rate:.52,kind:"meaning",symbol:"⚡",color:"#6be1f0",desc:"Nỏ ma thuật bắn tia điện liên tục",special:"ink"},
 spell:{name:"Trụ Tinh Thể",short:"Tinh Thể",price:75,damage:23,range:125,rate:.9,kind:"spell",symbol:"💎",color:"#b9a0ff",desc:"Tinh thể xuyên giáp bằng năng lượng",special:"pierce"},
 echo:{name:"Pháo Thiên Lôi",short:"Thiên Lôi",price:100,damage:25,range:215,rate:1.28,kind:"pronounce",symbol:"🌀",color:"#92d7ff",desc:"Pháo tầm xa đẩy lùi kẻ địch",special:"push"},
 ice:{name:"Tháp Bão Tuyết",short:"Bão Tuyết",price:120,damage:10,range:185,rate:1.1,kind:"synonym",symbol:"❄",color:"#97efff",desc:"Đóng băng và làm chậm quái vật",special:"freeze"},
 fire:{name:"Pháo Dung Nham",short:"Dung Nham",price:150,damage:39,range:145,rate:1.25,kind:"antonym",symbol:"🔥",color:"#ffad67",desc:"Pháo lửa gây sát thương thiêu đốt",special:"burn"},
 well:{name:"Lõi Năng Lượng",short:"Lõi Năng Lượng",price:90,damage:0,range:0,rate:99,kind:"meaning",symbol:"◈",color:"#ffe18d",desc:"+35 năng lượng mỗi đợt · chỉ ô lõi",special:"economy"}
};
const E_TYPES={
 shade:{name:"Tinh Linh Bóng Tối",hp:45,speed:67,damage:7,reward:8,color:"#8d72bb"},
 worm:{name:"Thú Hang",hp:95,speed:34,damage:12,reward:13,color:"#78b98b"},
 bat:{name:"Dơi Săn Đêm",hp:58,speed:92,damage:9,reward:11,color:"#7390bc"},
 spider:{name:"Nhện Khổng Lồ",hp:135,speed:45,damage:15,reward:18,color:"#9c7cb1"},
 golem:{name:"Vệ Binh Đá",hp:310,speed:24,damage:23,reward:32,color:"#b69b87"},
 boss:{name:"Chúa Tể Hắc Ám",hp:1100,speed:20,damage:40,reward:180,color:"#d5a1d9"}
};
const REALMS=[
 {id:"forest",icon:"🌲",name:"Rừng Cổ Đại",en:"ANCIENT FOREST",tag:"Cây cổ thụ · sinh vật hoang dã",sky:["#81B9BD","#D5F0D4"],ground:["#92CCA2","#5A9B87"],road:["#284F5A","#D5AA79","#F4D7A2"],accent:"#5BE2AD",monsters:["Linh Hồn Rừng","Rễ Quỷ","Dơi Rêu","Nhện Rừng","Người Cây","Thần Rừng Sa Ngã"],colors:["#9C73C5","#64A985","#618EA0","#879958","#6F9379","#D4A1CC"],route:[[-60,368],[180,368],[180,183],[393,183],[393,446],[620,446],[620,243],[850,243],[850,382],[1180,382]]},
 {id:"volcano",icon:"🌋",name:"Núi Lửa Tử Thần",en:"MOLTEN CALDERA",tag:"Dung nham · đá lửa · tro bụi",sky:["#401C36","#EB7559"],ground:["#6B3B42","#352B40"],road:["#2A2034","#93564C","#CE9473"],accent:"#FF8C5F",monsters:["Quỷ Tro","Sâu Dung Nham","Dơi Lửa","Bọ Than","Golem Nham Thạch","Rồng Núi Lửa"],colors:["#E86E6D","#E59A51","#F1C174","#B95A59","#9D635B","#FF654F"],route:[[-60,375],[175,375],[175,180],[407,180],[407,489],[657,489],[657,254],[885,254],[885,391],[1180,391]]},
 {id:"desert",icon:"🏜️",name:"Sa Mạc Hoàng Kim",en:"GOLDEN DUNES",tag:"Cồn cát · tàn tích · bão cát",sky:["#EFAF78","#F8DDAB"],ground:["#E7BB70","#CB8D5B"],road:["#A56842","#F6D399","#FFE6B8"],accent:"#FDE19E",monsters:["Hồn Cát","Bọ Cạp Cát","Dơi Sa Mạc","Nhện Kim Tự Tháp","Vệ Binh Pharaon","Vua Bão Cát"],colors:["#B781B6","#E9B85B","#CE9375","#B78D57","#D9B783","#F5C760"],route:[[-60,255],[246,255],[246,456],[530,456],[530,184],[796,184],[796,407],[1180,407]]},
 {id:"plains",icon:"🌾",name:"Đồng Bằng Gió",en:"SKYWARD PLAINS",tag:"Đồi cỏ · hoa dại · cối xay gió",sky:["#86C7E3","#E6F8DC"],ground:["#A9D99A","#73BA85"],road:["#658B71","#D7B786","#FFE0B1"],accent:"#8DE4B4",monsters:["Linh Hồn Gió","Sói Đồng Cỏ","Dơi Gió","Nhện Hoa","Cự Nhân Đồi","Long Thần Bầu Trời"],colors:["#83B5D2","#A4B878","#7DB6BA","#8DAA65","#B6A68E","#A9CBE9"],route:[[-60,355],[240,355],[240,505],[470,505],[470,235],[755,235],[755,421],[1180,421]]},
 {id:"moon",icon:"🌙",name:"Mặt Trăng Xa Xôi",en:"LUNAR OUTPOST",tag:"Miệng hố · thiên thạch · bầu trời sao",sky:["#111B3E","#374978"],ground:["#7986A4","#505F80"],road:["#3C4C72","#8A94AC","#BFC5DA"],accent:"#B3A8FF",monsters:["Bóng Phi Hành Gia","Giun Thiên Thạch","Dơi Vũ Trụ","Nhện Sao","Robot Mặt Trăng","Kẻ Nuốt Tinh Tú"],colors:["#9E8AD8","#A8B3C6","#7D97D9","#7B8FAC","#A6ACD2","#DFB5F8"],route:[[-60,281],[175,281],[175,472],[431,472],[431,181],[688,181],[688,447],[929,447],[929,308],[1180,308]]},
 {id:"glacier",icon:"❄️",name:"Băng Nguyên Vĩnh Cửu",en:"FROZEN KINGDOM",tag:"Sông băng · tuyết phủ · đỉnh băng",sky:["#72ABD2","#E4F8FF"],ground:["#B5E3F0","#7FB5D5"],road:["#5D8EB0","#AECFE2","#EBFBFF"],accent:"#A8F5FF",monsters:["Hồn Băng","Sâu Tuyết","Dơi Sương","Nhện Băng","Golem Băng","Nữ Hoàng Bão Tuyết"],colors:["#98D3E9","#86B5CE","#C0E8FB","#8FC4D9","#92B6D4","#E5F8FF"],route:[[-60,389],[163,389],[163,175],[399,175],[399,453],[663,453],[663,187],[911,187],[911,369],[1180,369]]},
 {id:"swamp",icon:"🐸",name:"Đầm Lầy Độc",en:"VENOMOUS MARSH",tag:"Nấm phát sáng · sương độc · cây khô",sky:["#385D61","#90BDA4"],ground:["#6A9B7F","#355C58"],road:["#355451","#789C81","#C0D0A1"],accent:"#B8F184",monsters:["Ma Trơi","Sâu Độc","Dơi Đầm Lầy","Nhện Nọc Độc","Golem Rêu","Quái Vương Đầm Lầy"],colors:["#89EBBD","#A1D76F","#61BC9E","#A0A76B","#759F71","#B5F3A0"],route:[[-60,235],[197,235],[197,462],[465,462],[465,216],[725,216],[725,499],[964,499],[964,326],[1180,326]]},
 {id:"islands",icon:"🏝️",name:"Quần Đảo Hải Tặc",en:"PIRATE ARCHIPELAGO",tag:"Biển sâu · đảo nổi · san hô",sky:["#71CDE1","#C5F3E9"],ground:["#C7D99E","#78BDAE"],road:["#4D8491","#D6BA91","#F9E1B2"],accent:"#70E8ED",monsters:["Ma Thủy Thủ","Cua Biển","Dơi Biển","Nhện San Hô","Golem Vỏ Sò","Kraken Đại Dương"],colors:["#74AAB8","#E29477","#8A9ABF","#E5B39F","#83B8B9","#A38BD2"],route:[[-60,343],[199,343],[199,183],[492,183],[492,453],[760,453],[760,234],[973,234],[973,364],[1180,364]]},
 {id:"cyber",icon:"🌃",name:"Thành Phố Neon",en:"NEON CITADEL",tag:"Đường điện tử · robot · công nghệ tương lai",sky:["#101734","#3D3274"],ground:["#293459","#182444"],road:["#19223B","#3D5B80","#8AA9CF"],accent:"#56F7F0",monsters:["Bóng Kỹ Thuật Số","Robot Bò","Drone Chiến Đấu","Spider Bot","Mech Hộ Vệ","AI Hủy Diệt"],colors:["#6F82EE","#5FB3E4","#A488EC","#59D4E3","#7586BE","#E47CF0"],route:[[-60,368],[228,368],[228,206],[469,206],[469,470],[716,470],[716,203],[947,203],[947,361],[1180,361]]},
 {id:"crystal",icon:"💎",name:"Thung Lũng Pha Lê",en:"CRYSTAL SANCTUARY",tag:"Tinh thể cổ · đá quý · ma thuật",sky:["#7B83C6","#D5B9EA"],ground:["#A4A0D4","#7778BD"],road:["#6B648E","#C3A6CA","#F2D8E5"],accent:"#F4ACFF",monsters:["Linh Hồn Pha Lê","Thú Amethyst","Dơi Tinh Thể","Nhện Ruby","Golem Thạch Anh","Rồng Tinh Thạch"],colors:["#D6A4F1","#C4A0ED","#8D9CE6","#EF9EBE","#A9A9E8","#F7B4F4"],route:[[-60,288],[230,288],[230,490],[510,490],[510,181],[769,181],[769,406],[996,406],[996,323],[1180,323]]}
];
let realmIndex=0;
const realm=()=>REALMS[realmIndex];
let paths=REALMS[0].route.map(v=>[...v]);
let pads=[];
let polyline=[],totalLength=0;
function buildPath(){
 polyline=[];totalLength=0;
 for(let i=0;i<paths.length-1;i++){
  const a=paths[i],b=paths[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
  polyline.push({a,b,len,from:totalLength});totalLength+=len;
 }
}
function coordAt(d){
 d=clamp(d,0,totalLength);
 for(const p of polyline){
  if(d<=p.from+p.len){const t=(d-p.from)/p.len;return {x:p.a[0]*(1-t)+p.b[0]*t,y:p.a[1]*(1-t)+p.b[1]*t}}
 }
 const end=paths[paths.length-1];return {x:end[0],y:end[1]};
}
function distanceToRoute(x,y){
 let dist=Infinity;
 for(const seg of polyline){
  const [ax,ay]=seg.a,[bx,by]=seg.b;
  const dx=bx-ax,dy=by-ay;
  const t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);
  dist=Math.min(dist,Math.hypot(x-(ax+t*dx),y-(ay+t*dy)));
 }
 return dist;
}
function choosePads(){
 const candidates=[];
 for(let row=0;row<9;row++)for(let col=0;col<13;col++){
  const x=83+col*79+(row%2)*14,y=94+row*57;
  if(distanceToRoute(x,y)>94&&x<1050&&y<595){
   const key=(row*43+col*73+realmIndex*37)%117;
   candidates.push({x,y,rank:key});
  }
 }
 candidates.sort((a,b)=>a.rank-b.rank);
 const out=[];
 for(const p of candidates){
  if(out.every(q=>Math.hypot(q.x-p.x,q.y-p.y)>111))out.push(p);
  if(out.length===12)break;
 }
 if(out.length<12)for(const p of candidates){if(out.some(q=>q===p))continue;if(out.every(q=>Math.hypot(q.x-p.x,q.y-p.y)>75))out.push(p);if(out.length===12)break}
 // Keep 12 strategic platforms: pad 6 provides income and pad 11 unlocks later.
 return out.slice(0,12).map((p,i)=>({x:p.x,y:p.y,type:i===6?"well":i===11?"locked":i%5===1?"hill":i%5===3?"water":"stone"}));
}
buildPath();pads=choosePads();
const S={phase:"study",paused:false,speed:1,wave:0,maxWave:5,health:100,ink:220,score:0,combo:0,correct:0,attempts:0,studyIndex:0,studySet:words.slice(0,10),seen:new Set(),selectedType:"quill",selectedPad:null,towers:[],enemies:[],bullets:[],fx:[],floating:[],misses:[],nextEnemyId:1,spawned:0,targetSpawn:0,spawnClock:0,reviewQueue:[],last:0,time:0,challengeLock:false,sound:true,finished:false,progressWave:0};
const recordKey="LEXICON_GUARDIANS_V3_RESULTS";
const DIFFICULTIES={
 easy:{name:"🌿 Dễ",ink:340,hp:100,enemyHp:.72,enemySpeed:.83,enemyCount:.76,enemyDamage:.72,bonus:1.25},
 hard:{name:"⚔️ Khó",ink:240,hp:100,enemyHp:1.1,enemySpeed:1.07,enemyCount:1.10,enemyDamage:1.12,bonus:1},
 hell:{name:"🔥 Địa ngục",ink:170,hp:80,enemyHp:1.8,enemySpeed:1.28,enemyCount:1.42,enemyDamage:1.65,bonus:.75}
};
let difficulty="easy",menuPad=null;
/* Realm gallery: all ten maps can be played, each with a distinct route. */
function realmPreview(r){
 const path=r.route.map(([x,y])=>((x+60)/1240*200).toFixed(1)+","+((y-32)/596*100).toFixed(1)).join(" ");
 const sky=r.sky[0],ground=r.ground[0],road=r.road[2],outline=r.road[0];
 const stars=["moon","cyber","crystal"].includes(r.id);
 const decor=stars
  ? '<circle cx="166" cy="22" r="15" fill="#FFFFFF66"/><circle cx="42" cy="17" r="2" fill="#FFFFFF"/><circle cx="132" cy="13" r="2" fill="#FFFFFF"/>'
  : '<ellipse cx="164" cy="16" rx="22" ry="9" fill="#FFFFFF77"/><ellipse cx="40" cy="19" rx="31" ry="8" fill="#FFFFFF55"/>';
 const landscape=r.id==="volcano"
  ? '<path d="M118 56 149 10 182 56Z" fill="#503341"/><path d="M142 22 149 10 156 22Z" fill="#FF9254"/>'
  :r.id==="desert"
  ? '<path d="M119 52 153 17 188 52Z" fill="#D39A56"/><path d="M153 17 188 52 153 52Z" fill="#F6D494"/>'
  :r.id==="moon"
  ? '<circle cx="151" cy="38" r="22" fill="#AEB9CF"/><circle cx="141" cy="32" r="6" fill="#7F93B4"/>'
  :r.id==="glacier"
  ? '<path d="M116 56 141 8 161 53 171 23 191 56Z" fill="#DFF7FE"/>'
  :r.id==="cyber"
  ? '<path d="M123 55V21h14v34h6V9h17v46h8V24h19v31Z" fill="#354C8C"/><path d="M129 28h6m18-9h5m0 10h5m13 4h6" stroke="#60F8EA" stroke-width="2"/>'
  :r.id==="crystal"
  ? '<path d="m118 55 11-40 13 40 12-51 17 51 12-32 9 32" fill="#D1B5F4"/>'
  :r.id==="islands"
  ? '<path d="M122 54q22-23 63 0Z" fill="#F5D39A"/><path d="M151 45V20m0 0q25-12 30 5m-30-5q-29-9-35 5" stroke="#438D83" stroke-width="5" fill="none"/>'
  :r.id==="swamp"
  ? '<path d="M137 56V23m-11 5q10-18 22 0m-21 2q-22-10-28 3" stroke="#2E6A65" stroke-width="7" fill="none"/>'
  :r.id==="plains"
  ? '<path d="M153 55V18m-19 19 38-38m-38 0 38 38" stroke="#E3F2D2" stroke-width="6"/>'
  :'<path d="M155 55V20m-27 14q20-52 53 0" stroke="#317D6D" stroke-width="11" fill="none"/>';
 return '<svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="200" height="100" fill="'+sky+'"/>'+decor+'<path d="M0 39 43 24 97 36 145 24 200 41V100H0Z" fill="'+ground+'"/>'+landscape+'<polyline points="'+path+'" fill="none" stroke="'+outline+'" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/><polyline points="'+path+'" fill="none" stroke="'+road+'" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="194" cy="'+((r.route[r.route.length-1][1]-32)/596*100).toFixed(1)+'" r="5" fill="'+r.accent+'"/></svg>';
}
function renderRealmGallery(){
 const box=$("realmGrid");if(!box)return;
 box.innerHTML=REALMS.map((r,i)=>'<button type="button" class="realm-option '+(i===realmIndex?'active':'')+'" data-realm="'+i+'" aria-pressed="'+(i===realmIndex)+'" style="--realm-accent:'+r.accent+';--realm-sky:'+r.sky[0]+';--realm-ground:'+r.ground[0]+'"><span class="realm-option-scene">'+realmPreview(r)+'<span class="realm-option-art">'+r.icon+'</span><span class="realm-option-number">'+String(i+1).padStart(2,"0")+'</span></span><span class="realm-option-name">'+r.name+'</span><small>'+r.tag+'</small></button>').join("");
 box.querySelectorAll("[data-realm]").forEach(button=>button.addEventListener("click",()=>{
  const i=Number(button.dataset.realm);
  if(i===realmIndex)return;
  if((S.phase==="battle"||S.towers.length||S.wave>0||S.seen.size>0)&&!confirm("Chuyển bản đồ sẽ bắt đầu ván mới, tiến độ lượt chơi hiện tại sẽ được đặt lại. Tiếp tục?"))return;
  chooseRealm(i);
  restart();
 }));
}
function chooseRealm(index){
 realmIndex=Math.max(0,Math.min(REALMS.length-1,index));
 const r=realm();
 try{localStorage.setItem("LEXICON_GUARDIANS_SELECTED_REALM",r.id)}catch(_){ }
 paths=r.route.map(point=>[...point]);buildPath();pads=choosePads();
 const types=["shade","worm","bat","spider","golem","boss"];
 types.forEach((key,i)=>{E_TYPES[key].name=r.monsters[i];E_TYPES[key].color=r.colors[i]});
 $("realmTag").textContent=r.icon+" "+r.name;
 $("chapterLabel").textContent="WORLD "+String(realmIndex+1).padStart(2,"0")+" · "+r.en;
 $("arenaBiome").textContent=r.en;
 $("arenaMapTitle").textContent=r.icon+" "+r.name;
 $("realmCounter").textContent=String(realmIndex+1).padStart(2,"0")+" / 10";
 renderRealmGallery();
 log("🌍 "+r.name+" — "+r.tag+". Ôn từ để chuẩn bị phòng thủ.");
}

const mode=()=>DIFFICULTIES[difficulty];
function showMode(){document.querySelectorAll("[data-difficulty]").forEach(b=>{b.classList.toggle("active",b.dataset.difficulty===difficulty);b.setAttribute("aria-pressed",String(b.dataset.difficulty===difficulty))});$("difficultyBadge").textContent=mode().name}
document.querySelectorAll("[data-difficulty]").forEach(b=>b.onclick=()=>{if(S.phase==="battle")return;difficulty=b.dataset.difficulty;restart();showMode()});
let hoverPad=-1;
let tutorialOpen=true;
const hoverTip=$("padHoverTip");
const tutorial=$("lexTutorial");
let wizardStage="guide";
const WIZARD_STAGES=["guide","difficulty","map","study","play"];
function mountWizard(){
 const map=document.querySelector(".realm-selector");
 const study=document.querySelector(".grimoire-panel");
 const difficulties=$("difficultyPicker");
 if(map)$("wizardMapMount").append(map);
 if(study)$("wizardStudyMount").append(study);
 if(difficulties)$("wizardDifficultyMount").append(difficulties);
 $("wizardGuideNext").onclick=()=>showWizardStage("difficulty");
 $("wizardDifficultyNext").onclick=()=>showWizardStage("map");
 $("wizardMapNext").onclick=()=>showWizardStage("study");
 $("wizardStartBattle").onclick=()=>{
  if(S.seen.size<Math.min(8,S.studySet.length))return;
  showWizardStage("play");
 };
 document.querySelectorAll("[data-wizard-back]").forEach(button=>{
  button.onclick=()=>showWizardStage(button.dataset.wizardBack);
 });
 $("wizardEditSetup").onclick=()=>{
  if((S.phase==="battle"||S.wave>0||S.towers.length)&&!confirm("Đổi bản đồ sẽ đặt lại trận đấu hiện tại. Tiếp tục?"))return;
  restart();showWizardStage("map");
 };
 showWizardStage("guide");
}
function updateWizardStudyButton(){
 const btn=$("wizardStartBattle");if(!btn)return;
 const required=Math.min(8,S.studySet.length),ready=S.seen.size>=required;
 btn.disabled=!ready;
 btn.textContent=ready?"⚔ Vào chiến trường →":"🔒 Học thêm "+(required-S.seen.size)+" từ để vào trận";
}
function showWizardStage(stage){
 if(!WIZARD_STAGES.includes(stage))return;
 wizardStage=stage;
 const inBattle=stage==="play";
 $("lexWizard").hidden=inBattle;
 $("lexBattleScreen").hidden=!inBattle;
 for(const k of ["guide","difficulty","map","study"]){
  const section=$("lex"+k[0].toUpperCase()+k.slice(1));
  section.hidden=k!==stage;
 }
 document.querySelectorAll("[data-track]").forEach(el=>{
  const step=WIZARD_STAGES.indexOf(el.dataset.track);
  el.classList.toggle("active",el.dataset.track===stage);
  el.classList.toggle("complete",step<WIZARD_STAGES.indexOf(stage));
  el.setAttribute("aria-current",el.dataset.track===stage?"step":"false");
 });
 if(stage==="study")updateWizardStudyButton();
 if(stage==="play"){
  if(S.phase==="study"&&S.seen.size>=Math.min(8,S.studySet.length))S.phase="build";
  updateHUD();
  log("🏰 Chọn bệ trống, xây tháp và chuẩn bị cho đợt quái đầu tiên.");
 }
 if(stage!=="play"){clearPadHover();menuPad=null;renderArsenal();renderSelected()}
 window.scrollTo({top:0,behavior:"instant"});
}

function padAtPoint(x,y){let index=-1,best=Infinity;pads.forEach((pad,i)=>{const d=Math.hypot(x-pad.x,y-pad.y);if(d<best){best=d;index=i}});return best<=53?index:-1}
function canvasCoords(event){const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left)*canvas.width/r.width,y:(event.clientY-r.top)*canvas.height/r.height}}
function setPadHover(event){if(tutorialOpen||S.challengeLock){clearPadHover();return}const pos=canvasCoords(event),i=padAtPoint(pos.x,pos.y);hoverPad=i;canvas.classList.toggle("pad-interactive",i>=0);if(i<0){hoverTip.hidden=true;return}const pad=pads[i],tower=S.towers.find(t=>t.pad===i);hoverTip.textContent=S.phase==="study"?"📖 Lật 8 thẻ để mở khóa":tower?"✦ Bấm để nâng cấp / bán tháp":pad.type==="locked"?"🔒 Bấm để giải mã bệ":"✦ Bấm để xây tháp";hoverTip.hidden=false;hoverTip.style.left=(pad.x/canvas.width*100)+"%";hoverTip.style.top=(pad.y/canvas.height*100)+"%";}
function clearPadHover(){hoverPad=-1;canvas.classList.remove("pad-interactive");hoverTip.hidden=true}
function openTutorial(){tutorialOpen=true;tutorial.hidden=false;S.paused=true;clearPadHover();$("lexTutorialStart").focus()}
function closeTutorial(){tutorialOpen=false;tutorial.hidden=true;S.paused=false;showMode()}
$("lexTutorialStart").addEventListener("click",closeTutorial);
$("lexTutorialHelp").addEventListener("click",()=>{tutorial.querySelector(".lex-tutorial-steps").scrollIntoView({block:"nearest",behavior:"smooth"})});
canvas.addEventListener("pointermove",setPadHover);
canvas.addEventListener("pointerleave",clearPadHover);
canvas.addEventListener("pointercancel",clearPadHover);
canvas.addEventListener("focusout",clearPadHover);
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
$("hpText").textContent=Math.max(0,Math.ceil(S.health))+" / "+mode().hp;$("hpFill").style.width=clamp(100*S.health/mode().hp,0,100)+"%";
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
if(S.phase==="study"&&S.seen.size>=Math.min(8,S.studySet.length)){S.phase="build";announce("SÁCH PHÉP ĐÃ THỨC TỈNH");log("✨ Sẵn sàng vào trận. Hãy xây tháp ở các bệ trống.");updateHUD()}updateWizardStudyButton()
}
$("flipCardBtn").onclick=flipCard;
$("prevWord").onclick=()=>{S.studyIndex=(S.studyIndex-1+S.studySet.length)%S.studySet.length;showWord()};
$("nextWord").onclick=()=>{S.studyIndex=(S.studyIndex+1)%S.studySet.length;showWord()};
$("pronounceBtn").onclick=()=>speak(S.studySet[S.studyIndex].word);
$("soundBtn").onclick=()=>{S.sound=!S.sound;$("soundBtn").textContent=S.sound?"🔊":"🔇"};
$("helpBtn").onclick=()=>{if(!modalActive)openTutorial()};
function renderArsenal(){
$("arsenalPanel").hidden=menuPad===null||!!S.towers.find(t=>t.pad===menuPad);
if(menuPad===null||S.towers.find(t=>t.pad===menuPad))return;
$("buildSlotName").textContent="Bệ #"+(menuPad+1);
gamePanel.innerHTML=Object.entries(TOWERS).map(([id,t])=>'<button type="button" data-type="'+id+'" class="tower-choice '+(S.selectedType===id?"selected":"")+'"><span class="tower-art" style="color:'+t.color+'">'+t.symbol+'</span><span><strong>'+t.name+'</strong><small>'+t.desc+'</small></span><b>🖋️ '+t.price+'</b></button>').join("");
gamePanel.querySelectorAll("[data-type]").forEach(b=>b.onclick=()=>{S.selectedType=b.dataset.type;build(menuPad)});
}
function selectedTower(){return S.towers.find(t=>t.pad===S.selectedPad)}
function upgradeCost(t){return Math.round(TOWERS[t.type].price*(t.level===1?.8:1.15))}
function renderSelected(){
const t=selectedTower();$("selectedPanel").hidden=!(menuPad!==null&&t);const pad=S.selectedPad===null?null:pads[S.selectedPad];
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
$("sellBtn").onclick=()=>{const t=selectedTower();if(!t)return;S.ink+=Math.floor(.7*t.spent);S.towers=S.towers.filter(a=>a!==t);addFX(t.x,t.y,"#f7d8a9",16);log("Đã bán tháp và hoàn 70% Mực Phép.");renderSelected();renderArsenal();updateHUD()};
$("closeSelectionBtn").onclick=()=>{menuPad=null;S.selectedPad=null;renderSelected();renderArsenal()};
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
if(pad.type==="locked"){quiz(randWord(),"spell",good=>{if(good){pad.type="stone";addFX(pad.x,pad.y,"#ffe9a0",32);log("🔓 Đã mở bệ bí mật! Chọn loại tháp để xây.");renderArsenal()}else log("Bệ bí mật chưa mở. Thử lại để giải mã.");renderSelected()});return}
if(!canBuildOn(S.selectedType,pad)){log(pad.type==="well"?"Giếng Mực chỉ cho phép xây Tháp Giếng Mực.":"Tháp Giếng Mực chỉ được xây trên ô Giếng.");return}
if(S.ink<def.price){log("Chưa đủ "+def.price+" Mực Phép để xây tháp này.");return}
const type=S.selectedType,challengeWord=randWord();
quiz(challengeWord,def.kind,(good,cancelled)=>{
if(cancelled)return;
S.ink-=def.price;S.towers.push({pad:i,type,x:pad.x,y:pad.y,level:1,spent:def.price,faded:!good,word:challengeWord,cooldown:rnd(0,.5),aim:0,glow:0});menuPad=i;
addFX(pad.x,pad.y,good?"#fff4b8":"#c7c0d9",35);floater(pad.x,pad.y,good?"✨ SUMMON!":"🌫 THÁP MỜ");log(good?"Triệu hồi thành công "+def.name+"!":"Trả lời chưa đúng: tháp Mờ chỉ có 30% sức mạnh. Chạm tháp và nhấn Sửa.");renderSelected();renderArsenal();updateHUD();
});
}
canvas.addEventListener("click",event=>{
if(tutorialOpen||S.challengeLock)return;
const {x,y}=canvasCoords(event),index=padAtPoint(x,y);
if(index>=0){menuPad=index;S.selectedPad=index;if(pads[index].type==="locked")build(index);else{renderSelected();renderArsenal();log(selectedTower()?"Chọn nâng cấp, sửa hoặc bán tháp.":"Chọn loại tháp để xây trên bệ #"+(index+1)+".")}}else{menuPad=null;S.selectedPad=null;renderSelected();renderArsenal()}
});
$("waveBtn").onclick=()=>startWave();
function startWave(){
if(S.phase!=="build"||!S.towers.some(t=>TOWERS[t.type].damage>0))return;
S.phase="battle";S.paused=false;S.wave++;S.spawned=0;S.spawnClock=0;S.targetSpawn=Math.round((8+S.wave*3)*mode().enemyCount);S.progressWave=0;
announce(S.wave===5?"FINAL WAVE · VUA QUÊN LÃNG":"WAVE "+S.wave+" · "+mode().name);
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
const def=E_TYPES[type],scale=(1+(S.wave-1)*.16)*mode().enemyHp,full=Math.round(def.hp*scale);
S.enemies.push({id,type,boss:last||!!word,word,distance:0,x:paths[0][0],y:paths[0][1],hp:full,maxHp:full,speed:def.speed*(last?.70:1)*mode().enemySpeed,slow:0,freeze:0,burn:0,hit:0,stun:0,seed:rnd(0,6),escaped:false});
S.spawned++;
}
function defeat(enemy){
if(enemy.escaped)return;const reward=Math.round((enemy.boss?55:E_TYPES[enemy.type].reward)*mode().bonus);
S.ink+=reward;S.score+=reward*2;floater(enemy.x,enemy.y,"+"+reward+" 🖋️","#ffe39d");addFX(enemy.x,enemy.y,enemy.boss?"#f7b9f9":"#bdf6d9",18);sound(520,.07);
}
function update(dt){
if(S.phase!=="battle"||S.paused||S.challengeLock)return;
S.spawnClock+=dt;
const cadence=Math.max(.35,(1.1-S.wave*.065)/mode().enemyCount);
if(S.spawned<S.targetSpawn&&S.spawnClock>=cadence){spawn();S.spawnClock-=cadence}
for(const e of S.enemies){
e.hit=Math.max(0,e.hit-dt*4);e.freeze=Math.max(0,e.freeze-dt);e.slow=Math.max(0,e.slow-dt);e.stun=Math.max(0,e.stun-dt);
const speed=e.stun>0?0:e.freeze>0?0:e.slow>0?e.speed*.46:e.speed;
e.distance+=speed*dt;const p=coordAt(e.distance);e.x=p.x;e.y=p.y;
if(e.burn>0){e.hp-=11*dt;e.burn=Math.max(0,e.burn-dt)}
if(e.distance>=totalLength){e.escaped=true;e.hp=0;S.health-=E_TYPES[e.type].damage*(e.boss?1.3:1)*mode().enemyDamage;addFX(paths[paths.length-1][0]-80,paths[paths.length-1][1],"#fdaf89",22);log("💔 Quái lọt vào thành! Hãy thay đổi chiến thuật tháp.")}
}
for(const tower of S.towers){
const def=TOWERS[tower.type];if(def.damage===0)continue;tower.cooldown-=dt;tower.glow=Math.max(0,tower.glow-dt*2);
let range=def.range*(pads[tower.pad].type==="hill"?1.25:1)*(1+(tower.level-1)*.12);
let candidates=S.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-tower.x,e.y-tower.y)<range).sort((a,b)=>b.distance-a.distance);
if(candidates.length&&tower.cooldown<=0){
const target=candidates[0],rate=def.rate/(1+.21*(tower.level-1));tower.cooldown=rate;tower.aim=Math.atan2(target.y-tower.y,target.x-tower.x);tower.glow=1;
let damage=def.damage*(tower.faded?.30:1)*(1+(tower.level-1)*.75)*(pads[tower.pad].type==="water"?1.2:1);
const resonance=S.towers.some(other=>other!==tower&&((tower.type==="ice"&&other.type==="fire")||(tower.type==="fire"&&other.type==="ice"))&&Math.hypot(other.x-tower.x,other.y-tower.y)<260);
if(resonance)damage*=1.2;
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
S.ink+=Math.round(35*mode().bonus);S.phase="build";S.paused=false;S.score+=120*S.wave;
if(S.wave===S.maxWave){finish(true);return}
announce("WAVE "+S.wave+" CLEARED");
log("🌟 Qua đợt "+S.wave+"! Nhận Mực Phép. Nâng cấp tháp hoặc bán 70% để thay đổi chiến thuật.");
}
}
function saveResult(win){
try{const arr=JSON.parse(localStorage.getItem(recordKey)||"[]");arr.unshift({time:new Date().toISOString(),win,mapId:realm().id,mapName:realm().name,difficulty,score:S.score,wave:S.wave,accuracy:S.attempts?Math.round(100*S.correct/S.attempts):0,wrong:[...new Set(S.misses.map(a=>a.word.word))]});localStorage.setItem(recordKey,JSON.stringify(arr.slice(0,30)))}catch{}
}
function finish(win){
S.phase="done";S.finished=true;saveResult(win);sound(win?880:190,.32);
$("modal").hidden=false;S.challengeLock=true;modalActive=true;
$("modalKicker").textContent=win?"KINGDOM SAVED":"THE KINGDOM NEEDS YOU";
$("modalTitle").textContent=win?"🏆 Lexica đã được cứu!":"🏰 Cổ Thành thất thủ";
$("modalDesc").textContent=realm().icon+" "+realm().name+" · Hoàn thành "+S.wave+"/5 đợt · "+S.score.toLocaleString("vi-VN")+" điểm · Chính xác "+(S.attempts?Math.round(100*S.correct/S.attempts):0)+"%.";
$("modalQuestion").innerHTML='<div class="prompt">Mỗi lần chơi lại là một lần ghi nhớ từ vựng tốt hơn. Hãy thử chiến thuật mới!</div>';
$("modalFeedback").innerHTML="";$("skipBtn").hidden=true;$("closeModal").hidden=true;$("answerBtn").disabled=false;$("answerBtn").textContent="↻ Chơi lại";
$("answerBtn").onclick=()=>{modalClose();restart();showWizardStage("guide")};
}
function restart(){
Object.assign(S,{phase:"study",paused:false,speed:1,wave:0,health:mode().hp,ink:mode().ink,score:0,combo:0,correct:0,attempts:0,studyIndex:0,studySet:shuffle(words).slice(0,10),seen:new Set(),selectedType:"quill",selectedPad:null,towers:[],enemies:[],bullets:[],fx:[],floating:[],misses:[],spawned:0,targetSpawn:0,spawnClock:0,reviewQueue:[],finished:false,challengeLock:false});
if(pads[11])pads[11].type="locked";menuPad=null;showWord();renderArsenal();renderSelected();showMode();log("Lật 8 thẻ Sách Phép, rồi xây tháp chuẩn bị cho 5 đợt quái.");updateHUD();
}
$("restartBtn").onclick=()=>{if(S.phase==="battle"&&!confirm("Bắt đầu lại sẽ xóa tiến độ ván chơi hiện tại. Tiếp tục?"))return;restart();showWizardStage("guide")};
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

/* Ten hand-art-directed canvas environments: scenery is decorative; battle
   paths/pads and vocabulary challenge calculations use the same game logic. */
function polyMountain(cx,cy,width,height,base,shine){
 polygon([[cx-width*.64,cy],[cx,cy-height],[cx+width*.66,cy]],base);
 polygon([[cx,cy-height],[cx+width*.2,cy-height*.27],[cx,cy]],shine);
}
function feature(x,y,kind,scale=1){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 const r=realm();
 if(kind==="forest"){
  ellipse(0,13,31,9,"#183F3A40");polygon([[-5,12],[7,12],[5,-35],[-5,-35]],"#6C524A");
  for(const [dx,dy,rad] of [[-15,-39,21],[16,-44,22],[0,-59,25]]){
   ellipse(dx+3,dy+4,rad+3,rad*.8,"#286C61");
   ellipse(dx,dy,rad,rad*.86,"#459C7B");ellipse(dx-6,dy-6,rad*.5,rad*.35,"#87D4A1");
  }
 }else if(kind==="volcano"){
  polyMountain(0,16,140,100,"#563945","#83616A");
  polygon([[-14,-75],[8,-75],[18,-46],[-22,-42]],"#FF7E46");
  for(let i=0;i<3;i++)ellipse(Math.sin(S.time*.6+i)*14-6,-92-i*24,18+i*8,12,"#FFE2AC3A");
  line([[-15,-48],[-10,-5],[0,15]],"#FF9D4E",7);
 }else if(kind==="desert"){
  polygon([[-57,19],[0,-50],[58,19]],"#C99152");
  polygon([[0,-50],[58,19],[0,19]],"#EAC48A");
  polygon([[-29,18],[0,-20],[29,18]],"#B87D51");
 }else if(kind==="plains"){
  polygon([[-9,28],[-8,-48],[8,-48],[10,28]],"#E1D7B5");
  polygon([[-18,-45],[0,-60],[18,-45]],"#C88761");
  for(let j=0;j<4;j++){const q=S.time*.16+j*Math.PI/2;line([[0,-42],[Math.cos(q)*34,-42+Math.sin(q)*34]],"#FFF2D5",8)}
  ellipse(0,27,20,6,"#4F9F8260");
 }else if(kind==="moon"){
  ellipse(0,7,55,18,"#27345299");ellipse(0,2,48,15,"#8E9AB3");
  ellipse(-13,-1,17,7,"#596D92");ellipse(13,9,11,4,"#566B93");
  ellipse(8,-11,14,4,"#DBE5F0");
 }else if(kind==="glacier"){
  polygon([[-33,25],[3,-81],[29,25]],"#B3E3F3");
  polygon([[3,-81],[29,25],[4,23]],"#77BFD5");
  polygon([[-15,20],[-3,-45],[4,20]],"#EDFDFD");
 }else if(kind==="swamp"){
  ellipse(0,23,46,14,"#204E5380");
  polygon([[-5,18],[8,18],[5,-39],[-3,-39]],"#584D56");
  ellipse(1,-42,28,14,"#BD5D8C");ellipse(1,-52,23,14,"#EB9EBB");
  for(let j=-1;j<=1;j++)ellipse(j*13,-47,3,5,"#FFF7B7");
 }else if(kind==="islands"){
  ellipse(0,14,57,17,"#438EA4");ellipse(0,4,41,14,"#F5D49E");
  polygon([[0,8],[7,9],[15,-62],[6,-64]],"#9E714C");
  for(let i=-2;i<=2;i++)ellipse(i*14,-64+Math.abs(i)*8,19,6,"#3CA596");
 }else if(kind==="cyber"){
  for(let i=-2;i<=2;i++){const h=50+(i*i*13)%57;ctx.fillStyle=i%2?"#344B81":"#425EA1";rounded(i*22-10,-h,19,h+18,3);ctx.fill()}
  for(let i=-2;i<=2;i++)for(let j=0;j<3;j++)ellipse(i*22-2,-18-j*17,3,3,"#55EDE9");
  line([[-54,19],[54,19]],"#49ECDD",3);
 }else if(kind==="crystal"){
  for(let i=-2;i<=2;i++){let w=14+Math.abs(i%2)*6,h=68-Math.abs(i)*16;
   polygon([[i*24-w,20],[i*24,-h],[i*24+w,20]],i%2?"#D9A8F5":"#9A9FEC");
   polygon([[i*24,-h],[i*24+w,20],[i*24,20]],"#FFFFFF60");
  }
 }
 ctx.restore();
}
function drawBackdrop(){
 const r=realm();
 const grad=ctx.createLinearGradient(0,0,0,660);
 grad.addColorStop(0,r.sky[0]);grad.addColorStop(1,r.sky[1]);
 ctx.fillStyle=grad;ctx.fillRect(0,0,1120,660);
 if(["moon","cyber","crystal"].includes(r.id)){
  for(let i=0;i<80;i++){
   const x=(i*173+43)%1120,y=(i*109+17)%440;
   ellipse(x,y,i%9===0?2.5:1.1,i%9===0?2.5:1.1,i%5===0?r.accent+"B0":"#FFFFFF80");
  }
 }else{
  for(let i=0;i<7;i++){
   const x=(i*218+Math.sin(S.time*.075+i)*18)%1320-70,y=38+i%3*33;
   ellipse(x,y,84,17,"#FFFFFF40");ellipse(x+44,y-10,55,20,"#FFFFFF27");
  }
 }
 if(r.id==="moon"){ellipse(966,115,104,104,"#D8DFF0");ellipse(941,103,18,10,"#A9B5CE");ellipse(997,144,30,18,"#B3C0D9")}
 else if(r.id==="cyber"){ellipse(956,111,72,72,"#E37BED40");strokeCircle(956,111,57,"#EF9FEC",3)}
 else if(r.id==="volcano"){ellipse(995,104,76,76,"#FFB36C78");ellipse(995,104,51,51,"#FFE4AC77")}
 else if(r.id==="desert"){ellipse(968,112,85,85,"#FFE6A299");ellipse(968,112,60,60,"#FFEFC6")}
 else if(r.id==="crystal"){ellipse(952,109,74,74,"#FFE0F5AA")}
 else {ellipse(997,105,73,73,"#FFF1C48A");ellipse(997,105,49,49,"#FFF5C8B7")}
 const mountain=["moon","cyber","volcano","glacier","crystal"].includes(r.id);
 for(let i=0;i<7;i++){
  const x=i*200-90,w=280+i%3*40,h=(mountain?110:70)+i%3*26;
  polyMountain(x,240,w,h,r.ground[1]+"88",r.ground[0]+"88");
 }
}
function drawIsland(){
 const r=realm(),y=Math.sin(S.time*.25)*1.1;
 const top=[[17,153+y],[135,99+y],[370,130+y],[575,107+y],[855,102+y],[1098,157+y],[1087,552+y],[912,585+y],[660,559+y],[452,603+y],[177,568+y],[31,538+y]];
 const low=top.map(([x,v])=>[x,v+30]);
 polygon(low,r.ground[1]);polygon(top,r.ground[0]);
 const grad=ctx.createLinearGradient(0,112,0,640);
 grad.addColorStop(0,r.ground[0]+"F0");grad.addColorStop(1,r.ground[1]+"F7");
 polygon([[31,167],[142,120],[372,151],[583,124],[859,129],[1072,176],[1056,533],[901,557],[665,532],[451,579],[194,538],[48,512]],grad);
 for(let i=0;i<28;i++){
  let x=57+(i*173)%1020,y=149+(i*107)%400;
  ellipse(x,y,18+i%4*7,6,r.id==="moon"?"#2C40632B":r.id==="cyber"?"#182B5666":"#295E5A1A");
 }
}
function drawWater(){
 const r=realm();
 if(r.id==="islands"){
  polygon([[0,470],[178,441],[343,511],[503,548],[611,660],[0,660]],"#3BABC2");
  polygon([[880,79],[1080,70],[1120,146],[1120,450],[1040,412],[939,308]],"#6DD1D4AA");
 }else if(r.id==="volcano"){
  polygon([[0,491],[152,508],[332,570],[450,660],[0,660]],"#63243A");
  for(let i=0;i<7;i++)line([[i*59,545+i%3*18],[i*59+60,551+i%3*18]],i%2?"#FFC06A":"#FF764C",9);
 }else if(r.id==="swamp"){
  polygon([[0,501],[140,477],[259,538],[371,561],[456,660],[0,660]],"#416F70");
 }else if(r.id==="glacier"){
  polygon([[0,525],[176,496],[367,569],[445,660],[0,660]],"#74CDE0");
 }else if(r.id==="moon"){
  polygon([[0,540],[140,522],[315,568],[410,660],[0,660]],"#657490");
 }else if(r.id==="cyber"){
  polygon([[0,520],[217,507],[370,583],[420,660],[0,660]],"#111E3B");
  for(let i=0;i<11;i++)line([[i*47,546+i%4*23],[i*47+30,546+i%4*23]],"#48E5EE66",2);
 }else if(r.id==="desert"){
  polygon([[0,550],[170,514],[335,565],[460,660],[0,660]],"#F3D28F");
 }else{
  polygon([[0,526],[120,503],[226,527],[350,553],[435,660],[0,660]],r.id==="crystal"?"#797AC2":r.id==="plains"?"#6ABEB0":"#63B0BB");
 }
 for(let i=0;i<12;i++){
  const x=(i*49+Math.sin(S.time*.65+i)*7)%430,y=565+i%4*23;
  line([[x,y],[x+22,y-2]],r.id==="volcano"?"#FFB47F77":"#D8FAE766",2);
 }
}
function drawPath(){
 const r=realm();
 line(paths,r.road[0],82);line(paths,r.road[1],69);line(paths,r.road[2],54);
 ctx.setLineDash([5,16]);line(paths,r.id==="cyber"?"#5BFCF6A0":"#FFF7DDB0",3);ctx.setLineDash([]);
 for(let d=29;d<totalLength;d+=33){const q=coordAt(d);ellipse(q.x,q.y,2.1,2.1,r.road[0]+"87")}
}
function drawStructures(){
 const id=realm().id;
 const spots=[[70,218,.62],[98,484,.64],[325,531,.56],[336,131,.59],[480,110,.42],[711,116,.59],[907,538,.62],[1022,226,.56],[960,466,.57],[63,339,.48],[736,574,.46]];
 if(id==="forest"||id==="plains"||id==="swamp"){
  for(const [x,y,n] of spots){
   if(distanceToRoute(x,y)<48)continue;
   if(id==="forest")feature(x,y,"forest",n);
   else feature(x,y,id,n);
  }
 }else{
  for(let i=0;i<11;i++){
   let x=65+(i*251)%1025,y=135+(i*173)%435;
   if(distanceToRoute(x,y)<83)continue;
   feature(x,y,id,.44+(i%3)*.14);
  }
 }
 const r=realm();
 for(let i=0;i<38;i++){
  const x=45+(i*197)%1040,y=115+(i*127)%465;
  if(distanceToRoute(x,y)<51)continue;
  if(id==="volcano")ellipse(x,y,3+i%3,2+i%3,i%3?"#FFB25A":"#E94F4C");
  else if(id==="moon")strokeCircle(x,y,3+i%3,"#C3CAE999",1);
  else if(id==="cyber")ellipse(x,y,3,3,"#5AFFE0");
  else if(id==="glacier")polygon([[x,y-8],[x+5,y],[x,y+7],[x-5,y]],"#F0FCFFB0");
  else if(id==="desert")ellipse(x,y,9,2,"#FFF0C277");
  else if(id==="crystal")polygon([[x,y-9],[x+6,y],[x,y+8],[x-5,y]],"#E6BAF7");
  else ellipse(x,y,3,2,i%2?r.accent:"#FFE5B8");
 }
}
function drawCastle(){
 const x=1048,y=paths[paths.length-1][1],r=realm();ctx.save();ctx.translate(x,y);
 ellipse(0,38,77,25,"#132D4666");
 const base=r.id==="volcano"?"#48364B":r.id==="desert"?"#C28B60":r.id==="moon"?"#6D7EAA":r.id==="glacier"?"#A4D5E6":r.id==="swamp"?"#4C7967":r.id==="islands"?"#7B8BA1":r.id==="cyber"?"#253F70":r.id==="crystal"?"#7E76B7":"#617E9E";
 polygon([[-62,20],[-55,-28],[-22,-49],[23,-49],[57,-28],[62,22]],"#244158");
 polygon([[-55,15],[-53,-23],[-20,-43],[20,-43],[53,-23],[55,15]],base);
 polygon([[-55,-23],[0,-74],[55,-23]],r.ground[1]);
 polygon([[-43,-25],[0,-67],[43,-25]],r.accent+"BB");
 for(const dx of [-41,41]){
  ctx.fillStyle=base;rounded(dx-16,-69,32,85,5);ctx.fill();
  polygon([[dx-21,-67],[dx,-91],[dx+21,-67]],r.road[0]);
  ctx.fillStyle=r.accent;rounded(dx-5,-48,10,21,3);ctx.fill();
 }
 ctx.fillStyle="#122E4A";rounded(-20,-6,40,40,13);ctx.fill();
 ctx.save();ctx.shadowBlur=16;ctx.shadowColor=r.accent;
 ctx.fillStyle=r.accent;rounded(-11,-2,22,30,9);ctx.fill();
 strokeCircle(0,-18,29,r.accent+"AA",3);
 ctx.restore();
 ellipse(0,-41,6,6,"#FFFFFF");
 if(r.id==="volcano"){for(let i=0;i<3;i++)polygon([[i*13-22,-70],[i*13-14,-91],[i*13-3,-69]],"#FF9A59")}
 if(r.id==="crystal")polygon([[0,-115],[-15,-86],[0,-70],[15,-86]],"#E6A8FF");
 if(r.id==="moon")strokeCircle(0,-83,28,"#D2D8FF",3);
 if(r.id==="cyber")for(let i=-2;i<=2;i++)ellipse(i*11,-36,2,3,"#54F7EB");
 ctx.textAlign="center";ctx.font="800 11px Nunito";ctx.fillStyle="#F5FBFF";ctx.fillText("LEXICA",0,12);
 ctx.restore();
}
function drawPad(p,i){
const tower=S.towers.find(t=>t.pad===i);
const isActive=S.selectedPad===i,isHovered=hoverPad===i;ctx.save();ctx.translate(p.x,p.y);
if(isHovered){const pulse=10+5*Math.sin(S.time*4);ctx.save();ctx.shadowBlur=20+pulse;ctx.shadowColor="#fff2a1";ellipse(0,0,52,30,"#ffe8a066");strokeCircle(0,0,45+pulse*.13,"#ffe69d",3);ctx.restore()}
const color={stone:realm().accent,hill:"#FFE0A2",water:"#9DE6FC",well:"#FFD28D",locked:"#71899B"}[p.type];
ellipse(0,12,43,16,"#112F4866");ellipse(0,5,38,16,realm().road[0]);
ellipse(0,0,34,13,color);
strokeCircle(0,0,28,isHovered?"#FFFBD1":isActive?"#FFF5BA":"#FFFFFFAA",isHovered?5:isActive?4:2);
if(isHovered){ctx.save();ctx.shadowColor="#fff3ae";ctx.shadowBlur=17;strokeCircle(0,0,37,"#fff2a8",3);ctx.restore()}
if(tower){drawTower(tower,0,-4)}
else if(p.type==="locked"){ctx.fillStyle="#6b6592";ctx.font="26px serif";ctx.textAlign="center";ctx.fillText("🔒",0,6)}
else{ctx.fillStyle=isActive?"#fff":"#23425A";ctx.font="28px serif";ctx.textAlign="center";ctx.fillText("✦",0,8)}
ctx.restore();
}
function drawTower(t,x,y){
 const def=TOWERS[t.type],lvl=t.level,tm=S.time;ctx.save();ctx.translate(x,y);if(t.faded)ctx.globalAlpha=.64;
 const palette={quill:["#305a70","#85dddb","#dafaf1"],spell:["#55508b","#bdabff","#f1e1ff"],echo:["#3b6889","#92d7ff","#e3f9ff"],ice:["#3b8291","#a1efff","#f5ffff"],fire:["#88435b","#ffad6d","#fff2a0"],well:["#755175","#efd08e","#fff1b6"]}[t.type];
 const [base,bright,light]=palette;
 ctx.shadowColor="#101a3b";ctx.shadowBlur=12;ellipse(0,11,28,10,"#151e3b77");ctx.shadowBlur=0;
 ctx.fillStyle="#4d4266";polygon([[-28,1],[-18,-7],[18,-7],[28,1],[17,11],[-17,11]],"#574767");
 polygon([[-24,-15],[-15,-29],[15,-29],[24,-15],[20,1],[-20,1]],base);
 polygon([[-15,-29],[0,-35],[15,-29],[15,-16],[-15,-16]],bright);
 polygon([[-17,-13],[-10,-19],[-10,-2],[-17,1]],"#ffffff55");
 ctx.fillStyle="#f9e8b1";rounded(-5,-17,10,14,3);ctx.fill();
 const top=-49-(lvl-1)*5;
 ctx.save();ctx.shadowBlur=17+t.glow*16;ctx.shadowColor=bright;
 if(t.type==="quill"){
   // Twin-barrel lightning ballista, no academic quill imagery.
   polygon([[-20,-33],[-21,top-13],[-7,top-27],[6,top-27],[23,top-13],[20,-33]],bright);
   polygon([[-24,top-20],[0,top-47],[24,top-20]],base);
   for(const dx of [-12,12]){ctx.fillStyle=light;rounded(dx-4,top-45,8,26,3);ctx.fill()}
   polygon([[0,top-58],[-11,top-34],[1,top-40],[9,top-20],[15,top-50],[4,top-42]],"#FFF4B0");
   strokeCircle(0,top-24,18+Math.sin(tm*4)*2,light,2);
 }else if(t.type==="spell"){
   polygon([[0,top-38],[22,top-11],[12,top+14],[-14,top+14],[-22,top-11]],bright);
   polygon([[0,top-38],[22,top-11],[0,top+12]],"#7866d2");
   polygon([[0,top-38],[-14,top+14],[0,top+12]],light);
   strokeCircle(0,top-10,29+lvl*2,"#d3baff",2);
 }else if(t.type==="echo"){
   // Artillery cannon with metallic barrel and glowing energy core.
   polygon([[-24,top+9],[-24,top-24],[20,top-24],[20,top+9]],base);
   polygon([[-27,top-20],[26,top-27],[34,top-11],[27,top+5],[-27,top+2]],bright);
   ellipse(26,top-11,11,15,base);ellipse(27,top-11,5,8,light);
   for(let i=0;i<2;i++)strokeCircle(29,top-10,19+i*11,"#BDECFB77",2);
 }else if(t.type==="ice"){
   for(let i=0;i<6;i++){const a=i*Math.PI/3;line([[0,top-8],[Math.cos(a)*24,top-8+Math.sin(a)*24]],bright,7);ellipse(Math.cos(a)*24,top-8+Math.sin(a)*24,5,5,light)}
   polygon([[0,top-30],[13,top-8],[0,top+14],[-13,top-8]],light);
 }else if(t.type==="fire"){
   polygon([[-19,-33],[-12,top-13],[-4,top-33],[8,top-44],[11,top-15],[24,-33],[11,-29],[-10,-29]],bright);
   polygon([[-9,-32],[5,top-24],[12,-33]],light);
   ellipse(1,-31,9,5,"#fff5d2");
 }else{
   // Energy reactor, not an ink well.
   polygon([[-24,top+16],[-20,top-12],[0,top-38],[20,top-12],[24,top+16]],base);
   polygon([[0,top-40],[-17,top-13],[0,top+7],[17,top-13]],bright);
   polygon([[0,top-33],[-9,top-13],[0,top+2],[10,top-13]],light);
   strokeCircle(0,top-13,26,"#FFE9AD",2);
   for(let i=0;i<3;i++){const a=tm*1.2+i*Math.PI*2/3;ellipse(Math.cos(a)*25,top-13+Math.sin(a)*17,3,4,"#FFE9AD")}

 }
 ctx.restore();
 if(lvl>=2){strokeCircle(0,-31,26+lvl*3,bright,2);for(let i=0;i<lvl-1;i++)ellipse(-8+i*16,-4,4,4,"#fff2ae")}
 if(lvl===3){ctx.strokeStyle=light;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,top-12,34,9,Math.sin(tm)*.2,0,Math.PI*2);ctx.stroke()}
 if(t.faded){ctx.fillStyle="#b8b0c18c";rounded(-29,top-46,58,top*-1+55,9);ctx.fill();ctx.font="800 12px sans-serif";ctx.textAlign="center";ctx.fillStyle="#fff";ctx.fillText("MỜ",0,-39)}
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
/* Realm-specific costumes and body armour: enemies differ across all ten regions. */
const biome=realm().id;
if(biome==="forest"){
 line([[-18,12],[-28,2],[-24,-14]],"#61CC8B",3);
 line([[18,12],[28,1],[24,-15]],"#61CC8B",3);
 for(let j=-1;j<=1;j++)ellipse(j*11,-25-5*Math.abs(j),5,8,"#87D69C");
}else if(biome==="volcano"){
 for(const sign of [-1,1])polygon([[sign*9,-20],[sign*24,-38],[sign*27,-10]],"#F8895C");
 polygon([[-12,-24],[0,-44],[13,-24]],"#FFCC75");
 ellipse(0,20,12,3,"#FF654B");
}else if(biome==="desert"){
 polygon([[-23,-18],[0,-36],[23,-18]],"#EDD19A");
 polygon([[-20,-18],[0,-27],[20,-18]],"#D5A36F");
 strokeCircle(0,9,20,"#F7DBA166",2);
}else if(biome==="plains"){
 line([[-27,14],[-35,0],[-26,-19]],"#E7F9CF",4);
 line([[27,14],[35,0],[26,-19]],"#E7F9CF",4);
 ellipse(0,-27,12,5,"#E6EF9A");
}else if(biome==="moon"){
 ctx.save();ctx.globalAlpha=.68;ellipse(0,-3,27,27,"#D5E7F155");ctx.restore();
 strokeCircle(0,-3,29,"#E8F5FF",4);
 ellipse(0,2,19,9,"#486493A0");
 for(let j=-1;j<=1;j++)ellipse(j*9,-27,2,2,"#A5D8F3");
}else if(biome==="glacier"){
 for(let j=-1;j<=1;j++)polygon([[j*13-7,-19],[j*13,-40-Math.abs(j)*6],[j*13+8,-19]],"#E5FBFF");
 strokeCircle(0,1,24,"#D0F8FF66",2);
}else if(biome==="swamp"){
 for(let j=0;j<4;j++)ellipse(Math.cos(j*1.57)*28,Math.sin(j*1.57)*23,4,5,"#BFF78CAA");
 polygon([[-13,-21],[0,-33],[14,-21]],"#D48B9E");
}else if(biome==="islands"){
 polygon([[-21,-18],[-18,-29],[15,-29],[23,-19]],"#D84F6B");
 line([[-20,-13],[7,-11]],"#2A3C53",5);
 ellipse(6,-12,8,7,"#21283B");strokeCircle(6,-12,8,"#F3DBAF",1.5);
}else if(biome==="cyber"){
 polygon([[-23,-19],[-17,-31],[17,-31],[23,-19]],"#1B385F");
 polygon([[-20,-11],[20,-11],[15,-2],[-16,-2]],"#41F0EE");
 line([[0,-29],[0,-44]],"#4FE4EC",3);ellipse(0,-48,5,5,"#FCA7EE");
}else if(biome==="crystal"){
 for(const j of [-1,0,1])polygon([[j*15-8,-20],[j*15,-48+(j===0?-9:0)],[j*15+8,-20]],j===0?"#F9D1FF":"#C9B4FA");
 polygon([[-18,13],[0,3],[18,13],[0,26]],"#E5A8F2AA");
}
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
let initialRealm=0;try{const saved=localStorage.getItem("LEXICON_GUARDIANS_SELECTED_REALM");const index=REALMS.findIndex(r=>r.id===saved);if(index>=0)initialRealm=index}catch(_){}chooseRealm(initialRealm);restart();log("📖 Chọn bản đồ, lật 8 thẻ từ vựng rồi dựng phòng tuyến để bắt đầu.");tutorialOpen=false;tutorial.hidden=true;mountWizard();requestAnimationFrame(loop);
})();
