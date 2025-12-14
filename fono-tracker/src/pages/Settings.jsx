
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Trash2, Plus, Link as LinkIcon, ExternalLink, Database, Download, Upload, AlertCircle } from 'lucide-react';
import Dexie from 'dexie';

export function Settings() {
    const meetingLinks = useLiveQuery(() => db.meetingLinks.toArray()) || [];
    const [newLinkName, setNewLinkName] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    const handleAddLink = async (e) => {
        e.preventDefault();
        if (newLinkName && newLinkUrl) {
            await db.meetingLinks.add({
                name: newLinkName,
                url: newLinkUrl
            });
            setNewLinkName('');
            setNewLinkUrl('');
        }
    };

    const handleDeleteLink = async (id) => {
        if (confirm('¿Eliminar este enlace guardado?')) {
            await db.meetingLinks.delete(id);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await db.export(); // We need dexie-export-import or manual export
            // Manual export strategy for simplicity and control without extra libs if possible, 
            // but dexie-export-import is standard. Let's try manual first to avoid install steps if risky.

            // Manual Export Logic
            const exportData = {
                version: 1,
                timestamp: new Date().toISOString(),
                tables: {}
            };

            const tables = db.tables.map(table => table.name);
            for (const tableName of tables) {
                exportData.tables[tableName] = await db.table(tableName).toArray();
            }

            const jsonString = JSON.stringify(exportData, null, 2);
            const url = URL.createObjectURL(new Blob([jsonString], { type: 'application/json' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `fono-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert('Error al exportar datos');
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!confirm('ADVERTENCIA: ¿Estás seguro de importar? Esto combinará los datos nuevos con los existentes. Se recomienda borrar datos antiguos si quieres una copia exacta, pero esta función intentará fusionar.')) {
            e.target.value = ''; // Reset input
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (!data.tables) throw new Error('Formato inválido');

                await db.transaction('rw', db.tables, async () => {
                    for (const tableName of Object.keys(data.tables)) {
                        const table = db.table(tableName);
                        if (table) {
                            // Bulk add (will fail on key collision if keys exist, rely on auto-increment)
                            // Ideally we want to merge or Put. 
                            // Since most IDs are auto-increment, importing from another PC might cause ID conflicts 
                            // if we try to keep original IDs. 
                            // Simple strategy: Put all.
                            await table.bulkPut(data.tables[tableName]);
                        }
                    }
                });
                alert('¡Datos importados correctamente! Recarga la página.');
                window.location.reload();
            } catch (error) {
                console.error(error);
                alert('Error al importar datos: ' + error.message);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
                <p className="text-slate-500">Personaliza tu experiencia y recursos.</p>
            </div>

            {/* Meeting Links Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center">
                        <LinkIcon className="mr-2 text-teal-600" size={20} />
                        Enlaces de Reunión Preconfigurados
                    </h2>
                    <p className="text-sm text-slate-500">
                        Guarda tus salas de Zoom, Meet o Teams frecuentes para usarlas rápidamente al agendar citas.
                    </p>
                </div>

                <div className="p-6 bg-slate-50">
                    <form onSubmit={handleAddLink} className="flex gap-4 items-end mb-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre (ej: Zoom Personal)</label>
                            <input
                                type="text"
                                required
                                placeholder="Mi Sala Zoom"
                                className="w-full border-slate-300 rounded-lg text-sm"
                                value={newLinkName}
                                onChange={e => setNewLinkName(e.target.value)}
                            />
                        </div>
                        <div className="flex-[2]">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL de la Reunión</label>
                            <input
                                type="url"
                                required
                                placeholder="https://zoom.us/j/..."
                                className="w-full border-slate-300 rounded-lg text-sm"
                                value={newLinkUrl}
                                onChange={e => setNewLinkUrl(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-medium flex items-center shadow-sm"
                        >
                            <Plus size={18} className="mr-2" /> Agregar
                        </button>
                    </form>

                    <div className="space-y-3">
                        {meetingLinks.length === 0 && (
                            <p className="text-center text-slate-400 text-sm py-4 italic">No tienes enlaces guardados.</p>
                        )}
                        {meetingLinks.map(link => (
                            <div key={link.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-700">{link.name}</h4>
                                    <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-teal-600 hover:underline flex items-center">
                                        {link.url} <ExternalLink size={12} className="ml-1" />
                                    </a>
                                </div>
                                <button
                                    onClick={() => handleDeleteLink(link.id)}
                                    className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Management Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center">
                            <Database className="mr-2 text-teal-600" size={20} />
                            Gestión de Datos (Respaldo)
                        </h2>
                        <p className="text-sm text-slate-500">
                            Descarga una copia de seguridad o importa datos desde otro dispositivo.
                        </p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-slate-200 rounded-xl p-6 hover:border-teal-300 transition-colors bg-white">
                        <div className="flex items-center mb-4 text-teal-700">
                            <Download size={24} className="mr-3" />
                            <h3 className="font-bold text-lg">Exportar Datos</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Descarga un archivo <code>.json</code> con todos tus pacientes, citas y registros.
                            Guárdalo en un lugar seguro o envíalo a tu otro dispositivo.
                        </p>
                        <button
                            onClick={handleExport}
                            className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 active:scale-95 transition-all"
                        >
                            Descargar Respaldo
                        </button>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors bg-white relative">
                        <div className="flex items-center mb-4 text-blue-700">
                            <Upload size={24} className="mr-3" />
                            <h3 className="font-bold text-lg">Importar Datos</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Carga un archivo de respaldo.
                            <span className="block mt-1 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-100 flex items-start">
                                <AlertCircle size={14} className="mr-1 mt-0.5 shrink-0" />
                                Esto combinará los datos del archivo con los actuales.
                            </span>
                        </p>
                        <label className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all text-center cursor-pointer block">
                            Seleccionar Archivo
                            <input type="file" onChange={handleImport} accept=".json" className="hidden" />
                        </label>
                    </div>
                </div>
            </div>

            {/* Visual Preferences Section (Placeholder for now) */}
            {/* 
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Apariencia</h2>
                    <p className="text-sm text-slate-500">Personaliza cómo se ve la aplicación.</p>
                </div>
                <div className="p-6">
                    <p className="text-slate-400 italic">Próximamente...</p>
                </div>
            </div> 
            */}
        </div>
    );
}
