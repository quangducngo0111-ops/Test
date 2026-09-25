window.VocabRacer = window.VocabRacer || {};

VocabRacer.Track = class {

  constructor(scene, config) {

    this.scene = scene;
    this.config = config;

    this.junctionDistances = [];


    /* =====================================================
       MATERIALS
    ====================================================== */

    this.roadMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x30343c,
        roughness: 0.96
      });


    this.branchMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x363b45,
        roughness: 0.96
      });


    this.lineMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xf6e8bd,
        roughness: 0.72
      });


    this.edgeMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xe7e1db,
        roughness: 0.72
      });


    /* =====================================================
       BIG MAP CURVE
    ====================================================== */

    this.curve =
      this.createMainCurve();


    this.length =
      this.curve.getLength();


    /* =====================================================
       WORLD
    ====================================================== */

    this.createGround();

    this.createRoad();

    this.createBranches();

    this.createScenery();

    this.createFinishArch();

  }


  /* =========================================================
     MAIN MAP

     Đây là bản đồ lớn, không phải một đoạn road lặp vô hạn.
  ========================================================= */

  createMainCurve() {

    const points = [

      [0, 0, 0],

      [0, 0, 220],

      [38, 0, 420],

      [125, 0, 640],

      [165, 0, 820],

      [115, 0, 1000],

      [10, 0, 1190],

      [-115, 0, 1380],

      [-180, 0, 1580],

      [-140, 0, 1770],

      [-25, 0, 1960],

      [125, 0, 2170],

      [195, 0, 2380],

      [170, 0, 2550],

      [65, 0, 2740],

      [-90, 0, 2940],

      [-165, 0, 3160],

      [-110, 0, 3350],

      [5, 0, 3530],

      [125, 0, 3690]

    ].map(
      item =>
        new THREE.Vector3(
          item[0],
          item[1],
          item[2]
        )
    );


    return new THREE.CatmullRomCurve3(
      points,
      false,
      "centripetal",
      0.25
    );

  }


  /* =========================================================
     CORE FUNCTION

     game.js hiện tại bắt buộc phải có hàm này.
  ========================================================= */

  getFrame(distance) {

    const safeDistance =
      THREE.MathUtils.clamp(
        distance,
        0,
        this.length
      );


    const u =
      this.length > 0
        ? safeDistance / this.length
        : 0;


    const point =
      this.curve
        .getPointAt(u);


    const tangent =
      this.curve
        .getTangentAt(u)
        .normalize();


    /*
      Vector ngang vuông góc với hướng đường.
    */

    const normal =
      new THREE.Vector3(
        tangent.z,
        0,
        -tangent.x
      ).normalize();


    /*
      Góc quay theo đường.
    */

    const heading =
      Math.atan2(
        tangent.x,
        tangent.z
      );


    return {

      point,

      tangent,

      normal,

      heading,

      u

    };

  }


  /* =========================================================
     LANE
  ========================================================= */

  laneOffset(lane) {

    return (
      lane - 1
    ) * this.config.laneWidth;

  }


  lanePosition(
    distance,
    lane,
    lateralOverride = null
  ) {

    const frame =
      this.getFrame(
        distance
      );


    const lateral =
      lateralOverride === null
        ? this.laneOffset(lane)
        : lateralOverride;


    const position =
      frame.point
        .clone()
        .add(
          frame.normal
            .clone()
            .multiplyScalar(
              lateral
            )
        );


    return {

      ...frame,

      position

    };

  }


  /* =========================================================
     GROUND
  ========================================================= */

  createGround() {

    const geometry =
      new THREE.PlaneGeometry(
        5600,
        5600
      );


    const material =
      new THREE.MeshStandardMaterial({
        color: 0x263421,
        roughness: 1
      });


    const ground =
      new THREE.Mesh(
        geometry,
        material
      );


    ground.rotation.x =
      -Math.PI / 2;


    ground.position.set(
      0,
      -0.18,
      1850
    );


    this.scene.add(
      ground
    );

  }


  /* =========================================================
     ROAD RIBBON
  ========================================================= */

  createRibbon(
    curve,
    width,
    material,
    y = 0.01
  ) {

    const length =
      curve.getLength();


    const segments =
      Math.max(
        80,
        Math.ceil(
          length / 7
        )
      );


    const positions = [];

    const indices = [];


    for (
      let i = 0;
      i <= segments;
      i++
    ) {

      const u =
        i / segments;


      const point =
        curve.getPointAt(u);


      const tangent =
        curve
          .getTangentAt(u)
          .normalize();


      const normal =
        new THREE.Vector3(
          tangent.z,
          0,
          -tangent.x
        ).normalize();


      const left =
        point
          .clone()
          .add(
            normal
              .clone()
              .multiplyScalar(
                width / 2
              )
          );


      const right =
        point
          .clone()
          .add(
            normal
              .clone()
              .multiplyScalar(
                -width / 2
              )
          );


      positions.push(

        left.x,
        y,
        left.z,

        right.x,
        y,
        right.z

      );


      if (
        i < segments
      ) {

        const a =
          i * 2;

        const b =
          a + 1;

        const c =
          a + 2;

        const d =
          a + 3;


        indices.push(

          a,
          b,
          c,

          b,
          d,
          c

        );

      }

    }


    const geometry =
      new THREE.BufferGeometry();


    geometry.setAttribute(

      "position",

      new THREE.Float32BufferAttribute(
        positions,
        3
      )

    );


    geometry.setIndex(
      indices
    );


    geometry.computeVertexNormals();


    return new THREE.Mesh(
      geometry,
      material
    );

  }


  /* =========================================================
     MAIN ROAD
  ========================================================= */

  createRoad() {

    const road =
      this.createRibbon(

        this.curve,

        this.config.roadWidth,

        this.roadMaterial,

        0.01

      );


    this.scene.add(
      road
    );


    this.createLaneMarkers();

    this.createRoadEdges();

  }


  /* =========================================================
     LANE MARKERS
  ========================================================= */

  createLaneMarkers() {

    const spacing =
      15;


    const estimated =
      Math.floor(
        this.length / spacing
      ) * 2;


    const geometry =
      new THREE.BoxGeometry(
        0.10,
        0.025,
        5.2
      );


    const mesh =
      new THREE.InstancedMesh(

        geometry,

        this.lineMaterial,

        estimated

      );


    const dummy =
      new THREE.Object3D();


    let index = 0;


    for (
      let distance = 12;
      distance < this.length;
      distance += spacing
    ) {

      const frame =
        this.getFrame(
          distance
        );


      const offsets = [

        -this.config.laneWidth / 2,

        this.config.laneWidth / 2

      ];


      for (
        const offset
        of
        offsets
      ) {

        dummy.position.copy(

          frame.point
            .clone()
            .add(

              frame.normal
                .clone()
                .multiplyScalar(
                  offset
                )

            )

        );


        dummy.position.y =
          0.055;


        dummy.rotation.set(

          0,

          frame.heading,

          0

        );


        dummy.scale.set(
          1,
          1,
          1
        );


        dummy.updateMatrix();


        mesh.setMatrixAt(
          index,
          dummy.matrix
        );


        index++;

      }

    }


    mesh.count =
      index;


    mesh.instanceMatrix.needsUpdate =
      true;


    this.scene.add(
      mesh
    );

  }


  /* =========================================================
     ROAD EDGES
  ========================================================= */

  createRoadEdges() {

    const spacing =
      11;


    const estimated =
      Math.floor(
        this.length / spacing
      ) * 2;


    const geometry =
      new THREE.BoxGeometry(
        0.17,
        0.035,
        6.6
      );


    const mesh =
      new THREE.InstancedMesh(

        geometry,

        this.edgeMaterial,

        estimated

      );


    const dummy =
      new THREE.Object3D();


    let index = 0;


    for (
      let distance = 6;
      distance < this.length;
      distance += spacing
    ) {

      const frame =
        this.getFrame(
          distance
        );


      const offsets = [

        this.config.roadWidth / 2 - 0.15,

        -this.config.roadWidth / 2 + 0.15

      ];


      for (
        const offset
        of
        offsets
      ) {

        dummy.position.copy(

          frame.point
            .clone()
            .add(

              frame.normal
                .clone()
                .multiplyScalar(
                  offset
                )

            )

        );


        dummy.position.y =
          0.06;


        dummy.rotation.set(

          0,

          frame.heading,

          0

        );


        dummy.scale.set(
          1,
          1,
          1
        );


        dummy.updateMatrix();


        mesh.setMatrixAt(
          index,
          dummy.matrix
        );


        index++;

      }

    }


    mesh.count =
      index;


    mesh.instanceMatrix.needsUpdate =
      true;


    this.scene.add(
      mesh
    );

  }


  /* =========================================================
     BRANCH ROADS / JUNCTIONS

     Hiện các đường này tạo map thực sự lớn hơn và cho cảm giác
     có hệ thống đường, chưa phải route-select gameplay.
  ========================================================= */

  createBranches() {

    const branches = [

      {
        distance: 680,
        side: 1,
        label: "RIVERSIDE"
      },

      {
        distance: 1580,
        side: -1,
        label: "OLD TOWN"
      },

      {
        distance: 2480,
        side: 1,
        label: "HILLS"
      }

    ];


    for (
      const spec
      of
      branches
    ) {

      this.createBranch(
        spec
      );

    }

  }


  createBranch(spec) {

    const start =
      this.getFrame(
        spec.distance
      );


    const returnDistance =
      Math.min(

        this.length - 100,

        spec.distance + 330

      );


    const end =
      this.getFrame(
        returnDistance
      );


    const side =
      spec.side;


    const p0 =
      start.point.clone();


    const p4 =
      end.point.clone();


    const p1 =
      p0
        .clone()
        .add(
          start.tangent
            .clone()
            .multiplyScalar(
              70
            )
        )
        .add(
          start.normal
            .clone()
            .multiplyScalar(
              side * 28
            )
        );


    const p2 =
      p0
        .clone()
        .add(
          start.tangent
            .clone()
            .multiplyScalar(
              155
            )
        )
        .add(
          start.normal
            .clone()
            .multiplyScalar(
              side * 105
            )
        );


    const p3 =
      p4
        .clone()
        .add(
          end.tangent
            .clone()
            .multiplyScalar(
              -85
            )
        )
        .add(
          end.normal
            .clone()
            .multiplyScalar(
              side * 72
            )
        );


    const branchCurve =
      new THREE.CatmullRomCurve3(

        [
          p0,
          p1,
          p2,
          p3,
          p4
        ],

        false,

        "centripetal",

        0.25

      );


    const branch =
      this.createRibbon(

        branchCurve,

        8.8,

        this.branchMaterial,

        -0.005

      );


    this.scene.add(
      branch
    );


    this.createBranchCenterLine(
      branchCurve
    );


    this.junctionDistances.push(
      spec.distance
    );


    this.junctionDistances.push(
      returnDistance
    );


    this.createJunctionSign(

      spec.distance + 35,

      side,

      spec.label

    );

  }


  /* =========================================================
     BRANCH LINE
  ========================================================= */

  createBranchCenterLine(curve) {

    const count =
      Math.max(
        1,
        Math.floor(
          curve.getLength() / 15
        )
      );


    const mesh =
      new THREE.InstancedMesh(

        new THREE.BoxGeometry(
          0.10,
          0.025,
          5
        ),

        this.lineMaterial,

        count

      );


    const dummy =
      new THREE.Object3D();


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const u =
        (i + 0.5) / count;


      const point =
        curve.getPointAt(u);


      const tangent =
        curve
          .getTangentAt(u)
          .normalize();


      const heading =
        Math.atan2(
          tangent.x,
          tangent.z
        );


      dummy.position.copy(
        point
      );


      dummy.position.y =
        0.05;


      dummy.rotation.set(
        0,
        heading,
        0
      );


      dummy.scale.set(
        1,
        1,
        1
      );


      dummy.updateMatrix();


      mesh.setMatrixAt(
        i,
        dummy.matrix
      );

    }


    mesh.instanceMatrix.needsUpdate =
      true;


    this.scene.add(
      mesh
    );

  }


  /* =========================================================
     ROAD SIGNS
  ========================================================= */

  createJunctionSign(
    distance,
    side,
    label
  ) {

    const frame =
      this.getFrame(
        distance
      );


    const group =
      new THREE.Group();


    const poleMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x39424f,
        roughness: 0.7
      });


    const signMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x185ea8,
        emissive: 0x0b315a,
        emissiveIntensity: 0.45,
        roughness: 0.45
      });


    const pole =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.12,
          3.4,
          0.12
        ),

        poleMaterial

      );


    pole.position.y =
      1.7;


    const board =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          2.8,
          1.05,
          0.16
        ),

        signMaterial

      );


    board.position.y =
      3.25;


    group.add(
      pole,
      board
    );


    group.position.copy(

      frame.point
        .clone()
        .add(

          frame.normal
            .clone()
            .multiplyScalar(

              side *

              (
                this.config.roadWidth / 2
                +
                4
              )

            )

        )

    );


    group.rotation.y =
      frame.heading;


    group.userData.label =
      label;


    this.scene.add(
      group
    );

  }


  /* =========================================================
     SCENERY

     Không spawn/despawn từng chunk.
     Các object được rải một lần trên map bằng InstancedMesh.
     Nhẹ hơn và không tạo cảm giác lặp.
  ========================================================= */

  createScenery() {

    const random =
      this.seededRandom(
        20260925
      );


    this.createTrees(
      random
    );


    this.createBuildings(
      random
    );


    this.createRocks(
      random
    );


    this.createLamps(
      random
    );

  }


  /* =========================================================
     TREES
  ========================================================= */

  createTrees(random) {

    const count =
      150;


    const trunkMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x67452f,
        roughness: 1
      });


    const crownMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x3c693f,
        roughness: 1
      });


    const trunks =
      new THREE.InstancedMesh(

        new THREE.CylinderGeometry(
          0.15,
          0.22,
          1.6,
          6
        ),

        trunkMaterial,

        count

      );


    const crowns =
      new THREE.InstancedMesh(

        new THREE.ConeGeometry(
          1.15,
          2.8,
          7
        ),

        crownMaterial,

        count

      );


    const dummy =
      new THREE.Object3D();


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const distance =

        50

        +

        random()

        *

        (
          this.length - 100
        );


      const frame =
        this.getFrame(
          distance
        );


      const side =
        random() < 0.5
          ? -1
          : 1;


      const offset =

        this.config.roadWidth / 2

        +

        7

        +

        random() * 42;


      const base =

        frame.point
          .clone()
          .add(

            frame.normal
              .clone()
              .multiplyScalar(
                side * offset
              )

          )
          .add(

            frame.tangent
              .clone()
              .multiplyScalar(

                (
                  random() - 0.5
                )

                *

                16

              )

          );


      const scale =
        0.75 +
        random() * 1.35;


      /* trunk */

      dummy.position.set(

        base.x,

        0.8 * scale,

        base.z

      );


      dummy.scale.set(

        scale,

        scale,

        scale

      );


      dummy.rotation.set(

        0,

        random() *
        Math.PI *
        2,

        0

      );


      dummy.updateMatrix();


      trunks.setMatrixAt(

        i,

        dummy.matrix

      );


      /* crown */

      dummy.position.set(

        base.x,

        2.55 * scale,

        base.z

      );


      dummy.updateMatrix();


      crowns.setMatrixAt(

        i,

        dummy.matrix

      );

    }


    trunks.instanceMatrix.needsUpdate =
      true;


    crowns.instanceMatrix.needsUpdate =
      true;


    this.scene.add(

      trunks,

      crowns

    );

  }


  /* =========================================================
     BUILDINGS
  ========================================================= */

  createBuildings(random) {

    const count =
      70;


    const material =
      new THREE.MeshStandardMaterial({

        color: 0xffffff,

        roughness: 0.86,

        vertexColors: true

      });


    const buildings =
      new THREE.InstancedMesh(

        new THREE.BoxGeometry(
          1,
          1,
          1
        ),

        material,

        count

      );


    const colors = [

      0x6c7890,

      0x8a7d73,

      0x596c76,

      0x74706f,

      0x6b6380

    ];


    const dummy =
      new THREE.Object3D();


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const distance =

        this.length * 0.27

        +

        random()

        *

        (
          this.length * 0.50
        );


      const frame =
        this.getFrame(
          distance
        );


      const side =
        random() < 0.5
          ? -1
          : 1;


      const offset =

        this.config.roadWidth / 2

        +

        14

        +

        random() * 60;


      const base =

        frame.point
          .clone()
          .add(

            frame.normal
              .clone()
              .multiplyScalar(
                side * offset
              )

          );


      const sx =
        5 + random() * 11;


      const sy =
        8 + random() * 25;


      const sz =
        5 + random() * 11;


      dummy.position.set(

        base.x,

        sy / 2 - 0.08,

        base.z

      );


      dummy.scale.set(

        sx,

        sy,

        sz

      );


      dummy.rotation.set(

        0,

        frame.heading
        +
        (
          random() - 0.5
        )
        *
        0.8,

        0

      );


      dummy.updateMatrix();


      buildings.setMatrixAt(

        i,

        dummy.matrix

      );


      buildings.setColorAt(

        i,

        new THREE.Color(

          colors[

            Math.floor(

              random()

              *

              colors.length

            )

          ]

        )

      );

    }


    buildings.instanceMatrix.needsUpdate =
      true;


    if (
      buildings.instanceColor
    ) {

      buildings.instanceColor.needsUpdate =
        true;

    }


    this.scene.add(
      buildings
    );

  }


  /* =========================================================
     ROCKS
  ========================================================= */

  createRocks(random) {

    const count =
      90;


    const material =
      new THREE.MeshStandardMaterial({
        color: 0x5f625d,
        roughness: 1
      });


    const rocks =
      new THREE.InstancedMesh(

        new THREE.DodecahedronGeometry(
          0.85,
          0
        ),

        material,

        count

      );


    const dummy =
      new THREE.Object3D();


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const distance =

        30

        +

        random()

        *

        (
          this.length - 60
        );


      const frame =
        this.getFrame(
          distance
        );


      const side =
        random() < 0.5
          ? -1
          : 1;


      const offset =

        this.config.roadWidth / 2

        +

        10

        +

        random() * 70;


      const base =

        frame.point
          .clone()
          .add(

            frame.normal
              .clone()
              .multiplyScalar(
                side * offset
              )

          );


      const scale =
        0.35 +
        random() * 1.25;


      dummy.position.set(

        base.x,

        scale * 0.45 - 0.08,

        base.z

      );


      dummy.scale.set(

        scale,

        scale * 0.65,

        scale

      );


      dummy.rotation.set(

        random() * 0.3,

        random() *
        Math.PI *
        2,

        random() * 0.25

      );


      dummy.updateMatrix();


      rocks.setMatrixAt(

        i,

        dummy.matrix

      );

    }


    rocks.instanceMatrix.needsUpdate =
      true;


    this.scene.add(
      rocks
    );

  }


  /* =========================================================
     STREET LAMPS
  ========================================================= */

  createLamps(random) {

    const count =
      90;


    const poleMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x3a4350,
        roughness: 0.75
      });


    const glowMaterial =
      new THREE.MeshStandardMaterial({

        color: 0xffdb89,

        emissive: 0xff9b36,

        emissiveIntensity: 1.2

      });


    const poles =
      new THREE.InstancedMesh(

        new THREE.CylinderGeometry(
          0.035,
          0.05,
          4.2,
          6
        ),

        poleMaterial,

        count

      );


    const lights =
      new THREE.InstancedMesh(

        new THREE.SphereGeometry(
          0.10,
          6,
          5
        ),

        glowMaterial,

        count

      );


    const dummy =
      new THREE.Object3D();


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const distance =

        this.length * 0.18

        +

        random()

        *

        (
          this.length * 0.68
        );


      const frame =
        this.getFrame(
          distance
        );


      const side =
        i % 2 === 0
          ? -1
          : 1;


      const offset =
        this.config.roadWidth / 2
        +
        1.8;


      const base =

        frame.point
          .clone()
          .add(

            frame.normal
              .clone()
              .multiplyScalar(
                side * offset
              )

          );


      dummy.position.set(

        base.x,

        2.1,

        base.z

      );


      dummy.scale.set(
        1,
        1,
        1
      );


      dummy.rotation.set(
        0,
        0,
        0
      );


      dummy.updateMatrix();


      poles.setMatrixAt(

        i,

        dummy.matrix

      );


      dummy.position.set(

        base.x,

        4.2,

        base.z

      );


      dummy.updateMatrix();


      lights.setMatrixAt(

        i,

        dummy.matrix

      );

    }


    poles.instanceMatrix.needsUpdate =
      true;


    lights.instanceMatrix.needsUpdate =
      true;


    this.scene.add(

      poles,

      lights

    );

  }


  /* =========================================================
     FINISH
  ========================================================= */

  createFinishArch() {

    this.finishDistance =
      this.length - 45;


    const frame =
      this.getFrame(
        this.finishDistance
      );


    const group =
      new THREE.Group();


    const dark =
      new THREE.MeshStandardMaterial({

        color: 0x121722,

        roughness: 0.46,

        metalness: 0.28

      });


    const white =
      new THREE.MeshStandardMaterial({

        color: 0xf6f7f9,

        emissive: 0x5566aa,

        emissiveIntensity: 0.22

      });


    const leftPost =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.34,
          6.2,
          0.34
        ),

        dark

      );


    leftPost.position.set(

      -5,

      3.1,

      0

    );


    const rightPost =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.34,
          6.2,
          0.34
        ),

        dark

      );


    rightPost.position.set(

      5,

      3.1,

      0

    );


    const beam =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          10.3,
          0.52,
          0.48
        ),

        dark

      );


    beam.position.set(

      0,

      6,

      0

    );


    group.add(

      leftPost,

      rightPost,

      beam

    );


    /*
      Checkered finish pattern.
    */

    for (
      let i = 0;
      i < 12;
      i++
    ) {

      const tile =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            0.72,
            0.26,
            0.08
          ),

          i % 2
            ? dark
            : white

        );


      tile.position.set(

        -3.95
        +
        i * 0.72,

        6,

        -0.29

      );


      group.add(
        tile
      );

    }


    group.position.copy(
      frame.point
    );


    group.rotation.y =
      frame.heading;


    this.scene.add(
      group
    );

  }


  /* =========================================================
     NEXT JUNCTION
  ========================================================= */

  nearestJunctionDistance(
    distance
  ) {

    let nearest =
      Infinity;


    for (
      const junction
      of
      this.junctionDistances
    ) {

      const delta =
        junction - distance;


      if (
        delta >= 0
        &&
        delta < nearest
      ) {

        nearest =
          delta;

      }

    }


    return nearest;

  }


  /* =========================================================
     SEEDED RANDOM

     Giúp cảnh vật random nhưng giữ ổn định mỗi lần mở game.
  ========================================================= */

  seededRandom(seed) {

    let value =
      seed >>> 0;


    return () => {

      value =

        (
          value
          *
          1664525
          +
          1013904223
        )

        >>>

        0;


      return (

        value

        /

        4294967296

      );

    };

  }

};
