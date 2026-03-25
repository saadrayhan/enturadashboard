import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckSquare, Users, Receipt, TrendingUp, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, tasks: 0, clients: 0, invoices: 0, revenue: 0, pendingTasks: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [projects, tasks, clients, invoices, activity] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact" }),
        supabase.from("tasks").select("id, status", { count: "exact" }),
        supabase.from("user_roles").select("id", { count: "exact" }).eq("role", "client"),
        supabase.from("invoices").select("id, amount, status"),
        supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(10),
      ]);
      const paidInvoices = invoices.data?.filter(i => i.status === "paid") || [];
      const revenue = paidInvoices.reduce((sum, i) => sum + Number(i.amount), 0);
      const pendingTasks = tasks.data?.filter(t => t.status !== "done").length || 0;
      setStats({
        projects: projects.count || 0,
        tasks: tasks.count || 0,
        clients: clients.count || 0,
        invoices: invoices.data?.length || 0,
        revenue,
        pendingTasks,
      });
      setRecentActivity(activity.data || []);
    };
    load();
  }, []);

  const cards = [
    { title: "Total Projects", value: stats.projects, icon: FolderKanban, color: "text-blue-500" },
    { title: "Active Tasks", value: stats.pendingTasks, icon: CheckSquare, color: "text-orange-500" },
    { title: "Clients", value: stats.clients, icon: Users, color: "text-green-500" },
    { title: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-500" },
    { title: "Invoices", value: stats.invoices, icon: Receipt, color: "text-purple-500" },
    { title: "Pending Tasks", value: stats.pendingTasks, icon: Clock, color: "text-red-500" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your agency operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(a => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm text-foreground">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.entity_type}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
