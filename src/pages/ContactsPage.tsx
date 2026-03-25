import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { contacts as initialContacts, accounts, Contact } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, Search, ExternalLink, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<Contact[]>(initialContacts);
  const [createOpen, setCreateOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", email: "", jobTitle: "", accountId: "", phone: "" });
  const navigate = useNavigate();

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
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{contactList.length} contacts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("CSV import coming soon")}>
            <Upload className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Import CSV</span>
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Create contact</span>
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Account</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Last interaction</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Job title</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground hidden lg:table-cell">Email</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">LinkedIn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">No contacts found</TableCell></TableRow>
            ) : filtered.map((contact) => (
              <TableRow key={contact.id} className="cursor-pointer transition-colors" onClick={() => navigate(`/contacts/${contact.id}`)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground shrink-0">
                      {contact.avatar}
                    </div>
                    <span className="font-medium text-foreground">{contact.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{contact.accountName}</TableCell>
                <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{contact.lastInteraction}</TableCell>
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
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create contact</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Full name *</Label>
              <Input placeholder="e.g. Jane Doe" value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="e.g. jane@company.com" value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="e.g. +1 555-0123" value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Job title</Label>
              <Input placeholder="e.g. VP Engineering" value={newContact.jobTitle} onChange={e => setNewContact(p => ({ ...p, jobTitle: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Account</Label>
              <Select value={newContact.accountId} onValueChange={v => setNewContact(p => ({ ...p, accountId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                <SelectContent>
                  {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleCreate}>Create contact</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
