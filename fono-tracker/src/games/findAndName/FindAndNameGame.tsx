import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { findAndNameItems } from './data';
import { type FindAndNameItem } from './types';

const FEEDBACK_TIMEOUT = 900; // milisegundos para pasar al siguiente estímulo tras acierto

/**
 * Juego clínico "Encuentra y nombra".
 * Objetivo terapéutico: estimular vocabulario funcional, reforzar lenguaje
 * expresivo y sostener la atención en pares estímulo-respuesta sin
 * penalización. La lógica se mantiene desacoplada de los datos para que
 * el terapeuta pueda cambiar pictogramas o palabras sin modificar el código.
 */
export function FindAndNameGame({
  items = findAndNameItems,
  t,
}: {
  items?: FindAndNameItem[];
  t: (path: string, fallback?: any) => any;
}) {
  const safeItems = items.length ? items : findAndNameItems;
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'ok' | 'error' | null>(null);
  const [locked, setLocked] = useState(false);
  const currentItem = safeItems[index % safeItems.length];

  const shuffledOptions = useMemo(() => {
    const opts = [...currentItem.options];
    return opts.sort(() => Math.random() - 0.5);
  }, [currentItem]);

  function moveToNextCue() {
    setLocked(false);
    setFeedback(null);
    setIndex(prev => (prev + 1) % safeItems.length);
  }

  function handleSelect(option: string) {
    if (locked) return;
    if (option === currentItem.correctOption) {
      setFeedback('ok');
      setLocked(true);
      setTimeout(moveToNextCue, FEEDBACK_TIMEOUT);
    } else {
      setFeedback('error');
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-700 font-semibold">
          {t('interactiveActivities.games.findAndName.instructions')}
        </p>
        <span className="text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">
          {t('interactiveActivities.labels.currentStimulus')} {index + 1}/{safeItems.length}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-3 items-start">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {t('interactiveActivities.labels.visualCue')}
          </p>
          <div className="aspect-video rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
            <img
              src={currentItem.image}
              alt={currentItem.label}
              className="max-h-52 object-contain"
              loading="lazy"
            />
          </div>
          <p className="text-sm text-slate-600">{currentItem.label}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {t('interactiveActivities.games.findAndName.optionsLabel')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {shuffledOptions.map(option => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={clsx(
                  'w-full rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
                  'bg-white hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                  feedback === 'error' && option === currentItem.correctOption && 'border-teal-500',
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="min-h-[32px]">
            {feedback === 'ok' && (
              <span className="inline-flex items-center text-teal-700 text-sm font-semibold bg-teal-50 border border-teal-100 rounded-full px-3 py-1">
                {t('interactiveActivities.games.findAndName.success')}
              </span>
            )}
            {feedback === 'error' && (
              <span className="inline-flex items-center text-amber-700 text-sm font-semibold bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
                {t('interactiveActivities.games.findAndName.error')}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <p>{t('interactiveActivities.games.findAndName.prompt')}</p>
            <button
              type="button"
              onClick={moveToNextCue}
              className="inline-flex items-center px-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            >
              {t('interactiveActivities.games.findAndName.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
