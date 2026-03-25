import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, FileIcon } from "lucide-react";
import { toast } from "sonner";

export default function ClientFiles() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("projects").select("id, name").eq("client_id", user!.id).then(({ data }) => setProjects(data || []));
  }, [user]);

  useEffect(() => {
    if (!selectedProject) return;
    supabase.from("project_files").select("*, uploader:profiles!project_files_uploaded_by_fkey(full_name)").eq("project_id", selectedProject).order("created_at", { ascending: false })
      .then(({ data }) => setFiles(data || []));
  }, [selectedProject]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProject) return;
    const path = `${selectedProject}/${Date.now()}_${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("project-files").upload(path, file);
    if (uploadErr) { toast.error(uploadErr.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("project-files").getPublicUrl(path);
    await supabase.from("project_files").insert({
      project_id: selectedProject, uploaded_by: user!.id,
      file_name: file.name, file_url: publicUrl, file_size: file.size, file_type: file.type,
    });
    toast.success("File uploaded");
    supabase.from("project_files").select("*, uploader:profiles!project_files_uploaded_by_fkey(full_name)").eq("project_id", selectedProject).order("created_at", { ascending: false })
      .then(({ data }) => setFiles(data || []));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Files</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload and download project materials</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full sm:w-64"><SelectValue placeholder="Select project" /></SelectTrigger>
          <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
        </Select>
        {selectedProject && (
          <label>
            <Button variant="outline" asChild><span><Upload className="h-4 w-4 mr-2" /> Upload File</span></Button>
            <input type="file" className="hidden" onChange={upload} />
          </label>
        )}
      </div>

      {!selectedProject ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Select a project to view files</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {files.map(f => (
            <Card key={f.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.file_name}</p>
                    <p className="text-xs text-muted-foreground">{f.uploader?.full_name} • {new Date(f.created_at).toLocaleDateString()} • {f.file_size ? `${(f.file_size / 1024).toFixed(1)} KB` : ""}</p>
                  </div>
                </div>
                <a href={f.file_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                </a>
              </CardContent>
            </Card>
          ))}
          {files.length === 0 && <Card><CardContent className="py-8 text-center text-muted-foreground">No files yet</CardContent></Card>}
        </div>
      )}
    </div>
  );
}
