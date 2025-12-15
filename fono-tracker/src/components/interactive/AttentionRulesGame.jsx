import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

const stimuliBank = [
  { icon: '🔵', label: 'círculo azul', target: false },
  { icon: '🟢', label: 'círculo verde', target: true },
  { icon: '⭐️', label: 'estrella amarilla', target: false },
  { icon: '🟠', label: 'círculo naranja', target: false },
  { icon: '🟢', label: 'círculo verde', target: true },
  { icon: '✨', label: 'destello', target: false },
];

const pickStimuli = () => Array.from({ length: 8 }, () => stimuliBank[Math.floor(Math.random() * stimuliBank.length)]);

/**
 * Objetivo terapéutico: entrenar control inhibitorio y atención selectiva
 * respondiendo solo cuando la tarjeta cumple la regla (círculo verde).
 */
export function AttentionRulesGame({ t }) {
  const [timeline, setTimeline] = useState(pickStimuli());
  const [position, setPosition] = useState(0);
  const [running, setRunning] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(t('interactiveActivities.games.attention.awaiting', '')); // fallback
  const intervalRef = useRef(null);

  const current = useMemo(() => timeline[position], [timeline, position]);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = setInterval(() => {
      setPosition(prev => {
        const next = prev + 1;
        if (next >= timeline.length) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setFeedback(t('interactiveActivities.games.attention.completed'));
          return prev;
        }
        return next;
      });
    }, 2300);

    return () => clearInterval(intervalRef.current);
  }, [running, timeline.length, t]);

  const handleRespond = (isResponding) => {
    const isHit = current?.target;
    if (isResponding && isHit) {
      setStreak(prev => prev + 1);
      setFeedback(t('interactiveActivities.games.attention.correctHit'));
    } else if (!isResponding && !isHit) {
      setStreak(prev => prev + 1);
      setFeedback(t('interactiveActivities.games.attention.correctHold'));
    } else {
      setStreak(0);
      setFeedback(t('interactiveActivities.games.attention.mistake'));
    }
  };

  const restartRound = () => {
    setTimeline(pickStimuli());
    setPosition(0);
    setStreak(0);
    setFeedback(t('interactiveActivities.games.attention.instructions'));
  };

  const toggleRunning = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
      return;
    }
    restartRound();
    setRunning(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{t('interactiveActivities.games.attention.instructions')}</p>
          <p className="text-xs text-slate-500">{t('interactiveActivities.games.attention.ruleDetail')}</p>
        </div>
        <button
          type="button"
          onClick={toggleRunning}
          className="text-xs font-semibold text-teal-700 hover:text-teal-900"
        >
          {running ? t('interactiveActivities.games.attention.stop') : t('interactiveActivities.games.attention.start')}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-4xl" aria-label={current?.label || 'pausa'}>{current?.icon || '⏸️'}</div>
          <div>
            <p className="text-xs text-slate-500">{t('interactiveActivities.labels.currentStimulus')}</p>
            <p className="text-sm font-semibold capitalize">{current?.label || t('interactiveActivities.labels.pause')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">{t('interactiveActivities.games.attention.streak')}</p>
          <p className="text-lg font-bold text-teal-700">{streak}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleRespond(true)}
          className="border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-md py-2 text-sm font-semibold"
        >
          {t('interactiveActivities.games.attention.respond')}
        </button>
        <button
          type="button"
          onClick={() => handleRespond(false)}
          className="border border-slate-200 bg-white hover:border-slate-300 text-slate-700 rounded-md py-2 text-sm font-semibold"
        >
          {t('interactiveActivities.games.attention.pass')}
        </button>
      </div>

      <div className={clsx('text-xs font-semibold', feedback?.includes('incorrecta') ? 'text-rose-700' : 'text-teal-700')}>
        {t('interactiveActivities.games.attention.lastFeedback')}: {feedback}
      </div>
    </div>
  );
}
