import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { Scene } from '@/types/scene';
import { getRenderer } from './components/registry';

interface Props {
  scene: Scene;
}

export const SceneRenderer: React.FC<Props> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: scene.backgroundColor }}>
      {scene.elements.map((element) => {
        const Renderer = getRenderer(element.type);
        if (!Renderer) {
          console.warn(`No renderer found for type: ${element.type}`);
          return null;
        }
        return <Renderer key={element.id} element={element as never} />;
      })}
    </AbsoluteFill>
  );
};
