import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", in_progress: "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800", completed: "bg-green-100 text-green-800",
  on_hold: "bg-gray-100 text-gray-800", cancelled: "bg-red-100 text-red-800",
};

const statusProgress: Record<string, number> = {
  pending: 10, in_progress: 40, review: 70, completed: 100, on_hold: 30, cancelled: 0,
};

export default function ClientProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("projects").select("*").eq("client_id", user!.id).order("created_at", { ascending: false })
      .then(({ data }) => setProjects(data || []));
  }, [user]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Track progress on your projects</p>
      </div>

      <div className="grid gap-4">
        {projects.map(p => (
          <Card key={p.id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.description || "No description"}</p>
                </div>
                <Badge variant="secondary" className={statusColors[p.status]}>{p.status.replace("_", " ")}</Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{statusProgress[p.status]}%</span>
                </div>
                <Progress value={statusProgress[p.status]} className="h-2" />
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                {p.budget && <span>Budget: ${Number(p.budget).toLocaleString()}</span>}
                {p.deadline && <span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No projects yet. Submit a proposal to get started!</CardContent></Card>
        )}
      </div>
    </div>
  );
}
