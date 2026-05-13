import { PALETTE } from './palette.js';

export default function NamesCard({ pool, allNames, onAdd, onRemoveName, adding, setAdding, newName, setNewName, onReset }) {
  const removed = allNames.filter((n) => !pool.includes(n));

  return (
    <div style={{
      background: 'var(--card)',
      border: '1.5px solid var(--line)',
      borderRadius: 24, padding: 20,
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 18 }}>On the wheel</h3>
        <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>{pool.length}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {pool.map((n, i) => {
          const idx = allNames.indexOf(n);
          const color = PALETTE[(idx >= 0 ? idx : i) % PALETTE.length];
          return (
            <Chip key={n} color={color} onRemove={() => onRemoveName(n)}>
              {n}
            </Chip>
          );
        })}

        {adding ? (
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={onAdd}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAdd();
              if (e.key === 'Escape') { setNewName(''); setAdding(false); }
            }}
            placeholder="Name + Enter"
            style={{
              padding: '6px 12px',
              border: '1.5px dashed var(--line)',
              borderRadius: 999, fontSize: 13,
              fontFamily: 'inherit', outline: 'none', minWidth: 110,
            }}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{
              padding: '6px 12px',
              border: '1.5px dashed rgba(26,22,38,0.25)',
              background: 'transparent', borderRadius: 999,
              fontSize: 13, fontWeight: 600, color: 'var(--muted)', cursor: 'pointer',
            }}>
            + Add
          </button>
        )}
      </div>

      {removed.length > 0 && (
        <>
          <div style={{ height: 1, background: 'var(--line)', margin: '16px 0 12px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h4 style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Removed this round
            </h4>
            <button onClick={onReset} style={{
              background: 'transparent', border: 'none',
              color: 'var(--pop-6)', fontWeight: 600, fontSize: 12, cursor: 'pointer',
            }}>
              Restore all
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {removed.map((n) => <Chip key={n} muted>{n}</Chip>)}
          </div>
        </>
      )}
    </div>
  );
}

function Chip({ children, color, muted, onRemove }) {
  if (muted) {
    return (
      <span style={{
        padding: '6px 12px', background: 'rgba(26,22,38,0.04)',
        color: 'var(--muted)', borderRadius: 999, fontSize: 13,
        fontWeight: 500, textDecoration: 'line-through',
        textDecorationColor: 'rgba(26,22,38,0.3)',
      }}>{children}</span>
    );
  }
  return (
    <span style={{
      padding: '5px 6px 5px 10px', background: 'rgba(26,22,38,0.04)',
      color: 'var(--ink)', borderRadius: 999, fontSize: 13, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color || '#888', flexShrink: 0 }} />
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          title="Remove from team"
          style={{
            display: 'grid', placeItems: 'center',
            width: 16, height: 16, borderRadius: '50%',
            border: 'none', background: 'transparent',
            color: 'var(--muted)', cursor: 'pointer', padding: 0,
            lineHeight: 1, fontSize: 14,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,92,138,0.15)'; e.currentTarget.style.color = '#FF5C8A'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; }}
        >
          ×
        </button>
      )}
    </span>
  );
}
