import React from 'react';
import { Sequence } from 'remotion';
import { GradientTransition } from 'remotion-bits';
import type { GradientTransitionElement } from '@/types/scene';

interface Props {
  element: GradientTransitionElement;
}

export const GradientTransitionRenderer: React.FC<Props> = ({ element }) => {
  const { config, startFrame, durationInFrames, position, zIndex } = element;

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames} layout="none">
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          zIndex,
          width: config.width,
          height: config.height,
        }}
      >
        <GradientTransition
          gradient={config.gradients}
          duration={durationInFrames}
          easing={config.easing}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </Sequence>
  );
};
