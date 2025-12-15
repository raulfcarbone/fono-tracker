import { type Progress, type QType } from './types';

function emptyProgress(): Progress {
  return {
    literal: { correct: 0, total: 0 },
    inferencial: { correct: 0, total: 0 },
    figurado: { correct: 0, total: 0 },
    emociones: { correct: 0, total: 0 },
  } as Progress;
}

export function scoreByType(results: { type: QType; ok: boolean }[]) {
  const base = emptyProgress();
  for (const r of results) {
    base[r.type] = base[r.type] || { correct: 0, total: 0 };
    base[r.type].total += 1;
    if (r.ok) base[r.type].correct += 1;
  }
  return base;
}

export function persistProgress(key: string, progress: Progress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving reading questions progress', error);
  }
}

export function loadProgress(key: string): Progress {
  if (typeof window === 'undefined') return emptyProgress();
  try {
    const stored = localStorage.getItem(key);
    if (stored) return { ...emptyProgress(), ...(JSON.parse(stored) as Progress) };

    const legacy = localStorage.getItem('reading-questions-progress-v1');
    if (legacy) {
      return { ...emptyProgress(), ...(JSON.parse(legacy) as Progress) };
    }
    return emptyProgress();
  } catch (error) {
    console.error('Error loading reading questions progress', error);
    return emptyProgress();
  }
}
