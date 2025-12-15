import React, { useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import {
    Activity,
    Layers,
    Mic,
    Pause,
    Save,
    Tag,
    Upload,
    X,
    Image as ImageIcon,
    Music,
    ClipboardList,
    Loader2,
    Search,
    MessageSquareText
} from 'lucide-react';
import clsx from 'clsx';

const ACTIVITY_CATEGORIES = [
    { id: 'articulacion_fonologia', name: 'Articulación y fonología', hint: 'Secuencias de fonemas, pares mínimos, cadenas con apoyo visual.' },
    { id: 'fluidez', name: 'Fluidez', hint: 'Pacing, respiración diafragmática, ritmo con metronomo o palmadas.' },
    { id: 'voz', name: 'Voz', hint: 'Tareas de higiene vocal, resonancia, tono e intensidad con biofeedback.' },
    { id: 'lenguaje_exp', name: 'Lenguaje expresivo', hint: 'Narrativas, expansión de MLU, modelos de morfosintaxis en juego simbólico.' },
    { id: 'lenguaje_comp', name: 'Lenguaje comprensivo', hint: 'Seguimiento de instrucciones, selección de imágenes, comprensión auditiva.' },
    { id: 'lectoescritura', name: 'Lectoescritura', hint: 'Conciencia fonológica, ruta fonológica, correspondencias grafema-fonema.' },
    { id: 'aac', name: 'CAA / SAAC', hint: 'Letreros, tableros, celdas con símbolos, combinación núcleo + periférico.' },
    { id: 'pragmatica', name: 'Pragmática', hint: 'Turnos, funciones comunicativas, roles sociales en escenas cotidianas.' },
    { id: 'cognicion', name: 'Cognición / funciones ejecutivas', hint: 'Atención, memoria de trabajo, planificación con apoyos visuales.' },
    { id: 'motricidad_oral', name: 'Motricidad orofacial / alimentación', hint: 'Rutinas orales, texturas, progresiones de tolerancia y deglución.' },
    { id: 'regulacion', name: 'Regulación sensorial', hint: 'Alertas, autorregulación, rutinas de organización y respiración.' },
    { id: 'grupal', name: 'Trabajo grupal', hint: 'Dinámicas cooperativas, reglas claras, feedback inmediato.' }
];

export function Activities() {
    const activities = useLiveQuery(() => db.activities.orderBy('createdAt').reverse().toArray(), []);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(ACTIVITY_CATEGORIES[0].id);
    const [goal, setGoal] = useState('');
    const [instructions, setInstructions] = useState('');
    const [assetQueue, setAssetQueue] = useState([]);
    const [labelText, setLabelText] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const [arasaacQuery, setArasaacQuery] = useState('');
    const [arasaacResults, setArasaacResults] = useState([]);
    const [arasaacCaptions, setArasaacCaptions] = useState({});
    const [isSearchingArasaac, setIsSearchingArasaac] = useState(false);
    const [arasaacError, setArasaacError] = useState('');

    const [isRecording, setIsRecording] = useState(false);
    const audioSupported = useMemo(
        () => typeof window !== 'undefined' && !!navigator.mediaDevices && 'MediaRecorder' in window,
        []
    );
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const filteredActivities = useMemo(() => {
        if (!activities) return [];
        if (!filterCategory) return activities;
        return activities.filter(a => a.category === filterCategory);
    }, [activities, filterCategory]);

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setAssetQueue(prev => [...prev, {
                id: crypto.randomUUID(),
                type: 'image',
                name: file.name,
                src: e.target?.result,
            }]);
        };
        reader.readAsDataURL(file);
    };

    const handleAddLabel = () => {
        if (!labelText.trim()) return;
        setAssetQueue(prev => [...prev, { id: crypto.randomUUID(), type: 'label', text: labelText.trim() }]);
        setLabelText('');
    };

    const handleSearchArasaac = async () => {
        const term = arasaacQuery.trim();
        if (!term) return;
        setIsSearchingArasaac(true);
        setArasaacError('');
        try {
            const response = await fetch(`https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(term)}?limit=30`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar pictogramas');
            }
            const data = await response.json();
            setArasaacResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setArasaacError('No se pudo conectar con ARASAAC. Intenta nuevamente.');
        } finally {
            setIsSearchingArasaac(false);
        }
    };

    const handleArasaacCaptionChange = (id, value) => {
        setArasaacCaptions(prev => ({ ...prev, [id]: value }));
    };

    const handleImportArasaac = (pictogram) => {
        const url = `https://static.arasaac.org/pictograms/${pictogram._id}/${pictogram._id}_500.png`;
        const caption = arasaacCaptions[pictogram._id]?.trim();
        setAssetQueue(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type: 'image',
                origin: 'arasaac',
                name: pictogram.keywords?.[0]?.keyword || 'Imagen ARASAAC',
                caption,
                src: url,
            }
        ]);
    };

    const handleToggleRecording = async () => {
        if (!audioSupported) return;

        if (isRecording && mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAssetQueue(prev => [...prev, {
                        id: crypto.randomUUID(),
                        type: 'audio',
                        name: `Grabación ${new Date().toLocaleTimeString()}`,
                        src: reader.result,
                    }]);
                };
                reader.readAsDataURL(blob);
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
        } catch (error) {
            console.error('No se pudo iniciar la grabación', error);
            setIsRecording(false);
        }
    };

    const handleRemoveAsset = (id) => {
        setAssetQueue(prev => prev.filter(asset => asset.id !== id));
    };

    const handleSaveActivity = async () => {
        if (!title.trim()) return;

        await db.activities.add({
            title: title.trim(),
            category,
            goal: goal.trim(),
            instructions: instructions.trim(),
            assets: assetQueue,
            labels: assetQueue.filter(a => a.type === 'label').map(l => l.text),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        setTitle('');
        setGoal('');
        setInstructions('');
        setAssetQueue([]);
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm mb-1">Nueva sección</p>
                    <h1 className="text-3xl font-bold text-slate-900">Gestor de actividades terapéuticas</h1>
                    <p className="text-slate-500 mt-2 max-w-3xl">
                        Diseña, almacena y reutiliza actividades con imágenes, rótulos y audio para sesiones presenciales o teleterapia.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Filtrar</p>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                            <option value="">Todas las categorías</option>
                            {ACTIVITY_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-teal-600 font-bold">Nueva actividad</p>
                                <h2 className="text-xl font-semibold text-slate-900">Diseñar borrador</h2>
                            </div>
                            <Layers className="text-teal-500" />
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Título</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Bingo de fonemas /r/ inicial"
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Categoría</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                >
                                    {ACTIVITY_CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">{ACTIVITY_CATEGORIES.find(cat => cat.id === category)?.hint}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Objetivo terapéutico</label>
                                <textarea
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    rows={2}
                                    placeholder="Enunciado funcional breve (qué busca la actividad)"
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Instrucciones y ajustes</label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    rows={3}
                                    placeholder="Materiales, configuración, apoyos visuales, graduación de dificultad, telepráctica..."
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-slate-800">Recursos de la actividad</h3>
                                <span className="text-xs text-slate-500">Imágenes, audio, rótulos</span>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center justify-between border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer hover:border-teal-400">
                                    <div className="flex items-center space-x-2">
                                        <Upload size={18} className="text-teal-500" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">Añadir imagen</p>
                                            <p className="text-xs text-slate-500">JPG, PNG o WEBP</p>
                                        </div>
                                    </div>
                                    <ImageIcon size={20} className="text-slate-400" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>

                                <div className="flex items-center space-x-2">
                                    <input
                                        value={labelText}
                                        onChange={(e) => setLabelText(e.target.value)}
                                        placeholder="Texto del rótulo (ej. /r/ inicial, verbo, escenario)"
                                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                    <button
                                        onClick={handleAddLabel}
                                        className="px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm flex items-center space-x-1"
                                    >
                                        <Tag size={16} />
                                        <span>Agregar rótulo</span>
                                    </button>
                                </div>

                                <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
                                                <Search size={15} className="text-teal-600" />
                                                <span>ARASAAC (símbolos)</span>
                                            </p>
                                            <p className="text-xs text-slate-500">Busca pictogramas y añádelos como imágenes con rótulo opcional.</p>
                                        </div>
                                        {isSearchingArasaac && <Loader2 size={18} className="animate-spin text-teal-600" />}
                                    </div>
                                    <div className="flex space-x-2">
                                        <input
                                            value={arasaacQuery}
                                            onChange={(e) => setArasaacQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleSearchArasaac();
                                                }
                                            }}
                                            placeholder="Ej. perro, ir al baño, ayuda"
                                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        />
                                        <button
                                            onClick={handleSearchArasaac}
                                            className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center space-x-1"
                                        >
                                            <Search size={16} />
                                            <span>Buscar</span>
                                        </button>
                                    </div>
                                    {arasaacError && <p className="text-xs text-red-600">{arasaacError}</p>}
                                    {arasaacResults.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs uppercase font-semibold text-slate-500">Resultados</p>
                                            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-auto pr-1">
                                                {arasaacResults.map(result => {
                                                    const displayKeyword = result.keywords?.[0]?.keyword;
                                                    const captionValue = arasaacCaptions[result._id] || '';
                                                    return (
                                                        <div key={result._id} className="border border-slate-200 rounded-lg bg-white shadow-xs overflow-hidden">
                                                            <div className="aspect-square bg-slate-50 flex items-center justify-center">
                                                                <img
                                                                    src={`https://static.arasaac.org/pictograms/${result._id}/${result._id}_500.png`}
                                                                    alt={displayKeyword || 'Pictograma ARASAAC'}
                                                                    className="max-h-40 object-contain"
                                                                />
                                                            </div>
                                                            <div className="p-2 space-y-2">
                                                                <p className="text-xs font-semibold text-slate-800 truncate flex items-center space-x-1">
                                                                    <MessageSquareText size={14} className="text-teal-600" />
                                                                    <span>{displayKeyword || 'Pictograma'}</span>
                                                                </p>
                                                                <input
                                                                    value={captionValue}
                                                                    onChange={(e) => handleArasaacCaptionChange(result._id, e.target.value)}
                                                                    placeholder="Texto debajo de la imagen (opcional)"
                                                                    className="w-full border border-slate-300 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                                />
                                                                <button
                                                                    onClick={() => handleImportArasaac(result)}
                                                                    className="w-full text-center px-2 py-1 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800"
                                                                >
                                                                    Añadir a la actividad
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">Audio de modelo</p>
                                        <p className="text-xs text-slate-500">Grabación rápida para actividades de habla o prosodia.</p>
                                    </div>
                                    <button
                                        onClick={handleToggleRecording}
                                        disabled={!audioSupported}
                                        className={clsx(
                                            'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
                                            isRecording ? 'bg-red-100 text-red-700' : 'bg-teal-600 text-white hover:bg-teal-700',
                                            !audioSupported && 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        {isRecording ? <Pause size={16} /> : <Mic size={16} />}
                                        <span>{!audioSupported ? 'Micrófono no disponible' : isRecording ? 'Detener' : 'Grabar'}</span>
                                    </button>
                                </div>
                            </div>

                            {assetQueue.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <p className="text-xs uppercase text-slate-500 font-semibold">Recursos añadidos</p>
                                    {assetQueue.map(asset => (
                                        <div key={asset.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                            <div className="flex items-center space-x-2 text-sm text-slate-700">
                                                {asset.type === 'image' && <ImageIcon size={16} className="text-teal-500" />}
                                                {asset.type === 'audio' && <Music size={16} className="text-teal-500" />}
                                                {asset.type === 'label' && <Tag size={16} className="text-teal-500" />}
                                                <span>{asset.caption || asset.name || asset.text || 'Recurso'}</span>
                                            </div>
                                            <button onClick={() => handleRemoveAsset(asset.id)} className="text-slate-400 hover:text-slate-700">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSaveActivity}
                            className="w-full flex items-center justify-center space-x-2 bg-teal-600 text-white px-4 py-3 rounded-lg font-semibold shadow-sm hover:bg-teal-700"
                        >
                            <Save size={18} />
                            <span>Guardar actividad</span>
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredActivities?.map(activity => {
                            const categoryMeta = ACTIVITY_CATEGORIES.find(cat => cat.id === activity.category);
                            return (
                                <div key={activity.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-3 hover:border-teal-400 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-teal-600 font-bold">{categoryMeta?.name}</p>
                                            <h3 className="text-lg font-semibold text-slate-900">{activity.title}</h3>
                                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{activity.goal || 'Objetivo no definido aún'}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 text-slate-500 text-xs">
                                            <Activity size={16} />
                                            <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {activity.instructions && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700">
                                            <p className="font-medium text-slate-800 flex items-center space-x-2 mb-1"><ClipboardList size={14} /><span>Instrucciones</span></p>
                                            <p className="whitespace-pre-line leading-relaxed">{activity.instructions}</p>
                                        </div>
                                    )}

                                    {activity.assets?.length > 0 && (
                                        <div className="space-y-3">
                                            {activity.assets.some(asset => asset.type === 'image') && (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {activity.assets.filter(asset => asset.type === 'image').map(asset => (
                                                        <div key={asset.id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                                            <div className="aspect-video bg-white flex items-center justify-center">
                                                                <img src={asset.src} alt={asset.caption || asset.name || 'Imagen de actividad'} className="object-contain max-h-40" />
                                                            </div>
                                                            {(asset.caption || asset.name) && (
                                                                <p className="text-xs text-slate-700 px-2 py-1 border-t border-slate-200 bg-white">{asset.caption || asset.name}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-2">
                                                {activity.assets.map(asset => (
                                                    <span
                                                        key={asset.id}
                                                        className={clsx(
                                                            'px-3 py-1 rounded-full text-xs font-medium border',
                                                            asset.type === 'image' && 'border-teal-200 text-teal-700 bg-teal-50',
                                                            asset.type === 'audio' && 'border-amber-200 text-amber-700 bg-amber-50',
                                                            asset.type === 'label' && 'border-slate-200 text-slate-700 bg-slate-50'
                                                        )}
                                                    >
                                                        {asset.type === 'image' && (asset.caption || asset.name || '📷 Imagen')}
                                                        {asset.type === 'audio' && '🎙️ Audio'}
                                                        {asset.type === 'label' && asset.text}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {(!filteredActivities || filteredActivities.length === 0) && (
                            <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-500">
                                <p className="font-medium text-slate-700">Aún no hay actividades registradas</p>
                                <p className="text-sm mt-1">Crea tu primera actividad con imágenes, rótulos y audio para reutilizar en sesiones.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
