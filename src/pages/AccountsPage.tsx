import { useState } from "react";
import { accounts, industryStyles } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, Search, SlidersHorizontal, ExternalLink } from "lucide-react";

export default function AccountsPage() {
  const [search, setSearch] = useState("");
  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">{accounts.length} accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1.5" />
            Import CSV
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Create account
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-1.5" />
          Display
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Account</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Industry</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Last interaction</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Revenue</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Headcount</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Last funding</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">LinkedIn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((account) => {
              const style = industryStyles[account.industry] || { bg: "bg-muted", text: "text-muted-foreground" };
              return (
                <TableRow key={account.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-sm font-semibold text-muted-foreground">
                        {account.logo}
                      </div>
                      <span className="font-medium text-foreground">{account.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                      {account.industry}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{account.lastInteraction}</TableCell>
                  <TableCell className="text-sm text-foreground font-medium">{account.revenue}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{account.headcount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{account.lastFunding}</TableCell>
                  <TableCell>
                    <a href={`https://linkedin.com/company/${account.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
