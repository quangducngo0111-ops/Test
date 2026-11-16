/* Vocabulary reminder scheduler. Works while a Smartcom page is open; Web Push server is required for closed-app delivery. */
(()=>{'use strict';
 if(window.__scVocabReminderLoaded)return;window.__scVocabReminderLoaded=true;
 const prefix='SC_VOCAB_REMINDER_V1_';
 const scope=()=>{try{const p=JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null');return p?.name&&p.className?(p.name+'|'+p.className).toLowerCase():'guest'}catch{return 'guest'}};
 const key=()=>prefix+scope();
 const get=()=>{try{return JSON.parse(localStorage.getItem(key())||'null')}catch{return null}};
 const put=plan=>{try{localStorage.setItem(key(),JSON.stringify(plan));return true}catch{return false}};
 const base=new URL('../../',document.currentScript?.src||location.href);
 let busy=false;
 function toast(word,meaning){
  let el=document.getElementById('sc-reminder-toast');
  if(!el){
   el=document.createElement('div');el.id='sc-reminder-toast';el.setAttribute('role','status');
   el.style.cssText='position:fixed;right:17px;bottom:20px;z-index:2147483002;width:min(320px,calc(100vw - 34px));background:#fff;color:#32156f;border:1px solid #dcd0f0;border-radius:16px;padding:16px;box-shadow:0 12px 34px #29174e36;font:14px/1.6 system-ui;cursor:pointer';
   el.title='Mở Sổ tay từ vựng';el.onclick=()=>location.href=new URL('Vocabulary-Notebook/',base).href;
   document.body.append(el);
  }
  el.replaceChildren();
  const heading=document.createElement('strong');heading.textContent='📚 Từ cần nhớ: '+word;
  const detail=document.createElement('div');detail.textContent=meaning||'Mở sổ tay để xem nghĩa và ví dụ';
  el.append(heading,detail);
  clearTimeout(window.__scReminderToastTimer);
  window.__scReminderToastTimer=setTimeout(()=>el.remove(),12000);
 }
 function notify(item){
  const word=item.word,meaning=item.meaning||'Mở sổ tay để xem nghĩa';
  if('Notification' in window&&Notification.permission==='granted'){
   try{
    const n=new Notification('Ôn từ hôm nay: '+word,{body:meaning,tag:'sc-vocab-reminder',icon:undefined});
    n.onclick=()=>{window.focus();location.href=new URL('Vocabulary-Notebook/',base).href;n.close()};
   }catch{toast(word,meaning)}
  }else toast(word,meaning);
 }
 function check(){
  if(busy)return;busy=true;
  try{
   const plan=get();
   if(!plan?.enabled||!Array.isArray(plan.words)||!plan.words.length||!Number.isFinite(plan.nextAt))return;
   if(Date.now()<plan.nextAt)return;
   // A late timer delivers ONE item rather than sending many missed notifications at once.
   const index=(plan.index||0)%plan.words.length;
   const item=plan.words[index];
   plan.index=(index+1)%plan.words.length;
   if(plan.index===0){plan.enabled=false;plan.completedAt=Date.now()}
   plan.nextAt=Date.now()+Math.max(1,Number(plan.intervalMinutes)||5)*60000;
   plan.lastDeliveredAt=Date.now();
   if(put(plan))notify(item);
   window.dispatchEvent(new Event('sc-vocab-reminder-updated'));
  }finally{busy=false}
 }
 window.scVocabReminders={get,put,check};
 setInterval(check,10000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
 window.addEventListener('focus',check);
 window.addEventListener('storage',e=>{if(e.key===key())check()});
 check();
})();