import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface RouletteAnimationProps {
  className?: string;
  width?: number;
  height?: number;
}

const RouletteAnimation: React.FC<RouletteAnimationProps> = ({ 
  className = '', 
  width = 800, 
  height = 600 
}) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Dynamically import the animation data
    const loadAnimation = async () => {
      try {
        const response = await fetch('/animations/roulette.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load animation:', error);
      }
    };

    loadAnimation();
  }, []);

  if (!animationData) {
    return (
      <div className={className} style={{ width, height }}>
        <img 
          src="/animations/roulette-fallback.svg" 
          alt="Roulette wheel" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <Lottie 
        animationData={animationData}
        loop={false} // Play once
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default RouletteAnimation;