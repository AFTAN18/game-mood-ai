import { AngerParameters, AngerLevel } from './angerScoring';

export enum EmotionType {
  CALM = 'CALM',
  RELAXED = 'RELAXED',
  HAPPY = 'HAPPY',
  EXCITED = 'EXCITED',
  ANXIOUS = 'ANXIOUS',
  FRUSTRATED = 'FRUSTRATED',
  ANGRY = 'ANGRY',
  STRESSED = 'STRESSED'
}

export interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
  factors: {
    voiceTone: number;
    textSentiment: number;
    timeOfDay: number;
    physiological: number | null;
  };
  recommendations: string[];
}

export class EmotionDetectionService {
  private static instance: EmotionDetectionService;
  
  private constructor() {}
  
  public static getInstance(): EmotionDetectionService {
    if (!EmotionDetectionService.instance) {
      EmotionDetectionService.instance = new EmotionDetectionService();
    }
    return EmotionDetectionService.instance;
  }

  /**
   * Detects emotion based on multiple parameters
   */
  public detectEmotion(params: AngerParameters): EmotionResult {
    // Calculate base emotion scores
    const voiceScore = this.analyzeVoiceTone(params.voiceTone);
    const textScore = this.analyzeTextSentiment(params.textSentiment);
    const timeScore = this.analyzeTimeOfDay(params.timeOfDay);
    
    // Calculate overall emotion
    const emotion = this.calculateEmotion({
      voiceScore,
      textScore,
      timeScore,
      physiological: params.physiological
    });

    return emotion;
  }

  private analyzeVoiceTone(voiceTone: number): number {
    // Higher voice tone score indicates more intense emotions
    return voiceTone / 100; // Normalize to 0-1
  }

  private analyzeTextSentiment(sentiment: number): number {
    // Convert sentiment from -1 to 1 to 0-1 range
    return (sentiment + 1) / 2;
  }

  private analyzeTimeOfDay(hour: number): number {
    // Returns a score from 0-1 indicating time-based stress potential
    if (hour >= 22 || hour < 6) return 0.7;  // Late night/early morning - higher stress
    if (hour >= 7 && hour < 9) return 0.6;    // Morning rush
    if (hour >= 17 && hour < 20) return 0.5;  // Evening
    return 0.3;                               // Normal hours
  }

  private calculateEmotion(factors: {
    voiceScore: number;
    textScore: number;
    timeScore: number;
    physiological?: number;
  }): EmotionResult {
    const { voiceScore, textScore, timeScore, physiological } = factors;
    
    // Calculate base emotion based on voice and text
    let emotion: EmotionType;
    let confidence = 0;
    
    // Calculate base emotion from voice and text
    const combinedScore = (voiceScore * 0.6) + (textScore * 0.4);
    
    if (combinedScore > 0.7) {
      emotion = textScore > 0.5 ? EmotionType.EXCITED : EmotionType.ANGRY;
      confidence = 0.8;
    } else if (combinedScore > 0.4) {
      if (textScore > 0.5) {
        emotion = EmotionType.HAPPY;
      } else {
        emotion = voiceScore > 0.5 ? EmotionType.FRUSTRATED : EmotionType.ANXIOUS;
      }
      confidence = 0.7;
    } else if (combinedScore > 0.2) {
      emotion = EmotionType.RELAXED;
      confidence = 0.6;
    } else {
      emotion = EmotionType.CALM;
      confidence = 0.9;
    }

    // Adjust for time of day
    if (timeScore > 0.6 && (emotion === EmotionType.ANXIOUS || emotion === EmotionType.FRUSTRATED)) {
      emotion = EmotionType.STRESSED;
      confidence = Math.min(0.9, confidence + 0.1);
    }

    // Get recommendations based on detected emotion
    const recommendations = this.getRecommendations(emotion);

    return {
      emotion,
      confidence,
      factors: {
        voiceTone: voiceScore,
        textSentiment: textScore,
        timeOfDay: timeScore,
        physiological: physiological || null
      },
      recommendations
    };
  }

  private getRecommendations(emotion: EmotionType): string[] {
    switch (emotion) {
      case EmotionType.CALM:
        return [
          'Try strategy or puzzle games',
          'Explore open-world games with relaxing environments',
          'Consider story-driven games with rich narratives'
        ];
      case EmotionType.RELAXED:
        return [
          'Play casual games',
          'Try creative building games',
          'Explore adventure games with beautiful worlds'
        ];
      case EmotionType.HAPPY:
        return [
          'Play multiplayer games with friends',
          'Try competitive games',
          'Explore new game genres'
        ];
      case EmotionType.EXCITED:
        return [
          'Play action-packed games',
          'Try sports or racing games',
          'Explore fast-paced multiplayer games'
        ];
      case EmotionType.ANXIOUS:
        return [
          'Play relaxing puzzle games',
          'Try calming simulation games',
          'Avoid competitive multiplayer games'
        ];
      case EmotionType.FRUSTRATED:
        return [
          'Take a short break before gaming',
          'Try casual or creative games',
          'Consider single-player story games'
        ];
      case EmotionType.ANGRY:
        return [
          'Take a break and relax',
          'Try meditation or relaxation exercises',
          'Consider non-competitive games when returning'
        ];
      case EmotionType.STRESSED:
        return [
          'Play relaxing games with calming music',
          'Try games with nature or exploration',
          'Consider taking a break before playing'
        ];
      default:
        return [
          'Try a variety of games to see what you enjoy',
          'Explore different game genres',
          'Take breaks and stay hydrated'
        ];
    }
  }

  /**
   * Maps anger level to emotion type
   */
  public mapAngerLevelToEmotion(angerLevel: AngerLevel): EmotionType {
    switch (angerLevel) {
      case AngerLevel.CALM:
        return Math.random() > 0.5 ? EmotionType.CALM : EmotionType.RELAXED;
      case AngerLevel.MILD:
        return Math.random() > 0.5 ? EmotionType.RELAXED : EmotionType.HAPPY;
      case AngerLevel.MODERATE:
        return Math.random() > 0.5 ? EmotionType.ANXIOUS : EmotionType.FRUSTRATED;
      case AngerLevel.HIGH:
        return Math.random() > 0.5 ? EmotionType.FRUSTRATED : EmotionType.ANGRY;
      case AngerLevel.EXTREME:
        return EmotionType.ANGRY;
      default:
        return EmotionType.CALM;
    }
  }
}
