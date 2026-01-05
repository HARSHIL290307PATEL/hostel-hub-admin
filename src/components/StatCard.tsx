import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'default' | 'accent' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-card text-card-foreground',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

const iconStyles = {
  default: 'bg-primary/10 text-primary',
  accent: 'bg-accent/20 text-accent',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
};

export const StatCard = ({ title, value, icon: Icon, variant = 'default' }: StatCardProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-xl shadow-card transition-all duration-200 hover:shadow-card-hover animate-fade-in",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground truncate">{title}</p>
        </div>
      </div>
    </div>
  );
};
