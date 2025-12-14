export const DERBY_AREAS = [
    "Expresión (E)",
    "Comprensión (C)",
    "Interacción (I)"
];

export const DERBY_LEVELS = [
    { value: 0, label: "Nivel 0" },
    { value: 1, label: "Nivel 1" },
    { value: 2, label: "Nivel 2" },
    { value: 3, label: "Nivel 3" },
    { value: 4, label: "Nivel 4" },
    { value: 5, label: "Nivel 5" },
    { value: 6, label: "Nivel 6" },
    { value: 7, label: "Nivel 7" },
    { value: 8, label: "Nivel 8" }
];

// Matrix: [AreaName][LevelValue] = Description
export const DERBY_DESCRIPTIONS = {
    "Expresión (E)": {
        0: "Incapaz de expresar necesidades y no intenta atraer la intención de otros.",
        1: "Incapaz de expresar necesidades, pero evidencia intención por comunicarse.",
        2: "Utiliza comunicación No-Verbal o sonidos para necesidades básicas. Respuestas Sí/No poco confiables.",
        3: "Respuestas Sí/No confiables. Puede expresar conceptos simples (libro, comer).",
        4: "Expresa ideas simples no verbalmente o frases cortas (2-3 elementos). Escribe frases.",
        5: "Expresa ideas complejas usando frases, pero no totalmente inteligibles. Usa comunicación no verbal de apoyo.",
        6: "Expresa ideas abstractas. Pierde fluencia si está cansado/ansioso.",
        7: "Puede expresar elementos de lenguaje figurado (humor) con pérdida de fluencia leve.",
        8: "No se detectan problemas."
    },
    "Comprensión (C)": {
        0: "Baja o ausente capacidad de comprensión.",
        1: "Evidencia comprensión de intención comunicativa, pero no comprende preguntas cerradas Sí/No.",
        2: "Comprende opciones simples con ayuda no verbal. No comprende palabras/símbolos.",
        3: "Comprende algunas preguntas cerradas Sí/No y palabras/símbolos concretos.",
        4: "Comprende ideas simples (palabras aisladas o frases cortas).",
        5: "Comprende ideas que solo pueden ser expresadas en palabras (conceptos abstractos).",
        6: "Comprende conversaciones complejas, puede perderse en la progresión temática.",
        7: "Comprende completamente comunicación compleja con dificultades ocasionales.",
        8: "No se detectan problemas."
    },
    "Interacción (I)": {
        0: "Baja o nula interacción. Conductas inapropiadas.",
        1: "Conciencia/atención hacia otros, pero no interactúa de forma específica.",
        2: "Responde a saludo u otras claves sociales. Se relaciona de forma poco sostenida.",
        3: "Puede interactuar con una persona usando palabras o CNV.",
        4: "Puede interactuar con dos personas consistentemente y participar apropiadamente.",
        5: "Puede interactuar con varias personas pero necesita ayudas para participar efectivamente.",
        6: "Interactúa independiente del número de personas, dificultad en toma de turnos.",
        7: "Sostiene interacciones con cualquier número de personas con leves dificultades.",
        8: "No se detectan problemas en la interacción social."
    }
};
