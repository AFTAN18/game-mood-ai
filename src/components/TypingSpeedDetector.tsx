import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, AlertTriangle } from 'lucide-react';

interface TypingMetrics {
  wpm: number;
  accuracy: number;
  variance: number;
  baselineDeviation: number;
}

interface TypingSpeedDetectorProps {
  onMetricsChange: (metrics: TypingMetrics) => void;
  isActive: boolean;
}

export const TypingSpeedDetector: React.FC<TypingSpeedDetectorProps> = ({
  onMetricsChange,
  isActive
}) => {
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<TypingMetrics>({
    wpm: 0,
    accuracy: 100,
    variance: 0,
    baselineDeviation: 0
  });
  
  const [typingHistory, setTypingHistory] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [wordStartTime, setWordStartTime] = useState<number | null>(null);
  
  const baselineWPM = 40; // Standard typing speed
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);

  const calculateWPM = (text: string, timeElapsed: number): number => {
    const words = text.trim().split(/\s+/).length;
    const minutes = timeElapsed / 60000; // Convert ms to minutes
    return minutes > 0 ? Math.round(words / minutes) : 0;
  };

  const calculateAccuracy = (original: string, typed: string): number => {
    if (original.length === 0) return 100;
    
    let errors = 0;
    const minLength = Math.min(original.length, typed.length);
    
    for (let i = 0; i < minLength; i++) {
      if (original[i] !== typed[i]) errors++;
    }
    
    errors += Math.abs(original.length - typed.length);
    return Math.max(0, 100 - (errors / original.length) * 100);
  };

  const calculateVariance = (history: number[]): number => {
    if (history.length < 2) return 0;
    
    const mean = history.reduce((sum, val) => sum + val, 0) / history.length;
    const variance = history.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / history.length;
    return Math.sqrt(variance);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const currentTime = Date.now();
    
    if (!startTime) {
      setStartTime(currentTime);
    }

    // Track word-by-word timing
    if (newText.endsWith(' ') && currentWord) {
      if (wordStartTime) {
        const wordTime = currentTime - wordStartTime;
        const wordWPM = 60000 / wordTime; // Convert to WPM
        
        setTypingHistory(prev => [...prev, wordWPM]);
        setCurrentWord('');
        setWordStartTime(null);
      }
    } else if (newText.length > text.length) {
      // New character typed
      if (!wordStartTime) {
        setWordStartTime(currentTime);
      }
      setCurrentWord(newText.slice(text.length));
    }

    setText(newText);

    // Calculate real-time metrics
    if (startTime) {
      const timeElapsed = currentTime - startTime;
      const wpm = calculateWPM(newText, timeElapsed);
      const accuracy = calculateAccuracy('The quick brown fox jumps over the lazy dog', newText);
      const variance = calculateVariance(typingHistory);
      const baselineDeviation = Math.abs(wpm - baselineWPM);

      const newMetrics = { wpm, accuracy, variance, baselineDeviation };
      setMetrics(newMetrics);
      onMetricsChange(newMetrics);
    }
  };

  const resetDetector = () => {
    setText('');
    setStartTime(null);
    setMetrics({ wpm: 0, accuracy: 100, variance: 0, baselineDeviation: 0 });
    setTypingHistory([]);
    setCurrentWord('');
    setWordStartTime(null);
  };

  const getAngerIndicator = (): { level: string; color: string; icon: React.ReactNode } => {
    const { wpm, variance, baselineDeviation } = metrics;
    
    if (wpm > 80 || variance > 30 || baselineDeviation > 40) {
      return { level: 'High Stress', color: 'text-red-500', icon: <AlertTriangle className="w-4 h-4" /> };
    } else if (wpm > 60 || variance > 20 || baselineDeviation > 25) {
      return { level: 'Moderate Stress', color: 'text-yellow-500', icon: <Zap className="w-4 h-4" /> };
    } else {
      return { level: 'Calm', color: 'text-green-500', icon: <Clock className="w-4 h-4" /> };
    }
  };

  const angerIndicator = getAngerIndicator();

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Typing Speed Analysis</h3>
        <Badge variant="outline" className={angerIndicator.color}>
          {angerIndicator.icon}
          <span className="ml-2">{angerIndicator.level}</span>
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Current WPM:</span>
          <span className="text-2xl font-bold">{metrics.wpm}</span>
          <span className="text-sm text-muted-foreground">/ {baselineWPM} baseline</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Baseline Deviation</span>
            <span>{metrics.baselineDeviation.toFixed(1)}</span>
          </div>
          <Progress value={Math.min(100, (metrics.baselineDeviation / 50) * 100)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Typing Variance</span>
            <span>{metrics.variance.toFixed(1)}</span>
          </div>
          <Progress value={Math.min(100, (metrics.variance / 40) * 100)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Accuracy</span>
            <span>{metrics.accuracy.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.accuracy} />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Type the sample text below:</label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="The quick brown fox jumps over the lazy dog"
          className="w-full h-24 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={!isActive}
        />
        
        <div className="text-xs text-muted-foreground">
          Sample text: "The quick brown fox jumps over the lazy dog"
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {startTime && (
            <span>Time elapsed: {Math.round((Date.now() - startTime) / 1000)}s</span>
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
        <p>• Higher WPM than baseline may indicate stress or urgency</p>
        <p>• High variance suggests inconsistent emotional state</p>
        <p>• Lower accuracy often correlates with frustration</p>
      </div>
    </Card>
  );
};
