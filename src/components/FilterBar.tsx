import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  filters?: { label: string; value: string }[];
  onRemoveFilter?: (value: string) => void;
  onClearAll?: () => void;
}

export function FilterBar({ filters = [], onRemoveFilter, onClearAll }: FilterBarProps) {
  return (
    <div className="h-9 flex items-center gap-2 border-b border-border px-4 bg-card shrink-0">
      <button className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
        <SlidersHorizontal className="h-3 w-3" />
        Filter
      </button>
      {filters.map((f) => (
        <span key={f.value} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
          {f.label}
          {onRemoveFilter && (
            <button onClick={() => onRemoveFilter(f.value)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      {filters.length > 0 && onClearAll && (
        <button onClick={onClearAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Clear all
        </button>
      )}
    </div>
  );
}
