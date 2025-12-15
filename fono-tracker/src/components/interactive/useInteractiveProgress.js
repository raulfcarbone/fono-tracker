import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../../db';

// Hook reutilizable para registrar y leer progreso de juegos interactivos.
// Guarda intentos, aciertos y duración en IndexedDB para funcionar offline y asociar
// un paciente en el futuro mediante patientId.
export function useInteractiveProgress(moduleId, patientId) {
    const [attempts, setAttempts] = useState([]);

    const refresh = useCallback(async () => {
        const data = await db.interactiveProgress.where('moduleId').equals(moduleId).sortBy('createdAt');
        setAttempts(data.reverse());
    }, [moduleId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const logAttempt = useCallback(
        async ({ outcome, durationMs, notes, payload = {} }) => {
            await db.interactiveProgress.add({
                moduleId,
                patientId: patientId || null,
                createdAt: new Date().toISOString(),
                durationMs,
                outcome,
                notes,
                payload,
            });
            refresh();
        },
        [moduleId, patientId, refresh]
    );

    const stats = useMemo(() => {
        const total = attempts.length;
        const successes = attempts.filter(a => a.outcome === 'éxito').length;
        const avgDuration =
            attempts.length > 0
                ? Math.round(attempts.reduce((acc, cur) => acc + (cur.durationMs || 0), 0) / attempts.length)
                : 0;
        return {
            total,
            successes,
            avgDuration,
        };
    }, [attempts]);

    return { attempts, logAttempt, stats };
}
