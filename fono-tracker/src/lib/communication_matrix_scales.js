/**
 * COMMUNICATION MATRIX (Matriz de Comunicación)
 * Charity Rowland, Ph.D. © 2006
 * Oregon Health & Science University
 * 
 * Herramienta de evaluación del desarrollo comunicativo
 * que analiza 7 niveles de comportamiento comunicativo
 * a través de diferentes funciones comunicativas.
 */

export const COMMUNICATION_MATRIX_LEVELS = [
    { value: 0, label: "No presente", color: "white", bgColor: "bg-white", borderColor: "border-gray-300" },
    { value: 1, label: "Emergente", color: "yellow", bgColor: "bg-yellow-100", borderColor: "border-yellow-400" },
    { value: 2, label: "Dominado", color: "green", bgColor: "bg-green-100", borderColor: "border-green-500" }
];

export const BEHAVIOR_LEVELS = [
    {
        id: "I",
        title: "I - Comportamiento preintencional",
        description: "Movimientos corporales, primeros sonidos, expresiones faciales",
        ageRange: "0-2 meses"
    },
    {
        id: "II",
        title: "II - Comportamiento intencional",
        description: "Gestos convencionales, expresiones faciales",
        ageRange: "3-8 meses"
    },
    {
        id: "III",
        title: "III - Comunicación no convencional",
        description: "Rechaza/niega, pide más de acción",
        ageRange: "8-12 meses"
    },
    {
        id: "IV",
        title: "IV - Comunicación convencional",
        description: "Gestos convencionales, vocalizaciones específicas",
        ageRange: "12-18 meses"
    },
    {
        id: "V",
        title: "V - Símbolos concretos",
        description: "Símbolos de objetos, imágenes, símbolos de objetos",
        ageRange: "18-24 meses"
    },
    {
        id: "VI",
        title: "VI - Símbolos abstractos",
        description: "Signos manuales, palabras escritas",
        ageRange: "2-3 años"
    },
    {
        id: "VII",
        title: "VII - Lenguaje",
        description: "Combinaciones de 2+ palabras, oraciones",
        ageRange: "3+ años"
    }
];

export const COMMUNICATION_FUNCTIONS = [
    {
        id: "refuse",
        category: "Expresar",
        subcategory: "Comportamiento preintencional",
        title: "Rechaza / Niega",
        code: "C1",
        description: "Rechaza objeto, acción o interacción no deseada",
        levels: {
            "I": {
                behaviors: ["Llanto", "Movimientos corporales", "Expresiones faciales"],
                examples: "Llora cuando se le acerca algo que no quiere"
            },
            "II": {
                behaviors: ["Protesta", "Continúa acción", "Obtiene más de algo"],
                examples: "Aparta la mano cuando le ofrecen algo"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Empuja el objeto no deseado"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Mueve la cabeza para decir 'no'"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo de 'no' o imagen"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Usa signo manual o palabra escrita 'no'"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice 'no quiero' o 'no me gusta'"
            }
        }
    },
    {
        id: "request_more_action",
        category: "Obtener",
        subcategory: "Contenúa acción",
        title: "Pide más de acción",
        code: "B2",
        description: "Pide que continúe una acción o actividad",
        levels: {
            "I": {
                behaviors: ["Expresa incomodidad"],
                examples: "Sonríe cuando la actividad continúa"
            },
            "II": {
                behaviors: ["Protesta", "Continúa acción"],
                examples: "Mueve el cuerpo para que continúe el juego"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Toca a la persona para que continúe"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Gesto de 'más' o vocalización específica"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo de 'más' o imagen de la acción"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual de 'más' o palabra escrita"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice 'más' o 'otra vez'"
            }
        }
    },
    {
        id: "request_new_object",
        category: "Obtener",
        subcategory: "Pide más de algo",
        title: "Pide objeto nuevo",
        code: "C2",
        description: "Pide un objeto específico que no está presente",
        levels: {
            "I": {
                behaviors: ["Expresa incomodidad"],
                examples: "Llora cuando quiere algo"
            },
            "II": {
                behaviors: ["Protesta", "Obtiene más de algo"],
                examples: "Alcanza hacia el objeto deseado"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Señala o alcanza el objeto"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Gesto convencional hacia el objeto"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo o imagen del objeto"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual o palabra escrita del objeto"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Nombra el objeto que quiere"
            }
        }
    },
    {
        id: "request_new_action",
        category: "Obtener",
        subcategory: "Pide acción nueva",
        title: "Pide acción nueva",
        code: "C3",
        description: "Pide que alguien realice una acción específica",
        levels: {
            "I": {
                behaviors: ["Expresa incomodidad"],
                examples: "Llora para que lo carguen"
            },
            "II": {
                behaviors: ["Protesta", "Continúa acción"],
                examples: "Levanta los brazos para que lo carguen"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Tira de la persona hacia donde quiere ir"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Gesto convencional de la acción deseada"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo o imagen de la acción"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual o palabra escrita de la acción"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice 'abre' o 'ayúdame'"
            }
        }
    },
    {
        id: "choose",
        category: "Obtener",
        subcategory: "Pide más de un objeto",
        title: "Elige",
        code: "C4",
        description: "Elige entre dos o más opciones presentadas",
        levels: {
            "I": {
                behaviors: ["Expresa comodidad"],
                examples: "Mira hacia la opción preferida"
            },
            "II": {
                behaviors: ["Protesta", "Obtiene más de algo"],
                examples: "Alcanza la opción que prefiere"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Toca o agarra la opción deseada"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Señala la opción que quiere"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Toca el símbolo o imagen de su elección"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual o palabra escrita de su elección"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice el nombre de lo que elige"
            }
        }
    },
    {
        id: "request_attention",
        category: "Interacción Social",
        subcategory: "Pide atención",
        title: "Pide atención",
        code: "C8",
        description: "Busca llamar la atención de otra persona",
        levels: {
            "I": {
                behaviors: ["Expresa incomodidad"],
                examples: "Llora para obtener atención"
            },
            "II": {
                behaviors: ["Protesta", "Continúa acción"],
                examples: "Vocaliza para llamar atención"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Toca a la persona"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Gesto o vocalización para llamar atención"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo o imagen para llamar atención"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual o palabra escrita del nombre"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice el nombre de la persona o 'mira'"
            }
        }
    },
    {
        id: "show_affection",
        category: "Interacción Social",
        subcategory: "Muestra afecto",
        title: "Muestra afecto",
        code: "C9",
        description: "Expresa afecto hacia otra persona",
        levels: {
            "I": {
                behaviors: ["Expresa comodidad"],
                examples: "Sonríe a personas familiares"
            },
            "II": {
                behaviors: ["Protesta", "Continúa acción"],
                examples: "Se acurruca con la persona"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Abraza o besa"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Gesto de abrazo o beso"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo de corazón o abrazo"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual de 'te quiero'"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice 'te quiero' o 'te amo'"
            }
        }
    },
    {
        id: "greet",
        category: "Interacción Social",
        subcategory: "Saluda a gente",
        title: "Saluda a gente",
        code: "C10",
        description: "Saluda cuando llega o se va alguien",
        levels: {
            "I": {
                behaviors: ["Expresa comodidad"],
                examples: "Sonríe cuando ve a alguien conocido"
            },
            "II": {
                behaviors: ["Protesta", "Continúa acción"],
                examples: "Vocaliza cuando ve a alguien"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Mueve la mano"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Gesto de 'hola' o 'adiós'"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo de 'hola' o 'adiós'"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual de saludo"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice 'hola' o 'adiós'"
            }
        }
    },
    {
        id: "direct_attention",
        category: "Información",
        subcategory: "Dirige atención",
        title: "Dirige atención a un evento",
        code: "C11",
        description: "Llama la atención sobre algo que está sucediendo",
        levels: {
            "I": {
                behaviors: ["Expresa comodidad/incomodidad"],
                examples: "Mira hacia el evento"
            },
            "II": {
                behaviors: ["Protesta", "Continúa acción"],
                examples: "Vocaliza mientras mira el evento"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Toca a la persona y mira el evento"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Señala el evento"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo relacionado con el evento"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual o palabra escrita sobre el evento"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice 'mira' o describe el evento"
            }
        }
    },
    {
        id: "answer_yes_no",
        category: "Información",
        subcategory: "Responde preguntas de sí/no",
        title: "Responde preguntas de sí/no",
        code: "C13",
        description: "Responde afirmativa o negativamente a preguntas",
        levels: {
            "I": {
                behaviors: ["Expresa comodidad/incomodidad"],
                examples: "Sonríe o llora en respuesta"
            },
            "II": {
                behaviors: ["Protesta", "Continúa acción"],
                examples: "Vocaliza diferente para sí/no"
            },
            "III": {
                behaviors: ["Rechaza/niega", "Pide más de acción"],
                examples: "Empuja para 'no', alcanza para 'sí'"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Mueve cabeza para sí/no"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Toca símbolo de 'sí' o 'no'"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual de 'sí' o 'no'"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice 'sí' o 'no'"
            }
        }
    },
    {
        id: "answer_questions",
        category: "Información",
        subcategory: "Responde preguntas",
        title: "Responde preguntas abiertas",
        code: "C14",
        description: "Responde preguntas que requieren información específica",
        levels: {
            "I": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "II": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "III": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "IV": {
                behaviors: ["Pide objeto nuevo", "Pide acción nueva"],
                examples: "Gesto o vocalización en respuesta"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo para responder"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual o palabra escrita de respuesta"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Responde con palabras o frases"
            }
        }
    },
    {
        id: "name_things",
        category: "Información",
        subcategory: "Nombra cosas",
        title: "Nombra cosas o gente",
        code: "C16",
        description: "Identifica y nombra objetos, personas o lugares",
        levels: {
            "I": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "II": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "III": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "IV": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolo del objeto o persona"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual o palabra escrita del nombre"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Dice el nombre del objeto o persona"
            }
        }
    },
    {
        id: "make_comments",
        category: "Información",
        subcategory: "Hace comentarios",
        title: "Hace comentarios",
        code: "C17",
        description: "Comenta sobre eventos, objetos o experiencias",
        levels: {
            "I": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "II": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "III": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "IV": {
                behaviors: ["No aplica en este nivel"],
                examples: "N/A"
            },
            "V": {
                behaviors: ["Pide objeto", "Pide acción ausente"],
                examples: "Usa símbolos para comentar"
            },
            "VI": {
                behaviors: ["Pide atención", "Muestra afecto"],
                examples: "Signo manual o palabra escrita de comentario"
            },
            "VII": {
                behaviors: ["Saluda o gente", "Ofrece/comparte"],
                examples: "Hace comentarios con palabras o frases"
            }
        }
    }
];

export const SYMBOL_TYPES = [
    {
        levels: ["I", "II", "III"],
        type: "Comportamiento",
        description: "Movimientos corporales, primeros sonidos, expresiones faciales, habla"
    },
    {
        levels: ["IV"],
        type: "Gestos convencionales",
        description: "Gestos socialmente aceptados (señalar, asentir, etc.)"
    },
    {
        levels: ["V"],
        type: "Símbolos concretos",
        description: "Símbolos de objetos, imágenes, símbolos de objetos"
    },
    {
        levels: ["VI"],
        type: "Símbolos abstractos",
        description: "Signos manuales, palabras escritas"
    },
    {
        levels: ["VII"],
        type: "Lenguaje",
        description: "Combinaciones de palabras, oraciones"
    }
];
