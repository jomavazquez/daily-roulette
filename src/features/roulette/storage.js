const KEY = 'team-roulette-teams';

const DEFAULT_TEAMS = [
  { id: 'team-1', name: 'Squad A', names: ['Alex', 'David', 'Antonio', 'Sönke', 'Róbert', 'Mahbubur', 'Fabian', 'Selo', 'Mahfud', 'Vitali', 'Viktor', 'Tariq'] },
];

export const loadTeams = () => {
  try{
    const raw = localStorage.getItem(KEY);
    if( !raw ) return DEFAULT_TEAMS;
    const parsed = JSON.parse(raw);
    if( !Array.isArray(parsed) || parsed.length === 0 ) return DEFAULT_TEAMS;
    return parsed;
  }catch{
    return DEFAULT_TEAMS;
  }
}

export function saveTeams(teams) {
  try {
    localStorage.setItem(KEY, JSON.stringify(teams));
  } catch { /* storage full or unavailable */ }
}

export function exportTeams(teams) {
  const blob = new Blob([JSON.stringify(teams, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'team-roulette-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importTeams(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('Invalid format');
        // validate shape
        const teams = data.filter(
          (t) => t && typeof t.id === 'string' && typeof t.name === 'string' && Array.isArray(t.names)
        );
        if (teams.length === 0) throw new Error('No valid teams found');
        resolve(teams);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsText(file);
  });
}

export function newTeamId() {
  return 'team-' + Date.now();
}
