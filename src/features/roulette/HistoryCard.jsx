export default function HistoryCard({ history }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1.5px solid var(--line)',
      borderRadius: 24, padding: 20,
      boxShadow: 'var(--shadow-md)',
      minHeight: 140,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 18 }}>History</h3>
        <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{history.length}</span>
      </div>

      {history.length === 0 ? (
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14, padding: '12px 0' }}>
          No spins yet. Once someone is picked, they'll show up here.
        </p>
      ) : (
        <ul style={{
          padding: 0, margin: 0,
          display: 'flex', flexDirection: 'column', gap: 8,
          maxHeight: 360, overflowY: 'auto',
        }}>
          {history.map((h, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              background: h.kind === 'chosen'
                ? 'linear-gradient(90deg, rgba(79,209,139,0.16), rgba(79,209,139,0.04))'
                : 'rgba(26,22,38,0.03)',
              borderRadius: 14,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: h.kind === 'chosen' ? 'var(--pop-4)' : 'rgba(26,22,38,0.15)',
                color: 'white', display: 'grid', placeItems: 'center', fontSize: 14,
              }}>
                {h.kind === 'chosen' ? '✓' : '↷'}
              </span>
              <span style={{
                fontWeight: 600, color: 'var(--ink)',
                textDecoration: h.kind === 'passed' ? 'line-through' : 'none',
                textDecorationColor: 'rgba(26,22,38,0.4)',
              }}>
                {h.name}
              </span>
              <span style={{
                marginLeft: 'auto', fontSize: 11,
                color: 'var(--muted)', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {h.kind === 'chosen' ? 'Picked' : 'Passed'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
