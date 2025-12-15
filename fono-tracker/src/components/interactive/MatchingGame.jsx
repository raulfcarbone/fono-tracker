import React, { useMemo, useState } from 'react';
import { Brain, Volume2 } from 'lucide-react';
import { useInteractiveProgress } from './useInteractiveProgress';
import { ModuleProgressPanel } from './ModuleProgressPanel';

// Mecánica terapéutica: asociación simple imagen→palabra/emoción para fortalecer
// vocabulario y reconocimiento emocional (inspirado en pictogramas de Games4Autism y TinyTalk).
export function MatchingGame({ moduleId, patientId }) {
    const pares = useMemo(
        () => [
            {
                id: 'alegre',
                imagen: '🙂',
                palabra: 'alegre',
                pista: 'Carita con mejillas levantadas',
            },
            {
                id: 'enojado',
                imagen: '😠',
                palabra: 'enojado',
                pista: 'Cejas hacia abajo, boca cerrada',
            },
            {
                id: 'sorprendido',
                imagen: '😮',
                palabra: 'sorprendido',
                pista: 'Ojos y boca abiertos',
            },
            {
                id: 'tranquilo',
                imagen: '😌',
                palabra: 'tranquilo',
                pista: 'Respiración lenta y mirada suave',
            },
        ],
        []
    );

    const [seleccion, setSeleccion] = useState(null);
    const [aciertos, setAciertos] = useState([]);
    const [timerStart, setTimerStart] = useState(Date.now());
    const { attempts, logAttempt, stats } = useInteractiveProgress(moduleId, patientId);

    const manejarSeleccion = item => {
        if (aciertos.includes(item.id)) return;
        const duration = Date.now() - timerStart;
        setSeleccion(item.id);
        setAciertos(prev => [...prev, item.id]);
        logAttempt({
            outcome: 'éxito',
            durationMs: duration,
            notes: `Identificó ${item.palabra}`,
            payload: { emotion: item.id },
        });
        setTimerStart(Date.now());
        setTimeout(() => setSeleccion(null), 800);
    };

    return (
        <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
                <div className="flex items-center text-sm font-semibold text-slate-700">
                    <Brain className="h-4 w-4 mr-2 text-amber-600" /> Asociación emoción-palabra
                </div>
                <p className="text-slate-700 text-sm">Elige la emoción que coincide con la palabra o pista presentada.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {pares.map(item => (
                        <button
                            key={item.id}
                            onClick={() => manejarSeleccion(item)}
                            className={`border rounded-lg p-3 flex flex-col items-center space-y-2 transition ${
                                aciertos.includes(item.id)
                                    ? 'border-emerald-300 bg-emerald-50'
                                    : 'border-slate-200 hover:border-amber-500'
                            }`}
                        >
                            <span className="text-3xl" aria-hidden>{item.imagen}</span>
                            <span className="font-semibold text-slate-800 capitalize">{item.palabra}</span>
                            <span className="text-xs text-slate-500 flex items-center space-x-1">
                                <Volume2 className="h-3 w-3" />
                                <span>{item.pista}</span>
                            </span>
                            {seleccion === item.id && <span className="text-xs text-emerald-700">¡Bien!</span>}
                        </button>
                    ))}
                </div>
            </div>

            <ModuleProgressPanel stats={stats} attempts={attempts} />
        </div>
    );
}
