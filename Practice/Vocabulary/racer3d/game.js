/* =========================================================
   WORD RACER 3D — FIRST PERSON
   Three.js / WebGL
   Stylized Low-Poly + cabin camera
========================================================= */
(() => {
  "use strict";

  const VOCAB = [
    {word:"public transport",correct:"hệ thống giao thông công cộng",wrong:["khu dân cư","ô nhiễm không khí"]},
    {word:"economic growth",correct:"tăng trưởng kinh tế",wrong:["thất nghiệp","chi tiêu hộ gia đình"]},
    {word:"renewable energy",correct:"năng lượng tái tạo",wrong:["nhiên liệu hóa thạch","khí thải carbon"]},
    {word:"job security",correct:"sự ổn định việc làm",wrong:["lương tối thiểu","thị trường lao động"]},
    {word:"higher education",correct:"giáo dục đại học",wrong:["giáo dục bắt buộc","học nghề"]},
    {word:"income inequality",correct:"bất bình đẳng thu nhập",wrong:["phúc lợi xã hội","tăng lương"]},
    {word:"urbanisation",correct:"đô thị hóa",wrong:["di cư quốc tế","quy hoạch nông thôn"]},
    {word:"consumer demand",correct:"nhu cầu tiêu dùng",wrong:["chi phí sản xuất","thị phần"]}
  ];

  const LANES=[-3.1,0,3.1];
  const GATE_START_Z=-72;
  const RESOLVE_Z=-1.5;

  let scene,camera,renderer,clock,cabin,wheel;
  let score=0,lives=5,combo=0,targetLane=1;
  let gameEnded=false,baseSpeed=18,boost=0,slowdown=0;
  let roadDashes=[],roadside=[],gateWave=null,particles=[],rivals=[];
  let nextRoundTimer=null;

  const targetWordEl=document.getElementById("targetWord");
  const scoreEl=document.getElementById("score");
  const livesEl=document.getElementById("lives");
  const comboEl=document.getElementById("combo");
  const speedEl=document.getElementById("speed");
  const messageEl=document.getElementById("message");
  const boostFx=document.getElementById("boostFx");
  const damageFx=document.getElementById("damageFx");
  const gameEl=document.getElementById("game");
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
    scene.background=new THREE.Color(0xe6a56f);
    scene.fog=new THREE.Fog(0xe6a56f,38,125);

    camera=new THREE.PerspectiveCamera(64,window.innerWidth/window.innerHeight,.1,180);
    camera.position.set(0,1.72,5.9);

    renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    gameEl.prepend(renderer.domElement);

    clock=new THREE.Clock();

    createLighting();
    createRoad();
    createCabin();
    createRivals();
    setupControls();
    startRound();
    updateHud();

    window.addEventListener("resize",onResize);
  }

  function createLighting(){
    scene.add(new THREE.AmbientLight(0xffdfcb,1.55));

    const sun=new THREE.DirectionalLight(0xffd0a3,2.4);
    sun.position.set(-10,18,7);
    sun.castShadow=true;
    sun.shadow.mapSize.set(1024,1024);
    sun.shadow.camera.left=-25;
    sun.shadow.camera.right=25;
    sun.shadow.camera.top=25;
    sun.shadow.camera.bottom=-20;
    scene.add(sun);

    const sunDisc=new THREE.Mesh(
      new THREE.SphereGeometry(3.4,20,12),
      new THREE.MeshBasicMaterial({color:0xffe0a3})
    );
    sunDisc.position.set(-24,18,-95);
    scene.add(sunDisc);
  }

  function createRoad(){
    const ground=new THREE.Mesh(
      new THREE.PlaneGeometry(100,260),
      new THREE.MeshStandardMaterial({color:0x8c6b4a,roughness:1})
    );
    ground.rotation.x=-Math.PI/2;
    ground.position.set(0,-.03,-75);
    ground.receiveShadow=true;
    scene.add(ground);

    const road=new THREE.Mesh(
      new THREE.PlaneGeometry(12.5,260),
      new THREE.MeshStandardMaterial({color:0x30333c,roughness:.96})
    );
    road.rotation.x=-Math.PI/2;
    road.position.set(0,.01,-75);
    road.receiveShadow=true;
    scene.add(road);

    [-6.5,6.5].forEach(x=>{
      const curb=new THREE.Mesh(
        new THREE.BoxGeometry(.35,.22,260),
        new THREE.MeshStandardMaterial({color:0xd9c7aa,roughness:.8})
      );
      curb.position.set(x,.1,-75);
      scene.add(curb);
    });

    const dashMat=new THREE.MeshStandardMaterial({color:0xf5e9c9,emissive:0x2d2110,emissiveIntensity:.2});
    for(let z=-120;z<12;z+=8){
      [-1.55,1.55].forEach(x=>{
        const dash=new THREE.Mesh(new THREE.BoxGeometry(.13,.025,3.8),dashMat);
        dash.position.set(x,.04,z);
        roadDashes.push(dash);
        scene.add(dash);
      });
    }

    for(let i=0;i<36;i++){
      createRoadsideSet(-1,-12-i*7.2);
      createRoadsideSet(1,-15-i*7.2);
    }
  }

  function createRoadsideSet(side,z){
    const x=side*(8.2+Math.random()*3.5);
    const group=new THREE.Group();

    const trunk=new THREE.Mesh(
      new THREE.CylinderGeometry(.16,.22,1.7,6),
      new THREE.MeshStandardMaterial({color:0x6e432d,roughness:1})
    );
    trunk.position.y=.85;

    const crown=new THREE.Mesh(
      new THREE.ConeGeometry(1.15,2.7,6),
      new THREE.MeshStandardMaterial({color:Math.random()>.5?0x365c3a:0x456c3e,roughness:.95})
    );
    crown.position.y=2.6;

    group.add(trunk,crown);

    const poleMat=new THREE.MeshStandardMaterial({color:0x353846,roughness:.8,metalness:.25});
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.055,.07,4.4,6),poleMat);
    pole.position.set(side*2.0,2.2,0);

    const arm=new THREE.Mesh(new THREE.BoxGeometry(.9,.07,.07),poleMat);
    arm.position.set(side*1.62,4.3,0);

    const lamp=new THREE.Mesh(
      new THREE.SphereGeometry(.16,8,6),
      new THREE.MeshStandardMaterial({color:0xffd48b,emissive:0xff8a2c,emissiveIntensity:2})
    );
    lamp.position.set(side*1.2,4.25,0);

    group.add(pole,arm,lamp);
    group.position.set(x,0,z);
    roadside.push(group);
    scene.add(group);
  }

  function createCabin(){
    cabin=new THREE.Group();
    camera.add(cabin);
    scene.add(camera);

    const dark=new THREE.MeshStandardMaterial({color:0x141721,roughness:.65,metalness:.1});
    const trim=new THREE.MeshStandardMaterial({color:0x2c3444,roughness:.45,metalness:.2});
    const glow=new THREE.MeshStandardMaterial({color:0x1c93ff,emissive:0x0d60ff,emissiveIntensity:1.4});

    const dash=new THREE.Mesh(new THREE.BoxGeometry(4.9,.58,.95),dark);
    dash.position.set(0,-1.02,-1.22);
    dash.rotation.x=-.08;
    cabin.add(dash);

    const cluster=new THREE.Mesh(new THREE.BoxGeometry(1.25,.42,.10),glow);
    cluster.position.set(0,-.78,-1.72);
    cabin.add(cluster);

    wheel=new THREE.Group();
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.47,.07,10,24),dark);
    const spokeH=new THREE.Mesh(new THREE.BoxGeometry(.74,.08,.08),trim);
    const spokeV=new THREE.Mesh(new THREE.BoxGeometry(.08,.48,.08),trim);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.10,16),trim);
    hub.rotation.x=Math.PI/2;
    wheel.add(ring,spokeH,spokeV,hub);
    wheel.position.set(0,-.89,-1.00);
    wheel.rotation.x=-.22;
    cabin.add(wheel);

    const pillarGeo=new THREE.BoxGeometry(.18,2.2,.18);
    const leftPillar=new THREE.Mesh(pillarGeo,dark);
    const rightPillar=new THREE.Mesh(pillarGeo,dark);
    leftPillar.position.set(-2.08,.12,-1.8);
    rightPillar.position.set(2.08,.12,-1.8);
    leftPillar.rotation.z=-.12;
    rightPillar.rotation.z=.12;
    cabin.add(leftPillar,rightPillar);

    const roofEdge=new THREE.Mesh(new THREE.BoxGeometry(4.2,.16,.18),dark);
    roofEdge.position.set(0,1.25,-1.85);
    cabin.add(roofEdge);
  }

  function createLowPolyCar(color){
    const group=new THREE.Group();
    const bodyMat=new THREE.MeshStandardMaterial({color,roughness:.38,metalness:.18});
    const dark=new THREE.MeshStandardMaterial({color:0x12151b,roughness:.8});
    const glass=new THREE.MeshStandardMaterial({color:0x73c8e8,roughness:.15,metalness:.1});

    const lower=new THREE.Mesh(new THREE.BoxGeometry(1.55,.48,2.8),bodyMat);
    lower.position.y=.43;
    lower.castShadow=true;
    group.add(lower);

    const hood=new THREE.Mesh(new THREE.BoxGeometry(1.4,.22,1.0),bodyMat);
    hood.position.set(0,.67,-1.04);
    hood.castShadow=true;
    group.add(hood);

    const carCabin=new THREE.Mesh(new THREE.BoxGeometry(1.15,.58,1.25),glass);
    carCabin.position.set(0,.9,.15);
    carCabin.castShadow=true;
    group.add(carCabin);

    const wheelGeo=new THREE.CylinderGeometry(.28,.28,.22,12);
    [[-.8,.24,-.78],[.8,.24,-.78],[-.8,.24,.8],[.8,.24,.8]].forEach(p=>{
      const w=new THREE.Mesh(wheelGeo,dark);
      w.rotation.z=Math.PI/2;
      w.position.set(...p);
      group.add(w);
    });

    return group;
  }

  function createRivals(){
    rivals=[
      {mesh:createLowPolyCar(0x44d278),lane:0,z:-9,targetZ:-9},
      {mesh:createLowPolyCar(0x4f7df3),lane:2,z:-13,targetZ:-13}
    ];

    rivals.forEach(r=>{
      r.mesh.scale.setScalar(.92);
      r.mesh.position.set(LANES[r.lane],0,r.z);
      scene.add(r.mesh);
    });
  }

  function createGateTexture(text){
    const canvas=document.createElement("canvas");
    canvas.width=1024;
    canvas.height=360;
    const ctx=canvas.getContext("2d");

    const grad=ctx.createLinearGradient(0,0,1024,360);
    grad.addColorStop(0,"#07172d");
    grad.addColorStop(1,"#10284a");
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,1024,360);

    ctx.strokeStyle="#65e8ff";
    ctx.lineWidth=18;
    ctx.shadowColor="#55dfff";
    ctx.shadowBlur=28;
    ctx.strokeRect(12,12,1000,336);
    ctx.shadowBlur=0;

    ctx.fillStyle="#ffffff";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.font="800 68px Arial, sans-serif";

    drawWrappedText(ctx,text,512,180,870,76);

    const tex=new THREE.CanvasTexture(canvas);
    tex.colorSpace=THREE.SRGBColorSpace;
    return tex;
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
    const visible=lines.slice(0,3);
    const startY=cy-(visible.length-1)*lineHeight/2;
    visible.forEach((v,i)=>ctx.fillText(v,cx,startY+i*lineHeight));
  }

  function createLanePortal(answer,lane){
    const group=new THREE.Group();
    const neon=new THREE.MeshStandardMaterial({
      color:0x2fa5ff,emissive:0x136dff,emissiveIntensity:1.8,roughness:.3,metalness:.25
    });
    const frame=new THREE.MeshStandardMaterial({color:0x1b2437,roughness:.45,metalness:.35});

    const left=new THREE.Mesh(new THREE.BoxGeometry(.16,3.8,.22),frame);
    const right=new THREE.Mesh(new THREE.BoxGeometry(.16,3.8,.22),frame);
    left.position.set(-1.3,1.9,0);
    right.position.set(1.3,1.9,0);

    const arch=new THREE.Mesh(new THREE.TorusGeometry(1.3,.11,8,24,Math.PI),neon);
    arch.position.set(0,2.7,0);
    arch.rotation.z=Math.PI;

    const baseLeft=new THREE.Mesh(new THREE.BoxGeometry(.25,.12,.7),neon);
    const baseRight=baseLeft.clone();
    baseLeft.position.set(-1.3,.08,0);
    baseRight.position.set(1.3,.08,0);

    const sign=new THREE.Mesh(
      new THREE.PlaneGeometry(2.45,.86),
      new THREE.MeshBasicMaterial({map:createGateTexture(answer),side:THREE.DoubleSide})
    );
    sign.position.set(0,2.04,.08);

    group.add(left,right,arch,baseLeft,baseRight,sign);
    group.position.x=LANES[lane];
    group.userData.lane=lane;
    group.userData.answer=answer;
    return group;
  }

  function startRound(){
    disposeGateWave();

    const item=VOCAB[Math.floor(Math.random()*VOCAB.length)];
    const answers=shuffle([item.correct,...item.wrong]).slice(0,3);

    gateWave=new THREE.Group();
    gateWave.position.z=GATE_START_Z;
    gateWave.userData.item=item;
    gateWave.userData.resolved=false;
    gateWave.userData.portals=[];

    answers.forEach((answer,lane)=>{
      const portal=createLanePortal(answer,lane);
      portal.userData.correct=answer===item.correct;
      gateWave.userData.portals.push(portal);
      gateWave.add(portal);
    });

    scene.add(gateWave);
    targetWordEl.textContent=item.word;
  }

  function animate(){
    requestAnimationFrame(animate);
    if(!clock||!renderer) return;

    const dt=Math.min(clock.getDelta(),.034);

    if(!gameEnded){
      updatePlayer(dt);
      updateEnvironment(dt);
      updateGate(dt);
      updateRivals(dt);
      updateParticles(dt);
    }

    renderer.render(scene,camera);
  }

  function updatePlayer(dt){
    const targetX=LANES[targetLane];

    camera.position.x=THREE.MathUtils.lerp(
      camera.position.x,
      targetX,
      1-Math.pow(.002,dt)
    );

    const steer=(targetX-camera.position.x)*-.42;
    wheel.rotation.z=THREE.MathUtils.lerp(wheel.rotation.z,steer,.16);

    boost=Math.max(0,boost-dt*7.5);
    slowdown=Math.max(0,slowdown-dt*4.5);

    boostFx.classList.toggle("active",boost>1.2);
    updateHud();
  }

  function worldSpeed(){
    return Math.max(8,baseSpeed+boost-slowdown);
  }

  function updateEnvironment(dt){
    const speed=worldSpeed();

    roadDashes.forEach(d=>{
      d.position.z+=speed*dt;
      if(d.position.z>9) d.position.z-=132;
    });

    roadside.forEach(obj=>{
      obj.position.z+=speed*dt;
      if(obj.position.z>12) obj.position.z-=255;
    });
  }

  function updateGate(dt){
    if(!gateWave) return;

    gateWave.position.z+=worldSpeed()*dt;

    if(!gateWave.userData.resolved && gateWave.position.z>=RESOLVE_Z){
      gateWave.userData.resolved=true;
      const chosen=gateWave.userData.portals.find(p=>p.userData.lane===targetLane);

      if(chosen?.userData.correct){
        correctAnswer();
      }else{
        wrongAnswer();
      }
    }

    if(gateWave.position.z>12 && !nextRoundTimer){
      nextRoundTimer=setTimeout(()=>{
        nextRoundTimer=null;
        startRound();
      },260);
    }
  }

  function updateRivals(dt){
    rivals.forEach((r,i)=>{
      r.z=THREE.MathUtils.lerp(r.z,r.targetZ,Math.min(1,dt*3.2));
      r.mesh.position.set(LANES[r.lane],Math.sin(performance.now()*.006+i)*.025,r.z);
    });
  }

  function correctAnswer(){
    score+=100+combo*18;
    combo++;
    boost=Math.min(30,boost+15);
    slowdown=0;

    rivals.forEach(r=>{
      r.targetZ=Math.max(-25,r.targetZ-(4+Math.random()*3));
    });

    createNitroParticles();
    flashMessage("✓ Đúng! NITRO BOOST — vượt lên!","good");
    updateHud();
  }

  function wrongAnswer(){
    lives--;
    combo=0;
    boost=0;
    slowdown=Math.min(12,slowdown+8);

    const both=Math.random()<.45;
    const chosen=both?rivals:[rivals[Math.random()<.5?0:1]];

    chosen.forEach(r=>{
      r.targetZ=Math.min(4.6,r.targetZ+10+Math.random()*4);
    });

    triggerDamageFx();
    createSmoke();
    flashMessage(
      both?"✕ Sai! Cả 2 xe đối thủ vượt lên!":"✕ Sai! Một xe đối thủ vượt lên!",
      "bad"
    );

    updateHud();

    if(lives<=0) endGame();
  }

  function createNitroParticles(){
    for(let i=0;i<28;i++){
      const mat=new THREE.MeshBasicMaterial({
        color:i%2?0x6ceaff:0xffef9b,transparent:true,opacity:.9
      });
      const p=new THREE.Mesh(new THREE.SphereGeometry(.04+Math.random()*.045,6,6),mat);
      p.position.set(
        camera.position.x+(Math.random()-.5)*6,
        .3+Math.random()*3.2,
        -3-Math.random()*10
      );
      p.userData.life=.5+Math.random()*.4;
      p.userData.vz=24+Math.random()*18;
      particles.push(p);
      scene.add(p);
    }
  }

  function createSmoke(){
    for(let i=0;i<18;i++){
      const mat=new THREE.MeshBasicMaterial({color:0x777b86,transparent:true,opacity:.42});
      const p=new THREE.Mesh(new THREE.SphereGeometry(.12+Math.random()*.18,7,6),mat);
      p.position.set(
        camera.position.x+(Math.random()-.5)*2.2,
        .35+Math.random()*.5,
        1.2+Math.random()*1.8
      );
      p.userData.life=.6+Math.random()*.45;
      p.userData.vz=3+Math.random()*4;
      particles.push(p);
      scene.add(p);
    }
  }

  function updateParticles(dt){
    particles=particles.filter(p=>{
      p.userData.life-=dt;
      p.position.z+=p.userData.vz*dt;
      p.material.opacity=Math.max(0,p.userData.life*.9);

      if(p.userData.life<=0){
        scene.remove(p);
        p.geometry.dispose();
        p.material.dispose();
        return false;
      }
      return true;
    });
  }

  function triggerDamageFx(){
    damageFx.classList.add("active");
    gameEl.classList.remove("shake");
    void gameEl.offsetWidth;
    gameEl.classList.add("shake");

    setTimeout(()=>{
      damageFx.classList.remove("active");
      gameEl.classList.remove("shake");
    },420);
  }

  function setupControls(){
    window.addEventListener("keydown",e=>{
      if(gameEnded) return;
      const key=e.key.toLowerCase();

      if(key==="arrowleft"||key==="a"){
        e.preventDefault();
        changeLane(-1);
      }
      if(key==="arrowright"||key==="d"){
        e.preventDefault();
        changeLane(1);
      }
    });

    document.getElementById("leftBtn").addEventListener("click",()=>changeLane(-1));
    document.getElementById("rightBtn").addEventListener("click",()=>changeLane(1));
    document.getElementById("restartBtn").addEventListener("click",restart);
  }

  function changeLane(dir){
    targetLane=THREE.MathUtils.clamp(targetLane+dir,0,2);
  }

  function updateHud(){
    scoreEl.textContent=String(score);
    livesEl.textContent=String(lives);
    comboEl.textContent="x"+combo;
    speedEl.textContent=String(Math.max(60,Math.round(120+boost*5-slowdown*5)));
  }

  function flashMessage(text,type){
    messageEl.textContent=text;
    messageEl.className="show "+type;
    clearTimeout(flashMessage.timer);
    flashMessage.timer=setTimeout(()=>messageEl.className="",1100);
  }

  function disposeGateWave(){
    if(!gateWave) return;

    gateWave.traverse(obj=>{
      obj.geometry?.dispose?.();

      if(obj.material){
        const mats=Array.isArray(obj.material)?obj.material:[obj.material];
        mats.forEach(m=>{
          m.map?.dispose?.();
          m.dispose?.();
        });
      }
    });

    scene.remove(gateWave);
    gateWave=null;
  }

  function endGame(){
    gameEnded=true;
    disposeGateWave();
    gameOverTextEl.textContent=`Điểm của bạn: ${score}.`;
    gameOverEl.classList.remove("hidden");
  }

  function restart(){
    if(nextRoundTimer){
      clearTimeout(nextRoundTimer);
      nextRoundTimer=null;
    }

    disposeGateWave();

    score=0;
    lives=5;
    combo=0;
    targetLane=1;
    gameEnded=false;
    baseSpeed=18;
    boost=0;
    slowdown=0;
    camera.position.x=0;

    rivals[0].z=rivals[0].targetZ=-9;
    rivals[1].z=rivals[1].targetZ=-13;

    boostFx.classList.remove("active");
    damageFx.classList.remove("active");
    gameOverEl.classList.add("hidden");

    updateHud();
    startRound();
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
