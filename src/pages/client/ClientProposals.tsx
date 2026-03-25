import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", submitted: "bg-blue-100 text-blue-700",
  reviewing: "bg-yellow-100 text-yellow-700", accepted: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
};

export default function ClientProposals() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", requirements: "", estimated_budget: "" });

  const load = () => {
    supabase.from("proposals").select("*").eq("client_id", user!.id).order("created_at", { ascending: false })
      .then(({ data }) => setProposals(data || []));
  };

  useEffect(() => { load(); }, [user]);

  const submit = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const { error } = await supabase.from("proposals").insert({
      client_id: user!.id, title: form.title, description: form.description,
      requirements: form.requirements, estimated_budget: form.estimated_budget ? parseFloat(form.estimated_budget) : null,
      status: "submitted" as any,
    });
    if (error) toast.error(error.message);
    else { toast.success("Proposal submitted!"); setOpen(false); setForm({ title: "", description: "", requirements: "", estimated_budget: "" }); load(); }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Proposals</h1>
          <p className="text-sm text-muted-foreground mt-1">Submit project requirements and proposals</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> New Proposal</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Submit Proposal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Website redesign" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your project..." /></div>
              <div className="space-y-2"><Label>Requirements</Label><Textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="List specific requirements..." /></div>
              <div className="space-y-2"><Label>Estimated Budget ($)</Label><Input type="number" value={form.estimated_budget} onChange={e => setForm(f => ({ ...f, estimated_budget: e.target.value }))} /></div>
              <Button onClick={submit} className="w-full">Submit Proposal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <span className="font-medium text-foreground">{p.title}</span>
                    <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{p.estimated_budget ? `$${Number(p.estimated_budget).toLocaleString()}` : "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColors[p.status]}>{p.status}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {proposals.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No proposals yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
