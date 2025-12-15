export type { QType, Difficulty, Question, ReadingItem } from '../../library/types';

export type ProgressEntry = { correct: number; total: number };
export type Progress = Record<import('../../library/types').QType, ProgressEntry>;

export type ReadingQuestionsConfig = {
  readings?: import('../../library/types').ReadingItem[];
};
