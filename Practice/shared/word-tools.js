/* Shared dictionary and student vocabulary notebook */
(()=>{'use strict';
if(window.__scWordTools)return;window.__scWordTools=true;
const script=document.currentScript,root=new URL('../../',script.src);
const byId=id=>document.getElementById(id);
const isExam=()=>/(?:^|\/)(?:Lis\d+|Read\d+|Wri\d+)(?:\/|$)|\/mock-test\/|\/speaking-mock-test\/|\/FullTest\//i.test(location.pathname)
  ||!!document.querySelector('#testSection:not(.hidden)');
const profile=()=>{try{return JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null')}catch(e){return null}};
const key=()=>{const p=profile();return 'SC_VOCAB_NOTEBOOK_V1_'+(p?.name&&p?.className?(p.name+'|'+p.className).toLowerCase():'guest')};
const load=()=>{try{const v=JSON.parse(localStorage.getItem(key())||'[]');return Array.isArray(v)?v:[]}catch(e){return []}};
const save=list=>{try{localStorage.setItem(key(),JSON.stringify(list));return true}catch(e){return false}};
const norm=w=>String(w||'').normalize('NFKC').toLowerCase().replace(/[‘’]/g,"'").trim().replace(/^[^a-z]+|[^a-z]+$/gi,'').replace(/\s+/g,' ').trim();
const validTerm=w=>/^[a-z][a-z' -]{0,99}$/i.test(w)&&w.split(' ').length<=8;
const PHRASES={
 "such as":["chẳng hạn như; ví dụ như","Used to introduce an example.","Sea animals such as dolphins communicate using sound."],
 "for example":["ví dụ như","Used when giving an example.","Some animals, for example owls, hunt at night."],
 "for instance":["ví dụ như","Used to introduce an example.","Some birds, for instance penguins, cannot fly."],
 "as well as":["cũng như; bên cạnh đó","In addition to.","The zoo cares for birds as well as mammals."],
 "rather than":["thay vì","Used to contrast two alternatives.","They walked rather than drove."],
 "in addition to":["ngoài; bên cạnh","As well as.","In addition to fruit, the animal eats insects."],
 "due to":["do; bởi vì","Because of.","The event was delayed due to rain."],
 "according to":["theo; dựa theo","As stated by a source.","According to researchers, bees can recognise colours."],
 "in spite of":["bất chấp; mặc dù","Despite.","In spite of the rain, they continued."],
 "in terms of":["xét về; về mặt","Considering a specific aspect.","The species differ in terms of size."],
 "as a result":["kết quả là","Consequently.","The river dried up. As a result, fish disappeared."],
 "on the other hand":["mặt khác","Introduces a contrasting point.","The trip was long. On the other hand, it was affordable."],
 "take part in":["tham gia vào","To participate.","Students take part in the workshop."],
 "look after":["chăm sóc","To take care of.","The adults look after their young."],
 "look up":["tra cứu","To search for information.","Look up the phrase in a dictionary."],
 "find out":["tìm ra; phát hiện","To discover.","Scientists want to find out why birds migrate."],
 "give up":["từ bỏ","To stop trying.","Do not give up after one mistake."],
 "carry out":["tiến hành; thực hiện","To perform a task.","Scientists carry out experiments."],
 "put off":["trì hoãn","To postpone.","They put off the meeting."],
 "set up":["thiết lập; thành lập","To establish.","The school set up a reading group."],
 "come across":["tình cờ gặp; bắt gặp","To encounter unexpectedly.","I came across a rare insect."],
 "run out of":["hết; cạn kiệt","To have none left.","The hikers ran out of water."],
 "keep up with":["theo kịp","To stay at the same pace.","It is hard to keep up with research."],
 "break down":["hỏng; phân rã; chia nhỏ","To stop working, separate into parts, or become upset.","The vehicle broke down."],
 "piece of cake":["dễ như ăn bánh","Something very easy.","The task was a piece of cake."],
 "once in a blue moon":["rất hiếm khi","Very rarely.","We see them once in a blue moon."],
 "under the weather":["không khỏe trong người","Feeling slightly ill.","She feels under the weather."],
 "a blessing in disguise":["trong cái rủi có cái may","Something that appears bad but proves good.","The delay was a blessing in disguise."]
};
const phraseList=Object.keys(PHRASES).sort((a,b)=>b.length-a.length);

const speak=word=>{if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const v=new SpeechSynthesisUtterance(word);v.lang='en-GB';v.rate=.85;window.speechSynthesis.speak(v)};
const css=document.createElement('style');
css.textContent=[
'#sc-note-button{position:fixed;bottom:22px;left:22px;z-index:2147480000;display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:48px;padding:8px 16px 8px 10px;border:1px solid #e2d9f1;background:rgba(255,255,255,.96);color:#3b0e90;border-radius:999px;box-shadow:0 5px 19px rgba(48,24,100,.12);font:700 13px/1.25 Inter,system-ui,sans-serif;letter-spacing:0;cursor:pointer;transition:transform .17s ease,box-shadow .17s ease,background .17s ease;backdrop-filter:blur(12px)}',
'#sc-note-button:hover{transform:translateY(-2px);background:#f8f5ff;box-shadow:0 8px 22px rgba(48,24,100,.16)}',
'#sc-note-button:active{transform:translateY(0)}',
'#sc-note-button:focus-visible{outline:3px solid #9e83ea;outline-offset:3px}',
'#sc-note-button .sc-note-icon{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:#f1ebff;flex:none}',
'#sc-note-button .sc-note-icon svg{width:19px;height:19px;stroke:#5d33bc;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
'#sc-note-button .sc-note-label{white-space:nowrap}',
'@media(max-width:600px){#sc-note-button{bottom:15px;left:13px;min-height:44px;padding:6px 12px 6px 7px;font-size:12px}#sc-note-button .sc-note-icon{width:30px;height:30px}}',
'#sc-word-menu{display:flex;gap:8px;position:fixed;z-index:2147483001;padding:10px;border-radius:15px;background:#fff;box-shadow:0 13px 35px #1a0e4466;border:1px solid #e1d5f1}',
'#sc-word-menu[hidden],#sc-dict-modal[hidden],#sc-dict-shade[hidden]{display:none!important}',
'#sc-word-menu button,#sc-dict-modal button{border:1px solid #d6c7ed;background:#f3edff;color:#4c239a;padding:9px 12px;border-radius:10px;font:800 13px system-ui;cursor:pointer}',
'#sc-dict-shade{display:none!important}',
'#sc-dict-modal{position:fixed;z-index:2147483001;top:0;left:0;transform:none;width:min(350px,calc(100vw - 20px));max-height:min(440px,calc(100vh - 20px));overflow:auto;background:white;padding:15px;border-radius:15px;font:13px/1.5 system-ui;color:#281753;box-shadow:0 10px 32px #1b0e4733}',
'#sc-dict-modal h2{color:#3b0e90;margin:0;font-size:27px}#sc-dict-modal .dict-head{display:flex;justify-content:space-between;align-items:center;gap:12px}',
'#sc-dict-modal .sense{margin:12px 0;border-top:1px solid #e8def2;padding-top:10px}#sc-dict-modal .sense b{color:#6b3abb}',
'#sc-dict-modal .actions{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}'
].join('');
document.head.append(css);
const button=document.createElement('button');button.id='sc-note-button';button.type='button';
button.setAttribute('aria-label','Mở sổ tay từ vựng');button.title='Sổ tay từ vựng';
const noteIcon=document.createElement('span');noteIcon.className='sc-note-icon';noteIcon.setAttribute('aria-hidden','true');
noteIcon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.75h11.5a2 2 0 0 1 2 2V20H7.5A3.5 3.5 0 0 1 4 16.5V6a2.25 2.25 0 0 1 2-2.25Z"/><path d="M7.5 20A3.5 3.5 0 0 1 4 16.5c0-1.9 1.6-3.25 3.5-3.25h12"/><path d="M9 8h6M9 11h4"/></svg>';
const noteLabel=document.createElement('span');noteLabel.className='sc-note-label';noteLabel.textContent='Sổ tay';
button.append(noteIcon,noteLabel);
button.onclick=()=>location.href=new URL('Vocabulary-Notebook/',root).href;document.body.append(button);
const menu=document.createElement('div');menu.id='sc-word-menu';menu.hidden=true;
const lookup=document.createElement('button');lookup.textContent='🔎 Tra từ';
const add=document.createElement('button');add.textContent='📒 Thêm vào sổ tay';
menu.append(lookup,add);document.body.append(menu);
const shade=document.createElement('div');shade.id='sc-dict-shade';shade.hidden=true;document.body.append(shade);
const modal=document.createElement('section');modal.id='sc-dict-modal';modal.hidden=true;document.body.append(modal);
let word='',entry=null,vietnamese='',requestId=0,anchor={x:20,y:20};
const currentPhrase=()=>PHRASES[word]||null;
const dictionaryCache=new Map();
function position(panel){
 const rect=panel.getBoundingClientRect(),width=rect.width||350,height=rect.height||200;
 const x=Math.max(10,Math.min(innerWidth-width-10,anchor.x));
 const y=anchor.y+height+15<innerHeight?anchor.y+8:anchor.y-height-8;
 panel.style.left=x+'px';panel.style.top=Math.max(10,Math.min(innerHeight-height-10,y))+'px';
}
function displayPanel(){modal.hidden=false;shade.hidden=true;position(modal)}
function close(){requestId++;menu.hidden=true;modal.hidden=true;shade.hidden=true}
shade.onclick=close;
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
function buttonEl(text,onClick){const b=document.createElement('button');b.textContent=text;b.onclick=onClick;return b}
function addText(parent,type,value,cls){const el=document.createElement(type);if(cls)el.className=cls;el.textContent=value;parent.append(el);return el}
function saveWord(){
 if(!word)return;
 const list=load();
 const meaning=currentPhrase()?.[1]||entry?.meanings?.[0]?.definitions?.[0]?.definition||'';
 const item={word,meaning:vietnamese||currentPhrase()?.[0]||meaning,phonetic:entry?.phonetic||entry?.phonetics?.find(x=>x.text)?.text||'',partOfSpeech:currentPhrase()?'phrase':entry?.meanings?.[0]?.partOfSpeech||'',example:currentPhrase()?.[2]||entry?.meanings?.[0]?.definitions?.find(x=>x.example)?.example||'',savedAt:new Date().toISOString()};
 const i=list.findIndex(x=>x.word===word);
 if(i<0)list.unshift(item);else list[i]={...list[i],...Object.fromEntries(Object.entries(item).filter(([k,v])=>k==='savedAt'||v))};
 if(save(list)){menu.hidden=true;if(modal.hidden){modal.replaceChildren();addText(modal,'h2','✓ Đã lưu '+word);modal.append(buttonEl('Mở sổ tay',()=>location.href=new URL('Vocabulary-Notebook/',root).href));displayPanel()}else{const p=addText(modal,'p','✓ Đã lưu vào sổ tay');position(modal)}}else alert('Không thể lưu từ trên trình duyệt này.');
}
function render(){
 modal.replaceChildren();
 const head=document.createElement('div');head.className='dict-head';addText(head,'h2',word);head.append(buttonEl('×',close));modal.append(head);
 if(!word.includes(' ')||entry?.phonetic)addText(modal,'p',entry?.phonetic||entry?.phonetics?.find(x=>x.text)?.text||'IPA chưa có sẵn');
 if(vietnamese||currentPhrase())addText(modal,'p','🇻🇳 Nghĩa tiếng Việt: '+(currentPhrase()?.[0]||vietnamese));
 const actions=document.createElement('div');actions.className='actions';
 const sounds=(entry?.phonetics||[]).filter(x=>x.audio).slice(0,2);
 sounds.forEach((p,i)=>actions.append(buttonEl('🔊 Phát âm '+(i+1),()=>{const a=new Audio(p.audio.startsWith('//')?'https:'+p.audio:p.audio);a.play().catch(()=>speak(word))})));
 if(!sounds.length)actions.append(buttonEl('🔊 Phát âm',()=>speak(word)));
 actions.append(buttonEl('＋ Lưu vào sổ tay',saveWord));modal.append(actions);
 if(currentPhrase()){const section=document.createElement('div');section.className='sense';addText(section,'b','Phrase / Idiom');addText(section,'p',currentPhrase()[1]);addText(section,'small','Example: '+currentPhrase()[2]);modal.append(section)}
 if(!entry&&!currentPhrase()){addText(modal,'p',vietnamese?'Nghĩa dịch tham khảo; chưa có định nghĩa từ điển cho cụm từ này.':'Chưa tìm được định nghĩa. Có thể lưu vào sổ tay và bổ sung nghĩa sau.');}
 for(const m of (entry?.meanings||[]).slice(0,6)){
  const section=document.createElement('div');section.className='sense';addText(section,'b',m.partOfSpeech||'Meaning');
  (m.definitions||[]).slice(0,4).forEach(d=>{addText(section,'p','• '+d.definition);if(d.example)addText(section,'small','Example: '+d.example)});
  modal.append(section);
 }
 addText(modal,'small',currentPhrase()?'Nghĩa và ví dụ được biên tập cho bài học.':'Nguồn Free Dictionary API / bản dịch tham khảo.');position(modal);
}
async function translatePhrase(text){
 try{
  const response=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(text.slice(0,220))+'&langpair=en%7Cvi');
  if(response.ok){const json=await response.json();const translated=json?.responseData?.translatedText||'';return translated.toLowerCase()===text.toLowerCase()?'':translated}
 }catch(e){}
 return '';
}
async function fetchMeaning(term,id){
 entry=dictionaryCache.get(term)||null;vietnamese=currentPhrase()?.[0]||'';
 if(!entry){
  try{
   const response=await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(term),{cache:'force-cache'});
   if(response.ok){entry=(await response.json())?.[0]||null;if(entry)dictionaryCache.set(term,entry)}
  }catch(e){}
 }
 if(id!==requestId||term!==word)return false;
 if(!vietnamese){
  const toTranslate=term.includes(' ')?term:entry?.meanings?.[0]?.definitions?.[0]?.definition||term;
  vietnamese=await translatePhrase(toTranslate);
 }
 return id===requestId&&term===word;
}
lookup.onclick=async()=>{
 menu.hidden=true;
 const requested=word,id=++requestId;
 modal.textContent='Đang tra “'+requested+'”…';displayPanel();
 if(currentPhrase()){vietnamese=currentPhrase()[0];entry=null;render();return}
 const ok=await fetchMeaning(requested,id);
 if(ok&&!modal.hidden)render();
};
add.onclick=async()=>{
 const requested=word,id=++requestId;
 menu.hidden=true;
 if(currentPhrase()){vietnamese=currentPhrase()[0];entry=null;saveWord();return}
 modal.textContent='Đang lưu “'+requested+'”…';displayPanel();
 const ok=await fetchMeaning(requested,id);
 if(ok)saveWord();
};

function showTerm(term,range,event){
 const normalized=norm(term);
 if(isExam()||!validTerm(normalized))return;
 requestId++;word=normalized;entry=null;vietnamese='';modal.hidden=true;
 const rect=range?.getBoundingClientRect?.();
 anchor={x:rect?.left??event.clientX??20,y:rect?.bottom??event.clientY??20};
 menu.hidden=false;position(menu);
}
function selectedRange(){
 const sel=window.getSelection();return sel?.rangeCount?sel.getRangeAt(0):null;
}
function knownPhraseAt(range){
 if(!range||range.startContainer!==range.endContainer||range.startContainer.nodeType!==Node.TEXT_NODE)return null;
 const node=range.startContainer,text=node.textContent||'';
 for(const phrase of phraseList){
  const lower=text.toLowerCase();
  let from=0;
  while((from=lower.indexOf(phrase,from))!==-1){
   const finish=from+phrase.length;
   const before=from===0||!/[a-z]/.test(lower[from-1]);
   const after=finish===lower.length||!/[a-z]/.test(lower[finish]);
   if(before&&after&&from<=range.startOffset&&finish>=range.endOffset)
    return {phrase,start:from,end:finish};
   from++;
  }
 }
 return null;
}
function handleSelection(event,expand){
 if(isExam()||event.target.closest?.('button,a,input,textarea,select,[contenteditable],[role="button"],#sc-dict-modal,#sc-word-menu'))return;
 const range=selectedRange(),sel=window.getSelection();
 if(!range||!sel)return;
 const selected=norm(sel.toString());
 if(!selected)return;
 if(expand&&!selected.includes(' ')){
  const match=knownPhraseAt(range);
  if(match){
   const next=range.cloneRange();
   next.setStart(range.startContainer,match.start);
   next.setEnd(range.endContainer,match.end);
   sel.removeAllRanges();sel.addRange(next);
   showTerm(match.phrase,next,event);return;
  }
 }
 if(selected.includes(' ')||expand)showTerm(selected,range,event);
}
document.addEventListener('dblclick',e=>handleSelection(e,true));
document.addEventListener('mouseup',e=>{
 if(window.getSelection()?.toString().trim().includes(' '))handleSelection(e,false);
});
document.addEventListener('touchend',e=>{
 if(!window.getSelection()?.toString().trim().includes(' '))return;
 const touch=e.changedTouches?.[0];
 handleSelection({target:e.target,clientX:touch?.clientX||innerWidth/2,clientY:touch?.clientY||innerHeight/2},false);
});

/* Mark words and known expressions in reading passages; the longest known phrase wins. */
const markStyle=document.createElement('style');
markStyle.textContent='.sc-lexeme{display:inline;border-radius:6px;padding:1px 2px;margin:0 -2px;cursor:help;box-decoration-break:clone;-webkit-box-decoration-break:clone;transition:background-color .14s ease,box-shadow .14s ease}.sc-lexeme:hover,.sc-lexeme:focus-visible{background:rgba(113,70,199,.13);box-shadow:inset 0 0 0 1px rgba(113,70,199,.25);outline:none}.sc-lexeme[data-sc-phrase]{border-radius:7px}.sc-lexeme:focus-visible{box-shadow:0 0 0 2px #9b80de}';
document.head.append(markStyle);
const phrasePattern=new RegExp('(?<![A-Za-z])(?:'+phraseList.map(p=>p.replace(/\s+/g,'\\s+')).join('|')+')(?![A-Za-z])','gi');
function markReadingTerms(container){
 if(!container||container.dataset.scLexemes==='1')return;
 container.dataset.scLexemes='1';
 const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(node=>{
  if(!node.parentElement||node.parentElement.closest('a,button,script,style,.sc-lexeme'))return;
  const source=node.nodeValue;if(!source||!/[a-z]/i.test(source))return;
  const phraseMatches=[];
  phrasePattern.lastIndex=0;let hit;
  while((hit=phrasePattern.exec(source)))phraseMatches.push({start:hit.index,end:phrasePattern.lastIndex,term:hit[0]});
  const fragment=document.createDocumentFragment();
  const createTerm=(value,phrase)=>{
   const el=document.createElement('span');el.className='sc-lexeme';el.textContent=value;el.dataset.scTerm=norm(value);
   if(phrase)el.dataset.scPhrase='1';el.tabIndex=0;el.title='Nhấp đúp để tra nghĩa';
   return el;
  };
  const splitWords=segment=>{
   const re=/[A-Za-z]+(?:['’\-][A-Za-z]+)*/g;let last=0,m;
   while((m=re.exec(segment))){
    if(m.index>last)fragment.append(document.createTextNode(segment.slice(last,m.index)));
    fragment.append(createTerm(m[0],false));last=re.lastIndex;
   }
   if(last<segment.length)fragment.append(document.createTextNode(segment.slice(last)));
  };
  let cursor=0;phraseMatches.forEach(match=>{
   if(match.start<cursor)return;
   splitWords(source.slice(cursor,match.start));fragment.append(createTerm(source.slice(match.start,match.end),true));cursor=match.end;
  });splitWords(source.slice(cursor));node.replaceWith(fragment);
 });
}
window.scMarkReadingTerms=markReadingTerms;
document.addEventListener('dblclick',e=>{
 const span=e.target.closest?.('.sc-lexeme');if(!span||isExam())return;
 e.preventDefault();e.stopImmediatePropagation();
 const rect=span.getBoundingClientRect();
 showTerm(span.dataset.scTerm,null,{clientX:rect.left,clientY:rect.bottom});
 if(!word)return;
 lookup.click();
},true);
document.addEventListener('keydown',e=>{
 if(e.key!=='Enter')return;const span=e.target.closest?.('.sc-lexeme');if(!span||isExam())return;
 e.preventDefault();const rect=span.getBoundingClientRect();
 showTerm(span.dataset.scTerm,null,{clientX:rect.left,clientY:rect.bottom});lookup.click();
});

document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target)&&!modal.contains(e.target))close()});
window.addEventListener('scroll',()=>{if(!menu.hidden||!modal.hidden)close()},{passive:true});
const observer=new MutationObserver(()=>{button.hidden=isExam()||location.pathname.includes('/Vocabulary-Notebook/');if(isExam())close()});
observer.observe(document.body,{attributes:true,attributeFilter:['class'],subtree:false});
const testSection=document.getElementById('testSection');if(testSection)observer.observe(testSection,{attributes:true,attributeFilter:['class']});
window.addEventListener('popstate',()=>{button.hidden=isExam()||location.pathname.includes('/Vocabulary-Notebook/');close()});
button.hidden=isExam()||location.pathname.includes('/Vocabulary-Notebook/');
})();