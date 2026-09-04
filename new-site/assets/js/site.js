/* =====================================================
   BUILT NOT BORN · FORGE — shared site module
   Loaded on every page. Home-only cinematics live in home.js.
   ===================================================== */
(function () {
  'use strict';

  /* =====================================================
     LAUNCH SWITCH
     FORGE is pre-launch: pending final device testing, not yet
     approved on the App Store. Flip APP_LIVE to true on approval
     and every primary CTA becomes "Download on the App Store" —
     no HTML changes needed.
     ===================================================== */
  const APP_LIVE = false;
  // TODO: replace with the real App Store URL once FORGE is approved.
  const APP_STORE_URL = '#';
  const EARLY_ACCESS_URL = 'community.html#waitlist';

  /* =====================================================
     FORM ENDPOINTS — set once, used by every form.
     Any provider that accepts a plain POST works (Kit /
     ConvertKit form action URL, Formspree form URL, or
     Netlify Forms). Field names sent: email (+ name,
     request on the tool-request form) — rename the inputs
     in the HTML if your provider expects different names.
     While an endpoint is empty its forms stay disabled and
     say so honestly — no fake success states.
     ===================================================== */
  // TODO: paste the waitlist form endpoint here (Kit / Formspree / Netlify)
  const WAITLIST_ENDPOINT = '';
  // TODO: paste the "request a tool" form endpoint here
  const REQUEST_ENDPOINT = '';
  const CONTACT_EMAIL = 'admin@builtnotborn.uk';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* ============ CTA SWITCHING ============ */
  document.querySelectorAll('[data-app-cta]').forEach(el => {
    if (APP_LIVE) {
      el.textContent = 'Download on the App Store';
      el.setAttribute('href', APP_STORE_URL);
    } else {
      el.textContent = 'Join Early Access';
      el.setAttribute('href', EARLY_ACCESS_URL);
    }
  });
  // Store badge slots (app.html CTA panel): pending vs live
  document.querySelectorAll('[data-store-slot]').forEach(el => {
    const small = el.querySelector('.st-text small');
    if (APP_LIVE) {
      if (small) small.textContent = 'Download on the';
      el.classList.remove('store-note');
      el.classList.add('btn-primary');
      if (el.tagName === 'A') el.setAttribute('href', APP_STORE_URL);
    }
  });

  /* ============ NAV: scrolled state, active page, mobile menu ============ */
  const nav = document.querySelector('nav.site-nav');
  const page = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('nav.site-nav a, #mobile-menu a, footer .f-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && (href === './' || href === 'index.html'))) {
      a.classList.add('active');
    }
  });
  const burger = document.querySelector('.nav-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('#mobile-menu a').forEach(a =>
      a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  }
  if (nav) {
    const navScroll = () => nav.classList.toggle('scrolled', scrollY > 60);
    addEventListener('scroll', navScroll, { passive: true });
    navScroll();
  }

  /* ============ DESCENT RAIL — generic, per-page section labels ============ */
  const rail = document.getElementById('rail');
  if (rail) {
    const railFill = document.getElementById('rail-fill');
    const stops = [...rail.querySelectorAll('.stop')]
      .map(a => ({ a, el: document.querySelector(a.getAttribute('href')) }))
      .filter(s => s.el);
    function railUpdate() {
      const docH = document.documentElement.scrollHeight - innerHeight;
      if (railFill) railFill.style.height = (docH > 0 ? (scrollY / docH) * 100 : 0) + '%';
      rail.classList.toggle('on', scrollY > innerHeight * 0.25);
      let live = stops[0];
      for (const s of stops) {
        if (s.el.getBoundingClientRect().top < innerHeight * 0.5) live = s;
      }
      stops.forEach(s => s.a.classList.toggle('live', s === live));
    }
    addEventListener('scroll', railUpdate, { passive: true });
    addEventListener('resize', railUpdate);
    railUpdate();
  }

  /* ============ CUSTOM CURSOR ============ */
  if (finePointer && !reduceMotion) {
    const dot = document.getElementById('cursor-dot'), ring = document.getElementById('cursor-ring');
    if (dot && ring) {
      let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      });
      (function cur() {
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(cur);
      })();
      document.querySelectorAll('a,button,input,.tilt').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }
  }

  /* ============ MAGNETIC BUTTONS ============ */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.18}px,${dy * 0.28}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = 'translate(0,0)';
        setTimeout(() => el.style.transition = '', 450);
      });
    });
  }

  /* ============ 3D TILT (phone, journal cover, visual panels) ============ */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.tilt').forEach(el => {
      const max = parseFloat(el.dataset.tiltMax || '8');
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = 'rotateY(0) rotateX(0)';
        setTimeout(() => el.style.transition = 'transform 0.2s ease-out', 600);
      });
    });
  }

  /* ============ REVEAL ON SCROLL ============ */
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.16 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ============ PAGE SPARKS — lightweight ambient field ============ */
  const pageSparks = document.getElementById('page-sparks');
  if (pageSparks && !reduceMotion) {
    const sx = pageSparks.getContext('2d');
    let parts = [];
    // Home uses a denser field via data-density; inner pages stay light for load time.
    const density = parseFloat(pageSparks.dataset.density || '52000');
    function rs() {
      pageSparks.width = innerWidth; pageSparks.height = innerHeight; mk();
    }
    function mk() {
      parts = [];
      const n = Math.floor(pageSparks.width * pageSparks.height / density);
      for (let i = 0; i < n; i++) parts.push({
        x: Math.random() * pageSparks.width, y: Math.random() * pageSparks.height,
        vy: -(Math.random() * 0.4 + 0.08), vx: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.3, o: Math.random() * 0.5 + 0.12,
        tw: Math.random() * 0.02 + 0.005, tp: Math.random() * Math.PI * 2
      });
    }
    function anim() {
      sx.clearRect(0, 0, pageSparks.width, pageSparks.height);
      for (const p of parts) {
        p.y += p.vy; p.x += p.vx; p.tp += p.tw;
        if (p.y < -5) { p.y = pageSparks.height + 5; p.x = Math.random() * pageSparks.width; }
        const fl = p.o * (0.6 + 0.4 * Math.sin(p.tp));
        sx.beginPath(); sx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        sx.fillStyle = 'rgba(232,163,61,' + fl + ')'; sx.fill();
      }
      requestAnimationFrame(anim);
    }
    rs(); addEventListener('resize', rs); anim();
    const sparkScroll = () => pageSparks.classList.toggle('active',
      pageSparks.dataset.always === 'true' || scrollY > innerHeight * 0.7);
    addEventListener('scroll', sparkScroll, { passive: true });
    sparkScroll();
  }

  /* ============ COUNTERS — stat band counts itself up ============ */
  const cntIo = new IntersectionObserver(es => {
    es.forEach(en => {
      if (!en.isIntersecting) return;
      cntIo.unobserve(en.target);
      const el = en.target, to = parseInt(el.dataset.to, 10);
      if (reduceMotion) { el.textContent = to; return; }
      const t0 = performance.now(), dur = 1400;
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.cnt').forEach(el => cntIo.observe(el));

  /* ============ FAQ ACCORDION ============ */
  document.querySelectorAll('.faq .qa').forEach(qa => {
    const btn = qa.querySelector('button'), ans = qa.querySelector('.ans');
    btn.addEventListener('click', () => {
      const open = qa.classList.contains('open');
      qa.closest('.faq').querySelectorAll('.qa.open').forEach(o => {
        o.classList.remove('open'); o.querySelector('.ans').style.maxHeight = '0px';
        o.querySelector('button').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        qa.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =====================================================
     LIGHTBOX — opens a gallery image full-size over a dark
     backdrop. Closes on backdrop click, the close button, or
     Escape. Focus is trapped inside while open and handed back
     to the tile that opened it on close.
     ===================================================== */
  const lightbox = (() => {
    let box = null, imgEl, capEl, closeBtn, lastFocus = null;

    function build() {
      box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', 'Enlarged image');
      box.hidden = true;
      box.innerHTML =
        '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
        '<figure class="lb-fig"><img class="lb-img" alt="" /><figcaption class="lb-cap"></figcaption></figure>';
      document.body.appendChild(box);
      imgEl = box.querySelector('.lb-img');
      capEl = box.querySelector('.lb-cap');
      closeBtn = box.querySelector('.lb-close');
      closeBtn.addEventListener('click', close);
      // backdrop or the padding around the image closes; the image itself does not
      box.addEventListener('click', e => {
        if (e.target === box || e.target.classList.contains('lb-fig')) close();
      });
      box.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); close(); return; }
        if (e.key === 'Tab') trapTab(e);
      });
    }

    function focusables() {
      return [...box.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.hidden && !el.disabled);
    }

    function trapTab(e) {
      const f = focusables();
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function open(src, alt) {
      if (!box) build();
      lastFocus = document.activeElement;
      imgEl.src = src;
      imgEl.alt = alt || '';
      capEl.textContent = alt || '';
      box.hidden = false;
      document.body.classList.add('lightbox-open');
      requestAnimationFrame(() => { box.classList.add('on'); closeBtn.focus(); });
    }

    function close() {
      if (!box || box.hidden) return;
      box.classList.remove('on');
      document.body.classList.remove('lightbox-open');
      const done = () => {
        box.hidden = true;
        imgEl.removeAttribute('src');
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
        lastFocus = null;
      };
      if (reduceMotion) done(); else setTimeout(done, 260);
    }

    return { open, close };
  })();

  /* =====================================================
     GALLERIES — read numbered files from assets/screenshots/.
     A missing file swaps to a molten-gold-outline placeholder,
     never a broken-image icon.
     Markup: <div class="gallery" data-src="assets/screenshots/app/app-{n}.png"
                  data-count="6" data-alts='["...","..."]'></div>
     ===================================================== */
  document.querySelectorAll('.gallery[data-src]').forEach(g => {
    const tpl = g.dataset.src;
    const count = parseInt(g.dataset.count || '6', 10);
    let alts = [];
    try { alts = JSON.parse(g.dataset.alts || '[]'); } catch (e) { alts = []; }
    const label = g.dataset.label || 'Screenshot';
    for (let n = 1; n <= count; n++) {
      const fig = document.createElement('figure');
      const img = document.createElement('img');
      const alt = alts[n - 1] || (label + ' ' + n);
      img.src = tpl.replace('{n}', n);
      img.alt = alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-open';
      btn.setAttribute('aria-label', 'View larger: ' + alt);
      btn.addEventListener('click', () => lightbox.open(img.currentSrc || img.src, alt));
      img.addEventListener('error', () => {
        const slot = document.createElement('div');
        slot.className = 'ph-slot';
        slot.setAttribute('role', 'img');
        slot.setAttribute('aria-label', alt + ' (coming soon)');
        slot.innerHTML = '<span class="ph-spark" aria-hidden="true"></span>' +
          '<span class="ph-lbl">' + label + ' ' + n + '</span>' +
          '<span class="ph-sub">Being forged</span>';
        btn.replaceWith(slot);
      });
      btn.appendChild(img);
      fig.appendChild(btn);
      g.appendChild(fig);
    }
  });

  /* =====================================================
     FORMS — waitlist + request-a-tool.
     Success is only ever shown after a real 2xx response.
     ===================================================== */
  function wireForm(form, endpoint, pendingMsg) {
    const btn = form.querySelector('button[type="submit"]');
    const msg = form.parentElement.querySelector('.form-msg');
    const okEl = form.parentElement.querySelector('.form-success');
    const setMsg = (t, isErr) => {
      if (!msg) return;
      msg.textContent = t;
      msg.classList.toggle('error', !!isErr);
    };
    if (!endpoint) {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
      setMsg(pendingMsg);
      form.addEventListener('submit', e => e.preventDefault());
      return;
    }
    form.addEventListener('submit', async e => {
      e.preventDefault();
      /* honeypot: bots fill it, humans never see it */
      const hp = form.querySelector('.hp-field');
      if (hp && hp.value) return;
      /* inline validation */
      let firstBad = null;
      form.querySelectorAll('input:not(.hp-field), textarea').forEach(el => {
        if (!el.checkValidity() && !firstBad) firstBad = el;
      });
      if (firstBad) {
        firstBad.focus();
        setMsg(firstBad.type === 'email' ? 'Enter a valid email address.' : 'Fill in every field.', true);
        return;
      }
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      setMsg('');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.style.display = 'none';
        if (msg) msg.style.display = 'none';
        if (okEl) okEl.classList.add('show');
      } catch (err) {
        btn.disabled = false;
        btn.textContent = original;
        setMsg("That didn't go through. Try again, or email ", true);
        if (msg) {
          const a = document.createElement('a');
          a.href = 'mailto:' + CONTACT_EMAIL;
          a.textContent = CONTACT_EMAIL;
          msg.appendChild(a);
          msg.appendChild(document.createTextNode('.'));
        }
      }
    });
  }
  document.querySelectorAll('form.waitlist-form').forEach(f => wireForm(f, WAITLIST_ENDPOINT, 'Signup opens shortly.'));
  document.querySelectorAll('form.request-form').forEach(f => wireForm(f, REQUEST_ENDPOINT, 'Requests open shortly.'));

  /* =====================================================
     REFLECTION DEMO — write, scan, get coached back (app.html)
     ===================================================== */
  const demoInk = document.getElementById('demo-ink');
  if (demoInk) {
    const demoOut = document.getElementById('demo-out');
    const demoCaret = document.getElementById('demo-caret');
    const demoPaper = document.getElementById('demo-paper');
    const demoLbl = document.getElementById('demo-stage-lbl');
    const INK_TEXT = "Slept badly again. Skipped the gym. Big pitch tomorrow and I can't switch off at night.";
    const OUT_TEXT = "Third night of bad sleep, and the gym is the first thing to go every time. The pitch isn't the problem. The 11pm scroll is. Phone out of the room tonight. Win the evening, and tomorrow wins itself.";
    let demoRunning = false, demoTimers = [];
    function demoClear() { demoTimers.forEach(t => clearTimeout(t)); demoTimers = []; }
    function runDemo() {
      if (demoRunning) return; demoRunning = true; demoClear();
      demoPaper.classList.remove('scanning');
      demoOut.textContent = ''; demoCaret.style.visibility = 'hidden'; demoLbl.textContent = 'Write';
      demoInk.innerHTML = '';
      if (reduceMotion) {
        demoInk.textContent = INK_TEXT; demoOut.textContent = OUT_TEXT; demoRunning = false; return;
      }
      const frag = document.createDocumentFragment();
      for (const ch of INK_TEXT) { const s = document.createElement('span'); s.textContent = ch; frag.appendChild(s); }
      demoInk.appendChild(frag);
      const spans = [...demoInk.children];
      spans.forEach((s, i) => { demoTimers.push(setTimeout(() => s.classList.add('on'), i * 26)); });
      const writeDur = spans.length * 26 + 500;
      demoTimers.push(setTimeout(() => { demoLbl.textContent = 'Scan'; demoPaper.classList.add('scanning'); }, writeDur));
      demoTimers.push(setTimeout(() => {
        demoLbl.textContent = 'Answer'; demoCaret.style.visibility = 'visible';
        let i = 0;
        (function type() {
          if (i <= OUT_TEXT.length) {
            demoOut.textContent = OUT_TEXT.slice(0, i); i++;
            demoTimers.push(setTimeout(type, 22 + Math.random() * 26));
          } else { demoCaret.style.visibility = 'hidden'; demoRunning = false; }
        })();
      }, writeDur + 1750));
    }
    const demoIo = new IntersectionObserver(es => {
      es.forEach(en => { if (en.isIntersecting) { demoIo.unobserve(en.target); setTimeout(runDemo, 400); } });
    }, { threshold: 0.45 });
    demoIo.observe(demoPaper.closest('section'));
    const replay = document.getElementById('demo-replay');
    if (replay) replay.addEventListener('click', () => { demoRunning = false; runDemo(); });
  }

  /* =====================================================
     THE ARSENAL — pinned horizontal tour (app.html, desktop)
     ===================================================== */
  const arsTrack = document.getElementById('ars-track');
  if (arsTrack) {
    const arsRow = document.getElementById('ars-row');
    const arsFill = document.getElementById('ars-fill');
    function docTop(el) { return el.getBoundingClientRect().top + window.scrollY; }
    function arsUpdate() {
      if (innerWidth <= 860 || reduceMotion) return;
      const total = arsTrack.offsetHeight - innerHeight;
      if (total <= 0) return;
      const p = Math.max(0, Math.min(1, (scrollY - docTop(arsTrack)) / total));
      const maxX = Math.max(0, arsRow.scrollWidth - innerWidth + 90);
      arsRow.style.transform = 'translateX(' + (-p * maxX) + 'px)';
      if (arsFill) arsFill.style.width = (p * 100) + '%';
    }
    addEventListener('scroll', arsUpdate, { passive: true });
    addEventListener('resize', arsUpdate);
    arsUpdate();
  }

  /* =====================================================
     BREATHWORK DEMO — box breathing (app.html)
     ===================================================== */
  const bCore = document.getElementById('b-core');
  if (bCore) {
    const bPhase = document.getElementById('b-phase');
    const bCount = document.getElementById('b-count');
    const bStart = document.getElementById('b-start');
    let bActive = false, bTimers = [];
    const PHASES = [
      { lbl: 'Breathe in', secs: 4, cls: 'grow' },
      { lbl: 'Hold', secs: 4, cls: 'hold' },
      { lbl: 'Breathe out', secs: 4, cls: 'shrink' },
      { lbl: 'Hold', secs: 4, cls: 'hold' }
    ];
    function bClear() { bTimers.forEach(t => clearTimeout(t)); bTimers = []; }
    function bStop() {
      bActive = false; bClear();
      bPhase.textContent = 'Ready'; bCount.textContent = '';
      bCore.classList.add('holdT'); bCore.classList.remove('grow'); bCore.classList.add('shrink');
      setTimeout(() => bCore.classList.remove('holdT'), 250);
      bStart.textContent = 'Begin breathing';
    }
    function bRunPhase(idx, cycle) {
      if (!bActive) return;
      if (cycle >= 3) { bStop(); bPhase.textContent = 'Forged'; return; }
      const ph = PHASES[idx];
      bPhase.textContent = ph.lbl;
      if (ph.cls === 'grow') { bCore.classList.remove('holdT', 'shrink'); bCore.classList.add('grow'); }
      else if (ph.cls === 'shrink') { bCore.classList.remove('holdT', 'grow'); bCore.classList.add('shrink'); }
      let s = ph.secs;
      bCount.textContent = s;
      for (let i = 1; i <= ph.secs; i++) {
        bTimers.push(setTimeout(() => { if (!bActive) return; s--; bCount.textContent = s > 0 ? s : ''; }, i * 1000));
      }
      bTimers.push(setTimeout(() => {
        const next = (idx + 1) % 4;
        bRunPhase(next, next === 0 ? cycle + 1 : cycle);
      }, ph.secs * 1000));
    }
    bStart.addEventListener('click', () => {
      if (bActive) { bStop(); return; }
      bActive = true; bStart.textContent = 'Stop';
      if (reduceMotion) { bPhase.textContent = 'Breathe in 4, hold 4, out 4, hold 4'; return; }
      bRunPhase(0, 0);
    });
  }

  /* =====================================================
     ROTATING AI SAMPLES — the quote card breathes (app.html)
     ===================================================== */
  const aiQuote = document.getElementById('ai-quote');
  if (aiQuote && !reduceMotion) {
    const aiTag = aiQuote.parentElement.querySelector('.tag');
    const SAMPLES = [
      { tag: 'FORGE Reflection · Day 14', q: '"Third time this week you\'ve written \'tired\' and skipped the gym after a late finish. The problem isn\'t the gym. It\'s what happens at 9pm. Fix the evening and the morning fixes itself."' },
      { tag: 'FORGE Reflection · Day 31', q: '"You rated stress an eight, then wrote down three wins without noticing you\'d done it. Read your own list back. The week is heavier in your head than it is on paper."' },
      { tag: 'The Coach · Week 6', q: '"Energy climbs every day you train before nine. It has for three straight weeks. That isn\'t a coincidence, it\'s a pattern. Protect the morning."' }
    ];
    let si = 0;
    setInterval(() => {
      si = (si + 1) % SAMPLES.length;
      aiQuote.style.transition = 'opacity 0.6s ease'; aiTag.style.transition = 'opacity 0.6s ease';
      aiQuote.style.opacity = '0'; aiTag.style.opacity = '0';
      setTimeout(() => {
        aiQuote.textContent = SAMPLES[si].q; aiTag.textContent = SAMPLES[si].tag;
        aiQuote.style.opacity = '1'; aiTag.style.opacity = '1';
      }, 620);
    }, 7000);
  }

  /* ============ PIPELINE RAIL — highlight stages as they pass ============ */
  const prSteps = document.querySelectorAll('.pipeline-rail .pr-step');
  if (prSteps.length) {
    const stages = document.querySelectorAll('.pipeline-stage');
    const stageIo = new IntersectionObserver(es => {
      es.forEach(en => {
        if (!en.isIntersecting) return;
        const key = en.target.dataset.stage;
        prSteps.forEach(s => s.classList.toggle('hot', s.dataset.stage === key));
      });
    }, { threshold: 0.35 });
    stages.forEach(s => stageIo.observe(s));
  }
})();
