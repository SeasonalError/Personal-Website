(() => {
  'use strict';

  // This page owns its behaviour; it never loads or modifies script.js.
  const root = document.documentElement;
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const preferenceKey = 'nsk-data-analysis-motion-v1';
  const readPreference = () => {
    try { return localStorage.getItem(preferenceKey); }
    catch { return null; }
  };
  let paused = motionPreference.matches || readPreference() === 'paused';
  const motionButton = document.getElementById('motion-toggle');
  const motionLabel = document.getElementById('motion-label');
  const motionIcon = motionButton.querySelector('.motion-icon');
  const applyMotionState = () => {
    root.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionLabel.textContent = paused ? 'Resume motion' : 'Pause motion';
    motionIcon.textContent = paused ? '▷' : 'Ⅱ';
  };
  applyMotionState();
  motionButton.hidden = false;

  // Elements remain visible if scripts or observers are unavailable.
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!paused) entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));
  }

  const stage = document.querySelector('.signal-stage');
  const canvas = document.getElementById('signal-surface');
  let context = null;
  try { context = canvas.getContext('2d', { alpha: true }); }
  catch { /* Retain the text fallback when canvas is unavailable. */ }
  const fallback = document.getElementById('surface-fallback');
  fallback.hidden = Boolean(context);

  let width = 0;
  let height = 0;
  let columns = 64;
  let rows = 32;
  let visible = true;
  let frameId = 0;
  let lastPaint = 0;
  let previousTime = 0;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;
  let smoothedX = 0;
  let smoothedY = 0;

  // A sampled wave surface, not NASA/CERN/market observations. No random or live values.
  const drawSurface = () => {
    if (!context || width <= 0 || height <= 0) return;
    const ctx = context;
    ctx.clearRect(0, 0, width, height);
    const yaw = -0.48 + smoothedX * 0.13 + Math.sin(elapsed * 0.12) * 0.045;
    const cosine = Math.cos(yaw);
    const sine = Math.sin(yaw);
    const scale = Math.min(width * 0.48, height * 0.6);
    const centreY = height * 0.54 + smoothedY * 7;
    const projectedRows = [];

    for (let row = 0; row < rows; row++) {
      const v = (row / (rows - 1) - 0.5) * 2.05;
      const points = [];
      for (let column = 0; column < columns; column++) {
        const u = (column / (columns - 1) - 0.5) * 2.8;
        const ridge = Math.exp(-Math.pow((u * 0.68 + v * 0.6) * 2.1, 2)) * 0.3;
        const wave = Math.sin(u * 4.1 + v * 2.2 - elapsed * 0.72) * 0.14
          + Math.cos(v * 5.1 + elapsed * 0.4) * 0.075 + ridge;
        const horizontal = u * cosine - v * sine;
        const depth = u * sine + v * cosine;
        const perspective = 1.7 / (2.55 + depth * 0.32);
        const x = width * 0.5 + horizontal * scale * perspective;
        const y = centreY + (depth * 0.5 - wave * 1.7) * scale * perspective;
        const edge = Math.min(1, Math.max(0, (1.5 - Math.abs(u)) * 2.2));
        const front = (row + 1) / rows;
        const highlight = 0.5 + 0.5 * Math.sin(u * 2.3 + v * 1.8 - elapsed * 0.55);
        const alpha = Math.min(0.92, (0.18 + front * 0.42 + highlight * 0.25) * edge);
        points.push({ x, y, alpha, radius: (0.55 + front * 0.65) * perspective, highlight });
      }
      projectedRows.push(points);
    }

    // Fine contours connect the point samples; their density scales down on phones.
    projectedRows.forEach((points, row) => {
      if (row % 3 !== 0) return;
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = 'rgba(163,205,118,0.105)';
      ctx.stroke();
    });
    projectedRows.forEach((points) => {
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = point.highlight > 0.76
          ? `rgba(219,255,173,${point.alpha})`
          : `rgba(164,209,112,${point.alpha})`;
        ctx.fill();
      });
    });
  };

  const canAnimate = () => Boolean(context) && !paused && visible && !document.hidden;
  const tick = (time) => {
    frameId = 0;
    if (!canAnimate()) { previousTime = 0; lastPaint = 0; return; }
    // Cap painting at 30 fps; tab visibility and intersection stop the loop entirely.
    if (!lastPaint || time - lastPaint >= 1000 / 30) {
      if (previousTime) elapsed += Math.min((time - previousTime) / 1000, 0.08);
      previousTime = time;
      lastPaint = time;
      smoothedX += (pointerX - smoothedX) * 0.07;
      smoothedY += (pointerY - smoothedY) * 0.07;
      drawSurface();
    }
    frameId = requestAnimationFrame(tick);
  };
  const syncAnimation = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    previousTime = 0;
    lastPaint = 0;
    if (visible && !document.hidden) drawSurface();
    if (canAnimate()) frameId = requestAnimationFrame(tick);
  };
  const resizeSurface = () => {
    const rect = stage.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    columns = width < 500 ? 44 : 64;
    rows = width < 500 ? 26 : 32;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (context) context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (visible && !document.hidden) drawSurface();
  };

  motionButton.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(preferenceKey, paused ? 'paused' : 'running'); }
    catch { /* Motion controls still work when browser storage is blocked. */ }
    applyMotionState();
    syncAnimation();
  });
  const handleMotionPreference = () => {
    paused = motionPreference.matches || readPreference() === 'paused';
    applyMotionState();
    syncAnimation();
  };
  if (motionPreference.addEventListener) motionPreference.addEventListener('change', handleMotionPreference);
  else if (motionPreference.addListener) motionPreference.addListener(handleMotionPreference);

  stage.addEventListener('pointermove', (event) => {
    if (paused || event.pointerType !== 'mouse') return;
    const rect = stage.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    pointerY = (event.clientY - rect.top) / rect.height - 0.5;
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });

  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      syncAnimation();
    });
    visibilityObserver.observe(stage);
  }
  document.addEventListener('visibilitychange', syncAnimation);
  if ('ResizeObserver' in window) new ResizeObserver(resizeSurface).observe(stage);
  else window.addEventListener('resize', resizeSurface, { passive: true });

  // A soft pointer light stays inside the card and cannot intercept its links.
  document.querySelectorAll('.project-card').forEach((card) => {
    let pending = 0;
    let x = 0;
    let y = 0;
    card.addEventListener('pointermove', (event) => {
      if (paused || event.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        if (paused) return;
        card.style.setProperty('--card-x', `${x}px`);
        card.style.setProperty('--card-y', `${y}px`);
      });
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      if (pending) cancelAnimationFrame(pending);
      pending = 0;
      card.style.removeProperty('--card-x');
      card.style.removeProperty('--card-y');
    });
  });

  const readingLine = document.getElementById('reading-line');
  let scrollFrame = 0;
  const updateReadingLine = () => {
    const range = root.scrollHeight - window.innerHeight;
    const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    readingLine.style.transform = `scaleX(${progress})`;
  };
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => { updateReadingLine(); scrollFrame = 0; });
  }, { passive: true });
  window.addEventListener('resize', updateReadingLine, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateReadingLine);
  resizeSurface();
  updateReadingLine();
  syncAnimation();
})();
