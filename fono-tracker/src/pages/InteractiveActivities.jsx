import React, { useMemo } from 'react';
import { useTranslation } from '../i18n';
import { getInteractiveGames } from '../data/interactiveGames';
import { GameCard } from '../components/interactive/GameCard';

export function InteractiveActivities() {
  const { t } = useTranslation();
  const games = useMemo(() => getInteractiveGames(t), [t]);

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <p className="text-teal-700 text-sm font-semibold">{t('interactiveActivities.hero.badge')}</p>
        <h1 className="text-3xl font-bold text-slate-900">{t('interactiveActivities.hero.title')}</h1>
        <p className="text-slate-600 max-w-3xl">{t('interactiveActivities.hero.description')}</p>
      </div>

      <div className="grid gap-6">
        {games.map(game => (
          <GameCard key={game.id} game={game} t={t} />
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">{t('interactiveActivities.guide.title')}</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          {t('interactiveActivities.guide.steps', [])?.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
