import { type FindAndNameItem } from './types';

// Conjunto base de estímulos visuales para trabajar vocabulario funcional
// y atención focalizada. Se puede reemplazar por pictogramas u otras
// imágenes sin modificar la lógica del juego.
export const findAndNameItems: FindAndNameItem[] = [
  {
    id: 'apple',
    image: '/interactive/apple.svg',
    label: 'Fruta roja',
    correctOption: 'Manzana',
    options: ['Manzana', 'Auto', 'Casa', 'Perro'],
  },
  {
    id: 'dog',
    image: '/interactive/dog.svg',
    label: 'Animal doméstico',
    correctOption: 'Perro',
    options: ['Gato', 'Perro', 'Mesa'],
  },
  {
    id: 'toothbrush',
    image: '/interactive/toothbrush.svg',
    label: 'Rutina de higiene',
    correctOption: 'Cepillo de dientes',
    options: ['Cepillo de dientes', 'Libro', 'Zapato'],
  },
  {
    id: 'book',
    image: '/interactive/book.svg',
    label: 'Acción de leer',
    correctOption: 'Libro',
    options: ['Libro', 'Manzana', 'Camión'],
  },
];
