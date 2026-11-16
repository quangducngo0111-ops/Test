/* Original animated educational video scenes, one per lesson; no external media needed.
   Visuals are illustrative motion graphics synchronized with the spoken transcript,
   not documentary footage. */
window.SmartcomLessonScene={
 create(canvas,subtitle){
  const ctx=canvas.getContext('2d',{alpha:false});
  let topic=null,lesson=null,line='',idx=0,frame=0,handle=null;
  const themes={
   animals:{a:'#003a77',b:'#0e9eb0',icon:'🐬',shape:'waves'},
   health:{a:'#0b5161',b:'#35b797',icon:'🩺',shape:'pulse'},
   fashion:{a:'#6d246f',b:'#e58eb8',icon:'👗',shape:'diamonds'},
   science:{a:'#172c70',b:'#7160df',icon:'🔬',shape:'atoms'},
   food:{a:'#a8451b',b:'#f2ad57',icon:'🥗',shape:'bubbles'},
   travel:{a:'#175375',b:'#53b3d1',icon:'🧳',shape:'hills'},
   space:{a:'#080c37',b:'#4c3685',icon:'🪐',shape:'stars'},
   plants:{a:'#16472b',b:'#5bab65',icon:'🌿',shape:'leaves'},
   sports:{a:'#17346b',b:'#5a8bd8',icon:'⚽',shape:'rings'}
  };
  function rounded(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
  function resize(){
   const dpr=Math.min(window.devicePixelRatio||1,2),width=Math.max(320,canvas.clientWidth||850),height=width*9/16;
   if(canvas.width!==Math.floor(width*dpr)||canvas.height!==Math.floor(height*dpr)){
    canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);
   }
   ctx.setTransform(canvas.width/960,0,0,canvas.height/540,0,0);
  }
  function draw(){
   if(!topic||!lesson)return;
   resize();frame++;
   const t=frame/60,style=themes[topic.id]||themes.science;
   let bg=ctx.createLinearGradient(0,0,960,540);bg.addColorStop(0,style.a);bg.addColorStop(1,style.b);
   ctx.fillStyle=bg;ctx.fillRect(0,0,960,540);
   for(let i=0;i<24;i++){
    const px=(i*137+Math.sin(t*.65+i)*42+960)%960,py=(i*79+Math.cos(t*.46+i)*27+540)%540;
    ctx.beginPath();ctx.arc(px,py,5+(i%5)*3,0,2*Math.PI);
    ctx.fillStyle='rgba(255,255,255,'+(.04+(i%4)*.025)+')';ctx.fill();
   }
   if(style.shape==='waves'||style.shape==='hills'){
    for(let j=0;j<4;j++){
     ctx.beginPath();ctx.moveTo(-50,400+j*31);
     for(let x=-50;x<=1020;x+=15)ctx.lineTo(x,404+j*32+Math.sin(x/100+t+j*.9)*(19+j*6));
     ctx.lineTo(1020,550);ctx.lineTo(-50,550);ctx.closePath();
     ctx.fillStyle='rgba(255,255,255,'+(.045+j*.025)+')';ctx.fill();
    }
   }
   if(style.shape==='stars'){for(let i=0;i<54;i++){
    let x=(i*151)%960,y=(i*97)%430,p=.25+.55*(.5+.5*Math.sin(t*1.4+i));
    ctx.fillStyle='rgba(255,255,255,'+p+')';ctx.fillRect(x,y,2+(i%3),2+(i%3));
   }}
   if(style.shape==='rings'||style.shape==='atoms'||style.shape==='diamonds'){
    ctx.save();ctx.translate(790,200);ctx.rotate(t*.07);
    for(let j=1;j<5;j++){ctx.beginPath();ctx.ellipse(0,0,j*34,j*19,t*.1+j*.36,0,2*Math.PI);ctx.strokeStyle='rgba(255,255,255,.13)';ctx.lineWidth=3;ctx.stroke()}
    ctx.restore();
   }
   if(style.shape==='leaves'){for(let j=0;j<9;j++){
    ctx.save();ctx.translate(100+j*110,370+(j%3)*30);ctx.rotate(Math.sin(t+j)*.3);
    ctx.beginPath();ctx.ellipse(0,0,16,44,-.55,0,Math.PI*2);ctx.fillStyle='rgba(206,255,207,.15)';ctx.fill();ctx.restore();
   }}
   ctx.fillStyle='rgba(255,255,255,.12)';rounded(40,34,230,37,15);ctx.fill();
   ctx.font='bold 15px system-ui';ctx.fillStyle='#fff';ctx.fillText('SMARTCOM · FOUNDATIONS',57,58);
   ctx.textAlign='center';
   ctx.shadowColor='rgba(0,0,0,.16)';ctx.shadowBlur=35;
   ctx.font='100px system-ui';ctx.fillText(style.icon,480+Math.sin(t)*7,195+Math.sin(t*.7)*5);
   ctx.shadowBlur=0;
   ctx.font='bold 31px system-ui';ctx.fillStyle='white';
   const words=lesson.title.split(' '),rows=[],max=35;let row='';
   for(const w of words){if((row+' '+w).length>max){rows.push(row);row=w}else row=(row?row+' ':'')+w}
   if(row)rows.push(row);
   rows.forEach((r,i)=>ctx.fillText(r,480,268+i*39));
   ctx.font='16px system-ui';ctx.fillStyle='#e8eaff';
   ctx.fillText(topic.name.toUpperCase()+'  •  LESSON '+lesson.id,480,325+Math.max(0,rows.length-1)*27);
   ctx.fillStyle='rgba(0,0,0,.40)';rounded(45,415,870,93,20);ctx.fill();
   ctx.fillStyle='white';ctx.font='20px system-ui';
   const caption=line||'Nhấn Nghe toàn bài để bắt đầu.';
   const textRows=[];let current='';
   for(const w of caption.split(' ')){
    const next=current?current+' '+w:w;
    if(ctx.measureText(next).width>780&&current){textRows.push(current);current=w}else current=next;
   }
   if(current)textRows.push(current);
   textRows.slice(0,3).forEach((r,i)=>ctx.fillText(r,480,446+i*24));
   ctx.textAlign='left';
   ctx.fillStyle='#f4dd91';ctx.fillRect(50,520,Math.max(0,860*((idx+1)/Math.max(1,lesson.text.split(/[.!?]/).filter(Boolean).length))),5);
   handle=requestAnimationFrame(draw);
  }
  return {
   start(t,l){this.stop();topic=t;lesson=l;line='';idx=0;frame=0;canvas.hidden=false;subtitle.textContent='Video minh họa theo chủ đề và transcript';draw()},
   setSentence(text,index){line=String(text||'');idx=Number(index)||0;subtitle.textContent=line||'Nhấn Nghe toàn bài để bắt đầu.'},
   stop(){if(handle)cancelAnimationFrame(handle);handle=null;topic=null;lesson=null}
  };
 }
};
