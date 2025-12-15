import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { RubricScorer } from '../components/RubricScorer';
import { PatientEvaluations } from '../components/PatientEvaluations';
import { PatientDocuments } from '../components/PatientDocuments';
import { WorkPlanModal } from '../components/WorkPlanModal';
import { ObjectiveBankModal } from '../components/ObjectiveBankModal';
import { CLINICAL_AREAS } from '../lib/gas';
import { ArrowLeft, Save, Plus, ChevronDown, ChevronRight, Activity, Trash2, LineChart as IconChart, LayoutList, ClipboardList, FolderOpen, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import clsx from 'clsx';

export function PatientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const patientId = parseInt(id);

    const patient = useLiveQuery(() => db.patients.get(patientId), [patientId]);
    const objectives = useLiveQuery(() =>
        db.objectives.where('patientId').equals(patientId).toArray()
        , [patientId]);

    // State for UI
    const [activeTab, setActiveTab] = useState('objectives'); // 'objectives' | 'evaluations'
    const [expandedArea, setExpandedArea] = useState(null);
    const [showAddObjective, setShowAddObjective] = useState(null); // 'AreaName' or null
    const [newObjectiveText, setNewObjectiveText] = useState('');
    const [showWorkPlan, setShowWorkPlan] = useState(false);
    const [showObjectiveBank, setShowObjectiveBank] = useState(false);
    const [allLastScores, setAllLastScores] = useState({});

    // State for Scoring
    const [activeObjective, setActiveObjective] = useState(null); // Objective object
    const [isScoring, setIsScoring] = useState(false);

    // Fetch scores for active objective if selected
    const objectiveScores = useLiveQuery(async () => {
        if (!activeObjective) return [];
        const scores = await db.scores.where('objectiveId').equals(activeObjective.id).toArray();
        // Join with sessions to get dates
        const sessions = await Promise.all(
            scores.map(async s => {
                const session = await db.sessions.get(s.sessionId);
                return { ...s, date: session?.date, gasScore: s.gasScore || -2 };
            })
        );
        return sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [activeObjective]);

    const handleAddObjective = async (area) => {
        if (!newObjectiveText.trim()) return;
        await db.objectives.add({
            patientId,
            area,
            description: newObjectiveText,
            status: 'active',
            createdAt: new Date()
        });
        setNewObjectiveText('');
        setShowAddObjective(null);
    };

    const handleSelectObjectiveFromBank = async (objective) => {
        const areaName = objective.area || objective.areaName;

        await db.objectives.add({
            patientId,
            area: areaName,
            description: objective.description,
            status: 'active',
            baseline: objective.baseline,
            target: objective.target,
            contexts: objective.contexts,
            materials: objective.materials,
            strategies: objective.strategies,
            sourceId: objective.sourceId,
            createdAt: new Date()
        });

        setExpandedArea(areaName);
        setShowObjectiveBank(false);
    };

    const handleOpenWorkPlan = async () => {
        // Fetch latest score for ALL objectives to calculate averages
        if (!objectives) return;

        const scoresMap = {};

        // This could be optimized but for local DB it's fine
        for (const obj of objectives) {
            const scores = await db.scores.where('objectiveId').equals(obj.id).toArray();
            if (scores.length > 0) {
                // Get the latest one (highest ID typically implies latest, but we check date via session if needed)
                // Assuming ID auto-increment correlates with time as created
                const latest = scores[scores.length - 1];
                scoresMap[obj.id] = latest.gasScore;
            }
        }

        setAllLastScores(scoresMap);
        setShowWorkPlan(true);
    };

    const handleSaveScore = async ({ scores, totalScore, gasScore }) => {
        if (!activeObjective) return;

        await db.transaction('rw', db.sessions, db.scores, async () => {
            const sessionId = await db.sessions.add({
                patientId,
                date: new Date(),
                objectiveId: activeObjective.id
            });

            await db.scores.add({
                sessionId,
                objectiveId: activeObjective.id,
                gasScore,
                totalScore,
                ...scores
            });
        });

        setIsScoring(false);
    };

    if (!patient) return <div className="p-8">Cargando...</div>;

    // Render Scoring Mode
    if (isScoring && activeObjective) {
        return (
            <div className="max-w-4xl mx-auto pb-20 fade-in">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setIsScoring(false)}
                        className="flex items-center text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Volver al Objetivo
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">Evaluando Objetivo</h2>
                </div>

                <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl mb-8">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">{activeObjective.area}</span>
                    <p className="text-lg font-medium text-teal-900">{activeObjective.description}</p>
                </div>

                <RubricScorer onScoreChange={() => { }} initialScores={{}} />

                {/* We need to capture the state from RubricScorer. 
            For now, RubricScorer calls 'onScoreChange'. 
            I'll wrap it to capture state in a local var safely or handle it differently.
            Refactoring RubricScorer slightly to expose a Save button inside might be cleaner, 
            but for now I'll use a wrapper state here.
        */}
                <ScoringWrapper onSave={handleSaveScore} />
            </div>
        );
    }

    // Render Objective Detail (History & Chart)
    if (activeObjective) {
        return (
            <div className="space-y-6 fade-in">
                <button
                    onClick={() => setActiveObjective(null)}
                    className="flex items-center text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft className="mr-2" size={20} />
                    Volver al Paciente
                </button>

                <div className="flex items-start justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <span className="text-sm font-bold text-teal-600 uppercase tracking-wider">{activeObjective.area}</span>
                        <h1 className="text-2xl font-bold text-slate-900 mt-2">{activeObjective.description}</h1>
                    </div>
                    <button
                        onClick={() => setIsScoring(true)}
                        className="flex items-center bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 font-medium shadow-lg shadow-teal-100"
                    >
                        <Activity className="mr-2" size={20} />
                        Nueva Evaluación (Rúbrica)
                    </button>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                        <IconChart className="mr-2 text-slate-400" size={20} />
                        Progreso GAS
                    </h3>
                    {objectiveScores && objectiveScores.length > 0 ? (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={objectiveScores}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        stroke="#94A3B8"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        domain={[-2, 2]}
                                        ticks={[-2, -1, 0, 1, 2]}
                                        stroke="#94A3B8"
                                    />
                                    <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                                    <ReferenceLine y={0} stroke="#CBD5E1" strokeDasharray="3 3" />
                                    <Line
                                        type="monotone"
                                        dataKey="gasScore"
                                        stroke="#0D9488"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#0D9488' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                            Aún no hay evaluaciones para este objetivo.
                        </div>
                    )}
                </div>

                {/* History Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-medium text-slate-900">Historial de Puntajes</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {objectiveScores?.map(score => (
                            <div key={score.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                <span className="text-slate-600">{new Date(score.date).toLocaleDateString()} {new Date(score.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <div className="flex items-center space-x-4">
                                    <span className="text-slate-400 text-sm">Rúbrica: {score.totalScore}/20</span>
                                    <span className={clsx("font-bold px-3 py-1 rounded-full text-sm", score.gasScore >= 0 ? "bg-teal-100 text-teal-700" : "bg-orange-100 text-orange-700")}>
                                        GAS {score.gasScore > 0 ? `+${score.gasScore}` : score.gasScore}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Render Patient Dashboard (List of Areas)
    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <button
                        onClick={() => navigate('/patients')}
                        className="text-slate-400 hover:text-slate-600 text-sm mb-2 flex items-center"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Volver a Pacientes
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">{patient.name}</h1>
                    <p className="text-slate-500 mt-1">{patient.diagnosis}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowObjectiveBank(true)}
                        className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-medium shadow-sm transition-colors"
                    >
                        <FolderOpen className="mr-2" size={18} />
                        Banco de objetivos
                    </button>
                    <button
                        onClick={handleOpenWorkPlan}
                        className="flex items-center bg-white text-teal-700 border border-teal-200 px-4 py-2 rounded-lg hover:bg-teal-50 font-medium shadow-sm transition-colors"
                    >
                        <FileText className="mr-2" size={18} />
                        Plan de Trabajo Completo
                    </button>
                </div>
            </div>

            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('objectives')}
                    className={clsx(
                        "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'objectives'
                            ? "bg-white text-teal-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <LayoutList size={18} className="mr-2" />
                    Objetivos y Seguimiento
                </button>
                <button
                    onClick={() => setActiveTab('evaluations')}
                    className={clsx(
                        "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'evaluations'
                            ? "bg-white text-teal-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <ClipboardList size={18} className="mr-2" />
                    Evaluaciones
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    className={clsx(
                        "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'documents'
                            ? "bg-white text-teal-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <FolderOpen size={18} className="mr-2" />
                    Documentos
                </button>
            </div>

            {activeTab === 'objectives' && (
                <div className="grid gap-4">
                    {CLINICAL_AREAS.map(area => {
                        const areaObjectives = objectives?.filter(o => o.area === area) || [];
                        const isExpanded = expandedArea === area;

                        return (
                            <div key={area} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <button
                                    onClick={() => setExpandedArea(isExpanded ? null : area)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        {isExpanded ? <ChevronDown className="text-teal-600" /> : <ChevronRight className="text-slate-400" />}
                                        <h3 className={clsx("font-semibold text-lg", isExpanded ? "text-teal-700" : "text-slate-700")}>{area}</h3>
                                        {areaObjectives.length > 0 && (
                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                                {areaObjectives.length}
                                            </span>
                                        )}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-slate-100 bg-slate-50/30 p-5 space-y-4">
                                        {/* List Objectives */}
                                        <div className="space-y-2">
                                            {areaObjectives.map(obj => (
                                                <div
                                                    key={obj.id}
                                                    onClick={() => setActiveObjective(obj)}
                                                    className="group bg-white p-4 rounded-lg border border-slate-200 hover:border-teal-400 hover:shadow-md cursor-pointer transition-all flex justify-between items-center"
                                                >
                                                    <span className="font-medium text-slate-800">{obj.description}</span>
                                                    <div className="flex items-center text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-sm font-medium mr-2">Ver Progreso</span>
                                                        <ChevronRight size={16} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Objective UI */}
                                        {showAddObjective === area ? (
                                            <div className="bg-white p-4 rounded-lg border border-dashed border-teal-300 animate-in fade-in">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={newObjectiveText}
                                                    onChange={e => setNewObjectiveText(e.target.value)}
                                                    placeholder="Describe el objetivo específico (ej. Lograr fonema /R/ en posición inicial)"
                                                    className="w-full rounded-md border-slate-300 focus:border-teal-500 focus:ring-teal-500 mb-3"
                                                    onKeyDown={e => e.key === 'Enter' && handleAddObjective(area)}
                                                />
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => setShowAddObjective(null)}
                                                        className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddObjective(area)}
                                                        className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                                    >
                                                        Guardar Objetivo
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowAddObjective(area)}
                                                className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800 px-2 py-1 rounded hover:bg-teal-50"
                                            >
                                                <Plus size={16} className="mr-1" />
                                                Agregar Objetivo
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'evaluations' && (
                <PatientEvaluations patientId={patientId} />
            )}

            {activeTab === 'documents' && (
                <PatientDocuments patientId={patientId} patientName={patient.name} />
            )}

            {showWorkPlan && (
                <WorkPlanModal
                    patient={patient}
                    objectives={objectives}
                    objectiveLastScores={allLastScores}
                    onClose={() => setShowWorkPlan(false)}
                />
            )}

            {showObjectiveBank && (
                <ObjectiveBankModal
                    onSelect={handleSelectObjectiveFromBank}
                    onClose={() => setShowObjectiveBank(false)}
                    patientDiagnosis={patient.diagnosis}
                />
            )}
        </div>
    );
}

// Internal component to handle Rubric state lifting
function ScoringWrapper({ onSave }) {
    const [scoreData, setScoreData] = useState(null);
    return (
        <>
            <RubricScorer onScoreChange={setScoreData} />
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex justify-end">
                <div className="max-w-4xl w-full mx-auto flex justify-end">
                    <button
                        disabled={!scoreData}
                        onClick={() => onSave(scoreData)}
                        className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        <Save className="mr-2" size={20} />
                        Guardar Evaluación
                    </button>
                </div>
            </div>
        </>
    );
}
