import React from 'react';
import { Sequence } from 'remotion';
import { TypeWriter } from 'remotion-bits';
import type { TypeWriterElement } from '@/types/scene';

interface Props {
  element: TypeWriterElement;
}

export const TypeWriterRenderer: React.FC<Props> = ({ element }) => {
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
          color: config.color,
          whiteSpace: 'nowrap',
        }}
      >
        <TypeWriter
          text={config.text}
          typeSpeed={config.typeSpeed}
          deleteSpeed={config.deleteSpeed}
          pauseAfterType={config.pauseAfterType}
          cursor={config.cursor}
          loop={config.loop}
          errorRate={config.errorRate}
        />
      </div>
    </Sequence>
  );
};
