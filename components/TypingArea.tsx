"use client";

import React, { useState, useRef, useEffect } from "react";

const WORD_LIST = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "hello", "world",
  "type", "speed", "keyboard", "practice", "random", "words", "challenge", "focus",
  "improve", "accuracy", "skill", "test", "game", "letter", "space"
];

function getRandomSentence(length: number) {
  const words = [];
  for (let i = 0; i < length; i++) {
    words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  }
  return words;
}

const SENTENCE_LENGTH = 25;

const COLORS = {
  correct: "#fff",
  incorrect: "#ff5555",
  skipped: "#FFFF00",
  extra: "#b22222",
  pending: "#888888",
  cursor: "#fff"
};

const TypingArea: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  useEffect(() => {
    setWords(getRandomSentence(SENTENCE_LENGTH));
  }, []);

  const [input, setInput] = useState<string>("");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [skippedMap, setSkippedMap] = useState<{ [key: number]: boolean }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const minLengthRef = useRef<number | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentWordIdx]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith("  ")) return;

    if (val.endsWith(" ")) {
      if (val.trim().length === 0) return;

      const trimmed = val.slice(0, -1);
      setTypedWords(prev => {
        const copy = [...prev];
        copy[currentWordIdx] = trimmed;
        return copy;
      });

      const originalWord = words[currentWordIdx] || "";
      const isSkipped = trimmed.length < originalWord.length && trimmed.length > 0;
      setSkippedMap(prev => ({ ...prev, [currentWordIdx]: isSkipped }));

      setCurrentWordIdx(idx => Math.min(idx + 1, words.length));
      setInput("");
      return;
    }

    setInput(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Restaurar palabra anterior
    if (
      e.key === "Backspace" &&
      inputRef.current &&
      inputRef.current.value.length === 0 &&
      currentWordIdx > 0
    ) {
      const prevIdx = currentWordIdx - 1;
      const prevInput = typedWords[prevIdx] ?? "";

      setCurrentWordIdx(prevIdx);
      setInput(prevInput);
      minLengthRef.current = prevInput.length;

      setSkippedMap(prev => {
        const copy = { ...prev };
        delete copy[prevIdx];
        return copy;
      });

      e.preventDefault();
      return;
    }

    // Evitar borrar debajo del mínimo
    if (
      e.key === "Backspace" &&
      minLengthRef.current !== null &&
      inputRef.current &&
      inputRef.current.value.length <= minLengthRef.current
    ) {
      e.preventDefault();
      return;
    }
  };

  useEffect(() => {
    minLengthRef.current = null;
  }, [currentWordIdx]);

  const renderWords = () => {
    return words.map((word, wordIdx) => {
      const typed =
        wordIdx < currentWordIdx
          ? typedWords[wordIdx] || ""
          : wordIdx === currentWordIdx
            ? input
            : "";

      const isSkipped = skippedMap[wordIdx];
      const isActive = wordIdx === currentWordIdx;
      const maxLen = Math.max(word.length, typed.length);

      const letterSpans = Array.from({ length: maxLen }).map((_, i) => {
        let color = COLORS.pending;
        let char = word[i] || "";
        let showCursor = false;

        if (typed[i] !== undefined) {
          if (i < word.length) {
            color = typed[i] === word[i] ? COLORS.correct : COLORS.incorrect;
            char = typed[i];
          } else {
            color = COLORS.extra;
            char = typed[i];
          }
        } else if (isSkipped && i < word.length) {
          color = COLORS.skipped;
        } else if (i < word.length) {
          color = COLORS.pending;
        }

        if (isActive && i === typed.length) {
          showCursor = true;
        }

        return (
          <span
            key={i}
            style={{
              color,
              position: "relative",
              fontWeight: 500,
              fontSize: 38,
              borderBottom: showCursor ? `2px solid ${COLORS.cursor}` : "none",
              transition: "border-bottom 0.1s"
            }}
          >
            {char || (showCursor ? "\u00a0" : "")}
          </span>
        );
      });

      return (
        <span key={wordIdx} style={{ display: "inline" }}>
          {letterSpans}
          {wordIdx !== words.length - 1 && " "}
        </span>
      );
    });
  };

  return (
    <div
      className="pt-32"
      style={{
        color: "#fff",
        borderRadius: 12,
        fontFamily: "monospace",
        minHeight: 180,
        maxWidth: 1300,
        margin: "0 auto"
      }}
      onClick={() => inputRef.current?.focus()}
      tabIndex={0}
    >
      <div style={{ color: "#6be6c1", fontSize: 18, marginBottom: 12 }}>
        {currentWordIdx}/{words.length}
      </div>
      <div
        style={{
          minHeight: 60,
          marginBottom: 16,
          lineHeight: 1.8,
          userSelect: "none",
          whiteSpace: "normal",
          wordBreak: "break-word",
          overflowWrap: "anywhere"
        }}
      >
        {renderWords()}
      </div>
      <input
        ref={inputRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          opacity: 0,
          position: "absolute",
          left: -9999
        }}
        spellCheck={false}
        autoFocus
      />
    </div>
  );
};

export default TypingArea;
