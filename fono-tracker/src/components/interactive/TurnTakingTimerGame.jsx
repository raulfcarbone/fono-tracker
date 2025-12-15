import React, { useEffect, useMemo, useState } from 'react';
import { AlarmClock, Check, RotateCcw, XCircle } from 'lucide-react';
import { useInteractiveProgress } from './useInteractiveProgress';
import { ModuleProgressPanel } from './ModuleProgressPanel';

// Mecánica terapéutica: juego por turnos con temporizador y feedback inmediato
// para entrenar inhibición y control de impulsos (inspirado en minijuegos de planificación de Autsera y nteract-games).
export function TurnTakingTimerGame({ moduleId, patientId }) {
    const items = useMemo(
        () => [
            {
                prompt: 'Escucha el audio imaginario de /s/ y elige si coincide con la imagen de "sol"',
                expected: 'sí',
                options: ['sí', 'no'],
            },
            {
                prompt: 'Se muestra un pictograma de "esperar". ¿El terapeuta debe hablar ahora?',
                expected: 'no',
                options: ['sí', 'no'],
            },
            {
                prompt: 'Reloj en amarillo. ¿Es momento de preparar la siguiente consigna?',
                expected: 'sí',
                options: ['sí', 'no'],
            },
        ],
        []
    );

    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [timerStart, setTimerStart] = useState(Date.now());
    const { attempts, logAttempt, stats } = useInteractiveProgress(moduleId, patientId);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            registrarRespuesta(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    const registrarRespuesta = opcion => {
        const actual = items[index];
        const duration = Date.now() - timerStart;
        const esCorrecto = opcion && opcion === actual.expected;
        logAttempt({
            outcome: esCorrecto ? 'éxito' : 'práctica',
            durationMs: duration,
            notes: opcion ? `Respuesta ${opcion}` : 'Sin respuesta a tiempo',
            payload: { prompt: actual.prompt, opcion },
        });
        setIndex(prev => (prev + 1) % items.length);
        setTimeLeft(20);
        setTimerStart(Date.now());
    };

    return (
        <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span className="flex items-center">
                        <AlarmClock className="h-4 w-4 mr-2 text-blue-600" /> Juego por turnos y temporizador
                    </span>
                    <span className="text-xs text-slate-500">Tiempo: {timeLeft}s</span>
                </div>
                <p className="text-slate-700">{items[index].prompt}</p>
                <div className="grid grid-cols-2 gap-3">
                    {items[index].options.map(opcion => (
                        <button
                            key={opcion}
                            onClick={() => registrarRespuesta(opcion)}
                            className="px-3 py-2 border border-slate-200 rounded-lg flex items-center justify-center space-x-2 hover:border-blue-500 transition"
                        >
                            {opcion === 'sí' ? (
                                <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                                <XCircle className="h-4 w-4 text-rose-500" />
                            )}
                            <span className="font-semibold text-slate-800 capitalize">{opcion}</span>
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => {
                        setTimeLeft(20);
                        setTimerStart(Date.now());
                    }}
                    className="inline-flex items-center text-xs text-blue-700 hover:text-blue-900"
                >
                    <RotateCcw className="h-4 w-4 mr-1" /> Reiniciar conteo
                </button>
            </div>

            <ModuleProgressPanel stats={stats} attempts={attempts} />
        </div>
    );
}
