'use client';

import React from 'react';
import { useProjectStore } from '@/stores/project-store';
import { SceneCard } from './SceneCard';

export function SceneList() {
  const scenes = useProjectStore((s) => s.project.scenes);
  const selectedSceneId = useProjectStore((s) => s.project.selectedSceneId);
  const selectScene = useProjectStore((s) => s.selectScene);

  return (
    <div className="flex flex-col gap-1">
      {scenes.map((scene, index) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          index={index}
          isSelected={scene.id === selectedSceneId}
          onSelect={() => selectScene(scene.id)}
        />
      ))}
    </div>
  );
}
