/* Cambridge Reading Practice: generic rendering engine. Original passage, prompts and answer key from user-provided PDF. */
(()=>{'use strict';const dataNode=document.getElementById('exercise-data');if(!dataNode)return;
const D=JSON.parse(dataNode.textContent),key='CAM_PRACTICE_'+D.id;
const $=id=>document.getElementById(id);const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
let student={name:'',className:''},elapsed=0,started=false,submitted=false,tick=null,answers={},selectedRange=null,selectedZone=null;
const beginning=D.passage===1?1:D.passage===2?14:27,ending=D.passage===3?40:D.passage===2?26:13;
let history=JSON.parse(localStorage.getItem(key+'_answers')||'{}');answers={...history};

document.title=D.title+' | Reading Passage '+D.passage;
$('back').href='../';
$('pageLabel').textContent='Reading Passage '+D.passage+' — Bài '+D.folder;
$('subtitle').textContent=D.title+' · Cambridge '+D.book+' Test '+D.test+' · Questions '+beginning+'–'+ending;
$('title').textContent=D.title;
$('guide').innerHTML='<b>▤ Reading Practice · Hướng dẫn:</b> Đồng hồ <b>đếm xuôi</b> · Bôi đen văn bản để <b>highlight</b> hoặc <b>Take note</b> (rê chuột lên đoạn đã ghi chú để xem) · <b>Nhấp đúp một từ trong bài đọc</b> để tra nghĩa tiếng Việt · Sau khi nộp bài, xem đáp án và giải thích ngay dưới từng câu.';
/* Exact structural classes of the existing The History of Glass template. */
const head=document.querySelector('body > header');
head.className='top';
const headInner=document.createElement('div');
headInner.className='topin';
const headLeft=document.createElement('div');
headLeft.className='left';
const headBrand=document.createElement('div');
headBrand.className='brand';
headBrand.textContent='📖 Reading Passage '+D.passage+' — '+D.folder;
headLeft.append($('back'),headBrand);
headInner.append(headLeft,$('studentInfo'),$('timer'));
head.replaceChildren(headInner);
document.querySelector('.progressWrap')?.classList.add('progress-wrap');
document.querySelector('.progressTrack')?.classList.add('progress');
const leftPane=document.querySelector('.workspace .pane:first-child');
const rightPane=document.querySelector('.workspace .pane:nth-child(2)');
leftPane.classList.add('passage');
rightPane.classList.add('questions');
const passageBody=D.passageText.replace(/^You should spend[^\n]*\n\s*/i,'').trim();
const firstLineBreak=passageBody.indexOf('\n');
const titleLine=passageBody.slice(0,firstLineBreak).trim();
let passageRest=titleLine.toLowerCase()===D.title.trim().toLowerCase()?passageBody.slice(firstLineBreak).trim():passageBody;
if(passageRest.startsWith(D.title))passageRest=passageRest.slice(D.title.length).trim();
function paragraphMarkup(raw){
 let sections=raw.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 if(sections.length===1&&sections[0].length>1800)sections=raw.split(/\n(?=[A-H]\n|[A-H]\s{2,}|[A-Z][^.\n]{0,20}:\s)/);
 return sections.map(p=>{
  const clean=p.replace(/([^\n])\n(?=[^\n])/g,'$1 ').replace(/\s+/g,' ').trim();
  if(/^[A-H]$/.test(clean))return '<div class="paragraph-letter-inline">'+esc(clean)+'</div>';
  const letter=clean.match(/^([A-H])\s+(?=[A-Z])/);
  return '<div class="passage-paragraph" style="padding-left:0">'+(letter?'<strong class="paragraph-prefix">'+letter[1]+'</strong> ':'')+esc(letter?clean.slice(letter[0].length):clean)+'</div>';
 }).join('');
}
const passageRoot=document.createElement('div');
passageRoot.className='content';
passageRoot.innerHTML='<div class="passage-title"><div class="label">Reading Passage '+D.passage+'</div><h2>'+esc(D.title)+'</h2><p>You should spend about 20 minutes on Questions '+beginning+'–'+ending+'.</p></div>';
$('source').classList.add('passageSource');
$('source').innerHTML=paragraphMarkup(passageRest);
passageRoot.append($('source'));
leftPane.replaceChildren(passageRoot);
const questionRoot=document.createElement('div');
questionRoot.className='content';
questionRoot.append($('diagramNotice'),$('questionsSource'),$('answerList'),$('result'));
rightPane.replaceChildren(questionRoot);
$('questionsSource').classList.add('questionSource');
$('questionsSource').replaceChildren();
const rawQuestions=D.questionsText.replace(/\u200b/g,'');
const groups=[...rawQuestions.matchAll(/^Questions?\s+(\d+)(?:\s*(?:[-–]|and)\s*(\d+))?\s*$/gm)];

function questionPrompt(text,num){
 const normalized=text.replace(/\u200b/g,'');
 const lines=normalized.split('\n');
 // Normal IELTS question lines begin with the question number.
 const re=new RegExp('^\\s*'+num+'(?:[.\\s]+)(.*)$');
 let at=lines.findIndex(line=>re.test(line));
 if(at>=0){
  let line=lines[at].replace(re,'$1').trim(),follow=at+1;
  while(follow<lines.length && line.length<240 && lines[follow].trim() &&
    !/^\s*\d{1,2}(?:[\s.…_]|$)/.test(lines[follow]) &&
    !/^\s*[A-H]\s{1,}/.test(lines[follow]) &&
    !/^Questions?\s+\d+/i.test(lines[follow])){
    line+=' '+lines[follow].trim();follow++;
  }
  return line.replace(/\s+/g,' ').slice(0,360).trim();
 }
 // Some Cambridge notes/summaries embed the number immediately before a blank.
 const inline=new RegExp('(?:^|\\s)'+num+'\\s*[.…·_]{2,}','m');
 const found=inline.exec(normalized);
 if(found){
   const from=normalized.lastIndexOf('\n',found.index);
   const to=normalized.indexOf('\n',found.index+found[0].length);
   return normalized.slice(from<0?0:from+1,to<0?undefined:to).trim()
     .replace(new RegExp('(^|\\s)'+num+'\\s*(?=[.…·_]{2,})'),'$1')
     .replace(/\s+/g,' ').slice(0,360);
 }
 return '';
}
function answerInput(n,placeholder='Điền từ'){
 return '<input id="q'+n+'" class="inline-answer" data-n="'+n+'" aria-label="Đáp án câu '+n+'" autocomplete="off" spellcheck="false" placeholder="'+placeholder+'" value="'+esc(answers[n]||'')+'">';
}
function optionMarkup(n,choices){
 return '<div class="answer-options" role="radiogroup" aria-label="Câu '+n+'">'+choices.map(value=>
  '<label class="answer-option"><input type="radio" name="answer'+n+'" data-n="'+n+'" id="opt'+n+'-'+value+'" value="'+esc(value)+'"'+(norm(answers[n])===norm(value)?' checked':'')+'><span>'+esc(value)+'</span></label>'
 ).join('')+'</div><input type="hidden" id="q'+n+'" value="'+esc(answers[n]||'')+'">';
}

function questionOptionsText(text,n){
 const lines=text.replace(/\u200b/g,'').split('\n');
 const startRe=new RegExp('^\\s*'+n+'[.\\s]+');
 const start=lines.findIndex(line=>startRe.test(line));
 if(start<0)return {};
 const nextNumber=/^\s*\d{1,2}(?:[.\s]+|$)/;
 const opts={};let active='';
 for(let i=start+1;i<lines.length;i++){
  const line=lines[i].trim();
  if(nextNumber.test(line))break;
  const m=line.match(/^([A-H])\s{1,}(.+)$/);
  if(m){active=m[1];opts[active]=m[2].trim();continue}
  if(active&&line&&!/^Questions?\s+/i.test(line))opts[active]+=' '+line;
 }
 return opts;
}
function inlineChoice(n,choices){
 return '<select id="q'+n+'" class="inline-answer inline-choice" data-n="'+n+'" aria-label="Đáp án câu '+n+'"><option value="">Chọn</option>'+
 choices.map(value=>'<option value="'+esc(value)+'"'+(norm(answers[n])===norm(value)?' selected':'')+'>'+esc(value)+'</option>').join('')+'</select>';
}
function questionCard(n,prompt,instruction,groupText){
 const isTfn=/TRUE[\s\S]{0,200}FALSE[\s\S]{0,200}NOT GIVEN/i.test(instruction);
 const isYnn=/YES[\s\S]{0,200}NO[\s\S]{0,200}NOT GIVEN/i.test(instruction);
 const selectType=isTfn?['TRUE','FALSE','NOT GIVEN']:isYnn?['YES','NO','NOT GIVEN']:null;
 let options=null;
 if(!selectType){
  if(/(?:list of headings|correct heading|headings below)/i.test(instruction))options=['i','ii','iii','iv','v','vi','vii','viii','ix'];
  else if(/(?:match each|which paragraph|list of (?:people|scientists|dates|researchers))/i.test(instruction))options=['A','B','C','D','E','F','G','H','I'];
  else if(/(?:choose|write) (?:TWO |THREE )?(?:correct )?letters?|correct letter|list of words/i.test(instruction))options=['A','B','C','D','E','F','G','H'];
 }
 const escapedPrompt=esc(prompt||'Xem câu hỏi trong phần hướng dẫn của nhóm.');
 const hasBlank=/[.…·_]{3,}/.test(prompt);
 let body='';
 if(hasBlank && !selectType){
  // Place a text answer or a word-bank choice directly inside the gap.
  body=escapedPrompt.replace(/[.…·_]{3,}/,()=>options?inlineChoice(n,options):answerInput(n));
 }else{
  body=escapedPrompt;
  if(selectType)body+=optionMarkup(n,selectType);
  else if(options){
   const descriptions=questionOptionsText(groupText,n);
   if(Object.keys(descriptions).length>=2)options=Object.keys(descriptions);
   body+='<div class="answer-options '+(Object.keys(descriptions).length?'answer-options-stacked':'answer-options-letters')+'">'+options.map(value=>
    '<label class="answer-option"><input type="radio" name="answer'+n+'" data-n="'+n+'" value="'+value+'"'+(norm(answers[n])===norm(value)?' checked':'')+'><span><strong>'+value+'</strong>'+ (descriptions[value]?' '+esc(descriptions[value]):'') +'</span></label>'
   ).join('')+'</div><input type="hidden" id="q'+n+'" value="'+esc(answers[n]||'')+'">';
  }else body+='<div class="answer-under">'+answerInput(n,'Nhập đáp án')+'</div>';
 }
 const typeClass=hasBlank&&!selectType?' fill-inline':selectType?' choice-card':'';
 return '<div class="question-card'+typeClass+'" id="row'+n+'"><div class="question-row"><span class="qno">'+n+'</span><div class="qcopy">'+body+'</div></div><div class="review" id="review'+n+'" hidden></div></div>';
}
function maryDiagram(){
 const points={9:[45.5,5.1],10:[11.0,34],11:[83.5,80],12:[10.5,91.6],13:[41.5,97]};
 const fields=[9,10,11,12,13].map(n=>{
  const [x,y]=points[n];
  return '<div id="row'+n+'" class="diagram-answer" style="left:'+x+'%;top:'+y+'%"><label class="sr-only" for="q'+n+'">Câu '+n+'</label>'+
   '<input id="q'+n+'" class="inline-answer" data-n="'+n+'" placeholder="Câu '+n+'" autocomplete="off" spellcheck="false" value="'+esc(answers[n]||'')+'"></div>';
 }).join('');
 const reviews=[9,10,11,12,13].map(n=>'<div class="diagram-review" id="review'+n+'" hidden></div>').join('');
 return '<div class="mary-diagram" role="group" aria-label="Raising the hull of the Mary Rose: stages one and two">'+
 '<div class="mary-diagram-title">Raising the hull of the Mary Rose: Stages one and two</div>'+
 '<div class="mary-diagram-canvas"><img class="mary-diagram-image" src="https://ielts-vuive.com/wp-content/uploads/2020/04/boate.png" alt="Sơ đồ Raising the Mary Rose, các vị trí 9–13" loading="lazy" referrerpolicy="no-referrer">'+fields+'</div>'+
 '<p class="diagram-help">Điền câu trả lời trực tiếp vào các ô số 9–13 trên sơ đồ. Nếu sơ đồ không hiển thị, <a target="_blank" rel="noopener" href="https://ielts-vuive.com/r10-raising-the-mary-rose/">xem hình tham chiếu</a>.</p>'+
 '<div class="mary-review-list">'+reviews+'</div></div>';
}
let cards='';
if(groups.length){
 for(let i=0;i<groups.length;i++){
  const g=groups[i],next=groups[i+1];
  const gStart=Number(g[1]),gEnd=g[2]?Number(g[2]):gStart;
  const groupText=rawQuestions.slice(g.index+(g[0]||'').length,next?next.index:undefined).trim();
  const firstQuestion=new RegExp('(?:^|\\n)\\s*'+gStart+'(?:[.\\s]+)');
  const m=firstQuestion.exec(groupText);
  const inlineFirst=new RegExp('(?:^|\\n)[^\\n]{0,160}\\b'+gStart+'[.…·_]{3,}','m').exec(groupText);
  const instruction=(m?groupText.slice(0,m.index):inlineFirst?groupText.slice(0,inlineFirst.index):groupText).trim();
  cards+='<section class="question-section"><div class="questionsIntro"><div class="instructions"><h3>Questions '+gStart+'–'+gEnd+'</h3><div class="instruction-line">'+instruction.split(/\n+/).map(line=>esc(line.trim())).filter(Boolean).join('<br>')+'</div><div class="rule">'+(/TRUE.*FALSE.*NOT GIVEN/is.test(instruction)?'TRUE / FALSE / NOT GIVEN':/YES.*NO.*NOT GIVEN/is.test(instruction)?'YES / NO / NOT GIVEN':/Choose.*letters?/i.test(instruction)?'MULTIPLE CHOICE':/headings/i.test(instruction)?'MATCHING HEADINGS':/summary/i.test(instruction)?'SUMMARY COMPLETION':'READING QUESTIONS')+'</div></div></div>';
  if(D.id==='cam11-test2-p1' && gStart===9){cards+=maryDiagram();}else{for(let n=Math.max(beginning,gStart);n<=Math.min(ending,gEnd);n++)cards+=questionCard(n,questionPrompt(groupText,n),instruction,groupText);}
  cards+='</section>';
 }
}else{
 cards='<section class="question-section"><div class="instructions"><h3>Questions '+beginning+'–'+ending+'</h3><p>'+esc(rawQuestions)+'</p></div>';
 for(let n=beginning;n<=ending;n++)cards+=questionCard(n,'',rawQuestions,rawQuestions);
 cards+='</section>';
}
$('answerList').innerHTML=cards;
$('questionsSource').append($('answerList'));
$('answerList').classList.add('answerList');
$('nav').innerHTML=Array.from({length:ending-beginning+1},(_,i)=>{let n=i+beginning;return '<button id="nav'+n+'" type="button" data-n="'+n+'">'+n+'</button>'}).join('');
function updateNav(){let count=0;for(let n=beginning;n<=ending;n++){const ok=!!String(answers[n]||'').trim();if(ok)count++;$('nav'+n)?.classList.toggle('answered',ok)}$('progress').textContent=count+'/'+(ending-beginning+1)+' câu đã trả lời';$('progressFill').style.width=100*count/(ending-beginning+1)+'%'}
$('answerList').addEventListener('input',e=>{if(!e.target.matches('[data-n]'))return;answers[e.target.dataset.n]=e.target.value;const hidden=$('q'+e.target.dataset.n);if(hidden&&hidden.type==='hidden')hidden.value=e.target.value;localStorage.setItem(key+'_answers',JSON.stringify(answers));updateNav()});
$('answerList').addEventListener('change',e=>{if(e.target.matches('[data-n]')){answers[e.target.dataset.n]=e.target.value;localStorage.setItem(key+'_answers',JSON.stringify(answers));updateNav()}});
$('nav').addEventListener('click',e=>{const n=e.target.closest('[data-n]')?.dataset.n;if(n){$('row'+n)?.scrollIntoView({behavior:'smooth',block:'center'});($('q'+n)?.type==='hidden'?$('row'+n)?.querySelector('input[type=radio]'):$('q'+n))?.focus({preventScroll:true})}});
function fmt(n){return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function getProfile(){try{const s=JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null');if(s?.name&&s?.className)return s}catch(e){}const params=new URLSearchParams(location.search);return {name:params.get('name')||'',className:params.get('class')||params.get('className')||''}}
function begin(){student={name:$('studentName').value.trim(),className:$('studentClass').value.trim()};if(!student.name||!student.className){$('startError').textContent='Vui lòng nhập tên và lớp.';return}
 localStorage.setItem('IELTS_PRACTICE_STUDENT',JSON.stringify(student));$('startOverlay').hidden=true;$('studentInfo').textContent=student.name+' · '+student.className;started=true;elapsed=Number(localStorage.getItem(key+'_seconds')||0);$('timer').textContent=fmt(elapsed);tick=setInterval(()=>{if(submitted)return;elapsed++;$('timer').textContent=fmt(elapsed);if(elapsed%5===0)localStorage.setItem(key+'_seconds',String(elapsed))},1000)}
$('startButton').addEventListener('click',begin);const profile=getProfile();$('studentName').value=profile.name||'';$('studentClass').value=profile.className||'';if(profile.name&&profile.className)begin();
function accepted(n){const text=String(D.answers[n]||'').replace(/^\d+\.\s*/,'').trim();const variants=new Set([text,text.replace(/[()]/g,''),text.replace(/\([^)]*\)/g,'').trim()]);const split=text.split(/\s*\/\s*/);if(split.length>1){split.forEach(v=>variants.add(v.trim()));if(split.length===2&&split[0].includes(' ')&&!split[1].includes(' '))variants.add(split[0].replace(/\S+$/,split[1]));}return [...variants].map(v=>v.trim()).filter(Boolean)}
function isCorrect(n,answer){const choices=accepted(n);return choices.some(x=>norm(x)===norm(answer)||norm(x.replace(/[()]/g,''))===norm(answer))}
function findEvidence(answer){const source=$('source').textContent.toLowerCase();const candidates=accepted(answer);for(const item of candidates){let term=item.replace(/\(.+?\)/g,'').trim().toLowerCase();if(term.length<4)continue;let pos=source.indexOf(term);if(pos>=0)return {pos,len:term.length}}return null}
function focusEvidence(n){let hit=findEvidence(n);if(!hit)return;const full=$('source').textContent,before=full.slice(0,hit.pos),word=full.slice(hit.pos,hit.pos+hit.len),after=full.slice(hit.pos+hit.len);
 const source=$('source');source.textContent='';source.append(document.createTextNode(before));const mark=document.createElement('mark');mark.className='evidence-focus';mark.textContent=word;source.append(mark,document.createTextNode(after));mark.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>{if(mark.isConnected)mark.replaceWith(document.createTextNode(word));source.normalize()},7000)}
$('submit').addEventListener('click',async()=>{if(submitted)return;if(!confirm('Nộp bài và xem đáp án?'))return;submitted=true;clearInterval(tick);localStorage.setItem(key+'_seconds',String(elapsed));
 let score=0;for(let n=beginning;n<=ending;n++){const result=isCorrect(n,answers[n]||'');if(result)score++;let review=$('review'+n);review.hidden=false;review.innerHTML='<div class="'+(result?'good':'bad')+'">'+(result?'✓ Chính xác':'✕ Chưa chính xác')+'</div><div>Đáp án: <strong>'+esc(D.answers[n]||'Đang đối chiếu')+'</strong></div><div class="evidenceHint">'+(findEvidence(n)?'<button type="button" data-focus="'+n+'">Tìm từ khóa trong Passage</button>':'Đối chiếu thông tin trong đoạn đọc bên trái')+'</div>';$('row'+n)?.querySelectorAll('input,select').forEach(el=>el.disabled=true);$('nav'+n).classList.add(result?'correct':'wrong')}
 $('result').hidden=false;$('result').textContent='Kết quả: '+score+'/'+(ending-beginning+1)+' · Thời gian '+fmt(elapsed);$('submit').disabled=true;
 const endpoint=D.resultEndpoint||'';if(endpoint){try{await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams({mode:'PRACTICE',name:student.name,className:student.className,skill:'Reading',practiceType:'Reading Passage '+D.passage,practiceId:D.folder,score:String(score),total:String(ending-beginning+1),durationSeconds:String(elapsed),details:JSON.stringify({source:D.id,answers,answerKey:D.answers}),submittedAt:new Date().toISOString()})})}catch(e){console.warn('Could not submit practice result',e)}}});
$('answerList').addEventListener('click',e=>{const n=e.target.closest('[data-focus]')?.dataset.focus;if(n)focusEvidence(Number(n))});
const selectionMenu=$('selectionMenu');function closeMenu(){selectionMenu.hidden=true}
document.addEventListener('selectionchange',()=>{});
document.addEventListener('mouseup',e=>{if(selectionMenu.contains(e.target))return;const sel=getSelection();if(!sel||sel.isCollapsed||!sel.toString().trim()){closeMenu();return}const range=sel.getRangeAt(0);const root=range.commonAncestorContainer.nodeType===1?range.commonAncestorContainer:range.commonAncestorContainer.parentElement;
 selectedZone=root?.closest('#source,#questionsSource')||null;if(!selectedZone){closeMenu();return}selectedRange=range.cloneRange();const box=range.getBoundingClientRect();selectionMenu.hidden=false;selectionMenu.style.left=Math.max(8,Math.min(innerWidth-200,box.left))+'px';selectionMenu.style.top=Math.max(8,box.top-50)+'px'});
selectionMenu.addEventListener('mousedown',e=>e.preventDefault());
selectionMenu.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(!action||!selectedRange||!selectedZone)return;const r=selectedRange.cloneRange();try{const el=document.createElement(action==='highlight'?'mark':'span');el.className=action==='highlight'?'user-highlight':'note-anchor';if(action==='note'){const note=prompt('Nhập ghi chú:');if(note===null||!note.trim())return;el.dataset.note=note.trim();el.title=note.trim()}el.append(r.extractContents());r.insertNode(el);saveMarks();getSelection()?.removeAllRanges()}catch(err){alert('Vui lòng bôi đen một đoạn ngắn hơn.')}finally{closeMenu()}});
function saveMarks(){localStorage.setItem(key+'_passageMarkup_v2',$('source').innerHTML)}
for(const [id,storage] of [['source','_passageMarkup_v2']]){const saved=localStorage.getItem(key+storage);if(saved)$(id).innerHTML=saved}
document.addEventListener('click',e=>{const target=e.target.closest('.user-highlight,.note-anchor');if(target){if(target.classList.contains('note-anchor')){alert('Ghi chú: '+(target.dataset.note||''))}else if(confirm('Xóa highlight này?')){target.replaceWith(...target.childNodes);saveMarks()}}});
$('source').addEventListener('dblclick',e=>{const sel=getSelection();const word=sel?.toString()?.trim();if(!word||!/^[a-zA-Z-]{2,30}$/.test(word))return;const link='https://translate.google.com/?sl=en&tl=vi&text='+encodeURIComponent(word)+'&op=translate';const go=confirm('Tra nghĩa tiếng Việt của "'+word+'" trong Google Translate?');if(go)window.open(link,'_blank','noopener')});
updateNav();
})();