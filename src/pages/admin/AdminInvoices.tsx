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

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700", overdue: "bg-red-100 text-red-700", cancelled: "bg-gray-100 text-gray-500",
};

export default function AdminInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ client_id: "", project_id: "", amount: "", due_date: "", notes: "" });

  const load = async () => {
    const [{ data: inv }, { data: c }, { data: p }] = await Promise.all([
      supabase.from("invoices").select("*, client:profiles!invoices_client_id_fkey(full_name), projects(name)").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, profiles!inner(full_name)").eq("role", "client"),
      supabase.from("projects").select("id, name"),
    ]);
    setInvoices(inv || []);
    setClients(c || []);
    setProjects(p || []);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.client_id || !form.amount) { toast.error("Client and amount required"); return; }
    const invNum = `INV-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from("invoices").insert({
      client_id: form.client_id, project_id: form.project_id || null,
      amount: parseFloat(form.amount), invoice_number: invNum,
      due_date: form.due_date || null, notes: form.notes,
      created_by: user!.id,
    });
    if (error) toast.error(error.message);
    else { toast.success("Invoice created"); setOpen(false); setForm({ client_id: "", project_id: "", amount: "", due_date: "", notes: "" }); load(); }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("invoices").update({ status: status as any, paid_at: status === "paid" ? new Date().toISOString() : null }).eq("id", id);
    load();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage client invoices</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> New Invoice</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={form.client_id} onValueChange={v => setForm(f => ({ ...f, client_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>{clients.map((c: any) => <SelectItem key={c.user_id} value={c.user_id}>{c.profiles.full_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project (optional)</Label>
                <Select value={form.project_id} onValueChange={v => setForm(f => ({ ...f, project_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Amount ($)</Label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <Button onClick={create} className="w-full">Create Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden sm:table-cell">Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Due</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-sm">{inv.invoice_number}</TableCell>
                  <TableCell className="text-sm">{inv.client?.full_name || "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{inv.projects?.name || "—"}</TableCell>
                  <TableCell className="font-medium">${Number(inv.amount).toLocaleString()}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColors[inv.status]}>{inv.status}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}</TableCell>
                  <TableCell>
                    <Select value={inv.status} onValueChange={v => updateStatus(inv.id, v)}>
                      <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>{["draft","sent","paid","overdue","cancelled"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No invoices yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
