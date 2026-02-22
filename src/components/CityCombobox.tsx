import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";

interface CityComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  cities: string[];
  required?: boolean;
  className?: string;
}

export function CityCombobox({ value, onChange, placeholder, cities, required, className }: CityComboboxProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (search.trim()) onChange(search.trim());
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, search, onChange]);

  const filtered = cities.filter((c) => c.toLowerCase().includes(search.toLowerCase().trim()));

  const handleSelect = (city: string) => {
    onChange(city);
    setSearch(city);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          required={required}
          className={cn("pr-9", className)}
        />
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 opacity-50 pointer-events-none" />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <ul className="max-h-60 overflow-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                {search.trim() ? (t("form.cityCustomHint") as string) : (t("form.searchCity") as string)}
              </li>
            ) : (
              filtered.map((city) => (
                <li
                  key={city}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(city); }}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {city}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

interface CitiesCoveredComboboxProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  cities: string[];
  addCityPlaceholder?: string;
  required?: boolean;
  className?: string;
}

export function CitiesCoveredCombobox({
  value,
  onChange,
  placeholder,
  cities,
  addCityPlaceholder,
  required,
  className,
}: CitiesCoveredComboboxProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customCity, setCustomCity] = useState("");

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
  };

  const filtered = cities.filter((c) => c.toLowerCase().includes(search.toLowerCase().trim()));

  const handleToggle = (city: string) => {
    if (value.includes(city)) {
      onChange(value.filter((c) => c !== city));
    } else {
      onChange([...value, city]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customCity.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCustomCity("");
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="pr-9"
              readOnly={false}
            />
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 opacity-50 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 max-h-60 overflow-auto" align="start">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("form.searchCity") as string}
            className="mb-2"
          />
          <div className="space-y-1 max-h-44 overflow-auto">
            {filtered.map((city) => (
              <label key={city} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-muted rounded px-2">
                <Checkbox
                  checked={value.includes(city)}
                  onCheckedChange={() => handleToggle(city)}
                />
                <span className="text-sm">{city}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-2 pt-2 border-t">
            <Input
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              placeholder={addCityPlaceholder}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustom())}
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="px-3 py-2 text-sm rounded-lg border bg-background hover:bg-muted"
            >
              {t("form.add") as string}
            </button>
          </div>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((city) => (
            <span
              key={city}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium"
            >
              {city}
              <button
                type="button"
                onClick={() => onChange(value.filter((c) => c !== city))}
                className="ml-0.5 hover:text-destructive"
                aria-label="Remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
