import React from 'react';
import { Sequence } from 'remotion';
import { AnimatedCounter } from 'remotion-bits';
import type { AnimatedCounterElement } from '@/types/scene';

interface Props {
  element: AnimatedCounterElement;
}

export const AnimatedCounterRenderer: React.FC<Props> = ({ element }) => {
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
          fontSize: config.fontSize,
          fontWeight: config.fontWeight,
          color: config.color,
          whiteSpace: 'nowrap',
        }}
      >
        <AnimatedCounter
          transition={{
            values: config.values,
            duration: durationInFrames,
            easing: config.easing,
          }}
          prefix={config.prefix}
          postfix={config.postfix}
          toFixed={config.toFixed}
        />
      </div>
    </Sequence>
  );
};
