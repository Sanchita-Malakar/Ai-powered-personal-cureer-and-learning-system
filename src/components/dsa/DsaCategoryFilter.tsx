"use client";

import React from "react";
import { DsaCategory, DsaDifficulty } from "@/types/dsa";
import { DSA_CATEGORIES } from "@/data/mockDsaData";
import { Search, Filter, CheckCircle2, Layers } from "lucide-react";

interface DsaCategoryFilterProps {
  selectedCategory: DsaCategory | "All";
  onSelectCategory: (category: DsaCategory | "All") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDifficulty: DsaDifficulty | "All";
  onSelectDifficulty: (difficulty: DsaDifficulty | "All") => void;
  selectedStatus: "All" | "Solved" | "Unsolved";
  onSelectStatus: (status: "All" | "Solved" | "Unsolved") => void;
}

export const DsaCategoryFilter: React.FC<DsaCategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedDifficulty,
  onSelectDifficulty,
  selectedStatus,
  onSelectStatus,
}) => {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 backdrop-blur-xl">
      {/* Search and Secondary Selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems, concepts, companies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Difficulty & Status Selectors */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Difficulty */}
          <select
            value={selectedDifficulty}
            onChange={(e) => onSelectDifficulty(e.target.value as DsaDifficulty | "All")}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) =>
              onSelectStatus(e.target.value as "All" | "Solved" | "Unsolved")
            }
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="All">All Statuses</option>
            <option value="Solved">Solved ✓</option>
            <option value="Unsolved">Unsolved</option>
          </select>
        </div>
      </div>

      {/* 9 Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
        <button
          onClick={() => onSelectCategory("All")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
            selectedCategory === "All"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
          }`}
        >
          All Topics
        </button>

        {DSA_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition ${
                isSelected
                  ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30"
                  : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
