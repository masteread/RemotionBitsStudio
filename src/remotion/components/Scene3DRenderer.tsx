import React from 'react';
import { Sequence } from 'remotion';
import { Scene3D, Step } from 'remotion-bits';
import type { Scene3DElement } from '@/types/scene';

interface Props {
  element: Scene3DElement;
}

export const Scene3DRenderer: React.FC<Props> = ({ element }) => {
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
        <Scene3D
          perspective={config.perspective}
          transitionDuration={config.transitionDuration}
          easing={config.easing}
          stepDuration={config.stepDuration}
          style={{ width: '100%', height: '100%' }}
        >
          {config.steps.map((step, i) => (
            <Step
              key={i}
              x={step.x}
              y={step.y}
              z={step.z}
              rotateX={step.rotateX}
              rotateY={step.rotateY}
              rotateZ={step.rotateZ}
              duration={step.duration}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  ...step.contentStyle,
                }}
              >
                {step.content}
              </div>
            </Step>
          ))}
        </Scene3D>
      </div>
    </Sequence>
  );
};
