import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { TaskItem } from '@/components/TaskItem';
import { Button } from '@/components/ui/button';
import { mockTasks } from '@/data/mockData';
import { Task } from '@/types';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'pending' ? 'done' : 'pending' }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-background pb-6">
      <AppHeader title="Tasks" />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="flex gap-3">
          <div className="flex-1 p-4 bg-warning/10 rounded-xl text-center">
            <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="flex-1 p-4 bg-success/10 rounded-xl text-center">
            <p className="text-2xl font-bold text-success">{doneCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'pending', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskItem
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          )}
        </div>

        {/* FAB */}
        <Button
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </main>

    </div>
  );
};

export default Tasks;
