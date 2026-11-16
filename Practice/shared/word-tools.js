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
const norm=w=>String(w||'').trim().toLowerCase().replace(/^[^a-z]+|[^a-z]+$/gi,'').trim();
const speak=word=>{if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const v=new SpeechSynthesisUtterance(word);v.lang='en-GB';v.rate=.85;window.speechSynthesis.speak(v)};
const css=document.createElement('style');
css.textContent=[
'#sc-note-button{position:fixed;bottom:16px;left:16px;z-index:2147480000;border:1px solid #d9caee;background:#fff;color:#4b239b;border-radius:16px;padding:12px 14px;box-shadow:0 7px 25px #2410512b;font:800 13px system-ui;cursor:pointer}',
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
const button=document.createElement('button');button.id='sc-note-button';button.type='button';button.textContent='📒 Sổ tay từ vựng';
button.onclick=()=>location.href=new URL('Vocabulary-Notebook/',root).href;document.body.append(button);
const menu=document.createElement('div');menu.id='sc-word-menu';menu.hidden=true;
const lookup=document.createElement('button');lookup.textContent='🔎 Tra từ';
const add=document.createElement('button');add.textContent='📒 Thêm vào sổ tay';
menu.append(lookup,add);document.body.append(menu);
const shade=document.createElement('div');shade.id='sc-dict-shade';shade.hidden=true;document.body.append(shade);
const modal=document.createElement('section');modal.id='sc-dict-modal';modal.hidden=true;document.body.append(modal);
let word='',entry=null,vietnamese='',requestId=0,anchor={x:20,y:20};
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
 const meaning=entry?.meanings?.[0]?.definitions?.[0]?.definition||'';
 const item={word,meaning:vietnamese||meaning,phonetic:entry?.phonetic||entry?.phonetics?.find(x=>x.text)?.text||'',partOfSpeech:entry?.meanings?.[0]?.partOfSpeech||'',example:entry?.meanings?.[0]?.definitions?.find(x=>x.example)?.example||'',savedAt:new Date().toISOString()};
 const i=list.findIndex(x=>x.word===word);
 if(i<0)list.unshift(item);else list[i]={...list[i],...Object.fromEntries(Object.entries(item).filter(([k,v])=>k==='savedAt'||v))};
 if(save(list)){menu.hidden=true;if(modal.hidden){modal.replaceChildren();addText(modal,'h2','✓ Đã lưu '+word);modal.append(buttonEl('Mở sổ tay',()=>location.href=new URL('Vocabulary-Notebook/',root).href));displayPanel()}else{const p=addText(modal,'p','✓ Đã lưu vào sổ tay');position(modal)}}else alert('Không thể lưu từ trên trình duyệt này.');
}
function render(){
 modal.replaceChildren();
 const head=document.createElement('div');head.className='dict-head';addText(head,'h2',word);head.append(buttonEl('×',close));modal.append(head);
 addText(modal,'p',entry?.phonetic||entry?.phonetics?.find(x=>x.text)?.text||'IPA chưa có sẵn');
 if(vietnamese)addText(modal,'p','🇻🇳 Nghĩa tiếng Việt (tham khảo): '+vietnamese);
 const actions=document.createElement('div');actions.className='actions';
 const sounds=(entry?.phonetics||[]).filter(x=>x.audio).slice(0,2);
 sounds.forEach((p,i)=>actions.append(buttonEl('🔊 Phát âm '+(i+1),()=>{const a=new Audio(p.audio.startsWith('//')?'https:'+p.audio:p.audio);a.play().catch(()=>speak(word))})));
 if(!sounds.length)actions.append(buttonEl('🔊 Phát âm',()=>speak(word)));
 actions.append(buttonEl('＋ Lưu vào sổ tay',saveWord));modal.append(actions);
 if(!entry){addText(modal,'p','Chưa tìm thấy nghĩa hoặc nguồn từ điển đang không khả dụng.');}
 for(const m of (entry?.meanings||[]).slice(0,6)){
  const section=document.createElement('div');section.className='sense';addText(section,'b',m.partOfSpeech||'Meaning');
  (m.definitions||[]).slice(0,4).forEach(d=>{addText(section,'p','• '+d.definition);if(d.example)addText(section,'small','Example: '+d.example)});
  modal.append(section);
 }
 addText(modal,'small','Nguồn Free Dictionary API / Wiktionary.');position(modal);
}
lookup.onclick=async()=>{
 menu.hidden=true;const requested=word,id=++requestId;
 modal.textContent='Đang tra “'+word+'”…';displayPanel();
 entry=dictionaryCache.get(word)||null;vietnamese='';
 if(entry){render();return}
 try{
  const response=await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(requested),{cache:'force-cache'});
  if(response.ok){const data=await response.json();entry=data?.[0]||null;if(entry)dictionaryCache.set(requested,entry)}
 }catch(e){}
 if(id!==requestId||requested!==word||modal.hidden)return;
 render();
 if(entry){
  const first=entry.meanings?.[0]?.definitions?.[0]?.definition||requested;
  try{
   const resp=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(first.slice(0,240))+'&langpair=en%7Cvi');
   if(resp.ok){const d=await resp.json();const v=d?.responseData?.translatedText||'';if(v.toLowerCase()!==first.toLowerCase())vietnamese=v}
  }catch(e){}
  if(id===requestId&&requested===word&&!modal.hidden)render();
 }
};
add.onclick=async()=>{
 const requested=word;
 if(!entry){try{const response=await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(word));if(response.ok)entry=(await response.json())?.[0]||null}catch(e){}}
 if(requested===word&&entry&&!vietnamese){
  try{const definition=entry.meanings?.[0]?.definitions?.[0]?.definition||word;
   const resp=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(definition.slice(0,240))+'&langpair=en%7Cvi');
   if(resp.ok){const d=await resp.json();vietnamese=d?.responseData?.translatedText||'';if(vietnamese.toLowerCase()===definition.toLowerCase())vietnamese=''}
  }catch(e){}
 }
 if(requested===word)saveWord();
};
document.addEventListener('dblclick',e=>{
 if(isExam()||e.target.closest?.('button,a,input,textarea,select,[contenteditable],[role="button"],#sc-dict-modal,#sc-word-menu'))return;
 const selected=norm(window.getSelection()?.toString());
 if(!/^[a-z][a-z'-]{0,38}$/i.test(selected))return;
 requestId++;word=selected;entry=null;vietnamese='';modal.hidden=true;
 const range=window.getSelection()?.rangeCount?window.getSelection().getRangeAt(0).getBoundingClientRect():null;
 anchor={x:range?.left??e.clientX,y:range?.bottom??e.clientY};
 menu.hidden=false;position(menu);
});
document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target)&&!modal.contains(e.target))close()});
window.addEventListener('scroll',()=>{if(!menu.hidden||!modal.hidden)close()},{passive:true});
const observer=new MutationObserver(()=>{button.hidden=isExam()||location.pathname.includes('/Vocabulary-Notebook/');if(isExam())close()});
observer.observe(document.body,{attributes:true,attributeFilter:['class'],subtree:false});
const testSection=document.getElementById('testSection');if(testSection)observer.observe(testSection,{attributes:true,attributeFilter:['class']});
window.addEventListener('popstate',()=>{button.hidden=isExam()||location.pathname.includes('/Vocabulary-Notebook/');close()});
button.hidden=isExam()||location.pathname.includes('/Vocabulary-Notebook/');
})();