export type StoryCard = {
  id: string;
  image?: string;
  text?: string;
};

export type StoryPrompts = {
  starter?: string;
  connectors?: string[];
  questions?: string[];
};

export type Story = {
  id: string;
  title: string;
  cards: StoryCard[];
  correctOrder: string[];
  prompts?: StoryPrompts;
};

export type StoryOrderConfig = {
  stories: Story[];
  cardsCount?: number;
  visualOnly?: boolean;
};
