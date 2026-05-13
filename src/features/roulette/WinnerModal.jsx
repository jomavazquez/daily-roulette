const WinnerModal = ({ winner, remaining, onKeep, onPass }) => {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 40,
      display: 'grid', placeItems: 'center',
      background: 'rgba(26,22,38,0.45)',
      backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.25s ease',
    }}>
      <div style={{
        width: 'min(520px, 92vw)',
        background: 'white',
        borderRadius: 28,
        padding: 36,
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
        position: 'relative',
        animation: 'pop 0.5s cubic-bezier(0.16, 1.0, 0.3, 1)',
        border: `4px solid ${winner.color}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--muted)' }}>
          🎉 The wheel of the death chose
        </div>
        <h2 style={{ marginTop: 10, fontSize: 64, letterSpacing: '-0.03em', lineHeight: 1.0, color: 'var(--ink)', }}>
          { winner.name }
        </h2>
        <div style={{ margin: '18px auto 22px', width: 60, height: 6, borderRadius: 999, background: winner.color }} />
        <p style={{ color: 'var(--muted)', margin: 0, fontSize: 15 }}>
          {
            remaining > 0 ? "Their turn — or pass to spin again." : "Last one standing!"
          }
        </p>
        <div style={{ marginTop: 26, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={ onPass }
            disabled={ remaining === 0 }
            style={{ 
              padding: '14px 26px', 
              fontFamily: 'Bricolage Grotesque', 
              fontSize: 17, fontWeight: 700, 
              background: 'white', 
              color: remaining === 0 ? 'var(--muted)' : 'var(--ink)', 
              border: '2px solid rgba(26,22,38,0.15)', borderRadius: 999, 
              cursor: remaining === 0 ? 'not-allowed' : 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', gap: 8, transition: 'border-color 0.15s' 
            }}
            onMouseEnter={ (e) => { if (remaining > 0) e.currentTarget.style.borderColor = 'var(--ink)'; } }
            onMouseLeave={ (e) => { if (remaining > 0) e.currentTarget.style.borderColor = 'rgba(26,22,38,0.15)'; } }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Pass
          </button>
          <button
            onClick={onKeep}
            style={{
              padding: '14px 30px',
              fontFamily: 'Bricolage Grotesque',
              fontSize: 17, fontWeight: 700,
              color: 'white',
              background: 'linear-gradient(135deg, #4FD18B, #2BC4C4)',
              border: 'none', borderRadius: 999,
              cursor: 'pointer',
              boxShadow: '0 14px 26px -8px rgba(43,196,196,0.55), inset 0 -3px 0 rgba(0,0,0,0.18)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            It's them!
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinnerModal;