// Procedural polished characters for Life Abroad 3D.
// The meshes are intentionally self-contained and lightweight: no external avatars or model downloads.
export const HAIR_STYLES=['soft-short','side-part','wavy-bob','ponytail','bun','curly','messy','long'];
export const HAIR_COLORS=['#342b35','#594039','#885b43','#b17c4e','#c8b4a6','#7a7b87'];
export const SKIN_COLORS=['#f6d2b4','#e9b58f','#d99d79','#b87859','#84543f'];
export const OUTFITS=[
 {name:'Smartcom Purple',shirt:'#8866c7',pants:'#57749b',shoes:'#494c64'},
 {name:'Sky Blue',shirt:'#74b7d8',pants:'#566a94',shoes:'#3c485e'},
 {name:'Sage Green',shirt:'#64aa92',pants:'#c4a47e',shoes:'#655046'},
 {name:'Coral',shirt:'#ef9a89',pants:'#7185aa',shoes:'#5e5867'}
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
function skinFaceTexture(T,style=0,skin='#e9b58f'){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
 const t=canvas.getContext('2d');const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 const expressions=['smile','neutral','speaking'];let current='';let lastBlink=false;
 function draw(expression='smile',blink=false){
  if(current===expression&&lastBlink===blink)return;
  current=expression;lastBlink=blink;t.clearRect(0,0,512,512);
  const c=style%4;
  // Soft, transparent cheek glow instead of thick, dotted face features.
  for(const x of [130,382]){
   const grad=t.createRadialGradient(x,304,6,x,304,70);
   grad.addColorStop(0,'rgba(219,95,108,.25)');grad.addColorStop(1,'rgba(219,95,108,0)');
   t.fillStyle=grad;t.beginPath();t.arc(x,304,72,0,Math.PI*2);t.fill();
  }
  const eyeY=232,eyeGap=c===1?102:c===2?99:105;
  for(const side of [-1,1]){
   const x=256+side*eyeGap;
   // Smooth brow arches, changing character with face style.
   t.beginPath();t.lineCap='round';t.lineWidth=10;t.strokeStyle='rgba(70,46,49,.86)';
   t.moveTo(x-34,169+(c===2?5:0));
   t.quadraticCurveTo(x,145+(c===3?12:0),x+33,168+(c===3?7:0));t.stroke();
   if(blink){
    t.lineWidth=10;t.strokeStyle='#493d49';t.beginPath();t.moveTo(x-27,eyeY+8);
    t.quadraticCurveTo(x,eyeY+19,x+27,eyeY+8);t.stroke();
   }else{
    t.fillStyle='#fffaf4';t.beginPath();t.ellipse(x,eyeY,29,c===1?36:32,0,0,Math.PI*2);t.fill();
    t.fillStyle=c===3?'#446a76':'#604a5d';t.beginPath();t.ellipse(x+side*3,eyeY+4,15,23,0,0,Math.PI*2);t.fill();
    t.fillStyle='#2a2939';t.beginPath();t.ellipse(x+side*3,eyeY+5,9,16,0,0,Math.PI*2);t.fill();
    t.fillStyle='#fff';t.beginPath();t.arc(x-3,eyeY-5,6,0,Math.PI*2);t.fill();
    t.beginPath();t.arc(x+8,eyeY+11,2.3,0,Math.PI*2);t.fill();
    t.strokeStyle='#4c3e4c';t.lineWidth=7;t.beginPath();t.moveTo(x-28,eyeY-12);
    t.quadraticCurveTo(x,eyeY-38,x+28,eyeY-13);t.stroke();
   }
  }
  t.strokeStyle='rgba(177,112,97,.55)';t.lineWidth=4;t.beginPath();t.moveTo(248,282);
  t.quadraticCurveTo(253,293,262,284);t.stroke();
  t.lineCap='round';t.strokeStyle='#a75566';t.lineWidth=9;
  if(expression==='speaking'){
   t.fillStyle='#8d4559';t.beginPath();t.ellipse(256,359,24,32,0,0,Math.PI*2);t.fill();
   t.fillStyle='#e9a5a0';t.beginPath();t.ellipse(256,376,14,8,0,0,Math.PI*2);t.fill();
  }else if(expression==='neutral'){
   t.beginPath();t.moveTo(223,361);t.quadraticCurveTo(256,372,289,361);t.stroke();
  }else{
   t.beginPath();t.moveTo(209,345);t.quadraticCurveTo(256,405,303,345);t.stroke();
   t.fillStyle='rgba(255,244,229,.9)';t.beginPath();t.moveTo(224,353);t.quadraticCurveTo(256,380,288,353);t.quadraticCurveTo(256,365,224,353);t.fill();
  }
  texture.needsUpdate=true;
 }
 draw('smile',false);
 return {texture,draw,dispose(){texture.dispose()}};
}
function createHair(T,head,style,color,faceTop=.43){
 const hair=material(T,color,.92),light=material(T,new T.Color(color).lerp(new T.Color('#fff1d2'),.13));
 const back=new T.Group();head.add(back);
 const id=HAIR_STYLES.indexOf(style);
 // Rounded scalp and hairline; leave face mostly uncovered.
 smoothSphere(T,back,hair,0,.22,-.08,.47,.39,.43,24);
 smoothSphere(T,back,hair,0,.36,.035,.44,.25,.39,24);
 const bangs=(type)=>{
  const variants=type===0?[[-.27,.37,-.01,.24],[-.09,.4,.03,.22],[.12,.39,.03,.19],[.3,.36,-.02,.18]]
   :type===1?[[-.27,.35,.025,.24],[-.08,.4,.06,.21],[.16,.39,.04,.17]]
   :[[-.28,.38,.04,.22],[-.08,.4,.055,.24],[.15,.37,.035,.21],[.3,.32,-.01,.18]];
  for(const [x,y,z,l] of variants){
   const lock=smoothSphere(T,back,x<0?hair:light,x,y,z,.16,l,.13);
   lock.rotation.z=x<0?.18:-.2;
  }
 };
 if(id===0||id===1||id===6){
  bangs(id===1?1:0);
  for(const side of [-1,1])smoothSphere(T,back,hair,side*.39,.05,-.01,.17,.26,.30);
  if(id===6)for(let i=0;i<6;i++){
   const x=-.32+i*.13;
   smoothSphere(T,back,i%2?hair:light,x,.47+Math.sin(i*1.7)*.04,-.02,.14,.14,.16);
  }
  if(id===1){const lock=smoothSphere(T,back,light,.31,.16,.24,.16,.28,.13);lock.rotation.z=.36;}
 }else if(id===2||id===7){
  bangs(2);
  smoothSphere(T,back,hair,0,-.12,-.18,.48,.43,.35);
  for(const side of [-1,1]){
   smoothSphere(T,back,hair,side*.43,-.20,-.08,.19,id===7?.52:.34,.28);
   smoothSphere(T,back,light,side*.43,-.14,.21,.11,.30,.09);
  }
 }else if(id===3){
  bangs(1);
  smoothSphere(T,back,hair,0,.02,-.38,.45,.43,.26);
  smoothSphere(T,back,light,0,.06,-.58,.26,.23,.3);
  for(let k=0;k<4;k++)smoothSphere(T,back,k%2?hair:light,Math.sin(k)*.12,-.10-k*.15,-.59,.18,.2,.17);
 }else if(id===4){
  bangs(0);
  smoothSphere(T,back,hair,0,.22,-.4,.48,.32,.27);
  smoothSphere(T,back,hair,0,.30,-.61,.29,.28,.25);
 }else if(id===5){
  for(let i=0;i<24;i++){const angle=i*2.39996,u=(i+.5)/24;
   const y=.19+(1-u)*.43,rad=Math.sqrt(u)*.44;
   smoothSphere(T,back,i%4?hair:light,Math.cos(angle)*rad,y,Math.sin(angle)*rad-.10,.16,.17,.17,10);
  }
  for(const side of [-1,1])for(let j=0;j<3;j++)smoothSphere(T,back,hair,side*.39,-.16+j*.15,-.06,.15,.16,.18,10);
 }
 return back;
}
export function createCharacter(T,opts={}){
 const o={age:'adult',face:0,style:'soft-short',hair:'#594039',skin:'#e9b58f',shirt:'#8866c7',pants:'#57749b',shoes:'#494c64',...opts};
 const group=new T.Group(),rig=new T.Group();group.add(rig);
 const scale=o.age==='child'?.77:o.age==='senior'?.94:o.age==='teen'?.93:1;
 rig.scale.setScalar(scale);
 const skin=material(T,o.skin,.89),shirt=material(T,o.shirt),shade=material(T,new T.Color(o.shirt).multiplyScalar(.85)),pant=material(T,o.pants),shoes=material(T,o.shoes);
 const shirtLight=material(T,new T.Color(o.shirt).lerp(new T.Color('#ffffff'),.13));
 const torso=new T.Group();torso.position.set(0,1.48,0);rig.add(torso);
 // Soft anatomical silhouette: shoulders, chest, waist, hip; no rectangular block torsos.
 smoothSphere(T,torso,shirt,0,.07,0,.44,.57,.28,20);
 smoothSphere(T,torso,shirtLight,0,.30,.085,.39,.31,.245,20);
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
 const face=skinFaceTexture(T,typeof o.face==='number'?o.face:FACE_STYLES.indexOf(o.face),o.skin);
 const facePanel=new T.Mesh(new T.PlaneGeometry(.73,.66),new T.MeshBasicMaterial({map:face.texture,transparent:true,depthWrite:false,side:T.DoubleSide}));
 facePanel.position.set(0,-.005,.397);head.add(facePanel);
 // Nose ridge, ear lobes and round cheeks (subtle geometry, not dot eyes).
 for(const side of [-1,1]){
  smoothSphere(T,head,skin,side*.413,-.03,-.015,.105,.15,.105,13);
  smoothSphere(T,head,skin,side*.255,-.16,.295,.14,.11,.10,13);
 }
 smoothSphere(T,head,skin,0,-.12,.385,.067,.09,.052,12);
 createHair(T,head,o.style,o.hair);
 const joints={};let leftFoot,rightFoot;
 for(const side of [-1,1]){
  const shoulder=new T.Group();shoulder.position.set(side*.42,.34,0);torso.add(shoulder);
  const upper=smoothSphere(T,shoulder,shirt,side*.055,-.16,0,.18,.31,.2,17);
  smoothSphere(T,shoulder,shade,side*.065,-.40,0,.165,.08,.17,14);
  const elbow=new T.Group();elbow.position.set(side*.065,-.44,0);shoulder.add(elbow);
  smoothSphere(T,elbow,skin,0,-.15,0,.125,.29,.13,15);
  smoothSphere(T,elbow,skin,0,-.42,.01,.14,.14,.11,15);
  joints[side<0?'shoulderL':'shoulderR']=shoulder;
  joints[side<0?'elbowL':'elbowR']=elbow;
  const hip=new T.Group();hip.position.set(side*.20,.88,0);rig.add(hip);
  smoothSphere(T,hip,pant,0,-.23,0,.185,.36,.20,18);
  const knee=new T.Group();knee.position.y=-.48;hip.add(knee);
  smoothSphere(T,knee,pant,0,-.19,0,.15,.28,.16,17);
  smoothSphere(T,knee,shoes,0,-.44,.15,.17,.13,.29,18);
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
