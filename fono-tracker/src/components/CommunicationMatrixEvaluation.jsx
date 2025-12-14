import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { COMMUNICATION_FUNCTIONS, BEHAVIOR_LEVELS, COMMUNICATION_MATRIX_LEVELS } from '../lib/communication_matrix_scales';

/**
 * Communication Matrix Evaluation Component
 * 
 * Evaluación con pestañas desplegables por función comunicativa,
 * columnas para niveles I-VII, y código de colores (blanco/amarillo/verde)
 * 
 * @param {Object} props
 * @param {Object} props.value - Datos { [functionId]: { [levelId]: { score: number, forms: string } } }
 * @param {Function} props.onChange - Handler para cambios
 * @param {boolean} props.readOnly - Modo solo lectura
 */
export function CommunicationMatrixEvaluation({ value = {}, onChange, readOnly = false }) {
    const [expandedFunctions, setExpandedFunctions] = useState({});

    const toggleFunction = (functionId) => {
        setExpandedFunctions(prev => ({
            ...prev,
            [functionId]: !prev[functionId]
        }));
    };

    const handleScoreChange = (functionId, levelId, score) => {
        if (readOnly) return;

        const currentFunction = value[functionId] || {};
        const currentLevel = currentFunction[levelId] || {};

        onChange({
            ...value,
            [functionId]: {
                ...currentFunction,
                [levelId]: {
                    ...currentLevel,
                    score: parseInt(score)
                }
            }
        });
    };

    const handleFormsChange = (functionId, levelId, forms) => {
        if (readOnly) return;

        const currentFunction = value[functionId] || {};
        const currentLevel = currentFunction[levelId] || {};

        onChange({
            ...value,
            [functionId]: {
                ...currentFunction,
                [levelId]: {
                    ...currentLevel,
                    forms
                }
            }
        });
    };

    const getScoreColor = (score) => {
        const level = COMMUNICATION_MATRIX_LEVELS.find(l => l.value === score);
        if (!level) return { bg: 'bg-white', border: 'border-gray-300', text: 'text-gray-700' };

        if (score === 0) return { bg: 'bg-white', border: 'border-gray-300', text: 'text-gray-700' };
        if (score === 1) return { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-900' };
        if (score === 2) return { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-900' };

        return { bg: 'bg-white', border: 'border-gray-300', text: 'text-gray-700' };
    };

    // Calcular estadísticas de progreso
    const getProgressStats = () => {
        let totalCells = 0;
        let filledCells = 0;
        let emergentCount = 0;
        let dominatedCount = 0;

        COMMUNICATION_FUNCTIONS.forEach(func => {
            BEHAVIOR_LEVELS.forEach(level => {
                totalCells++;
                const score = value[func.id]?.[level.id]?.score;
                if (score !== undefined && score !== '') {
                    filledCells++;
                    if (score === 1) emergentCount++;
                    if (score === 2) dominatedCount++;
                }
            });
        });

        return {
            totalCells,
            filledCells,
            percentage: totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0,
            emergentCount,
            dominatedCount
        };
    };

    const stats = getProgressStats();

    return (
        <div className="space-y-6">
            {/* Progress Summary */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 mb-3">Resumen de Evaluación</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center border border-purple-100">
                        <p className="text-xs text-purple-600 font-semibold uppercase">Progreso</p>
                        <p className="text-2xl font-bold text-purple-800">{stats.percentage}%</p>
                        <p className="text-xs text-purple-500">{stats.filledCells} / {stats.totalCells}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-purple-100">
                        <p className="text-xs text-purple-600 font-semibold uppercase">No Presente</p>
                        <p className="text-2xl font-bold text-gray-600">{stats.filledCells - stats.emergentCount - stats.dominatedCount}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                        <p className="text-xs text-yellow-700 font-semibold uppercase">Emergente</p>
                        <p className="text-2xl font-bold text-yellow-800">{stats.emergentCount}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                        <p className="text-xs text-green-700 font-semibold uppercase">Dominado</p>
                        <p className="text-2xl font-bold text-green-800">{stats.dominatedCount}</p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-bold text-slate-700 mb-2 text-sm">Clave de Colores:</h4>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
                        <span className="text-slate-600">No presente</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-400 rounded"></div>
                        <span className="text-slate-600">Emergente</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded"></div>
                        <span className="text-slate-600">Dominado</span>
                    </div>
                </div>
            </div>

            {/* Communication Functions - Collapsible Tabs */}
            <div className="space-y-3">
                {COMMUNICATION_FUNCTIONS.map((func) => {
                    const isExpanded = expandedFunctions[func.id];
                    const functionData = value[func.id] || {};

                    // Count filled cells for this function
                    const filledInFunction = BEHAVIOR_LEVELS.filter(
                        level => functionData[level.id]?.score !== undefined && functionData[level.id]?.score !== ''
                    ).length;

                    return (
                        <div key={func.id} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Tab Header */}
                            <button
                                onClick={() => toggleFunction(func.id)}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                                disabled={readOnly && filledInFunction === 0}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                                            {func.code}
                                        </span>
                                        <h3 className="font-bold text-slate-800">{func.title}</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">{func.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-slate-500">
                                            {func.category} • {func.subcategory}
                                        </span>
                                        {filledInFunction > 0 && (
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                                                {filledInFunction} / {BEHAVIOR_LEVELS.length} niveles evaluados
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="text-slate-400" size={20} />
                                ) : (
                                    <ChevronDown className="text-slate-400" size={20} />
                                )}
                            </button>

                            {/* Tab Content */}
                            {isExpanded && (
                                <div className="p-4 bg-white border-t border-slate-200">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-sm">
                                            <thead>
                                                <tr className="bg-slate-100">
                                                    {BEHAVIOR_LEVELS.map(level => (
                                                        <th key={level.id} className="p-3 border border-slate-200 min-w-[180px]">
                                                            <div className="text-center">
                                                                <div className="font-bold text-purple-800">{level.id}</div>
                                                                <div className="text-xs text-slate-600 mt-1 font-normal">
                                                                    {level.title.split(' - ')[1] || level.title}
                                                                </div>
                                                                <div className="text-xs text-slate-500 mt-1 font-normal">
                                                                    {level.ageRange}
                                                                </div>
                                                            </div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Row 1: Examples */}
                                                <tr className="bg-slate-50">
                                                    {BEHAVIOR_LEVELS.map(level => {
                                                        const levelInfo = func.levels[level.id];
                                                        return (
                                                            <td key={level.id} className="p-3 border border-slate-200 align-top">
                                                                <div className="text-xs text-slate-600">
                                                                    <p className="font-semibold text-slate-700 mb-1">Ejemplos:</p>
                                                                    <p className="italic">{levelInfo?.examples || 'N/A'}</p>
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>

                                                {/* Row 2: Score Selection */}
                                                <tr>
                                                    {BEHAVIOR_LEVELS.map(level => {
                                                        const cellData = functionData[level.id] || {};
                                                        const score = cellData.score;
                                                        const colors = getScoreColor(score);

                                                        return (
                                                            <td key={level.id} className="p-3 border border-slate-200 align-top">
                                                                {readOnly ? (
                                                                    <div className={clsx(
                                                                        'p-2 rounded-lg border-2 text-center font-semibold',
                                                                        colors.bg,
                                                                        colors.border,
                                                                        colors.text
                                                                    )}>
                                                                        {score !== undefined && score !== ''
                                                                            ? COMMUNICATION_MATRIX_LEVELS.find(l => l.value === score)?.label
                                                                            : '-'}
                                                                    </div>
                                                                ) : (
                                                                    <select
                                                                        value={score !== undefined ? score : ''}
                                                                        onChange={(e) => handleScoreChange(func.id, level.id, e.target.value)}
                                                                        className={clsx(
                                                                            'w-full p-2 rounded-lg border-2 font-semibold text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-colors',
                                                                            colors.bg,
                                                                            colors.border,
                                                                            colors.text
                                                                        )}
                                                                    >
                                                                        <option value="">Seleccionar...</option>
                                                                        {COMMUNICATION_MATRIX_LEVELS.map(lvl => (
                                                                            <option key={lvl.value} value={lvl.value}>
                                                                                {lvl.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>

                                                {/* Row 3: Communication Forms */}
                                                <tr>
                                                    {BEHAVIOR_LEVELS.map(level => {
                                                        const cellData = functionData[level.id] || {};
                                                        const forms = cellData.forms || '';

                                                        return (
                                                            <td key={level.id} className="p-3 border border-slate-200 align-top">
                                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                                                                    Formas Comunicativas:
                                                                </label>
                                                                {readOnly ? (
                                                                    <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded min-h-[60px]">
                                                                        {forms || <span className="text-slate-400 italic">Sin descripción</span>}
                                                                    </p>
                                                                ) : (
                                                                    <textarea
                                                                        value={forms}
                                                                        onChange={(e) => handleFormsChange(func.id, level.id, e.target.value)}
                                                                        placeholder="Describa las formas comunicativas observadas..."
                                                                        rows={3}
                                                                        className="w-full p-2 border border-slate-300 rounded-lg text-sm resize-y min-h-[60px] focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                                    />
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Instructions */}
            {!readOnly && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">Instrucciones:</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Haga clic en cada función comunicativa para expandir la tabla de evaluación</li>
                        <li>Para cada nivel (I-VII), seleccione si la conducta está: No presente, Emergente, o Dominada</li>
                        <li>Describa las formas comunicativas específicas que observó (gestos, vocalizaciones, palabras, etc.)</li>
                        <li>El código de colores le ayudará a visualizar rápidamente el progreso del paciente</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
