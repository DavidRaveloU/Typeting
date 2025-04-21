export const WORD_LIST = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
  "hello", "world", "type", "speed", "keyboard", "practice", "random",
  "words", "challenge", "focus", "improve", "accuracy", "skill", "test",
  "game", "letter", "space"
];

// Porcentajes basados en el número total de palabras
export const MIN_NUMBERS_PERCENT = 0.10; // Mínimo 10% de números
export const MAX_NUMBERS_PERCENT = 0.20; // Máximo 20% de números

export const MIN_PUNCTUATION_PERCENT = 0.15; // Mínimo 15% de puntuación
export const MAX_PUNCTUATION_PERCENT = 0.25; // Máximo 25% de puntuación

export const MAX_DIGITS_PER_NUMBER = 4;

// Distribución de tipos de puntuación
export const PUNCTUATION_WEIGHTS = {
  quotes: 0.25,    // 25% probabilidad de comillas
  parentheses: 0.25, // 25% probabilidad de paréntesis
  other: 0.50      // 50% probabilidad de otros signos
};

export const COLORS = {
  correct: "#fff",
  incorrect: "#ff5555",
  skipped: "#FFFF00",
  extra: "#b22222",
  pending: "#888888",
  cursor: "#fff",
};
