export interface AngerParameters {
  textSentiment: number;      // -1 to 1 (negative to positive)
  voiceTone: number;          // 0-100 Hz variance
  typingSpeed: number;        // WPM deviation from baseline
  clickIntensity: number;     // Force units
  recentGameHistory: number;  // Rage quit frequency
  timeOfDay: number;          // Fatigue factor
  physiological?: number;      // Heart rate variance (optional)
}

export interface AngerScore {
  score: number;              // 0-100
  level: AngerLevel;
  confidence: number;         // 0-1
  parameters: AngerParameters;
  timestamp: Date;
}

export enum AngerLevel {
  CALM = 'CALM',
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  EXTREME = 'EXTREME'
}

export class AngerDetectionEngine {
  private baselineTypingSpeed: number = 40; // WPM
  private baselineHeartRate: number = 70;   // BPM

  /**
   * Calculates weighted anger score from 0-100
   * Based on the specification weights:
   * - Text Sentiment: 25%
   * - Voice Tone: 20%
   * - Typing Speed: 15%
   * - Click Intensity: 10%
   * - Recent Game History: 15%
   * - Time of Day: 5%
   * - Physiological: 10% (optional)
   */
  calculateAngerScore(parameters: AngerParameters): AngerScore {
    // Normalize and weight each parameter
    const textScore = this.normalizeTextSentiment(parameters.textSentiment) * 0.25;
    const voiceScore = this.normalizeVoiceTone(parameters.voiceTone) * 0.20;
    const typingScore = this.normalizeTypingSpeed(parameters.typingSpeed) * 0.15;
    const clickScore = this.normalizeClickIntensity(parameters.clickIntensity) * 0.10;
    const historyScore = this.normalizeGameHistory(parameters.recentGameHistory) * 0.15;
    const timeScore = this.normalizeTimeOfDay(parameters.timeOfDay) * 0.05;
    
    let physiologicalScore = 0;
    if (parameters.physiological !== undefined) {
      physiologicalScore = this.normalizePhysiological(parameters.physiological) * 0.10;
    }

    // Calculate weighted total
    const weightedScore = textScore + voiceScore + typingScore + clickScore + 
                         historyScore + timeScore + physiologicalScore;

    // Ensure score is between 0-100
    const finalScore = Math.min(100, Math.max(0, weightedScore));
    
    return {
      score: Math.round(finalScore),
      level: this.getAngerLevel(finalScore),
      confidence: this.calculateConfidence(parameters),
      parameters,
      timestamp: new Date()
    };
  }

  private normalizeTextSentiment(sentiment: number): number {
    // Convert -1 to 1 range to 0-100 anger scale
    // Negative sentiment = higher anger
    return Math.max(0, (1 - sentiment) * 100);
  }

  private normalizeVoiceTone(variance: number): number {
    // Higher variance = higher anger
    return Math.min(100, variance);
  }

  private normalizeTypingSpeed(wpm: number): number {
    // Faster typing than baseline = higher anger
    const deviation = Math.abs(wpm - this.baselineTypingSpeed);
    return Math.min(100, deviation * 2);
  }

  private normalizeClickIntensity(force: number): number {
    // Higher force = higher anger
    return Math.min(100, force);
  }

  private normalizeGameHistory(rageQuitFrequency: number): number {
    // Higher frequency = higher anger
    return Math.min(100, rageQuitFrequency * 20);
  }

  private normalizeTimeOfDay(hour: number): number {
    // Late night hours = higher fatigue = potential anger
    if (hour >= 22 || hour <= 6) return 30;
    if (hour >= 7 && hour <= 9) return 20; // Morning rush
    if (hour >= 17 && hour <= 19) return 25; // Evening rush
    return 10;
  }

  private normalizePhysiological(heartRate: number): number {
    // Higher heart rate variance = higher stress/anger
    const variance = Math.abs(heartRate - this.baselineHeartRate);
    return Math.min(100, variance);
  }

  private getAngerLevel(score: number): AngerLevel {
    if (score <= 20) return AngerLevel.CALM;
    if (score <= 40) return AngerLevel.MILD;
    if (score <= 60) return AngerLevel.MODERATE;
    if (score <= 80) return AngerLevel.HIGH;
    return AngerLevel.EXTREME;
  }

  private calculateConfidence(parameters: AngerParameters): number {
    // Calculate confidence based on data quality and completeness
    let confidence = 0;
    let totalWeight = 0;

    // Text sentiment is always available
    confidence += 0.25;
    totalWeight += 0.25;

    // Voice tone (if available)
    if (parameters.voiceTone > 0) {
      confidence += 0.20;
      totalWeight += 0.20;
    }

    // Typing speed
    confidence += 0.15;
    totalWeight += 0.15;

    // Click intensity
    confidence += 0.10;
    totalWeight += 0.10;

    // Game history
    confidence += 0.15;
    totalWeight += 0.15;

    // Time of day
    confidence += 0.05;
    totalWeight += 0.05;

    // Physiological (optional)
    if (parameters.physiological !== undefined) {
      confidence += 0.10;
      totalWeight += 0.10;
    }

    return totalWeight > 0 ? confidence / totalWeight : 0;
  }

  /**
   * Get recommended game categories based on anger level
   */
  getRecommendedCategories(angerLevel: AngerLevel): string[] {
    switch (angerLevel) {
      case AngerLevel.CALM:
        return ['Strategy', 'Puzzle', 'Building', 'RPG', 'Adventure'];
      case AngerLevel.MILD:
        return ['Adventure', 'Racing', 'Sports', 'Simulation'];
      case AngerLevel.MODERATE:
        return ['Action', 'Fighting', 'Hack-n-Slash', 'Racing'];
      case AngerLevel.HIGH:
        return ['Casual', 'Relaxing', 'Sandbox', 'Music', 'Walking Sim'];
      case AngerLevel.EXTREME:
        return ['Meditation', 'Music', 'Walking Sim', 'Puzzle', 'Relaxing'];
      default:
        return ['Casual', 'Adventure'];
    }
  }

  /**
   * Get categories to avoid based on anger level
   */
  getAvoidCategories(angerLevel: AngerLevel): string[] {
    switch (angerLevel) {
      case AngerLevel.CALM:
        return [];
      case AngerLevel.MILD:
        return ['Dark Souls-like', 'Roguelike'];
      case AngerLevel.MODERATE:
        return ['Competitive Multiplayer', 'PvP'];
      case AngerLevel.HIGH:
        return ['PvP', 'Roguelike', 'Competitive'];
      case AngerLevel.EXTREME:
        return ['All Competitive', 'PvP', 'Roguelike', 'Dark Souls-like'];
      default:
        return ['Competitive'];
    }
  }
}
