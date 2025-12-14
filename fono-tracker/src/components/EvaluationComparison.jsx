import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { X, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

export function EvaluationComparison({ patientId, onClose }) {
    const [selectedEval1, setSelectedEval1] = useState(null);
    const [selectedEval2, setSelectedEval2] = useState(null);

    // Fetch all evaluations for this patient
    const evaluations = useLiveQuery(
        () => db.evaluations
            .where('patientId')
            .equals(patientId)
            .sortBy('date'),
        [patientId]
    );

    if (!evaluations) return null;

    // Group evaluations by type
    const evalsByType = {};
    evaluations.forEach(ev => {
        if (!evalsByType[ev.type]) {
            evalsByType[ev.type] = [];
        }
        evalsByType[ev.type].push(ev);
    });

    // Get available types (only those with 2+ evaluations)
    const availableTypes = Object.keys(evalsByType).filter(type => evalsByType[type].length >= 2);

    const handleTypeSelect = (type) => {
        const evals = evalsByType[type];
        if (evals.length >= 2) {
            setSelectedEval1(evals[0]);
            setSelectedEval2(evals[evals.length - 1]); // Most recent
        }
    };

    const calculateDelta = (val1, val2) => {
        if (typeof val1 !== 'number' || typeof val2 !== 'number') return null;
        return val2 - val1;
    };

    const getDeltaIcon = (delta) => {
        if (delta === null || delta === 0) return <Minus size={16} className="text-slate-400" />;
        if (delta > 0) return <TrendingUp size={16} className="text-green-600" />;
        return <TrendingDown size={16} className="text-red-600" />;
    };

    const getDeltaColor = (delta) => {
        if (delta === null || delta === 0) return 'text-slate-600';
        if (delta > 0) return 'text-green-600';
        return 'text-red-600';
    };

    const renderComparison = () => {
        if (!selectedEval1 || !selectedEval2) {
            return (
                <div className="text-center py-12 text-slate-500">
                    <p>Selecciona un tipo de evaluación para comparar</p>
                </div>
            );
        }

        const data1 = selectedEval1.data || {};
        const data2 = selectedEval2.data || {};

        // Prepare data for radar chart
        const radarData = [];
        Object.keys(data1).forEach(key => {
            if (typeof data1[key] === 'number' && typeof data2[key] === 'number') {
                radarData.push({
                    area: key.replace(/_/g, ' '),
                    eval1: data1[key],
                    eval2: data2[key]
                });
            }
        });

        return (
            <div className="space-y-6">
                {/* Header with dates */}
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">Evaluación 1</p>
                        <p className="font-semibold text-slate-900">
                            {new Date(selectedEval1.date).toLocaleDateString('es-CL')}
                        </p>
                    </div>
                    <div className="text-center flex items-center justify-center">
                        <span className="text-2xl">→</span>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-1">Evaluación 2</p>
                        <p className="font-semibold text-slate-900">
                            {new Date(selectedEval2.date).toLocaleDateString('es-CL')}
                        </p>
                    </div>
                </div>

                {/* Radar Chart */}
                {radarData.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Comparación Visual</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <RadarChart data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="area" />
                                <PolarRadiusAxis />
                                <Radar name="Evaluación 1" dataKey="eval1" stroke="#0891b2" fill="#0891b2" fillOpacity={0.3} />
                                <Radar name="Evaluación 2" dataKey="eval2" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Table Comparison */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Área</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Eval 1</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Eval 2</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Δ</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700">Cambio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {Object.keys(data1).map(key => {
                                const val1 = data1[key];
                                const val2 = data2[key];
                                const delta = calculateDelta(val1, val2);

                                if (typeof val1 !== 'number') return null;

                                const percentChange = val1 !== 0 ? ((delta / val1) * 100).toFixed(1) : 0;
                                const isRegression = delta < -1; // Regression if drops more than 1 point

                                return (
                                    <tr key={key} className={clsx(
                                        "hover:bg-slate-50",
                                        isRegression && "bg-red-50"
                                    )}>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                            {key.replace(/_/g, ' ')}
                                            {isRegression && (
                                                <AlertTriangle size={14} className="inline ml-2 text-red-600" />
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-slate-700">{val1}</td>
                                        <td className="px-4 py-3 text-center text-sm text-slate-700">{val2}</td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                {getDeltaIcon(delta)}
                                                <span className={clsx("text-sm font-semibold", getDeltaColor(delta))}>
                                                    {delta !== null ? (delta > 0 ? `+${delta}` : delta) : '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={clsx("text-xs font-medium", getDeltaColor(delta))}>
                                                {delta !== null && delta !== 0 ? `${percentChange > 0 ? '+' : ''}${percentChange}%` : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Interpretation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Interpretación Automática</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        {radarData.filter(d => d.eval2 > d.eval1).length > 0 && (
                            <li>✅ Se observa progreso en {radarData.filter(d => d.eval2 > d.eval1).length} área(s)</li>
                        )}
                        {radarData.filter(d => d.eval2 < d.eval1).length > 0 && (
                            <li>⚠️ Se observa regresión en {radarData.filter(d => d.eval2 < d.eval1).length} área(s)</li>
                        )}
                        {radarData.filter(d => d.eval2 === d.eval1).length > 0 && (
                            <li>➖ Sin cambios en {radarData.filter(d => d.eval2 === d.eval1).length} área(s)</li>
                        )}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Comparación de Evaluaciones</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {availableTypes.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <p>No hay suficientes evaluaciones para comparar.</p>
                            <p className="text-sm mt-2">Se necesitan al menos 2 evaluaciones del mismo tipo.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Type Selector */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Selecciona el tipo de evaluación a comparar:
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {availableTypes.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => handleTypeSelect(type)}
                                            className={clsx(
                                                "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                                                selectedEval1?.type === type
                                                    ? "border-teal-500 bg-teal-50 text-teal-900"
                                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                            )}
                                        >
                                            {type.toUpperCase()}
                                            <span className="block text-xs text-slate-500 mt-1">
                                                {evalsByType[type].length} evaluaciones
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comparison Content */}
                            {renderComparison()}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
