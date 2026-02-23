import React from 'react';
import { Sequence } from 'remotion';
import { AnimatedText } from 'remotion-bits';
import type { AnimatedTextElement } from '@/types/scene';

interface Props {
  element: AnimatedTextElement;
}

export const AnimatedTextRenderer: React.FC<Props> = ({ element }) => {
  const { config, startFrame, durationInFrames, position, zIndex } = element;

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames} layout="none">
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          zIndex,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <AnimatedText
          transition={{
            split: config.split,
            splitStagger: config.splitStagger,
            duration: durationInFrames,
            easing: config.easing,
            ...config.animation,
            ...(config.glitch !== undefined ? { glitch: config.glitch } : {}),
            ...(config.cycle ? { cycle: config.cycle } : {}),
          }}
          style={{
            fontSize: config.fontSize,
            fontWeight: config.fontWeight,
            color: config.color,
          }}
        >
          {config.text}
        </AnimatedText>
      </div>
    </Sequence>
  );
};
