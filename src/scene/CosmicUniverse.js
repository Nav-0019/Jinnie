import * as THREE from 'three';
import { getAssetUrl } from '../utils/assetPath';

/**
 * CosmicUniverse: Persistent 3D cinematic world for "A Universe Made for Her"
 * Handles persistent Three.js scene, camera spline interpolation, 18-candle cake,
 * floating gift box, final illuminated room with Jinnie's real photographs,
 * red rose petals, and subtle BTS easter eggs.
 */
export class CosmicUniverse {
  constructor(canvasContainer, options = {}) {
    this.container = canvasContainer;
    this.options = options;

    this.width = canvasContainer.clientWidth || window.innerWidth;
    this.height = canvasContainer.clientHeight || window.innerHeight;

    // Animation & State variables
    this.scrollProgress = 0;
    this.targetProgress = 0;
    this.isCakeBlownOut = false;
    this.isGiftOpened = false;
    this.isRoomLit = false;

    // Candle and light arrays
    this.candles = [];
    this.candleFlames = [];
    this.candleLights = [];
    this.roomLights = [];
    this.roomTargetIntensity = 0;
    this.roomCurrentIntensity = 0;

    // Animation timing
    this.startTime = performance.now();
    this.isDestroyed = false;

    // Camera target vectors for smooth lerping
    this.currentCamPos = new THREE.Vector3(0, 0, 100);
    this.targetCamPos = new THREE.Vector3(0, 0, 100);
    this.currentLookAt = new THREE.Vector3(0, 0, 0);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);

    this.init();
  }

  init() {
    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020412);
    this.scene.fog = new THREE.FogExp2(0x020412, 0.001);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(54, this.width / this.height, 0.1, 2800);
    this.camera.position.set(0, 0, 100);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Base Cosmic Lighting
    this.ambientLight = new THREE.AmbientLight(0x221B3A, 1.2);
    this.scene.add(this.ambientLight);

    this.starlight = new THREE.DirectionalLight(0xE0E8FF, 0.8);
    this.starlight.position.set(100, 200, 100);
    this.scene.add(this.starlight);

    // 5. Build Environment & Objects
    this.textureLoader = new THREE.TextureLoader();
    this.buildStars();
    this.buildNebulae();
    this.buildBtsEasterEggs();
    this.buildCake();
    this.buildGiftBox();
    this.buildFinalRoom();

    // 6. Handle Resizing
    this.onResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.onResize);

    // 7. Start Render Loop
    this.animate = this.render.bind(this);
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  /* ----------------------------------------------------
     STARS & NEBULAE
  ---------------------------------------------------- */
  buildStars() {
    const starCount = 3800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colorPalette = [
      new THREE.Color(0xFFFFFF), // Silver white
      new THREE.Color(0xD8E2F8), // Starlight blue
      new THREE.Color(0xC5B4E3), // Soft lavender
      new THREE.Color(0x9C27B0), // Subtle purple
      new THREE.Color(0xF5E0B7), // Golden starlight
    ];

    for (let i = 0; i < starCount; i++) {
      // Spread stars across the entire depth of the journey (Z: +150 to -1600)
      const x = (Math.random() - 0.5) * 800;
      const y = (Math.random() - 0.5) * 600;
      const z = Math.random() * -1750 + 150;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2.5 + 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Star Material
    const starMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    this.starPoints = new THREE.Points(geometry, starMaterial);
    this.scene.add(this.starPoints);
  }

  buildNebulae() {
    const nebulaCount = 550;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nebulaCount * 3);
    const colors = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 500;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = Math.random() * -1600 + 100;

      // Deep cosmic purple & cyan
      const isPurple = Math.random() > 0.4;
      const col = isPurple
        ? new THREE.Color(0x6A1B9A)
        : new THREE.Color(0x1A237E);

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 35,
      vertexColors: true,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.nebulaPoints = new THREE.Points(geometry, mat);
    this.scene.add(this.nebulaPoints);
  }

  /* ----------------------------------------------------
     BTS-INSPIRED EASTER EGGS
  ---------------------------------------------------- */
  buildBtsEasterEggs() {
    this.easterEggGroup = new THREE.Group();

    // 1. Seven-Star Constellation (at Z ≈ -180, near Milestone 2)
    const starPositions = [
      new THREE.Vector3(-35, 20, -170),
      new THREE.Vector3(-25, 28, -175),
      new THREE.Vector3(-12, 34, -180),
      new THREE.Vector3(5, 30, -185),
      new THREE.Vector3(18, 22, -180),
      new THREE.Vector3(30, 26, -175),
      new THREE.Vector3(42, 18, -170),
    ];

    const starGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const starMat = new THREE.MeshBasicMaterial({
      color: 0xE8D5FF,
    });

    starPositions.forEach((pos) => {
      const mesh = new THREE.Mesh(starGeo, starMat);
      mesh.position.copy(pos);
      this.easterEggGroup.add(mesh);
    });

    // Constellation connecting lines
    const linePoints = [];
    for (let i = 0; i < starPositions.length - 1; i++) {
      linePoints.push(starPositions[i], starPositions[i + 1]);
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x9C27B0,
      transparent: true,
      opacity: 0.5,
    });
    this.constellationLines = new THREE.LineSegments(lineGeo, lineMat);
    this.easterEggGroup.add(this.constellationLines);

    // 2. Magic Shop Cosmic Doorway (at Z ≈ -580, Milestone 5)
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0, -580);

    const ringGeo = new THREE.TorusGeometry(32, 1.2, 16, 60, Math.PI);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xBA68C8,
      transparent: true,
      opacity: 0.7,
    });
    const archMesh = new THREE.Mesh(ringGeo, ringMat);
    archMesh.position.y = 12;
    archGroup.add(archMesh);

    // Threshold glow
    const thresholdGeo = new THREE.PlaneGeometry(54, 48);
    const thresholdMat = new THREE.MeshBasicMaterial({
      color: 0x311B92,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const thresholdMesh = new THREE.Mesh(thresholdGeo, thresholdMat);
    thresholdMesh.position.y = 10;
    archGroup.add(thresholdMesh);

    this.easterEggGroup.add(archGroup);

    this.scene.add(this.easterEggGroup);
  }

  /* ----------------------------------------------------
     MILESTONE 7: 18TH BIRTHDAY CAKE & 18 CANDLES
  ---------------------------------------------------- */
  buildCake() {
    this.cakeGroup = new THREE.Group();
    // Positioned in front of camera at Milestone 7, elevated for clear visibility
    this.cakeGroup.position.set(0, -3.0, -780);

    // 1. Gold Platter Stand (Proportional, elegant diameter ~24)
    const standGeo = new THREE.CylinderGeometry(11.5, 12.8, 1.3, 36);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xD8B778,
      metalness: 0.88,
      roughness: 0.22,
    });
    const stand = new THREE.Mesh(standGeo, goldMat);
    stand.position.y = 0.65;
    this.cakeGroup.add(stand);

    // Platter Beveled Rim
    const rimGeo = new THREE.TorusGeometry(12.2, 0.25, 12, 48);
    const rim = new THREE.Mesh(rimGeo, goldMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.3;
    this.cakeGroup.add(rim);

    // 2. Bottom Tier (Soft Vanilla Cream with Gold & Velvet Trim)
    const bottomTierH = 4.6;
    const bottomTierR = 9.2;
    const bottomTierGeo = new THREE.CylinderGeometry(bottomTierR, bottomTierR, bottomTierH, 36);
    const ivoryMat = new THREE.MeshStandardMaterial({
      color: 0xFAF5EC,
      roughness: 0.35,
    });
    const bottomTier = new THREE.Mesh(bottomTierGeo, ivoryMat);
    bottomTier.position.y = 1.3 + bottomTierH / 2;
    this.cakeGroup.add(bottomTier);

    // Bottom Tier Velvet Ribbon
    const burgundyMat = new THREE.MeshStandardMaterial({
      color: 0x7E1B32,
      roughness: 0.32,
    });
    const bottomRibbonGeo = new THREE.CylinderGeometry(bottomTierR + 0.12, bottomTierR + 0.12, 1.1, 36);
    const bottomRibbon = new THREE.Mesh(bottomRibbonGeo, burgundyMat);
    bottomRibbon.position.y = 2.0;
    this.cakeGroup.add(bottomRibbon);

    // Gold Piping Ring at tier junction
    const pipe1Geo = new THREE.TorusGeometry(bottomTierR + 0.08, 0.18, 12, 48);
    const pipe1 = new THREE.Mesh(pipe1Geo, goldMat);
    pipe1.rotation.x = Math.PI / 2;
    pipe1.position.y = 1.3 + bottomTierH;
    this.cakeGroup.add(pipe1);

    // 3. Top Tier
    const topTierH = 4.0;
    const topTierR = 6.2;
    const topTierGeo = new THREE.CylinderGeometry(topTierR, topTierR, topTierH, 36);
    const topTier = new THREE.Mesh(topTierGeo, ivoryMat);
    topTier.position.y = 1.3 + bottomTierH + topTierH / 2;
    this.cakeGroup.add(topTier);

    // Top Tier Velvet Ribbon
    const topRibbonGeo = new THREE.CylinderGeometry(topTierR + 0.12, topTierR + 0.12, 0.9, 36);
    const topRibbon = new THREE.Mesh(topRibbonGeo, burgundyMat);
    topRibbon.position.y = 1.3 + bottomTierH + 0.6;
    this.cakeGroup.add(topRibbon);

    // Top Tier Scalloped / Frosted Drip
    const topDripGeo = new THREE.CylinderGeometry(topTierR + 0.14, topTierR + 0.14, 0.9, 36);
    const topDrip = new THREE.Mesh(topDripGeo, burgundyMat);
    topDrip.position.y = 1.3 + bottomTierH + topTierH - 0.45;
    this.cakeGroup.add(topDrip);

    // Gold Piping Ring on Top Rim
    const topRimY = 1.3 + bottomTierH + topTierH; // 9.9
    const pipe2Geo = new THREE.TorusGeometry(topTierR + 0.08, 0.16, 12, 48);
    const pipe2 = new THREE.Mesh(pipe2Geo, goldMat);
    pipe2.rotation.x = Math.PI / 2;
    pipe2.position.y = topRimY;
    this.cakeGroup.add(pipe2);

    // 4. "18" Gold Birthday Topper in Center
    const topperGroup = new THREE.Group();
    topperGroup.position.set(0, topRimY, 0);

    // Digit "1"
    const digit1PillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.4, 16);
    const digit1Pillar = new THREE.Mesh(digit1PillarGeo, goldMat);
    digit1Pillar.position.set(-1.25, 1.7, 0);
    topperGroup.add(digit1Pillar);

    const digit1SerifGeo = new THREE.BoxGeometry(0.3, 1.0, 0.3);
    const digit1Serif = new THREE.Mesh(digit1SerifGeo, goldMat);
    digit1Serif.position.set(-1.6, 2.8, 0);
    digit1Serif.rotation.z = Math.PI / 4;
    topperGroup.add(digit1Serif);

    // Digit "8" (Upper and lower toruses)
    const digit8BottomGeo = new THREE.TorusGeometry(0.9, 0.26, 14, 24);
    const digit8Bottom = new THREE.Mesh(digit8BottomGeo, goldMat);
    digit8Bottom.position.set(1.25, 1.1, 0);
    topperGroup.add(digit8Bottom);

    const digit8TopGeo = new THREE.TorusGeometry(0.72, 0.24, 14, 24);
    const digit8Top = new THREE.Mesh(digit8TopGeo, goldMat);
    digit8Top.position.set(1.25, 2.45, 0);
    topperGroup.add(digit8Top);

    this.cakeGroup.add(topperGroup);

    // 5. Exactly 18 Visible Birthday Candles on Top Tier (Proportional & Aligned)
    const candleCount = 18;
    const candleCircleR = 4.5;
    const candleH = 2.8;
    const candleR = 0.18;

    // Candle Body: Translate geometry so pivot is at the base
    const candleBodyGeo = new THREE.CylinderGeometry(candleR, candleR, candleH, 12);
    candleBodyGeo.translate(0, candleH / 2, 0);

    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xFFFDF8,
      roughness: 0.2,
    });

    // Wick: Pivot at base of wick
    const wickH = 0.45;
    const wickGeo = new THREE.CylinderGeometry(0.035, 0.035, wickH, 6);
    wickGeo.translate(0, wickH / 2, 0);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x1A1A1A });

    // Flame: Pivot at base of cone so scaling flickers from wick tip up!
    const flameH = 1.1;
    const flameR = 0.30;
    const flameGeo = new THREE.ConeGeometry(flameR, flameH, 12);
    flameGeo.translate(0, flameH / 2, 0);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xFFB300 });

    // Inner White Core of Flame
    const coreH = 0.52;
    const coreR = 0.14;
    const coreGeo = new THREE.ConeGeometry(coreR, coreH, 8);
    coreGeo.translate(0, coreH / 2, 0);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    this.candles = [];
    this.candleFlames = [];
    this.candleLights = [];

    // Distribute 6 point lights for warm radiance
    for (let l = 0; l < 6; l++) {
      const lAngle = (l / 6) * Math.PI * 2;
      const lx = Math.cos(lAngle) * 3.6;
      const lz = Math.sin(lAngle) * 3.6;
      const light = new THREE.PointLight(0xFFA000, 0.65, 22);
      light.position.set(lx, topRimY + candleH + 0.8, lz);
      this.cakeGroup.add(light);
      this.candleLights.push(light);
    }

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2;
      const cx = Math.cos(angle) * candleCircleR;
      const cz = Math.sin(angle) * candleCircleR;

      const candleMesh = new THREE.Mesh(candleBodyGeo, candleMat);
      // Sits directly on top tier surface
      candleMesh.position.set(cx, topRimY, cz);

      // Wick sits on top of candle body
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.set(0, candleH, 0);
      candleMesh.add(wick);

      // Flame sits directly on top of wick
      const flame = new THREE.Mesh(flameGeo, flameMat.clone());
      flame.position.set(0, candleH + wickH, 0);

      // Inner white hot core
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(0, 0.02, 0);
      flame.add(core);

      candleMesh.add(flame);
      this.candleFlames.push(flame);

      this.cakeGroup.add(candleMesh);
      this.candles.push(candleMesh);
    }

    this.scene.add(this.cakeGroup);
  }

  extinguishCandles() {
    this.isCakeBlownOut = true;
    this.candleFlames.forEach((flame) => {
      flame.visible = false;
    });
    this.candleLights.forEach((light) => {
      light.intensity = 0;
    });
    this.spawnCandleSmoke();
  }

  spawnCandleSmoke() {
    if (this.smokeParticles && this.smokeParticles.length > 0) return;
    this.smokeParticles = [];
    const smokeGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xD8D8D8,
      transparent: true,
      opacity: 0.55,
    });

    this.candles.forEach((candle) => {
      for (let s = 0; s < 3; s++) {
        const p = new THREE.Mesh(smokeGeo, smokeMat.clone());
        p.position.set(
          candle.position.x + (Math.random() - 0.5) * 0.15,
          candle.position.y + 3.2 + s * 0.25,
          candle.position.z + (Math.random() - 0.5) * 0.15
        );
        p.userData = {
          vy: 0.05 + Math.random() * 0.04,
          vx: (Math.random() - 0.5) * 0.02,
          vz: (Math.random() - 0.5) * 0.02,
          age: 0,
          maxAge: 70 + Math.random() * 30,
        };
        this.cakeGroup.add(p);
        this.smokeParticles.push(p);
      }
    });
  }

  resetCandles() {
    this.isCakeBlownOut = false;
    this.candleFlames.forEach((flame) => {
      flame.visible = true;
      flame.scale.set(1, 1, 1);
    });
    this.candleLights.forEach((light) => {
      light.intensity = 0.65;
    });
    if (this.smokeParticles) {
      this.smokeParticles.forEach((p) => {
        if (p.parent) p.parent.remove(p);
      });
      this.smokeParticles = [];
    }
  }

  /* ----------------------------------------------------
     MILESTONE 8: 3D FLOATING COSMIC GIFT BOX
  ---------------------------------------------------- */
  buildGiftBox() {
    this.giftGroup = new THREE.Group();
    this.giftGroup.position.set(0, 0, -1050);

    const boxSize = 26;
    const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x461220,
      metalness: 0.3,
      roughness: 0.4,
    });
    const boxBody = new THREE.Mesh(boxGeo, boxMat);
    boxBody.position.y = boxSize / 2;
    this.giftGroup.add(boxBody);

    // Ribbons
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xD8B778,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ribVGeo = new THREE.BoxGeometry(boxSize + 0.4, boxSize + 0.4, 4);
    const ribV = new THREE.Mesh(ribVGeo, ribbonMat);
    ribV.position.y = boxSize / 2;
    this.giftGroup.add(ribV);

    const ribHGeo = new THREE.BoxGeometry(4, boxSize + 0.4, boxSize + 0.4);
    const ribH = new THREE.Mesh(ribHGeo, ribbonMat);
    ribH.position.y = boxSize / 2;
    this.giftGroup.add(ribH);

    // Lid & Bow
    this.giftLidGroup = new THREE.Group();
    this.giftLidGroup.position.set(0, boxSize + 1, 0);

    const lidGeo = new THREE.BoxGeometry(boxSize + 2, 5, boxSize + 2);
    const lidMesh = new THREE.Mesh(lidGeo, boxMat);
    this.giftLidGroup.add(lidMesh);

    // Bow on top
    const bowGeo = new THREE.TorusGeometry(3.5, 1.2, 12, 24);
    const bowMesh = new THREE.Mesh(bowGeo, ribbonMat);
    bowMesh.rotation.x = Math.PI / 2;
    bowMesh.position.y = 4;
    this.giftLidGroup.add(bowMesh);

    this.giftGroup.add(this.giftLidGroup);

    // Subtle cosmic halo around the gift
    const haloGeo = new THREE.RingGeometry(22, 28, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xD8B778,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -2;
    this.giftGroup.add(halo);

    this.scene.add(this.giftGroup);
  }

  openGiftBox() {
    this.isGiftOpened = true;
    if (this.giftLidGroup) {
      this.giftLidGroup.position.y = 48;
      this.giftLidGroup.rotation.x = -0.5;
    }
  }

  resetGiftBox() {
    this.isGiftOpened = false;
    if (this.giftLidGroup) {
      this.giftLidGroup.position.set(0, 27, 0);
      this.giftLidGroup.rotation.set(0, 0, 0);
    }
  }

  /* ----------------------------------------------------
     MILESTONE 9 & 10: THE FINAL ROOM OF ROSES & LIGHT SWITCH
  ---------------------------------------------------- */
  buildFinalRoom() {
    this.roomGroup = new THREE.Group();
    this.roomGroup.position.set(0, 0, -1400);

    const roomW = 140;
    const roomH = 90;
    const roomD = 120;

    // Walls material (Dark deep burgundy velvet)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1E0611,
      roughness: 0.8,
    });

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(roomW, roomH);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, roomH / 2 - 10, -roomD / 2);
    this.roomGroup.add(backWall);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(roomW, roomD);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x12030A,
      roughness: 0.6,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -10, 0);
    this.roomGroup.add(floor);

    // Left & Right Walls
    const sideWallGeo = new THREE.PlaneGeometry(roomD, roomH);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomW / 2, roomH / 2 - 10, 0);
    this.roomGroup.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomW / 2, roomH / 2 - 10, 0);
    this.roomGroup.add(rightWall);

    // 6 Picture Frames with real photos of Jinnie
    const photoUrls = [
      getAssetUrl('/assets/images/photo1.jpg'),
      getAssetUrl('/assets/images/photo2.jpg'),
      getAssetUrl('/assets/images/photo3.jpg'),
      getAssetUrl('/assets/images/photo4.jpg'),
      getAssetUrl('/assets/images/photo5.jpg'),
      getAssetUrl('/assets/images/photo6.jpg'),
    ];

    const framePlacements = [
      { x: -38, y: 35, z: -roomD / 2 + 1, rotY: 0, w: 22, h: 28 },
      { x: -12, y: 35, z: -roomD / 2 + 1, rotY: 0, w: 22, h: 28 },
      { x: 12, y: 35, z: -roomD / 2 + 1, rotY: 0, w: 22, h: 28 },
      { x: 38, y: 35, z: -roomD / 2 + 1, rotY: 0, w: 22, h: 28 },
      { x: -roomW / 2 + 1, y: 35, z: -15, rotY: Math.PI / 2, w: 24, h: 30 },
      { x: roomW / 2 - 1, y: 35, z: -15, rotY: -Math.PI / 2, w: 24, h: 30 },
    ];

    this.photoFrames = [];
    photoUrls.forEach((url, idx) => {
      const p = framePlacements[idx];
      const frameHolder = new THREE.Group();
      frameHolder.position.set(p.x, p.y, p.z);
      frameHolder.rotation.y = p.rotY;

      // Ornate Border
      const borderGeo = new THREE.BoxGeometry(p.w + 2.5, p.h + 2.5, 1.2);
      const borderMat = new THREE.MeshStandardMaterial({
        color: 0xD8B778,
        metalness: 0.85,
        roughness: 0.3,
      });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      frameHolder.add(borderMesh);

      // Photo Canvas
      const photoGeo = new THREE.PlaneGeometry(p.w, p.h);
      const texture = this.textureLoader.load(
        url,
        undefined,
        undefined,
        () => {
          console.warn(`Could not load photo: ${url}`);
        }
      );
      texture.colorSpace = THREE.SRGBColorSpace;
      const photoMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.FrontSide,
      });
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.z = 0.7;
      frameHolder.add(photoMesh);

      this.roomGroup.add(frameHolder);
      this.photoFrames.push(frameHolder);
    });

    // Fresh Red Roses & Scattered Petals on the floor
    const petalCount = 180;
    const petalGeo = new THREE.CylinderGeometry(0.8, 1.2, 0.1, 8);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0x9F1D35,
      roughness: 0.4,
    });
    const petalsInstanced = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < petalCount; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * (roomW - 20),
        -9.8,
        (Math.random() - 0.5) * (roomD - 20)
      );
      dummy.rotation.set(
        Math.random() * 0.2,
        Math.random() * Math.PI * 2,
        Math.random() * 0.2
      );
      dummy.scale.setScalar(Math.random() * 0.8 + 0.6);
      dummy.updateMatrix();
      petalsInstanced.setMatrixAt(i, dummy.matrix);
    }
    this.roomGroup.add(petalsInstanced);

    // Physical 3D Wall Light Switch
    this.switchGroup = new THREE.Group();
    this.switchGroup.position.set(28, 18, -roomD / 2 + 1.5);

    const plateGeo = new THREE.BoxGeometry(6, 10, 0.8);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xD8B778,
      metalness: 0.7,
      roughness: 0.3,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    this.switchGroup.add(plate);

    // Switch rocker toggle
    const rockerGeo = new THREE.BoxGeometry(2.4, 4.5, 1.2);
    const rockerMat = new THREE.MeshStandardMaterial({
      color: 0x2A1520,
      roughness: 0.4,
    });
    this.rockerMesh = new THREE.Mesh(rockerGeo, rockerMat);
    this.rockerMesh.position.set(0, 0, 0.6);
    this.switchGroup.add(this.rockerMesh);

    this.roomGroup.add(this.switchGroup);

    // Room Lights: initially dark
    this.roomAmbient = new THREE.AmbientLight(0xFFE29F, 0.05);
    this.roomGroup.add(this.roomAmbient);

    this.chandelierLight = new THREE.PointLight(0xFFD68A, 0.0, 160);
    this.chandelierLight.position.set(0, 45, 0);
    this.roomGroup.add(this.chandelierLight);

    this.scene.add(this.roomGroup);
  }

  setRoomLighting(isLit) {
    this.isRoomLit = isLit;
    this.roomTargetIntensity = isLit ? 1.0 : 0.0;

    if (this.rockerMesh) {
      this.rockerMesh.rotation.x = isLit ? 0.35 : -0.35;
    }
  }

  /* ----------------------------------------------------
     SCROLL & CAMERA INTERPOLATION
  ---------------------------------------------------- */
  setScrollProgress(progress) {
    this.targetProgress = Math.max(0, Math.min(1, progress));
  }

  updateCameraPath() {
    const t = this.scrollProgress;

    // Narrative camera spline milestones
    if (t < 0.12) {
      // Milestone 1: Opening cosmic space
      const localT = t / 0.12;
      this.targetCamPos.set(0, 0, THREE.MathUtils.lerp(100, 20, localT));
      this.targetLookAt.set(0, 0, -100);
    } else if (t < 0.24) {
      // Milestone 2: Meeting across screens (BTS constellation visible)
      const localT = (t - 0.12) / 0.12;
      this.targetCamPos.set(
        THREE.MathUtils.lerp(0, -18, localT),
        THREE.MathUtils.lerp(0, 8, localT),
        THREE.MathUtils.lerp(20, -120, localT)
      );
      this.targetLookAt.set(0, 15, -180);
    } else if (t < 0.38) {
      // Milestone 3: First clash
      const localT = (t - 0.24) / 0.14;
      this.targetCamPos.set(
        THREE.MathUtils.lerp(-18, 15, localT),
        THREE.MathUtils.lerp(8, -6, localT),
        THREE.MathUtils.lerp(-120, -290, localT)
      );
      this.targetLookAt.set(0, 0, -360);
    } else if (t < 0.50) {
      // Milestone 4: Distance & block (cold space)
      const localT = (t - 0.38) / 0.12;
      this.targetCamPos.set(
        THREE.MathUtils.lerp(15, 0, localT),
        THREE.MathUtils.lerp(-6, 12, localT),
        THREE.MathUtils.lerp(-290, -480, localT)
      );
      this.targetLookAt.set(0, 0, -560);
    } else if (t < 0.62) {
      // Milestone 5: Reconnecting / Magic Shop doorway
      const localT = (t - 0.50) / 0.12;
      this.targetCamPos.set(
        0,
        THREE.MathUtils.lerp(12, 4, localT),
        THREE.MathUtils.lerp(-480, -640, localT)
      );
      this.targetLookAt.set(0, 6, -720);
    } else if (t < 0.68) {
      // Milestone 6: Five months of daily talks
      const localT = (t - 0.58) / 0.10;
      this.targetCamPos.set(
        THREE.MathUtils.lerp(0, -10, localT),
        THREE.MathUtils.lerp(4, 6, localT),
        THREE.MathUtils.lerp(-600, -690, localT)
      );
      this.targetLookAt.set(0, 5, -780);
    } else if (t < 0.78) {
      // Milestone 7: 18th Birthday Cake (Focus directly on cake & 18 candles from elevated angle)
      const localT = (t - 0.68) / 0.10;
      this.targetCamPos.set(
        THREE.MathUtils.lerp(-10, 0, localT),
        THREE.MathUtils.lerp(6, 6.2, localT),
        THREE.MathUtils.lerp(-690, -722, localT)
      );
      this.targetLookAt.set(0, 4.8, -780);
    } else if (t < 0.88) {
      // Milestone 8: The Floating Gift Box (at Z = -1050)
      const localT = (t - 0.78) / 0.10;
      this.targetCamPos.set(
        0,
        THREE.MathUtils.lerp(6.2, 5, localT),
        THREE.MathUtils.lerp(-722, -995, localT)
      );
      this.targetLookAt.set(0, 0, -1050);
    } else {
      // Milestone 9 & 10: Final Room of Roses & Confession (at Z = -1400)
      const localT = (t - 0.88) / 0.12;
      this.targetCamPos.set(
        0,
        THREE.MathUtils.lerp(5, 12, localT),
        THREE.MathUtils.lerp(-995, -1360, localT)
      );
      this.targetLookAt.set(0, 14, -1450);
    }

    // Smooth camera damping / lerp
    this.currentCamPos.lerp(this.targetCamPos, 0.08);
    this.currentLookAt.lerp(this.targetLookAt, 0.08);

    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentLookAt);
  }

  /* ----------------------------------------------------
     ANIMATION RENDER LOOP
  ---------------------------------------------------- */
  render() {
    if (this.isDestroyed) return;

    const elapsedTime = (performance.now() - this.startTime) * 0.001;

    // Smooth scroll interpolation
    this.scrollProgress += (this.targetProgress - this.scrollProgress) * 0.1;
    this.updateCameraPath();

    // 1. Gently twinkle stars
    if (this.starPoints) {
      this.starPoints.rotation.z = elapsedTime * 0.015;
    }

    // 2. Animate candle flames if not blown out (flickers from wick base up)
    if (!this.isCakeBlownOut && this.candleFlames.length > 0) {
      const flicker = Math.sin(elapsedTime * 14) * 0.12 + 1.0;
      this.candleFlames.forEach((flame, idx) => {
        const timeFactor = elapsedTime * 15 + idx * 0.8;
        const scaleY = (1.0 + Math.sin(timeFactor * 1.6) * 0.16 + Math.cos(timeFactor * 2.4) * 0.08) * flicker;
        const scaleXZ = 1.0 + Math.sin(timeFactor * 1.8) * 0.08;
        flame.scale.set(scaleXZ, scaleY, scaleXZ);
        // Organic subtle dance / sway
        flame.rotation.z = Math.sin(elapsedTime * 6 + idx) * 0.05;
        flame.rotation.x = Math.cos(elapsedTime * 5 + idx) * 0.05;
      });
      this.candleLights.forEach((light, idx) => {
        light.intensity = 0.55 + Math.sin(elapsedTime * 10 + idx * 1.1) * 0.12;
      });
    }

    // Gentle smoke wisps after blowing out candles
    if (this.smokeParticles && this.smokeParticles.length > 0) {
      this.smokeParticles.forEach((p) => {
        p.position.y += p.userData.vy;
        p.position.x += p.userData.vx;
        p.position.z += p.userData.vz;
        p.scale.multiplyScalar(1.015);
        p.userData.age += 1;
        p.material.opacity = Math.max(0, 0.55 * (1 - p.userData.age / p.userData.maxAge));
      });
    }

    // 3. Gentle float and bob for gift box
    if (this.giftGroup && !this.isGiftOpened) {
      this.giftGroup.position.y = Math.sin(elapsedTime * 2.2) * 2.5;
      this.giftGroup.rotation.y = elapsedTime * 0.35;
    }

    // 4. Smooth room lighting transition
    if (this.roomCurrentIntensity !== this.roomTargetIntensity) {
      this.roomCurrentIntensity += (this.roomTargetIntensity - this.roomCurrentIntensity) * 0.05;
      if (this.roomAmbient) {
        this.roomAmbient.intensity = 0.05 + this.roomCurrentIntensity * 0.8;
      }
      if (this.chandelierLight) {
        this.chandelierLight.intensity = this.roomCurrentIntensity * 2.2;
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  handleResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  destroy() {
    this.isDestroyed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);

    // Dispose Three.js objects
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
