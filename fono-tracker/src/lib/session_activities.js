/**
 * ACTIVIDADES PREDEFINIDAS PARA SESIONES
 * 
 * Lista de actividades comunes en terapia fonoaudiológica
 */

export const PREDEFINED_ACTIVITIES = [
    {
        id: 'ejercicios_articulatorios',
        label: 'Ejercicios articulatorios',
        category: 'Fonético-Fonológico',
        icon: '🗣️'
    },
    {
        id: 'praxias_orofaciales',
        label: 'Praxias orofaciales',
        category: 'Fonético-Fonológico',
        icon: '😛'
    },
    {
        id: 'ejercicios_soplo',
        label: 'Ejercicios de soplo',
        category: 'Fonético-Fonológico',
        icon: '💨'
    },
    {
        id: 'conciencia_fonologica',
        label: 'Actividades de conciencia fonológica',
        category: 'Fonético-Fonológico',
        icon: '🔤'
    },
    {
        id: 'vocabulario_tematico',
        label: 'Vocabulario temático',
        category: 'Lenguaje',
        icon: '📚'
    },
    {
        id: 'construccion_oraciones',
        label: 'Construcción de oraciones',
        category: 'Lenguaje',
        icon: '✍️'
    },
    {
        id: 'comprension_lectora',
        label: 'Comprensión lectora',
        category: 'Lenguaje',
        icon: '📖'
    },
    {
        id: 'lectura_cuentos',
        label: 'Lectura de cuentos',
        category: 'Lenguaje',
        icon: '📕'
    },
    {
        id: 'conversacion_dirigida',
        label: 'Conversación dirigida',
        category: 'Pragmática',
        icon: '💬'
    },
    {
        id: 'juego_simbolico',
        label: 'Juego simbólico',
        category: 'Pragmática',
        icon: '🎭'
    },
    {
        id: 'habilidades_sociales',
        label: 'Habilidades sociales',
        category: 'Pragmática',
        icon: '🤝'
    },
    {
        id: 'turnos_conversacionales',
        label: 'Turnos conversacionales',
        category: 'Pragmática',
        icon: '🔄'
    },
    {
        id: 'ejercicios_voz',
        label: 'Ejercicios de voz',
        category: 'Voz',
        icon: '🎤'
    },
    {
        id: 'relajacion',
        label: 'Técnicas de relajación',
        category: 'Voz',
        icon: '🧘'
    },
    {
        id: 'ejercicios_deglucion',
        label: 'Ejercicios de deglución',
        category: 'Deglución',
        icon: '🥤'
    },
    {
        id: 'texturas_alimentos',
        label: 'Trabajo con texturas de alimentos',
        category: 'Deglución',
        icon: '🍽️'
    },
    {
        id: 'fluidez',
        label: 'Ejercicios de fluidez',
        category: 'Fluidez',
        icon: '🌊'
    },
    {
        id: 'ritmo_prosodia',
        label: 'Ritmo y prosodia',
        category: 'Fluidez',
        icon: '🎵'
    },
    {
        id: 'memoria_trabajo',
        label: 'Memoria de trabajo',
        category: 'Cognitivo',
        icon: '🧠'
    },
    {
        id: 'atencion_concentracion',
        label: 'Atención y concentración',
        category: 'Cognitivo',
        icon: '🎯'
    },
    {
        id: 'funciones_ejecutivas',
        label: 'Funciones ejecutivas',
        category: 'Cognitivo',
        icon: '⚙️'
    },
    {
        id: 'escritura',
        label: 'Actividades de escritura',
        category: 'Lectoescritura',
        icon: '✏️'
    },
    {
        id: 'lectura',
        label: 'Actividades de lectura',
        category: 'Lectoescritura',
        icon: '📰'
    },
    {
        id: 'otro',
        label: 'Otra actividad (especificar)',
        category: 'Otro',
        icon: '➕'
    }
];

export const SESSION_TYPES = [
    { value: 'evaluacion', label: 'Evaluación' },
    { value: 'terapia', label: 'Terapia' },
    { value: 'control', label: 'Control' },
    { value: 'reunion_familia', label: 'Reunión con familia' },
    { value: 'otro', label: 'Otro' }
];

export const PERFORMANCE_LEVELS = [
    { value: 1, label: 'Muy bajo', emoji: '😟', color: 'red' },
    { value: 2, label: 'Bajo', emoji: '😕', color: 'orange' },
    { value: 3, label: 'Moderado', emoji: '😐', color: 'yellow' },
    { value: 4, label: 'Bueno', emoji: '🙂', color: 'lime' },
    { value: 5, label: 'Excelente', emoji: '😊', color: 'green' }
];

export const COLLABORATION_LEVELS = [
    { value: 1, label: 'Nula', description: 'Rechaza participar' },
    { value: 2, label: 'Baja', description: 'Participa con resistencia' },
    { value: 3, label: 'Moderada', description: 'Participa con apoyo' },
    { value: 4, label: 'Buena', description: 'Participa voluntariamente' },
    { value: 5, label: 'Excelente', description: 'Participa activamente y con entusiasmo' }
];

export const ATTENTION_LEVELS = [
    { value: 1, label: 'Muy disperso', description: 'No mantiene atención' },
    { value: 2, label: 'Disperso', description: 'Atención muy breve' },
    { value: 3, label: 'Variable', description: 'Atención intermitente' },
    { value: 4, label: 'Buena', description: 'Mantiene atención con apoyo' },
    { value: 5, label: 'Excelente', description: 'Atención sostenida' }
];
