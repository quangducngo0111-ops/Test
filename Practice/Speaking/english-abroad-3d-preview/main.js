import * as THREE from 'three';
import {applyCharacterAsset,installStreetAsset} from './asset-mode.js?v=20261121-assetmode2';
import {setupCafeDialogue} from './dialogue.js?v=20261121-face-dialogue3';
import {createCharacter,HAIR_STYLES,HAIR_COLORS,SKIN_COLORS,FACE_STYLES,OUTFITS} from './character-system.js?v=20261121-art-round2';
// LIFE ABROAD 3D — Phase 0 Art Gate.
// Palette: Smartcom violet #3b0e90, orange #ff9c00, sky blue #65bee4.
// Lighting: ACES filmic, sRGB, 2.2 hemispheric fill + warm directional sun, soft shadow.
// Materials: warm pastel MeshStandard flat-shaded, rounded/tapered procedural silhouettes.
// No external models or AI services; this standalone preview never touches learner results.
const $=id=>document.getElementById(id);
const scene=new THREE.Scene();
scene.background=new THREE.Color('#b3dcf6');
scene.fog=new THREE.Fog('#b3dcf6',43,105);
const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.12,130);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.17;renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
$('viewport').appendChild(renderer.domElement);
const hemi=new THREE.HemisphereLight('#cde9ff','#889b8b',1.5);scene.add(hemi);
const sun=new THREE.DirectionalLight('#fff1d6',3.0);
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
  const curb=mat('#e6c9ab'),tile=mat('#dbc9b6'),drain=mat('#57687b'),yellow=mat('#f9e7bd');
  for(const z of [-1.52,3.96]){box(34,.16,.18,curb,0,.19,z,outdoors);for(let x=-15;x<=15;x+=1.5)box(.025,.012,2.7,tile,x,.235,z<0?-3.1:5.5,outdoors)}
  for(const x of [-11,-3,7,13]){box(.65,.014,.36,drain,x,.102,3.70,outdoors);for(let i=-2;i<=2;i++)box(.035,.018,.29,yellow,x+i*.11,.115,3.70,outdoors)}
  for(const x of [-9,5,11])cyl(.34,.34,.013,drain,x,.095,1.65,outdoors,14);
  for(const x of [-10.7,-6.3,1.8,9.3]){box(.64,.55,.55,mat('#c57f64'),x,.44,-1.02,outdoors);ball(.34,materials.tree,x,.82,-1.02,outdoors,10,8);ball(.12,mat('#ff9c90'),x+.12,1,-1.02,outdoors,8,6)}
  for(let i=0;i<18;i++){const x=-41+i*4.8,h=4+(i*7%9);box(3.9,h,3,mat(['#b0c6db','#a5b6d1','#c4b5d1','#91b4bb'][i%4]),x,h/2,-28-(i%4)*3,outdoors)}
 for(let i=0;i<8;i++){
  const x=-12+i*3.4;const flower=mat(i%2?'#ffb35a':'#c692db');
  for(let j=0;j<4;j++){cyl(.015,.015,.31,materials.tree,x+.12*j,.36,-1.12,outdoors,5);ball(.12,flower,x+.12*j,.56,-1.12,outdoors,6,5);}
 }
}
street();
// CC0 Quaternius environment details, independent of the playable collision layout.
installStreetAsset(THREE,outdoors,'Sign_Stop.glb',[-15.2,.05,4.5],2.45,Math.PI/2);
installStreetAsset(THREE,outdoors,'Streetlight_Single.glb',[14.8,.05,-1.5],3.9,Math.PI);
installStreetAsset(THREE,outdoors,'TrafficLight.glb',[2.9,.05,4.4],3.1,Math.PI/2);
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
// Polished shared character rig: rounded geometry, expressive faces and layered hair.
const character=(options={})=>{
 const avatar=createCharacter(THREE,options);
 applyCharacterAsset(THREE,avatar,options,options._assetIndex??0);
 return avatar;
};
const avatarSettings={age:'teen',face:0,style:'side-part',hair:HAIR_COLORS[1],skin:SKIN_COLORS[2],outfit:0};
const avatarOpts=()=>({...avatarSettings,...OUTFITS[avatarSettings.outfit],_assetIndex:avatarSettings.outfit});
let player=character(avatarOpts());
outdoors.add(player.group);
player.group.position.set(-1.8,0,5.4);
const npcs=[
 {...character({skin:SKIN_COLORS[3],shirt:'#ffac70',pants:'#57567e',hair:HAIR_COLORS[0],_assetIndex:1,style:'messy',face:3,age:'adult'}),pos:[-6.0,0,-1.9]},
 {...character({skin:SKIN_COLORS[1],shirt:'#7cc4aa',pants:'#6380b7',hair:HAIR_COLORS[2],_assetIndex:2,style:'wavy-bob',face:1,age:'child'}),pos:[2.3,0,-1.8]},
 {...character({skin:SKIN_COLORS[0],shirt:'#c0a3d9',pants:'#5e6084',hair:HAIR_COLORS[5],_assetIndex:3,style:'bun',face:2,age:'senior'}),pos:[7.4,0,4.8]},
 {...character({skin:SKIN_COLORS[2],shirt:'#eda387',pants:'#566a94',hair:HAIR_COLORS[1],_assetIndex:4,style:'soft-short',face:0,age:'adult'}),pos:[-11,0,4.8]},
 {...character({skin:SKIN_COLORS[4],shirt:'#72a8d9',pants:'#687c8c',hair:HAIR_COLORS[3],_assetIndex:5,style:'side-part',face:2,age:'adult'}),pos:[-1,0,4.8]},
 {...character({skin:SKIN_COLORS[1],shirt:'#a88ccf',pants:'#657d73',hair:HAIR_COLORS[4],_assetIndex:6,style:'long',face:1,age:'teen'}),pos:[11,0,-1.8]},
 {...character({skin:SKIN_COLORS[0],shirt:'#e8bd76',pants:'#8d7970',hair:HAIR_COLORS[0],_assetIndex:7,style:'wavy-bob',face:0,age:'child'}),pos:[-9,0,-1.8]},
 {...character({skin:SKIN_COLORS[3],shirt:'#87b59c',pants:'#5c728e',hair:HAIR_COLORS[2],_assetIndex:8,style:'curly',face:3,age:'senior'}),pos:[13,0,4.8]}
];
for(const [i,n] of npcs.entries()){outdoors.add(n.group);n.group.position.set(...n.pos);n.patrol={x:n.pos[0],range:1.2+(i%3)*.7,speed:.28+(i%4)*.08}}
// Interior barista; scripted dialogue is intentionally deferred to Phase 3.
const barista=character({_assetIndex:5,skin:SKIN_COLORS[2],shirt:'#5eac95',pants:'#564a65',hair:HAIR_COLORS[0],style:'ponytail',face:1,age:'adult'});
cafe.add(barista.group);barista.group.position.set(3.4,0,-4.0);
const talkBadge=new THREE.Sprite(new THREE.SpriteMaterial({
 map:signTexture('MIA · TALK [E]','#fff8e9','#48227c',512,130),
 transparent:true,depthTest:false
}));
talkBadge.position.set(0,2.65,0);talkBadge.scale.set(2.15,.54,1);barista.group.add(talkBadge);


/* Live character editor and isolated 3D turntable preview. The game world is not rebuilt. */
const editor=$('avatarEditor');
const previewCanvas=$('avatarCanvas');
const editorScene=new THREE.Scene();editorScene.background=new THREE.Color('#e9e2f4');
const editorCam=new THREE.PerspectiveCamera(38,1,.1,30);editorCam.position.set(0,2.0,5.0);editorCam.lookAt(0,1.18,0);
const editorLight=new THREE.HemisphereLight('#ffffff','#c5b5ae',2.7);editorScene.add(editorLight);
const editorKey=new THREE.DirectionalLight('#fff1e3',2.3);editorKey.position.set(-3,7,6);editorScene.add(editorKey);
const editorRim=new THREE.DirectionalLight('#c3dfff',1.4);editorRim.position.set(4,3,-3);editorScene.add(editorRim);
const editorRenderer=new THREE.WebGLRenderer({canvas:previewCanvas,antialias:true,alpha:false,powerPreference:'low-power'});
editorRenderer.outputColorSpace=THREE.SRGBColorSpace;editorRenderer.toneMapping=THREE.ACESFilmicToneMapping;editorRenderer.toneMappingExposure=1.12;
editorRenderer.setSize(280,335,false);editorRenderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
let previewCharacter=null,editorYaw=.30,editorDragging=false,editorLastX=0,editorOpen=false;
function buildPreview(){
 if(previewCharacter){editorScene.remove(previewCharacter.group);previewCharacter.dispose()}
 previewCharacter=character(avatarOpts());
 editorScene.add(previewCharacter.group);previewCharacter.group.rotation.y=editorYaw;
 editorRenderer.render(editorScene,editorCam);
}
function replacePlayer(){
 const old=player,oldParent=old.group.parent,pos=old.group.position.clone(),rot=old.group.rotation.y;
 if(oldParent)oldParent.remove(old.group);
 player=character(avatarOpts());(oldParent||outdoors).add(player.group);
 player.group.position.copy(pos);player.group.rotation.y=rot;
 old.dispose();buildPreview();
 try{localStorage.setItem('lifeAbroadAvatar',JSON.stringify(avatarSettings))}catch(_){}
}
function fillSelect(id,values){
 const node=$(id);node.replaceChildren();
 for(const [value,label] of values){const opt=document.createElement('option');opt.value=value;opt.textContent=label;node.append(opt)}
}
fillSelect('avatarAge',[['child','Child'],['teen','Teen'],['adult','Adult'],['senior','Senior']]);
fillSelect('avatarHair',HAIR_STYLES.map((x,i)=>[x,['Short neat','Side part','Wavy bob','Ponytail','Bun','Curly','Messy short','Long layers'][i]]));
fillSelect('avatarHairColor',HAIR_COLORS.map((x,i)=>[x,['Jet black','Dark brown','Chestnut','Caramel','Ash blonde','Silver'][i]]));
fillSelect('avatarFace',FACE_STYLES.map((x,i)=>[String(i),['Friendly','Bright','Gentle','Confident'][i]]));
fillSelect('avatarSkin',SKIN_COLORS.map((x,i)=>[x,['Light','Warm','Golden','Tan','Deep'][i]]));
fillSelect('avatarOutfit',OUTFITS.map((x,i)=>[String(i),x.name]));
try{
 const data=JSON.parse(localStorage.getItem('lifeAbroadAvatar')||'null');
 if(data&&typeof data==='object'){
  for(const key of Object.keys(avatarSettings))if(data[key]!==undefined)avatarSettings[key]=data[key];
  if(!HAIR_STYLES.includes(avatarSettings.style))avatarSettings.style='side-part';
  if(!HAIR_COLORS.includes(avatarSettings.hair))avatarSettings.hair=HAIR_COLORS[1];
  if(!SKIN_COLORS.includes(avatarSettings.skin))avatarSettings.skin=SKIN_COLORS[2];
  avatarSettings.face=Math.max(0,Math.min(3,Number(avatarSettings.face)||0));
  avatarSettings.outfit=Math.max(0,Math.min(3,Number(avatarSettings.outfit)||0));
  replacePlayer();
 }
}catch(_){}
const avatarControls={avatarAge:'age',avatarHair:'style',avatarHairColor:'hair',avatarFace:'face',avatarSkin:'skin',avatarOutfit:'outfit'};
for(const [id,key] of Object.entries(avatarControls)){
 const node=$(id);node.value=String(avatarSettings[key]);
 node.addEventListener('change',()=>{
  avatarSettings[key]=(key==='face'||key==='outfit')?Number(node.value):node.value;
  replacePlayer();
 });
}
function setEditor(open){
 editorOpen=open;editor.hidden=!open;$('avatarOpen').setAttribute('aria-expanded',String(open));
 if(open)buildPreview();
}
$('avatarOpen').onclick=()=>setEditor(!editorOpen);
$('avatarClose').onclick=()=>setEditor(false);
$('avatarRotateLeft').onclick=()=>{editorYaw+=Math.PI/4;if(previewCharacter)previewCharacter.group.rotation.y=editorYaw};
$('avatarRotateRight').onclick=()=>{editorYaw-=Math.PI/4;if(previewCharacter)previewCharacter.group.rotation.y=editorYaw};
previewCanvas.addEventListener('pointerdown',e=>{editorDragging=true;editorLastX=e.clientX;previewCanvas.setPointerCapture(e.pointerId)});
previewCanvas.addEventListener('pointermove',e=>{if(editorDragging){editorYaw+=(e.clientX-editorLastX)*.012;editorLastX=e.clientX;if(previewCharacter)previewCharacter.group.rotation.y=editorYaw}});
previewCanvas.addEventListener('pointerup',()=>editorDragging=false);
previewCanvas.addEventListener('pointercancel',()=>editorDragging=false);
buildPreview();
let inside=false;
let npcTalking=false;
const dialogue=setupCafeDialogue({onTalking:value=>{npcTalking=value},onClose:()=>{keys.clear()}});

const keys=new Set();
const joystick={x:0,y:0,active:false};
let yaw=-.18,pitch=.46,dist=8.8;
let timeMode='day',qualityMode='auto',nearAction='';
let photoMode=false,photoPreset=0;
const photoViews=[{yaw:0,pitch:.30,dist:4.2},{yaw:-.18,pitch:.46,dist:9.8},{yaw:.64,pitch:.48,dist:8.6},{yaw:-.28,pitch:.40,dist:13}];
const debugVisual={shadows:true,post:true,wireframe:false};
function updatePhotoUI(){document.body.classList.toggle('photo-mode',photoMode);$('photoPanel').hidden=!photoMode;if(photoMode){const v=photoViews[photoPreset];yaw=v.yaw;pitch=v.pitch;dist=v.dist;$('photoView').value=String(photoPreset)}}
function togglePhoto(){photoMode=!photoMode;updatePhotoUI()}
$('photoToggle').onclick=togglePhoto;$('photoExit').onclick=togglePhoto;
$('photoView').onchange=e=>{photoPreset=Number(e.target.value);updatePhotoUI()};
$('debugShadow').onchange=e=>{debugVisual.shadows=e.target.checked;setQuality(qualityMode)};
$('debugWire').onchange=e=>{debugVisual.wireframe=e.target.checked;scene.traverse(o=>{if(o.isMesh){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m&&'wireframe' in m)m.wireframe=debugVisual.wireframe})}})};
$('debugPost').onchange=e=>{debugVisual.post=e.target.checked;renderer.toneMapping=debugVisual.post?THREE.ACESFilmicToneMapping:THREE.NoToneMapping};
function showNotice(message){
 const node=$('notice');node.textContent=message;node.style.display='block';
 clearTimeout(showNotice.timer);showNotice.timer=setTimeout(()=>node.style.display='none',2500);
}
function setInside(value){
 inside=value;outdoors.visible=!value;interior.visible=value;
 if(value){cafe.add(player.group);player.group.position.set(0,0,3.5);player.group.rotation.set(0,0,0);
 $('location').textContent='☕ London · Bluebird Café';
 $('mission').querySelector('h2').textContent='☕ Inside the café';
 $('mission').querySelector('p').textContent='Đi tới barista Mia ở quầy và nhấn E để luyện gọi đồ uống bằng tiếng Anh. Có micro hoặc nhập chữ.';
 showNotice('Welcome to the Bluebird Café!');
 }else{outdoors.add(player.group);player.group.position.set(-1.8,0,-2.2);
 $('location').textContent='📍 London · Neighbourhood Street';
 $('mission').querySelector('h2').textContent='☕ Visit the café';
 $('mission').querySelector('p').textContent='Đi bộ đến quán cà phê có mái hiên màu cam, nhấn E để vào. Đây là cảnh đồ họa thử nghiệm, chưa có chấm điểm hay hội thoại AI.';
 showNotice('Back to the London street');
 }
 nearAction='';$('interact').hidden=true;
}
function interact(){if(dialogue.isOpen())return;
 if(nearAction==='talk'){dialogue.start();keys.clear();return}
 if(nearAction==='enter')setInside(true);else if(nearAction==='exit')setInside(false);
 else showNotice(inside?'Đến gần Mia ở quầy để trò chuyện.':'Tiến lại gần cửa quán cà phê để tương tác.');}
window.addEventListener('keydown',e=>{
 if(e.code==='KeyP'&&!e.repeat&&!dialogue.isOpen()&&!editorOpen){togglePhoto();return}
  if(dialogue.isOpen()||editorOpen){if(e.code==='Escape'&&dialogue.isOpen())dialogue.close();return}
 if(e.target?.closest?.('input,textarea,select,button'))return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','KeyE'].includes(e.code))e.preventDefault();
 keys.add(e.code);if(e.code==='KeyE'&&!e.repeat)interact();
});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());
$('interact').onclick=interact;$('actionMobile').onclick=interact;
renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){orbit.active=true;orbit.x=e.clientX;orbit.y=e.clientY}});
const orbit={active:false,x:0,y:0};
window.addEventListener('pointerup',()=>orbit.active=false);
renderer.domElement.addEventListener('pointermove',e=>{
 if(!photoMode&&(e.buttons||orbit.active)){const dx=e.movementX||e.clientX-orbit.x,dy=e.movementY||e.clientY-orbit.y;
 yaw-=dx*.004;pitch=THREE.MathUtils.clamp(pitch+dy*.0035,-.05,.95);orbit.x=e.clientX;orbit.y=e.clientY;
 }
});
renderer.domElement.addEventListener('wheel',e=>{dist=THREE.MathUtils.clamp(dist+e.deltaY*.007,3.5,14)}, {passive:true});
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
 hemi.intensity=night?.65:dusk?1.15:1.5;
 sun.intensity=night?.18:dusk?1.9:3.0;
 sun.color.set(night?'#8ea7ef':dusk?'#ffb98c':'#fff1d6');
 sun.position.set(dusk?14:-12,night?4:dusk?8:22,15);
 for(const obj of lamplights){if(obj.isLight)obj.intensity=night?1.8:dusk?.7:0;else obj.emissiveIntensity=night?1.45:dusk?.45:0}
 for(const material of windowGlow)material.emissiveIntensity=night?1.4:dusk?.55:0;
 renderer.toneMappingExposure=night?.9:dusk?1.02:1.12;
}
$('timeChoice').onchange=e=>updateLighting(e.target.value);
function setQuality(q){
 qualityMode=q==='auto'?(matchMedia('(max-width:700px)').matches?'low':'medium'):q;
 renderer.setPixelRatio(Math.min(devicePixelRatio,qualityMode==='low'?1:qualityMode==='medium'?1.5:2));
 renderer.shadowMap.enabled=debugVisual.shadows&&qualityMode!=='low';sun.castShadow=renderer.shadowMap.enabled;
 sun.shadow.mapSize.set(qualityMode==='high'?2048:1024,qualityMode==='high'?2048:1024);
 renderer.shadowMap.needsUpdate=true;resize();
}
$('quality').onchange=e=>setQuality(e.target.value);
$('resetCamera').onclick=()=>{yaw=-.18;pitch=.46;dist=8.8};
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
 const magnitude=dialogue.isOpen()||editorOpen||photoMode?0:Math.min(1,Math.hypot(f,r));desired.set(0,0,0);
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
 player.anim(t,velocity/3,false);
 for(let i=0;i<npcs.length;i++){const n=npcs[i],p=n.patrol;
   if(!inside&&!photoMode){n.group.position.x=p.x+Math.sin(t*p.speed+i)*p.range;n.group.rotation.y=Math.cos(t*p.speed+i)>0?Math.PI/2:-Math.PI/2}
   n.anim(t+i*2,inside||photoMode?0:p.speed*2,i===0&&Math.sin(t*.9)>.1);
  }
 barista.anim(t+1,0,inside&&(npcTalking||dialogue.isOpen()&&Math.sin(t*1.1)>.05));
 if(dialogue.isOpen()){
  const dx=player.group.position.x-barista.group.position.x,dz=player.group.position.z-barista.group.position.z;
  barista.group.rotation.y=Math.atan2(dx,dz);
 }
 if(editorOpen&&previewCharacter){
  previewCharacter.anim(t,0,$('avatarExpression').checked);
  editorRenderer.render(editorScene,editorCam);
 }
 if(inside){
  const baristaDistance=player.group.position.distanceTo(barista.group.position);
  nearAction=baristaDistance<2.95?'talk':player.group.position.z>3.5?'exit':'';
 }else nearAction=Math.abs(player.group.position.x+1.7)<1.5&&Math.abs(player.group.position.z+2.9)<2.5?'enter':'';
 $('interact').hidden=!nearAction||dialogue.isOpen();
 if(nearAction)$('interact').textContent=nearAction==='enter'?'E · Enter Café':nearAction==='talk'?'E · Talk to Mia':'E · Exit to Street';
 target.copy(player.group.position).add(new THREE.Vector3(0,photoMode&&photoPreset===0?1.55:1.18,0));
 const cameraPos=new THREE.Vector3(Math.sin(yaw)*dist*Math.cos(pitch),dist*Math.sin(pitch)+1.2,Math.cos(yaw)*dist*Math.cos(pitch));
 cameraPos.add(target);
 if(dialogue.isOpen()&&inside){
  target.set((player.group.position.x+barista.group.position.x)/2,1.45,(player.group.position.z+barista.group.position.z)/2);
  cameraPos.set(target.x+2.6,2.65,target.z+3.25);
 }
 if(inside){cameraPos.x=THREE.MathUtils.clamp(cameraPos.x,-6.65,6.65);cameraPos.z=THREE.MathUtils.clamp(cameraPos.z,-6.8,5.6)}
 camera.position.lerp(cameraPos,1-Math.exp(-7*dt));camera.lookAt(target);
 sun.target.position.copy(player.group.position);sun.position.copy(player.group.position).add(new THREE.Vector3(timeMode==='dusk'?14:-12,timeMode==='night'?4:22,15));
 renderer.render(scene,camera);
 fpsFrames++;fpsTime+=dt;if(fpsTime>1){$('fps').textContent=Math.round(fpsFrames/fpsTime)+' FPS';fpsFrames=0;fpsTime=0}
}
setQuality('auto');updateLighting('day');
$('loading').hidden=true;animate();
