window.VocabRacer = window.VocabRacer || {};

VocabRacer.PlayerCar = class {
  constructor(scene, config, track){
    this.scene=scene;
    this.config=config;
    this.track=track;
    this.distance=0;
    this.lane=1;
    this.speed=0;
    this.nitroTimer=0;
    this.slowTimer=0;
    this.group=this.createModel();
    this.group.position.z=4;
    this.scene.add(this.group);
  }

  createModel(){
    const group=new THREE.Group();
    const red=new THREE.MeshStandardMaterial({color:0xff365d,roughness:.32,metalness:.3});
    const redDark=new THREE.MeshStandardMaterial({color:0xa31334,roughness:.4,metalness:.25});
    const dark=new THREE.MeshStandardMaterial({color:0x11151d,roughness:.82});
    const glass=new THREE.MeshStandardMaterial({color:0x6bd3ff,roughness:.12,metalness:.18});

    const body=new THREE.Mesh(new THREE.BoxGeometry(1.7,.5,3.1),red);
    body.position.y=.48; body.castShadow=true; group.add(body);

    const hood=new THREE.Mesh(new THREE.BoxGeometry(1.5,.22,.95),redDark);
    hood.position.set(0,.73,-1.1); hood.castShadow=true; group.add(hood);

    const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.22,.62,1.35),glass);
    cabin.position.set(0,.95,.15); cabin.castShadow=true; group.add(cabin);

    const spoiler=new THREE.Mesh(new THREE.BoxGeometry(1.5,.12,.28),dark);
    spoiler.position.set(0,.88,1.43); group.add(spoiler);

    const wheelGeo=new THREE.CylinderGeometry(.31,.31,.24,12);
    const wheels=[];
    [[-.88,.26,-.9],[.88,.26,-.9],[-.88,.26,.9],[.88,.26,.9]].forEach(pos=>{
      const wheel=new THREE.Mesh(wheelGeo,dark);
      wheel.rotation.z=Math.PI/2;
      wheel.position.set(...pos);
      wheel.castShadow=true;
      wheels.push(wheel);
      group.add(wheel);
    });

    const glowMat=new THREE.MeshBasicMaterial({color:0x65eaff});
    [-.42,.42].forEach(x=>{
      const emitter=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,.18,8),glowMat);
      emitter.rotation.x=Math.PI/2;
      emitter.position.set(x,.34,1.62);
      group.add(emitter);
    });

    group.userData.wheels=wheels;
    group.scale.setScalar(.98);
    return group;
  }

  setLane(lane){
    this.lane=THREE.MathUtils.clamp(lane,0,this.config.laneCount-1);
  }

  changeLane(direction){ this.setLane(this.lane+direction); }
  triggerNitro(){ this.nitroTimer=this.config.player.nitroDuration; this.slowTimer=0; }
  applyWrongPenalty(){ this.nitroTimer=0; this.slowTimer=this.config.player.wrongDuration; }
  isNitroActive(){ return this.nitroTimer>0; }

  update(dt){
    this.nitroTimer=Math.max(0,this.nitroTimer-dt);
    this.slowTimer=Math.max(0,this.slowTimer-dt);

    let targetSpeed=this.config.player.baseSpeed;
    if(this.nitroTimer>0) targetSpeed+=this.config.player.nitroBonus;
    if(this.slowTimer>0) targetSpeed-=this.config.player.wrongPenalty;

    this.speed=THREE.MathUtils.lerp(this.speed,targetSpeed,1-Math.pow(.0028,dt));
    this.distance+=this.speed*dt;

    const targetX=this.track.laneX(this.distance,this.lane);
    const previousX=this.group.position.x;

    this.group.position.x=THREE.MathUtils.lerp(
      this.group.position.x,
      targetX,
      1-Math.exp(-this.config.player.laneChangeSharpness*dt)
    );

    const lateralVelocity=this.group.position.x-previousX;
    this.group.rotation.z=THREE.MathUtils.lerp(this.group.rotation.z,-lateralVelocity*2.8,.16);
    this.group.rotation.y=THREE.MathUtils.lerp(this.group.rotation.y,this.track.headingAt(this.distance),.12);

    this.group.userData.wheels.forEach(w=>{ w.rotation.x-=this.speed*dt*1.8; });
    return this.speed;
  }

  nitroRatio(){
    return this.nitroTimer>0 ? this.nitroTimer/this.config.player.nitroDuration : 0;
  }
};
