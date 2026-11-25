/* ==========================================================
   Mutter Gebäudereinigung – Interaktion & Animation
   Alles ohne Abhängigkeiten. Respektiert prefers-reduced-motion.
   ========================================================== */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Preloader ---------- */
  const preloader = $('#preloader');
  if (preloader) {
    const hide = () => preloader.classList.add('done');
    const start = performance.now();
    window.addEventListener('load', () => {
      const wait = Math.max(0, 1900 - (performance.now() - start));
      setTimeout(hide, reduceMotion ? 0 : wait);
    });
    setTimeout(hide, 4000); // Sicherheitsnetz
  }

  /* ---------- Jahr im Footer ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Hero: Buchstaben-Split ---------- */
  $$('[data-split]').forEach((el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--i', i);
      span.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(span);
    });
  });
  if (reduceMotion) $$('.char').forEach((c) => c.classList.add('static'));

  /* ---------- Scroll-Reveal ---------- */
  const revealEls = $$('.reveal');
  revealEls.forEach((el) => {
    const d = el.getAttribute('data-delay');
    if (d) el.style.transitionDelay = d + 'ms';
  });

  const checkItems = $$('.checklist li');
  checkItems.forEach((li, i) => { li.style.transitionDelay = i * 120 + 'ms'; });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
    checkItems.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
    checkItems.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Header: Schatten, Ausblenden beim Runterscrollen ---------- */
  const header = $('#siteHeader');
  let lastY = 0;
  const toTop = $('#toTop');

  /* ---------- Scroll-Fortschritt, Parallax, Timeline ---------- */
  const progress = $('#progress');
  const parallax = $$('[data-speed]');
  const timeline = $('#timeline');
  const tlLine = timeline ? $('.timeline-line', timeline) : null;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (header) {
      header.classList.toggle('scrolled', y > 30);
      const menuOpen = $('#nav') && $('#nav').classList.contains('open');
      if (!menuOpen) header.classList.toggle('hidden', y > lastY && y > 400);
      lastY = y;
    }

    if (toTop) toTop.classList.toggle('show', y > 600);

    if (!reduceMotion) {
      parallax.forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0;
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    }

    if (timeline && tlLine) {
      const r = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + 0.001)));
      timeline.style.setProperty('--fill', reduceMotion ? 1 : p.toFixed(3));
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Burger-Menü ---------- */
  const burger = $('#burger');
  const nav = $('#nav');
  if (burger && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };
    burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    $$('a', nav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------- Ripple auf Buttons ---------- */
  $$('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (reduceMotion) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.width = r.style.height = size + 'px';
      r.style.left = e.clientX - rect.left - size / 2 + 'px';
      r.style.top = e.clientY - rect.top - size / 2 + 'px';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 750);
    });
  });

  /* ---------- Magnetische Buttons (nur Maus) ---------- */
  if (finePointer && !reduceMotion) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 3D-Tilt auf Karten (nur Maus) ---------- */
  if (finePointer && !reduceMotion) {
    $$('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 10;
        const ry = (px - 0.5) * 12;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Eigener Cursor (nur Desktop mit Maus) ---------- */
  if (finePointer && !reduceMotion) {
    document.body.classList.add('has-cursor');
    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverSel = 'a, button, .card, .tab, summary, input, select, textarea, .ba';
    document.addEventListener('mouseover', (e) => {
      if (ring && e.target.closest && e.target.closest(hoverSel)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (ring && e.target.closest && e.target.closest(hoverSel)) ring.classList.remove('hover');
    });
  }

  /* ---------- Hero-Bubbles (Canvas) ---------- */
  const canvas = $('#bubbles');
  if (canvas && canvas.getContext && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, bubbles = [], running = true;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.round(Math.min(45, Math.max(14, (w * h) / 26000)));
      bubbles = Array.from({ length: count }, () => makeBubble(true));
    }
    function makeBubble(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 20,
        r: 3 + Math.random() * 14,
        vy: 0.25 + Math.random() * 0.7,
        wobble: Math.random() * Math.PI * 2,
        ws: 0.005 + Math.random() * 0.01,
        hue: Math.random() < 0.5 ? '51,188,224' : '15,163,204',
      };
    }
    function draw() {
      if (!running) return requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      for (const b of bubbles) {
        b.y -= b.vy;
        b.wobble += b.ws;
        const x = b.x + Math.sin(b.wobble) * 14;
        if (b.y + b.r < -10) Object.assign(b, makeBubble(false));
        const g = ctx.createRadialGradient(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, x, b.y, b.r);
        g.addColorStop(0, `rgba(255,255,255,.85)`);
        g.addColorStop(0.4, `rgba(${b.hue},.18)`);
        g.addColorStop(1, `rgba(${b.hue},.05)`);
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = `rgba(${b.hue},.35)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { running = en[0].isIntersecting; }).observe(canvas);
    }
    draw();
  }

  /* ---------- Vorher/Nachher-Regler ---------- */
  const ba = $('#ba');
  const baRange = $('#baRange');
  if (ba && baRange) {
    const setPos = (v) => ba.style.setProperty('--pos', v + '%');
    baRange.addEventListener('input', (e) => setPos(e.target.value));
    setPos(baRange.value);
    // Automatischer Hinweis-Wisch, sobald sichtbar
    if ('IntersectionObserver' in window && !reduceMotion) {
      let played = false;
      new IntersectionObserver((en, obs) => {
        if (!en[0].isIntersecting || played) return;
        played = true;
        obs.disconnect();
        const seq = [30, 72, 50];
        seq.forEach((v, i) => setTimeout(() => { baRange.value = v; setPos(v); }, 600 + i * 650));
      }, { threshold: 0.5 }).observe(ba);
    }
  }

  /* ---------- Tabs (Firmen / Privat-Leistungen) ---------- */
  const tabs = $$('.tab');
  const indicator = $('#tabIndicator');
  if (tabs.length) {
    const select = (tab) => {
      tabs.forEach((t, i) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
        if (active && indicator) indicator.style.transform = `translateX(${i * 100}%)`;
        const panel = document.getElementById(t.dataset.tab);
        if (panel) {
          panel.hidden = !active;
          panel.classList.toggle('is-active', active);
        }
      });
    };
    tabs.forEach((t) => t.addEventListener('click', () => select(t)));
    if (indicator) indicator.style.width = `calc(${100 / tabs.length}% - 6px)`;
  }

  /* ---------- Kontaktformular ----------
     data-endpoint leer  -> Anfrage wird als WhatsApp-Nachricht vorbereitet.
     data-endpoint gesetzt (z. B. Formspree-URL) -> Versand per POST. */
  const form = $('#contactForm');
  const status = $('#formStatus');
  if (form) {
    const setStatus = (msg, type) => {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form-status ' + (type || '');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      let ok = true;

      $$('input, textarea', form).forEach((f) => f.classList.remove('invalid'));
      ['name', 'email'].forEach((n) => {
        const f = form.elements[n];
        if (!f.value.trim()) { f.classList.add('invalid'); ok = false; }
      });
      if (!form.elements.email.checkValidity()) { form.elements.email.classList.add('invalid'); ok = false; }
      if (!form.elements.privacy.checked) ok = false;

      if (!ok) {
        setStatus('Bitte füllen Sie alle Pflichtfelder aus und stimmen Sie dem Datenschutz zu.', 'err');
        form.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 350 });
        const firstBad = $('.invalid', form);
        if (firstBad) firstBad.focus();
        return;
      }

      const endpoint = form.dataset.endpoint && form.dataset.endpoint.trim();
      form.classList.add('sending');

      if (endpoint) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          setStatus('Danke! Ihre Anfrage ist angekommen. Wir melden uns zeitnah.', 'ok');
        } catch (err) {
          setStatus('Senden hat nicht geklappt. Schreiben Sie uns gern direkt per WhatsApp.', 'err');
        } finally {
          form.classList.remove('sending');
        }
        return;
      }

      // Kein Backend hinterlegt: Anfrage als WhatsApp-Nachricht vorbereiten
      const lines = [
        'Hallo Mutter Gebäudereinigung, ich möchte eine Anfrage senden:',
        '',
        `Name: ${data.name}`,
        data.phone ? `Telefon: ${data.phone}` : null,
        `E-Mail: ${data.email}`,
        `Kunde: ${data.type}`,
        `Art der Reinigung: ${data.service}`,
        data.message ? `Nachricht: ${data.message}` : null,
      ].filter(Boolean).join('\n');
      const url = 'https://wa.me/491713363915?text=' + encodeURIComponent(lines);
      window.open(url, '_blank', 'noopener');
      form.classList.remove('sending');
      form.classList.remove('sent'); void form.offsetWidth; form.classList.add('sent');
      setStatus('WhatsApp öffnet sich mit Ihrer Anfrage. Einfach absenden!', 'ok');
    });
  }
})();
