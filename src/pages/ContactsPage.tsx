import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { contacts } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, Search, ExternalLink } from "lucide-react";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.accountName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">{contacts.length} contacts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1.5" />
            Import CSV
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Create contact
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Account</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Last interaction</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Job title</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">LinkedIn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((contact) => (
              <TableRow
                key={contact.id}
                className="cursor-pointer"
                onClick={() => navigate(`/contacts/${contact.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {contact.avatar}
                    </div>
                    <span className="font-medium text-foreground">{contact.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{contact.accountName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{contact.lastInteraction}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{contact.jobTitle}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{contact.email}</TableCell>
                <TableCell>
                  <a
                    href={`https://linkedin.com/in/${contact.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
