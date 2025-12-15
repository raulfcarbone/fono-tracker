import React from 'react';
import { Clock3, Sparkles } from 'lucide-react';

export function ModuleProgressPanel({ stats, attempts }) {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center text-sm font-semibold text-slate-700">
                <Sparkles className="h-4 w-4 mr-2 text-teal-600" />
                Progreso del módulo
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm text-slate-700">
                <div>
                    <p className="text-xs text-slate-500">Intentos</p>
                    <p className="text-lg font-semibold">{stats.total}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Aciertos</p>
                    <p className="text-lg font-semibold">{stats.successes}</p>
                </div>
                <div className="flex items-center space-x-1">
                    <Clock3 className="h-4 w-4 text-slate-500" />
                    <div>
                        <p className="text-xs text-slate-500">Promedio (s)</p>
                        <p className="text-lg font-semibold">{Math.round((stats.avgDuration || 0) / 1000)}</p>
                    </div>
                </div>
            </div>
            {attempts.length > 0 && (
                <div className="space-y-1 text-xs text-slate-600">
                    {attempts.slice(0, 3).map(item => (
                        <div key={item.id || item.createdAt} className="flex justify-between">
                            <span>{new Date(item.createdAt).toLocaleString()}</span>
                            <span className="font-semibold text-teal-700">{item.outcome}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
