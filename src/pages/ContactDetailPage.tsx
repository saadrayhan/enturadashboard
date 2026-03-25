import { useParams, useNavigate } from "react-router-dom";
import { contacts } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Briefcase, Calendar, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = contacts.find((c) => c.id === id);

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Contact not found</p>
      </div>
    );
  }

  const details = [
    { icon: Mail, label: "Email", value: contact.email },
    { icon: Phone, label: "Phone", value: contact.phone },
    { icon: Building2, label: "Account", value: contact.accountName },
    { icon: Briefcase, label: "Job title", value: contact.jobTitle },
    { icon: Briefcase, label: "Department", value: contact.department },
    { icon: MapPin, label: "Location", value: contact.location },
    { icon: ExternalLink, label: "LinkedIn", value: contact.linkedin, isLink: true },
    { icon: Calendar, label: "Created", value: contact.dateCreated },
  ];

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 p-6 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/contacts")} className="text-muted-foreground -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to contacts
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
            {contact.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{contact.name}</h1>
            <p className="text-sm text-muted-foreground">{contact.jobTitle} at {contact.accountName}</p>
          </div>
        </div>

        <Separator />

        {/* Activity timeline */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-4">Activity</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
              <div>
                <p className="text-sm text-foreground">Last interaction — {contact.lastInteraction}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Email follow-up sent</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-muted-foreground/30 shrink-0" />
              <div>
                <p className="text-sm text-foreground">Meeting — Introduction call</p>
                <p className="text-xs text-muted-foreground mt-0.5">30-minute video call with the team</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-muted-foreground/30 shrink-0" />
              <div>
                <p className="text-sm text-foreground">Contact created — {contact.dateCreated}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Added via manual entry</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — contact details */}
      <div className="w-80 border-l border-border bg-card p-6 space-y-5">
        <h2 className="text-sm font-semibold text-foreground">Contact details</h2>
        <div className="space-y-4">
          {details.map((d) => (
            <div key={d.label} className="flex items-start gap-3">
              <d.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{d.label}</p>
                {d.isLink ? (
                  <a
                    href={`https://linkedin.com/in/${d.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground hover:underline"
                  >
                    {d.value}
                  </a>
                ) : (
                  <p className="text-sm text-foreground">{d.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
