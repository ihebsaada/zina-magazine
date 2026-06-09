"use client";

/**
 * components/layout/HeaderSearch.tsx
 *
 * Search icon button + animated slim search bar that slides down below the header.
 * - Escape key or click outside closes the bar
 * - Click on ✕ closes the bar
 * - Submit redirects to /[locale]/search?q=query
 * - Works on desktop and mobile
 * - RTL-aware
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface HeaderSearchProps {
  locale: string;
  placeholder: string;
  openSearchLabel: string;
  closeLabel: string;
}

export function HeaderSearch({
  locale,
  placeholder,
  openSearchLabel,
  closeLabel,
}: HeaderSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isRTL = locale === "ar";

  // Auto-focus input when the bar opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
      }
    },
    [isOpen],
  );

  // Close on click outside the entire search widget (trigger button + bar)
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
      }
    },
    [isOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handleKeyDown, handlePointerDown]);

  function handleClose() {
    setIsOpen(false);
    setQuery("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`);
    setIsOpen(false);
    setQuery("");
  }

  return (
    /* Wrapper ref captures both the trigger button and the fixed bar
       so click-outside detection works correctly */
    <div ref={containerRef} className="relative">
      {/* Search trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={openSearchLabel}
        aria-expanded={isOpen}
        aria-controls="header-search-bar"
        className={[
          "flex items-center justify-center w-8 h-8 rounded-sm transition-colors duration-[var(--duration-base)]",
          "text-[var(--color-ink-700)] hover:text-[var(--color-oree)]",
          isOpen ? "text-[var(--color-oree)]" : "",
        ].join(" ")}
      >
        <Search
          strokeWidth={1.5}
          className="w-[18px] h-[18px]"
          aria-hidden="true"
        />
      </button>

      {/* Slide-down search bar — fixed to viewport width, beneath sticky header */}
      <div
        id="header-search-bar"
        role="search"
        aria-label={openSearchLabel}
        className={[
          "fixed left-0 right-0 z-20",
          "bg-[var(--color-parchment)]/98 backdrop-blur-md",
          "border-b border-[var(--color-oree)]",
          "transition-all duration-300 ease-out overflow-hidden",
          isOpen
            ? "max-h-24 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        ].join(" ")}
        // header height h-24 = 6rem + top gold line 1px + header border 1px
        style={{ top: "calc(6rem + 2px)" }}
      >
        <form
          onSubmit={handleSubmit}
          className={[
            "flex items-center gap-3 px-6 py-3 max-w-screen-xl mx-auto",
            isRTL ? "flex-row-reverse" : "flex-row",
          ].join(" ")}
        >
          {/* Gold search icon inside bar */}
          <Search
            strokeWidth={1.5}
            className="w-4 h-4 flex-shrink-0 text-[var(--color-oree)]"
            aria-hidden="true"
          />

          {/* Search input */}
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            dir={isRTL ? "rtl" : "ltr"}
            className={[
              "flex-1 bg-transparent border-0 border-b border-[var(--color-ink-200)]",
              "font-editorial text-[0.9375rem] italic text-[var(--color-ink-700)]",
              "placeholder:text-[var(--color-ink-400)] placeholder:not-italic",
              "py-1.5 outline-none focus:border-[var(--color-oree)] transition-colors duration-[var(--duration-base)]",
              isRTL ? "text-right" : "text-left",
            ].join(" ")}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label={closeLabel}
            className="flex items-center gap-1 text-[var(--color-ink-400)] hover:text-[var(--color-ink-700)] transition-colors duration-[var(--duration-base)] flex-shrink-0"
          >
            <X strokeWidth={1.5} className="w-4 h-4" aria-hidden="true" />
            <span
              className="hidden sm:inline text-[0.6875rem] uppercase tracking-[0.1em] font-medium"
              aria-hidden="true"
            >
              Esc
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
