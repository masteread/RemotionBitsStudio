import React from 'react';
import { Sequence } from 'remotion';
import { StaggeredMotion } from 'remotion-bits';
import type { StaggeredMotionElement } from '@/types/scene';

interface Props {
  element: StaggeredMotionElement;
}

export const StaggeredMotionRenderer: React.FC<Props> = ({ element }) => {
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <StaggeredMotion
          transition={{
            stagger: config.stagger,
            staggerDirection: config.staggerDirection,
            duration: durationInFrames,
            easing: config.easing,
            ...config.animation,
          }}
        >
          {config.items.map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: config.fontSize,
                fontWeight: 600,
                color: config.color,
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </div>
          ))}
        </StaggeredMotion>
      </div>
    </Sequence>
  );
};
