import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("user_roles").select("user_id, profiles!inner(full_name, company, phone, created_at)").eq("role", "client");
      // For each client, get project count
      const enriched = await Promise.all((data || []).map(async (c: any) => {
        const { count } = await supabase.from("projects").select("id", { count: "exact" }).eq("client_id", c.user_id);
        return { ...c, projectCount: count || 0 };
      }));
      setClients(enriched);
    };
    load();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage all clients</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Company</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(c => (
                <TableRow key={c.user_id}>
                  <TableCell className="font-medium text-foreground">{c.profiles.full_name || "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{c.profiles.company || "—"}</TableCell>
                  <TableCell><Badge variant="secondary">{c.projectCount}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{c.profiles.phone || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{new Date(c.profiles.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {clients.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No clients yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
