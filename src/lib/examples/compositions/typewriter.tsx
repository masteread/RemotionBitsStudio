import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { TypeWriter, CodeBlock, useViewportRect } from 'remotion-bits';

// 1. Basic Typewriter - Duration: 150
export const BasicTypewriter: React.FC = () => {
  const { vmin } = useViewportRect();
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <TypeWriter
        text="Ah, those sunny days!"
        style={{ fontSize: vmin * 8 }}
        cursor={true}
      />
    </AbsoluteFill>
  );
};

// 2. CLI Simulation - Duration: 450
export const CLISimulation: React.FC = () => {
  const { vmin } = useViewportRect();
  return (
    <div
      style={{
        width: '100%', height: '100%', display: 'flex',
        backgroundColor: '#1e1e1e',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: '#d4d4d4', padding: vmin * 10, fontSize: vmin * 3,
        lineHeight: 1.5, alignItems: 'flex-start', justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: vmin, width: '100%' }}>
        <div style={{ display: 'flex' }}>
          <span style={{ color: '#4ec9b0', marginRight: vmin * 1.5 }}>➜</span>
          <span style={{ color: '#569cd6', marginRight: vmin * 1.5 }}>~</span>
          <TypeWriter
            text="npm install remotion-bits"
            transition={{ duration: 100, delay: 0 }}
            typeSpeed={3} deleteSpeed={1} cursor={true}
            showCursorAfterComplete={false}
            style={{ color: '#ce9178' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TypeWriter
            text={[
              '\u2714 Package found\n',
              '\u2714 Dependencies resolved\n',
              '\u2714 Installing...\n',
              'Done in 1.4s',
            ]}
            transition={{ delay: 90 }}
            typeSpeed={0.5} deleteSpeed={0} pauseAfterType={20}
            pauseAfterDelete={0} loop={false} cursor={false}
            deleteBeforeNext={false}
          />
        </div>
      </div>
    </div>
  );
};

// 3. Multi-Text Typewriter - Duration: 300
export const MultiTextTypewriter: React.FC = () => {
  const { vmin } = useViewportRect();
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <TypeWriter
        text={['First sentence.', 'Second longer sentence.', 'Looping...']}
        style={{ fontSize: vmin * 7, fontWeight: 'bold', fontFamily: 'monospace' }}
        typeSpeed={3} deleteSpeed={1} pauseAfterType={40}
        pauseAfterDelete={20} loop
      />
    </AbsoluteFill>
  );
};

// 4. Variable Speed Typewriter - Duration: 400
export const VariableSpeedTypewriter: React.FC = () => {
  const { vmin } = useViewportRect();
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <TypeWriter
        text="Typing with errors and variable speed..."
        style={{
          fontSize: vmin * 6, fontFamily: 'monospace',
          color: '#ff6b6b', fontWeight: 'bold',
        }}
        typeSpeed={[2, 10, 2]}
        errorRate={0.1} errorCorrectDelay={10}
        cursor={<span>_</span>} blinkSpeed={20}
      />
    </AbsoluteFill>
  );
};

// 5. Typing Code Block - Duration: 180
export const TypingCodeBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const rect = useViewportRect();
  const fullCode = `const App = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = \`Count: \${count}\`;
    }, [count]);

    return (
        <button onClick={() => setCount(c => c + 1)}>
             Clicked {count} times
        </button>
    );
};`;
  const typingSpeed = 0.3;
  const charIndex = Math.floor(frame / typingSpeed);
  const currentCode = fullCode.slice(0, charIndex);
  const showCursor = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1e1e1e', alignItems: 'center', justifyContent: 'center' }}>
      <CodeBlock
        code={currentCode + (showCursor ? '|' : ' ')}
        language="typescript"
        showLineNumbers
        theme="dark"
        fontSize={rect.width * 0.02}
        style={{ width: '80%' }}
      />
    </AbsoluteFill>
  );
};
