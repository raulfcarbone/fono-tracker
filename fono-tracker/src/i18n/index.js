import { es } from './es';

const dictionaries = { es };
const DEFAULT_LANG = 'es';

const getValueFromPath = (dictionary, path) =>
  path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), dictionary);

export function useTranslation(language = DEFAULT_LANG) {
  const dictionary = dictionaries[language] ?? dictionaries[DEFAULT_LANG];
  const t = (path, fallback) => getValueFromPath(dictionary, path) ?? fallback ?? path;
  return { t, dictionary, language: language in dictionaries ? language : DEFAULT_LANG };
}
