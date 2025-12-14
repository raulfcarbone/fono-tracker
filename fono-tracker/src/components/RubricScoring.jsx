import React from 'react';
import clsx from 'clsx';
import { Info } from 'lucide-react';

/**
 * RubricScoring Component
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of rubric items (from scales file)
 * @param {Object} props.value - Current scores { [itemId]: score }
 * @param {Function} props.onChange - Callback (newData) => void
 * @param {Boolean} props.readOnly
 */
export function RubricScoring({ items, value = {}, onChange, readOnly = false }) {

    const handleScore = (itemId, score) => {
        if (readOnly) return;
        onChange({
            ...value,
            [itemId]: { score }
        });
    };

    const SCORES = [1, 1.5, 2, 2.5, 3, 3.5, 4];

    return (
        <div className="space-y-12">
            {items.map((item) => {
                const currentScore = value[item.id]?.score;

                return (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-slate-50 p-4 border-b border-slate-200">
                            <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">{item.description}</p>
                        </div>

                        {/* Levels Grid */}
                        <div className="grid md:grid-cols-2 gap-4 p-6">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={clsx(
                                        "p-4 rounded-lg border-2 transition-all cursor-pointer relative",
                                        readOnly ? "cursor-default" : "hover:border-blue-300",
                                        // Highlight if this specific integer level is selected
                                        currentScore === level
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                            : "border-slate-100 bg-white"
                                    )}
                                    // Clicking the card selects the integer value
                                    onClick={() => handleScore(item.id, level)}
                                >
                                    <div className="flex items-start mb-2">
                                        <div className={clsx(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0",
                                            currentScore === level ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-600"
                                        )}>
                                            {level}
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide pt-1">
                                            {item.levels[level].split(':')[0]}
                                        </p>
                                    </div>
                                    <p className="text-sm text-slate-600 pl-9">
                                        {item.levels[level].split(':').slice(1).join(':').trim()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Precise Score Selector Bar */}
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                            <span className="text-sm font-semibold text-slate-700">Puntaje Asignado:</span>

                            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                                {SCORES.map((score) => {
                                    const isSelected = currentScore === score;
                                    const isInteger = Number.isInteger(score);
                                    return (
                                        <button
                                            key={score}
                                            onClick={() => handleScore(item.id, score)}
                                            disabled={readOnly}
                                            className={clsx(
                                                "px-4 py-2 rounded-md text-sm font-bold transition-all relative",
                                                isSelected
                                                    ? "bg-blue-600 text-white shadow-sm z-10"
                                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                                                !isInteger && !isSelected && "text-slate-400 font-normal" // Make .5s more subtle
                                            )}
                                            title={!isInteger ? `Puntaje intermedio ${score}` : `Puntaje ${score}`}
                                        >
                                            {score}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Score Display */}
                            <div className="w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center font-bold text-lg text-slate-700 bg-white">
                                {currentScore || '-'}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
