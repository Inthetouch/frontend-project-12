import filter from 'leo-profanity';

filter.clearList();

filter.add(filter.getDictionary('en'));

filter.add(filter.getDictionary('ru'));

export const isProfane = (text) => {
  if (!text || typeof text !== 'string') return false;
  return filter.check(text);
};

export const cleanProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  return filter.clean(text);
};