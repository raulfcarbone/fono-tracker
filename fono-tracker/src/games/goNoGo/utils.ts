import { Stimulus } from './types';

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function buildSequence(stimuli: Stimulus[], length: number, rounds: number): Stimulus[] {
  const safeLength = Math.max(1, length);
  const safeRounds = Math.max(1, rounds);
  const sequence: Stimulus[] = [];

  for (let round = 0; round < safeRounds; round += 1) {
    const base = shuffle(stimuli).slice(0, safeLength);
    sequence.push(...base);
  }

  return sequence;
}
