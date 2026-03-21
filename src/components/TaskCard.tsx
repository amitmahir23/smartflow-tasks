import { Task, COLUMN_CONFIG, TaskStatus } from "@/lib/types";
import { updateTaskStatus, deleteTask } from "@/lib/store";
import { motion } from "framer-motion";
import { Calendar, Trash2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  "todo": "in-progress",
  "in-progress": "done",
  "done": null,
};

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const next = nextStatus[task.status];
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (newStatus: TaskStatus) => updateTaskStatus(task.id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", task.projectId] });
      onUpdate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", task.projectId] });
      onUpdate();
    },
  });

  const handleAdvance = () => {
    if (next) {
      updateMutation.mutate(next);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`group rounded-lg border bg-card p-3.5 shadow-sm transition-shadow ${
        updateMutation.isPending || deleteMutation.isPending ? "opacity-50" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm text-card-foreground leading-snug">{task.title}</h4>
        <Button
          variant="ghost"
          size="icon"
          disabled={deleteMutation.isPending}
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {task.description && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.deadline && (
            <span className={`flex items-center gap-1 text-xs font-mono ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
              <Calendar className="h-3 w-3" />
              {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
          {task.assignee && (
            <Badge variant="secondary" className="text-[10px] font-medium px-1.5 py-0">
              {task.assignee}
            </Badge>
          )}
        </div>

        {next && (
          <Button
            variant="ghost"
            size="icon"
            disabled={updateMutation.isPending}
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
            onClick={handleAdvance}
            title={`Move to ${COLUMN_CONFIG[next].label}`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
