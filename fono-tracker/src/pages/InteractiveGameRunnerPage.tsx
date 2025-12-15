import React, { useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { useTranslation } from '../i18n';
import { findGameById, localizeGame } from '../games/registry';

export function InteractiveGameRunnerPage() {
  const { t } = useTranslation();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const registryItem = useMemo(() => findGameById(gameId), [gameId]);
  const localized = useMemo(() => (registryItem ? localizeGame(registryItem, t) : null), [registryItem, t]);
  const GameComponent = registryItem?.component;

  const handleFullscreen = () => {
    const node = containerRef.current;
    if (!node) return;
    if (node.requestFullscreen) {
      node.requestFullscreen().catch(() => {});
    }
  };

  if (!registryItem || !localized) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/actividades-interactivas')}
          className="inline-flex items-center gap-2 text-sm text-teal-700 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('interactiveActivities.labels.backToCatalog')}
        </button>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">{t('interactiveActivities.labels.gameNotFound')}</p>
          <p className="text-slate-600 mt-2">{t('interactiveActivities.labels.gameNotFoundDetail')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/actividades-interactivas')}
          className="inline-flex items-center gap-2 text-sm text-teal-700 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('interactiveActivities.labels.backToCatalog')}
        </button>
        <button
          type="button"
          onClick={handleFullscreen}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
        >
          <Maximize2 className="h-4 w-4" />
          {t('interactiveActivities.labels.fullscreen')}
        </button>
      </div>

      <div
        ref={containerRef}
        className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mx-auto"
        style={{ maxWidth: '1200px' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-xs font-semibold">
              {t(`interactiveActivities.categories.${localized.category}`)}
            </p>
            <h1 className="text-2xl font-bold text-slate-900">{localized.title}</h1>
            <p className="text-slate-600 text-sm max-w-3xl">{localized.description}</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-semibold text-slate-700">{t('interactiveActivities.labels.wideMode')}</p>
            <p>{t('interactiveActivities.labels.wideModeHint')}</p>
          </div>
        </div>

        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
          {GameComponent ? (
            <GameComponent t={t} />
          ) : (
            <p className="text-sm text-slate-600">{t('interactiveActivities.labels.development')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
