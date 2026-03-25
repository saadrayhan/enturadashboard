import { useState } from "react";
import { accounts as initialAccounts, industryStyles, Account } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, Search, Building2, Clock, DollarSign, UsersIcon, Landmark, ExternalLink, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PageTopbar } from "@/components/PageTopbar";
import { FilterBar } from "@/components/FilterBar";
import { DetailPanel } from "@/components/DetailPanel";

export default function AccountsPage() {
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState({ name: "", industry: "", revenue: "", headcount: "", lastFunding: "", linkedin: "" });

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newAccount.name.trim()) { toast.error("Account name is required"); return; }
    const account: Account = {
      id: Date.now().toString(),
      name: newAccount.name,
      industry: newAccount.industry || "Technology",
      lastInteraction: "Just now",
      revenue: newAccount.revenue || "—",
      headcount: parseInt(newAccount.headcount) || 0,
      lastFunding: newAccount.lastFunding || "—",
      linkedin: newAccount.linkedin || newAccount.name.toLowerCase().replace(/\s+/g, "-"),
      logo: newAccount.name[0]?.toUpperCase() || "?",
    };
    setAccounts(prev => [account, ...prev]);
    setNewAccount({ name: "", industry: "", revenue: "", headcount: "", lastFunding: "", linkedin: "" });
    setCreateOpen(false);
    toast.success(`${account.name} created`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageTopbar
        icon={Building2}
        title="Accounts"
        actions={[
          { label: "Import CSV", icon: Upload, onClick: () => toast.info("CSV import coming soon"), variant: "outline" },
          { label: "Create account", icon: Plus, onClick: () => setCreateOpen(true), variant: "default" },
        ]}
      />
      <FilterBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="px-4 py-3 shrink-0">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search accounts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-8 text-sm" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto px-4 pb-4">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead><div className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />Account</div></TableHead>
                    <TableHead><div className="flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5" />Industry</div></TableHead>
                    <TableHead className="hidden md:table-cell"><div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Last interaction</div></TableHead>
                    <TableHead><div className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />Revenue</div></TableHead>
                    <TableHead className="hidden lg:table-cell"><div className="flex items-center gap-1.5"><UsersIcon className="h-3.5 w-3.5" />Headcount</div></TableHead>
                    <TableHead className="hidden lg:table-cell">Last funding</TableHead>
                    <TableHead><div className="flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5" />LinkedIn</div></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">No accounts found</TableCell></TableRow>
                  ) : filtered.map((account) => {
                    const style = industryStyles[account.industry] || { bg: "bg-muted", text: "text-muted-foreground" };
                    return (
                      <TableRow
                        key={account.id}
                        className={`cursor-pointer transition-colors ${selected?.id === account.id ? "bg-primary/5" : ""}`}
                        onClick={() => setSelected(account)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground shrink-0">
                              {account.logo}
                            </div>
                            <span className="font-medium text-foreground text-sm">{account.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${style.bg} ${style.text}`}>
                            {account.industry}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell font-mono">{account.lastInteraction}</TableCell>
                        <TableCell className="text-sm text-foreground font-medium font-mono">{account.revenue}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden lg:table-cell font-mono">{account.headcount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{account.lastFunding}</TableCell>
                        <TableCell>
                          <a href={`https://linkedin.com/company/${account.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {/* Record count */}
              <div className="px-4 py-2 border-t border-border">
                <span className="text-xs text-muted-foreground font-mono">{filtered.length} accounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <DetailPanel
            title={selected.name}
            subtitle={selected.industry}
            avatar={selected.logo}
            onClose={() => setSelected(null)}
            fields={[
              { label: "Industry", value: selected.industry },
              { label: "Revenue", value: selected.revenue, mono: true },
              { label: "Headcount", value: selected.headcount.toLocaleString(), mono: true },
              { label: "Last funding", value: selected.lastFunding },
              { label: "Last interaction", value: selected.lastInteraction, mono: true },
              { label: "LinkedIn", value: (
                <a href={`https://linkedin.com/company/${selected.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                  linkedin.com/company/{selected.linkedin}
                </a>
              )},
            ]}
          />
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <div className="space-y-4">
            <input
              placeholder="Account name"
              value={newAccount.name}
              onChange={e => setNewAccount(p => ({ ...p, name: e.target.value }))}
              className="w-full text-lg font-medium border-0 bg-transparent outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Industry</Label>
                <Select value={newAccount.industry} onValueChange={v => setNewAccount(p => ({ ...p, industry: v }))}>
                  <SelectTrigger className="h-8"><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {["Technology", "Finance", "Healthcare", "Energy", "Retail"].map(i => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Revenue</Label>
                  <Input placeholder="e.g. $10M" value={newAccount.revenue} onChange={e => setNewAccount(p => ({ ...p, revenue: e.target.value }))} className="h-8" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Headcount</Label>
                  <Input type="number" placeholder="e.g. 500" value={newAccount.headcount} onChange={e => setNewAccount(p => ({ ...p, headcount: e.target.value }))} className="h-8" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Last funding</Label>
                <Input placeholder="e.g. Series A — $20M" value={newAccount.lastFunding} onChange={e => setNewAccount(p => ({ ...p, lastFunding: e.target.value }))} className="h-8" />
              </div>
            </div>
            <button onClick={handleCreate} className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              Create account
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
