export function fireConfetti(duration = 2200) {
  const canvas = document.getElementById('confetti');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * DPR;
  canvas.height = window.innerHeight * DPR;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  const colors = ['#FF5C8A','#FFB02E','#FFE066','#4FD18B','#4DA6FF','#7C5BFF','#FF7A45','#2BC4C4'];
  const pieces = [];
  const COUNT = 220;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.45;

  for (let i = 0; i < COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 10;
    pieces.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      g: 0.18 + Math.random() * 0.1,
      r: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() < 0.4 ? 'rect' : Math.random() < 0.7 ? 'circ' : 'tri',
    });
  }

  const start = performance.now();

  function draw(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vx *= 0.992;
      const alpha = Math.max(0, 1 - elapsed / duration);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x * DPR, p.y * DPR);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      const s = p.r * DPR;
      if (p.shape === 'rect') {
        ctx.fillRect(-s * 0.6, -s * 0.3, s * 1.2, s * 0.6);
      } else if (p.shape === 'circ') {
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.6);
        ctx.lineTo(s * 0.55, s * 0.5);
        ctx.lineTo(-s * 0.55, s * 0.5);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });
    if (elapsed < duration) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(draw);
}
