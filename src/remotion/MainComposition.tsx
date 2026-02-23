import React from 'react';
import { Series } from 'remotion';
import type { Scene } from '@/types/scene';
import { SceneRenderer } from './SceneRenderer';

interface Props {
  scenes?: Scene[];
}

export const MainComposition: React.FC<Props> = ({ scenes = [] }) => {
  if (scenes.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111',
          color: '#666',
          fontSize: 24,
          fontFamily: 'sans-serif',
        }}
      >
        No scenes yet. Write a prompt to get started.
      </div>
    );
  }

  return (
    <Series>
      {scenes.map((scene) => (
        <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
          <SceneRenderer scene={scene} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
