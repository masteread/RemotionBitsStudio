import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Particles, Spawner, Behavior, StaggeredMotion } from 'remotion-bits';
import type { ParticleSystemElement, ParticleVariant } from '@/types/scene';

interface Props {
  element: ParticleSystemElement;
}

function buildParticleDiv(
  size: number,
  color: string,
  style: 'solid' | 'gradient' | 'glow',
  opacity?: number,
) {
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
  };

  if (opacity !== undefined) {
    base.opacity = opacity;
  }

  switch (style) {
    case 'gradient':
      base.background = `radial-gradient(circle, ${color}, transparent 70%)`;
      break;
    case 'glow':
      base.backgroundColor = color;
      base.boxShadow = `0 0 ${size * 2}px ${size}px ${color}99`;
      break;
    case 'solid':
    default:
      base.backgroundColor = color;
      break;
  }

  return base;
}

export const ParticleSystemRenderer: React.FC<Props> = ({ element }) => {
  const { config, startFrame, durationInFrames, position, zIndex } = element;

  const hasTextParticles = config.particleTexts && config.particleTexts.length > 0;
  const particleStyle = config.particleStyle ?? 'solid';

  // Build velocity object including variance if provided
  const velocity: { x: number; y: number; z?: number; varianceX?: number; varianceY?: number; varianceZ?: number } = {
    x: config.velocity.x,
    y: config.velocity.y,
  };
  if (config.velocity.z !== undefined) velocity.z = config.velocity.z;
  if (config.velocity.varianceX !== undefined) velocity.varianceX = config.velocity.varianceX;
  if (config.velocity.varianceY !== undefined) velocity.varianceY = config.velocity.varianceY;
  if (config.velocity.varianceZ !== undefined) velocity.varianceZ = config.velocity.varianceZ;

  // Build spawn area including depth if provided
  const area: { width: number; height: number; depth?: number } = {
    width: config.spawnArea.width,
    height: config.spawnArea.height,
  };
  if (config.spawnArea.depth !== undefined) area.depth = config.spawnArea.depth;

  // Determine particle variants to render
  const variants: ParticleVariant[] = config.particleVariants && config.particleVariants.length > 0
    ? config.particleVariants
    : [{ size: config.particleSize, color: config.particleColor, style: particleStyle }];

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames} layout="none">
      <AbsoluteFill style={{ zIndex }}>
        <Particles
          style={config.perspective ? { perspective: config.perspective } : undefined}
        >
          <Spawner
            rate={config.spawnRate}
            max={config.maxParticles}
            lifespan={config.particleLifespan}
            velocity={velocity}
            area={area}
            position={{ x: position.x, y: position.y }}
            startFrame={config.startFrame}
            transition={config.transition}
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
              variants.map((variant, i) => (
                <div
                  key={i}
                  style={buildParticleDiv(
                    variant.size,
                    variant.color,
                    variant.style,
                    variant.opacity,
                  )}
                />
              ))
            )}
          </Spawner>

          {/* Primary behavior: gravity, drag, opacity */}
          <Behavior
            gravity={config.gravity}
            drag={config.drag}
            opacity={hasTextParticles ? undefined : config.opacity}
          />

          {/* Wiggle behavior */}
          {config.wiggle && (
            <Behavior
              wiggle={{
                magnitude: config.wiggle.magnitude,
                frequency: config.wiggle.frequency,
              }}
            />
          )}

          {/* Drift behavior */}
          {config.drift && (
            <Behavior
              handler={(p: { velocity: { x: number; y: number } }) => {
                p.velocity.x += config.drift!.x;
                p.velocity.y += config.drift!.y;
              }}
            />
          )}
        </Particles>
      </AbsoluteFill>
    </Sequence>
  );
};
