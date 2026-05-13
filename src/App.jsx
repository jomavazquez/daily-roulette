import { useState, useRef, useCallback, useEffect } from 'react';
import Wheel from './features/roulette/Wheel.jsx';
import SpinButton from './features/roulette/SpinButton.jsx';
import WinnerModal from './features/roulette/WinnerModal.jsx';
import NamesCard from './features/roulette/NamesCard.jsx';
import HistoryCard from './features/roulette/HistoryCard.jsx';
import TeamsPanel from './features/roulette/TeamsPanel.jsx';
import { PALETTE } from './features/roulette/palette.js';
import { tick, fanfare, resumeAudio } from './features/roulette/audio.js';
import { fireConfetti } from './features/roulette/confetti.js';
import { loadTeams, saveTeams, newTeamId } from './features/roulette/storage.js';

function getTeam(teams, id) {
  return teams.find((t) => t.id === id) ?? teams[0];
}

export default function App() {
  const [teams, setTeams]       = useState(() => loadTeams());
  const [activeId, setActiveId] = useState(() => loadTeams()[0].id);
  const activeTeam = getTeam(teams, activeId);

  useEffect(() => { saveTeams(teams); }, [teams]);

  const updateActiveNames = (updater) => {
    setTeams((ts) =>
      ts.map((t) =>
        t.id === activeId
          ? { ...t, names: typeof updater === 'function' ? updater(t.names) : updater }
          : t
      )
    );
  };

  const [pool, setPool]         = useState(activeTeam.names);
  const [history, setHistory]   = useState([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner]     = useState(null);
  const [adding, setAdding]     = useState(false);
  const [newName, setNewName]   = useState('');

  const tickTimerRef = useRef(null);
  const rotationRef  = useRef(0);

  useEffect(() => {
    setPool(activeTeam.names);
    setHistory([]);
    setWinner(null);
    setRotation(0);
    rotationRef.current = 0;
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPool((prev) => {
      const added = activeTeam.names.filter((n) => !prev.includes(n));
      return added.length ? [...prev, ...added] : prev;
    });
  }, [activeTeam.names]);

  const stopTicks = () => {
    if (tickTimerRef.current) { clearTimeout(tickTimerRef.current); tickTimerRef.current = null; }
  };
  const startTicks = () => {
    stopTicks();
    let elapsed = 0;
    const duration = 5400;
    let interval = 55;
    const step = () => {
      tick(0.05);
      elapsed += interval;
      const t = Math.min(1, elapsed / duration);
      interval = 55 + Math.pow(t, 2.2) * 360;
      if (elapsed < duration) tickTimerRef.current = setTimeout(step, interval);
    };
    tickTimerRef.current = setTimeout(step, interval);
  };

  const spin = useCallback((onPool) => {
    const list = onPool || pool;
    if (list.length === 0 || spinning) return;
    resumeAudio();
    const currentRot = rotationRef.current;
    const step = 360 / list.length;
    const idx = Math.floor(Math.random() * list.length);
    const targetWithin = (360 - (idx * step + step / 2)) % 360;
    const extra = 360 * (6 + Math.floor(Math.random() * 3));
    const newRot = currentRot + extra + ((targetWithin - (currentRot % 360)) + 360) % 360;
    rotationRef.current = newRot;
    setSpinning(true);
    setWinner(null);
    setRotation(newRot);
    startTicks();
    setTimeout(() => {
      stopTicks();
      setSpinning(false);
      setWinner({ name: list[idx], color: PALETTE[idx % PALETTE.length] });
      fanfare();
      fireConfetti();
    }, 5450);
  }, [pool, spinning]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPass = () => {
    if (!winner) return;
    const next = pool.filter((n) => n !== winner.name);
    setHistory((h) => [{ name: winner.name, kind: 'passed' }, ...h]);
    setPool(next);
    setWinner(null);
    setTimeout(() => spin(next), 320);
  };
  const onKeep = () => {
    if (!winner) return;
    setHistory((h) => [{ name: winner.name, kind: 'chosen' }, ...h]);
    setWinner(null);
  };
  const onReset = () => {
    setPool(activeTeam.names);
    setHistory([]);
    setWinner(null);
    setRotation(0);
    rotationRef.current = 0;
  };

  const onAdd = () => {
    const n = newName.trim();
    setAdding(false);
    setNewName('');
    if (!n || activeTeam.names.includes(n)) return;
    updateActiveNames((names) => [...names, n]);
  };

  const onRemoveName = (name) => {
    updateActiveNames((names) => names.filter((n) => n !== name));
    setPool((p) => p.filter((n) => n !== name));
  };

  const onAddTeam = (name) => {
    const t = { id: newTeamId(), name, names: [] };
    setTeams((ts) => [...ts, t]);
    setActiveId(t.id);
  };
  const onRenameTeam = (id, name) => {
    setTeams((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));
  };
  const onDeleteTeam = (id) => {
    setTeams((ts) => {
      const next = ts.filter((t) => t.id !== id);
      if (activeId === id) setActiveId(next[0].id);
      return next;
    });
  };
  const onImportTeams = (imported) => {
    setTeams(imported);
    setActiveId(imported[0].id);
  };

  return (
    <div style={{
      maxWidth: 1280, margin: '0 auto',
      padding: '32px 28px 64px',
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) 320px',
      gap: 40,
      alignItems: 'start',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Header teamName={activeTeam.name} />

        <div style={{
          marginTop: 12, padding: '10px 18px', borderRadius: 999,
          background: 'rgba(26,22,38,0.06)', color: 'var(--ink-2)',
          fontWeight: 600, fontSize: 14, letterSpacing: '0.02em',
        }}>
          {pool.length} {pool.length === 1 ? 'person' : 'people'} on the wheel
        </div>

        <div style={{ marginTop: 24 }}>
          <Wheel names={pool} rotation={rotation} spinning={spinning} size={540} />
        </div>

        <SpinButton spinning={spinning} disabled={pool.length === 0 || spinning} onClick={() => spin()} />

        {pool.length === 0 && activeTeam.names.length > 0 && (
          <button onClick={onReset} style={{
            marginTop: 14, padding: '10px 20px',
            border: '1.5px solid var(--line)',
            background: 'white', borderRadius: 999,
            fontWeight: 600, color: 'var(--ink-2)', cursor: 'pointer',
          }}>
            ↻ Reset the wheel
          </button>
        )}
      </div>

      <aside style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TeamsPanel
          teams={teams}
          activeId={activeId}
          onSelect={setActiveId}
          onAdd={onAddTeam}
          onRename={onRenameTeam}
          onDelete={onDeleteTeam}
          onImport={onImportTeams}
        />
        <NamesCard
          pool={pool}
          allNames={activeTeam.names}
          onAdd={onAdd}
          onRemoveName={onRemoveName}
          adding={adding}
          setAdding={setAdding}
          newName={newName}
          setNewName={setNewName}
          onReset={onReset}
        />
        <HistoryCard history={history} />
      </aside>

      {winner && !spinning && (
        <WinnerModal
          winner={winner}
          remaining={pool.length - 1}
          onKeep={onKeep}
          onPass={onPass}
        />
      )}
    </div>
  );
}

function Header({ teamName }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 8 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '6px 14px', background: 'white',
        border: '1.5px solid var(--line)', borderRadius: 999,
        boxShadow: 'var(--shadow-sm)', fontWeight: 600, fontSize: 13,
        color: 'var(--ink-2)', letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--pop-1)',
          boxShadow: '0 0 0 4px rgba(255,92,138,0.18)',
        }} />
        {teamName}
      </div>

      <h1 style={{ marginTop: 14, fontSize: 56, lineHeight: 1.0 }}>
        Who's <em style={{
          fontStyle: 'normal',
          background: 'linear-gradient(180deg, transparent 55%, #FFE066 55%)',
          padding: '0 6px',
        }}>up</em> next?
      </h1>

      <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 16 }}>
        Give it a spin. Pass if it's not their turn.
      </p>
    </div>
  );
}
