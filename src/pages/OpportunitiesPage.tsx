import { useState } from "react";
import { opportunities, stages, stageColors } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OpportunitiesPage() {
  const [view, setView] = useState<"board" | "table">("board");
  const [createOpen, setCreateOpen] = useState(false);

  const groupedByStage = stages.reduce((acc, stage) => {
    acc[stage] = opportunities.filter((o) => o.stage === stage);
    return acc;
  }, {} as Record<string, typeof opportunities>);

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1">{opportunities.length} opportunities</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <button
              onClick={() => setView("board")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${view === "board" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${view === "table" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-1.5" />
            Display
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Create opportunity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create opportunity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Account</Label>
                  <Input placeholder="Select an account..." />
                </div>
                <div className="space-y-2">
                  <Label>Opportunity name</Label>
                  <Input placeholder="Enter name..." />
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>
                      {stages.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe this opportunity..." />
                </div>
                <Button className="w-full" onClick={() => setCreateOpen(false)}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === "board" ? (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full min-w-max pb-4">
            {stages.map((stage) => {
              const stageOpps = groupedByStage[stage] || [];
              const dotColor = stageColors[stage] || "bg-muted";
              return (
                <div key={stage} className="w-72 flex flex-col shrink-0">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className={`h-2 w-2 rounded-full ${dotColor}`} />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stage}</span>
                    <span className="text-xs text-muted-foreground/60">{stageOpps.length}</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    {stageOpps.map((opp) => (
                      <div key={opp.id} className="rounded-lg border border-border bg-card p-3.5 space-y-2.5 hover:shadow-sm transition-shadow cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground">
                            {opp.accountName[0]}
                          </div>
                          <span className="text-xs text-muted-foreground">{opp.accountName}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground leading-snug">{opp.name}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{opp.owner}</span>
                          <span>{opp.lastInteraction}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">${(opp.value / 1000).toFixed(0)}k</span>
                          <span className="text-xs text-muted-foreground">{opp.closeDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Opportunity</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Account</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Stage</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Value</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Owner</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Close date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opp) => {
                const dotColor = stageColors[opp.stage] || "bg-muted";
                return (
                  <TableRow key={opp.id} className="cursor-pointer">
                    <TableCell className="font-medium text-foreground">{opp.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{opp.accountName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                        <span className="text-sm text-muted-foreground">{opp.stage}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">${opp.value.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{opp.owner}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{opp.closeDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
