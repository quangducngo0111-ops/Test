/**
 * Smartcom IELTS result receiver (Google Apps Script, bound to the destination Sheet).
 * Deploy as Web app: Execute as Me; access Anyone. Use the /exec URL in the portal.
 * IMPORTANT: Keep existing sheet columns intact; append only.
 */
const RESULT_TABS = {PRACTICE:'PRACTICE_RESULTS',TEST:'TEST_RESULTS'};
const PRACTICE_HEADER = ['Timestamp','Họ tên','Lớp','Skill','Dạng bài','Practice ID','Điểm','Tổng','% Đúng','Thời gian','Chi tiết'];
const TEST_HEADER = ['Timestamp','Họ tên','Lớp','Điểm','Tổng','% Đúng','Thời gian','Chi tiết','Kiểm tra điểm'];
const INDEX_TAB = '_SC_ATTEMPT_INDEX';
function json_(value, callback) {
  const str = JSON.stringify(value);
  if (callback && /^scAck_[A-Za-z0-9_]{1,80}$/.test(callback)) {
    return ContentService.createTextOutput(callback+'('+str+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(str).setMimeType(ContentService.MimeType.JSON);
}
function getSheet_(ss, name, headers) {
  let sheet=ss.getSheetByName(name);
  if(!sheet) {sheet=ss.insertSheet(name);sheet.appendRow(headers);}
  return sheet;
}
function doPost(e) {
  const p=e?.parameter||{};
  const mode=String(p.mode||'').trim().toUpperCase();
  const id=String(p.attemptId||'').trim();
  if(!RESULT_TABS[mode])return json_({ok:false,error:'INVALID_MODE'});
  if(!id||id.length>160)return json_({ok:false,error:'MISSING_ATTEMPT_ID'});
  if(!String(p.name||'').trim()||!String(p.className||'').trim())return json_({ok:false,error:'MISSING_STUDENT'});
  const score=String(p.score??''),total=String(p.total??'');
  const details=String(p.details||'{}').slice(0,48000);
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const lock=LockService.getDocumentLock()||LockService.getScriptLock();
  if(!lock.tryLock(20000))return json_({ok:false,error:'BUSY'});
  try {
    const index=getSheet_(ss,INDEX_TAB,['Attempt ID','Sheet','Row','Timestamp']);
    const existing=index.createTextFinder(id).matchEntireCell(true).findNext();
    if(existing && existing.getColumn()===1)return json_({ok:true,duplicate:true,attemptId:id});
    const now=new Date(),name=String(p.name).trim(),cls=String(p.className).trim();
    const safeNumber=(value)=>value!=='' && Number.isFinite(Number(value))?Number(value):'';
    let sheet, row;
    if(mode==='PRACTICE') {
      sheet=getSheet_(ss,RESULT_TABS.PRACTICE,PRACTICE_HEADER);
      const percent=p.percent!==undefined&&p.percent!==''?safeNumber(p.percent):
        (Number(total)>0 && score!==''?Math.round(Number(score)/Number(total)*100):'');
      row=[now,name,cls,String(p.skill||''),String(p.practiceType||p.activity||''),
       String(p.practiceId||''),safeNumber(score),safeNumber(total),
       percent===''?'':String(percent)+'%',safeNumber(String(p.durationSeconds||'')),details];
    } else {
      sheet=getSheet_(ss,RESULT_TABS.TEST,TEST_HEADER);
      const percent=Number(total)>0&&score!==''?Math.round(Number(score)/Number(total)*100):'';
      row=[now,name,cls,safeNumber(score),safeNumber(total),
       percent===''?'':String(percent)+'%',safeNumber(String(p.durationSeconds||'')),details,'Hợp lệ'];
    }
    sheet.appendRow(row);
    const rowNo=sheet.getLastRow();
    index.appendRow([id,sheet.getName(),rowNo,now]);
    SpreadsheetApp.flush();
    return json_({ok:true,attemptId:id,sheet:sheet.getName(),row:rowNo});
  } catch(err) {
    console.error(err);
    return json_({ok:false,error:'SERVER_WRITE_FAILED'});
  } finally {lock.releaseLock();}
}
function doGet(e) {
  const p=e?.parameter||{};
  if(p.action!=='status')return json_({ok:true,service:'Smartcom IELTS result receiver'});
  const id=String(p.attemptId||'').trim();
  if(!id)return json_({ok:false,error:'MISSING_ATTEMPT_ID'},p.callback);
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const index=ss.getSheetByName(INDEX_TAB);
  if(!index)return json_({ok:true,recorded:false,attemptId:id},p.callback);
  const cell=index.createTextFinder(id).matchEntireCell(true).findNext();
  return json_({ok:true,recorded:!!(cell&&cell.getColumn()===1),attemptId:id},p.callback);
}
