/* =====================================================
   BUILT NOT BORN · FORGE — Home-only cinematics
   The hero is an environment: heat below the frame, embers
   at two depths, light sweeping the type, cursor parallax.
   The creed zone (#bnb) is kept exactly as approved.
   Canvas loops are gated by visibility so no more than one
   zone's canvases animate in the viewport at a time.
   ===================================================== */
(function () {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* =====================================================
     HERO — ember fields at two depths
     far: small, slow, dim — behind the type
     near: larger, faster, brighter — IN FRONT of the type
     ===================================================== */
  const hero = document.getElementById('hero');
  let heroVisible = true;

  function field(el, opts) {
    const ctx = el.getContext('2d');
    let W = 0, H = 0, parts = [];
    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = el.clientWidth; H = el.clientHeight;
      el.width = W * dpr; el.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }
    function seed() {
      parts = [];
      const n = Math.round((W * H) / opts.density);
      for (let i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * opts.size + opts.size * 0.35,
          vy: -(Math.random() * opts.speed + opts.speed * 0.35),
          vx: (Math.random() - 0.5) * opts.drift,
          a: Math.random() * opts.alpha + opts.alpha * 0.3,
          tw: Math.random() * Math.PI * 2,
          ts: Math.random() * 0.03 + 0.012
        });
      }
    }
    /* strike bursts share the creed-burst grammar: radial, gravity, hot/gold */
    let bursts = [];
    function draw() {
      if (!heroVisible && !bursts.length) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.y += p.vy; p.x += p.vx; p.tw += p.ts;
        if (p.y < -14) { p.y = H + 14; p.x = Math.random() * W; }
        if (p.x < -14) p.x = W + 14;
        if (p.x > W + 14) p.x = -14;
        const f = p.a * (0.55 + Math.sin(p.tw) * 0.45);
        if (f <= 0) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + opts.rgb + ',' + f.toFixed(3) + ')';
        if (opts.glow) { ctx.shadowBlur = opts.glow; ctx.shadowColor = 'rgba(' + opts.rgb + ',.6)'; }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const s = bursts[i]; s.x += s.vx; s.y += s.vy; s.vy += 0.14; s.vx *= 0.985; s.life -= s.decay;
        if (s.life <= 0) { bursts.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.hot ? '#fff3d6' : '#E8A33D';
        ctx.shadowColor = '#E8A33D'; ctx.shadowBlur = 8; ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      requestAnimationFrame(draw);
    }
    size();
    addEventListener('resize', size);
    return {
      start() { requestAnimationFrame(draw); },
      burst(x, y) {
        for (let i = 0; i < 64; i++) {
          const ang = Math.random() * Math.PI * 2; const sp = Math.random() * 5.4 + 1.8;
          bursts.push({
            x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - Math.random() * 2,
            life: 1, decay: Math.random() * 0.02 + 0.012, r: Math.random() * 1.8 + 0.5, hot: Math.random() > 0.45
          });
        }
        requestAnimationFrame(draw);
      }
    };
  }

  let nearField = null;
  if (!reduceMotion) {
    const far = field(hero.querySelector('.embers-far'),
      { density: 26000, size: 1.1, speed: 0.16, drift: 0.1, alpha: 0.30, rgb: '201,150,63', glow: 0 });
    nearField = field(hero.querySelector('.embers-near'),
      { density: 120000, size: 2.3, speed: 0.55, drift: 0.32, alpha: 0.55, rgb: '232,166,75', glow: 12 });
    new IntersectionObserver(es => {
      es.forEach(e => {
        const was = heroVisible;
        heroVisible = e.isIntersecting;
        if (heroVisible && !was) { far.start(); nearField.start(); }
      });
    }, { threshold: 0.02 }).observe(hero);
    far.start(); nearField.start();
  }

  /* =====================================================
     HERO — cursor parallax across three planes, lerped.
     Each ghost line moves at its own rate (internal depth);
     strike jolts and the headline shudder decay in-loop.
     The ghost's centring is CSS — JS only adds translates.
     ===================================================== */
  const ghost = hero.querySelector('.ghost');
  const ghostLines = [...ghost.querySelectorAll('span')];
  const centre = hero.querySelector('.centre');
  const glow = hero.querySelector('.forge-glow');
  /* per-line parallax rates + outward jolt directions */
  const LINE_RATES = [[52, 36], [40, 27], [30, 19]];
  const JOLT_DIRS = [[-7, -20], [12, 0], [7, 20]];
  let joltAmp = 0, shudAmp = 0, shudPhase = 0;

  if (!reduceMotion) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    if (finePointer) {
      addEventListener('mousemove', e => {
        tx = (e.clientX / innerWidth - 0.5);
        ty = (e.clientY / innerHeight - 0.5);
      });
    }
    (function heroLoop() {
      if (heroVisible) {
        cx += (tx - cx) * 0.045;
        cy += (ty - cy) * 0.045;
        joltAmp *= 0.86;
        shudAmp *= 0.82; shudPhase += 0.9;
        const shud = Math.sin(shudPhase) * shudAmp * 3;
        ghostLines.forEach((line, i) => {
          const jx = JOLT_DIRS[i][0] * joltAmp, jy = JOLT_DIRS[i][1] * joltAmp;
          line.style.transform = 'translate3d(' + (cx * LINE_RATES[i][0] + jx) + 'px,' + (cy * LINE_RATES[i][1] + jy) + 'px,0)';
        });
        centre.style.transform = 'perspective(1200px) translate3d(' + (cx * -16 + shud) + 'px,' + (cy * -11) + 'px,0) rotateY(' + (cx * 2.1) + 'deg) rotateX(' + (cy * -1.5) + 'deg)';
        glow.style.transform = 'translateX(-50%) translate3d(' + (cx * 26) + 'px,0,0)';
      }
      requestAnimationFrame(heroLoop);
    })();
  }

  /* =====================================================
     STRIKE THE FORGE — the whole hero is the anvil.
     Fires on clean taps only (not scrolls, not links),
     throttled, disabled under reduced motion.
     ===================================================== */
  if (!reduceMotion) {
    const flash = hero.querySelector('.hero-flash');
    const hint = document.getElementById('strike-hint');
    let lastStrike = 0, struckOnce = false;
    let downX = 0, downY = 0, moved = false, armed = false;

    function strike(x, y) {
      const now = performance.now();
      if (now - lastStrike < 400) return;
      lastStrike = now;
      /* embers burst radially from the strike point (near canvas) */
      if (nearField) {
        const r = hero.getBoundingClientRect();
        nearField.burst(x - r.left, y - r.top);
      }
      /* ghost lines jolt outward and flare */
      joltAmp = 1;
      ghost.classList.remove('struck'); void ghost.offsetWidth; ghost.classList.add('struck');
      /* forge glow surges */
      glow.classList.remove('flare'); void glow.offsetWidth; glow.classList.add('flare');
      /* brief white-gold flash */
      flash.classList.remove('hit'); void flash.offsetWidth; flash.classList.add('hit');
      /* damped headline shudder */
      shudAmp = 1; shudPhase = 0;
      if (!struckOnce) {
        struckOnce = true;
        /* the rise animation's forwards fill would override inline opacity */
        hint.style.animation = 'none';
        hint.style.opacity = '0';
      }
    }

    hero.addEventListener('pointerdown', e => {
      armed = !e.target.closest('a, button, nav, #rail');
      downX = e.clientX; downY = e.clientY; moved = false;
    });
    hero.addEventListener('pointermove', e => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 10) moved = true;
    });
    hero.addEventListener('pointerup', e => {
      if (armed && !moved) strike(e.clientX, e.clientY);
      armed = false;
    });
  }

  /* =====================================================
     ZONE 2: THE CREED — kept exactly as approved
     ===================================================== */
  const bnb = document.getElementById('bnb');
  const bnbPin = document.getElementById('bnb-pin');
  const words = [...document.querySelectorAll('#bnb .w')];
  const litWords = new Set();
  let bnbVisible = false;

  function shake(target) {
    if (reduceMotion) return;
    target.classList.remove('shake'); void target.offsetWidth; target.classList.add('shake');
  }

  function docTop(el) { return el.getBoundingClientRect().top + window.scrollY; }
  function bnbProgress() {
    const total = bnb.offsetHeight - innerHeight;
    return total > 0 ? Math.max(0, Math.min(1, (scrollY - docTop(bnb)) / total)) : 0;
  }

  /* ambient sparks bound to the pin */
  (function makeSparks(canvasEl, hostEl, density) {
    const sx = canvasEl.getContext('2d'); let parts = [];
    function rs() { const r = hostEl.getBoundingClientRect(); canvasEl.width = r.width; canvasEl.height = r.height; mk(); }
    function mk() {
      parts = []; const n = Math.floor(canvasEl.width * canvasEl.height / density);
      for (let i = 0; i < n; i++) parts.push({
        x: Math.random() * canvasEl.width, y: Math.random() * canvasEl.height,
        vy: -(Math.random() * 0.4 + 0.08), vx: (Math.random() - 0.5) * 0.22, r: Math.random() * 1.4 + 0.3,
        o: Math.random() * 0.5 + 0.12, tw: Math.random() * 0.02 + 0.005, tp: Math.random() * Math.PI * 2
      });
    }
    function anim() {
      if (bnbVisible) {
        sx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        for (const p of parts) {
          p.y += p.vy; p.x += p.vx; p.tp += p.tw;
          if (p.y < -5) { p.y = canvasEl.height + 5; p.x = Math.random() * canvasEl.width; }
          const fl = p.o * (0.6 + 0.4 * Math.sin(p.tp));
          sx.beginPath(); sx.arc(p.x, p.y, p.r, 0, Math.PI * 2); sx.fillStyle = 'rgba(232,163,61,' + fl + ')'; sx.fill();
        }
      }
      requestAnimationFrame(anim);
    }
    rs(); addEventListener('resize', rs); if (!reduceMotion) anim();
  })(document.getElementById('bnb-sparks'), bnbPin, 34000);

  /* burst sparks when a word strikes */
  const bc = document.getElementById('bnb-burst');
  let bSparks = [];
  const bcx = bc.getContext('2d');
  function bcResize() { const r = bnbPin.getBoundingClientRect(); bc.width = r.width; bc.height = r.height; }
  bcResize(); addEventListener('resize', bcResize);
  function spawnBnbBurst(wordEl) {
    if (reduceMotion) return;
    const pin = bnbPin.getBoundingClientRect();
    const wr = wordEl.getBoundingClientRect();
    const ox = wr.left - pin.left + wr.width / 2, oy = wr.top - pin.top + wr.height * 0.5;
    for (let i = 0; i < 52; i++) {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.9; const sp = Math.random() * 4.6 + 1.6;
      bSparks.push({
        x: ox, y: oy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - Math.random() * 1.6,
        life: 1, decay: Math.random() * 0.02 + 0.011, r: Math.random() * 1.7 + 0.5, hot: Math.random() > 0.5
      });
    }
  }
  function bnbBurstAnim() {
    if (bnbVisible || bSparks.length) {
      bcx.clearRect(0, 0, bc.width, bc.height);
      for (let i = bSparks.length - 1; i >= 0; i--) {
        const s = bSparks[i]; s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.vx *= 0.985; s.life -= s.decay;
        if (s.life <= 0) { bSparks.splice(i, 1); continue; }
        bcx.globalAlpha = Math.max(0, s.life); bcx.beginPath(); bcx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        bcx.fillStyle = s.hot ? '#fff3d6' : '#E8A33D'; bcx.shadowColor = '#E8A33D'; bcx.shadowBlur = 7; bcx.fill();
      }
      bcx.globalAlpha = 1; bcx.shadowBlur = 0;
    }
    requestAnimationFrame(bnbBurstAnim);
  }
  if (!reduceMotion) bnbBurstAnim();

  new IntersectionObserver(es => {
    es.forEach(e => { bnbVisible = e.isIntersecting; });
  }, { threshold: 0.02 }).observe(bnb);

  /* =====================================================
     MANIFESTO heat text
     ===================================================== */
  const heats = [...document.querySelectorAll('#manifesto .heat')];
  heats.forEach(el => {
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const ch of n.textContent) {
            if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); continue; }
            const c = document.createElement('char'); c.textContent = ch; frag.appendChild(c);
          }
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') { walk(n); }
      });
    };
    walk(el);
  });
  const allChars = [...document.querySelectorAll('#manifesto char')];
  const manifesto = document.getElementById('manifesto');
  function heatUpdate() {
    if (reduceMotion) return;
    const r = manifesto.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = Math.max(0, Math.min(1, (innerHeight * 0.85 - r.top) / (r.height * 0.9)));
    const cut = Math.floor(p * allChars.length * 1.15);
    for (let i = 0; i < allChars.length; i++) {
      const c = allChars[i];
      if (i < cut - 6) { if (!c.classList.contains('hot')) { c.classList.add('hot'); c.classList.remove('warm'); } }
      else if (i < cut) { c.classList.add('warm'); c.classList.remove('hot'); }
      else { c.classList.remove('hot', 'warm'); }
    }
  }
  if (reduceMotion) allChars.forEach(c => c.classList.add('hot'));

  /* =====================================================
     SCROLL LOOP — creed strikes + manifesto heat
     ===================================================== */
  let bnbForgedFired = false;
  function loop() {
    const bp = bnbProgress();
    const th = [0.10, 0.26, 0.42];
    if (!reduceMotion) {
      words.forEach((w, i) => {
        if (bp >= th[i]) {
          if (!w.classList.contains('lit')) {
            w.classList.add('lit');
            if (!litWords.has(i)) { litWords.add(i); spawnBnbBurst(w); shake(bnbPin); }
          }
        }
        else { w.classList.remove('lit'); litWords.delete(i); }
      });
      if (bp >= 0.62) {
        if (!bnb.classList.contains('forged')) {
          bnb.classList.add('forged');
          if (!bnbForgedFired) { bnbForgedFired = true; words.forEach(w => spawnBnbBurst(w)); shake(bnbPin); }
        }
      } else { bnb.classList.remove('forged'); bnbForgedFired = false; }
    }
    heatUpdate();
    requestAnimationFrame(loop);
  }
  if (reduceMotion) {
    words.forEach(w => w.classList.add('lit'));
    bnb.classList.add('forged');
  } else {
    requestAnimationFrame(loop);
  }
})();
