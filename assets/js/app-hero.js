/* =====================================================
   FORGE — app page hero (ported from the approved
   forge-hero concept): handwriting writes itself onto the
   page, dissolves into embers that cross to the coach
   panel, and the reply forms word by word. Zero external
   assets.
   ===================================================== */
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroEl = document.querySelector('.app-hero');
  if (!heroEl) return;

  /* ---------- canvas: ambient embers + the bridge ---------- */
  const canvas = heroEl.querySelector('.hero-canvas');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const ambient = [], bridge = [];
  let emitting = false;
  let visible = true;

  function sizeCanvas() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seedAmbient() {
    ambient.length = 0;
    const n = Math.round((W * H) / 34000);
    for (let i = 0; i < n; i++) {
      ambient.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.4,
        vy: -(Math.random() * 0.22 + 0.06),
        vx: (Math.random() - 0.5) * 0.14,
        a: Math.random() * 0.4 + 0.12,
        tw: Math.random() * Math.PI * 2
      });
    }
  }

  /* where the embers travel from → to */
  function bridgePoints() {
    const from = heroEl.querySelector('.paper');
    const to = heroEl.querySelector('.coach');
    if (!from || !to) return null;
    const host = canvas.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    return {
      ax: a.right - host.left, ay: a.top - host.top + a.height * 0.62,
      bx: b.left - host.left, by: b.top - host.top + b.height * 0.5
    };
  }

  function emit() {
    const p = bridgePoints();
    if (!p) return;
    for (let i = 0; i < 3; i++) {
      bridge.push({
        x: p.ax - Math.random() * 40,
        y: p.ay + (Math.random() - 0.5) * 26,
        tx: p.bx + Math.random() * 16,
        ty: p.by + (Math.random() - 0.5) * 36,
        t: 0,
        sp: Math.random() * 0.007 + 0.0055,
        r: Math.random() * 1.7 + 0.7,
        arc: (Math.random() - 0.55) * 70
      });
    }
  }

  function draw() {
    if (visible) {
      ctx.clearRect(0, 0, W, H);
      for (const s of ambient) {
        s.y += s.vy; s.x += s.vx; s.tw += 0.02;
        if (s.y < -10) { s.y = H + 10; s.x = Math.random() * W; }
        const flick = s.a * (0.65 + Math.sin(s.tw) * 0.35);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,150,63,' + flick.toFixed(3) + ')';
        ctx.fill();
      }
      if (emitting) emit();
      for (let j = bridge.length - 1; j >= 0; j--) {
        const e = bridge[j];
        e.t += e.sp;
        if (e.t >= 1) { bridge.splice(j, 1); continue; }
        const ease = e.t * e.t * (3 - 2 * e.t);
        const x = e.x + (e.tx - e.x) * ease;
        const y = e.y + (e.ty - e.y) * ease + Math.sin(e.t * Math.PI) * e.arc;
        const fade = Math.sin(e.t * Math.PI);
        ctx.beginPath();
        ctx.arc(x, y, e.r * (1 - e.t * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,166,75,' + (fade * 0.85).toFixed(3) + ')';
        ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(232,166,75,.55)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    requestAnimationFrame(draw);
  }

  sizeCanvas(); seedAmbient();
  addEventListener('resize', () => { sizeCanvas(); seedAmbient(); });
  new IntersectionObserver(es => {
    es.forEach(e => { visible = e.isIntersecting; });
  }, { threshold: 0.02 }).observe(heroEl);
  if (!reduce) requestAnimationFrame(draw);

  /* ---------- split the reply into words for the stagger ---------- */
  const reply = heroEl.querySelector('.reply');
  const wordsSrc = reply.textContent.trim().split(' ');
  reply.innerHTML = wordsSrc.map(w => '<span>' + w + '</span>').join(' ');
  const wordEls = reply.querySelectorAll('span');

  /* ---------- sequence ---------- */
  const fades = heroEl.querySelectorAll('.fade');
  const paper = heroEl.querySelector('.paper');
  const coach = heroEl.querySelector('.coach');
  const hand = heroEl.querySelector('.hand');
  const pen = heroEl.querySelector('.pen');
  const wrap = heroEl.querySelector('.hand-wrap');
  let timers = [];

  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function clearAll() { timers.forEach(clearTimeout); timers = []; }

  function reset() {
    hand.classList.remove('written', 'spent');
    coach.classList.remove('lit');
    pen.style.transition = 'none';
    pen.style.opacity = 0;
    pen.style.left = '0px';
    wordEls.forEach(el => el.classList.remove('on'));
    emitting = false;
    bridge.length = 0;
    void pen.offsetWidth;
    pen.style.transition = 'opacity .35s ease';
  }

  function run() {
    clearAll(); reset();

    fades.forEach((el, i) => { at(80 + i * 110, () => el.classList.add('in')); });

    at(700, () => paper.classList.add('in'));
    at(950, () => coach.classList.add('in'));

    /* handwriting */
    at(1250, () => {
      pen.style.opacity = 1;
      hand.classList.add('written');
      pen.style.transition = 'left 2.5s cubic-bezier(.42,0,.35,1), opacity .35s ease';
      pen.style.left = wrap.offsetWidth + 'px';
    });
    at(3700, () => { pen.style.opacity = 0; });

    /* dissolve → bridge */
    at(4050, () => { hand.classList.add('spent'); emitting = true; });
    at(4750, () => coach.classList.add('lit'));

    /* the reply forms */
    at(5000, () => {
      wordEls.forEach((el, i) => {
        at(i * 62, () => el.classList.add('on'));
      });
    });

    at(6500, () => { emitting = false; });

    /* loop */
    at(13500, run);
  }

  if (reduce) {
    fades.forEach(el => el.classList.add('in'));
    paper.classList.add('in');
    coach.classList.add('in', 'lit');
    hand.classList.add('written', 'spent');
    wordEls.forEach(el => el.classList.add('on'));
  } else {
    run();
    const replay = heroEl.querySelector('.replay');
    if (replay) replay.addEventListener('click', run);
  }
})();
