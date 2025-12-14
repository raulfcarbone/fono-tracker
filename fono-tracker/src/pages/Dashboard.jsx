import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Users, FileText, Activity, TrendingUp, Clock, Calendar as CalendarIcon, XCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const EVAL_LABELS = {
    asha: 'ASHA FCM',
    dagg2: 'DAGG-2',
    ics: 'ICS',
    celf5: 'CELF-5',
    celf5_pragmatics: 'CELF-5 Prag.',
    pls5: 'PLS-5',
    cars2_hf: 'CARS-2 HF',
    cars2_st: 'CARS-2 ST',
    derby: 'Derby',
    wetherby: 'Wetherby',
    casby: 'Casby'
};

export function Dashboard() {
    const patients = useLiveQuery(() => db.patients.toArray());
    const evaluations = useLiveQuery(() => db.evaluations.toArray());
    const appointments = useLiveQuery(() => db.appointments.toArray());

    const stats = useMemo(() => {
        if (!patients || !evaluations || !appointments) return null;

        const totalPatients = patients.length;
        const totalEvals = evaluations.length;

        // Session Stats
        const now = new Date();
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday
        startOfThisWeek.setHours(0, 0, 0, 0);

        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        const endOfThisWeek = new Date(startOfThisWeek);
        endOfThisWeek.setDate(endOfThisWeek.getDate() + 7);

        const isBetween = (date, start, end) => date >= start && date < end;

        let thisWeekSessions = 0;
        let lastWeekSessions = 0;
        let cancelledCount = 0;

        appointments.forEach(app => {
            const appDate = new Date(app.start);
            if (app.status === 'cancelled' || app.status === 'no_show') {
                cancelledCount++;
            } else {
                if (isBetween(appDate, startOfThisWeek, endOfThisWeek)) thisWeekSessions++;
                if (isBetween(appDate, startOfLastWeek, startOfThisWeek)) lastWeekSessions++;
            }
        });

        const diff = thisWeekSessions - lastWeekSessions;
        const trend = lastWeekSessions > 0 ? ((diff / lastWeekSessions) * 100).toFixed(0) : (diff > 0 ? 100 : 0);


        // Eval Types Distribution
        const typeMap = {};
        evaluations.forEach(e => {
            const t = EVAL_LABELS[e.type] || e.type || 'Desconocido';
            typeMap[t] = (typeMap[t] || 0) + 1;
        });
        const typeData = Object.entries(typeMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Recent Activity
        const recentEvals = [...evaluations]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(e => {
                const patient = patients.find(p => p.id === e.patientId);
                return {
                    ...e,
                    patientName: patient ? patient.name : 'Desconocido'
                };
            });

        return {
            totalPatients,
            totalEvals,
            thisWeekSessions,
            lastWeekSessions,
            cancelledCount,
            trend: parseInt(trend),
            diff,
            typeData,
            recentEvals
        };
    }, [patients, evaluations, appointments]);

    if (!stats) return <div className="p-8 text-center text-slate-500">Cargando datos...</div>;

    return (
        <div className="space-y-6 animate-in fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Resumen operativo de tu consulta</p>
            </div>

            {/* KPI Cards: Operational */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Attentions This Week */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                        {stats.diff !== 0 && (
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stats.diff > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {stats.diff > 0 ? '+' : ''}{stats.trend}% vs sem. ant.
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Atenciones esta semana</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.thisWeekSessions}</p>
                    </div>
                </div>

                {/* Cancellations */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                            <XCircle size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Cancelaciones / Inasist.</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.cancelledCount}</p>
                    </div>
                </div>

                {/* Total Patients */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Users size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Pacientes Totales</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalPatients}</p>
                    </div>
                </div>

                {/* Total Evals */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Evaluaciones Totales</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.totalEvals}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Eval Types Chart (Kept as it's useful context) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <TrendingUp size={20} className="mr-2 text-slate-400" />
                        Tipos de Evaluación y Diagnóstico
                    </h3>
                    <div className="h-64 w-full">
                        {stats.typeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.typeData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                Sin datos suficientes de evaluaciones
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <Clock size={20} className="mr-2 text-slate-400" />
                        Últimas Evaluaciones
                    </h3>
                    <div className="space-y-4">
                        {stats.recentEvals.length > 0 ? (
                            stats.recentEvals.map(ev => (
                                <Link
                                    to={`/patients/${ev.patientId}`}
                                    key={ev.id}
                                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full bg-slate-100 text-slate-500`}>
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                Evaluación {EVAL_LABELS[ev.type] || ev.type}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Paciente: {ev.patientName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-600">
                                            {new Date(ev.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            Ver detalle
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-6 text-slate-400 text-sm">
                                No hay actividad récente.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
