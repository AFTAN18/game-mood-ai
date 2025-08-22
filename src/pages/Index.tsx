import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoodAssessment } from "@/components/MoodAssessment";
import { AdvancedMoodAssessment } from "@/components/AdvancedMoodAssessment";
import { GameCard } from "@/components/GameCard";
import { Gamepad2, Brain, Sparkles, ArrowRight, Zap, Target } from "lucide-react";
import heroImage from "@/assets/hero-gaming-ai.jpg";
import { getGamesByMood, getRandomGames } from '../lib/gameDatabase';

interface MoodState {
  energy: number;
  social: number;
  challenge: number;
  creativity: number;
}

const Index = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [showAdvancedAssessment, setShowAdvancedAssessment] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [userMood, setUserMood] = useState<MoodState | null>(null);
  const [advancedMood, setAdvancedMood] = useState<any>(null);

  // Get game recommendations based on mood or show random games
  const getGameRecommendations = () => {
    if (advancedMood && advancedMood.level) {
      return getGamesByMood(advancedMood.level);
    } else if (userMood) {
      // Simple mood mapping for basic assessment
      const moodMap: { [key: string]: string } = {
        'relaxed': 'CALM',
        'energetic': 'MILD', 
        'focused': 'MODERATE',
        'stressed': 'HIGH',
        'angry': 'EXTREME'
      };
      const mood = Object.keys(moodMap).find(key => userMood[key as keyof MoodState] > 0.5);
      if (mood && moodMap[mood]) {
        return getGamesByMood(moodMap[mood]);
      }
    }
    return getRandomGames(6);
  };

  const gameRecommendations = getGameRecommendations();

  const handleMoodSubmit = (mood: MoodState) => {
    setUserMood(mood);
    setShowRecommendations(true);
    setShowAssessment(false);
  };

  const handleAdvancedMoodSubmit = (advancedMoodData: any) => {
    setAdvancedMood(advancedMoodData);
    setShowRecommendations(true);
    setShowAdvancedAssessment(false);
  };

  const startAssessment = () => {
    setShowAssessment(true);
    setShowRecommendations(false);
    setShowAdvancedAssessment(false);
  };

  const startAdvancedAssessment = () => {
    setShowAdvancedAssessment(true);
    setShowAssessment(false);
    setShowRecommendations(false);
  };

  const resetToHome = () => {
    setShowAssessment(false);
    setShowAdvancedAssessment(false);
    setShowRecommendations(false);
    setUserMood(null);
    setAdvancedMood(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
          {!showAssessment && !showRecommendations ? (
            <>
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Gamepad2 className="w-12 h-12 text-primary" />
                  <Brain className="w-12 h-12 text-secondary" />
                  <Sparkles className="w-12 h-12 text-accent" />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
                  GameMood AI
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Discover your perfect game match based on your current mood. 
                  Our AI analyzes how you're feeling and recommends games that fit your vibe.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={startAssessment}
                  className="bg-gradient-hero text-white font-semibold px-8 py-6 text-lg shadow-glow hover:shadow-neon transition-all duration-300"
                >
                  Quick Assessment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  onClick={startAdvancedAssessment}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-6 text-lg shadow-glow hover:shadow-neon transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Advanced Analysis
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-border/50 bg-background/50 backdrop-blur-sm px-8 py-6 text-lg"
                >
                  How It Works
                </Button>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
                <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-card p-6 text-center">
                  <Brain className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Multi-Parameter Analysis</h3>
                  <p className="text-muted-foreground">Advanced algorithms analyze typing, clicking, and text patterns</p>
                </Card>
                
                <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-card p-6 text-center">
                  <Target className="w-8 h-8 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Precise Mood Detection</h3>
                  <p className="text-muted-foreground">Get accurate emotional state analysis with confidence scoring</p>
                </Card>
                
                <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-card p-6 text-center">
                  <Zap className="w-8 h-8 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Smart Recommendations</h3>
                  <p className="text-muted-foreground">AI-powered game suggestions based on your current emotional state</p>
                </Card>
              </div>
            </>
          ) : showAssessment ? (
            <div className="max-w-2xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={resetToHome}
                className="mb-6 text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
              <MoodAssessment onMoodSubmit={handleMoodSubmit} />
            </div>
          ) : showAdvancedAssessment ? (
            <div className="w-full">
              <Button 
                variant="ghost" 
                onClick={resetToHome}
                className="mb-6 text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
              <AdvancedMoodAssessment onMoodSubmit={handleAdvancedMoodSubmit} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={resetToHome}
                  className="mb-6 text-muted-foreground hover:text-foreground"
                >
                  ← Back to Home
                </Button>
                
                <h2 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
                  Perfect Games For Your Mood
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  {advancedMood 
                    ? `Based on your advanced mood analysis (${advancedMood.level} - Score: ${advancedMood.score}/100), here are games that match your current emotional state`
                    : 'Based on your responses, here are games that match your current vibe'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {gameRecommendations.map((game, index) => (
                  <GameCard key={index} {...game} />
                ))}
              </div>

              <div className="text-center space-y-3">
                <Button 
                  onClick={startAssessment}
                  variant="outline"
                  className="border-border/50 bg-background/50 backdrop-blur-sm mr-3"
                >
                  Retake Quick Assessment
                </Button>
                <Button 
                  onClick={startAdvancedAssessment}
                  variant="outline"
                  className="border-border/50 bg-background/50 backdrop-blur-sm"
                >
                  Try Advanced Analysis
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;