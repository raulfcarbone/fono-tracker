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
    ClipboardList
} from 'lucide-react';
import clsx from 'clsx';
import { ArasaacPicker } from '../components/ArasaacPicker';
import { pictoUrl } from '../services/arasaac';

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

    const [selectedArasaac, setSelectedArasaac] = useState(null);

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

    const handleSelectArasaac = (pictogram) => {
        if (!pictogram?.id) return;
        setSelectedArasaac({ id: pictogram.id, caption: pictogram.caption, keyword: pictogram.keyword });
        setAssetQueue(prev => {
            const withoutPrevious = prev.filter(asset => asset.origin !== 'arasaac');
            return [
                ...withoutPrevious,
                {
                    id: crypto.randomUUID(),
                    type: 'image',
                    origin: 'arasaac',
                    arasaacPictoId: pictogram.id,
                    name: pictogram.keyword || 'Imagen ARASAAC',
                    caption: pictogram.caption || pictogram.keyword,
                    src: pictogram.url,
                }
            ];
        });
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
            arasaacPictoId: selectedArasaac?.id
                || assetQueue.find(a => a.origin === 'arasaac' && a.arasaacPictoId)?.arasaacPictoId
                || null,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        setTitle('');
        setGoal('');
        setInstructions('');
        setAssetQueue([]);
        setSelectedArasaac(null);
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

                                <ArasaacPicker
                                    selectedId={selectedArasaac?.id}
                                    onSelect={handleSelectArasaac}
                                />

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
                            const arasaacPictoId = activity.arasaacPictoId
                                || activity.assets?.find(asset => asset.origin === 'arasaac' && asset.arasaacPictoId)?.arasaacPictoId;
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

                                    {(arasaacPictoId || activity.assets?.length > 0) && (
                                        <div className="space-y-3">
                                            {arasaacPictoId && (
                                                <div className="flex items-center space-x-3 bg-teal-50 border border-teal-200 rounded-lg p-3">
                                                    <div className="w-16 h-16 bg-white border border-teal-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={pictoUrl(arasaacPictoId, 300)}
                                                            alt="Pictograma ARASAAC"
                                                            className="max-h-14 object-contain"
                                                        />
                                                    </div>
                                                    <div className="text-sm text-slate-700">
                                                        <p className="font-semibold text-slate-900">Pictograma ARASAAC</p>
                                                        <p className="text-xs text-slate-600">Añadido para exportar o enviar como tarea.</p>
                                                    </div>
                                                </div>
                                            )}
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
