export default function SpinButton({ onClick, disabled, spinning }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        marginTop: 28,
        padding: '20px 44px',
        fontSize: 22,
        fontWeight: 700,
        fontFamily: 'Bricolage Grotesque',
        letterSpacing: '-0.01em',
        color: 'white',
        background: disabled
          ? 'linear-gradient(135deg, #BBB1C7, #9890A6)'
          : 'linear-gradient(135deg, #FF5C8A 0%, #FF7A45 100%)',
        border: 'none',
        borderRadius: 999,
        boxShadow: disabled
          ? 'none'
          : '0 18px 32px -8px rgba(255,92,138,0.55), inset 0 -4px 0 rgba(0,0,0,0.18)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.2s ease',
        transform: spinning ? 'scale(0.98)' : 'scale(1)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(1.03)'; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.transform = spinning ? 'scale(0.98)' : 'scale(1)'; }}
    >
      <SpinIcon spinning={spinning} />
      {spinning ? 'Spinning…' : 'Spin the wheel'}
    </button>
  );
}

function SpinIcon({ spinning }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      style={{ animation: spinning ? 'spinIcon 1.1s linear infinite' : 'none' }}>
      <g stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M21 12a9 9 0 1 1-3.6-7.2" />
        <path d="M21 4v5h-5" />
      </g>
    </svg>
  );
}
