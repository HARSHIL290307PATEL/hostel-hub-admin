import { Calendar, Check, Clock } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle?: () => void;
}

export const TaskItem = ({ task, onToggle }: TaskItemProps) => {
  const isPending = task.status === 'pending';

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 bg-card rounded-xl shadow-card transition-all duration-200 animate-fade-in",
        isPending && "border-l-4 border-warning"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          isPending
            ? "border-muted-foreground hover:border-success hover:bg-success/10"
            : "border-success bg-success text-success-foreground"
        )}
      >
        {!isPending && <Check className="w-4 h-4" />}
      </button>
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "font-medium truncate",
            !isPending && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {task.dueDate}
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {task.category}
          </span>
        </div>
      </div>
      <span
        className={cn(
          "px-2 py-1 text-xs font-medium rounded-full",
          isPending
            ? "bg-warning/10 text-warning"
            : "bg-success/10 text-success"
        )}
      >
        {isPending ? 'Pending' : 'Done'}
      </span>
    </div>
  );
};
