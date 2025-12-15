import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Plus, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatientIntakeForm } from '../components/PatientIntakeForm';

export function Patients() {
    const patients = useLiveQuery(() => db.patients.orderBy('createdAt').reverse().toArray());
    const [showAdd, setShowAdd] = useState(false);

    const handleAdd = async (formData) => {
        // e.preventDefault() is handled in the child component

        await db.patients.add({
            ...formData,
            createdAt: new Date()
        });

        setShowAdd(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
                    <p className="text-slate-500">Gestiona tus historias clínicas</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                >
                    <Plus size={20} />
                    <span>Nuevo Paciente</span>
                </button>
            </div>

            {/* Add Modal */}
            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-4xl">
                        <PatientIntakeForm
                            onSubmit={handleAdd}
                            onCancel={() => setShowAdd(false)}
                        />
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients?.map(patient => (
                    <Link
                        key={patient.id}
                        to={`/patients/${patient.id}`}
                        className="group block p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">{patient.name}</h3>
                                    <p className="text-sm text-slate-500">{patient.diagnosis || 'Sin diagnóstico'}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {patients?.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                        No hay pacientes registrados aún.
                    </div>
                )}
            </div>
        </div>
    );
}
