import React, { useEffect, useState } from 'react';

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
  const [shouldSpin, setShouldSpin] = useState(false);

  useEffect(() => {
    // Wait 1 second before starting spin animation
    const timer = setTimeout(() => {
      setShouldSpin(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className} style={{ width, height }}>
      <img 
        src="/animations/roulette-wheel.svg" 
        alt="Roulette wheel" 
        className={`roulette-svg ${shouldSpin ? 'spinning' : ''}`}
        style={{ 
          width: width, 
          height: height, 
          maxWidth: '100%', 
          maxHeight: '100%',
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
  animation: rouletteSpin 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes rouletteSpin {
  0% {
    transform: rotate(0deg);
  }
  70% {
    transform: rotate(1800deg); /* 5 full rotations */
  }
  100% {
    transform: rotate(1860deg); /* Stop at a specific position */
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