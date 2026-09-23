"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type ComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
};

/**
 * Styled combobox: pick from a predefined list, or type a value that isn't
 * listed and it's accepted as a free-text category ("Tambahkan ...").
 * Replaces the native <select> whose dropdown popup can't be restyled.
 */
export function Combobox({ value, onChange, options, placeholder, className }: ComboboxProps) {
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlighted, setHighlighted] = useState(0);
  const [syncedValue, setSyncedValue] = useState(value);
  const rootRef = useRef<HTMLDivElement>(null);

  // Adjust local query when the `value` prop changes externally, without an effect.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setQuery(value);
  }

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, value]);

  const isEditing = query !== value;
  const filtered = isEditing && query.trim()
    ? options.filter((opt) => opt.toLowerCase().includes(query.trim().toLowerCase()))
    : options;
  const trimmed = query.trim();
  const showAddOption = isEditing && trimmed.length > 0
    && !options.some((opt) => opt.toLowerCase() === trimmed.toLowerCase());
  const total = filtered.length + (showAddOption ? 1 : 0);

  function selectOption(opt: string) {
    onChange(opt);
    setQuery(opt);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlighted((h) => (h + 1) % Math.max(total, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((h) => (h - 1 + total) % Math.max(total, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (showAddOption && highlighted === filtered.length) {
        selectOption(trimmed);
      } else if (filtered[highlighted]) {
        selectOption(filtered[highlighted]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery(value);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        autoComplete="off"
        value={query}
        placeholder={placeholder}
        onFocus={(event) => {
          setOpen(true);
          event.target.select();
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setHighlighted(0);
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-12 w-full rounded-2xl border border-border bg-card px-4 pr-10 text-sm text-foreground shadow-sm outline-none transition focus:border-mki-orange focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30",
          className,
        )}
      />
      <IconChevronDown
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mki-gray transition-transform duration-200",
          open && "rotate-180",
        )}
      />
      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-border bg-card p-1.5 shadow-soft"
        >
          {filtered.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              onMouseDown={(event) => {
                event.preventDefault();
                selectOption(opt);
              }}
              onMouseEnter={() => setHighlighted(i)}
              className={cn(
                "cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition",
                i === highlighted ? "bg-mki-orange/10 text-mki-orange" : "hover:bg-secondary",
              )}
            >
              {opt}
            </li>
          ))}
          {showAddOption ? (
            <li
              role="option"
              aria-selected={false}
              onMouseDown={(event) => {
                event.preventDefault();
                selectOption(trimmed);
              }}
              onMouseEnter={() => setHighlighted(filtered.length)}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition",
                highlighted === filtered.length ? "bg-mki-orange/10 text-mki-orange" : "text-mki-orange hover:bg-secondary",
              )}
            >
              <IconPlus className="size-4 shrink-0" />
              Tambahkan &ldquo;{trimmed}&rdquo;
            </li>
          ) : null}
          {filtered.length === 0 && !showAddOption ? (
            <li className="px-3 py-2.5 text-sm text-muted-foreground">Tidak ada kategori cocok.</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
