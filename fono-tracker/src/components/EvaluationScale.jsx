import React from 'react';
import clsx from 'clsx';

/**
 * Generic Evaluation Scale Component
 * 
 * @param {Object} props
 * @param {Object} props.value - Current values { [areaName]: { score: number, note: string } }
 * @param {Function} props.onChange - Handler for value updates
 * @param {boolean} props.readOnly - If true, displays in read-only mode
 * @param {Object} props.config - Configuration object
 * @param {Array<string>} props.config.areas - List of areas to evaluate
 * @param {Array<{value: number, label: string, description: string}>} props.config.levels - List of scoring levels
 * @param {Object} props.config.matrixDescriptions - Optional: Matrix [area][level] => description (for Derby)
 * @param {string} props.config.colorClass - Tailwind color class for highlights (default: teal)
 */
export function EvaluationScale({ value = {}, onChange, readOnly = false, config }) {

    if (!config) return <div className="text-red-500">Error: Configuración faltante para la escala.</div>;

    const { areas, levels, colorClass = "teal" } = config;

    const handleScoreChange = (area, score) => {
        if (readOnly) return;
        onChange({
            ...value,
            [area]: {
                ...value[area],
                score: parseInt(score)
            }
        });
    };

    const handleNoteChange = (area, note) => {
        if (readOnly) return;
        onChange({
            ...value,
            [area]: {
                ...value[area],
                note
            }
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-slate-100 text-slate-700 text-sm font-semibold border-b border-slate-200">
                        <th className="p-4 text-left w-1/3 min-w-[200px]">Competencia / Área</th>
                        <th className="p-4 text-left w-1/6 min-w-[150px]">Nivel</th>
                        <th className="p-4 text-left w-1/2">Observaciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {areas.map((area) => {
                        const areaData = value[area] || {};
                        const currentScore = areaData.score;

                        // Find label for current score
                        const currentLevel = levels.find(l => l.value === currentScore);

                        return (
                            <tr key={area} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 align-top">
                                    <span className="font-medium text-slate-800 block">{area}</span>
                                </td>
                                <td className="p-4 align-top">
                                    {readOnly ? (
                                        <div className={clsx(
                                            "inline-flex items-center px-3 py-1 rounded-full font-bold text-sm",
                                            `bg-${colorClass}-100 text-${colorClass}-800`
                                        )}>
                                            {currentScore !== undefined ? currentScore : '-'}
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <select
                                                value={currentScore !== undefined ? currentScore : ""}
                                                onChange={(e) => handleScoreChange(area, e.target.value)}
                                                className={clsx(
                                                    "w-full rounded-lg border-slate-300 bg-white focus:ring-2",
                                                    `focus:border-${colorClass}-500 focus:ring-${colorClass}-500`
                                                )}
                                            >
                                                <option value="">Seleccionar...</option>
                                                {levels.map((level) => (
                                                    <option key={level.value} value={level.value}>
                                                        {level.value} - {level.label.split('-')[1]?.trim() || level.label}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Logic for Matrix Descriptions (Derby) vs Standard Levels (ASHA/DAGG) */}
                                            {config.matrixDescriptions ? (
                                                currentScore !== undefined && (
                                                    <p className="text-xs text-slate-500 mt-1 leading-tight bg-slate-50 p-2 rounded border border-slate-100">
                                                        {config.matrixDescriptions[area]?.[currentScore] || "Sin descripción"}
                                                    </p>
                                                )
                                            ) : (
                                                currentLevel && (
                                                    <p className="text-xs text-slate-500 mt-1 leading-tight">
                                                        {currentLevel.description}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 align-top">
                                    {readOnly ? (
                                        <p className="text-slate-600 whitespace-pre-wrap">{areaData.note || '-'}</p>
                                    ) : (
                                        <textarea
                                            value={areaData.note || ""}
                                            onChange={(e) => handleNoteChange(area, e.target.value)}
                                            placeholder="Descripción o porcentaje..."
                                            rows={2}
                                            className={clsx(
                                                "w-full rounded-lg border-slate-300 text-sm resize-y min-h-[80px] focus:ring-2",
                                                `focus:border-${colorClass}-500 focus:ring-${colorClass}-500`
                                            )}
                                        />
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
