/* Shared dictionary + Take Note UX for Reading Practice.
 * Reuses the exact Reading Library/Silk lexicon, IPA, audio and notebook.
 * Preserves each practice engine's existing answer keys, mark storage and note actions.
 * Reading Test is intentionally excluded.
 */
(()=>{'use strict';
 if(window.__scReadingPracticeTools)return;
 if(!/\/Practice\/Reading\//.test(location.pathname))return;
 if(/\/ReadingTest\/|\/ReadingPracticeTest\/|\/mock-test\//i.test(location.pathname))return;
 if(document.body.classList.contains('silk-reading'))return; // Original Silk remains the reference.
 const hostRoots=['source','questionsSource','passageRoot','questionsRoot','passageHost'].map(id=>document.getElementById(id)).filter(Boolean);
 if(!hostRoots.length)return;
 window.__scReadingPracticeTools=true;
 document.body.classList.add('sc-reading-silk-tools');
 const script=document.currentScript;
 const toolURL=new URL('../shared/word-tools.js?v=20261127-reading-silk-unified01',script.src).href;
 const style=document.createElement('style');
 style.id='sc-reading-silk-shared-style';
 style.textContent=[
  'body.sc-reading-silk-tools #sc-word-menu{display:none!important}',
  'body.sc-reading-silk-tools .sc-lexeme{padding:0!important;margin:0!important;cursor:pointer;box-decoration-break:clone;-webkit-box-decoration-break:clone}',
  'body.sc-reading-silk-tools .sc-lexeme:hover,body.sc-reading-silk-tools .sc-lexeme:focus-visible{background:#f1ebff!important;box-shadow:inset 0 -2px #9f83dc80}',
  'body.sc-reading-silk-tools .note-anchor{background:#fff0b7;border-bottom:2px dotted #7341bc;cursor:help}',
  'body.sc-reading-silk-tools .sc-reading-note-tip{position:fixed;z-index:100120;pointer-events:none;max-width:min(340px,calc(100vw - 24px));padding:11px 14px;border-radius:12px;background:#281260;color:#fff;box-shadow:0 12px 32px #22114c40;white-space:pre-wrap;overflow-wrap:anywhere;font:600 13px/1.55 system-ui}',
  '.sc-reading-note-tip[hidden]{display:none!important}'
 ].join('\n');
 document.head.append(style);

 function mark(){
  if(typeof window.scMarkReadingTerms!=='function')return;
  for(const root of hostRoots){
   if(!root.isConnected)continue;
   if(!root.querySelector('.sc-lexeme'))root.removeAttribute('data-sc-lexemes');
   window.scMarkReadingTerms(root);
  }
 }
 let scheduled=false;
 function schedule(){
  if(scheduled)return;scheduled=true;
  setTimeout(()=>{scheduled=false;mark()},60);
 }
 function boot(){
  mark();
  // Some passages are dynamically re-rendered when navigating, not on initial load.
  for(const root of hostRoots){
   const watcher=new MutationObserver(records=>{
    if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&!(n.matches?.('.sc-lexeme'))))){
     if(!root.querySelector('.sc-lexeme'))schedule();
    }
   });
   watcher.observe(root,{childList:true});
  }
 }
 if(typeof window.scMarkReadingTerms==='function')boot();
 else{
  let pending=document.querySelector('script[data-sc-word-tools]');
  if(pending)pending.addEventListener('load',boot,{once:true});
  else{
   pending=document.createElement('script');
   pending.dataset.scWordTools='1';
   pending.src=toolURL;
   pending.addEventListener('load',boot,{once:true});
   pending.addEventListener('error',()=>console.warn('[Reading] Không tải được từ điển chung'));
   document.body.append(pending);
  }
 }
 // Use the existing built-in note tooltip for standard exercises.
 // Cambridge and 3-passage practices need a hover/touch tooltip of their own.
 if(!document.querySelector('.reading-note-tooltip')){
  const tip=document.createElement('div');
  tip.className='sc-reading-note-tip';
  tip.hidden=true;tip.setAttribute('role','tooltip');document.body.append(tip);
  let active=null;
  const roots='#source .note-anchor,#questionsSource .note-anchor,#passageHost .note-anchor';
  const message=el=>el?.dataset?.note||el?.getAttribute('title')||'';
  function hide(){active=null;tip.hidden=true}
  function show(note){
   const content=message(note);if(!content){hide();return}
   active=note;tip.textContent='📝 Ghi chú\n'+content;tip.hidden=false;
   const r=note.getBoundingClientRect(),w=tip.offsetWidth||320,h=tip.offsetHeight||70;
   tip.style.left=Math.max(10,Math.min(innerWidth-w-10,r.left))+'px';
   tip.style.top=Math.max(10,Math.min(innerHeight-h-10,r.bottom+8))+'px';
  }
  document.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const note=e.target.closest?.(roots);if(note&&note!==active)show(note)});
  document.addEventListener('pointerout',e=>{if(active&&e.target.closest?.('.note-anchor')===active&&!active.contains(e.relatedTarget))hide()});
  document.addEventListener('focusin',e=>{const note=e.target.closest?.(roots);if(note)show(note)});
  document.addEventListener('focusout',e=>{if(e.target===active)hide()});
  document.addEventListener('touchstart',e=>{const note=e.target.closest?.(roots);if(note)show(note);else hide()},{passive:true});
  window.addEventListener('scroll',hide,{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
 }
 // Basic text clicks are dictionary gestures, not annotation gestures.
 // Leave the original drag selection + highlight/take-note menu untouched.
 let origin=null;
 document.addEventListener('mousedown',e=>{
  if(e.button!==0||!e.target.closest?.('#passageRoot,#questionsRoot,#passageHost')){origin=null;return}
  origin={x:e.clientX,y:e.clientY};
 },true);
 document.addEventListener('mouseup',e=>{
  if(!origin)return;
  const moved=Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>5;
  origin=null;
  if(!moved||e.detail>=2)e.stopPropagation();
 },true);
})();
