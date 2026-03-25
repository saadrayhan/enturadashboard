import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface TopbarAction {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "outline";
}

interface PageTopbarProps {
  icon?: LucideIcon;
  title: string;
  actions?: TopbarAction[];
}

export function PageTopbar({ icon: Icon, title, actions = [] }: PageTopbarProps) {
  return (
    <div className="h-10 flex items-center justify-between border-b border-border px-3 bg-card shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.onClick}
            className={action.variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
          >
            {action.icon && <action.icon className="h-4 w-4 mr-1.5" />}
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
