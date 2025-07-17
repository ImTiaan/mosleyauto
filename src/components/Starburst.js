'use client';

import { useState, useEffect } from 'react';

export default function Starburst({ text = 'SALE!', size = 120, color = '#ffcc00', textColor = '#ff0000' }) {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    // Create a wobbling effect for that authentic early 2000s feel
    const interval = setInterval(() => {
      setRotation(prev => (prev + 5) % 360);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="starburst"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        color: textColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        fontSize: `${size / 20}px`,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s ease',
        animation: 'pulse 2s infinite',
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        boxShadow: '0 0 10px rgba(255, 255, 0, 0.7)',
      }}
    >
      <span className="blink">{text}</span>
    </div>
  );
}