export const WETHERBY_FUNCTIONS = [
    { category: "Regulación Conductual", items: ["Requerir Objeto", "Requerir Acción", "Protesta"] },
    { category: "Interacción Social", items: ["Requiere una actividad Social", "Requiere Comodidad", "Saluda", "Llama", "Pide permiso", "Muestra"] },
    { category: "Atención Conjunta", items: ["Comenta", "Requiere o pide Información", "Da/entrega Información"] }
];

export const WETHERBY_FORMS = [
    {
        label: "Pre-verbal",
        subItems: [
            "Manipulación Física", "Entregar", "Apuntar", "Mostrar",
            "Desplazando la mirada", "Acercándose", "Mover la cabeza",
            "Expresión Facial", "Auto-Agresión", "Agresión",
            "Tantrismos (pataletas)", "Llorar/Gritar", "Vocalizar", "Otros"
        ]
    },
    {
        label: "Verbal",
        subItems: [
            "Ecolalia Inmediata", "Ecolalia Diferida",
            "Enunciado de 1 palabra", "Enunciado de 2 ó más palabras", "Otros"
        ]
    }
];

export const WETHERBY_ALL_COLUMNS = WETHERBY_FORMS.flatMap(g => g.subItems);
