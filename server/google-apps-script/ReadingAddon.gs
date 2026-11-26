/**
 * Smartcom Reading result receiver — ADD-ON to the EXISTING Apps Script project.
 *
 * Does not declare doPost/doGet; it does NOT replace or disturb Writing AI.
 *
 * Add inside the existing doPost(e), immediately after reading e.parameter:
 *   if (scReadingEligible_(p)) return scReadingPost_(p);
 *
 * Add inside the existing doGet(e), immediately after reading e.parameter:
 *   if (p.action === 'health' || p.action === 'status')
 *     return scReadingGet_(p);
 *
 * After saving, deploy a NEW VERSION of the existing Web App.
 * Test health, a synthetic Reading submission, duplicate retry, and status.
 *
 * Requires authorization to open the "Theo dõi BTVN" Sheet.
 */
var SC_READING_SHEET_ID_ = '1pBSYFuiN6FNVrce1nMTUQa2INLyTrqrx4r7XWs_rVAA';
var SC_READING_VERSION_ = '2026-11-26-addon-v1';
var SC_READING_TABS_ = {PRACTICE:'PRACTICE_RESULTS',TEST:'TEST_RESULTS'};
var SC_READING_INDEX_ = '_SC_ATTEMPT_INDEX';

function scReadingEligible_(p) {
  p = p || {};
  var mode=String(p.mode||'').trim().toUpperCase();
  return (mode==='PRACTICE'||mode==='TEST')
     && String(p.skill||'').trim().toLowerCase()==='reading';
}
function scReadingReply_(data,callback) {
  var result=JSON.stringify(data);
  if (callback && /^scAck_[A-Za-z0-9_]{1,80}$/.test(callback)) {
    return ContentService.createTextOutput(callback+'('+result+');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(result)
    .setMimeType(ContentService.MimeType.JSON);
}
function scReadingSheet_(ss,title,headers) {
  var sheet=ss.getSheetByName(title);
  if (!sheet) {
    sheet=ss.insertSheet(title);
    sheet.getRange(1,1,1,headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow()===0) {
    sheet.getRange(1,1,1,headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
function scReadingCell_(value,maxLength) {
  var val=String(value===undefined||value===null?'':value).slice(0,maxLength||2000);
  return /^[\s]*[=+@-]/.test(val) ? '\''+val : val;
}
function scReadingNumber_(value) {
  if (value===undefined||value===null||String(value).trim()==='')return '';
  var n=Number(value);
  return isFinite(n)?n:'';
}
function scReadingId_(p) {
  var id=String(p.attemptId||'').trim();
  if (id)return id;
  // Only a legacy fallback. New Reading clients send a UUID on the first POST.
  var canonical=[p.mode,p.name,p.className,p.practiceId||p.testId,
    p.submittedAt,p.score,p.total,p.durationSeconds,p.details].join('|');
  var bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,canonical,
    Utilities.Charset.UTF_8);
  var hash='';
  for(var i=0;i<bytes.length;i++)hash+=('0'+(bytes[i]&255).toString(16)).slice(-2);
  return 'legacy-'+hash.substring(0,40);
}
function scReadingIndexHit_(index,id) {
  if(index.getLastRow()<2)return null;
  var range=index.getRange(2,1,index.getLastRow()-1,1);
  return range.createTextFinder(id).matchEntireCell(true).findNext();
}
function scReadingPost_(p) {
  p=p||{};
  if(!scReadingEligible_(p))return scReadingReply_({ok:false,error:'INVALID_READING_MODE'});
  var mode=String(p.mode).trim().toUpperCase();
  if(!String(p.name||'').trim()||!String(p.className||'').trim())
    return scReadingReply_({ok:false,error:'MISSING_STUDENT'});
  var id=scReadingId_(p);
  if(id.length>160)return scReadingReply_({ok:false,error:'INVALID_ATTEMPT_ID'});
  var lock=LockService.getScriptLock();
  if(!lock.tryLock(20000))return scReadingReply_({ok:false,error:'BUSY'});
  try{
    var ss=SpreadsheetApp.openById(SC_READING_SHEET_ID_);
    var index=scReadingSheet_(ss,SC_READING_INDEX_,
      ['Attempt ID','Sheet','Row','Timestamp']);
    var prior=scReadingIndexHit_(index,id);
    if(prior)return scReadingReply_({ok:true,duplicate:true,attemptId:id});
    var now=new Date(),score=scReadingNumber_(p.score),total=scReadingNumber_(p.total);
    var percent=scReadingNumber_(p.percent);
    if(percent===''&&total>0&&score!=='')percent=Math.round(score/total*10000)/100;
    var duration=scReadingNumber_(p.durationSeconds);
    var details=scReadingCell_(p.details||'{}',48000);
    var sheet,row;
    if(mode==='PRACTICE'){
      sheet=scReadingSheet_(ss,SC_READING_TABS_.PRACTICE,
       ['Timestamp','Họ tên','Lớp','Skill','Dạng bài','Practice ID','Điểm','Tổng','% Đúng','Thời gian','Chi tiết']);
      row=[now,scReadingCell_(p.name,300),scReadingCell_(p.className,100),
       'Reading',scReadingCell_(p.practiceType||p.activity||'Reading Practice',250),
       scReadingCell_(p.practiceId||p.testId||'',250),score,total,
       percent===''?'':String(percent)+'%',duration,details];
    }else{
      sheet=scReadingSheet_(ss,SC_READING_TABS_.TEST,
       ['Timestamp','Họ tên','Lớp','Điểm','Tổng','% Đúng','Thời gian','Chi tiết','Kiểm tra điểm']);
      row=[now,scReadingCell_(p.name,300),scReadingCell_(p.className,100),
       score,total,percent===''?'':String(percent)+'%',duration,details,'Hợp lệ'];
    }
    sheet.appendRow(row);
    var number=sheet.getLastRow();
    index.appendRow([id,sheet.getName(),number,now]);
    SpreadsheetApp.flush();
    return scReadingReply_({ok:true,attemptId:id,sheet:sheet.getName(),row:number});
  }catch(err){
    console.error('[Reading receiver]',err);
    return scReadingReply_({ok:false,error:'READING_WRITE_FAILED'});
  }finally{
    lock.releaseLock();
  }
}
function scReadingGet_(p) {
  p=p||{};
  if(p.action==='health'){
    try{
      var ss=SpreadsheetApp.openById(SC_READING_SHEET_ID_);
      return scReadingReply_({ok:true,version:SC_READING_VERSION_,
       ready:!!ss.getSheetByName(SC_READING_TABS_.PRACTICE)},p.callback);
    }catch(err){
      console.error('[Reading receiver]',err);
      return scReadingReply_({ok:false,error:'SHEET_UNAVAILABLE'},p.callback);
    }
  }
  if(p.action==='status'){
    var id=String(p.attemptId||'').trim();
    if(!id)return scReadingReply_({ok:false,error:'MISSING_ATTEMPT_ID'},p.callback);
    try{
      var book=SpreadsheetApp.openById(SC_READING_SHEET_ID_);
      var sheet=book.getSheetByName(SC_READING_INDEX_);
      var hit=sheet?scReadingIndexHit_(sheet,id):null;
      return scReadingReply_({ok:true,attemptId:id,recorded:!!hit},p.callback);
    }catch(error){
      console.error('[Reading status]',error);
      return scReadingReply_({ok:false,error:'READING_STATUS_FAILED',attemptId:id},p.callback);
    }
  }
  return scReadingReply_({ok:false,error:'UNKNOWN_ACTION'},p.callback);
}
