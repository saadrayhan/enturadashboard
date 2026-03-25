import { Building2, Users, Target, CheckSquare, Calendar, StickyNote, MessageSquarePlus, Sparkles, Search, Bell } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const recordItems = [
  { title: "Accounts", url: "/accounts", icon: Building2 },
  { title: "Opportunities", url: "/opportunities", icon: Target },
  { title: "Contacts", url: "/contacts", icon: Users },
];

const resourceItems = [
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Meetings", url: "/meetings", icon: Calendar },
  { title: "Notes", url: "/notes", icon: StickyNote },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                Z
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">Zentura</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <Search className="h-4 w-4" />
              </button>
              <button className="relative rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
              </button>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              Z
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Records</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recordItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end={false} className="hover:bg-transparent" activeClassName="bg-transparent">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end={false} className="hover:bg-transparent" activeClassName="bg-transparent">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/chat")} tooltip="New Chat">
                  <NavLink to="/chat" className="hover:bg-transparent" activeClassName="bg-transparent">
                    <MessageSquarePlus className="h-4 w-4" />
                    {!collapsed && <span>New chat</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              AM
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground">Alex Morgan</span>
              <span className="truncate text-xs text-muted-foreground">alex@zentura.io</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              AM
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
