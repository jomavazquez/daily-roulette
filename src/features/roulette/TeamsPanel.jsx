import { useRef, useState } from 'react';
import { exportTeams, importTeams, newTeamId } from './storage.js';

export default function TeamsPanel({ teams, activeId, onSelect, onAdd, onRename, onDelete, onImport }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName]   = useState('');
  const [adding, setAdding]       = useState(false);
  const [newName, setNewName]     = useState('');
  const [importErr, setImportErr] = useState('');
  const fileRef = useRef(null);

  const commitRename = (id) => {
    const n = editName.trim();
    if (n) onRename(id, n);
    setEditingId(null);
    setEditName('');
  };

  const commitAdd = () => {
    const n = newName.trim();
    if (n) onAdd(n);
    setAdding(false);
    setNewName('');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importTeams(file);
      onImport(imported);
      setImportErr('');
    } catch (err) {
      setImportErr(err.message);
    }
    e.target.value = '';
  };

  return (
    <div style={{
      background: 'var(--card)',
      border: '1.5px solid var(--line)',
      borderRadius: 24, padding: 20,
      boxShadow: 'var(--shadow-md)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 18 }}>Teams</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          {/* Export */}
          <IconBtn title="Export JSON" onClick={() => exportTeams(teams)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconBtn>
          {/* Import */}
          <IconBtn title="Import JSON" onClick={() => fileRef.current?.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconBtn>
          <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        </div>
      </div>

      {importErr && (
        <p style={{ fontSize: 12, color: '#FF5C8A', marginBottom: 10 }}>⚠ {importErr}</p>
      )}

      {/* Team list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {teams.map((t) => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 12,
            background: t.id === activeId ? 'rgba(124,91,255,0.10)' : 'transparent',
            border: t.id === activeId ? '1.5px solid rgba(124,91,255,0.25)' : '1.5px solid transparent',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
            onClick={() => { if (editingId !== t.id) onSelect(t.id); }}
          >
            {/* Color dot */}
            <span style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: t.id === activeId ? 'var(--pop-6)' : 'rgba(26,22,38,0.2)',
            }} />

            {/* Name or inline edit */}
            {editingId === t.id ? (
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => commitRename(t.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename(t.id);
                  if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  flex: 1, fontSize: 13, fontFamily: 'inherit', fontWeight: 600,
                  border: 'none', borderBottom: '1.5px dashed var(--line)',
                  outline: 'none', background: 'transparent', color: 'var(--ink)',
                }}
              />
            ) : (
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                {t.name}
              </span>
            )}

            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, flexShrink: 0 }}>
              {t.names.length}
            </span>

            {/* Edit */}
            <button
              onClick={(e) => { e.stopPropagation(); setEditingId(t.id); setEditName(t.name); }}
              title="Rename"
              style={{ ...iconStyle, opacity: editingId === t.id ? 0 : 1 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Delete (only if more than 1 team) */}
            {teams.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                title="Delete team"
                style={{ ...iconStyle, color: '#FF5C8A' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ))}

        {/* Add team */}
        {adding ? (
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={commitAdd}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitAdd();
              if (e.key === 'Escape') { setAdding(false); setNewName(''); }
            }}
            placeholder="Team name + Enter"
            style={{
              padding: '8px 10px', borderRadius: 12, fontSize: 13,
              border: '1.5px dashed rgba(26,22,38,0.25)',
              fontFamily: 'inherit', outline: 'none',
            }}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{
              padding: '8px 10px', borderRadius: 12, fontSize: 13, fontWeight: 600,
              border: '1.5px dashed rgba(26,22,38,0.25)',
              background: 'transparent', color: 'var(--muted)', cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            + New team
          </button>
        )}
      </div>
    </div>
  );
}

const iconStyle = {
  display: 'grid', placeItems: 'center',
  width: 22, height: 22, borderRadius: 6,
  border: 'none', background: 'transparent',
  color: 'var(--muted)', cursor: 'pointer',
  flexShrink: 0,
  transition: 'color 0.15s, background 0.15s',
};

function IconBtn({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      ...iconStyle,
      width: 28, height: 28, borderRadius: 8,
      border: '1.5px solid var(--line)',
      background: 'white',
    }}>
      {children}
    </button>
  );
}
