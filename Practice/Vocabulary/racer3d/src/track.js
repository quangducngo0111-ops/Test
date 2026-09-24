window.VocabRacer = window.VocabRacer || {};

VocabRacer.Track = class {
  constructor(scene, config){
    this.scene = scene;
    this.config = config;
    this.chunkLength = 12;
    this.chunkCount = 28;
    this.chunks = [];
    this.finishArch = null;

    this.roadMat = new THREE.MeshStandardMaterial({color:0x2f3440,roughness:.94});
    this.edgeMat = new THREE.MeshStandardMaterial({color:0xe7e9ee,roughness:.65});
    this.dashMat = new THREE.MeshStandardMaterial({color:0xf7f0cf,emissive:0x33280f,emissiveIntensity:.18});

    this.createGround();
    this.createChunks();
    this.createFinishArch();
  }

  centerAt(distance){
    return Math.sin(distance / 165) * 4.2 + Math.sin(distance / 410) * 2.7;
  }

  headingAt(distance){
    const step = 3;
    const dx = this.centerAt(distance + step) - this.centerAt(distance - step);
    return -Math.atan2(dx, step * 2);
  }

  laneOffset(lane){
    return (lane - 1) * this.config.laneWidth;
  }

  laneX(distance, lane){
    return this.centerAt(distance) + this.laneOffset(lane);
  }

  createGround(){
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(180, 320),
      new THREE.MeshStandardMaterial({color:0x243023,roughness:1})
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0,-.08,-130);
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.ground = ground;
  }

  createChunks(){
    for(let i=0;i<this.chunkCount;i++){
      const group = new THREE.Group();

      const road = new THREE.Mesh(
        new THREE.BoxGeometry(this.config.roadWidth,.12,this.chunkLength+.45),
        this.roadMat
      );
      road.receiveShadow = true;
      group.add(road);

      [-this.config.laneWidth/2, this.config.laneWidth/2].forEach(x=>{
        const dash = new THREE.Mesh(new THREE.BoxGeometry(.10,.035,3.7),this.dashMat);
        dash.position.set(x,.09,0);
        group.add(dash);
      });

      [-1,1].forEach(side=>{
        const edge = new THREE.Mesh(
          new THREE.BoxGeometry(.22,.18,this.chunkLength+.25),
          this.edgeMat
        );
        edge.position.set(side*(this.config.roadWidth/2+.12),.08,0);
        group.add(edge);

        const prop = this.createRoadsideProp(i,side);
        prop.position.x = side*(this.config.roadWidth/2+4.2+(i%3));
        group.add(prop);
      });

      this.scene.add(group);
      this.chunks.push({group,absoluteIndex:null});
    }
  }

  createRoadsideProp(index, side){
    const group = new THREE.Group();

    if(index % 3 !== 1){
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(.16,.23,1.6,6),
        new THREE.MeshStandardMaterial({color:0x68442f,roughness:1})
      );
      trunk.position.y=.8;

      const crown = new THREE.Mesh(
        new THREE.ConeGeometry(1.1,2.6,6),
        new THREE.MeshStandardMaterial({color:index%2?0x37573e:0x426948,roughness:.95})
      );
      crown.position.y=2.5;
      group.add(trunk,crown);
    }else{
      const height = 4.2+(index%5);
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(2.8,height,2.8),
        new THREE.MeshStandardMaterial({color:index%2?0x35425b:0x4b5269,roughness:.82})
      );
      building.position.y=height/2;
      building.castShadow=true;
      group.add(building);

      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(2.35,.14,.07),
        new THREE.MeshStandardMaterial({color:0x5fe3ff,emissive:0x1a83b7,emissiveIntensity:1.4})
      );
      strip.position.set(0,2.1,-1.43);
      group.add(strip);
    }

    if(index % 4 === 0){
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(.045,.06,4.3,6),
        new THREE.MeshStandardMaterial({color:0x343945,roughness:.65})
      );
      pole.position.set(side*-1.3,2.15,0);

      const light = new THREE.Mesh(
        new THREE.SphereGeometry(.13,8,6),
        new THREE.MeshStandardMaterial({color:0xffd78c,emissive:0xff8e2e,emissiveIntensity:2})
      );
      light.position.set(side*-1.3,4.25,0);
      group.add(pole,light);
    }

    return group;
  }

  createFinishArch(){
    const group = new THREE.Group();
    const dark = new THREE.MeshStandardMaterial({color:0x111623,roughness:.45,metalness:.35});
    const glow = new THREE.MeshStandardMaterial({color:0xffffff,emissive:0x6f7cff,emissiveIntensity:1.5});

    [-4.7,4.7].forEach(x=>{
      const post = new THREE.Mesh(new THREE.BoxGeometry(.28,5.8,.28),dark);
      post.position.set(x,2.9,0);
      group.add(post);
    });

    const top = new THREE.Mesh(new THREE.BoxGeometry(9.7,.42,.42),dark);
    top.position.set(0,5.7,0);
    group.add(top);

    for(let i=0;i<10;i++){
      const tile = new THREE.Mesh(new THREE.BoxGeometry(.78,.22,.08),i%2?dark:glow);
      tile.position.set(-3.55+i*.79,5.7,-.24);
      group.add(tile);
    }

    this.scene.add(group);
    this.finishArch = group;
  }

  update(playerDistance){
    const baseIndex = Math.floor(playerDistance / this.chunkLength) - 2;

    this.chunks.forEach((chunk,poolIndex)=>{
      const absoluteIndex = baseIndex + poolIndex;
      chunk.absoluteIndex = absoluteIndex;
      const distance = absoluteIndex * this.chunkLength;
      const relative = distance - playerDistance;

      chunk.group.position.set(this.centerAt(distance),0,4-relative);
      chunk.group.rotation.y = this.headingAt(distance);
    });

    const finishDistance = this.config.finishDistance;
    const finishRelative = finishDistance-playerDistance;
    this.finishArch.position.set(this.centerAt(finishDistance),0,4-finishRelative);
    this.finishArch.rotation.y = this.headingAt(finishDistance);
    this.finishArch.visible = finishRelative < 230;
  }
};
