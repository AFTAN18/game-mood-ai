import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentMetrics {
  score: number;           // -1 to 1 (negative to positive)
  confidence: number;      // 0 to 1
  angerLevel: 'low' | 'medium' | 'high';
  keywords: string[];
  analysis: string;
}

interface TextSentimentAnalyzerProps {
  onSentimentChange: (sentiment: SentimentMetrics) => void;
  isActive: boolean;
}

export const TextSentimentAnalyzer: React.FC<TextSentimentAnalyzerProps> = ({
  onSentimentChange,
  isActive
}) => {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState<SentimentMetrics>({
    score: 0,
    confidence: 0,
    angerLevel: 'low',
    keywords: [],
    analysis: ''
  });

  // Anger-related keywords and their weights
  const angerKeywords = {
    high: [
      'furious', 'rage', 'hate', 'destroy', 'kill', 'angry', 'mad', 'fuck', 'shit',
      'terrible', 'awful', 'horrible', 'disgusting', 'stupid', 'idiot', 'moron'
    ],
    medium: [
      'frustrated', 'annoyed', 'irritated', 'upset', 'disappointed', 'worried',
      'stressed', 'tired', 'bored', 'confused', 'nervous', 'anxious'
    ],
    low: [
      'slightly', 'a bit', 'kind of', 'maybe', 'perhaps', 'possibly'
    ]
  };

  // Positive keywords and their weights
  const positiveKeywords = [
    'love', 'great', 'amazing', 'wonderful', 'fantastic', 'excellent', 'perfect',
    'happy', 'joy', 'pleasure', 'enjoy', 'fun', 'exciting', 'beautiful', 'nice'
  ];

  const analyzeSentiment = (inputText: string): SentimentMetrics => {
    if (!inputText.trim()) {
      return {
        score: 0,
        confidence: 0,
        angerLevel: 'low',
        keywords: [],
        analysis: 'No text to analyze'
      };
    }

    const words = inputText.toLowerCase().split(/\s+/);
    let angerScore = 0;
    let positiveScore = 0;
    let detectedKeywords: string[] = [];
    let totalWords = words.length;

    // Analyze each word
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      
      // Check for anger keywords
      if (angerKeywords.high.includes(cleanWord)) {
        angerScore += 3;
        detectedKeywords.push(cleanWord);
      } else if (angerKeywords.medium.includes(cleanWord)) {
        angerScore += 2;
        detectedKeywords.push(cleanWord);
      } else if (angerKeywords.low.includes(cleanWord)) {
        angerScore += 1;
        detectedKeywords.push(cleanWord);
      }

      // Check for positive keywords
      if (positiveKeywords.includes(cleanWord)) {
        positiveScore += 2;
        detectedKeywords.push(cleanWord);
      }
    });

    // Calculate final sentiment score (-1 to 1)
    let finalScore = 0;
    if (totalWords > 0) {
      // Normalize scores
      const normalizedAnger = Math.min(1, angerScore / (totalWords * 0.3));
      const normalizedPositive = Math.min(1, positiveScore / (totalWords * 0.2));
      
      // Final score: positive - anger
      finalScore = Math.max(-1, Math.min(1, normalizedPositive - normalizedAnger));
    }

    // Determine anger level
    let angerLevel: 'low' | 'medium' | 'high' = 'low';
    if (angerScore > totalWords * 0.2) {
      angerLevel = 'high';
    } else if (angerScore > totalWords * 0.1) {
      angerLevel = 'medium';
    }

    // Calculate confidence based on text length and keyword density
    const keywordDensity = detectedKeywords.length / totalWords;
    const confidence = Math.min(1, Math.max(0.1, 
      Math.min(0.8, totalWords / 20) + Math.min(0.2, keywordDensity * 2)
    ));

    // Generate analysis text
    let analysis = '';
    if (finalScore > 0.5) {
      analysis = 'Very positive sentiment detected';
    } else if (finalScore > 0.2) {
      analysis = 'Positive sentiment detected';
    } else if (finalScore > -0.2) {
      analysis = 'Neutral sentiment detected';
    } else if (finalScore > -0.5) {
      analysis = 'Negative sentiment detected';
    } else {
      analysis = 'Very negative sentiment detected';
    }

    if (angerLevel !== 'low') {
      analysis += ` with ${angerLevel} anger indicators`;
    }

    return {
      score: Math.round(finalScore * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      angerLevel,
      keywords: [...new Set(detectedKeywords)], // Remove duplicates
      analysis
    };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    if (isActive) {
      const newSentiment = analyzeSentiment(newText);
      setSentiment(newSentiment);
      onSentimentChange(newSentiment);
    }
  };

  const getSentimentIndicator = (): { level: string; color: string; icon: React.ReactNode } => {
    if (sentiment.score > 0.3) {
      return { level: 'Positive', color: 'text-green-500', icon: <TrendingUp className="w-4 h-4" /> };
    } else if (sentiment.score < -0.3) {
      return { level: 'Negative', color: 'text-red-500', icon: <TrendingDown className="w-4 h-4" /> };
    } else {
      return { level: 'Neutral', color: 'text-blue-500', icon: <Minus className="w-4 h-4" /> };
    }
  };

  const getAngerBadgeColor = (): string => {
    switch (sentiment.angerLevel) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sentimentIndicator = getSentimentIndicator();

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Text Sentiment Analysis</h3>
        <Badge variant="outline" className={sentimentIndicator.color}>
          {sentimentIndicator.icon}
          <span className="ml-2">{sentimentIndicator.level}</span>
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{sentiment.score.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Sentiment Score</div>
            <div className="text-xs text-muted-foreground">-1 to +1</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{(sentiment.confidence * 100).toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Confidence</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sentiment Range</span>
            <span>{sentiment.score.toFixed(2)}</span>
          </div>
          <Progress 
            value={((sentiment.score + 1) / 2) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-1 (Negative)</span>
            <span>0 (Neutral)</span>
            <span>+1 (Positive)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analysis Confidence</span>
            <span>{(sentiment.confidence * 100).toFixed(0)}%</span>
          </div>
          <Progress value={sentiment.confidence * 100} className="h-2" />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Anger Level:</span>
          <Badge className={getAngerBadgeColor()}>
            {sentiment.angerLevel.charAt(0).toUpperCase() + sentiment.angerLevel.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Enter text to analyze:</label>
        <Textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Type or paste text here to analyze sentiment..."
          className="min-h-[100px] resize-none"
          disabled={!isActive}
        />
        
        <div className="text-xs text-muted-foreground">
          Try phrases like: "I'm feeling great today!" or "This is so frustrating and annoying"
        </div>
      </div>

      {sentiment.keywords.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Detected Keywords:</h4>
          <div className="flex flex-wrap gap-2">
            {sentiment.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {sentiment.analysis && (
        <div className="p-3 bg-muted rounded-md">
          <h4 className="text-sm font-medium mb-1">Analysis:</h4>
          <p className="text-sm text-muted-foreground">{sentiment.analysis}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {text.length > 0 && (
            <span>{text.split(/\s+/).length} words analyzed</span>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setText('');
            setSentiment({
              score: 0,
              confidence: 0,
              angerLevel: 'low',
              keywords: [],
              analysis: ''
            });
          }}
        >
          Clear
        </Button>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Negative sentiment may indicate stress or frustration</p>
        <p>• Anger keywords suggest emotional distress</p>
        <p>• Longer text provides more accurate analysis</p>
        <p>• Confidence increases with text length and keyword presence</p>
      </div>
    </Card>
  );
};
