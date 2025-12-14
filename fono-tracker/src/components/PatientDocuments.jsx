
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Upload, FileText, Download, Trash2, Printer, Plus, File as IconFile, Image as IconImage } from 'lucide-react';
import format from 'date-fns/format';
import es from 'date-fns/locale/es';

export function PatientDocuments({ patientId, patientName }) {
    const [activeSection, setActiveSection] = useState('formats'); // 'formats' | 'uploads'

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveSection('formats')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${activeSection === 'formats' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <FileText size={18} className="inline mr-2" />
                    Formatos y Planes
                </button>
                <button
                    onClick={() => setActiveSection('uploads')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${activeSection === 'uploads' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Upload size={18} className="inline mr-2" />
                    Documentos Externos
                </button>
            </div>

            <div className="p-6 flex-1 bg-slate-50/30">
                {activeSection === 'formats' ? (
                    <FormatsSection patientId={patientId} patientName={patientName} />
                ) : (
                    <UploadsSection patientId={patientId} />
                )}
            </div>
        </div>
    );
}

function FormatsSection({ patientId, patientName }) {
    const formats = useLiveQuery(() => db.patientFormats.where('patientId').equals(patientId).reverse().sortBy('createdAt')) || [];
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = async () => {
        if (!title || !content) return;
        await db.patientFormats.add({
            patientId,
            title,
            content,
            createdAt: new Date()
        });
        setIsCreating(false);
        setTitle('');
        setContent('');
    };

    const handleDelete = async (id) => {
        if (confirm('¿Borrar este formato?')) await db.patientFormats.delete(id);
    };

    const handlePrint = (fmt) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>${fmt.title} - ${patientName}</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
                    h1 { color: #0d9488; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                    .meta { color: #666; font-size: 0.9em; margin-bottom: 30px; }
                    .content { white-space: pre-wrap; font-size: 14px; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>${patientName}</h1>
                <div class="meta">
                    <strong>Documento:</strong> ${fmt.title}<br/>
                    <strong>Fecha:</strong> ${new Date(fmt.createdAt).toLocaleDateString()}
                </div>
                <div class="content">${fmt.content}</div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (isCreating) {
        return (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in">
                <h3 className="font-bold text-slate-800 mb-4">Nuevo Documento / Formato</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                        <input
                            type="text"
                            placeholder="Ej: Plan de Trabajo Fonoaudiológico"
                            className="w-full border-slate-300 rounded-lg"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contenido</label>
                        <textarea
                            rows={15}
                            placeholder="Describe aquí los objetivos, metodologías o resumen..."
                            className="w-full border-slate-300 rounded-lg font-mono text-sm"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                        >
                            Guardar Formato
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm">Genera documentos simples para imprimir o descargar como PDF.</p>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-medium shadow-sm"
                >
                    <Plus size={18} className="mr-2" />
                    Nuevo Formato
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {formats.length === 0 && (
                    <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        No hay formatos creados.
                    </div>
                )}
                {formats.map(fmt => (
                    <div key={fmt.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-teal-300 transition-all shadow-sm flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">{fmt.title}</h4>
                            <p className="text-xs text-slate-500 mb-2">Creado el {format(new Date(fmt.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</p>
                            <p className="text-slate-600 text-sm line-clamp-2">{fmt.content}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePrint(fmt)}
                                className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"
                                title="Imprimir / Descargar PDF"
                            >
                                <Printer size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(fmt.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UploadsSection({ patientId }) {
    const docs = useLiveQuery(() => db.patientDocs.where('patientId').equals(patientId).reverse().sortBy('date')) || [];
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Simple validation
            // if (file.size > 5000000) return alert('Archivo muy grande (max 5MB)');

            // Save to DB
            await db.patientDocs.add({
                patientId,
                name: file.name,
                type: file.type,
                size: file.size,
                date: new Date(),
                file: file // Storing the File object directly (Dexie supports blobs)
            });
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Eliminar este archivo?')) await db.patientDocs.delete(id);
    };

    const handleDownload = (doc) => {
        const url = URL.createObjectURL(doc.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                />
                <div className="pointer-events-none">
                    <Upload className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                    <p className="text-slate-600 font-medium">Haz clic o arrastra archivos aquí</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, Word, Imágenes (Max 10MB rec.)</p>
                </div>
            </div>

            <div className="space-y-3">
                {docs.length === 0 && (
                    <p className="text-center text-slate-400 py-4 italic">No hay documentos subidos.</p>
                )}
                {docs.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className={`p-2 rounded-lg ${doc.type.includes('image') ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                {doc.type.includes('image') ? <IconImage size={24} /> : <IconFile size={24} />}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-medium text-slate-800 truncate">{doc.name}</h4>
                                <p className="text-xs text-slate-500">
                                    {(doc.size / 1024).toFixed(0)} KB • {new Date(doc.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleDownload(doc)}
                                className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                title="Descargar"
                            >
                                <Download size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
