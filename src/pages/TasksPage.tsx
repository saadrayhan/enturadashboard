import { useState } from "react";
import { tasks as initialTasks, accounts, opportunities, Task } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Circle, CircleDot, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
    toast.success(`Task "${task.title}" created`);
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
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{taskList.length} tasks</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Create task
        </Button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto">
        {statusFilters.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
            {s === "all" ? `All (${taskList.length})` : `${statusLabels[s as keyof typeof statusLabels]} (${taskList.filter(t => t.status === s).length})`}
          </button>
        ))}
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">No tasks match this filter</div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.label}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{section.label}</h2>
              <div className="space-y-1">
                {section.tasks.map((task) => {
                  const StatusIcon = statusIcons[task.status];
                  return (
                    <div key={task.id} onClick={() => setSelectedTask(task)} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 sm:px-4 py-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <button onClick={(e) => toggleStatus(task.id, e)} className="shrink-0">
                        <StatusIcon className={`h-4 w-4 ${task.status === "done" ? "text-[hsl(var(--stage-won))]" : task.status === "in_progress" ? "text-[hsl(var(--stage-demo))]" : "text-muted-foreground"} hover:scale-110 transition-transform`} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.accountName} · {task.assignee}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0 hidden sm:inline-flex">
                        {statusLabels[task.status]}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task detail modal */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-lg">
          {selectedTask && (
            <>
              <DialogHeader><DialogTitle>{selectedTask.title}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedTask.description || "No description"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Select value={selectedTask.status} onValueChange={(v) => {
                      const newStatus = v as Task["status"];
                      setTaskList(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: newStatus } : t));
                      setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
                    }}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To do</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><p className="text-xs text-muted-foreground mb-1">Assignee</p><p className="text-foreground">{selectedTask.assignee}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-1">Account</p><p className="text-foreground">{selectedTask.accountName}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-1">Opportunity</p><p className="text-foreground">{selectedTask.opportunityName || "—"}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-1">Due date</p><p className="text-foreground">{selectedTask.dueDate || "No due date"}</p></div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create task modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create task</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input placeholder="e.g. Follow up with client" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Add details..." value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Input placeholder="e.g. Alex Morgan" value={newTask.assignee} onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Due date</Label>
                <Input type="date" value={newTask.dueDate} onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Account</Label>
              <Select value={newTask.accountName} onValueChange={v => setNewTask(p => ({ ...p, accountName: v }))}>
                <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                <SelectContent>
                  {accounts.map(a => <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleCreate}>Create task</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
