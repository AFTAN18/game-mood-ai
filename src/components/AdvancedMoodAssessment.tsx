import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TypingSpeedDetector } from './TypingSpeedDetector';
import { ClickIntensityDetector } from './ClickIntensityDetector';
import { TextSentimentAnalyzer } from './TextSentimentAnalyzer';
import { VoiceToneAnalyzer } from './VoiceToneAnalyzer';
import { AngerDetectionEngine, AngerParameters, AngerScore, AngerLevel } from '@/lib/angerScoring';
import { EmotionDetectionService, EmotionType } from '@/lib/EmotionDetectionService';
import { Brain, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

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
  voiceTone: {
    score: number;
    volume: number;
    pitch: number;
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
    sentiment: null,
    voiceTone: null
  });
  
  const [angerScore, setAngerScore] = useState<AngerScore | null>(null);
  const [emotionResult, setEmotionResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const emotionService = EmotionDetectionService.getInstance();
  const [activeDetector, setActiveDetector] = useState<'typing' | 'clicking' | 'sentiment' | 'voiceTone' | null>(null);
  const navigate = useNavigate();

  const angerEngine = new AngerDetectionEngine();

  const totalSteps = 5;

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
      case 4:
        setActiveDetector('voiceTone');
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

  const handleVoiceToneMetrics = (toneScore: number) => {
    setMetrics(prev => ({
      ...prev,
      voiceTone: {
        score: toneScore,
        volume: 0, // These will be updated in the VoiceToneAnalyzer component
        pitch: 0,
        analysis: ''
      }
    }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return metrics.typing !== null && metrics.typing.wpm > 0;
      case 2:
        return metrics.clicking !== null && metrics.clicking.totalClicks > 0;
      case 3:
        return metrics.sentiment !== null;
      case 4:
        return metrics.voiceTone !== null && metrics.voiceTone.score > 0;
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
    if (!metrics.typing || !metrics.clicking || !metrics.sentiment || !metrics.voiceTone) {
      return;
    }

    setIsProcessing(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Convert metrics to AngerParameters
    const parameters: AngerParameters = {
      textSentiment: metrics.sentiment.score,
      voiceTone: metrics.voiceTone.score, // Now using voice tone analysis
      typingSpeed: metrics.typing.wpm,
      clickIntensity: metrics.clicking.averageIntensity,
      recentGameHistory: 0, // Would come from user's game history
      timeOfDay: new Date().getHours(),
      physiological: undefined // Optional
    };

    const score = angerEngine.calculateAngerScore(parameters);
    setAngerScore(score);
    
    // Get emotion analysis
    const emotionAnalysis = emotionService.detectEmotion(parameters);
    setEmotionResult(emotionAnalysis);
    
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
      case 4: return 'Voice Tone Analysis';
      case 5: return 'Results & Recommendations';
      default: return '';
    }
  };

  const getStepDescription = (step: number): string => {
    switch (step) {
      case 1: return 'Type the sample text to analyze your typing patterns and stress levels';
      case 2: return 'Click in the designated area to measure your click intensity and frequency';
      case 3: return 'Describe how you\'re feeling to analyze your emotional state';
      case 4: return 'Speak into your microphone to analyze your voice tone and stress levels';
      case 5: return 'Review your comprehensive mood analysis and get personalized game recommendations';
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

  const getEmotionColor = (emotion: EmotionType): string => {
    switch (emotion) {
      case EmotionType.CALM:
      case EmotionType.RELAXED:
        return 'text-green-500';
      case EmotionType.HAPPY:
      case EmotionType.EXCITED:
        return 'text-blue-500';
      case EmotionType.ANXIOUS:
      case EmotionType.STRESSED:
        return 'text-yellow-500';
      case EmotionType.FRUSTRATED:
        return 'text-orange-500';
      case EmotionType.ANGRY:
        return 'text-red-500';
      default:
        return 'text-gray-500';
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

  // Game recommendations mapped to emotion types
  const getRecommendedGames = (emotionType?: string) => {
    const allGames = {
      CALM: [
        {
          title: 'Stardew Valley',
          category: 'Farming Simulator',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg',
          description: 'A relaxing farming simulation where you can build your dream farm at your own pace.'
        },
        {
          title: 'Animal Crossing: New Horizons',
          category: 'Life Simulation',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg',
          description: 'Create your perfect island getaway in this peaceful life simulation game.'
        },
        {
          title: 'The Witness',
          category: 'Puzzle',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/210970/header.jpg',
          description: 'A relaxing yet challenging puzzle game set on a beautiful, mysterious island.'
        }
      ],
      RELAXED: [
        {
          title: 'Journey',
          category: 'Adventure',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/638230/header.jpg',
          description: 'An emotional adventure through vast landscapes, exploring at your own pace.'
        },
        {
          title: 'Abzû',
          category: 'Adventure',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/384190/header.jpg',
          description: 'Dive into a vibrant ocean world full of mystery and beauty.'
        },
        {
          title: 'A Short Hike',
          category: 'Adventure',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/1055540/header.jpg',
          description: 'A peaceful exploration game about hiking up a mountain.'
        }
      ],
      HAPPY: [
        {
          title: 'Overcooked 2',
          category: 'Party',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/728880/header.jpg',
          description: 'Chaotic cooking fun with friends in this cooperative party game.'
        },
        {
          title: 'Fall Guys',
          category: 'Battle Royale',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/1097150/header.jpg',
          description: 'A colorful, chaotic battle royale game with mini-games and obstacles.'
        },
        {
          title: 'Stardew Valley',
          category: 'Farming Simulator',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg',
          description: 'Build your dream farm and community in this charming simulation.'
        }
      ],
      EXCITED: [
        {
          title: 'Rocket League',
          category: 'Sports',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg',
          description: 'Soccer with rocket-powered cars in this high-octane sports game.'
        },
        {
          title: 'DOOM Eternal',
          category: 'FPS',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/782330/header.jpg',
          description: 'Fast-paced, intense first-person shooter action.'
        },
        {
          title: 'Hades',
          category: 'Roguelike',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg',
          description: 'A god-like rogue-like dungeon crawler with fast-paced action.'
        }
      ],
      ANXIOUS: [
        {
          title: 'Unpacking',
          category: 'Puzzle',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/1135690/header.jpg',
          description: 'A zen puzzle game about unpacking belongings and organizing a new home.'
        },
        {
          title: 'Donut County',
          category: 'Puzzle',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/702670/header.jpg',
          description: 'A whimsical physics-based puzzle game with simple, satisfying gameplay.'
        },
        {
          title: 'Gris',
          category: 'Platformer',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/683320/header.jpg',
          description: 'A serene and evocative experience, free of danger and frustration.'
        }
      ],
      FRUSTRATED: [
        {
          title: 'Slime Rancher',
          category: 'Simulation',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/433340/header.jpg',
          description: 'A relaxing, colorful farming sim about wrangling slimes.'
        },
        {
          title: 'Stardew Valley',
          category: 'Farming Simulator',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg',
          description: 'A peaceful farming game that lets you escape and build at your own pace.'
        },
        {
          title: 'Spiritfarer',
          category: 'Management Sim',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/972660/header.jpg',
          description: 'A cozy management game about dying, with beautiful art and music.'
        }
      ],
      ANGRY: [
        {
          title: 'DOOM (2016)',
          category: 'FPS',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/379720/header.jpg',
          description: 'Rip and tear through demons in this cathartic first-person shooter.'
        },
        {
          title: 'Hotline Miami',
          category: 'Action',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/219150/header.jpg',
          description: 'A high-octane action game with fast-paced, satisfying combat.'
        },
        {
          title: 'Katana ZERO',
          category: 'Action',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/460950/header.jpg',
          description: 'A stylish neo-noir action-platformer with fast, brutal combat.'
        }
      ],
      STRESSED: [
        {
          title: 'A Short Hike',
          category: 'Adventure',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/1055540/header.jpg',
          description: 'A peaceful exploration game about hiking up a mountain.'
        },
        {
          title: 'Flower',
          category: 'Adventure',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/966330/header.jpg',
          description: 'A peaceful game about the beauty of nature and the environment.'
        },
        {
          title: 'ABZÛ',
          category: 'Adventure',
          image: 'https://cdn.akamai.steamstatic.com/steam/apps/384190/header.jpg',
          description: 'A beautiful underwater adventure that evokes the dream of diving.'
        }
      ]
    };

    // Return games for the detected emotion, or a default set if not found
    return emotionType && allGames[emotionType as keyof typeof allGames] 
      ? allGames[emotionType as keyof typeof allGames] 
      : [
          {
            title: 'Stardew Valley',
            category: 'Farming Simulator',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg',
            description: 'A relaxing farming simulation where you can build your dream farm at your own pace.'
          },
          {
            title: 'Journey',
            category: 'Adventure',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/638230/header.jpg',
            description: 'An emotional adventure through vast landscapes, exploring at your own pace.'
          },
          {
            title: 'A Short Hike',
            category: 'Adventure',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/1055540/header.jpg',
            description: 'A peaceful exploration game about hiking up a mountain.'
          }
        ];
  };
  
  // Get games based on current emotion
  const gameRecommendations = getRecommendedGames(emotionResult?.emotion);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 relative">
      {/* Home Button */}
      <Button 
        variant="ghost" 
        className="absolute left-4 top-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </Button>
      
      {/* Progress Header */}
      <div className="text-center space-y-4 pt-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Mood Assessment</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Multi-parameter analysis for accurate emotional state detection
        </p>
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-semibold">Step {currentStep} of {totalSteps}</span>
            <span className="font-semibold">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Title */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{getStepTitle(currentStep)}</h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg">{getStepDescription(currentStep)}</p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
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
          <VoiceToneAnalyzer
            onToneDetected={handleVoiceToneMetrics}
            isActive={activeDetector === 'voiceTone'}
          />
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            {!angerScore ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Estimated time: 5-7 minutes</span>
                  disabled={isProcessing}
                  className="w-full max-w-xs"
                >
                  {isProcessing ? 'Processing...' : 'Calculate Results'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-6">
                  <div className={`mx-auto w-24 h-24 rounded-full bg-opacity-20 ${getAngerLevelColor(angerScore.level).replace('text-', 'bg-')} flex items-center justify-center shadow-lg`}>
                    <div className={`${getAngerLevelColor(angerScore.level)} text-4xl`}>
                      {getAngerLevelIcon(angerScore.level)}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Mood Analysis Complete</h3>
                  <Badge 
                    variant="outline" 
                    className={`text-xl px-6 py-2.5 border-2 font-bold ${getAngerLevelColor(angerScore.level)}`}
                  >
                    {angerScore.level} - {angerScore.score}/100
                  </Badge>
                </div>

                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Analysis Details</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Confidence Level:</span>
                          <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                            {(angerScore.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">Analysis Time:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {angerScore.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detected Emotion</h4>
                      <div className="flex flex-col space-y-2">
                        <div className={`text-3xl font-extrabold ${getEmotionColor(emotionResult?.emotion)}`}>
                          {emotionResult?.emotion || 'Analyzing...'}
                        </div>
                        {emotionResult && (
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Confidence: <span className="font-bold text-blue-600 dark:text-blue-400">
                              {(emotionResult.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">Recommended Games</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gameRecommendations.map((game, index) => (
                        <div 
                          key={index} 
                          className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <img 
                              src={game.image} 
                              alt={game.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                              <h5 className="text-white font-bold text-lg">{game.title}</h5>
                              <span className="text-sm text-gray-300">{game.category}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {game.description}
                            </p>
                            <div className="mt-3 flex justify-between items-center">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                                {game.category}
                              </span>
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => console.log(`Viewing ${game.title}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">More Recommendations</h5>
                      <div className="space-y-3">
                        {emotionResult?.recommendations?.map((rec: string, index: number) => (
                          <div key={`text-${index}`} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex-shrink-0">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <span className="ml-3 text-gray-800 dark:text-gray-200">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommended Categories</h4>
                    <div className="flex flex-wrap gap-3">
                      {angerEngine.getRecommendedCategories(angerScore.level).map((category, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
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
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-2 text-base font-medium bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Previous
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="px-8 py-2.5 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </Button>
        ) : currentStep === totalSteps - 1 ? (
          <Button
            onClick={calculateAngerScore}
            disabled={!canProceed() || isProcessing}
            className="px-8 py-2.5 text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Get Results'}
          </Button>
        ) : null}
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center space-x-3 mt-6">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i + 1 === currentStep 
                ? 'bg-blue-600 w-8 scale-110' 
                : i + 1 < currentStep 
                  ? 'bg-green-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
            }`}
            title={`Step ${i + 1}: ${getStepTitle(i + 1)}`}
          />
        ))}
      </div>
    </div>
  );
};
