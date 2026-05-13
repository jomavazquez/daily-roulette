import { useMemo } from 'react';
import { PALETTE, LIGHT_BG_COLORS } from './palette.js';

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const [sx, sy] = polar(cx, cy, r, endDeg);
  const [ex, ey] = polar(cx, cy, r, startDeg);
  const large = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey} Z`;
}

export default function Wheel({ names, rotation, spinning, size = 540 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 18;

  const segments = useMemo(() => {
    if (names.length === 0) return [];
    const step = 360 / names.length;
    return names.map((name, i) => {
      const start = i * step;
      const end = (i + 1) * step;
      const mid = start + step / 2;
      return { name, start, end, mid, color: PALETTE[i % PALETTE.length] };
    });
  }, [names]);

  const empty = names.length === 0;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'grid', placeItems: 'center' }}>
      {/* Outer halo */}
      <div style={{
        position: 'absolute', inset: -16, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 60%, transparent 70%)',
        filter: 'blur(6px)', zIndex: 0,
      }} />

      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: 'relative', zIndex: 1,
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 5.4s cubic-bezier(0.16, 0.84, 0.18, 1.0)' : 'none',
          filter: 'drop-shadow(0 24px 30px rgba(26,22,38,0.20))',
        }}
      >
        {/* Outer black rim */}
        <circle cx={cx} cy={cy} r={r + 12} fill="#1A1626" />
        {/* White rim */}
        <circle cx={cx} cy={cy} r={r + 10} fill="#FFFFFF" />

        {/* 24 bulbs */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * 360;
          const [bx, by] = polar(cx, cy, r + 11, a);
          return (
            <circle key={i} cx={bx} cy={by} r={3.2}
              fill={i % 2 === 0 ? '#FFE066' : '#FFFFFF'}
              stroke="#1A1626" strokeWidth="0.8" />
          );
        })}

        {/* Dark separating ring */}
        <circle cx={cx} cy={cy} r={r + 2} fill="#1A1626" />

        {empty ? (
          <>
            <circle cx={cx} cy={cy} r={r} fill="#F4EFE6" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
              fontFamily="Bricolage Grotesque" fontWeight="700" fontSize="20" fill="#6B5E7A">
              Add some names
            </text>
          </>
        ) : (
          <g>
            {segments.map((s, i) => (
              <g key={i}>
                <path d={arcPath(cx, cy, r, s.start, s.end)} fill={s.color} />
                <path d={arcPath(cx, cy, r, s.start, s.end)} fill="none"
                  stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              </g>
            ))}

            {/* Labels */}
            {segments.map((s, i) => {
              const labelR = r * 0.68;
              const [tx, ty] = polar(cx, cy, labelR, s.mid);
              const isLight = LIGHT_BG_COLORS.includes(s.color);
              const fill = isLight ? '#1A1626' : '#FFFFFF';
              const fontSize = names.length <= 6 ? 22 : names.length <= 10 ? 18 : 15;
              const display = s.name.length > 14 ? s.name.slice(0, 13) + '…' : s.name;
              return (
                <g key={'l' + i} transform={`translate(${tx} ${ty}) rotate(${s.mid})`}>
                  <text x="0" y="0" textAnchor="middle" dominantBaseline="middle"
                    fontFamily="Bricolage Grotesque" fontWeight="700" fontSize={fontSize}
                    fill={fill} style={{ letterSpacing: '-0.01em' }}>
                    {display}
                  </text>
                </g>
              );
            })}

            {/* Spokes */}
            {segments.map((s, i) => {
              const [ex, ey] = polar(cx, cy, r, s.start);
              return (
                <line key={'sp' + i} x1={cx} y1={cy} x2={ex} y2={ey}
                  stroke="rgba(26,22,38,0.18)" strokeWidth="1.5" />
              );
            })}
          </g>
        )}

        {/* Center hub */}
        <circle cx={cx} cy={cy} r="38" fill="#1A1626" />
        <circle cx={cx} cy={cy} r="30" fill="#FFFFFF" />
        <circle cx={cx} cy={cy} r="22" fill="#1A1626" />
        <circle cx={cx} cy={cy} r="6"  fill="#FFE066" />
      </svg>

      {/* Pointer (fixed, does not rotate) */}
      <div style={{
        position: 'absolute', top: -6, left: '50%',
        transform: 'translateX(-50%)', zIndex: 3,
        filter: 'drop-shadow(0 6px 10px rgba(26,22,38,0.35))',
      }}>
        <svg width="56" height="64" viewBox="0 0 56 64">
          <path d="M28 56 L6 12 A22 22 0 0 1 50 12 Z" fill="#1A1626" />
          <path d="M28 52 L11 14 A19 19 0 0 1 45 14 Z" fill="#FF5C8A" />
          <circle cx="28" cy="18" r="5" fill="#FFE066" stroke="#1A1626" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
