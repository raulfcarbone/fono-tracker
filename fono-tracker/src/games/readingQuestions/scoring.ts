import { type Progress, type QType } from './types';

export function scoreByType(results: { type: QType; ok: boolean }[]) {
  const base: Record<QType, { ok: number; total: number }> = {
    literal: { ok: 0, total: 0 },
    inferencial: { ok: 0, total: 0 },
    figurado: { ok: 0, total: 0 },
  };

  for (const r of results) {
    base[r.type].total += 1;
    if (r.ok) base[r.type].ok += 1;
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
  const empty: Progress = {
    literal: { correct: 0, total: 0 },
    inferencial: { correct: 0, total: 0 },
    figurado: { correct: 0, total: 0 },
  };
  if (typeof window === 'undefined') return empty;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as Progress) : empty;
  } catch (error) {
    console.error('Error loading reading questions progress', error);
    return empty;
  }
}
