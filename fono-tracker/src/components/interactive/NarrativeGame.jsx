import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, MessageCircle } from 'lucide-react';
import { ModuleProgressPanel } from './ModuleProgressPanel';
import { useInteractiveProgress } from './useInteractiveProgress';

// Mecánica terapéutica: narrativa con elecciones para modelar turnos conversacionales,
// anticipar consecuencias y fortalecer coherencia en historias (inspirado en Autsera).
export function NarrativeGame({ moduleId, patientId }) {
    const [step, setStep] = useState('inicio');
    const [timerStart, setTimerStart] = useState(Date.now());
    const { attempts, logAttempt, stats } = useInteractiveProgress(moduleId, patientId);

    const scenes = useMemo(
        () => ({
            inicio: {
                texto: 'Luna llega a la escuela y su amigo Mateo parece triste. ¿Cómo inicia la conversación?',
                opciones: [
                    { id: 'saludo', label: 'Preguntar con empatía', next: 'escucha', correcto: true },
                    { id: 'ignorar', label: 'Pasar de largo', next: 'cierre', correcto: false },
                ],
            },
            escucha: {
                texto: 'Mateo dice que olvidó su cuaderno. ¿Qué propones?',
                opciones: [
                    { id: 'prestar', label: 'Ofrecer prestarle hojas', next: 'refuerzo', correcto: true },
                    { id: 'reproche', label: 'Regañarlo', next: 'cierre', correcto: false },
                ],
            },
            refuerzo: {
                texto: 'Mateo sonríe y acepta. Propón un cierre positivo.',
                opciones: [
                    { id: 'plan', label: 'Planear juntos cómo organizarse mañana', next: 'cierre', correcto: true },
                    { id: 'despedida', label: 'Cerrar la conversación sin plan', next: 'cierre', correcto: false },
                ],
            },
            cierre: {
                texto: 'Fin del relato. Puedes reiniciar para ensayar otro camino.',
                opciones: [],
            },
        }),
        []
    );

    const current = scenes[step];

    const handleOption = opcion => {
        const now = Date.now();
        const duration = now - timerStart;
        const outcome = opcion.correcto ? 'éxito' : 'práctica';
        logAttempt({
            outcome,
            durationMs: duration,
            notes: `Opción seleccionada: ${opcion.label}`,
            payload: { step, option: opcion.id },
        });
        setStep(opcion.next);
        setTimerStart(Date.now());
    };

    const resetStory = () => {
        setStep('inicio');
        setTimerStart(Date.now());
    };

    return (
        <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
                <div className="flex items-center text-sm font-semibold text-slate-700">
                    <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                    Relato guiado con decisiones
                </div>
                <p className="text-slate-700">{current.texto}</p>

                <div className="space-y-2">
                    {current.opciones.length === 0 && (
                        <button
                            onClick={resetStory}
                            className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold"
                        >
                            Reiniciar relato
                        </button>
                    )}
                    {current.opciones.map(opcion => (
                        <button
                            key={opcion.id}
                            onClick={() => handleOption(opcion)}
                            className="w-full text-left px-3 py-2 border border-slate-200 rounded-lg hover:border-purple-500 transition"
                        >
                            <span className="flex items-center space-x-2">
                                <MessageCircle className="h-4 w-4 text-purple-500" />
                                <span>{opcion.label}</span>
                                {opcion.correcto && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <ModuleProgressPanel stats={stats} attempts={attempts} />
        </div>
    );
}
