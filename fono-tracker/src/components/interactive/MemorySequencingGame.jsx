import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

const symbols = ['🟦', '🟥', '🟨', '🟩', '⭐️', '⚡️'];

const getSequence = length => Array.from({ length }, () => symbols[Math.floor(Math.random() * symbols.length)]);

/**
 * Objetivo terapéutico: entrenar memoria de trabajo y secuenciación.
 * La dificultad aumenta al superar cada nivel.
 */
export function MemorySequencingGame({ t }) {
  const [level, setLevel] = useState(3);
  const [sequence, setSequence] = useState(() => getSequence(3));
  const [showing, setShowing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const timeouts = useRef([]);

  const preparedSequence = useMemo(() => sequence, [sequence]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  const startShow = () => {
    setShowing(true);
    setFeedback(t('interactiveActivities.games.memory.awaiting'));
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    preparedSequence.forEach((symbol, idx) => {
      const timeout = setTimeout(() => {
        setCurrentIndex(idx);
        if (idx === preparedSequence.length - 1) {
          const endTimeout = setTimeout(() => {
            setShowing(false);
            setCurrentIndex(0);
            setFeedback('');
          }, 600);
          timeouts.current.push(endTimeout);
        }
      }, idx * 800);
      timeouts.current.push(timeout);
    });
  };

  const handleChoice = symbol => {
    if (showing) return;
    const expected = preparedSequence[currentIndex];
    if (symbol === expected) {
      const nextIndex = currentIndex + 1;
      if (nextIndex === preparedSequence.length) {
        setFeedback(t('interactiveActivities.games.memory.feedbackSuccess'));
        setLevel(prev => prev + 1);
        setSequence(getSequence(sequence.length + 1));
        setCurrentIndex(0);
      } else {
        setCurrentIndex(nextIndex);
      }
    } else {
      setFeedback(t('interactiveActivities.games.memory.feedbackError'));
      setLevel(3);
      setSequence(getSequence(3));
      setCurrentIndex(0);
    }
  };

  const resetGame = () => {
    setLevel(3);
    setSequence(getSequence(3));
    setCurrentIndex(0);
    setFeedback('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{t('interactiveActivities.games.memory.instructions')}</p>
          <p className="text-xs text-slate-500">{t('interactiveActivities.games.memory.level')}: {level}</p>
        </div>
        <div className="space-x-2 text-xs font-semibold">
          <button
            type="button"
            onClick={startShow}
            className="text-teal-700 hover:text-teal-900"
          >
            {t('interactiveActivities.games.memory.start')}
          </button>
          <button
            type="button"
            onClick={() => {
              setLevel(prev => prev + 1);
              setSequence(getSequence(sequence.length + 1));
              setCurrentIndex(0);
            }}
            className="text-slate-600 hover:text-slate-800"
          >
            {t('interactiveActivities.games.memory.nextLevel')}
          </button>
          <button
            type="button"
            onClick={resetGame}
            className="text-rose-600 hover:text-rose-700"
          >
            {t('interactiveActivities.games.memory.reset')}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2">
        {preparedSequence.map((symbol, idx) => (
          <div
            key={`${symbol}-${idx}`}
            className={clsx(
              'w-10 h-10 rounded-lg border grid place-items-center text-xl',
              showing && idx === currentIndex
                ? 'border-teal-500 bg-teal-50'
                : 'border-slate-200 bg-white'
            )}
            aria-label={`posicion-${idx + 1}`}
          >
            {symbol}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {symbols.map(symbol => (
          <button
            key={symbol}
            type="button"
            onClick={() => handleChoice(symbol)}
            className="border border-slate-200 bg-white hover:border-teal-300 rounded-md py-2 text-xl"
          >
            {symbol}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={clsx('text-xs font-semibold', feedback.includes('no coincidió') ? 'text-rose-700' : 'text-teal-700')}>
          {feedback}
        </div>
      )}
    </div>
  );
}
