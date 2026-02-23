import React from 'react';
import { Sequence } from 'remotion';
import { CodeBlock } from 'remotion-bits';
import type { CodeBlockElement } from '@/types/scene';

interface Props {
  element: CodeBlockElement;
}

export const CodeBlockRenderer: React.FC<Props> = ({ element }) => {
  const { config, startFrame, durationInFrames, position, zIndex } = element;

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames} layout="none">
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          zIndex,
        }}
      >
        <CodeBlock
          code={config.code}
          language={config.language}
          theme={config.theme}
          showLineNumbers={config.showLineNumbers}
          fontSize={config.fontSize}
          lineHeight={config.lineHeight}
          padding={config.padding}
        />
      </div>
    </Sequence>
  );
};
