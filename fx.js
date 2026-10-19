/* Shared helpers: colors, escaping, confetti, sound, toast, floating cards. */
window.COLORS = ['#FF4F8B', '#3A86FF', '#FF9F1C', '#14C3A2', '#8F4DFF', '#FFC233'];
window.$ = (s) => document.querySelector(s);
window.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
window.store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
};
window.toast = function (t) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1700); };

let ac = null;
window.beep = function (type) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const notes = type === 'good' ? [523, 659, 784] : type === 'bad' ? [300, 220] : type === 'win' ? [523, 659, 784, 1047] : [660];
    notes.forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f; const t0 = ac.currentTime + i * .11; g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.12, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + .2); o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + .22); });
  } catch (e) { /* audio unavailable */ }
};

(function () {
  const cv = document.getElementById('fx'); if (!cv) return;
  const cx = cv.getContext('2d'); let parts = [], raf = null;
  const size = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; cx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
  addEventListener('resize', size); size();
  function loop() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach((p) => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66); cx.restore(); });
    parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
    raf = parts.length ? requestAnimationFrame(loop) : (cx.clearRect(0, 0, innerWidth, innerHeight), null);
  }
  window.confetti = function (n) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < (n || 120); i++) parts.push({ x: innerWidth / 2 + (Math.random() - .5) * 240, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 13 - 4, s: 6 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: COLORS[i % COLORS.length], life: 120 });
    if (!raf) loop();
  };
})();

window.floaters = function (vals) {
  const f = document.getElementById('floaters'); if (!f) return; f.innerHTML = '';
  vals.forEach((v, i) => { const s = document.createElement('span'); s.textContent = v; s.style.background = COLORS[i % COLORS.length]; s.style.left = (5 + (i * 83) % 90) + '%'; s.style.top = (8 + (i * 37) % 80) + '%'; s.style.animationDelay = (-i * 2.3) + 's'; f.appendChild(s); });
};
