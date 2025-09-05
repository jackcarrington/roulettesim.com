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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait 1 second before starting spin animation
    const timer = setTimeout(() => {
      setShouldSpin(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

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
        margin: '0 auto',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      <img 
        src="/animations/roulette-wheel.svg" 
        alt="Roulette wheel" 
        className={`roulette-svg ${shouldSpin ? 'spinning' : ''}`}
        onLoad={handleImageLoad}
        style={{ 
          width: '100%', 
          height: '100%', 
          maxWidth: '400px', 
          maxHeight: '400px',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
};

export default RouletteAnimation;

// Add CSS animation styles
const styles = `
.roulette-container {
  will-change: transform;
}

.roulette-svg {
  transform-origin: center center;
  transition: transform 0.3s ease;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.roulette-svg.spinning {
  animation: rouletteSpin 3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes rouletteSpin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(720deg); /* Fast spin */
  }
  100% {
    transform: rotate(900deg); /* Slower deceleration */
  }
}

/* Prevent animation flicker */
.roulette-container img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
`;

// Inject styles
if (typeof document !== 'undefined' && !document.querySelector('#roulette-spin-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'roulette-spin-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}