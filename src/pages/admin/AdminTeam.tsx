import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminTeam() {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "", role: "team_member" });

  const load = async () => {
    const { data } = await supabase.from("user_roles").select("user_id, role, profiles!inner(full_name, company, phone, created_at)");
    setMembers(data || []);
  };

  useEffect(() => { load(); }, []);

  const invite = async () => {
    if (!form.email || !form.password || !form.full_name) { toast.error("All fields required"); return; }
    // Admin creates account for team member
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.full_name } },
    });
    if (error) { toast.error(error.message); return; }
    if (data.user) {
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: form.role as any });
      toast.success(`${form.role === "admin" ? "Admin" : "Team member"} invited`);
      setOpen(false);
      setForm({ email: "", password: "", full_name: "", role: "team_member" });
      load();
    }
  };

  const removeRole = async (userId: string) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    toast.success("Role removed");
    load();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Team Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Invite and manage team members</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><UserPlus className="h-4 w-4 mr-2" /> Invite Member</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Temporary Password</Label><Input type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team_member">Team Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={invite} className="w-full">Send Invite</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden sm:table-cell">Company</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map(m => (
                <TableRow key={m.user_id}>
                  <TableCell className="font-medium text-foreground">{m.profiles.full_name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={m.role === "admin" ? "bg-primary/10 text-primary" : m.role === "client" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
                      {m.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{m.profiles.company || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{new Date(m.profiles.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {m.user_id !== user?.id && (
                      <Button variant="ghost" size="icon" onClick={() => removeRole(m.user_id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
