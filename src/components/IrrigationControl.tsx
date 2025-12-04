import { IrrigationDecision } from '@/types/agriculture';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Droplets, Power, Waves } from 'lucide-react';

interface IrrigationControlProps {
  decision: IrrigationDecision;
  autoMode: boolean;
  threshold: number;
  onToggleAuto: () => void;
  onManualPump?: (on: boolean) => void;
}

export const IrrigationControl = ({ 
  decision, 
  autoMode, 
  threshold,
  onToggleAuto,
  onManualPump
}: IrrigationControlProps) => {
  const isPumpOn = decision.pumpStatus === 'ON';

  return (
    <div className="rounded-xl border-2 border-border bg-card overflow-hidden shadow-card">
      {/* Header */}
      <div className="p-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-water/20">
            <Droplets className="w-6 h-6 text-water" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-foreground">
              Irrigation Control
            </h3>
            <p className="text-sm text-muted-foreground">
              Threshold: {threshold}% moisture
            </p>
          </div>
        </div>
      </div>

      {/* Pump Status */}
      <div className="p-5">
        <div className={cn(
          "relative flex items-center justify-center py-8 rounded-xl mb-5 transition-all duration-500",
          isPumpOn 
            ? "bg-water/20 border-2 border-water/40" 
            : "bg-muted/50 border-2 border-border"
        )}>
          {/* Animated ripple when pump is on */}
          {isPumpOn && (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-water/30 animate-ripple" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-water/20 animate-ripple" style={{ animationDelay: '0.5s' }} />
              </div>
            </>
          )}
          
          <div className="relative z-10 text-center">
            <div className={cn(
              "inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 transition-all duration-300",
              isPumpOn 
                ? "bg-water shadow-glow-water text-accent-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              {isPumpOn ? (
                <Waves className="w-8 h-8 animate-pulse-soft" />
              ) : (
                <Power className="w-8 h-8" />
              )}
            </div>
            <p className={cn(
              "text-2xl font-display font-bold",
              isPumpOn ? "text-water" : "text-muted-foreground"
            )}>
              Pump {decision.pumpStatus}
            </p>
          </div>
        </div>

        {/* Reason */}
        <p className="text-sm text-muted-foreground text-center mb-5 px-4">
          {decision.reason}
        </p>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium text-foreground">Auto Mode</p>
              <p className="text-xs text-muted-foreground">
                Automatic irrigation based on moisture levels
              </p>
            </div>
            <Switch 
              checked={autoMode} 
              onCheckedChange={onToggleAuto}
            />
          </div>

          {!autoMode && (
            <div className="flex gap-3">
              <Button 
                variant="water" 
                className="flex-1"
                onClick={() => onManualPump?.(true)}
              >
                <Power className="w-4 h-4" />
                Turn On
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onManualPump?.(false)}
              >
                <Power className="w-4 h-4" />
                Turn Off
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
