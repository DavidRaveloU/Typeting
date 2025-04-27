"use client";

import { useTypingConfig } from "@/context/TypingConfigContext";
import React, { useEffect, useRef, useState } from "react";
import { generateWords } from "@/utils/sentenceGenerator";
import { COLORS } from "@/utils/constants";

// Variables de estilo que puedes ajustar
const STYLE_CONFIG = {
  wordSpacing: "1.3rem",   
  fontSize: 38,
  fontWeight: 500,
  letterSpacing: "0.05em",
  lineHeight: 2
};

const TypingArea: React.FC = () => {
  const {
    punctuation,
    numbers,
    mode,
    words: configWords,
    quote,
  } = useTypingConfig();
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    let generatedText: string[] = [];

    if (mode === "quote") {
      generatedText = generateWords(1, { 
        punctuation: false, 
        numbers: false,
        quotes: quote 
      });
    } else {
      const wordCount = mode === "time" ? 50 : parseInt(configWords);
      generatedText = generateWords(wordCount, { 
        punctuation, 
        numbers, 
        quotes: 'none' 
      });
    }

    setWords(generatedText);
    setInput("");
    setCurrentWordIdx(0);
    setTypedWords([]);
    setSkippedMap({});
  }, [mode, configWords, punctuation, numbers, quote]);

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
      setTypedWords((prev) => {
        const copy = [...prev];
        copy[currentWordIdx] = trimmed;
        return copy;
      });

      const originalWord = words[currentWordIdx] || "";
      const isSkipped =
        trimmed.length < originalWord.length && trimmed.length > 0;
      setSkippedMap((prev) => ({ ...prev, [currentWordIdx]: isSkipped }));

      setCurrentWordIdx((idx) => Math.min(idx + 1, words.length));
      setInput("");
      return;
    }

    setInput(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

      setSkippedMap((prev) => {
        const copy = { ...prev };
        delete copy[prevIdx];
        return copy;
      });

      e.preventDefault();
      return;
    }

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
            if (typed[i] === word[i]) {
              color = COLORS.correct;
              char = typed[i];
            } else {
              color = COLORS.error;
              char = word[i];
            }
          } else {
            color = COLORS.error;
            char = typed[i];
          }
        } else if (isSkipped && i < word.length) {
          color = COLORS.skipped;
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
              fontWeight: STYLE_CONFIG.fontWeight,
              fontSize: STYLE_CONFIG.fontSize,
              letterSpacing: STYLE_CONFIG.letterSpacing,
              borderBottom: showCursor ? `2px solid ${COLORS.correct}` : "none",
              transition: "border-bottom 0.1s"
            }}
          >
            {char || (showCursor ? "\u00a0" : "")}
          </span>
        );
      });

      return (
        <span 
          key={wordIdx} 
          style={{ 
            display: "inline-block",
            marginRight: STYLE_CONFIG.wordSpacing,
            marginBottom: "0.4em"
          }}
        >
          {letterSpans}
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
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 20px",
        marginTop: "100px",
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
          lineHeight: STYLE_CONFIG.lineHeight,
          userSelect: "none",
          whiteSpace: "normal",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
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
          left: -9999,
        }}
        spellCheck={false}
        autoFocus
      />
    </div>
  );
};

export default TypingArea;
