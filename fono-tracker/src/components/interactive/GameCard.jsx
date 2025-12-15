import React from 'react';
import { BadgeCheck, Languages, Play, Maximize2, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

/**
 * Tarjeta reutilizable para mostrar la ficha clínica de cada juego.
 * Incluye vista previa embebida y accesos a modo pantalla amplia.
 */
export function GameCard({ game, t }) {
  const GameComponent = game.component;
  const navigate = useNavigate();
  const runnerPath = `/actividades-interactivas/jugar/${game.id}`;

  const handleOpenWide = () => {
    navigate(runnerPath);
  };

  const handleOpenNewTab = () => {
    window.open(runnerPath, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-xs font-semibold">
            {t(`interactiveActivities.categories.${game.category}`)}
          </p>
          <h2 className="text-xl font-semibold text-slate-900">{game.title}</h2>
          <p className="text-slate-600 text-sm max-w-3xl">{game.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={handleOpenWide}
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-lg hover:bg-teal-100"
            >
              <Maximize2 className="h-4 w-4" />
              {t('interactiveActivities.labels.openWide')}
            </button>
            <button
              type="button"
              onClick={handleOpenNewTab}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              {t('interactiveActivities.labels.newTab')}
            </button>
            <span className="text-xs text-slate-500 inline-flex items-center gap-1">
              <Play className="h-3.5 w-3.5" />
              {t('interactiveActivities.labels.previewMode')}
            </span>
          </div>
        </div>
        <div className="text-right space-y-2 min-w-[140px]">
          <p className="text-xs text-slate-500 uppercase tracking-wide">{t('interactiveActivities.labels.status')}</p>
          <span
            className={clsx(
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
              game.status === 'integrado' && 'bg-teal-50 text-teal-700',
              game.status === 'prototipo' && 'bg-amber-50 text-amber-700',
              game.status === 'idea' && 'bg-slate-100 text-slate-700'
            )}
          >
            {t(`interactiveActivities.status.${game.status}`)}
          </span>
          {game.languageIndependent && (
            <div className="flex items-center justify-end text-xs text-slate-500">
              <Languages className="h-4 w-4 mr-1" />
              {t('interactiveActivities.labels.languageIndependent')}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-slate-700">
            {t('interactiveActivities.labels.therapeuticGoals')}
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            {game.therapeuticGoals.map(goal => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
          <p className="text-sm font-semibold text-slate-700 mt-3">
            {t('interactiveActivities.labels.cognitiveSkills')}
          </p>
          <div className="flex flex-wrap gap-2">
            {game.cognitiveSkills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-1 text-xs rounded-full bg-white border border-slate-200 text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {t('interactiveActivities.labels.ageRange')}: {game.ageRange}
          </p>
          <p className="text-xs text-teal-700 font-semibold">
            {t('interactiveActivities.labels.wideRecommended')}
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 via-white to-sky-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold text-teal-800">
            <span className="flex items-center space-x-2">
              <BadgeCheck className="h-4 w-4" />
              <span>{t('interactiveActivities.labels.integratedModule')}</span>
            </span>
            <span className="text-xs text-teal-700">{t('interactiveActivities.labels.previewTag')}</span>
          </div>
          {GameComponent ? (
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-inner" aria-label={game.title}>
              <GameComponent t={t} />
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm text-slate-600">
              <p className="max-w-xs">{t('interactiveActivities.labels.development')}</p>
              <Play className="h-4 w-4 text-teal-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
