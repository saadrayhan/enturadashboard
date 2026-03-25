import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, FolderKanban, Clock } from "lucide-react";

export default function TeamDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ tasks: 0, pending: 0, projects: 0 });

  useEffect(() => {
    const load = async () => {
      const [tasks, projects] = await Promise.all([
        supabase.from("tasks").select("id, status").eq("assigned_to", user!.id),
        supabase.from("project_members").select("id", { count: "exact" }).eq("user_id", user!.id),
      ]);
      const pending = tasks.data?.filter(t => t.status !== "done").length || 0;
      setStats({ tasks: tasks.data?.length || 0, pending, projects: projects.count || 0 });
    };
    load();
  }, [user]);

  const cards = [
    { title: "Assigned Tasks", value: stats.tasks, icon: CheckSquare, color: "text-blue-500" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-orange-500" },
    { title: "Projects", value: stats.projects, icon: FolderKanban, color: "text-green-500" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome, {profile?.full_name || "Team Member"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Your work overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(c => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-foreground">{c.value}</div></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
