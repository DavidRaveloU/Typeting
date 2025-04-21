import { 
  WORD_LIST, 
  MIN_NUMBERS_PERCENT,
  MAX_NUMBERS_PERCENT,
  MIN_PUNCTUATION_PERCENT,
  MAX_PUNCTUATION_PERCENT,
  MAX_DIGITS_PER_NUMBER,
  PUNCTUATION_WEIGHTS
} from './constants';
import { SentenceGeneratorOptions, WordToken } from './types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumber(): string {
  const digits = getRandomInt(1, MAX_DIGITS_PER_NUMBER);
  return Math.floor(Math.random() * Math.pow(10, digits)).toString();
}

function calculateSpecialTokenCounts(totalWords: number, options: SentenceGeneratorOptions): {
  numbersToUse: number;
  punctuationToUse: number;
} {
  let numbersToUse = 0;
  let punctuationToUse = 0;

  if (options.numbers) {
    const minNumbers = Math.floor(totalWords * MIN_NUMBERS_PERCENT);
    const maxNumbers = Math.floor(totalWords * MAX_NUMBERS_PERCENT);
    numbersToUse = getRandomInt(minNumbers, maxNumbers);
  }

  if (options.punctuation) {
    const minPunctuation = Math.floor(totalWords * MIN_PUNCTUATION_PERCENT);
    const maxPunctuation = Math.floor(totalWords * MAX_PUNCTUATION_PERCENT);
    punctuationToUse = getRandomInt(minPunctuation, maxPunctuation);
  }

  return { numbersToUse, punctuationToUse };
}

function shouldAddSpecialToken(
  remainingSpecial: number, 
  remainingWords: number, 
  minProbability: number = 0.3
): boolean {
  if (remainingSpecial <= 0) return false;
  if (remainingWords <= remainingSpecial) return true;
  
  // Aumentar la probabilidad si nos estamos quedando sin palabras
  const probability = Math.max(
    minProbability,
    remainingSpecial / remainingWords
  );
  
  return Math.random() < probability;
}

function formatTokens(tokens: WordToken[]): string[] {
  const result: string[] = [];
  let currentWord = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;

    switch (token.type) {
      case 'word':
      case 'number':
        if (currentWord === '"' || currentWord === '(') {
          currentWord += token.word;
        } else {
          if (currentWord) {
            result.push(currentWord);
          }
          currentWord = token.word;
        }
        break;

      case 'punctuation':
        if (token.word === '-') {
          if (currentWord) {
            result.push(currentWord);
          }
          result.push('-');
          currentWord = '';
        } else {
          currentWord += token.word;
          result.push(currentWord);
          currentWord = '';
        }
        break;

      case 'quote-open':
        if (currentWord) {
          result.push(currentWord);
        }
        currentWord = '"';
        break;

      case 'quote-close':
        currentWord += '"';
        result.push(currentWord);
        currentWord = '';
        break;

      case 'parenthesis-open':
        if (currentWord) {
          result.push(currentWord);
        }
        currentWord = '(';
        break;

      case 'parenthesis-close':
        currentWord += ')';
        result.push(currentWord);
        currentWord = '';
        break;
    }

    if (currentWord && 
        (!nextToken || 
         (nextToken.type === 'word' || nextToken.type === 'number')) && 
        currentWord !== '"' && 
        currentWord !== '(') {
      result.push(currentWord);
      currentWord = '';
    }
  }

  if (currentWord) {
    result.push(currentWord);
  }

  return result;
}

export function generateWords(
  count: number,
  options: SentenceGeneratorOptions
): string[] {
  const tokens: WordToken[] = [];
  const { numbersToUse, punctuationToUse } = calculateSpecialTokenCounts(count, options);
  
  let numbersUsed = 0;
  let punctuationUsed = 0;
  let wordCount = 0;

  // Asegurar que la primera palabra sea normal
  tokens.push({
    word: WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)],
    type: 'word',
    shouldHaveSpace: true
  });
  wordCount++;

  while (wordCount < count) {
    const remainingWords = count - wordCount;
    
    const shouldAddNumber = options.numbers && 
                          shouldAddSpecialToken(
                            numbersToUse - numbersUsed,
                            remainingWords
                          );
    
    const shouldAddPunct = options.punctuation && 
                          shouldAddSpecialToken(
                            punctuationToUse - punctuationUsed,
                            remainingWords
                          );

    // Agregar palabra base
    const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

    if (shouldAddPunct && punctuationUsed < punctuationToUse && wordCount < count) {
      const punctType = Math.random();
      
      if (punctType < PUNCTUATION_WEIGHTS.quotes) { // Comillas
        tokens.push({
          word: '"',
          type: 'quote-open',
          shouldHaveSpace: false
        });
        tokens.push({
          word: word,
          type: 'word',
          shouldHaveSpace: false
        });
        tokens.push({
          word: '"',
          type: 'quote-close',
          shouldHaveSpace: true
        });
        wordCount++;
        punctuationUsed += 2;
      } else if (punctType < PUNCTUATION_WEIGHTS.quotes + PUNCTUATION_WEIGHTS.parentheses) { // Paréntesis
        tokens.push({
          word: '(',
          type: 'parenthesis-open',
          shouldHaveSpace: false
        });
        tokens.push({
          word: word,
          type: 'word',
          shouldHaveSpace: false
        });
        tokens.push({
          word: ')',
          type: 'parenthesis-close',
          shouldHaveSpace: true
        });
        wordCount++;
        punctuationUsed += 2;
      } else { // Otros signos de puntuación
        tokens.push({
          word: word,
          type: 'word',
          shouldHaveSpace: false
        });
        const punct = [',', '.', '?', '!', ';'][Math.floor(Math.random() * 5)];
        tokens.push({
          word: punct,
          type: 'punctuation',
          shouldHaveSpace: true
        });
        wordCount++;
        punctuationUsed++;
      }
    } else if (wordCount < count) {
      tokens.push({
        word: word,
        type: 'word',
        shouldHaveSpace: true
      });
      wordCount++;
    }

    if (shouldAddNumber && wordCount < count) {
      tokens.push({
        word: generateRandomNumber(),
        type: 'number',
        shouldHaveSpace: true
      });
      wordCount++;
      numbersUsed++;
    }
  }

  return formatTokens(tokens);
}
