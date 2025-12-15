import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { stories as defaultStories } from './data';
import { countCorrectPositions, isCorrectOrder } from './scoring';
import { type Story, type StoryOrderConfig } from './types';

const STORAGE_KEY = 'story-order-progress-v1';

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

type Progress = Record<string, { attempts: number; completed: boolean }>;

function clampCardsCount(requested: number, maxCards: number) {
  const upper = Math.min(6, maxCards);
  const lower = Math.min(3, upper);
  if (Number.isNaN(requested)) return upper;
  return Math.max(lower, Math.min(requested, upper));
}

function loadProgress(): Progress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch (error) {
    console.error('Error loading story order progress', error);
    return {};
  }
}

function persistProgress(next: Progress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Error saving story order progress', error);
  }
}

/**
 * Juego clínico "Ordena la historia".
 * Objetivo: trabajar organización narrativa (inicio-desarrollo-final), coherencia temporal/causal
 * y memoria de trabajo. Separar estímulos de la lógica permite ajustar historias o pictogramas
 * sin tocar la mecánica.
 */
export function StoryOrderGame({
  config,
  t,
}: {
  config?: Partial<StoryOrderConfig>;
  t: (path: string, fallback?: any) => any;
}) {
  const bank = config?.stories?.length ? config.stories : defaultStories;
  const [progress, setProgress] = useState<Progress>({});
  const [visualOnly, setVisualOnly] = useState<boolean>(config?.visualOnly ?? false);

  const resolvedStories = useMemo(
    () =>
      bank.map((story: Story) => ({
        ...story,
        title: t(`interactiveActivities.games.storyOrder.stories.${story.id}.title`, story.title),
        cards: story.cards.map(card => ({
          ...card,
          text: card.text
            ? t(`interactiveActivities.games.storyOrder.stories.${story.id}.cards.${card.id}`, card.text)
            : undefined,
        })),
        prompts: {
          starter: story.prompts?.starter
            ? t(`interactiveActivities.games.storyOrder.stories.${story.id}.prompts.starter`, story.prompts.starter)
            : undefined,
          connectors:
            story.prompts?.connectors?.map((conn, index) =>
              t(
                `interactiveActivities.games.storyOrder.stories.${story.id}.prompts.connectors.${index}`,
                conn
              )
            ) ?? [],
          questions:
            story.prompts?.questions?.map((q, index) =>
              t(`interactiveActivities.games.storyOrder.stories.${story.id}.prompts.questions.${index}`, q)
            ) ?? [],
        },
      })),
    [bank, t]
  );

  const [selectedStoryId, setSelectedStoryId] = useState<string>(resolvedStories[0]?.id ?? '');

  const selectedStory = useMemo(
    () => resolvedStories.find(story => story.id === selectedStoryId) ?? resolvedStories[0],
    [resolvedStories, selectedStoryId]
  );

  const cardsLimit = useMemo(
    () => clampCardsCount(config?.cardsCount ?? selectedStory.cards.length, selectedStory.cards.length),
    [config?.cardsCount, selectedStory.cards.length]
  );

  const limitedCorrectOrder = useMemo(
    () => selectedStory.correctOrder.slice(0, cardsLimit),
    [cardsLimit, selectedStory.correctOrder]
  );

  const limitedCards = useMemo(
    () => selectedStory.cards.filter(card => limitedCorrectOrder.includes(card.id)),
    [limitedCorrectOrder, selectedStory.cards]
  );

  const [order, setOrder] = useState<string[]>(() => shuffle(limitedCards.map(card => card.id)));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setOrder(shuffle(limitedCards.map(card => card.id)));
    setChecked(false);
  }, [limitedCards]);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const storyProgress = progress[selectedStory.id] ?? { attempts: 0, completed: false };

  const correctPositions = countCorrectPositions(order, limitedCorrectOrder);
  const storyResolved = isCorrectOrder(order, limitedCorrectOrder);
  const successFeedback = t('interactiveActivities.games.storyOrder.feedback.success');
  const partialFeedback = t('interactiveActivities.games.storyOrder.feedback.partial');
  const resolvedPartialFeedback =
    typeof partialFeedback === 'function' ? partialFeedback({ ok: correctPositions }) : partialFeedback;

  function updateProgress(updates: Partial<{ attempts: number; completed: boolean }>) {
    setProgress(prev => {
      const next: Progress = {
        ...prev,
        [selectedStory.id]: {
          attempts: updates.attempts ?? storyProgress.attempts,
          completed: updates.completed ?? storyProgress.completed,
        },
      };
      persistProgress(next);
      return next;
    });
  }

  function handleMove(id: string, direction: -1 | 1) {
    setOrder(prev => {
      const currentIndex = prev.indexOf(id);
      const nextIndex = currentIndex + direction;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
      return next;
    });
  }

  function handleCheck() {
    setChecked(true);
    updateProgress({
      attempts: storyProgress.attempts + 1,
      completed: storyResolved || storyProgress.completed,
    });
  }

  function handleShuffle() {
    setOrder(shuffle(limitedCards.map(card => card.id)));
    setChecked(false);
  }

  function handleStoryChange(value: string) {
    setSelectedStoryId(value);
    setChecked(false);
  }

  return (
    <div className="space-y-3 text-sm text-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{t('interactiveActivities.games.storyOrder.title')}</p>
          <p className="text-xs text-slate-600 max-w-xl">{t('interactiveActivities.games.storyOrder.description')}</p>
        </div>
        <div className="text-right text-xs text-slate-500 space-y-1">
          <p>
            {t('interactiveActivities.games.storyOrder.progress.attempts')}: {storyProgress.attempts}
          </p>
          <p className={clsx(storyProgress.completed && 'text-teal-700 font-semibold')}>
            {t('interactiveActivities.games.storyOrder.progress.completed')}: {storyProgress.completed ? '✓' : '—'}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="flex flex-col space-y-1 text-xs uppercase tracking-wide text-slate-500">
          <span>{t('interactiveActivities.games.storyOrder.storySelector')}</span>
          <select
            value={selectedStory.id}
            onChange={e => handleStoryChange(e.target.value)}
            className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {resolvedStories.map(story => (
              <option key={story.id} value={story.id}>
                {story.title}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col space-y-1 text-xs uppercase tracking-wide text-slate-500">
          <span>{t('interactiveActivities.games.storyOrder.modeLabel')}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVisualOnly(false)}
              className={clsx(
                'flex-1 px-3 py-2 rounded-md border text-sm font-semibold',
                !visualOnly
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white border-slate-200 text-slate-700'
              )}
            >
              {t('interactiveActivities.games.storyOrder.modes.text')}
            </button>
            <button
              type="button"
              onClick={() => setVisualOnly(true)}
              className={clsx(
                'flex-1 px-3 py-2 rounded-md border text-sm font-semibold',
                visualOnly
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white border-slate-200 text-slate-700'
              )}
            >
              {t('interactiveActivities.games.storyOrder.modes.visual')}
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-end text-xs text-slate-600">
          <p>{t('interactiveActivities.games.storyOrder.instructions')}</p>
          <p className="text-[11px] text-slate-500">
            {t('interactiveActivities.games.storyOrder.helper')}
          </p>
        </div>
      </div>

      {selectedStory.prompts?.starter ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
          {selectedStory.prompts.starter}
        </div>
      ) : null}

      <ul className="grid sm:grid-cols-2 gap-3 list-none p-0">
        {order.map(id => {
          const card = limitedCards.find(c => c.id === id);
          if (!card) return null;
          return (
            <li
              key={id}
              className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  {t('interactiveActivities.games.storyOrder.labels.card')} {limitedCorrectOrder.indexOf(id) + 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(id, -1)}
                    className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    aria-label={t('interactiveActivities.games.storyOrder.labels.moveLeft')}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(id, 1)}
                    className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    aria-label={t('interactiveActivities.games.storyOrder.labels.moveRight')}
                  >
                    →
                  </button>
                </div>
              </div>

              {card.image && (
                <img
                  src={card.image}
                  alt={card.text ?? t('interactiveActivities.games.storyOrder.labels.storyCard')}
                  className="w-full h-36 object-contain"
                  loading="lazy"
                />
              )}
              {!visualOnly && card.text && <p className="text-slate-700 text-sm">{card.text}</p>}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCheck}
          className="inline-flex items-center px-3 py-2 rounded-md bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          {t('interactiveActivities.games.storyOrder.actions.check')}
        </button>
        <button
          type="button"
          onClick={handleShuffle}
          className="inline-flex items-center px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          {t('interactiveActivities.games.storyOrder.actions.shuffle')}
        </button>
      </div>

      {checked && (
        <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className={clsx('text-sm font-semibold', storyResolved ? 'text-teal-700' : 'text-amber-700')}>
            {storyResolved ? successFeedback : resolvedPartialFeedback}
          </p>
          <div className="text-xs text-slate-600 space-y-2">
            <div>
              <p className="font-semibold text-slate-800">
                {t('interactiveActivities.games.storyOrder.prompts.connectorsTitle')}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {selectedStory.prompts?.connectors?.map(connector => (
                  <li key={connector}>{connector}</li>
                ))}
              </ul>
            </div>
            {selectedStory.prompts?.questions?.length ? (
              <div>
                <p className="font-semibold text-slate-800">
                  {t('interactiveActivities.games.storyOrder.prompts.questionsTitle')}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedStory.prompts.questions.map(question => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
