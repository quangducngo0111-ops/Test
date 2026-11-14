/* Shared portal student identity gate for standalone Reading pages.
 * The homepage owns IELTS_PRACTICE_STUDENT. No query-string names and no
 * external identity/API calls. Protects data consistency, not authentication.
 */
(function(){
'use strict';
const CLASSES=['XD25A02.1','XD25A02.2','XD26A03.1','SS26.1','SS25A01.1','SS25IE2','OP.AD.07','OP.ESS.11'];
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
// A stored homepage profile means the student is already identified on the same
// website; skip the redundant gate and enter the exercise directly.
const existing=getProfile();
if(existing && new URLSearchParams(location.search).get('fromPortal')==='1'){
 nameInput.value=existing.name;
 classInput.value=existing.className;
 // Allow the original page setup scripts to finish before starting.
 queueMicrotask(()=>{if(!started)window[startName]();});
}
})();
