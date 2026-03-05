"use client";

import { useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  large?: boolean;
}

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search cafes...", autoFocus, large }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(value); }}
      className="w-full"
    >
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className={`w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none transition-all
          placeholder:text-[var(--muted2)]
          focus:border-gray-300 focus:ring-2 focus:ring-black/5
          ${large ? "px-5 py-4 text-[17px]" : "px-4 py-3 text-[16px]"}`}
      />
    </form>
  );
}
