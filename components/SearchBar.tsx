"use client";

import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  isValid: boolean;
}

export default function SearchBar({ value, onChange, onAnalyze, loading, isValid }: SearchBarProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 shadow-xl backdrop-blur-lg md:gap-4">
      <div className="flex w-full gap-3">
        <input
          className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
          placeholder="Paste Solana wallet address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onAnalyze(); }}
        />
        <button
          className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onAnalyze}
          disabled={!isValid || loading}
        >
          {loading ? "Analyzing..." : "Analyze Wallet"}
        </button>
      </div>
      <p className={`text-xs ${isValid ? "text-emerald-300" : "text-rose-300"}`}>
        {isValid ? "Looks like a valid Solana address" : "Enter a valid Solana address to analyze"}
      </p>
    </div>
  );
}
