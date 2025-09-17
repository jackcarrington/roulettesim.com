import type { RouletteGame } from '../types/game.ts';

export function createGameSchema(game: RouletteGame, gameUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["VideoGame", "SoftwareApplication"],
    "name": `${game.name} - Free Demo`,
    "description": `Play ${game.name} free roulette demo for practice and learning. ${game.variant} variant by ${game.provider}.`,
    "genre": ["Casino Game", "Educational"],
    "gamePlatform": ["Web Browser", "Mobile"],
    "applicationCategory": "Game",
    "isAccessibleForFree": true,
    "educationalUse": "Practice and Learning",
    "playMode": "SinglePlayer",
    "operatingSystem": ["Web Browser", "iOS", "Android"],
    "softwareVersion": "Demo Version",
    "applicationSubCategory": "Casino Game Demo",
    "publisher": {
      "@type": "Organization",
      "name": "Roulettesim.com"
    },
    "offers": {
      "@type": "Offer",
      "name": "Free Demo Access",
      "description": "Free-to-play demo version for educational purposes",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "InStock",
      "category": "Free Software"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Casino Game Learners",
      "suggestedMinAge": 18
    },
    "mainEntityOfPage": gameUrl,
    "url": gameUrl,
    "keywords": ["free roulette", "casino demo", "roulette practice", "gambling education"]
  };
}

export function createEducationalSchema(post: any, postUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description || post.body,
    "author": {
      "@type": "Person",
      "name": "Roulette Expert",
      "jobTitle": "Casino Game Expert"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Roulettesim.com"
    },
    "mainEntityOfPage": postUrl,
    "datePublished": post.publishDate || "2025-09-03",
    "dateModified": post.lastUpdated || "2025-09-03",
    "articleSection": "Casino Education",
    "about": {
      "@type": "Thing",
      "name": "Roulette Strategy"
    }
  };
}