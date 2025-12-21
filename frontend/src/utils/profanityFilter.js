import profanity from 'leo-profanity';


export const initializeProfanityFilter = async () => {
  try {
    await profanity.loadDictionary('ru');
    console.log('Profanity filter initialized with Russian dictionary');
  } catch (error) {
    console.error('Failed to load profanity dictionary:', error);
  }
};

export const isProfane = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  return profanity.check(text);
};

export const cleanProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  return profanity.clean(text);
};

export const getProfanityWords = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  return profanity.list(text);
};

export const cleanProfanityCustom = (text, replaceChar = '*') => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  const profanityWords = getProfanityWords(text);
  let cleanedText = text;

  profanityWords.forEach((word) => {
    const regex = new RegExp(word, 'gi');
    const replacement = replaceChar.repeat(word.length);
    cleanedText = cleanedText.replace(regex, replacement);
  });

  return cleanedText;
};
