import { type GameItem } from './types';

// Banco de estímulos clínicos enriquecido para "Detective del sentido".
// Se prioriza comprensión, inferencias, lenguaje figurado y relaciones semánticas.
// locale permite filtrar español neutro (general) o modismos chilenos (cl).
export const seedItems: GameItem[] = [
  // =========================
  // INFERENCIAS (D1)
  // =========================
  {
    id: 'inf-lluvia-1',
    category: 'inferencia',
    difficulty: 1,
    prompt: 'Sofía entró y dejó el paraguas abierto goteando cerca de la puerta.',
    question: '¿Qué es lo más probable?',
    options: ['Afuera está lloviendo', 'Sofía está cocinando', 'Sofía viene del gimnasio'],
    correctIndex: 0,
    explanation: 'Un paraguas goteando suele indicar lluvia reciente.',
    hint: 'Piensa en para qué se usa un paraguas.',
    locale: 'general',
  },
  {
    id: 'inf-vidrio-1',
    category: 'inferencia',
    difficulty: 1,
    prompt: 'Se escuchó un golpe. Luego, Pedro barrió el suelo con cuidado.',
    question: '¿Qué pudo pasar?',
    options: ['Se rompió algo', 'Pedro se durmió', 'Pedro aprendió a bailar'],
    correctIndex: 0,
    explanation: 'Barrer con cuidado después de un golpe sugiere que algo se quebró o cayó.',
    hint: '¿Qué cosas se barren cuando hay un accidente?',
    locale: 'general',
  },
  {
    id: 'inf-horno-1',
    category: 'inferencia',
    difficulty: 1,
    prompt: 'Al abrir la puerta, salió olor a pan y el horno estaba encendido.',
    question: '¿Qué están haciendo?',
    options: ['Horneando', 'Regando plantas', 'Lavando ropa'],
    correctIndex: 0,
    explanation: 'Olor a pan y horno encendido se asocia con hornear.',
    hint: 'Relaciona el olor con una acción.',
    locale: 'general',
  },
  {
    id: 'inf-bus-1',
    category: 'inferencia',
    difficulty: 1,
    prompt: 'Martina miró la hora, apuró el paso y corrió cuando vio el bus doblar la esquina.',
    question: '¿Qué quería evitar?',
    options: ['Perder el bus', 'Comprar helado', 'Dormirse'],
    correctIndex: 0,
    explanation: 'Correr al ver el bus suele ser para no perderlo.',
    hint: '¿Qué pasa si el bus se va?',
    locale: 'general',
  },

  // =========================
  // INFERENCIAS (D2)
  // =========================
  {
    id: 'inf-causa-2',
    category: 'inferencia',
    difficulty: 2,
    prompt: 'Apenas comenzó la película, apagaron la luz y todos guardaron silencio.',
    question: '¿Dónde están probablemente?',
    options: ['En un cine', 'En una piscina', 'En una feria'],
    correctIndex: 0,
    explanation: 'Apagar la luz y el silencio son normas típicas del cine.',
    hint: 'Piensa en un lugar donde se ve una película.',
    locale: 'general',
  },
  {
    id: 'inf-predictiva-2',
    category: 'inferencia',
    difficulty: 2,
    prompt: 'Juan dejó su helado al sol y se fue a jugar.',
    question: '¿Qué pasará más probablemente cuando vuelva?',
    options: ['Estará derretido', 'Se congelará más', 'Se convertirá en juguete'],
    correctIndex: 0,
    explanation: 'El calor derrite el helado.',
    hint: '¿Qué hace el sol con cosas frías?',
    locale: 'general',
  },
  {
    id: 'inf-puente-2',
    category: 'inferencia',
    difficulty: 2,
    prompt: 'La mamá de Ana abrió la ventana. Minutos después, el olor a pintura se fue.',
    question: '¿Por qué abrió la ventana?',
    options: ['Para ventilar', 'Para esconder la pintura', 'Para hacer más ruido'],
    correctIndex: 0,
    explanation: 'Abrir una ventana ayuda a que salga el olor y entre aire.',
    hint: 'Piensa en aire fresco.',
    locale: 'general',
  },
  {
    id: 'inf-objetivo-2',
    category: 'inferencia',
    difficulty: 2,
    prompt: 'En el recreo, Nico se paró cerca del columpio y miró a los niños turnarse.',
    question: '¿Qué quería hacer probablemente?',
    options: ['Esperar su turno', 'Dormir', 'Ordenar libros'],
    correctIndex: 0,
    explanation: 'Mirar el columpio y los turnos sugiere que quiere usarlo.',
    hint: '¿Qué se hace con un columpio?',
    locale: 'general',
  },

  // =========================
  // EMOCIONES / INTENCIÓN (D1)
  // =========================
  {
    id: 'emo-regalo-1',
    category: 'emociones',
    difficulty: 1,
    prompt: 'A Carla le dieron un regalo sorpresa y abrió los ojos grande.',
    question: '¿Cómo podría sentirse?',
    options: ['Sorprendida', 'Enojada', 'Cansada'],
    correctIndex: 0,
    explanation: 'Un regalo sorpresa suele generar sorpresa.',
    hint: 'Mira la pista: “sorpresa”.',
    locale: 'general',
  },
  {
    id: 'emo-perdida-1',
    category: 'emociones',
    difficulty: 1,
    prompt: 'A Tomás se le perdió su cuaderno y buscó por todas partes sin encontrarlo.',
    question: '¿Cómo podría sentirse?',
    options: ['Preocupado', 'Orgulloso', 'Divertido'],
    correctIndex: 0,
    explanation: 'Perder algo importante suele generar preocupación o ansiedad.',
    hint: 'Piensa en buscar sin encontrar.',
    locale: 'general',
  },
  {
    id: 'emo-felicitar-1',
    category: 'emociones',
    difficulty: 1,
    prompt: 'En el acto, dijeron el nombre de Laura y todos aplaudieron.',
    question: '¿Qué emoción es más probable?',
    options: ['Orgullo', 'Miedo', 'Aburrimiento'],
    correctIndex: 0,
    explanation: 'Que te aplaudan en público suele asociarse a orgullo o alegría.',
    hint: 'Aplaudir suele ser algo positivo.',
    locale: 'general',
  },

  // =========================
  // EMOCIONES / INTENCIÓN (D2-D3)
  // =========================
  {
    id: 'emo-intencion-2',
    category: 'emociones',
    difficulty: 2,
    prompt: 'Diego miró a su amiga, vio que estaba callada y le ofreció compartir su colación.',
    question: '¿Qué intención es más probable?',
    options: ['Ayudar/acompañar', 'Molestarla', 'Competir con ella'],
    correctIndex: 0,
    explanation: 'Compartir comida cuando alguien está decaído suele ser un gesto de apoyo.',
    hint: 'Piensa en un gesto amable.',
    locale: 'general',
  },
  {
    id: 'emo-doble-3',
    category: 'emociones',
    difficulty: 3,
    prompt: "A Elena le dijeron que 'su dibujo quedó interesante'. Elena sonrió, pero después guardó el cuaderno rápido.",
    question: '¿Qué podría estar pasando?',
    options: ['No sabe si fue elogio o crítica', 'Está feliz y segura', 'No entendió qué es un cuaderno'],
    correctIndex: 0,
    explanation: '“Interesante” puede ser ambiguo: a veces suena a elogio, a veces a crítica indirecta.',
    hint: 'Busca una palabra que puede tener doble intención.',
    locale: 'general',
  },

  // =========================
  // FIGURADO (D1: literal vs no literal)
  // =========================
  {
    id: 'fig-llueve-sobre-mojado-1',
    category: 'figurado',
    difficulty: 1,
    prompt: 'Alguien dijo: “Me llueve sobre mojado”.',
    question: '¿Qué significa más probablemente?',
    options: ['Le pasan problemas uno tras otro', 'Está hablando del clima', 'Está aprendiendo a nadar'],
    correctIndex: 0,
    explanation: 'Es una expresión para decir que algo malo se repite o se suma a otro problema.',
    hint: 'No es sobre lluvia real.',
    locale: 'general',
  },
  {
    id: 'fig-pan-comido-1',
    category: 'figurado',
    difficulty: 1,
    prompt: 'Pedro dijo: “Eso es pan comido”.',
    question: '¿Qué quiso decir?',
    options: ['Es muy fácil', 'Tiene hambre', 'No le gusta el pan'],
    correctIndex: 0,
    explanation: '“Pan comido” es una forma de decir que algo es fácil.',
    hint: 'Piensa: fácil o difícil.',
    locale: 'general',
  },

  // =========================
  // FIGURADO (D2: modismos comunes)
  // =========================
  {
    id: 'fig-cabeza-nubes-2',
    category: 'figurado',
    difficulty: 2,
    prompt: 'Le dijeron: “Estás con la cabeza en las nubes”.',
    question: '¿Qué significa?',
    options: ['Está distraído', 'Está volando', 'Tiene dolor de cabeza'],
    correctIndex: 0,
    explanation: 'Es un modismo: estar distraído o pensando en otra cosa.',
    hint: 'No es literal.',
    locale: 'general',
  },
  {
    id: 'fig-se-me-hizo-tarde-2',
    category: 'figurado',
    difficulty: 2,
    prompt: 'Dijo: “Se me hizo tarde”.',
    question: '¿Qué significa?',
    options: ['Pasó el tiempo sin darse cuenta', 'Construyó una tarde', 'Se quedó sin reloj'],
    correctIndex: 0,
    explanation: 'Expresa que el tiempo pasó y ahora está atrasado.',
    hint: 'Piensa en llegar tarde.',
    locale: 'general',
  },
  {
    id: 'fig-tener-mano-2',
    category: 'figurado',
    difficulty: 2,
    prompt: 'Dicen que “tiene buena mano para las plantas”.',
    question: '¿Qué significa?',
    options: ['Se le dan bien las plantas', 'Tiene manos grandes', 'Solo toca plantas'],
    correctIndex: 0,
    explanation: '“Tener buena mano” es tener habilidad para algo.',
    hint: 'Habilidad, no tamaño.',
    locale: 'general',
  },

  // =========================
  // FIGURADO (D3: metáfora/hipérbole)
  // =========================
  {
    id: 'fig-corazon-piedra-3',
    category: 'figurado',
    difficulty: 3,
    prompt: 'Dicen que “tiene el corazón de piedra”.',
    question: '¿Qué significa más probablemente?',
    options: ['Es poco sensible', 'Tiene una piedra en el corazón', 'Es muy deportista'],
    correctIndex: 0,
    explanation: 'Metáfora: alguien frío o con poca empatía.',
    hint: 'Emociones, no anatomía.',
    locale: 'general',
  },
  {
    id: 'fig-me-mori-de-risa-3',
    category: 'figurado',
    difficulty: 3,
    prompt: 'Dijo: “Me morí de risa”.',
    question: '¿Qué significa realmente?',
    options: ['Se rió muchísimo', 'Se enfermó', 'Se cayó'],
    correctIndex: 0,
    explanation: 'Hipérbole: exageración para decir que se rió mucho.',
    hint: 'Exageración.',
    locale: 'general',
  },
  {
    id: 'fig-llaves-volaron-3',
    category: 'figurado',
    difficulty: 3,
    prompt: 'Alguien comentó: “Mis llaves volaron”.',
    question: '¿Qué quiso decir probablemente?',
    options: ['Las perdió', 'Las llaves tienen alas', 'Las lanzó a propósito'],
    correctIndex: 0,
    explanation: 'Se usa para expresar que desaparecieron o no sabe dónde están.',
    hint: 'Busca el sentido no literal.',
    locale: 'general',
  },

  // =========================
  // SEMÁNTICA (D1: categorías)
  // =========================
  {
    id: 'sem-frutas-1',
    category: 'semantica',
    difficulty: 1,
    prompt: 'Manzana, plátano, pera…',
    question: '¿Cuál pertenece al mismo grupo?',
    options: ['Naranja', 'Silla', 'Lápiz'],
    correctIndex: 0,
    explanation: 'Naranja también es fruta.',
    hint: 'Categoría: frutas.',
    locale: 'general',
    image: '/interactive/apple.svg',
  },
  {
    id: 'sem-ropa-1',
    category: 'semantica',
    difficulty: 1,
    prompt: 'Polera, pantalón, chaqueta…',
    question: '¿Cuál pertenece al mismo grupo?',
    options: ['Calcetín', 'Tenedor', 'Pelota'],
    correctIndex: 0,
    explanation: 'Calcetín también es ropa.',
    hint: '¿Qué se usa para vestirse?',
    locale: 'general',
  },

  // =========================
  // SEMÁNTICA (D2: sinónimo/antónimo)
  // =========================
  {
    id: 'sem-sinonimo-enorme-2',
    category: 'semantica',
    difficulty: 2,
    prompt: 'Elige el sinónimo más cercano de “enorme”.',
    question: '¿Cuál significa casi lo mismo?',
    options: ['Gigante', 'Rápido', 'Suave'],
    correctIndex: 0,
    explanation: 'Gigante y enorme se refieren a gran tamaño.',
    hint: 'Piensa en tamaño.',
    locale: 'general',
    image: '/interactive/book.svg',
  },
  {
    id: 'sem-antonimo-frio-2',
    category: 'semantica',
    difficulty: 2,
    prompt: 'Elige el antónimo de “frío”.',
    question: '¿Cuál es lo contrario?',
    options: ['Caliente', 'Lento', 'Oscuro'],
    correctIndex: 0,
    explanation: 'Lo contrario de frío es caliente.',
    hint: 'Temperatura.',
    locale: 'general',
  },
  {
    id: 'sem-relacion-parte-todo-2',
    category: 'semantica',
    difficulty: 2,
    prompt: 'Rueda es parte de…',
    question: '¿De qué es parte una rueda?',
    options: ['Auto', 'Nube', 'Cuchara'],
    correctIndex: 0,
    explanation: 'Un auto tiene ruedas.',
    hint: 'Parte–todo.',
    locale: 'general',
  },

  // =========================
  // SEMÁNTICA (D3: analogía simple)
  // =========================
  {
    id: 'sem-analogia-3',
    category: 'semantica',
    difficulty: 3,
    prompt: 'Pájaro es a nido como perro es a…',
    question: '¿Qué completa mejor?',
    options: ['Casa', 'Plato', 'Lapicera'],
    correctIndex: 0,
    explanation: 'Nido es “hogar” del pájaro; casa es “hogar” del perro.',
    hint: 'Piensa en dónde vive.',
    locale: 'general',
  },

  // =========================
  // CHILE opcional (marcado)
  // =========================
  {
    id: 'fig-cl-pega-2',
    category: 'figurado',
    difficulty: 2,
    prompt: 'Dijo: “¡Qué lata!”',
    question: '¿Qué significa más probablemente?',
    options: ['Qué fome/qué paja', 'Qué brillante es el metal', 'Que quiere una lata'],
    correctIndex: 0,
    explanation: 'En Chile, “qué lata” expresa molestia o aburrimiento.',
    hint: 'Uso coloquial, no literal.',
    locale: 'cl',
  },
  {
    id: 'fig-cl-anda-pato-3',
    category: 'figurado',
    difficulty: 3,
    prompt: 'Alguien dijo: “Ando pato”.',
    question: '¿Qué significa más probablemente?',
    options: ['No tiene plata', 'Camina como pato', 'Le gustan los patos'],
    correctIndex: 0,
    explanation: 'En Chile, “andar pato” suele significar estar sin dinero.',
    hint: 'Modismo local.',
    locale: 'cl',
  },
];

// Ítems adicionales iniciales (se mantienen para variedad y cobertura clínica).
const additionalItems: GameItem[] = [
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
    locale: 'general',
  },
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
    locale: 'general',
  },
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
    locale: 'general',
  },
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
    locale: 'general',
  },
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
    locale: 'general',
  },
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
    locale: 'general',
  },
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
    locale: 'general',
  },
];

function mergeUnique(list: GameItem[]): GameItem[] {
  const byId = new Map<string, GameItem>();
  list.forEach(item => {
    const normalized = { locale: 'general', ...item };
    byId.set(normalized.id, normalized);
  });
  return Array.from(byId.values());
}

export const items: GameItem[] = mergeUnique([...seedItems, ...additionalItems]);
