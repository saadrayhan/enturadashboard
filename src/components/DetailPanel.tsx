import { X } from "lucide-react";
import { AskZenturaBar } from "@/components/AskZenturaBar";

interface DetailField {
  label: string;
  value: string | React.ReactNode;
  mono?: boolean;
}

interface DetailPanelProps {
  title: string;
  subtitle?: string;
  avatar?: string;
  fields: DetailField[];
  onClose: () => void;
  children?: React.ReactNode;
}

export function DetailPanel({ title, subtitle, avatar, fields, onClose, children }: DetailPanelProps) {
  return (
    <div className="w-80 border-l border-border bg-card flex flex-col shrink-0 h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {avatar && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground shrink-0">
              {avatar}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-[11px] text-muted-foreground mb-0.5">{field.label}</p>
            <div className={`text-sm text-foreground ${field.mono ? "font-mono" : ""}`}>
              {field.value}
            </div>
          </div>
        ))}
        {children}
      </div>

      <AskZenturaBar />
    </div>
  );
}
