"use client";
import { useTypingConfig } from "@/context/TypingConfigContext";
import {
  AtSign,
  Clock,
  Hash,
  MessageSquareQuote,
  Pen,
  Type,
} from "lucide-react";

const ToggleButton = ({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
}) => (
  <button
    className={`flex items-center transition text-sm ${
      active ? "text-[#88C0D0]" : "text-gray-500"
    } font-medium hover:text-white`}
    onClick={onClick}
  >
    <Icon className="w-3.5 h-3.5 mr-2.5" />
    {label}
  </button>
);

const OptionButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    className={`flex items-center transition text-sm ${
      active ? "text-[#88C0D0]" : "text-gray-500"
    } font-medium hover:text-white`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default function Header() {
  const {
    punctuation,
    numbers,
    mode,
    time,
    words,
    quote,
    setPunctuation,
    setNumbers,
    setMode,
    setTime,
    setWords,
    setQuote,
  } = useTypingConfig();
  const configOptions = [
    {
      label: "punctuation",
      icon: AtSign,
      active: punctuation,
      onClick: () => setPunctuation(!punctuation),
    },
    {
      label: "numbers",
      icon: Hash,
      active: numbers,
      onClick: () => setNumbers(!numbers),
    },
  ];

  const modeOptions = [
    { label: "time", icon: Clock },
    { label: "words", icon: Type },
    { label: "quote", icon: MessageSquareQuote },
  ];

  const timeOptions = ["15", "30", "60", "120"];
  const wordOptions = ["10", "15", "50", "100"];
  const quoteOptions = ["all", "short", "medium", "long", "thicc"];

  const renderOptions = () => {
    if (mode === "time") {
      return (
        <>
          {timeOptions.map((t) => (
            <OptionButton
              key={t}
              label={t}
              active={time === t}
              onClick={() => setTime(t)}
            />
          ))}
          <Pen className="w-3.5 h-3.5 ml-2.5 text-gray-500 hover:text-white cursor-pointer" />
        </>
      );
    }

    if (mode === "words") {
      return (
        <>
          {wordOptions.map((w) => (
            <OptionButton
              key={w}
              label={w}
              active={words === w}
              onClick={() => setWords(w)}
            />
          ))}
          <Pen className="w-3.5 h-3.5 ml-2.5 text-gray-500 hover:text-white cursor-pointer" />
        </>
      );
    }

    return quoteOptions.map((q) => (
      <OptionButton
        key={q}
        label={q}
        active={quote === q}
        onClick={() => setQuote(q)}
      />
    ));
  };

  return (
    <div className="flex gap-7 px-4 py-2 bg-[#2E3440] rounded-t-lg w-min mx-auto mt-9">
      <div className="flex gap-7">
        {configOptions.map(({ label, icon, active, onClick }) => (
          <ToggleButton
            key={label}
            label={label}
            icon={icon}
            active={active}
            onClick={onClick}
          />
        ))}
      </div>

      <div className="w-1.5 h-auto bg-[#242933] rounded" />

      <div className="flex gap-7">
        {modeOptions.map(({ label, icon }) => (
          <ToggleButton
            key={label}
            label={label}
            icon={icon}
            active={mode === label}
            onClick={() => setMode(label as "time" | "words" | "quote")}
          />
        ))}
      </div>

      <div className="w-1.5 h-auto bg-[#242933] rounded" />

      <div className="flex gap-7 items-center">{renderOptions()}</div>
    </div>
  );
}
