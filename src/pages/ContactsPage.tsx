import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { contacts as initialContacts, accounts, Contact } from "@/data/mock-data";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, Search, Users, Building2, Clock, Briefcase, Mail, ExternalLink, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PageTopbar } from "@/components/PageTopbar";
import { FilterBar } from "@/components/FilterBar";
import { DetailPanel } from "@/components/DetailPanel";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<Contact[]>(initialContacts);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({ name: "", email: "", jobTitle: "", accountId: "", phone: "" });

  const filtered = contactList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.accountName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newContact.name.trim()) { toast.error("Name is required"); return; }
    const account = accounts.find(a => a.id === newContact.accountId);
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email || "",
      phone: newContact.phone || "",
      jobTitle: newContact.jobTitle || "",
      department: "",
      accountId: newContact.accountId || "",
      accountName: account?.name || "—",
      location: "",
      linkedin: newContact.name.toLowerCase().replace(/\s+/g, ""),
      lastInteraction: "Just now",
      avatar: newContact.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
      dateCreated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setContactList(prev => [contact, ...prev]);
    setNewContact({ name: "", email: "", jobTitle: "", accountId: "", phone: "" });
    setCreateOpen(false);
    toast.success(`${contact.name} created`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageTopbar
        icon={Users}
        title="Contacts"
        actions={[
          { label: "Import CSV", icon: Upload, onClick: () => toast.info("CSV import coming soon"), variant: "outline" },
          { label: "Create contact", icon: Plus, onClick: () => setCreateOpen(true), variant: "default" },
        ]}
      />
      <FilterBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 shrink-0">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-8 text-sm" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto px-4 pb-4">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead><div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />Name</div></TableHead>
                    <TableHead><div className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />Account</div></TableHead>
                    <TableHead className="hidden md:table-cell"><div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Last interaction</div></TableHead>
                    <TableHead className="hidden sm:table-cell"><div className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />Job title</div></TableHead>
                    <TableHead className="hidden lg:table-cell"><div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email</div></TableHead>
                    <TableHead><div className="flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5" />LinkedIn</div></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">No contacts found</TableCell></TableRow>
                  ) : filtered.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className={`cursor-pointer transition-colors ${selected?.id === contact.id ? "bg-primary/5" : ""}`}
                      onClick={() => setSelected(contact)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground shrink-0">
                            {contact.avatar}
                          </div>
                          <span className="font-medium text-foreground text-sm">{contact.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{contact.accountName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell font-mono">{contact.lastInteraction}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{contact.jobTitle}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{contact.email}</TableCell>
                      <TableCell>
                        <a href={`https://linkedin.com/in/${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="px-4 py-2 border-t border-border">
                <span className="text-xs text-muted-foreground font-mono">{filtered.length} contacts</span>
              </div>
            </div>
          </div>
        </div>

        {selected && (
          <DetailPanel
            title={selected.name}
            subtitle={`${selected.jobTitle} at ${selected.accountName}`}
            avatar={selected.avatar}
            onClose={() => setSelected(null)}
            fields={[
              { label: "Email", value: selected.email },
              { label: "Phone", value: selected.phone, mono: true },
              { label: "Account", value: selected.accountName },
              { label: "Job title", value: selected.jobTitle },
              { label: "Department", value: selected.department || "—" },
              { label: "Location", value: selected.location || "—" },
              { label: "Last interaction", value: selected.lastInteraction, mono: true },
              { label: "Created", value: selected.dateCreated, mono: true },
            ]}
          />
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <div className="space-y-4">
            <input
              placeholder="Contact name"
              value={newContact.name}
              onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
              className="w-full text-lg font-medium border-0 bg-transparent outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input type="email" placeholder="e.g. jane@company.com" value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} className="h-8" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input placeholder="e.g. +1 555-0123" value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} className="h-8" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Job title</Label>
                <Input placeholder="e.g. VP Engineering" value={newContact.jobTitle} onChange={e => setNewContact(p => ({ ...p, jobTitle: e.target.value }))} className="h-8" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Account</Label>
                <Select value={newContact.accountId} onValueChange={v => setNewContact(p => ({ ...p, accountId: v }))}>
                  <SelectTrigger className="h-8"><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <button onClick={handleCreate} className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              Create contact
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
