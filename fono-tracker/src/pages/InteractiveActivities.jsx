import React, { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import clsx from 'clsx';
import { db } from '../db';
import {
    Gamepad2,
    Link2,
    Play,
    Plus,
    Trash2,
    ExternalLink,
    Info,
    Clock,
    ShieldCheck,
    MonitorPlay,
    Sparkles,
    ArrowRight
} from 'lucide-react';

const RECOMMENDED_INTEGRATIONS = [
    {
        id: 'speakwell',
        title: 'SpeakWell (repositorio externo)',
        launchUrl: 'https://jelankhwieleh.github.io/SpeakWell-Helping-Kids-Speak-and-Learn-application/',
        source: 'https://github.com/JelanKhweileh/SpeakWell-Helping-Kids-Speak-and-Learn-application',
        notes:
            'Clon o build estático del proyecto (React + Firebase). Sube la carpeta compilada a un hosting estático ' +
            'o expone el index.html dentro de /public/interactive/speakwell para embeberlo con fines terapéuticos.'
    }
];

export function InteractiveActivities() {
    const modules = useLiveQuery(() => db.interactiveModules.orderBy('createdAt').reverse().toArray(), []);

    const [title, setTitle] = useState('');
    const [launchUrl, setLaunchUrl] = useState('');
    const [source, setSource] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [message, setMessage] = useState('');

    const selectedModule = useMemo(() => {
        if (!modules || modules.length === 0) return null;
        if (selectedModuleId) {
            return modules.find((m) => m.id === selectedModuleId) || modules[0];
        }
        return modules[0];
    }, [modules, selectedModuleId]);

    const handleSave = async () => {
        if (!title.trim() || !launchUrl.trim()) return;
        await db.interactiveModules.add({
            title: title.trim(),
            launchUrl: launchUrl.trim(),
            source: source.trim(),
            notes: notes.trim(),
            createdAt: new Date()
        });
        setTitle('');
        setLaunchUrl('');
        setSource('');
        setNotes('');
    };

    const handleDelete = async (id) => {
        await db.interactiveModules.delete(id);
        if (selectedModuleId === id) {
            setSelectedModuleId(null);
        }
    };

    const handleLoadTemplate = async (template) => {
        if (!template.launchUrl) return;
        const exists = modules?.some((m) => m.launchUrl === template.launchUrl);
        if (exists) {
            setMessage('La integración de SpeakWell ya está en tu biblioteca.');
            return;
        }

        const newId = await db.interactiveModules.add({
            title: template.title,
            launchUrl: template.launchUrl,
            source: template.source,
            notes: template.notes,
            createdAt: new Date()
        });
        setSelectedModuleId(newId);
        setMessage('Integración añadida. Si el visor embebido falla, usa "Abrir en pestaña".');
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm mb-1">Integraciones externas</p>
                    <h1 className="text-3xl font-bold text-slate-900">Actividades interactivas</h1>
                    <p className="text-slate-500 mt-2 max-w-3xl">
                        Registra apps o minijuegos terapéuticos (ej. SpeakWell) y ejecútalos desde la plataforma.
                        Útil para tareas de articulación, lenguaje, voz o lectoescritura con apoyo multimedia.
                    </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                    <p className="font-semibold text-teal-700">Beta</p>
                    <p>Usa el visor embebido o abre en pestaña si el origen bloquea iframes.</p>
                </div>
            </div>

            {message && (
                <div className="border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 rounded-lg text-sm">
                    {message}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="space-y-4 lg:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-teal-600 font-bold">Integrar app</p>
                                <h2 className="text-xl font-semibold text-slate-900">Nueva fuente interactiva</h2>
                            </div>
                            <Gamepad2 className="text-teal-600" />
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Nombre visible</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: SpeakWell demo / Juego de pares mínimos"
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">URL para lanzar</label>
                                <input
                                    value={launchUrl}
                                    onChange={(e) => setLaunchUrl(e.target.value)}
                                    placeholder="https://... (GitHub Pages, Netlify, Vercel o archivo local expuesto)"
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Si copias el build de SpeakWell en /public/interactive/speakwell, apunta a /interactive/speakwell/index.html.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Repositorio / fuente</label>
                                <input
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    placeholder="https://github.com/... (opcional)"
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Notas de integración</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Requisitos: micrófono, se abre mejor en pestaña, usa español, etc."
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full flex items-center justify-center space-x-2 bg-teal-600 text-white px-4 py-3 rounded-lg font-semibold shadow-sm hover:bg-teal-700"
                        >
                            <Plus size={18} />
                            <span>Guardar en biblioteca</span>
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                            <Info size={16} className="text-teal-600" />
                            <p className="text-sm font-semibold text-slate-800">Sugerencia de integración</p>
                        </div>
                        <p className="text-sm text-slate-600">
                            SpeakWell es un proyecto abierto con actividades de habla (saludos, vocabulario, fonemas) que pueden
                            reutilizarse. Puedes alojar su build estático en el mismo dominio o usar su despliegue público si
                            está disponible.
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            {RECOMMENDED_INTEGRATIONS.map((integration) => (
                                <div key={integration.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                                    <p className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
                                        <Sparkles size={16} className="text-teal-600" />
                                        <span>{integration.title}</span>
                                    </p>
                                    <p className="text-xs text-slate-600 mt-1">{integration.notes}</p>
                                    <div className="flex items-center justify-between mt-2 text-xs text-teal-700">
                                        <a
                                            href={integration.source}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center space-x-1 hover:underline"
                                        >
                                            <Link2 size={14} />
                                            <span>Repositorio</span>
                                        </a>
                                        <button
                                            onClick={() => handleLoadTemplate(integration)}
                                            className="inline-flex items-center space-x-1 text-sm px-2 py-1 bg-white border border-teal-200 rounded-md text-teal-700 hover:bg-teal-50"
                                        >
                                            <Plus size={14} />
                                            <span>Agregar</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <MonitorPlay className="text-teal-600" />
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-teal-700 font-bold">Visor</p>
                                    <h2 className="text-lg font-semibold text-slate-900">Ejecutar actividad interactiva</h2>
                                </div>
                            </div>
                            {selectedModule && (
                                <a
                                    href={selectedModule.launchUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center space-x-1 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800"
                                >
                                    <ExternalLink size={16} />
                                    <span>Abrir en pestaña</span>
                                </a>
                            )}
                        </div>

                        {selectedModule ? (
                            <div className="mt-3 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{selectedModule.title}</p>
                                        <p className="text-xs text-slate-500">{selectedModule.source || 'URL directa'}</p>
                                        {selectedModule.notes && (
                                            <p className="text-xs text-slate-600 mt-1">{selectedModule.notes}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                                        <Clock size={14} />
                                        <span>{new Date(selectedModule.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="aspect-video bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                                    <iframe
                                        title={selectedModule.title}
                                        src={selectedModule.launchUrl}
                                        className="w-full h-full"
                                        allow="camera; microphone; clipboard-read; clipboard-write; fullscreen"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 flex items-center space-x-2">
                                    <ShieldCheck size={14} className="text-teal-600" />
                                    <span>
                                        Si el proveedor bloquea iframes (X-Frame-Options), usa "Abrir en pestaña" para mantener
                                        la funcionalidad completa.
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-500">
                                <p className="font-medium text-slate-700">No hay actividades interactivas guardadas.</p>
                                <p className="text-sm mt-1">Agrega una URL (ej. despliegue de SpeakWell) para habilitar el visor.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <ListIcon />
                                <p className="text-sm font-semibold text-slate-800">Biblioteca de integraciones</p>
                            </div>
                            <p className="text-xs text-slate-500">Lista de apps externas registradas</p>
                        </div>
                        {modules && modules.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-3">
                                {modules.map((module) => (
                                    <div
                                        key={module.id}
                                        className={clsx(
                                            'border rounded-lg p-3 bg-white shadow-xs space-y-2 cursor-pointer',
                                            selectedModule?.id === module.id ? 'border-teal-300 ring-1 ring-teal-200' : 'border-slate-200'
                                        )}
                                        onClick={() => setSelectedModuleId(module.id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-slate-900">{module.title}</p>
                                                <p className="text-xs text-slate-500 truncate">{module.launchUrl}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(module.id);
                                                }}
                                                className="text-slate-400 hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        {module.notes && (
                                            <p className="text-xs text-slate-600 line-clamp-2">{module.notes}</p>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-teal-700">
                                            <span className="inline-flex items-center space-x-1">
                                                <Play size={14} />
                                                <span>Listo para lanzar</span>
                                            </span>
                                            <span className="inline-flex items-center space-x-1 text-slate-500">
                                                <Clock size={12} />
                                                <span>{new Date(module.createdAt).toLocaleDateString()}</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-200 rounded-lg p-5 text-center text-slate-500">
                                <p className="font-medium text-slate-700">Aún no registras integraciones.</p>
                                <p className="text-sm mt-1">Agrega la URL desplegada de SpeakWell o cualquier otro recurso interactivo.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold">Exportar build de SpeakWell</p>
                            <p className="text-xs text-slate-200">
                                En el repositorio, ejecuta npm install && npm run build y copia la carpeta build al directorio
                                /public/interactive/speakwell. Luego registra la URL local /interactive/speakwell/index.html.
                            </p>
                        </div>
                        <ArrowRight size={16} className="text-teal-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ListIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-teal-600"
        >
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
        </svg>
    );
}
