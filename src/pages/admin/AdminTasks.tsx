import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700", medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700", urgent: "bg-red-100 text-red-700",
};
const statusColors: Record<string, string> = {
  todo: "bg-gray-100 text-gray-700", in_progress: "bg-blue-100 text-blue-700",
  review: "bg-purple-100 text-purple-700", done: "bg-green-100 text-green-700",
};

export default function AdminTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", project_id: "", assigned_to: "", priority: "medium", due_date: "" });

  const load = async () => {
    const [{ data: t }, { data: p }, { data: tm }] = await Promise.all([
      supabase.from("tasks").select("*, projects(name), assignee:profiles!tasks_assigned_to_fkey(full_name)").order("created_at", { ascending: false }),
      supabase.from("projects").select("id, name"),
      supabase.from("user_roles").select("user_id, profiles!inner(full_name)").eq("role", "team_member"),
    ]);
    setTasks(t || []);
    setProjects(p || []);
    setTeam(tm || []);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const { error } = await supabase.from("tasks").insert({
      title: form.title, description: form.description,
      project_id: form.project_id || null, assigned_to: form.assigned_to || null,
      priority: form.priority as any, due_date: form.due_date || null,
      created_by: user!.id,
    });
    if (error) toast.error(error.message);
    else { toast.success("Task created"); setOpen(false); setForm({ title: "", description: "", project_id: "", assigned_to: "", priority: "medium", due_date: "" }); load(); }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("tasks").update({ status: status as any, completed_at: status === "done" ? new Date().toISOString() : null }).eq("id", id);
    load();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all tasks across projects</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> New Task</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Select value={form.project_id} onValueChange={v => setForm(f => ({ ...f, project_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={form.assigned_to} onValueChange={v => setForm(f => ({ ...f, assigned_to: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select team member" /></SelectTrigger>
                  <SelectContent>{team.map((t: any) => <SelectItem key={t.user_id} value={t.user_id}>{t.profiles.full_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["low","medium","high","urgent"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
              </div>
              <Button onClick={create} className="w-full">Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Project</TableHead>
                <TableHead className="hidden sm:table-cell">Assignee</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(t => (
                <TableRow key={t.id}>
                  <TableCell><span className="font-medium text-foreground">{t.title}</span></TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{t.projects?.name || "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{t.assignee?.full_name || "Unassigned"}</TableCell>
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
              {tasks.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No tasks yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
