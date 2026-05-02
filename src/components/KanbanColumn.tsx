import { Task, TaskStatus, COLUMN_CONFIG } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { AnimatePresence } from "framer-motion";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onUpdate: () => void;
}

export function KanbanColumn({ status, tasks, onUpdate }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status];

  return (
    <div className="flex flex-col min-w-[280px] max-w-[340px] flex-1">
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <div className={`h-2.5 w-2.5 rounded-full ${config.colorClass}`} />
        <h3 className="font-bold text-sm text-foreground tracking-tight">{config.label}</h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2.5 flex-1">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={onUpdate} />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-xs text-muted-foreground">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
