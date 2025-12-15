import { FindAndNameGame } from '../games/findAndName/FindAndNameGame';
import { AttentionRulesGame } from '../components/interactive/AttentionRulesGame';
import { MemorySequencingGame } from '../components/interactive/MemorySequencingGame';

/**
 * Modelo de datos para el catálogo clínico de actividades interactivas.
 * @typedef {Object} InteractiveGame
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} therapeuticGoals
 * @property {string[]} cognitiveSkills
 * @property {string} ageRange
 * @property {('lenguaje'|'cognicion'|'social'|'aac'|'narrativo')} category
 * @property {boolean} languageIndependent
 * @property {('integrado'|'prototipo'|'idea')} status
 * @property {React.ComponentType} [component]
 */

/**
 * Devuelve el catálogo de juegos con textos tomados desde la capa i18n.
 * Separamos los datos de las implementaciones para poder agregar o reemplazar
 * juegos sin tocar la lógica central de la página.
 */
export const getInteractiveGames = t => [
  {
    id: 'find-and-name',
    title: t('interactiveActivities.games.findAndName.title'),
    description: t('interactiveActivities.games.findAndName.description'),
    therapeuticGoals: t('interactiveActivities.games.findAndName.goals', []),
    cognitiveSkills: t('interactiveActivities.games.findAndName.skills', []),
    ageRange: t('interactiveActivities.games.findAndName.ageRange'),
    category: 'lenguaje',
    languageIndependent: true,
    status: 'integrado',
    component: FindAndNameGame,
  },
  {
    id: 'attention-rules',
    title: t('interactiveActivities.games.attention.title'),
    description: t('interactiveActivities.games.attention.description'),
    therapeuticGoals: t('interactiveActivities.games.attention.goals', []),
    cognitiveSkills: t('interactiveActivities.games.attention.skills', []),
    ageRange: t('interactiveActivities.games.attention.ageRange'),
    category: 'cognicion',
    languageIndependent: true,
    status: 'integrado',
    component: AttentionRulesGame,
  },
  {
    id: 'memory-sequencing',
    title: t('interactiveActivities.games.memory.title'),
    description: t('interactiveActivities.games.memory.description'),
    therapeuticGoals: t('interactiveActivities.games.memory.goals', []),
    cognitiveSkills: t('interactiveActivities.games.memory.skills', []),
    ageRange: t('interactiveActivities.games.memory.ageRange'),
    category: 'cognicion',
    languageIndependent: true,
    status: 'integrado',
    component: MemorySequencingGame,
  },
];
