/* Smartcom Reading Library: optional animated story prototype for one article.
   Plays original article text using the browser's built-in speech synthesis.
   The downloadable offline demo MP4 is separate; this canvas is not an MP4 player. */
(()=>{
 'use strict';
 const TARGET='animal-dolphin-language';
 let root=null,canvas=null,ctx=null,article=null,playing=false,paused=false,sequence=0,chapter=0,sentence=0,frame=0,loadedImage=null;
 const $=id=>document.getElementById(id);
 const split=p=>p.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map(s=>s.trim()).filter(Boolean)||[p];
 const NAMES=['A mystery in the ocean','Clicks & echolocation','Staying connected','A noisier ocean'];
 const BLURBS=['How do dolphins move so closely together?','Whistles, clicks and returning echoes','Communication when visibility is limited','Understanding human-made ocean noise'];
 function ready(){
  if(root)return;
  root=document.createElement('section');root.id='storyPrototype';root.hidden=true;
  root.innerHTML=`
   <div class="storyHead"><div><strong>🎬 Watch Story · Video thử nghiệm</strong><small>Chỉ dành cho bài The Secret Conversations of Dolphins</small></div><span>B1–B2 · 4 chapters</span></div>
   <canvas id="storyCanvas" width="960" height="540" role="img" aria-label="Cảnh cá heo dưới nước với hiệu ứng sonar và phụ đề"></canvas>
   <div class="storyControls">
    <button id="storyPlay" type="button">▶ Nghe truyện</button>
    <button id="storyBack" type="button">← Chương trước</button>
    <button id="storyNext" type="button">Chương sau →</button>
    <span id="storyChapter">01 / 04</span>
   </div>
   <p id="storyStatus">Bấm Nghe truyện để xem hình chuyển động và nghe bài bằng giọng đọc của trình duyệt.</p>
   <p class="storyNote">Bản thử nghiệm: hoạt ảnh canvas, không phải hoạt hình 3D. Giọng nói có thể khác nhau theo trình duyệt; nội dung lời kể lấy nguyên văn từ bài đọc.</p>`;
  const style=document.createElement('style');style.textContent=`
  #storyPrototype[hidden]{display:none!important}#storyPrototype{margin:16px 0 25px;padding:14px;background:#f4f8ff;border:1px solid #d6e2f4;border-radius:20px;overflow:hidden}
  .storyHead{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin:2px 2px 12px}.storyHead strong{display:block;color:#321277;font-size:17px}.storyHead small{display:block;color:#6c6483;margin-top:3px}.storyHead span{font-size:11px;color:#6542ab;font-weight:800}
  #storyCanvas{display:block;width:100%;height:auto;aspect-ratio:16/9;border-radius:13px;background:#113d5b}
  .storyControls{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}.storyControls button{border:0;border-radius:10px;padding:10px 12px;background:#ede4ff;color:#3b0e90;font-weight:800}.storyControls #storyPlay{background:#3b0e90;color:white}.storyControls span{margin-left:auto;font-size:12px;color:#6b5f82}
  #storyStatus{font-size:12px;line-height:1.5;color:#4b3771;min-height:18px}.storyNote{font-size:11px;line-height:1.5;color:#83798e;margin-bottom:0}
  `;
  document.head.append(style);
  const photo=$('articlePhoto');photo.parentNode.insertBefore(root,photo);
  canvas=$('storyCanvas');ctx=canvas.getContext('2d');
  $('storyPlay').onclick=()=>{
   if(playing&&paused){window.speechSynthesis?.resume();paused=false;$('storyPlay').textContent='⏸ Tạm dừng';return;}
   if(playing){window.speechSynthesis?.pause();paused=true;$('storyPlay').textContent='▶ Tiếp tục';return;}
   play(chapter,0);
  };
  $('storyBack').onclick=()=>play(Math.max(0,chapter-1),0);
  $('storyNext').onclick=()=>play(Math.min(3,chapter+1),0);
 }
 function stop(){
  sequence++;playing=false;paused=false;
  if('speechSynthesis'in window)window.speechSynthesis.cancel();
  if(root){$('storyPlay').textContent='▶ Nghe truyện';}
 }
 function draw(){
  if(!root||root.hidden||!ctx){frame=0;return;}
  const w=canvas.width,h=canvas.height,t=performance.now()/1000;
  const gradient=ctx.createLinearGradient(0,0,0,h);
  gradient.addColorStop(0,'#157da2');gradient.addColorStop(.6,'#075471');gradient.addColorStop(1,'#072f4f');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
  if(loadedImage?.complete&&loadedImage.naturalWidth){
   const sc=Math.max(w/loadedImage.naturalWidth,h/loadedImage.naturalHeight)*(1.1+.025*Math.sin(t*.2));
   const iw=loadedImage.naturalWidth*sc,ih=loadedImage.naturalHeight*sc;
   ctx.globalAlpha=.86;ctx.drawImage(loadedImage,(w-iw)/2+18*Math.sin(t*.14), (h-ih)/2+10*Math.cos(t*.17),iw,ih);ctx.globalAlpha=1;
  }
  for(let i=0;i<22;i++){
   const x=(i*127+31)%w+12*Math.sin(t*.28+i),y=h-((t*(12+i%5*3)+i*58)%h);
   ctx.strokeStyle='rgba(207,247,252,.38)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,2+i%3,0,Math.PI*2);ctx.stroke();
  }
  if(chapter>0){
   const px=chapter===3?805:665,py=chaptersY(chapter);
   for(let j=0;j<4;j++){
    const radius=(t*45+j*95)%390;
    ctx.strokeStyle=chapter===3?'rgba(255,189,105,.46)':'rgba(138,241,255,.52)';
    ctx.lineWidth=4;ctx.beginPath();ctx.arc(px,py,radius,0,Math.PI*2);ctx.stroke();
   }
  }
  ctx.fillStyle='rgba(5,24,47,.78)';ctx.fillRect(0,0,w,108);
  ctx.fillStyle='#ffbb66';ctx.font='bold 16px system-ui';ctx.fillText('SMARTCOM  ·  READING LIBRARY',30,34);
  ctx.fillStyle='white';ctx.font='bold 29px system-ui';ctx.fillText(NAMES[chapter].toUpperCase(),30,79);
  ctx.fillStyle='rgba(2,18,36,.84)';ctx.fillRect(0,385,w,155);
  ctx.fillStyle='#bbeaf7';ctx.font='bold 18px system-ui';ctx.fillText(BLURBS[chapter],28,421);
  const textNow=article?.paragraphs?.[chapter] ? split(article.paragraphs[chapter])[sentence]||'': '';
  ctx.fillStyle='white';ctx.font='bold 22px system-ui';
  const words=textNow.split(' ');let row='',y=461;
  for(const word of words){
   const test=row?row+' '+word:word;
   if(ctx.measureText(test).width>900&&row){ctx.fillText(row,28,y);row=word;y+=29;}else row=test;
   if(y>525)break;
  }
  if(y<=528)ctx.fillText(row,28,y);
  frame=requestAnimationFrame(draw);
 }
 function chaptersY(c){return c===1?260:c===2?320:205;}
 function update(){
  $('storyChapter').textContent=String(chapter+1).padStart(2,'0')+' / 04';
 }
 function play(nextChapter,nextSentence){
  if(!article)return;
  stop();
  if(!('speechSynthesis'in window)){$('storyStatus').textContent='Trình duyệt này không hỗ trợ đọc lời kể. Vẫn có thể đọc nội dung bên dưới.';return;}
  const token=sequence;
  chapter=nextChapter;sentence=nextSentence;playing=true;paused=false;update();$('storyPlay').textContent='⏸ Tạm dừng';
  const lines=split(article.paragraphs[chapter]);
  function speakNext(){
   if(token!==sequence)return;
   if(sentence>=lines.length){
    if(chapter===3){playing=false;$('storyPlay').textContent='↻ Nghe lại';$('storyStatus').textContent='✓ Đã xem hết câu chuyện. Đọc bài bên dưới để tra từ.';return;}
    chapter++;sentence=0;update();play(chapter,0);return;
   }
   $('storyStatus').textContent='Đang kể: '+NAMES[chapter]+' · câu '+(sentence+1)+'/'+lines.length;
   const speech=new SpeechSynthesisUtterance(lines[sentence]);
   speech.lang='en-US';speech.rate=.87;speech.pitch=1;speech.volume=1;
   const voices=window.speechSynthesis.getVoices();
   speech.voice=voices.find(v=>/^en-US/.test(v.lang)&&/natural|google|microsoft/i.test(v.name))||voices.find(v=>/^en/.test(v.lang))||null;
   speech.onend=()=>{if(token!==sequence)return;sentence++;speakNext()};
   speech.onerror=()=>{if(token!==sequence)return;stop();$('storyStatus').textContent='Không thể phát giọng đọc. Hãy kiểm tra âm thanh và thử lại.'};
   window.speechSynthesis.speak(speech);
  }
  speakNext();
 }
 window.SmartcomVideoStory={
  show(item){
   ready();stop();
   if(item?.id!==TARGET){root.hidden=true;cancelAnimationFrame(frame);return;}
   article=item;chapter=0;sentence=0;root.hidden=false;update();
   $('storyStatus').textContent='Nhấn Nghe truyện để bắt đầu. Nội dung đọc bên dưới vẫn giữ nguyên.';
   loadedImage=new Image();loadedImage.onload=()=>{};loadedImage.src=item.image;
   cancelAnimationFrame(frame);draw();
  },
  stop
 };
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing&&!paused){window.speechSynthesis?.pause();paused=true;if(root)$('storyPlay').textContent='▶ Tiếp tục';}});
})();
