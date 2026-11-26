/* Dolphin Reading Library: self-contained pixel-art animation; no third-party media. */
(()=>{
 'use strict';
 const W=480,H=270,TAU=Math.PI*2;
 const C=['#041b45','#06365a','#075276','#097d96','#16aeb7','#59d9cf'];
 const rect=(g,x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))};
 function polygon(g,points,color){
  g.fillStyle=color;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();
 }
 function dolphin(g,x,y,k=1,shade='#79a9d6',phase=0){
  g.save();g.translate(x,y);g.scale(k,k);
  const tail=Math.sin(phase)*4;
  polygon(g,[[-35,-2],[-53,-11+tail],[-49,0],[-58,10+tail],[-33,7]],'#4c79ac');
  polygon(g,[[-31,-10],[-18,-16],[3,-18],[24,-12],[36,-4],[42,1],[31,8],[8,13],[-18,10],[-36,3]],shade);
  polygon(g,[[-18,4],[4,10],[28,4],[38,2],[32,10],[11,17],[-16,13]],'#d1eaf0');
  polygon(g,[[-9,-17],[1,-32],[8,-16]],'#4573a5');
  polygon(g,[[0,9],[-12,23],[-16,23],[-8,7]],'#3c75a7');
  polygon(g,[[32,-3],[48,-2],[53,1],[48,4],[34,4]],shade);
  rect(g,25,-7,3,3,'#162b51');rect(g,25,-7,1,1,'#f9ffff');
  rect(g,41,3,8,1,'#23456c');
  g.restore();
 }
 function coral(g,x,y,color,scale=1){
  g.save();g.translate(x,y);g.scale(scale,scale);
  rect(g,-3,-28,8,30,color);
  for(const [bx,by,bw,bh] of [[-14,-22,7,6],[-16,-35,6,15],[8,-17,8,6],[12,-31,6,18],[-3,-47,5,22]])
   rect(g,bx,by,bw,bh,color);
  g.restore();
 }
 function draw(g,t){
  rect(g,0,0,W,H,'#05395c');
  for(let y=0;y<185;y+=12)rect(g,0,y,W,12,C[Math.min(5,Math.floor(y/32))]);
  // Broken surface highlights, sunshafts and distant layered mountains.
  for(let i=0;i<42;i++){
   const x=((i*61+Math.floor(t*2))%520)-20;
   rect(g,x,i%3===0?5:12+(i%4)*3,12+(i%4)*7,2,i%3?'#26bfc4':'#b3f3da');
  }
  g.globalAlpha=.13;
  for(let i=0;i<7;i++)polygon(g,[[155+i*36,0],[170+i*38,0],[100+i*53,205],[53+i*51,205]],'#e0fff0');
  g.globalAlpha=1;
  polygon(g,[[0,175],[34,150],[63,159],[93,133],[145,170],[193,164],[249,180],[320,139],[372,164],[409,146],[480,176],[480,270],[0,270]],'#06476a');
  polygon(g,[[0,203],[61,179],[119,194],[182,179],[228,212],[292,192],[358,196],[404,178],[480,199],[480,270],[0,270]],'#075977');
  polygon(g,[[0,234],[40,224],[95,232],[157,216],[203,236],[263,218],[319,229],[385,214],[480,228],[480,270],[0,270]],'#0b7889');
  polygon(g,[[0,250],[41,241],[99,253],[181,243],[251,258],[333,240],[403,252],[480,240],[480,270],[0,270]],'#159a9d');
  for(let i=0;i<11;i++){
   const x=i*52-9,y=243+(i%3)*7;
   polygon(g,[[x-19,y+19],[x-14,y-4],[x-2,y-12],[x+16,y],[x+22,y+20]],i%2?'#174d75':'#1b577b');
  }
  for(let i=0;i<14;i++){
   let x=16+i*35,y=263+(i%2)*5;
   for(let j=0;j<4;j++)rect(g,x+Math.sin(j*1.8+i)*8,y-j*9,3,13,j%2?'#65b97a':'#3aaa76');
  }
  for(let i=0;i<8;i++)coral(g,18+i*64,269,['#fa829f','#ffc17a','#b58de6','#fa9b76'][i%4],.55+(i%3)*.16);
  for(let i=0;i<12;i++){const x=(i*37+26+Math.sin(t*.45+i)*6)%W,y=191+i%4*11;
    polygon(g,[[x,y],[x+7,y-3],[x+12,y],[x+7,y+3]],i%2?'#f8ca6d':'#e4db8a');rect(g,x+9,y,1,1,'#243f5a')}
  for(let i=0;i<24;i++){
   const x=(i*37+19+(i%3)*8)%W,y=(i*23+260-t*(4+i%4))%235;
   rect(g,x,y,2+(i%3),2+(i%3),i%2?'#8ff2ee':'#52c7d3');
  }
  const move=Math.sin(t*.7)*5;
  dolphin(g,229+Math.sin(t*.40)*9,100+move,1.40,'#7aa8d4',t*4);
  dolphin(g,125+Math.sin(t*.45)*8,144+Math.sin(t*.72+1)*5,1.10,'#548bbb',t*4+1);
  dolphin(g,213+Math.sin(t*.48+2)*7,185+Math.sin(t*.9+2)*4,.76,'#9bbfe1',t*4+2);
  // Clicks are echolocation; shipping noise is a separate visual pattern.
  const cycle=t%9.5,sourceX=299,sourceY=102+move;
  if(cycle>2.3&&cycle<7){
   g.lineWidth=2;
   for(let i=0;i<4;i++){
    const age=cycle-2.3-i*.52;
    if(age<0||age>3.5)continue;
    const radius=age*28;g.globalAlpha=(1-age/3.5)*.85;
    g.strokeStyle='#93fff1';g.beginPath();g.arc(sourceX,sourceY,radius,-.66,.75);g.stroke();
   }
   g.globalAlpha=1;
  }
  if(cycle>5.5&&cycle<8.2){
   polygon(g,[[334,15],[400,15],[393,23],[345,23]],'#173651');
   rect(g,357,7,20,9,'#173651');rect(g,365,2,3,8,'#173651');
   g.strokeStyle='#b7e6f0';g.globalAlpha=.60;g.lineWidth=2;
   for(let i=0;i<4;i++){const y=29+i*15;
    g.beginPath();for(let x=0;x<=72;x+=6){const xx=365+x;const yy=y+x*.30+Math.sin(x*.16+t*12+i)*5;x===0?g.moveTo(xx,yy):g.lineTo(xx,yy)}g.stroke()}
   g.globalAlpha=1;
  }
 }
 function attach(host){
  if(host.dataset.dolphinMounted)return;
  host.dataset.dolphinMounted='1';
  const wrap=document.createElement('div');wrap.className='dolphin-animation';
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label','Pixel animation: a pod of dolphins communicates through sound underwater while a ship introduces noise');
  const controls=document.createElement('div');controls.className='dolphin-animation-controls';
  const note=document.createElement('span');note.textContent='🐬 Dolphin communication · Pixel animation';
  const button=document.createElement('button');button.type='button';button.textContent='❚❚ Tạm dừng';
  button.setAttribute('aria-label','Tạm dừng hoạt hình');
  controls.append(note,button);wrap.append(canvas,controls);host.append(wrap);
  const g=canvas.getContext('2d',{alpha:false});if(!g)return;g.imageSmoothingEnabled=false;
  let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible=true,last=0,elapsed=0,raf=0;
  function frame(now){raf=requestAnimationFrame(frame);if(!last)last=now;
   const dt=Math.min(.06,(now-last)/1000);last=now;
   if(!paused&&visible)elapsed+=dt;
   if(visible)draw(g,elapsed);
  }
  button.textContent=paused?'▶ Phát':'❚❚ Tạm dừng';
  button.onclick=()=>{paused=!paused;button.textContent=paused?'▶ Phát':'❚❚ Tạm dừng';button.setAttribute('aria-label',paused?'Phát hoạt hình':'Tạm dừng hoạt hình')};
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false});
  observer.observe(wrap);draw(g,0);raf=requestAnimationFrame(frame);
  host._disposeDolphin=()=>{cancelAnimationFrame(raf);observer.disconnect()};
 }
 window.SmartcomDolphinAnimation={mount:attach,dispose:host=>{host?._disposeDolphin?.();if(host)host.replaceChildren()}};
})();
