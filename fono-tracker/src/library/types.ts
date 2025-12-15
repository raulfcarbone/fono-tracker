export type QType = 'literal' | 'inferencial' | 'figurado' | 'emociones';
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
  ageRange?: string;
  tags?: string[];
  updatedAt?: number;
  createdAt?: number;
};
