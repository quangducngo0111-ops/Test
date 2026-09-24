window.VocabRacer = window.VocabRacer || {};

VocabRacer.AICar = class {
  constructor(scene, config, track, options){
    this.scene=scene;
    this.config=config;
    this.track=track;
    this.name=options.name;
    this.color=options.color;
    this.lane=options.lane;
    this.distance=options.distance;
    this.speedBase=options.speedBase;
    this.variation=options.variation;
    this.seed=options.seed||0;
    this.speed=this.speedBase;
    this.laneTimer=1.7+Math.random()*2.7;
    this.group=this.createModel(this.color);
    this.scene.add(this.group);
  }

  createModel(color){
    const group=new THREE.Group();
    const bodyMat=new THREE.MeshStandardMaterial({color,roughness:.36,metalness:.22});
    const dark=new THREE.MeshStandardMaterial({color:0x11151d,roughness:.82});
    const glass=new THREE.MeshStandardMaterial({color:0x79cbe9,roughness:.13,metalness:.15});

    const body=new THREE.Mesh(new THREE.BoxGeometry(1.58,.48,2.85),bodyMat);
    body.position.y=.45; body.castShadow=true; group.add(body);

    const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.1,.56,1.18),glass);
    cabin.position.set(0,.88,.12); group.add(cabin);

    const wheelGeo=new THREE.CylinderGeometry(.28,.28,.22,10);
    [[-.82,.24,-.82],[.82,.24,-.82],[-.82,.24,.82],[.82,.24,.82]].forEach(p=>{
      const w=new THREE.Mesh(wheelGeo,dark);
      w.rotation.z=Math.PI/2;
      w.position.set(...p);
      group.add(w);
    });

    group.scale.setScalar(.93);
    return group;
  }

  update(dt,playerDistance){
    this.laneTimer-=dt;
    if(this.laneTimer<=0){
      this.laneTimer=2.2+Math.random()*3.5;
      if(Math.random()<.58){
        const direction=Math.random()<.5?-1:1;
        this.lane=THREE.MathUtils.clamp(this.lane+direction,0,this.config.laneCount-1);
      }
    }

    const wave=Math.sin((performance.now()*.0015)+this.seed)*this.variation;
    this.speed=THREE.MathUtils.lerp(this.speed,this.speedBase+wave,Math.min(1,dt*1.4));
    this.distance+=this.speed*dt;

    const relative=this.distance-playerDistance;
    const targetX=this.track.laneX(this.distance,this.lane);

    this.group.position.x=THREE.MathUtils.lerp(this.group.position.x,targetX,1-Math.exp(-5.4*dt));
    this.group.position.z=4-relative;
    this.group.position.y=Math.sin(performance.now()*.006+this.seed)*.018;
    this.group.rotation.y=THREE.MathUtils.lerp(this.group.rotation.y,this.track.headingAt(this.distance),.12);
    this.group.visible=relative>-70 && relative<18;
  }
};
