import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TypingSpeedDetector } from './TypingSpeedDetector';
import { ClickIntensityDetector } from './ClickIntensityDetector';
import { TextSentimentAnalyzer } from './TextSentimentAnalyzer';
import { AngerDetectionEngine, AngerParameters, AngerScore, AngerLevel } from '@/lib/angerScoring';
import { Brain, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AdvancedMoodAssessmentProps {
  onMoodSubmit: (angerScore: AngerScore) => void;
}

interface DetectorMetrics {
  typing: {
    wpm: number;
    accuracy: number;
    variance: number;
    baselineDeviation: number;
  } | null;
  clicking: {
    intensity: number;
    frequency: number;
    pattern: 'normal' | 'aggressive' | 'erratic' | 'calm';
    totalClicks: number;
    averageIntensity: number;
  } | null;
  sentiment: {
    score: number;
    confidence: number;
    angerLevel: 'low' | 'medium' | 'high';
    keywords: string[];
    analysis: string;
  } | null;
}

export const AdvancedMoodAssessment: React.FC<AdvancedMoodAssessmentProps> = ({
  onMoodSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [metrics, setMetrics] = useState<DetectorMetrics>({
    typing: null,
    clicking: null,
    sentiment: null
  });
  
  const [angerScore, setAngerScore] = useState<AngerScore | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDetector, setActiveDetector] = useState<'typing' | 'clicking' | 'sentiment' | null>(null);

  const angerEngine = new AngerDetectionEngine();

  const totalSteps = 4;

  useEffect(() => {
    // Set active detector based on current step
    switch (currentStep) {
      case 1:
        setActiveDetector('typing');
        break;
      case 2:
        setActiveDetector('clicking');
        break;
      case 3:
        setActiveDetector('sentiment');
        break;
      default:
        setActiveDetector(null);
    }
  }, [currentStep]);

  const handleTypingMetrics = (typingMetrics: any) => {
    setMetrics(prev => ({
      ...prev,
      typing: typingMetrics
    }));
  };

  const handleClickMetrics = (clickMetrics: any) => {
    setMetrics(prev => ({
      ...prev,
      clicking: clickMetrics
    }));
  };

  const handleSentimentMetrics = (sentimentMetrics: any) => {
    setMetrics(prev => ({
      ...prev,
      sentiment: sentimentMetrics
    }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return metrics.typing !== null && metrics.typing.wpm > 0;
      case 2:
        return metrics.clicking !== null && metrics.clicking.totalClicks > 0;
      case 3:
        return metrics.sentiment !== null && metrics.sentiment.confidence > 0.1;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateAngerScore = async () => {
    if (!metrics.typing || !metrics.clicking || !metrics.sentiment) {
      return;
    }

    setIsProcessing(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Convert metrics to AngerParameters
    const parameters: AngerParameters = {
      textSentiment: metrics.sentiment.score,
      voiceTone: 0, // Not implemented in this version
      typingSpeed: metrics.typing.wpm,
      clickIntensity: metrics.clicking.averageIntensity,
      recentGameHistory: 0, // Would come from user's game history
      timeOfDay: new Date().getHours(),
      physiological: undefined // Optional
    };

    const score = angerEngine.calculateAngerScore(parameters);
    setAngerScore(score);
    setIsProcessing(false);
  };

  const handleSubmit = () => {
    if (angerScore) {
      onMoodSubmit(angerScore);
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Typing Speed Analysis';
      case 2: return 'Click Intensity Detection';
      case 3: return 'Text Sentiment Analysis';
      case 4: return 'Results & Recommendations';
      default: return '';
    }
  };

  const getStepDescription = (step: number): string => {
    switch (step) {
      case 1: return 'Type the sample text to analyze your typing patterns and stress levels';
      case 2: return 'Click in the designated area to measure your click intensity and frequency';
      case 3: return 'Describe how you\'re feeling to analyze your emotional state';
      case 4: return 'Review your comprehensive mood analysis and get personalized game recommendations';
      default: return '';
    }
  };

  const getAngerLevelColor = (level: AngerLevel): string => {
    switch (level) {
      case AngerLevel.CALM: return 'text-green-500';
      case AngerLevel.MILD: return 'text-blue-500';
      case AngerLevel.MODERATE: return 'text-yellow-500';
      case AngerLevel.HIGH: return 'text-orange-500';
      case AngerLevel.EXTREME: return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getAngerLevelIcon = (level: AngerLevel) => {
    switch (level) {
      case AngerLevel.CALM: return <CheckCircle className="w-5 h-5" />;
      case AngerLevel.MILD: return <Brain className="w-5 h-5" />;
      case AngerLevel.MODERATE: return <Zap className="w-5 h-5" />;
      case AngerLevel.HIGH: return <AlertTriangle className="w-5 h-5" />;
      case AngerLevel.EXTREME: return <AlertTriangle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Advanced Mood Assessment</h2>
        <p className="text-muted-foreground">
          Multi-parameter analysis for accurate emotional state detection
        </p>
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Step Title */}
        <div>
          <h3 className="text-xl font-semibold">{getStepTitle(currentStep)}</h3>
          <p className="text-muted-foreground">{getStepDescription(currentStep)}</p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="p-6">
        {currentStep === 1 && (
          <TypingSpeedDetector
            onMetricsChange={handleTypingMetrics}
            isActive={activeDetector === 'typing'}
          />
        )}

        {currentStep === 2 && (
          <ClickIntensityDetector
            onMetricsChange={handleClickMetrics}
            isActive={activeDetector === 'clicking'}
          />
        )}

        {currentStep === 3 && (
          <TextSentimentAnalyzer
            onSentimentChange={handleSentimentMetrics}
            isActive={activeDetector === 'sentiment'}
          />
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            {!angerScore ? (
              <div className="text-center space-y-4">
                <Clock className="w-16 h-16 mx-auto text-muted-foreground animate-pulse" />
                <h3 className="text-xl font-semibold">Processing Your Data</h3>
                <p className="text-muted-foreground">
                  Analyzing your multi-parameter inputs to calculate your emotional state...
                </p>
                <Button 
                  onClick={calculateAngerScore}
                  disabled={isProcessing}
                  className="w-full max-w-xs"
                >
                  {isProcessing ? 'Processing...' : 'Calculate Results'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className={`mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center ${getAngerLevelColor(angerScore.level)}`}>
                    {getAngerLevelIcon(angerScore.level)}
                  </div>
                  <h3 className="text-2xl font-bold">Mood Analysis Complete</h3>
                  <Badge variant="outline" className={`text-lg px-4 py-2 ${getAngerLevelColor(angerScore.level)}`}>
                    {angerScore.level} - Score: {angerScore.score}/100
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Analysis Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Confidence Level:</span>
                        <span>{(angerScore.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analysis Time:</span>
                        <span>{angerScore.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Recommended Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {angerEngine.getRecommendedCategories(angerScore.level).map((category, index) => (
                        <Badge key={index} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleSubmit}
                    size="lg"
                    className="px-8"
                  >
                    Get Game Recommendations
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Next
          </Button>
        ) : currentStep === totalSteps - 1 && angerScore ? (
          <Button
            onClick={handleSubmit}
            size="lg"
          >
            Get Recommendations
          </Button>
        ) : null}
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i + 1 === currentStep 
                ? 'bg-primary' 
                : i + 1 < currentStep 
                  ? 'bg-primary/50' 
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
