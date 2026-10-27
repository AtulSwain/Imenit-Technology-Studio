/* =========================================================
   IMENIT — WebGL "space" background
   A living chrome ribbon (twisted, Möbius-like band) floating
   in a field of stars and orbit lines. It follows the mouse,
   can be dragged/spun, reacts to scroll speed, and glides to a
   new position for every section (driven from main.js).
   ========================================================= */
(function () {
  "use strict";

  var canvas = document.getElementById("space");
  var api = {
    // target values, tweened by main.js on scroll
    state: { x: 2.45, y: 0.1, s: 1, rx: 0, dim: 1 },
    pointer: { x: 0, y: 0 },
    velocity: 0,
    ready: false
  };
  window.IMENIT_SCENE = api;

  if (!canvas || !window.THREE) {
    if (canvas) canvas.classList.add("is-fallback");
    return;
  }

  var THREE = window.THREE;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    canvas.classList.add("is-fallback");
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isSmall = window.innerWidth < 800;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.035);
  var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 10);

  /* ---------- Studio environment (black room + softboxes) for chrome reflections ---------- */
  var pmrem = new THREE.PMREMGenerator(renderer);
  var envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(
    new THREE.BoxGeometry(40, 40, 40),
    new THREE.MeshBasicMaterial({ color: 0x020202, side: THREE.BackSide })
  ));
  function softbox(w, h, pos, intensity) {
    var m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(intensity, intensity, intensity), side: THREE.DoubleSide })
    );
    m.position.set(pos[0], pos[1], pos[2]);
    m.lookAt(0, 0, 0);
    envScene.add(m);
  }
  softbox(16, 3, [0, 11, 3], 3.2);
  softbox(2.4, 18, [-12, 0, 4], 2.2);
  softbox(1.6, 16, [12, 3, -5], 1.6);
  softbox(10, 1.2, [3, -11, 7], 1.1);
  softbox(9, 9, [0, -2, -16], 0.35);
  var envMap = pmrem.fromScene(envScene, 0.035).texture;

  /* ---------- Procedural "brushed concrete" bump texture ---------- */
  function makeBumpTexture() {
    var c = document.createElement("canvas");
    c.width = 1024; c.height = 128;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, c.width, c.height);
    for (var i = 0; i < 9000; i++) {
      var v = Math.floor(90 + Math.random() * 90);
      ctx.fillStyle = "rgba(" + v + "," + v + "," + v + "," + (0.25 + Math.random() * 0.4) + ")";
      ctx.fillRect(Math.random() * c.width, Math.random() * c.height, 1 + Math.random() * 3, 1 + Math.random() * 2);
    }
    for (var j = 0; j < 140; j++) { // long streaks along the band
      var g = Math.floor(60 + Math.random() * 140);
      ctx.strokeStyle = "rgba(" + g + "," + g + "," + g + ",0.25)";
      ctx.lineWidth = Math.random() * 1.4;
      var y = Math.random() * c.height;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y + (Math.random() - 0.5) * 10); ctx.stroke();
    }
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(6, 1);
    return t;
  }

  /* ---------- The ribbon ---------- */
  var SEG = isSmall ? 360 : 640;
  var ACROSS = isSmall ? 12 : 20;
  var R = 2.25;
  var vCount = (SEG + 1) * (ACROSS + 1);
  var positions = new Float32Array(vCount * 3);
  var uvs = new Float32Array(vCount * 2);
  var indices = [];
  for (var i = 0; i <= SEG; i++) {
    for (var j = 0; j <= ACROSS; j++) {
      var k = i * (ACROSS + 1) + j;
      uvs[k * 2] = i / SEG;
      uvs[k * 2 + 1] = j / ACROSS;
      if (i < SEG && j < ACROSS) {
        var a = k, b = k + ACROSS + 1, c = b + 1, d = a + 1;
        indices.push(a, b, d, b, c, d);
      }
    }
  }
  var ribbonGeo = new THREE.BufferGeometry();
  ribbonGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  ribbonGeo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  ribbonGeo.setIndex(indices);

  var bump = makeBumpTexture();
  var ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xe8e8e8,
    metalness: 1,
    roughness: 0.32,
    envMap: envMap,
    envMapIntensity: 1.25,
    bumpMap: bump,
    bumpScale: 0.012,
    roughnessMap: bump,
    side: THREE.DoubleSide
  });
  var ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);

  var TWO_PI = Math.PI * 2;
  function updateRibbon(t, wave) {
    var p = positions;
    for (var i = 0; i <= SEG; i++) {
      var u = (i / SEG) * TWO_PI;
      var cu = Math.cos(u), su = Math.sin(u);
      // centre line: slightly elliptical loop with a breathing out-of-plane wave
      var cx = R * cu;
      var cy = R * 0.9 * su;
      var cz = (0.22 + wave) * Math.sin(2 * u + t * 0.45) + 0.12 * Math.sin(3 * u - t * 0.3);
      // half twist along the loop (Möbius) that slowly flows over time
      var tw = u * 0.5 + t * 0.12;
      var ct = Math.cos(tw), st = Math.sin(tw);
      // band is wide on one side, razor thin on the other (like the hero reference)
      var wv = 0.5 + 0.5 * Math.sin(u + 0.9 + t * 0.18);
      var width = 0.05 + 0.62 * wv * wv;
      // direction across the band: blend of radial (in-plane) and Z
      var dx = cu * ct, dy = su * ct, dz = st;
      for (var j = 0; j <= ACROSS; j++) {
        var v = (j / ACROSS - 0.5) * width;
        var k = (i * (ACROSS + 1) + j) * 3;
        p[k] = cx + dx * v;
        p[k + 1] = cy + dy * v;
        p[k + 2] = cz + dz * v;
      }
    }
    ribbonGeo.attributes.position.needsUpdate = true;
    ribbonGeo.computeVertexNormals();
  }

  /* ---------- Orbit lines + satellites ---------- */
  function orbit(rx, ry, opacity, dashed) {
    var curve = new THREE.EllipseCurve(0, 0, rx, ry, 0, TWO_PI, false, 0);
    var pts = curve.getPoints(256);
    var geo = new THREE.BufferGeometry().setFromPoints(pts);
    var mat = dashed
      ? new THREE.LineDashedMaterial({ color: 0xffffff, transparent: true, opacity: opacity, dashSize: 0.08, gapSize: 0.12, depthWrite: false })
      : new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: opacity, depthWrite: false });
    var line = new THREE.LineLoop(geo, mat);
    if (dashed) line.computeLineDistances();
    return { line: line, curve: curve };
  }

  function glowTexture() {
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.8)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  var glowTex = glowTexture();

  var orbits = [
    orbit(3.4, 3.0, 0.16, false),
    orbit(4.3, 3.6, 0.1, true),
    orbit(5.6, 4.6, 0.06, false)
  ];
  var orbitGroup = new THREE.Group();
  orbits[0].line.rotation.set(0.35, 0.2, 0);
  orbits[1].line.rotation.set(-0.5, 0.4, 0.6);
  orbits[2].line.rotation.set(0.9, -0.3, 0.2);
  orbits.forEach(function (o) { orbitGroup.add(o.line); });

  var satellites = orbits.slice(0, 2).map(function (o, idx) {
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    sprite.scale.setScalar(idx === 0 ? 0.16 : 0.11);
    o.line.add(sprite);
    return { sprite: sprite, curve: o.curve, speed: idx === 0 ? 0.035 : -0.022, offset: idx * 0.4 };
  });

  /* ---------- Star field (two depths) ---------- */
  function starField(count, rMin, rMax, size, opacity) {
    var pos = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      var r = rMin + Math.pow(Math.random(), 0.7) * (rMax - rMin);
      var th = Math.random() * TWO_PI;
      var ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph) - 4;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var mat = new THREE.PointsMaterial({
      size: size, map: glowTex, transparent: true, opacity: opacity,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false
    });
    return new THREE.Points(geo, mat);
  }
  var dust = starField(isSmall ? 1400 : 3200, 3, 26, 0.05, 0.55);
  var stars = starField(isSmall ? 120 : 260, 6, 30, 0.16, 0.9);

  /* ---------- Hierarchy ---------- */
  var root = new THREE.Group();       // position/scale from scroll state
  var tilt = new THREE.Group();       // mouse + drag rotation
  var spinner = new THREE.Group();    // continuous spin around its own axis
  spinner.add(ribbon);
  tilt.add(spinner);
  tilt.add(orbitGroup);
  root.add(tilt);
  scene.add(root);
  scene.add(dust);
  scene.add(stars);

  // base pose: seen at an angle, like the hero reference
  var BASE = { x: -0.95, y: 0.55, z: 0.55 };

  /* ---------- A moving light so highlights travel across the metal ---------- */
  var key = new THREE.PointLight(0xffffff, 2.2, 30, 2);
  key.position.set(3, 3, 6);
  scene.add(key);
  scene.add(new THREE.AmbientLight(0xffffff, 0.08));

  /* ---------- Input: pointer parallax + drag to spin ---------- */
  var drag = { active: false, lastX: 0, lastY: 0, vx: 0, vy: 0, rotX: 0, rotY: 0 };

  window.addEventListener("pointermove", function (e) {
    api.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    api.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    if (drag.active) {
      var dx = e.clientX - drag.lastX, dy = e.clientY - drag.lastY;
      drag.vx = dx * 0.006; drag.vy = dy * 0.006;
      drag.rotY += drag.vx; drag.rotX += drag.vy;
      drag.lastX = e.clientX; drag.lastY = e.clientY;
    }
  }, { passive: true });

  var interactive = "a, button, input, textarea, select, label";
  window.addEventListener("pointerdown", function (e) {
    var zone = e.target.closest && e.target.closest("[data-drag]");
    if (!zone || e.target.closest(interactive)) return;
    if (e.pointerType === "touch") return; // keep touch scrolling natural
    drag.active = true; drag.lastX = e.clientX; drag.lastY = e.clientY;
    zone.classList.add("is-dragging");
    document.documentElement.classList.add("is-dragging");
  });
  window.addEventListener("pointerup", function () {
    if (!drag.active) return;
    drag.active = false;
    var z = document.querySelector("[data-drag].is-dragging");
    if (z) z.classList.remove("is-dragging");
    document.documentElement.classList.remove("is-dragging");
  });

  // gentle device-tilt parallax on phones
  window.addEventListener("deviceorientation", function (e) {
    if (e.gamma == null) return;
    api.pointer.x = Math.max(-1, Math.min(1, e.gamma / 30));
    api.pointer.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  }, { passive: true });

  /* ---------- Resize ---------- */
  var layout = { xf: 1, sf: 1 };
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    var aspect = w / h;
    layout.xf = Math.min(1, aspect / 1.55);         // keep x offsets on-screen on narrow screens
    layout.sf = aspect < 1 ? 0.62 : aspect < 1.3 ? 0.82 : 1;
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- Loop ---------- */
  var cur = { x: api.state.x, y: api.state.y, s: 0.001, rx: 0, dim: api.state.dim };
  var pm = { x: 0, y: 0 };
  var spin = 0, intro = 0, lastDim = -1;
  var clock = new THREE.Clock();

  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.elapsedTime * (reduceMotion ? 0.2 : 1);

    var st = api.state;
    var ease = 1 - Math.pow(0.001, dt);      // frame-rate independent smoothing
    cur.x += (st.x - cur.x) * ease * 0.9;
    cur.y += (st.y - cur.y) * ease * 0.9;
    cur.s += (st.s - cur.s) * ease * 0.9;
    cur.rx += (st.rx - cur.rx) * ease * 0.9;
    cur.dim += (st.dim - cur.dim) * ease;

    pm.x += (api.pointer.x - pm.x) * ease * 0.35;
    pm.y += (api.pointer.y - pm.y) * ease * 0.35;

    // intro: grows in once the preloader lifts
    if (api.ready) intro += (1 - intro) * ease * 0.5;

    var vel = Math.max(-60, Math.min(60, api.velocity || 0));
    var wave = Math.min(0.5, Math.abs(vel) * 0.012);
    updateRibbon(t, wave);

    spin += dt * 0.12 + vel * 0.0009;
    spinner.rotation.z = spin;

    if (!drag.active) {
      drag.vx *= 0.94; drag.vy *= 0.94;
      drag.rotY += drag.vx; drag.rotX += drag.vy;
      // spring back slowly towards the base pose
      drag.rotY *= 0.992; drag.rotX *= 0.992;
    }

    root.position.set(cur.x * layout.xf + pm.x * 0.22, cur.y - pm.y * 0.14, 0);
    root.scale.setScalar(Math.max(0.001, cur.s * layout.sf * (0.6 + 0.4 * intro)));
    tilt.rotation.set(
      BASE.x + cur.rx + pm.y * 0.22 + drag.rotX,
      BASE.y + pm.x * 0.32 + drag.rotY + (1 - intro) * 1.2,
      BASE.z + Math.sin(t * 0.15) * 0.06
    );

    orbitGroup.rotation.z = -t * 0.04;
    satellites.forEach(function (s) {
      var p = s.curve.getPoint(((t * s.speed + s.offset) % 1 + 1) % 1);
      s.sprite.position.set(p.x, p.y, 0);
    });

    dust.rotation.y = t * 0.008 + pm.x * 0.06;
    dust.rotation.x = pm.y * 0.04;
    dust.position.z = Math.min(3, Math.abs(vel) * 0.03); // warp forward on fast scroll
    stars.rotation.y = t * 0.004 + pm.x * 0.1;
    stars.rotation.x = pm.y * 0.06;

    key.position.set(4 * Math.cos(t * 0.3) + pm.x * 5, 3 * Math.sin(t * 0.22) - pm.y * 4, 6);

    var dimVal = Math.round(cur.dim * 100) / 100;
    if (dimVal !== lastDim) { canvas.style.opacity = String(dimVal); lastDim = dimVal; }

    renderer.render(scene, camera);
  }
  updateRibbon(0, 0);
  frame();
})();
