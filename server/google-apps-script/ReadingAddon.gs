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
var SC_READING_VERSION_ = '2026-11-26-addon-v2';
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

var SC_CLASSES_=['XD25A02.1','XD25A02.2','XD26A03.1','SS26.1','SS25A01.1','SS25IE2','OP.AD.07','OP.ESS.11','TEST'];
function scClass_(name) {
 var nameKey=String(name||'').trim().toUpperCase();
 return SC_CLASSES_.filter(function(x){return x.toUpperCase()===nameKey})[0]||'';
}
function scCategory_(p) {
 if(String(p.mode||'').toUpperCase()==='TEST')return 'TEST';
 var direct=String(p.category||p.program||p.studyTrack||'').trim().toUpperCase();
 if(direct==='FOUNDATION'||direct==='PRACTICE')return direct;
 var details={};try{details=JSON.parse(p.details||'{}')}catch(e){}
 var words=[p.practiceType,p.activity,p.practiceId,details.title,details.source,details.path].join(' ');
 return /foundation/i.test(words)?'FOUNDATION':'PRACTICE';
}
function scMarkerCol_(tab){return tab==='TEST_RESULTS'?11:13}
function scFindMaster_(sheet,id) {
 var last=sheet.getLastRow();if(last<2)return 0;
 var found=sheet.getRange(2,scMarkerCol_(sheet.getName()),last-1,1).createTextFinder(id).matchEntireCell(true).findNext();
 return found?found.getRow():0;
}
function scMasterOK_(book,tab,row,id,cls) {
 var sheet=book.getSheetByName(tab);
 if(!sheet||row<2||row>sheet.getMaxRows())return false;
 var vals=sheet.getRange(row,2,1,2).getDisplayValues()[0];
 return vals[0]!==''&&vals[1]===cls &&
   sheet.getRange(row,scMarkerCol_(tab)).getDisplayValue()===id;
}
function scPointer_(index,id) {
 var found=scReadingIndexHit_(index,id);if(!found)return null;
 var row=found.getRow(),data=index.getRange(row,1,1,4).getValues()[0];
 return {indexRow:row,sheet:String(data[1]),row:Number(data[2])};
}
function scIndexWrite_(index,pointer,id,tab,row) {
 var dest=pointer?pointer.indexRow:index.getLastRow()+1;
 if(dest>index.getMaxRows())index.insertRowsAfter(index.getMaxRows(),40);
 index.getRange(dest,1,1,4).setValues([[id,tab,row,new Date()]]);
}
function scReadingPost_(p) {
 p=p||{};
 if(!scReadingEligible_(p))return scReadingReply_({ok:false,error:'INVALID_READING_MODE'});
 var cls=scClass_(p.className),id=scReadingId_(p);
 if(!cls||!p.name)return scReadingReply_({ok:false,error:'INVALID_STUDENT_OR_CLASS'});
 if(id.length>160)return scReadingReply_({ok:false,error:'INVALID_ATTEMPT_ID'});
 var lock=LockService.getScriptLock();if(!lock.tryLock(20000))return scReadingReply_({ok:false,error:'BUSY'});
 try{
  var ss=SpreadsheetApp.openById(SC_READING_SHEET_ID_);
  if(!ss.getSheetByName(cls))return scReadingReply_({ok:false,error:'CLASS_TAB_NOT_FOUND'});
  var tab=String(p.mode).trim().toUpperCase()==='TEST'?'TEST_RESULTS':'PRACTICE_RESULTS';
  var sheet=ss.getSheetByName(tab);
  if(!sheet)return scReadingReply_({ok:false,error:'RESULT_TAB_NOT_FOUND'});
  var idx=scReadingSheet_(ss,SC_READING_INDEX_,['Attempt ID','Sheet','Row','Timestamp']);
  var ptr=scPointer_(idx,id),kind=scCategory_(p);
  // Old index rows are NOT proof of a saved score; verify the row's actual ID.
  var existing=ptr&&ptr.sheet===tab&&scMasterOK_(ss,tab,ptr.row,id,cls)?ptr.row:scFindMaster_(sheet,id);
  if(existing){
   scIndexWrite_(idx,ptr,id,tab,existing);SpreadsheetApp.flush();
   return scReadingReply_({ok:true,recorded:scMasterOK_(ss,tab,existing,id,cls),
    duplicate:true,attemptId:id,sheet:tab,row:existing,classTab:cls,category:kind});
  }
  var now=new Date(),score=scReadingNumber_(p.score),total=scReadingNumber_(p.total);
  if(score!==''&&total!==''&&(score<0||total<0||score>total))
   return scReadingReply_({ok:false,error:'INVALID_SCORE'});
  var percent=scReadingNumber_(p.percent);
  if(percent===''&&total>0&&score!=='')percent=Math.round(score/total*10000)/100;
  var pct=percent===''?'':String(percent)+'%',duration=scReadingNumber_(p.durationSeconds);
  var details=scReadingCell_(p.details||'{}',48000),row;
  if(tab==='TEST_RESULTS'){
   row=[now,scReadingCell_(p.name,300),cls,score,total,pct,duration,details,'Hợp lệ','TEST',id];
  }else{
   row=[now,scReadingCell_(p.name,300),cls,'Reading',
    scReadingCell_(p.practiceType||p.activity||'Reading Practice',250),
    scReadingCell_(p.practiceId||p.testId||'',250),score,total,pct,duration,details,kind,id];
  }
  var dest=sheet.getLastRow()+1;
  if(dest>sheet.getMaxRows())sheet.insertRowsAfter(sheet.getMaxRows(),40);
  sheet.getRange(dest,1,1,row.length).setValues([row]);SpreadsheetApp.flush();
  if(!scMasterOK_(ss,tab,dest,id,cls)){
   console.error('Reading score unverified',tab,dest,id);
   return scReadingReply_({ok:false,recorded:false,error:'WRITE_NOT_VERIFIED'});
  }
  scIndexWrite_(idx,ptr,id,tab,dest);SpreadsheetApp.flush();
  var fresh=SpreadsheetApp.openById(SC_READING_SHEET_ID_);
  var verified=scMasterOK_(fresh,tab,dest,id,cls);
  return scReadingReply_({ok:verified,recorded:verified,attemptId:id,
   sheet:tab,row:dest,classTab:cls,category:kind,
   error:verified?undefined:'WRITE_NOT_VERIFIED'});
 }catch(e){console.error('Reading receiver',e);
  return scReadingReply_({ok:false,recorded:false,error:'READING_WRITE_FAILED'});
 }finally{lock.releaseLock()}
}
function scReadingGet_(p) {
 p=p||{};
 if(p.action==='health'){
  try{var ss=SpreadsheetApp.openById(SC_READING_SHEET_ID_);
   return scReadingReply_({ok:true,version:SC_READING_VERSION_,
    ready:!!ss.getSheetByName('PRACTICE_RESULTS'),classRouting:'rollup',
    categories:['TEST','PRACTICE','FOUNDATION']},p.callback);
  }catch(e){console.error(e);return scReadingReply_({ok:false,error:'SHEET_UNAVAILABLE'},p.callback)}
 }
 if(p.action==='status'){
  var id=String(p.attemptId||'').trim();
  if(!id)return scReadingReply_({ok:false,recorded:false,error:'MISSING_ATTEMPT_ID'},p.callback);
  try{
   var ss=SpreadsheetApp.openById(SC_READING_SHEET_ID_);
   var idx=ss.getSheetByName(SC_READING_INDEX_),ptr=idx?scPointer_(idx,id):null,valid=false;
   if(ptr&&ss.getSheetByName(ptr.sheet)&&ptr.row>=2){
    var cls=String(ss.getSheetByName(ptr.sheet).getRange(ptr.row,3).getDisplayValue());
    valid=!!scClass_(cls)&&scMasterOK_(ss,ptr.sheet,ptr.row,id,cls);
   }
   return scReadingReply_({ok:true,attemptId:id,recorded:valid,
     error:!valid&&ptr?'INDEX_OUT_OF_SYNC':undefined},p.callback);
  }catch(e){console.error(e);return scReadingReply_({ok:false,recorded:false,error:'READING_STATUS_FAILED'},p.callback)}
 }
 return scReadingReply_({ok:false,error:'UNKNOWN_ACTION'},p.callback);
}
