export interface RouletteGame {
  variant: string;
  name: string;
  provider: string;
  id?: number | string;
}

export function generateGameSlug(game: RouletteGame): string {
  const variant = game.variant.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  
  const name = game.name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
    
  const provider = game.provider.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  
  return `${variant}-${name}-${provider}`;
}

export function generatePostSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}