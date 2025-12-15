import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { scoreByType, loadProgress, persistProgress } from './scoring';
import { useReadingLibrary } from './useReadingLibrary';
import { type Difficulty, type QType, type ReadingItem, type ReadingQuestionsConfig, type Progress } from './types';

const STORAGE_KEY = 'reading-questions-progress-v2';

function getTypeLabel(type: QType, t: (path: string, fallback?: any) => any) {
  return t(`interactiveActivities.games.readingQuestions.types.${type}`);
}

function getDifficultyLabel(level: Difficulty, t: (path: string, fallback?: any) => any) {
  return t(`interactiveActivities.games.readingQuestions.difficulties.${level}`);
}

const TYPE_ORDER: QType[] = ['literal', 'inferencial', 'figurado', 'emociones'];

/**
 * Juego clínico "Lectura breve y preguntas".
 * Objetivo: trabajar comprensión literal, inferencial y figurada con feedback
 * amable y evidencia textual. Se separa banco de lecturas, lógica y UI para
 * extender fácilmente y mantener modo lectura asistida/visual.
 */
export function ReadingQuestionsGame({
  config,
  t,
}: {
  config?: ReadingQuestionsConfig;
  t: (path: string, fallback?: any) => any;
}) {
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [assistMode, setAssistMode] = useState(false);
  const [visualOnly, setVisualOnly] = useState(false);
  const [readingIndex, setReadingIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [sessionResults, setSessionResults] = useState<{ type: QType; ok: boolean }[]>([]);
  const [progress, setProgress] = useState<Progress>(() => loadProgress(STORAGE_KEY));
  const { readings, loading } = useReadingLibrary(difficulty);
  const bank = useMemo<ReadingItem[]>(() => {
    if (config?.readings?.length) return config.readings;
    return readings;
  }, [config?.readings, readings]);

  const pool: ReadingItem[] = useMemo(
    () => bank.filter(reading => reading.difficulty === difficulty),
    [bank, difficulty]
  );

  useEffect(() => {
    setReadingIndex(0);
    setQuestionIndex(0);
    setChoice(null);
    setSessionResults([]);
  }, [difficulty, bank]);

  const reading: ReadingItem | undefined = pool[readingIndex % Math.max(pool.length, 1)];
  const question = reading?.questions?.[questionIndex];

  const answered = choice !== null;
  const ok = answered && question ? choice === question.correctIndex : false;

  if (loading) {
    return (
      <div className="space-y-2 text-sm text-slate-700">
        <p className="text-base font-semibold text-slate-900">
          {t('interactiveActivities.games.readingQuestions.title')}
        </p>
        <p className="text-slate-600">{t('interactiveActivities.games.readingQuestions.loading')}</p>
      </div>
    );
  }

  if (!reading || !question) {
    return (
      <div className="space-y-2 text-sm text-slate-700">
        <p className="text-base font-semibold text-slate-900">
          {t('interactiveActivities.games.readingQuestions.title')}
        </p>
        <p className="text-slate-600">
          {t('interactiveActivities.games.readingQuestions.empty')}
        </p>
      </div>
    );
  }

  const sessionSummary = scoreByType(sessionResults);

  function updateProgress(type: QType, success: boolean) {
    setProgress(prev => {
      const current = prev[type] ?? { correct: 0, total: 0 };
      const next: Progress = {
        ...prev,
        [type]: {
          correct: current.correct + (success ? 1 : 0),
          total: current.total + 1,
        },
      } as Progress;
      persistProgress(STORAGE_KEY, next);
      return next;
    });
  }

  function handleChoice(index: number) {
    if (answered || !question) return;
    setChoice(index);
    const success = index === question.correctIndex;
    setSessionResults(prev => [...prev, { type: question.type, ok: success }]);
    updateProgress(question.type, success);
  }

  function handleNext() {
    setChoice(null);
    if (reading && questionIndex + 1 < reading.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setQuestionIndex(0);
      setReadingIndex(prev => (pool.length > 0 ? (prev + 1) % pool.length : 0));
    }
  }

  const showText = !assistMode && !visualOnly;
  const showAssistPrompt = assistMode;
  const showImage = Boolean(reading.image);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700">
            {t('interactiveActivities.games.readingQuestions.instructions')}
          </p>
          <p className="text-xs text-slate-500">
            {t('interactiveActivities.games.readingQuestions.therapeuticNote')}
          </p>
          <a
            className="inline-flex items-center gap-1 text-xs text-teal-700 hover:underline"
            href="/biblioteca-lecturas"
          >
            {t('interactiveActivities.games.readingQuestions.libraryLink')}
          </a>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs text-slate-600">
          <label className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              {t('interactiveActivities.games.readingQuestions.labels.difficulty')}
            </span>
            <select
              value={difficulty}
              onChange={e => setDifficulty(Number(e.target.value) as Difficulty)}
              className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-sm"
            >
              {[1, 2, 3].map(level => (
                <option key={level} value={level}>
                  {getDifficultyLabel(level as Difficulty, t)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              checked={assistMode}
              onChange={e => setAssistMode(e.target.checked)}
            />
            <span>{t('interactiveActivities.games.readingQuestions.labels.assistMode')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              checked={visualOnly}
              onChange={e => setVisualOnly(e.target.checked)}
            />
            <span>{t('interactiveActivities.games.readingQuestions.labels.visualOnly')}</span>
          </label>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {t('interactiveActivities.games.readingQuestions.labels.reading')}
            </p>
            <h3 className="text-lg font-semibold text-slate-900">{reading.title}</h3>
            <p className="text-xs text-slate-500">{getDifficultyLabel(reading.difficulty as Difficulty, t)}</p>
          </div>
          <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
            {t('interactiveActivities.games.readingQuestions.labels.progressCounter', {
              current: readingIndex + 1,
              total: pool.length,
            })}
          </span>
        </div>

        {showImage && (
          <div className={clsx('w-full rounded-lg overflow-hidden border border-slate-100', visualOnly ? 'bg-white' : 'bg-slate-50')}>
            <img
              src={reading.image}
              alt={reading.title}
              className="w-full max-h-64 object-contain mx-auto"
              loading="lazy"
            />
          </div>
        )}

        {showText && (
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{reading.text}</p>
        )}

        {showAssistPrompt && (
          <div className="text-sm text-slate-700 bg-slate-50 border border-dashed border-slate-200 rounded-lg p-3">
            {t('interactiveActivities.games.readingQuestions.labels.assistDescription')}
          </div>
        )}

        {visualOnly && !reading.image && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2">
            {t('interactiveActivities.games.readingQuestions.labels.noImageFallback')}
          </p>
        )}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800">
            {t('interactiveActivities.games.readingQuestions.labels.question', {
              type: getTypeLabel(question.type, t),
            })}
          </p>
          <span className="text-xs text-slate-500">
            {t('interactiveActivities.games.readingQuestions.labels.questionCounter', {
              current: questionIndex + 1,
              total: reading.questions.length,
            })}
          </span>
        </div>
        <p className="text-slate-700">{question.prompt}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {question.options.map((opt, index) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleChoice(index)}
              disabled={answered}
              className={clsx(
                'text-left w-full border rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                'bg-white hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                answered && index === question.correctIndex && 'border-teal-500 text-teal-800',
                answered && choice === index && !ok && 'border-amber-500 text-amber-800'
              )}
            >
              {opt}
            </button>
          ))}
        </div>

        {answered && (
          <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2">
            <p className={clsx('text-sm font-semibold', ok ? 'text-teal-700' : 'text-amber-700')}>
              {ok
                ? t('interactiveActivities.games.readingQuestions.feedback.correct')
                : t('interactiveActivities.games.readingQuestions.feedback.retry')}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-800">
                {t('interactiveActivities.games.readingQuestions.labels.explanation')}:
              </span>{' '}
              {question.explanation}
            </p>
            {question.evidence && (
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-slate-800">
                  {t('interactiveActivities.games.readingQuestions.labels.evidence')}:
                </span>{' '}
                {question.evidence}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-600 text-white text-sm font-semibold shadow hover:bg-teal-700"
              >
                {t('interactiveActivities.games.readingQuestions.actions.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-slate-800">
          {t('interactiveActivities.games.readingQuestions.summary.title')}
        </p>
        <div className="grid md:grid-cols-2 gap-3 mt-2 text-sm text-slate-700">
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">
              {t('interactiveActivities.games.readingQuestions.summary.session')}
            </p>
            {TYPE_ORDER.map(type => (
              <p key={`session-${type}`}>
                {getTypeLabel(type, t)}: {sessionSummary[type]?.correct ?? 0}/{sessionSummary[type]?.total ?? 0}
              </p>
            ))}
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">
              {t('interactiveActivities.games.readingQuestions.summary.saved')}
            </p>
            {TYPE_ORDER.map(type => (
              <p key={`saved-${type}`}>
                {getTypeLabel(type, t)}: {progress[type]?.correct ?? 0}/{progress[type]?.total ?? 0}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
