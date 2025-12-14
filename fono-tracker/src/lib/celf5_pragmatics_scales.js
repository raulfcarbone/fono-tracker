
export const PRAGMATICS_LEVELS = [
    { value: 1, label: "1 - Nunca o casi nunca (<10%)", description: "Nunca o casi nunca (en el 10% o menos de los casos)" },
    { value: 2, label: "2 - A veces (25%)", description: "A veces (en el 25% de los casos)" },
    { value: 3, label: "3 - A menudo (75%)", description: "A menudo (en el 75% de los casos)" },
    { value: 4, label: "4 - Siempre o casi siempre (>90%)", description: "Siempre o casi siempre (en el 90% o más de los casos)" }
];

export const PRAGMATICS_SECTIONS = [
    {
        id: 'rituales',
        title: "Rituales y habilidades conversacionales",
        description: "El sujeto muestra un uso culturalmente apropiado del lenguaje cuando:",
        items: [
            { id: 1, text: "Saluda a alguien/responde al saludo de alguien." },
            { id: 2, text: "Empieza/termina una conversación (cara a cara, por teléfono, etc)." },
            { id: 3, text: "Respeta los turnos de palabra en clase o en interacciones sociales." },
            { id: 4, text: "Mantiene el contacto visual/mira atentamente." },
            { id: 5, text: "Introduce temas de conversación adecuados o relevantes." },
            { id: 6, text: "Contribuye al mantenimiento de un tema mediante recursos habituales (p. ej., asintiendo con la cabeza, diciendo «ajá...»)." },
            { id: 7, text: "Hace contribuciones relevantes sobre un tema durante una conversación." },
            { id: 8, text: "Evita usar información repetitiva/redundante." },
            { id: 9, text: "Pide aclaraciones/responde a las peticiones de aclaración durante las conversaciones." },
            { id: 10, text: "Adapta o modifica el lenguaje en función de la situación comunicativa (interlocutores, tema, lugar)." },
            { id: 11, text: "Cuenta/entiende chistes o anécdotas relacionados con la situación." },
            { id: 12, text: "Muestra sentido del humor durante las situaciones comunicativas." },
            { id: 13, text: "Se incorpora a/se retira de una interacción comunicativa existente." },
            { id: 14, text: "Interactúa en actividades en grupo estructuradas." },
            { id: 15, text: "Interactúa en actividades de grupo no estructuradas." },
            { id: 16, text: "Responde cuando le presentan a otras personas/presenta a otras personas." },
            { id: 17, text: "Usa estrategias para captar/mantener la atención." },
            { id: 18, text: "Usa estrategias cuando lo interrumpen/para interrumpir a los demás." }
        ]
    },
    {
        id: 'informacion',
        title: "Pide información, la da y responde a ella",
        description: "El sujeto muestra un uso culturalmente apropiado del lenguaje cuando:",
        items: [
            { id: 19, text: "Da/pide indicaciones." },
            { id: 20, text: "Dice/pregunta la hora de los acontecimientos." },
            { id: 21, text: "Da/pregunta las razones y causas de acciones, circunstancias o decisiones." },
            { id: 22, text: "Pide/ofrece ayuda a los demás." },
            { id: 23, text: "Da consejos o hace sugerencias/responde a los consejos o sugerencias." },
            { id: 24, text: "Pide permiso a los demás cuando es necesario." },
            { id: 25, text: "Muestra acuerdo/desacuerdo." },
            { id: 26, text: "Pide que se le aclare algo cuando está confuso o la situación no es clara." },
            { id: 27, text: "Acepta/rechaza invitaciones." },
            { id: 28, text: "Inicia/responde a negociaciones no verbales." },
            { id: 29, text: "Recuerda algo a los demás/responde cuando alguien le recuerda algo." },
            { id: 30, text: "Pide a los demás que cambien su comportamiento (p. ej., por favor, muévete...) / responde cuando alguien le pide que cambie." },
            { id: 31, text: "Se disculpa/acepta disculpas." },
            { id: 32, text: "Reacciona a las burlas, la ira, el fracaso, la decepción." },
            { id: 33, text: "Expresa afecto/responde a las expresiones de afecto." },
            { id: 34, text: "Sabe cómo se siente alguien a partir de señales no verbales." },
            { id: 35, text: "Interpreta la situación social correctamente y se comporta en función de ella." },
            { id: 36, text: "Entiende las reglas establecidas o implícitas en la escuela o grupo." }
        ]
    },
    {
        id: 'no_verbal_receptive',
        title: "Habilidades de comunicación no verbal (Comprensión)",
        description: "El sujeto lee e interpreta con exactitud los mensajes no verbales siguientes:",
        items: [
            { id: 37, text: "Las expresiones faciales." },
            { id: 38, text: "El saludo de alguien a otra persona/la respuesta de alguien al saludo de otra persona." },
            { id: 39, text: "La despedida de alguien a otra persona/la respuesta de alguien a la despedida de otra persona." },
            { id: 40, text: "El inicio/fin de una conversación." },
            { id: 41, text: "El tono de voz." }
        ]
    },
    {
        id: 'no_verbal_expressive',
        title: "Habilidades de comunicación no verbal (Expresión)",
        description: "El sujeto muestra un uso culturalmente apropiado de los recursos no verbales siguientes:",
        items: [
            { id: 42, text: "Las expresiones faciales." },
            { id: 43, text: "El lenguaje corporal o los gestos." },
            { id: 44, text: "La entonación de la voz (inflexiones, tono o cadencia)." },
            { id: 45, text: "La expresión de mensajes mediante gestos o expresiones faciales." },
            { id: 46, text: "Los gestos o expresiones faciales según la situación." },
            { id: 47, text: "La regulación de la distancia corporal (sentado/de pie) según la situación." },
            { id: 48, text: "Los gestos o expresiones faciales acordes con los mensajes verbales." }
        ]
    }
];

// Helper to calculate score
export const getPragmaticsStats = (data) => {
    let total = 0;
    let count = 0;

    // Breakdowns
    let ritualsScore = 0; // 1-18
    let infoScore = 0;    // 19-36
    let nonVerbalScore = 0; // 37-48

    PRAGMATICS_SECTIONS.forEach(section => {
        section.items.forEach(item => {
            const val = data[item.id];
            const score = (val && typeof val === 'object') ? val.score : val;

            if (typeof score === 'number') {
                total += score;
                count++;

                if (item.id >= 1 && item.id <= 18) ritualsScore += score;
                else if (item.id >= 19 && item.id <= 36) infoScore += score;
                else if (item.id >= 37 && item.id <= 48) nonVerbalScore += score;
            }
        });
    });

    const category =
        total >= 150 ? "Adecuado" :
            total >= 100 ? "Límite" : "Déficit"; // Dummy ranges, just for validation

    return {
        total,
        count,
        totalItems: 48,
        maxPossible: 48 * 4,
        breakdown: {
            rituals: ritualsScore,
            information: infoScore,
            non_verbal: nonVerbalScore
        },
        category
    };
};
