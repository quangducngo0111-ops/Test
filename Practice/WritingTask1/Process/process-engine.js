(()=>{
'use strict';

/* =========================================================
   IELTS WRITING TASK 1 · PROCESS ENGINE V22.0
   3-LAYER SMART GRADING (offline / rule + semantic-lite)
   ========================================================= */

console.log('✅ PROCESS ENGINE V22.0 · SMART 3-LAYER');
window.PROCESS_ENGINE_VERSION='V22.1';

/* =========================================================
   TASK CONFIG
   ========================================================= */

const URL_ID=(location.pathname.match(/\/Process\/(?:LinearProcess\/|CyclicalProcess\/|LifeCycle\/)?(\d{1,2})\/?$/i)||[])[1];
const ID=String(window.PROCESS_TASK_ID||URL_ID||'01').padStart(2,'0');
const ENGINE_ASSET_BASE=new URL('./assets/',document.currentScript?.src||location.href).href;

const FALLBACK_TASKS={
  '01':{title:'Manufacturing Bricks',icon:'🧱',image:'bricks.png',prompt:'The diagram shows the process by which bricks are manufactured for the building industry.',type:'Linear',stages:7},
  '02':{title:'Manufacturing Instant Noodles',icon:'🍜',image:'instant-noodles.png',prompt:'The diagram shows how instant noodles are manufactured.',type:'Linear',stages:8},
  '03':{title:'Manufacturing Tomato Ketchup',icon:'🍅',image:'tomato-ketchup.png',prompt:'The diagram shows the process used to produce tomato ketchup.',type:'Linear',stages:15},
  '04':{title:'Frog Life Cycle',icon:'🐸',image:'frog-life-cycle-premium.webp?v=20261126-frogart5',prompt:'The diagram shows the life cycle of a frog.',type:'Life Cycle',stages:11},
  '05':{title:'Bee Life Cycle',icon:'🐝',image:'bee-life-cycle-premium.webp?v=20261126-premium4',prompt:'The diagram shows the life cycle of a bee.',type:'Life Cycle',stages:7},
  '06':{title:'Recycling Plastic Bottles',icon:'♻️',image:'plastic-bottles.png',prompt:'The diagram shows how plastic bottles are recycled.',type:'Linear',stages:9}
};

const task={...(FALLBACK_TASKS[ID]||FALLBACK_TASKS['01']),...((window.PROCESS_TASKS||{})[ID]||{})};
const STEP_NAMES=['Phân tích sơ đồ','Học từ vựng','Introduction','Overview','Body Paragraph 1','Body Paragraph 2','Bài hoàn chỉnh','Mini game: Chọn nghĩa'];
// Pass at 91+/100; feedback is shown but minor language comments do not block progress.
const WRITING_PASS_SCORE=90;
function passesWritingScore(score){return Number(score)>WRITING_PASS_SCORE;}
const STORAGE_KEY=`WT1_PROCESS_V21_${ID}`;
const LEGACY_KEYS=[`WT1_PROCESS_V20_1_${ID}`,`WT1_PROCESS_V20_${ID}`];
const STUDENT_KEY='IELTS_PRACTICE_STUDENT';

/* =========================================================
   3-LAYER SEMANTIC STAGE MODELS
   exact    = Layer 1 exact phrase
   roots    = Layer 2 morphology / word-family
   patterns = Layer 3 semantic-lite paraphrase patterns
   ========================================================= */

const MODELS={
'01':[
 {label:'digging clay',exact:['clay is dug','clay is excavated','clay is extracted','dug from the ground','excavated from the ground','digger','excavator'],roots:['dig','excavat','extract','clay'],patterns:[/\b(?:digger|excavator|digging clay)\b/i],ref:'First, clay is dug from the ground using a digger.'},
 {label:'metal grid and roller',exact:['metal grid','metal screen','roller','rollers','passed through a metal grid'],roots:['metal grid','metal screen','roller'],patterns:[/\b(?:grid|roller|screen)\b/i],ref:'The clay passes through a metal grid and is carried along on rollers.'},
 {label:'mixing',exact:['sand and water','water and sand','mixed with sand and water','mixing clay','mixed with sand','mixed with water'],roots:['mix','sand','water'],patterns:[/\b(?:sand|water)\b[^.!?]{0,55}\b(?:mix|clay)\w*\b/i],ref:'Next, sand and water are added to the clay and mixed.'},
 {label:'shaping',exact:['wire cutter','mould','mold','shaped into bricks','formed into bricks','brick mould'],roots:['mould','mold','shape','wire cutter'],patterns:[/\b(?:wire cutter|mould|mold|shap)\w*\b/i],ref:'The mixture is shaped into bricks using a mould or a wire cutter.'},
 {label:'drying',exact:['drying oven','dried','drying','24-48 hours','24 to 48 hours','24–48 hours'],roots:['dry','dri'],patterns:[/\b(?:drying oven|24\s*(?:-|to|–)\s*48\s*hours?)\b/i],ref:'The new bricks are dried in an oven for 24–48 hours.'},
 {label:'heating and cooling',exact:['heating and cooling','kiln','kilns','firing','heated','cooling chamber','cooled','48–72 hours','200–980°C','870–1300°C'],roots:['kiln','heat','fir','cool'],patterns:[/\b(?:kiln|fired|heating|cooling|cooled)\b/i,/\b(?:48\s*(?:-|to|–)\s*72|870\s*(?:-|to|–)\s*1300)\b/i],ref:'The bricks are heated in two kilns at moderate then high temperatures and cooled in a chamber for 48–72 hours.'},
 {label:'packaging',exact:['packaging','packed','packaged','packing bricks','stacked on pallets'],roots:['packag','pack','pallet'],patterns:[/\b(?:packaged|packing|packaging|pallet)\b/i],ref:'The finished bricks are packaged and stacked on pallets.'},
 {label:'delivering',exact:['delivery','delivered','transported by truck','transported to customers','delivered to customers'],roots:['deliver','transport','truck'],patterns:[/\b(?:delivered|delivery|transported|truck)\b/i],ref:'Finally, the packaged bricks are delivered to customers by truck.'}
],
'02':[
  {label:'flour storage',exact:['storage silos','storage silo','flour is stored','flour storage'],roots:['silo','stor'],patterns:[/\bflour\b[^.!?]{0,45}\bstor\w*\b/i],ref:'Flour is stored in storage silos before entering the production line.'},
  {label:'mixing',exact:['mixer','mixed with water and oil','water and oil','mixing'],roots:['mix'],patterns:[/\bflour\b[^.!?]{0,55}\b(?:water|oil)\b/i],ref:'It is then mixed with water and oil in a mixer.'},
  {label:'dough sheets',exact:['dough sheets','sheets of dough','rolled into sheets','rollers'],roots:['sheet','roll'],patterns:[/\bdough\b[^.!?]{0,45}\b(?:sheet|roll)\w*\b/i],ref:'The dough passes through rollers and is formed into dough sheets.'},
  {label:'dough strips',exact:['dough strips','strips of dough','cut into strips'],roots:['strip'],patterns:[/\b(?:cut|slice)\w*\b[^.!?]{0,35}\bstrip\w*\b/i],ref:'These sheets are cut into strips.'},
  {label:'noodle discs',exact:['noodle discs','noodle disks','shaped into discs','formed into discs'],roots:['disc','disk'],patterns:[/\b(?:shape|form)\w*\b[^.!?]{0,35}\b(?:disc|disk)\w*\b/i],ref:'The strips are then shaped into noodle discs.'},
  {label:'cooking and drying',exact:['cooking in oil','cooked in oil','dried','drying'],roots:['cook','dry','dri'],patterns:[/\boil\b[^.!?]{0,40}\b(?:cook|fry|dry)\w*\b/i],ref:'The noodle discs are cooked in oil and dried.'},
  {label:'cups + vegetables/spices',exact:['placed in cups','put into cups','vegetables and spices','vegetables','spices'],roots:['cup','vegetable','spice'],patterns:[/\b(?:cup|container)s?\b[^.!?]{0,55}\b(?:vegetable|spice)\w*\b/i],ref:'They are placed into cups together with vegetables and spices.'},
  {label:'sealing and labelling',exact:['labelled','labeled','labelling','labeling','sealed','sealing'],roots:['label','seal'],patterns:[/\b(?:seal|label)\w*\b/i],ref:'Finally, the cups are sealed and labelled.'}
],
'03':[
  {label:'picking tomatoes',exact:['pick tomatoes','picked','harvested','collected','put in baskets','placed in baskets'],roots:['pick','harvest','collect','basket'],patterns:[/\btomato\w*\b[^.!?]{0,45}\b(?:pick|harvest|collect)\w*\b/i],ref:'Ripe tomatoes are picked and placed in baskets.'},
  {label:'sorting',exact:['sort','sorted','good tomatoes','bad tomatoes','classified'],roots:['sort','classif'],patterns:[/\btomato\w*\b[^.!?]{0,45}\b(?:good|bad|quality)\b/i],ref:'The tomatoes are sorted so that unsuitable ones are removed.'},
  {label:'transport to factory',exact:['sent to factory','transported to factory','taken to factory','processing factory'],roots:['transport','factory'],patterns:[/\b(?:send|take|move|transport)\w*\b[^.!?]{0,45}\bfactor\w*\b/i],ref:'The selected tomatoes are transported to the factory.'},
  {label:'remove stalk/seeds/skin',exact:['remove stalk','stalk is removed','remove seeds','seeds are removed','remove skin','skin is removed','stalk','seeds','skin'],roots:['stalk','seed','skin'],patterns:[/\bremove\w*\b[^.!?]{0,60}\b(?:stalk|seed|skin)\w*\b/i],ref:'At the factory, their stalks, seeds and skins are removed.'},
  {label:'container',exact:['put into a container','placed in a container','put in a container'],roots:['container'],patterns:[/\b(?:place|put)\w*\b[^.!?]{0,35}\bcontainer\b/i],ref:'The prepared tomatoes are placed in a container.'},
  {label:'crushing',exact:['crushed','crush','crushing','pulp','crushed into pulp'],roots:['crush','pulp'],patterns:[/\btomato\w*\b[^.!?]{0,40}\bpulp\b/i],ref:'They are then crushed into a pulp.'},
  {label:'adding ingredients',exact:['sugar','vinegar','salt','ingredients are added','additives','combined with ingredients'],roots:['sugar','vinegar','salt','ingredient','additive'],patterns:[/\b(?:add|mix|combin)\w*\b[^.!?]{0,60}\b(?:sugar|vinegar|salt)\b/i],ref:'Sugar, vinegar and salt are added to the tomato mixture.'},
  {label:'boiling',exact:['boiled','boiling','boil'],roots:['boil'],patterns:[/\bboil\w*\b/i],ref:'The mixture is boiled.'},
  {label:'standing two hours',exact:['left for two hours','left for 2 hours','left to stand for two hours','left to stand for 2 hours','two hours','2 hours'],roots:['stand'],patterns:[/\b(?:two|2)\s+hours?\b/i],ref:'It is then left to stand for two hours.'},
  {label:'bottling',exact:['poured into bottles','filled into bottles','bottled','bottles are filled'],roots:['bottl','pour','fill'],patterns:[/\bketchup\b[^.!?]{0,45}\bbottl\w*\b/i],ref:'The ketchup is poured into bottles.'},
  {label:'labelling',exact:['labelled','labeled','labelling','labeling'],roots:['label'],patterns:[/\blabel\w*\b/i],ref:'The bottles are labelled.'},
  {label:'quality control',exact:['quality control','quality checked','checked','inspected','inspection'],roots:['inspect','check'],patterns:[/\bquality\b[^.!?]{0,30}\b(?:control|check|inspect)\w*\b/i],ref:'They then undergo quality control.'},
  {label:'packing',exact:['packed','packaged','boxes','packed into boxes'],roots:['pack','box'],patterns:[/\b(?:pack|place)\w*\b[^.!?]{0,35}\bbox\w*\b/i],ref:'The checked bottles are packed into boxes.'},
  {label:'transport to supermarket',exact:['supermarket','sent to supermarkets','delivered to supermarkets','transported to supermarkets'],roots:['supermarket'],patterns:[/\b(?:send|deliver|transport)\w*\b[^.!?]{0,45}\bsupermarket\w*\b/i],ref:'The packaged ketchup is transported to supermarkets.'},
  {label:'consumption',exact:['consumed','consumption','hamburger','hamburgers','fries','served','served with food','served with foods','eaten'],roots:['consum','serve','eat','hamburger','fries'],patterns:[/\b(?:food|hamburger|fries)\b/i],ref:'Finally, the ketchup is ready to be served with food.'}
],
'04':[
  {label:'eggs',exact:['frog eggs','eggs are laid','lays eggs'],roots:['egg','lay'],patterns:[/\badult frog\w*\b[^.!?]{0,40}\begg\w*\b/i],ref:'The cycle begins when adult frogs lay eggs.'},
  {label:'embryos',exact:['embryo','embryos','embryonic'],roots:['embry'],patterns:[/\bembry\w*\b/i],ref:'Embryos develop inside the eggs.'},
  {label:'tadpoles on plants',exact:['tadpoles clinging to water plants','tadpoles cling to water plants','water plants'],roots:['tadpole','plant','cling'],patterns:[/\btadpole\w*\b[^.!?]{0,45}\bplant\w*\b/i],ref:'The resulting tadpoles cling to water plants.'},
  {label:'external gills',exact:['external gills','gills','breathing'],roots:['gill','breath'],patterns:[/\bgill\w*\b/i],ref:'They develop external gills for breathing.'},
  {label:'tail grows',exact:['tail keeps growing','tail grows','growing tail'],roots:['tail','grow'],patterns:[/\btail\b[^.!?]{0,25}\b(?:grow|long)\w*\b/i],ref:'As the tadpoles grow, their tails become longer.'},
  {label:'hind legs',exact:['hindlegs appear','hind legs appear','hind legs','back legs'],roots:['hind','back leg'],patterns:[/\b(?:hind|back)\b[^.!?]{0,20}\bleg\w*\b/i],ref:'Hind legs then begin to appear.'},
  {label:'food in tail',exact:['food stored in the tail','stored in the tail'],roots:['stored','food'],patterns:[/\bfood\b[^.!?]{0,40}\btail\b/i],ref:'At this stage, the tadpoles rely on food stored in their tails.'},
  {label:'front legs',exact:['front legs appear','front legs'],roots:['front leg'],patterns:[/\bfront\b[^.!?]{0,20}\bleg\w*\b/i],ref:'Front legs subsequently develop.'},
  {label:'tail shortens',exact:['tail becomes shorter','tail shortens','shorter tail'],roots:['shorten'],patterns:[/\btail\b[^.!?]{0,30}\b(?:short|shrink|reduce)\w*\b/i],ref:'The tail then becomes shorter.'},
  {label:'young frog',exact:['young frog','froglet'],roots:['froglet'],patterns:[/\byoung\b[^.!?]{0,15}\bfrog\w*\b/i],ref:'A young frog is formed.'},
  {label:'adult frog',exact:['adult frog','mature frog'],roots:['adult','mature'],patterns:[/\b(?:adult|mature)\b[^.!?]{0,18}\bfrog\w*\b/i],ref:'Finally, it develops into an adult frog, allowing the cycle to continue.'}
],
'05':[
 {label:'eggs laid',exact:['female lays eggs','females lay eggs','eggs are laid','one or two eggs','1 or 2 eggs','every three days'],roots:['egg','lay'],patterns:[/\b(?:female|bee)\w*\b[^.!?]{0,45}\begg\w*\b/i],ref:'A female bee lays one or two eggs about every three days.'},
 {label:'eggs hatch',exact:['eggs hatch','hatch after nine to ten days','9-10 days','9 to 10 days'],roots:['hatch'],patterns:[/\b(?:9|nine)\s*(?:-|to|–)?\s*(?:10|ten)?\s*days?\b/i],ref:'The eggs hatch after about 9–10 days.'},
 {label:'first moult',exact:['first moult','first molt','first moulting','first molting','five days','5 days'],roots:['first moult','first molt','5 days','five days'],patterns:[/\b(?:first\s+moult|first\s+molt|(?:5|five)\s+days?)\b/i],ref:'After another five days, the developing bee undergoes its first moult.'},
 {label:'second moult',exact:['second moult','second molt','second moulting','second molting','seven days','7 days'],roots:['second moult','second molt','7 days','seven days'],patterns:[/\b(?:second\s+moult|second\s+molt|(?:7|seven)\s+days?)\b/i],ref:'Seven days later, a second moult takes place.'},
 {label:'third moult',exact:['third moult','third molt','third moulting','third molting','nine days','9 days'],roots:['third moult','third molt','9 days','nine days'],patterns:[/\b(?:third\s+moult|third\s+molt|(?:9|nine)\s+days?)\b/i],ref:'After another nine days, the bee goes through its third moult.'},
 {label:'young adult',exact:['young adult emerges','young adult','emerges'],roots:['emerg','young adult'],patterns:[/\byoung\b[^.!?]{0,20}\badult\b/i],ref:'A young adult then emerges.'},
 {label:'maturity',exact:['4 days to maturity','four days to maturity','maturity','mature bee'],roots:['matur'],patterns:[/\b(?:4|four)\s+days?\b[^.!?]{0,35}\bmatur\w*\b/i],ref:'The young adult takes approximately four more days to become fully mature.'}
],
'06':[
  {label:'recycling bins',exact:['recycling bin','recycle bin','placed in recycling bins','put in recycling bins','discarded'],roots:['bin','discard'],patterns:[/\bplastic bottle\w*\b[^.!?]{0,50}\bbin\w*\b/i],ref:'Used plastic bottles are placed in recycling bins.'},
  {label:'collection truck',exact:['collection truck','collected','collection','transported'],roots:['collect','truck','transport'],patterns:[/\btruck\b[^.!?]{0,45}\b(?:collect|transport)\w*\b/i],ref:'They are collected and transported by truck.'},
  {label:'sorting',exact:['recycling centre','recycling center','sorting','sorted'],roots:['sort','centre','center'],patterns:[/\brecycling\b[^.!?]{0,35}\b(?:centre|center)\b/i],ref:'At a recycling centre, the bottles are sorted.'},
  {label:'compression',exact:['compressed','compressing','compressed into blocks','blocks'],roots:['compress'],patterns:[/\b(?:block|bale)s?\b/i],ref:'The selected bottles are compressed into blocks.'},
  {label:'crushing and washing',exact:['crushed','crushing','washed','washing','crushing and washing'],roots:['crush','wash'],patterns:[/\b(?:crush|wash)\w*\b/i],ref:'The plastic is then crushed and washed.'},
  {label:'pellets',exact:['plastic pellets','pellets','producing plastic pellets','made into pellets'],roots:['pellet'],patterns:[/\bpellet\w*\b/i],ref:'Next, it is processed into plastic pellets.'},
  {label:'heating pellets',exact:['heated','heating pellets','pellets are heated'],roots:['heat'],patterns:[/\bpellet\w*\b[^.!?]{0,45}\bheat\w*\b/i],ref:'The pellets are heated to form raw material.'},
  {label:'raw material',exact:['raw material','formed into raw material','plastic raw material'],roots:['raw material'],patterns:[/\braw\b[^.!?]{0,20}\bmaterial\w*\b/i],ref:'This raw material is prepared for manufacturing.'},
  {label:'new products',exact:['end products','new products','producing end products','recycled products'],roots:['product','manufactur'],patterns:[/\b(?:new|end|recycled)\b[^.!?]{0,25}\bproduct\w*\b/i],ref:'Finally, it is used to produce new end products.'}
]
};

const BRICKS_BODY1_MODEL='In the initial stages, clay is excavated and processed before being shaped into bricks. The clay is first extracted from the ground using an excavator before being screened through a metal grid. The filtered clay is then conveyed by a set of rotating rollers, after which it is combined with sand and water and shaped into bricks using either a mould or a wire cutter, in preparation for the subsequent stages.';


/* Per-topic vocabulary for the pre-writing learning step. Kept separate from grading keys. */
const VOCAB_BANK={"10":[["atmospheric carbon dioxide","khí CO₂ trong khí quyển"],["photosynthesis","quang hợp"],["plant respiration","hô hấp ở thực vật"],["animal respiration","hô hấp ở động vật"],["organic carbon","cacbon hữu cơ"],["decomposition","sự phân hủy"],["fossil fuels","nhiên liệu hóa thạch"],["factory emissions","khí thải nhà máy"],["ocean uptake","đại dương hấp thụ CO₂"]],"11":[["atmospheric nitrogen","nitơ trong khí quyển"],["nitrogen fixation","cố định nitơ"],["soil ammonium","amoni trong đất"],["nitrification","quá trình nitrat hóa"],["nitrates","muối nitrat"],["plant uptake","cây hấp thụ nitơ"],["organic nitrogen","nitơ hữu cơ"],["ammonification","quá trình amoni hóa"],["denitrification","quá trình phản nitrat hóa"]],"12":[["magma","mácma"],["cooling","sự nguội đi"],["igneous rock","đá magma"],["weathering","phong hóa"],["sedimentary rock","đá trầm tích"],["heat and pressure","nhiệt độ và áp suất"],["metamorphic rock","đá biến chất"],["melting","sự nóng chảy"]],"13":[["eggs on leaves","trứng trên lá"],["hatching","sự nở trứng"],["caterpillar","sâu bướm"],["larval growth","ấu trùng phát triển"],["pupa","nhộng"],["emergence","sự xuất hiện của bướm"],["adult butterfly","bướm trưởng thành"],["reproduction","sinh sản"]],"14":[["egg laying","đẻ trứng"],["hatching","trứng nở"],["aquatic larvae","ấu trùng sống dưới nước"],["moulting","lột xác"],["pupae","nhộng"],["adult emergence","muỗi trưởng thành xuất hiện"],["reproduction","sinh sản"],["life cycle","vòng đời"]],"15":[["nesting","làm tổ"],["incubation","ấp trứng"],["hatchlings","rùa con mới nở"],["oceanic juveniles","rùa non sống ngoài khơi"],["coastal growth","phát triển ở vùng ven biển"],["adult migration","di cư của rùa trưởng thành"],["return to the beach","trở về bãi biển"],["lay eggs","đẻ trứng"]],"16":[["eggs in gravel","trứng trong lớp sỏi"],["alevin","cá hồi con còn túi noãn hoàng"],["fry","cá hồi bột"],["parr","cá hồi con có vằn"],["smolt","cá hồi non thích nghi với nước mặn"],["ocean adult","cá hồi trưởng thành ngoài biển"],["return upstream","bơi ngược dòng"],["spawning","sinh sản, đẻ trứng"]],"01":[["excavate clay","đào đất sét"],["metal grid and rollers","lưới kim loại và con lăn"],["mix with sand and water","trộn với cát và nước"],["wire cutter","máy cắt bằng dây"],["mould","khuôn tạo hình"],["drying oven","lò sấy"],["kiln","lò nung"],["cooling chamber","buồng làm nguội"],["packaging","đóng gói"],["delivering","vận chuyển và giao hàng"]],"02":[["storage silos","xi lô chứa bột"],["flour","bột mì"],["mix with water and oil","trộn với nước và dầu"],["rollers","con lăn"],["dough sheets","tấm bột nhào"],["dough strips","dải bột"],["noodle discs","vắt mì tròn"],["cooking in oil","nấu trong dầu"],["vegetables and spices","rau và gia vị"],["sealing and labelling","niêm phong và dán nhãn"]],"03":[["pick tomatoes","hái cà chua"],["sort tomatoes","phân loại cà chua"],["remove stalks and seeds","bỏ cuống và hạt"],["crush the tomatoes","nghiền cà chua"],["add sugar and vinegar","thêm đường và giấm"],["boil the mixture","đun sôi hỗn hợp"],["leave to stand","để yên hỗn hợp"],["bottle the ketchup","đóng chai tương cà"],["quality control","kiểm tra chất lượng"],["transport to supermarkets","vận chuyển đến siêu thị"]],"04":[["frog eggs","trứng ếch"],["embryos","phôi"],["tadpoles","nòng nọc"],["external gills","mang ngoài"],["the tail grows","đuôi phát triển"],["hind legs","chân sau"],["front legs","chân trước"],["the tail shortens","đuôi ngắn dần"],["young frog","ếch non"],["adult frog","ếch trưởng thành"]],"05":[["lay eggs","đẻ trứng"],["hatch","nở từ trứng"],["first moult","lần lột xác thứ nhất"],["second moult","lần lột xác thứ hai"],["third moult","lần lột xác thứ ba"],["young adult","ong non mới trưởng thành"],["reach maturity","đạt đến giai đoạn trưởng thành"],["reproduce","sinh sản"]],"06":[["recycling bins","thùng tái chế"],["collect by truck","thu gom bằng xe tải"],["sort plastic bottles","phân loại chai nhựa"],["compress into blocks","nén thành khối"],["crush and wash","nghiền và rửa"],["plastic pellets","hạt nhựa"],["heat the pellets","gia nhiệt hạt nhựa"],["raw material","nguyên liệu thô"],["end products","sản phẩm mới"]],"07":[["raw materials","nguyên liệu thô"],["mix the ingredients","trộn nguyên liệu"],["melt","nấu chảy"],["molten glass","thủy tinh nóng chảy"],["glass drops","giọt thủy tinh nóng chảy"],["mould bottles","tạo hình chai bằng khuôn"],["cool the bottles","làm nguội chai"],["inspect and pack","kiểm tra và đóng gói"]],"08":[["collect olives","thu hoạch quả ô liu"],["store for two to three days","bảo quản trong hai đến ba ngày"],["wash with cool water","rửa bằng nước mát"],["crush the olives","nghiền ô liu"],["remove stones","tách hạt ô liu"],["hydraulic press","máy ép thủy lực"],["centrifuge","máy ly tâm"],["separate oil and water","tách dầu và nước"],["bottle the oil","đóng chai dầu"],["transport to stores","vận chuyển đến cửa hàng"]],"09":[["evaporation","sự bốc hơi"],["condensation","sự ngưng tụ"],["precipitation","giáng thủy (mưa, tuyết)"],["surface runoff","dòng chảy bề mặt"],["infiltration","sự thấm xuống đất"],["collection","sự tích tụ nước"],["transpiration","sự thoát hơi nước của cây"],["groundwater","nước ngầm"]]};
function vocabulary(){return VOCAB_BANK[ID]||VOCAB_BANK['01'];}
function vocabSelection(){return vocabulary().map((_,i)=>i);}
function vocabReady(){return Boolean(state.vocab?.locked||state.vocab?.reviewedAll||new Set(state.vocab?.seen||[]).size>=vocabulary().length);}
function vocabRequiredCount(){return Math.min(4,vocabulary().length);}
function vocabUsedCount(text){return vocabulary().filter(v=>phrasePosition(text,v[0])>=0).length;}
function quizReady(){return state.vocab?.quizCompleted===true;}
function navDone(i){return i===1?vocabReady():i===7?quizReady():i===0?isDone(0):isDone(i-1);}

/* =========================================================
   STATE
   ========================================================= */

let state={current:1,vocabUiV1:true,vocabUiV2:true,quizStageV1:true,hintLevels:{},vocab:{selected:[],locked:false,seen:[],reviewedAll:false,quizStep:0,quizSolved:false,quizWrong:0,quizCompleted:false},completed:[],attempts:{},templateOpen:{1:true,2:true,3:true,4:true},drafts:{analysis:{type:'',stages:'',first:'',last:'',features:'',body1:'',body2:''},intro:'',overview:'',body1:'',body2:'',full:''},scores:{}};

function loadState(){try{let raw=localStorage.getItem(STORAGE_KEY),fromLegacy=false;if(!raw){for(const k of LEGACY_KEYS){raw=localStorage.getItem(k);if(raw){fromLegacy=true;break;}}}const s=JSON.parse(raw||'null');if(!s)return;state={...state,...s,scores:fromLegacy?{}:(s.scores||{}),templateOpen:{...state.templateOpen,...(s.templateOpen||{})},drafts:{...state.drafts,...(s.drafts||{}),analysis:{...state.drafts.analysis,...(s.drafts?.analysis||{})}},vocab:{...state.vocab,...(s.vocab||{})}};if(!s.vocabUiV1){state.current=1;state.vocabUiV1=true;}if(!s.vocabUiV2){if(!(state.vocab?.locked&&Number(state.current)>=2))state.current=1;state.vocabUiV2=true;saveState();}else if(fromLegacy)saveState();if(!s.quizStageV1){state.quizStageV1=true;state.vocab.quizStep=0;state.vocab.quizSolved=false;state.vocab.quizWrong=0;state.vocab.quizCompleted=false;state.current=vocabReady()?7:1;saveState();}}catch(e){console.warn('State load failed:',e);}}
function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){console.warn('State save failed:',e);}}
function isDone(i){return state.completed.includes(i);}
function attempts(i){return Number(state.attempts[i]||0);}
function markDone(i){if(!isDone(i))state.completed.push(i);state.completed=[...new Set(state.completed)].sort((a,b)=>a-b);saveState();}
function invalidateFrom(i){state.completed=state.completed.filter(x=>x<i);for(let j=i+1;j<6;j++)delete state.scores[j];saveState();}
function canVisit(i){if(i===1)return true;if(!vocabReady())return false;if(i===7)return true;if(!quizReady())return false;if(i===0)return true;if(i<2||i>6||!isDone(0))return false;for(let oldStep=1;oldStep<i-1;oldStep++)if(!isDone(oldStep))return false;return true;}
// Upgrade already-submitted 91+ scores from older builds without erasing drafts.
function restorePassingWritingScores(){let changed=false;for(let i=1;i<6;i++){const r=state.scores[i];if(r&&passesWritingScore(r.total)&&attempts(i)>0){if(!state.completed.includes(i)){state.completed.push(i);changed=true;}if(r.completed!==true){r.completed=true;changed=true;}}}if(changed){state.completed=[...new Set(state.completed)].sort((a,b)=>a-b);saveState();}}

/* =========================================================
   NORMALIZATION + SMART 3-TIER MATCHER
   ========================================================= */

function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[’‘]/g,"'").replace(/[–—]/g,'-').replace(/[^a-z0-9°%'\s-]/g,' ').replace(/\s+/g,' ').trim();}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function wordCount(v){const s=String(v||'').trim();return s?s.split(/\s+/).filter(Boolean).length:0;}
function uniq(a){return[...new Set((a||[]).filter(Boolean))];}
function model(){return MODELS[ID]||task.stageModels||[];}
function padded(text){return` ${norm(text)} `;}
function phrasePosition(text,phrase){const q=norm(phrase);if(!q)return-1;return padded(text).indexOf(` ${q} `);}
function tokenPosition(text,root){const n=norm(text);const re=new RegExp(`\\b${String(root).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}[a-z]*\\b`,'i');const m=re.exec(n);return m?m.index:-1;}
function regexPosition(text,re){const flags=re.flags.includes('g')?re.flags.replace('g',''):re.flags;const r=new RegExp(re.source,flags);const m=r.exec(String(text||''));return m?m.index:-1;}

function stageEvidence(text,stage,index){
  const exactHits=[];for(const p of stage.exact||[]){const pos=phrasePosition(text,p);if(pos>=0)exactHits.push({value:p,pos});}
  if(exactHits.length){const best=exactHits.sort((a,b)=>a.pos-b.pos)[0];return{matched:true,confidence:1,tier:1,reason:`Cụm trực tiếp: ${best.value}`,pos:best.pos,index,label:stage.label};}
  const rootHits=[];for(const r of stage.roots||[]){const pos=tokenPosition(text,r);if(pos>=0)rootHits.push({value:r,pos});}
  if(rootHits.length){const best=rootHits.sort((a,b)=>a.pos-b.pos)[0];return{matched:true,confidence:.84,tier:2,reason:`Họ từ: ${best.value}`,pos:best.pos,index,label:stage.label};}
  const semanticHits=[];for(const re of stage.patterns||[]){const pos=regexPosition(text,re);if(pos>=0)semanticHits.push({value:re.source,pos});}
  if(semanticHits.length){const best=semanticHits.sort((a,b)=>a.pos-b.pos)[0];return{matched:true,confidence:.68,tier:3,reason:'Paraphrase/ngữ nghĩa tương đương',pos:best.pos,index,label:stage.label};}
  return{matched:false,confidence:0,tier:0,reason:'',pos:-1,index,label:stage.label};
}

function smartStageEvidence(text){return model().map((s,i)=>stageEvidence(text,s,i+1));}
function smartStageHits(text){return smartStageEvidence(text).map(x=>x.matched);}
function stagePosition(text,stage,index){const ev=stageEvidence(text,stage,index||model().indexOf(stage)+1);return ev.matched?ev.pos:-1;}
function stageHits(text){return smartStageHits(text);}
function splitParagraphs(text){return String(text||'').replace(/\r\n?/g,'\n').trim().split(/\n+/).map(x=>x.trim()).filter(Boolean);}

/* =========================================================
   NUMBER / RANGE
   ========================================================= */

const NUMBER_WORDS={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,mot:1,hai:2,ba:3,bon:4,nam:5,sau:6,bay:7,tam:8,chin:9,muoi:10};
function numberValue(v){let s=norm(v).replace(/\bmain stages?\b/g,'').replace(/\bstages?\b/g,'').replace(/\bgiai doan\b/g,'').trim();if(/^\d+$/.test(s))return Number(s);if(NUMBER_WORDS[s]!=null)return NUMBER_WORDS[s];const m=s.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\b/);if(m)return/^\d+$/.test(m[1])?Number(m[1]):NUMBER_WORDS[m[1]];for(const[k,n]of Object.entries(NUMBER_WORDS)){if(new RegExp(`\\b${k}\\b`).test(s))return n;}return null;}
function parseRange(v){const s=norm(v).replace(/\bstages?\b/g,'').trim();let m=s.match(/\b(\d+)\s*-\s*(\d+)\b/)||s.match(/\b(?:from\s+)?(\d+)\s+to\s+(\d+)\b/);if(m){const a=Number(m[1]),b=Number(m[2]);return{valid:true,start:Math.min(a,b),end:Math.max(a,b)};}if(/^\d+$/.test(s)){const n=Number(s);return{valid:true,start:n,end:n};}return{valid:false,start:null,end:null};}

/* =========================================================
   STUDENT PLAN
   ========================================================= */

function bodyPlan(step){if(step!==3&&step!==4)return null;const raw=step===3?state.drafts.analysis.body1:state.drafts.analysis.body2;const r=parseRange(raw),total=model().length;if(!r.valid||r.start<1||r.end>total)return null;return{...r,stages:Array.from({length:r.end-r.start+1},(_,i)=>r.start+i),label:`stage ${r.start}–${r.end}`};}
function planCoverage(text,p){if(!p)return{covered:0,total:0,ratio:0,missing:[],evidence:[]};const evidence=smartStageEvidence(text).filter(x=>p.stages.includes(x.index));const matched=evidence.filter(x=>x.matched);return{covered:matched.length,total:p.stages.length,ratio:p.stages.length?matched.length/p.stages.length:0,missing:evidence.filter(x=>!x.matched).map(x=>x.index),evidence};}
function outsidePlanStages(text,p){if(!p)return[];return smartStageEvidence(text).filter(x=>x.matched&&!p.stages.includes(x.index)).map(x=>x.index);}

/* =========================================================
   SEQUENCE
   ========================================================= */

function sentenceSplit(text){return String(text||'').replace(/\s+/g,' ').trim().split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(Boolean);}
function stripTopicSentence(text,p){const sentences=sentenceSplit(text);if(sentences.length<2)return String(text||'');const first=sentences[0],rest=sentences.slice(1).join(' ');const broad=/\b(?:initial stages?|remaining stages?|later stages?|these stages?|the process|the procedure)\b/i.test(first)||/\b(?:consist(?:s)? of|deal(?:s)? with|involv(?:e|es)|include(?:s)?|followed by)\b/i.test(first);const restHits=p?p.stages.filter(n=>stageEvidence(rest,model()[n-1],n).matched).length:smartStageEvidence(rest).filter(x=>x.matched).length;return broad&&restHits>=2?rest:String(text||'');}
function sequenceForPlan(text,p){if(!p)return{ok:true,issues:[]};const detail=stripTopicSentence(text,p);const found=p.stages.map(n=>stageEvidence(detail,model()[n-1],n)).filter(x=>x.matched).sort((a,b)=>a.pos-b.pos);const issues=[];for(let i=1;i<found.length;i++){if(found[i].index<found[i-1].index)issues.push(`Stage ${found[i].index} (${found[i].label}) đang được trình bày trước stage ${found[i-1].index} (${found[i-1].label}).`);}return{ok:!issues.length,issues};}
function fullEssaySequence(text){const paras=splitParagraphs(text);if(paras.length<4)return{ok:true,issues:[]};const r1=sequenceForPlan(paras[2]||'',bodyPlan(3));const r2=sequenceForPlan(paras.slice(3).join(' '),bodyPlan(4));return{ok:r1.ok&&r2.ok,issues:uniq([...(r1.issues||[]),...(r2.issues||[])])};}

/* =========================================================
   LANGUAGE LAYER
   ========================================================= */

const TYPO={manufactoring:'manufacturing',manufactureing:'manufacturing',prodution:'production',proccess:'process',temparature:'temperature',temprature:'temperature',delievered:'delivered',deliverd:'delivered',packeged:'packaged',recyled:'recycled',continer:'container',vegtables:'vegetables',tranported:'transported',excuvator:'excavator',celcius:'Celsius',drie:'dried',dryed:'dried',heted:'heated',colled:'cooled',mouldd:'moulded',mixxed:'mixed',crushd:'crushed',packd:'packed',storeed:'stored',rolld:'rolled',cookd:'cooked',sortted:'sorted',filld:'filled',recyling:'recycling'};
function spellingIssues(text){const out=[];for(const w of(String(text||'').toLowerCase().match(/[a-z]+/g)||[])){if(TYPO[w])out.push(`Có thể sai chính tả: “${w}” → “${TYPO[w]}”.`);}if(/\brip\s+tomatoes?\b/i.test(text))out.push('Dùng “ripe tomatoes”, không dùng “rip tomatoes”.');return uniq(out);}
function grammarIssues(text,{note=false}={}){const s=String(text||'').trim(),out=[];if(!s)return['Chưa có câu trả lời.'];if(!note){for(const p of splitParagraphs(s)){if(p&&!/^[A-Z0-9]/.test(p))out.push('Một đoạn chưa viết hoa chữ cái đầu.');}if(!/[.!?]$/.test(s))out.push('Nên kết thúc bằng dấu câu.');}
if(/\b(?:allows|enables)\s+(?:they|he|she|we|i)\s+to\b/i.test(s))out.push('Sau allows/enables phải dùng tân ngữ: them/him/her/us/me + to V.');
if(/\bbetween\s+[^,.!?;]{0,40}\s+to\s+[^,.!?;]{0,40}/i.test(s))out.push('Dùng “between X and Y”, không dùng “between X to Y”.');
if(/\bbegins?\s+with\b[^.!?]{0,180}\bto\s+ends?\s+with\b/i.test(s))out.push('Dùng “begins with ... and ends with ...”, không dùng “begins with ... to ends with ...”.');
if(/\bends?\s+with\s+(?:the\s+)?[^,.!?]{0,50}\s+(?:is|are|was|were)\s+\w+/i.test(s))out.push('Sau “ends with” nên dùng noun/V-ing, ví dụ “ends with the bricks being delivered”.');
if(/\bbegins?\s+with\s+(?:the\s+)?[^,.!?]{0,50}\s+(?:is|are|was|were)\s+\w+/i.test(s))out.push('Sau “begins with” nên dùng noun/V-ing, ví dụ “begins with clay being dug from the ground”.');
const coord=s.match(/\b(?:is|are|was|were)\s+([a-z]+ed)\s*,\s*([a-z]+ed)\s+before\b/i);if(coord)out.push(`Cấu trúc song song chưa tự nhiên: nên viết “${coord[1]} and ${coord[2]} before ...”.`);
if(/\ba\s+(?:moderate|high(?:er)?)[-\s]+temperature\s+kilns\b/i.test(s))out.push('Dùng “a moderate-temperature kiln” hoặc “moderate-temperature kilns”, không dùng “a ... kilns”.');
if(ID==='01'&&/\b(?:heated|fired)\s+in\s+(?:a|one)\s+kiln\b[^.!?]{0,220}\band\s+(?:another|a second)\s+kiln\b/i.test(s)&&!/\band\s+in\s+(?:another|a second)\s+kiln\b/i.test(s))out.push('Cấu trúc song song ở phần nung chưa tự nhiên: nên viết “heated in two kilns: first ... and then ...” hoặc “in one kiln ... and in another kiln ...”.');
const ag=[[/\bbricks\s+is\b/i,'“bricks” là số nhiều, dùng “are”.'],[/\bbottles\s+is\b/i,'“bottles” là số nhiều, dùng “are”.'],[/\bnoodles\s+is\b/i,'“noodles” là số nhiều, dùng “are”.'],[/\btomatoes\s+is\b/i,'“tomatoes” là số nhiều, dùng “are”.'],[/\beggs\s+is\b/i,'“eggs” là số nhiều, dùng “are”.'],[/\bpellets\s+is\b/i,'“pellets” là số nhiều, dùng “are”.'],[/\bclay\s+are\b/i,'“clay” nên đi với “is”.'],[/\bflour\s+are\b/i,'“flour” nên đi với “is”.'],[/\bmixture\s+are\b/i,'“mixture” là số ít, dùng “is”.']];ag.forEach(([r,m])=>{if(r.test(s))out.push(m);});
if(/\b(?:a|an)\s+(?:bricks|bottles|noodles|tomatoes|eggs|pellets|stages|products)\b/i.test(s))out.push('“a/an” không đứng trực tiếp trước danh từ số nhiều.');
let m;const deg=/\b(\d+(?:\.\d+)?)\s+degree\s+celsius\b/gi;while((m=deg.exec(s))){if(Number(m[1])!==1)out.push(`“${m[0]}” chưa đúng: dùng “degrees Celsius”.`);}
if(ID==='01'&&(/\brollers?\b[^.!?]{0,60}\b(?:crush(?:es|ed|ing)?|grind(?:s|ing)?|break(?:s|ing)?\s+down)\b/i.test(s)||/\bclay\b[^.!?]{0,70}\b(?:crushed|ground\s+(?:down|up)|broken\s+down)\b/i.test(s)))out.push('Không mô tả roller là công đoạn nghiền clay. Theo sơ đồ, clay được sàng qua metal grid rồi chuyển qua roller(s).');return uniq(out);}
function languageIssues(text,opts={}){return uniq([...grammarIssues(text,opts),...spellingIssues(text)]);}

/* =========================================================
   FACT + PRECISION LAYER
   ========================================================= */

function factualIssues(text){const s=String(text||''),out=[],k=kind();if(k==='linear'&&/\b(?:cyclical|cyclic)\b/i.test(s))out.push('Sơ đồ này mô tả quy trình tuyến tính, không phải chu trình tuần hoàn.');if(k==='cyclical'&&/\blinear\s+(?:process|sequence)\b/i.test(s))out.push('Sơ đồ này thuộc dạng cyclical process, không phải linear process.');if(k==='life'&&/\blinear\s+(?:process|sequence)\b/i.test(s))out.push('Sơ đồ này thuộc dạng life cycle, không phải linear process.');if(ID==='03'&&/\b(?:cool|cooled|cooling)\b[^.!?]{0,50}\b(?:two|2)\s+hours?\b/i.test(s))out.push('Sơ đồ chỉ cho biết hỗn hợp được để trong 2 giờ; nên viết “left to stand for two hours”.');return uniq(out);}
function precisionIssues(text){const s=String(text||''),out=[];if(ID==='01'&&/\b(?:metal\s+grid|grid)\b[^.!?]{0,80}\bto\s+(?:remove|filter\s+out|eliminate)\s+(?:larger\s+)?(?:particles?|impurities?|debris)\b/i.test(s))out.push('Sơ đồ không ghi rõ metal grid dùng để loại bỏ particles/impurities. Để bám sát hình hơn, chỉ cần viết clay is passed/screened through a metal grid.');return out;}

/* =========================================================
   STEP 1 ANALYSIS
   ========================================================= */

function expectedType(){const t=norm(task.type);return t.includes('life')?'life cycle':t.includes('cyc')?'cyclical':'linear';}
function featureAssessment(text){const ev=smartStageEvidence(text),matched=ev.filter(x=>x.matched),lang=languageIssues(text);const names=matched.map(x=>x.label);return{ok:matched.length>=3&&lang.length===0,count:matched.length,names,evidence:matched,language:lang,hint:matched.length>=3?(lang[0]||`Đạt · Nhận diện ${matched.length} công đoạn: ${names.join(', ')}.`):`Chưa đủ · Hệ thống mới nhận diện ${matched.length} công đoạn${names.length?`: ${names.join(', ')}`:''}. Hãy nêu ít nhất 3 công đoạn/đặc điểm nổi bật.`};}
function assessAnalysis(){const a=state.drafts.analysis,stages=model(),total=Number(task.stages||stages.length);const typeOK=norm(a.type).includes(norm(expectedType()).split(' ')[0]);const stagesOK=numberValue(a.stages)===total;const firstOK=stageEvidence(a.first,stages[0],1).matched;const lastOK=stageEvidence(a.last,stages[stages.length-1],stages.length).matched;const feat=featureAssessment(a.features);const r1=parseRange(a.body1),r2=parseRange(a.body2);const body1OK=r1.valid&&r1.start>=1&&r1.end<=total;const body2OK=r2.valid&&r2.start>=1&&r2.end<=total&&body1OK&&r1.end<r2.start;return{
 type:{ok:typeOK,hint:typeOK?'Đúng dạng process.':'Hãy xác định đây là linear, cyclical hay life cycle.'},
 stages:{ok:stagesOK,hint:stagesOK?'Đúng số main stages.':'Chưa đúng. Hãy quan sát và đếm lại các main stages.'},
 first:{ok:firstOK&&languageIssues(a.first,{note:true}).length===0,hint:firstOK?'Đúng công đoạn bắt đầu. Ở bước phân tích không bắt buộc viết hoa/dấu chấm.':'Chưa đúng công đoạn bắt đầu.'},
 last:{ok:lastOK&&languageIssues(a.last,{note:true}).length===0,hint:lastOK?'Đúng công đoạn cuối. Ở bước phân tích không bắt buộc viết hoa/dấu chấm.':'Chưa đúng công đoạn cuối.'},
 features:{ok:feat.ok,hint:feat.hint,meta:feat},
 body1:{ok:body1OK,hint:body1OK?'Đạt. Đây là phạm vi stage hợp lệ cho Body 1.':'Hãy nhập một phạm vi stage hợp lệ cho Body 1.'},
 body2:{ok:body2OK,hint:body2OK?'Đạt. Body 2 tiếp nối Body 1 và không chồng stage.':'Body 2 cần tiếp nối Body 1 và không chồng stage.'}
};}

/* =========================================================
   TEMPLATES
   ========================================================= */

const TEMPLATES={linear:{intro:'The diagram illustrates the stages involved in the production of __________.',overview:'Overall, the procedure follows a linear, ______-stage sequence that begins with __________ being __________ and ends with __________ being __________. During these stages, __________ is/are __________ before __________ is/are __________.',body1:'In the initial stages, __________. __________ is/are __________, where __________. Once __________ has/have been __________, __________ before being __________.',body2:'The remaining stages deal with __________. __________ and subsequently __________. After this stage has been completed, __________ before __________, completing the process.'},life:{intro:'The diagram illustrates the different stages in the life cycle of __________.',overview:'Overall, the life cycle consists of ______ main stages, beginning with __________ and progressing through different stages of development before __________ reaches maturity and produces __________, beginning a new cycle.',body1:'In the initial stages of the cycle, __________ develops into __________. As it grows, __________ before becoming __________.',body2:'In the later stages of the cycle, __________ develops into __________ before reaching __________. At this point, __________ produces/gives rise to __________, which marks the beginning of a new cycle.'},cyclical:{intro:'The diagram illustrates the stages involved in __________.',overview:'Overall, the procedure follows a cyclical sequence that begins with __________ and progresses through __________ before returning to __________.',body1:'In the initial stages, __________. Following this, __________. Once __________, __________.',body2:'In the later stages, __________. Following this, __________ before returning to __________.'}};
function kind(){const t=norm(task.type);return t.includes('life')?'life':t.includes('cyc')?'cyclical':'linear';}
function templateFor(step){const set=TEMPLATES[kind()]||TEMPLATES.linear;return({1:set.intro,2:set.overview,3:set.body1,4:set.body2})[step]||'';}
function dynamicReference(step){const p=bodyPlan(step);if(!p)return'';if(ID==='01'&&step===3&&p.start===1&&p.end===3)return BRICKS_BODY1_MODEL;return p.stages.map(n=>model()[n-1]?.ref).filter(Boolean).join(' ');}

/* =========================================================
   TOPIC
   ========================================================= */

function containsAny(text,arr=[]){const n=padded(text);return arr.some(x=>{const q=norm(x);return q&&n.includes(` ${q} `);});}
function topicCheck(text){const sets={'01':{need:['brick','bricks'],bad:['noodle','ketchup','frog','bee','plastic bottle'],label:'bricks'},'02':{need:['noodle','noodles','instant noodles'],bad:['brick','ketchup','frog','bee','plastic bottle'],label:'instant noodles'},'03':{need:['ketchup','tomato ketchup'],bad:['brick','noodle','frog','bee','plastic bottle'],label:'tomato ketchup'},'04':{need:['frog','frogs'],bad:['brick','noodle','ketchup','bee','plastic bottle'],label:'frog life cycle'},'05':{need:['bee','bees'],bad:['brick','noodle','ketchup','frog','plastic bottle'],label:'bee life cycle'},'06':{need:['plastic','plastic bottle','plastic bottles','recycling'],bad:['brick','noodle','ketchup','frog','bee'],label:'plastic bottles'}};const r=sets[ID]||{need:task.topicWords||[],bad:[],label:task.title};return{ok:!r.need.length||r.need.some(x=>containsAny(text,[x])),wrong:r.bad.filter(x=>containsAny(text,[x])),label:r.label};}

/* =========================================================
   3-LAYER SCORING
   Layer 1: meaning/content
   Layer 2: order/structure/facts
   Layer 3: language/IELTS quality
   ========================================================= */

function scoreLayer(label,score,max,note=''){return{label,score:Math.max(0,Math.min(max,Math.round(score))),max,note};}

function gradeIntro(text){const wc=wordCount(text),topic=topicCheck(text),language=languageIssues(text),framing=/\b(?:diagram|figure|illustration)\b/i.test(text),verb=/\b(?:illustrates?|shows?|depicts?|presents?|demonstrates?)\b/i.test(text),process=/\b(?:process|stages|production|manufactur|recycl|life cycle)\w*/i.test(text);const L1=(topic.ok&&!topic.wrong.length?35:0)+(process?15:0);const L2=(framing?10:0)+(verb?10:0);const L3=Math.max(0,30-language.length*8)+(wc>=8?0:-Math.min(10,8-wc));let score=Math.max(0,Math.min(100,L1+L2+L3));if(!topic.ok||topic.wrong.length)score=Math.min(score,49);const issues=[];if(!topic.ok||topic.wrong.length)issues.push(`Đối tượng chính phải là ${topic.label}.`);if(!framing)issues.push('Chưa thể hiện rõ đây là diagram/figure.');if(!verb)issues.push('Nên dùng illustrates/shows/depicts.');if(!process)issues.push('Chưa thể hiện rõ process/life cycle.');language.forEach(x=>issues.push('Ngữ pháp/chính tả: '+x));return{total:score,completed:passesWritingScore(score),issues,breakdown:[scoreLayer('Tầng 1 · Nội dung/ngữ nghĩa',L1,50,topic.ok?'Đúng chủ đề':'Cần sửa chủ đề'),scoreLayer('Tầng 2 · Cấu trúc chức năng',L2,20,'Diagram + reporting verb'),scoreLayer('Tầng 3 · Ngôn ngữ IELTS',L3,30,`${wc} từ · ${language.length?language.length+' lỗi':'Ổn'}`)]};}

function gradeOverview(text){const wc=wordCount(text),language=languageIssues(text),facts=factualIssues(text),topic=topicCheck(text),marker=/\boverall\b|\bin general\b|\bgenerally\b/i.test(text),ev=smartStageEvidence(text),first=ev[0]?.matched,last=ev.at(-1)?.matched,hits=ev.filter(x=>x.matched).length,ratio=model().length?hits/model().length:0;const L1=(topic.wrong.length?0:10)+(first?15:0)+(last?15:0)+Math.round(Math.min(1,ratio/.55)*20);const L2=(marker?15:0)+(facts.length?0:5);const L3=Math.max(0,20-language.length*6)+(wc>=20?0:-Math.min(5,Math.ceil((20-wc)/4)));let score=Math.max(0,Math.min(100,L1+L2+L3));if(facts.length)score=Math.min(score,79);const issues=[];if(!marker)issues.push('Chưa có dấu hiệu mở Overview rõ ràng.');if(!first)issues.push('Chưa thể hiện rõ điểm bắt đầu.');if(!last)issues.push('Chưa thể hiện rõ điểm kết thúc.');if(ratio<.35)issues.push('Overview chưa khái quát đủ đặc điểm chính.');language.forEach(x=>issues.push('Ngữ pháp/chính tả: '+x));facts.forEach(x=>issues.push('Nội dung: '+x));return{total:score,completed:passesWritingScore(score),issues,breakdown:[scoreLayer('Tầng 1 · Nội dung/ngữ nghĩa',L1,60,`Nhận diện ${hits}/${model().length} stage`),scoreLayer('Tầng 2 · Overview & tính chính xác',L2,20,marker?'Có Overall':'Thiếu Overall'),scoreLayer('Tầng 3 · Ngôn ngữ IELTS',L3,20,`${wc} từ · ${language.length?language.length+' lỗi':'Ổn'}`)]};}

function gradeBody(step,text){const p=bodyPlan(step),wc=wordCount(text),coverage=planCoverage(text,p),sequence=sequenceForPlan(text,p),outside=outsidePlanStages(text,p),language=languageIssues(text),facts=factualIssues(text),precision=precisionIssues(text);const L1=Math.round((p?coverage.ratio:0)*60);const L2=(sequence.ok?12:4)+(p&&outside.length<=1?8:Math.max(0,8-(outside.length-1)*3))-(facts.length?10:0);const L3=Math.max(0,20-language.length*5)+(wc>=40?0:-Math.min(8,Math.ceil((40-wc)/5)));let score=Math.max(0,Math.min(100,L1+L2+L3-Math.min(2,precision.length)));if(facts.length)score=Math.min(score,74);if(language.length>=3)score=Math.min(score,79);const issues=[];if(!p)issues.push('Hệ thống chưa đọc được phạm vi Body đã chọn ở Bước 3.');if(p&&coverage.missing.length)issues.push(`Theo cách chia em đã chọn (${p.label}), còn thiếu hoặc chưa rõ stage: ${coverage.missing.join(', ')}.`);if(outside.length>=2)issues.push(`Đoạn này đang triển khai khá nhiều stage ngoài phạm vi ${p?.label}: ${outside.join(', ')}.`);sequence.issues.forEach(x=>issues.push('Thứ tự stage: '+x));language.forEach(x=>issues.push('Ngữ pháp/chính tả: '+x));facts.forEach(x=>issues.push('Nội dung/số liệu: '+x));precision.forEach(x=>issues.push('Gợi ý bám sát sơ đồ: '+x));return{total:score,completed:passesWritingScore(score),issues,breakdown:[scoreLayer('Tầng 1 · Nội dung/ngữ nghĩa',L1,60,p?`${coverage.covered}/${coverage.total} stage theo ${p.label}`:'Chưa đọc được plan'),scoreLayer('Tầng 2 · Trình tự & bám plan',L2,20,sequence.ok?'Trình tự phù hợp':'Cần sửa trình tự'),scoreLayer('Tầng 3 · Ngôn ngữ IELTS',L3,20,`${wc} từ · ${language.length?language.length+' lỗi':'Ổn'}`)],reference:dynamicReference(step)};}

function gradeFull(text){const wc=wordCount(text),paras=splitParagraphs(text),topic=topicCheck(text),language=languageIssues(text),facts=factualIssues(text),precision=precisionIssues(text),seq=fullEssaySequence(text),ev=smartStageEvidence(text),hitCount=ev.filter(x=>x.matched).length,ratio=ev.length?hitCount/ev.length:0,overview=paras.find(p=>/\boverall\b|\bin general\b|\bgenerally\b/i.test(p));const L1=Math.round(ratio*60)+(topic.ok&&!topic.wrong.length?0:-25);const L2=(overview?8:0)+(paras.length>=4?6:Math.round(Math.min(1,paras.length/4)*6))+(seq.ok?6:0)-(facts.length?10:0);const L3=Math.max(0,20-language.length*4)+(wc>=150?0:-Math.min(8,Math.ceil((150-wc)/20)));let score=Math.max(0,Math.min(100,L1+L2+L3-Math.min(3,precision.length)));if(!topic.ok||topic.wrong.length)score=Math.min(score,49);if(facts.length)score=Math.min(score,79);if(language.length>=4)score=Math.min(score,79);const requiredVocab=vocabRequiredCount(),usedVocab=vocabUsedCount(text),meaningCovered=ratio>=.8;if(usedVocab<requiredVocab&&!meaningCovered)score=Math.min(89,score);const issues=[];if(usedVocab<requiredVocab&&!meaningCovered)issues.push(`Cần vận dụng ít nhất ${requiredVocab} cụm từ trọng tâm hoặc diễn đạt tương đương các công đoạn quan trọng; hiện mới nhận diện ${usedVocab} cụm từ trực tiếp.`);if(!topic.ok||topic.wrong.length)issues.push(`Đối tượng chính phải là ${topic.label}.`);if(wc<150)issues.push(`Bài hiện có ${wc} từ; IELTS Writing Task 1 nên có ít nhất 150 từ.`);if(!overview)issues.push('Chưa thấy Overview rõ ràng.');if(paras.length<4)issues.push(`Hệ thống đang nhận ${paras.length} đoạn. Chỉ cần Enter 1 lần để sang đoạn mới.`);if(ratio<.72)issues.push('Bài vẫn còn thiếu một số stage quan trọng.');seq.issues.forEach(x=>issues.push('Thứ tự stage: '+x));language.forEach(x=>issues.push('Ngữ pháp/chính tả: '+x));facts.forEach(x=>issues.push('Nội dung: '+x));precision.forEach(x=>issues.push('Gợi ý bám sát sơ đồ: '+x));return{total:score,completed:passesWritingScore(score),issues,breakdown:[scoreLayer('Tầng 1 · Nội dung/ngữ nghĩa',L1,60,`Nhận diện ${hitCount}/${ev.length} stage · ${Math.round(ratio*100)}%`),scoreLayer('Tầng 2 · Cấu trúc/trình tự',L2,20,`${paras.length} đoạn · ${overview?'Có Overview':'Thiếu Overview'}`),scoreLayer('Tầng 3 · Ngôn ngữ IELTS',L3,20,`${wc} từ · ${language.length?language.length+' lỗi':'Ổn'}`)]};}
function grade(step,text){if(step===1)return gradeIntro(text);if(step===2)return gradeOverview(text);if(step===3||step===4)return gradeBody(step,text);return gradeFull(text);}

/* =========================================================
   UI
   ========================================================= */

const CSS=`
:root{--p:#281260;--v:#7358e7;--ink:#202636;--muted:#6f7890;--line:#e1e5ee;--bg:#f5f7fb;--good:#16845b;--goodbg:#f1fbf6;--bad:#b83345;--badbg:#fff6f7;--warnbg:#fff9ed}*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:var(--ink);background:var(--bg)}button,input,textarea,select{font:inherit}button{cursor:pointer}.top{position:sticky;top:0;z-index:30;background:linear-gradient(100deg,#1c0e49,#281260,#38217f);color:#fff}.topin,.page{width:min(1440px,calc(100% - 18px));margin:auto}.topin{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:10px}.left{display:flex;align-items:center;gap:10px}.back{color:#fff;text-decoration:none;border:1px solid #ffffff40;padding:7px 10px;border-radius:9px;font-size:11px;font-weight:900}.brand{font-weight:950}.student{font-size:10px;background:#ffffff15;border:1px solid #ffffff30;padding:7px 10px;border-radius:999px}.page{padding:16px 0 46px}.hero{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin-bottom:12px}.hero h1{margin:0;color:#21164b;font-size:28px}.hero p{margin:4px 0 0;color:var(--muted);font-size:11px}.progresswrap{min-width:300px}.prow{display:flex;justify-content:space-between;color:var(--muted);font-size:10px;font-weight:850;margin-bottom:5px}.progress{height:7px;background:#e5e8ef;border-radius:999px;overflow:hidden}.progress i{display:block;height:100%;background:linear-gradient(90deg,#5d43b0,#2f6fdf)}.layout{display:grid;grid-template-columns:420px 1fr;gap:12px;align-items:start}.leftcol{display:grid;gap:12px;position:sticky;top:74px}.diagram,.steps,.main{background:#fff;border:1px solid var(--line);border-radius:17px;box-shadow:0 8px 24px #23194b0a}.diagram{padding:14px}.diagramtop,.ey,.writehead,.scorebar{display:flex;justify-content:space-between;align-items:center;gap:10px}.diagramtop{margin-bottom:10px}.pill,.chip{font-size:9px;font-weight:900;color:#6246bd;background:#f0ecff;padding:6px 8px;border-radius:999px}.imgwrap{position:relative;border:1px solid #e4e7ef;border-radius:12px;overflow:hidden}.imgwrap img{width:100%;display:block}.zoom{position:absolute;right:8px;bottom:8px;border:1px solid #dddff0;background:#fffffff0;color:#4f3d8b;border-radius:9px;padding:7px 9px;font-size:9.5px;font-weight:900}.prompt{margin-top:10px;padding:11px;border-radius:11px;background:#f7f5ff;border:1px solid #e3def9;font-size:10.5px;line-height:1.5}.steps{padding:12px;display:grid;gap:7px}.stepbtn{width:100%;border:1px solid var(--line);background:#fff;border-radius:11px;padding:9px;text-align:left;display:grid;grid-template-columns:34px 1fr;gap:9px;align-items:center}.stepbtn .n{width:30px;height:30px;border-radius:8px;background:#eee9ff;color:#4b318e;display:grid;place-items:center;font-size:10px;font-weight:950}.stepbtn strong{display:block;font-size:10.8px}.stepbtn small{display:block;margin-top:2px;color:#8a91a0;font-size:9px}.stepbtn.active{border-color:#8269e8;box-shadow:0 0 0 3px #7559e812}.stepbtn.done{background:#f6fcf8;border-color:#b9e3cb}.stepbtn.done .n{background:#dff3e8;color:#15764f}.stepbtn.locked{opacity:.48}.main{min-height:650px;padding:20px 22px}.ey{margin-bottom:12px}.counter,.wc{font-size:10px;color:var(--muted);font-weight:850}.main h2{margin:0 0 5px;color:#21164b;font-size:22px}.sub{margin:0 0 14px;color:var(--muted);font-size:10.8px}.guide{padding:12px 13px;border:1px solid #ded8f4;border-radius:12px;background:#fafaff;margin-bottom:12px;font-size:10.5px;line-height:1.55}.guide b{color:#4b318e}.template-card{border:1px solid #d9d0ff;border-radius:14px;background:#faf8ff;margin-bottom:14px;overflow:hidden}.template-head{display:flex;justify-content:space-between;align-items:center;padding:12px 13px}.template-badge{font-size:8.5px;font-weight:950;color:#674dc1;background:#eee8ff;padding:5px 7px;border-radius:999px;margin-right:8px}.template-toggle{border:1px solid #d6cef5;background:#fff;color:#523b9f;border-radius:8px;padding:6px 9px;font-size:9px;font-weight:900}.template-body{padding:0 13px 13px}.template-text{padding:12px;border:1px dashed #bdb0ef;background:#fff;border-radius:10px;color:#362768;font-size:11.5px;font-weight:750;line-height:1.65}.template-note{margin-top:7px;color:#737b8e;font-size:9.5px}.independent-card{margin-bottom:14px;padding:13px;border:1px solid #f0cf9c;background:#fff9ef;border-radius:13px;font-size:10.5px}.formgrid{display:grid;grid-template-columns:1fr 1fr;gap:11px}.field{border:1px solid var(--line);border-radius:11px;padding:10px}.field label{display:block;font-size:10px;font-weight:900;margin-bottom:6px}.field input,.field select,.field textarea{width:100%;border:1px solid #cfd4df;border-radius:8px;padding:9px;outline:none;background:#fff;font-size:11px}.field textarea{min-height:76px;resize:vertical}.inline-feedback{display:none}.inline-feedback.show{display:block;margin-top:8px;padding:8px 9px;border-radius:8px;font-size:9.7px}.inline-feedback.pass{color:#126b49;background:var(--goodbg);border:1px solid #bde5ce}.inline-feedback.fail{color:#9d3142;background:var(--badbg);border:1px solid #efc8ce}.inline-state{font-weight:950;margin-bottom:2px}.write{width:100%;min-height:205px;resize:vertical;border:1px solid #cbd2df;border-radius:12px;padding:13px;outline:none;font-size:12.5px;line-height:1.7}.write.full{min-height:400px}.writehead{margin:8px 0 7px;font-size:10.5px;font-weight:900}.actions{display:grid;grid-template-columns:140px 1fr 140px;gap:8px;margin-top:11px}.btn{border:1px solid #dcdfe7;background:#fff;color:#40345f;border-radius:10px;padding:10px 12px;font-size:10.5px;font-weight:950}.btn.primary{border:0;background:linear-gradient(100deg,var(--p),var(--v));color:#fff}.btn:disabled{opacity:.4;cursor:not-allowed}.feedback{margin-top:12px;display:none}.feedback.show{display:block}.scorebar{padding:12px 13px;border:1px solid var(--line);border-radius:12px}.score{font-size:24px;font-weight:950;color:#21164b}.status{font-size:10.5px;font-weight:900}.good{color:var(--good)}.warn{color:#9b6b16}.bad{color:var(--bad)}.detail,.reference{margin-top:8px;padding:11px 12px;border-radius:11px;font-size:10.5px;line-height:1.55}.detail{border:1px solid #eadfc3;background:var(--warnbg)}.detail.goodbox{border-color:#bde5ce;background:var(--goodbg)}.detail.badbox{border-color:#efc8ce;background:var(--badbg)}.reference{border:1px solid #ded7fb;background:#f6f4ff}.reference b{color:#4b318e}.reference-answer{margin-top:6px;color:#2d3150}.finaldone{padding:20px;text-align:center;border:1px solid #bde5ce;background:var(--goodbg);border-radius:14px;margin-top:10px}dialog{width:min(980px,96vw);max-height:92vh;border:0;border-radius:15px;padding:0}dialog::backdrop{background:#0c0820b3}.modalhead{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid var(--line)}.modalimg{max-width:100%;max-height:calc(90dvh - 72px);width:auto;height:auto;display:block;margin:auto;object-fit:contain}@media(max-width:1050px){.layout{grid-template-columns:1fr}.leftcol{position:static}.steps{grid-template-columns:repeat(3,1fr)}}@media(max-width:650px){.student{display:none}.hero{flex-direction:column;align-items:stretch}.progresswrap{min-width:0}.steps,.formgrid,.actions{grid-template-columns:1fr}.main{padding:16px}}

.vocab-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:14px 0 12px;color:#274b78;font-size:13px}
.vocab-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
.vocab-item{display:grid;grid-template-columns:20px 1fr;gap:3px 10px;padding:13px 14px;background:#fff;border:1px solid #dde5f2;border-radius:12px;cursor:pointer;min-height:78px;align-content:center}
.vocab-item input{grid-row:1/3;width:17px;height:17px;accent-color:#3b0e90;margin:3px 0 0}
.vocab-item.selected{border-color:#a7a1e5;background:#f8f6ff}
.vocab-english{color:#21164b;font-weight:800;font-size:14px;line-height:1.4}
.vocab-meaning{color:#647083;font-size:12px;line-height:1.5}
.vocab-grid.hide-meaning .vocab-meaning{visibility:hidden}
.vocab-field-hint{display:block;font-size:11px;color:#68738b;line-height:1.5;margin:2px 0 7px}.vocab-status{margin:13px 0 9px;padding:11px 13px;border:1px solid #dfd9f2;background:#f9f7ff;border-radius:11px;color:#554b7c;font-size:12px;line-height:1.5}
.vocab-edit{background:#fff;color:#4b3093;border:1px solid #dcd5f1;border-radius:9px;font-size:12px;font-weight:750;padding:8px 10px;cursor:pointer}
.vocab-reminder{border:1px solid #ddd7f1;background:#faf9ff;border-radius:12px;padding:13px 14px;margin:12px 0 16px}
.vocab-reminder-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:7px;color:#21164b;font-size:13px}
.vocab-reminder-head span{font-size:11px;font-weight:650;color:#68738b}
.vocab-chips{display:flex;gap:7px;flex-wrap:wrap;margin:11px 0}
.vocab-chip{font-size:11px;color:#4f4f78;border:1px solid #d9d8ec;border-radius:20px;padding:5px 9px;background:#fff}
.vocab-chip.used{border-color:#a7d5bf;background:#f0fbf5;color:#225c43}
.vocab-reminder p{font-size:11px;line-height:1.6;color:#6b7287;margin:0 0 8px}
@media(max-width:650px){.vocab-grid{grid-template-columns:1fr}.vocab-item{min-height:68px}}

/* Flip-to-reveal vocabulary cards and optional meaning challenge. */
.vocab-grid .vocab-item{display:flex;flex-direction:column;gap:8px;min-height:106px;padding:11px 12px;align-content:unset}
.vocab-flip{border:0;background:transparent;text-align:left;width:100%;min-height:55px;display:flex;flex-direction:column;align-items:flex-start;gap:5px;padding:3px 0;cursor:pointer}
.vocab-flip:focus-visible{outline:2px solid #7557e7;outline-offset:2px;border-radius:4px}
.vocab-flip .vocab-meaning{display:none;color:#285f55;font-weight:720;font-size:13px}
.vocab-flip.revealed .vocab-meaning{display:block}
.vocab-reveal-tip{font-size:11px;color:#7b7895;font-weight:550}
.vocab-pick{display:flex;gap:8px;align-items:center;cursor:pointer;border-top:1px solid #ebeaf5;padding-top:8px;color:#625d86;font-weight:700;font-size:11px}
.vocab-pick input{margin:0;width:16px;height:16px;accent-color:#3b0e90}
.vocab-quiz{margin:18px 0 12px;padding:17px;border:1px solid #dbe2f2;border-radius:13px;background:linear-gradient(135deg,#fff,#f7faff)}
.vocab-quiz-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;color:#282052;font-size:14px}
.vocab-quiz-head span{font-size:11px;color:#7a81a0;font-weight:700}
.vocab-quiz-copy{font-size:13px;color:#35405c;line-height:1.7;margin:11px 0}
.vocab-quiz-copy strong{color:#2c1871}
.vocab-quiz-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.vocab-choice{font-size:12px;line-height:1.45;min-height:53px;border:1px solid #d8ddef;background:#fff;color:#292952;border-radius:9px;padding:10px 8px;cursor:pointer}
.vocab-choice:hover:not(:disabled){border-color:#9f90d0;background:#f8f6ff}
.vocab-choice.correct{background:#ebfaf3;border-color:#80c9a4;color:#146c47;font-weight:800}
.vocab-choice.wrong{background:#fff6f6;border-color:#eabfc5;color:#963d48}
.vocab-quiz-result{min-height:23px;font-size:12px;color:#556079;margin-top:10px;line-height:1.5}
.vocab-quiz-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.vocab-quiz-actions button:disabled{opacity:.5;cursor:default}
@media(max-width:700px){.vocab-quiz-options{grid-template-columns:1fr}.vocab-choice{min-height:44px}}



.writing-inline-guide{margin:11px 0 16px}
.writing-inline-guide:empty{display:none}
.writing-hints-head{display:flex;justify-content:space-between;align-items:center;gap:10px;color:#483279;font-size:12px;font-weight:800;margin-bottom:10px}
.writing-hints-head span{color:#8590a4;font-size:11px;font-weight:650}
.writing-hint-item{padding:12px 14px;border:1px solid #e7dae9;border-left:3px solid #c0a1e8;border-radius:10px;background:#fdfbff;margin-bottom:9px}
.writing-hint-issue{font-size:12px;font-weight:750;color:#913d56;line-height:1.55}
.writing-hint-advice{font-size:12px;color:#4b4b64;line-height:1.65;margin:9px 0}
.writing-hint-advice span{font-size:10px;font-weight:800;color:#6145a2}
.writing-hint-advice p{margin:3px 0 0}
.inline-hint{padding:11px 12px;margin-top:9px;border:1px solid #e1d9f5;background:#faf8ff;border-radius:10px;color:#40315f}
.inline-hint-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.inline-hint-head b{font-size:11px;color:#4f3a95}
.inline-hint-next{font-size:11px;font-weight:750;border:1px solid #dbd1f5;color:#553ca2;background:#fff;border-radius:7px;padding:6px 8px;cursor:pointer}
.inline-hint p{font-size:12px;line-height:1.65;color:#54556e;margin:7px 0 0}

/* True 3-D double-sided card; front and back rotate around a vertical axis. */
.vocab-flip-perspective{width:min(620px,100%);height:390px;margin:0 auto;perspective:1200px}
.vocab-flip-stage{position:relative;display:block;width:100%;height:100%;background:transparent;border:0;padding:0;cursor:pointer;transform-style:preserve-3d;transition:transform .72s cubic-bezier(.2,.7,.2,1);border-radius:20px}
.vocab-flip-stage.is-flipped{transform:rotateY(180deg)}
.vocab-flip-stage:focus-visible{outline:3px solid #815bd0;outline-offset:4px}
.vocab-face{display:flex;flex-direction:column;position:absolute;inset:0;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #dedaf1;box-shadow:0 9px 29px #28126016;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.vocab-face-front{transform:rotateY(0deg)}
.vocab-face-back{transform:rotateY(180deg);align-items:center;justify-content:center;gap:13px;padding:20px;background:radial-gradient(circle at 50% 20%,#e6f5ff,#faf7ff 66%,#f0eafd);text-align:center}
.vocab-scene{display:block;width:100%;height:236px;flex:none}
.vocab-face-content{display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:12px 20px 22px}
.vocab-face-content strong,.vocab-face-back strong{color:#281260;font-size:clamp(21px,2.5vw,28px);line-height:1.25}
.vocab-face-content small,.vocab-face-back small{font-size:12px;color:#7c7796}
.vocab-face-backicon{display:grid;place-items:center;font-size:54px;width:96px;height:96px;background:#ffffffbb;border-radius:26px;box-shadow:0 8px 28px #28126011}
.vocab-back-english{font-size:15px;color:#4c4490;font-weight:700}
.vocab-card-helper{font-size:11px;color:#86849f;text-align:center}
@media(max-width:650px){.vocab-flip-perspective{height:320px}.vocab-scene{height:177px}.vocab-face-content strong,.vocab-face-back strong{font-size:20px}.vocab-card-helper{display:none}}
@media(prefers-reduced-motion:reduce){.vocab-flip-stage{transition:none}}
.vocab-single-head{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#21164b;margin:17px 0 8px;font-size:13px}
.vocab-single-head span{color:#798199;font-size:12px;font-weight:700}
.vocab-card-track{height:5px;background:#eceaf7;border-radius:99px;overflow:hidden;margin-bottom:14px}
.vocab-card-track div{height:100%;background:linear-gradient(90deg,#6348b9,#3386c6);border-radius:99px}
.vocab-one-card{display:block;text-align:center;width:min(560px,100%);margin:auto;border:1px solid #d9d6ea;background:#fff;border-radius:19px;overflow:hidden;color:#261b53;box-shadow:0 8px 26px #30256c15;padding:0;transition:transform .16s,box-shadow .16s}
.vocab-one-card:hover{transform:translateY(-2px);box-shadow:0 12px 29px #30256c21}
.vocab-one-card:focus-visible{outline:3px solid #7f63dc;outline-offset:3px}
.vocab-card-art{position:relative;height:186px;overflow:hidden;background:linear-gradient(125deg,#eef6ff,#fbfaff)}
.vocab-card-art img{width:100%;height:100%;object-fit:cover;object-position:center;filter:saturate(.85)}
.vocab-card-pictogram{position:absolute;right:18px;top:14px;display:grid;place-items:center;width:70px;height:70px;border-radius:18px;background:#ffffffed;box-shadow:0 6px 20px #00000017;font-size:39px}
.vocab-art-caption{position:absolute;bottom:10px;left:12px;background:#ffffffed;padding:5px 9px;border-radius:20px;font-size:10px;font-weight:700;color:#525b78}
.vocab-one-front,.vocab-one-back{min-height:132px;padding:23px 16px 21px;display:flex;flex-direction:column;gap:8px;align-items:center;justify-content:center}
.vocab-one-front[hidden],.vocab-one-back[hidden]{display:none!important}
.vocab-one-back{background:#f7f5ff}
.vocab-overline{font-size:10px;letter-spacing:.12em;color:#77649f;font-weight:850}
.vocab-one-front strong,.vocab-one-back strong{font-size:clamp(20px,3vw,26px);line-height:1.32;color:#281260}
.vocab-one-front small,.vocab-one-back small{font-size:12px;color:#7d8295}
.vocab-card-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:15px auto 0;max-width:560px}
.vocab-card-actions .vocab-edit:disabled{opacity:.35;cursor:default}
.vocab-pick-btn{background:#f2eeff;color:#49258b;border:1px solid #c8b9ea;padding:10px 13px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer}
.vocab-pick-btn.picked{background:#ecfaf3;border-color:#90c9ac;color:#146544}
.vocab-selected-note{text-align:center;color:#7b8396;font-size:11px;margin:13px 0 16px}
.vocab-practice-line{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:14px;border-top:1px solid #ededf4;font-size:12px;color:#6b708b}
.vocab-quiz[hidden]{display:none!important}
@media(max-width:650px){.vocab-card-art{height:150px}.vocab-card-actions{gap:6px}.vocab-card-actions .vocab-edit,.vocab-pick-btn{font-size:11px;padding:9px 7px}}
.hint-panel{border:1px solid #dcd8f0;background:linear-gradient(125deg,#fcfbff,#f5f9ff);border-radius:13px;padding:13px 15px;margin:14px 0 16px}
.hint-top{display:flex;justify-content:space-between;align-items:center;gap:12px}
.hint-top b{color:#31205f;font-size:13px}
.hint-top small{display:block;margin-top:4px;color:#69768d;font-size:11px;line-height:1.5}
.hint-action{background:#fff;border:1px solid #b8a9e0;border-radius:9px;color:#44258e;font-weight:850;padding:9px 12px;font-size:12px;white-space:nowrap}
.hint-answer{margin-top:12px;background:#fff;border:1px solid #e5e2f2;padding:12px;border-radius:9px}
.hint-level{font-size:10px;color:#6a56ba;font-weight:800;letter-spacing:.035em}
.hint-answer p{font-size:12px;line-height:1.75;color:#35415b;margin:6px 0 0}
.hint-hide{background:none;border:0;padding:9px 0 0;color:#6c6f8b;font-size:11px;text-decoration:underline}
@media(max-width:650px){.hint-top{align-items:flex-start}.hint-action{white-space:normal;min-width:100px}}



/* Mandatory mini game: independent full-size lesson screen. */
.vocab-quiz-screen{margin:18px 0 22px;padding:22px;background:#fff;border:1px solid #e0ddf2;border-radius:16px;box-shadow:0 8px 22px #1b17600b}
.vocab-quiz-screen .vocab-quiz-head{font-size:15px;color:#2d2366}
.vocab-quiz-screen .vocab-quiz-copy{font-size:13px;margin:20px 0 6px;color:#64708c}
.vocab-quiz-screen .vocab-quiz-term{font-size:clamp(23px,3vw,31px);font-weight:850;color:#2e1a70;margin:0 0 24px;line-height:1.4}
.vocab-quiz-screen .vocab-choice{min-height:65px;font-weight:720;font-size:14px;transition:border-color .18s,background .18s}
.vocab-quiz-screen .vocab-quiz-result{min-height:36px;font-weight:700;margin-top:17px}
.vocab-quiz-track{margin-top:13px}
.vocab-quiz-finish{text-align:center;background:linear-gradient(125deg,#f9f6ff,#f1f9ff);padding:38px 24px;border:1px solid #e4ddf4;border-radius:16px;margin:20px 0}
.vocab-quiz-finish h3{color:#32226d;font-size:22px;margin:10px 0}
.vocab-quiz-finish p{font-size:14px;color:#68738a;line-height:1.7;max-width:450px;margin:12px auto}
.vocab-quiz-trophy{font-size:52px}
@media(max-width:700px){.vocab-quiz-screen{padding:16px}.vocab-quiz-screen .vocab-choice{min-height:52px}}

/* 3D flashcards: the rotating inner wrapper contains both photo-backed faces. */
.vocab-flip-perspective{width:min(660px,100%);height:330px;margin:0 auto;perspective:1450px;-webkit-perspective:1450px;isolation:isolate}
.vocab-flip-control{width:100%;height:100%;padding:0;border:0;border-radius:20px;background:transparent;display:block;cursor:pointer;position:relative;outline-offset:5px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.vocab-flip-inner{display:block;position:relative;width:100%;height:100%;transform:rotateY(0deg);-webkit-transform:rotateY(0deg);transform-style:preserve-3d;-webkit-transform-style:preserve-3d;transition:transform .82s cubic-bezier(.2,.8,.2,1);-webkit-transition:-webkit-transform .82s cubic-bezier(.2,.8,.2,1);will-change:transform}
.vocab-flip-control.is-flipped .vocab-flip-inner{transform:rotateY(180deg);-webkit-transform:rotateY(180deg)}
.vocab-flip-control:focus-visible{outline:3px solid #815bd0}
.vocab-flip-inner .vocab-face{display:flex;flex-direction:row;position:absolute;inset:0;padding:14px;gap:10px;align-items:center;justify-content:flex-start;border:1px solid #ddd8ef;border-radius:20px;background:linear-gradient(135deg,#f0f6ff,#fff 65%);overflow:hidden;box-shadow:0 12px 31px rgba(39,18,96,.11);backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;pointer-events:none}
.vocab-flip-inner .vocab-face-front{transform:rotateY(0deg);-webkit-transform:rotateY(0deg)}
.vocab-flip-inner .vocab-face-back{transform:rotateY(180deg);-webkit-transform:rotateY(180deg)}
.vocab-real-photo{display:block;flex:0 0 298px;height:298px;width:298px;margin:0;background-color:#f5f8fa;background-size:300% 300%;background-repeat:no-repeat;border-radius:14px;box-shadow:0 5px 14px #25376716;filter:contrast(1.06) saturate(1.04);image-rendering:-webkit-optimize-contrast}
.vocab-real-photo.vocab-illustrated{display:flex;justify-content:center;align-items:center;background:#eef4fd}
.vocab-real-photo.vocab-illustrated svg{width:100%;height:100%;display:block}
.vocab-flip-inner .vocab-face-content{display:flex;flex:1;min-width:0;flex-direction:column;align-items:center;justify-content:center;gap:11px;padding:18px 12px;text-align:center;background:transparent}
.vocab-flip-inner .vocab-face-back .vocab-face-content{background:#f7f4ff}
.vocab-flip-inner .vocab-face-content strong{font-size:clamp(21px,2.5vw,27px);line-height:1.3;color:#2e166b}
.vocab-flip-inner .vocab-face-content small{font-size:12px;color:#777b93}
@media(max-width:650px){.vocab-flip-perspective{width:min(430px,100%);height:440px}.vocab-flip-inner .vocab-face{flex-direction:column;padding:10px;gap:4px}.vocab-real-photo{height:265px;flex-basis:265px;width:265px;max-width:100%}.vocab-flip-inner .vocab-face-content{padding:9px 10px 16px}.vocab-flip-inner .vocab-face-content strong{font-size:20px}}
@media(prefers-reduced-motion:reduce){.vocab-flip-inner{transition-duration:.4s;-webkit-transition-duration:.4s}}

/* Crisp, individual 780x580 images replace 240px tiles cropped from the low-resolution atlas. */
.vocab-term-symbol{position:absolute;top:10px;right:10px;display:grid;place-items:center;width:46px;height:46px;border-radius:13px;background:#ffffffed;font-size:26px;box-shadow:0 5px 14px #2f367127;pointer-events:none}

/* Photo-first cards across all 16 topics; no upscaling of 240px atlas tiles. */
.vocab-picture{position:relative;display:block;flex:0 0 310px;width:310px;height:260px;max-width:50%;border-radius:14px;overflow:hidden;background:#edf3f8}
.vocab-picture img.vocab-real-photo-hq{display:block;width:100%;height:100%;max-width:100%;object-fit:cover;object-position:center;border-radius:0;box-shadow:none;filter:none}
.vocab-picture img.vocab-diagram-fallback{object-fit:contain;background:#f8fafc}
.vocab-image-label{position:absolute;bottom:8px;left:9px;font-size:10px;font-weight:700;padding:5px 8px;border-radius:99px;background:#fffffff0;color:#57607c}
@media(max-width:650px){.vocab-picture{flex:0 0 200px;max-width:100%;width:min(340px,100%);height:200px}.vocab-picture img.vocab-real-photo-hq{width:100%;height:100%}}

.vocab-flip-inner img.vocab-real-photo-hq{display:block;flex:0 0 310px;width:310px;height:260px;max-width:50%;object-fit:cover;object-position:center;image-rendering:auto;filter:none;background:#edf3f8;border-radius:14px;box-shadow:0 5px 14px #25376712}
@media(max-width:650px){.vocab-flip-inner img.vocab-real-photo-hq{flex:0 0 265px;width:265px;height:200px;max-width:100%;object-fit:cover}}


/* Water Cycle photos: 8 distinct sources, one consistent 4:3 frame on both sides. */
.vocab-water-card .vocab-flip-inner .vocab-face{display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:14px;padding:14px}
.vocab-water-card .vocab-picture.vocab-water-picture{display:block;position:relative;flex:0 0 49%;width:49%;height:auto;aspect-ratio:4/3;max-width:49%;overflow:hidden;border-radius:14px;background:#e8f3f9;align-self:center;box-shadow:0 5px 16px #21345b18}
.vocab-water-card .vocab-picture.vocab-water-picture img.vocab-real-photo-hq{display:block;width:100%;height:100%;max-width:100%;object-fit:cover;object-position:center;filter:none;box-shadow:none;border-radius:0;image-rendering:auto}
.vocab-water-card .vocab-face-content{min-width:0;flex:1;padding:12px 10px;overflow-wrap:anywhere}
.vocab-water-fallback{display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:linear-gradient(135deg,#dff1ff,#eef9ff)}
.vocab-water-card img.vocab-water-photo[hidden]{display:none!important}
.vocab-water-fallback[hidden]{display:none}
.vocab-water-fallback svg{width:100%;height:100%;display:block}
.vocab-water-credit{max-width:660px;margin:9px auto 0;text-align:center;color:#72809a;font-size:10px;line-height:1.6}
.vocab-water-credit a{color:#576e9a;text-decoration:underline}
@media(max-width:650px){.vocab-water-card.vocab-flip-perspective{height:440px;max-width:100%}.vocab-water-card .vocab-flip-inner .vocab-face{flex-direction:column;justify-content:flex-start;padding:12px;gap:8px}.vocab-water-card .vocab-picture.vocab-water-picture{flex:none;width:min(100%,300px);max-width:100%;height:auto;aspect-ratio:4/3}.vocab-water-card .vocab-face-content{flex:1;min-height:0;padding:8px 12px 10px}}


.vocab-bricks-stage-picture .vocab-stage-no-photo{display:none;position:absolute;inset:0;align-items:center;justify-content:center;gap:8px;flex-direction:column;background:linear-gradient(140deg,#eef5fa,#e4edf5);color:#315b79;text-align:center;padding:18px}
.vocab-bricks-stage-picture.photo-unavailable .vocab-stage-no-photo{display:flex}
.vocab-bricks-stage-picture .vocab-stage-no-photo span{font-size:60px}
.vocab-bricks-stage-picture .vocab-stage-no-photo strong{font-size:15px}
.vocab-bricks-stage-picture .vocab-stage-no-photo small{font-size:11px;color:#68798a}
.vocab-bricks-stage-picture.photo-unavailable img{display:none!important}
.vocab-flip-inner .vocab-face .vocab-picture.vocab-tomato-stage-picture{background:#fbf2e8}
.vocab-tomato-stage-picture svg.tomato-stage-svg{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain}
/* Fix the image inside the vocabulary flashcard: the former max-width:50% caused a half-sized strip. */
.vocab-flip-inner .vocab-face .vocab-picture{display:block;position:relative;flex:0 0 48%;width:48%;max-width:48%;height:100%;min-width:0;overflow:hidden;border-radius:14px;background:#edf3f8;align-self:stretch}
.vocab-flip-inner .vocab-face .vocab-picture img.vocab-real-photo-hq{display:block;width:100%;height:100%;max-width:100%;min-width:0;flex:none;object-fit:cover;object-position:center center;border-radius:0;filter:none;box-shadow:none}
.vocab-flip-inner .vocab-face .vocab-picture.vocab-excavate-clay-picture img{object-position:center center}
@media(max-width:650px){
 .vocab-flip-inner .vocab-face .vocab-picture{flex:0 0 58%;width:100%;max-width:100%;height:auto;min-height:0;align-self:stretch}
 .vocab-flip-inner .vocab-face .vocab-picture img.vocab-real-photo-hq{width:100%;height:100%;max-width:100%;object-fit:cover}
}

`;

/* =========================================================
   RENDER HELPERS
   ========================================================= */

function currentDraftKey(step){return['analysis','intro','overview','body1','body2','full'][step];}
function saveCurrentDraft(){if(state.current===0){state.drafts.analysis={type:document.getElementById('aType')?.value||'',stages:document.getElementById('aStages')?.value||'',first:document.getElementById('aFirst')?.value||'',last:document.getElementById('aLast')?.value||'',features:document.getElementById('aFeatures')?.value||'',body1:document.getElementById('aBody1')?.value||'',body2:document.getElementById('aBody2')?.value||''};}else if(state.current>=2&&state.current<=6){const box=document.getElementById('writeBox');if(box)state.drafts[currentDraftKey(state.current-1)]=box.value;}saveState();}
function templateCard(step){if(step<1||step>4)return'';const open=state.templateOpen[step]!==false;return`<div class="template-card"><div class="template-head"><div><span class="template-badge">TEMPLATE HỖ TRỢ</span><b>${STEP_NAMES[step+1]}</b></div><button type="button" class="template-toggle" id="templateToggle">${open?'Ẩn template':'Xem template'}</button></div><div class="template-body" id="templateBody" ${open?'':'hidden'}><div class="template-text">${esc(templateFor(step))}</div><div class="template-note">Em có thể dùng khung này nhưng không cần chép nguyên văn.</div></div></div>`;}
function guide(step){return['<b>Mục tiêu:</b> Nhận diện loại process, số giai đoạn, điểm đầu–cuối, đặc điểm nổi bật và tự chọn cách chia Body 1/Body 2 hợp lý.','<b>Mục tiêu:</b> Dùng template để paraphrase đề bài trong 1 câu.','<b>Mục tiêu:</b> Viết Overview gồm cấu trúc chung và đặc điểm nổi bật.','<b>Mục tiêu:</b> Viết Body 1 đúng các stage em đã chọn ở Bước 3.','<b>Mục tiêu:</b> Viết Body 2 đúng các stage em đã chọn ở Bước 3.','<b>Mục tiêu:</b> Tự viết toàn bộ bài, không dùng template.'][step];}

/* =========================================================
   MOUNT
   ========================================================= */

function mount(){const SOURCE_LINK=task.sourceUrl?`<p style="margin:8px 0 0;font-size:11px;color:#6f7890">Sơ đồ và bài tập biên soạn từ kiến thức tham khảo: <a href="${esc(task.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(task.sourceName||'Nguồn tham khảo')}</a> · Không phải đề IELTS chính thức.</p>`:'';document.head.insertAdjacentHTML('beforeend',`<style>${CSS}</style>`);document.body.innerHTML=`<header class="top"><div class="topin"><div class="left"><a class="back" href="../">← Process</a><div class="brand">${task.icon||'✍️'} ${esc(task.title)}</div></div><div id="studentInfo" class="student"></div></div></header><main class="page"><section class="hero"><div><h1>${esc(task.title)}</h1><p>Chấm 3 tầng: ngữ nghĩa · trình tự/cấu trúc · ngôn ngữ IELTS.</p></div><div class="progresswrap"><div class="prow"><span>Tiến độ</span><span id="progressText"></span></div><div class="progress"><i id="progressBar"></i></div></div></section><div class="layout"><aside class="leftcol"><section class="diagram"><div class="diagramtop"><b>Sơ đồ Process</b><span class="pill">Quan sát · phân tích</span></div><div class="imgwrap"><img src="${esc(ENGINE_ASSET_BASE+task.image)}" alt="${esc(task.title)}"><button id="zoomBtn" class="zoom" type="button">Phóng to sơ đồ ⤢</button></div><div class="prompt"><b>Đề bài:</b> ${esc(task.prompt)}${SOURCE_LINK}</div></section><section id="stepNav" class="steps"></section></aside><section id="main" class="main"></section></div></main><dialog id="imgDialog"><div class="modalhead"><b>${esc(task.title)}</b><button id="closeDialog">Đóng ✕</button></div><img class="modalimg" src="${esc(ENGINE_ASSET_BASE+task.image)}" alt="${esc(task.title)}"></dialog>`;try{const s=JSON.parse(localStorage.getItem(STUDENT_KEY)||'null');if(s?.name)document.getElementById('studentInfo').textContent=s.name+(s.className?' · '+s.className:'');}catch(e){}document.getElementById('zoomBtn').onclick=()=>document.getElementById('imgDialog').showModal();document.getElementById('closeDialog').onclick=()=>document.getElementById('imgDialog').close();}

/* =========================================================
   NAV / PROGRESS
   ========================================================= */

function renderNav(){const nav=document.getElementById('stepNav'),displayOrder=[1,7,0,2,3,4,5,6];nav.innerHTML=displayOrder.map((i,position)=>`<button class="stepbtn ${i===state.current?'active':''} ${navDone(i)?'done':''} ${!canVisit(i)?'locked':''}" ${!canVisit(i)?'disabled':''} data-step="${i}"><span class="n">${position+1}</span><span><strong>${STEP_NAMES[i]}</strong><small>${navDone(i)?'✓ Hoàn thành':!canVisit(i)?'Chưa mở':'Đang học'}</small></span></button>`).join('');nav.querySelectorAll('[data-step]').forEach(btn=>{btn.onclick=()=>{const i=Number(btn.dataset.step);if(canVisit(i)){saveCurrentDraft();state.current=i;saveState();render();}};});}
function renderProgress(){const c=Math.min(8,state.completed.length+(vocabReady()?1:0)+(quizReady()?1:0));document.getElementById('progressText').textContent=`${c}/8 bước hoàn thành`;document.getElementById('progressBar').style.width=`${c/8*100}%`;}

/* =========================================================
   STEP 2: LEARN AND LOCK A REUSABLE VOCABULARY SET
   ========================================================= */
function vocabReminder(text){
 const chosen=vocabSelection(),bank=vocabulary();if(!chosen.length)return '';
 const entries=chosen.map(i=>({term:bank[i][0],meaning:bank[i][1],used:phrasePosition(text,bank[i][0])>=0}));
 const used=entries.filter(v=>v.used).length;
 return '<section class="vocab-reminder" aria-label="Từ vựng cần vận dụng"><div class="vocab-reminder-head"><b>📘 Từ vựng cần vận dụng</b><span>'+used+'/'+entries.length+' cụm đã xuất hiện trong phần viết này</span></div>'+'<div class="vocab-chips">'+entries.map(v=>'<span class="vocab-chip '+(v.used?'used':'')+'" title="'+esc(v.meaning)+'">'+(v.used?'✓ ':'')+esc(v.term)+'</span>').join('')+'</div><p>Hãy vận dụng các cụm đúng công đoạn; có thể paraphrase phù hợp. Bài hoàn chỉnh cần dùng ít nhất '+vocabRequiredCount()+' cụm hoặc thể hiện đủ các ý tương đương.</p><button class="vocab-edit" id="editVocab" type="button">Ôn lại từ vựng</button></section>';
}

/* Contextual, progressive help: hints never affect grading or unlock conditions. */
function hintExamples(kind){
 const stages=model(),first=stages[0]?.label||vocabulary()[0][0],last=stages.at(-1)?.label||vocabulary().at(-1)[0],n=Number(task.stages||stages.length),split=Math.ceil(n/2);
 const reference=part=>String(task[part]?.reference||'').trim();
 if(kind==='vocab')return [
   'Nhìn vào sơ đồ bên trái rồi tìm các vật liệu, hành động hoặc công đoạn xuất hiện trong hình. Bấm vào từng thẻ để xem nghĩa.',
   'Bắt đầu từ những từ dễ nhận ra trên hình; sau đó thử trò chơi chọn nghĩa. Trả lời sai vẫn được thử lại và không bị trừ điểm.',
   'Gợi ý hai cụm đầu: '+vocabulary().slice(0,2).map(v=>v[0]+' = '+v[1]).join('; ')+'. Ôn hết những cụm được gợi ý cho bài học này.'
 ];
 if(kind==='analysis')return [
   'Dò theo chiều mũi tên. First stage là nơi quy trình bắt đầu, Last stage là nơi quy trình kết thúc hoặc quay lại. Chỉ cần viết cụm từ ngắn.',
   'First stage liên quan đến “'+first+'”; Last stage liên quan đến “'+last+'”. Nếu viết bằng từ đồng nghĩa phù hợp, hệ thống vẫn có thể nhận diện.',
   'Gợi ý First stage: '+(stages[0]?.ref||first)+'. Sơ đồ có '+n+' giai đoạn. Có thể thử chia Body 1: 1–'+split+' và Body 2: '+(split+1)+'–'+n+' (điều chỉnh nếu sơ đồ có nhánh).'
 ];
 if(kind==='intro')return [
   'Introduction chỉ cần 1 câu diễn đạt lại đề bài, chưa cần liệt kê tất cả giai đoạn.',
   'Có thể bắt đầu bằng “The diagram illustrates ...” hoặc “The diagram shows ...”, rồi thay đổi cách diễn đạt của tên quy trình.',
   'Ví dụ tham khảo: '+(reference('intro')||'The diagram illustrates the process shown in the figure.')+' Hãy tự diễn đạt lại bằng từ của mình.'
 ];
 if(kind==='overview')return [
   'Overview nêu dạng quy trình, điểm bắt đầu – kết thúc và 1–2 đặc điểm nổi bật; không mô tả tỉ mỉ từng máy hoặc từng hình.',
   'Tìm điểm đầu “'+first+'”, điểm cuối “'+last+'” và xác định đây là linear, cyclical hay life cycle.',
   'Ví dụ tham khảo để hiểu cách khái quát: '+(reference('overview')||'Overall, the process contains several stages from start to finish.')+'. Hãy rút gọn hoặc viết lại theo quan sát của mình.'
 ];
 if(kind==='body1'||kind==='body2'){
   const firstPart=kind==='body1',part=firstPart?'body1':'body2',plan=bodyPlan(firstPart?3:4);
   const ranges=plan?plan.label:(firstPart?'stages 1–'+split:'stages '+(split+1)+'–'+n);
   return [
     'Hãy mô tả nhóm '+ranges+' theo đúng mũi tên. Mỗi câu chỉ cần nêu sự kiện, vật liệu và thay đổi chính.',
     'Dùng từ nối như “Initially”, “Then”, “After this”, “Subsequently”. Ưu tiên bị động khi mô tả quy trình sản xuất, ví dụ “is collected” hoặc “is heated” khi phù hợp.',
     'Đọc ví dụ để tham khảo cách nối câu (không cần chép nguyên): '+(dynamicReference(firstPart?3:4)||reference(part)||'Initially, the first stage takes place. The material then moves to the following stage.')
   ];
 }
 return [
   'Chia bài hoàn chỉnh thành bốn đoạn: Introduction, Overview, Body 1 và Body 2. Đừng chép nguyên những đoạn đã viết trước đó.',
   'Dựa vào sơ đồ, kiểm tra xem đã nêu điểm đầu và kết thúc, có Overview và trình bày theo đúng thứ tự công đoạn chưa.',
   'Khung tự rà soát: “The diagram illustrates ... / Overall, ... / Initially, ... / In the later stages, ...”. Thay phần trống bằng nội dung đúng của sơ đồ.'
 ];
}
function hintPanel(kind){
 const level=Math.max(0,Math.min(3,Number(state.hintLevels?.[kind]||0)));
 const hints=hintExamples(kind),content=level?'<div class="hint-answer"><span class="hint-level">Mức '+level+'/3</span><p>'+esc(hints[level-1])+'</p></div>':'';
 return '<section class="hint-panel" aria-label="Hỗ trợ học tập"><div class="hint-top"><div><b>💡 Nếu chưa làm được</b><small>Nhận gợi ý tăng dần, không ảnh hưởng điểm</small></div><button type="button" class="hint-action" id="hintNext">'+(level===0?'Cần gợi ý?':level<3?'Gợi ý tiếp':'Xem lại gợi ý 1')+'</button></div>'+content+(level>0?'<button type="button" class="hint-hide" id="hintHide">Ẩn gợi ý</button>':'')+'</section>';
}
function attachHint(kind){
 const next=document.getElementById('hintNext'),hide=document.getElementById('hintHide');
 if(next)next.onclick=()=>{state.hintLevels=state.hintLevels||{};state.hintLevels[kind]=Math.max(1,Math.min(3,(Number(state.hintLevels[kind])||0)+1));if(state.hintLevels[kind]===3&&next.textContent==='Xem lại gợi ý 1')state.hintLevels[kind]=1;saveState();refreshHint(kind);};
 if(hide)hide.onclick=()=>{state.hintLevels[kind]=0;saveState();refreshHint(kind);};
}
function refreshHint(kind){const host=document.getElementById('hintMount');if(host){host.innerHTML=hintPanel(kind);attachHint(kind);}}

function vocabReference(){const bank=vocabulary(),chosen=vocabSelection();return '<section class="vocab-reminder"><div class="vocab-reminder-head"><b>📘 Từ vựng cần vận dụng</b><span>Gợi ý cho phần phân tích</span></div><div class="vocab-chips">'+chosen.map(i=>'<span class="vocab-chip" title="'+esc(bank[i][1])+'">'+esc(bank[i][0])+' · '+esc(bank[i][1])+'</span>').join('')+'</div><button class="vocab-edit" type="button" id="analysisEditVocab">Ôn lại từ vựng</button></section>';}
/* Step 2: mandatory independent vocabulary quiz. Correct answers unlock analysis. */
const QUIZ_QUESTIONS=6;
function renderVocabQuiz(){
 const main=document.getElementById('main'),bank=vocabulary(),q=Math.max(0,Math.min(QUIZ_QUESTIONS,Number(state.vocab.quizStep)||0));
 if(q>=QUIZ_QUESTIONS){
   main.innerHTML='<div class="ey"><span class="chip">BƯỚC 2</span><span class="counter">Mini game bắt buộc</span></div><h2>Mini game: Chọn nghĩa</h2><div class="vocab-quiz-finish"><div class="vocab-quiz-trophy" aria-hidden="true">🎉</div><h3>Hoàn thành '+QUIZ_QUESTIONS+'/'+QUIZ_QUESTIONS+' câu!</h3><p>Em đã nhận diện đúng các từ trọng tâm. Giờ có thể bắt đầu phân tích sơ đồ và vận dụng vào bài viết.</p></div><div class="actions"><button type="button" id="quizBack" class="btn">← Ôn lại thẻ</button><button type="button" id="quizRestart" class="btn">Chơi lại</button><button type="button" id="quizGoAnalysis" class="btn primary">Bước 3 · Phân tích sơ đồ →</button></div>';
   document.getElementById('quizBack').onclick=()=>goStep(1);
   document.getElementById('quizRestart').onclick=()=>{state.vocab.quizStep=0;state.vocab.quizSolved=false;state.vocab.quizWrong=0;saveState();renderVocabQuizQuestion();};
   document.getElementById('quizGoAnalysis').onclick=()=>goStep(0);
   return;
 }
 renderVocabQuizQuestion();
}
function renderVocabQuizQuestion(){
 const main=document.getElementById('main'),bank=vocabulary(),q=Math.max(0,Math.min(QUIZ_QUESTIONS-1,Number(state.vocab.quizStep)||0));
 const target=Math.floor(q*(bank.length-1)/(QUIZ_QUESTIONS-1));
 const indices=[target,(target+2)%bank.length,(target+5)%bank.length],correctPosition=(q*2+1)%3,ordered=Array(3).fill(null);ordered[correctPosition]=target;
 let cursor=0;for(const idx of indices.slice(1)){while(ordered[cursor]!==null)cursor++;ordered[cursor]=idx;}
 const reverse=q%2===1,solved=Boolean(state.vocab.quizSolved),wrong=Number(state.vocab.quizWrong||0);
 const prompt=reverse?'Chọn cụm tiếng Anh tương ứng với nghĩa sau:':'Cụm tiếng Anh dưới đây có nghĩa là gì?';
 const question=reverse?bank[target][1]:bank[target][0],option=(i)=>reverse?bank[i][0]:bank[i][1];
 main.innerHTML='<div class="ey"><span class="chip">BƯỚC 2</span><span class="counter">Mini game bắt buộc · Hoàn thành để mở Bước 3</span></div><h2>Mini game: Chọn nghĩa</h2><p class="sub">Trả lời đúng '+QUIZ_QUESTIONS+' câu để mở Phân tích sơ đồ. Nếu chọn sai, em có thể thử lại và sẽ được gợi ý.</p><section class="vocab-quiz-screen"><div class="vocab-quiz-head"><b>🎯 Câu '+(q+1)+' / '+QUIZ_QUESTIONS+'</b><span>Ôn từ vựng: '+esc(task.title)+'</span></div><div class="vocab-card-track vocab-quiz-track"><div style="width:'+((q+(solved?1:0))/QUIZ_QUESTIONS*100)+'%"></div></div><p class="vocab-quiz-copy">'+esc(prompt)+'</p><h3 class="vocab-quiz-term">'+esc(question)+'</h3><div class="vocab-quiz-options">'+ordered.map((idx,i)=>'<button type="button" class="vocab-choice '+(solved&&idx===target?'correct':'')+'" data-quiz-choice="'+i+'" '+(solved?'disabled':'')+'>'+esc(option(idx))+'</button>').join('')+'</div><div class="vocab-quiz-result" id="vocabQuizResult" aria-live="polite">'+(solved?'✓ Chính xác! '+esc(bank[target][0])+' = '+esc(bank[target][1]):wrong>=2?'Gợi ý: đáp án đúng là “'+esc(option(target))+'”. Hãy chọn đáp án để tiếp tục.':wrong>0?'Chưa đúng. Hãy thử lại.':'Chọn một đáp án để tiếp tục.')+'</div></section><div class="actions"><button type="button" class="btn" id="quizBack">← Xem lại thẻ từ</button><button type="button" class="btn primary" id="quizNext" '+(solved?'':'disabled')+'>'+(q===QUIZ_QUESTIONS-1?'Hoàn thành mini game':'Câu tiếp →')+'</button></div>';
 document.getElementById('quizBack').onclick=()=>goStep(1);
 const feedback=document.getElementById('vocabQuizResult'),next=document.getElementById('quizNext');
 main.querySelectorAll('[data-quiz-choice]').forEach(button=>button.onclick=()=>{
   if(state.vocab.quizSolved)return;
   if(ordered[Number(button.dataset.quizChoice)]===target){
     state.vocab.quizSolved=true;state.vocab.quizWrong=0;saveState();
     feedback.textContent='✓ Chính xác! '+bank[target][0]+' = '+bank[target][1]+'.';
     main.querySelectorAll('[data-quiz-choice]').forEach(other=>{other.disabled=true;if(ordered[Number(other.dataset.quizChoice)]===target)other.classList.add('correct');});
     next.disabled=false;
   }else{
     state.vocab.quizWrong=(Number(state.vocab.quizWrong)||0)+1;saveState();button.classList.add('wrong');
     feedback.textContent=state.vocab.quizWrong>=2?'Gợi ý: đáp án đúng là “'+option(target)+'”. Hãy chọn đáp án đó để tiếp tục.':'Chưa chính xác. Em có thể thử lại.';
   }
 });
 next.onclick=()=>{
   if(!state.vocab.quizSolved)return;
   state.vocab.quizStep=q+1;state.vocab.quizSolved=false;state.vocab.quizWrong=0;
   if(q===QUIZ_QUESTIONS-1)state.vocab.quizCompleted=true;
   saveState();renderNav();renderProgress();renderVocabQuiz();
 };
}

/* One focused flashcard at a time. Image context comes from the lesson's diagram,
   and the semantic pictogram changes with each word. No external image links. */
function termVisual(term){
 const t=norm(term);
 const pairs=[
  [/truck|transport|deliver|store|supermarket|migration|migrat|upstream|downstream|return/, '🚚'],
  [/sun|evaporat|heat|hot|boil|kiln|molten|melt|fire/, '🔥'],
  [/cool|rain|precipitat|water|wash|rins|river|ocean|stream|groundwater|infiltrat/, '💧'],
  [/egg|hatch|incubat|nest|spawn/, '🥚'],
  [/frog|tadpole|gills|hind leg|front leg/, '🐸'],
  [/bee|honey/, '🐝'],
  [/mosquito|aquatic larva/, '🦟'],
  [/butterfly|caterpillar|larval|moult|pupa|emergen|reproduc/, '🦋'],
  [/salmon|alevin|fry|parr|smolt/, '🐟'],
  [/turtle|juvenile/, '🐢'],
  [/sunlight|photosynthe|plant|olive|tomato|grass|biomass|tree|root|seed|leaf|leaves/, '🌱'],
  [/plastic|bottle|container|packag|label|seal|cup/, '🧴'],
  [/brick|clay|sand|gravel|rock|sediment|weather|metamorph|magma/, '🪨'],
  [/motor|roller|metal|grid|compress|crush|mix|silo|mould|mold|filter|press|centrifuge/, '⚙️'],
  [/flour|dough|noodle|disc|strip/, '🍜'],
  [/oil|pellet|raw material|organic|carbon|nitrogen|ammonium|nitrate|fossil|emission/, '🧪'],
  [/inspect|quality|control|sort|checking/, '🔎'],
  [/factory|manufactur|production|production/, '🏭']
 ];
 for(const [re,icon] of pairs)if(re.test(t))return icon;
 return '🔬';
}

/* Self-contained themed drawings: do not crop unrelated parts of a process diagram. */
function vocabScene(index,term){
 const icon=termVisual(term);
 const defs='<defs><linearGradient id="vsky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e7f5ff"/><stop offset="1" stop-color="#f5f1ff"/></linearGradient><linearGradient id="steel" x1="0" x2="1"><stop stop-color="#a9c6db"/><stop offset=".48" stop-color="#f2f7fd"/><stop offset="1" stop-color="#8baec7"/></linearGradient><linearGradient id="green" x1="0" x2="1"><stop stop-color="#14885b"/><stop offset="1" stop-color="#39b778"/></linearGradient><linearGradient id="gold" x1="0" x2="1"><stop stop-color="#ffd854"/><stop offset="1" stop-color="#eda432"/></linearGradient></defs>';
 const base='<rect width="500" height="220" fill="url(#vsky)"/><path d="M0 176 Q120 157 240 173 T500 169 L500 220 H0Z" fill="#e5eff6"/><ellipse cx="250" cy="190" rx="160" ry="13" fill="#c1d4e3" opacity=".55"/>';
 const bottle=(x,y,scale=1)=>'<g transform="translate('+x+' '+y+') scale('+scale+')"><path d="M12 7V0H27V7L34 20V68Q34 75 28 75H11Q5 75 5 68V20Z" fill="#b5e9f5" stroke="#5aaccd" stroke-width="2"/><rect x="12" y="-5" width="15" height="6" rx="2" fill="#2569a3"/><rect x="9" y="35" width="23" height="19" rx="2" fill="#fff" opacity=".8"/></g>';
 const machine=(x,y,w,h)=>'<g><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="12" fill="url(#steel)" stroke="#6f98b3" stroke-width="4"/><rect x="'+(x+16)+'" y="'+(y+16)+'" width="'+(w-32)+'" height="'+Math.max(14,h-35)+'" rx="5" fill="#587f9a" opacity=".6"/></g>';
 let art='';
 if(ID==='06'){
  switch(index){
   case 0:art='<rect x="161" y="62" width="156" height="114" rx="14" fill="url(#green)" stroke="#166849" stroke-width="5"/><rect x="148" y="52" width="182" height="18" rx="7" fill="#136d50"/><text x="238" y="139" font-size="58" text-anchor="middle" fill="white">♻</text>'+bottle(330,32,.82);break;
   case 1:art='<rect x="110" y="100" width="215" height="73" rx="12" fill="url(#gold)" stroke="#c88722" stroke-width="4"/><path d="M325 116H382L414 151V173H325Z" fill="#f5b733" stroke="#c88722" stroke-width="4"/><rect x="359" y="123" width="28" height="23" rx="4" fill="#8ac8e3"/><circle cx="169" cy="181" r="20" fill="#344960"/><circle cx="365" cy="181" r="20" fill="#344960"/><circle cx="169" cy="181" r="9" fill="#bac6d2"/><circle cx="365" cy="181" r="9" fill="#bac6d2"/><text x="225" y="149" font-size="48" fill="#fff" text-anchor="middle">♻</text>';break;
   case 2:art='<path d="M75 145L365 110L420 131L128 170Z" fill="#486c8b"/><path d="M90 140L358 108L413 125L140 157Z" fill="#93b9ca"/>'+bottle(166,98,.42)+bottle(226,84,.4)+bottle(282,75,.38)+'<circle cx="112" cy="94" r="21" fill="#f4be89"/><path d="M87 130Q115 106 142 133L153 160H80Z" fill="#1a8cad"/><rect x="87" y="67" width="48" height="15" rx="6" fill="#ffe174"/>';break;
   case 3:art='<rect x="124" y="68" width="245" height="114" rx="14" fill="#b6d9e4" stroke="#628ba1" stroke-width="5"/>'+Array.from({length:7},(_,i)=>'<path d="M'+(142+i*30)+' 72L'+(132+i*33)+' 178" stroke="#7ca6bc" stroke-width="5"/>').join('')+Array.from({length:4},(_,i)=>'<path d="M128 '+(90+i*25)+'H366" stroke="#8bb9ce" stroke-width="3"/>').join('')+'<path d="M213 67V182M284 67V182" stroke="#324f65" stroke-width="8"/>';break;
   case 4:art=machine(123,75,257,97)+'<path d="M161 74V43M227 74V43M297 74V43M360 74V43" stroke="#6a9ab6" stroke-width="11"/>'+Array.from({length:4},(_,i)=>'<path d="M'+(160+i*66)+' 49L'+(154+i*66)+' 94" stroke="#20a7de" stroke-width="6" stroke-linecap="round" stroke-dasharray="9 8"/>').join('')+'<g fill="#e4faff">'+Array.from({length:15},(_,i)=>'<circle cx="'+(153+i%5*41)+'" cy="'+(122+Math.floor(i/5)*16)+'" r="7"/>').join('')+'</g>';break;
   case 5:art='<path d="M155 47H348L307 111H197Z" fill="url(#steel)" stroke="#6c97af" stroke-width="4"/><path d="M197 111L215 153H285L307 111" fill="#679cb7"/>'+Array.from({length:34},(_,i)=>'<ellipse cx="'+(155+i%11*20)+'" cy="'+(169+Math.floor(i/11)*10)+'" rx="7" ry="5" fill="'+(i%3?'#e5f4f8':'#b7dce5')+'"/>').join('');break;
   case 6:art=machine(121,82,260,89)+'<circle cx="249" cy="120" r="35" fill="#cc8a43"/><circle cx="249" cy="120" r="25" fill="#ffcf64"/><path d="M190 80Q225 53 258 79T335 79" fill="none" stroke="#ffad35" stroke-width="7"/><path d="M381 119H432" stroke="#6687ac" stroke-width="13"/><path d="M431 119q15 0 15 18" stroke="#bddfeb" fill="none" stroke-width="9"/>';break;
   case 7:art='<rect x="129" y="90" width="247" height="63" rx="12" fill="url(#steel)" stroke="#88a4bf" stroke-width="4"/><circle cx="166" cy="154" r="25" fill="#6a8da9"/><circle cx="330" cy="154" r="25" fill="#6a8da9"/><path d="M171 131H335Q355 131 377 150L429 187H80Z" fill="#effcff" stroke="#a7d5e4" stroke-width="3" opacity=".93"/><path d="M112 166H405" stroke="white" stroke-width="5" opacity=".7"/>';break;
   default:art=bottle(128,91,1.14)+'<path d="M256 94H314L339 173H231Z" fill="#61a9d7" stroke="#3682b3" stroke-width="4"/><path d="M249 94Q285 58 324 94" fill="none" stroke="#3682b3" stroke-width="8"/><rect x="356" y="122" width="83" height="55" rx="10" fill="#cceafa" stroke="#6aa9cf" stroke-width="4"/><rect x="352" y="119" width="91" height="12" rx="5" fill="#4a91be"/>';break;
  }
 }else{
  art='<circle cx="250" cy="120" r="92" fill="#fff" opacity=".76"/><circle cx="250" cy="120" r="78" fill="#e9f4fb"/><text x="250" y="151" font-size="100" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">'+icon+'</text>';
 }
 return '<svg class="vocab-scene" role="img" aria-label="Minh họa '+esc(term)+'" viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg">'+defs+base+art+'</svg>';
}

/* Every side of a vocabulary card uses the same image. The recycling atlas
   contains nine 3×3 realistic pictures, ordered exactly like topic 06 terms. */
/* All Process lessons use the same photo-first vocabulary card standard.
   Source images are already used by the course's category covers / photo diagrams.
   A failed external image falls back to the original local diagram (never broken). */
const VOCAB_TOPIC_COVERS={"10":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sunlight_in_forest.jpg?width=960","11":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Green_corn_plants_grow_in_rows_across_a_farm_field_during_daytime.jpg?width=960","12":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Boulders_in_Joshua_Tree_National_Park.JPG?width=960","13":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Monarch_butterfly_on_a_Daisy_flower3.jpg?width=960","14":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Mosquito_on_marigold_flower.JPG?width=960","15":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sea_turtle_swimming.jpg?width=960","16":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Juvenile_Salmon_(51162380538).jpg?width=960","01":"https://static.wixstatic.com/media/3c9d79_077518200e96408a88fc70ba5eb50d4a~mv2.jpg/v1/fill/w_1000%2Ch_1000%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01/3c9d79_077518200e96408a88fc70ba5eb50d4a~mv2.jpg","02":"https://image.makewebeasy.net/makeweb/m_1920x0/WlHdXIaam/DefaultData/realistic-photo-ramen-closeup-food-photography_1.webp?v=202405291424","03":"https://shopcdnpro.grainajz.com/category/4956/1666/44d07b1765126975eb0f193fac1446dd/glass%20ketchup%20bottle%20%284%29.webp","07":"https://i.shgcdn.com/27d9b33f-5c07-4450-b2b4-0929e47c3941/-/format/auto/-/preview/3000x3000/-/quality/lighter/","08":"olive-oil-realistic-cover-20261127.webp?v=20261127-simple-v1","09":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Emerald_lake_trinity_alps.jpg?width=960","06":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Plastic_bottles_for_recycling.jpg?width=960","04":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Close-up_of_a_green_frog_sitting_on_reeds_in_a_pond.jpg?width=960","05":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Bumble_bee_on_butterfly_milkweed_(54699280126).jpg?width=960"};
const VOCAB_STAGE_PHOTOS={"07":["https://www.expoegypt.gov.eg/uploads/2020/08/5f4d435c91250.jpg","https://glassopenbook.com/img/products/eme-batch-dosing-weighting-mixing-1.jpg?v=1678898915","https://shopcdnpro.grainajz.com/category/24551/2249/7973d35509ab1e1c067002f79131ba59/glass%20furnace6.jpg","https://shopcdnpro.grainajz.com/category/24551/2249/7973d35509ab1e1c067002f79131ba59/glass%20furnace6.jpg","https://clyfglass.com/storage/1.webp","https://www.vitropackaging.com/media/1060/home1.jpg?height=600&mode=max&rnd=132108838280000000&width=1920","https://image.made-in-china.com/202f0j00oliuYysJGFcn/Annealing-Furnace-for-Glass-Bottles.webp","https://img.ihned.cz/attachment.php/550/77779550/zrho3BR2cT4Qajbx1dslOpJgyW0G9VSv/IMG_8083.jpg"],"08":["https://static.wixstatic.com/media/bb4843_ec06429d8e69444884943d96e849bc40~mv2.png/v1/fill/w_980%2Ch_980%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/bb4843_ec06429d8e69444884943d96e849bc40~mv2.png",null,"https://www.ozonotec.eu/images/blog/desinfeccion-ozono-almzara-aceitunas.webp","https://www.clementeindustry.com/wp-content/uploads/2024/04/clemente-frangitore-martelli.webp",null,null,"https://img.directindustry.com/ja/images_di/photo-g/34305-17024494.jpg","https://img.directindustry.com/ja/images_di/photo-g/34305-17024494.jpg","https://imagenes.elpais.com/resizer/v2/NWDBABZQYI2JCJ6PD3L3KTBYNY.jpg?auth=825a9fcc24091166820d32f69c5ab2bc5b7a66b716642d59d0c9aabdbd1849cd&width=1200",null]};

/* Manufacturing Bricks: one photo for each of the ten vocabulary terms.
   Never fall back to the generic bricks cover for these vocabulary cards. */
const BRICKS_VOCAB_PHOTOS=[
 ['https://www.sio-2.com/modules/ph_simpleblog/covers/49.jpg','Máy xúc khai thác đất sét đỏ','Khai thác đất sét','🚜'],
 ['https://images.squarespace-cdn.com/content/v1/5ed6a7c5ee3b3c56771721c3/1596065151580-36RRAS559RXCEC6EFO5C/IMG_7373.JPG?format=1000w','Máy xử lý đất sét qua các con lăn và bộ phận kim loại','Lưới kim loại và con lăn','⚙️'],
 ['https://img.static-rmg.be/a/view/q75/w/h/5038222/feafba660178220527d77797a510d85d-jpg.jpg','Máy trộn đất sét ẩm tại nhà máy sản xuất gạch','Trộn đất sét, cát và nước','🌀'],
 ['https://image.made-in-china.com/2f0j00iOnoJGBzSMkI/Automatic-Clay-Brick-Wire-Cut-Machine-with-High-Precise.jpg','Máy cắt dây chia đất sét thành những viên gạch','Cắt gạch bằng dây','✂️'],
 ['https://1.bp.blogspot.com/-8caEabrajS4/X6AvcbrwgtI/AAAAAAAABJE/nZZisCsUsR4cOPLVF5OkHGwbEyU9vKWcgCLcBGAsYHQ/s588/machine%2Bmoulding%2Bof%2Bbricks.JPG','Máy ép khuôn định hình gạch đất sét','Tạo hình bằng khuôn','🧰'],
 ['https://img2.tradewheel.com/uploads/images/products/9/7/small-tunnel-dryer-in-clay-brick-factory-gas-burner-red-brick-making-machine-brick-making-machinery1-0499662001623659549.jpg.webp','Lò sấy gạch công nghiệp và hệ thống băng chuyền','Sấy gạch','🌬️'],
 ['https://871416.s21i.faiusr.com/4/ABUIABAEGAAgspH3ygYonMrg2QMwgAo40AU.png','Gạch được nung ở nhiệt độ cao trong lò nung','Nung gạch','🔥'],
 ['https://www.fbm.it/public/images/storia/07E_CERIC_1_1978.jpg','Buồng làm nguội gạch với hệ thống quạt công nghiệp','Làm nguội gạch','❄️'],
 ['https://image.made-in-china.com/2f0j00KqkljEfCARBs/LDPE-Transparent-PE-Shrink-Bag-Shrink-Hood-Film-for-Pallets-with-Bricks.webp','Gạch được xếp trên pallet và bọc màng đóng gói','Đóng gói gạch','📦'],
 ['https://d27f80p8ydp5dw.cloudfront.net/blogs/img3-bricks-local-suppliers-e1768579008319.webp','Xe tải chở các pallet gạch tới công trường','Giao gạch bằng xe tải','🚚']
];

/* Tomato ketchup: ten self-contained 4:3 illustrations, one per vocabulary stage.
   These never fall back to the generic ketchup cover or any external source. */
const TOMATO_STEPS=[
 ['Hái cà chua','🍅','pick'],
 ['Phân loại cà chua','🍅','sort'],
 ['Bỏ cuống và hạt','🔪','seed'],
 ['Nghiền cà chua','⚙️','crush'],
 ['Thêm đường và giấm','🧂','add'],
 ['Đun sôi hỗn hợp','♨️','boil'],
 ['Để hỗn hợp lắng','⏳','stand'],
 ['Đóng chai tương cà','🍾','bottle'],
 ['Kiểm tra chất lượng','🔎','inspect'],
 ['Vận chuyển đến siêu thị','🚚','deliver']
];
function tomatoStageScene(index){
 const item=TOMATO_STEPS[index]||TOMATO_STEPS[0];
 const background='<rect width="780" height="580" fill="#f8eee4"/><rect width="780" height="350" fill="#fff4e9"/><rect y="350" width="780" height="230" fill="#e8d4bd"/><path d="M0 350H780" stroke="#d0a98c" stroke-width="5"/>';
 const tomato=(x,y,r=43)=>'<g transform="translate('+x+' '+y+')"><circle r="'+r+'" fill="#db3f2e" stroke="#b3241d" stroke-width="4"/><ellipse cx="'+(-r*.25)+'" cy="'+(-r*.3)+'" rx="'+(r*.2)+'" ry="'+(r*.12)+'" fill="#ffad86" opacity=".55"/><path d="M0 0l-12 -22 12 7 12 -7 -6 20 22 -8 -14 15 -16 2 -14 -9 -18 2 21 -12Z" fill="#397947"/><path d="M0 -12v-16" stroke="#36713b" stroke-width="5"/></g>';
 const bottle=(x,y,filled=true)=>'<g transform="translate('+x+' '+y+')"><path d="M-26 -110H26V-76L44 -46V105Q44 118 32 118H-32Q-44 118-44 105V-46L-26 -76Z" fill="'+(filled?'#d64b36':'#fcffff')+'" stroke="#935a49" stroke-width="6"/><rect x="-30" y="-124" width="60" height="19" rx="5" fill="#e9dcc8" stroke="#956b54" stroke-width="4"/><rect x="-37" y="-22" width="74" height="73" rx="6" fill="#fff2d4" stroke="#e2c69d" stroke-width="3"/><text x="0" y="12" text-anchor="middle" font-size="15" font-family="Arial" fill="#ac382a" font-weight="bold">TOMATO</text>'+tomato(0,28,13)+'</g>';
 const pot='<path d="M220 283H560L530 462Q525 482 506 482H274Q255 482 250 462Z" fill="#a9b8bc" stroke="#5e7e8c" stroke-width="9"/><path d="M235 283H545" stroke="#fff" stroke-width="13"/><path d="M220 322Q390 295 560 322V370Q390 345 220 370Z" fill="#d94c38"/>';
 const machine='<rect x="220" y="205" width="350" height="260" rx="25" fill="#b6ccd3" stroke="#6e94a0" stroke-width="10"/><rect x="263" y="240" width="268" height="135" rx="16" fill="#e6f3f0" stroke="#7c9ca5" stroke-width="6"/><rect x="300" y="400" width="190" height="28" rx="13" fill="#5d8b9e"/>';
 let art='';
 switch(index){
 case 0:art='<path d="M0 344Q175 292 360 336T780 330" fill="#8eb97c"/><path d="M365 70v244M250 160q105 -67 115 55M365 215q102 -100 205 -35" fill="none" stroke="#477d49" stroke-width="17"/>'+tomato(240,270,60)+tomato(366,307,59)+tomato(536,264,60)+'<path d="M520 120q80 -85 130 -8" fill="none" stroke="#457b48" stroke-width="17"/>';break;
 case 1:art='<path d="M50 340L700 340 650 430 110 430Z" fill="#8b999a" stroke="#536f78" stroke-width="9"/><path d="M75 370H670M95 408H650" stroke="#d6e1df" stroke-width="8"/>'+tomato(160,310,47)+tomato(310,310,47)+tomato(460,310,47)+tomato(600,310,38)+'<path d="M365 220v-70m0 0l-32 32m32-32l32 32" fill="none" stroke="#3979a6" stroke-width="10"/><rect x="285" y="453" width="190" height="54" rx="10" fill="#bb8b62"/>';break;
 case 2:art='<rect x="90" y="270" width="600" height="195" rx="24" fill="#ddbb8d" stroke="#ae805f" stroke-width="8"/>'+tomato(240,315,66)+'<path d="M410 240a95 95 0 1 0 0 190a95 95 0 1 0 0-190" fill="#d8402c" stroke="#a72d1d" stroke-width="5"/><path d="M410 240v190M315 335h190" stroke="#f0a675" stroke-width="8"/>'+Array.from({length:8},(_,i)=>'<ellipse cx="'+(377+(i%4)*20)+'" cy="'+(310+Math.floor(i/4)*45)+'" rx="6" ry="10" fill="#f3d5a1"/>').join('')+'<path d="M530 140l115 145 -20 16 -130-120Z" fill="#7f9ea8"/>';break;
 case 3:art=machine+'<path d="M296 270q45 -34 85 0t90 0v68q-50 48-90 0t-85 0Z" fill="#d64834"/><path d="M300 200L390 124 480 200" fill="#8da6a9" stroke="#587d86" stroke-width="8"/><circle cx="390" cy="315" r="42" fill="#a02b25" stroke="#712721" stroke-width="7"/><path d="M355 315h70M390 280v70" stroke="#fff0e0" stroke-width="9"/>';break;
 case 4:art=pot+'<path d="M135 110l100 150 -25 18 -105-155Z" fill="#e2e2d3" stroke="#8da7af" stroke-width="6"/><path d="M545 122v115h90V122Z" fill="#edf4f4" stroke="#8aa7ae" stroke-width="7"/><path d="M545 194h90v43h-90Z" fill="#e0ab5d"/><path d="M585 94v29" stroke="#947145" stroke-width="11"/><circle cx="390" cy="310" r="16" fill="#fff"/>';break;
 case 5:art=pot+'<path d="M270 515h240" stroke="#f29b39" stroke-width="32" stroke-linecap="round"/><path d="M306 528q20 48 35 0t35 0t35 0t35 0" fill="none" stroke="#dd5d2c" stroke-width="14"/><path d="M295 210q-20 -25 0 -56t0 -56M395 210q-20 -25 0 -56t0 -56M495 210q-20 -25 0 -56t0 -56" stroke="#b4afb2" stroke-width="12" fill="none" stroke-linecap="round"/>';break;
 case 6:art=pot+'<path d="M210 278H570" stroke="#6c8a93" stroke-width="18"/><circle cx="555" cy="205" r="55" fill="#fdf8e7" stroke="#728f98" stroke-width="9"/><path d="M555 205v-35m0 35l27 15" stroke="#6b7f84" stroke-width="8" stroke-linecap="round"/><path d="M225 270L390 194 550 270" fill="#94a9ae" stroke="#67818b" stroke-width="8"/>';break;
 case 7:art=bottle(270,335)+bottle(510,335)+'<path d="M100 490H680" stroke="#738e94" stroke-width="14"/><path d="M390 112v116" stroke="#7b9599" stroke-width="18"/><path d="M350 220H430" stroke="#7b9599" stroke-width="15"/><path d="M390 220l-28 35h56Z" fill="#db4f3a"/>';break;
 case 8:art=bottle(255,329)+bottle(490,329)+'<circle cx="490" cy="214" r="105" fill="none" stroke="#6e9caa" stroke-width="23"/><path d="M565 290l100 95" stroke="#477283" stroke-width="27" stroke-linecap="round"/><path d="M459 219l22 22 38-49" fill="none" stroke="#3a8b64" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>';break;
 case 9:art='<rect x="140" y="255" width="455" height="185" rx="13" fill="#dba077" stroke="#aa7254" stroke-width="9"/><path d="M150 315h438M310 255v185M460 255v185" stroke="#b78158" stroke-width="8"/><rect x="100" y="430" width="600" height="18" rx="9" fill="#8b6e55"/><rect x="465" y="330" width="230" height="110" rx="12" fill="#e3c28b" stroke="#9b795b" stroke-width="7"/><path d="M695 357h42l32 47v37h-74Z" fill="#e3c28b" stroke="#9b795b" stroke-width="7"/><circle cx="240" cy="460" r="37" fill="#4b545d"/><circle cx="666" cy="460" r="37" fill="#4b545d"/>';break;
 }
 return '<svg class="tomato-stage-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 580" role="img" aria-label="'+item[0]+'" preserveAspectRatio="xMidYMid meet">'+background+art+'</svg>';
}
/* Water Cycle: eight distinct, locally hosted 4:3 educational photos. */
const WATER_VOCAB_FILES=["01-evaporation.webp","02-condensation.webp","03-precipitation.webp","04-surface-runoff.webp","05-infiltration.webp","06-collection.webp","07-transpiration.webp","08-groundwater.webp"];
function waterVocabPhotoUrl(i){return ENGINE_ASSET_BASE+'vocab-water-hq/'+WATER_VOCAB_FILES[i];}
function vocabVisual(index,term){
 if(ID==='03'&&TOMATO_STEPS[index]){
   return '<span class="vocab-picture vocab-tomato-stage-picture">'+tomatoStageScene(index)+'<span class="vocab-image-label">'+esc(TOMATO_STEPS[index][0])+'</span></span>';
 }

 if(ID==='01'&&BRICKS_VOCAB_PHOTOS[index]){
   const [src,description,caption,emoji]=BRICKS_VOCAB_PHOTOS[index];
   return '<span class="vocab-picture vocab-bricks-stage-picture">'+
     '<img class="vocab-real-photo vocab-real-photo-hq vocab-photo" src="'+esc(src)+'" alt="'+esc(description)+'" loading="eager" decoding="async" referrerpolicy="no-referrer" width="780" height="580" onerror="this.hidden=true;this.parentNode.classList.add(\'photo-unavailable\')">'+
     '<span class="vocab-stage-no-photo" aria-hidden="true"><span>'+emoji+'</span><strong>'+esc(caption)+'</strong><small>Ảnh không tải được</small></span>'+
     '<span class="vocab-image-label">'+esc(caption)+'</span></span>';
 }

 if(ID==='09'&&WATER_VOCAB_FILES[index]){
   const src=waterVocabPhotoUrl(index),fallback='<span class="vocab-water-fallback" hidden>'+vocabScene(index,term)+'</span>';
   return '<span class="vocab-picture vocab-water-picture"><img class="vocab-real-photo vocab-real-photo-hq vocab-photo vocab-water-photo" src="'+esc(src)+'" alt="Hình minh họa '+esc(term)+' trong vòng tuần hoàn nước" width="720" height="540" loading="eager" decoding="async" referrerpolicy="no-referrer">'+fallback+'</span>';
 }

 if(ID==='06'){
   const names=['01-recycling-bins.jpg','02-collection-truck.jpg','03-sorting-bottles.jpg','04-compressing-bottles.jpg','05-crushing-washing.jpg','06-plastic-pellets.jpg','07-heating-pellets.jpg','08-raw-material.jpg','09-end-products.jpg'];
   const name=names[index];
   if(name)return '<span class="vocab-picture"><img class="vocab-real-photo vocab-real-photo-hq vocab-photo" src="'+ENGINE_ASSET_BASE+'vocab-plastic-hq/'+name+'" alt="Hình chụp minh họa '+esc(term)+'" width="780" height="580" loading="eager" decoding="async"><span class="vocab-image-label">Ảnh công đoạn</span></span>';
 }
 const stage=VOCAB_STAGE_PHOTOS[ID]?.[index],topic=VOCAB_TOPIC_COVERS[ID],src=stage||topic;
 const local=ENGINE_ASSET_BASE+String(task.image||'').split('?')[0];
 if(!src)return '<span class="vocab-picture"><img class="vocab-real-photo vocab-real-photo-hq vocab-photo vocab-diagram-fallback" src="'+esc(local)+'" alt="Sơ đồ học '+esc(term)+'" loading="eager" decoding="async"><span class="vocab-image-label">Sơ đồ học</span></span>';
 const url=src.startsWith('http')?src:ENGINE_ASSET_BASE+src;
 return '<span class="vocab-picture"><img class="vocab-real-photo vocab-real-photo-hq vocab-photo" src="'+esc(url)+'" data-fallback="'+esc(local)+'" alt="Ảnh tham khảo chủ đề '+esc(task.title)+'" loading="eager" decoding="async" referrerpolicy="no-referrer">'+(stage?'':'<span class="vocab-term-symbol" aria-hidden="true">'+termVisual(term)+'</span>')+'<span class="vocab-image-label">'+(stage?'Ảnh công đoạn':'Ảnh theo chủ đề')+'</span></span>';
}

function renderVocabulary(){
 const main=document.getElementById('main'),bank=vocabulary();
 const index=Math.min(bank.length-1,Math.max(0,Number(state.vocab.cardIndex)||0));
 const pair=bank[index],allSeen=vocabReady(),visual=vocabVisual(index,pair[0]);
 main.innerHTML='<div class="ey"><span class="chip">BƯỚC 1</span><span class="counter">Học từ vựng trước khi phân tích</span></div>'+
 '<h2>Từ vựng cần sử dụng</h2>'+
 '<p class="sub">Lật từng thẻ để học nghĩa. Sau đó hoàn thành mini game chọn nghĩa ở Bước 2 trước khi phân tích sơ đồ.</p>'+
 '<div class="guide"><b>Cách học:</b> Nhìn ảnh và cụm tiếng Anh → tự đoán nghĩa → lật thẻ kiểm tra. Xem hết các thẻ để mở mini game ở màn hình tiếp theo.</div>'+
 '<div class="vocab-single-head"><strong>Thẻ '+(index+1)+' / '+bank.length+'</strong></div>'+
 '<div class="vocab-card-track"><div style="width:'+((index+1)/bank.length*100)+'%"></div></div>'+
 '<div class="vocab-flip-perspective '+(ID==='09'?'vocab-water-card':'')+'">'+
   '<button type="button" class="vocab-flip-control" id="vocabOneCard" aria-label="Lật thẻ từ vựng" aria-pressed="false">'+
     '<span class="vocab-flip-inner">'+
       '<span class="vocab-face vocab-face-front">'+visual+
         '<span class="vocab-face-content"><span class="vocab-overline">ENGLISH · PROCESS</span>'+
         '<strong>'+esc(pair[0])+'</strong><small>Nhấn để lật thẻ xem nghĩa</small></span>'+
       '</span>'+
       '<span class="vocab-face vocab-face-back">'+visual+
         '<span class="vocab-face-content"><span class="vocab-overline">NGHĨA TIẾNG VIỆT</span>'+
         '<strong>'+esc(pair[1])+'</strong><small>'+esc(pair[0])+' · Nhấn để lật lại</small></span>'+
       '</span>'+
     '</span>'+
   '</button>'+
 '</div>'+
 
 '<div class="vocab-card-actions">'+
   '<button id="vocabBack" class="vocab-edit" type="button" '+(index===0?'disabled':'')+'>← Thẻ trước</button>'+
   '<span class="vocab-card-helper">Lật thẻ để xem nghĩa</span>'+
   '<button id="vocabForward" class="vocab-edit" type="button" '+(index===bank.length-1?'disabled':'')+'>Thẻ tiếp →</button>'+
 '</div>'+


 '<div id="vocabStatus" class="vocab-status" aria-live="polite">'+(allSeen?'Có thể chuyển sang mini game.':'Lật từng thẻ để xem nghĩa rồi chuyển sang thẻ tiếp theo.')+'</div>'+
 '<div class="actions"><button class="btn" disabled>← Bước trước</button><button id="vocabRestart" class="btn" type="button">Ôn từ đầu</button><button id="vocabNext" class="btn primary" '+(allSeen?'':'disabled')+'>Bước 2 · Mini game →</button></div>';
 const card=document.getElementById('vocabOneCard'),status=document.getElementById('vocabStatus'),next=document.getElementById('vocabNext');
 main.querySelectorAll('img.vocab-water-photo').forEach(img=>img.addEventListener('error',()=>{
   img.hidden=true;
   const fallback=img.closest('.vocab-picture')?.querySelector('.vocab-water-fallback');if(fallback)fallback.hidden=false;
 },{once:true}));
 main.querySelectorAll('img.vocab-photo[data-fallback]').forEach(img=>img.addEventListener('error',()=>{
   if(img.dataset.fallback&&img.src!==img.dataset.fallback){
     img.src=img.dataset.fallback;img.classList.add('vocab-diagram-fallback');
     const label=img.parentElement?.querySelector('.vocab-image-label');if(label)label.textContent='Sơ đồ học';
   }
 },{once:true}));
 card.onclick=()=>{
   const wasFlipped=card.classList.contains('is-flipped'),flipped=!wasFlipped,rotator=card.querySelector('.vocab-flip-inner');
   const start=wasFlipped?180:0,end=flipped?180:0;
   rotator?.getAnimations?.().forEach(animation=>animation.cancel());
   card.classList.toggle('is-flipped',flipped);
   card.setAttribute('aria-pressed',String(flipped));
   card.setAttribute('aria-label',flipped?'Mặt sau: '+pair[1]+'. Nhấn để lật lại':'Mặt trước: '+pair[0]+'. Nhấn để xem nghĩa');
   if(rotator?.animate){rotator.animate([{transform:'rotateY('+start+'deg)'},{transform:'rotateY('+end+'deg)'}],{duration:840,easing:'cubic-bezier(.2,.8,.2,1)'});}
   if(!flipped)return;
   const learned=new Set(state.vocab.seen||[]);learned.add(index);
   state.vocab.seen=[...learned].sort((a,b)=>a-b);
   if(learned.size>=bank.length){
     state.vocab.reviewedAll=true;next.disabled=false;
     status.textContent='Đã học hết thẻ. Bước tiếp theo là mini game bắt buộc.';
     renderNav();renderProgress();
   }
   saveState();
 };
 const jump=(i)=>{state.vocab.cardIndex=Math.max(0,Math.min(bank.length-1,i));saveState();renderVocabulary();};
 document.getElementById('vocabBack').onclick=()=>jump(index-1);
 document.getElementById('vocabForward').onclick=()=>jump(index+1);
 document.getElementById('vocabRestart').onclick=()=>jump(0);
 next.onclick=()=>{if(vocabReady())goStep(7);};
}

/* =========================================================
   STEP 1 UI
   ========================================================= */


/* Inline help specific to each analysis question. First hint is displayed only
   when the answer has been checked and did not pass. */
function analysisHints(id){
 const bank=vocabulary(),stages=model(),total=Number(task.stages||stages.length),half=Math.ceil(total/2);
 const first=stages[0]?.label||bank[0][0],last=stages[stages.length-1]?.label||bank[bank.length-1][0],type=expectedType();
 const firstExample=stages[0]?.ref||first,lastExample=stages[stages.length-1]?.ref||last;
 const hints={
  aType:[
   'Quan sát chiều mũi tên: đi từ đầu đến cuối là linear; lặp thành vòng là cyclical; phát triển của sinh vật là life cycle.',
   'Sơ đồ này cho thấy '+(type==='life cycle'?'sự phát triển của một sinh vật':type==='cyclical'?'một chu trình có thể quay lại điểm đầu':'các công đoạn thực hiện tuần tự')+'.',
   'Dạng phù hợp: '+(type==='life cycle'?'Life Cycle':type==='cyclical'?'Cyclical':'Linear')+'.'
  ],
  aStages:[
   'Đếm các công đoạn hoặc thay đổi chính được ghi trên sơ đồ. Đừng đếm từng chi tiết nhỏ trong cùng một bước.',
   'Hãy đi theo mũi tên từ điểm bắt đầu và đánh dấu mỗi công đoạn chính một lần.',
   'Bài này có '+total+' giai đoạn chính.'
  ],
  aFirst:[
   'Nhìn nơi mũi tên bắt đầu. Chỉ cần tên công đoạn hoặc cụm từ ngắn, không bắt buộc viết thành câu.',
   'Công đoạn đầu liên quan đến "'+first+'". Hãy tìm từ tương ứng trong bộ từ vừa học.',
   'Ví dụ tham khảo: '+firstExample+'. Có thể trả lời bằng cụm từ ngắn.'
  ],
  aLast:[
   'Tìm bước cuối cùng trước khi quy trình kết thúc hoặc quay lại điểm đầu.',
   'Bước cuối liên quan đến "'+last+'". Cân nhắc dùng đúng cụm từ trong sơ đồ.',
   'Ví dụ tham khảo: '+lastExample+'.'
  ],
  aFeatures:[
   'Nêu ít nhất 3 công đoạn hoặc chuyển biến đáng chú ý, không cần viết đoạn văn hoàn chỉnh.',
   'Bạn có thể chọn từ các bước như '+stages.slice(1,4).map(v=>v.label).join(', ')+'.',
   'Gợi ý: '+stages.slice(1,4).map(v=>v.ref||v.label).join(' ')+' Hãy diễn đạt bằng từ của mình.'
  ],
  aBody1:[
   'Body 1 nên mô tả một nhóm bước liên tiếp. Nhập dạng khoảng, ví dụ 1-4.',
   'Thử bắt đầu từ stage 1 rồi kết thúc ở gần giữa sơ đồ, để Body 2 có phần còn lại.',
   'Có thể thử nhập 1-'+half+' và điều chỉnh theo cách chia hợp lý của sơ đồ.'
  ],
  aBody2:[
   'Body 2 phải tiếp nối Body 1 và không trùng số bước. Nhập dạng khoảng, ví dụ 5-9.',
   'Nếu Body 1 dừng ở bước k, Body 2 nên bắt đầu ở k+1 và đi đến bước cuối.',
   'Nếu chia Body 1 là 1-'+half+', bạn có thể thử Body 2 là '+(half+1)+'-'+total+'.'
  ]
 };
 return hints[id]||['Quan sát lại sơ đồ và từ vựng đã học.','Kiểm tra câu trả lời theo mũi tên và các nhãn trong hình.','Thử diễn đạt bằng một cụm từ ngắn đúng nội dung sơ đồ.'];
}

function inlineFeedback(id,a){
 const el=document.getElementById(id),holder=el?.parentElement?.querySelector('.inline-feedback');
 if(!holder)return;
 holder.className='inline-feedback show '+(a.ok?'pass':'fail');
 if(a.ok){holder.innerHTML='<div class="inline-state">✓ Đạt</div><div>'+esc(a.hint)+'</div>';return;}
 const levels=state.fieldHintLevels||{},level=Math.min(3,Math.max(1,Number(levels[id]||1))),hints=analysisHints(id);
 holder.innerHTML='<div class="inline-state">✕ Chưa đạt</div><div>'+esc(a.hint)+'</div><div class="inline-hint"><div class="inline-hint-head"><b>💡 Gợi ý '+level+'/3</b><button type="button" class="inline-hint-next">'+(level<3?'Gợi ý rõ hơn':'Xem lại gợi ý 1')+'</button></div><p>'+esc(hints[level-1])+'</p></div>';
 holder.querySelector('.inline-hint-next').onclick=()=>{state.fieldHintLevels=state.fieldHintLevels||{};state.fieldHintLevels[id]=level===3?1:level+1;saveState();inlineFeedback(id,a);};
}
function renderAnalysis(){const d=state.drafts.analysis,main=document.getElementById('main');main.innerHTML=`<div class="ey"><span class="chip">BƯỚC 3</span><span class="counter">Phân tích sau khi học và ôn từ vựng</span></div><h2>Phân tích sơ đồ</h2><p class="sub">Dựa vào sơ đồ và bộ từ vừa học để nhận diện các công đoạn. Kết quả sẽ hiển thị ngay dưới từng mục.</p><div class="guide">${guide(0)}</div>${vocabReference()}<div class="formgrid"><div class="field"><label>Process thuộc dạng nào?</label><select id="aType"><option value="">— Chọn —</option><option>Linear</option><option>Cyclical</option><option>Life Cycle</option></select><div class="inline-feedback"></div></div><div class="field"><label>Có bao nhiêu main stages?</label><input id="aStages" placeholder="Nhập số giai đoạn em xác định"><div class="inline-feedback"></div></div><div class="field"><label>First stage là gì?</label><small class="vocab-field-hint">Có thể viết một cụm từ ngắn đã học, không cần cả câu.</small><textarea id="aFirst" placeholder="Nhập công đoạn bắt đầu"></textarea><div class="inline-feedback"></div></div><div class="field"><label>Last / return stage là gì?</label><textarea id="aLast" placeholder="Nhập công đoạn cuối / quay lại"></textarea><div class="inline-feedback"></div></div><div class="field" style="grid-column:1/-1"><label>Important features là gì?</label><textarea id="aFeatures" placeholder="Nêu các đặc điểm/công đoạn nổi bật..."></textarea><div class="inline-feedback"></div></div><div class="field"><label>Em chọn Body 1 gồm những stage nào?</label><textarea id="aBody1" placeholder="Nhập nhóm stage em chọn cho Body 1"></textarea><div class="inline-feedback"></div></div><div class="field"><label>Em chọn Body 2 gồm những stage nào?</label><textarea id="aBody2" placeholder="Nhập nhóm stage em chọn cho Body 2"></textarea><div class="inline-feedback"></div></div></div><div class="actions"><button id="analysisPrev" class="btn">← Mini game</button><button id="checkBtn" class="btn primary">Kiểm tra Bước 3 ✓</button><button id="nextBtn" class="btn" ${isDone(0)?'':'disabled'}>Bước tiếp →</button></div><div id="feedback" class="feedback"></div>`;
  for(const[id,k]of Object.entries({aType:'type',aStages:'stages',aFirst:'first',aLast:'last',aFeatures:'features',aBody1:'body1',aBody2:'body2'}))document.getElementById(id).value=d[k]||'';
  main.querySelectorAll('input,textarea,select').forEach(el=>{el.addEventListener('input',saveCurrentDraft);el.addEventListener('change',saveCurrentDraft);});document.getElementById('checkBtn').onclick=checkAnalysis;document.getElementById('analysisPrev').onclick=()=>goStep(7);document.getElementById('analysisEditVocab').onclick=()=>goStep(1);document.getElementById('nextBtn').onclick=()=>goStep(2);if(state.scores[0])showAnalysisResult(state.scores[0]);
}
function checkAnalysis(){saveCurrentDraft();state.attempts[0]=attempts(0)+1;const a=assessAnalysis(),list=[a.type,a.stages,a.first,a.last,a.features,a.body1,a.body2],passed=list.filter(x=>x.ok).length,result={assessments:a,passed,total:Math.round(passed/7*100),completed:passed===7};state.scores[0]=result;if(result.completed)markDone(0);else invalidateFrom(0);saveState();showAnalysisResult(result);renderNav();renderProgress();const next=document.getElementById('nextBtn');if(next)next.disabled=!isDone(0);}
function showAnalysisResult(result){const a=result.assessments||assessAnalysis(),map={aType:'type',aStages:'stages',aFirst:'first',aLast:'last',aFeatures:'features',aBody1:'body1',aBody2:'body2'};Object.entries(map).forEach(([id,k])=>inlineFeedback(id,a[k]));const f=document.getElementById('feedback');if(!f)return;f.className='feedback show';f.innerHTML=`<div class="scorebar"><div><div class="score">${result.total}/100</div><div class="status ${result.completed?'good':'warn'}">${result.completed?'✓ Hoàn thành Bước 3':'Xem các mục Chưa đạt phía trên'}</div></div><div class="counter">Đạt ${result.passed??Object.values(a).filter(x=>x.ok).length}/7 mục</div></div>`;}

/* =========================================================
   WRITING UI
   ========================================================= */


function writingIssueHints(step,issue){
 const normalized=norm(issue),stageList=model(),first=stageList[0]?.label||vocabulary()[0][0],last=stageList.at(-1)?.label||vocabulary().at(-1)[0];
 const section=['','intro','overview','body1','body2','full'][step]||'full',common=hintExamples(section);
 if(/doi tuong chinh|chu de/.test(normalized))return ['Xem lại tên đề bài và viết đúng chủ đề của sơ đồ.','Chủ đề của bài này là '+task.title+'.','Ví dụ mở đầu phù hợp: '+(task.intro?.reference||task.prompt)];
 if(/diagram|figure/.test(normalized))return ['Câu Introduction cần thể hiện bạn đang mô tả một sơ đồ.','Hãy đưa từ “diagram” hoặc “figure” vào câu.','Gợi ý cách mở: “The diagram illustrates ...”.'];
 if(/illustrates|shows|depicts/.test(normalized))return ['Bạn cần một động từ giới thiệu nội dung hình.','Thử dùng shows, illustrates hoặc depicts.','Cụm mẫu: “The diagram illustrates the stages involved in ...”.'];
 if(/process\/life cycle/.test(normalized))return ['Xác định sơ đồ thể hiện quy trình hay vòng đời.','Thử dùng “process”, “production”, “recycling” hoặc “life cycle” cho đúng chủ đề.','Ví dụ: '+(task.intro?.reference||task.prompt)];
 if(/150 tu|it nhat 150|bai hien co/.test(normalized))return ['Bài Task 1 cần ít nhất 150 từ; kiểm tra xem đoạn nào còn quá ngắn.','Mở rộng phần Body bằng thông tin thực tế trong sơ đồ, tránh thêm ý không có trong hình.','Rà soát đủ Introduction, Overview, Body 1 và Body 2; thêm các công đoạn còn thiếu thay vì lặp câu.'];
 if(/tong quan|overview|overall/.test(normalized))return ['Overview phải khái quát điểm nổi bật, không chỉ lặp lại đề bài.','Hãy thử bắt đầu bằng “Overall, ...” rồi nêu điểm đầu và điểm cuối.','Câu tham khảo: '+(task.overview?.reference||'Overall, the diagram shows the main stages of the process.')];
 if(/diem bat dau/.test(normalized))return ['Bài cần nói rõ quy trình bắt đầu bằng gì.','Giai đoạn đầu liên quan đến “'+first+'”.','Thử diễn đạt: '+(stageList[0]?.ref||first)];
 if(/diem ket thuc/.test(normalized))return ['Bài cần chỉ rõ điểm kết thúc hoặc điểm quay lại trong chu trình.','Giai đoạn cuối liên quan đến “'+last+'”.','Tham khảo: '+(stageList.at(-1)?.ref||last)];
 if(/thieu|stage/.test(normalized))return ['So sánh từng công đoạn đã viết với các mũi tên trong sơ đồ.','Ưu tiên bổ sung giai đoạn được ghi trong phản hồi, theo đúng thứ tự.','Gợi ý cách nối: “After this, ...” hoặc “The next stage involves ...”. Đưa nội dung công đoạn thực tế vào chỗ trống.'];
 if(/thu tu|sequence|trinh tu/.test(normalized))return ['Dò lại các mũi tên và thứ tự các hành động trên sơ đồ.','Dùng từ nối như Initially, Subsequently, After that và Finally cho đúng trình tự.','Thử viết lại theo nhóm bước đã chia ở phần Phân tích sơ đồ, tránh đảo thứ tự công đoạn.'];
 if(/ngu phap|chinh ta|grammar|spelling/.test(normalized))return ['Đọc lại phần được nhận xét và kiểm tra chính tả, chia động từ.','Quy trình sản xuất thường dùng bị động “is/are + V3”; hiện tượng tự nhiên có thể dùng chủ động.','Ví dụ: “The bottles are collected.” / “Water evaporates.” Hãy chọn cấu trúc phù hợp với nội dung bài.'];
 if(/doan|paragraph/.test(normalized))return ['Kiểm tra bố cục: các phần cần được ngắt đoạn rõ ràng.','Thông thường Task 1 có 4 đoạn: Introduction, Overview, Body 1, Body 2.','Đặt mỗi phần ở một đoạn riêng bằng Enter, không cần thêm tiêu đề vào bài.'];
 return common;
}
function renderWritingIssues(step,result){
 const holder=document.getElementById('writingInlineGuide');if(!holder)return;
 if(result.completed){holder.innerHTML='';return;}
 const errors=(result.issues?.length?result.issues:['Bài chưa đạt ngưỡng hoàn thành. Hãy kiểm tra lại nội dung, cấu trúc và độ chính xác của các công đoạn.']);
 holder.innerHTML='<div class="writing-hints-head"><b>💡 Gợi ý sửa ngay dưới bài viết</b><span>'+errors.length+' mục cần xem lại</span></div>'+errors.map((issue,i)=>{
   const key=step+'-'+i,level=Math.max(1,Math.min(3,Number(state.writeHintLevels?.[key]||1))),hint=writingIssueHints(step,issue)[level-1];
   return '<section class="writing-hint-item"><div class="writing-hint-issue">✕ '+esc(issue)+'</div><div class="writing-hint-advice"><span>Gợi ý '+level+'/3</span><p>'+esc(hint)+'</p></div><button type="button" class="inline-hint-next" data-write-hint="'+i+'">'+(level<3?'Gợi ý rõ hơn':'Xem lại gợi ý 1')+'</button></section>';
 }).join('');
 holder.querySelectorAll('[data-write-hint]').forEach(button=>button.onclick=()=>{const idx=Number(button.dataset.writeHint),key=step+'-'+idx;state.writeHintLevels=state.writeHintLevels||{};const cur=Number(state.writeHintLevels[key]||1);state.writeHintLevels[key]=cur>=3?1:cur+1;saveState();renderWritingIssues(step,result);});
}

function renderWriting(step){const main=document.getElementById('main'),full=step===5,draft=state.drafts[currentDraftKey(step)]||'';main.innerHTML=`<div class="ey"><span class="chip">BƯỚC ${step+3}</span><span class="counter">${STEP_NAMES[step+1]}</span></div><h2>${STEP_NAMES[step+1]}</h2><p class="sub">${full?'Viết lại toàn bộ bài từ đầu. Chỉ dùng sơ đồ bên trái.':'Viết phần này dựa trên sơ đồ, kết quả phân tích và template hỗ trợ.'}</p><div class="guide">${guide(step)}</div>${vocabReminder(draft)}${full?`<div class="independent-card"><b>✍️ Bước tự viết — không còn template</b><p>Hãy tự viết Introduction, Overview, Body 1 và Body 2.</p></div>`:templateCard(step)}<div class="writehead"><span>Bài viết của em</span><span id="wordCount" class="wc">0 từ</span></div><textarea id="writeBox" class="write ${full?'full':''}" placeholder="${full?'Tự viết bài hoàn chỉnh tại đây...':'Viết '+esc(STEP_NAMES[step+1])+' tại đây...'}">${esc(draft)}</textarea><div id="writingInlineGuide" class="writing-inline-guide"></div><div class="actions"><button id="prevBtn" class="btn">← Bước trước</button><button id="checkBtn" class="btn primary">Kiểm tra & chữa Bước ${step+3} ✓</button><button id="nextBtn" class="btn" ${isDone(step)&&step<5?'':'disabled'}>${step===5?'Hoàn tất':'Bước tiếp →'}</button></div><div id="feedback" class="feedback"></div><div id="finalDone"></div>`;
  if(step>=1&&step<=4){const toggle=document.getElementById('templateToggle');if(toggle)toggle.onclick=()=>{state.templateOpen[step]=!state.templateOpen[step];saveState();document.getElementById('templateBody').hidden=!state.templateOpen[step];toggle.textContent=state.templateOpen[step]?'Ẩn template':'Xem template';};}
  const box=document.getElementById('writeBox'),wc=document.getElementById('wordCount'),update=()=>{wc.textContent=`${wordCount(box.value)} từ`;const reminder=document.querySelector('.vocab-reminder');if(reminder){const temp=document.createElement('div');temp.innerHTML=vocabReminder(box.value);reminder.replaceWith(temp.firstElementChild);document.getElementById('editVocab').onclick=()=>goStep(1);}};update();box.addEventListener('input',()=>{state.drafts[currentDraftKey(step)]=box.value;saveState();const hintArea=document.getElementById('writingInlineGuide');if(hintArea)hintArea.innerHTML='';update();});document.getElementById('prevBtn').onclick=()=>goStep(step);document.getElementById('checkBtn').onclick=()=>checkWriting(step);document.getElementById('nextBtn').onclick=()=>{if(step<5)goStep(step+2);};if(state.scores[step])showWritingResult(step,state.scores[step]);
}
function checkWriting(step){saveCurrentDraft();state.attempts[step]=attempts(step)+1;const result=grade(step,state.drafts[currentDraftKey(step)]||'');state.scores[step]=result;if(result.completed)markDone(step);else invalidateFrom(step);saveState();showWritingResult(step,result);renderNav();renderProgress();const next=document.getElementById('nextBtn');if(next&&step<5)next.disabled=!isDone(step);}
function showWritingResult(step,r){const f=document.getElementById('feedback');if(!f)return;const p=(step===3||step===4)?bodyPlan(step):null,reference=(step===3||step===4)?(r.reference||dynamicReference(step)):null,showRef=step<5&&!r.completed&&attempts(step)>=2&&reference;const breakdown=(r.breakdown||[]).map(x=>`<li><b>${esc(x.label)}: ${x.score}/${x.max}</b>${x.note?' — '+esc(x.note):''}</li>`).join(''),issues=(r.issues||[]).map(x=>`<li>${esc(x)}</li>`).join('');f.className='feedback show';f.innerHTML=`<div class="scorebar"><div><div class="score">${r.total}/100</div><div class="status ${r.completed?'good':r.total>=70?'warn':'bad'}">${r.completed?'✓ Hoàn thành bước này':r.total>=70?'Gần đạt — sửa thêm':'Cần chỉnh lại'}</div></div><div class="counter">Lần kiểm tra: ${attempts(step)}</div></div><div class="detail"><b>Chấm theo 3 tầng:</b><ul>${breakdown}</ul></div><div class="detail ${r.completed?'goodbox':r.total<60?'badbox':''}"><b>${r.completed?'Phần này đạt yêu cầu.':'Các mục cần sửa và gợi ý đã hiển thị ngay dưới ô viết.'}</b>${r.completed?' Nội dung, cấu trúc và trình tự chính phù hợp.':''}</div>${showRef?`<div class="reference"><b>${p?`Bài mẫu theo cách chia em đã chọn (${p.label}):`:'Bài tham khảo:'}</b><div class="reference-answer notranslate" translate="no" lang="en">${esc(reference)}</div></div>`:''}`;renderWritingIssues(step,r);if(step===5&&r.completed)document.getElementById('finalDone').innerHTML=`<div class="finaldone"><h3>🎉 Hoàn thành ${esc(task.title)}</h3><p>Em đã hoàn thành đủ 8 bước.</p></div>`;}

function repairRecyclingOverview(){if(ID!=='06')return;const r=state.scores[2];if(!r||!(r.issues||[]).some(x=>/Đây là linear process, không phải cyclical process/.test(x)))return;const text=state.drafts.overview||'';if(!text.trim())return;state.scores[2]=gradeOverview(text);if(state.scores[2].completed&&!isDone(2))state.completed=[...new Set([...state.completed,2])].sort((a,b)=>a-b);saveState();}

/* =========================================================
   NAVIGATION
   ========================================================= */

function goStep(i){saveCurrentDraft();if(!canVisit(i))return;state.current=i;saveState();render();window.scrollTo({top:0,behavior:'smooth'});}
function render(){renderNav();renderProgress();if(state.current===1)renderVocabulary();else if(state.current===7)renderVocabQuiz();else if(state.current===0)renderAnalysis();else renderWriting(state.current-1);}

/* =========================================================
   START
   ========================================================= */

try{loadState();repairRecyclingOverview();restorePassingWritingScores();mount();state.current=canVisit(Number(state.current))?Number(state.current):1;render();}
catch(err){console.error('PROCESS ENGINE FATAL ERROR:',err);document.body.innerHTML=`<div style="max-width:900px;margin:60px auto;padding:24px;font-family:Arial,sans-serif;border:1px solid #efc8ce;border-radius:16px;background:#fff6f7;color:#7d2634"><h2 style="margin-top:0">Không thể tải bài Process</h2><p>JavaScript gặp lỗi khi khởi tạo. Mở DevTools → Console để xem lỗi chi tiết.</p><pre style="white-space:pre-wrap;background:#fff;padding:12px;border-radius:8px">${esc(String(err?.message||err))}</pre></div>`;}

})();
