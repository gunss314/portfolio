/* ============================================================
   3D ANIMATED BACKGROUND (Three.js)
   - Fixed canvas behind ALL content (z-index -2)
   - Particle field + glowing orbs + wireframe geometry
   - Mouse parallax, theme-aware colors
   - Respects prefers-reduced-motion; optimized for mobile
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("bg3d");
  if (!canvas || typeof THREE === "undefined") return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.matchMedia("(max-width: 768px)").matches;

  /* ---------- Renderer ---------- */
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance"
    });
  } catch (e) {
    canvas.style.display = "none";
    return;
  }

  function applySize() {
    var w = window.innerWidth || canvas.clientWidth || 1;
    var h = window.innerHeight || canvas.clientHeight || 1;
    var dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // Self-healing size check: some webviews report 0 viewport at script load.
  var lastW = -1, lastH = -1;
  function checkSize() {
    var w = window.innerWidth, h = window.innerHeight;
    if (w !== lastW || h !== lastH) {
      lastW = w; lastH = h;
      if (w > 0 && h > 0) applySize();
    }
  }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 120);
  camera.position.set(0, 0, 14);

  /* ---------- Soft glow texture (shared) ---------- */
  function makeGlowTexture() {
    var size = 128;
    var cnv = document.createElement("canvas");
    cnv.width = size;
    cnv.height = size;
    var ctx = cnv.getContext("2d");
    var g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    var tex = new THREE.CanvasTexture(cnv);
    return tex;
  }
  var glowTex = makeGlowTexture();

  var palette = [0x7c6cff, 0x00e0c6, 0xff5ca8, 0xffffff];
  var paletteObj = [];
  for (var p = 0; p < palette.length; p++) paletteObj.push(new THREE.Color(palette[p]));

  /* ---------- Particles ---------- */
  var P_COUNT = isMobile ? 550 : 1400;
  var positions = new Float32Array(P_COUNT * 3);
  var colors = new Float32Array(P_COUNT * 3);
  var speeds = new Float32Array(P_COUNT);

  for (var i = 0; i < P_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 44;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    var col = paletteObj[(Math.random() * paletteObj.length) | 0];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
    speeds[i] = 0.1 + Math.random() * 0.25;
  }

  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  var pMat = new THREE.PointsMaterial({
    size: isMobile ? 0.1 : 0.08,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  var points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  /* ---------- Glowing orbs ---------- */
  var orbs = [];
  var ORB_DEFS = isMobile
    ? [[0x7c6cff, 13, -14, 6, -10], [0x00e0c6, 11, 14, -7, -14]]
    : [[0x7c6cff, 14, -16, 8, -12], [0x00e0c6, 12, 16, -6, -16], [0xff5ca8, 10, 10, 10, -8]];

  for (var o = 0; o < ORB_DEFS.length; o++) {
    var def = ORB_DEFS[o];
    var mat = new THREE.SpriteMaterial({
      map: glowTex,
      color: def[0],
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    var orb = new THREE.Sprite(mat);
    orb.scale.set(def[1], def[1], 1);
    orb.position.set(def[2], def[3], def[4]);
    orb.userData.baseScale = def[1];
    orb.userData.phase = Math.random() * Math.PI * 2;
    orbs.push(orb);
    scene.add(orb);
  }

  /* ---------- Wireframe geometry ---------- */
  var wires = [];
  var WIRE_COUNT = isMobile ? 2 : 4;
  for (var w = 0; w < WIRE_COUNT; w++) {
    var geo = w % 2 === 0
      ? new THREE.IcosahedronGeometry(1.6 + w * 0.35, 0)
      : new THREE.TorusGeometry(1.4 + w * 0.3, 0.35, 8, 32);
    var wmat = new THREE.MeshBasicMaterial({
      color: palette[w % palette.length],
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    var mesh = new THREE.Mesh(geo, wmat);
    mesh.position.set(
      (Math.random() - 0.5) * 34,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 14 - 6
    );
    mesh.userData.spinX = (Math.random() - 0.5) * 0.002;
    mesh.userData.spinY = (Math.random() - 0.5) * 0.0025;
    mesh.userData.drift = Math.random() * Math.PI * 2;
    wires.push(mesh);
    scene.add(mesh);
  }

  /* ---------- Mouse parallax ---------- */
  var mouseX = 0, mouseY = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener("resize", function () {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
    lastW = -1; // force re-check
    checkSize();
  });

  /* ---------- Render loop ---------- */
  var clock = new THREE.Clock();
  var tAccum = 0;
  var running = false;

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    checkSize();
    var dt = Math.min(clock.getDelta(), 0.05);
    tAccum += dt;

    tx += (mouseX - tx) * 0.04;
    ty += (mouseY - ty) * 0.04;
    camera.position.x = tx * 1.4;
    camera.position.y = -ty * 0.9;

    points.rotation.y += dt * 0.012;
    points.rotation.x = Math.sin(tAccum * 0.05) * 0.04;

    // gentle particle rise
    var arr = pGeo.attributes.position.array;
    for (var i2 = 0; i2 < P_COUNT; i2++) {
      arr[i2 * 3 + 1] += speeds[i2] * dt;
      if (arr[i2 * 3 + 1] > 22) arr[i2 * 3 + 1] = -22;
    }
    pGeo.attributes.position.needsUpdate = true;

    for (var k = 0; k < orbs.length; k++) {
      var ob = orbs[k];
      ob.position.x += Math.sin(tAccum * 0.25 + ob.userData.phase) * 0.004;
      ob.position.y += Math.cos(tAccum * 0.2 + ob.userData.phase) * 0.003;
      var s = 1 + Math.sin(tAccum * 0.6 + k) * 0.05;
      ob.scale.set(ob.userData.baseScale * s, ob.userData.baseScale * s, 1);
    }

    for (var m = 0; m < wires.length; m++) {
      var wm = wires[m];
      wm.rotation.x += wm.userData.spinX;
      wm.rotation.y += wm.userData.spinY;
      wm.position.y += Math.sin(tAccum * 0.3 + wm.userData.drift) * 0.003;
    }

    camera.lookAt(0, 0, -6);
    renderer.render(scene, camera);
  }

  function start() {
    if (running || reduced) return;
    running = true;
    clock.getDelta();
    animate();
  }
  function stop() {
    running = false;
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  // Pause when tab not visible to save battery (also handled above)
  checkSize();

  if (reduced) {
    // Static single frame — visual, no motion
    checkSize();
    renderer.render(scene, camera);
  } else {
    start();
  }
})();
