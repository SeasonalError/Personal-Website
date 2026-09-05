(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Published milestones live in the HTML. Visitor edits never alter public data.
  const boxes = [...document.querySelectorAll('[data-milestone]')];
  const defaults = Object.fromEntries(boxes.map((box) => [box.dataset.milestone, box.defaultChecked]));
  const progressKey = 'nsk-particle-physics-progress-v1';
  const motionKey = 'nsk-particle-physics-motion-v1';
  const status = $('#save-status');
  let canStore = true;
  const readPreference = (key) => {
    try { return localStorage.getItem(key); }
    catch { canStore = false; return null; }
  };
  const writePreference = (key, value) => {
    try { localStorage.setItem(key, value); return true; }
    catch { canStore = false; return false; }
  };

  const stored = readPreference(progressKey);
  if (stored) {
    try {
      const saved = JSON.parse(stored);
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        boxes.forEach((box) => {
          const value = saved[box.dataset.milestone];
          if (typeof value === 'boolean') box.checked = value;
        });
      }
    } catch { /* Ignore corrupt storage and retain the published snapshot. */ }
  }
  const updateProgress = () => {
    const count = boxes.filter((box) => box.checked).length;
    $('#completed-count').textContent = String(count).padStart(2, '0');
    $('#journey-progress').value = count;
    $('#journey-progress').textContent = `${count} of ${boxes.length}`;
  };
  const hasLocalEdits = () => boxes.some((box) => box.checked !== defaults[box.dataset.milestone]);
  $('.local-tools').hidden = false;
  updateProgress();
  status.textContent = canStore
    ? (hasLocalEdits() ? 'Showing your saved checklist on this device.' : 'Checklist changes stay in this browser.')
    : 'Changes work for this visit; browser storage is unavailable.';
  boxes.forEach((box) => box.addEventListener('change', () => {
    updateProgress();
    const saved = writePreference(progressKey, JSON.stringify(Object.fromEntries(boxes.map((item) => [item.dataset.milestone, item.checked]))));
    const count = boxes.filter((item) => item.checked).length;
    status.textContent = `${count} of ${boxes.length} covered. ${saved ? 'Saved on this device only.' : 'Kept for this visit; could not save.'}`;
  }));
  $('#reset-progress').addEventListener('click', () => {
    boxes.forEach((box) => { box.checked = defaults[box.dataset.milestone]; });
    updateProgress();
    const saved = writePreference(progressKey, JSON.stringify(defaults));
    status.textContent = saved ? 'Published progress restored on this device.' : 'Published progress restored for this visit.';
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== progressKey) return;
    try {
      const incoming = event.newValue ? JSON.parse(event.newValue) : defaults;
      if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) return;
      boxes.forEach((box) => {
        if (typeof incoming[box.dataset.milestone] === 'boolean') box.checked = incoming[box.dataset.milestone];
      });
      updateProgress();
      status.textContent = 'Checklist updated from another tab on this device.';
    } catch { /* Malformed state in another tab must not affect this page. */ }
  });

  // Progressive enhancement: content is visible even without IntersectionObserver.
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches || readPreference(motionKey) === 'paused';
  const motionButton = $('#motion-toggle');
  motionButton.hidden = false;
  const updateMotionControl = () => {
    document.body.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    $('#motion-label').textContent = paused ? 'Resume motion' : 'Pause motion';
    $('.motion-symbol').textContent = paused ? '▷' : 'Ⅱ';
    if (paused) {
      document.documentElement.style.setProperty('--motion-x', '0px');
      document.documentElement.style.setProperty('--motion-y', '0px');
    }
  };
  if ('IntersectionObserver' in window) {
    const reveals = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!paused) entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });
    document.querySelectorAll('[data-reveal]').forEach((element) => reveals.observe(element));
  }

  const hero = $('.hero');
  const heroCanvas = $('#hero-tracks');
  const eventCanvas = $('#event-tracks');
  const makeSurface = (canvas) => {
    const context = canvas.getContext('2d');
    return { canvas, context, width: 0, height: 0, visible: true };
  };
  const heroSurface = makeSurface(heroCanvas);
  const eventSurface = makeSurface(eventCanvas);
  const surfaces = [heroSurface, eventSurface];
  const resizeSurfaces = () => {
    surfaces.forEach((surface) => {
      const rect = surface.canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      surface.width = rect.width;
      surface.height = rect.height;
      surface.canvas.width = Math.round(rect.width * ratio);
      surface.canvas.height = Math.round(rect.height * ratio);
      surface.context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    });
  };
  // Deterministic conceptual curves. These are not a recorded collision or a physics simulation.
  const trackDefinitions = Array.from({ length: 36 }, (_, i) => ({
    angle: i * 2.39996323,
    bend: (i % 2 ? -1 : 1) * (.24 + (i % 7) * .065),
    length: .5 + (i % 11) * .045,
    colour: i % 5 === 0 ? '237,165,109' : '155,207,223',
    speed: .065 + (i % 5) * .008,
  }));
  const pathPoint = (track, fraction, radius) => {
    const theta = track.angle + track.bend * fraction * fraction;
    return [Math.cos(theta) * fraction * radius * track.length, Math.sin(theta) * fraction * radius * track.length];
  };
  const drawEvent = (time) => {
    const { context: ctx, width: w, height: h } = eventSurface;
    if (!ctx || !w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const radius = Math.min(w, h) * .43;
    ctx.save(); ctx.translate(w / 2, h / 2);
    [1, .79, .57, .35, .12].forEach((factor, ring) => {
      ctx.beginPath(); ctx.arc(0, 0, radius * factor, 0, Math.PI * 2);
      ctx.strokeStyle = ring === 0 ? '#526168' : '#2b3b42'; ctx.lineWidth = ring === 0 ? 1 : .6; ctx.stroke();
    });
    for (let i = 0; i < 80; i++) {
      const angle = i / 80 * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.lineTo(Math.cos(angle) * (radius + (i % 5 ? 4 : 10)), Math.sin(angle) * (radius + (i % 5 ? 4 : 10)));
      ctx.strokeStyle = '#526168'; ctx.lineWidth = .7; ctx.stroke();
    }
    ctx.strokeStyle = '#2a3a40'; ctx.setLineDash([3, 7]);
    ctx.beginPath(); ctx.moveTo(-radius - 25, 0); ctx.lineTo(radius + 25, 0); ctx.moveTo(0, -radius - 25); ctx.lineTo(0, radius + 25); ctx.stroke(); ctx.setLineDash([]);
    trackDefinitions.forEach((track, index) => {
      ctx.beginPath(); ctx.moveTo(0, 0);
      for (let j = 1; j <= 55; j++) { const [x, y] = pathPoint(track, j / 55, radius); ctx.lineTo(x, y); }
      ctx.strokeStyle = `rgba(${track.colour},${index % 3 === 0 ? .55 : .24})`; ctx.lineWidth = index % 5 === 0 ? 1.2 : .7; ctx.stroke();
      const fraction = (time * track.speed + index * .157) % 1;
      const [x, y] = pathPoint(track, fraction, radius);
      ctx.fillStyle = `rgba(${track.colour},${Math.sin(fraction * Math.PI) * .85})`;
      ctx.beginPath(); ctx.arc(x, y, index % 5 === 0 ? 1.8 : 1.15, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#e2eef0'; ctx.beginPath(); ctx.arc(0, 0, 2.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7c929c'; ctx.font = '12px monospace'; ctx.fillText('x', radius + 17, -8); ctx.fillText('y', 10, -radius - 15);
    ctx.restore();
  };
  const drawHero = (time) => {
    const { context: ctx, width: w, height: h } = heroSurface;
    if (!ctx || !w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const cx = w * .755, cy = h * .55;
    for (let i = 0; i < 17; i++) {
      const phase = (time * .05 + i * .109) % 1;
      const angle = i * 2.39996;
      const distance = phase * Math.max(w, h) * .57;
      const x = cx + Math.cos(angle) * distance, y = cy + Math.sin(angle) * distance * .65;
      const tail = 12 + phase * 24;
      const alpha = Math.sin(phase * Math.PI) * .36;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(angle) * tail, y - Math.sin(angle) * tail * .65);
      ctx.strokeStyle = i % 6 === 0 ? `rgba(237,165,109,${alpha})` : `rgba(169,218,237,${alpha})`;
      ctx.lineWidth = .7; ctx.stroke();
    }
  };
  let frame = 0;
  let animationTime = 0;
  let previousTime = 0;
  const draw = () => {
    if (heroSurface.visible) drawHero(animationTime);
    if (eventSurface.visible) drawEvent(animationTime);
  };
  const canAnimate = () => !paused && !document.hidden && surfaces.some((surface) => surface.visible && surface.context);
  const tick = (time) => {
    frame = 0;
    if (!canAnimate()) { previousTime = 0; return; }
    if (previousTime) animationTime += Math.min((time - previousTime) / 1000, .08);
    previousTime = time;
    draw();
    frame = requestAnimationFrame(tick);
  };
  const syncAnimation = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; previousTime = 0;
    draw();
    if (canAnimate()) frame = requestAnimationFrame(tick);
  };
  motionButton.addEventListener('click', () => {
    paused = !paused;
    writePreference(motionKey, paused ? 'paused' : 'running');
    updateMotionControl(); syncAnimation();
  });
  reducedMotion.addEventListener('change', (event) => {
    paused = event.matches || readPreference(motionKey) === 'paused';
    updateMotionControl(); syncAnimation();
  });
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const surface = surfaces.find((item) => item.canvas === entry.target);
        if (surface) surface.visible = entry.isIntersecting;
      });
      syncAnimation();
    }, { threshold: 0 });
    surfaces.forEach((surface) => visibility.observe(surface.canvas));
  }
  const updateReadingProgress = () => {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    $('#reading-progress').style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
  };
  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => { updateReadingProgress(); scrollFrame = 0; });
  }, { passive: true });
  const handleResize = () => { resizeSurfaces(); draw(); updateReadingProgress(); };
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(handleResize);
    surfaces.forEach((surface) => resize.observe(surface.canvas));
  } else window.addEventListener('resize', handleResize, { passive: true });
  hero.addEventListener('pointermove', (event) => {
    if (paused || event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    document.documentElement.style.setProperty('--motion-x', `${((event.clientX - rect.left) / rect.width - .5) * -14}px`);
    document.documentElement.style.setProperty('--motion-y', `${((event.clientY - rect.top) / rect.height - .5) * -10}px`);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    document.documentElement.style.setProperty('--motion-x', '0px');
    document.documentElement.style.setProperty('--motion-y', '0px');
  });
  document.addEventListener('visibilitychange', syncAnimation);
  updateMotionControl();
  handleResize();
  syncAnimation();
})();
