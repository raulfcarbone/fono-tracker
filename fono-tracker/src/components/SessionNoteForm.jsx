import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import {
    PREDEFINED_ACTIVITIES,
    SESSION_TYPES,
    PERFORMANCE_LEVELS,
    COLLABORATION_LEVELS,
    ATTENTION_LEVELS
} from '../lib/session_activities';
import { Save, X, Clock, Play, Pause, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export function SessionNoteForm({ patientId, onClose, onSave }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        sessionType: 'terapia',
        duration: 0,
        objectivesWorked: [], // Array of {objectiveId, performance}
        activities: [], // Array of activity IDs
        otherActivity: '',
        generalPerformance: 3,
        behavioralObservations: '',
        collaborationLevel: 3,
        attentionLevel: 3,
        homework: '',
        nextSteps: ''
    });

    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerStart, setTimerStart] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Fetch patient objectives
    const objectives = useLiveQuery(
        () => db.objectives.where('patientId').equals(patientId).toArray(),
        [patientId]
    );

    // Timer effect
    useEffect(() => {
        let interval;
        if (isTimerRunning && timerStart) {
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - timerStart) / 1000);
                setElapsedTime(elapsed);
                setFormData(prev => ({ ...prev, duration: elapsed }));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerStart]);

    const handleStartTimer = () => {
        setTimerStart(Date.now() - (elapsedTime * 1000));
        setIsTimerRunning(true);
    };

    const handlePauseTimer = () => {
        setIsTimerRunning(false);
    };

    const handleObjectiveToggle = (objectiveId) => {
        setFormData(prev => {
            const exists = prev.objectivesWorked.find(o => o.objectiveId === objectiveId);
            if (exists) {
                return {
                    ...prev,
                    objectivesWorked: prev.objectivesWorked.filter(o => o.objectiveId !== objectiveId)
                };
            } else {
                return {
                    ...prev,
                    objectivesWorked: [...prev.objectivesWorked, { objectiveId, performance: 3 }]
                };
            }
        });
    };

    const handleObjectivePerformance = (objectiveId, performance) => {
        setFormData(prev => ({
            ...prev,
            objectivesWorked: prev.objectivesWorked.map(o =>
                o.objectiveId === objectiveId ? { ...o, performance } : o
            )
        }));
    };

    const handleActivityToggle = (activityId) => {
        setFormData(prev => {
            const exists = prev.activities.includes(activityId);
            if (exists) {
                return {
                    ...prev,
                    activities: prev.activities.filter(a => a !== activityId)
                };
            } else {
                return {
                    ...prev,
                    activities: [...prev.activities, activityId]
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Save session note
        const sessionNoteId = await db.sessions.add({
            patientId,
            date: new Date(`${formData.date}T${formData.time}`),
            sessionType: formData.sessionType,
            duration: formData.duration,
            activities: formData.activities,
            otherActivity: formData.otherActivity,
            generalPerformance: formData.generalPerformance,
            behavioralObservations: formData.behavioralObservations,
            collaborationLevel: formData.collaborationLevel,
            attentionLevel: formData.attentionLevel,
            homework: formData.homework,
            nextSteps: formData.nextSteps,
            createdAt: new Date()
        });

        // Save objective performance scores
        for (const obj of formData.objectivesWorked) {
            await db.scores.add({
                sessionId: sessionNoteId,
                objectiveId: obj.objectiveId,
                performance: obj.performance,
                date: new Date(`${formData.date}T${formData.time}`)
            });
        }

        if (onSave) onSave();
        onClose();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Registro de Sesión</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="session-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: Session Info */}
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                <Clock className="mr-2 text-teal-600" size={20} />
                                Información de Sesión
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full rounded-lg border-slate-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                        className="w-full rounded-lg border-slate-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de sesión</label>
                                    <select
                                        value={formData.sessionType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sessionType: e.target.value }))}
                                        className="w-full rounded-lg border-slate-300"
                                    >
                                        {SESSION_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Timer */}
                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Duración</label>
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl font-mono font-bold text-teal-600">
                                            {formatTime(elapsedTime)}
                                        </div>
                                        {!isTimerRunning ? (
                                            <button
                                                type="button"
                                                onClick={handleStartTimer}
                                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                            >
                                                <Play size={16} />
                                                Iniciar
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handlePauseTimer}
                                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                            >
                                                <Pause size={16} />
                                                Pausar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Objectives Worked */}
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                <CheckCircle2 className="mr-2 text-teal-600" size={20} />
                                Objetivos Trabajados
                            </h3>
                            {objectives && objectives.length > 0 ? (
                                <div className="space-y-3">
                                    {objectives.map(objective => {
                                        const isWorked = formData.objectivesWorked.find(o => o.objectiveId === objective.id);
                                        const performance = isWorked?.performance || 3;

                                        return (
                                            <div
                                                key={objective.id}
                                                className={clsx(
                                                    "p-4 rounded-lg border-2 transition-all",
                                                    isWorked
                                                        ? "border-teal-300 bg-teal-50"
                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!isWorked}
                                                        onChange={() => handleObjectiveToggle(objective.id)}
                                                        className="mt-1 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
                                                                    {objective.area}
                                                                </span>
                                                                <p className="text-sm font-medium text-slate-900 mt-1">
                                                                    {objective.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {isWorked && (
                                                            <div className="mt-3">
                                                                <label className="block text-xs font-medium text-slate-600 mb-2">
                                                                    Desempeño en esta sesión:
                                                                </label>
                                                                <div className="flex gap-2">
                                                                    {PERFORMANCE_LEVELS.map(level => (
                                                                        <button
                                                                            key={level.value}
                                                                            type="button"
                                                                            onClick={() => handleObjectivePerformance(objective.id, level.value)}
                                                                            className={clsx(
                                                                                "flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                                                                                performance === level.value
                                                                                    ? "border-teal-500 bg-teal-100 text-teal-900"
                                                                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                                                            )}
                                                                        >
                                                                            <div className="text-lg">{level.emoji}</div>
                                                                            <div className="text-xs mt-1">{level.label}</div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm">No hay objetivos definidos para este paciente.</p>
                            )}
                        </div>

                        {/* Section 3: Activities */}
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Actividades Realizadas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {PREDEFINED_ACTIVITIES.map(activity => (
                                    <label
                                        key={activity.id}
                                        className={clsx(
                                            "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                                            formData.activities.includes(activity.id)
                                                ? "border-teal-300 bg-teal-50"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.activities.includes(activity.id)}
                                            onChange={() => handleActivityToggle(activity.id)}
                                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                        />
                                        <span className="text-xl">{activity.icon}</span>
                                        <span className="text-sm font-medium text-slate-700 flex-1">{activity.label}</span>
                                    </label>
                                ))}
                            </div>

                            {formData.activities.includes('otro') && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Especificar otra actividad:</label>
                                    <input
                                        type="text"
                                        value={formData.otherActivity}
                                        onChange={(e) => setFormData(prev => ({ ...prev, otherActivity: e.target.value }))}
                                        className="w-full rounded-lg border-slate-300"
                                        placeholder="Describe la actividad..."
                                    />
                                </div>
                            )}
                        </div>

                        {/* Section 4: Observations */}
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Observaciones</h3>

                            <div className="space-y-4">
                                {/* General Performance */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Desempeño General</label>
                                    <div className="flex gap-2">
                                        {PERFORMANCE_LEVELS.map(level => (
                                            <button
                                                key={level.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, generalPerformance: level.value }))}
                                                className={clsx(
                                                    "flex-1 px-4 py-3 rounded-lg border-2 transition-all",
                                                    formData.generalPerformance === level.value
                                                        ? "border-teal-500 bg-teal-100"
                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                )}
                                            >
                                                <div className="text-2xl">{level.emoji}</div>
                                                <div className="text-xs font-medium mt-1">{level.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Collaboration */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nivel de Colaboración</label>
                                    <select
                                        value={formData.collaborationLevel}
                                        onChange={(e) => setFormData(prev => ({ ...prev, collaborationLevel: parseInt(e.target.value) }))}
                                        className="w-full rounded-lg border-slate-300"
                                    >
                                        {COLLABORATION_LEVELS.map(level => (
                                            <option key={level.value} value={level.value}>
                                                {level.label} - {level.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Attention */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nivel de Atención</label>
                                    <select
                                        value={formData.attentionLevel}
                                        onChange={(e) => setFormData(prev => ({ ...prev, attentionLevel: parseInt(e.target.value) }))}
                                        className="w-full rounded-lg border-slate-300"
                                    >
                                        {ATTENTION_LEVELS.map(level => (
                                            <option key={level.value} value={level.value}>
                                                {level.label} - {level.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Behavioral Observations */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones Conductuales</label>
                                    <textarea
                                        rows={4}
                                        value={formData.behavioralObservations}
                                        onChange={(e) => setFormData(prev => ({ ...prev, behavioralObservations: e.target.value }))}
                                        className="w-full rounded-lg border-slate-300"
                                        placeholder="Describe el comportamiento, motivación, estado emocional, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Homework */}
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Tareas para Casa</h3>
                            <textarea
                                rows={4}
                                value={formData.homework}
                                onChange={(e) => setFormData(prev => ({ ...prev, homework: e.target.value }))}
                                className="w-full rounded-lg border-slate-300"
                                placeholder="Actividades o ejercicios recomendados para realizar en casa..."
                            />
                        </div>

                        {/* Section 6: Next Steps */}
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Próximos Pasos</h3>
                            <textarea
                                rows={3}
                                value={formData.nextSteps}
                                onChange={(e) => setFormData(prev => ({ ...prev, nextSteps: e.target.value }))}
                                className="w-full rounded-lg border-slate-300"
                                placeholder="Plan para la próxima sesión, objetivos a trabajar, materiales a preparar..."
                            />
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="session-form"
                        className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 font-medium shadow-lg shadow-teal-100"
                    >
                        <Save size={18} />
                        Guardar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
