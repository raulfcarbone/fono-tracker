import { Rule, Stimulus } from './types';

export const rules: Rule[] = [
  {
    id: 'animals',
    title: 'Solo animales',
    description: 'Toca únicamente cuando aparezcan animales (GO).',
    matchTag: 'animal',
  },
  {
    id: 'objects',
    title: 'Solo objetos de casa',
    description: 'Responde solo a objetos de uso cotidiano.',
    matchTag: 'hogar',
  },
];

export const stimuli: Stimulus[] = [
  { id: 'dog', label: 'Perro', image: '/interactive/dog.svg', tags: ['animal'] },
  { id: 'cat', label: 'Gato', tags: ['animal'] },
  { id: 'apple', label: 'Manzana', image: '/interactive/apple.svg', tags: ['comida'] },
  { id: 'book', label: 'Libro', image: '/interactive/book.svg', tags: ['hogar'] },
  { id: 'toothbrush', label: 'Cepillo', image: '/interactive/toothbrush.svg', tags: ['hogar', 'rutina'] },
  { id: 'car', label: 'Auto', tags: ['vehiculo'] },
];
