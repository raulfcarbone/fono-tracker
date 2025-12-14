/**
 * PLANTILLAS DE INFORMES CON TEXTO PRELLENADO EDITABLE
 * 
 * Basadas en el estilo profesional del usuario
 * Cada campo tiene texto sugerido que puede ser modificado completamente
 */

export const SMART_REPORT_TEMPLATES = {
    evaluacion_inicial: {
        id: 'evaluacion_inicial',
        name: 'Informe de Evaluación Inicial',
        description: 'Informe completo de evaluación fonoaudiológica con texto prellenado',
        sections: [
            {
                id: 'identificacion',
                title: 'I. IDENTIFICACIÓN',
                fields: [
                    { key: 'nombre', label: 'Nombre', type: 'text', value: '' },
                    { key: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date', value: '' },
                    { key: 'edad', label: 'Edad', type: 'text', value: '', computed: true },
                    { key: 'fecha_evaluacion', label: 'Fecha de evaluación', type: 'date', value: '' }
                ]
            },
            {
                id: 'participacion_social',
                title: 'Participación Social',
                subsections: [
                    {
                        id: 'perfil_comunicativo',
                        title: 'Perfil comunicativo e intención social',
                        field: {
                            key: 'perfil_comunicativo',
                            type: 'textarea',
                            placeholder: 'Según lo aportado por los padres en el Cuestionario de Comunicación Social de IMPACT...',
                            defaultText: `Según lo aportado por los padres en el cuestionario de comunicación social, así como desde las observaciones realizadas, se considera que el perfil de interacción e intención comunicativa de {{nombre}} se encuentra en el polo de la iniciación activa, ya que inicia actos comunicativos relacionados a necesidades inmediatas, sin haber adquirido todavía formas convencionales y claras para concretar y diferenciar dichas intenciones en cuanto a diferentes interlocutores o situaciones.`
                        }
                    },
                    {
                        id: 'atencion_conjunta',
                        title: 'Atención conjunta',
                        field: {
                            key: 'atencion_conjunta',
                            type: 'textarea',
                            defaultText: `Muestra pautas de atención conjunta orientadas principalmente al inicio, por ejemplo, dirigiendo su mirada, postura corporal, vocalizaciones poco diferenciadas hacia el otro y un punto de su interés, siempre cercano. A su vez, muestra una mezcla de actos físicos como dirigir la mano del interlocutor, señalar con el dedo a un punto cercano a él, etc. A su vez, {{nombre}} puede vocalizar, realizar balbuceo simple o reduplicado para dirigir la atención del adulto. Pese a ello, la combinación de formas de comunicar no es diversa.

En cuanto al perfil de respuesta, {{nombre}} muestra una latencia en la respuesta a la mirada, gestos y lenguaje orientados a llamar su atención, así también se observa que la respuesta a estos para regular su conducta es insuficiente, requiriendo apoyos de tipo físico, como tomarle la mano, mostrarle frente a él un objeto o foto del mismo para redirigir su comportamiento.`
                        }
                    },
                    {
                        id: 'enganche_juego',
                        title: 'Enganche en juego',
                        field: {
                            key: 'enganche_juego',
                            type: 'textarea',
                            defaultText: `En términos de interacción y juego, se observa a {{nombre}} con un interés fluctuante en los objetos y materiales, así como con una exploración de estos desde una búsqueda sensorial, principalmente táctil.`
                        }
                    },
                    {
                        id: 'nivel_juego',
                        title: 'Nivel de juego (conceptual)',
                        field: {
                            key: 'nivel_juego',
                            type: 'textarea',
                            defaultText: `Le interesan materiales y juegos desde esquemas causa-efecto, juegos de encaje, etc., así como puede utilizar objetos y materiales relacionados con juego presimbólico (dar de comer a un osito, por ejemplo), pero en base a imitación o memoria.`
                        }
                    }
                ]
            },
            {
                id: 'comunicacion_comprensiva',
                title: 'Comunicación Comprensiva',
                subsections: [
                    {
                        id: 'atencion_social',
                        title: 'Atención social',
                        field: {
                            key: 'atencion_social',
                            type: 'textarea',
                            defaultText: `Las consignas para mantener su atención como "mira", o decir su nombre suelen ser reiteradas, y apoyadas de pistas físicas como tomar su mano, por ejemplo. Responde con latencia a formatos para restringir su comportamiento como "no" o "detente", deteniendo su actividad y mirando al adulto, sin mayor muestra de postura o gesto.`
                        }
                    },
                    {
                        id: 'comprension_rutinas',
                        title: 'Comprensión de rutinas verbales e instrucciones cotidianas',
                        field: {
                            key: 'comprension_rutinas',
                            type: 'textarea',
                            defaultText: `{{nombre}} logra responder con inconsistencia y latencia a consignas generales del ambiente en imperativo como "ven", "vamos", "dame", etc., requiriendo apoyo gestual o repetición. Desde el reporte de los padres en el inventario MacArthur, {{nombre}} demuestra un mejor desempeño en el seguimiento de instrucciones de la rutina como "adiós", "a dormir", "vámonos", "¿quieres más?", etc., demostrando comprensión con la mirada, disponiendo su conducta, etc. Desde el puntaje consignado en el inventario, {{nombre}} muestra una comprensión de frases esperada para un niño de 10 a 11 meses de expectativa de vocabulario receptivo.`
                        }
                    },
                    {
                        id: 'vocabulario_receptivo',
                        title: 'Vocabulario receptivo y distal',
                        field: {
                            key: 'vocabulario_receptivo',
                            type: 'textarea',
                            defaultText: `A nivel léxico-semántico, se puede observar en {{nombre}} un vocabulario receptivo restringido en grado severo, siendo más consistente la comprensión o respuesta a elementos como alimentos/bebidas, consignas de la rutina diaria y acciones rutinarias. Muestra una comprensión parcial de acciones, realizando algunos esquemas de juegos basados en dichos elementos como "saca", "lanza", "pon" y rutinas como el guardar, requiriendo apoyos gestuales. En base al reporte de los padres en el inventario MacArthur, {{nombre}} muestra el rendimiento en vocabulario receptivo esperado para un niño de 11 meses de expectativa de desarrollo lingüístico.`
                        }
                    },
                    {
                        id: 'relaciones_semanticas',
                        title: 'Relaciones semánticas básicas',
                        field: {
                            key: 'relaciones_semanticas',
                            type: 'textarea',
                            defaultText: `A nivel de relaciones semánticas básicas, {{nombre}} muestra comprensión emergente de conceptos espaciales básicos y relaciones de pertenencia.`
                        }
                    },
                    {
                        id: 'fonetico_fonologico',
                        title: 'Fonético-fonológico',
                        field: {
                            key: 'fonetico_fonologico',
                            type: 'textarea',
                            defaultText: `A nivel fonético-fonológico, {{nombre}} muestra atención y respuesta a estímulos del ambiente, orientando y siguiendo con la mirada, ya sea de tipo no verbal (instrumentos musicales) y verbales (onomatopeyas, palabras y frases).`
                        }
                    },
                    {
                        id: 'comprension_morfosintactica',
                        title: 'Comprensión morfosintáctica',
                        field: {
                            key: 'comprension_morfosintactica',
                            type: 'textarea',
                            defaultText: `En cuanto al nivel morfosintáctico, {{nombre}} muestra comprensión emergente de instrucciones simples en contexto inmediato.`
                        }
                    },
                    {
                        id: 'instrucciones_complejidad',
                        title: 'Instrucciones según extensión y complejidad',
                        field: {
                            key: 'instrucciones_complejidad',
                            type: 'textarea',
                            defaultText: `Responde a instrucciones para identificar, encontrar, entregar o tomar elementos, como en el caso de "toma/dame el auto", o "saca la pelota", pudiendo encontrar el elemento indicado con la mirada o con dificultades para concretar la instrucción desde el canal motor, tomando, sacando o guardando el elemento objetivo.`
                        }
                    },
                    {
                        id: 'impresiones_generales',
                        title: 'Impresiones generales',
                        field: {
                            key: 'impresiones_generales',
                            type: 'textarea',
                            defaultText: `En términos globales, tanto desde el inventario de vocabulario como la escala de comprensión auditiva del instrumento PLS-5, {{nombre}} se encuentra en una expectativa de desarrollo de lenguaje comprensivo de 13 meses.`
                        }
                    }
                ]
            },
            {
                id: 'comunicacion_expresiva',
                title: 'Comunicación Expresiva',
                subsections: [
                    {
                        id: 'funciones_comunicativas',
                        title: 'Funciones comunicativas principales',
                        field: {
                            key: 'funciones_comunicativas',
                            type: 'textarea',
                            defaultText: `En términos de comunicación expresiva, {{nombre}} presenta razones para comunicarse vinculadas a las dimensiones de negación-protesta, petición de objetos-acciones, de tipo social, así como intenciones incipientes en el área de compartir información y eventos del ambiente.`
                        }
                    },
                    {
                        id: 'formas_comunicativas',
                        title: 'Formas comunicativas por función (complejidad)',
                        field: {
                            key: 'formas_comunicativas',
                            type: 'textarea',
                            defaultText: `Estas intenciones de comunicar en {{nombre}} se expresan con formas que tienden, fundamentalmente, a recursos de tipo no verbal, ya sea el uso de la mirada y expresión facial, gestos de apuntar de forma cercana, por ejemplo. Desde las formas orientadas a lo verbal, {{nombre}} muestra vocalizaciones, balbuceo simple (ba) y reduplicado (mama), principalmente, y en situaciones circunscritas, intentos de palabras como "más" y rutinas verbales como "uno, dos tres".

En cuanto a la dimensión de rechazar, {{nombre}} muestra rechazar objetos/actividades mediante conductas tipo físicas gruesas, sonidos, físicas específicas, expresión facial, mirada compartida, gestos, símbolos concretos como... palabras aisladas o escritas, frases orales/escritas.

Respecto a la dimensión de petición, {{nombre}} expresa bienestar, intenta continuar acciones, solicita más de un objeto, pide más de una acción, pide una acción nueva, pide más de un objeto, elige entre dos/más opciones, pide un objeto nuevo, pide objetos ausentes mediante conductas tipo físicas gruesas, sonidos, físicas específicas, expresión facial, mirada compartida, gestos, símbolos concretos como... palabras aisladas o escritas, frases orales/escritas.`
                        }
                    },
                    {
                        id: 'dimension_social',
                        title: 'Dimensión de tipo social',
                        field: {
                            key: 'dimension_social',
                            type: 'textarea',
                            defaultText: `Respecto a la dimensión de tipo social, {{nombre}} logra expresar interés en las personas presentes, atraer la atención del otro, pide específicamente atención a otro, muestra afecto a sus cuidadores y cercanos, Saluda/ se despide, ofrece o comparte cosas, dirija la atención del otro hacia algo, usa fórmulas sociales en el contexto mediante conductas tipo físicas gruesas, sonidos, físicas específicas, expresión facial, mirada compartida, gestos, símbolos concretos como... palabras aisladas o escritas, frases orales/escritas.

En cuanto a la dimensión de información, {{nombre}} logra responder a preguntas cerradas SI/No, realiza preguntas simples. Hace preguntas, realiza comentarios del contexto inmediato o no presente mediante gestos simbólicos, símbolos concretos como... palabras aisladas o escritas, frases orales/escritas o con señas de diverso tipo.

Según lo observado en el perfil arrojado según la Matriz de Comunicación, {{nombre}} muestra un desarrollo en el nivel X, o XXXXX (nombre basándose en Matriz). Las intenciones más prevalentes son RECHAZO, PETICIÓN, SOCIAL, INFORMACIÓN, aludiendo a un perfil comunicativo de (FORMAS PRINCIPALES).`
                        }
                    },
                    {
                        id: 'vocabulario_expresivo',
                        title: 'Vocabulario expresivo',
                        field: {
                            key: 'vocabulario_expresivo',
                            type: 'textarea',
                            defaultText: `A nivel léxico-semántico, {{nombre}} muestra un repertorio de vocabulario expresivo restringido a palabras relacionadas a sus cuidadores, como es "papá" y "mamá", así como palabras dirigidas a la interacción con el adulto como son "hola" y "más", así como "que" para responder y rutinas verbales como "uno, dos, tres". Este rendimiento, al momento de ser cotejado con el inventario MacArthur, da una expectativa de desarrollo al nivel de los 13 meses de expectativa de edad de vocabulario expresivo.`
                        }
                    },
                    {
                        id: 'expresion_verbal',
                        title: 'Expresión verbal (oral y no oral según corresponda)',
                        field: {
                            key: 'expresion_verbal',
                            type: 'textarea',
                            defaultText: `En términos verbales u orales, las expresiones de {{nombre}} tienden a usar palabras y/o frases monosílabas como "la carrera", "está aquí", "no", "mamá", "hola-chao", "ayuda", que son aprendidas en rutinas del día a día o basadas en su interés.

{{nombre}} muestra restricciones para iniciar la comunicación adecuadamente, ya que tiende a utilizar los recursos no verbales antes destacados, incluso si puede nombrar algunos elementos o utilizar algunas palabras/frases aisladas en forma de ecolalia y/o palilalia. La mayoría de las verbalizaciones utilizadas son relativas a elementos inmediatos en el lugar y momento, sin poder proyectar o abstraer en cuanto a otro momento o persona no presente. Pese a ello, sí puede anticiparse a la presencia o ausencia de su madre en el espacio de evaluación.

En relación con la expresión verbal evidenciada en XXXX, esta se constituye por enunciados espontáneos de 1 elemento, o hasta de 2 elementos en forma de rutinas verbales en forma de ecolalias o palilalias. Debido a esta restricción en la extensión, diversidad y complejidad del lenguaje expresivo, no se puede considerar logrados adquiridos elementos de morfología (marcas que acompañan a las palabras para indicar persona, género, cantidad, tiempo, etc.) o sintaxis (formulación de estructuras de oraciones de diverso tipo) en XXXX.`
                        }
                    }
                ]
            }
        ]
    },

    intervencion: {
        id: 'intervencion',
        name: 'Informe de Intervención',
        description: 'Informe de progreso terapéutico con texto prellenado',
        sections: [
            {
                id: 'identificacion',
                title: 'I. IDENTIFICACIÓN',
                fields: [
                    { key: 'nombre', label: 'Nombre', type: 'text', value: '' },
                    { key: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date', value: '' },
                    { key: 'edad', label: 'Edad', type: 'text', value: '', computed: true },
                    { key: 'periodo', label: 'Período de informe', type: 'text', value: '' }
                ]
            },
            {
                id: 'descripcion_intervencion',
                title: 'II. DESCRIPCIÓN DE LA INTERVENCIÓN FONOAUDIOLÓGICA',
                field: {
                    key: 'descripcion_intervencion',
                    type: 'textarea',
                    defaultText: `El proceso de intervención llevado a cabo con {{nombre}} ha tenido como foco principal la habilitación comunicativa y lingüística, intervención que se ha realizado desde el segundo semestre del año 2024. La frecuencia ha sido, en general, de una sesión por semana inicialmente, para añadir otra sesión durante 2025. Destaca la asistencia regular, así como el apoyo y alternancia de la familia en el proceso terapéutico. Este apoyo ha sido vital en todo el curso de la intervención terapéutica. La familia contribuye con iniciativa, levanta necesidades nuevas y retroalimenta respecto a lo que se va trabajar.

Como jerarquización de trabajo, se ha transitado desde el uso de un modelo de desarrollo, específicamente el enfoque de enseñanza de precisión de contenidos aplicado (ABA), para luego tender una transición entre enseñanza de precisión hacia el lenguaje natural, con énfasis en contextos y la transferencia de dicha capacidad hacia ambientes más cotidianos.

Se ha integrado el modelo de adquisición de lenguaje natural, el que considera el respetar el aprendizaje de a escalas, lo que formas de ecolalia propias de {{nombre}}. Este modelo, pese a integrarse de manera lenta hasta mediados de 2024, desde ese momento y fundamentalmente durante el año 2025, se ha considerado con una mayor jerarquía, debido a la tendencia de {{nombre}} a utilizar estas formas de ecolalia diferida, siendo, en la actualidad, su forma de comunicación principalmente.

Esto debido a que dicho aprendizaje de Gestalt -dicho antes, a través de ecolalias diferidas- le ha dado una capacidad de concretar una serie de necesidades comunicativas. Cabe jerarquizar este contenido de habilidad en la voz.

Desde el punto de vista de las actividades en las sesiones, que traducen los contenidos estipulados, se ha incluido de forma progresiva actividades centradas en contextos de lenguaje, ya sea en base a actividades de identificación de elementos, actividades de estructuración gramatical básica, combinando y expandiendo sus ecolalias`
                }
            },
            {
                id: 'respuesta_intervencion',
                title: 'III. RESPUESTA A LA INTERVENCIÓN',
                intro: 'La respuesta a la intervención, según niveles del lenguaje, se resume a continuación:',
                subsections: [
                    {
                        id: 'comunicacion_pragmatica',
                        title: 'a. Comunicación y pragmática',
                        field: {
                            key: 'comunicacion_pragmatica',
                            type: 'textarea',
                            defaultText: `En esta área se observa una buena respuesta por parte de {{nombre}}. Muestra adherencia a la rutina terapéutica de forma regular, comprendiendo consignas de la rutina, tanto para su inicio, desarrollo, como también, tanto para pedir actividades, dar por terminada una actividad, transitar a otra, etc.

En general, logra comunicarse de forma más efectiva tanto por uso de la mirada, gestos como señalar, usar palabras, frases consideradas como Gestalt, con una transición entre una ecolalia diferida más extensa como "la jalada al punto de servir" a solicitar irse, hacia formas que combinan, "servida – papá". Como se recalca en la planificación, estas frases o Gestalt cubren las intenciones de {{nombre}} para rechazar actividades, pedir objetos, acciones, personas o terminar actividades, llamar la atención de otro o mostrar emociones. Por ejemplo, {{nombre}} es capaz de decir, según sus padres, "me portó bien para expresar su malestar por no obtener algo recompensante luego de terminar una sesión.

Se ha observado un logro parcial, pero más consistente en el nombrar elementos, como los citados en los objetivos. En ocasiones lo logra por imitación, pero también lo ha hecho cada vez más de manera espontánea, como al pedir el control remoto, algo para comer, pedir el iPad, etc.

Estos logros son consistentes con la planificación terapéutica, ya que el primer elemento está logrado en base a las expectativas a la fecha, y el objetivo relacionado a terminar de nombrar de manera espontánea está en desarrollo, ya que {{nombre}} puede requerir un modelo del adulto para imitar.

Asimismo, estos logros se observan tanto en la terapia, como en el hogar, en el exterior, así como en el colegio, según lo referido por los padres.`
                        }
                    },
                    {
                        id: 'fonologia_fonetica',
                        title: 'b. Fonología y fonética',
                        field: {
                            key: 'fonologia_fonetica',
                            type: 'textarea',
                            defaultText: `Este nivel del lenguaje, centrado en la capacidad de articular -pronunciar- los sonidos de nuestra lengua, o bien unidades como palabras y sílabas, se considera como un punto fuerte en {{nombre}}. Hay una tendencia a presentar y decir algunas sílabas y palabras, lo que puede considerarse en {{nombre}} como una estrategia para nominar, o bien como una tendencia a repetir sílabas y hacer rítmica con las palabras ayuda luego a mejorar la articulación y la longitud de las sílabas en palabras.`
                        }
                    },
                    {
                        id: 'morfosintaxis',
                        title: 'c. Morfosintaxis',
                        field: {
                            key: 'morfosintaxis',
                            type: 'textarea',
                            defaultText: `Se observa en {{nombre}} mejoras tanto en el aspecto comprensivo y expresivo del nivel morfosintáctico. Esto se refiere, en el área comprensiva, a seguir instrucciones cotidianas como "ven", "sentarse", "toma", "dame", "buscar", "recoger", "guardar", etc. Asimismo, esta capacidad se extiende a seguir instrucciones más extensas y que combinan dos contenidos. Este es el caso de "toma el oso morado", considerando que cada palabra de esta frase -toma, oso, morado- es un elemento para reconocer y utilizar para cumplir bien la tarea.

Desde el aspecto expresivo, {{nombre}} utiliza combinaciones cada vez más atingentes a la hora de utilizar y combinar sus Gestalt con otras palabras también atingentes al contexto. De esta manera, puede hacer peticiones como "ya viene el papá", por ejemplo, las que consideran más de un elemento, que concuerda en género, número, persona y acciones, como distintos elementos de frase y descripción.`
                        }
                    },
                    {
                        id: 'lexico_semantico',
                        title: 'd. Léxico-semántico',
                        field: {
                            key: 'lexico_semantico',
                            type: 'textarea',
                            defaultText: `Este aspecto ha sido, en general, otra fortaleza en {{nombre}}. Se observa desde inicios de la intervención comprensión de categorías básicas como colores, partes del cuerpo, animales, transportes, frutas-verduras, personas, profesiones, vestimenta, entre otras, especialmente en el formato receptivo. Durante la intervención y hasta la actualidad, se ha podido consignar que {{nombre}} ha ido ganando mayor independencia al nominar.

Esto, en términos de llevar los logros de la terapia a lo cotidiano, le ha permitido a {{nombre}} expresar necesidades nombrando lo que requiere. Ya sea en el contexto de la terapia, con la familia, dentro de la casa, en el exterior, así como en el aula cuando lo requiere.

Esta capacidad de comprender y nominar vocabulario se ha extendido desde las sesiones de terapia al hogar, exterior y colegio, según lo que han reportado los padres.`
                        }
                    }
                ]
            },
            {
                id: 'conclusiones',
                title: 'IV. CONCLUSIONES Y SUGERENCIAS',
                field: {
                    key: 'conclusiones',
                    type: 'textarea',
                    defaultText: `A nivel general, se considera que {{nombre}} muestra avances consistentes, explicables por la adherencia de los padres a la intervención, recomendaciones, y el medio educativo y el trabajo terapéutico a nivel de terapia ocupacional.

El trabajo en cuanto a la comunicación con pares, la comprensión de lenguaje y la expresión comunicativa en todo contexto apoyos visuales y Sistemas de Comunicación Aumentativa y/o Alternativa. {{nombre}} puede compensar, en términos generales, las dificultades de {{nombre}} a nivel de comunicación.

Por lo mismo, y por la tendencia mostrada anteriormente, se considera que el desempeño de {{nombre}} muestra las características de un trastorno de la comunicación en grado actualmente moderado, en la que la adherencia a la intervención sigue siendo clave para su correcto tránsito por el medio escolar, en el que con la adecuada coordinación {{nombre}} puede, sin duda, adaptarse tanto a la rutina escolar, a los objetivos para su nivel y edad.

Cabe destacar que sus fortalezas, especialmente a nivel de comprensión, precisamente se han visto potenciados y evidenciados en la medida que el lenguaje ha mostrado una adecuada transferencia de logros hacia su comportamiento cotidiano.

Se estima que la frecuencia que presenta actualmente (una vez por semana) de ambas terapias sigue siendo óptima, {{justificacion_frecuencia}} en la actualidad.

Desde el punto de vista de las competencias de {{nombre}}, tal como han aparecido, se han transferido y se han transferido a distintos ámbitos, resulta pertinente {{recomendacion_transferencia}} de manera absolutamente sistemática en sus terapias, en el hogar, el exterior, y principalmente en el aula.

Este último punto, referido al contexto escolar, no solo es un derecho de {{nombre}}, sino que constituye un rol principal para él. En el colegio los niños aprenden habilidades como socializar, participar y seguir una rutina, todas habilidades para la vida, en definitiva.

De esta manera, y para generar la mayor transferencia y calidad de vida en {{nombre}}, él debe estar presente, recibir apoyos, pero también ejercer sus roles en el hogar, y en medios como lo comunitario y la escuela.

Desde el punto de vista clínico, los diagnósticos fonoaudiológicos a la fecha son:

1. Trastorno del desarrollo del lenguaje mixto -expresivo y comprensivo- en grado moderado.
2. Trastorno de la comunicación, afectando interacción social recíproca y adecuación al contexto.

A su vez, se sugiere seguir las siguientes indicaciones, tanto para el hogar como para la escuela:`
                }
            },
            {
                id: 'sugerencias',
                title: 'Sugerencias',
                subsections: [
                    {
                        id: 'sugerencias_hogar',
                        title: 'Sugerencias para el hogar',
                        fields: [
                            {
                                key: 'sugerencia_hogar_1',
                                type: 'textarea',
                                defaultText: 'Promover la capacidad de utilizar las Gestalt que conoce {{nombre}}, y que reconocen sus familiares, ya sea modelando, imitando, dando oportunidades provocadas, ya sea presentando la situación en la que {{nombre}} pedirá, comentará, rechazará, para terminar una rutina o iniciar otra.'
                            },
                            {
                                key: 'sugerencia_hogar_2',
                                type: 'textarea',
                                defaultText: 'Promover que {{nombre}} siga instrucciones cada vez más complejas, idealmente de la misma extensión que en sesiones -tres elementos críticos- con ayudas gestuales que vayan en retroceso, que le permitan participar de manera más independiente de su rutina.'
                            },
                            {
                                key: 'sugerencia_hogar_3',
                                type: 'textarea',
                                defaultText: 'Apoyar en distintas actividades cotidianas, para así nombrar los pasos que tienen estas actividades, ya sea poner la mesa, ordenar, limpiar, lavar los platos, etc., siempre en consideración de su trastorno motor y variables cognitivas como atención, tolerancia a la frustración, etc.'
                            }
                        ]
                    },
                    {
                        id: 'sugerencias_escuela',
                        title: 'Sugerencias para la escuela',
                        fields: [
                            {
                                key: 'sugerencia_escuela_1',
                                type: 'textarea',
                                defaultText: 'Considerar apoyos visuales y SAAC para facilitar la comprensión y expresión de {{nombre}} en el contexto escolar.'
                            },
                            {
                                key: 'sugerencia_escuela_2',
                                type: 'textarea',
                                defaultText: 'Promover la participación activa de {{nombre}} en actividades grupales, adaptando las demandas según sus capacidades actuales.'
                            },
                            {
                                key: 'sugerencia_escuela_3',
                                type: 'textarea',
                                defaultText: 'Mantener comunicación constante con la familia y equipo terapéutico para asegurar coherencia en las estrategias de intervención.'
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

/**
 * Helper function to get template with patient data pre-filled
 */
export function getTemplateWithData(templateId, patientData) {
    const template = JSON.parse(JSON.stringify(SMART_REPORT_TEMPLATES[templateId]));

    // Replace {{nombre}} placeholders with actual patient name
    const replacePlaceholders = (obj) => {
        if (typeof obj === 'string') {
            return obj.replace(/{{nombre}}/g, patientData.name || 'el paciente');
        }
        if (Array.isArray(obj)) {
            return obj.map(replacePlaceholders);
        }
        if (typeof obj === 'object' && obj !== null) {
            const newObj = {};
            for (const key in obj) {
                newObj[key] = replacePlaceholders(obj[key]);
            }
            return newObj;
        }
        return obj;
    };

    return replacePlaceholders(template);
}
