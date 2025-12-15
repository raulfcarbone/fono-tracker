import React, { useState, useEffect } from 'react';
import { RUBRIC_DIMENSIONS, calculateGAS, GAS_LABELS } from '../lib/gas';
import clsx from 'clsx';
import { Info } from 'lucide-react';

export function RubricScorer({ onScoreChange, initialScores = {} }) {
    const [scores, setScores] = useState({
        quantitative: 0,
        qualitative: 0,
        support: 0,
        ecology: 0,
        ...initialScores
    });

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const gasScore = calculateGAS(totalScore);
    const gasLabel = GAS_LABELS[gasScore];

    useEffect(() => {
        onScoreChange && onScoreChange({ scores, totalScore, gasScore });
    }, [scores, totalScore, gasScore, onScoreChange]);

    return (
        <div className="space-y-8">
            {/* Score Summary Card */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Puntaje GAS Actual</h3>
                    <div className="mt-1 flex items-baseline space-x-3">
                        <span className={clsx(
                            "text-5xl font-bold",
                            gasScore >= 0 ? "text-teal-400" : "text-orange-400"
                        )}>
                            {gasScore > 0 ? `+${gasScore}` : gasScore}
                        </span>
                        <span className="text-xl font-medium text-slate-300">{gasLabel}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-slate-200">{totalScore} <span className="text-lg text-slate-500">/ 20</span></div>
                    <div className="text-slate-400 text-sm">Suma Rúbrica</div>
                </div>
            </div>

            {/* Rubric Grid */}
            <div className="grid gap-8">
                {RUBRIC_DIMENSIONS.map((dim) => (
                    <div key={dim.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center space-x-2 mb-4">
                            <h4 className="font-bold text-lg text-slate-900">{dim.label}</h4>
                            <div className="group relative">
                                <Info size={16} className="text-slate-400 cursor-help" />
                                <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded hidden group-hover:block z-10">
                                    {dim.description}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                            {dim.levels.map((level) => (
                                <button
                                    key={level.val}
                                    onClick={() => setScores(s => ({ ...s, [dim.id]: level.val }))}
                                    className={clsx(
                                        "flex flex-col p-3 rounded-lg border text-left transition-all h-full",
                                        scores[dim.id] === level.val
                                            ? "border-teal-500 bg-teal-50 ring-1 ring-teal-500"
                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <span className={clsx(
                                        "text-lg font-bold mb-1",
                                        scores[dim.id] === level.val ? "text-teal-700" : "text-slate-400"
                                    )}>
                                        {level.val}
                                    </span>
                                    <span className={clsx(
                                        "text-xs leading-tight",
                                        scores[dim.id] === level.val ? "text-teal-800" : "text-slate-600"
                                    )}>
                                        {level.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
