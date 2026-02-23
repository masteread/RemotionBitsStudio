import React from 'react';
import { Sequence } from 'remotion';
import { Particles, Spawner, Behavior, StaggeredMotion } from 'remotion-bits';
import type { ParticleSystemElement } from '@/types/scene';

interface Props {
  element: ParticleSystemElement;
}

export const ParticleSystemRenderer: React.FC<Props> = ({ element }) => {
  const { config, startFrame, durationInFrames, position, zIndex } = element;

  const hasTextParticles = config.particleTexts && config.particleTexts.length > 0;

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames} layout="none">
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          zIndex,
          width: config.spawnArea.width,
          height: config.spawnArea.height,
          overflow: 'visible',
        }}
      >
        <Particles
          style={config.perspective ? { perspective: config.perspective } : undefined}
        >
          <Spawner
            rate={config.spawnRate}
            max={config.maxParticles}
            lifespan={config.particleLifespan}
            velocity={config.velocity}
            area={config.spawnArea}
          >
            {hasTextParticles ? (
              config.particleTexts!.map((word, i) => (
                <StaggeredMotion
                  key={i}
                  style={{
                    fontSize: config.particleFontSize || config.particleSize,
                    color: config.particleColor,
                    textAlign: 'center',
                  }}
                  transition={{
                    opacity: config.opacity,
                  }}
                >
                  {word}
                </StaggeredMotion>
              ))
            ) : (
              <div
                style={{
                  width: config.particleSize,
                  height: config.particleSize,
                  borderRadius: '50%',
                  backgroundColor: config.particleColor,
                }}
              />
            )}
          </Spawner>
          <Behavior
            gravity={config.gravity}
            drag={config.drag}
            opacity={hasTextParticles ? undefined : config.opacity}
          />
        </Particles>
      </div>
    </Sequence>
  );
};
