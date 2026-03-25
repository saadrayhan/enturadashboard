import { useState, useCallback } from "react";
import { opportunities as initialOpps, stages, stageColors, accounts, Opportunity } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, SlidersHorizontal, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const boardProperties = [
  { key: "owner", label: "Owner" },
  { key: "lastInteraction", label: "Last interaction" },
  { key: "value", label: "Deal value" },
  { key: "closeDate", label: "Close date" },
] as const;

function OpportunityCard({ opp, isDragging }: { opp: Opportunity; isDragging?: boolean }) {
  return (
    <div className={`rounded-lg border border-border bg-card p-3.5 space-y-2.5 transition-shadow ${isDragging ? "shadow-lg opacity-90 rotate-2" : "hover:shadow-sm"} cursor-grab active:cursor-grabbing`}>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground">{opp.accountName[0]}</div>
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

  return (
    <div ref={setNodeRef} className={`w-64 sm:w-72 flex flex-col shrink-0 rounded-lg transition-colors ${isOver ? "bg-accent/50" : ""}`}>
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`h-2 w-2 rounded-full ${dotColor}`} />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stage}</span>
        <span className="text-xs text-muted-foreground/60">{opps.length}</span>
      </div>
      <div className="space-y-2 flex-1 min-h-[60px] p-1">
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
  const [visibleProps, setVisibleProps] = useState<Set<string>>(new Set(boardProperties.map(p => p.key)));
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

    // Determine target stage
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
      if (opp) {
        toast.success(`Moved "${opp.name}" to ${opp.stage}`);
      }
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

  const toggleProp = (key: string) => {
    setVisibleProps(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const totalValue = oppsList.filter(o => o.stage !== "Lost").reduce((s, o) => s + o.value, 0);

  return (
    <div className="p-4 sm:p-6 space-y-5 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{oppsList.length} opportunities · ${(totalValue / 1000).toFixed(0)}k pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <button onClick={() => setView("board")} className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${view === "board" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setView("table")} className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${view === "table" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                Display
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3" align="end">
              <p className="text-xs font-medium text-muted-foreground mb-2">Card properties</p>
              <div className="space-y-2">
                {boardProperties.map(p => (
                  <label key={p.key} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={visibleProps.has(p.key)} onCheckedChange={() => toggleProp(p.key)} />
                    <span className="text-sm text-foreground">{p.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Create opportunity</span>
          </Button>
        </div>
      </div>

      {view === "board" ? (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-4 h-full min-w-max pb-4">
              {stages.map((stage) => (
                <StageColumn key={stage} stage={stage} opps={groupedByStage[stage] || []} />
              ))}
            </div>
          </div>
          <DragOverlay>
            {activeOpp && <div className="w-72"><OpportunityCard opp={activeOpp} isDragging /></div>}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Opportunity</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Account</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Stage</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Value</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Owner</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Close date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {oppsList.map((opp) => {
                const dotColor = stageColors[opp.stage] || "bg-muted";
                return (
                  <TableRow key={opp.id} className="cursor-pointer transition-colors">
                    <TableCell className="font-medium text-foreground">{opp.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{opp.accountName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                        <span className="text-sm text-muted-foreground">{opp.stage}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">${opp.value.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{opp.owner}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{opp.closeDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create opportunity</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Account</Label>
              <Select value={newOpp.accountId} onValueChange={v => setNewOpp(p => ({ ...p, accountId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select an account" /></SelectTrigger>
                <SelectContent>
                  {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Opportunity name *</Label>
              <Input placeholder="Enter name..." value={newOpp.name} onChange={e => setNewOpp(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Stage</Label>
                <Select value={newOpp.stage} onValueChange={v => setNewOpp(p => ({ ...p, stage: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deal value ($)</Label>
                <Input type="number" placeholder="e.g. 50000" value={newOpp.value} onChange={e => setNewOpp(p => ({ ...p, value: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe this opportunity..." value={newOpp.description} onChange={e => setNewOpp(p => ({ ...p, description: e.target.value }))} />
            </div>
            <Button className="w-full" onClick={handleCreate}>Create opportunity</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
