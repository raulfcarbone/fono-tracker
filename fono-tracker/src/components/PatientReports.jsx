import React, { useMemo, useState } from 'react';
import { FileText, Download, Copy, Check, BookOpen, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const REPORT_TEMPLATES = {
    evaluacion: [
        {
            id: 'eval_lenguaje',
            name: 'Informe de evaluación de lenguaje',
            summary: 'Para síntesis de perfil lingüístico inicial.',
            sections: [
                {
                    id: 'motivo',
                    title: 'Motivo de consulta',
                    text: '{name} es derivado/a por {diagnosis} con el objetivo de caracterizar el perfil comunicativo actual.'
                },
                {
                    id: 'hallazgos',
                    title: 'Hallazgos',
                    text: 'Se observa un desempeño {performance} en inteligibilidad, con mayores dificultades en {focusArea}. Comprensión y expresión funcionales para actividades cotidianas con apoyo.'
                },
                {
                    id: 'conclusion',
                    title: 'Conclusión diagnóstica',
                    text: 'El perfil es consistente con {diagnosis}. Se sugiere intervención fonoaudiológica para favorecer {goalArea}.'
                },
                {
                    id: 'recomendaciones',
                    title: 'Recomendaciones',
                    text: 'Implementar apoyos visuales, trabajo en casa 10-15 minutos, y seguimiento en 12 semanas.'
                }
            ]
        },
        {
            id: 'eval_fluidez',
            name: 'Informe de evaluación de fluidez',
            summary: 'Incluye severidad, conductas secundarias y recomendaciones.',
            sections: [
                {
                    id: 'perfil',
                    title: 'Perfil de fluidez',
                    text: '{name} presenta disfluencias tipo {disfluencias} con frecuencia aproximada de {frecuencia}. Se observan conductas secundarias {conductas}.'
                },
                {
                    id: 'impacto',
                    title: 'Impacto funcional',
                    text: 'Las disfluencias impactan la participación en {contexto}, especialmente durante {situaciones}.'
                },
                {
                    id: 'plan',
                    title: 'Plan sugerido',
                    text: 'Se recomienda programa de {programa} con énfasis en autorregulación, acompañamiento familiar y seguimiento mensual.'
                }
            ]
        }
    ],
    intervencion: [
        {
            id: 'sesion_progreso',
            name: 'Informe breve de intervención',
            summary: 'Para reportar evolución y próximos pasos.',
            sections: [
                {
                    id: 'avance',
                    title: 'Avances',
                    text: '{name} ha logrado avances en {avanceArea}. Se evidencia {porcentaje}% de logro en los objetivos actuales.'
                },
                {
                    id: 'estrategias',
                    title: 'Estrategias utilizadas',
                    text: 'Se han utilizado estrategias de {estrategias} y apoyos {apoyos} con buena adherencia familiar.'
                },
                {
                    id: 'proximos',
                    title: 'Próximos pasos',
                    text: 'Continuar con {plan}, incorporar actividades en {contexto}, y revisar progresos en {plazo} semanas.'
                }
            ]
        },
        {
            id: 'alta_parcial',
            name: 'Informe de alta parcial',
            summary: 'Para cerrar o pausar intervención en objetivos específicos.',
            sections: [
                {
                    id: 'logros',
                    title: 'Logros consolidados',
                    text: '{name} alcanza desempeño independiente en {logros} con generalización a {contextos}.'
                },
                {
                    id: 'indicaciones',
                    title: 'Indicaciones de seguimiento',
                    text: 'Se sugiere mantener {rutinas} y monitorear {alertas}. Próximo control en {plazo}.'
                }
            ]
        }
    ],
    certificados: [
        {
            id: 'cert_clinico',
            name: 'Certificado clínico',
            summary: 'Para licencias médicas, aseguradoras o derivaciones.',
            sections: [
                {
                    id: 'cuerpo',
                    title: 'Texto sugerido',
                    text: 'Se certifica que {name} se encuentra en tratamiento fonoaudiológico por {diagnosis}. Se recomienda {recomendacion} y asistir a controles programados.'
                },
                {
                    id: 'permisos',
                    title: 'Permisos y restricciones',
                    text: 'Requiere {permisos} y adaptación en {contexto} para favorecer la participación.'
                }
            ]
        },
        {
            id: 'cert_escolar',
            name: 'Certificado para centro educativo',
            summary: 'Para informar apoyos en aula y adecuaciones.',
            sections: [
                {
                    id: 'contexto',
                    title: 'Situación',
                    text: '{name} asiste a terapia fonoaudiológica semanal por {diagnosis}. Se solicita comprensión del equipo educativo.'
                },
                {
                    id: 'apoyos',
                    title: 'Apoyos solicitados',
                    text: 'Aplicar ajustes razonables: {ajustes} y permitir {flexibilidades} según necesidad.'
                }
            ]
        }
    ]
};

export function PatientReports({ patient }) {
    const [selectedType, setSelectedType] = useState('evaluacion');
    const [selectedTemplateId, setSelectedTemplateId] = useState(REPORT_TEMPLATES.evaluacion[0].id);
    const [sections, setSections] = useState(() => initializeSections('evaluacion', REPORT_TEMPLATES.evaluacion[0], patient));
    const [copied, setCopied] = useState(false);

    const patientName = patient?.name || 'el/la paciente';
    const patientDiagnosis = patient?.diagnosis || 'motivo de consulta reportado';

    const currentTemplates = useMemo(() => REPORT_TEMPLATES[selectedType], [selectedType]);
    const currentTemplate = useMemo(
        () => currentTemplates.find(t => t.id === selectedTemplateId) || currentTemplates[0],
        [currentTemplates, selectedTemplateId]
    );

    const handleTypeChange = (value) => {
        const firstTemplate = REPORT_TEMPLATES[value][0];
        setSelectedType(value);
        setSelectedTemplateId(firstTemplate.id);
        setSections(initializeSections(value, firstTemplate, patient));
    };

    const handleTemplateChange = (value) => {
        const template = currentTemplates.find(t => t.id === value) || currentTemplates[0];
        setSelectedTemplateId(value);
        setSections(initializeSections(selectedType, template, patient));
    };

    const handleSectionChange = (id, field, value) => {
        setSections(prev => prev.map(section => section.id === id ? { ...section, [field]: value } : section));
    };

    const handleCopy = async () => {
        const composed = sections.filter(s => s.enabled).map(s => `${s.title}\n${s.text}`).join('\n\n');
        await navigator.clipboard.writeText(composed);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const composedPreview = sections
        .filter(s => s.enabled)
        .map(s => `${s.title}: ${s.text}`)
        .join('\n\n');

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-teal-600 font-bold">Generar informes</p>
                            <h2 className="text-xl font-semibold text-slate-900">Plantillas editables</h2>
                            <p className="text-sm text-slate-500">Elige el tipo de informe y ajusta cada sección antes de exportar.</p>
                        </div>
                        <BookOpen className="text-teal-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Tipo de documento</label>
                            <select
                                value={selectedType}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="evaluacion">Informe de evaluación</option>
                                <option value="intervencion">Informe de intervención</option>
                                <option value="certificados">Certificados</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">Plantilla</label>
                            <select
                                value={selectedTemplateId}
                                onChange={(e) => handleTemplateChange(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                {currentTemplates.map(template => (
                                    <option key={template.id} value={template.id}>{template.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-500">{currentTemplate?.summary}</p>
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleCopy}
                                className={clsx(
                                    "flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors",
                                    copied ? "bg-emerald-100 text-emerald-700" : "bg-teal-600 text-white hover:bg-teal-700"
                                )}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copiado' : 'Copiar texto'}
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-teal-700 border border-teal-200 hover:bg-teal-50"
                            >
                                <Download size={18} />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {sections.map(section => (
                        <div key={section.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs uppercase text-slate-500 tracking-wide">{section.title}</p>
                                    <p className="text-sm text-slate-400">Incluye o adapta el texto sugerido.</p>
                                </div>
                                <label className="flex items-center text-sm text-slate-600 gap-2">
                                    <input
                                        type="checkbox"
                                        checked={section.enabled}
                                        onChange={(e) => handleSectionChange(section.id, 'enabled', e.target.checked)}
                                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    Incluir
                                </label>
                            </div>
                            <textarea
                                value={section.text}
                                onChange={(e) => handleSectionChange(section.id, 'text', e.target.value)}
                                className="w-full min-h-[140px] border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-teal-700 mb-2">
                        <FileText size={18} />
                        <p className="text-sm font-semibold">Vista previa</p>
                    </div>
                    <pre className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap min-h-[160px]">{composedPreview}</pre>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle size={18} />
                        <p className="text-sm font-semibold">Datos de referencia del paciente</p>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li><span className="font-semibold">Nombre:</span> {patientName}</li>
                        <li><span className="font-semibold">Diagnóstico:</span> {patientDiagnosis}</li>
                        <li><span className="font-semibold">Fecha:</span> {new Date().toLocaleDateString()}</li>
                    </ul>
                    <p className="text-xs text-slate-500">Estos datos no se guardan automáticamente en el informe; se incluyen como referencia rápida.</p>
                </div>
            </div>
        </div>
    );
}

function initializeSections(type, template, patient) {
    const patientName = patient?.name || 'el/la paciente';
    const diagnosis = patient?.diagnosis || 'motivo de consulta';

    return template.sections.map(section => ({
        ...section,
        enabled: true,
        text: section.text
            .replaceAll('{name}', patientName)
            .replaceAll('{diagnosis}', diagnosis)
            .replaceAll('{performance}', 'acorde a la edad')
            .replaceAll('{focusArea}', 'articulación de fonemas y secuencias')
            .replaceAll('{goalArea}', 'la participación comunicativa funcional')
            .replaceAll('{disfluencias}', 'bloqueos y prolongaciones')
            .replaceAll('{frecuencia}', 'moderada')
            .replaceAll('{conductas}', 'mínimas conductas secundarias')
            .replaceAll('{situaciones}', 'interacciones espontáneas y turnos rápidos')
            .replaceAll('{programa}', 'modificación de la tartamudez')
            .replaceAll('{avanceArea}', 'inteligibilidad y uso de vocabulario funcional')
            .replaceAll('{porcentaje}', '70')
            .replaceAll('{estrategias}', 'modelado, rutinas y conciencia fonológica')
            .replaceAll('{apoyos}', 'visuales y verbales')
            .replaceAll('{plan}', 'generalización en contextos naturales')
            .replaceAll('{contexto}', 'contextos escolares y familiares')
            .replaceAll('{plazo}', '6')
            .replaceAll('{logros}', 'los objetivos priorizados')
            .replaceAll('{contextos}', 'casa y colegio')
            .replaceAll('{rutinas}', 'rutinas de práctica diaria')
            .replaceAll('{alertas}', 'variaciones en fluidez o voz')
            .replaceAll('{recomendacion}', 'continuar sesiones y facilitar ajustes en el entorno')
            .replaceAll('{permisos}', 'asistencia a controles y tiempos de descanso comunicativo')
            .replaceAll('{ajustes}', 'uso de apoyos visuales, tiempos de respuesta extendidos')
            .replaceAll('{flexibilidades}', 'presentar tareas orales con anticipación')
    }));
}
