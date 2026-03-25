import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/accounts": "Accounts",
  "/contacts": "Contacts",
  "/opportunities": "Opportunities",
  "/tasks": "Tasks",
  "/meetings": "Meetings",
  "/notes": "Notes",
  "/chat": "Chat",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const matchedPath = Object.keys(pageTitles).find(p => location.pathname.startsWith(p));
  const title = matchedPath ? pageTitles[matchedPath] : "";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-3 sm:px-4 shrink-0 gap-2">
            <SidebarTrigger />
            {title && <span className="text-sm font-medium text-muted-foreground">{title}</span>}
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
