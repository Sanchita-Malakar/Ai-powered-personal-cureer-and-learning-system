"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import { Search, Loader2, X, Check, AlertCircle } from "lucide-react";

export interface SearchableAutocompleteProps<T> {
  id?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value: T | null;
  onSelect: (item: T | null) => void;
  fetchOptions: (query: string) => Promise<T[]>;
  getOptionKey: (item: T) => string;
  getOptionLabel: (item: T) => string;
  renderOption?: (item: T, isSelected: boolean) => React.ReactNode;
  renderSelectedBadge?: (item: T) => React.ReactNode;
  helperText?: string;
  error?: string | null;
  noResultsText?: string;
  icon?: React.ComponentType<{ className?: string }>;
  debounceMs?: number;
  initialFetchOnFocus?: boolean; // For country dropdown to show popular choices
}

export function SearchableAutocomplete<T>({
  id: explicitId,
  label,
  placeholder = "Type to search...",
  required = false,
  disabled = false,
  value,
  onSelect,
  fetchOptions,
  getOptionKey,
  getOptionLabel,
  renderOption,
  renderSelectedBadge,
  helperText,
  error,
  noResultsText = "No results found",
  icon: Icon = Search,
  debounceMs = 300,
  initialFetchOnFocus = false,
}: SearchableAutocompleteProps<T>) {
  const autoId = useId();
  const inputId = explicitId || `autocomplete-${autoId}`;

  // Internal state
  const [query, setQuery] = useState<string>("");
  const [options, setOptions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [unselectedWarning, setUnselectedWarning] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync displayed query when value prop changes externally
  useEffect(() => {
    if (value) {
      setQuery(getOptionLabel(value));
      setUnselectedWarning(null);
    } else if (!isOpen) {
      // If no value and dropdown is closed, keep query empty
      setQuery("");
    }
  }, [value, getOptionLabel, isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          setIsOpen(false);
          // Check if user left typed text without selecting
          if (query.trim() && (!value || getOptionLabel(value) !== query.trim())) {
            setUnselectedWarning(`Please select a valid option from the dropdown.`);
            // Reset query to selected value if one was selected, or leave notice
            if (value) {
              setQuery(getOptionLabel(value));
            }
          }
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, query, value, getOptionLabel]);

  // Execute debounced search
  const performSearch = (searchTerm: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!searchTerm.trim()) {
      if (initialFetchOnFocus) {
        // Fetch default choices if enabled (e.g. popular countries)
        setIsLoading(true);
        fetchOptions("")
          .then((results) => {
            setOptions(results);
            setHasSearched(true);
            setIsLoading(false);
          })
          .catch(() => {
            setOptions([]);
            setIsLoading(false);
          });
      } else {
        setOptions([]);
        setIsLoading(false);
        setHasSearched(false);
      }
      return;
    }

    setIsLoading(true);
    setHasSearched(false);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await fetchOptions(searchTerm);
        setOptions(results);
        setHasSearched(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Autocomplete search error:", err);
        setOptions([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextText = e.target.value;
    setQuery(nextText);
    setIsOpen(true);

    // If text changed, any previous selection is invalidated until user clicks/enters an option
    if (value && getOptionLabel(value) !== nextText) {
      onSelect(null);
    }

    if (nextText.trim()) {
      setUnselectedWarning(`Selection required: click or press Enter on an approved option.`);
    } else {
      setUnselectedWarning(null);
    }

    performSearch(nextText);
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (!query.trim() && initialFetchOnFocus) {
      performSearch("");
    } else if (query.trim() && options.length === 0 && !hasSearched) {
      performSearch(query);
    }
  };

  const handleSelectOption = (item: T) => {
    onSelect(item);
    setQuery(getOptionLabel(item));
    setIsOpen(false);
    setUnselectedWarning(null);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setQuery("");
    setOptions([]);
    setHasSearched(false);
    setUnselectedWarning(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        performSearch(query);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;

      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          handleSelectOption(options[activeIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;

      case "Tab":
        setIsOpen(false);
        break;

      default:
        break;
    }
  };

  // Scroll active option into view when navigating via keyboard
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const isSelected = Boolean(value);
  const displayError = error || unselectedWarning;

  return (
    <div ref={containerRef} className="relative w-full space-y-1">
      {/* Label and Selected status */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5"
        >
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        {isSelected && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Check className="w-2.5 h-2.5" />
            Verified
          </span>
        )}
      </div>

      {/* Input container */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${inputId}-listbox`}
          aria-activedescendant={
            activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined
          }
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`w-full pl-9 pr-9 py-2.5 rounded-xl bg-canvas border text-xs text-ink transition-all placeholder:text-ink-muted/60 focus:outline-none ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-canvas/40"
              : displayError
              ? "border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
              : isSelected
              ? "border-emerald-500/50 bg-emerald-500/[0.02] focus:border-accent"
              : "border-border hover:border-border/90 focus:border-accent focus:ring-1 focus:ring-accent/20"
          }`}
        />

        {/* Clear button if has text or selection */}
        {(query || isSelected) && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-muted hover:text-ink transition-colors cursor-pointer"
            aria-label="Clear input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Error or Warning feedback */}
      {displayError && (
        <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{displayError}</span>
        </p>
      )}

      {/* Helper text if no error */}
      {!displayError && helperText && (
        <p className="text-[11px] text-ink-muted/80 mt-1">{helperText}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id={`${inputId}-listbox`}
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1.5 bg-surface/95 backdrop-blur-md border border-border/90 rounded-2xl shadow-xl overflow-hidden max-h-64 flex flex-col animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Status Header */}
          <div className="px-3 py-1.5 bg-canvas/60 border-b border-border/60 text-[10px] uppercase font-bold tracking-wider text-ink-muted flex items-center justify-between">
            <span>Verified Suggestions</span>
            {isLoading && <span className="text-accent flex items-center gap-1 font-medium"><Loader2 className="w-2.5 h-2.5 animate-spin" /> Searching...</span>}
            {!isLoading && options.length > 0 && <span>{options.length} options</span>}
          </div>

          <ul ref={listRef} className="overflow-y-auto divide-y divide-border/40 py-1 max-h-56 no-scrollbar">
            {isLoading && options.length === 0 && (
              <li className="px-4 py-4 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span>Searching verified database...</span>
              </li>
            )}

            {!isLoading && !query.trim() && !initialFetchOnFocus && (
              <li className="px-4 py-3 text-center text-xs text-ink-muted">
                Type at least 1 character to search.
              </li>
            )}

            {!isLoading && query.trim() && hasSearched && options.length === 0 && (
              <li className="px-4 py-4 text-center text-xs text-red-500/90 font-medium flex flex-col items-center gap-1">
                <span>{noResultsText}</span>
                <span className="text-[10px] text-ink-muted font-normal">
                  Arbitrary values cannot be saved. Please select an approved option.
                </span>
              </li>
            )}

            {options.map((item, index) => {
              const key = getOptionKey(item);
              const labelText = getOptionLabel(item);
              const active = index === activeIndex;
              const selected = value ? getOptionKey(value) === key : false;

              return (
                <li
                  key={key}
                  id={`${inputId}-option-${index}`}
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelectOption(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`px-3.5 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    active
                      ? "bg-accent/10 text-accent font-medium"
                      : selected
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "text-ink hover:bg-canvas"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    {renderOption ? (
                      renderOption(item, selected)
                    ) : (
                      <span className="truncate block font-semibold">{labelText}</span>
                    )}
                  </div>
                  {selected && (
                    <span className="shrink-0 text-emerald-500">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
