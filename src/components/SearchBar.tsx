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
      className="w-full relative"
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
          ${large ? "px-5 py-4 pr-14 text-[17px]" : "px-4 py-3 pr-12 text-[16px]"}`}
      />
      <button
        type="submit"
        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[var(--foreground)] text-white
          flex items-center justify-center transition-all active:scale-90
          ${large ? "w-10 h-10" : "w-9 h-9"}`}
        aria-label="Search"
      >
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-2">
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5L21 21" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
