"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Mode = "time" | "words" | "quote";

// 1. Crear y definir el TypingConfigContext
const TypingConfigContext = createContext<TypingConfig | undefined>(undefined);

interface TypingConfig {
  punctuation: boolean;
  numbers: boolean;
  mode: Mode;
  time: string;
  words: string;
  quote: string;
  quoteLength: string;
  setPunctuation: (value: boolean) => void;
  setNumbers: (value: boolean) => void;
  setMode: (mode: Mode) => void;
  setTime: (value: string) => void;
  setWords: (value: string) => void;
  setQuote: (value: string) => void;
  setQuoteLength: (value: string) => void;
}

export const TypingConfigProvider = ({ children }: { children: ReactNode }) => {
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [mode, setMode] = useState<Mode>("time");
  const [time, setTime] = useState("15");
  const [words, setWords] = useState("10");
  const [quote, setQuote] = useState("all");
  const [quoteLength, setQuoteLength] = useState("50");

  return (
    // 2. Proveer el contexto
    <TypingConfigContext.Provider
      value={{
        punctuation,
        numbers,
        mode,
        time,
        words,
        quote,
        quoteLength,
        setPunctuation,
        setNumbers,
        setMode,
        setTime,
        setWords,
        setQuote,
        setQuoteLength,
      }}
    >
      {children}
    </TypingConfigContext.Provider>
  );
};

// 3. Crear el hook `useTypingConfig` para consumir el contexto
export const useTypingConfig = () => {
  const context = useContext(TypingConfigContext);
  if (!context) {
    throw new Error(
      "useTypingConfig must be used within a TypingConfigProvider"
    );
  }
  return context;
};
