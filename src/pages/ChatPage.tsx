import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Bot, User } from "lucide-react";
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
  "Looking at your tasks, you have 2 items due soon: sending the Shopify proposal (today) and preparing the Stripe demo environment (tomorrow). I'd recommend prioritizing the proposal first.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Ask Zentura</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md">
              Pipeline analysis, follow-up suggestions, email drafts, and more.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage(s)} className="rounded-full border border-border bg-card px-3.5 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 items-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border p-3 sm:p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 rounded-lg border border-border bg-card px-3">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <Input
              placeholder="Ask Zentura anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              className="border-0 shadow-none focus-visible:ring-0 px-0"
              disabled={isTyping}
            />
          </div>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping} className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
