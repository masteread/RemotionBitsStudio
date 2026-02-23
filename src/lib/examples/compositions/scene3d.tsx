import React, { useMemo } from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Scene3D,
  Step,
  Element3D,
  useViewportRect,
  StaggeredMotion,
  TypeWriter,
  Particles,
  Spawner,
  randomFloat,
  anyElement,
} from 'remotion-bits';

// 1. Basic 3D Scene - Duration: 150
export const Basic3DScene: React.FC = () => {
  const rect = useViewportRect();
  const fontSize = rect.vmin * 8;

  return (
    <Scene3D
      perspective={1000}
      transitionDuration={50}
      stepDuration={50}
      easing="easeInOutCubic"
    >
      <Step
        id="1"
        x={0}
        y={0}
        z={0}
        transition={{ opacity: [0, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <h1 style={{ fontSize }}>Control</h1>
      </Step>
      <Step
        id="2"
        x={0}
        y={rect.vmin * 10}
        z={rect.vmin * 200}
        transition={{ opacity: [0, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <h1
          style={{
            fontSize,
            background: 'white',
            color: 'black',
            padding: `${rect.vmin * 1}px ${rect.vmin * 4}px`,
          }}
        >
          Camera
        </h1>
      </Step>
      <Step
        id="3"
        x={0}
        y={rect.vmin * 20}
        z={rect.vmin * 400}
        transition={{ opacity: [0, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <h1 style={{ fontSize }}>Action</h1>
      </Step>
    </Scene3D>
  );
};

// 2. 3D Elements - Duration: 200
export const Elements3D: React.FC = () => {
  const rect = useViewportRect();
  const fontSize = rect.vmin * 8;
  const words = ['Fly', 'Your', 'Camera', 'Through', 'Space'];

  const els = useMemo(() => {
    const sizes = [16, 32];
    const cellSize = rect.vmin * 2;

    return Array(20)
      .fill(0)
      .map((_, i) => {
        const x =
          Math.round(randomFloat(`element3d-x-${i}`, -50 * rect.vw, 200 * rect.vw) / cellSize) *
          cellSize;
        const y =
          Math.round(randomFloat(`element3d-y-${i}`, -100 * rect.vh, 20 * rect.vh) / cellSize) *
          cellSize;
        const z =
          Math.round(
            randomFloat(`element3d-z-${i}`, -200 * rect.vmin, 20 * rect.vmin) / cellSize,
          ) * cellSize;
        let probes = 0;
        const getSize = () => anyElement(`el3d-size-${i}-${probes++}`, sizes) * rect.vmin;

        return (
          <Element3D key={i} x={x} y={y} z={z} rotateZ={0.0001}>
            <StaggeredMotion transition={{ opacity: [0, 0.2] }}>
              {(() => {
                const shapes = ['circle', 'triangle', 'diamond'];
                const shape = anyElement(`el3d-shape-${i}-${probes++}`, shapes);
                const color = `hsl(${randomFloat(`el3d-color-${i}-${probes++}`, 0, 360)}, 80%, 60%)`;
                const dimension = getSize() * 1.25;

                if (shape === 'triangle') {
                  return (
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: `${dimension / 2}px solid transparent`,
                        borderRight: `${dimension / 2}px solid transparent`,
                        borderBottom: `${dimension}px solid ${color}`,
                      }}
                    />
                  );
                }
                if (shape === 'diamond') {
                  return (
                    <div
                      style={{
                        background: color,
                        width: dimension,
                        height: dimension,
                        transform: 'rotate(45deg)',
                      }}
                    />
                  );
                }
                return (
                  <div
                    style={{
                      background: color,
                      width: dimension,
                      height: dimension,
                      borderRadius: '50%',
                    }}
                  />
                );
              })()}
            </StaggeredMotion>
          </Element3D>
        );
      });
  }, [rect.width, rect.height]);

  return (
    <Scene3D
      perspective={rect.width > 500 ? 1000 : 500}
      transitionDuration={20}
      stepDuration={20}
      easing="easeInOut"
    >
      {els}
      {words.map((word, i) => (
        <Step
          id={`step-${i}`}
          key={i}
          x={i * rect.vmin * 50}
          y={0}
          z={0}
          rotateZ={-i * 30}
          style={{ width: '250px' }}
          exitTransition={{ opacity: [1, 0], duration: 15 }}
        >
          <StaggeredMotion
            transition={{
              y: [rect.vmin * 15, 0],
              opacity: [0, 1],
              easing: 'easeOutCubic',
              duration: 15,
            }}
            style={{ fontSize: rect.vmin * 10 }}
          >
            <h1 style={{ fontSize, color: 'currentColor', textAlign: 'center' }}>{word}</h1>
          </StaggeredMotion>
        </Step>
      ))}
    </Scene3D>
  );
};

// 3. 3D Carousel - Duration: 300
export const Carousel3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rect = useViewportRect();
  const radius = rect.vmin * 60;
  const count = 8;
  const cardWidth = rect.vmin * 40;
  const cardHeight = rect.vmin * 40;
  const rotationSpeed = 360 / (fps * 10);
  const baseRotation = frame * rotationSpeed;

  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        angle: i * (360 / count) + baseRotation,
      })),
    [count, baseRotation],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      <Scene3D perspective={1000} stepDuration={30}>
        <Step id="0" />
        <Step id="1" z={-rect.vmin * 100} rotateZ={180} />
        <Step id="3" />
        {items.map((item) => {
          const angleRad = (item.angle * Math.PI) / 180;
          const x = Math.sin(angleRad) * radius;
          const z = Math.cos(angleRad) * radius;

          return (
            <Element3D key={item.id} x={x} y={0} z={z} rotateY={item.angle} centered>
              <div
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  backgroundColor: '#60a5fa',
                  borderRadius: rect.vmin,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: rect.vmin * 4,
                  fontWeight: 'bold',
                  boxShadow: `0 ${rect.vmin}px ${rect.vmin * 10}px rgba(0,0,0,0.5)`,
                }}
              >
                {item.id + 1}
              </div>
            </Element3D>
          );
        })}
      </Scene3D>
    </AbsoluteFill>
  );
};

// 4. Cube Navigation 3D - Duration: 480
export const CubeNavigation: React.FC = () => {
  const { vmin } = useViewportRect();
  const size = vmin * 35;
  const distance = size * 0.8;

  const FaceContent: React.FC<{ color: string; title: string; faceSize: number }> = ({
    color,
    title,
    faceSize,
  }) => (
    <div
      style={{
        width: faceSize,
        height: faceSize,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `${faceSize * 0.02}px solid ${color}`,
        boxShadow: '0 0 40px rgba(0,0,0,0.3) inset',
      }}
    >
      <h1 style={{ fontSize: faceSize * 0.15 }}>{title}</h1>
    </div>
  );

  const faces = useMemo(
    () => [
      { id: 'front', color: '#27272a', title: 'TEXT', rot: [0, 0, 0], pos: [0, 0, size / 2] },
      { id: 'right', color: '#18181b', title: 'MOTION', rot: [0, 90, 90], pos: [size / 2, 0, 0] },
      {
        id: 'back',
        color: '#27272a',
        title: 'PARTICLES',
        rot: [0, 180, 180],
        pos: [0, 0, -size / 2],
      },
      {
        id: 'left',
        color: '#18181b',
        title: 'GRADIENTS',
        rot: [0, -90, -90],
        pos: [-size / 2, 0, 0],
      },
      { id: 'top', color: '#3b82f6', title: '3D', rot: [90, 0, 0], pos: [0, -size / 2, 0] },
      {
        id: 'bottom',
        color: '#3b82f6',
        title: 'BITS',
        rot: [-90, 0, 0],
        pos: [0, size / 2, 0],
      },
    ],
    [size],
  );

  const isoDist = size * 1.5;
  const isoStep = useMemo(() => {
    const offset = isoDist / Math.sqrt(3);
    return {
      id: 'iso-view',
      x: offset,
      y: -offset,
      z: offset,
      rotateX: 35.264,
      rotateY: 45,
      rotateZ: 0,
      rotateOrder: 'yxz' as const,
    };
  }, [isoDist]);

  const getCameraStep = (face: (typeof faces)[0]) => {
    let x = face.pos[0];
    let y = face.pos[1];
    let z = face.pos[2];
    const [rx, ry] = face.rot;

    if (Math.abs(rx) === 90) {
      y += (rx > 0 ? -1 : 1) * distance;
    } else if (Math.abs(ry) === 90) {
      x += (ry > 0 ? 1 : -1) * distance;
    } else if (Math.abs(ry) === 180) {
      z -= distance;
    } else {
      z += distance;
    }

    return {
      id: `step-${face.id}`,
      x,
      y,
      z,
      rotateX: face.rot[0],
      rotateY: face.rot[1],
      rotateZ: face.rot[2],
    };
  };

  return (
    <Scene3D
      perspective={2000}
      transitionDuration={40}
      stepDuration={60}
      easing="easeInOutCubic"
      style={{ background: '#111' }}
    >
      {faces.map((face) => (
        <Element3D
          key={face.id}
          centered
          x={face.pos[0]}
          y={face.pos[1]}
          z={face.pos[2]}
          rotateX={face.rot[0]}
          rotateY={face.rot[1]}
          rotateZ={face.rot[2]}
        >
          <FaceContent color={face.color} title={face.title} faceSize={size} />
        </Element3D>
      ))}
      <Step transition={{ opacity: [0, 1] }} {...isoStep} id="start" />
      {faces.map((face) => {
        const cam = getCameraStep(face);
        return (
          <Step
            key={`s-${face.id}`}
            id={cam.id}
            x={cam.x}
            y={cam.y}
            z={cam.z}
            rotateX={cam.rotateX}
            rotateY={cam.rotateY}
            rotateZ={cam.rotateZ}
          />
        );
      })}
      <Step {...isoStep} id="end" />
    </Scene3D>
  );
};

// 5. Ken Burns Effect - Duration: 300
export const KenBurns: React.FC = () => {
  const rect = useViewportRect();
  const frameWidth = rect.vmin * 177.78;
  const frameHeight = rect.vmin * 100;
  const xShift = rect.vmin * 4.63;
  const yShift = rect.vmin * 5.56;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Scene3D stepDuration={60} transitionDuration={60}>
        <Step
          id="0"
          z={0}
          duration={100}
          transition={{ opacity: [0, 1] }}
          exitTransition={{ opacity: [1, 0] }}
        >
          <StaggeredMotion
            style={{ width: frameWidth, height: frameHeight }}
            transition={{ scale: [1.1, 1.4], x: [0, xShift], duration: 100 }}
          >
            <Img
              src="https://picsum.photos/seed/1/1920/1080"
              style={{ width: frameWidth, height: frameHeight, objectFit: 'cover' }}
            />
          </StaggeredMotion>
        </Step>
        <Step
          id="1"
          z={-10}
          duration={100}
          transition={{ opacity: [0, 1] }}
          exitTransition={{ opacity: [1, 0] }}
        >
          <StaggeredMotion
            style={{ width: frameWidth, height: frameHeight }}
            transition={{ scale: [1.3, 1.1], x: [-xShift, 0], duration: 100 }}
          >
            <Img
              src="https://picsum.photos/seed/2/1920/1080"
              style={{ width: frameWidth, height: frameHeight, objectFit: 'cover' }}
            />
          </StaggeredMotion>
        </Step>
        <Step
          id="2"
          z={-20}
          duration={100}
          transition={{ opacity: [0, 1] }}
          exitTransition={{ opacity: [1, 0] }}
        >
          <StaggeredMotion
            style={{ width: frameWidth, height: frameHeight }}
            transition={{ scale: [1.0, 1.2], y: [yShift, -yShift], duration: 100 }}
          >
            <Img
              src="https://picsum.photos/seed/4/1920/1080"
              style={{ width: frameWidth, height: frameHeight, objectFit: 'cover' }}
            />
          </StaggeredMotion>
        </Step>
      </Scene3D>
    </AbsoluteFill>
  );
};

// 6. 3D Terminal - Duration: 300
export const Terminal3D: React.FC = () => {
  const rect = useViewportRect();
  const termWidth = rect.width * 0.4;
  const termHeight = rect.height * 0.5;

  const TerminalWindow = ({
    title,
    children,
    width,
    height,
  }: {
    title: string;
    children: React.ReactNode;
    width: number;
    height: number;
  }) => {
    const fs = width * 0.04;
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: '#18181b',
          borderRadius: width * 0.02,
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #3f3f46',
        }}
      >
        <div
          style={{
            height: width * 0.08,
            backgroundColor: '#27272a',
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${width * 0.02}px`,
            borderBottom: '1px solid #3f3f46',
          }}
        >
          <div style={{ display: 'flex', gap: width * 0.015 }}>
            <div
              style={{
                width: width * 0.03,
                height: width * 0.03,
                borderRadius: '50%',
                backgroundColor: '#ff5f56',
              }}
            />
            <div
              style={{
                width: width * 0.03,
                height: width * 0.03,
                borderRadius: '50%',
                backgroundColor: '#ffbd2e',
              }}
            />
            <div
              style={{
                width: width * 0.03,
                height: width * 0.03,
                borderRadius: '50%',
                backgroundColor: '#27c93f',
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              color: 'currentColor',
              fontSize: fs * 0.8,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: width * 0.04,
            color: 'currentColor',
            fontSize: fs,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <Scene3D
      perspective={1000}
      transitionDuration={40}
      stepDuration={60}
      easing="easeInOutCubic"
    >
      <Step id="main">
        <StaggeredMotion
          transition={{
            duration: 120,
            rotateY: [-5, 5],
            rotateX: [-5, 5],
            easing: 'easeInOutCubic',
          }}
          style={{ transformStyle: 'preserve-3d', perspective: rect.width * 2 }}
        >
          <TerminalWindow title="user@dev:~/project" width={termWidth} height={termHeight}>
            <span style={{ color: '#4caf50' }}>{'\u2794'}</span>{' '}
            <span style={{ color: '#64b5f6' }}>~/project</span>{' '}
            <span style={{ color: '#f44336' }}>git</span> status
            {'\n'}
            <TypeWriter
              text={[
                "On branch main\nYour branch is up to date with 'origin/main'.\n\nworking tree clean",
              ]}
              typeSpeed={1}
              pauseAfterType={30}
              cursor={false}
            />
          </TerminalWindow>
        </StaggeredMotion>
      </Step>

      <Step id="side" x={rect.width * 0.8} y={0} z={150} rotateY={-45}>
        <StaggeredMotion
          transition={{
            duration: 100,
            rotateY: [5, -5],
            rotateX: [5, -5],
            easing: 'easeInOutCubic',
          }}
          style={{ transformStyle: 'preserve-3d', perspective: rect.width * 2 }}
        >
          <TerminalWindow title="server-logs" width={termWidth} height={termHeight}>
            <div style={{ color: '#81c784' }}>[INFO] Server started on port 3000</div>
            <TypeWriter
              text={[
                '[INFO] Connected to database\n[WARN] High memory usage detected\n[INFO] Request handled in 23ms',
              ]}
              typeSpeed={2}
              pauseAfterType={10}
              cursor
            />
          </TerminalWindow>
        </StaggeredMotion>
      </Step>

      <Step id="top" x={rect.width * 0.8} y={-rect.height * 0.8} z={150}>
        <StaggeredMotion
          transition={{
            duration: 100,
            rotateY: [5, -5],
            rotateX: [5, -5],
            easing: 'easeInOutCubic',
          }}
          style={{ transformStyle: 'preserve-3d', perspective: rect.width * 2 }}
        >
          <TerminalWindow title="build-process" width={termWidth} height={termHeight}>
            <TypeWriter
              text={[
                '> build project\n> transpile modules\n> optimize assets\n\nBuild successful! \u2728',
              ]}
              typeSpeed={1}
              cursor
            />
          </TerminalWindow>
        </StaggeredMotion>
      </Step>
    </Scene3D>
  );
};

// 7. Scrolling Columns - Duration: 300
export const ScrollingColumns3D: React.FC = () => {
  const rect = useViewportRect();
  const { durationInFrames } = useVideoConfig();

  const columns = [
    { x: -rect.width * 0.3, speed: 4, color: '#ef4444', z: 50 },
    { x: -rect.width * 0.1, speed: 7, color: '#3b82f6', z: 0 },
    { x: rect.width * 0.1, speed: 5, color: '#10b981', z: 100 },
    { x: rect.width * 0.3, speed: 6, color: '#f59e0b', z: -50 },
  ];

  const itemWidth = rect.width * 0.15;
  const itemHeight = itemWidth * 1.2;

  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    width: rect.width,
    height: rect.height,
    left: -rect.width / 2,
    top: -rect.height / 2,
  };

  const cardColors = [
    '#ef4444', '#f87171', '#fca5a5',
    '#3b82f6', '#60a5fa', '#93c5fd',
    '#10b981', '#34d399', '#6ee7b7',
    '#f59e0b', '#fbbf24', '#fcd34d',
    '#8b5cf6', '#a78bfa', '#c4b5fd',
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#111827' }}>
      <Scene3D
        perspective={2000}
        transitionDuration={durationInFrames}
        stepDuration={1}
        activeStep={1}
        easing="easeIn"
      >
        <Step id="start" x={-rect.width * 0.2} y={rect.height * 1.5} scale={0.85} />
        <Step id="end" x={rect.width * 0.5} y={rect.height * 1.2} scale={1.0} />
        <div style={wrapperStyle}>
          <Particles>
            {columns.map((col, i) => {
              const rate = col.speed / (itemHeight + 30);
              return (
                <Spawner
                  key={i}
                  rate={rate}
                  position={{
                    x: col.x + rect.width / 2 - itemWidth / 2,
                    y: -rect.height * 0.15,
                    z: col.z,
                  }}
                  velocity={{ x: 0, y: col.speed, z: 0 }}
                  lifespan={durationInFrames + 200}
                  startFrame={150}
                >
                  {cardColors.map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: itemWidth,
                        height: itemHeight,
                        backgroundColor: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: itemWidth * 0.2,
                        borderRadius: itemWidth * 0.05,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        border: '2px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {(idx % 9) + 1}
                    </div>
                  ))}
                </Spawner>
              );
            })}
          </Particles>
        </div>
      </Scene3D>
    </AbsoluteFill>
  );
};

// 8. Remotion Bits Showcase - Duration: 150
export const RemotionBitsShowcase: React.FC = () => {
  const rect = useViewportRect();

  return (
    <Scene3D perspective={1000} transitionDuration={40} stepDuration={40} easing="easeInOutCubic">
      <Step
        id="intro"
        z={rect.vmin * 50}
        transition={{ opacity: [0, 1], scale: [0.5, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <StaggeredMotion
          transition={{
            y: [rect.vmin * 10, 0],
            opacity: [0, 1],
            blur: [15, 0],
            duration: 30,
            stagger: 2,
            easing: 'easeOutCubic',
          }}
        >
          <h1
            style={{
              fontSize: rect.vmin * 12,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #6366f1, #ec4899, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
            }}
          >
            Remotion Bits
          </h1>
        </StaggeredMotion>
      </Step>
      <Step
        id="tagline"
        z={0}
        transition={{ opacity: [0, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <StaggeredMotion
          transition={{
            y: [30, 0],
            opacity: [0, 1],
            duration: 25,
            stagger: 3,
            easing: 'easeOutCubic',
          }}
        >
          <h2
            style={{
              fontSize: rect.vmin * 5,
              fontWeight: 400,
              color: '#a1a1aa',
              textAlign: 'center',
            }}
          >
            Animation primitives for Remotion
          </h2>
        </StaggeredMotion>
      </Step>
      <Step
        id="end"
        z={-rect.vmin * 50}
        transition={{ opacity: [0, 1], scale: [1.5, 1] }}
      >
        <h1
          style={{
            fontSize: rect.vmin * 8,
            fontWeight: 700,
            color: '#e4e4e7',
            textAlign: 'center',
          }}
        >
          {'\u2728'} Start Building
        </h1>
      </Step>
    </Scene3D>
  );
};
