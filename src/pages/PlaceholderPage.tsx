import { Construction } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Construction className="h-10 w-10 text-muted-foreground mb-4" />
      <h1 className="text-xl font-semibold text-foreground mb-1">{title}</h1>
      <p className="text-sm text-muted-foreground">This section is coming soon.</p>
    </div>
  );
}
