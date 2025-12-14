/**
 * Calculates the Goal Attainment Scale (GAS) score from a raw rubric score.
 * Based on the provided conversion table:
 * 4-7   -> -2 (Emergente)
 * 8-12  -> -1 (En Desarrollo)
 * 13-16 ->  0 (Adquirido)
 * 17-18 -> +1 (Superado)
 * 19-20 -> +2 (Superado +)
 *
 * @param {number} rawScore - The sum of rubric components (4-20)
 * @returns {number} GAS score (-2 to +2)
 */
export function calculateGAS(rawScore) {
    if (rawScore <= 7) return -2;
    if (rawScore <= 12) return -1;
    if (rawScore <= 16) return 0;
    if (rawScore <= 18) return 1;
    return 2;
}

export const GAS_LABELS = {
    "-2": "Emergente",
    "-1": "En Desarrollo",
    "0": "Adquirido",
    "1": "Superado",
    "2": "Optimo"
};

export const CLINICAL_AREAS = [
    // ASHA FCM Areas
    "Fonético – fonológico (inteligibilidad)",
    "Comprensión de la comunicación aumentativa / alternativa",
    "Producción de la comunicación aumentativa / alternativa",
    "Orientación cognitiva",
    "Pragmática",
    "Alimentación - deglución",
    "Fluidez / tasa / ritmo",
    "Lenguaje expresivo",
    "Lenguaje comprensivo",
    "Producción de la voz",

    // Additional Areas
    "Juego",
    "Habilidades Sociales",
    "Habilidades de Discurso",
    "Funciones Cognitivas"
];

export const RUBRIC_DIMENSIONS = [
    {
        id: 'quantitative',
        label: 'Medida Cuantitativa',
        description: 'Proporción de logro según metas establecidas (0-100%)',
        levels: [
            { val: 0, text: 'No logra realizar la habilidad (<25%)' },
            { val: 1, text: 'Inicia la habilidad (<25%)' },
            { val: 2, text: 'Habilidad efectiva en 26-50%' },
            { val: 3, text: 'Habilidad efectiva en 51-75%' },
            { val: 4, text: 'Habilidad efectiva en 76-100%' },
            { val: 5, text: 'Habilidad efectiva >100%' }
        ]
    },
    {
        id: 'qualitative',
        label: 'Medida Cualitativa',
        description: 'Calidad de la ejecución y conciencia del error',
        levels: [
            { val: 0, text: 'Muestra precursores' },
            { val: 1, text: 'Habilidad inmadura / Sin conciencia' },
            { val: 2, text: 'Habilidad emergente / Conciencia básica' },
            { val: 3, text: 'En desarrollo / Inconsistente' },
            { val: 4, text: 'Consolidada / Errores ocasionales' },
            { val: 5, text: 'Consolidada / Sin errores' }
        ]
    },
    {
        id: 'support',
        label: 'Nivel de Apoyos',
        description: 'Dependencia de ayudas (verbales, visuales, físicas)',
        levels: [
            { val: 0, text: 'Apoyo total / No suficiente' },
            { val: 1, text: 'Apoyo total / Múltiples apoyos' },
            { val: 2, text: 'Múltiples apoyos (visual + verbal)' },
            { val: 3, text: 'Un solo tipo de apoyo' },
            { val: 4, text: 'Ayudas similares a pares' },
            { val: 5, text: 'Sin apoyos / Independiente' }
        ]
    },
    {
        id: 'ecology',
        label: 'Ecologicidad',
        description: 'Contexto y generalización de la habilidad',
        levels: [
            { val: 0, text: 'No se observa dependencia clara' },
            { val: 1, text: 'Un lugar, una persona (Terapia)' },
            { val: 2, text: 'Un lugar, varias personas' },
            { val: 3, text: 'Dos lugares estructurados' },
            { val: 4, text: 'Uso espontáneo no estructurado' },
            { val: 5, text: 'Uso espontáneo universal' }
        ]
    }
];
