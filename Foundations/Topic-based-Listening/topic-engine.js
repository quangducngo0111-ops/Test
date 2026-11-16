/* Topic-based Listening: lesson navigation, native speech controls and generated video visualization. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const data=window.SMARTCOM_TOPIC_LISTENING||[],grader=window.SmartcomDictationGrader;
if(!grader||!data.length){const node=$('topics');if(node)node.textContent='Không tải được nội dung học. Hãy tải lại trang.';return}
const states=['topicsView','lessonsView','exerciseView'];
const params=new URLSearchParams(location.search);
let topic=-1,lesson=-1,sentence=0,correct=new Set(),showAll=false;
const sentences=()=>data[topic].lessons[lesson].text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(x=>x.trim()).filter(Boolean)||[];
const item=()=>data[topic].lessons[lesson];
const subject=()=>data[topic];
const getScope=()=>{try{const x=JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null');return x?.name&&x.className?(x.name+'|'+x.className).toLowerCase():'guest'}catch{return 'guest'}};
const storageKey=()=> 'SC_TOPIC_DICTATION_V3_'+getScope();
const completed=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'{}')}catch{return {}}};
function saveProgress(){try{const all=completed();all[subject().id+'-'+item().id]={correct:correct.size,total:sentences().length,completed:correct.size===sentences().length,date:new Date().toISOString()};localStorage.setItem(storageKey(),JSON.stringify(all))}catch(e){}}
function done(t,l){return Boolean(completed()[t.id+'-'+l.id]?.completed)}
const scene=window.SmartcomLessonScene.create($('sceneCanvas'),$('sceneCaption'));
const player={cursor:0,mode:'idle',paused:false,serial:0,speech:null,rate:.9};
function canSpeak(){return 'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined'}
function textStatus(msg){$('audioStatus').textContent=msg}
function controls(){const n=lesson>=0?sentences().length:1;
 $('seek').max=String(Math.max(0,n-1));$('seek').value=String(Math.min(player.cursor,n-1));
 $('seekLabel').textContent='Câu '+(player.cursor+1)+' / '+n;
 $('playAll').textContent=player.mode==='playing'?'⏸ Tạm dừng':player.mode==='paused'?'▶ Tiếp tục':'▶ Nghe toàn bài';
 $('listenSentence').textContent='🔊 Nghe câu '+(sentence+1);
 $('audioBack').disabled=player.cursor===0;
 $('audioForward').disabled=player.cursor>=n-1;
}
function stopAudio(){
 player.serial++;player.mode='idle';player.paused=false;
 if(canSpeak())window.speechSynthesis.cancel();controls();textStatus('Sẵn sàng nghe');
 scene?.setSentence(lesson>=0?sentences()[player.cursor]:'',player.cursor);
}
function changeCursor(value,autoplay=false){
 const n=sentences().length;
 player.cursor=Math.max(0,Math.min(n-1,Number(value)||0));
 const playing=autoplay||player.mode==='playing'||player.mode==='paused';
 stopAudio();controls();if(playing)playFrom(player.cursor);
}
function speakSentence(sentenceText,doneCallback){
 if(!canSpeak()){textStatus('Trình duyệt không hỗ trợ giọng đọc. Hãy dùng Chrome hoặc Edge.');return}
 const u=new SpeechSynthesisUtterance(sentenceText);
 u.lang='en-GB';u.rate=player.rate;u.pitch=1;
 const available=speechSynthesis.getVoices();
 u.voice=available.find(v=>v.lang.toLowerCase()==='en-gb')||available.find(v=>v.lang.startsWith('en-'))||null;
 player.speech=u;
 u.onend=doneCallback;
 u.onerror=e=>{if(e.error!=='canceled'&&e.error!=='interrupted'){player.mode='idle';controls();textStatus('Lỗi phát giọng đọc: '+e.error)}};
 try{speechSynthesis.speak(u)}catch(e){player.mode='idle';controls();textStatus('Không thể phát audio: '+e.message)}
}
function playFrom(index,one=false){
 if(!canSpeak()){textStatus('Không thể phát audio trên thiết bị này.');return}
 stopAudio();player.cursor=index;player.mode='playing';controls();
 const serial=player.serial;
 const read=()=>{
  if(serial!==player.serial||player.mode==='idle')return;
  const arr=sentences();
  if(player.cursor>=arr.length){stopAudio();textStatus('✓ Đã nghe hết bài.');return}
  const text=arr[player.cursor];
  scene.setSentence(text,player.cursor);$('sceneCaption').textContent=text;
  textStatus('🔊 Đang đọc câu '+(player.cursor+1));
  controls();
  speakSentence(text,()=>{
   if(serial!==player.serial)return;
   if(one){stopAudio();textStatus('✓ Đã nghe câu '+(index+1));return}
   player.cursor++;read();
  });
 };
 read();
}
function togglePlay(){
 if(player.mode==='playing'){
  if(canSpeak())speechSynthesis.pause();player.mode='paused';controls();textStatus('⏸ Đã tạm dừng');return;
 }
 if(player.mode==='paused'){
  if(canSpeak())speechSynthesis.resume();player.mode='playing';controls();textStatus('▶ Tiếp tục phát');return;
 }
 playFrom(player.cursor);
}
function display(view,writeUrl=true){
 states.forEach(id=>$(id).hidden=id!==view);
 if(writeUrl){
  const q=new URLSearchParams(location.search);
  q.delete('topic');q.delete('lesson');
  if(view!=='topicsView')q.set('topic',subject().id);
  if(view==='exerciseView')q.set('lesson',item().id);
  history.replaceState(null,'',location.pathname+(q.size?'?'+q.toString():''));
 }
 scrollTo(0,0);
}
function renderTopics(){
 $('topics').replaceChildren();
 data.forEach((t,i)=>{
  const card=document.createElement('button');card.type='button';card.className='topic-card';
  card.innerHTML='<span class="art"></span><strong></strong><p></p><span class="tag"></span>';
  card.querySelector('.art').textContent=t.icon;card.querySelector('strong').textContent=t.name;
  card.querySelector('p').textContent=t.description;
  card.querySelector('.tag').textContent=t.lessons.filter(l=>done(t,l)).length+' / 30 hoàn thành · 30 bài';
  card.onclick=()=>openTopic(i);$('topics').append(card);
 });
}
function openTopic(i){
 stopAudio();scene.stop();topic=i;lesson=-1;const t=subject();
 $('topicTitle').textContent=t.icon+' '+t.name;$('topicCrumb').textContent=t.name;$('topicDesc').textContent=t.description;
 renderLessons();display('lessonsView');
}
function renderLessons(){
 $('lessons').replaceChildren();subject().lessons.forEach((l,i)=>{
  const card=document.createElement('button');card.type='button';card.className='lesson-card';
  const n=document.createElement('span');n.className='number';n.textContent='LISTENING '+l.id;
  const title=document.createElement('strong');title.textContent=l.title;
  const meta=document.createElement('span');meta.className='meta';
  meta.textContent=l.text.split(/\s+/).length+' từ · '+(done(subject(),l)?'✓ Đã hoàn thành':'Chưa hoàn thành');
  if(done(subject(),l))meta.classList.add('completed');
  card.append(n,title,meta);card.onclick=()=>openLesson(i);$('lessons').append(card);
 });
}
function clearAnswer(){
 $('typed').value='';$('grade').className='';$('grade').textContent='Nghe và gõ lại chính xác câu tiếng Anh.';
 $('wordFeedback').replaceChildren();showAll=false;$('answer').textContent='Đáp án đang ẩn.';
 $('counter').textContent='Câu '+(sentence+1)+' / '+sentences().length;
 $('correctCounter').textContent=correct.size+' / '+sentences().length+' câu chính xác';
 $('bar').style.width=(100*correct.size/sentences().length)+'%';
 $('previous').disabled=sentence===0;$('next').disabled=sentence===sentences().length-1;
 controls();
}
function openLesson(i){
 stopAudio();lesson=i;sentence=0;correct=new Set();player.cursor=0;
 const t=subject(),l=item();
 $('lessonCrumb').textContent=t.name+' · '+l.id;$('lessonTopic').textContent=t.icon+' '+t.name+' · Bài '+l.id;
 $('lessonTitle').textContent=l.title;$('lessonMeta').textContent=l.text.split(/\s+/).length+' từ · '+sentences().length+' câu';
 scene.start(t,l);clearAnswer();display('exerciseView');
 textStatus('Sẵn sàng. Bấm ▶ Nghe toàn bài để phát giọng đọc.');
}
function drawDiff(diff){
 const panel=$('wordFeedback');panel.replaceChildren();
 const title=document.createElement('strong');title.textContent='Phân tích từng từ:';panel.append(title);
 const stat=document.createElement('p');stat.textContent='✓ Đúng: '+diff.counts.correct+' · Thiếu: '+diff.counts.missing+' · Thừa: '+diff.counts.extra+' · Sai: '+diff.counts.incorrect;
 panel.append(stat);
 const line=document.createElement('div');line.className='word-diff';panel.append(line);
 diff.edits.forEach(d=>{
  const chip=document.createElement('span');chip.className='diff-'+d.kind;
  if(d.kind==='correct')chip.textContent='✓ '+d.expected;
  if(d.kind==='missing')chip.textContent='− '+d.expected+' (thiếu)';
  if(d.kind==='extra')chip.textContent='+ '+d.actual+' (thừa)';
  if(d.kind==='incorrect')chip.textContent=d.actual+' → '+d.expected+' (sai)';
  chip.title=d.kind==='correct'?'Đúng':d.kind==='missing'?'Cần thêm từ "'+d.expected+'"':d.kind==='extra'?'Từ thừa "'+d.actual+'"':'Đã viết "'+d.actual+'", cần "'+d.expected+'"';
  line.append(chip);
 });
}
$('playAll').onclick=togglePlay;
$('stopAudio').onclick=stopAudio;
$('listenSentence').onclick=()=>playFrom(sentence,true);
$('audioBack').onclick=()=>changeCursor(player.cursor-1);
$('audioForward').onclick=()=>changeCursor(player.cursor+1);
$('seek').oninput=v=>changeCursor(v.target.value);
$('speed').onchange=e=>{player.rate=Number(e.target.value);if(player.mode==='playing'||player.mode==='paused')playFrom(player.cursor);textStatus('Tốc độ: '+player.rate+'x')};
$('check').onclick=()=>{
 const diff=grader.compare(sentences()[sentence],$('typed').value);
 $('grade').className=diff.perfect?'good':'bad';
 $('grade').textContent=diff.perfect?'✓ Chính xác hoàn toàn!':'Độ chính xác '+diff.accuracy+'%. Kiểm tra các từ được đánh dấu bên dưới.';
 if(diff.perfect)correct.add(sentence);else correct.delete(sentence);
 drawDiff(diff);$('correctCounter').textContent=correct.size+' / '+sentences().length+' câu chính xác';
 $('bar').style.width=(100*correct.size/sentences().length)+'%';
};
$('reveal').onclick=()=>$('answer').textContent=sentences()[sentence];
$('revealAll').onclick=()=>$('answer').textContent=item().text;
$('previous').onclick=()=>{stopAudio();if(sentence>0){sentence--;clearAnswer()}};
$('next').onclick=()=>{stopAudio();if(sentence<sentences().length-1){sentence++;clearAnswer()}};
$('complete').onclick=()=>{saveProgress();$('grade').className='good';$('grade').textContent=correct.size===sentences().length?'✓ Hoàn thành bài nghe, tất cả câu đều chính xác.':'Đã lưu kết quả: '+correct.size+'/'+sentences().length+' câu chính xác. Hãy sửa các câu còn sai để hoàn thành bài.'};
$('nextLesson').onclick=()=>{saveProgress();if(lesson<subject().lessons.length-1)openLesson(lesson+1);else{renderLessons();display('lessonsView')}};
$('backTopics').onclick=()=>{stopAudio();scene.stop();renderTopics();display('topicsView')};
$('backLessons').onclick=()=>{stopAudio();scene.stop();renderLessons();display('lessonsView')};
window.addEventListener('pagehide',()=>{stopAudio();scene.stop()});
renderTopics();
const initialTopic=data.findIndex(t=>t.id===params.get('topic'));
if(initialTopic>=0){openTopic(initialTopic);const selected=Number(params.get('lesson'));if(selected>=1&&selected<=30)openLesson(selected-1)}else display('topicsView',false);
})();
