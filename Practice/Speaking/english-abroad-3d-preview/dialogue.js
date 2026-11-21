// Life Abroad — offline, speaking-first café conversation.
// No grading, timers, error logging, or microphone audio uploads.
// Chrome/Edge may use a browser-provided recognition service; users opt in explicitly.
const $=id=>document.getElementById(id);
const cafeWords=[
 {word:'latte',meaning:'cà phê latte',example:'Could I have a latte, please?'},
 {word:'takeaway',meaning:'mang đi',example:'Can I get it takeaway?'},
 {word:'receipt',meaning:'hóa đơn',example:'Could I have a receipt?'},
 {word:'oat milk',meaning:'sữa yến mạch',example:'Do you have oat milk?'},
 {word:'medium',meaning:'cỡ vừa',example:'A medium coffee, please.'},
 {word:'change',meaning:'tiền thối',example:'Here is your change.'}
];
const lines=[
 {text:"Hi there! Welcome to the Bluebird Café. What would you like to drink?",hint:"Chào mừng! Bạn muốn uống gì?",suggestions:["Could I have a latte, please?","I'd like a hot chocolate, please.","What do you recommend?"]},
 {text:"Of course! Would you like a small, medium or large drink?",hint:"Chọn kích cỡ: nhỏ, vừa hay lớn.",suggestions:["A medium one, please.","Small is fine, thank you.","Could I have a large one?"]},
 {text:"Lovely! Would you like regular milk or oat milk?",hint:"Chọn sữa thường hoặc sữa yến mạch.",suggestions:["Regular milk, please.","Do you have oat milk?","No milk, thank you."]},
 {text:"Sure! Is that for here or takeaway?",hint:"Bạn uống tại quán hay mang đi?",suggestions:["For here, please.","Takeaway, please.","I'd like to sit here."]},
 {text:"Perfect. Your drink is £3.50. Would you like a receipt?",hint:"Đồ uống giá £3.50. Bạn có muốn hóa đơn không?",suggestions:["Yes, a receipt, please.","No, thank you.","Can I pay by card?"]},
 {text:"Thank you! Your drink will be ready shortly. Have a lovely day!",hint:"Cảm ơn! Đồ uống sẽ sớm sẵn sàng.",suggestions:["Thank you!","Have a nice day!","Cheers!"]}
];
function findWords(text){const t=text.toLowerCase();return cafeWords.filter(w=>t.includes(w.word.toLowerCase()))}
export function setupCafeDialogue({onTalking=()=>{},onClose=()=>{}}={}){
 const root=$('dialoguePanel'),message=$('npcSpeech'),input=$('studentReply'),tips=$('dialogueHints'),choices=$('dialogueSuggestions');
 const status=$('dialogueStatus'),words=$('dialogueWords'),mic=$('dialogueMic'),submit=$('dialogueSend');
 const VoiceRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 let open=false,turn=0,speaking=false,recognizing=false,rec=null,wordsSeen=new Set(),history=[];
 const announce=t=>{status.textContent=t;};
 const safe=str=>String(str||'').slice(0,500);
 const renderWords=(line)=>{
  const found=findWords(line);
  for(const w of found)wordsSeen.add(w.word);
  words.replaceChildren();
  for(const word of cafeWords.filter(w=>wordsSeen.has(w.word))){
   const button=document.createElement('button');button.type='button';button.className='dialogue-vocab';
   button.textContent=word.word;
   button.title=word.meaning+' · '+word.example;
   button.onclick=()=>{tips.textContent=word.word+' = '+word.meaning+' · '+word.example;};
   words.append(button);
  }
 };
 function speak(text,slow=false){
  if(!('speechSynthesis' in window)){announce('Trình duyệt không hỗ trợ đọc tiếng Anh.');return}
  window.speechSynthesis.cancel();
  const utter=new SpeechSynthesisUtterance(text);utter.lang='en-GB';utter.rate=slow?.76:.92;utter.pitch=1.04;
  utter.onstart=()=>{speaking=true;onTalking(true)};
  utter.onend=()=>{speaking=false;onTalking(false)};
  utter.onerror=()=>{speaking=false;onTalking(false)};
  window.speechSynthesis.speak(utter);
 }
 function showLine(line){
  message.textContent=line.text;
  tips.textContent=line.hint;
  choices.replaceChildren();
  for(const suggestion of line.suggestions){
   const b=document.createElement('button');b.type='button';b.className='dialogue-suggestion';b.textContent=suggestion;
   b.onclick=()=>{input.value=suggestion;input.focus();};choices.append(b);
  }
  renderWords(line.text);announce('NPC: Mia · Barista');speak(line.text);
 }
 function start(){
  open=true;turn=0;history=[];wordsSeen=new Set();
  root.hidden=false;document.body.classList.add('dialogue-active');
  input.value='';$('dialoguePrivacy').hidden=localStorage.getItem('lifeAbroadMicNotice')==='1';
  showLine(lines[0]);input.focus();
 }
 function close(){
  open=false;root.hidden=true;document.body.classList.remove('dialogue-active');
  if(rec&&recognizing){try{rec.abort()}catch(_){}}recognizing=false;
  window.speechSynthesis?.cancel();speaking=false;onTalking(false);
  onClose();
 }
 function reply(){
  if(!open)return;
  const text=safe(input.value).trim();
  if(!text){announce('Gõ hoặc nói một câu tiếng Anh trước khi gửi.');return}
  history.push({role:'student',text});
  renderWords(text);input.value='';
  turn++;
  if(turn>=lines.length){
   message.textContent='Great chatting with you! You can explore more or start another conversation anytime.';
   tips.textContent='Cuộc trò chuyện đã hoàn thành. Không có điểm số hay đánh giá.';
   choices.replaceChildren();announce('Đã hoàn thành cuộc trò chuyện!');
   try{window.parent?.postMessage({type:'conversationFinished',npcId:'bluebird-barista',topicId:'cafe',wordsUsed:[...wordsSeen]},location.origin)}catch(_){}
   return;
  }
  // Keyword-sensitive, friendly offline script; no judgement or correctness scoring.
  const lower=text.toLowerCase();
  const next={...lines[turn]};
  if(turn===1&&/tea|chocolate|juice/.test(lower))next.text="That sounds lovely! "+lines[turn].text;
  if(turn===2&&/large|small/.test(lower))next.text="No problem at all. "+lines[turn].text;
  if(turn===3&&/oat/.test(lower))next.text="Oat milk is a great choice! "+lines[turn].text;
  if(turn===4&&/takeaway|takeout/.test(lower))next.text="I'll get a takeaway cup for you. "+lines[turn].text;
  history.push({role:'npc',text:next.text});showLine(next);
 }
 function listen(){
  if(!open)return;
  if(!VoiceRecognition){announce('Trình duyệt không hỗ trợ nhận giọng nói. Bạn có thể gõ câu trả lời.');return}
  if(recognizing){rec.stop();return}
  $('dialoguePrivacy').hidden=true;try{localStorage.setItem('lifeAbroadMicNotice','1')}catch(_){}
  rec=new VoiceRecognition();rec.lang='en-GB';rec.continuous=false;rec.interimResults=true;rec.maxAlternatives=1;
  rec.onstart=()=>{recognizing=true;mic.textContent='■ Dừng nghe';announce('🎙 Đang nghe... Hãy nói tiếng Anh.')};
  rec.onresult=e=>{let transcript='';for(let i=e.resultIndex;i<e.results.length;i++)transcript+=e.results[i][0].transcript+' ';input.value=transcript.trim();};
  rec.onerror=e=>announce('Micro: '+(e.error==='not-allowed'?'Chưa được cấp quyền. Hãy dùng nhập chữ.':'Không nhận được giọng nói; hãy thử lại hoặc gõ chữ.'));
  rec.onend=()=>{recognizing=false;mic.textContent='🎙 Nói';if(input.value.trim())announce('Kiểm tra câu được nhận dạng rồi nhấn Gửi.')};
  try{rec.start()}catch(_){announce('Không khởi động được micro. Vui lòng gõ câu trả lời.')}
 }
 $('dialogueClose').onclick=close;
 $('dialogueSend').onclick=reply;
 $('dialogueMic').onclick=listen;
 $('dialogueReplay').onclick=()=>speak(message.textContent);
 $('dialogueSlow').onclick=()=>speak(message.textContent,true);
 $('dialogueHelp').onclick=()=>{tips.hidden=false;announce('Gợi ý tiếng Việt đã hiển thị.')};
 $('dialogueSkip').onclick=()=>{turn=Math.min(lines.length-1,turn+1);showLine(lines[turn]);};
 input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();reply()}});
 $('dialoguePrivacyConfirm').onclick=()=>{$('dialoguePrivacy').hidden=true;try{localStorage.setItem('lifeAbroadMicNotice','1')}catch(_){};listen()};
 $('dialoguePrivacyCancel').onclick=()=>{$('dialoguePrivacy').hidden=true};
 return {start,close,isOpen:()=>open,isTalking:()=>speaking,history:()=>history.slice()};
}
