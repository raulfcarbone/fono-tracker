import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { items as defaultItems } from './data';
import { isCorrect } from './scoring';
import { type Category, type Difficulty, type GameItem, type MeaningDetectiveConfig, type Progress } from './types';

const STORAGE_KEY = 'meaning-detective-progress-v1';

function shuffle<T>(list: T[]) {
  return [...list].sort(() => Math.random() - 0.5);
}

function loadProgress(): Progress {
  if (typeof window === 'undefined') return {
    inferencia: { correct: 0, total: 0 },
    emociones: { correct: 0, total: 0 },
    figurado: { correct: 0, total: 0 },
    semantica: { correct: 0, total: 0 },
  };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? (JSON.parse(stored) as Progress)
      : {
          inferencia: { correct: 0, total: 0 },
          emociones: { correct: 0, total: 0 },
          figurado: { correct: 0, total: 0 },
          semantica: { correct: 0, total: 0 },
        };
  } catch (error) {
    console.error('Error loading meaning detective progress', error);
    return {
      inferencia: { correct: 0, total: 0 },
      emociones: { correct: 0, total: 0 },
      figurado: { correct: 0, total: 0 },
      semantica: { correct: 0, total: 0 },
    };
  }
}

function persistProgress(next: Progress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Error saving meaning detective progress', error);
  }
}

const categoryOrder: Category[] = ['inferencia', 'emociones', 'figurado', 'semantica'];

/**
 * Juego "Detective del sentido".
 * Objetivo clínico: trabajar inferencias, comprensión de lenguaje figurado
 * y relaciones semánticas para favorecer comprensión y razonamiento verbal.
 *
 * Separa datos (items), lógica (selección, feedback) y presentación (UI accesible)
 * para que la terapeuta pueda agregar nuevos ítems sin tocar la mecánica.
 */
export function MeaningDetectiveGame({
  config,
  t,
}: {
  config?: MeaningDetectiveConfig;
  t: (path: string, fallback?: any) => any;
}) {
  const bank = config?.items?.length ? config.items : defaultItems;

  const [category, setCategory] = useState<Category>('inferencia');
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [poolIndex, setPoolIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [therapistMode, setTherapistMode] = useState(false);
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  const categories = useMemo(
    () =>
      categoryOrder.map(cat => ({
        id: cat,
        label: t(`interactiveActivities.games.meaningDetective.categories.${cat}`),
      })),
    [t]
  );

  const pool = useMemo(() => {
    const filtered = bank.filter(item => item.category === category && item.difficulty === difficulty);
    return shuffle(filtered);
  }, [bank, category, difficulty]);

  useEffect(() => {
    setPoolIndex(0);
    setChoice(null);
    setShowExplanation(false);
  }, [category, difficulty]);

  const item: GameItem | undefined = pool[poolIndex];
  const answered = choice !== null;
  const ok = answered && isCorrect(choice ?? 0, item?.correctIndex ?? -1);

  function updateProgress(isOk: boolean) {
    setProgress(prev => {
      const current = prev[category] ?? { correct: 0, total: 0 };
      const next: Progress = {
        ...prev,
        [category]: {
          correct: current.correct + (isOk ? 1 : 0),
          total: current.total + 1,
        },
      } as Progress;
      persistProgress(next);
      return next;
    });
  }

  function handleChoice(index: number) {
    if (!item || answered) return;
    setChoice(index);
    const success = isCorrect(index, item.correctIndex);
    updateProgress(success);
  }

  function handleNext() {
    setPoolIndex(prev => (pool.length > 0 ? (prev + 1) % pool.length : 0));
    setChoice(null);
    setShowExplanation(false);
  }

  if (!item) {
    return (
      <div className="space-y-2 text-sm text-slate-700">
        <p className="text-base font-semibold text-slate-900">
          {t('interactiveActivities.games.meaningDetective.title')}
        </p>
        <p className="text-slate-600">
          {t('interactiveActivities.games.meaningDetective.empty')}
        </p>
      </div>
    );
  }

  const justificationPrompts: string[] = t(
    'interactiveActivities.games.meaningDetective.justification.prompts',
    []
  );

  return (
    <div className="space-y-4 text-sm text-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {t('interactiveActivities.games.meaningDetective.title')}
          </p>
          <p className="text-xs text-slate-600 max-w-xl">
            {t('interactiveActivities.games.meaningDetective.description')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {t('interactiveActivities.games.meaningDetective.instructions')}
          </p>
        </div>
        <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2 min-w-[220px]">
          <p className="font-semibold text-slate-800 mb-1">
            {t('interactiveActivities.games.meaningDetective.progress.title')}
          </p>
          <div className="grid grid-cols-2 gap-1">
            {categories.map(cat => {
              const stats = progress[cat.id] ?? { correct: 0, total: 0 };
              return (
                <div key={cat.id} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">{cat.label}</span>
                  <span className="font-semibold text-teal-700">{`${stats.correct}/${stats.total}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="flex flex-col space-y-1 text-xs uppercase tracking-wide text-slate-500">
          <span>{t('interactiveActivities.games.meaningDetective.labels.category')}</span>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col space-y-1 text-xs uppercase tracking-wide text-slate-500">
          <span>{t('interactiveActivities.games.meaningDetective.labels.difficulty')}</span>
          <select
            value={difficulty}
            onChange={e => setDifficulty(Number(e.target.value) as Difficulty)}
            className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {[1, 2, 3].map(level => (
              <option key={level} value={level}>
                {t(`interactiveActivities.games.meaningDetective.difficulties.${level}`)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              checked={therapistMode}
              onChange={e => setTherapistMode(e.target.checked)}
            />
            <span className="font-semibold">
              {t('interactiveActivities.games.meaningDetective.labels.therapistMode')}
            </span>
          </label>
          <span className="text-[11px] text-slate-500">
            {t('interactiveActivities.games.meaningDetective.labels.therapistNote')}
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {t('interactiveActivities.games.meaningDetective.labels.situation')}
            </p>
            <p className="text-base font-semibold text-slate-900">{item.prompt}</p>
            <p className="text-sm text-slate-700">{item.question}</p>
          </div>
          {item.image ? (
            <img
              src={item.image}
              alt={item.prompt}
              className="h-24 w-24 object-contain self-end"
              loading="lazy"
            />
          ) : null}
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {item.options.map((opt, index) => {
            const isSelected = choice === index;
            const isAnswer = answered && isCorrect(index, item.correctIndex);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleChoice(index)}
                disabled={answered}
                className={clsx(
                  'text-left px-3 py-2 rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                  isSelected && 'border-teal-600 bg-teal-50 text-teal-900',
                  !isSelected && 'border-slate-200 bg-white text-slate-700',
                  answered && isAnswer && 'border-green-500 bg-green-50',
                  answered && !isAnswer && isSelected && 'border-amber-400 bg-amber-50'
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered ? (
          <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-md p-3 text-sm">
            <p className={clsx('font-semibold', ok ? 'text-teal-700' : 'text-amber-700')}>
              {ok
                ? t('interactiveActivities.games.meaningDetective.feedback.correct')
                : t('interactiveActivities.games.meaningDetective.feedback.retry')}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowExplanation(true)}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                {t('interactiveActivities.games.meaningDetective.actions.viewWhy')}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                {t('interactiveActivities.games.meaningDetective.actions.next')}
              </button>
            </div>

            {(showExplanation || therapistMode) && (
              <div className="border border-dashed border-slate-300 rounded-md p-3 bg-white text-sm text-slate-700 space-y-2">
                {item.hint && (
                  <p>
                    <span className="font-semibold">{t('interactiveActivities.games.meaningDetective.labels.hint')}: </span>
                    {item.hint}
                  </p>
                )}
                <p>
                  <span className="font-semibold">{t('interactiveActivities.games.meaningDetective.labels.explanation')}: </span>
                  {item.explanation}
                </p>
                {therapistMode && (
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">
                      {t('interactiveActivities.games.meaningDetective.labels.correctAnswer')}: 
                    </span>
                    {` ${item.options[item.correctIndex]}`}
                  </p>
                )}
              </div>
            )}

            {justificationPrompts?.length ? (
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  {t('interactiveActivities.games.meaningDetective.justification.title')}
                </p>
                <ul className="list-disc list-inside space-y-0.5">
                  {justificationPrompts.map(prompt => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-slate-500">
              {t('interactiveActivities.games.meaningDetective.labels.inviteToExplain')}
            </p>
            {therapistMode && (
              <div className="border border-dashed border-slate-300 rounded-md p-3 bg-white text-sm text-slate-700 space-y-2">
                {item.hint && (
                  <p>
                    <span className="font-semibold">{t('interactiveActivities.games.meaningDetective.labels.hint')}: </span>
                    {item.hint}
                  </p>
                )}
                <p>
                  <span className="font-semibold">{t('interactiveActivities.games.meaningDetective.labels.explanation')}: </span>
                  {item.explanation}
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">
                    {t('interactiveActivities.games.meaningDetective.labels.correctAnswer')}:
                  </span>
                  {` ${item.options[item.correctIndex]}`}
                  <span className="ml-1 text-[11px] text-slate-500">
                    {t('interactiveActivities.games.meaningDetective.labels.therapistPreview')}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
