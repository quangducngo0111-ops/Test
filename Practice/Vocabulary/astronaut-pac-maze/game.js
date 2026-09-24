/* =========================================================
   ASTRONAUT ESCAPE 3D
   Stylized Low-Poly Space Station
   Three.js / WebGL
========================================================= */
(() => {
  "use strict";

  const CELL=2.45;
  const GRID=[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1], [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1], [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1], [1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
  const ROWS=GRID.length;
  const COLS=GRID[0].length;

  const START={"row": 8, "col": 11};
  const STATIONS=[{"row": 1, "col": 1}, {"row": 1, "col": 21}, {"row": 15, "col": 1}, {"row": 15, "col": 21}];

  const ALIEN_SPAWNS=[
    {row:1,col:11},
    {row:15,col:11},
    {row:8,col:2},
    {row:8,col:20}
  ];

  const VOCAB=[
    {word:"public transport",correct:"hệ thống giao thông công cộng",wrong:["khu dân cư","tắc nghẽn giao thông","cơ sở y tế"]},
    {word:"income inequality",correct:"bất bình đẳng thu nhập",wrong:["thuế thu nhập","thu nhập khả dụng","tăng lương"]},
    {word:"renewable energy",correct:"năng lượng tái tạo",wrong:["nhiên liệu hóa thạch","hiệu suất năng lượng","khí thải"]},
    {word:"higher education",correct:"giáo dục đại học",wrong:["giáo dục mầm non","đào tạo nghề","giáo dục bắt buộc"]},
    {word:"labour market",correct:"thị trường lao động",wrong:["năng suất lao động","lương tối thiểu","việc làm tạm thời"]}
  ];

  let scene,camera,renderer,clock;
  let astronaut,astroParts;
  let aliens=[],stationsMeshes=[],teleportBeams=[];
  let score=0,lives=5,gameEnded=false,answerLock=false;
  let currentItem=null,stationAnswers=[];
  let walkTime=0,lastStationKey="",lastMove={x:0,z:1};

  const pressed={up:false,down:false,left:false,right:false};

  const questionEl=document.getElementById("question");
  const scoreEl=document.getElementById("score");
  const livesEl=document.getElementById("lives");
  const alienCountEl=document.getElementById("alienCount");
  const messageEl=document.getElementById("message");
  const bootErrorEl=document.getElementById("bootError");
  const gameOverEl=document.getElementById("gameOver");
  const gameOverTextEl=document.getElementById("gameOverText");

  if(!window.THREE){
    showBootError("Không tải được Three.js từ CDN.");
    return;
  }

  try{
    init();
    animate();
  }catch(error){
    showBootError(error?.stack||error?.message||String(error));
  }

  function init(){
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0x030713);
    scene.fog=new THREE.Fog(0x030713,36,84);

    camera=new THREE.PerspectiveCamera(52,window.innerWidth/window.innerHeight,.1,140);

    renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    document.getElementById("game").prepend(renderer.domElement);

    clock=new THREE.Clock();

    createLighting();
    createStationFloor();
    createMazeWalls();
    createNeonGrid();

    astronaut=createAstronaut();
    scene.add(astronaut);
    resetPlayer();

    spawnAliens(4);
    newQuestion();
    setupInput();

    setInitialCamera();
    updateHud();

    window.addEventListener("resize",onResize);
  }

  function createLighting(){
    scene.add(new THREE.AmbientLight(0x7a96d8,1.55));

    const key=new THREE.DirectionalLight(0xd9ecff,2.0);
    key.position.set(14,24,12);
    key.castShadow=true;
    key.shadow.mapSize.set(1024,1024);
    key.shadow.camera.left=-32;
    key.shadow.camera.right=32;
    key.shadow.camera.top=28;
    key.shadow.camera.bottom=-28;
    scene.add(key);

    const cyan=new THREE.PointLight(0x1d9bff,9,28,2);
    cyan.position.set(0,5,0);
    scene.add(cyan);
  }

  function createStationFloor(){
    const floor=new THREE.Mesh(
      new THREE.PlaneGeometry(COLS*CELL,ROWS*CELL),
      new THREE.MeshStandardMaterial({color:0x0a1220,roughness:.85,metalness:.2})
    );
    floor.rotation.x=-Math.PI/2;
    floor.position.y=-.04;
    floor.receiveShadow=true;
    scene.add(floor);
  }

  function createNeonGrid(){
    const mat=new THREE.LineBasicMaterial({color:0x143d78,transparent:true,opacity:.48});
    const points=[];
    const halfW=COLS*CELL/2;
    const halfH=ROWS*CELL/2;

    for(let c=0;c<=COLS;c++){
      const x=-halfW+c*CELL;
      points.push(new THREE.Vector3(x,.015,-halfH));
      points.push(new THREE.Vector3(x,.015,halfH));
    }

    for(let r=0;r<=ROWS;r++){
      const z=-halfH+r*CELL;
      points.push(new THREE.Vector3(-halfW,.015,z));
      points.push(new THREE.Vector3(halfW,.015,z));
    }

    scene.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(points),
        mat
      )
    );
  }

  function createMazeWalls(){
    const bodyMat=new THREE.MeshStandardMaterial({
      color:0x18264a,
      roughness:.45,
      metalness:.38,
      emissive:0x07132c,
      emissiveIntensity:.35
    });

    const ledMat=new THREE.MeshStandardMaterial({
      color:0x42d6ff,
      emissive:0x1ea7ff,
      emissiveIntensity:2.2,
      roughness:.25,
      metalness:.15
    });

    const wallGeo=new THREE.BoxGeometry(CELL*.94,1.65,CELL*.94);
    const ledXGeo=new THREE.BoxGeometry(CELL*.78,.06,.06);
    const ledZGeo=new THREE.BoxGeometry(.06,.06,CELL*.78);

    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        if(GRID[r][c]!==1) continue;

        const p=gridToWorld(r,c);

        const wall=new THREE.Mesh(wallGeo,bodyMat);
        wall.position.set(p.x,.82,p.z);
        wall.castShadow=true;
        wall.receiveShadow=true;
        scene.add(wall);

        const led1=new THREE.Mesh(ledXGeo,ledMat);
        led1.position.set(p.x,1.68,p.z-CELL*.34);
        scene.add(led1);

        const led2=new THREE.Mesh(ledZGeo,ledMat);
        led2.position.set(p.x+CELL*.34,1.68,p.z);
        scene.add(led2);
      }
    }
  }

  function createAstronaut(){
    const g=new THREE.Group();

    const white=new THREE.MeshStandardMaterial({color:0xf5f8ff,roughness:.52});
    const blue=new THREE.MeshStandardMaterial({color:0x4fa8ff,roughness:.32,metalness:.15});
    const dark=new THREE.MeshStandardMaterial({color:0x20365f,roughness:.5,metalness:.1});
    const visorMat=new THREE.MeshStandardMaterial({
      color:0x6bd6ff,
      roughness:.08,
      metalness:.35,
      emissive:0x154d7d,
      emissiveIntensity:.35
    });

    const helmet=new THREE.Mesh(new THREE.SphereGeometry(.42,18,14),white);
    helmet.position.y=1.55;
    helmet.castShadow=true;
    g.add(helmet);

    const visor=new THREE.Mesh(new THREE.SphereGeometry(.32,18,12),visorMat);
    visor.scale.set(1,.72,.44);
    visor.position.set(0,1.57,-.28);
    g.add(visor);

    const torso=new THREE.Mesh(new THREE.BoxGeometry(.72,.82,.42),white);
    torso.position.y=.92;
    torso.castShadow=true;
    g.add(torso);

    const chest=new THREE.Mesh(new THREE.BoxGeometry(.42,.26,.06),blue);
    chest.position.set(0,1.0,-.24);
    g.add(chest);

    const tank=new THREE.Mesh(new THREE.BoxGeometry(.54,.7,.27),dark);
    tank.position.set(0,.98,.33);
    tank.castShadow=true;
    g.add(tank);

    const limbGeo=new THREE.CylinderGeometry(.115,.115,.62,10);

    const leftArm=new THREE.Mesh(limbGeo,white);
    const rightArm=new THREE.Mesh(limbGeo,white);
    leftArm.position.set(-.48,.98,0);
    rightArm.position.set(.48,.98,0);
    leftArm.rotation.z=-.16;
    rightArm.rotation.z=.16;
    g.add(leftArm,rightArm);

    const leftLeg=new THREE.Mesh(limbGeo,white);
    const rightLeg=new THREE.Mesh(limbGeo,white);
    leftLeg.position.set(-.2,.29,0);
    rightLeg.position.set(.2,.29,0);
    g.add(leftLeg,rightLeg);

    const bootGeo=new THREE.BoxGeometry(.24,.16,.4);
    const leftBoot=new THREE.Mesh(bootGeo,dark);
    const rightBoot=new THREE.Mesh(bootGeo,dark);
    leftBoot.position.set(-.2,-.05,-.06);
    rightBoot.position.set(.2,-.05,-.06);
    g.add(leftBoot,rightBoot);

    astroParts={leftArm,rightArm,leftLeg,rightLeg};
    g.scale.setScalar(.84);

    return g;
  }

  function createAlien(color){
    const g=new THREE.Group();

    const bodyMat=new THREE.MeshStandardMaterial({
      color,
      roughness:.32,
      metalness:.12,
      emissive:new THREE.Color(color).multiplyScalar(.35),
      emissiveIntensity:1.2
    });

    const eyeWhite=new THREE.MeshBasicMaterial({color:0xffffff});
    const pupilMat=new THREE.MeshBasicMaterial({color:0x12030d});

    const head=new THREE.Mesh(new THREE.SphereGeometry(.46,14,10),bodyMat);
    head.position.y=.95;
    head.scale.set(1,.82,.9);
    g.add(head);

    const body=new THREE.Mesh(new THREE.DodecahedronGeometry(.45,0),bodyMat);
    body.position.y=.47;
    body.scale.y=.8;
    g.add(body);

    [-.17,.17].forEach(x=>{
      const eye=new THREE.Mesh(new THREE.SphereGeometry(.10,8,6),eyeWhite);
      eye.position.set(x,1.0,-.38);

      const pupil=new THREE.Mesh(new THREE.SphereGeometry(.04,6,5),pupilMat);
      pupil.position.set(0,0,-.085);

      eye.add(pupil);
      g.add(eye);
    });

    const legGeo=new THREE.CylinderGeometry(.07,.09,.42,7);
    const legs=[];

    [-.25,0,.25].forEach(x=>{
      const leg=new THREE.Mesh(legGeo,bodyMat);
      leg.position.set(x,.08,0);
      leg.rotation.z=(x||.01)*.5;
      g.add(leg);
      legs.push(leg);
    });

    const hornGeo=new THREE.ConeGeometry(.08,.38,7);

    [-.2,.2].forEach(x=>{
      const horn=new THREE.Mesh(hornGeo,bodyMat);
      horn.position.set(x,1.42,0);
      horn.rotation.z=x<0?.18:-.18;
      g.add(horn);
    });

    g.userData.legs=legs;
    return g;
  }

  function spawnAliens(count){
    aliens.forEach(a=>disposeObject(a.group));
    aliens=[];

    const colors=[0xff335f,0xa743ff,0xff5a9f,0x7e3cff];

    for(let i=0;i<count;i++){
      const spawn=ALIEN_SPAWNS[i%ALIEN_SPAWNS.length];
      const p=gridToWorld(spawn.row,spawn.col);
      const group=createAlien(colors[i%colors.length]);

      group.position.set(p.x,.04,p.z);
      scene.add(group);

      aliens.push({
        group,
        path:[],
        repath:0,
        speed:2.0+i*.13,
        phase:Math.random()*Math.PI*2
      });
    }

    alienCountEl.textContent=String(aliens.length);
  }

  function createHologramTexture(text){
    const canvas=document.createElement("canvas");
    canvas.width=768;
    canvas.height=300;
    const ctx=canvas.getContext("2d");

    ctx.fillStyle="rgba(6,18,42,.92)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="#70ecff";
    ctx.lineWidth=15;
    ctx.shadowColor="#48d9ff";
    ctx.shadowBlur=26;
    ctx.strokeRect(10,10,748,280);
    ctx.shadowBlur=0;

    ctx.fillStyle="#fff";
    ctx.font="800 50px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";

    drawWrappedText(ctx,text,384,150,650,58);

    const texture=new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace;
    return texture;
  }

  function drawWrappedText(ctx,text,cx,cy,maxWidth,lineHeight){
    const words=String(text).split(" ");
    const lines=[];
    let line="";

    words.forEach(word=>{
      const test=line?line+" "+word:word;
      if(ctx.measureText(test).width>maxWidth && line){
        lines.push(line);
        line=word;
      }else{
        line=test;
      }
    });

    if(line) lines.push(line);

    const visible=lines.slice(0,4);
    const y0=cy-(visible.length-1)*lineHeight/2;
    visible.forEach((v,i)=>ctx.fillText(v,cx,y0+i*lineHeight));
  }

  function buildStations(){
    disposeStations();

    const ringGeo=new THREE.TorusGeometry(.92,.12,10,28);
    const diskGeo=new THREE.CylinderGeometry(.92,.92,.12,28);

    STATIONS.forEach((station,index)=>{
      const p=gridToWorld(station.row,station.col);

      const diskMat=new THREE.MeshStandardMaterial({
        color:0x153a6d,
        emissive:0x0f5ea9,
        emissiveIntensity:1.0,
        roughness:.32,
        metalness:.32
      });

      const ringMat=new THREE.MeshStandardMaterial({
        color:0x6deaff,
        emissive:0x30ccff,
        emissiveIntensity:2.4,
        roughness:.2,
        metalness:.1
      });

      const disk=new THREE.Mesh(diskGeo,diskMat);
      disk.position.set(p.x,.06,p.z);

      const ring=new THREE.Mesh(ringGeo,ringMat);
      ring.rotation.x=Math.PI/2;
      ring.position.set(p.x,.14,p.z);

      const sign=new THREE.Mesh(
        new THREE.PlaneGeometry(2.8,1.08),
        new THREE.MeshBasicMaterial({
          map:createHologramTexture(stationAnswers[index]),
          transparent:true,
          side:THREE.DoubleSide
        })
      );
      sign.position.set(p.x,2.15,p.z);
      sign.rotation.x=-.08;

      scene.add(disk,ring,sign);
      stationsMeshes.push({disk,ring,sign,index});

      const beam=new THREE.Mesh(
        new THREE.CylinderGeometry(.84,.84,4.8,24,1,true),
        new THREE.MeshBasicMaterial({
          color:0x6deaff,
          transparent:true,
          opacity:0,
          side:THREE.DoubleSide,
          depthWrite:false
        })
      );
      beam.position.set(p.x,2.4,p.z);
      scene.add(beam);
      teleportBeams.push(beam);
    });
  }

  function newQuestion(){
    currentItem=VOCAB[Math.floor(Math.random()*VOCAB.length)];
    stationAnswers=shuffle([currentItem.correct,...currentItem.wrong]).slice(0,4);

    questionEl.textContent=currentItem.word;
    answerLock=false;
    lastStationKey="";

    buildStations();
    resetAliens();
  }

  function animate(){
    requestAnimationFrame(animate);
    if(!clock||!renderer) return;

    const dt=Math.min(clock.getDelta(),.034);

    if(!gameEnded){
      updatePlayer(dt);
      updateAliens(dt);
      animateStations();
      checkStations();
      checkAlienCollision();
      updateCamera(dt);
    }

    renderer.render(scene,camera);
  }

  function updatePlayer(dt){
    let dx=(pressed.right?1:0)-(pressed.left?1:0);
    let dz=(pressed.down?1:0)-(pressed.up?1:0);

    const len=Math.hypot(dx,dz);

    if(!len){
      animateAstronaut(false,dt);
      return;
    }

    dx/=len;
    dz/=len;
    lastMove={x:dx,z:dz};

    const speed=4.65;
    const moveX=dx*speed*dt;
    const moveZ=dz*speed*dt;

    const nextX=astronaut.position.x+moveX;
    if(canStandAt(nextX,astronaut.position.z)){
      astronaut.position.x=nextX;
    }

    const nextZ=astronaut.position.z+moveZ;
    if(canStandAt(astronaut.position.x,nextZ)){
      astronaut.position.z=nextZ;
    }

    astronaut.rotation.y=lerpAngle(
      astronaut.rotation.y,
      Math.atan2(dx,dz),
      .22
    );

    animateAstronaut(true,dt);
  }

  function canStandAt(x,z){
    const radius=.29;

    const samples=[
      [x-radius,z],
      [x+radius,z],
      [x,z-radius],
      [x,z+radius],
      [x-radius*.72,z-radius*.72],
      [x+radius*.72,z-radius*.72],
      [x-radius*.72,z+radius*.72],
      [x+radius*.72,z+radius*.72]
    ];

    return samples.every(([sx,sz])=>{
      const cell=worldToGrid(sx,sz);
      return isWalkable(cell.row,cell.col);
    });
  }

  function animateAstronaut(walking,dt){
    if(!astroParts) return;

    if(walking){
      walkTime+=dt*9.5;
      const swing=Math.sin(walkTime)*.58;

      astroParts.leftLeg.rotation.x=swing;
      astroParts.rightLeg.rotation.x=-swing;
      astroParts.leftArm.rotation.x=-swing*.72;
      astroParts.rightArm.rotation.x=swing*.72;

      astronaut.position.y=.05+Math.abs(Math.sin(walkTime*2))*.035;
    }else{
      [astroParts.leftLeg,astroParts.rightLeg,astroParts.leftArm,astroParts.rightArm]
        .forEach(l=>l.rotation.x*=.78);

      astronaut.position.y=THREE.MathUtils.lerp(astronaut.position.y,.05,.2);
    }
  }

  function updateAliens(dt){
    const playerCell=worldToGrid(astronaut.position.x,astronaut.position.z);

    aliens.forEach((alien,index)=>{
      alien.repath-=dt;
      const alienCell=worldToGrid(alien.group.position.x,alien.group.position.z);

      if(alien.repath<=0||alien.path.length===0){
        alien.path=findPath(alienCell,playerCell).slice(1);
        alien.repath=.28+Math.random()*.16;
      }

      const next=alien.path[0];
      if(!next) return;

      const target=gridToWorld(next.row,next.col);
      const dx=target.x-alien.group.position.x;
      const dz=target.z-alien.group.position.z;
      const dist=Math.hypot(dx,dz);

      if(dist<.06){
        alien.group.position.x=target.x;
        alien.group.position.z=target.z;
        alien.path.shift();
      }else{
        const step=Math.min(dist,alien.speed*dt);

        alien.group.position.x+=dx/dist*step;
        alien.group.position.z+=dz/dist*step;

        alien.group.rotation.y=lerpAngle(
          alien.group.rotation.y,
          Math.atan2(dx,dz),
          .2
        );
      }

      const t=performance.now()*.008+alien.phase;
      alien.group.position.y=.04+Math.sin(t)*.06;

      alien.group.userData.legs?.forEach((leg,i)=>{
        leg.rotation.x=Math.sin(t*1.7+i*Math.PI)*.45;
      });
    });
  }

  function animateStations(){
    stationsMeshes.forEach((station,i)=>{
      station.ring.rotation.z+=.012+i*.0007;
      station.disk.material.emissiveIntensity=
        1+Math.sin(performance.now()*.004+i)*.25;
    });
  }

  function checkStations(){
    if(answerLock) return;

    const cell=worldToGrid(astronaut.position.x,astronaut.position.z);
    const key=`${cell.row},${cell.col}`;

    if(key===lastStationKey) return;
    lastStationKey=key;

    const index=STATIONS.findIndex(
      s=>s.row===cell.row&&s.col===cell.col
    );

    if(index<0) return;

    answerLock=true;

    if(stationAnswers[index]===currentItem.correct){
      handleCorrectStation(index);
    }else{
      handleWrongStation(index);
    }
  }

  function handleCorrectStation(index){
    score+=120;

    flashMessage("✓ Đúng! TELEPORT — tiêu diệt toàn bộ Alien!","good");
    updateHud();

    triggerTeleport(index,true);
    vanishAliens();

    setTimeout(()=>{
      newQuestion();
    },900);
  }

  function handleWrongStation(index){
    flashMessage("✕ Sai! Teleport Pad từ chối.","bad");
    triggerTeleport(index,false);
    pushPlayerBack();

    setTimeout(()=>{
      answerLock=false;
    },560);
  }

  function triggerTeleport(index,good){
    const item=stationsMeshes[index];
    const beam=teleportBeams[index];

    if(!item||!beam) return;

    const color=good?0x71ecff:0xff334f;

    item.ring.material.color.setHex(color);
    item.ring.material.emissive.setHex(color);
    item.disk.material.emissive.setHex(color);

    beam.material.color.setHex(color);
    beam.material.opacity=.44;

    const start=performance.now();

    const tick=now=>{
      const p=Math.min(1,(now-start)/650);

      beam.material.opacity=(1-p)*.44;
      beam.scale.set(1+p*.65,1,1+p*.65);

      if(p<1){
        requestAnimationFrame(tick);
      }else{
        beam.material.opacity=0;
        beam.scale.set(1,1,1);
      }
    };

    requestAnimationFrame(tick);
  }

  function vanishAliens(){
    aliens.forEach((alien,i)=>{
      const start=performance.now();

      const tick=now=>{
        const p=Math.min(1,(now-start)/520);
        const s=1-p;

        alien.group.scale.setScalar(Math.max(.02,s));
        alien.group.rotation.y+=.18;
        alien.group.position.y=.04+p*2.8;

        if(p<1) requestAnimationFrame(tick);
      };

      setTimeout(()=>requestAnimationFrame(tick),i*45);
    });
  }

  function pushPlayerBack(){
    const amount=1.25;
    const nx=astronaut.position.x-lastMove.x*amount;
    const nz=astronaut.position.z-lastMove.z*amount;

    if(canStandAt(nx,nz)){
      astronaut.position.x=nx;
      astronaut.position.z=nz;
    }else{
      resetPlayer();
    }
  }

  function checkAlienCollision(){
    if(answerLock) return;

    for(const alien of aliens){
      const dx=astronaut.position.x-alien.group.position.x;
      const dz=astronaut.position.z-alien.group.position.z;

      if(Math.hypot(dx,dz)<.72){
        answerLock=true;
        lives--;

        flashMessage("👽 Alien bắt được bạn! Mất 1 mạng.","bad");

        resetPlayer();
        resetAliens();
        updateHud();

        if(lives<=0){
          endGame();
          return;
        }

        setTimeout(()=>answerLock=false,700);
        break;
      }
    }
  }

  function resetPlayer(){
    const p=gridToWorld(START.row,START.col);
    astronaut.position.set(p.x,.05,p.z);
    lastStationKey="";
  }

  function resetAliens(){
    aliens.forEach((alien,i)=>{
      const spawn=ALIEN_SPAWNS[i%ALIEN_SPAWNS.length];
      const p=gridToWorld(spawn.row,spawn.col);

      alien.group.position.set(p.x,.04,p.z);
      alien.group.scale.setScalar(1);
      alien.path=[];
      alien.repath=0;
    });
  }

  function setupInput(){
    window.addEventListener("keydown",e=>{
      const key=e.key.toLowerCase();

      if(["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"].includes(key)){
        e.preventDefault();
      }

      if(key==="arrowup"||key==="w") pressed.up=true;
      if(key==="arrowdown"||key==="s") pressed.down=true;
      if(key==="arrowleft"||key==="a") pressed.left=true;
      if(key==="arrowright"||key==="d") pressed.right=true;
    });

    window.addEventListener("keyup",e=>{
      const key=e.key.toLowerCase();

      if(key==="arrowup"||key==="w") pressed.up=false;
      if(key==="arrowdown"||key==="s") pressed.down=false;
      if(key==="arrowleft"||key==="a") pressed.left=false;
      if(key==="arrowright"||key==="d") pressed.right=false;
    });

    document.querySelectorAll("[data-dir]").forEach(button=>{
      const dir=button.dataset.dir;

      button.addEventListener("pointerdown",e=>{
        e.preventDefault();
        try{button.setPointerCapture(e.pointerId)}catch(error){}
        pressed[dir]=true;
      });

      const release=e=>{
        e.preventDefault();
        pressed[dir]=false;

        try{
          if(button.hasPointerCapture(e.pointerId)){
            button.releasePointerCapture(e.pointerId);
          }
        }catch(error){}
      };

      button.addEventListener("pointerup",release);
      button.addEventListener("pointercancel",release);
      button.addEventListener("lostpointercapture",()=>pressed[dir]=false);
    });

    window.addEventListener("blur",clearPressed);

    document.addEventListener("visibilitychange",()=>{
      if(document.hidden) clearPressed();
    });

    document.getElementById("restartBtn").addEventListener("click",restart);
  }

  function clearPressed(){
    Object.keys(pressed).forEach(key=>pressed[key]=false);
  }

  function findPath(start,goal){
    const queue=[start];
    const parent=new Map();

    const startKey=keyOf(start.row,start.col);
    const goalKey=keyOf(goal.row,goal.col);

    parent.set(startKey,null);

    const dirs=[[-1,0],[1,0],[0,-1],[0,1]];

    while(queue.length){
      const current=queue.shift();

      if(keyOf(current.row,current.col)===goalKey){
        break;
      }

      for(const [dr,dc] of dirs){
        const row=current.row+dr;
        const col=current.col+dc;
        const key=keyOf(row,col);

        if(!isWalkable(row,col)||parent.has(key)){
          continue;
        }

        parent.set(key,current);
        queue.push({row,col});
      }
    }

    if(!parent.has(goalKey)){
      return [start];
    }

    const path=[];
    let cursor=goal;

    while(cursor){
      path.push(cursor);
      cursor=parent.get(keyOf(cursor.row,cursor.col));
    }

    return path.reverse();
  }

  function isWalkable(row,col){
    return (
      row>=0&&
      row<ROWS&&
      col>=0&&
      col<COLS&&
      GRID[row][col]!==1
    );
  }

  function gridToWorld(row,col){
    const halfW=COLS*CELL/2;
    const halfH=ROWS*CELL/2;

    return {
      x:-halfW+CELL/2+col*CELL,
      z:-halfH+CELL/2+row*CELL
    };
  }

  function worldToGrid(x,z){
    const halfW=COLS*CELL/2;
    const halfH=ROWS*CELL/2;

    return {
      col:Math.floor((x+halfW)/CELL),
      row:Math.floor((z+halfH)/CELL)
    };
  }

  function keyOf(row,col){
    return `${row},${col}`;
  }

  function setInitialCamera(){
    camera.position.set(14,22,16);
    camera.lookAt(astronaut.position.x,0,astronaut.position.z);
  }

  function updateCamera(dt){
    const desiredX=astronaut.position.x+13.5;
    const desiredY=21.5;
    const desiredZ=astronaut.position.z+15.5;

    camera.position.x=THREE.MathUtils.lerp(
      camera.position.x,
      desiredX,
      1-Math.pow(.018,dt)
    );

    camera.position.y=THREE.MathUtils.lerp(
      camera.position.y,
      desiredY,
      1-Math.pow(.018,dt)
    );

    camera.position.z=THREE.MathUtils.lerp(
      camera.position.z,
      desiredZ,
      1-Math.pow(.018,dt)
    );

    camera.lookAt(
      astronaut.position.x,
      0,
      astronaut.position.z
    );
  }

  function updateHud(){
    scoreEl.textContent=String(score);
    livesEl.textContent=String(lives);
    alienCountEl.textContent=String(aliens.length);
  }

  function flashMessage(text,type){
    messageEl.textContent=text;
    messageEl.className="show "+type;

    clearTimeout(flashMessage.timer);

    flashMessage.timer=setTimeout(
      ()=>messageEl.className="",
      1050
    );
  }

  function disposeStations(){
    stationsMeshes.forEach(item=>{
      [item.disk,item.ring,item.sign].forEach(disposeObject);
    });

    stationsMeshes=[];

    teleportBeams.forEach(disposeObject);
    teleportBeams=[];
  }

  function disposeObject(obj){
    if(!obj) return;

    obj.traverse?.(child=>{
      child.geometry?.dispose?.();

      if(child.material){
        const materials=Array.isArray(child.material)
          ?child.material
          :[child.material];

        materials.forEach(material=>{
          material.map?.dispose?.();
          material.dispose?.();
        });
      }
    });

    scene.remove(obj);
  }

  function endGame(){
    gameEnded=true;
    clearPressed();

    gameOverTextEl.textContent=`Điểm của bạn: ${score}.`;
    gameOverEl.classList.remove("hidden");
  }

  function restart(){
    score=0;
    lives=5;
    gameEnded=false;
    answerLock=false;
    lastStationKey="";

    clearPressed();
    resetPlayer();
    spawnAliens(4);
    newQuestion();
    updateHud();

    gameOverEl.classList.add("hidden");
  }

  function lerpAngle(current,target,amount){
    let delta=target-current;

    while(delta>Math.PI) delta-=Math.PI*2;
    while(delta<-Math.PI) delta+=Math.PI*2;

    return current+delta*amount;
  }

  function onResize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));
  }

  function shuffle(arr){
    const a=[...arr];

    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }

    return a;
  }

  function showBootError(message){
    console.error(message);

    if(!bootErrorEl) return;

    bootErrorEl.textContent=String(message);
    bootErrorEl.classList.remove("hidden");
  }
})();
