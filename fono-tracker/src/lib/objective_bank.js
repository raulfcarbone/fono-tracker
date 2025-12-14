/**
 * BANCO DE OBJETIVOS TERAPÉUTICOS
 * 
 * Biblioteca completa de objetivos predefinidos organizados por área clínica,
 * edad, diagnóstico y tipo. Basado en práctica fonoaudiológica chilena.
 */

export const OBJECTIVE_BANK = {
    areas: [
        {
            id: "fonetico_fonologico",
            name: "Fonético – fonológico (inteligibilidad)",
            objectives: [
                // ARTICULACIÓN - PREESCOLAR
                {
                    id: "obj_ff_001",
                    text: "El paciente producirá el fonema /r/ en posición inicial de palabra con 80% de precisión en 3 sesiones consecutivas",
                    ageRange: "3-5 años",
                    ageGroup: "preescolar",
                    type: "articulacion",
                    diagnoses: ["TEL", "Trastorno Fonológico", "Retraso del Lenguaje"],
                    baseline: "Emergente",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas con palabras /r/ inicial", "Espejo", "Grabadora"],
                    strategies: ["Modelado", "Imitación", "Feedback visual", "Punto articulatorio"],
                    tags: ["fonema", "r", "inicial", "vibrante"]
                },
                {
                    id: "obj_ff_002",
                    text: "El paciente producirá el fonema /rr/ en palabras bisílabas con apoyo visual en 70% de intentos",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "articulacion",
                    diagnoses: ["TEL", "Trastorno Fonológico"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia"],
                    materials: ["Láminas /rr/", "Espejo", "Depresor"],
                    strategies: ["Vibración asistida", "Onomatopeyas", "Feedback táctil"],
                    tags: ["fonema", "rr", "vibrante múltiple"]
                },
                {
                    id: "obj_ff_003",
                    text: "El paciente producirá el fonema /s/ en posición inicial, media y final de palabra con 90% de precisión",
                    ageRange: "3-5 años",
                    ageGroup: "preescolar",
                    type: "articulacion",
                    diagnoses: ["TEL", "Trastorno Fonológico", "Sigmatismo"],
                    baseline: "En Desarrollo",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa", "Colegio"],
                    materials: ["Láminas /s/", "Espejo", "Pluma", "Vela"],
                    strategies: ["Feedback visual del soplo", "Punto articulatorio", "Discriminación auditiva"],
                    tags: ["fonema", "s", "fricativa"]
                },
                {
                    id: "obj_ff_004",
                    text: "El paciente producirá grupos consonánticos /pl/, /bl/, /fl/ en palabras con 75% de precisión",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "articulacion",
                    diagnoses: ["TEL", "Trastorno Fonológico"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas grupos /l/", "Tarjetas de palabras"],
                    strategies: ["Segmentación silábica", "Producción lenta", "Modelado"],
                    tags: ["grupos consonánticos", "lateral", "pl", "bl", "fl"]
                },
                {
                    id: "obj_ff_005",
                    text: "El paciente producirá grupos consonánticos /pr/, /br/, /fr/ en palabras con 75% de precisión",
                    ageRange: "5-7 años",
                    ageGroup: "escolar",
                    type: "articulacion",
                    diagnoses: ["TEL", "Trastorno Fonológico"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas grupos /r/", "Juegos de palabras"],
                    strategies: ["Producción lenta", "Facilitación fonética", "Bombardeo auditivo"],
                    tags: ["grupos consonánticos", "vibrante", "pr", "br", "fr"]
                },
                {
                    id: "obj_ff_006",
                    text: "El paciente producirá diptongos crecientes (ia, ie, io, ua, ue, uo) con 80% de precisión",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "articulacion",
                    diagnoses: ["TEL", "Trastorno Fonológico"],
                    baseline: "En Desarrollo",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas de diptongos", "Canciones"],
                    strategies: ["Exageración prosódica", "Modelado", "Repetición"],
                    tags: ["diptongos", "vocales"]
                },
                // FONOLOGÍA - PREESCOLAR
                {
                    id: "obj_ff_007",
                    text: "El paciente eliminará el proceso de simplificación de sustitución de líquidas (/l/ por /r/) en 80% de palabras",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "fonologia",
                    diagnoses: ["Trastorno Fonológico", "TEL"],
                    baseline: "Emergente",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Pares mínimos /l/-/r/", "Láminas contrastivas"],
                    strategies: ["Discriminación auditiva", "Pares mínimos", "Bombardeo auditivo"],
                    tags: ["proceso fonológico", "sustitución", "líquidas"]
                },
                {
                    id: "obj_ff_008",
                    text: "El paciente eliminará el proceso de omisión de consonante final en 90% de palabras",
                    ageRange: "3-5 años",
                    ageGroup: "preescolar",
                    type: "fonologia",
                    diagnoses: ["Trastorno Fonológico", "TEL"],
                    baseline: "Emergente",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas CVC", "Tarjetas de palabras"],
                    strategies: ["Énfasis en posición final", "Segmentación", "Feedback visual"],
                    tags: ["proceso fonológico", "omisión", "consonante final"]
                },
                {
                    id: "obj_ff_009",
                    text: "El paciente eliminará el proceso de reducción de grupos consonánticos en 75% de palabras",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "fonologia",
                    diagnoses: ["Trastorno Fonológico"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia"],
                    materials: ["Láminas de grupos consonánticos", "Juegos"],
                    strategies: ["Producción lenta", "Segmentación", "Modelado"],
                    tags: ["proceso fonológico", "reducción", "grupos"]
                },
                // INTELIGIBILIDAD
                {
                    id: "obj_ff_010",
                    text: "El paciente aumentará su inteligibilidad global al 70% en conversación espontánea",
                    ageRange: "3-5 años",
                    ageGroup: "preescolar",
                    type: "inteligibilidad",
                    diagnoses: ["TEL", "Trastorno Fonológico", "Disartria"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa", "Colegio"],
                    materials: ["Temas de conversación", "Juegos interactivos"],
                    strategies: ["Reformulación", "Expansión", "Modelado"],
                    tags: ["inteligibilidad", "conversación"]
                },
                {
                    id: "obj_ff_011",
                    text: "El paciente será comprendido por personas no familiares en 80% de sus emisiones",
                    ageRange: "5-7 años",
                    ageGroup: "escolar",
                    type: "inteligibilidad",
                    diagnoses: ["TEL", "Trastorno Fonológico"],
                    baseline: "En Desarrollo",
                    target: "Dominado",
                    contexts: ["Colegio", "Comunidad"],
                    materials: ["Situaciones comunicativas reales"],
                    strategies: ["Generalización", "Automonitoreo", "Feedback"],
                    tags: ["inteligibilidad", "generalización"]
                }
            ]
        },
        {
            id: "lenguaje_expresivo",
            name: "Lenguaje expresivo",
            objectives: [
                // VOCABULARIO - PREESCOLAR TEMPRANO
                {
                    id: "obj_le_001",
                    text: "El paciente utilizará un vocabulario de 50 palabras funcionales en contextos naturales",
                    ageRange: "2-3 años",
                    ageGroup: "preescolar",
                    type: "vocabulario",
                    diagnoses: ["Retraso del Lenguaje", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Casa", "Terapia"],
                    materials: ["Objetos reales", "Rutinas diarias"],
                    strategies: ["Modelado en contexto", "Expansión", "Rutinas"],
                    tags: ["vocabulario", "palabras funcionales"]
                },
                {
                    id: "obj_le_002",
                    text: "El paciente nombrará 10 objetos cotidianos (alimentos, ropa, juguetes) con apoyo visual",
                    ageRange: "2-3 años",
                    ageGroup: "preescolar",
                    type: "vocabulario",
                    diagnoses: ["Retraso del Lenguaje", "TEL", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas de objetos", "Objetos reales", "Libros"],
                    strategies: ["Denominación", "Modelado", "Repetición"],
                    tags: ["vocabulario", "sustantivos", "objetos"]
                },
                {
                    id: "obj_le_003",
                    text: "El paciente nombrará 10 animales comunes con apoyo visual",
                    ageRange: "2-4 años",
                    ageGroup: "preescolar",
                    type: "vocabulario",
                    diagnoses: ["Retraso del Lenguaje", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas de animales", "Libros", "Videos"],
                    strategies: ["Denominación", "Onomatopeyas", "Juego simbólico"],
                    tags: ["vocabulario", "animales", "categorías semánticas"]
                },
                {
                    id: "obj_le_004",
                    text: "El paciente nombrará 5 acciones básicas (comer, dormir, jugar, correr, saltar)",
                    ageRange: "2-3 años",
                    ageGroup: "preescolar",
                    type: "vocabulario",
                    diagnoses: ["Retraso del Lenguaje", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas de acciones", "Videos", "Dramatización"],
                    strategies: ["Modelado en acción", "Imitación", "Juego"],
                    tags: ["vocabulario", "verbos", "acciones"]
                },
                // MORFOSINTAXIS - PREESCOLAR
                {
                    id: "obj_le_005",
                    text: "El paciente producirá enunciados de 2 palabras (sustantivo + verbo) en 80% de ocasiones comunicativas",
                    ageRange: "2-3 años",
                    ageGroup: "preescolar",
                    type: "morfosintaxis",
                    diagnoses: ["Retraso del Lenguaje", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Situaciones comunicativas", "Juegos"],
                    strategies: ["Modelado", "Expansión", "Reformulación"],
                    tags: ["morfosintaxis", "combinaciones", "2 palabras"]
                },
                {
                    id: "obj_le_006",
                    text: "El paciente producirá enunciados de 3 palabras (sujeto + verbo + objeto) en 70% de ocasiones",
                    ageRange: "2.5-4 años",
                    ageGroup: "preescolar",
                    type: "morfosintaxis",
                    diagnoses: ["TEL", "Retraso del Lenguaje"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas de acciones", "Juegos de roles"],
                    strategies: ["Modelado", "Cloze", "Expansión"],
                    tags: ["morfosintaxis", "oraciones simples", "SVO"]
                },
                {
                    id: "obj_le_007",
                    text: "El paciente utilizará artículos definidos (el, la, los, las) correctamente en 75% de ocasiones",
                    ageRange: "3-5 años",
                    ageGroup: "preescolar",
                    type: "morfosintaxis",
                    diagnoses: ["TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas", "Objetos reales"],
                    strategies: ["Modelado", "Bombardeo auditivo", "Cloze"],
                    tags: ["morfosintaxis", "artículos", "determinantes"]
                },
                {
                    id: "obj_le_008",
                    text: "El paciente utilizará plurales regulares (-s, -es) en 80% de ocasiones",
                    ageRange: "3-5 años",
                    ageGroup: "preescolar",
                    type: "morfosintaxis",
                    diagnoses: ["TEL"],
                    baseline: "Emergente",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas con singular/plural", "Objetos"],
                    strategies: ["Contraste singular/plural", "Modelado", "Juegos"],
                    tags: ["morfosintaxis", "plurales", "morfemas"]
                },
                {
                    id: "obj_le_009",
                    text: "El paciente utilizará verbos en tiempo presente correctamente en 85% de ocasiones",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "morfosintaxis",
                    diagnoses: ["TEL"],
                    baseline: "En Desarrollo",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa", "Colegio"],
                    materials: ["Láminas de acciones", "Rutinas"],
                    strategies: ["Modelado", "Reformulación", "Narración"],
                    tags: ["morfosintaxis", "verbos", "presente"]
                },
                {
                    id: "obj_le_010",
                    text: "El paciente utilizará preposiciones de lugar (en, sobre, bajo, detrás, delante) correctamente en 80% de ocasiones",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "morfosintaxis",
                    diagnoses: ["TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Objetos", "Láminas", "Juegos de ubicación"],
                    strategies: ["Manipulación de objetos", "Seguimiento de instrucciones", "Descripción"],
                    tags: ["morfosintaxis", "preposiciones", "espacio"]
                },
                // NARRATIVA
                {
                    id: "obj_le_011",
                    text: "El paciente describirá una imagen con al menos 3 oraciones relacionadas",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "narrativa",
                    diagnoses: ["TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio"],
                    materials: ["Láminas temáticas", "Escenas"],
                    strategies: ["Preguntas guía", "Modelado", "Organizadores visuales"],
                    tags: ["narrativa", "descripción", "discurso"]
                },
                {
                    id: "obj_le_012",
                    text: "El paciente relatará una experiencia personal con secuencia lógica (inicio-desarrollo-final)",
                    ageRange: "5-7 años",
                    ageGroup: "escolar",
                    type: "narrativa",
                    diagnoses: ["TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio"],
                    materials: ["Organizadores gráficos", "Líneas de tiempo"],
                    strategies: ["Preguntas WH", "Organizadores visuales", "Modelado"],
                    tags: ["narrativa", "experiencia personal", "secuencia"]
                }
            ]
        },
        {
            id: "lenguaje_comprensivo",
            name: "Lenguaje comprensivo",
            objectives: [
                {
                    id: "obj_lc_001",
                    text: "El paciente identificará 20 objetos cotidianos al ser nombrados",
                    ageRange: "2-3 años",
                    ageGroup: "preescolar",
                    type: "vocabulario_receptivo",
                    diagnoses: ["Retraso del Lenguaje", "TEL", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Objetos reales", "Láminas"],
                    strategies: ["Denominación receptiva", "Asociación", "Repetición"],
                    tags: ["comprensión", "vocabulario", "objetos"]
                },
                {
                    id: "obj_lc_002",
                    text: "El paciente seguirá instrucciones simples de 1 paso (dame, toma, ven) en 90% de ocasiones",
                    ageRange: "2-3 años",
                    ageGroup: "preescolar",
                    type: "seguimiento_instrucciones",
                    diagnoses: ["Retraso del Lenguaje", "TEL", "TEA"],
                    baseline: "Emergente",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Objetos cotidianos", "Rutinas"],
                    strategies: ["Instrucciones claras", "Modelado", "Refuerzo"],
                    tags: ["comprensión", "instrucciones", "1 paso"]
                },
                {
                    id: "obj_lc_003",
                    text: "El paciente seguirá instrucciones de 2 pasos relacionados (toma el lápiz y dibuja) en 80% de ocasiones",
                    ageRange: "3-5 años",
                    ageGroup: "preescolar",
                    type: "seguimiento_instrucciones",
                    diagnoses: ["TEL", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa", "Colegio"],
                    materials: ["Materiales escolares", "Juegos"],
                    strategies: ["Segmentación", "Repetición", "Apoyo visual"],
                    tags: ["comprensión", "instrucciones", "2 pasos"]
                },
                {
                    id: "obj_lc_004",
                    text: "El paciente comprenderá preposiciones de lugar (en, sobre, bajo, detrás) en 85% de ocasiones",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "morfosintaxis_receptiva",
                    diagnoses: ["TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Objetos", "Láminas", "Cajas"],
                    strategies: ["Manipulación", "Seguimiento de instrucciones", "Juegos"],
                    tags: ["comprensión", "preposiciones", "espacio"]
                },
                {
                    id: "obj_lc_005",
                    text: "El paciente responderá a preguntas literales sobre un cuento escuchado (quién, qué, dónde) en 85% de ocasiones",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "comprension_narrativa",
                    diagnoses: ["TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio"],
                    materials: ["Cuentos ilustrados", "Videos"],
                    strategies: ["Lectura compartida", "Preguntas durante lectura", "Apoyo visual"],
                    tags: ["comprensión", "narrativa", "preguntas literales"]
                }
            ]
        },
        {
            id: "pragmatica",
            name: "Pragmática",
            objectives: [
                {
                    id: "obj_pr_001",
                    text: "El paciente utilizará la comunicación para rechazar/negar en 90% de ocasiones necesarias",
                    ageRange: "2-4 años",
                    ageGroup: "preescolar",
                    type: "funciones_comunicativas",
                    diagnoses: ["TEL", "TEA", "Retraso del Lenguaje"],
                    baseline: "Emergente",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Situaciones naturales", "Objetos no preferidos"],
                    strategies: ["Modelado", "Espera estructurada", "Refuerzo"],
                    tags: ["pragmática", "rechazo", "funciones"]
                },
                {
                    id: "obj_pr_002",
                    text: "El paciente utilizará la comunicación para pedir objetos deseados en 85% de ocasiones",
                    ageRange: "2-4 años",
                    ageGroup: "preescolar",
                    type: "funciones_comunicativas",
                    diagnoses: ["TEL", "TEA", "Retraso del Lenguaje"],
                    baseline: "Emergente",
                    target: "Dominado",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Objetos preferidos", "Situaciones motivantes"],
                    strategies: ["Espera estructurada", "Modelado", "Tentación comunicativa"],
                    tags: ["pragmática", "petición", "funciones"]
                },
                {
                    id: "obj_pr_003",
                    text: "El paciente iniciará interacciones comunicativas con pares en 60% de oportunidades",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "interaccion_social",
                    diagnoses: ["TEL", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia grupal"],
                    materials: ["Juegos cooperativos", "Actividades grupales"],
                    strategies: ["Guiones sociales", "Modelado", "Refuerzo social"],
                    tags: ["pragmática", "iniciación", "pares"]
                },
                {
                    id: "obj_pr_004",
                    text: "El paciente mantendrá un tópico conversacional por 3-4 turnos",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "conversacion",
                    diagnoses: ["TEL", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Temas de interés", "Apoyos visuales"],
                    strategies: ["Preguntas relacionadas", "Expansión", "Apoyo visual del tópico"],
                    tags: ["pragmática", "conversación", "turnos"]
                },
                {
                    id: "obj_pr_005",
                    text: "El paciente identificará emociones básicas (alegría, tristeza, enojo, miedo) en rostros",
                    ageRange: "3-5 años",
                    ageGroup: "preescolar",
                    type: "teoria_mente",
                    diagnoses: ["TEA", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Láminas de emociones", "Espejo", "Cuentos"],
                    strategies: ["Modelado facial", "Historias sociales", "Juego de roles"],
                    tags: ["pragmática", "emociones", "teoría de la mente"]
                }
            ]
        },
        {
            id: "alimentacion_deglucion",
            name: "Alimentación - deglución",
            objectives: [
                {
                    id: "obj_ad_001",
                    text: "El paciente logrará un patrón de succión nutritiva eficiente (10-30 succiones por minuto)",
                    ageRange: "0-12 meses",
                    ageGroup: "lactante",
                    type: "succion",
                    diagnoses: ["Prematurez", "Síndrome de Down", "Fisura labiopalatina"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Hospital", "Casa"],
                    materials: ["Biberón", "Tetinas especiales"],
                    strategies: ["Estimulación oral", "Posicionamiento", "Ritmo succión-deglución"],
                    tags: ["deglución", "succión", "lactante"]
                },
                {
                    id: "obj_ad_002",
                    text: "El paciente masticará alimentos de textura blanda (plátano, pan) con patrón rotatorio en 80% de ocasiones",
                    ageRange: "1-3 años",
                    ageGroup: "preescolar",
                    type: "masticacion",
                    diagnoses: ["Dificultades alimentarias", "Síndrome de Down"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Casa", "Terapia"],
                    materials: ["Alimentos blandos", "Espejo"],
                    strategies: ["Modelado", "Facilitación manual", "Refuerzo"],
                    tags: ["deglución", "masticación", "texturas"]
                },
                {
                    id: "obj_ad_003",
                    text: "El paciente eliminará el patrón de deglución atípica (interposición lingual) en 75% de degluciones",
                    ageRange: "5-10 años",
                    ageGroup: "escolar",
                    type: "deglucion_atipica",
                    diagnoses: ["Deglución atípica", "Maloclusión"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Espejo", "Alimentos", "Ejercicios miofuncionales"],
                    strategies: ["Reeducación miofuncional", "Feedback visual", "Ejercicios"],
                    tags: ["deglución", "atípica", "miofuncional"]
                }
            ]
        },
        {
            id: "fluidez",
            name: "Fluidez / tasa / ritmo",
            objectives: [
                {
                    id: "obj_fl_001",
                    text: "El paciente reducirá la frecuencia de disfluencias atípicas (bloqueos, prolongaciones) a menos de 1% de sílabas",
                    ageRange: "4-8 años",
                    ageGroup: "escolar",
                    type: "tartamudez",
                    diagnoses: ["Tartamudez"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa", "Colegio"],
                    materials: ["Grabadora", "Espejo", "Juegos"],
                    strategies: ["Habla suave", "Habla enlazada", "Modificación de tartamudez"],
                    tags: ["fluidez", "tartamudez", "disfluencias"]
                },
                {
                    id: "obj_fl_002",
                    text: "El paciente utilizará habla suave (easy onset) en palabras que inician con vocal en 70% de ocasiones",
                    ageRange: "4-10 años",
                    ageGroup: "escolar",
                    type: "tartamudez",
                    diagnoses: ["Tartamudez"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Lista de palabras", "Grabadora"],
                    strategies: ["Modelado", "Práctica", "Feedback auditivo"],
                    tags: ["fluidez", "easy onset", "técnicas"]
                },
                {
                    id: "obj_fl_003",
                    text: "El paciente reducirá su tasa de habla a 150-180 palabras por minuto en conversación",
                    ageRange: "6-12 años",
                    ageGroup: "escolar",
                    type: "taquilalia",
                    diagnoses: ["Taquilalia"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio"],
                    materials: ["Cronómetro", "Grabadora", "Textos"],
                    strategies: ["Automonitoreo", "Pausas", "Feedback visual"],
                    tags: ["fluidez", "taquilalia", "velocidad"]
                }
            ]
        },
        {
            id: "voz",
            name: "Producción de la voz",
            objectives: [
                {
                    id: "obj_vz_001",
                    text: "El paciente reducirá comportamientos de abuso vocal (gritar, carraspear) en 80% de situaciones",
                    ageRange: "5-12 años",
                    ageGroup: "escolar",
                    type: "higiene_vocal",
                    diagnoses: ["Disfonía infantil", "Nódulos vocales"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Casa", "Terapia"],
                    materials: ["Registro de conductas", "Señales visuales"],
                    strategies: ["Psicoeducación", "Automonitoreo", "Alternativas"],
                    tags: ["voz", "higiene vocal", "abuso"]
                },
                {
                    id: "obj_vz_002",
                    text: "El paciente utilizará respiración costodiafragmática durante el habla en 70% de emisiones",
                    ageRange: "8-16 años",
                    ageGroup: "escolar",
                    type: "respiracion",
                    diagnoses: ["Disfonía", "Trastorno de voz"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Espejo", "Vela", "Pluma"],
                    strategies: ["Ejercicios respiratorios", "Feedback táctil", "Práctica"],
                    tags: ["voz", "respiración", "apoyo respiratorio"]
                },
                {
                    id: "obj_vz_003",
                    text: "El paciente producirá voz con calidad vocal mejorada (reducción de ronquera) según escala GRBAS",
                    ageRange: "Todas",
                    ageGroup: "todas",
                    type: "calidad_vocal",
                    diagnoses: ["Disfonía", "Nódulos", "Pólipos"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia"],
                    materials: ["Grabadora", "Escala GRBAS"],
                    strategies: ["Técnicas de voz resonante", "Eliminación de hiperfunción", "Feedback auditivo"],
                    tags: ["voz", "calidad", "GRBAS"]
                }
            ]
        },
        {
            id: "juego",
            name: "Juego",
            objectives: [
                {
                    id: "obj_jg_001",
                    text: "El paciente realizará juego funcional con objetos reales (peinarse con peine, beber de taza)",
                    ageRange: "12-18 meses",
                    ageGroup: "preescolar",
                    type: "juego_funcional",
                    diagnoses: ["Retraso del desarrollo", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Objetos reales", "Muñecos"],
                    strategies: ["Modelado", "Imitación", "Juego paralelo"],
                    tags: ["juego", "funcional", "Casby"]
                },
                {
                    id: "obj_jg_002",
                    text: "El paciente realizará juego simbólico con objetos sustitutos (usar bloque como teléfono)",
                    ageRange: "18-24 meses",
                    ageGroup: "preescolar",
                    type: "juego_simbolico",
                    diagnoses: ["Retraso del desarrollo", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Bloques", "Objetos diversos"],
                    strategies: ["Modelado", "Expansión del juego", "Comentarios"],
                    tags: ["juego", "simbólico", "sustitución"]
                },
                {
                    id: "obj_jg_003",
                    text: "El paciente realizará secuencias de juego simbólico de 2-3 acciones relacionadas",
                    ageRange: "24-30 meses",
                    ageGroup: "preescolar",
                    type: "juego_simbolico",
                    diagnoses: ["Retraso del desarrollo", "TEA", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Casa"],
                    materials: ["Set de juego temático", "Muñecos"],
                    strategies: ["Modelado de secuencias", "Guiones de juego", "Expansión"],
                    tags: ["juego", "simbólico", "secuencias", "Casby"]
                }
            ]
        },
        {
            id: "habilidades_sociales",
            name: "Habilidades Sociales",
            objectives: [
                {
                    id: "obj_hs_001",
                    text: "El paciente saludará a adultos conocidos de forma espontánea en 80% de encuentros",
                    ageRange: "3-6 años",
                    ageGroup: "preescolar",
                    type: "saludos",
                    diagnoses: ["TEA", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia", "Comunidad"],
                    materials: ["Guiones sociales", "Historias sociales"],
                    strategies: ["Modelado", "Role-play", "Refuerzo social"],
                    tags: ["habilidades sociales", "saludos", "iniciación"]
                },
                {
                    id: "obj_hs_002",
                    text: "El paciente compartirá juguetes con pares en 70% de oportunidades",
                    ageRange: "3-6 años",
                    ageGroup: "preescolar",
                    type: "compartir",
                    diagnoses: ["TEA", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia grupal"],
                    materials: ["Juguetes", "Juegos cooperativos"],
                    strategies: ["Modelado", "Refuerzo", "Turnos estructurados"],
                    tags: ["habilidades sociales", "compartir", "cooperación"]
                },
                {
                    id: "obj_hs_003",
                    text: "El paciente expresará sus emociones de forma apropiada (sin agresión física) en 85% de ocasiones",
                    ageRange: "4-8 años",
                    ageGroup: "escolar",
                    type: "regulacion_emocional",
                    diagnoses: ["TEA", "Trastornos conductuales"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Casa", "Terapia"],
                    materials: ["Termómetro emocional", "Estrategias de calma"],
                    strategies: ["Identificación emocional", "Estrategias de autorregulación", "Historias sociales"],
                    tags: ["habilidades sociales", "emociones", "autorregulación"]
                }
            ]
        },
        {
            id: "funciones_cognitivas",
            name: "Funciones Cognitivas",
            objectives: [
                {
                    id: "obj_fc_001",
                    text: "El paciente mantendrá atención sostenida en una tarea por 5 minutos sin distractores",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "atencion",
                    diagnoses: ["TDAH", "TEL", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio"],
                    materials: ["Tareas estructuradas", "Timer visual"],
                    strategies: ["Refuerzo intermitente", "Tareas motivantes", "Apoyo visual"],
                    tags: ["funciones cognitivas", "atención", "sostenida"]
                },
                {
                    id: "obj_fc_002",
                    text: "El paciente recordará 3 elementos de una lista verbal inmediatamente después de presentación",
                    ageRange: "5-8 años",
                    ageGroup: "escolar",
                    type: "memoria",
                    diagnoses: ["TEL", "Dificultades de aprendizaje"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio"],
                    materials: ["Listas de palabras", "Imágenes"],
                    strategies: ["Repetición", "Agrupación", "Asociación"],
                    tags: ["funciones cognitivas", "memoria", "corto plazo"]
                },
                {
                    id: "obj_fc_003",
                    text: "El paciente utilizará estrategias de memoria (repetición, agrupación) para recordar información",
                    ageRange: "7-12 años",
                    ageGroup: "escolar",
                    type: "memoria",
                    diagnoses: ["Dificultades de aprendizaje", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio"],
                    materials: ["Tareas de memoria", "Organizadores"],
                    strategies: ["Enseñanza explícita", "Práctica", "Metacognición"],
                    tags: ["funciones cognitivas", "memoria", "estrategias"]
                }
            ]
        },
        {
            id: "lectoescritura",
            name: "Lectoescritura (Apoyo Fonoaudiológico)",
            objectives: [
                {
                    id: "obj_le_001",
                    text: "El paciente identificará rimas en palabras presentadas oralmente en 85% de ocasiones",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "conciencia_fonologica",
                    diagnoses: ["Riesgo de dislexia", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio"],
                    materials: ["Canciones", "Poemas", "Láminas"],
                    strategies: ["Canciones rimadas", "Juegos de rimas", "Apoyo visual"],
                    tags: ["lectoescritura", "conciencia fonológica", "rimas"]
                },
                {
                    id: "obj_le_002",
                    text: "El paciente segmentará palabras en sílabas (palmadas) con 90% de precisión",
                    ageRange: "4-6 años",
                    ageGroup: "preescolar",
                    type: "conciencia_fonologica",
                    diagnoses: ["Riesgo de dislexia", "TEL"],
                    baseline: "Emergente",
                    target: "Dominado",
                    contexts: ["Terapia", "Colegio", "Casa"],
                    materials: ["Palabras", "Palmadas", "Fichas"],
                    strategies: ["Segmentación con movimiento", "Conteo", "Apoyo visual"],
                    tags: ["lectoescritura", "conciencia fonológica", "sílabas"]
                },
                {
                    id: "obj_le_003",
                    text: "El paciente identificará el sonido inicial de palabras en 80% de ocasiones",
                    ageRange: "5-7 años",
                    ageGroup: "escolar",
                    type: "conciencia_fonologica",
                    diagnoses: ["Dislexia", "TEL", "Dificultades de lectura"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio"],
                    materials: ["Láminas", "Palabras", "Letras"],
                    strategies: ["Énfasis en sonido inicial", "Asociación con letra", "Juegos"],
                    tags: ["lectoescritura", "conciencia fonológica", "sonido inicial"]
                },
                {
                    id: "obj_le_004",
                    text: "El paciente leerá palabras de alta frecuencia (50 palabras) de forma automática",
                    ageRange: "6-8 años",
                    ageGroup: "escolar",
                    type: "lectura",
                    diagnoses: ["Dislexia", "Dificultades de lectura"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Terapia", "Colegio", "Casa"],
                    materials: ["Tarjetas de palabras", "Textos"],
                    strategies: ["Lectura repetida", "Flashcards", "Juegos"],
                    tags: ["lectoescritura", "lectura", "palabras frecuentes"]
                }
            ]
        },
        {
            id: "habilidades_discurso",
            name: "Habilidades de Discurso",
            objectives: [
                // DISCURSO EXPOSITIVO
                {
                    id: "obj_hd_001",
                    text: "El paciente producirá un discurso expositivo de 3-5 minutos sobre un tema de interés con estructura clara (introducción, desarrollo, conclusión)",
                    ageRange: "12-16 años",
                    ageGroup: "adolescente",
                    type: "discurso_expositivo",
                    diagnoses: ["TEL", "Dificultades de aprendizaje", "Trastorno Pragmático"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Organizadores gráficos", "Temas de interés", "Esquemas"],
                    strategies: ["Modelado de estructura", "Organizadores visuales", "Práctica guiada"],
                    tags: ["discurso", "expositivo", "estructura", "adolescente"]
                },
                {
                    id: "obj_hd_002",
                    text: "El paciente utilizará conectores discursivos (primero, luego, finalmente, por lo tanto, sin embargo) en 80% de sus exposiciones",
                    ageRange: "12-16 años",
                    ageGroup: "adolescente",
                    type: "discurso_expositivo",
                    diagnoses: ["TEL", "Dificultades de aprendizaje"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Lista de conectores", "Textos modelo", "Organizadores"],
                    strategies: ["Enseñanza explícita", "Modelado", "Feedback correctivo"],
                    tags: ["discurso", "conectores", "cohesión", "adolescente"]
                },
                {
                    id: "obj_hd_003",
                    text: "El paciente explicará conceptos abstractos (justicia, libertad, amistad) con definiciones y ejemplos concretos",
                    ageRange: "13-17 años",
                    ageGroup: "adolescente",
                    type: "discurso_expositivo",
                    diagnoses: ["TEL", "Dificultades de aprendizaje"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Conceptos abstractos", "Ejemplos visuales", "Mapas conceptuales"],
                    strategies: ["Andamiaje", "Ejemplos concretos", "Discusión guiada"],
                    tags: ["discurso", "conceptos abstractos", "definición", "adolescente"]
                },
                {
                    id: "obj_hd_004",
                    text: "El paciente presentará información de fuentes múltiples (libros, internet, entrevistas) de forma integrada y coherente",
                    ageRange: "14-18 años",
                    ageGroup: "adolescente",
                    type: "discurso_expositivo",
                    diagnoses: ["Dificultades de aprendizaje", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio"],
                    materials: ["Fuentes diversas", "Organizadores de información", "Esquemas"],
                    strategies: ["Síntesis de información", "Parafraseo", "Organización jerárquica"],
                    tags: ["discurso", "síntesis", "fuentes múltiples", "adolescente"]
                },

                // DISCURSO PROCEDIMENTAL
                {
                    id: "obj_hd_005",
                    text: "El paciente explicará un procedimiento de 5-8 pasos (receta, experimento, tutorial) con secuencia lógica y vocabulario técnico apropiado",
                    ageRange: "12-16 años",
                    ageGroup: "adolescente",
                    type: "discurso_procedimental",
                    diagnoses: ["TEL", "Trastorno Pragmático"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Recetas", "Experimentos", "Tutoriales", "Videos"],
                    strategies: ["Modelado de secuencia", "Organizadores temporales", "Práctica"],
                    tags: ["discurso", "procedimental", "secuencia", "pasos", "adolescente"]
                },
                {
                    id: "obj_hd_006",
                    text: "El paciente utilizará vocabulario técnico específico (ingredientes, materiales, herramientas) al explicar procedimientos",
                    ageRange: "12-16 años",
                    ageGroup: "adolescente",
                    type: "discurso_procedimental",
                    diagnoses: ["TEL", "Dificultades de aprendizaje"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Glosarios", "Procedimientos diversos", "Imágenes"],
                    strategies: ["Enseñanza de vocabulario", "Uso en contexto", "Repetición espaciada"],
                    tags: ["discurso", "procedimental", "vocabulario técnico", "adolescente"]
                },
                {
                    id: "obj_hd_007",
                    text: "El paciente incluirá advertencias y consejos relevantes al explicar procedimientos (precauciones, tips, alternativas)",
                    ageRange: "13-17 años",
                    ageGroup: "adolescente",
                    type: "discurso_procedimental",
                    diagnoses: ["Trastorno Pragmático", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Procedimientos con advertencias", "Ejemplos modelo"],
                    strategies: ["Análisis de modelos", "Preguntas guía", "Feedback"],
                    tags: ["discurso", "procedimental", "advertencias", "pragmática", "adolescente"]
                },
                {
                    id: "obj_hd_008",
                    text: "El paciente adaptará la explicación de un procedimiento según el nivel de conocimiento del oyente (experto vs. novato)",
                    ageRange: "14-18 años",
                    ageGroup: "adolescente",
                    type: "discurso_procedimental",
                    diagnoses: ["Trastorno Pragmático", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Audiencias diversas", "Role-play"],
                    strategies: ["Teoría de la mente", "Perspectiva del oyente", "Práctica"],
                    tags: ["discurso", "procedimental", "adaptación", "audiencia", "adolescente"]
                },

                // DISCURSO ARGUMENTATIVO
                {
                    id: "obj_hd_009",
                    text: "El paciente presentará una postura clara sobre un tema controversial con al menos 3 argumentos de apoyo",
                    ageRange: "13-17 años",
                    ageGroup: "adolescente",
                    type: "discurso_argumentativo",
                    diagnoses: ["TEL", "Dificultades de aprendizaje", "Trastorno Pragmático"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Temas controversiales", "Organizadores de argumentos", "Esquemas"],
                    strategies: ["Modelado de estructura argumentativa", "Brainstorming", "Organizadores"],
                    tags: ["discurso", "argumentativo", "postura", "argumentos", "adolescente"]
                },
                {
                    id: "obj_hd_010",
                    text: "El paciente utilizará evidencia concreta (datos, ejemplos, citas) para apoyar sus argumentos en 80% de ocasiones",
                    ageRange: "13-17 años",
                    ageGroup: "adolescente",
                    type: "discurso_argumentativo",
                    diagnoses: ["Dificultades de aprendizaje", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Fuentes de evidencia", "Ejemplos de argumentos", "Textos modelo"],
                    strategies: ["Enseñanza de tipos de evidencia", "Análisis de modelos", "Práctica"],
                    tags: ["discurso", "argumentativo", "evidencia", "datos", "adolescente"]
                },
                {
                    id: "obj_hd_011",
                    text: "El paciente anticipará y refutará contraargumentos en sus discursos argumentativos",
                    ageRange: "14-18 años",
                    ageGroup: "adolescente",
                    type: "discurso_argumentativo",
                    diagnoses: ["Trastorno Pragmático", "Dificultades de aprendizaje"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Debates", "Organizadores de argumentos/contraargumentos"],
                    strategies: ["Perspectiva múltiple", "Debate estructurado", "Modelado"],
                    tags: ["discurso", "argumentativo", "contraargumentos", "refutación", "adolescente"]
                },
                {
                    id: "obj_hd_012",
                    text: "El paciente utilizará lenguaje persuasivo apropiado (modalización, conectores causales) en argumentaciones",
                    ageRange: "14-18 años",
                    ageGroup: "adolescente",
                    type: "discurso_argumentativo",
                    diagnoses: ["TEL", "Dificultades de aprendizaje"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Textos argumentativos", "Lista de recursos lingüísticos"],
                    strategies: ["Enseñanza explícita", "Análisis de textos", "Práctica guiada"],
                    tags: ["discurso", "argumentativo", "persuasión", "modalización", "adolescente"]
                },

                // DISCURSO MIXTO Y HABILIDADES TRANSVERSALES
                {
                    id: "obj_hd_013",
                    text: "El paciente participará en debates formales respetando turnos, escuchando activamente y respondiendo a puntos específicos",
                    ageRange: "13-18 años",
                    ageGroup: "adolescente",
                    type: "debate",
                    diagnoses: ["Trastorno Pragmático", "TEA", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia grupal"],
                    materials: ["Temas de debate", "Reglas de debate", "Tarjetas de turno"],
                    strategies: ["Estructura de debate", "Modelado", "Feedback inmediato"],
                    tags: ["discurso", "debate", "turnos", "pragmática", "adolescente"]
                },
                {
                    id: "obj_hd_014",
                    text: "El paciente utilizará recursos paralingüísticos (volumen, entonación, pausas) para enfatizar puntos clave en presentaciones",
                    ageRange: "12-18 años",
                    ageGroup: "adolescente",
                    type: "prosodia_discurso",
                    diagnoses: ["Trastorno Pragmático", "TEA"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio", "Terapia"],
                    materials: ["Grabadora", "Videos", "Textos marcados"],
                    strategies: ["Modelado prosódico", "Feedback auditivo", "Práctica"],
                    tags: ["discurso", "prosodia", "énfasis", "paralingüístico", "adolescente"]
                },
                {
                    id: "obj_hd_015",
                    text: "El paciente elaborará presentaciones multimodales (oral + visual) integrando texto, imágenes y gráficos de forma coherente",
                    ageRange: "13-18 años",
                    ageGroup: "adolescente",
                    type: "presentacion_multimodal",
                    diagnoses: ["Dificultades de aprendizaje", "TEL"],
                    baseline: "Emergente",
                    target: "En Desarrollo",
                    contexts: ["Colegio"],
                    materials: ["PowerPoint/Canva", "Imágenes", "Gráficos"],
                    strategies: ["Diseño visual", "Integración texto-imagen", "Práctica de presentación"],
                    tags: ["discurso", "multimodal", "presentación", "visual", "adolescente"]
                }
            ]
        }
    ]
};

// Función helper para buscar objetivos
export function searchObjectives(query, filters = {}) {
    const { area, ageGroup, diagnosis, type } = filters;
    let results = [];

    OBJECTIVE_BANK.areas.forEach(areaObj => {
        if (area && areaObj.id !== area) return;

        areaObj.objectives.forEach(obj => {
            // Filtros
            if (ageGroup && obj.ageGroup !== ageGroup) return;
            if (diagnosis && !obj.diagnoses.includes(diagnosis)) return;
            if (type && obj.type !== type) return;

            // Búsqueda por texto
            if (query) {
                const searchText = query.toLowerCase();
                const matchText = obj.text.toLowerCase().includes(searchText);
                const matchTags = obj.tags.some(tag => tag.toLowerCase().includes(searchText));
                if (!matchText && !matchTags) return;
            }

            results.push({
                ...obj,
                areaName: areaObj.name,
                areaId: areaObj.id
            });
        });
    });

    return results;
}

// Función para obtener objetivos por área
export function getObjectivesByArea(areaId) {
    const area = OBJECTIVE_BANK.areas.find(a => a.id === areaId);
    return area ? area.objectives.map(obj => ({
        ...obj,
        areaName: area.name,
        areaId: area.id
    })) : [];
}

// Función para obtener un objetivo por ID
export function getObjectiveById(objectiveId) {
    for (const area of OBJECTIVE_BANK.areas) {
        const objective = area.objectives.find(obj => obj.id === objectiveId);
        if (objective) {
            return {
                ...objective,
                areaName: area.name,
                areaId: area.id
            };
        }
    }
    return null;
}

// Diagnósticos comunes
export const COMMON_DIAGNOSES = [
    "TEL",
    "TEA",
    "Retraso del Lenguaje",
    "Trastorno Fonológico",
    "Tartamudez",
    "Disfonía",
    "Dislexia",
    "TDAH",
    "Síndrome de Down",
    "Fisura labiopalatina",
    "Disartria",
    "Apraxia del habla",
    "Dificultades de aprendizaje",
    "Trastorno Pragmático",
    "Disfonia",
    "Deglución atípica"
];

// Grupos de edad
export const AGE_GROUPS = [
    { value: "lactante", label: "Lactante (0-2 años)" },
    { value: "preescolar", label: "Preescolar (2-5 años)" },
    { value: "escolar", label: "Escolar (6-12 años)" },
    { value: "adolescente", label: "Adolescente (12-18 años)" },
    { value: "adulto", label: "Adulto (18+ años)" },
    { value: "todas", label: "Todas las edades" }
];
