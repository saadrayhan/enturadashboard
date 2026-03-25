import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700", medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700", urgent: "bg-red-100 text-red-700",
};

export default function TeamTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  const load = () => {
    supabase.from("tasks").select("*, projects(name)").eq("assigned_to", user!.id).order("created_at", { ascending: false })
      .then(({ data }) => setTasks(data || []));
  };

  useEffect(() => { load(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("tasks").update({ status: status as any, completed_at: status === "done" ? new Date().toISOString() : null }).eq("id", id);
    load();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">Tasks assigned to you</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Project</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(t => (
                <TableRow key={t.id}>
                  <TableCell>
                    <span className="font-medium text-foreground">{t.title}</span>
                    <p className="text-xs text-muted-foreground line-clamp-1">{t.description}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{t.projects?.name || "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className={priorityColors[t.priority]}>{t.priority}</Badge></TableCell>
                  <TableCell>
                    <Select value={t.status} onValueChange={v => updateStatus(t.id, v)}>
                      <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>{["todo","in_progress","review","done"].map(s => <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}</TableCell>
                </TableRow>
              ))}
              {tasks.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No tasks assigned</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
