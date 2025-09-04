import React, { useEffect, useState } from 'react';

interface RouletteAnimationProps {
  className?: string;
  width?: number;
  height?: number;
}

const RouletteAnimation: React.FC<RouletteAnimationProps> = ({ 
  className = '', 
  width = 350, 
  height = 350 
}) => {
  const [shouldSpin, setShouldSpin] = useState(false);

  useEffect(() => {
    // Wait 1 second before starting spin animation
    const timer = setTimeout(() => {
      setShouldSpin(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`roulette-container ${className}`} 
      style={{ 
        width: Math.min(width, 400), 
        height: Math.min(height, 400),
        maxWidth: '400px',
        maxHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto' // Center within parent grid column
      }}
    >
      <img 
        src="/animations/roulette-wheel.svg" 
        alt="Roulette wheel" 
        className={`roulette-svg ${shouldSpin ? 'spinning' : ''}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          maxWidth: '400px', 
          maxHeight: '400px',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default RouletteAnimation;

// Add CSS animation styles
const styles = `
.roulette-svg {
  transform-origin: center;
  transition: transform 0.3s ease;
}

.roulette-svg.spinning {
  animation: rouletteSpin 2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes rouletteSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(900deg); /* 2.5 smooth rotations with natural deceleration */
  }
}
`;

// Inject styles
if (typeof document !== 'undefined' && !document.querySelector('#roulette-spin-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'roulette-spin-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}