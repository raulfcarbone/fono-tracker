import React, { useMemo, useState } from 'react';
import clsx from 'clsx';

const stimuli = [
  { id: 'manzana', icon: '🍎', label: 'manzana', options: ['manzana', 'mesa', 'luna'] },
  { id: 'gato', icon: '🐱', label: 'gato', options: ['perro', 'gato', 'pez'] },
  { id: 'libro', icon: '📚', label: 'libro', options: ['cuaderno', 'libro', 'mapa'] },
  { id: 'tren', icon: '🚂', label: 'tren', options: ['coche', 'tren', 'barco'] },
  { id: 'flor', icon: '🌼', label: 'flor', options: ['árbol', 'flor', 'nube'] },
];

const shuffle = array => [...array].sort(() => Math.random() - 0.5);

/**
 * Objetivo terapéutico: asociar estímulo visual con palabra escrita
 * reforzando comprensión y evocación con retroalimentación inmediata.
 */
export function ImageWordAssociation({ t }) {
  const randomized = useMemo(() => shuffle(stimuli), []);
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState(null);
  const [score, setScore] = useState(0);

  const current = randomized[index];

  const handleSelect = option => {
    const correct = option === current.label;
    setSelection({ option, correct });
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextStimulus = () => {
    setSelection(null);
    setIndex(prev => (prev + 1) % randomized.length);
  };

  const resetGame = () => {
    setSelection(null);
    setIndex(0);
    setScore(0);
  };

  return (
    <div className="space-y-3 text-slate-800">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{t('interactiveActivities.games.imageWord.instructions')}</p>
        <span className="text-xs text-slate-500">{t('interactiveActivities.games.imageWord.score')}: {score}</span>
      </div>

      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-teal-50 border border-slate-200 rounded-lg p-3">
        <div className="flex items-center space-x-3">
          <div className="text-4xl" aria-label={current.label}>{current.icon}</div>
          <div>
            <p className="text-xs text-slate-500">{t('interactiveActivities.labels.visualCue')}</p>
            <p className="text-sm font-semibold capitalize">{current.label}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetGame}
          className="text-xs font-semibold text-teal-700 hover:text-teal-900"
        >
          {t('interactiveActivities.games.imageWord.reset')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {current.options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            className={clsx(
              'border rounded-md py-2 px-3 text-sm capitalize transition-colors',
              selection?.option === option
                ? selection.correct && option === current.label
                  ? 'border-teal-500 bg-teal-50 text-teal-800'
                  : 'border-rose-400 bg-rose-50 text-rose-700'
                : 'border-slate-200 bg-white hover:border-teal-300'
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {selection && (
        <div
          className={clsx(
            'text-sm font-semibold flex items-center space-x-2',
            selection.correct ? 'text-teal-700' : 'text-rose-700'
          )}
        >
          <span className="text-lg" aria-hidden>
            {selection.correct ? '✅' : '💡'}
          </span>
          <span>
            {selection.correct
              ? t('interactiveActivities.games.imageWord.success')
              : t('interactiveActivities.games.imageWord.error')}
          </span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStimulus}
          className="text-xs font-semibold text-teal-700 hover:text-teal-900"
        >
          {t('interactiveActivities.games.imageWord.next')}
        </button>
      </div>
    </div>
  );
}
