/* Unified resilient IELTS attempt recording.
 * Local completion is distinct from server acknowledgment.
 * The current cross-origin Apps Script uses no-cors: requests are unverifiable
 * unless the endpoint explicitly supports a readable acknowledgement.
 */
(()=>{'use strict';
if(window.SmartcomHistory?.version>=5)return;
const STORAGE='SC_ATTEMPT_HISTORY_V1';
// V4: an opaque response is NOT proof that Apps Script saved the row.
// Retain the original body for recovery but never silently resend it (duplicate risk).
const QUEUE='SC_RESULT_OUTBOX_V2';
const ENDPOINT='https://script.google.com/macros/s/AKfycbwfwWjJ7Q3VTJEF5ldKGnFKYoziQdntAzRjq1Yqy6HSmbZSc69ijSdOvMCC_Zogbpcm/exec';
const nativeFetch=window.fetch?.bind(window);
function profile(){
 try{
  const p=JSON.parse(localStorage.getItem('IELTS_PRACTICE_STUDENT')||'null');
  if(p?.name&&p?.className)return p;
 }catch(e){}
 return null;
}
function identity(p){return [p?.studentId||'',p?.name||'',p?.className||''].join('|').trim().toLowerCase()}
function read(key){
 try{const a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?a:[]}
 catch(e){return []}
}
function write(key,value){
 try{localStorage.setItem(key,JSON.stringify(value));return true}
 catch(e){console.error('Cannot persist attempt',e);return false}
}
function all(){return read(STORAGE)}
function list(){const id=identity(profile());return id?all().filter(x=>x.owner===id).sort((a,b)=>Date.parse(b.submittedAt||b.savedAt)-Date.parse(a.submittedAt||a.savedAt)):[]}
function newId(){return 'sc-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,11)}
function save(payload){
 const p=profile();
 if(!p?.name||!p?.className){
  window.dispatchEvent(new CustomEvent('sc:attempt-needs-profile',{detail:payload}));
  return null;
 }
 const entries=all();
 const record={
  ...payload,owner:identity(p),name:p.name,className:p.className,
  skill:payload.skill||'Unknown',kind:payload.kind==='Test'?'Test':'Practice',
  attemptId:payload.attemptId||newId(),savedAt:new Date().toISOString()
 };
 const at=entries.findIndex(x=>x.owner===record.owner&&x.attemptId===record.attemptId);
 if(at>=0)entries[at]={...entries[at],...record};else entries.push(record);
 if(!write(STORAGE,entries.slice(-3000)))return null;
 window.dispatchEvent(new CustomEvent('sc:attempt-saved',{detail:record}));
 return record;
}
function submit(payload){return save({...payload,status:'completed',submittedAt:payload.submittedAt||new Date().toISOString()})}
function draft(payload){return save({...payload,status:'draft'})}
function formBody(record){
 const detail={title:record.title||document.title,source:record.path||location.pathname,
  answers:record.answers||null,attemptId:record.attemptId,
  ...(record.details&&typeof record.details==='object'?record.details:{})};
 return new URLSearchParams({
  mode:record.kind==='Test'?'TEST':'PRACTICE',
  name:record.name,className:record.className,skill:record.skill,
  practiceType:record.title||record.skill,practiceId:String(record.exerciseId||record.path||location.pathname),
  activity:record.title||record.skill,testId:String(record.exerciseId||record.path||location.pathname),
  score:record.score==null?'':String(record.score),
  total:record.total==null?'':String(record.total),
  maxScore:record.total==null?'':String(record.total),
  percent:record.total>0&&record.score!=null?String(Math.round(Number(record.score)/Number(record.total)*10000)/100):'',
  attemptId:record.attemptId,
  durationSeconds:String(record.durationSeconds||0),
  submittedAt:record.submittedAt||new Date().toISOString(),
  details:JSON.stringify(detail)
 }).toString();
}
// Read-only server receipt check via JSONP; Google Apps Script does not supply CORS headers.
function receiptStatus(endpoint,attemptId){
 return new Promise(resolve=>{
  if(!endpoint||!attemptId){resolve(null);return}
  const callback='scAck_'+Math.random().toString(36).slice(2,13);
  const u=new URL(endpoint);
  u.searchParams.set('action','status');
  u.searchParams.set('attemptId',attemptId);
  u.searchParams.set('callback',callback);
  const script=document.createElement('script');
  let done=false;
  const clear=()=>{delete window[callback];script.remove();clearTimeout(timer)};
  const finish=v=>{if(done)return;done=true;clear();resolve(v)};
  const timer=setTimeout(()=>finish(null),4500);
  window[callback]=data=>{
   if(data?.ok===true&&data.attemptId===attemptId&&typeof data.recorded==='boolean')
    finish(data.recorded);
   else finish(null);
  };
  script.onerror=()=>finish(null);
  script.src=u.href;
  document.head.append(script);
 });
}
function outbox(){return read(QUEUE)}
function queue(record,endpoint=ENDPOINT,body){
 if(!record)return false;
 const rows=outbox(),item={
  attemptId:record.attemptId,owner:record.owner,endpoint,
  body:body||formBody(record),queuedAt:new Date().toISOString(),
  attempts:0,nextTry:0
 };
 const existing=rows.findIndex(x=>x.attemptId===item.attemptId&&x.owner===item.owner);
 if(existing>=0)return true;
 if(!write(QUEUE,[...rows,item].slice(-2000)))return false;
 window.dispatchEvent(new CustomEvent('sc:result-queued',{detail:item}));
 return true;
}
function updateStatus(id,owner,patch){
 const rows=all(),index=rows.findIndex(x=>x.attemptId===id&&x.owner===owner);
 if(index<0)return;
 rows[index]={...rows[index],...patch};
 write(STORAGE,rows);
 window.dispatchEvent(new CustomEvent('sc:result-status',{detail:rows[index]}));
}
let flushing=false;
async function flush(){
 if(flushing||!nativeFetch||!navigator.onLine)return;
 flushing=true;
 try{
  const rows=outbox();
  for(const item of rows){
   if(item.nextTry>Date.now())continue;
   if(item.sentUnverified){
    const status=await receiptStatus(item.endpoint,item.attemptId);
    if(status===true){
     write(QUEUE,outbox().filter(x=>x.attemptId!==item.attemptId||x.owner!==item.owner));
     updateStatus(item.attemptId,item.owner,{syncStatus:'acknowledged',lastVerifiedAt:new Date().toISOString()});
     continue;
    }
    if(status===null)continue; // Unknown backend: never blindly duplicate an opaque request.
    // Receiver explicitly reports missing. Its attemptId index makes retry idempotent.
    const pending=outbox(),idx=pending.findIndex(x=>x.attemptId===item.attemptId&&x.owner===item.owner);
    if(idx>=0){pending[idx].sentUnverified=false;write(QUEUE,pending)}
   }
   // Without server-side CORS, an opaque response confirms only that the browser issued the request.
   let transmitted=false,verified=false;
   try{
    const response=await nativeFetch(item.endpoint,{
     method:'POST',mode:'no-cors',
     headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
     body:item.body,keepalive:item.body.length<60000
    });
    transmitted=true;
    verified=response.type!=='opaque'&&response.ok&&response.status>=200&&response.status<300;
   }catch(e){console.warn('Result delivery postponed',e)}
   const current=outbox(),idx=current.findIndex(x=>x.attemptId===item.attemptId&&x.owner===item.owner);
   if(idx<0)continue;
   if(transmitted){
    // An opaque POST is not an acknowledgement: explicitly verify the Sheet receiver.
    if(!verified)verified=(await receiptStatus(item.endpoint,item.attemptId))===true;
    const attempts=(current[idx].attempts||0)+1;
    if(verified)current.splice(idx,1);
    else{
     current[idx].attempts=attempts;
     current[idx].sentUnverified=true;
     current[idx].nextTry=0;
    }
    write(QUEUE,current);
    updateStatus(item.attemptId,item.owner,{
     syncStatus:verified?'acknowledged':'sent-unverified',
     lastSentAt:new Date().toISOString()
    });
   }else{
    const attempts=(current[idx].attempts||0)+1;
    current[idx].attempts=attempts;
    current[idx].nextTry=Date.now()+Math.min(300000,5000*Math.pow(2,Math.min(attempts,6)));
    write(QUEUE,current);
    updateStatus(item.attemptId,item.owner,{syncStatus:'queued'});
   }
  }
 }finally{flushing=false}
}
function report(payload){
 const saved=submit({...payload,syncStatus:'queued'});
 if(saved&&queue(saved))flush();
 return saved;
}
function recordLegacyPost(body,endpoint){
 let p;try{p=new URLSearchParams(body)}catch(e){return null}
 const mode=String(p.get('mode')||'').toUpperCase();
 if(!['TEST','PRACTICE'].includes(mode)||!p.get('skill'))return null;
 const user=profile();
 if(!user||user.name.trim()!==String(p.get('name')||'').trim()||user.className.trim().toLowerCase()!==String(p.get('className')||'').trim().toLowerCase())return null;
 let details={};try{details=JSON.parse(p.get('details')||'{}')}catch(e){}
 const record=submit({
  attemptId:p.get('attemptId')||newId(),kind:mode==='TEST'?'Test':'Practice',
  skill:p.get('skill'),title:details.title||p.get('practiceType')||p.get('testId')||document.title,
  exerciseId:p.get('practiceId')||p.get('testId')||location.pathname,
  path:location.pathname,score:p.get('score')!==null?Number(p.get('score')):null,
  total:p.get('total')!==null?Number(p.get('total')):null,
  band:p.get('band')||null,durationSeconds:Number(p.get('durationSeconds')||0),
  answers:details.answers||null,details,
  submittedAt:p.get('submittedAt')||new Date().toISOString(),
  syncStatus:'queued'
 });
 if(record)queue(record,endpoint,body+(p.has('attemptId')?'':'&attemptId='+encodeURIComponent(record.attemptId)));
 return record;
}
if(nativeFetch){
 window.fetch=function(input,options){
  const opts=options||{},url=typeof input==='string'?input:input?.url||'';
  if(String(opts.method||'GET').toUpperCase()==='POST'
     &&typeof opts.body==='string'
     &&url.startsWith('https://script.google.com/macros/s/')){
   const record=recordLegacyPost(opts.body,url);
   return nativeFetch(input,options).then(response=>{
    if(record){
     const verified=response.type!=='opaque'&&response.ok;
     const current=outbox();
     const idx=current.findIndex(x=>x.attemptId===record.attemptId&&x.owner===record.owner);
     if(idx>=0){
      if(verified)current.splice(idx,1);
      else{
       current[idx].attempts=(current[idx].attempts||0)+1;
       current[idx].sentUnverified=true;
       current[idx].nextTry=0;
      }
      write(QUEUE,current);
     }
     updateStatus(record.attemptId,record.owner,{
      syncStatus:verified?'acknowledged':'sent-unverified',
      lastSentAt:new Date().toISOString()
     });
    }
    return response;
   },error=>{
    if(record)updateStatus(record.attemptId,record.owner,{syncStatus:'queued'});
    throw error;
   });
  }
  return nativeFetch(input,options);
 };
}
// Visible receipt: distinguishes saved-on-device from verified-on-server.
function showReceipt(record){
 if(!record||record.status!=='completed'||!document.body)return;
 let panel=document.getElementById('sc-result-receipt');
 if(!panel){
  panel=document.createElement('aside');panel.id='sc-result-receipt';
  panel.setAttribute('role','status');
  panel.style.cssText='position:fixed;right:12px;bottom:84px;z-index:2147482600;max-width:min(360px,calc(100vw - 24px));background:#fff;border:1px solid #bfd4e9;box-shadow:0 7px 23px #1c34522c;border-radius:12px;padding:12px 35px 12px 14px;font:12px/1.5 system-ui,Arial;color:#22436b';
  // Recovery control: never deletes an attempt, lets a learner share exact saved data.
  const recover=document.createElement('button');
  recover.type='button';
  recover.textContent='Sao chép bản ghi';
  recover.style.cssText='margin-top:8px;border:1px solid #b4c9df;background:#f3f8ff;border-radius:7px;padding:5px 9px;font-size:11px;color:#17406d;cursor:pointer';
  recover.onclick=()=>{
   const current=window.SmartcomHistory?.list()?.find(x=>x.attemptId===panel.dataset.attemptId);
   if(!current)return;
   const packet=JSON.stringify({schema:'smartcom-attempt-recovery-v1',record:current,queued:window.SmartcomHistory?.outbox()?.find(x=>x.attemptId===current.attemptId)||null},null,2);
   if(navigator.clipboard?.writeText)navigator.clipboard.writeText(packet).then(()=>{recover.textContent='Đã sao chép ✓'},()=>window.prompt('Sao chép bản ghi sau:',packet));
   else window.prompt('Sao chép bản ghi sau:',packet);
  };
  panel.append(recover);
  const close=document.createElement('button');
  close.type='button';close.textContent='×';close.setAttribute('aria-label','Đóng trạng thái kết quả');
  close.style.cssText='position:absolute;top:5px;right:8px;border:0;background:none;font-size:19px;cursor:pointer;color:#334';
  close.onclick=()=>panel.remove();panel.append(close);
  const content=document.createElement('div');content.className='sc-receipt-text';panel.append(content);
  document.body.append(panel);
 }
 const message=record.syncStatus==='acknowledged'
  ?'Máy chủ đã xác nhận nhận kết quả.'
  :record.syncStatus==='sent-unverified'
  ?'Đã gửi yêu cầu lên hệ thống, nhưng chưa xác minh được kết quả đã vào bảng điểm.'
  :'Đã lưu tại thiết bị; đang chờ gửi kết quả khi có kết nối.';
 panel.dataset.attemptId=record.attemptId;
 const box=panel.querySelector('.sc-receipt-text');
 box.textContent=(record.score!=null?'Kết quả: '+record.score+'/'+(record.total??'?')+'. ':'')+
  message+' Mã lượt làm: '+record.attemptId;
}
window.SmartcomHistory={version:5,save,submit,draft,list,all,profile,report,flush,outbox,receiptStatus};
window.addEventListener('sc:attempt-completed',event=>{if(event.detail)report(event.detail)});
window.addEventListener('sc:attempt-saved',event=>showReceipt(event.detail));
window.addEventListener('sc:result-status',event=>showReceipt(event.detail));
window.addEventListener('online',flush);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)flush()});
window.addEventListener('load',()=>{
 flush();
 const pending=list().find(x=>x.status==='completed'&&x.syncStatus!=='acknowledged');
 if(pending)showReceipt(pending);
},{once:true});
// A modest retry cadence when the page stays open; older records survive reloads.
setInterval(flush,60000);
})();
