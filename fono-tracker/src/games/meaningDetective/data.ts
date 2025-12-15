import { type GameItem } from './types';

// Banco de estímulos clínicos para el juego "Detective del sentido".
// Se prioriza comprensión, inferencias y razonamiento verbal.
export const items: GameItem[] = [
  // INFERENCIA (1)
  {
    id: 'inf-umbrella-1',
    category: 'inferencia',
    difficulty: 1,
    prompt: 'Camila salió y volvió con el pelo mojado y la chaqueta goteando.',
    question: '¿Qué es lo más probable que haya pasado?',
    options: ['Estuvo lloviendo', 'Se quedó dormida', 'Comió helado'],
    correctIndex: 0,
    explanation: 'Pelo mojado y ropa goteando suelen indicar lluvia o que se mojó afuera.',
    hint: 'Piensa en una causa común para ropa goteando.',
  },
  // INFERENCIA (2)
  {
    id: 'inf-alarma-2',
    category: 'inferencia',
    difficulty: 2,
    prompt: 'Se escucha la alarma de la cocina y huele a algo quemado.',
    question: '¿Qué debería hacer la persona que cocina?',
    options: ['Apagar el fuego y revisar', 'Irse a ver televisión', 'Abrir la ventana y salir'],
    correctIndex: 0,
    explanation: 'El sonido y el olor indican que debe revisar la cocina y apagar el fuego para estar segura.',
    hint: 'Actúa para detener el posible fuego.',
  },
  // INFERENCIA (3)
  {
    id: 'inf-perro-3',
    category: 'inferencia',
    difficulty: 3,
    prompt: 'Un perro corre hacia la puerta con la correa en la boca mientras mueve la cola.',
    question: '¿Qué está anticipando el perro?',
    options: ['Que van a salir a pasear', 'Que va a comer ahora', 'Que debe dormir'],
    correctIndex: 0,
    explanation: 'Traer la correa y mover la cola anticipa un paseo, no comida ni descanso inmediato.',
    hint: 'Piensa en la actividad asociada a la correa.',
    image: '/interactive/dog.svg',
  },
  // EMOCIONES (1)
  {
    id: 'emo-toy-1',
    category: 'emociones',
    difficulty: 1,
    prompt: 'A Tomás se le rompió su juguete favorito y se quedó en silencio mirando el suelo.',
    question: '¿Cómo podría sentirse Tomás?',
    options: ['Triste', 'Orgulloso', 'Aburrido'],
    correctIndex: 0,
    explanation: 'Perder o romper algo importante suele provocar tristeza.',
    hint: '¿Qué sientes cuando algo valioso se rompe?',
  },
  // EMOCIONES (2)
  {
    id: 'emo-compartir-2',
    category: 'emociones',
    difficulty: 2,
    prompt: 'Lucía repartió la última porción de pastel entre sus amigos y sonrió.',
    question: '¿Qué emoción se observa?',
    options: ['Generosidad/alegría', 'Enojo', 'Miedo'],
    correctIndex: 0,
    explanation: 'Compartir y sonreír reflejan alegría y satisfacción por cuidar a otros.',
    hint: 'Piensa en cómo se siente al compartir algo que quiere.',
  },
  // FIGURADO (1)
  {
    id: 'fig-mariposas-1',
    category: 'figurado',
    difficulty: 1,
    prompt: 'Antes de hablar, dijo: “Tengo mariposas en el estómago”.',
    question: '¿Qué quiere decir en realidad?',
    options: ['Que está nerviosa', 'Que comió muy rápido', 'Que tiene hambre'],
    correctIndex: 0,
    explanation: 'La expresión “mariposas en el estómago” indica nervios o ansiedad, no algo literal.',
    hint: 'Relaciona la sensación con emociones, no con comida.',
  },
  // FIGURADO (2)
  {
    id: 'fig-cabeza-nubes-2',
    category: 'figurado',
    difficulty: 2,
    prompt: 'El profe dijo: “Hoy estás con la cabeza en las nubes”.',
    question: '¿Qué quiso decir el profe?',
    options: ['Que estás distraído', 'Que eres muy alto', 'Que vas a volar'],
    correctIndex: 0,
    explanation: '“Cabeza en las nubes” es un modismo: estar distraído o pensando en otra cosa.',
    hint: 'No es literal. Piensa en atención.',
  },
  // FIGURADO (3)
  {
    id: 'fig-corazon-piedra-3',
    category: 'figurado',
    difficulty: 3,
    prompt: 'Dicen que “tiene el corazón de piedra”.',
    question: '¿Qué significa más probablemente?',
    options: ['Que es poco sensible', 'Que está enfermo del corazón', 'Que es muy fuerte físicamente'],
    correctIndex: 0,
    explanation: 'Es metáfora: alguien poco empático o que no muestra emociones.',
    hint: 'Piensa en empatía, no en anatomía.',
  },
  // SEMÁNTICA (1)
  {
    id: 'sem-fruta-1',
    category: 'semantica',
    difficulty: 1,
    prompt: 'Manzana, plátano, pera…',
    question: '¿Qué palabra pertenece al mismo grupo?',
    options: ['Naranja', 'Silla', 'Zapato'],
    correctIndex: 0,
    explanation: 'Naranja también es fruta; las otras no pertenecen a esa categoría.',
    hint: 'Busca una palabra del mismo tipo (categoría).',
    image: '/interactive/apple.svg',
  },
  // SEMÁNTICA (2)
  {
    id: 'sem-sinonimo-2',
    category: 'semantica',
    difficulty: 2,
    prompt: 'Elige el sinónimo más cercano de “enorme”.',
    question: '¿Cuál significa casi lo mismo?',
    options: ['Gigante', 'Rápido', 'Suave'],
    correctIndex: 0,
    explanation: 'Gigante y enorme comparten la idea de gran tamaño.',
    hint: 'Piensa en tamaño.',
    image: '/interactive/book.svg',
  },
  // SEMÁNTICA (3)
  {
    id: 'sem-antonomasia-3',
    category: 'semantica',
    difficulty: 3,
    prompt: '“La casa estaba en silencio absoluto; era una tumba”.',
    question: '¿Qué relación semántica se usa aquí?',
    options: ['Metáfora de silencio total', 'Descripción de un cementerio', 'Comparación de tamaño'],
    correctIndex: 0,
    explanation: 'Es una metáfora que compara el silencio con el de una tumba para enfatizar ausencia de sonido.',
    hint: 'No es literal: se usa para reforzar la idea de silencio.',
  },
];
