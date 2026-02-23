import React from 'react';
import { Sequence } from 'remotion';
import { MatrixRain } from 'remotion-bits';
import type { MatrixRainElement } from '@/types/scene';

interface Props {
  element: MatrixRainElement;
}

export const MatrixRainRenderer: React.FC<Props> = ({ element }) => {
  const { config, startFrame, durationInFrames, position, zIndex } = element;

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames} layout="none">
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          zIndex,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <MatrixRain
          fontSize={config.fontSize}
          color={config.color}
          speed={config.speed}
          density={config.density}
          streamLength={config.streamLength}
          charset={config.charset}
        />
      </div>
    </Sequence>
  );
};
