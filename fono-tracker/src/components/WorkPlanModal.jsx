
import React, { useMemo } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { CLINICAL_AREAS } from '../lib/gas';
import format from 'date-fns/format';
import es from 'date-fns/locale/es';

export function WorkPlanModal({ patient, objectives, objectiveLastScores, onClose }) {

    // Process data: Group by Area and Calculate Averages
    const reportData = useMemo(() => {
        const data = {};

        CLINICAL_AREAS.forEach(area => {
            const areaObjectives = objectives.filter(o => o.area === area);
            if (areaObjectives.length === 0) return;

            // Calculate Average GAS for this area
            let totalGas = 0;
            let scoredCount = 0;

            areaObjectives.forEach(obj => {
                const score = objectiveLastScores[obj.id];
                if (score !== undefined) {
                    totalGas += score;
                    scoredCount++;
                }
            });

            const averageGas = scoredCount > 0 ? (totalGas / scoredCount) : null;

            data[area] = {
                objectives: areaObjectives,
                averageGas: averageGas
            };
        });

        return data;
    }, [objectives, objectiveLastScores]);

    const handlePrint = () => {
        const printContent = document.getElementById('work-plan-report').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Plan de Trabajo - ${patient.name}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
                    h1 { color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 10px; margin-bottom: 5px; }
                    .header { margin-bottom: 30px; color: #64748b; font-size: 0.9em; }
                    .area-section { margin-bottom: 30px; page-break-inside: avoid; }
                    .area-header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #e2e8f0; margin-bottom: 15px; padding-bottom: 5px; }
                    .area-title { font-size: 1.2em; font-weight: bold; color: #334155; }
                    .area-score { font-size: 0.9em; font-weight: bold; color: #0d9488; background: #ccfbf1; padding: 2px 8px; border-radius: 999px; }
                    .obj-list { list-style-type: none; padding: 0; }
                    .obj-item { margin-bottom: 10px; position: relative; padding-left: 20px; }
                    .obj-item::before { content: "•"; position: absolute; left: 0; color: #0d9488; font-weight: bold; }
                    .gas-label { font-size: 0.85em; color: #64748b; margin-left: 5px; }
                    @media print {
                        body { padding: 0; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <FileText size={20} className="mr-2 text-teal-600" />
                        Plan de Trabajo Completo
                    </h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrint}
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-1 rounded-lg text-sm font-medium flex items-center transition-colors"
                        >
                            <Printer size={16} className="mr-2" />
                            Imprimir / PDF
                        </button>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-8 bg-white" id="work-plan-report">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">{patient.name}</h1>
                        <div className="header">
                            <p><strong>Diagnóstico:</strong> {patient.diagnosis}</p>
                            <p><strong>Fecha del Informe:</strong> {format(new Date(), "d 'de' MMMM, yyyy", { locale: es })}</p>
                        </div>
                    </div>

                    {Object.keys(reportData).length === 0 ? (
                        <p className="text-center text-slate-400 italic">No hay objetivos registrados para este paciente.</p>
                    ) : (
                        CLINICAL_AREAS.map(area => {
                            const data = reportData[area];
                            if (!data) return null;

                            return (
                                <div key={area} className="area-section mb-8">
                                    <div className="area-header flex justify-between items-end border-b border-slate-200 pb-2 mb-4">
                                        <h3 className="area-title text-xl font-bold text-slate-800">{area}</h3>
                                        {data.averageGas !== null && (
                                            <span className="area-score bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full text-sm">
                                                Nivel de Cumplimiento Promedio: {data.averageGas > 0 ? '+' : ''}{data.averageGas.toFixed(1)} GAS
                                            </span>
                                        )}
                                    </div>
                                    <ul className="obj-list space-y-3">
                                        {data.objectives.map(obj => {
                                            const score = objectiveLastScores[obj.id];
                                            return (
                                                <li key={obj.id} className="obj-item flex items-start text-slate-700">
                                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                                    <div>
                                                        <span>{obj.description}</span>
                                                        {score !== undefined && (
                                                            <span className="gas-label text-xs text-slate-400 ml-2">
                                                                (Estado actual: {score > 0 ? '+' : ''}{score})
                                                            </span>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                        Generado por FonoTracker
                    </div>
                </div>
            </div>
        </div>
    );
}
