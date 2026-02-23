import React from 'react';
import { MatrixRain as MatrixRainBit, CodeBlock, useViewportRect } from 'remotion-bits';

// 1. Matrix Rain - Duration: 300
export const MatrixRainComp: React.FC = () => (
  <MatrixRainBit
    fontSize={30}
    color="#00FF41"
    speed={1}
    density={1}
    streamLength={15}
  />
);

// 2. Basic Code Block - Duration: 120
export const BasicCodeBlock: React.FC = () => {
  const rect = useViewportRect();
  const code = `function hello() {
  console.log("Hello World");
  return true;
}`;

  return (
    <CodeBlock
      code={code}
      language="typescript"
      showLineNumbers
      transition={{
        duration: 30,
        lineStagger: 5,
        opacity: [0, 1],
        y: [10, 0],
      }}
      fontSize={rect.width * 0.025}
    />
  );
};
