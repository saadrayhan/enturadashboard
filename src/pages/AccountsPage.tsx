import { useState } from "react";
import { accounts as initialAccounts, industryStyles, Account } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, Search, SlidersHorizontal, ExternalLink, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const allColumns = [
  { key: "industry", label: "Industry" },
  { key: "lastInteraction", label: "Last interaction" },
  { key: "revenue", label: "Revenue" },
  { key: "headcount", label: "Headcount" },
  { key: "lastFunding", label: "Last funding" },
  { key: "linkedin", label: "LinkedIn" },
] as const;

export default function AccountsPage() {
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [createOpen, setCreateOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Set<string>>(new Set(allColumns.map(c => c.key)));
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

  const toggleCol = (key: string) => {
    setVisibleCols(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Accounts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{accounts.length} accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("CSV import coming soon")}>
            <Upload className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Import CSV</span>
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Create account</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search accounts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-1.5" />
              Display
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="end">
            <p className="text-xs font-medium text-muted-foreground mb-2">Visible columns</p>
            <div className="space-y-2">
              {allColumns.map(col => (
                <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={visibleCols.has(col.key)} onCheckedChange={() => toggleCol(col.key)} />
                  <span className="text-sm text-foreground">{col.label}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Account</TableHead>
              {visibleCols.has("industry") && <TableHead className="text-xs font-medium text-muted-foreground">Industry</TableHead>}
              {visibleCols.has("lastInteraction") && <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Last interaction</TableHead>}
              {visibleCols.has("revenue") && <TableHead className="text-xs font-medium text-muted-foreground">Revenue</TableHead>}
              {visibleCols.has("headcount") && <TableHead className="text-xs font-medium text-muted-foreground hidden lg:table-cell">Headcount</TableHead>}
              {visibleCols.has("lastFunding") && <TableHead className="text-xs font-medium text-muted-foreground hidden lg:table-cell">Last funding</TableHead>}
              {visibleCols.has("linkedin") && <TableHead className="text-xs font-medium text-muted-foreground">LinkedIn</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">No accounts found</TableCell></TableRow>
            ) : filtered.map((account) => {
              const style = industryStyles[account.industry] || { bg: "bg-muted", text: "text-muted-foreground" };
              return (
                <TableRow key={account.id} className="cursor-pointer group transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-sm font-semibold text-muted-foreground shrink-0">
                        {account.logo}
                      </div>
                      <span className="font-medium text-foreground">{account.name}</span>
                    </div>
                  </TableCell>
                  {visibleCols.has("industry") && (
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                        {account.industry}
                      </span>
                    </TableCell>
                  )}
                  {visibleCols.has("lastInteraction") && <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{account.lastInteraction}</TableCell>}
                  {visibleCols.has("revenue") && <TableCell className="text-sm text-foreground font-medium">{account.revenue}</TableCell>}
                  {visibleCols.has("headcount") && <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{account.headcount.toLocaleString()}</TableCell>}
                  {visibleCols.has("lastFunding") && <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{account.lastFunding}</TableCell>}
                  {visibleCols.has("linkedin") && (
                    <TableCell>
                      <a href={`https://linkedin.com/company/${account.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create account</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Account name *</Label>
              <Input placeholder="e.g. Acme Corp" value={newAccount.name} onChange={e => setNewAccount(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={newAccount.industry} onValueChange={v => setNewAccount(p => ({ ...p, industry: v }))}>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {["Technology", "Finance", "Healthcare", "Energy", "Retail"].map(i => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Revenue</Label>
                <Input placeholder="e.g. $10M" value={newAccount.revenue} onChange={e => setNewAccount(p => ({ ...p, revenue: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Headcount</Label>
                <Input type="number" placeholder="e.g. 500" value={newAccount.headcount} onChange={e => setNewAccount(p => ({ ...p, headcount: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Last funding</Label>
              <Input placeholder="e.g. Series A — $20M" value={newAccount.lastFunding} onChange={e => setNewAccount(p => ({ ...p, lastFunding: e.target.value }))} />
            </div>
            <Button className="w-full" onClick={handleCreate}>Create account</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
