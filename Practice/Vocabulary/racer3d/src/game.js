window.VocabRacer = window.VocabRacer || {};

(() => {
  "use strict";

  const CONFIG=VocabRacer.CONFIG;

  let scene,camera,renderer,clock;
  let track,player,vocab,hud;
  let aiCars=[];
  let running=false,finished=false;
  let score=0,combo=0,raceTime=0;
  let currentGate=null,gateDelay=0,currentDifficulty="normal";
  let lastPlayerDistance=0,touchStartX=null;

  const renderHost=document.getElementById("renderHost");
  const gameEl=document.getElementById("game");
  const startScreen=document.getElementById("startScreen");
  const finishScreen=document.getElementById("finishScreen");
  const difficultySelect=document.getElementById("difficultySelect");
  const vocabSetSelect=document.getElementById("vocabSetSelect");
  const speedFx=document.getElementById("speedFx");
  const damageFx=document.getElementById("damageFx");
  const bootError=document.getElementById("bootError");

  const sound=createSoundFx();

  if(!window.THREE){
    showBootError("Không tải được Three.js. Kiểm tra kết nối Internet hoặc CDN.");
    return;
  }

  try{
    init3D();
    bindControls();
    animate();
  }catch(error){
    showBootError(error?.stack||error?.message||String(error));
  }

  function init3D(){
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0x91b8d8);
    scene.fog=new THREE.Fog(0x91b8d8,42,150);

    camera=new THREE.PerspectiveCamera(
      CONFIG.camera.normalFov,
      window.innerWidth/window.innerHeight,
      .1,
      220
    );

    renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderHost.appendChild(renderer.domElement);

    clock=new THREE.Clock();

    createLighting();
    track=new VocabRacer.Track(scene,CONFIG);
    player=new VocabRacer.PlayerCar(scene,CONFIG,track);
    hud=new VocabRacer.HUD();
    vocab=new VocabRacer.VocabEngine();

    createSkyDecor();
    resetCamera();

    window.addEventListener("resize",onResize);
  }

  function createLighting(){
    scene.add(new THREE.AmbientLight(0xffe0cf,1.25));

    const sun=new THREE.DirectionalLight(0xffd2a8,2.15);
    sun.position.set(-14,20,10);
    sun.castShadow=true;
    sun.shadow.mapSize.set(1024,1024);
    sun.shadow.camera.left=-24;
    sun.shadow.camera.right=24;
    sun.shadow.camera.top=20;
    sun.shadow.camera.bottom=-16;
    scene.add(sun);

    scene.add(new THREE.HemisphereLight(0xaad9ff,0x4d3b2b,.65));
  }

  function createSkyDecor(){
    const sunDisc=new THREE.Mesh(
      new THREE.SphereGeometry(3.8,18,12),
      new THREE.MeshBasicMaterial({color:0xffe1a1})
    );
    sunDisc.position.set(-34,20,-120);
    scene.add(sunDisc);

    for(let i=0;i<8;i++){
      const cloud=new THREE.Group();
      for(let j=0;j<3;j++){
        const puff=new THREE.Mesh(
          new THREE.SphereGeometry(1.5+j*.25,8,6),
          new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.45})
        );
        puff.position.set(j*1.6,Math.sin(j)*.3,0);
        cloud.add(puff);
      }
      cloud.position.set(-32+i*9,12+(i%3)*1.5,-45-i*11);
      scene.add(cloud);
    }
  }

  function createAiCars(){
    aiCars.forEach(ai=>scene.remove(ai.group));
    aiCars=[];

    const diff=CONFIG.difficulty[currentDifficulty];
    const colors=[0x39d884,0x4b83ff,0xffc347,0xb366ff,0x28c7d7];

    for(let i=0;i<CONFIG.ai.count;i++){
      aiCars.push(new VocabRacer.AICar(scene,CONFIG,track,{
        name:CONFIG.ai.names[i]||`AI-${i+1}`,
        color:colors[i%colors.length],
        lane:i%CONFIG.laneCount,
        distance:18-i*12,
        speedBase:diff.aiSpeed+(i-1.5)*.12,
        variation:diff.aiVariation,
        seed:i*.77
      }));
    }
  }

  async function startRace(){
    sound.resume();
    currentDifficulty=difficultySelect.value||"normal";
    const setId=vocabSetSelect.value||"environment";

    try{
      await vocab.loadSet(setId);
      vocab.prepareRound({difficulty:currentDifficulty,count:CONFIG.questionsPerRace});
    }catch(error){
      showBootError(error?.message||String(error));
      return;
    }

    resetRaceState();
    createAiCars();

    startScreen.classList.add("hidden");
    finishScreen.classList.add("hidden");
    running=true;
    gateDelay=.65;
    hud.flash("3 · 2 · 1 · GO!","good",900);
  }

  function resetRaceState(){
    score=0;
    combo=0;
    raceTime=0;
    finished=false;
    currentGate=null;
    gateDelay=0;

    player.distance=0;
    player.speed=0;
    player.lane=1;
    player.nitroTimer=0;
    player.slowTimer=0;
    player.group.position.set(track.laneX(0,1),0,4);
    player.group.rotation.set(0,0,0);

    lastPlayerDistance=0;
    hud.hideQuestion();
    speedFx.classList.remove("active");
    damageFx.classList.remove("active");
    resetCamera();
  }

  function resetCamera(){
    const x=player?.group?.position?.x||0;
    camera.position.set(x,CONFIG.camera.height,CONFIG.camera.distance);
    camera.fov=CONFIG.camera.normalFov;
    camera.updateProjectionMatrix();
    camera.lookAt(x,.8,-CONFIG.camera.lookAhead);
  }

  function animate(){
    requestAnimationFrame(animate);
    if(!clock||!renderer) return;

    const dt=Math.min(clock.getDelta(),.033);

    if(running&&!finished){
      updateGame(dt);
    }else{
      track.update(player.distance);
      updateCamera(dt);
    }

    renderer.render(scene,camera);
  }

  function updateGame(dt){
    raceTime+=dt;
    lastPlayerDistance=player.distance;

    const speed=player.update(dt);
    track.update(player.distance);

    aiCars.forEach(ai=>{
      const previousGap=lastPlayerDistance-ai.distance;
      ai.update(dt,player.distance);
      const currentGap=player.distance-ai.distance;

      if(player.isNitroActive()&&previousGap<=0&&currentGap>0){
        hud.showOvertake(ai.name);
        sound.overtake();
      }
    });

    updateGate(dt);
    updateCamera(dt);

    const rank=getPlayerRank();
    const progress=Math.min(1,player.distance/CONFIG.finishDistance);

    hud.updateRace({
      speed,
      rank,
      totalCars:aiCars.length+1,
      progress,
      nitroRatio:player.nitroRatio()
    });

    hud.setActiveLane(player.lane);
    speedFx.classList.toggle("active",player.isNitroActive());

    if(player.distance>=CONFIG.finishDistance){
      finishRace();
    }
  }

  function updateCamera(dt){
    const targetX=player.group.position.x;
    const nitro=player.isNitroActive();
    const lateralTilt=player.group.rotation.z*.9;

    camera.position.x=THREE.MathUtils.lerp(
      camera.position.x,
      targetX+lateralTilt,
      1-Math.exp(-5.3*dt)
    );

    camera.position.y=THREE.MathUtils.lerp(
      camera.position.y,
      CONFIG.camera.height+(nitro?.12:0),
      1-Math.exp(-3.5*dt)
    );

    camera.position.z=THREE.MathUtils.lerp(
      camera.position.z,
      CONFIG.camera.distance-(nitro?.45:0),
      1-Math.exp(-3.2*dt)
    );

    const targetFov=nitro?CONFIG.camera.nitroFov:CONFIG.camera.normalFov;
    camera.fov=THREE.MathUtils.lerp(camera.fov,targetFov,1-Math.exp(-5*dt));
    camera.updateProjectionMatrix();

    const lookDistance=player.distance+CONFIG.camera.lookAhead;
    camera.lookAt(track.centerAt(lookDistance),.9,-CONFIG.camera.lookAhead);
  }

  function spawnGate(){
    const item=vocab.next();

    if(!item){
      currentGate=null;
      hud.hideQuestion();
      return;
    }

    const diff=CONFIG.difficulty[currentDifficulty];

    currentGate={
      item,
      distance:player.distance+CONFIG.gate.spawnDistance,
      remaining:diff.gateTime,
      totalTime:diff.gateTime,
      resolved:false,
      group:createGateGroup(item)
    };

    scene.add(currentGate.group);
    hud.showQuestion(item,currentGate.totalTime);
  }

  function createGateGroup(item){
    const group=new THREE.Group();

    item.gateOptions.forEach((answer,lane)=>{
      const portal=createPortal(answer,lane);
      portal.userData.answer=answer;
      portal.userData.lane=lane;
      group.add(portal);
    });

    return group;
  }

  function createPortal(answer,lane){
    const group=new THREE.Group();
    const frameMat=new THREE.MeshStandardMaterial({color:0x162338,roughness:.38,metalness:.38});
    const neonMat=new THREE.MeshStandardMaterial({color:0x64e7ff,emissive:0x1e9cc5,emissiveIntensity:2.0,roughness:.22});

    const postGeo=new THREE.BoxGeometry(.16,3.5,.18);
    const left=new THREE.Mesh(postGeo,frameMat);
    const right=new THREE.Mesh(postGeo,frameMat);
    left.position.set(-1.28,1.75,0);
    right.position.set(1.28,1.75,0);

    const arch=new THREE.Mesh(new THREE.TorusGeometry(1.28,.11,8,24,Math.PI),neonMat);
    arch.position.set(0,2.55,0);
    arch.rotation.z=Math.PI;

    const sign=new THREE.Mesh(
      new THREE.PlaneGeometry(2.42,.92),
      new THREE.MeshBasicMaterial({map:createTextTexture(answer),side:THREE.DoubleSide})
    );
    sign.position.set(0,1.9,.08);

    group.add(left,right,arch,sign);
    group.position.x=track.laneOffset(lane);
    return group;
  }

  function createTextTexture(text){
    const canvas=document.createElement("canvas");
    canvas.width=1024;
    canvas.height=400;
    const ctx=canvas.getContext("2d");

    const gradient=ctx.createLinearGradient(0,0,1024,400);
    gradient.addColorStop(0,"#07162b");
    gradient.addColorStop(1,"#122f51");
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="#63e5ff";
    ctx.lineWidth=16;
    ctx.shadowColor="#4cdfff";
    ctx.shadowBlur=24;
    ctx.strokeRect(12,12,1000,376);
    ctx.shadowBlur=0;

    ctx.fillStyle="#ffffff";
    ctx.font="800 62px Arial, sans-serif";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    wrapCanvasText(ctx,text,512,200,880,72);

    const texture=new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace;
    return texture;
  }

  function wrapCanvasText(ctx,text,cx,cy,maxWidth,lineHeight){
    const words=String(text).split(" ");
    const lines=[];
    let line="";

    words.forEach(word=>{
      const test=line?`${line} ${word}`:word;
      if(ctx.measureText(test).width>maxWidth&&line){
        lines.push(line);
        line=word;
      }else{
        line=test;
      }
    });

    if(line) lines.push(line);
    const visible=lines.slice(0,3);
    const y0=cy-(visible.length-1)*lineHeight/2;
    visible.forEach((value,index)=>ctx.fillText(value,cx,y0+index*lineHeight));
  }

  function updateGate(dt){
    if(!currentGate){
      gateDelay-=dt;
      if(gateDelay<=0) spawnGate();
      return;
    }

    const gate=currentGate;
    const relative=gate.distance-player.distance;

    gate.group.position.set(track.centerAt(gate.distance),0,4-relative);
    gate.group.rotation.y=track.headingAt(gate.distance);

    if(!gate.resolved){
      gate.remaining-=dt;
      hud.updateQuestionTimer(gate.remaining,gate.totalTime);

      if(gate.remaining<=0){
        resolveGate(null,true);
      }else if(relative<=1.4){
        const selected=gate.item.gateOptions[player.lane];
        resolveGate(selected,false);
      }
    }

    if(relative<-14){
      disposeObject(gate.group);
      currentGate=null;
      gateDelay=CONFIG.gate.nextDelay;
    }
  }

  function resolveGate(selected,timeout){
    if(!currentGate||currentGate.resolved) return;

    currentGate.resolved=true;
    const item=currentGate.item;
    const isCorrect=!timeout&&selected===item.correct;
    const elapsed=currentGate.totalTime-Math.max(0,currentGate.remaining);

    vocab.record(item,timeout?null:selected,isCorrect,elapsed);

    if(isCorrect){
      combo++;
      score+=120+(combo-1)*18;
      player.triggerNitro();
      hud.flash("ĐÚNG! NITRO BOOST +120","good");
      sound.correct();
      sound.nitro();
      pulseCamera();
    }else{
      combo=0;
      score=Math.max(0,score-(timeout?10:20));
      player.applyWrongPenalty();
      hud.flash(
        timeout?`HẾT GIỜ · Đáp án: ${item.correct}`:`CHƯA ĐÚNG · Đáp án: ${item.correct}`,
        "bad",
        1350
      );
      sound.wrong();
      triggerDamageFx();
    }

    setTimeout(()=>hud.hideQuestion(),600);
  }

  function pulseCamera(){
    const start=performance.now();
    const tick=now=>{
      const p=Math.min(1,(now-start)/260);
      camera.position.y+=Math.sin(p*Math.PI*6)*(1-p)*.018;
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function triggerDamageFx(){
    damageFx.classList.add("active");
    gameEl.classList.remove("shake");
    void gameEl.offsetWidth;
    gameEl.classList.add("shake");
    setTimeout(()=>{
      damageFx.classList.remove("active");
      gameEl.classList.remove("shake");
    },380);
  }

  function getPlayerRank(){
    return 1+aiCars.filter(ai=>ai.distance>player.distance).length;
  }

  function finishRace(){
    if(finished) return;

    finished=true;
    running=false;

    if(currentGate?.group){
      disposeObject(currentGate.group);
      currentGate=null;
    }

    hud.hideQuestion();
    speedFx.classList.remove("active");

    const rank=getPlayerRank();
    const learning=vocab.getSummary();
    const rankBonus=Math.max(0,(aiCars.length+1-rank)*80);
    const accuracyBonus=learning.correct*35;
    score+=rankBonus+accuracyBonus;

    const summary=vocab.saveSession({
      rank,
      totalCars:aiCars.length+1,
      time:raceTime,
      score,
      difficulty:currentDifficulty
    });

    hud.showFinish({
      rank,
      totalCars:aiCars.length+1,
      time:raceTime,
      score,
      learning:summary
    });

    sound.finish();
  }

  function bindControls(){
    document.getElementById("startBtn").addEventListener("click",startRace);

    document.getElementById("restartBtn").addEventListener("click",()=>{
      finishScreen.classList.add("hidden");
      startRace();
    });

    document.getElementById("changeSetBtn").addEventListener("click",()=>{
      finishScreen.classList.add("hidden");
      startScreen.classList.remove("hidden");
    });

    document.getElementById("leftBtn").addEventListener("click",()=>moveLane(-1));
    document.getElementById("rightBtn").addEventListener("click",()=>moveLane(1));

    window.addEventListener("keydown",event=>{
      if(!running) return;
      const key=event.key.toLowerCase();

      if(key==="arrowleft"||key==="a"){
        event.preventDefault();
        moveLane(-1);
      }

      if(key==="arrowright"||key==="d"){
        event.preventDefault();
        moveLane(1);
      }
    });

    renderer.domElement.addEventListener("pointerdown",event=>{
      touchStartX=event.clientX;
    },{passive:true});

    renderer.domElement.addEventListener("pointerup",event=>{
      if(touchStartX===null||!running) return;
      const dx=event.clientX-touchStartX;
      if(Math.abs(dx)>36) moveLane(dx<0?-1:1);
      touchStartX=null;
    },{passive:true});
  }

  function moveLane(direction){
    if(!running||finished) return;
    player.changeLane(direction);
    hud.setActiveLane(player.lane);
    sound.lane();
  }

  function disposeObject(object){
    if(!object) return;

    object.traverse(child=>{
      child.geometry?.dispose?.();
      if(child.material){
        const materials=Array.isArray(child.material)?child.material:[child.material];
        materials.forEach(material=>{
          material.map?.dispose?.();
          material.dispose?.();
        });
      }
    });

    scene.remove(object);
  }

  function onResize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
  }

  function showBootError(message){
    console.error(message);
    bootError.textContent=String(message);
    bootError.classList.remove("hidden");
  }

  function createSoundFx(){
    let ctx=null;

    const ensure=()=>{
      if(!ctx) ctx=new (window.AudioContext||window.webkitAudioContext)();
      return ctx;
    };

    const tone=(frequency,duration,type="sine",gain=.035,slide=0)=>{
      try{
        const c=ensure();
        const osc=c.createOscillator();
        const amp=c.createGain();
        osc.type=type;
        osc.frequency.setValueAtTime(frequency,c.currentTime);

        if(slide){
          osc.frequency.exponentialRampToValueAtTime(
            Math.max(20,frequency+slide),
            c.currentTime+duration
          );
        }

        amp.gain.setValueAtTime(gain,c.currentTime);
        amp.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);
        osc.connect(amp);
        amp.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime+duration);
      }catch(error){}
    };

    return {
      resume(){ try{ const c=ensure(); if(c.state==="suspended") c.resume(); }catch(error){} },
      lane(){ tone(290,.07,"triangle",.025,70); },
      correct(){ tone(620,.11,"sine",.04,180); setTimeout(()=>tone(820,.12,"sine",.035,120),75); },
      wrong(){ tone(170,.2,"sawtooth",.035,-60); },
      nitro(){ tone(240,.34,"sawtooth",.022,900); },
      overtake(){ tone(520,.09,"triangle",.025,240); },
      finish(){ tone(520,.16,"sine",.04,180); setTimeout(()=>tone(720,.18,"sine",.04,240),130); }
    };
  }
})();
