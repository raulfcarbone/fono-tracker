import { type Story } from './types';

export const stories: Story[] = [
  {
    id: 'picnic',
    title: 'Día de picnic',
    cards: [
      { id: 'a', image: '/interactive/story-picnic-1.svg', text: 'Preparan la canasta' },
      { id: 'b', image: '/interactive/story-picnic-2.svg', text: 'Llegan al parque' },
      { id: 'c', image: '/interactive/story-picnic-3.svg', text: 'Comen juntos' },
      { id: 'd', image: '/interactive/story-picnic-4.svg', text: 'Vuelven a casa' },
    ],
    correctOrder: ['a', 'b', 'c', 'd'],
    prompts: {
      starter: 'Ordena la historia y cuéntala con tus palabras.',
      connectors: ['Primero…', 'Luego…', 'Después…', 'Al final…'],
      questions: ['¿Qué sienten en cada parte?', '¿Qué pasaría si llueve?'],
    },
  },
  {
    id: 'morning-routine',
    title: 'Rutina de la mañana',
    cards: [
      { id: 'a', image: '/interactive/story-morning-1.svg', text: 'Se despierta y se estira' },
      { id: 'b', image: '/interactive/story-morning-2.svg', text: 'Se lava la cara y los dientes' },
      { id: 'c', image: '/interactive/story-morning-3.svg', text: 'Desayuna con la familia' },
    ],
    correctOrder: ['a', 'b', 'c'],
    prompts: {
      starter: 'Acomoda la rutina y descríbela.',
      connectors: ['Al despertar…', 'Luego…', 'Después…'],
      questions: ['¿Qué parte te gusta más?', '¿Qué sucede si se olvida de un paso?'],
    },
  },
];
