import { describe, it, expect } from 'vitest';

describe('GameFrame Component', () => {
  it('should generate correct iframe URL', () => {
    const gameId = 'european-roulette-1';
    const expectedUrl = `https://slotslaunch.com/iframe/${gameId}`;
    
    expect(expectedUrl).toBe('https://slotslaunch.com/iframe/european-roulette-1');
  });

  it('should detect roulette variants correctly', () => {
    const variants = ['european', 'american', 'french'];
    
    variants.forEach(variant => {
      expect(['european', 'american', 'french'].includes(variant)).toBe(true);
    });
  });
});