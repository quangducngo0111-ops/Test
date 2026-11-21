import * as THREE from 'three';
// LIFE ABROAD 3D — Phase 0 Art Gate.
// Palette: Smartcom violet #3b0e90, orange #ff9c00, sky blue #65bee4.
// Lighting: ACES filmic, sRGB, 2.2 hemispheric fill + warm directional sun, soft shadow.
// Materials: warm pastel MeshStandard flat-shaded, rounded/tapered procedural silhouettes.
// No external models or AI services; this standalone preview never touches learner results.
const $=id=>document.getElementById(id);
const scene=new THREE.Scene();
scene.background=new THREE.Color('#b3dcf6');
scene.fog=new THREE.Fog('#b3dcf6',28,86);
const camera=new THREE.PerspectiveCamera(53,innerWidth/innerHeight,.12,130);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.17;renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
$('viewport').appendChild(renderer.domElement);
const hemi=new THREE.HemisphereLight('#d6eeff','#8f9b85',2.3);scene.add(hemi);
const sun=new THREE.DirectionalLight('#ffebce',2.6);
sun.position.set(-12,22,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=23;sun.shadow.camera.bottom=-23;
sun.shadow.camera.near=1;sun.shadow.camera.far=65;sun.shadow.bias=-.00035;scene.add(sun,sun.target);
const clock=new THREE.Clock();
const mat=(color,opt={})=>new THREE.MeshStandardMaterial({color,roughness:.84,metalness:0,flatShading:true,...opt});
const materials={road:mat('#6f7890'),street:mat('#f4dcbe'),grass:mat('#8dca9b'),
tree:mat('#4ba88d'),tree2:mat('#82c6a3'),trunk:mat('#8a6859'),
window:mat('#a3d8ec',{roughness:.3,metalness:.12}),
glow:mat('#fbd38d',{emissive:'#e6ac54',emissiveIntensity:0}),
roof:mat('#504b82'),stripe:mat('#fff8db'),dark:mat('#334e72')};
function mesh(g,m,x=0,y=0,z=0,parent=scene,shadow=true){
 const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=shadow;o.receiveShadow=true;parent.add(o);return o;
}
function box(w,h,d,m,x,y,z,p=scene){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,p)}
function cyl(rt,rb,h,m,x,y,z,p=scene,n=10){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),m,x,y,z,p)}
function ball(r,m,x,y,z,p=scene,w=9,h=6){return mesh(new THREE.SphereGeometry(r,w,h),m,x,y,z,p)}
function signTexture(label,bg='#fef8e9',fg='#402570',w=512,h=160){
 const c=document.createElement('canvas');c.width=w;c.height=h;const t=c.getContext('2d');
 t.fillStyle=bg;t.fillRect(0,0,w,h);t.strokeStyle='#ffffffaa';t.lineWidth=12;t.strokeRect(8,8,w-16,h-16);
 t.fillStyle=fg;t.font='900 '+(label.length>14?41:58)+'px Nunito,Arial';t.textAlign='center';t.textBaseline='middle';t.fillText(label,w/2,h/2,w-30);
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
function sign(label,x,y,z,w=2.7,h=.75,bg='#fef8e9',fg='#402570',parent=scene){
 const m=new THREE.MeshBasicMaterial({map:signTexture(label,bg,fg),side:THREE.DoubleSide});
 return mesh(new THREE.PlaneGeometry(w,h),m,x,y,z,parent,false);
}
const outdoors=new THREE.Group(),interior=new THREE.Group();scene.add(outdoors,interior);
const groups={outdoors,interior};interior.visible=false;
const lamplights=[],windowGlow=[],moving=[];
function windowPane(parent,x,y,z,lit=false){
 const m=lit?mat('#ffda8f',{emissive:'#f9b25d',emissiveIntensity:0}):materials.window;
 box(.75,.96,.085,mat('#fff8e7'),x,y,z,parent);
 box(.62,.82,.095,m,x,y,z+.08,parent);
 box(.07,.96,.11,mat('#fff6e3'),x,y,z+.14,parent);
 box(.75,.065,.11,mat('#fff6e3'),x,y,z+.14,parent);
 if(lit)windowGlow.push(m);
}
function building(x,z,theme,label,stories=3,depth=4){
 const p=new THREE.Group();p.position.set(x,0,z);outdoors.add(p);
 const h=stories*2.15+1.6;
 box(5.9,h,depth,mat(theme.wall),0,h/2,-depth/2,p);
 box(6.25,.32,depth+.24,mat(theme.roof),0,h+.13,-depth/2,p);
 for(let floor=1;floor<=stories;floor++)for(let ix of [-1.65,0,1.65]){
  if(floor===1&&ix===0)continue;
  windowPane(p,ix,1.4+(floor-1)*2.15,.055,floor%2===0);
 }
 if(label==='THE BLUEBIRD CAFÉ'){
  box(5.6,.44,1.8,mat('#ffad51'),0,3.05,.5,p);
  for(let ix=-2;ix<=2;ix++)box(.06,.15,1.6,mat(ix%2?'#f5d485':'#fff4df'),ix*1.1,2.79,1.15,p);
  box(1.5,2.1,.1,mat('#9ad4d4'),0,1.13,.07,p);
  box(.12,1.95,.11,mat('#e9f2eb'),0,1.13,.16,p);
  box(.17,.17,.12,mat('#f9d38c'),.53,1.1,.2,p);
  sign('THE BLUEBIRD CAFÉ',0,3.7,.1,4.3,.72,'#fff5e0','#502e84',p);
  for(const side of [-1,1]){
   box(1.4,1.45,.09,mat('#d2f0f0'),side*1.95,1.28,.09,p);
   box(1.45,.12,.15,mat('#f5eee6'),side*1.95,.63,.16,p);
  }
 }else if(label==='LITTLE BOOKSHOP'){
  sign('LITTLE BOOKSHOP',0,3.45,.12,4.5,.72,'#5a4b91','#fff5df',p);
  box(2,2.1,.12,mat('#84afa9'),0,1.12,.09,p);box(.16,1.9,.13,mat('#f8efd7'),.5,1.1,.21,p);
  for(const ix of [-1.8,1.8])box(1.45,1.46,.1,mat('#d7e8f9'),ix,1.3,.09,p);
 }else{
  sign('LONDON CORNER',0,3.42,.12,4.4,.72,'#d7eafa','#4c4687',p);
  box(1.8,2.1,.14,mat('#697fa7'),0,1.11,.1,p);
  for(const ix of [-1.8,1.8])box(1.5,1.5,.11,mat('#abcdd9'),ix,1.28,.1,p);
 }
 return p;
}
function tree(x,z,size=1,parent=outdoors){
 const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(size);parent.add(g);
 cyl(.23,.29,2.25,materials.trunk,0,1.13,0,g,8);
 for(const [dx,dy,dz,r] of [[0,2.7,0,.95],[-.55,2.65,.1,.7],[.45,2.9,0,.77],[0,3.27,-.1,.72]]){
  ball(r,dy>3?materials.tree2:materials.tree,dx,dy,dz,g,8,6);
 }
 return g;
}
function lamp(x,z){
 const g=new THREE.Group();g.position.set(x,0,z);outdoors.add(g);
 cyl(.085,.13,3.6,materials.dark,0,1.8,0,g);
 box(.62,.12,.48,materials.dark,0,3.56,.1,g);
 const bulb=box(.39,.32,.35,mat('#f8e6b0',{emissive:'#ffc77e',emissiveIntensity:0}),0,3.31,.1,g);lamplights.push(bulb.material);
 const light=new THREE.PointLight('#ffdca2',0,7,2);light.position.set(0,3.1,.2);g.add(light);lamplights.push(light);
}
function bus(x,z){
 const g=new THREE.Group();g.position.set(x,0,z);outdoors.add(g);
 const red=mat('#d94f60'),trim=mat('#fff3d2');
 box(2.2,2.7,5.1,red,0,1.5,0,g);box(2.22,.16,5.2,trim,0,2.02,0,g);
 for(const level of [1.24,2.3])for(const side of [-1,1])for(let j=-2;j<=2;j++){
  box(.07,.64,.62,mat('#b6e3f5',{roughness:.4}),side*1.13,level,j*.92,g);
 }
 for(const z0 of [-1.65,1.65])for(const side of [-1,1]){const wh=cyl(.45,.45,.14,mat('#343847'),side*1.07,.45,z0,g,12);wh.rotation.z=Math.PI/2;}
 sign('LONDON BUS',0,2.65,2.57,1.9,.35,'#fff9eb','#8f2c52',g);
 return g;
}
function street(){
 box(120,.12,120,mat('#9fcfa3'),0,-.18,0,outdoors);
 box(120,.14,6.2,materials.road,0,.015,1.5,outdoors);
 for(let x=-50;x<50;x+=3.8)box(1.85,.012,.09,mat('#fff1c7'),x,.092,1.5,outdoors);
 for(let i=-3;i<=3;i++)box(.36,.015,4.4,mat('#fff5e7'),i*.62,.09,1.5,outdoors);
 box(120,.21,3.1,materials.street,0,.12,-3.1,outdoors);
 box(120,.21,3.1,materials.street,0,.12,5.5,outdoors);
 for(let i=-10;i<=10;i++)box(.1,.18,.37,mat('#fcf5e5'),i*2.5,.21,-1.47,outdoors);
 for(const x of [-12,-8,-4,0,4,8,12])box(.1,.18,.37,mat('#fcf5e5'),x,.21,3.93,outdoors);
 building(-8.1,-5.2,{wall:'#f2c5a8',roof:'#d58ca0'},'LITTLE BOOKSHOP',3,4);
 building(-1.7,-5.2,{wall:'#e4d5e7',roof:'#75609e'},'THE BLUEBIRD CAFÉ',3,4);
 building(4.7,-5.2,{wall:'#c8d7ee',roof:'#6b91bb'},'LONDON CORNER',4,4);
 for(const x of [-12.8,-4.95,2.15,8.4])tree(x,-5.1,.73);
 for(const x of [-12,10])lamp(x,-1.7);
 for(const x of [-9.6,8])lamp(x,4.3);
 // bench, bus stop and flower boxes
 box(1.9,.2,.52,mat('#a37760'),8,.78,4.2,outdoors);
 for(const x of [7.25,8.75])box(.12,.7,.14,materials.dark,x,.36,4.2,outdoors);
 box(1.9,.75,.12,mat('#a37760'),8,1.2,4.43,outdoors);
 box(.15,2.6,.13,materials.dark,-13.6,1.35,4.3,outdoors);
 sign('BUS STOP',-13.6,2.6,4.43,1.5,.4,'#f4e8a4','#3b3982',outdoors);
 bus(12,7.4);
 for(let i=0;i<8;i++){
  const x=-12+i*3.4;const flower=mat(i%2?'#ffb35a':'#c692db');
  for(let j=0;j<4;j++){cyl(.015,.015,.31,materials.tree,x+.12*j,.36,-1.12,outdoors,5);ball(.12,flower,x+.12*j,.56,-1.12,outdoors,6,5);}
 }
}
street();
const cafe=new THREE.Group();interior.add(cafe);
function buildCafe(){
 const floor=mat('#e7c5a0'),walls=mat('#fff1dc'),cream=mat('#f4ddc3');
 box(15,.22,14,floor,0,-.15,-1,cafe);
 box(15,5,.28,walls,0,2.45,-8,cafe);
 box(.28,5,14,walls,-7.5,2.45,-1,cafe);box(.28,5,14,walls,7.5,2.45,-1,cafe);
 // ceiling beams, café counters and menu boards
 for(const x of [-5.5,0,5.5])box(.22,.25,14,mat('#caa68e'),x,4.76,-1,cafe);
 box(6.7,1.45,1.2,mat('#c98e75'),3,0.74,-5.6,cafe);
 box(6.9,.16,1.45,mat('#fff7e3'),3,1.51,-5.6,cafe);
 sign('TODAY’S MENU',3.1,3.5,-7.8,4.35,1.13,'#523878','#fff7e0',cafe);
 for(let k=0;k<3;k++){
  const x=-5+k*2.6;
  cyl(.9,.9,.13,cream,x,1.15,-4.4,cafe,12);
  cyl(.12,.19,1.1,mat('#9e8073'),x,.56,-4.4,cafe);
  for(const zz of [-5.4,-3.4]){box(.85,.15,.8,mat('#83b9ab'),x,.55,zz,cafe);box(.17,.9,.16,mat('#8b7167'),x,.42,zz,cafe);}
 }
 // espresso machine
 box(.98,.63,.73,mat('#526679'),4.5,1.9,-5.5,cafe);
 for(const dx of [-.23,.23])cyl(.15,.15,.14,mat('#e0e3e5'),4.5+dx,2.25,-5.3,cafe);
 // shelving and decorative plants
 for(const x of [6.6,-6.7]){
  for(let y=1.2;y<3.6;y+=1.15)box(.72,.13,2.2,mat('#ac8b72'),x,y,-4.3,cafe);
  for(let j=0;j<6;j++)box(.24,.45,.28,mat(j%2?'#c99398':'#9ab8d6'),x,1.48+(j%2)*1.1,-5.1+(j%3)*.8,cafe);
 }
 tree(-6.4,-6,.35,cafe);
 // framed art and pendants
 sign('COFFEE & FRIENDS',-3.5,3.8,-7.82,3.5,.7,'#f7ddb9','#5b3980',cafe);
 for(const x of [-5,0,5]){
  cyl(.045,.045,.55,materials.dark,x,4.42,-3,cafe);
  const cover=cyl(.55,.26,.46,mat('#ffa85f'),x,4.0,-3,cafe,12);
  cover.castShadow=false;
  const light=new THREE.PointLight('#ffd6a0',1.1,7);light.position.set(x,3.6,-3);cafe.add(light);lamplights.push(light);
 }
}
buildCafe();
// Procedural character rig reused for adult, child and senior.
function character(options={}){
 const o={skin:'#e4ad8b',shirt:'#6d90cb',pants:'#4b638b',hair:'#62453f',age:'adult',...options};
 const group=new THREE.Group();const rig=new THREE.Group();group.add(rig);
 const headScale=o.age==='child'?1.22:o.age==='senior'?.97:1;
 const scale=o.age==='child'?.74:o.age==='senior'?.94:1;
 rig.scale.setScalar(scale);
 const torso=new THREE.Group();torso.position.y=1.48;rig.add(torso);
 const shirt=mat(o.shirt),skin=mat(o.skin),pants=mat(o.pants),hair=mat(o.hair),shoe=mat('#443f52');
 const waist=box(.7,.9,.43,shirt,0,0,0,torso);
 const neck=cyl(.115,.13,.2,skin,0,.53,0,torso);
 const head=new THREE.Group();head.position.set(0,.93,0);head.scale.setScalar(headScale);torso.add(head);
 const face=ball(.38,skin,0,0,0,head,12,9);
 ball(.39,hair,0,.22,-.055,head,11,7);
 for(const ix of [-.15,.15]){ball(.045,mat('#292d41'),ix,.025,.355,head,7,5)}
 const smile=mesh(new THREE.TorusGeometry(.1,.016,6,13,Math.PI),mat('#a45d65'),0,-.13,.357,head);smile.rotation.z=Math.PI;
 const limbs={};
 for(const side of [-1,1]){
  const arm=new THREE.Group();arm.position.set(side*.49,.28,0);torso.add(arm);
  cyl(.105,.125,.65,shirt,0,-.29,0,arm);ball(.11,skin,0,-.69,0,arm);
  limbs[side<0?'armL':'armR']=arm;
  const leg=new THREE.Group();leg.position.set(side*.22,.94,0);rig.add(leg);
  cyl(.145,.135,.75,pants,0,-.37,0,leg);
  box(.27,.16,.43,shoe,0,-.76,.12,leg);
  limbs[side<0?'legL':'legR']=leg;
 }
 if(o.age==='senior'){torso.rotation.x=.08;ball(.15,mat('#b4bbc4'),.23,.18,.03,head)}
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(.52,20),new THREE.MeshBasicMaterial({color:'#192e43',transparent:true,opacity:.2,depthWrite:false}));
 shadow.rotation.x=-Math.PI/2;shadow.position.y=.03;group.add(shadow);
 const anim=(t,speed=0)=>{const cycle=Math.sin(t*(speed>.1?8:1.5));limbs.armL.rotation.x=cycle*(speed>.1?.6:.03);limbs.armR.rotation.x=-cycle*(speed>.1?.6:.03);
 limbs.legL.rotation.x=-cycle*(speed>.1?.66:0);limbs.legR.rotation.x=cycle*(speed>.1?.66:0);torso.position.y=1.48+(speed>.1?Math.abs(cycle)*.035:Math.sin(t*1.8)*.009);
 head.rotation.y=Math.sin(t*.8)*.035;};
 return {group,anim,rig};
}
const player=character({skin:'#d7a37d',shirt:'#9e68d3',pants:'#536eaa',hair:'#563b3b',age:'teen'});
outdoors.add(player.group);
player.group.position.set(-1.8,0,5.4);
const npcs=[
 {...character({skin:'#b97859',shirt:'#ffac70',pants:'#57567e',hair:'#473535',age:'adult'}),pos:[-6.0,0,-1.9]},
 {...character({skin:'#e8b88e',shirt:'#7cc4aa',pants:'#6380b7',hair:'#ab8161',age:'child'}),pos:[2.3,0,-1.8]},
 {...character({skin:'#e3b49a',shirt:'#c0a3d9',pants:'#5e6084',hair:'#aeb7c0',age:'senior'}),pos:[7.4,0,4.8]}
];
for(const n of npcs){outdoors.add(n.group);n.group.position.set(...n.pos)}
// Interior barista; scripted dialogue is intentionally deferred to Phase 3.
const barista=character({skin:'#c5947b',shirt:'#5eac95',pants:'#564a65',hair:'#392f35',age:'adult'});
cafe.add(barista.group);barista.group.position.set(3.4,0,-4.0);
let inside=false;
const keys=new Set();
const joystick={x:0,y:0,active:false};
let yaw=-.18,pitch=.32,dist=6.3;
let timeMode='day',qualityMode='auto',nearAction='';
function showNotice(message){
 const node=$('notice');node.textContent=message;node.style.display='block';
 clearTimeout(showNotice.timer);showNotice.timer=setTimeout(()=>node.style.display='none',2500);
}
function setInside(value){
 inside=value;outdoors.visible=!value;interior.visible=value;
 if(value){cafe.add(player.group);player.group.position.set(0,0,3.5);player.group.rotation.set(0,0,0);
 $('location').textContent='☕ London · Bluebird Café';
 $('mission').querySelector('h2').textContent='☕ Inside the café';
 $('mission').querySelector('p').textContent='Đây là cảnh thử đồ họa nội thất. NPC hội thoại bằng micro sẽ được xây ở Phase 3. Đi đến cửa để ra phố.';
 showNotice('Welcome to the Bluebird Café!');
 }else{outdoors.add(player.group);player.group.position.set(-1.8,0,-2.2);
 $('location').textContent='📍 London · Neighbourhood Street';
 $('mission').querySelector('h2').textContent='☕ Visit the café';
 $('mission').querySelector('p').textContent='Đi bộ đến quán cà phê có mái hiên màu cam, nhấn E để vào. Đây là cảnh đồ họa thử nghiệm, chưa có chấm điểm hay hội thoại AI.';
 showNotice('Back to the London street');
 }
 nearAction='';$('interact').hidden=true;
}
function interact(){if(nearAction==='enter')setInside(true);else if(nearAction==='exit')setInside(false);
 else showNotice('Tiến lại gần cửa quán cà phê để tương tác.')}
window.addEventListener('keydown',e=>{
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','KeyE'].includes(e.code))e.preventDefault();
 keys.add(e.code);if(e.code==='KeyE'&&!e.repeat)interact();
});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());
$('interact').onclick=interact;$('actionMobile').onclick=interact;
renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){orbit.active=true;orbit.x=e.clientX;orbit.y=e.clientY}});
const orbit={active:false,x:0,y:0};
window.addEventListener('pointerup',()=>orbit.active=false);
renderer.domElement.addEventListener('pointermove',e=>{
 if(e.buttons||orbit.active){const dx=e.movementX||e.clientX-orbit.x,dy=e.movementY||e.clientY-orbit.y;
 yaw-=dx*.004;pitch=THREE.MathUtils.clamp(pitch+dy*.0035,-.05,.95);orbit.x=e.clientX;orbit.y=e.clientY;
 }
});
renderer.domElement.addEventListener('wheel',e=>{dist=THREE.MathUtils.clamp(dist+e.deltaY*.007,3.5,10)}, {passive:true});
const pad=$('pad'),stick=$('stick');
pad.addEventListener('pointerdown',e=>{joystick.active=true;pad.setPointerCapture(e.pointerId);handleStick(e)});
pad.addEventListener('pointermove',e=>{if(joystick.active)handleStick(e)});
pad.addEventListener('pointerup',()=>{joystick.active=false;joystick.x=joystick.y=0;stick.style.transform='translate(0,0)'});
function handleStick(e){const r=pad.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,lim=36,scale=Math.min(1,lim/Math.max(1,Math.hypot(dx,dy)));
 joystick.x=dx*scale/lim;joystick.y=-dy*scale/lim;stick.style.transform='translate('+dx*scale+'px,'+dy*scale+'px)';}
function updateLighting(v){
 timeMode=v;const night=v==='night',dusk=v==='dusk';
 scene.background=new THREE.Color(night?'#1c315a':dusk?'#f4ab97':'#b3dcf6');
 scene.fog.color.set(night?'#2a3d68':dusk?'#e1b6a5':'#b3dcf6');
 hemi.intensity=night?.65:dusk?1.7:2.3;
 sun.intensity=night?.18:dusk?1.6:2.6;
 sun.color.set(night?'#8ea7ef':dusk?'#ffb98c':'#ffebce');
 sun.position.set(dusk?14:-12,night?4:dusk?8:22,15);
 for(const obj of lamplights){if(obj.isLight)obj.intensity=night?1.8:dusk?.7:0;else obj.emissiveIntensity=night?1.45:dusk?.45:0}
 for(const material of windowGlow)material.emissiveIntensity=night?1.4:dusk?.55:0;
 renderer.toneMappingExposure=night?.9:dusk?1.05:1.17;
}
$('timeChoice').onchange=e=>updateLighting(e.target.value);
function setQuality(q){
 qualityMode=q==='auto'?(matchMedia('(max-width:700px)').matches?'low':'medium'):q;
 renderer.setPixelRatio(Math.min(devicePixelRatio,qualityMode==='low'?1:qualityMode==='medium'?1.5:2));
 renderer.shadowMap.enabled=qualityMode!=='low';sun.castShadow=qualityMode!=='low';
 sun.shadow.mapSize.set(qualityMode==='high'?2048:1024,qualityMode==='high'?2048:1024);
 renderer.shadowMap.needsUpdate=true;resize();
}
$('quality').onchange=e=>setQuality(e.target.value);
$('resetCamera').onclick=()=>{yaw=-.18;pitch=.32;dist=6.3};
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)}
window.addEventListener('resize',resize);
function canWalk(x,z){
 if(inside)return x>-6.9&&x<6.9&&z>-7.2&&z<5.5;
 if(x<-16||x>17||z<-13||z>11)return false;
 // Building fronts at z=-5.2; preserve walkable pavements
 if(z< -5.15 && x> -11.1&&x<7.7)return false;
 return true;
}
let fpsFrames=0,fpsTime=0,t=0,velocity=0;
const forward=new THREE.Vector3(),right=new THREE.Vector3(),desired=new THREE.Vector3(),target=new THREE.Vector3();
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(.06,clock.getDelta());t+=dt;
 let f=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)+joystick.y;
 let r=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+joystick.x;
 const magnitude=Math.min(1,Math.hypot(f,r));desired.set(0,0,0);
 if(magnitude>.1){
  forward.set(Math.sin(yaw),0,-Math.cos(yaw));
  right.set(Math.cos(yaw),0,Math.sin(yaw));
  desired.addScaledVector(forward,f).addScaledVector(right,r).normalize();
 }
 const run=keys.has('ShiftLeft')||keys.has('ShiftRight');
 const speed=run?6.4:3.35;
 velocity=THREE.MathUtils.damp(velocity,magnitude*speed,10,dt);
 if(magnitude>.1){
  const x=player.group.position.x+desired.x*velocity*dt,z=player.group.position.z+desired.z*velocity*dt;
  if(canWalk(x,player.group.position.z))player.group.position.x=x;
  if(canWalk(player.group.position.x,z))player.group.position.z=z;
  const heading=Math.atan2(desired.x,desired.z);
  let diff=((heading-player.group.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;
  player.group.rotation.y+=diff*Math.min(1,dt*10);
 }
 player.anim(t,velocity/3);
 for(let i=0;i<npcs.length;i++)npcs[i].anim(t+i*2,0);
 barista.anim(t+1,0);
 if(inside)nearAction=player.group.position.z>3.5?'exit':'';
 else nearAction=Math.abs(player.group.position.x+1.7)<1.5&&Math.abs(player.group.position.z+2.9)<2.5?'enter':'';
 $('interact').hidden=!nearAction;
 if(nearAction)$('interact').textContent=nearAction==='enter'?'E · Enter Café':'E · Exit to Street';
 target.copy(player.group.position).add(new THREE.Vector3(0,1.35,0));
 const cameraPos=new THREE.Vector3(Math.sin(yaw)*dist*Math.cos(pitch),dist*Math.sin(pitch)+1.2,Math.cos(yaw)*dist*Math.cos(pitch));
 cameraPos.add(target);
 if(inside){cameraPos.x=THREE.MathUtils.clamp(cameraPos.x,-6.65,6.65);cameraPos.z=THREE.MathUtils.clamp(cameraPos.z,-6.8,5.6)}
 camera.position.lerp(cameraPos,1-Math.exp(-7*dt));camera.lookAt(target);
 sun.target.position.copy(player.group.position);sun.position.copy(player.group.position).add(new THREE.Vector3(timeMode==='dusk'?14:-12,timeMode==='night'?4:22,15));
 renderer.render(scene,camera);
 fpsFrames++;fpsTime+=dt;if(fpsTime>1){$('fps').textContent=Math.round(fpsFrames/fpsTime)+' FPS';fpsFrames=0;fpsTime=0}
}
setQuality('auto');updateLighting('day');
$('loading').hidden=true;animate();
