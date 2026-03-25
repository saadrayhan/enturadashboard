import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { RoleSidebar } from "@/components/RoleSidebar";
import { useAuth } from "@/hooks/useAuth";

export function RoleLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-3 sm:px-4 shrink-0 gap-2">
            <SidebarTrigger />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {role === "admin" ? "Admin" : role === "team_member" ? "Team" : "Client"} Portal
            </span>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
