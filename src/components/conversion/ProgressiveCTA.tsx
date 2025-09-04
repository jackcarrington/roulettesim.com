import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { conversionScore, gamePreferences } from '../../stores/sessionState.ts';
import type { CasinoRecommendation } from '../../types/casino.ts';

interface Props {
  recommendations: CasinoRecommendation[];
}

export default function ProgressiveCTA({ recommendations }: Props) {
  const $conversionScore = useStore(conversionScore);
  const $gamePreferences = useStore(gamePreferences);
  const [ctaVariant, setCtaVariant] = useState<'low' | 'medium' | 'high'>('low');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Determine CTA intensity based on conversion score
    if ($conversionScore > 0.7) {
      setCtaVariant('high');
    } else if ($conversionScore > 0.4) {
      setCtaVariant('medium');
    } else {
      setCtaVariant('low');
    }

    // Show CTA based on engagement level
    setIsVisible($conversionScore > 0.2);
  }, [$conversionScore]);

  if (!isVisible || recommendations.length === 0) return null;

  const topRecommendation = recommendations[0];
  const userVariantText = $gamePreferences.length > 0 
    ? ` ${$gamePreferences[0]} roulette` 
    : ' roulette';

  const ctaContent = {
    low: {
      headline: 'Ready to try real money roulette?',
      description: `Practice with free demos first, then explore real casino options when you're ready.`,
      buttonText: 'Explore Casinos',
      urgency: false,
    },
    medium: {
      headline: `Enjoying${userVariantText}? Take the next step`,
      description: `Based on your playing style, ${topRecommendation.name} offers excellent ${$gamePreferences[0] || 'roulette'} games with great bonuses.`,
      buttonText: `Visit ${topRecommendation.name}`,
      urgency: false,
    },
    high: {
      headline: `You've mastered the demo - ready for real action?`,
      description: `${topRecommendation.name} is perfect for your${userVariantText} preference. ${topRecommendation.features.bonusOffering}`,
      buttonText: `Claim Bonus at ${topRecommendation.name}`,
      urgency: true,
    },
  };

  const content = ctaContent[ctaVariant];

  return (
    <div className={`progressive-cta ${ctaVariant}-urgency`}>
      <div className="cta-content">
        <h3 className="cta-headline">{content.headline}</h3>
        <p className="cta-description">{content.description}</p>
        
        <div className="cta-actions">
          <a
            href={topRecommendation.affiliateUrl}
            className={`primary-cta ${content.urgency ? 'urgent' : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCasinoClick(topRecommendation.casinoId)}
          >
            {content.buttonText}
          </a>
          
          {ctaVariant === 'high' && (
            <button
              className="secondary-cta"
              onClick={() => setIsVisible(false)}
            >
              Maybe Later
            </button>
          )}
        </div>

        <p className="responsible-gambling-text">
          18+ • Gamble Responsibly • <a href="/responsible-gambling">Learn More</a>
        </p>
      </div>
    </div>
  );
}

async function trackCasinoClick(casinoId: string) {
  try {
    await fetch('/api/analytics/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'casino-click',
        data: { casinoId, source: 'progressive-cta' },
      }),
    });
  } catch (error) {
    console.warn('Failed to track casino click:', error);
  }
}