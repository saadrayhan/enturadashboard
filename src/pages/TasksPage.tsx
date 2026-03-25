import { useState } from "react";
import { tasks } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, Circle, CircleDot, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const statusIcons = {
  todo: Circle,
  in_progress: CircleDot,
  done: CheckCircle2,
};

const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const statusFilters = ["all", "todo", "in_progress", "done"] as const;

export default function TasksPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = filtered.filter((t) => t.dueDate === today);
  const upcomingTasks = filtered.filter((t) => t.dueDate && t.dueDate !== today && t.dueDate > today);
  const pastTasks = filtered.filter((t) => t.dueDate && t.dueDate < today);
  const noDueDateTasks = filtered.filter((t) => !t.dueDate);

  const sections = [
    { label: "Today", tasks: todayTasks },
    { label: "Upcoming", tasks: upcomingTasks },
    { label: "Past due", tasks: pastTasks },
    { label: "No due date", tasks: noDueDateTasks },
  ].filter((s) => s.tasks.length > 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">{tasks.length} tasks</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Create task
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
          >
            {s === "all" ? "All" : statusLabels[s as keyof typeof statusLabels]}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{section.label}</h2>
            <div className="space-y-1">
              {section.tasks.map((task) => {
                const StatusIcon = statusIcons[task.status];
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <StatusIcon className={`h-4 w-4 shrink-0 ${task.status === "done" ? "text-[hsl(var(--stage-won))]" : task.status === "in_progress" ? "text-[hsl(var(--stage-demo))]" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{task.accountName} · {task.assignee}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {statusLabels[task.status]}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-lg">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedTask.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge variant="secondary">{statusLabels[selectedTask.status]}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Assignee</p>
                    <p className="text-foreground">{selectedTask.assignee}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Account</p>
                    <p className="text-foreground">{selectedTask.accountName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Opportunity</p>
                    <p className="text-foreground">{selectedTask.opportunityName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Due date</p>
                    <p className="text-foreground">{selectedTask.dueDate || "No due date"}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
