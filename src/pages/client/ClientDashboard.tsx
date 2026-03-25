import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, FileText, MessageSquare, Receipt } from "lucide-react";

export default function ClientDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ projects: 0, files: 0, messages: 0, invoices: 0, totalDue: 0 });

  useEffect(() => {
    const load = async () => {
      const [projects, invoices] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact" }).eq("client_id", user!.id),
        supabase.from("invoices").select("amount, status").eq("client_id", user!.id),
      ]);
      const unpaid = invoices.data?.filter(i => i.status !== "paid" && i.status !== "cancelled") || [];
      const totalDue = unpaid.reduce((s, i) => s + Number(i.amount), 0);
      setStats({
        projects: projects.count || 0,
        files: 0,
        messages: 0,
        invoices: invoices.data?.length || 0,
        totalDue,
      });
    };
    load();
  }, [user]);

  const cards = [
    { title: "My Projects", value: stats.projects, icon: FolderKanban, color: "text-blue-500" },
    { title: "Invoices", value: stats.invoices, icon: Receipt, color: "text-purple-500" },
    { title: "Amount Due", value: `$${stats.totalDue.toLocaleString()}`, icon: Receipt, color: "text-red-500" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome, {profile?.full_name || "Client"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Your project overview</p>
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
