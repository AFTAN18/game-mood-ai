import { AngerLevel, AngerScore } from './angerScoring';

export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string[];
  rating: number;
  playtime: number; // in minutes
  lastPlayed: Date;
  isInstalled: boolean;
  platform: string[];
  userRating?: number;
  completionStatus: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  matchScore: number;
  reasons: string[];
  imageUrl: string;
  price?: number;
  tags: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  preferences: {
    favoriteGenres: string[];
    preferredPlaytime: number; // minutes
    difficultyPreference: 'easy' | 'medium' | 'hard';
    multiplayerPreference: 'single' | 'multiplayer' | 'both';
  };
  gameLibrary: Game[];
  playHistory: {
    gameId: string;
    sessionStart: Date;
    sessionEnd: Date;
    rageQuit: boolean;
    moodBefore: AngerScore;
    moodAfter: AngerScore;
  }[];
}

export interface RecommendationResult {
  type: 'LIBRARY' | 'DOWNLOAD';
  games: Game[];
  message: string;
  confidence: number;
  angerLevel: AngerLevel;
  reasoning: string[];
}

export class RecommendationEngine {
  private angerDetectionEngine: any; // Will be imported from angerScoring

  constructor() {
    // Initialize anger detection engine
    // this.angerDetectionEngine = new AngerDetectionEngine();
  }

  /**
   * Main recommendation function as specified in the project requirements
   */
  async recommendGames(userProfile: UserProfile, angerScore: AngerScore): Promise<RecommendationResult> {
    // Step 1: Determine appropriate categories
    const recommendedCategories = this.getCategoriesForAngerLevel(angerScore.level);
    const avoidCategories = this.getAvoidCategories(angerScore.level);

    // Step 2: Check user's installed games
    const installedGames = userProfile.gameLibrary.filter(game => game.isInstalled);
    const matchingGames = this.filterByCategories(installedGames, recommendedCategories, avoidCategories);

    // Step 3: Decision logic
    if (matchingGames.length > 0) {
      // Recommend from library
      const rankedGames = this.rankByPreference(matchingGames, userProfile, angerScore);
      return {
        type: 'LIBRARY',
        games: rankedGames.slice(0, 6), // Top 6 recommendations
        message: 'Try these games from your library that match your current mood',
        confidence: angerScore.confidence,
        angerLevel: angerScore.level,
        reasoning: this.generateReasoning(rankedGames[0], angerScore)
      };
    } else {
      // Suggest new downloads
      const suggestions = await this.fetchGameSuggestions(recommendedCategories, avoidCategories, userProfile);
      return {
        type: 'DOWNLOAD',
        games: this.addPlatformLinks(suggestions),
        message: 'Consider trying these games that match your current mood',
        confidence: angerScore.confidence,
        angerLevel: angerScore.level,
        reasoning: this.generateReasoning(suggestions[0], angerScore)
      };
    }
  }

  /**
   * Filter games by categories and avoid lists
   */
  private filterByCategories(
    games: Game[], 
    recommended: string[], 
    avoid: string[]
  ): Game[] {
    return games.filter(game => {
      // Check if game has any recommended categories
      const hasRecommended = game.genre.some(genre => 
        recommended.some(rec => 
          genre.toLowerCase().includes(rec.toLowerCase()) ||
          rec.toLowerCase().includes(genre.toLowerCase())
        )
      );

      // Check if game has any avoid categories
      const hasAvoided = game.genre.some(genre => 
        avoid.some(avoidCat => 
          genre.toLowerCase().includes(avoidCat.toLowerCase()) ||
          avoidCat.toLowerCase().includes(genre.toLowerCase())
        )
      );

      return hasRecommended && !hasAvoided;
    });
  }

  /**
   * Rank games by preference factors as specified in requirements
   */
  private rankByPreference(
    games: Game[], 
    userProfile: UserProfile, 
    angerScore: AngerScore
  ): Game[] {
    return games.map(game => {
      let matchScore = 0;

      // Playtime History - Less played games ranked higher
      const totalPlaytime = userProfile.playHistory
        .filter(session => session.gameId === game.id)
        .reduce((total, session) => {
          const duration = session.sessionEnd.getTime() - session.sessionStart.getTime();
          return total + duration;
        }, 0);
      
      const playtimeScore = Math.max(0, 100 - (totalPlaytime / 60000)); // Convert to minutes
      matchScore += playtimeScore * 0.25;

      // Last Played Date - Older = higher priority
      const daysSinceLastPlayed = (Date.now() - game.lastPlayed.getTime()) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.min(100, daysSinceLastPlayed * 2);
      matchScore += recencyScore * 0.20;

      // User Ratings - Personal ratings if available
      if (game.userRating) {
        matchScore += game.userRating * 20; // Convert 0-5 to 0-100
      }
      matchScore += 0.15;

      // Completion Status - Unfinished games prioritized
      const completionScore = this.getCompletionScore(game.completionStatus);
      matchScore += completionScore * 0.20;

      // Mood Match Score - How well game matches current state
      const moodMatchScore = this.calculateMoodMatch(game, angerScore);
      matchScore += moodMatchScore * 0.20;

      return {
        ...game,
        matchScore: Math.round(matchScore)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate completion status score
   */
  private getCompletionScore(status: string): number {
    switch (status) {
      case 'not_started': return 100;
      case 'in_progress': return 80;
      case 'abandoned': return 60;
      case 'completed': return 20;
      default: return 50;
    }
  }

  /**
   * Calculate mood match score
   */
  private calculateMoodMatch(game: Game, angerScore: AngerScore): number {
    let score = 50; // Base score

    // Adjust based on anger level and game characteristics
    switch (angerScore.level) {
      case 'CALM':
        if (game.genre.some(g => ['Strategy', 'Puzzle', 'Building'].includes(g))) {
          score += 30;
        }
        break;
      case 'MILD':
        if (game.genre.some(g => ['Adventure', 'Racing', 'Sports'].includes(g))) {
          score += 25;
        }
        break;
      case 'MODERATE':
        if (game.genre.some(g => ['Action', 'Fighting'].includes(g))) {
          score += 25;
        }
        break;
      case 'HIGH':
        if (game.genre.some(g => ['Casual', 'Relaxing', 'Music'].includes(g))) {
          score += 30;
        }
        break;
      case 'EXTREME':
        if (game.genre.some(g => ['Meditation', 'Walking Sim'].includes(g))) {
          score += 35;
        }
        break;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Generate reasoning for recommendations
   */
  private generateReasoning(game: Game, angerScore: AngerScore): string[] {
    const reasons: string[] = [];

    // Add mood-based reasoning
    switch (angerScore.level) {
      case 'CALM':
        reasons.push('Perfect for your relaxed state');
        reasons.push('Engaging without stress');
        break;
      case 'MILD':
        reasons.push('Good balance of challenge and fun');
        reasons.push('Won\'t add to your frustration');
        break;
      case 'MODERATE':
        reasons.push('Provides healthy outlet for energy');
        reasons.push('Engaging action to channel emotions');
        break;
      case 'HIGH':
        reasons.push('Designed to help you relax');
        reasons.push('Low-pressure gameplay');
        break;
      case 'EXTREME':
        reasons.push('Specifically calming experience');
        reasons.push('Helps reduce stress levels');
        break;
    }

    // Add game-specific reasoning
    if (game.rating >= 4.5) {
      reasons.push('Highly rated by players');
    }
    if (game.playtime < 60) {
      reasons.push('Quick sessions available');
    }

    return reasons;
  }

  /**
   * Fetch game suggestions from external APIs
   */
  private async fetchGameSuggestions(
    recommended: string[], 
    avoid: string[], 
    userProfile: UserProfile
  ): Promise<Game[]> {
    // Mock implementation - in real app this would call IGDB, RAWG, etc.
    const mockSuggestions: Game[] = [
      {
        id: 'stardew-valley',
        title: 'Stardew Valley',
        description: 'A relaxing farming simulation perfect for unwinding',
        genre: ['Farming Sim', 'Relaxing', 'Sandbox'],
        rating: 4.8,
        playtime: 0,
        lastPlayed: new Date(),
        isInstalled: false,
        platform: ['PC', 'Mobile', 'Console'],
        completionStatus: 'not_started',
        matchScore: 95,
        reasons: ['Relaxing', 'Creative', 'Low Stress'],
        imageUrl: '/placeholder.svg',
        price: 14.99,
        tags: ['relaxing', 'farming', 'indie']
      },
      {
        id: 'journey',
        title: 'Journey',
        description: 'A beautiful, meditative adventure game',
        genre: ['Adventure', 'Walking Sim', 'Relaxing'],
        rating: 4.9,
        playtime: 0,
        lastPlayed: new Date(),
        isInstalled: false,
        platform: ['PC', 'Console'],
        completionStatus: 'not_started',
        matchScore: 92,
        reasons: ['Meditative', 'Beautiful', 'Peaceful'],
        imageUrl: '/placeholder.svg',
        price: 14.99,
        tags: ['meditation', 'beautiful', 'peaceful']
      }
    ];

    return mockSuggestions.filter(game => 
      game.genre.some(genre => 
        recommended.some(rec => 
          genre.toLowerCase().includes(rec.toLowerCase())
        )
      )
    );
  }

  /**
   * Add platform links for download suggestions
   */
  private addPlatformLinks(games: Game[]): Game[] {
    return games.map(game => ({
      ...game,
      platform: game.platform.map(platform => {
        switch (platform.toLowerCase()) {
          case 'pc':
            return 'Steam';
          case 'mobile':
            return 'App Store';
          case 'console':
            return 'PlayStation Store';
          default:
            return platform;
        }
      })
    }));
  }

  /**
   * Get categories for anger level
   */
  private getCategoriesForAngerLevel(angerLevel: AngerLevel): string[] {
    switch (angerLevel) {
      case 'CALM':
        return ['Strategy', 'Puzzle', 'Building', 'RPG', 'Adventure'];
      case 'MILD':
        return ['Adventure', 'Racing', 'Sports', 'Simulation'];
      case 'MODERATE':
        return ['Action', 'Fighting', 'Hack-n-Slash', 'Racing'];
      case 'HIGH':
        return ['Casual', 'Relaxing', 'Sandbox', 'Music', 'Walking Sim'];
      case 'EXTREME':
        return ['Meditation', 'Music', 'Walking Sim', 'Puzzle', 'Relaxing'];
      default:
        return ['Casual', 'Adventure'];
    }
  }

  /**
   * Get categories to avoid
   */
  private getAvoidCategories(angerLevel: AngerLevel): string[] {
    switch (angerLevel) {
      case 'CALM':
        return [];
      case 'MILD':
        return ['Dark Souls-like', 'Roguelike'];
      case 'MODERATE':
        return ['Competitive Multiplayer', 'PvP'];
      case 'HIGH':
        return ['PvP', 'Roguelike', 'Competitive'];
      case 'EXTREME':
        return ['All Competitive', 'PvP', 'Roguelike', 'Dark Souls-like'];
      default:
        return ['Competitive'];
    }
  }
}
