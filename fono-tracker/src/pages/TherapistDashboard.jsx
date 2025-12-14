import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Users, Calendar, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export function TherapistDashboard() {
    // Fetch all data
    const patients = useLiveQuery(() => db.patients.toArray());
    const sessions = useLiveQuery(() => db.sessions.toArray());
    const objectives = useLiveQuery(() => db.objectives.toArray());
    const appointments = useLiveQuery(() => db.appointments.toArray());

    if (!patients || !sessions || !objectives || !appointments) {
        return <div className="p-8">Cargando...</div>;
    }

    // Calculate metrics
    const activePatients = patients.filter(p => p.status !== 'inactive').length;

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const sessionsThisMonth = sessions.filter(s => new Date(s.date) >= thisMonth).length;

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    const sessionsLastMonth = sessions.filter(s => {
        const d = new Date(s.date);
        return d >= lastMonth && d < thisMonth;
    }).length;

    const completedObjectives = objectives.filter(o => o.status === 'Logrado').length;

    // Attendance rate
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const attendanceRate = appointments.length > 0
        ? ((completedAppointments / appointments.length) * 100).toFixed(1)
        : 0;

    // Patients by diagnosis
    const diagnosisCounts = {};
    patients.forEach(p => {
        const diag = p.diagnosis || 'Sin diagnóstico';
        diagnosisCounts[diag] = (diagnosisCounts[diag] || 0) + 1;
    });
    const diagnosisData = Object.keys(diagnosisCounts).map(key => ({
        name: key,
        value: diagnosisCounts[key]
    }));

    // Patients by age
    const ageGroups = { '0-3': 0, '4-6': 0, '7-12': 0, '13-18': 0, '18+': 0 };
    patients.forEach(p => {
        if (!p.birthDate) return;
        const age = new Date().getFullYear() - new Date(p.birthDate).getFullYear();
        if (age <= 3) ageGroups['0-3']++;
        else if (age <= 6) ageGroups['4-6']++;
        else if (age <= 12) ageGroups['7-12']++;
        else if (age <= 18) ageGroups['13-18']++;
        else ageGroups['18+']++;
    });
    const ageData = Object.keys(ageGroups).map(key => ({
        name: key + ' años',
        value: ageGroups[key]
    }));

    // Colors
    const COLORS = ['#0891b2', '#059669', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard del Terapeuta</h1>
                    <p className="text-slate-600">Visión general de tu práctica clínica</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-teal-100 rounded-lg">
                                <Users className="text-teal-600" size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">{activePatients}</h3>
                        <p className="text-sm text-slate-600 mt-1">Pacientes Activos</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Calendar className="text-blue-600" size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">{sessionsThisMonth}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Sesiones este mes
                            {sessionsLastMonth > 0 && (
                                <span className={`ml-2 text-xs ${sessionsThisMonth > sessionsLastMonth ? 'text-green-600' : 'text-red-600'}`}>
                                    {sessionsThisMonth > sessionsLastMonth ? '↑' : '↓'} {Math.abs(sessionsThisMonth - sessionsLastMonth)}
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">{attendanceRate}%</h3>
                        <p className="text-sm text-slate-600 mt-1">Tasa de Asistencia</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Target className="text-purple-600" size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">{completedObjectives}</h3>
                        <p className="text-sm text-slate-600 mt-1">Objetivos Logrados</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Diagnosis Pie Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pacientes por Diagnóstico</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={diagnosisData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {diagnosisData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Age Bar Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pacientes por Edad</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#0891b2" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <AlertCircle className="mr-2 text-orange-600" size={20} />
                        Alertas y Recordatorios
                    </h3>
                    <div className="space-y-3">
                        {objectives.filter(o => {
                            // Objectives without progress for 3+ months
                            // This is simplified - in production you'd check actual session dates
                            return o.status === 'En Progreso';
                        }).length > 0 && (
                                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <p className="text-sm font-medium text-orange-900">Objetivos sin progreso reciente</p>
                                        <p className="text-xs text-orange-700 mt-1">
                                            Hay objetivos que podrían necesitar revisión o ajuste
                                        </p>
                                    </div>
                                </div>
                            )}
                        {patients.length === 0 && (
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Comienza agregando pacientes</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Agrega tu primer paciente para comenzar a usar el sistema
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
