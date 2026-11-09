/* Speaking Vocabulary: CEFR study tabs, collocations and in-browser audio.
   Existing sets/games are preserved; B1-C2 assignment of legacy entries is
   an initial study grouping, not an official dictionary CEFR certification. */
(function(){
  'use strict';
  const LEVELS=['B1','B2','C1','C2'];
  let level='B1', kind='all', lastSet='';
  const isSpeaking=()=>typeof selectedSkill==='string' && /^speaking-part-[123]$/.test(selectedSkill);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function classify(items){
    // Stable, reversible starting categorization for old ungraded content.
    // Explicit item.level always takes precedence when editorially verified.
    const n=items.length;
    return items.map((item,i)=>{
      const assigned=LEVELS.includes(item.level)?item.level:LEVELS[Math.min(3,Math.floor(i*4/Math.max(1,n)))];
      return {...item,_studyLevel:assigned,_provisional:!LEVELS.includes(item.level)};
    });
  }
  function availableVoices(){
    return typeof speechSynthesis==='undefined'?[]:speechSynthesis.getVoices();
  }
  function speak(text){
    if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){
      alert('Trình duyệt này chưa hỗ trợ phát âm. Hãy thử Chrome hoặc Edge.');
      return;
    }
    speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.lang='en-GB';
    utterance.rate=0.9;
    const voices=availableVoices();
    const preferred=voices.find(v=>/^en-GB/i.test(v.lang) && /natural|google|microsoft|english/i.test(v.name))
      ||voices.find(v=>/^en-GB/i.test(v.lang))
      ||voices.find(v=>/^en/i.test(v.lang));
    if(preferred){utterance.voice=preferred;utterance.lang=preferred.lang;}
    speechSynthesis.speak(utterance);
  }
  function addStyle(){
    if(document.getElementById('speakingVocabStyles'))return;
    const style=document.createElement('style');
    style.id='speakingVocabStyles';
    style.textContent=`
    .sv-panel{margin:22px 0 18px;padding:20px;background:#fff;border:1px solid #e2e4f0;border-radius:20px;box-shadow:0 8px 24px #2a165608}
    .sv-panel h3{margin:0 0 5px;color:#281260;font-size:20px}.sv-hint{color:#667085;margin:0 0 14px;font-size:12px}
    .sv-controls{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
    .sv-chip{cursor:pointer;border-radius:12px;padding:9px 17px;border:1px solid #ded9ed;background:#f8f7ff;color:#382868;font:700 13px system-ui}
    .sv-chip[aria-pressed=true]{background:#39217d;color:#fff;border-color:#39217d}
    .sv-count{margin:12px 0;color:#5b6074;font-size:12px}
    .sv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .sv-entry{background:#fbfaff;border:1px solid #e9e4f4;border-radius:15px;padding:14px;min-width:0}
    .sv-entry-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .sv-entry strong{font-size:16px;color:#281260;overflow-wrap:anywhere}
    .sv-meaning{margin-top:6px;font-size:13px;color:#3a4254}
    .sv-example{font-size:12px;color:#727b89;margin-top:8px;line-height:1.65}
    .sv-tag{font-size:10px;font-weight:800;color:#6d52a8;text-transform:uppercase;letter-spacing:.06em}
    .sv-speak{min-width:40px;min-height:40px;cursor:pointer;background:#efeaff;border:1px solid #cfc4ec;border-radius:12px;font-size:19px}
    .sv-empty{padding:18px;color:#667085;background:#f8f7ff;border-radius:12px}
    @media(max-width:650px){.sv-panel{padding:14px}.sv-grid{grid-template-columns:1fr}.sv-chip{padding:9px 12px}}
    `;
    document.head.appendChild(style);
  }
  function display(){
    const list=document.getElementById('wordList');
    if(!list)return;
    let panel=document.getElementById('speakingStudyPanel');
    if(!isSpeaking()){
      if(panel)panel.remove();
      list.style.display='';
      return;
    }
    addStyle();
    if(lastSet!==selectedSkill+'-'+selectedSet){
      lastSet=selectedSkill+'-'+selectedSet;
      level='B1';kind='all';
    }
    if(!panel){
      panel=document.createElement('section');
      panel.id='speakingStudyPanel';
      panel.className='sv-panel';
      list.parentNode.insertBefore(panel,list);
    }
    // Preserve the original list/game progress in the DOM for all other skills.
    list.style.display='none';
    const items=classify(Array.isArray(currentCollection)?currentCollection:[]);
    const rows=[];
    for(const item of items){
      rows.push({level:item._studyLevel,type:'vocabulary',term:item.word,meaning:item.meaning,example:item.example,id:item.id||item.word});
      const phrase=String(item.collocation||'').trim();
      if(phrase && phrase.toLowerCase()!==String(item.word||'').trim().toLowerCase()){
        rows.push({level:item._studyLevel,type:'collocation',term:phrase,meaning:'Cụm từ kết hợp với “'+item.word+'”',example:item.example,id:(item.id||item.word)+'-co'});
      }
    }
    const filtered=rows.filter(x=>x.level===level&&(kind==='all'||kind===x.type));
    panel.innerHTML=`
      <h3>📚 Từ vựng theo trình độ</h3>
      <p class="sv-hint">Chọn B1–C2, nghe phát âm 🔊 và học từ/collocations theo chủ đề. Trình độ của dữ liệu cũ là phân nhóm học tập sơ bộ, không phải nhãn CEFR chính thức.</p>
      <div class="sv-controls" role="group" aria-label="Trình độ">${LEVELS.map(x=>`<button class="sv-chip" data-sv-level="${x}" type="button" aria-pressed="${x===level}">${x}</button>`).join('')}</div>
      <div class="sv-controls" role="group" aria-label="Loại mục học">
      ${[['all','Tất cả'],['vocabulary','Vocabulary'],['collocation','Collocations']].map(([id,name])=>`<button class="sv-chip" data-sv-kind="${id}" type="button" aria-pressed="${id===kind}">${name}</button>`).join('')}
      </div>
      <div class="sv-count">${filtered.length} mục · ${items.filter(x=>x._studyLevel===level).length} mục từ vựng gốc · Phát âm sử dụng giọng đọc có sẵn trên thiết bị.</div>
      ${filtered.length?'<div class="sv-grid">'+filtered.map((x,i)=>`
        <article class="sv-entry">
          <div class="sv-tag">${x.type==='vocabulary'?'Vocabulary':'Collocation'} · ${x.level}</div>
          <div class="sv-entry-head"><strong>${esc(x.term)}</strong><button class="sv-speak" type="button" data-sv-say="${i}" aria-label="Nghe phát âm ${esc(x.term)}" title="Nghe phát âm">🔊</button></div>
          <div class="sv-meaning">${esc(x.meaning)}</div>
          ${x.example?'<div class="sv-example">Example: '+esc(x.example)+'</div>':''}
        </article>`).join('')+'</div>':'<div class="sv-empty">Chưa có dữ liệu cho bộ lọc này.</div>'}
    `;
    panel.onclick=e=>{
      const btn=e.target.closest('button');if(!btn)return;
      if(btn.dataset.svLevel){level=btn.dataset.svLevel;display();return;}
      if(btn.dataset.svKind){kind=btn.dataset.svKind;display();return;}
      if(btn.hasAttribute('data-sv-say')){
        const x=filtered[Number(btn.dataset.svSay)];if(x)speak(x.term);
      }
    };
  }
  // The main UI renders after async manifest loading; attach to the existing render.
  if(typeof window.renderCollection==='function'){
    const original=window.renderCollection;
    window.renderCollection=function(){
      const result=original.apply(this,arguments);
      display();
      return result;
    };
  }
  if(typeof window.showGameList==='function'){
    const original=window.showGameList;
    window.showGameList=function(){
      const result=original.apply(this,arguments);
      display();
      return result;
    };
  }
  window.addEventListener('pagehide',()=>{if('speechSynthesis' in window)speechSynthesis.cancel();});
  if(!document.getElementById('collectionScreen')?.classList.contains('hidden'))display();
})();
