import React from 'react';
import { AbsoluteFill } from 'remotion';
import { AnimatedText, useViewportRect } from 'remotion-bits';

// 1. Fade In - Duration: 90
export const FadeIn: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <AnimatedText
      style={{ fontSize: 80, fontWeight: 'bold', color: '#fff' }}
      transition={{ opacity: [0, 1] }}
    >
      Hello World
    </AnimatedText>
  </AbsoluteFill>
);

// 2. Blur In - Duration: 90
export const BlurIn: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <AnimatedText
      transition={{
        y: [40, 0],
        blur: [10, 0],
        opacity: [0, 1],
        split: 'word',
        splitStagger: 1,
        easing: 'easeOutCubic',
      }}
      style={{ fontSize: 80, fontWeight: 'bold', color: '#fff' }}
    >
      Text Transition
    </AnimatedText>
  </AbsoluteFill>
);

// 3. Slide from Left - Duration: 90
export const SlideFromLeft: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <AnimatedText
      style={{ fontSize: 80, fontWeight: 'bold', color: '#fff' }}
      transition={{
        opacity: [0, 1],
        x: [-400, 0],
        easing: 'easeInOut',
      }}
    >
      Sliding Text
    </AnimatedText>
  </AbsoluteFill>
);

// 4. Word by Word - Duration: 120
export const WordByWord: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <AnimatedText
      style={{ fontSize: 72, fontWeight: 'bold', color: '#fff' }}
      transition={{
        y: [20, 0],
        opacity: [0, 1],
        split: 'word',
        splitStagger: 3,
        easing: 'easeOutQuad',
      }}
    >
      This appears word by word
    </AnimatedText>
  </AbsoluteFill>
);

// 5. Character by Character - Duration: 120
export const CharByChar: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <AnimatedText
      style={{ fontSize: 72, fontWeight: 'bold', color: '#fff' }}
      transition={{
        opacity: [0, 1],
        scale: [0.7, 1],
        y: [15, 0],
        duration: 10,
        split: 'character',
        splitStagger: 1,
        easing: 'easeOutCubic',
      }}
    >
      Character Animation
    </AnimatedText>
  </AbsoluteFill>
);

// 6. Glitch In - Duration: 90
export const GlitchIn: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <AnimatedText
      style={{ fontSize: 80, fontWeight: 'bold', color: '#0f0', fontFamily: 'monospace' }}
      transition={{
        glitch: [1, 0, 0.05, 0],
        duration: 45,
        opacity: [0, 1],
        frames: [0, 45],
      }}
    >
      SYSTEM ONLINE
    </AnimatedText>
  </AbsoluteFill>
);

// 7. Glitch Cycle - Duration: 240
export const GlitchCycle: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <AnimatedText
      style={{ fontSize: 72, fontWeight: 'bold', color: '#0f0', fontFamily: 'monospace' }}
      transition={{
        glitch: [1, 0, 0, 0.1, 0, 0, 1],
        duration: 60,
        cycle: {
          texts: ['INITIALIZING', 'LOADING ASSETS', 'SYSTEM ONLINE', 'WELCOME USER'],
          itemDuration: 60,
        },
      }}
    />
  </AbsoluteFill>
);
