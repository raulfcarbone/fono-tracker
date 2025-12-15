import React, { useMemo, useState } from 'react';
import { Layers, Gamepad2, ShieldCheck, Target, Users } from 'lucide-react';
import es from '../i18n/es';
import { interactiveModules } from '../modules/interactiveModules';

export function InteractiveActivities() {
    const [patientId, setPatientId] = useState('');
    const t = useMemo(() => es.interactiveActivities, []);

    return (
        <div className="space-y-10 animate-in fade-in">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-slate-500 text-sm mb-1">Laboratorio digital</p>
                    <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
                    <p className="text-slate-600 max-w-3xl">{t.subtitle}</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        {t.offlineNotice}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
                <label className="text-sm text-slate-700 font-semibold flex items-center space-x-2">
                    <Users className="h-4 w-4 text-teal-600" />
                    <span>Paciente asociado (opcional)</span>
                </label>
                <input
                    value={patientId}
                    onChange={e => setPatientId(e.target.value)}
                    placeholder="Ej. ID clínico o iniciales"
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Identificador de paciente"
                />
                <p className="text-xs text-slate-500">{t.patientHint}</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-2 text-slate-800">
                    <Layers className="h-5 w-5 text-teal-600" />
                    <h2 className="text-2xl font-semibold">{t.catalogue}</h2>
                </div>
                <p className="text-slate-600 max-w-3xl text-sm">
                    Reimplementaciones ligeras inspiradas en SpeakWell, Autsera, nteract-games, Games4Autism y TinyTalk. Todas las
                    mecánicas se ejecutan en React + Dexie sin dependencias externas.
                </p>
                <div className="grid lg:grid-cols-3 gap-6">
                    {interactiveModules.map(modulo => (
                        <div key={modulo.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">{modulo.gameType}</p>
                                    <h3 className="text-lg font-semibold text-slate-900">{modulo.title}</h3>
                                    <p className="text-sm text-slate-600">{modulo.description}</p>
                                </div>
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="space-y-1 text-xs text-slate-600">
                                <p><strong>Objetivos:</strong> {modulo.therapeuticGoals.join(', ')}</p>
                                <p><strong>Habilidades:</strong> {modulo.skills.join(', ')}</p>
                                <p><strong>Edades:</strong> {modulo.ageRange}</p>
                                <p><strong>Inspiración:</strong> {modulo.inspiration}</p>
                            </div>
                            <div className="inline-flex items-center text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                                <Target className="h-3 w-3 mr-1" />
                                {modulo.assets?.images?.join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center space-x-2 text-slate-800">
                    <Gamepad2 className="h-5 w-5 text-purple-600" />
                    <h2 className="text-2xl font-semibold">Juega y registra progreso</h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    {interactiveModules.map(modulo => (
                        <div key={`${modulo.id}-component`} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">{modulo.gameType}</p>
                                    <h3 className="text-lg font-semibold text-slate-900">{modulo.title}</h3>
                                </div>
                                <span className="text-xs text-slate-500">Funciona offline</span>
                            </div>
                            <modulo.component moduleId={modulo.id} patientId={patientId} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                    <Layers className="h-5 w-5 text-teal-600" />
                    <span>{t.howToExtendTitle}</span>
                </h3>
                <ul className="list-decimal list-inside space-y-1 text-slate-700 text-sm">
                    {t.howToExtendSteps.map((paso, idx) => (
                        <li key={idx}>{paso}</li>
                    ))}
                </ul>
                <p className="text-xs text-slate-500">
                    Documenta cualquier dependencia externa y encapsula integraciones que requieran claves o builds separadas.
                </p>
            </div>
        </div>
    );
}
