/**
 * IELTS Practice Portal — class-separated Google Sheets score receiver.
 *
 * Installation:
 * 1. Open the DESTINATION Google Spreadsheet > Extensions > Apps Script.
 * 2. Paste this file into Code.gs. Review score field names with the
 *    test forms that currently submit results.
 * 3. Run setupClassSheets() from the Apps Script editor and grant permissions.
 * 4. Deploy > New deployment > Web app. Execute as: Me.
 *    Choose access appropriate for the students and school.
 * 5. Copy the /exec URL into each existing test score-submission client.
 *
 * SECURITY: This receiver checks class names and prevents duplicate attempt IDs,
 * but is not an identity-verification system. A public web app cannot prove
 * that a learner is the person whose name they entered.
 */

const ALLOWED_CLASSES = Object.freeze([
  'XD25A02.1',
  'XD25A02.2',
  'XD26A03.1',
  'SS26.1',
  'SS25A01.1',
  'SS25IE2',
  'OP.AD.07',
  'OP.ESS.11'
]);
const HEADERS = Object.freeze([
  'Server Timestamp',
  'Student Name',
  'Class',
  'Activity',
  'Test ID',
  'Score',
  'Maximum Score',
  'Percentage',
  'Duration (seconds)',
  'Reading /5',
  'Grammar /8',
  '-ing /7',
  'Error Correction /5',
  'Rewrite /5',
  'Writing A',
  'Writing B',
  'Attempt ID',
  'Client Timestamp',
  'Details'
]);

function cleanCell_(value) {
  const s = String(value === undefined || value === null ? '' : value).slice(0, 12000);
  // Prevent spreadsheet formula injection from user-entered text.
  return /^[\s]*[=+@-]/.test(s) ? "'" + s : s;
}

function numericOrBlank_(value) {
  if(value === '' || value === undefined || value === null)return '';
  const num=Number(value);
  return Number.isFinite(num)?num:'';
}

function canonicalClass_(name) {
  const normalized=String(name||'').trim().toUpperCase();
  return ALLOWED_CLASSES.find(c=>c.toUpperCase()===normalized)||'';
}

function ensureSheet_(book, className) {
  let sheet=book.getSheetByName(className);
  if(!sheet)sheet=book.insertSheet(className);
  if(sheet.getLastRow()===0){
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold')
      .setBackground('#2b6052').setFontColor('#ffffff');
    sheet.setFrozenColumns(3);
  }
  return sheet;
}

function setupClassSheets(){
  const book=SpreadsheetApp.getActiveSpreadsheet();
  if(!book)throw new Error('Bind this script to the destination Google Spreadsheet.');
  ALLOWED_CLASSES.forEach(c=>ensureSheet_(book,c));
}

function textResponse_(message){
  return ContentService.createTextOutput(message)
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e){
  const lock=LockService.getScriptLock();
  lock.waitLock(20000);
  try{
    const p=e?.parameter||{};
    const className=canonicalClass_(p.className||p.class||p.studentClass);
    if(!className)return textResponse_('ERROR:INVALID_CLASS');
    const name=String(p.name||p.studentName||'').trim();
    if(!name)return textResponse_('ERROR:MISSING_NAME');
    const book=SpreadsheetApp.getActiveSpreadsheet();
    if(!book)return textResponse_('ERROR:SPREADSHEET_UNAVAILABLE');
    const sheet=ensureSheet_(book,className);
    const attemptId=String(p.attemptId||p.submissionId||'').trim();
    if(attemptId&&sheet.getLastRow()>1){
      const ids=sheet.getRange(2,17,sheet.getLastRow()-1,1).getDisplayValues().flat();
      if(ids.includes(attemptId))return textResponse_('DUPLICATE');
    }
    const score=numericOrBlank_(p.score??p.total);
    const maxScore=numericOrBlank_(p.maxScore??p.maximum??p.totalQuestions);
    const percentage=numericOrBlank_(p.percent??p.percentage);
    const computedPercent=percentage!==''?percentage:
      (score!==''&&maxScore>0?Math.round(score/maxScore*10000)/100:'');
    sheet.appendRow([
      new Date(),
      cleanCell_(name),
      className,
      cleanCell_(p.activity||p.examType||''),
      cleanCell_(p.testId||p.test||''),
      score,
      maxScore,
      computedPercent,
      numericOrBlank_(p.durationSeconds),
      numericOrBlank_(p.reading),
      numericOrBlank_(p.grammar),
      numericOrBlank_(p.ing),
      numericOrBlank_(p.error),
      numericOrBlank_(p.rewrite),
      cleanCell_(p.writingA||''),
      cleanCell_(p.writingB||''),
      cleanCell_(attemptId),
      cleanCell_(p.submittedAt||''),
      cleanCell_(p.details||'')
    ]);
    return textResponse_('OK');
  } catch(error){
    console.error(error);
    return textResponse_('ERROR:SERVER');
  } finally {
    lock.releaseLock();
  }
}

function doGet(){
  return textResponse_('IELTS Practice score receiver is running.');
}
