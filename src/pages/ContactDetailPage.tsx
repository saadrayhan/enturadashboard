import { useParams, useNavigate } from "react-router-dom";
import { contacts } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Briefcase, Calendar, ExternalLink, Copy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = contacts.find((c) => c.id === id);

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-muted-foreground">Contact not found</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/contacts")}>Back to contacts</Button>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const details = [
    { icon: Mail, label: "Email", value: contact.email, action: () => copyToClipboard(contact.email, "Email") },
    { icon: Phone, label: "Phone", value: contact.phone, action: () => copyToClipboard(contact.phone, "Phone") },
    { icon: Building2, label: "Account", value: contact.accountName },
    { icon: Briefcase, label: "Job title", value: contact.jobTitle },
    { icon: Briefcase, label: "Department", value: contact.department },
    { icon: MapPin, label: "Location", value: contact.location },
    { icon: ExternalLink, label: "LinkedIn", value: contact.linkedin, isLink: true },
    { icon: Calendar, label: "Created", value: contact.dateCreated },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate("/contacts")} className="text-muted-foreground -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to contacts
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted text-base sm:text-lg font-semibold text-muted-foreground shrink-0">
            {contact.avatar}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">{contact.name}</h1>
            <p className="text-sm text-muted-foreground">{contact.jobTitle} at {contact.accountName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${contact.email}`)}>
            <Mail className="h-4 w-4 mr-1.5" />Email
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.open(`tel:${contact.phone}`)}>
            <Phone className="h-4 w-4 mr-1.5" />Call
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.open(`https://linkedin.com/in/${contact.linkedin}`, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-1.5" />LinkedIn
          </Button>
        </div>

        <Separator />

        {/* Activity timeline */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-4">Activity</h2>
          <div className="space-y-4">
            {[
              { dot: "bg-primary", title: `Last interaction — ${contact.lastInteraction}`, sub: "Email follow-up sent" },
              { dot: "bg-muted-foreground/30", title: "Meeting — Introduction call", sub: "30-minute video call with the team" },
              { dot: "bg-muted-foreground/30", title: `Contact created — ${contact.dateCreated}`, sub: "Added via manual entry" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className={`mt-1.5 h-2 w-2 rounded-full ${item.dot} shrink-0`} />
                <div>
                  <p className="text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — contact details */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card p-4 sm:p-6 space-y-5">
        <h2 className="text-sm font-semibold text-foreground">Contact details</h2>
        <div className="space-y-4">
          {details.map((d) => (
            <div key={d.label} className="flex items-start gap-3 group">
              <d.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{d.label}</p>
                {d.isLink ? (
                  <a href={`https://linkedin.com/in/${d.value}`} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:underline">
                    {d.value}
                  </a>
                ) : (
                  <p className="text-sm text-foreground truncate">{d.value}</p>
                )}
              </div>
              {d.action && (
                <button onClick={d.action} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
