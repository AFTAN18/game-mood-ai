import { Game } from './recommendationEngine';

export const gameDatabase: Game[] = [
  // CALM MOOD GAMES (0-20 anger score)
  {
    id: "stardew-valley",
    title: "Stardew Valley",
    description: "A peaceful farming simulation where you can tend crops, raise animals, and build relationships in a charming pixel art world.",
    genre: ["Farming Sim", "Life Sim", "RPG"],
    rating: 4.8,
    playtime: 120, // 2 hours
    lastPlayed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    isInstalled: true,
    platform: ["PC", "Switch", "Mobile"],
    userRating: 5,
    completionStatus: "in_progress",
    matchScore: 95,
    reasons: ["Relaxing gameplay", "Creative freedom", "Low stress", "Social optional"],
    imageUrl: "/placeholder.svg",
    price: 14.99,
    tags: ["relaxing", "creative", "farming", "social", "pixel-art"]
  },
  {
    id: "animal-crossing",
    title: "Animal Crossing: New Horizons",
    description: "A delightful life simulation where you build your own island paradise, interact with charming animal villagers, and create your perfect getaway.",
    genre: ["Life Sim", "Social Sim", "Adventure"],
    rating: 4.7,
    playtime: 90, // 1.5 hours
    lastPlayed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isInstalled: true,
    platform: ["Switch"],
    userRating: 5,
    completionStatus: "in_progress",
    matchScore: 93,
    reasons: ["Charming characters", "No pressure", "Creative design", "Social interaction"],
    imageUrl: "/placeholder.svg",
    price: 59.99,
    tags: ["charming", "no-pressure", "creative", "social", "island-life"]
  },
  {
    id: "minecraft",
    title: "Minecraft",
    description: "Endless creativity in a block-based world where you can build, explore, and create anything you imagine.",
    genre: ["Sandbox", "Adventure", "Building"],
    rating: 4.7,
    playtime: 300, // 5 hours
    lastPlayed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    isInstalled: true,
    platform: ["PC", "Console", "Mobile"],
    userRating: 4,
    completionStatus: "in_progress",
    matchScore: 90,
    reasons: ["Creative freedom", "Flexible social", "Any energy level", "Relaxing"],
    imageUrl: "/placeholder.svg",
    price: 26.95,
    tags: ["creative", "building", "exploration", "relaxing", "sandbox"]
  },
  {
    id: "civilization-vi",
    title: "Sid Meier's Civilization VI",
    description: "Turn-based strategy game where you build an empire, explore the world, and advance through history.",
    genre: ["Strategy", "Turn-based", "4X"],
    rating: 4.6,
    playtime: 180, // 3 hours
    lastPlayed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isInstalled: true,
    platform: ["PC", "Switch"],
    userRating: 5,
    completionStatus: "not_started",
    matchScore: 88,
    reasons: ["Strategic thinking", "Low pressure", "Educational", "Engaging"],
    imageUrl: "/placeholder.svg",
    price: 59.99,
    tags: ["strategy", "turn-based", "educational", "empire-building", "historical"]
  },

  // MILD MOOD GAMES (21-40 anger score)
  {
    id: "hades",
    title: "Hades",
    description: "Fast-paced roguelike with stellar combat, amazing story, and just the right amount of challenge.",
    genre: ["Roguelike", "Action", "RPG"],
    rating: 4.9,
    playtime: 90, // 1.5 hours
    lastPlayed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isInstalled: true,
    platform: ["PC", "Switch", "Xbox", "PlayStation"],
    userRating: 5,
    completionStatus: "in_progress",
    matchScore: 87,
    reasons: ["High energy", "Challenging", "Engaging story", "Quick sessions"],
    imageUrl: "/placeholder.svg",
    price: 24.99,
    tags: ["action", "roguelike", "challenging", "story-driven", "combat"]
  },
  {
    id: "fall-guys",
    title: "Fall Guys",
    description: "A colorful battle royale party game where you compete in wacky obstacle courses with other players in adorable bean-like characters.",
    genre: ["Battle Royale", "Party", "Multiplayer"],
    rating: 4.5,
    playtime: 45, // 45 minutes
    lastPlayed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isInstalled: true,
    platform: ["PC", "Switch", "Xbox", "PlayStation"],
    userRating: 4,
    completionStatus: "in_progress",
    matchScore: 84,
    reasons: ["Fun multiplayer", "Lighthearted", "Quick matches", "Social fun"],
    imageUrl: "/placeholder.svg",
    price: 0,
    tags: ["multiplayer", "fun", "lighthearted", "quick-matches", "social"]
  },
  {
    id: "forza-horizon-5",
    title: "Forza Horizon 5",
    description: "Open-world racing game set in Mexico with stunning graphics and exhilarating driving experiences.",
    genre: ["Racing", "Open World", "Sports"],
    rating: 4.8,
    playtime: 60, // 1 hour
    lastPlayed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isInstalled: true,
    platform: ["PC", "Xbox"],
    userRating: 4,
    completionStatus: "in_progress",
    matchScore: 85,
    reasons: ["Exciting", "Beautiful visuals", "Freedom to explore", "Skill-based"],
    imageUrl: "/placeholder.svg",
    price: 59.99,
    tags: ["racing", "open-world", "beautiful", "exciting", "freedom"]
  },
  {
    id: "fifa-24",
    title: "EA FC 24",
    description: "The latest football simulation with realistic gameplay, multiple modes, and competitive matches.",
    genre: ["Sports", "Simulation", "Multiplayer"],
    rating: 4.5,
    playtime: 45, // 45 minutes
    lastPlayed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isInstalled: true,
    platform: ["PC", "Console"],
    userRating: 4,
    completionStatus: "in_progress",
    matchScore: 82,
    reasons: ["Team sports", "Strategic", "Social", "Skill development"],
    imageUrl: "/placeholder.svg",
    price: 69.99,
    tags: ["sports", "football", "competitive", "team-based", "strategic"]
  },

  // MODERATE MOOD GAMES (41-60 anger score)
  {
    id: "devil-may-cry-5",
    title: "Devil May Cry 5",
    description: "Stylish action game with over-the-top combat, cool characters, and satisfying combos.",
    genre: ["Action", "Hack-n-Slash", "Adventure"],
    rating: 4.7,
    playtime: 75, // 1.25 hours
    lastPlayed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isInstalled: true,
    platform: ["PC", "Xbox", "PlayStation"],
    userRating: 4,
    completionStatus: "in_progress",
    matchScore: 80,
    reasons: ["High energy", "Skill expression", "Satisfying combat", "Cool factor"],
    imageUrl: "/placeholder.svg",
    price: 59.99,
    tags: ["action", "hack-n-slash", "stylish", "combat", "cool"]
  },
  {
    id: "street-fighter-6",
    title: "Street Fighter 6",
    description: "Classic fighting game with deep mechanics, diverse characters, and competitive gameplay.",
    genre: ["Fighting", "Action", "Competitive"],
    rating: 4.6,
    playtime: 30, // 30 minutes
    lastPlayed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isInstalled: true,
    platform: ["PC", "Xbox", "PlayStation"],
    userRating: 4,
    completionStatus: "in_progress",
    matchScore: 78,
    reasons: ["Skill-based", "Quick matches", "Competitive", "Satisfying"],
    imageUrl: "/placeholder.svg",
    price: 59.99,
    tags: ["fighting", "competitive", "skill-based", "quick-matches", "classic"]
  },
  {
    id: "need-for-speed-heat",
    title: "Need for Speed Heat",
    description: "Arcade racing with police chases, customization, and high-speed action.",
    genre: ["Racing", "Action", "Arcade"],
    rating: 4.4,
    playtime: 60, // 1 hour
    lastPlayed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    isInstalled: true,
    platform: ["PC", "Console"],
    userRating: 3,
    completionStatus: "in_progress",
    matchScore: 75,
    reasons: ["Fast-paced", "Exciting", "Freedom", "Adrenaline"],
    imageUrl: "/placeholder.svg",
    price: 59.99,
    tags: ["racing", "action", "fast-paced", "police-chase", "customization"]
  },

  // HIGH MOOD GAMES (61-80 anger score)
  {
    id: "journey",
    title: "Journey",
    description: "A beautiful, meditative adventure game about discovery and connection in a vast desert.",
    genre: ["Adventure", "Walking Sim", "Art"],
    rating: 4.8,
    playtime: 120, // 2 hours
    lastPlayed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    isInstalled: true,
    platform: ["PC", "PlayStation"],
    userRating: 5,
    completionStatus: "completed",
    matchScore: 92,
    reasons: ["Meditative", "Beautiful", "Low stress", "Emotional"],
    imageUrl: "/placeholder.svg",
    price: 14.99,
    tags: ["meditative", "beautiful", "emotional", "low-stress", "artistic"]
  },
  {
    id: "abzu",
    title: "ABZÛ",
    description: "Underwater exploration game with stunning visuals and peaceful swimming mechanics.",
    genre: ["Adventure", "Exploration", "Relaxing"],
    rating: 4.5,
    playtime: 90, // 1.5 hours
    lastPlayed: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    isInstalled: true,
    platform: ["PC", "Console"],
    userRating: 4,
    completionStatus: "completed",
    matchScore: 88,
    reasons: ["Peaceful", "Beautiful", "Exploration", "Low pressure"],
    imageUrl: "/placeholder.svg",
    price: 19.99,
    tags: ["peaceful", "underwater", "exploration", "beautiful", "relaxing"]
  },
  {
    id: "flower",
    title: "Flower",
    description: "A zen-like game where you control flower petals in the wind, creating beautiful patterns.",
    genre: ["Art", "Relaxing", "Indie"],
    rating: 4.6,
    playtime: 60, // 1 hour
    lastPlayed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    isInstalled: true,
    platform: ["PC", "PlayStation", "Mobile"],
    userRating: 5,
    completionStatus: "completed",
    matchScore: 85,
    reasons: ["Zen-like", "Beautiful", "No pressure", "Meditative"],
    imageUrl: "/placeholder.svg",
    price: 6.99,
    tags: ["zen", "beautiful", "meditative", "no-pressure", "artistic"]
  },

  // EXTREME MOOD GAMES (81-100 anger score)
  {
    id: "meditation-app",
    title: "Headspace",
    description: "Guided meditation app with breathing exercises and mindfulness techniques.",
    genre: ["Meditation", "Wellness", "App"],
    rating: 4.7,
    playtime: 20, // 20 minutes
    lastPlayed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isInstalled: true,
    platform: ["Mobile", "Web"],
    userRating: 5,
    completionStatus: "in_progress",
    matchScore: 95,
    reasons: ["Stress relief", "Breathing exercises", "Mindfulness", "Professional guidance"],
    imageUrl: "/placeholder.svg",
    price: 12.99,
    tags: ["meditation", "stress-relief", "breathing", "mindfulness", "wellness"]
  },
  {
    id: "calm-app",
    title: "Calm",
    description: "Sleep and meditation app with soothing sounds, stories, and relaxation techniques.",
    genre: ["Wellness", "Meditation", "Sleep"],
    rating: 4.8,
    playtime: 30, // 30 minutes
    lastPlayed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isInstalled: true,
    platform: ["Mobile", "Web"],
    userRating: 4,
    completionStatus: "in_progress",
    matchScore: 90,
    reasons: ["Sleep aid", "Relaxation", "Soothing sounds", "Professional content"],
    imageUrl: "/placeholder.svg",
    price: 14.99,
    tags: ["sleep", "relaxation", "soothing", "meditation", "wellness"]
  },
  {
    id: "walking-sim",
    title: "Proteus",
    description: "A procedurally generated exploration game with no goals, just peaceful wandering.",
    genre: ["Exploration", "Walking Sim", "Indie"],
    rating: 4.3,
    playtime: 45, // 45 minutes
    lastPlayed: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    isInstalled: true,
    platform: ["PC"],
    userRating: 4,
    completionStatus: "completed",
    matchScore: 87,
    reasons: ["No pressure", "Peaceful", "Exploration", "Minimalist"],
    imageUrl: "/placeholder.svg",
    price: 9.99,
    tags: ["no-pressure", "peaceful", "exploration", "minimalist", "procedural"]
  }
];

export const getGamesByMood = (angerLevel: string): Game[] => {
  const levelMap: { [key: string]: string[] } = {
    "CALM": ["stardew-valley", "animal-crossing", "minecraft", "civilization-vi"],
    "MILD": ["hades", "fall-guys", "forza-horizon-5", "fifa-24"],
    "MODERATE": ["devil-may-cry-5", "street-fighter-6", "need-for-speed-heat"],
    "HIGH": ["journey", "abzu", "flower"],
    "EXTREME": ["meditation-app", "calm-app", "walking-sim"]
  };

  const gameIds = levelMap[angerLevel] || levelMap["CALM"];
  return gameDatabase.filter(game => gameIds.includes(game.id));
};

export const getRandomGames = (count: number = 6): Game[] => {
  const shuffled = [...gameDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
