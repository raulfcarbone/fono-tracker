import React, { useState } from 'react';
import clsx from 'clsx';
import { Save, X } from 'lucide-react';

const TABS = [
    { id: 'general', label: 'General' },
    { id: 'anamnesis', label: 'Anamnesis' },
    { id: 'family', label: 'Antecedentes Familiares' },
    { id: 'education', label: 'Educación' }
];

export function PatientIntakeForm({ onSubmit, onCancel }) {
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        // General
        name: '',
        birthDate: '',
        rut: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',

        // Anamnesis
        diagnosis: '',
        referralReason: '',
        developmentalDelays: '',
        medicalHistory: '',
        medications: '',
        allergies: '',

        // Family
        motherName: '',
        motherAge: '',
        motherOccupation: '',
        fatherName: '',
        fatherAge: '',
        fatherOccupation: '',
        siblings: '',
        familyHistory: '',

        // Education
        schoolName: '',
        gradeLevel: '',
        teacherName: '',
        learningDifficulties: '',
        previousTherapies: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">Nuevo Paciente</h2>
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                            activeTab === tab.id
                                ? "border-b-2 border-teal-600 text-teal-700 bg-teal-50/50"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto flex-1">
                <form id="intake-form" onSubmit={handleSubmit} className="space-y-6">

                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-slate-300 focus:ring-teal-500 focus:border-teal-500" placeholder="Ej. Juan Pérez" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
                                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full rounded-lg border-slate-300 focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">RUT / ID</label>
                                <input type="text" name="rut" value={formData.rut} onChange={handleChange} className="w-full rounded-lg border-slate-300 focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Contacto Principal</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Nombre Apoderado</label>
                                        <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full rounded-lg border-slate-300 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Teléfono</label>
                                        <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full rounded-lg border-slate-300 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                                        <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full rounded-lg border-slate-300 text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'anamnesis' && (
                        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Diagnóstico Principal</label>
                                <input required type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} className="w-full rounded-lg border-slate-300 focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Motivo de Consulta</label>
                                <textarea rows={2} name="referralReason" value={formData.referralReason} onChange={handleChange} className="w-full rounded-lg border-slate-300 focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Antecedentes del Desarrollo</label>
                                <textarea rows={3} name="developmentalDelays" value={formData.developmentalDelays} onChange={handleChange} className="w-full rounded-lg border-slate-300 focus:ring-teal-500 focus:border-teal-500" placeholder="Hitos motores, lingüísticos, etc." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Enfermedades de base</label>
                                    <textarea rows={2} name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} className="w-full rounded-lg border-slate-300 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fármacos actuales</label>
                                    <textarea rows={2} name="medications" value={formData.medications} onChange={handleChange} className="w-full rounded-lg border-slate-300 text-sm" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'family' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                                <h4 className="col-span-full font-medium text-slate-900 border-b border-slate-200 pb-2">Madre</h4>
                                <div>
                                    <label className="block text-xs text-slate-500">Nombre</label>
                                    <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full rounded border-slate-300 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500">Edad</label>
                                    <input type="text" name="motherAge" value={formData.motherAge} onChange={handleChange} className="w-full rounded border-slate-300 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500">Ocupación</label>
                                    <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} className="w-full rounded border-slate-300 mt-1" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                                <h4 className="col-span-full font-medium text-slate-900 border-b border-slate-200 pb-2">Padre</h4>
                                <div>
                                    <label className="block text-xs text-slate-500">Nombre</label>
                                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full rounded border-slate-300 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500">Edad</label>
                                    <input type="text" name="fatherAge" value={formData.fatherAge} onChange={handleChange} className="w-full rounded border-slate-300 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500">Ocupación</label>
                                    <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} className="w-full rounded border-slate-300 mt-1" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hermanos / Estructura Familiar</label>
                                <textarea rows={2} name="siblings" value={formData.siblings} onChange={handleChange} className="w-full rounded-lg border-slate-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Antecedentes Mórbidos Familiares</label>
                                <textarea rows={2} name="familyHistory" value={formData.familyHistory} onChange={handleChange} className="w-full rounded-lg border-slate-300" placeholder="Tartamudez, problemas de lenguaje en padres, etc." />
                            </div>
                        </div>
                    )}

                    {activeTab === 'education' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Establecimiento Educacional</label>
                                <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} className="w-full rounded-lg border-slate-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nivel / Curso</label>
                                <input type="text" name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className="w-full rounded-lg border-slate-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Profesor(a) Jefe</label>
                                <input type="text" name="teacherName" value={formData.teacherName} onChange={handleChange} className="w-full rounded-lg border-slate-300" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Dificultades de Aprendizaje reportadas</label>
                                <textarea rows={3} name="learningDifficulties" value={formData.learningDifficulties} onChange={handleChange} className="w-full rounded-lg border-slate-300" />
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                    {activeTab === 'general' ? 'Paso 1 de 4' :
                        activeTab === 'anamnesis' ? 'Paso 2 de 4' :
                            activeTab === 'family' ? 'Paso 3 de 4' : 'Paso 4 de 4'}
                </span>
                <div className="flex space-x-3">
                    {activeTab !== 'general' && (
                        <button
                            type="button"
                            onClick={() => {
                                const idx = TABS.findIndex(t => t.id === activeTab);
                                setActiveTab(TABS[idx - 1].id);
                            }}
                            className="px-4 py-2 text-slate-600 hover:text-slate-900"
                        >
                            Atrás
                        </button>
                    )}

                    {activeTab !== 'education' ? (
                        <button
                            type="button"
                            onClick={() => {
                                const idx = TABS.findIndex(t => t.id === activeTab);
                                setActiveTab(TABS[idx + 1].id);
                            }}
                            className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
                        >
                            Siguiente
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 flex items-center shadow-lg shadow-teal-100"
                        >
                            <Save size={18} className="mr-2" />
                            Guardar Paciente
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
