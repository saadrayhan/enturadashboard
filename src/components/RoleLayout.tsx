import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleSidebar } from "@/components/RoleSidebar";

export function RoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
