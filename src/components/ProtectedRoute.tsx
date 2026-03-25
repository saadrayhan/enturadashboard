import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: AppRole[] }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!role) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Waiting for role assignment...</p></div>;
  if (!allowedRoles.includes(role)) return <Navigate to={role === "admin" ? "/admin" : role === "team_member" ? "/team" : "/client"} replace />;

  return <>{children}</>;
}
