import { Alert } from '@/types/agriculture';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, Bell } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertConfig = {
  High: {
    icon: AlertTriangle,
    bgClass: 'bg-destructive/10 border-destructive/30',
    iconClass: 'text-destructive',
    badgeClass: 'bg-destructive text-destructive-foreground',
  },
  Medium: {
    icon: AlertCircle,
    bgClass: 'bg-warning/10 border-warning/30',
    iconClass: 'text-warning',
    badgeClass: 'bg-warning text-warning-foreground',
  },
  Low: {
    icon: Info,
    bgClass: 'bg-accent/10 border-accent/30',
    iconClass: 'text-accent',
    badgeClass: 'bg-accent text-accent-foreground',
  },
  None: {
    icon: Info,
    bgClass: 'bg-muted',
    iconClass: 'text-muted-foreground',
    badgeClass: 'bg-muted text-muted-foreground',
  },
};

export const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const hasAlerts = alerts.length > 0;
  const highPriorityCount = alerts.filter(a => a.level === 'High').length;

  return (
    <div className="rounded-xl border-2 border-border bg-card overflow-hidden shadow-card">
      {/* Header */}
      <div className="p-5 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              highPriorityCount > 0 ? "bg-destructive/20" : "bg-success/20"
            )}>
              <Bell className={cn(
                "w-6 h-6",
                highPriorityCount > 0 ? "text-destructive" : "text-success"
              )} />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground">
                Alerts & Warnings
              </h3>
              <p className="text-sm text-muted-foreground">
                {hasAlerts ? `${alerts.length} active alert(s)` : 'All systems normal'}
              </p>
            </div>
          </div>
          {highPriorityCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold">
              {highPriorityCount} Critical
            </span>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="p-5">
        {!hasAlerts ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground">All Clear</p>
            <p className="text-sm text-muted-foreground">No warnings or alerts at this time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const config = alertConfig[alert.level];
              const AlertIcon = config.icon;

              return (
                <div 
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200 hover:shadow-card",
                    config.bgClass
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertIcon className={cn("w-5 h-5 mt-0.5 shrink-0", config.iconClass)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{alert.type}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          config.badgeClass
                        )}>
                          {alert.level}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <p className="text-sm font-medium text-foreground">
                        → {alert.action}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
