import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare, MessageSquare, FileText, Receipt, Send, Settings, LogOut, UserPlus, Building2
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const adminNav = [
  { section: "Overview", items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }] },
  { section: "Management", items: [
    { title: "Projects", url: "/admin/projects", icon: FolderKanban },
    { title: "Tasks", url: "/admin/tasks", icon: CheckSquare },
    { title: "Clients", url: "/admin/clients", icon: Building2 },
    { title: "Team", url: "/admin/team", icon: Users },
  ]},
  { section: "Finance", items: [
    { title: "Invoices", url: "/admin/invoices", icon: Receipt },
    { title: "Proposals", url: "/admin/proposals", icon: FileText },
  ]},
  { section: "Communication", items: [
    { title: "Messages", url: "/admin/messages", icon: MessageSquare },
  ]},
  { section: "Settings", items: [
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ]},
];

const clientNav = [
  { section: "Overview", items: [{ title: "Dashboard", url: "/client", icon: LayoutDashboard }] },
  { section: "Projects", items: [
    { title: "My Projects", url: "/client/projects", icon: FolderKanban },
    { title: "Files", url: "/client/files", icon: FileText },
  ]},
  { section: "Communication", items: [
    { title: "Messages", url: "/client/messages", icon: MessageSquare },
    { title: "Proposals", url: "/client/proposals", icon: Send },
  ]},
  { section: "Billing", items: [
    { title: "Invoices", url: "/client/invoices", icon: Receipt },
  ]},
];

const teamNav = [
  { section: "Overview", items: [{ title: "Dashboard", url: "/team", icon: LayoutDashboard }] },
  { section: "Work", items: [
    { title: "My Tasks", url: "/team/tasks", icon: CheckSquare },
    { title: "Projects", url: "/team/projects", icon: FolderKanban },
  ]},
  { section: "Communication", items: [
    { title: "Messages", url: "/team/messages", icon: MessageSquare },
  ]},
];

export function RoleSidebar() {
  const { role, profile, signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const navSections = role === "admin" ? adminNav : role === "team_member" ? teamNav : clientNav;
  const isActive = (path: string) => location.pathname === path || (path !== "/admin" && path !== "/client" && path !== "/team" && location.pathname.startsWith(path));
  const initials = (profile?.full_name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(role === "admin" ? "/admin" : role === "team_member" ? "/team" : "/client")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">Z</div>
            <span className="text-lg font-semibold tracking-tight text-foreground">Zentura</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold cursor-pointer"
              onClick={() => navigate(role === "admin" ? "/admin" : role === "team_member" ? "/team" : "/client")}>Z</div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {navSections.map(section => (
          <SidebarGroup key={section.section}>
            <SidebarGroupLabel>{section.section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(item => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <NavLink to={item.url} end={item.url === "/admin" || item.url === "/client" || item.url === "/team"} className="hover:bg-transparent" activeClassName="bg-transparent">
                        <item.icon className="h-4 w-4" />{!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">{initials}</div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-foreground">{profile?.full_name || "User"}</span>
                <span className="truncate text-xs text-muted-foreground capitalize">{role?.replace("_", " ")}</span>
              </div>
            </div>
            <button onClick={signOut} className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">{initials}</div>
            <button onClick={signOut} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
