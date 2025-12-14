import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { EvaluationScale } from './EvaluationScale';
import { BooleanChecklistMatrix } from './BooleanChecklistMatrix';

// Scales
import { FCM_AREAS, FCM_LEVELS } from '../lib/fcm_scales';
import { DAGG2_AREAS, DAGG2_LEVELS } from '../lib/dagg2_scales';
import { ICS_QUESTIONS, ICS_LEVELS } from '../lib/ics_scales';
import { DERBY_AREAS, DERBY_LEVELS, DERBY_DESCRIPTIONS } from '../lib/derby_scales';
import { WETHERBY_FUNCTIONS, WETHERBY_FORMS } from '../lib/wetherby_scales';
import { CASBY_SECTIONS, CASBY_LEVELS } from '../lib/casby_scales';
import { CELF_TABLES } from '../lib/celf5_scales';
import { CARS2_HF_ITEMS, getCars2Stats, INTERPRETATION_RANGES } from '../lib/cars2_hf_scales';
import { CARS2_ST_ITEMS, getCars2StStats as getStStats } from '../lib/cars2_st_scales';
import { PRAGMATICS_SECTIONS, PRAGMATICS_LEVELS, getPragmaticsStats } from '../lib/celf5_pragmatics_scales';
import { PLS5_TABLE } from '../lib/pls5_scales';
import { DescriptiveList } from './DescriptiveList';
import { ManualTable } from './ManualTable';
import { RubricScoring } from './RubricScoring';

import { Plus, ChevronLeft, Calendar, Save, Trash2, BarChart2, FileText, CheckSquare, MessageCircle, Activity, Gamepad2, BookOpen, BrainCircuit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis, Cell, ReferenceArea } from 'recharts';
import clsx from 'clsx';

const EVAL_TYPES = {
    asha: {
        id: 'asha',
        label: 'ASHA FCM',
        color: 'teal',
        icon: Activity,
        config: { areas: FCM_AREAS, levels: FCM_LEVELS, colorClass: 'teal' }
    },
    dagg2: {
        id: 'dagg2',
        label: 'DAGG-2',
        color: 'indigo',
        icon: MessageCircle,
        config: { areas: DAGG2_AREAS, levels: DAGG2_LEVELS, colorClass: 'indigo' }
    },
    ics: {
        id: 'ics',
        label: 'ICS (Inteligibilidad)',
        color: 'rose',
        icon: MessageCircle,
        config: { areas: ICS_QUESTIONS, levels: ICS_LEVELS, colorClass: 'rose' }
    },
    celf5: {
        id: 'celf5',
        label: 'CELF-5',
        color: 'violet',
        icon: BookOpen,
        type: 'manual'
    },
    cars2_hf: {
        id: 'cars2_hf',
        label: 'CARS-2 HF',
        color: 'cyan',
        icon: BrainCircuit,
        type: 'rubric'
    },
    cars2_st: {
        id: 'cars2_st',
        label: 'CARS-2 ST',
        color: 'teal',
        icon: BrainCircuit,
        type: 'rubric'
    },
    celf5_pragmatics: {
        id: 'celf5_pragmatics',
        label: 'CELF-5 Pragmática',
        color: 'indigo',
        icon: MessageCircle,
        type: 'checklist'
    },
    pls5: {
        id: 'pls5',
        label: 'PLS-5',
        color: 'pink',
        icon: FileText,
        type: 'manual_table',
        config: PLS5_TABLE
    },

    derby: {
        id: 'derby',
        label: 'Protocolo Derby',
        color: 'amber',
        icon: FileText,
        config: { areas: DERBY_AREAS, levels: DERBY_LEVELS, colorClass: 'amber', matrixDescriptions: DERBY_DESCRIPTIONS }
    },
    wetherby: {
        id: 'wetherby',
        label: 'Checklist Wetherby',
        color: 'blue',
        icon: CheckSquare,
        type: 'checklist' // Special type
    },
    casby: {
        id: 'casby',
        label: 'Escala Casby (Juego)',
        color: 'orange',
        icon: Gamepad2,
        type: 'descriptive',
        config: { sections: CASBY_SECTIONS, levels: CASBY_LEVELS }
    }
};

export function PatientEvaluations({ patientId }) {
    const [mode, setMode] = useState('list'); // 'list', 'create', 'view', 'progress'
    const [selectedType, setSelectedType] = useState('asha'); // 'asha', 'dagg2', 'ics', 'derby', 'wetherby', 'casby'
    const [viewingEvaluation, setViewingEvaluation] = useState(null);
    const [newEvaluationData, setNewEvaluationData] = useState({});

    const evaluations = useLiveQuery(() =>
        db.evaluations.where('patientId').equals(patientId).reverse().sortBy('date')
        , [patientId]);

    const handleSave = async () => {
        await db.evaluations.add({
            patientId,
            date: new Date(),
            type: selectedType,
            data: newEvaluationData
        });

        setMode('list');
        setNewEvaluationData({});
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar esta evaluación?')) {
            await db.evaluations.delete(id);
            if (viewingEvaluation?.id === id) {
                setViewingEvaluation(null);
                setMode('list');
            }
        }
    }

    const startCreation = (type) => {
        setSelectedType(type);
        setNewEvaluationData({});
        setMode('create');
    }

    const viewDetail = (ev) => {
        setViewingEvaluation(ev);
        setSelectedType(ev.type || 'asha');
        setMode('view');
    }

    // --- CALCULATIONS ---
    const getIcsStats = (data) => {
        let total = 0;
        let count = 0;
        ICS_QUESTIONS.forEach(q => {
            if (data[q]?.score) {
                total += data[q].score;
                count++;
            }
        });

        const possibleTotal = ICS_QUESTIONS.length * 5; // 35
        const average = count > 0 ? (total / count).toFixed(1) : 0;
        const percentage = count > 0 ? Math.round((total / possibleTotal) * 100) : 0;

        return { total, count, average, percentage };
    };

    const getCars2HfStats = (data) => {
        let total = 0;
        let count = 0;
        // Sum up values from items 1-15
        CARS2_HF_ITEMS.forEach(item => {
            const entry = data[item.id];
            if (entry && entry.score) {
                total += entry.score;
                count++;
            }
        });

        const complete = count === CARS2_HF_ITEMS.length;
        const stats = getCars2Stats(total);
        const category = INTERPRETATION_RANGES.find(r => stats.tScore >= r.minT && stats.tScore <= r.maxT);

        return {
            total,
            count,
            complete,
            tScore: stats.tScore,
            percentile: stats.percentile,
            category: category || { label: 'Indeterminado', color: 'slate' }
        };
    };

    const getCars2StStats = (data) => {
        let total = 0;
        let count = 0;
        // Sum up values from items 1-15 (or however many are present)
        CARS2_ST_ITEMS.forEach(item => {
            const entry = data[item.id];
            if (entry && entry.score) {
                total += entry.score;
                count++;
            }
        });

        const complete = count === CARS2_ST_ITEMS.length;
        const stats = getStStats(total);
        const category = INTERPRETATION_RANGES.find(r => stats.tScore >= r.minT && stats.tScore <= r.maxT);

        return {
            total,
            count,
            complete,
            tScore: stats.tScore,
            percentile: stats.percentile,
            category: category || { label: 'Indeterminado', color: 'slate' }
        };
    };

    // Helper to get CELF chart data from current form inputs
    const getCelf5ChartData = (data, tableId) => {
        if (!data || !CELF_TABLES[tableId]) return [];
        const config = CELF_TABLES[tableId];

        // Find the column used for the chart (e.g., 'pe' or 'comp_score')
        const chartCol = config.columns.find(c => c.chart);
        if (!chartCol) return [];

        return config.rows.map(row => {
            const rawVal = data[tableId]?.[row.key]?.[chartCol.key];
            const val = parseFloat(rawVal);
            return {
                name: row.key,
                value: isNaN(val) ? null : val,
                label: row.label
            };
        }).filter(item => item.value !== null);
    };


    // --- CHART DATA PREPARATION ---
    const getChartData = (type) => {
        if (!evaluations) return [];
        const filtered = evaluations.filter(e => (e.type || 'asha') === type).sort((a, b) => new Date(a.date) - new Date(b.date));

        if (type === 'casby') {
            // Flatten data for Scatter Plot: one point per Stage observed per Date
            // Format: { date, y: stageIndex, stageName, score, color }
            const points = [];
            filtered.forEach(ev => {
                const data = ev.data || {};
                CASBY_SECTIONS.forEach((section, idx) => {
                    const entry = data[section.id];
                    // Handle both object and legacy string data (though chart only supports scored data)
                    const score = entry && typeof entry === 'object' ? entry.score : undefined;

                    if (score !== undefined && score !== '') {
                        const levelInfo = CASBY_LEVELS.find(l => l.value === score);
                        points.push({
                            date: new Date(ev.date).getTime(), // Numeric for X axis scatter
                            formattedDate: new Date(ev.date).toLocaleDateString(),
                            y: idx, // Y axis is the index of the stage
                            stageName: section.title.split('–')[0].trim(), // Shorten title
                            score: score,
                            scoreLabel: levelInfo?.label || '?',
                            color: levelInfo?.color === 'red' ? '#ef4444' :
                                levelInfo?.color === 'amber' ? '#f59e0b' : '#22c55e'
                        });
                    }
                });
            });
            return points;
        }

        return filtered.map(ev => {
            const point = { date: ev.date };
            const data = ev.data || {};

            if (type === 'ics') {
                const stats = getIcsStats(data);
                point.value = stats.percentage;
            } else if (type === 'cars2_hf') {
                const stats = getCars2HfStats(data);
                point.value = stats.total;
                point.tScore = stats.tScore;
            } else if (type === 'cars2_st') {
                const stats = getCars2StStats(data);
                point.value = stats.total;
                point.tScore = stats.tScore;
            } else if (type === 'celf5_pragmatics') {
                const stats = getPragmaticsStats(data);
                // Plot total and/or breakdown
                point.value = stats.total;
                point.rituals = stats.breakdown?.rituals || 0;
                point.info = stats.breakdown?.information || 0;
                point.rituals = stats.breakdown?.rituals || 0;
                point.info = stats.breakdown?.information || 0;
                point.non_verbal = stats.breakdown?.non_verbal || 0;
            } else if (type === 'pls5') {
                // PLS-5 Chart Data: Standard Scores
                ['auditory_comprehension', 'expressive_communication', 'total_language'].forEach(key => {
                    const val = data['pls5_summary']?.[key]?.standard;
                    if (val) point[key] = parseFloat(val);
                });
            } else if (type === 'derby') {
                // For Derby, let's plot the 3 areas separately
                DERBY_AREAS.forEach(area => {
                    point[area] = data[area]?.score || 0;
                });
            } else {
                // ASHA & DAGG-2: Average
                let totalScore = 0;
                let count = 0;
                const areas = type === 'asha' ? FCM_AREAS : DAGG2_AREAS;

                areas.forEach(area => {
                    if (data[area]?.score !== undefined) {
                        totalScore += data[area].score;
                        count++;
                    }
                });
                point.average = count > 0 ? (totalScore / count).toFixed(1) : 0;
            }
            return point;
        });
    }


    // --- COMPONENT SELECTION ---
    const renderScaleComponent = (type, data, onChange, readOnly) => {
        if (type === 'celf5_pragmatics') {
            return (
                <div className="space-y-8 animate-in fade-in">
                    {PRAGMATICS_SECTIONS.map(section => (
                        <div key={section.id} className="border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                                <h3 className="text-lg font-bold text-indigo-900">{section.title}</h3>
                                {section.description && <p className="text-sm text-indigo-700 mt-1">{section.description}</p>}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700 text-sm font-semibold border-b border-slate-200">
                                            <th className="p-4 text-left w-1/2 min-w-[300px]">Conducta / Habilidad</th>
                                            <th className="p-4 text-left w-1/4">Frecuencia</th>
                                            <th className="p-4 text-left w-1/4">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {section.items.map(item => {
                                            const entry = data[item.id] || {};
                                            return (
                                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 align-top">
                                                        <span className="text-slate-800 block text-sm">{item.id}. {item.text}</span>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        {readOnly ? (
                                                            <div className="inline-flex items-center px-3 py-1 rounded-full font-bold text-sm bg-indigo-100 text-indigo-800">
                                                                {entry.score || '-'}
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-1">
                                                                <select
                                                                    value={entry.score || ""}
                                                                    onChange={(e) => {
                                                                        const val = parseInt(e.target.value);
                                                                        onChange({
                                                                            ...data,
                                                                            [item.id]: { ...entry, score: isNaN(val) ? undefined : val }
                                                                        });
                                                                    }}
                                                                    className="w-full rounded-lg border-slate-300 bg-white focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                                >
                                                                    <option value="">Seleccionar...</option>
                                                                    {PRAGMATICS_LEVELS.map(l => (
                                                                        <option key={l.value} value={l.value}>
                                                                            {l.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}
                                                        {!readOnly && entry.score && (
                                                            <p className="text-xs text-slate-500 mt-1 leading-tight">
                                                                {PRAGMATICS_LEVELS.find(l => l.value === entry.score)?.description}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        {readOnly ? (
                                                            <p className="text-slate-600 text-sm">{entry.note || '-'}</p>
                                                        ) : (
                                                            <textarea
                                                                value={entry.note || ""}
                                                                onChange={(e) => onChange({
                                                                    ...data,
                                                                    [item.id]: { ...entry, note: e.target.value }
                                                                })}
                                                                placeholder="Notas..."
                                                                rows={2}
                                                                className="w-full rounded-lg border-slate-300 text-sm resize-y min-h-[60px] focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (type === 'wetherby') {
            return (
                <BooleanChecklistMatrix
                    value={data}
                    onChange={onChange}
                    readOnly={readOnly}
                    rows={WETHERBY_FUNCTIONS}
                    columns={WETHERBY_FORMS}
                />
            );
        }

        if (type === 'casby') {
            const config = EVAL_TYPES['casby'].config;
            return (
                <DescriptiveList
                    value={data}
                    onChange={onChange}
                    readOnly={readOnly}
                    sections={config.sections}
                    levels={config.levels}
                />
            )
        }

        if (type === 'cars2_hf') {
            return (
                <RubricScoring
                    items={CARS2_HF_ITEMS}
                    value={data}
                    onChange={onChange}
                    readOnly={readOnly}
                />
            );
        }

        if (type === 'cars2_st') {
            return (
                <RubricScoring
                    items={CARS2_ST_ITEMS}
                    value={data}
                    onChange={onChange}
                    readOnly={readOnly}
                />
            );
        }

        if (type === 'pls5') {
            const handleTableChange = (tableId, tableData) => {
                onChange({
                    ...data,
                    [tableId]: tableData
                });
            };

            const config = EVAL_TYPES['pls5'].config;

            return (
                <div className="space-y-8 animate-in fade-in">
                    <ManualTable
                        config={config}
                        data={data[config.id] || {}}
                        onChange={(tableData) => handleTableChange(config.id, tableData)}
                        readOnly={readOnly}
                    />

                    {/* Discrepancy Field */}
                    <div className="bg-white p-4 rounded-lg border border-pink-100 shadow-sm mt-4">
                        <label className="block text-sm font-bold text-pink-900 mb-2">Discrepancia (entre áreas)</label>
                        {readOnly ? (
                            <p className="text-slate-700 bg-slate-50 p-3 rounded-md">{data.discrepancy || 'Sin observaciones'}</p>
                        ) : (
                            <textarea
                                className="w-full border-slate-300 rounded-lg text-sm focus:ring-pink-500 focus:border-pink-500"
                                rows={3}
                                placeholder="Ingrese análisis de discrepancia aquí..."
                                value={data.discrepancy || ''}
                                onChange={(e) => onChange({ ...data, discrepancy: e.target.value })}
                            />
                        )}
                    </div>
                </div>
            );
        }

        if (type === 'celf5') {
            // Helper for nested updates: newData = { ...data, [tableId]: tableData }
            const handleTableChange = (tableId, tableData) => {
                onChange({
                    ...data,
                    [tableId]: tableData
                });
            };

            const chart1 = getCelf5ChartData(data, 'scalars');
            const chart2 = getCelf5ChartData(data, 'composites');

            return (
                <div className="space-y-8 animate-in fade-in">
                    {/* TABLE 1: SCALARS */}
                    <div>
                        <h3 className="font-bold text-violet-800 mb-3">{CELF_TABLES.scalars.title}</h3>
                        <ManualTable
                            columns={CELF_TABLES.scalars.columns}
                            rows={CELF_TABLES.scalars.rows}
                            value={data.scalars}
                            onChange={(val) => handleTableChange('scalars', val)}
                            readOnly={readOnly}
                        />
                        {/* CHART 1 */}
                        {chart1.length > 0 && (
                            <div className="h-64 w-full bg-violet-50/50 rounded-lg p-4 border border-violet-100">
                                <h4 className="text-sm font-bold text-violet-700 mb-2 text-center">Gráfico: Puntuaciones Escalares</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chart1}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" stroke="#6d28d9" fontSize={11} interval={0} />
                                        <YAxis domain={[0, 20]} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} name="P. Escalar" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* TABLE 2: COMPOSITES */}
                    <div>
                        <h3 className="font-bold text-violet-800 mb-3">{CELF_TABLES.composites.title}</h3>
                        <ManualTable
                            columns={CELF_TABLES.composites.columns}
                            rows={CELF_TABLES.composites.rows}
                            value={data.composites}
                            onChange={(val) => handleTableChange('composites', val)}
                            readOnly={readOnly}
                        />
                        {/* CHART 2 */}
                        {chart2.length > 0 && (
                            <div className="h-64 w-full bg-violet-50/50 rounded-lg p-4 border border-violet-100">
                                <h4 className="text-sm font-bold text-violet-700 mb-2 text-center">Gráfico: Puntuaciones Compuestas</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chart2}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" stroke="#6d28d9" fontSize={11} interval={0} />
                                        <YAxis domain={[40, 160]} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} name="P. Compuesta" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* TABLE 3: COMPARISONS */}
                    <div>
                        <h3 className="font-bold text-violet-800 mb-3">{CELF_TABLES.comparisons.title}</h3>
                        <ManualTable
                            columns={CELF_TABLES.comparisons.columns}
                            rows={CELF_TABLES.comparisons.rows}
                            value={data.comparisons}
                            onChange={(val) => handleTableChange('comparisons', val)}
                            readOnly={readOnly}
                        />
                    </div>
                </div>
            );
        }

        const config = EVAL_TYPES[type].config;
        return (
            <EvaluationScale
                value={data}
                onChange={onChange}
                readOnly={readOnly}
                config={config}
            />
        );
    };

    // --- RENDER CONTENT ---

    // Shared Header
    const renderHeader = (title, showBack = true) => (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
                {showBack && (
                    <button
                        onClick={() => setMode('list')}
                        className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            </div>
        </div>
    );


    if (mode === 'create' || (mode === 'view' && viewingEvaluation)) {
        const isView = mode === 'view';
        const typeKey = isView ? viewingEvaluation.type : selectedType;
        const typeInfo = EVAL_TYPES[typeKey];
        const data = isView ? viewingEvaluation.data : newEvaluationData;
        const setData = isView ? () => { } : setNewEvaluationData;

        // ICS Stats Display
        let icsStats = null;
        if (typeKey === 'ics') {
            icsStats = getIcsStats(data);
        }

        // CARS2 HF Stats Display
        let cars2Stats = null;
        if (typeKey === 'cars2_hf') {
            cars2Stats = getCars2HfStats(data);
        } else if (typeKey === 'cars2_st') {
            cars2Stats = getCars2StStats(data);
        }

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4">
                {renderHeader(isView ? `Ver ${typeInfo.label}` : `Nueva ${typeInfo.label}`)}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

                    {/* ICS Scoreboard */}
                    {typeKey === 'ics' && (
                        <div className="mb-6 grid grid-cols-3 gap-4">
                            <div className="bg-rose-50 p-4 rounded-lg text-center border border-rose-100">
                                <span className="text-xs font-bold text-rose-500 uppercase">Puntaje Total</span>
                                <p className="text-2xl font-bold text-rose-700">{icsStats.total} / 35</p>
                            </div>
                            <div className="bg-rose-50 p-4 rounded-lg text-center border border-rose-100">
                                <span className="text-xs font-bold text-rose-500 uppercase">Promedio</span>
                                <p className="text-2xl font-bold text-rose-700">{icsStats.average} / 5</p>
                            </div>
                            <div className="bg-rose-50 p-4 rounded-lg text-center border border-rose-100">
                                <span className="text-xs font-bold text-rose-500 uppercase">Inteligibilidad</span>
                                <p className="text-2xl font-bold text-rose-700">{icsStats.percentage}%</p>
                            </div>
                        </div>
                    )}

                    {/* CARS-2 HF/ST Scoreboard */}
                    {(typeKey === 'cars2_hf' || typeKey === 'cars2_st') && (
                        <div className="mb-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-cyan-50 p-4 rounded-lg text-center border border-cyan-100">
                                    <span className="text-xs font-bold text-cyan-600 uppercase">Puntaje Bruto</span>
                                    <p className="text-3xl font-bold text-cyan-800">{cars2Stats.total}</p>
                                    <p className="text-xs text-cyan-600 mt-1">{cars2Stats.count} / {typeKey === 'cars2_hf' ? 15 : CARS2_ST_ITEMS.length} ítems</p>
                                </div>
                                <div className="bg-cyan-50 p-4 rounded-lg text-center border border-cyan-100">
                                    <span className="text-xs font-bold text-cyan-600 uppercase">Puntaje T</span>
                                    <p className="text-3xl font-bold text-cyan-800">{cars2Stats.tScore}</p>
                                </div>
                                <div className="bg-cyan-50 p-4 rounded-lg text-center border border-cyan-100">
                                    <span className="text-xs font-bold text-cyan-600 uppercase">Percentil</span>
                                    <p className="text-3xl font-bold text-cyan-800">{cars2Stats.percentile}</p>
                                </div>
                                <div className={`bg-${cars2Stats.category.color}-50 p-4 rounded-lg text-center border border-${cars2Stats.category.color}-100 flex flex-col justify-center`}>
                                    <span className={`text-xs font-bold text-${cars2Stats.category.color}-600 uppercase`}>Categoría</span>
                                    <p className={`text-sm font-bold text-${cars2Stats.category.color}-800 leading-tight`}>{cars2Stats.category.label}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {renderScaleComponent(typeKey, data, setData, isView)}

                    {!isView && (
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                className={`bg-${typeInfo.color}-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-${typeInfo.color}-700 flex items-center transition-transform hover:scale-105`}
                            >
                                <Save className="mr-2" size={20} />
                                Guardar Evaluación
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (mode === 'progress') {
        const ashaData = getChartData('asha');
        const dagg2Data = getChartData('dagg2');
        const icsData = getChartData('ics');
        const cars2HfData = getChartData('cars2_hf');
        const cars2StData = getChartData('cars2_st');
        const derbyData = getChartData('derby'); // [{date, 'Expresión (E)': val}]
        const casbyData = getChartData('casby'); // [{date, y, stageName, score, color}]

        // Derby Colors
        const derbyColors = ["#f59e0b", "#10b981", "#3b82f6"]; // Amber, Emerald, Blue

        return (
            <div className="space-y-8 animate-in fade-in">
                {renderHeader("Gráficos de Progreso")}

                <div className="grid md:grid-cols-2 gap-6">

                    {/* CARS-2 HF CHART */}
                    <div className="bg-white p-6 rounded-xl border border-cyan-100 shadow-sm md:col-span-2">
                        <h3 className="text-lg font-bold text-cyan-800 mb-4">CARS-2 HF (Severidad)</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={cars2Data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <YAxis domain={[0, 90]} label={{ value: 'Puntaje T', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        labelFormatter={d => new Date(d).toLocaleDateString()}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white p-3 border shadow rounded text-xs">
                                                        <p className="font-bold">{new Date(label).toLocaleDateString()}</p>
                                                        <p className="text-cyan-700">Puntaje T: <span className="font-bold">{payload[0].value}</span></p>
                                                        <p className="text-slate-500">Puntaje Bruto: {payload[0].payload.value}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    {/* Background Reference Areas for Severity */}
                                    <ReferenceArea y1={70} y2={90} fill="#fecaca" fillOpacity={0.3} label={{ value: "Extremo", position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
                                    <ReferenceArea y1={60} y2={70} fill="#ffedd5" fillOpacity={0.3} label={{ value: "Muy Alto", position: 'insideRight', fill: '#f97316', fontSize: 10 }} />
                                    <ReferenceArea y1={55} y2={60} fill="#fef3c7" fillOpacity={0.3} />

                                    <Line type="monotone" dataKey="tScore" stroke="#0891b2" strokeWidth={3} dot={{ r: 5, fill: '#0891b2' }} name="Puntaje T" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* CARS-2 ST CHART */}
                    <div className="bg-white p-6 rounded-xl border border-teal-100 shadow-sm md:col-span-2">
                        <h3 className="text-lg font-bold text-teal-800 mb-4">CARS-2 ST (Severidad)</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={cars2StData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <YAxis domain={[0, 90]} label={{ value: 'Puntaje T', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        labelFormatter={d => new Date(d).toLocaleDateString()}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white p-3 border shadow rounded text-xs">
                                                        <p className="font-bold">{new Date(label).toLocaleDateString()}</p>
                                                        <p className="text-teal-700">Puntaje T: <span className="font-bold">{payload[0].value}</span></p>
                                                        <p className="text-slate-500">Puntaje Bruto: {payload[0].payload.value}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    {/* Background Reference Areas for Severity */}
                                    <ReferenceArea y1={70} y2={90} fill="#fecaca" fillOpacity={0.3} label={{ value: "Extremo", position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
                                    <ReferenceArea y1={60} y2={70} fill="#ffedd5" fillOpacity={0.3} label={{ value: "Muy Alto", position: 'insideRight', fill: '#f97316', fontSize: 10 }} />
                                    <ReferenceArea y1={55} y2={60} fill="#fef3c7" fillOpacity={0.3} />

                                    <Line type="monotone" dataKey="tScore" stroke="#0d9488" strokeWidth={3} dot={{ r: 5, fill: '#0d9488' }} name="Puntaje T" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* CASBY CHART - FULL WIDTH IF NEEDED OR FIRST */}
                    <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm md:col-span-2">
                        <h3 className="text-lg font-bold text-orange-800 mb-4">Progreso de Juego (Casby)</h3>
                        <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 140 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        type="number"
                                        dataKey="date"
                                        name="Fecha"
                                        domain={['auto', 'auto']}
                                        tickFormatter={unixTime => new Date(unixTime).toLocaleDateString()}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="y"
                                        name="Etapa"
                                        tickCount={CASBY_SECTIONS.length}
                                        domain={[-1, CASBY_SECTIONS.length]}
                                        ticks={CASBY_SECTIONS.map((_, i) => i)}
                                        tickFormatter={(i) => CASBY_SECTIONS[i]?.title.split('–')[0].trim().replace('IV. SIMBÓLICO - ', '') || i}
                                        width={140}
                                        style={{ fontSize: '11px' }}
                                    />
                                    <ZAxis type="number" dataKey="score" range={[100, 100]} />
                                    <Tooltip
                                        cursor={{ strokeDasharray: '3 3' }}
                                        content={({ payload }) => {
                                            if (payload && payload.length) {
                                                const pt = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-3 border shadow rounded text-xs">
                                                        <p className="font-bold mb-1">{pt.formattedDate}</p>
                                                        <p className="font-semibold text-slate-700">{pt.stageName}</p>
                                                        <p style={{ color: pt.color }} className="font-bold">{pt.scoreLabel}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Scatter name="Casby" data={casbyData} shape="circle">
                                        {casbyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-2 text-xs">
                            <span className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span> No se observa</span>
                            <span className="flex items-center"><span className="w-3 h-3 bg-amber-500 rounded-full mr-1"></span> 1-2 tipos</span>
                            <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span> 3+ tipos</span>
                        </div>
                    </div>

                    {/* ASHA */}
                    <div className="bg-white p-6 rounded-xl border border-teal-100 shadow-sm">
                        <h3 className="text-lg font-bold text-teal-800 mb-4">ASHA FCM (Promedio)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ashaData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <YAxis domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5, 6]} />
                                    <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                                    <Line type="monotone" dataKey="average" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} name="Nivel Promedio" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">0 = Independiente, 6 = Profundo</p>
                    </div>

                    {/* DAGG-2 */}
                    <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                        <h3 className="text-lg font-bold text-indigo-800 mb-4">DAGG-2 (Promedio)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dagg2Data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                                    <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                                    <Line type="monotone" dataKey="average" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} name="Nivel Promedio" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">1 = Emergente, 5 = Independiente</p>
                    </div>

                    {/* PLS-5 Chart */}
                    <div className="bg-white p-6 rounded-xl border border-pink-100 shadow-sm md:col-span-2">
                        <h3 className="text-lg font-bold text-pink-800 mb-4">PLS-5 (Puntajes Estándar)</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={getChartData('pls5')}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <YAxis domain={[50, 150]} /> {/* Standard score range usually 50-150 +- */}
                                    <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                                    <Legend />
                                    <Line type="monotone" dataKey="auditory_comprehension" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} name="Comprensión Auditiva" />
                                    <Line type="monotone" dataKey="expressive_communication" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Comunicación Expresiva" />
                                    <Line type="monotone" dataKey="total_language" stroke="#4338ca" strokeWidth={3} dot={{ r: 5 }} name="Lenguaje Total" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">Media: 100, Desviación Estándar: 15</p>
                    </div>

                    {/* ICS */}
                    <div className="bg-white p-6 rounded-xl border border-rose-100 shadow-sm">
                        <h3 className="text-lg font-bold text-rose-800 mb-4">ICS (% Inteligibilidad)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={icsData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                                    <Line type="monotone" dataKey="value" stroke="#e11d48" strokeWidth={3} dot={{ r: 4 }} name="% Inteligibilidad" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Derby */}
                    <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
                        <h3 className="text-lg font-bold text-amber-800 mb-4">Protocolo Derby (Por Área)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={derbyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <YAxis domain={[0, 8]} ticks={[0, 2, 4, 6, 8]} />
                                    <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                                    <Legend />
                                    {DERBY_AREAS.map((area, idx) => (
                                        <Line
                                            key={area}
                                            type="monotone"
                                            dataKey={area}
                                            stroke={derbyColors[idx % derbyColors.length]}
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            name={area.split(' ')[0]} // Short name
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">8 = Sin problemas, 0 = Incapaz</p>
                    </div>

                    {/* CELF-5 Pragmatics */}
                    <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm md:col-span-2">
                        <h3 className="text-lg font-bold text-indigo-800 mb-4">CELF-5 Pragmática (Puntajes)</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={getChartData('celf5_pragmatics')}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                                    <YAxis domain={[0, 'auto']} />
                                    <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} name="Total" />
                                    <Line type="monotone" dataKey="rituals" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} name="Rituales" strokeDasharray="5 5" />
                                    <Line type="monotone" dataKey="info" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Información" strokeDasharray="5 5" />
                                    <Line type="monotone" dataKey="non_verbal" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="No Verbal" strokeDasharray="5 5" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LIST MODE
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Historial de Evaluaciones</h2>
                    <p className="text-slate-500">Gestión de ASHA, DAGG-2, ICS, Derby, Wetherby, CARS-2 HF y ST</p>
                </div>
                <button
                    onClick={() => setMode('progress')}
                    className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 font-medium shadow-sm flex items-center transition-colors"
                >
                    <BarChart2 className="mr-2" size={18} />
                    Ver Gráficos
                </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.values(EVAL_TYPES).map(type => (
                    <button
                        key={type.id}
                        onClick={() => startCreation(type.id)}
                        className={`bg-${type.color}-50 hover:bg-${type.color}-100 border border-${type.color}-200 text-${type.color}-800 p-3 rounded-xl flex flex-col items-center justify-center transition-all hover:shadow-md text-center h-24`}
                    >
                        <type.icon size={24} className="mb-2" />
                        <span className="text-xs font-bold leading-tight">{type.label}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {evaluations?.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                            <Calendar size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-medium mb-1">No hay evaluaciones registradas</h3>
                        <p className="text-slate-500 text-sm">Selecciona una de las opciones arriba para comenzar.</p>
                    </div>
                )}

                {evaluations?.map(ev => {
                    const typeInfo = EVAL_TYPES[ev.type] || EVAL_TYPES['asha'];
                    return (
                        <div
                            key={ev.id}
                            className={`bg-white p-5 rounded-xl border border-slate-200 hover:border-${typeInfo.color}-400 hover:shadow-md transition-all cursor-pointer group flex justify-between items-center`}
                            onClick={() => viewDetail(ev)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`bg-${typeInfo.color}-50 text-${typeInfo.color}-700 p-3 rounded-lg min-w-[60px] text-center`}>
                                    <span className="text-xs font-bold uppercase block">
                                        {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-xl font-bold block leading-none">
                                        {new Date(ev.date).getDate()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">{typeInfo.label}</h3>
                                    <p className="text-slate-500 text-sm">
                                        {Object.keys(ev.data || {}).length} ítems evaluados
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(ev.id); }}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <ChevronLeft className="rotate-180 text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
