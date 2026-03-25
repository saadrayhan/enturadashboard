import { useState, useCallback } from "react";
import { opportunities as initialOpps, stages, stageColors, accounts, Opportunity } from "@/data/mock-data";
import { Plus, LayoutGrid, List, Target, Building2, Clock, DollarSign, Calendar, Layers } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { PageTopbar } from "@/components/PageTopbar";
import { FilterBar } from "@/components/FilterBar";
import { DetailPanel } from "@/components/DetailPanel";
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function OpportunityCard({ opp, isDragging }: { opp: Opportunity; isDragging?: boolean }) {
  return (
    <div className={`rounded-lg border border-border bg-card p-3 space-y-2 transition-shadow ${isDragging ? "shadow-lg opacity-90 rotate-1" : "hover:bg-muted/30"} cursor-grab active:cursor-grabbing`}>
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[9px] font-semibold text-muted-foreground">{opp.accountName[0]}</div>
        <span className="text-[11px] text-muted-foreground">{opp.accountName}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Layers className="h-3 w-3 text-muted-foreground shrink-0" />
        <p className="text-sm font-medium text-foreground leading-snug truncate">{opp.name}</p>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{opp.owner}</span>
        <span className="font-mono">{opp.lastInteraction}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground font-mono">${(opp.value / 1000).toFixed(0)}k</span>
        <span className="text-[11px] text-muted-foreground font-mono">{opp.closeDate}</span>
      </div>
    </div>
  );
}

function SortableCard({ opp }: { opp: Opportunity }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: opp.id, data: { type: "card", opp } });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OpportunityCard opp={opp} />
    </div>
  );
}

function StageColumn({ stage, opps }: { stage: string; opps: Opportunity[] }) {
  const dotColor = stageColors[stage] || "bg-muted";
  const { setNodeRef, isOver } = useDroppable({ id: stage, data: { type: "column" } });
  const total = opps.reduce((s, o) => s + o.value, 0);

  return (
    <div ref={setNodeRef} className={`w-60 flex flex-col shrink-0 transition-colors ${isOver ? "bg-accent/50 rounded-lg" : ""}`}>
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
        <span className="text-xs font-medium text-foreground">{stage}</span>
        <span className="text-[11px] text-muted-foreground font-mono">{opps.length}</span>
        <span className="text-[11px] text-muted-foreground font-mono ml-auto">${(total / 1000).toFixed(0)}k</span>
      </div>
      <div className="space-y-2 flex-1 min-h-[60px] p-0.5">
        {opps.map((opp) => <SortableCard key={opp.id} opp={opp} />)}
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [view, setView] = useState<"board" | "table">("board");
  const [createOpen, setCreateOpen] = useState(false);
  const [oppsList, setOppsList] = useState<Opportunity[]>(initialOpps);
  const [activeOpp, setActiveOpp] = useState<Opportunity | null>(null);
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [newOpp, setNewOpp] = useState({ name: "", accountId: "", stage: "", description: "", value: "" });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event: DragStartEvent) => {
    const opp = oppsList.find(o => o.id === event.active.id);
    if (opp) setActiveOpp(opp);
  };

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    let targetStage: string | null = null;
    if (stages.includes(overId as any)) {
      targetStage = overId;
    } else {
      const overOpp = oppsList.find(o => o.id === overId);
      if (overOpp) targetStage = overOpp.stage;
    }
    if (!targetStage) return;
    setOppsList(prev => {
      const opp = prev.find(o => o.id === activeId);
      if (!opp || opp.stage === targetStage) return prev;
      return prev.map(o => o.id === activeId ? { ...o, stage: targetStage! } : o);
    });
  }, [oppsList]);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveOpp(null);
    if (event.over) {
      const opp = oppsList.find(o => o.id === event.active.id);
      if (opp) toast.success(`Moved "${opp.name}" to ${opp.stage}`);
    }
  };

  const handleCreate = () => {
    if (!newOpp.name.trim()) { toast.error("Opportunity name is required"); return; }
    const account = accounts.find(a => a.id === newOpp.accountId);
    const opp: Opportunity = {
      id: Date.now().toString(),
      name: newOpp.name,
      accountId: newOpp.accountId || "",
      accountName: account?.name || "—",
      stage: newOpp.stage || "Lead",
      value: parseInt(newOpp.value) || 0,
      owner: "Alex Morgan",
      closeDate: "TBD",
      lastInteraction: "Just now",
      description: newOpp.description,
    };
    setOppsList(prev => [...prev, opp]);
    setNewOpp({ name: "", accountId: "", stage: "", description: "", value: "" });
    setCreateOpen(false);
    toast.success(`"${opp.name}" created`);
  };

  const groupedByStage = stages.reduce((acc, stage) => {
    acc[stage] = oppsList.filter((o) => o.stage === stage);
    return acc;
  }, {} as Record<string, Opportunity[]>);

  const totalValue = oppsList.filter(o => o.stage !== "Lost").reduce((s, o) => s + o.value, 0);

  return (
    <div className="flex flex-col h-full">
      <PageTopbar
        icon={Target}
        title="Opportunities"
        actions={[
          { label: "Create opportunity", icon: Plus, onClick: () => setCreateOpen(true), variant: "default" },
        ]}
      />
      {/* View toggle + filter bar */}
      <div className="h-9 flex items-center gap-2 border-b border-border px-4 bg-card shrink-0">
        <div className="flex items-center rounded-md border border-border p-0.5">
          <button onClick={() => setView("board")} className={`rounded px-2 py-1 text-xs font-medium transition-colors ${view === "board" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setView("table")} className={`rounded px-2 py-1 text-xs font-medium transition-colors ${view === "table" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{oppsList.length} opportunities · ${(totalValue / 1000).toFixed(0)}k pipeline</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          {view === "board" ? (
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
              <div className="p-4">
                <div className="flex gap-4 min-w-max pb-4">
                  {stages.map((stage) => (
                    <StageColumn key={stage} stage={stage} opps={groupedByStage[stage] || []} />
                  ))}
                </div>
              </div>
              <DragOverlay>
                {activeOpp && <div className="w-60"><OpportunityCard opp={activeOpp} isDragging /></div>}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="p-4">
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead><div className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5" />Opportunity</div></TableHead>
                      <TableHead><div className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />Account</div></TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead><div className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />Value</div></TableHead>
                      <TableHead className="hidden md:table-cell">Owner</TableHead>
                      <TableHead className="hidden md:table-cell"><div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Close date</div></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {oppsList.map((opp) => {
                      const dotColor = stageColors[opp.stage] || "bg-muted";
                      return (
                        <TableRow key={opp.id} className={`cursor-pointer transition-colors ${selected?.id === opp.id ? "bg-primary/5" : ""}`} onClick={() => setSelected(opp)}>
                          <TableCell className="font-medium text-foreground text-sm">{opp.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{opp.accountName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <div className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                              <span className="text-sm text-muted-foreground">{opp.stage}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium text-foreground font-mono">${opp.value.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{opp.owner}</TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell font-mono">{opp.closeDate}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="px-4 py-2 border-t border-border">
                  <span className="text-xs text-muted-foreground font-mono">{oppsList.length} opportunities</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {selected && view === "table" && (
          <DetailPanel
            title={selected.name}
            subtitle={selected.accountName}
            avatar={selected.accountName[0]}
            onClose={() => setSelected(null)}
            fields={[
              { label: "Stage", value: (
                <div className="flex items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${stageColors[selected.stage] || "bg-muted"}`} />
                  <span>{selected.stage}</span>
                </div>
              )},
              { label: "Deal value", value: `$${selected.value.toLocaleString()}`, mono: true },
              { label: "Owner", value: selected.owner },
              { label: "Close date", value: selected.closeDate, mono: true },
              { label: "Last interaction", value: selected.lastInteraction, mono: true },
              { label: "Description", value: selected.description || "—" },
            ]}
          />
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <div className="space-y-4">
            <input
              placeholder="Opportunity name"
              value={newOpp.name}
              onChange={e => setNewOpp(p => ({ ...p, name: e.target.value }))}
              className="w-full text-lg font-medium border-0 bg-transparent outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Account</Label>
                <Select value={newOpp.accountId} onValueChange={v => setNewOpp(p => ({ ...p, accountId: v }))}>
                  <SelectTrigger className="h-8"><SelectValue placeholder="Select an account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Stage</Label>
                  <Select value={newOpp.stage} onValueChange={v => setNewOpp(p => ({ ...p, stage: v }))}>
                    <SelectTrigger className="h-8"><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>
                      {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Deal value ($)</Label>
                  <Input type="number" placeholder="e.g. 50000" value={newOpp.value} onChange={e => setNewOpp(p => ({ ...p, value: e.target.value }))} className="h-8" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea placeholder="Describe this opportunity..." value={newOpp.description} onChange={e => setNewOpp(p => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
            <button onClick={handleCreate} className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              Create opportunity
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
