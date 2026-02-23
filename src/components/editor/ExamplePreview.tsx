'use client';

import React from 'react';
import { Player } from '@remotion/player';
import type { SceneExample } from '@/lib/examples/scene-examples';

interface ExamplePreviewProps {
  example: SceneExample;
}

export function ExamplePreview({ example }: ExamplePreviewProps) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <Player
        component={example.component}
        inputProps={{}}
        durationInFrames={example.durationInFrames}
        fps={30}
        compositionWidth={example.width ?? 1920}
        compositionHeight={example.height ?? 1080}
        style={{ width: 320, height: 180 }}
        autoPlay
        loop
        acknowledgeRemotionLicense
      />
    </div>
  );
}
