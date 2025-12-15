import { getLocalizedGames } from '../games/registry';

/**
 * Devuelve el catálogo de juegos con textos tomados desde la capa i18n.
 * El registro centralizado vive en src/games/registry.ts.
 */
export const getInteractiveGames = t => getLocalizedGames(t);
