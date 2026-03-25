import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700", submitted: "bg-blue-100 text-blue-700",
  reviewing: "bg-yellow-100 text-yellow-700", accepted: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
};

export default function AdminProposals() {
  const [proposals, setProposals] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from("proposals").select("*, client:profiles!proposals_client_id_fkey(full_name, company)").order("created_at", { ascending: false });
    setProposals(data || []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("proposals").update({ status: status as any }).eq("id", id);
    toast.success("Proposal status updated");
    load();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Proposals</h1>
        <p className="text-sm text-muted-foreground mt-1">Review client proposals and requirements</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden sm:table-cell">Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <span className="font-medium text-foreground">{p.title}</span>
                    <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                  </TableCell>
                  <TableCell className="text-sm">{p.client?.full_name || "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{p.estimated_budget ? `$${Number(p.estimated_budget).toLocaleString()}` : "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColors[p.status]}>{p.status}</Badge></TableCell>
                  <TableCell>
                    <Select value={p.status} onValueChange={v => updateStatus(p.id, v)}>
                      <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>{["draft","submitted","reviewing","accepted","rejected"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
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
