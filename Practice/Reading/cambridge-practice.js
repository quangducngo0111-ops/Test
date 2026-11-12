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
    !/^Questions?\s+\d+/i.test(lines[follow]) &&
    !/^List of (?:Dates|Headings|People|Researchers|Words|Options)/i.test(lines[follow])){
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
 return '<select id="q'+n+'" class="answer-select choice-dropdown" data-n="'+n+'" aria-label="Câu '+n+'"><option value="">Chọn đáp án</option>'+
 choices.map(value=>'<option value="'+esc(value)+'"'+(norm(answers[n])===norm(value)?' selected':'')+'>'+esc(value)+'</option>').join('')+'</select>';
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
 if(D.id==='cam11-test2-p1'&&n===8)prompt=prompt.split(/\bList of Dates\b/i)[0].trim();
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
    '<label class="answer-option"><input type="radio" name="answer'+n+'" data-n="'+n+'" value="'+value+'"'+(norm(answers[n])===norm(value)?' checked':'')+'><span><span class="option-letter">'+value+'</span>'+ (descriptions[value]?' '+esc(descriptions[value]):'') +'</span></label>'
   ).join('')+'</div><input type="hidden" id="q'+n+'" value="'+esc(answers[n]||'')+'">';
  }else body+=' '+answerInput(n,'Điền từ');
 }
 const typeClass=!selectType&&!options?' fill-inline':hasBlank&&!selectType?' fill-inline':selectType?' choice-card':'';
 return '<div class="question-card'+typeClass+'" id="row'+n+'"><div class="question-row"><span class="qno">'+n+'</span><div class="qcopy">'+body+'</div></div><div class="review" id="review'+n+'" hidden></div></div>';
}
function neuroaestheticsSummary(){
 const choices=[['A','interpretation'],['B','complexity'],['C','emotions'],['D','movements'],['E','skill'],['F','layout'],['G','concern'],['H','images']];
 const bank='<div class="neuro-word-bank" aria-label="List of Words">'+choices.map(([letter,word])=>
   '<div class="neuro-bank-item"><span>'+letter+'</span><span>'+word+'</span></div>'
 ).join('')+'</div>';
 const blank=n=>'<span class="neuro-inline-gap" id="row'+n+'"><span class="neuro-gap-number">'+n+'</span>'+inlineChoice(n,choices.map(x=>x[0]))+'</span>';
 const reviews=[31,32,33].map(n=>'<div class="review neuro-review" id="review'+n+'" hidden></div>').join('');
 return '<div class="neuro-summary"><h4>Art and the Brain</h4>'+
 '<p>The discipline of neuroaesthetics aims to bring scientific objectivity to the study of art. Neurological studies of the brain, for example, demonstrate the impact which Impressionist paintings have on our '+blank(31)+
 '. Alex Forsythe of the University of Liverpool believes many artists give their works the precise degree of '+blank(32)+
 ' which most appeals to the viewer’s brain. She also observes that pleasing works of art often contain certain repeated '+blank(33)+
 ' which occur frequently in the natural world.</p>'+
 bank+'<div class="neuro-review-list">'+reviews+'</div></div>';
}
function maryDateBank(){
 return '<aside class="ielts-option-bank" aria-label="List of Dates"><div class="option-bank-title">List of Dates</div>'+
 '<div class="date-bank-grid">'+
 [['A','1836'],['E','1971'],['B','1840'],['F','1979'],['C','1965'],['G','1982'],['D','1967']].map(([letter,year])=>
  '<div class="date-bank-item"><strong>'+letter+'</strong><span>'+year+'</span></div>').join('')+
 '</div></aside>';
}
function maryDiagram(){
 const fields=[9,10,11,12,13].map(n=>
  '<label class="diagram-field" id="row'+n+'" for="q'+n+'"><span class="diagram-number">'+n+'</span>'+
  '<input id="q'+n+'" class="inline-answer" data-n="'+n+'" placeholder="Nhập đáp án" autocomplete="off" spellcheck="false" value="'+esc(answers[n]||'')+'"></label>'
 ).join('');
 const reviews=[9,10,11,12,13].map(n=>'<div class="diagram-review" id="review'+n+'" hidden></div>').join('');
 return '<div class="mary-diagram" role="group" aria-label="Raising the hull of the Mary Rose: stages one and two">'+
 '<div class="mary-diagram-title">Raising the hull of the Mary Rose: Stages one and two</div>'+
 '<div class="mary-diagram-canvas"><img class="mary-diagram-image" src="https://ielts-vuive.com/wp-content/uploads/2020/04/boate.png" alt="Sơ đồ Raising the Mary Rose, các vị trí 9–13" loading="lazy" referrerpolicy="no-referrer"></div>'+
 '<div class="diagram-answers-heading">Điền đáp án cho các vị trí trên sơ đồ</div>'+
 '<div class="diagram-answer-grid">'+fields+'</div>'+

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
  let instruction=(m?groupText.slice(0,m.index):inlineFirst?groupText.slice(0,inlineFirst.index):groupText).trim();
  if(D.id==='cam11-test2-p1'&&gStart===5)instruction=instruction.split(/\bList of Dates\b/i)[0].trim();
  if(D.id==='cam11-test2-p3'&&gStart===31)instruction='Complete the summary using the list of words, A–H, below.\nWrite the correct letters, A–H, in boxes 31–33 on your answer sheet.';
  if(D.id==='cam11-test2-p1'&&gStart===9)instruction=instruction.replace(/Raising the hull of the Mary Rose: Stages one and two\s*$/i,'').trim();
  cards+='<section class="question-section"><div class="questionsIntro"><div class="instructions"><h3>Questions '+gStart+'–'+gEnd+'</h3><div class="instruction-line">'+instruction.split(/\n+/).map(line=>esc(line.trim())).filter(Boolean).join('<br>')+'</div><div class="rule">'+(/TRUE.*FALSE.*NOT GIVEN/is.test(instruction)?'TRUE / FALSE / NOT GIVEN':/YES.*NO.*NOT GIVEN/is.test(instruction)?'YES / NO / NOT GIVEN':/Choose.*letters?/i.test(instruction)?'MULTIPLE CHOICE':/headings/i.test(instruction)?'MATCHING HEADINGS':/summary/i.test(instruction)?'SUMMARY COMPLETION' : /label the diagram/i.test(instruction)?'DIAGRAM LABEL COMPLETION':'READING QUESTIONS')+'</div></div></div>';
  if(D.id==='cam11-test2-p1' && gStart===9){cards+=maryDiagram();}else if(D.id==='cam11-test2-p3' && gStart===31){cards+=neuroaestheticsSummary();}else{for(let n=Math.max(beginning,gStart);n<=Math.min(ending,gEnd);n++)cards+=questionCard(n,questionPrompt(groupText,n),instruction,groupText);}
  if(D.id==='cam11-test2-p1' && gStart===5)cards+=maryDateBank();
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
function focusEvidence(n){
 const hit=findEvidence(n);if(!hit)return;
 const source=$('source'),walker=document.createTreeWalker(source,NodeFilter.SHOW_TEXT);
 let node,offset=0;
 while((node=walker.nextNode())){
  const length=node.textContent.length;
  if(hit.pos<offset+length){
   const pos=hit.pos-offset,range=document.createRange();
   range.setStart(node,Math.max(0,pos));range.setEnd(node,Math.min(length,pos+hit.len));
   const mark=document.createElement('mark');mark.className='evidence-focus';
   try{range.surroundContents(mark)}catch(err){node.parentElement?.scrollIntoView({behavior:'smooth',block:'center'});return;}
   mark.scrollIntoView({behavior:'smooth',block:'center'});
   setTimeout(()=>{if(mark.isConnected)mark.replaceWith(...mark.childNodes)},6000);
   return;
  }
  offset+=length;
 }
}
$('submit').addEventListener('click',async()=>{if(submitted)return;if(!confirm('Nộp bài và xem đáp án?'))return;submitted=true;clearInterval(tick);localStorage.setItem(key+'_seconds',String(elapsed));
 let score=0;for(let n=beginning;n<=ending;n++){const result=isCorrect(n,answers[n]||'');if(result)score++;let review=$('review'+n);review.hidden=false;review.innerHTML='<div class="'+(result?'good':'bad')+'">'+(result?'✓ Chính xác':'✕ Chưa chính xác')+'</div><div>Đáp án: <strong>'+esc(D.answers[n]||'Đang đối chiếu')+'</strong></div><div class="evidenceHint">'+(findEvidence(n)?'<button type="button" data-focus="'+n+'">Tìm từ khóa trong Passage</button>':'Đối chiếu thông tin trong đoạn đọc bên trái')+'</div>';$('row'+n)?.querySelectorAll('input,select').forEach(el=>el.disabled=true);$('nav'+n).classList.add(result?'correct':'wrong')}
 $('result').hidden=false;$('result').textContent='Kết quả: '+score+'/'+(ending-beginning+1)+' · Thời gian '+fmt(elapsed);$('submit').disabled=true;
 const endpoint=D.resultEndpoint||'';if(endpoint){try{await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams({mode:'PRACTICE',name:student.name,className:student.className,skill:'Reading',practiceType:'Reading Passage '+D.passage,practiceId:D.folder,score:String(score),total:String(ending-beginning+1),durationSeconds:String(elapsed),details:JSON.stringify({source:D.id,answers,answerKey:D.answers}),submittedAt:new Date().toISOString()})})}catch(e){console.warn('Could not submit practice result',e)}}});
$('answerList').addEventListener('click',e=>{const n=e.target.closest('[data-focus]')?.dataset.focus;if(n)focusEvidence(Number(n))});
const selectionMenu=$('selectionMenu');
const passageMarkupKey=D.id==='cam11-test2-p3'?'_passageMarkup_neuro_paragraphs_v3':'_passageMarkup_v2';
let markTarget=null;
const markKey=key+'_questionMarks_v4';
function resetMenu(){selectionMenu.hidden=true;markTarget=null;for(const button of selectionMenu.querySelectorAll('[data-action]')){button.hidden=false;button.textContent=button.dataset.action==='note'?'📝 Take note':'🖍 Highlight';}}
function getRoot(node){
 const el=node?.nodeType===1?node:node?.parentElement;
 if(!el||el.closest('input,select,textarea,button,.review,.neuro-inline-gap,.selectionMenu'))return null;
 return el.closest('#source,#questionsSource');
}
function persist(root){
 if(root?.id==='source')localStorage.setItem(key+passageMarkupKey,root.innerHTML);
}
function capture(){
 const selection=window.getSelection();
 if(!selection||selection.isCollapsed||!selection.rangeCount||!selection.toString().trim()){resetMenu();return;}
 const range=selection.getRangeAt(0),from=getRoot(range.startContainer),to=getRoot(range.endContainer);
 if(!from||from!==to||range.cloneContents().querySelector('input,select,textarea,button')){resetMenu();return;}
 selectedRange=range.cloneRange();selectedZone=from;markTarget=null;resetMenu();
 const r=range.getBoundingClientRect();if(!r.width&&!r.height)return;
 selectionMenu.hidden=false;
 const width=selectionMenu.offsetWidth||190;
 selectionMenu.style.left=Math.max(8,Math.min(innerWidth-width-8,r.left+r.width/2-width/2))+'px';
 selectionMenu.style.top=Math.max(8,r.top-45)+'px';
}
function addAnnotation(action){
 if(!selectedRange||!selectedZone)return;
 const range=selectedRange.cloneRange(),root=selectedZone;
 const note=action==='note'?prompt('Nhập ghi chú:'):null;
 if(action==='note'&&(note===null||!note.trim())){resetMenu();return;}
 try{
  const el=document.createElement(action==='note'?'span':'mark');
  el.className=action==='note'?'note-anchor':'user-highlight';
  if(action==='note'){el.dataset.note=note.trim();el.title=note.trim();}
  el.append(range.extractContents());range.insertNode(el);
  persist(root);window.getSelection()?.removeAllRanges();selectedRange=null;selectedZone=null;
 }catch(error){alert('Vui lòng bôi đen đoạn văn ngắn hơn.')}
 resetMenu();
}
selectionMenu.addEventListener('mousedown',event=>event.preventDefault());
selectionMenu.addEventListener('click',event=>{
 const action=event.target.closest('[data-action]')?.dataset.action;
 if(!action)return;event.stopPropagation();
 if(markTarget){
  const target=markTarget,root=getRoot(target);
  if(root){const parent=target.parentNode;target.replaceWith(...target.childNodes);parent.normalize();persist(root);}
  resetMenu();return;
 }
 addAnnotation(action);
});
document.addEventListener('mouseup',event=>{if(!selectionMenu.contains(event.target))setTimeout(capture,0)});
document.addEventListener('touchend',event=>{if(!selectionMenu.contains(event.target))setTimeout(capture,120)});
document.addEventListener('mousedown',event=>{if(!selectionMenu.contains(event.target)&&!event.target.closest('.user-highlight,.note-anchor'))resetMenu()});
document.addEventListener('click',event=>{
 const target=event.target.closest('mark.user-highlight,span.note-anchor');
 if(!target||window.getSelection()?.toString().trim())return;
 if(!getRoot(target))return;
 markTarget=target;selectedRange=null;selectedZone=null;
 const b1=selectionMenu.querySelector('[data-action="highlight"]'),b2=selectionMenu.querySelector('[data-action="note"]');
 b1.hidden=target.classList.contains('note-anchor');b2.hidden=!b1.hidden;
 b1.textContent='✕ Xóa Highlight';b2.textContent='✕ Xóa Note';
 const r=target.getBoundingClientRect();selectionMenu.hidden=false;
 selectionMenu.style.left=Math.max(8,Math.min(innerWidth-170,r.left))+'px';
 selectionMenu.style.top=Math.max(8,r.top-45)+'px';
});
const stored=localStorage.getItem(key+passageMarkupKey);
if(stored)$('source').innerHTML=stored;
$('source').addEventListener('dblclick',()=>{
 const word=window.getSelection()?.toString()?.trim();
 if(!word||!/^[a-zA-Z-]{2,30}$/.test(word))return;
 if(confirm('Tra nghĩa tiếng Việt của "'+word+'"?'))window.open('https://translate.google.com/?sl=en&tl=vi&text='+encodeURIComponent(word)+'&op=translate','_blank','noopener');
});
updateNav();
})();