let audioCtx = null;

function ac() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch { /* noop */ }
  }
  return audioCtx;
}

export function resumeAudio() {
  const ctx = ac();
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

export function tick(volume = 0.05) {
  const ctx = ac();
  if (!ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square';
  o.frequency.setValueAtTime(1800, t);
  o.frequency.exponentialRampToValueAtTime(900, t + 0.04);
  g.gain.setValueAtTime(volume, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.06);
}

export function fanfare() {
  const ctx = ac();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  const notes = [
    { f: 523.25, t: 0.00, d: 0.18 },
    { f: 659.25, t: 0.12, d: 0.18 },
    { f: 783.99, t: 0.24, d: 0.18 },
    { f: 1046.5, t: 0.40, d: 0.45 },
  ];
  notes.forEach((n) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = n.f;
    g.gain.setValueAtTime(0.0001, t0 + n.t);
    g.gain.exponentialRampToValueAtTime(0.18, t0 + n.t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.t + n.d);
    o.connect(g).connect(ctx.destination);
    o.start(t0 + n.t);
    o.stop(t0 + n.t + n.d + 0.05);
  });
}
