export type Category = 'inferencia' | 'emociones' | 'figurado' | 'semantica';

export type Difficulty = 1 | 2 | 3;

export type GameItem = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  locale?: 'general' | 'cl';
  prompt: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  image?: string;
};

export type MeaningDetectiveConfig = {
  items?: GameItem[];
};

export type Progress = Record<
  Category,
  {
    correct: number;
    total: number;
  }
>;
