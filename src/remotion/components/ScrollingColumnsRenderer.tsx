import React from 'react';
import { Sequence } from 'remotion';
import type { ScrollingColumnsElement } from '@/types/scene';
import { ScrollingColumns } from 'remotion-bits';

interface Props {
  element: ScrollingColumnsElement;
}

export const ScrollingColumnsRenderer: React.FC<Props> = ({ element }) => {
  const { config, startFrame, durationInFrames, position, zIndex } = element;

  // Generate colored placeholder images as data URIs for the scrolling columns
  const columns = config.columns.map((col) => ({
    images: col.colors.map((color, i) => {
      const label = col.labels?.[i] ?? '';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="${color}"/><text x="100" y="108" text-anchor="middle" fill="white" font-size="18" font-family="sans-serif">${label}</text></svg>`;
      return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }),
    speed: col.speed,
    direction: col.direction,
  }));

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
          overflow: 'hidden',
        }}
      >
        <ScrollingColumns
          columns={columns}
          gap={config.gap}
          columnGap={config.columnGap}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </Sequence>
  );
};
