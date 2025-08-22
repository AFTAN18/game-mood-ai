import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MousePointer, Zap, AlertTriangle, Target } from 'lucide-react';

interface ClickMetrics {
  intensity: number;        // Force units (0-100)
  frequency: number;        // Clicks per second
  pattern: 'normal' | 'aggressive' | 'erratic' | 'calm';
  totalClicks: number;
  averageIntensity: number;
}

interface ClickIntensityDetectorProps {
  onMetricsChange: (metrics: ClickMetrics) => void;
  isActive: boolean;
}

export const ClickIntensityDetector: React.FC<ClickIntensityDetectorProps> = ({
  onMetricsChange,
  isActive
}) => {
  const [metrics, setMetrics] = useState<ClickMetrics>({
    intensity: 0,
    frequency: 0,
    pattern: 'calm',
    totalClicks: 0,
    averageIntensity: 0
  });

  const [clickHistory, setClickHistory] = useState<{ timestamp: number; intensity: number }[]>([]);
  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const clickAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && clickAreaRef.current) {
      clickAreaRef.current.focus();
    }
  }, [isActive]);

  const calculateIntensity = (event: MouseEvent): number => {
    // Simulate click intensity based on various factors
    // In a real implementation, this would use pressure-sensitive hardware
    
    const baseIntensity = Math.random() * 50 + 25; // Base 25-75 range
    
    // Add variation based on click speed
    let speedMultiplier = 1;
    if (lastClickTime) {
      const timeSinceLastClick = Date.now() - lastClickTime;
      if (timeSinceLastClick < 100) { // Very fast clicking
        speedMultiplier = 1.5;
      } else if (timeSinceLastClick < 300) { // Fast clicking
        speedMultiplier = 1.2;
      } else if (timeSinceLastClick > 2000) { // Slow clicking
        speedMultiplier = 0.8;
      }
    }
    
    // Add variation based on click position (edge vs center)
    const rect = clickAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceFromCenter = Math.sqrt(
        Math.pow(event.clientX - centerX, 2) + 
        Math.pow(event.clientY - centerY, 2)
      );
      const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2));
      const positionMultiplier = 1 + (distanceFromCenter / maxDistance) * 0.3;
      
      return Math.min(100, Math.max(0, baseIntensity * speedMultiplier * positionMultiplier));
    }
    
    return Math.min(100, Math.max(0, baseIntensity * speedMultiplier));
  };

  const calculateFrequency = (): number => {
    if (clickHistory.length < 2) return 0;
    
    const recentClicks = clickHistory.slice(-10); // Last 10 clicks
    if (recentClicks.length < 2) return 0;
    
    const timeSpan = recentClicks[recentClicks.length - 1].timestamp - recentClicks[0].timestamp;
    const clicksPerSecond = (recentClicks.length - 1) / (timeSpan / 1000);
    
    return Math.round(clicksPerSecond * 10) / 10; // Round to 1 decimal
  };

  const determinePattern = (): 'normal' | 'aggressive' | 'erratic' | 'calm' => {
    const { frequency, averageIntensity } = metrics;
    
    if (frequency > 3 && averageIntensity > 70) {
      return 'aggressive';
    } else if (frequency > 2 && averageIntensity > 60) {
      return 'erratic';
    } else if (frequency < 1 && averageIntensity < 40) {
      return 'calm';
    } else {
      return 'normal';
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    if (!isActive) return;
    
    const currentTime = Date.now();
    const intensity = calculateIntensity(event.nativeEvent);
    
    // Update click history
    const newClick = { timestamp: currentTime, intensity };
    setClickHistory(prev => [...prev.slice(-19), newClick]); // Keep last 20 clicks
    
    // Calculate new metrics
    const totalClicks = clickHistory.length + 1;
    const averageIntensity = clickHistory.length > 0 
      ? (clickHistory.reduce((sum, click) => sum + click.intensity, 0) + intensity) / totalClicks
      : intensity;
    
    const frequency = calculateFrequency();
    const pattern = determinePattern();
    
    const newMetrics = {
      intensity,
      frequency,
      pattern,
      totalClicks,
      averageIntensity: Math.round(averageIntensity * 10) / 10
    };
    
    setMetrics(newMetrics);
    onMetricsChange(newMetrics);
    setLastClickTime(currentTime);
    
    if (!isTracking) {
      setIsTracking(true);
    }
  };

  const resetDetector = () => {
    setClickHistory([]);
    setMetrics({
      intensity: 0,
      frequency: 0,
      pattern: 'calm',
      totalClicks: 0,
      averageIntensity: 0
    });
    setLastClickTime(null);
    setIsTracking(false);
  };

  const getPatternIndicator = (): { level: string; color: string; icon: React.ReactNode } => {
    switch (metrics.pattern) {
      case 'aggressive':
        return { level: 'Aggressive', color: 'text-red-500', icon: <AlertTriangle className="w-4 h-4" /> };
      case 'erratic':
        return { level: 'Erratic', color: 'text-yellow-500', icon: <Zap className="w-4 h-4" /> };
      case 'normal':
        return { level: 'Normal', color: 'text-blue-500', icon: <MousePointer className="w-4 h-4" /> };
      case 'calm':
        return { level: 'Calm', color: 'text-green-500', icon: <Target className="w-4 h-4" /> };
      default:
        return { level: 'Unknown', color: 'text-gray-500', icon: <MousePointer className="w-4 h-4" /> };
    }
  };

  const patternIndicator = getPatternIndicator();

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Click Intensity Analysis</h3>
        <Badge variant="outline" className={patternIndicator.color}>
          {patternIndicator.icon}
          <span className="ml-2">{patternIndicator.level}</span>
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{metrics.intensity.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Current Intensity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{metrics.frequency}</div>
            <div className="text-sm text-muted-foreground">Clicks/sec</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Average Intensity</span>
            <span>{metrics.averageIntensity.toFixed(1)}</span>
          </div>
          <Progress value={metrics.averageIntensity} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Click Frequency</span>
            <span>{metrics.frequency.toFixed(1)}/s</span>
          </div>
          <Progress value={Math.min(100, (metrics.frequency / 5) * 100)} />
        </div>

        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Total Clicks</div>
          <div className="text-3xl font-bold">{metrics.totalClicks}</div>
        </div>
      </div>

      <div 
        ref={clickAreaRef}
        className="relative w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as any);
          }
        }}
      >
        <div className="text-center">
          <MousePointer className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isActive ? 'Click here to test intensity' : 'Click detection disabled'}
          </p>
          {isTracking && (
            <p className="text-xs text-muted-foreground mt-1">
              Tracking active - {metrics.totalClicks} clicks recorded
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {isTracking && (
            <span>Tracking for {Math.round((Date.now() - (clickHistory[0]?.timestamp || Date.now())) / 1000)}s</span>
          )}
        </div>
        
        <button
          onClick={resetDetector}
          className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
        >
          Reset
        </button>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Higher intensity may indicate frustration or urgency</p>
        <p>• Rapid clicking suggests stress or impatience</p>
        <p>• Erratic patterns may indicate emotional instability</p>
        <p>• Calm, measured clicks suggest relaxed state</p>
      </div>
    </Card>
  );
};
