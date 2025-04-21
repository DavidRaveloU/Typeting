export interface SentenceGeneratorOptions {
  punctuation: boolean;
  numbers: boolean;
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
  type: TokenType;
  shouldHaveSpace: boolean;
}
