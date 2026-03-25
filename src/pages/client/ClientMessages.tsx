import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";

export default function ClientMessages() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("projects").select("id, name").eq("client_id", user!.id).then(({ data }) => setProjects(data || []));
  }, [user]);

  useEffect(() => {
    if (!selectedProject) return;
    const load = async () => {
      const { data } = await supabase.from("messages").select("*, sender:profiles!messages_sender_id_fkey(full_name)").eq("project_id", selectedProject).order("created_at");
      setMessages(data || []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };
    load();
    const channel = supabase.channel("client-msgs").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `project_id=eq.${selectedProject}` }, () => load()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedProject]);

  const send = async () => {
    if (!newMsg.trim() || !selectedProject) return;
    await supabase.from("messages").insert({ project_id: selectedProject, sender_id: user!.id, content: newMsg.trim() });
    setNewMsg("");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 h-[calc(100vh-3rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground">Chat with the project team</p>
      </div>
      <div className="w-full max-w-xs">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
          <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 overflow-auto p-4 space-y-3">
          {!selectedProject ? (
            <p className="text-sm text-muted-foreground text-center py-8">Select a project to view messages</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
          ) : (
            messages.map(m => (
              <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-lg px-3 py-2 ${m.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <p className="text-xs font-medium mb-1 opacity-70">{m.sender?.full_name || "Unknown"}</p>
                  <p className="text-sm">{m.content}</p>
                  <p className="text-xs mt-1 opacity-50">{new Date(m.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </CardContent>
        {selectedProject && (
          <div className="p-3 border-t border-border">
            <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
              <Input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..." className="flex-1" />
              <Button type="submit" size="icon" disabled={!newMsg.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
