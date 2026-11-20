
/* Load the common draggable AssistiveTouch in every standalone lesson using this toolkit. */
(()=>{if(window.__scQuickLoaderQueued||document.querySelector('script[data-sc-quick-bootstrap]'))return;const current=document.currentScript;if(!current)return;const script=document.createElement('script');script.dataset.scQuickBootstrap='1';script.src=new URL('quick-access-loader.js?v=20261119-05',current.src).href;(document.body||document.head).append(script);})();
/* Capture and queue submissions even on standalone Reading/Listening URLs. */
(()=>{const current=document.currentScript;if(!current||window.SmartcomHistory||document.querySelector('script[data-sc-result-ledger]'))return;
 const tag=document.createElement('script');tag.dataset.scResultLedger='1';
 tag.src=new URL('../Practice/shared/attempt-history.js?v=20261120-unified03',current.src).href;
 (document.head||document.documentElement).append(tag);
})();
/* Shared portal student identity gate for standalone Reading pages.
 * The homepage owns IELTS_PRACTICE_STUDENT. No query-string names and no
 * external identity/API calls. Protects data consistency, not authentication.
 */
(function(){
'use strict';
if(!document.querySelector('script[data-sc-area-loader]')){const t=document.createElement('script');t.dataset.scAreaLoader='1';t.src=new URL('area-theme-loader.js?v=20261118-premium02',document.currentScript.src).href;document.head.append(t);}
if(!document.querySelector('script[data-sc-outline-icons]')){const iconScript=document.createElement('script');iconScript.dataset.scOutlineIcons='1';iconScript.src=new URL('smartcom-outline-icons.js?v=20261118-icons01',document.currentScript.src).href;document.head.append(iconScript);}
const CLASSES=['XD25A02.1','XD25A02.2','XD26A03.1','SS26.1','SS25A01.1','SS25IE2','OP.AD.07','OP.ESS.11','TEST'];
const STUDENT_KEY='IELTS_PRACTICE_STUDENT';
const nameInput=document.getElementById('studentName');
const classInput=document.getElementById('studentClass');
if(!nameInput||!classInput)return;
let started=false;
const canonical=v=>CLASSES.find(c=>c.toLowerCase()===String(v||'').trim().toLowerCase())||'';
function normalize(obj){
 if(!obj||typeof obj!=='object')return null;
 const name=String(obj.name||'').trim().replace(/\s+/g,' ');
 const className=canonical(obj.className);
 return name&&className?{name,className}:null;
}
function getProfile(){
 try{return normalize(JSON.parse(localStorage.getItem(STUDENT_KEY)||'null'))}catch(e){return null}
}
function saveProfile(student){
 localStorage.setItem(STUDENT_KEY,JSON.stringify(student));
 for(const store of [localStorage,sessionStorage]){
  store.setItem('IELTS_STUDENT_NAME',student.name);
  store.setItem('IELTS_STUDENT_CLASS',student.className);
 }
}
// Existing page markup stays intact; this datalist supplies search suggestions.
const datalist=document.createElement('datalist');
datalist.id='readingClassOptions';
document.body.appendChild(datalist);
function refreshOptions(value){
 const prefix=String(value||'').trim().toLowerCase();
 datalist.replaceChildren(...CLASSES.filter(x=>x.toLowerCase().startsWith(prefix)).map(label=>{
  const opt=document.createElement('option');opt.value=label;return opt;
 }));
}
classInput.setAttribute('list',datalist.id);
classInput.setAttribute('autocomplete','off');
classInput.setAttribute('placeholder','Tìm lớp, ví dụ XD...');
nameInput.setAttribute('autocomplete','name');
nameInput.required=true;
classInput.required=true;
classInput.addEventListener('input',()=>refreshOptions(classInput.value));
classInput.addEventListener('focus',()=>refreshOptions(classInput.value));
refreshOptions('');
const helper=document.createElement('div');
helper.textContent='Chỉ chọn lớp trong danh sách. Gõ XD, SS hoặc OP để lọc lớp.';
helper.style.cssText='font:600 12px/1.6 system-ui;color:#685884;margin-top:6px';
classInput.insertAdjacentElement('afterend',helper);
const nativeStart=typeof window.startExam==='function'?window.startExam:
 typeof window.startPractice==='function'?window.startPractice:null;
if(!nativeStart)return;
const startName=typeof window.startExam==='function'?'startExam':'startPractice';
const validStart=function(){
 if(started)return;
 const student=normalize({name:nameInput.value,className:classInput.value});
 if(!student){
   const error=document.getElementById('startError')||document.getElementById('startErr');
   if(error)error.textContent='Vui lòng nhập họ tên và chọn đúng một trong 8 lớp có sẵn.';
   else alert('Vui lòng nhập họ tên và chọn lớp hợp lệ.');
   classInput.focus();
   return;
 }
 nameInput.value=student.name;
 classInput.value=student.className;
 saveProfile(student);
 started=true;
 try{nativeStart.apply(this,arguments);}catch(e){started=false;throw e}
};
window[startName]=validStart;
// A valid saved Portal profile is sufficient regardless of how the learner
// navigated here (direct link, hub card, reload or fromPortal query).
// The Portal remains the source of truth for identity.
const existing=getProfile();
if(existing){
 nameInput.value=existing.name;
 classInput.value=existing.className;
 // Allow the original page setup scripts to finish before starting.
 queueMicrotask(()=>{if(!started)window[startName]();});
}
})();
