export type Stimulus = {
  id: string;
  label: string; // visible (palabra breve o categoría)
  image?: string; // pictograma o imagen local
  audio?: string; // opcional para modo auditivo
  tags: string[]; // etiquetas clínicas para la regla (ej. ["animal"])
};

export type Rule = {
  id: string;
  title: string;
  description: string;
  matchTag: string; // etiqueta objetivo para GO
};

export type TrialResult = {
  stimulusId: string;
  isTarget: boolean;
  clicked: boolean;
  reactionTimeMs?: number;
};

export type GoNoGoConfig = {
  stimuli: Stimulus[];
  rules: Rule[];
  stimulusDurationMs?: number;
  sequenceLength?: number;
  rounds?: number;
  enableAudio?: boolean;
};
