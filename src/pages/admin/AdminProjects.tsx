import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  on_hold: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", client_id: "", deadline: "", budget: "" });

  const load = async () => {
    const [{ data: p }, { data: c }, { data: t }] = await Promise.all([
      supabase.from("projects").select("*, profiles!projects_client_id_fkey(full_name)").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, profiles!inner(full_name, company)").eq("role", "client"),
      supabase.from("user_roles").select("user_id, profiles!inner(full_name)").eq("role", "team_member"),
    ]);
    setProjects(p || []);
    setClients(c || []);
    setTeamMembers(t || []);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name || !form.client_id) { toast.error("Name and client required"); return; }
    const { error } = await supabase.from("projects").insert({
      name: form.name,
      description: form.description,
      client_id: form.client_id,
      deadline: form.deadline || null,
      budget: form.budget ? parseFloat(form.budget) : null,
      created_by: user!.id,
    });
    if (error) toast.error(error.message);
    else { toast.success("Project created"); setOpen(false); setForm({ name: "", description: "", client_id: "", deadline: "", budget: "" }); load(); }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("projects").update({ status: status as any }).eq("id", id);
    load();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all client projects</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> New Project</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Project</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Website Redesign" />
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={form.client_id} onValueChange={v => setForm(f => ({ ...f, client_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c: any) => (
                      <SelectItem key={c.user_id} value={c.user_id}>{c.profiles.full_name} {c.profiles.company ? `(${c.profiles.company})` : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Budget ($)</Label>
                  <Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
                </div>
              </div>
              <Button onClick={create} className="w-full">Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="hidden sm:table-cell">Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Budget</TableHead>
                <TableHead className="hidden md:table-cell">Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div><span className="font-medium text-foreground">{p.name}</span></div>
                    <span className="text-xs text-muted-foreground line-clamp-1">{p.description}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{p.profiles?.full_name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[p.status] || ""}>{p.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{p.budget ? `$${Number(p.budget).toLocaleString()}` : "—"}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{p.deadline ? new Date(p.deadline).toLocaleDateString() : "—"}</TableCell>
                  <TableCell>
                    <Select value={p.status} onValueChange={v => updateStatus(p.id, v)}>
                      <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["pending","in_progress","review","completed","on_hold","cancelled"].map(s => (
                          <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No projects yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
