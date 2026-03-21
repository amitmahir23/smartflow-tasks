import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasksByProject } from "@/lib/store";
import { TaskStatus } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { CreateTaskDialog } from "./CreateTaskDialog";

interface BoardViewProps {
  projectId: string;
  projectName: string;
  onBack: () => void;
}

const STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];

export function BoardView({ projectId, projectName, onBack }: BoardViewProps) {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasksByProject(projectId),
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
  }, [queryClient, projectId]);

  const grouped = STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: tasks.filter((t) => t.status === s) }),
    {} as Record<TaskStatus, typeof tasks>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              ← Projects
            </button>
            <span className="text-border">/</span>
            <h1 className="font-bold text-foreground tracking-tight">{projectName}</h1>
          </div>
          <CreateTaskDialog projectId={projectId} onCreated={refresh} />
        </div>
      </header>
      <main className="flex-1 container py-8">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {STATUSES.map((status) => (
              <KanbanColumn key={status} status={status} tasks={grouped[status]} onUpdate={refresh} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
