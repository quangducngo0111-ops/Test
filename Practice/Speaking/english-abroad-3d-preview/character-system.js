// Procedural polished characters for Life Abroad 3D.
// The meshes are intentionally self-contained and lightweight: no external avatars or model downloads.
export const HAIR_STYLES=['soft-short','side-part','wavy-bob','ponytail','bun','curly','messy','long','buzz','taper','fringe','slick-back','braids','shoulder-length'];
export const HAIR_COLORS=['#211f27','#342b35','#594039','#885b43','#b17c4e','#d5b67f','#b85c40','#7a7b87'];
export const SKIN_COLORS=['#f6d2b4','#e9b58f','#d99d79','#b87859','#84543f'];
export const OUTFITS=[
 {name:'Smartcom Purple',shirt:'#8866c7',pants:'#57749b',shoes:'#494c64'},
 {name:'Sky Blue',shirt:'#74b7d8',pants:'#566a94',shoes:'#3c485e'},
 {name:'Sage Green',shirt:'#64aa92',pants:'#c4a47e',shoes:'#655046'},
 {name:'Coral',shirt:'#ef9a89',pants:'#7185aa',shoes:'#5e5867'},
 {name:'Cream jacket',shirt:'#e5c9a7',pants:'#55738c',shoes:'#554a51'},
 {name:'Denim blue',shirt:'#467aab',pants:'#384c70',shoes:'#eee0cc'},
 {name:'Rose pink',shirt:'#d99cbb',pants:'#8976a1',shoes:'#67566a'},
 {name:'Forest green',shirt:'#427f70',pants:'#d0b291',shoes:'#504950'}
];
export const FACE_STYLES=['friendly','bright','gentle','confident'];
function material(T,color,roughness=.83){return new T.MeshStandardMaterial({color,roughness,metalness:.01});}
function smoothSphere(T,parent,mat,x,y,z,sx,sy,sz,segments=18){
 const m=new T.Mesh(new T.SphereGeometry(1,segments,12),mat);
 m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function coneLock(T,parent,mat,from,to,r=.12){
 const a=new T.Vector3(...from),b=new T.Vector3(...to),d=b.clone().sub(a),len=d.length();
 const m=new T.Mesh(new T.CylinderGeometry(r*.55,r,len,9,1),mat);
 m.position.copy(a.add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());
 m.castShadow=true;parent.add(m);return m;
}
function skinFaceTexture(T,style=0){
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=768;
 const c=canvas.getContext('2d');const texture=new T.CanvasTexture(canvas);
 texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
 let lastExpression='',lastBlink=false;
 function draw(expression='smile',blink=false){
  if(expression===lastExpression&&blink===lastBlink)return;
  lastExpression=expression;lastBlink=blink;
  c.clearRect(0,0,768,768);
  const v=((Number(style)||0)%4+4)%4;
  // Face palette, balanced proportions and translucent blush. Art is on a curved face surface.
  for(const x of [192,576]){
   const bloom=c.createRadialGradient(x,457,8,x,457,105);
   bloom.addColorStop(0,'rgba(220,105,124,.29)');
   bloom.addColorStop(.65,'rgba(236,120,134,.10)');
   bloom.addColorStop(1,'rgba(234,128,139,0)');
   c.fillStyle=bloom;c.beginPath();c.arc(x,457,106,0,Math.PI*2);c.fill();
  }
  const eyeY=326;
  const eyeWidth=[50,55,46,51][v],eyeHeight=[45,52,42,43][v];
  for(const side of [-1,1]){
   const x=384+side*[151,155,149,152][v];
   // Delicate, slightly arched brows rather than dark thick strokes.
   c.lineCap='round';c.strokeStyle='rgba(73,48,53,.75)';
   c.lineWidth=11;c.beginPath();
   c.moveTo(x-49,235+(v===2?5:0));
   c.quadraticCurveTo(x,207+(v===3?18:0),x+47,234+(v===3?9:0));c.stroke();
   if(blink){
    c.strokeStyle='#59444a';c.lineWidth=10;c.beginPath();
    c.moveTo(x-eyeWidth,eyeY+7);
    c.quadraticCurveTo(x,eyeY+25,x+eyeWidth,eyeY+7);c.stroke();
    continue;
   }
   // Soft almond eye contour, no cartoon dots or hard white circles.
   c.fillStyle='#614a4c';c.beginPath();
   c.moveTo(x-eyeWidth-7,eyeY+1);
   c.bezierCurveTo(x-eyeWidth*.6,eyeY-eyeHeight-12,x+eyeWidth*.5,eyeY-eyeHeight-13,x+eyeWidth+7,eyeY-1);
   c.bezierCurveTo(x+eyeWidth*.7,eyeY+eyeHeight*.62,x-eyeWidth*.65,eyeY+eyeHeight*.62,x-eyeWidth-7,eyeY+1);
   c.fill();
   c.fillStyle='#fff9f4';c.beginPath();
   c.moveTo(x-eyeWidth+1,eyeY);
   c.bezierCurveTo(x-eyeWidth*.55,eyeY-eyeHeight-3,x+eyeWidth*.55,eyeY-eyeHeight-3,x+eyeWidth-1,eyeY-1);
   c.bezierCurveTo(x+eyeWidth*.57,eyeY+eyeHeight*.48,x-eyeWidth*.55,eyeY+eyeHeight*.48,x-eyeWidth+1,eyeY);
   c.fill();
   const irisX=x+side*(v===1?4:2);
   const iris=c.createRadialGradient(irisX,eyeY+4,4,irisX,eyeY+4,32);
   iris.addColorStop(0,'#302a39');iris.addColorStop(.55,v===3?'#577980':'#654858');
   iris.addColorStop(1,'#a27871');
   c.fillStyle=iris;c.beginPath();c.ellipse(irisX,eyeY+3,28,32,0,0,Math.PI*2);c.fill();
   c.fillStyle='#292532';c.beginPath();c.ellipse(irisX,eyeY+3,15,23,0,0,Math.PI*2);c.fill();
   c.fillStyle='#fff';c.beginPath();c.arc(irisX-10,eyeY-10,10,0,Math.PI*2);c.fill();
   c.globalAlpha=.7;c.beginPath();c.arc(irisX+11,eyeY+13,4.5,0,Math.PI*2);c.fill();c.globalAlpha=1;
   c.lineWidth=7;c.strokeStyle='#57444a';c.beginPath();
   c.moveTo(x-eyeWidth-4,eyeY-5);
   c.quadraticCurveTo(x,eyeY-eyeHeight-20,x+eyeWidth+4,eyeY-5);c.stroke();
   if(v===1||v===3){for(let i=0;i<2;i++){
    const lx=x+side*(eyeWidth+1+i*10);c.lineWidth=5;c.beginPath();
    c.moveTo(lx,eyeY-11-i*4);c.lineTo(lx+side*8,eyeY-21-i*3);c.stroke();
   }}
  }
  // Light nose bridge and small sculpted nostril shadow.
  c.lineWidth=4;c.strokeStyle='rgba(158,89,82,.28)';c.beginPath();
  c.moveTo(379,413);c.quadraticCurveTo(371,439,390,445);c.stroke();
  c.strokeStyle='rgba(126,62,72,.32)';c.beginPath();c.moveTo(376,460);
  c.quadraticCurveTo(384,464,392,460);c.stroke();
  // Mouth is expressive but small and polished.
  c.lineCap='round';
  if(expression==='speaking'){
   c.fillStyle='#87485b';c.beginPath();c.ellipse(384,546,30,35,0,0,Math.PI*2);c.fill();
   c.fillStyle='#eaa4a7';c.beginPath();c.ellipse(384,563,20,9,0,0,Math.PI*2);c.fill();
   c.strokeStyle='#ba6d78';c.lineWidth=7;c.beginPath();c.ellipse(384,546,29,34,0,Math.PI,0);c.stroke();
  }else if(expression==='neutral'){
   c.strokeStyle='#a6636d';c.lineWidth=8;c.beginPath();
   c.moveTo(346,542);c.quadraticCurveTo(384,551,422,542);c.stroke();
  }else{
   c.strokeStyle='#a95b67';c.lineWidth=9;c.beginPath();
   c.moveTo(325,522);c.bezierCurveTo(352,566,413,566,442,522);c.stroke();
   c.fillStyle='#fff3e9';c.beginPath();c.moveTo(346,537);
   c.quadraticCurveTo(384,558,420,536);c.quadraticCurveTo(386,549,346,537);c.fill();
   c.fillStyle='rgba(186,97,107,.55)';c.beginPath();
   c.ellipse(384,562,24,5,0,0,Math.PI*2);c.fill();
  }
  texture.needsUpdate=true;
 }
 draw();
 return {texture,draw,dispose:()=>texture.dispose()};
}
function curvedFaceGeometry(T){
 // Curved high-resolution patch follows the front hemisphere so features don't look pasted on.
 const g=new T.PlaneGeometry(.745,.745,24,18);
 const p=g.attributes.position;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i);
  const nx=x/.435,ny=y/.48;
  const surface=.428*Math.sqrt(Math.max(.10,1-.55*nx*nx-.46*ny*ny));
  p.setZ(i,surface+.014);
 }
 p.needsUpdate=true;g.computeVertexNormals();return g;
}
function createHair(T,head,style,color){
 const shell=material(T,color,.91),shine=material(T,new T.Color(color).lerp(new T.Color('#fff0dc'),.10));
 const g=new T.Group();head.add(g);
 const cap=(x,y,z,w,h,d,m=shell)=>smoothSphere(T,g,m,x,y,z,w,h,d,32);
 const lock=(a,b,r=.10,m=shell)=>coneLock(T,g,m,a,b,r);
 const short=['soft-short','side-part','messy','buzz','taper','fringe','slick-back'].includes(style);
 cap(0,.21,-.1,.467,short?.30:.36,.43);
 cap(0,.39,-.12,.415,.11,.35,shine);
 const bangs=(long=false,side=false)=>[-.28,-.11,.07,.24].forEach((x,i)=>lock([x,.39,.16],[x+(side?.09:.02),long?.14:.27,.33],long?.105:.085,i===1?shine:shell));
 if(style==='buzz')return g;
 if(style==='slick-back'){for(let i=0;i<5;i++){let x=-.29+i*.145;lock([x,.38,.24],[x,.48,-.18],.09,i===2?shine:shell);}}
 else if(style==='fringe'){bangs(true);for(const side of [-1,1])cap(side*.39,0,-.09,.12,.27,.27);}
 else if(style==='taper'||style==='side-part'){bangs(false,true);for(const side of [-1,1])cap(side*.38,.015,-.085,.115,.24,.26);}
 else if(style==='soft-short'||style==='messy'){
  bangs();for(const side of [-1,1])cap(side*.39,.015,-.07,.12,.25,.26);
  if(style==='messy')for(let i=0;i<4;i++)lock([-.27+i*.18,.48,-.04],[-.23+i*.18,.32,.22],.085,i===1?shine:shell);
 }else if(['wavy-bob','long','shoulder-length'].includes(style)){
  bangs(false,true);const len=style==='long'?.58:style==='shoulder-length'?.45:.30;
  cap(0,-.10,-.22,.46,.36+len*.32,.32);
  for(const side of [-1,1]){const hair=cap(side*.40,-.13-len*.3,-.06,.15,.26+len*.4,.245);hair.rotation.z=-side*.07;lock([side*.34,.17,.18],[side*.40,-.15-len*.35,.21],.08,shine);}
 }else if(style==='ponytail'){bangs(false,true);cap(0,.02,-.34,.43,.35,.27);cap(0,-.16,-.54,.20,.27,.21);lock([0,-.22,-.56],[0,-.67,-.54],.14);}
 else if(style==='bun'){bangs();cap(0,.18,-.39,.46,.3,.27);cap(0,.32,-.58,.25,.25,.23);}
 else if(style==='braids'){bangs(false,true);cap(0,.02,-.32,.43,.34,.28);for(const side of [-1,1])for(let i=0;i<4;i++)lock([side*.35,-.06-i*.16,-.17],[side*.36,-.22-i*.16,-.17],.13-i*.008,i%2?shine:shell);}
 else if(style==='curly'){cap(0,.27,-.08,.49,.34,.46);for(let i=0;i<8;i++){const a=i*2.4;lock([Math.sin(a)*.32,.51,Math.cos(a)*.23-.08],[Math.sin(a)*.38,.36,Math.cos(a)*.3],.08,i%3?shell:shine);}for(const side of [-1,1])cap(side*.39,-.08,-.11,.12,.25,.25);}
 return g;
}
export function createCharacter(T,opts={}){
 const o={age:'adult',face:0,glasses:'none',style:'soft-short',hair:'#594039',skin:'#e9b58f',shirt:'#8866c7',pants:'#57749b',shoes:'#494c64',...opts};
 const group=new T.Group(),rig=new T.Group();group.add(rig);
 const scale=o.age==='child'?.77:o.age==='senior'?.94:o.age==='teen'?.93:1;
 rig.scale.setScalar(scale);
 const skin=material(T,o.skin,.89),shirt=material(T,o.shirt),shade=material(T,new T.Color(o.shirt).multiplyScalar(.85)),pant=material(T,o.pants),shoes=material(T,o.shoes);
 const shirtLight=material(T,new T.Color(o.shirt).lerp(new T.Color('#ffffff'),.13));
 const torso=new T.Group();torso.position.set(0,1.48,0);rig.add(torso);
 // Soft anatomical silhouette: shoulders, chest, waist, hip; no rectangular block torsos.
 smoothSphere(T,torso,shirt,0,.08,0,.405,.51,.255,24);
 smoothSphere(T,torso,shirtLight,0,.33,.045,.365,.20,.232,24);
 smoothSphere(T,rig,pant,0,.94,0,.41,.25,.27,18);
 smoothSphere(T,torso,skin,0,.58,0,.115,.15,.12,14);
 // Thin shirt collar and sleeve hems add definition without heavy models.
 const collar=new T.Mesh(new T.TorusGeometry(.17,.044,8,18,Math.PI*2),shirtLight);
 collar.position.set(0,.57,0);collar.rotation.x=Math.PI/2;torso.add(collar);
 const head=new T.Group();head.position.set(0,.94,.025);torso.add(head);
 const headScale=o.age==='child'?1.12:o.age==='teen'?1.06:1;
 head.scale.setScalar(headScale);
 smoothSphere(T,head,skin,0,0,-.025,.435,.48,.415,24);
 // Face Canvas occupies the frontal face, positioned just ahead of cheeks.
 const face=skinFaceTexture(T,typeof o.face==='number'?o.face:FACE_STYLES.indexOf(o.face));
 const facePanel=new T.Mesh(curvedFaceGeometry(T),new T.MeshBasicMaterial({map:face.texture,transparent:true,depthWrite:false,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1}));
 facePanel.position.set(0,-.03,0);head.add(facePanel);
 // Nose ridge, ear lobes and round cheeks (subtle geometry, not dot eyes).
 for(const side of [-1,1]){
  smoothSphere(T,head,skin,side*.413,-.03,-.015,.105,.15,.105,13);
  /* blush painted onto canvas face */;
 }
 /* nose painted onto canvas face */;
 createHair(T,head,o.style,o.hair);
 if(o.glasses&&o.glasses!=='none'){
  const frame=material(T,o.glasses==='gold'?'#c6a06d':o.glasses==='clear'?'#dedde4':'#302d39',.42);
  const round=o.glasses==='round'||o.glasses==='gold';
  for(const side of [-1,1]){
   const lens=new T.Mesh(new T.TorusGeometry(round?.12:.14,.013,8,32),frame);
   lens.position.set(side*.18,.005,.44);lens.scale.y=round?1:.78;head.add(lens);
   const arm=new T.Mesh(new T.BoxGeometry(.15,.015,.02),frame);
   arm.position.set(side*.36,.025,.34);arm.rotation.y=side*.3;head.add(arm);
  }
  const bridge=new T.Mesh(new T.BoxGeometry(.10,.018,.02),frame);
  bridge.position.set(0,.025,.445);head.add(bridge);
 }
 const joints={};let leftFoot,rightFoot;
 for(const side of [-1,1]){
  const shoulder=new T.Group();shoulder.position.set(side*.42,.34,0);torso.add(shoulder);
  const upper=smoothSphere(T,shoulder,shirt,side*.035,-.18,0,.145,.29,.15,20);
  smoothSphere(T,shoulder,shade,side*.045,-.41,0,.145,.065,.15,18);
  const elbow=new T.Group();elbow.position.set(side*.065,-.44,0);shoulder.add(elbow);
  smoothSphere(T,elbow,skin,0,-.15,0,.125,.29,.13,15);
  smoothSphere(T,elbow,skin,0,-.39,.015,.125,.165,.095,18);
   smoothSphere(T,elbow,skin,-side*.115,-.345,.085,.058,.095,.065,14);
  joints[side<0?'shoulderL':'shoulderR']=shoulder;
  joints[side<0?'elbowL':'elbowR']=elbow;
  const hip=new T.Group();hip.position.set(side*.20,.88,0);rig.add(hip);
  smoothSphere(T,hip,pant,0,-.23,0,.185,.36,.20,18);
  const knee=new T.Group();knee.position.y=-.48;hip.add(knee);
  smoothSphere(T,knee,pant,0,-.19,0,.15,.28,.16,17);
  smoothSphere(T,knee,shoes,0,-.44,.17,.175,.145,.295,20);
   smoothSphere(T,knee,material(T,'#f3e9dc'),0,-.535,.17,.178,.038,.29,18);
  joints[side<0?'hipL':'hipR']=hip;
  joints[side<0?'kneeL':'kneeR']=knee;
 }
 if(o.age==='senior'){torso.rotation.x=.07;}
 const shadow=new T.Mesh(new T.CircleGeometry(.55,22),new T.MeshBasicMaterial({color:'#1b3147',transparent:true,opacity:.18,depthWrite:false}));
 shadow.rotation.x=-Math.PI/2;shadow.position.y=.025;group.add(shadow);
 let blinkUntil=0,blinkAt=2.2+Math.random()*2.5,wasBlink=false,wasTalk=false,expression='smile';
 const anim=(t,speed=0,talking=false)=>{
  const pace=Math.min(1,Math.max(0,speed/3));
  const walk=t*(speed>4?11:8);
  const stride=Math.sin(walk),sway=Math.sin(walk)*pace;
  torso.position.y=1.48+Math.abs(stride)*.036*pace+Math.sin(t*1.8)*.01;
  torso.rotation.z=Math.sin(t*.9)*.014+(speed>.2?-.028*stride:0);
  torso.rotation.x=(o.age==='senior'?.065:0)+speed*.007;
  head.rotation.y=Math.sin(t*.66)*.055;
  head.rotation.z=Math.sin(t*1.3)*.015;
  joints.hipL.rotation.x=stride*.53*pace;
  joints.hipR.rotation.x=-stride*.53*pace;
  joints.kneeL.rotation.x=Math.max(0,-stride)*.40*pace;
  joints.kneeR.rotation.x=Math.max(0,stride)*.40*pace;
  joints.shoulderL.rotation.x=-stride*.40*pace+(talking?.12:0);
  joints.shoulderR.rotation.x=stride*.40*pace+(talking?-.23:0);
  joints.shoulderL.rotation.z=-.055-Math.sin(t*1.2)*.012;
  joints.shoulderR.rotation.z=.055+Math.sin(t*1.2)*.012;
  joints.elbowL.rotation.x=talking?Math.sin(t*3.7)*.24:0;
  joints.elbowR.rotation.x=talking?Math.cos(t*3.8)*.27:0;
  if(t>blinkAt){blinkUntil=t+.14;blinkAt=t+2.5+Math.random()*3.2}
  const blinking=t<blinkUntil,talk=talking&&Math.sin(t*9)>.05;
  if(blinking!==wasBlink||talk!==wasTalk){face.draw(talk?'speaking':expression,blinking);wasBlink=blinking;wasTalk=talk}
 };
 const setExpression=x=>{expression=x;face.draw(x,false)};
 const dispose=()=>{face.dispose();group.traverse(node=>{if(node.isMesh){node.geometry?.dispose();if(node.material?.map&&node.material.map!==face.texture)node.material.map.dispose();if(Array.isArray(node.material))node.material.forEach(m=>m.dispose());else node.material?.dispose()}})};
 return {group,rig,anim,head,face,options:o,setExpression,dispose};
}
