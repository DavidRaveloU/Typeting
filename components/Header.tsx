"use client";
import {
  AtSign,
  Clock,
  Hash,
  MessageSquareQuote,
  Pen,
  Type,
} from "lucide-react";
import { useState } from "react";

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
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [optionSelected, setOptionSelected] = useState<
    "time" | "words" | "quote"
  >("time");
  const [timeSelected, setTimeSelected] = useState("15");
  const [wordsSelected, setWordsSelected] = useState("10");
  const [quoteSelected, setQuoteSelected] = useState("all");

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
    if (optionSelected === "time") {
      return (
        <>
          {timeOptions.map((t) => (
            <OptionButton
              key={t}
              label={t}
              active={timeSelected === t}
              onClick={() => setTimeSelected(t)}
            />
          ))}
          <Pen className="w-3.5 h-3.5 ml-2.5 text-gray-500 hover:text-white cursor-pointer" />
        </>
      );
    }

    if (optionSelected === "words") {
      return (
        <>
          {wordOptions.map((w) => (
            <OptionButton
              key={w}
              label={w}
              active={wordsSelected === w}
              onClick={() => setWordsSelected(w)}
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
        active={quoteSelected === q}
        onClick={() => setQuoteSelected(q)}
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
            active={optionSelected === label}
            onClick={() =>
              setOptionSelected(label as "time" | "words" | "quote")
            }
          />
        ))}
      </div>

      <div className="w-1.5 h-auto bg-[#242933] rounded" />

      <div className="flex gap-7 items-center">{renderOptions()}</div>
    </div>
  );
}
