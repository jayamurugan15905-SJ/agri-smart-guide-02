import { CropHealthStatus } from '@/types/agriculture';
import { cn } from '@/lib/utils';
import { Leaf, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CropHealthPanelProps {
  health: CropHealthStatus;
  cropType: string;
}

const statusConfig = {
  Good: {
    gradient: 'bg-gradient-health-good',
    icon: CheckCircle,
    bgClass: 'bg-success/10 border-success/30',
    textClass: 'text-success',
  },
  Moderate: {
    gradient: 'bg-gradient-health-warning',
    icon: AlertTriangle,
    bgClass: 'bg-warning/10 border-warning/30',
    textClass: 'text-warning',
  },
  Poor: {
    gradient: 'bg-gradient-health-danger',
    icon: XCircle,
    bgClass: 'bg-destructive/10 border-destructive/30',
    textClass: 'text-destructive',
  },
};

export const CropHealthPanel = ({ health, cropType }: CropHealthPanelProps) => {
  const config = statusConfig[health.condition];
  const StatusIcon = config.icon;

  return (
    <div className="rounded-xl border-2 border-border bg-card overflow-hidden shadow-card">
      {/* Header with gradient */}
      <div className={cn("p-5", config.gradient)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-foreground/20">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-primary-foreground">
                Crop Health
              </h3>
              <p className="text-sm text-primary-foreground/80 capitalize">
                {cropType}
              </p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-primary-foreground/20 text-primary-foreground font-semibold"
          )}>
            <StatusIcon className="w-5 h-5" />
            {health.condition}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-muted-foreground mb-4">{health.description}</p>

        {health.actionRequired && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            <span className="text-sm font-medium text-destructive">
              Immediate action required
            </span>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Recommendations:</h4>
          <ul className="space-y-2">
            {health.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
