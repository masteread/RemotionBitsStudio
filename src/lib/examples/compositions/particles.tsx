import React from 'react';
import { AbsoluteFill } from 'remotion';
import {
  Particles,
  Spawner,
  Behavior,
  useViewportRect,
  resolvePoint,
  StaggeredMotion,
} from 'remotion-bits';

// 1. Snow - Duration: 300
export const Snow: React.FC = () => {
  const rect = useViewportRect();

  return (
    <AbsoluteFill style={{ backgroundColor: '#01050e' }}>
      <Particles>
        <Spawner
          rate={1}
          area={{ width: rect.width, height: 0 }}
          position={resolvePoint(rect, { x: 'center', y: -200 })}
          lifespan={200}
          startFrame={200}
          transition={{ opacity: [0, 1] }}
        >
          <div
            style={{
              width: rect.vmin * 1,
              height: rect.vmin * 1,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent 70%)',
            }}
          />
          <div
            style={{
              width: rect.vmin * 2,
              height: rect.vmin * 2,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(224,231,255,0.9), transparent 70%)',
            }}
          />
          <div
            style={{
              width: rect.vmin * 4,
              height: rect.vmin * 4,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(199,210,254,0.3), transparent 70%)',
            }}
          />
        </Spawner>
        <Behavior gravity={{ y: 0.1 }} />
        <Behavior wiggle={{ magnitude: 1, frequency: 0.5 }} />
        <Behavior handler={(p: { velocity: { x: number } }) => { p.velocity.x += 0.01; }} />
      </Particles>
    </AbsoluteFill>
  );
};

// 2. Fireflies - Duration: 300
export const Fireflies: React.FC = () => {
  const rect = useViewportRect();

  return (
    <Particles>
      <Spawner
        rate={0.2}
        max={200}
        area={{ width: rect.width, height: rect.height }}
        position={{ x: rect.width / 2, y: rect.height / 2 }}
        lifespan={100}
        velocity={{ x: 0.5, y: 0.5, varianceX: 1, varianceY: 1 }}
      >
        <StaggeredMotion transition={{ opacity: [0, 1, 0] }}>
          <div
            style={{
              width: rect.vmin,
              height: rect.vmin,
              borderRadius: '50%',
              backgroundColor: '#ccff00',
              boxShadow: `0 0 ${rect.vmin * 2}px ${rect.vmin * 1}px #ccff0099`,
            }}
          />
        </StaggeredMotion>
      </Spawner>
      <Behavior wiggle={{ magnitude: 2, frequency: 0.1 }} wiggleVariance={1} />
    </Particles>
  );
};

// 3. Particles Fountain - Duration: 180
export const ParticlesFountain: React.FC = () => {
  const rect = useViewportRect();

  return (
    <Particles>
      <Spawner
        rate={10}
        burst={20}
        position={resolvePoint(rect, { x: 'center', y: '110%' })}
        area={{ width: rect.width * 0.1, height: 0 }}
        velocity={{
          x: 0,
          y: -rect.height * 0.05,
          varianceX: rect.width * 0.1,
          varianceY: rect.height * 0.01,
        }}
        lifespan={100}
        startFrame={100}
        max={200}
      >
        <div
          style={{
            width: rect.vmax * 1,
            height: rect.vmax * 1,
            background: 'radial-gradient(circle, #ebb03b99, transparent 50%)',
          }}
        />
        <div
          style={{
            width: rect.vmax * 2,
            height: rect.vmax * 2,
            background: 'radial-gradient(circle, #ebb03b22, transparent 50%)',
          }}
        />
        <div
          style={{
            width: rect.vmax * 1.5,
            height: rect.vmax * 1.5,
            background: 'radial-gradient(circle, gray, transparent 50%)',
          }}
        />
        <div
          style={{
            width: rect.vmax * 30,
            height: rect.vmax * 30,
            background: 'radial-gradient(circle, rgba(176, 126, 223, 0.05), transparent 50%)',
          }}
        />
      </Spawner>
      <Behavior gravity={{ y: 0.2 }} />
    </Particles>
  );
};

// 4. Grid Particles - Duration: 200
export const GridParticles: React.FC = () => {
  const rect = useViewportRect();
  const gridSize = Math.floor(rect.width * 0.05);

  const snapToGridHandler = (p: { position: { x: number; y: number }; seed: number }, age: number) => {
    p.position.x = Math.floor(p.position.x / gridSize) * gridSize;
    p.position.y = Math.floor(p.position.y / gridSize) * gridSize;
    const jumpInterval = 30;
    if (age % jumpInterval === 0 && age > 0) {
      const step = Math.floor(age / jumpInterval);
      const dir = (p.seed + step) % 4;
      if (dir === 0) p.position.x += gridSize;
      if (dir === 1) p.position.x -= gridSize;
      if (dir === 2) p.position.y += gridSize;
      if (dir === 3) p.position.y -= gridSize;
    }
  };

  return (
    <Particles>
      <Spawner
        rate={1}
        area={{ width: rect.width * 0.52, height: rect.height * 0.74 }}
        position={rect.center}
        lifespan={150}
        max={50}
        transition={{ opacity: [0, 1], duration: 10 }}
      >
        <div
          style={{
            width: gridSize,
            height: gridSize,
            backgroundColor: '#ffffff22',
            opacity: 0.8,
          }}
        />
        <div
          style={{
            width: gridSize,
            height: gridSize,
            borderRadius: '50%',
            backgroundColor: '#ffffff5f',
            opacity: 0.8,
          }}
        />
        <div
          style={{
            width: gridSize,
            height: gridSize,
            transform: 'rotate(45deg) scale(0.75)',
            backgroundColor: '#ffffff5f',
            opacity: 0.8,
          }}
        />
      </Spawner>
      <Behavior handler={snapToGridHandler} />
    </Particles>
  );
};

// 5. Flying Through Words - Duration: 300
export const FlyingThroughWords: React.FC = () => {
  const rect = useViewportRect();
  const WORDS = [
    'GPT', 'Claude', 'PaLM', 'Gemini', 'LLaMA', 'Mistral',
    'Mixtral', 'Falcon', 'BLOOM', 'Kimi', 'MiniMax', 'Qwen',
  ];
  const isSmall = rect.width < 500;

  return (
    <Particles style={{ perspective: isSmall ? 1000 : 5000 }}>
      <Spawner
        rate={0.2}
        area={{ width: rect.width, height: rect.height, depth: -rect.vmin * 50 }}
        position={resolvePoint(rect, { x: 'center', y: 'center' })}
        lifespan={100}
        velocity={{ x: 0, y: 0, z: rect.vmin * 10, varianceZ: rect.vmin * 10 }}
      >
        {WORDS.map((word, i) => (
          <StaggeredMotion
            key={i}
            style={{ fontSize: rect.vmin * 10, textAlign: 'center' }}
            transition={{ opacity: [0, 1, 0.5, 0.2, 0] }}
          >
            {word}
          </StaggeredMotion>
        ))}
      </Spawner>
      <Behavior />
    </Particles>
  );
};
