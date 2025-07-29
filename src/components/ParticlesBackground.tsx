'use client';

import React, { useState, useEffect } from 'react';

type Particle = {
  id: number;
  width: string;
  height: string;
  top: string;
  left: string;
  opacity: number;
  animation: string;
  animationDelay: string;
};

export default function ParticlesBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles only on the client side
    const generatedParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      width: `${Math.random() * 4 + 1}px`,
      height: `${Math.random() * 4 + 1}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5,
      animation: `float ${Math.random() * 10 + 10}s linear infinite`,
      animationDelay: `${Math.random() * 10}s`
    }));
    
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <div 
          key={`p-${particle.id}`} 
          className="absolute rounded-full bg-white/30 blur-sm"
          style={{
            width: particle.width,
            height: particle.height,
            top: particle.top,
            left: particle.left,
            opacity: particle.opacity,
            animation: particle.animation,
            animationDelay: particle.animationDelay
          }}
        ></div>
      ))}
    </div>
  );
}