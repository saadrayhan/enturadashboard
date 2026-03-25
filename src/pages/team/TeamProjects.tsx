import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", in_progress: "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800", completed: "bg-green-100 text-green-800",
  on_hold: "bg-gray-100 text-gray-800", cancelled: "bg-red-100 text-red-800",
};

export default function TeamProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: memberships } = await supabase.from("project_members").select("project_id").eq("user_id", user!.id);
      if (memberships && memberships.length > 0) {
        const ids = memberships.map(m => m.project_id);
        const { data } = await supabase.from("projects").select("*, client:profiles!projects_client_id_fkey(full_name)").in("id", ids);
        setProjects(data || []);
      }
    };
    load();
  }, [user]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Projects you're assigned to</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="hidden sm:table-cell">Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{p.client?.full_name || "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className={statusColors[p.status]}>{p.status.replace("_"," ")}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{p.deadline ? new Date(p.deadline).toLocaleDateString() : "—"}</TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Not assigned to any projects</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
