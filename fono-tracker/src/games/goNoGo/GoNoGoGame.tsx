import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { rules as defaultRules, stimuli as defaultStimuli } from './data';
import { buildSequence } from './utils';
import { type GoNoGoConfig, type Rule, type Stimulus, type TrialResult } from './types';

const DEFAULT_DURATION = 2000;
const DEFAULT_LENGTH = 10;
const DEFAULT_ROUNDS = 1;

/**
 * Juego clínico "Escucha y elige" (Go/No-Go).
 * Objetivo terapéutico: entrenar atención selectiva e inhibición de respuesta
 * siguiendo una regla simple (GO solo cuando el estímulo coincide con la etiqueta
 * objetivo). Separa datos, lógica y presentación para permitir reemplazar
 * pictogramas, audios o reglas sin tocar la mecánica base.
 */
export function GoNoGoGame({
  config,
  t,
}: {
  config?: Partial<GoNoGoConfig>;
  t: (path: string, fallback?: any) => any;
}) {
  const stimuliBank = config?.stimuli?.length ? config.stimuli : defaultStimuli;
  const ruleBank = config?.rules?.length ? config.rules : defaultRules;
  const stimulusDuration = config?.stimulusDurationMs ?? DEFAULT_DURATION;
  const sequenceLength = config?.sequenceLength ?? DEFAULT_LENGTH;
  const rounds = config?.rounds ?? DEFAULT_ROUNDS;
  const enableAudio = config?.enableAudio ?? false;

  const [rule, setRule] = useState<Rule>(ruleBank[0]);
  const [sequence, setSequence] = useState<Stimulus[]>([]);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<TrialResult[]>([]);
  const [clickedThisTrial, setClickedThisTrial] = useState(false);
  const [microFeedbackKey, setMicroFeedbackKey] = useState('');
  const shownAtRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resolvedRules = useMemo(
    () =>
      ruleBank.map(r => ({
        ...r,
        title: t(`interactiveActivities.games.goNoGo.rules.${r.id}.title`, r.title),
        description: t(`interactiveActivities.games.goNoGo.rules.${r.id}.description`, r.description),
      })),
    [ruleBank, t]
  );

  const resolvedStimuli = useMemo(
    () =>
      stimuliBank.map(item => ({
        ...item,
        label: t(`interactiveActivities.games.goNoGo.stimuli.${item.id}`, item.label),
      })),
    [stimuliBank, t]
  );

  useEffect(() => {
    const updated = resolvedRules.find(r => r.id === rule.id) ?? resolvedRules[0];
    setRule(updated);
  }, [resolvedRules, rule.id]);

  const current = sequence[idx];
  const isTarget = current?.tags.includes(rule.matchTag);

  useEffect(() => {
    if (!started || !current) return undefined;
    setClickedThisTrial(false);
    setMicroFeedbackKey('');
    shownAtRef.current = performance.now();

    if (enableAudio && current.audio) {
      audioRef.current?.pause();
      audioRef.current = new Audio(current.audio);
      audioRef.current.play().catch(() => {});
    }

    const timeout = window.setTimeout(() => {
      if (!clickedThisTrial) {
        setResults(prev => [
          ...prev,
          { stimulusId: current.id, isTarget: !!isTarget, clicked: false },
        ]);
        if (!isTarget) {
          setMicroFeedbackKey('hold');
        }
      }
      setIdx(prev => prev + 1);
    }, stimulusDuration);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, idx, rule.id]);

  const microFeedbackClass = useMemo(
    () =>
      clsx(
        'text-xs font-semibold',
        ['hit', 'hold'].includes(microFeedbackKey) && 'text-teal-700',
        microFeedbackKey === 'almost' && 'text-amber-700'
      ),
    [microFeedbackKey]
  );

  function startRound() {
    const pickedSequence = buildSequence(resolvedStimuli, sequenceLength, rounds);
    setSequence(pickedSequence);
    setIdx(0);
    setResults([]);
    setStarted(true);
    setMicroFeedbackKey('');
  }

  function handleRuleChange(value: string) {
    const found = resolvedRules.find(r => r.id === value);
    setRule(found ?? resolvedRules[0]);
  }

  function handleClick() {
    if (!started || !current || clickedThisTrial) return;
    setClickedThisTrial(true);
    const rt = Math.round(performance.now() - shownAtRef.current);
    setResults(prev => [
      ...prev,
      { stimulusId: current.id, isTarget: !!isTarget, clicked: true, reactionTimeMs: rt },
    ]);
    setMicroFeedbackKey(isTarget ? 'hit' : 'almost');
    setIdx(prev => prev + 1);
  }

  if (!started) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{t('interactiveActivities.games.goNoGo.title')}</p>
          <p className="text-xs text-slate-600">{t('interactiveActivities.games.goNoGo.instructions')}</p>
        </div>
        <label className="flex flex-col space-y-1 text-sm text-slate-700">
          <span className="text-xs uppercase tracking-wide text-slate-500">{t('interactiveActivities.games.goNoGo.ruleLabel')}</span>
          <select
            value={rule.id}
            onChange={e => handleRuleChange(e.target.value)}
            className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {resolvedRules.map(r => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500">{rule.description}</span>
        </label>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{t('interactiveActivities.games.goNoGo.duration', `${stimulusDuration} ms`)}</span>
          <span>
            {t('interactiveActivities.games.goNoGo.sequenceLength')}: {sequenceLength} · {t('interactiveActivities.games.goNoGo.rounds')}: {rounds}
          </span>
        </div>
        <button
          type="button"
          onClick={startRound}
          className="inline-flex items-center px-3 py-2 rounded-md bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          {t('interactiveActivities.games.goNoGo.start')}
        </button>
      </div>
    );
  }

  if (!current) {
    const targets = results.filter(r => r.isTarget).length;
    const goHits = results.filter(r => r.isTarget && r.clicked).length;
    const goMiss = results.filter(r => r.isTarget && !r.clicked).length;
    const noGoFalse = results.filter(r => !r.isTarget && r.clicked).length;
    const summary = [
      { label: t('interactiveActivities.games.goNoGo.summary.targets'), value: targets },
      { label: t('interactiveActivities.games.goNoGo.summary.goHits'), value: goHits },
      { label: t('interactiveActivities.games.goNoGo.summary.goMiss'), value: goMiss },
      { label: t('interactiveActivities.games.goNoGo.summary.falseAlarms'), value: noGoFalse },
    ];

    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-800">{t('interactiveActivities.games.goNoGo.summary.title')}</p>
        <div className="grid grid-cols-2 gap-2">
          {summary.map(item => (
            <div key={item.label} className="bg-white border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="text-lg font-bold text-teal-700">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <p>{t('interactiveActivities.games.goNoGo.summary.note')}</p>
          <button
            type="button"
            onClick={() => setStarted(false)}
            className="inline-flex items-center px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {t('interactiveActivities.games.goNoGo.restart')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{rule.title}</p>
          <p className="text-xs text-slate-600">{rule.description}</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>
            {t('interactiveActivities.games.goNoGo.round')}: {idx + 1}/{sequence.length}
          </p>
          <p>{t('interactiveActivities.games.goNoGo.timing', `${stimulusDuration} ms`)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
        className="w-full bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        <span className="text-xs uppercase tracking-wide text-slate-500">
          {t('interactiveActivities.games.goNoGo.prompt')}
        </span>
        <div className="w-full flex flex-col items-center space-y-2">
          {current.image ? (
            <img src={current.image} alt={current.label} className="h-24 object-contain" loading="lazy" />
          ) : (
            <span className="text-4xl" aria-label={current.label}>
              {current.label}
            </span>
          )}
          <p className="text-sm font-semibold text-slate-700">{current.label}</p>
        </div>
      </button>

      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{t('interactiveActivities.games.goNoGo.guidance')}</span>
        <span className={microFeedbackClass}>
          {microFeedbackKey ? t(`interactiveActivities.games.goNoGo.microFeedback.${microFeedbackKey}`) : ''}
        </span>
      </div>
    </div>
  );
}
