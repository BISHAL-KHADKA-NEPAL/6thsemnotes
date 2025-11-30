"use client";

import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="px-4 py-3 mb-6">
      <label className="flex flex-col min-w-40 h-12 w-full max-w-2xl mx-auto cursor-text">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-500 dark:text-slate-400 flex border-none bg-white dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-white dark:bg-slate-800 h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            placeholder={placeholder || "Search for a subject..."}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </label>
    </div>
  );
};