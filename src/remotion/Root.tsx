import React from 'react';
import { Composition } from 'remotion';
import { MainComposition } from './MainComposition';
import type { Scene } from '@/types/scene';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="main"
      component={MainComposition}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        scenes: [] as Scene[],
      }}
    />
  );
};
