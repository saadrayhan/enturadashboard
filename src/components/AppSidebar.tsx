import { useState } from "react";
import { Building2, Users, Target, CheckSquare, Calendar, StickyNote, MessageSquarePlus, Search, Bell, ChevronLeft } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

const recentChats = [
  { id: "1", title: "Stripe deal analysis" },
  { id: "2", title: "Q2 pipeline review" },
  { id: "3", title: "Follow-up strategy" },
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
        {/* User row at TOP */}
        <SidebarHeader className="p-3 pb-0">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-lg px-2 py-2 cursor-pointer hover:bg-accent transition-colors">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-medium">AM</div>
              <div className="flex min-w-0 flex-col flex-1">
                <span className="truncate text-sm font-medium text-foreground">Alex Morgan</span>
                <span className="truncate text-[11px] text-muted-foreground">alex@zentura.io</span>
              </div>
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </div>
          ) : (
            <div className="flex items-center justify-center py-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-medium cursor-pointer">AM</div>
            </div>
          )}
        </SidebarHeader>

        {/* Search + notifications */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1 flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="flex-1 flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors">
              <Search className="h-3.5 w-3.5" />
              <span>Search...</span>
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
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">2h ago</p>
                  </div>
                  <div className="p-2 rounded-md hover:bg-accent cursor-pointer transition-colors">
                    <p className="text-sm text-foreground">New contact: Robert Chang</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">1d ago</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

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
                      <MessageSquarePlus className="h-4 w-4" />{!collapsed && <span className="text-primary font-medium">+ New chat</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {!collapsed && recentChats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild tooltip={chat.title}>
                      <button onClick={() => navigate("/chat")} className="w-full text-left flex items-center gap-2 hover:bg-transparent">
                        <span className="text-sm text-muted-foreground truncate">{chat.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          {!collapsed ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/accounts")}>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background text-xs font-bold">Z</div>
              <span className="text-sm font-semibold tracking-tight text-foreground">Zentura</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background text-xs font-bold cursor-pointer" onClick={() => navigate("/accounts")}>Z</div>
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
