/* =========================================================
   IMENIT — interactions & motion
   ========================================================= */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var html = document.documentElement;
  var body = document.body;
  var SCENE = window.IMENIT_SCENE || { state: {}, pointer: {} };

  var yearEl = $(".year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  // Without GSAP (CDN blocked), show everything statically.
  if (!window.gsap || !window.ScrollTrigger) {
    html.classList.remove("js");
    html.classList.add("no-anim");
    body.classList.remove("is-loading");
    SCENE.ready = true;
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Smooth scroll ---------------- */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", function (e) {
      ScrollTrigger.update();
      SCENE.velocity = e.velocity;
    });
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  } else {
    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      SCENE.velocity = (window.scrollY - lastY) * 0.5;
      lastY = window.scrollY;
    }, { passive: true });
  }
  // let velocity decay when the page stops
  gsap.ticker.add(function () { SCENE.velocity *= 0.92; });

  /* ---------------- Work: horizontal scroll ----------------
     Created first so every later ScrollTrigger accounts for its pin spacing. */
  var mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", function () {
    var track = $(".work__track");
    var dist = function () { return track.scrollWidth - window.innerWidth; };
    var tween = gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: {
        trigger: ".work", start: "top top", end: function () { return "+=" + dist(); },
        pin: ".work__pin", scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
      }
    });
    $$(".project", track).forEach(function (p) {
      gsap.fromTo($(".art", p), { xPercent: -8 }, {
        xPercent: 8, ease: "none",
        scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true }
      });
      gsap.from(p, {
        opacity: 0.2, scale: 0.92, ease: "none",
        scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "left 60%", scrub: true }
      });
    });
    return function () { gsap.set(track, { x: 0 }); };
  });
  mm.add("(max-width: 900px)", function () {
    $$(".project").forEach(function (p) {
      gsap.from(p, { y: 80, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 88%", once: true } });
    });
  });
  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    else {
      var el = typeof target === "string" ? $(target) : target;
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = $(id);
      if (!el) return;
      e.preventDefault();
      closeMenu();
      scrollToTarget(id === "#top" ? 0 : el);
    });
  });

  /* ---------------- Text utilities ---------------- */
  // Wrap every character of an element in .char spans (grouped by .word so lines wrap nicely)
  function splitChars(el) {
    var text = el.textContent;
    el.textContent = "";
    var chars = [];
    text.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(" ")); return; }
      var w = document.createElement("span");
      w.className = "word";
      part.split("").forEach(function (ch) {
        var c = document.createElement("span");
        c.className = "char";
        c.textContent = ch;
        w.appendChild(c);
        chars.push(c);
      });
      el.appendChild(w);
    });
    return chars;
  }

  // Wrap words in a mask (.wm > .wi) for line-style reveals; keeps <em> styling
  function splitWordsMasked(el) {
    var inners = [];
    function walk(node, parent) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var m = document.createElement("span"); m.className = "wm";
            var i = document.createElement("span"); i.className = "wi"; i.textContent = part;
            m.appendChild(i); frag.appendChild(m); inners.push(i);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    }
    walk(el);
    return inners;
  }

  // Wrap words in .w spans (for scroll-filled text)
  function splitWordsPlain(el) {
    var words = [];
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/\s+/).forEach(function (part) {
            if (!part) return;
            var s = document.createElement("span"); s.className = "w"; s.textContent = part;
            frag.appendChild(s); words.push(s);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    }
    walk(el);
    return words;
  }

  // Scramble / decode effect
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";
  function scramble(el, opts) {
    opts = opts || {};
    var final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    if (el._scr) cancelAnimationFrame(el._scr);
    var duration = opts.duration || 600;
    var start = performance.now();
    var keepCase = final === final.toLowerCase() ? "lower" : "mixed";
    (function tick(now) {
      var p = Math.min(1, (now - start) / duration);
      var revealed = Math.floor(p * final.length);
      var out = "";
      for (var i = 0; i < final.length; i++) {
        var ch = final[i];
        if (i < revealed || ch === " " || ch === "@" || ch === ".") out += ch;
        else {
          var g = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          out += keepCase === "lower" ? g.toLowerCase() : g;
        }
      }
      el.textContent = out;
      if (p < 1) el._scr = requestAnimationFrame(tick);
      else { el.textContent = final; el._scr = null; }
    })(start);
  }

  if (finePointer && !reduce) {
    $$("[data-scramble]").forEach(function (el) {
      var host = el.closest("a, button") || el;
      host.addEventListener("mouseenter", function () { scramble(el, { duration: 480 }); });
    });
  }

  /* ---------------- Custom cursor ---------------- */
  var cursor = $(".cursor");
  if (finePointer && cursor && !reduce) {
    html.classList.add("has-cursor");
    var dot = $(".cursor__dot"), ring = $(".cursor__ring"), label = $(".cursor__label");
    var dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    var dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    var rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    var ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    window.addEventListener("pointermove", function (e) {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    }, { passive: true });

    document.addEventListener("pointerover", function (e) {
      var labelled = e.target.closest("[data-cursor]");
      var hoverable = e.target.closest("a, button, input");
      if (labelled) {
        label.textContent = labelled.getAttribute("data-cursor");
        cursor.classList.add("is-label");
        cursor.classList.remove("is-hover");
      } else if (hoverable) {
        cursor.classList.add("is-hover");
        cursor.classList.remove("is-label");
      } else if (e.target.closest("[data-drag]")) {
        label.textContent = "Drag";
        cursor.classList.add("is-label");
        cursor.classList.remove("is-hover");
      } else {
        cursor.classList.remove("is-hover", "is-label");
      }
    });
    document.addEventListener("pointerdown", function () { gsap.to(ring, { scale: 0.8, duration: 0.2 }); });
    document.addEventListener("pointerup", function () { gsap.to(ring, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }); });
    document.addEventListener("mouseleave", function () { gsap.to(cursor, { opacity: 0, duration: 0.3 }); });
    document.addEventListener("mouseenter", function () { gsap.to(cursor, { opacity: 1, duration: 0.3 }); });
  }

  /* ---------------- Magnetic elements ---------------- */
  if (finePointer && !reduce) {
    $$("[data-magnetic]").forEach(function (el) {
      var strength = el.classList.contains("cta__circle") ? 0.45 : 0.3;
      var xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
      var yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
    });
  }

  /* ---------------- Header behaviour ---------------- */
  var header = $(".header");
  var lastScroll = 0;
  function onScrollHeader(y) {
    header.classList.toggle("is-scrolled", y > 40);
    if (!body.classList.contains("menu-open")) {
      header.classList.toggle("is-hidden", y > lastScroll && y > 300);
    }
    lastScroll = y;
  }
  if (lenis) lenis.on("scroll", function (e) { onScrollHeader(e.scroll); });
  else window.addEventListener("scroll", function () { onScrollHeader(window.scrollY); }, { passive: true });

  // scroll progress bar
  gsap.to(".scroll-progress span", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.documentElement, start: 0, end: "max", scrub: 0.3 }
  });

  // active nav link
  $$("main section[id]").forEach(function (sec) {
    ScrollTrigger.create({
      trigger: sec, start: "top 50%", end: "bottom 50%",
      onToggle: function (self) {
        if (!self.isActive) return;
        var id = sec.id === "process" ? "about" : sec.id;
        $$(".nav__link").forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + id); });
      }
    });
  });

  /* ---------------- Mobile menu ---------------- */
  var burger = $(".burger");
  function closeMenu() {
    if (!body.classList.contains("menu-open")) return;
    body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    $(".menu").setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
  }
  burger.addEventListener("click", function () {
    var open = !body.classList.contains("menu-open");
    body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    $(".menu").setAttribute("aria-hidden", String(!open));
    header.classList.remove("is-hidden");
    if (lenis) open ? lenis.stop() : lenis.start();
  });

  /* ---------------- Hero setup ---------------- */
  var heroChars = [];
  $$(".hero [data-chars]").forEach(function (el) { heroChars = heroChars.concat(splitChars(el)); });
  gsap.set(heroChars, { yPercent: 115, rotate: 6 });
  gsap.set(".rotator", { yPercent: 115, opacity: 0 });

  // rotating last word
  var rotList = $(".rotator__list");
  var rotator = $(".rotator");
  function startRotator() {
    var items = $$("span", rotList);
    function fitWidth(i) { gsap.to(rotator, { width: items[i].offsetWidth, duration: 0.8, ease: "expo.inOut" }); }
    gsap.set(rotator, { width: items[0].offsetWidth });
    var i = 0;
    var tl = gsap.timeline({ repeat: -1 });
    for (var n = 1; n < items.length; n++) {
      (function (n) {
        tl.to({}, { duration: 2.2 })
          .call(function () { fitWidth(n); })
          .to(rotList, { yPercent: -(100 / items.length) * n, duration: 0.9, ease: "expo.inOut" }, "<");
      })(n);
    }
    tl.set(rotList, { yPercent: 0 });
    window.addEventListener("resize", function () { gsap.set(rotator, { width: "auto" }); });
  }

  // typing eyebrow
  function typeEyebrow() {
    var tl = gsap.timeline();
    tl.to(".hero__eyebrow", { opacity: 1, duration: 0.01 });
    $$(".hero__eyebrow [data-type]").forEach(function (el, i) {
      tl.call(function () { scramble(el, { duration: 650 }); }, null, i * 0.18);
    });
    return tl;
  }

  function heroIntro() {
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.add(typeEyebrow(), 0)
      .to(heroChars, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.022 }, 0.1)
      .to(".rotator", { yPercent: 0, opacity: 1, duration: 1.4 }, 0.55)
      .fromTo("[data-hero-fade]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.12 }, 0.7)
      .from(".header__inner > *", { y: -30, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.3)
      .from(".hero__side", { opacity: 0, duration: 1.5 }, 1)
      .add(startRotator, 1.6);
    return tl;
  }

  // hero content drifts away as you scroll
  gsap.to(".hero__inner", {
    yPercent: -18, opacity: 0.0, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
  gsap.to(".hero__bottom", {
    opacity: 0, y: -40, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "30% top", scrub: true }
  });

  /* ---------------- Preloader ---------------- */
  function runPreloader() {
    var countEl = $(".preloader__count");
    var counter = { v: 0 };
    var loaded = new Promise(function (resolve) {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", resolve);
      setTimeout(resolve, 4000); // never wait forever
    });
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();

    var tl = gsap.timeline();
    tl.fromTo(".preloader__logo > *", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.07, ease: "expo.out" }, 0)
      .to(counter, {
        v: 86, duration: 1.6, ease: "power2.inOut",
        onUpdate: function () {
          countEl.textContent = String(Math.round(counter.v)).padStart(3, "0");
          gsap.set(".preloader__bar span", { scaleX: counter.v / 100 });
        }
      }, 0.1);

    Promise.all([loaded, fonts, new Promise(function (r) { tl.eventCallback("onComplete", r); })]).then(function () {
      var out = gsap.timeline();
      out.to(counter, {
        v: 100, duration: 0.5, ease: "power2.out",
        onUpdate: function () {
          countEl.textContent = String(Math.round(counter.v)).padStart(3, "0");
          gsap.set(".preloader__bar span", { scaleX: counter.v / 100 });
        }
      })
        .to(".preloader__logo > *", { yPercent: -110, duration: 0.7, stagger: 0.04, ease: "expo.in" }, "+=0.1")
        .to(".preloader__meta, .preloader__bar", { opacity: 0, duration: 0.4 }, "<")
        .call(function () { SCENE.ready = true; })
        .to(".preloader", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" })
        .call(function () {
          body.classList.remove("is-loading");
          if (lenis) lenis.start();
          $(".preloader").style.display = "none";
          ScrollTrigger.refresh();
        })
        .add(heroIntro(), "-=0.7");
    });
  }

  if (reduce) {
    $(".preloader").style.display = "none";
    body.classList.remove("is-loading");
    SCENE.ready = true;
    gsap.set(heroChars, { yPercent: 0, rotate: 0 });
    gsap.set(".rotator", { yPercent: 0, opacity: 1 });
    gsap.set("[data-hero-fade], .hero__eyebrow", { opacity: 1 });
  } else {
    runPreloader();
  }

  /* ---------------- Generic reveals ---------------- */
  $$("[data-reveal]").forEach(function (el) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.3, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  $$("[data-words]").forEach(function (el) {
    var words = splitWordsMasked(el);
    gsap.from(words, {
      yPercent: 110, rotate: 4, duration: 1.3, ease: "expo.out", stagger: 0.06,
      scrollTrigger: { trigger: el, start: "top 85%", once: true }
    });
  });

  // big CTA title: characters rise as it scrolls in
  var ctaChars = [];
  $$("[data-chars-scroll]").forEach(function (el) { ctaChars = ctaChars.concat(splitChars(el)); });
  if (ctaChars.length) {
    gsap.from(ctaChars, {
      yPercent: 120, rotate: 8, opacity: 0, ease: "expo.out", duration: 1.4, stagger: 0.025,
      scrollTrigger: { trigger: ".cta__title", start: "top 80%", once: true }
    });
  }

  // scroll-filled statement
  $$("[data-fill]").forEach(function (el) {
    var words = splitWordsPlain(el);
    gsap.to(words, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 40%", scrub: true }
    });
  });

  // counters
  $$("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2.2, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: function () { el.textContent = Math.round(o.v); }
    });
  });

  // process lines + steps
  $$(".step").forEach(function (step, i) {
    gsap.to($(".step__line i", step), {
      scaleX: 1, duration: 1.6, ease: "expo.inOut", delay: i * 0.15,
      scrollTrigger: { trigger: ".steps", start: "top 80%", once: true }
    });
    gsap.from(step.children, {
      y: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, delay: 0.3 + i * 0.15,
      scrollTrigger: { trigger: ".steps", start: "top 80%", once: true }
    });
  });

  // posts slide in
  $$(".post").forEach(function (p, i) {
    gsap.from(p, {
      y: 60, opacity: 0, duration: 1.2, ease: "expo.out", delay: i * 0.06,
      scrollTrigger: { trigger: p, start: "top 92%", once: true }
    });
  });

  // footer wordmark rises letter by letter
  gsap.from(".footer__brand > *", {
    yPercent: 100, duration: 1.4, ease: "expo.out", stagger: 0.06,
    scrollTrigger: { trigger: ".footer__brand", start: "top 95%", once: true }
  });

  /* ---------------- Marquee (speed + direction follow scroll) ---------------- */
  $$("[data-marquee]").forEach(function (row) {
    var track = $(".marquee__track", row);
    // duplicate the track so it loops seamlessly
    for (var i = 0; i < 2; i++) row.appendChild(track.cloneNode(true));
    var dir = parseFloat(row.getAttribute("data-marquee"));
    var x = 0, base = 0.6;
    gsap.ticker.add(function () {
      var w = track.offsetWidth;
      if (!w) return;
      var boost = 1 + Math.min(12, Math.abs(SCENE.velocity || 0) * 0.35);
      var sign = (SCENE.velocity || 0) < -0.5 ? -1 : 1;
      x -= base * boost * dir * sign;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      row.style.transform = "translate3d(" + x + "px,0,0) skewX(" + (-Math.max(-12, Math.min(12, (SCENE.velocity || 0) * 0.25))) * dir + "deg)";
    });
  });

  /* ---------------- Services slider ---------------- */
  (function slider() {
    var viewport = $(".slider__viewport");
    var track = $(".slider__track");
    if (!track) return;
    var cards = $$(".card", track);
    var current = $(".slider__current");
    var bar = $(".slider__progress span");
    var prevBtn = $('.slider__btn[data-dir="-1"]');
    var nextBtn = $('.slider__btn[data-dir="1"]');
    $(".slider__total").textContent = String(cards.length).padStart(2, "0");
    var idx = 0;

    function maxShift() { return Math.max(0, track.scrollWidth - viewport.clientWidth + 40); }
    function go(i, instant) {
      idx = Math.max(0, Math.min(cards.length - 1, i));
      var shift = Math.min(cards[idx].offsetLeft, maxShift());
      gsap.to(track, { x: -shift, duration: instant ? 0 : 1.1, ease: "expo.out" });
      cards.forEach(function (c, n) { c.classList.toggle("is-active", n === idx); });
      gsap.fromTo(current, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
      current.textContent = String(idx + 1).padStart(2, "0");
      bar.style.transform = "scaleX(" + (idx + 1) / cards.length + ")";
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === cards.length - 1;
    }
    $$(".slider__btn").forEach(function (b) {
      b.addEventListener("click", function () { go(idx + parseInt(b.getAttribute("data-dir"), 10)); });
    });
    cards.forEach(function (c, n) { c.addEventListener("click", function () { if (!moved) go(n); }); });

    // drag / swipe
    var startX = 0, startY = 0, dragging = false, moved = false, baseX = 0;
    viewport.addEventListener("pointerdown", function (e) {
      dragging = true; moved = false; startX = e.clientX; startY = e.clientY;
      baseX = gsap.getProperty(track, "x");
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(e.clientY - startY)) moved = true;
      if (moved) gsap.set(track, { x: baseX + dx * 0.9 });
    });
    window.addEventListener("pointerup", function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.clientX - startX;
      if (moved && Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
      else if (moved) go(idx);
      setTimeout(function () { moved = false; }, 0);
    });
    window.addEventListener("resize", function () { go(idx, true); });
    go(0, true);

    // cards enter with a stagger
    gsap.from(cards, {
      y: 80, opacity: 0, rotateY: -12, duration: 1.4, ease: "expo.out", stagger: 0.1,
      scrollTrigger: { trigger: viewport, start: "top 85%", once: true }
    });
  })();

  // spotlight + 3D tilt on cards
  $$(".card").forEach(function (card) {
    if (!finePointer || reduce) return;
    var rX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
    var rY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      rX((0.5 - py) * 10); rY((px - 0.5) * 12);
    });
    card.addEventListener("pointerleave", function () { rX(0); rY(0); });
  });

  gsap.from(".work__intro > *", {
    y: 50, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.1,
    scrollTrigger: { trigger: ".work", start: "top 70%", once: true }
  });

  /* ---------------- Blog hover preview ---------------- */
  (function preview() {
    var pv = $(".preview");
    if (!pv || !finePointer) return;
    var art = $(".art", pv);
    var xTo = gsap.quickTo(pv, "x", { duration: 0.6, ease: "power3" });
    var yTo = gsap.quickTo(pv, "y", { duration: 0.6, ease: "power3" });
    var rTo = gsap.quickTo(pv, "rotation", { duration: 0.8, ease: "power3" });
    var lastX = 0;
    var arts = {
      rings: '<i></i><i></i><i></i><i></i><i></i>',
      grid: '<i></i>',
      bars: '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>',
      orb: '<i></i><i></i>'
    };
    $$(".post").forEach(function (post) {
      post.addEventListener("pointerenter", function () {
        var k = post.getAttribute("data-art");
        art.className = "art art--" + k;
        art.innerHTML = arts[k] || "";
        gsap.to(pv, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
      });
      post.addEventListener("pointerleave", function () {
        gsap.to(pv, { opacity: 0, scale: 0.6, duration: 0.5, ease: "expo.out" });
      });
    });
    window.addEventListener("pointermove", function (e) {
      xTo(e.clientX); yTo(e.clientY);
      rTo(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6)));
      lastX = e.clientX;
    }, { passive: true });
  })();

  /* ---------------- Scene choreography (3D ribbon follows sections) ---------------- */
  var sceneTl = null;
  function buildSceneTimeline() {
    if (sceneTl) { sceneTl.scrollTrigger && sceneTl.scrollTrigger.kill(); sceneTl.kill(); }
    var secs = $$("[data-scene]");
    if (!secs.length || !SCENE.state) return;
    var parse = function (el) { try { return JSON.parse(el.getAttribute("data-scene")); } catch (e) { return {}; } };
    var first = parse(secs[0]);
    Object.keys(first).forEach(function (k) { SCENE.state[k] = first[k]; });

    var max = ScrollTrigger.maxScroll(window) || 1;
    sceneTl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: document.documentElement, start: 0, end: "max", scrub: 1.4 }
    });
    sceneTl.set(SCENE.state, first, 0);
    var prev = 0;
    secs.slice(1).forEach(function (sec) {
      var top = sec.getBoundingClientRect().top + window.scrollY;
      var at = Math.max(prev + 0.001, Math.min(1, (top - window.innerHeight * 0.35) / max));
      sceneTl.to(SCENE.state, Object.assign({ duration: at - prev }, parse(sec)), prev);
      prev = at;
    });
    if (prev < 1) sceneTl.to({}, { duration: 1 - prev }, prev);
  }

  // build once everything (including pins) is measured
  ScrollTrigger.addEventListener("refresh", function () {
    if (!buildSceneTimeline._busy) {
      buildSceneTimeline._busy = true;
      buildSceneTimeline();
      ScrollTrigger.update();
      buildSceneTimeline._busy = false;
    }
  });
  buildSceneTimeline();
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
