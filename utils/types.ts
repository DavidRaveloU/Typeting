export interface SentenceGeneratorOptions {
  punctuation: boolean;
  numbers: boolean;
  quotes: 'all' | 'short' | 'medium' | 'long' | 'thicc' | 'none';
}

export type TokenType = 
  | 'word' 
  | 'number' 
  | 'punctuation'
  | 'quote-open'
  | 'quote-close'
  | 'parenthesis-open'
  | 'parenthesis-close';

export interface WordToken {
  word: string;
  type: 'word' | 'number' | 'punctuation' | 'quote-open' | 'quote-close' | 'parenthesis-open' | 'parenthesis-close';
  shouldHaveSpace: boolean;
}
