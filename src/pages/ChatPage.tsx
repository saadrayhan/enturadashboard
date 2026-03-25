import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/data/mock-data";

const suggestions = [
  "Summarize my active opportunities",
  "Generate tasks from this pipeline",
  "What accounts need follow-up?",
  "Draft an email for Stripe demo",
];

const mockResponses = [
  "Based on your current pipeline, you have 4 active opportunities worth a total of $1.57M. The largest is the Risk Assessment Platform deal with Goldman Sachs at $750k, currently in the Lead stage.",
  "I've analyzed your accounts. Moderna and Goldman Sachs haven't been contacted in over 5 days — I'd suggest scheduling follow-up calls this week.",
  "Here's a draft: 'Hi Sarah, I wanted to confirm our demo session for the Enterprise Platform License. I'll be showcasing our latest API features and the new sandbox environment...'",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Ask Zentura</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md">
              I can help you with pipeline analysis, follow-up suggestions, email drafts, and more.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Input
            placeholder="Ask Zentura anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            className="flex-1"
          />
          <Button size="icon" onClick={() => sendMessage(input)} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
