import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AskZenturaBar({ context }: { context?: string }) {
  const [value, setValue] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!value.trim() || loading) return;
    setLoading(true);
    setResponse("");
    setTimeout(() => {
      setResponse("Based on your current data, I'd recommend scheduling a follow-up within the next 2 days to maintain momentum on this opportunity.");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="border-t border-border bg-card px-4 py-3 shrink-0">
      {response && (
        <div className="mb-2 text-xs text-foreground bg-muted rounded-md px-3 py-2 leading-relaxed">
          {response}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <Input
          placeholder="Ask Zentura..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="h-8 border-0 shadow-none focus-visible:ring-0 bg-transparent px-0 text-sm placeholder:text-muted-foreground"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || loading}
          className="shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
