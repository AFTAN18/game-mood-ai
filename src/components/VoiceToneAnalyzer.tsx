import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceToneAnalyzerProps {
  onToneDetected: (tone: number) => void;
  isActive: boolean;
}

export const VoiceToneAnalyzer: React.FC<VoiceToneAnalyzerProps> = ({ 
  onToneDetected, 
  isActive 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [analysis, setAnalysis] = useState<string>('Speak to analyze your voice tone');
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>(0);
  const silenceStartTimeRef = useRef<number>(0);
  const isSilentRef = useRef<boolean>(true);

  // Request microphone access
  const requestMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setPermissionGranted(true);
      setupAudioContext(stream);
      return true;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setAnalysis('Microphone access denied. Please allow microphone access to use this feature.');
      return false;
    }
  };

  // Set up audio context and analyzer
  const setupAudioContext = (stream: MediaStream) => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    source.connect(analyser);
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
  };

  // Analyze audio data
  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    
    // Get frequency data
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avgVolume = sum / dataArray.length;
    
    // Simple pitch detection (find dominant frequency)
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    
    // Convert to pitch in Hz
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const pitchHz = (maxIndex * sampleRate) / (2 * analyser.fftSize);
    
    // Update state
    setVolume(avgVolume);
    setPitch(pitchHz);
    
    // Detect silence
    const isSilent = avgVolume < 5;
    const now = Date.now();
    
    if (isSilent && !isSilentRef.current) {
      silenceStartTimeRef.current = now;
    } else if (!isSilent && isSilentRef.current) {
      // Reset silence timer when sound is detected
      silenceStartTimeRef.current = 0;
    }
    
    isSilentRef.current = isSilent;
    
    // Analyze tone based on volume and pitch
    let toneScore = 0;
    let toneAnalysis = '';
    
    if (!isSilent) {
      // Normalize pitch (typical speaking range: 85-255 Hz)
      const normalizedPitch = Math.max(0, Math.min(255, pitchHz));
      
      // Higher pitch and volume can indicate stress/anger
      const pitchFactor = (normalizedPitch - 85) / (255 - 85); // 0-1 range
      const volumeFactor = Math.min(1, avgVolume / 100);
      
      // Combine factors (weighted)
      toneScore = Math.min(100, (pitchFactor * 0.7 + volumeFactor * 0.3) * 100);
      
      // Simple analysis
      if (toneScore > 80) {
        toneAnalysis = 'High stress/anger detected';
      } else if (toneScore > 60) {
        toneAnalysis = 'Elevated stress levels';
      } else if (toneScore > 40) {
        toneAnalysis = 'Neutral tone';
      } else if (toneScore > 20) {
        toneAnalysis = 'Calm tone';
      } else {
        toneAnalysis = 'Very calm/quiet tone';
      }
      
      setAnalysis(toneAnalysis);
      onToneDetected(toneScore);
    }
    
    // Continue analysis if still active
    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  };

  // Start/stop recording
  const toggleRecording = async () => {
    if (!permissionGranted) {
      const granted = await requestMicrophone();
      if (!granted) return;
    }
    
    if (!isRecording) {
      setIsRecording(true);
      silenceStartTimeRef.current = 0;
      isSilentRef.current = true;
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    } else {
      setIsRecording(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Voice Tone Analysis</h3>
        <div className="flex items-center space-x-2">
          {isRecording ? (
            <div className="flex items-center text-red-500">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
              <span>Analyzing</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Ready</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <Button
            onClick={toggleRecording}
            variant={isRecording ? 'destructive' : 'default'}
            size="lg"
            className="w-32 h-32 rounded-full"
            disabled={!isActive}
          >
            {isRecording ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {volume > 5 ? (
                <Volume2 className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground mr-2" />
              )}
              <span>Volume</span>
            </div>
            <span className="font-mono">{Math.round(volume)}%</span>
          </div>
          <Progress value={volume} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Pitch</span>
            <span className="font-mono">{Math.round(pitch)} Hz</span>
          </div>
          <Progress value={Math.min(100, pitch / 5)} className="h-2" />
        </div>

        <div className="pt-4">
          <div className="text-sm text-muted-foreground">Analysis</div>
          <div className="mt-1 p-3 bg-muted/50 rounded-md min-h-12 flex items-center">
            {analysis}
          </div>
        </div>
      </div>
    </Card>
  );
};
