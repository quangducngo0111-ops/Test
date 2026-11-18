/* Student attempt history, local resilient store. Server Test history remains in Progress. */
(()=>{'use strict';
if(window.SmartcomHistory)return;
const STORAGE='SC_ATTEMPT_HISTORY_V1';
function profile(){try{return JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null')}catch{return null}}
function identity(p){return [p?.studentId||'',p?.name||'',p?.className||''].join('|').trim().toLowerCase()}
function all(){try{const a=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
function list(){const id=identity(profile());return id?all().filter(x=>x.owner===id).sort((a,b)=>Date.parse(b.submittedAt||b.savedAt)-Date.parse(a.submittedAt||a.savedAt)):[]}
function save(payload){const p=profile();if(!p?.name||!p?.className)return null;const a=all();const record={...payload,owner:identity(p),name:p.name,className:p.className,skill:payload.skill||'Unknown',kind:payload.kind==='Test'?'Test':'Practice',savedAt:new Date().toISOString(),attemptId:payload.attemptId||('a-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8))};const at=a.findIndex(x=>x.attemptId===record.attemptId&&x.owner===record.owner);if(at>=0)a[at]={...a[at],...record};else a.push(record);try{localStorage.setItem(STORAGE,JSON.stringify(a.slice(-3000)));window.dispatchEvent(new CustomEvent('sc:attempt-saved',{detail:record}));return record}catch(e){console.warn('History storage full',e);return null}}
function submit(payload){return save({...payload,status:'completed',submittedAt:payload.submittedAt||new Date().toISOString()})}
function draft(payload){return save({...payload,status:'draft'})}
window.SmartcomHistory={save,submit,draft,list,all,profile};
window.addEventListener('sc:attempt-completed',e=>{if(e.detail)submit(e.detail)});
})();