import { useState } from "react";
import { getProjects, createProject, deleteProject, getTasksByProject } from "@/lib/store";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { FolderKanban, Plus, Trash2 } from "lucide-react";

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
  userName: string;
  onLogout: () => void;
}

export function ProjectList({ onSelectProject, userName, onLogout }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>(getProjects);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(name.trim());
    setName("");
    setOpen(false);
    setProjects(getProjects());
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(getProjects());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight text-foreground">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Hi, <span className="font-medium text-foreground">{userName}</span></span>
            <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Your Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Select a board or create a new one</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                New Board
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="pname">Project Name</Label>
                  <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sprint 12" required />
                </div>
                <Button type="submit" className="w-full">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => {
              const taskCount = getTasksByProject(project.id).length;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group flex items-center gap-4 rounded-lg border bg-card p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelectProject(project)}
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-card-foreground truncate">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">{taskCount} task{taskCount !== 1 ? "s" : ""}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {projects.length === 0 && (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <FolderKanban className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No projects yet. Create your first board!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
