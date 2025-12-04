import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color: 'soil' | 'water' | 'leaf' | 'sun';
  min?: number;
  max?: number;
  optimal?: [number, number];
}

const colorStyles = {
  soil: 'bg-soil/10 text-soil border-soil/20',
  water: 'bg-water/10 text-water border-water/20',
  leaf: 'bg-leaf/10 text-leaf border-leaf/20',
  sun: 'bg-sun/10 text-sun border-sun/20',
};

const iconBgStyles = {
  soil: 'bg-soil text-primary-foreground',
  water: 'bg-water text-accent-foreground',
  leaf: 'bg-leaf text-success-foreground',
  sun: 'bg-sun text-warning-foreground',
};

export const SensorCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  color,
  min = 0,
  max = 100,
  optimal
}: SensorCardProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const isOptimal = optimal ? value >= optimal[0] && value <= optimal[1] : true;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-elevated",
      colorStyles[color]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold tracking-tight">
              {value.toFixed(1)}
            </span>
            <span className="text-lg font-medium opacity-70">{unit}</span>
          </div>
          {optimal && (
            <p className={cn(
              "text-xs mt-2 font-medium",
              isOptimal ? "text-success" : "text-warning"
            )}>
              {isOptimal ? '✓ Optimal range' : '⚠ Outside optimal range'}
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg shadow-card",
          iconBgStyles[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 h-2 rounded-full bg-background/50 overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color === 'soil' && "bg-soil",
            color === 'water' && "bg-water",
            color === 'leaf' && "bg-leaf",
            color === 'sun' && "bg-sun",
          )}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      {/* Decorative element */}
      <div className={cn(
        "absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-10",
        color === 'soil' && "bg-soil",
        color === 'water' && "bg-water",
        color === 'leaf' && "bg-leaf",
        color === 'sun' && "bg-sun",
      )} />
    </div>
  );
};
