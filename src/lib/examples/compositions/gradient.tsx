import React from 'react';
import { GradientTransition } from 'remotion-bits';

// 1. Linear Gradient - Duration: 90
export const LinearGradient: React.FC = () => (
  <GradientTransition
    gradient={[
      'linear-gradient(0deg, #051226 0%, #1e0541 100%)',
      'linear-gradient(180deg, #a5d4dd 0%, #5674b1 100%)',
    ]}
    duration={90}
  />
);

// 2. Radial Gradient - Duration: 90
export const RadialGradient: React.FC = () => (
  <GradientTransition
    gradient={[
      'radial-gradient(circle at 20% 20%, #FDB813 0%, #78C0E0 60%)',
      'radial-gradient(circle at 80% 80%, #F5576C 0%, #2F2044 100%)',
    ]}
    duration={90}
  />
);

// 3. Conic Gradient - Duration: 60
export const ConicGradient: React.FC = () => (
  <GradientTransition
    gradient={[
      'conic-gradient(from 0deg, #000000, #009900)',
      'conic-gradient(from 359deg, #000000, #009900)',
    ]}
    easing="linear"
    shortestAngle={false}
    duration={60}
  />
);
