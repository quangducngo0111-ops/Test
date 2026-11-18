/* Student attempt history, local resilient store. Server Test history remains in Progress. */
(()=>{'use strict';
if(window.SmartcomHistory)return;
const STORAGE='SC_ATTEMPT_HISTORY_V1';
function profile(){try{return JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null')}catch{return null}}
function identity(p){return [p?.studentId||'',p?.name||'',p?.className||''].join('|').trim().toLowerCase()}
function all(){try{const a=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
function list(){const id=identity(profile());return id?all().filter(x=>x.owner===id).sort((a,b)=>Date.parse(b.submittedAt||b.savedAt)-Date.parse(a.submittedAt||a.savedAt)):[]}
function save(payload){const p=profile();if(!p?.name||!p?.className)return null;const a=all();const record={...payload,owner:identity(p),name:p.name,className:p.className,skill:payload.skill||'Unknown',kind:payload.kind==='Test'?'Test':'Practice',savedAt:new Date().toISOString(),attemptId:payload.attemptId||('a-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8))};const at=a.findIndex(x=>x.owner===record.owner&&(x.attemptId===record.attemptId||(x.status==='completed'&&record.status==='completed'&&x.path===record.path&&x.kind===record.kind&&x.skill===record.skill&&String(x.score)===String(record.score)&&Math.abs(Date.parse(x.submittedAt||x.savedAt)-Date.parse(record.submittedAt||record.savedAt))<6000)));if(at>=0)a[at]={...a[at],...record};else a.push(record);try{localStorage.setItem(STORAGE,JSON.stringify(a.slice(-3000)));window.dispatchEvent(new CustomEvent('sc:attempt-saved',{detail:record}));return record}catch(e){console.warn('History storage full',e);return null}}
function submit(payload){return save({...payload,status:'completed',submittedAt:payload.submittedAt||new Date().toISOString()})}
function draft(payload){return save({...payload,status:'draft'})}
window.SmartcomHistory={save,submit,draft,list,all,profile};
// Capture existing successful submission attempts without changing request payload.
// This preserves Practice submissions made by legacy Reading / Listening pages.
const originalFetch=window.fetch?.bind(window);
if(originalFetch&&location.pathname!='/Progress/'){
 window.fetch=function(input,options){
  const opts=options||{};
  if(String(opts.method||'GET').toUpperCase()==='POST'&&typeof opts.body==='string'){
   try{
    const args=new URLSearchParams(opts.body),mode=String(args.get('mode')||'').toUpperCase();
    const learner=profile();
    const samePerson=learner&&learner.name===args.get('name')&&learner.className===args.get('className');
    if(samePerson&&(mode==='PRACTICE'||mode==='TEST')&&args.get('skill')){
     let detail={};try{detail=JSON.parse(args.get('details')||'{}')}catch{}
     const payload={kind:mode==='TEST'?'Test':'Practice',skill:args.get('skill'),title:detail.title||args.get('practiceType')||args.get('testId')||document.title,exerciseId:args.get('practiceId')||args.get('testId')||location.pathname,path:location.pathname,score:args.get('score')!==null?Number(args.get('score')):null,total:args.get('total')!==null?Number(args.get('total')):null,band:args.get('band')||null,durationSeconds:Number(args.get('durationSeconds')||0),answers:detail.answers||null,submittedAt:args.get('submittedAt')||new Date().toISOString(),syncStatus:'unverified'};
     submit(payload);
    }
   }catch(e){console.warn('History request capture failed',e)}
  }
  return originalFetch(input,options);
 };
}

window.addEventListener('sc:attempt-completed',e=>{if(e.detail)submit(e.detail)});
})();