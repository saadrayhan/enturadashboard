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
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", submitted: "bg-blue-100 text-blue-700",
  reviewing: "bg-yellow-100 text-yellow-700", accepted: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
};

export default function ClientProposals() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [estimateOpen, setEstimateOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<string>("");
  const [estimating, setEstimating] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", requirements: "", estimated_budget: "" });

  const load = () => {
    supabase.from("proposals").select("*").eq("client_id", user!.id).order("created_at", { ascending: false })
      .then(({ data }) => setProposals(data || []));
  };

  useEffect(() => { load(); }, [user]);

  const getAIEstimate = async () => {
    if (!form.title) { toast.error("Please enter a title first"); return; }
    setEstimating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-estimate", {
        body: {
          title: form.title,
          description: form.description,
          requirements: form.requirements,
          estimated_budget: form.estimated_budget || null,
        },
      });
      if (error) throw error;
      setSelectedEstimate(data.estimate);
      setEstimateOpen(true);
    } catch (err: any) {
      toast.error("Failed to generate estimate: " + (err.message || "Unknown error"));
    } finally {
      setEstimating(false);
    }
  };

  const submit = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const { error } = await supabase.from("proposals").insert({
      client_id: user!.id, title: form.title, description: form.description,
      requirements: form.requirements, estimated_budget: form.estimated_budget ? parseFloat(form.estimated_budget) : null,
      status: "submitted" as any,
      ai_estimate: selectedEstimate || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Proposal submitted!"); setOpen(false); setForm({ title: "", description: "", requirements: "", estimated_budget: "" }); setSelectedEstimate(""); load(); }
  };

  const viewEstimate = (estimate: string) => {
    setSelectedEstimate(estimate);
    setEstimateOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Proposals</h1>
          <p className="text-sm text-muted-foreground mt-1">Submit project requirements and get AI estimates</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> New Proposal</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Submit Proposal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Website redesign" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your project..." /></div>
              <div className="space-y-2"><Label>Requirements</Label><Textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="List specific requirements..." /></div>
              <div className="space-y-2"><Label>Estimated Budget ($)</Label><Input type="number" value={form.estimated_budget} onChange={e => setForm(f => ({ ...f, estimated_budget: e.target.value }))} /></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={getAIEstimate} disabled={estimating} className="flex-1">
                  {estimating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  {estimating ? "Generating..." : "Get AI Estimate"}
                </Button>
                <Button onClick={submit} className="flex-1">Submit Proposal</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Estimate Viewer */}
      <Dialog open={estimateOpen} onOpenChange={setEstimateOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Project Estimate</DialogTitle></DialogHeader>
          <div className="prose prose-sm max-w-none text-foreground">
            {selectedEstimate.split("\n").map((line, i) => {
              if (line.startsWith("# ")) return <h2 key={i} className="text-lg font-bold mt-4 mb-2 text-foreground">{line.slice(2)}</h2>;
              if (line.startsWith("## ")) return <h3 key={i} className="text-base font-semibold mt-3 mb-1 text-foreground">{line.slice(3)}</h3>;
              if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-foreground">{line.slice(2, -2)}</p>;
              if (line.startsWith("- ")) return <li key={i} className="ml-4 text-muted-foreground">{line.slice(2)}</li>;
              if (line.trim() === "") return <br key={i} />;
              return <p key={i} className="text-muted-foreground">{line}</p>;
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">AI Estimate</TableHead>
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
                  <TableCell className="hidden md:table-cell">
                    {p.ai_estimate ? (
                      <Button variant="ghost" size="sm" onClick={() => viewEstimate(p.ai_estimate)} className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" /> View
                      </Button>
                    ) : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {proposals.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No proposals yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
