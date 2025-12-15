export type QType = 'literal' | 'inferencial' | 'figurado';
export type Difficulty = 1 | 2 | 3;

export type Question = {
  id: string;
  type: QType;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  evidence?: string;
};

export type ReadingItem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  text: string;
  image?: string;
  questions: Question[];
};

export type ProgressEntry = { correct: number; total: number };
export type Progress = Record<QType, ProgressEntry>;

export type ReadingQuestionsConfig = {
  readings?: ReadingItem[];
};
