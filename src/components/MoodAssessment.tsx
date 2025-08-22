import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface MoodState {
  energy: number;
  social: number;
  challenge: number;
  creativity: number;
}

interface MoodAssessmentProps {
  onMoodSubmit: (mood: MoodState) => void;
}

export const MoodAssessment = ({ onMoodSubmit }: MoodAssessmentProps) => {
  const [mood, setMood] = useState<MoodState>({
    energy: 50,
    social: 50,
    challenge: 50,
    creativity: 50,
  });

  const moodQuestions = [
    {
      key: "energy" as keyof MoodState,
      label: "Energy Level",
      description: "How energetic are you feeling?",
      lowLabel: "Chill & Relaxed",
      highLabel: "Pumped & Active"
    },
    {
      key: "social" as keyof MoodState,
      label: "Social Mood", 
      description: "Do you want to play with others?",
      lowLabel: "Solo Gaming",
      highLabel: "Social & Multiplayer"
    },
    {
      key: "challenge" as keyof MoodState,
      label: "Challenge Desire",
      description: "How much of a challenge do you want?", 
      lowLabel: "Easy & Casual",
      highLabel: "Intense & Competitive"
    },
    {
      key: "creativity" as keyof MoodState,
      label: "Creative Expression",
      description: "Do you want to build or create?",
      lowLabel: "Follow Story",
      highLabel: "Create & Build"
    }
  ];

  const handleSliderChange = (key: keyof MoodState, value: number[]) => {
    setMood(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleSubmit = () => {
    onMoodSubmit(mood);
  };

  return (
    <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-card p-8">
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
            How are you feeling today?
          </h3>
          <p className="text-muted-foreground">
            Let's understand your mood to find the perfect games for you
          </p>
        </div>

        <div className="space-y-6">
          {moodQuestions.map((question) => (
            <div key={question.key} className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground">{question.label}</h4>
                <p className="text-sm text-muted-foreground">{question.description}</p>
              </div>
              
              <div className="px-3">
                <Slider
                  value={[mood[question.key]]}
                  onValueChange={(value) => handleSliderChange(question.key, value)}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{question.lowLabel}</span>
                  <span>{question.highLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full bg-gradient-hero text-white font-semibold py-6 text-lg shadow-glow hover:shadow-neon transition-all duration-300"
          size="lg"
        >
          Get My Game Recommendations
        </Button>
      </div>
    </Card>
  );
};