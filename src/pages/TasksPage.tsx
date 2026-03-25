import { useState } from "react";
import { tasks as initialTasks, accounts, Task } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Plus, Circle, CircleDot, CheckCircle2, CheckSquare } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PageTopbar } from "@/components/PageTopbar";
import { FilterBar } from "@/components/FilterBar";
import { DetailPanel } from "@/components/DetailPanel";

const statusIcons = { todo: Circle, in_progress: CircleDot, done: CheckCircle2 };
const statusLabels = { todo: "To do", in_progress: "In progress", done: "Done" };
const statusFilters = ["all", "todo", "in_progress", "done"] as const;

export default function TasksPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "", accountName: "", dueDate: "" });

  const filtered = filter === "all" ? taskList : taskList.filter((t) => t.status === filter);
  const today = new Date().toISOString().split("T")[0];

  const sections = [
    { label: "Today", tasks: filtered.filter((t) => t.dueDate === today) },
    { label: "Upcoming", tasks: filtered.filter((t) => t.dueDate && t.dueDate !== today && t.dueDate > today) },
    { label: "Past due", tasks: filtered.filter((t) => t.dueDate && t.dueDate < today) },
    { label: "No due date", tasks: filtered.filter((t) => !t.dueDate) },
  ].filter((s) => s.tasks.length > 0);

  const handleCreate = () => {
    if (!newTask.title.trim()) { toast.error("Task title is required"); return; }
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      assignee: newTask.assignee || "Alex Morgan",
      accountName: newTask.accountName || "—",
      opportunityName: "",
      dueDate: newTask.dueDate || null,
    };
    setTaskList(prev => [task, ...prev]);
    setNewTask({ title: "", description: "", assignee: "", accountName: "", dueDate: "" });
    setCreateOpen(false);
    toast.success(`Task created`);
  };

  const toggleStatus = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskList(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const next = t.status === "todo" ? "in_progress" : t.status === "in_progress" ? "done" : "todo";
      return { ...t, status: next };
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <PageTopbar
        icon={CheckSquare}
        title="Tasks"
        actions={[
          { label: "Create task", icon: Plus, onClick: () => setCreateOpen(true), variant: "default" },
        ]}
      />
      {/* Filter chips row */}
      <div className="h-9 flex items-center gap-2 border-b border-border px-4 bg-card shrink-0">
        {statusFilters.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filter === s ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
            {s === "all" ? `All (${taskList.length})` : `${statusLabels[s as keyof typeof statusLabels]} (${taskList.filter(t => t.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4 space-y-5">
          {sections.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">No tasks match this filter</div>
          ) : (
            sections.map((section) => (
              <div key={section.label}>
                <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2">{section.label}</h2>
                <div className="space-y-1">
                  {section.tasks.map((task) => {
                    const StatusIcon = statusIcons[task.status];
                    return (
                      <div key={task.id} onClick={() => setSelectedTask(task)} className={`flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer ${selectedTask?.id === task.id ? "bg-primary/5 border-primary/20" : ""}`}>
                        <button onClick={(e) => toggleStatus(task.id, e)} className="shrink-0">
                          <StatusIcon className={`h-4 w-4 ${task.status === "done" ? "text-[hsl(var(--stage-won))]" : task.status === "in_progress" ? "text-[hsl(var(--stage-demo))]" : "text-muted-foreground"} hover:scale-110 transition-transform`} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{task.accountName} · {task.assignee}</p>
                        </div>
                        {task.dueDate && (
                          <span className="text-[11px] text-muted-foreground font-mono shrink-0">{task.dueDate}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedTask && (
          <DetailPanel
            title={selectedTask.title}
            subtitle={selectedTask.accountName}
            onClose={() => setSelectedTask(null)}
            fields={[
              { label: "Status", value: (
                <div className="flex items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${selectedTask.status === "done" ? "bg-[hsl(var(--stage-won))]" : selectedTask.status === "in_progress" ? "bg-[hsl(var(--stage-demo))]" : "bg-muted-foreground"}`} />
                  <span>{statusLabels[selectedTask.status]}</span>
                </div>
              )},
              { label: "Assignee", value: selectedTask.assignee },
              { label: "Account", value: selectedTask.accountName },
              { label: "Opportunity", value: selectedTask.opportunityName || "—" },
              { label: "Due date", value: selectedTask.dueDate || "No due date", mono: true },
              { label: "Description", value: selectedTask.description || "No description" },
            ]}
          />
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <div className="space-y-4">
            <input
              placeholder="Task title"
              value={newTask.title}
              onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
              className="w-full text-lg font-medium border-0 bg-transparent outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea placeholder="Add details..." value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Assignee</Label>
                  <Input placeholder="e.g. Alex Morgan" value={newTask.assignee} onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))} className="h-8" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Due date</Label>
                  <Input type="date" value={newTask.dueDate} onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))} className="h-8" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Account</Label>
                <Select value={newTask.accountName} onValueChange={v => setNewTask(p => ({ ...p, accountName: v }))}>
                  <SelectTrigger className="h-8"><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map(a => <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <button onClick={handleCreate} className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              Create task
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
