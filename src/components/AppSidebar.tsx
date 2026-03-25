import { useState } from "react";
import { Building2, Users, Target, CheckSquare, Calendar, StickyNote, MessageSquarePlus, Search, Bell } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
const allNavItems = [...recordItems, ...resourceItems, { title: "Chat", url: "/chat", icon: MessageSquarePlus }];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchQuery.trim()
    ? allNavItems.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/accounts")}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">Z</div>
                <span className="text-lg font-semibold tracking-tight text-foreground">Zentura</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setSearchOpen(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  <Search className="h-4 w-4" />
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="relative rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                      <Bell className="h-4 w-4" />
                      <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0" align="end">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">Notifications</p>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="p-2 rounded-md hover:bg-accent cursor-pointer transition-colors">
                        <p className="text-sm text-foreground">Shopify proposal due today</p>
                        <p className="text-xs text-muted-foreground mt-0.5">2 hours ago</p>
                      </div>
                      <div className="p-2 rounded-md hover:bg-accent cursor-pointer transition-colors">
                        <p className="text-sm text-foreground">New contact added: Robert Chang</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Yesterday</p>
                      </div>
                      <div className="p-2 rounded-md hover:bg-accent cursor-pointer transition-colors">
                        <p className="text-sm text-foreground">Stripe deal moved to Won</p>
                        <p className="text-xs text-muted-foreground mt-0.5">2 days ago</p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold cursor-pointer" onClick={() => navigate("/accounts")}>Z</div>
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
                        <item.icon className="h-4 w-4" />{!collapsed && <span>{item.title}</span>}
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
                        <item.icon className="h-4 w-4" />{!collapsed && <span>{item.title}</span>}
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
                      <MessageSquarePlus className="h-4 w-4" />{!collapsed && <span>New chat</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 cursor-pointer hover:bg-accent transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">AM</div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-foreground">Alex Morgan</span>
                <span className="truncate text-xs text-muted-foreground">alex@zentura.io</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium cursor-pointer">AM</div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Search dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-md p-0 gap-0">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input autoFocus placeholder="Search pages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 border-0 shadow-none focus-visible:ring-0" />
            </div>
          </div>
          <div className="p-2 max-h-64 overflow-auto">
            {searchQuery.trim() ? (
              searchResults.length > 0 ? searchResults.map(item => (
                <button key={item.url} onClick={() => { navigate(item.url); setSearchOpen(false); setSearchQuery(""); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-accent transition-colors">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.title}
                </button>
              )) : <p className="text-sm text-muted-foreground text-center py-6">No results</p>
            ) : (
              allNavItems.map(item => (
                <button key={item.url} onClick={() => { navigate(item.url); setSearchOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-accent transition-colors">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.title}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
