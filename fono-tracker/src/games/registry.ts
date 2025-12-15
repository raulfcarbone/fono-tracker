import type { ComponentType } from 'react';
import { FindAndNameGame } from './findAndName/FindAndNameGame';
import { GoNoGoGame } from './goNoGo/GoNoGoGame';
import { MeaningDetectiveGame } from './meaningDetective/MeaningDetectiveGame';
import { StoryOrderGame } from './storyOrder/StoryOrderGame';
import { AttentionRulesGame } from '../components/interactive/AttentionRulesGame';
import { MemorySequencingGame } from '../components/interactive/MemorySequencingGame';
import { ReadingQuestionsGame } from './readingQuestions/ReadingQuestionsGame';

export type InteractiveCategory = 'lenguaje' | 'cognicion' | 'social' | 'aac' | 'narrativo';
export type IntegrationStatus = 'integrado' | 'prototipo' | 'idea';

export type GameRegistryItem = {
  id: string;
  category: InteractiveCategory;
  status: IntegrationStatus;
  languageIndependent: boolean;
  component?: ComponentType<any>;
  translationKeys: {
    title: string;
    description: string;
    goals: string;
    skills: string;
    ageRange: string;
  };
};

export type LocalizedGame = Omit<GameRegistryItem, 'translationKeys'> & {
  title: string;
  description: string;
  therapeuticGoals: string[];
  cognitiveSkills: string[];
  ageRange: string;
};

export const GAME_REGISTRY: GameRegistryItem[] = [
  {
    id: 'find-and-name',
    category: 'lenguaje',
    languageIndependent: true,
    status: 'integrado',
    component: FindAndNameGame,
    translationKeys: {
      title: 'interactiveActivities.games.findAndName.title',
      description: 'interactiveActivities.games.findAndName.description',
      goals: 'interactiveActivities.games.findAndName.goals',
      skills: 'interactiveActivities.games.findAndName.skills',
      ageRange: 'interactiveActivities.games.findAndName.ageRange',
    },
  },
  {
    id: 'attention-rules',
    category: 'cognicion',
    languageIndependent: true,
    status: 'integrado',
    component: AttentionRulesGame,
    translationKeys: {
      title: 'interactiveActivities.games.attention.title',
      description: 'interactiveActivities.games.attention.description',
      goals: 'interactiveActivities.games.attention.goals',
      skills: 'interactiveActivities.games.attention.skills',
      ageRange: 'interactiveActivities.games.attention.ageRange',
    },
  },
  {
    id: 'memory-sequencing',
    category: 'cognicion',
    languageIndependent: true,
    status: 'integrado',
    component: MemorySequencingGame,
    translationKeys: {
      title: 'interactiveActivities.games.memory.title',
      description: 'interactiveActivities.games.memory.description',
      goals: 'interactiveActivities.games.memory.goals',
      skills: 'interactiveActivities.games.memory.skills',
      ageRange: 'interactiveActivities.games.memory.ageRange',
    },
  },
  {
    id: 'go-no-go',
    category: 'cognicion',
    languageIndependent: true,
    status: 'integrado',
    component: GoNoGoGame,
    translationKeys: {
      title: 'interactiveActivities.games.goNoGo.title',
      description: 'interactiveActivities.games.goNoGo.description',
      goals: 'interactiveActivities.games.goNoGo.goals',
      skills: 'interactiveActivities.games.goNoGo.skills',
      ageRange: 'interactiveActivities.games.goNoGo.ageRange',
    },
  },
  {
    id: 'meaning-detective',
    category: 'lenguaje',
    languageIndependent: true,
    status: 'integrado',
    component: MeaningDetectiveGame,
    translationKeys: {
      title: 'interactiveActivities.games.meaningDetective.title',
      description: 'interactiveActivities.games.meaningDetective.description',
      goals: 'interactiveActivities.games.meaningDetective.goals',
      skills: 'interactiveActivities.games.meaningDetective.skills',
      ageRange: 'interactiveActivities.games.meaningDetective.ageRange',
    },
  },
  {
    id: 'reading-questions',
    category: 'lenguaje',
    languageIndependent: true,
    status: 'integrado',
    component: ReadingQuestionsGame,
    translationKeys: {
      title: 'interactiveActivities.games.readingQuestions.title',
      description: 'interactiveActivities.games.readingQuestions.description',
      goals: 'interactiveActivities.games.readingQuestions.goals',
      skills: 'interactiveActivities.games.readingQuestions.skills',
      ageRange: 'interactiveActivities.games.readingQuestions.ageRange',
    },
  },
  {
    id: 'story-order',
    category: 'narrativo',
    languageIndependent: true,
    status: 'integrado',
    component: StoryOrderGame,
    translationKeys: {
      title: 'interactiveActivities.games.storyOrder.title',
      description: 'interactiveActivities.games.storyOrder.description',
      goals: 'interactiveActivities.games.storyOrder.goals',
      skills: 'interactiveActivities.games.storyOrder.skills',
      ageRange: 'interactiveActivities.games.storyOrder.ageRange',
    },
  },
];

export function localizeGame(item: GameRegistryItem, t: (path: string, fallback?: any) => any): LocalizedGame {
  return {
    ...item,
    title: t(item.translationKeys.title),
    description: t(item.translationKeys.description),
    therapeuticGoals: t(item.translationKeys.goals, []),
    cognitiveSkills: t(item.translationKeys.skills, []),
    ageRange: t(item.translationKeys.ageRange),
  };
}

export function getLocalizedGames(t: (path: string, fallback?: any) => any): LocalizedGame[] {
  return GAME_REGISTRY.map(item => localizeGame(item, t));
}

export function findGameById(id?: string) {
  if (!id) return undefined;
  return GAME_REGISTRY.find(game => game.id === id);
}
