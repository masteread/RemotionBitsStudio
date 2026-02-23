import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import {
  StaggeredMotion,
  useViewportRect,
  randomFloat,
  hold,
  steps,
  type EasingName,
  type EasingFunction,
} from 'remotion-bits';

// 1. Staggered Fade In - Duration: 90
export const StaggeredFadeIn: React.FC = () => {
  const boxStyle: React.CSSProperties = {
    width: 150,
    height: 150,
    borderRadius: '12px',
  };

  return (
    <AbsoluteFill
      style={{ backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}
    >
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          y: [100, 0],
          duration: 30,
          stagger: 5,
          staggerDirection: 'forward',
          easing: 'easeOutCubic',
        }}
        style={{ display: 'flex', gap: '2rem' }}
      >
        <div style={{ ...boxStyle, backgroundColor: '#3b82f6' }} />
        <div style={{ ...boxStyle, backgroundColor: '#ef4444' }} />
        <div style={{ ...boxStyle, backgroundColor: '#10b981' }} />
        <div style={{ ...boxStyle, backgroundColor: '#f59e0b' }} />
        <div style={{ ...boxStyle, backgroundColor: '#8b5cf6' }} />
      </StaggeredMotion>
    </AbsoluteFill>
  );
};

// 2. 3D Card Stack - Duration: 120 (1080x1080)
export const CardStack3D: React.FC = () => {
  const { vmin } = useViewportRect();
  const cardWidth = vmin * 30;
  const cardHeight = cardWidth * 1.5;
  const count = 8;
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      style={{
        position: 'relative',
        width: cardWidth,
        height: cardHeight,
        transformStyle: 'preserve-3d',
      }}
    >
      <StaggeredMotion
        transition={{
          y: [800, 0],
          frames: [0, 50],
          stagger: 3,
          easing: 'spring',
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
        }}
      >
        {cards.map((i) => {
          const angle = (i - (count - 1) / 2) * 8;
          const xOffset = (i - (count - 1) / 2) * 60;
          const zOffset = i * -10;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transformStyle: 'preserve-3d',
                zIndex: -i,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: i % 2 === 0 ? '#f6a45c' : '#68431e',
                  borderRadius: 24,
                  border: '4px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: cardWidth * 0.4,
                  transform: `translateZ(${zOffset}px) translateX(${xOffset}px) rotateZ(${angle}deg)`,
                }}
              >
                {i + 1}
              </div>
            </div>
          );
        })}
      </StaggeredMotion>
    </div>
  );
};

// 3. Grid Stagger - Duration: 90 (1080x1080)
export const GridStagger: React.FC = () => {
  const rect = useViewportRect();
  const cols = 4;
  const rows = 4;
  const count = cols * rows;
  const gap = 20;
  const padding = 60;
  const availableWidth = rect.width - padding * 2 - gap * (cols - 1);
  const availableHeight = rect.height - padding * 2 - gap * (rows - 1);
  const itemSize = Math.min(availableWidth / cols, availableHeight / rows);
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#09090b',
        color: '#e4e4e7',
        overflow: 'hidden',
      }}
    >
      <StaggeredMotion
        transition={{
          scale: [0, 1],
          opacity: [0, 1],
          frames: [0, 45],
          stagger: 3,
          staggerDirection: 'center',
          easing: 'spring',
        }}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${itemSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${itemSize}px)`,
          gap: gap,
        }}
      >
        {items.map((i) => (
          <div
            key={i}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: itemSize * 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: itemSize * 0.3,
              fontWeight: 'bold',
              color: 'rgba(255,255,255,0.8)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            }}
          >
            {i + 1}
          </div>
        ))}
      </StaggeredMotion>
    </div>
  );
};

// 4. List Reveal - Duration: 90 (1080x1080)
export const ListReveal: React.FC = () => {
  const { width } = useViewportRect();
  const items = [
    { title: 'Dashboard', icon: '\u{1F4CA}' },
    { title: 'Analytics', icon: '\u{1F4C8}' },
    { title: 'Settings', icon: '\u2699\uFE0F' },
    { title: 'Profile', icon: '\u{1F464}' },
    { title: 'Messages', icon: '\u{1F4AC}' },
    { title: 'Notifications', icon: '\u{1F514}' },
  ];
  const itemWidth = Math.min(width * 0.8, 600);
  const itemHeight = 80;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#09090b',
      }}
    >
      <StaggeredMotion transition={{ y: [200, -100], easing: 'easeInOutCubic' }}>
        <StaggeredMotion
          transition={{
            y: [50, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            frames: [0, 40],
            stagger: 3,
            staggerDirection: 'forward',
            easing: 'easeOutCubic',
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16, width: itemWidth }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                width: '100%',
                height: itemHeight,
                backgroundColor: '#27272a',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                gap: 16,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: 24 }}>{item.icon}</div>
              <div style={{ fontSize: 20, color: '#f4f4f5', fontWeight: 500, flex: 1 }}>
                {item.title}
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#52525b',
                }}
              />
            </div>
          ))}
        </StaggeredMotion>
      </StaggeredMotion>
    </div>
  );
};

// 5. Easings Visualizer - Duration: 90 (1080x1080)
export const EasingsVisualizer: React.FC = () => {
  type EasingItem = { label: string; value: EasingName | EasingFunction };

  const EASINGS: EasingItem[] = [
    { label: 'linear', value: 'linear' },
    { label: 'easeInQuad', value: 'easeInQuad' },
    { label: 'easeOutQuad', value: 'easeOutQuad' },
    { label: 'easeInOutQuad', value: 'easeInOutQuad' },
    { label: 'easeInCubic', value: 'easeInCubic' },
    { label: 'easeOutCubic', value: 'easeOutCubic' },
    { label: 'easeInOutCubic', value: 'easeInOutCubic' },
    { label: 'spring', value: 'spring' },
    { label: 'steps(5)', value: steps(5) },
  ];

  const { width, height } = useViewportRect();
  const labelWidth = Math.max(width * 0.2, 120);
  const trackWidth = width - labelWidth - 40;
  const verticalPadding = 40;
  const availableHeight = height - verticalPadding * 2;
  const itemHeight = availableHeight / EASINGS.length;
  const squareSize = Math.min(itemHeight * 0.6, 40);
  const travelDistance = trackWidth - squareSize;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `${verticalPadding}px 20px`,
        backgroundColor: '#09090b',
        color: '#e4e4e7',
        fontFamily: 'monospace',
        overflow: 'hidden',
      }}
    >
      {EASINGS.map((item, i) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: itemHeight,
            borderBottom: i < EASINGS.length - 1 ? '1px solid #27272a' : 'none',
          }}
        >
          <div
            style={{
              width: labelWidth,
              paddingRight: 10,
              fontSize: Math.min(itemHeight * 0.4, 16),
              opacity: 0.8,
            }}
          >
            {item.label}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <StaggeredMotion
              transition={{
                x: [0, travelDistance],
                frames: [0, 60],
                duration: 60,
                easing: item.value,
              }}
            >
              <div
                style={{
                  width: squareSize,
                  height: squareSize,
                  backgroundColor: '#3b82f6',
                  borderRadius: 4,
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                }}
              />
            </StaggeredMotion>
          </div>
        </div>
      ))}
    </div>
  );
};

// 6. Fracture Reassemble - Duration: 180 (1080x1080)
export const FractureReassemble: React.FC = () => {
  const ROWS = 5;
  const COLS = 5;
  const CENTER_ROW = 2;
  const SYMBOLS = ['\u25C8', '\u25C9', '\u25CE', '\u25CD', '\u25CC'];

  const rect = useViewportRect();
  const vmin = rect.vmin;
  const gap = vmin * 1.2;
  const tileSize = vmin * 14;
  const gridWidth = COLS * tileSize + (COLS - 1) * gap;
  const gridHeight = ROWS * tileSize + (ROWS - 1) * gap;

  const tileImage = (seed: number, size: number) =>
    `https://picsum.photos/seed/${seed}/${size}/${size}`;

  const tiles = Array.from({ length: ROWS * COLS }, (_, i) => {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const dx = randomFloat(`frac-x-${i}`, -vmin * 80, vmin * 80);
    const dy = randomFloat(`frac-y-${i}`, -vmin * 80, vmin * 80);
    const dz = randomFloat(`frac-z-${i}`, -vmin * 120, vmin * 20);
    const rotX = randomFloat(`frac-rx-${i}`, -180, 180);
    const rotY = randomFloat(`frac-ry-${i}`, -180, 180);
    const rotZ = randomFloat(`frac-rz-${i}`, -90, 90);
    const distFromCenter = Math.abs(row - 2) + Math.abs(col - 2);
    const staggerDelay = distFromCenter * 4;
    const x = col * (tileSize + gap);
    const y = row * (tileSize + gap);
    const imgSize = Math.round(tileSize);
    const symbol = row === CENTER_ROW ? SYMBOLS[col] : null;

    return (
      <StaggeredMotion
        key={i}
        transition={{
          x: [dx, 0, hold(60), dx],
          y: [dy, 0, hold(60), dy],
          z: [dz, 0, hold(60), dz],
          rotateX: [rotX, 0, hold(60), rotX],
          rotateY: [rotY, 0, hold(60), rotY],
          rotateZ: [rotZ, 0, hold(60), rotZ],
          opacity: [0, 1, hold(60), 0],
          frames: [0, 170],
          duration: 170,
          delay: staggerDelay,
          easing: 'easeInOutCubic',
        }}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: tileSize,
          height: tileSize,
          perspective: `${vmin * 100}px`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: vmin * 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: `0 0 0 ${vmin * 0.25}px #27272a`,
          }}
        >
          <img
            src={tileImage(i + 1, imgSize)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
            }}
          />
          {symbol && (
            <span
              style={{
                fontSize: tileSize * 0.55,
                fontWeight: 900,
                color: 'white',
                textShadow: '0 0 5px black',
                lineHeight: 1,
                position: 'relative',
              }}
            >
              {symbol}
            </span>
          )}
        </div>
      </StaggeredMotion>
    );
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#09090b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <StaggeredMotion
        transition={{ frames: [0, 1], stagger: 0 }}
        style={{
          position: 'relative',
          width: gridWidth,
          height: gridHeight,
          transformStyle: 'preserve-3d',
        }}
      >
        {tiles}
      </StaggeredMotion>
    </div>
  );
};

// 7. Mosaic Reframe - Duration: 270 (1080x1080)
export const MosaicReframe: React.FC = () => {
  const rect = useViewportRect();
  const frame = useCurrentFrame();
  const vmin = rect.vmin;
  const containerSize = vmin * 75;
  const gap = vmin * 1.5;
  const TILE_COUNT = 12;

  const tileImage = (seed: number, w: number, h: number) =>
    `https://picsum.photos/seed/${seed}/${Math.round(w)}/${Math.round(h)}`;

  interface TileConfig {
    x: number;
    y: number;
    w: number;
    h: number;
    rotate: number;
  }

  function buildConfigA(size: number, g: number): TileConfig[] {
    const cols = 4;
    const rows = 3;
    const tileW = (size - (cols - 1) * g) / cols;
    const tileH = (size - (rows - 1) * g) / rows;
    const configs: TileConfig[] = [];
    for (let i = 0; i < TILE_COUNT; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      configs.push({ x: col * (tileW + g), y: row * (tileH + g), w: tileW, h: tileH, rotate: 0 });
    }
    return configs;
  }

  function buildConfigB(size: number, g: number): TileConfig[] {
    const configs: TileConfig[] = [];
    const cols = 4;
    const rows = 3;
    const cellW = (size - (cols - 1) * g) / cols;
    const cellH = (size - (rows - 1) * g) / rows;
    const featureW = cellW * 2 + g;
    const featureH = cellH * 2 + g;
    configs.push({ x: 0, y: 0, w: featureW, h: featureH, rotate: 0 });
    const rightX = featureW + g;
    const rightW = (size - rightX - g) / 2;
    configs.push({ x: rightX, y: 0, w: rightW, h: cellH, rotate: 0 });
    configs.push({ x: rightX + rightW + g, y: 0, w: rightW, h: cellH, rotate: 0 });
    configs.push({ x: rightX, y: cellH + g, w: rightW, h: cellH, rotate: 0 });
    configs.push({ x: rightX + rightW + g, y: cellH + g, w: rightW, h: cellH, rotate: 0 });
    const bottomY = featureH + g;
    const bottomH = size - bottomY;
    const bottomCount = 7;
    const bottomTileW = (size - (bottomCount - 1) * g) / bottomCount;
    for (let i = 0; i < bottomCount; i++) {
      configs.push({ x: i * (bottomTileW + g), y: bottomY, w: bottomTileW, h: bottomH, rotate: 0 });
    }
    return configs;
  }

  function buildConfigC(size: number): TileConfig[] {
    const configs: TileConfig[] = [];
    const tileSize = size * 0.2;
    const step = (size - tileSize) / (TILE_COUNT - 1);
    for (let i = 0; i < TILE_COUNT; i++) {
      configs.push({ x: step * i, y: step * i, w: tileSize, h: tileSize, rotate: -15 + i * 3 });
    }
    return configs;
  }

  const configA = buildConfigA(containerSize, gap);
  const configB = buildConfigB(containerSize, gap);
  const configC = buildConfigC(containerSize);

  const tileConfigs = Array.from({ length: TILE_COUNT }, (_, i) => {
    const a = configA[i];
    const b = configB[i];
    const c = configC[i];
    const maxW = Math.max(a.w, b.w, c.w);
    const maxH = Math.max(a.h, b.h, c.h);
    return { index: i, a, b, c, maxW, maxH, depth: (i - (TILE_COUNT - 1) / 2) * vmin * 1.2 };
  });

  const opacity = interpolate(frame, [0, 20, 255, 270], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#09090b',
      }}
    >
      <div
        style={{
          width: containerSize,
          height: containerSize,
          position: 'relative',
          opacity,
          perspective: `${vmin * 120}px`,
          transformStyle: 'preserve-3d',
        }}
      >
        {tileConfigs.map((tile) => {
          const desiredW = interpolate(
            frame,
            [90 + tile.index * 2, 135 + tile.index * 2, 195 + tile.index * 2, 240 + tile.index * 2],
            [tile.a.w, tile.b.w, tile.b.w, tile.c.w],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * t * (3 - 2 * t) },
          );
          const desiredH = interpolate(
            frame,
            [90 + tile.index * 2, 135 + tile.index * 2, 195 + tile.index * 2, 240 + tile.index * 2],
            [tile.a.h, tile.b.h, tile.b.h, tile.c.h],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * t * (3 - 2 * t) },
          );

          return (
            <StaggeredMotion
              key={tile.index}
              transition={{
                x: [tile.a.x, tile.b.x, hold(60), tile.c.x],
                y: [tile.a.y, tile.b.y, hold(60), tile.c.y],
                rotate: [tile.a.rotate, tile.b.rotate, hold(60), tile.c.rotate],
                z: [0, 0, hold(60), tile.depth],
                rotateX: [0, 0, hold(60), -8],
                frames: [90, 240],
                duration: 150,
                delay: tile.index * 2,
                easing: 'easeInOutCubic',
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                willChange: 'transform',
              }}
            >
              <div
                style={{
                  width: tile.maxW,
                  height: tile.maxH,
                  borderRadius: vmin * 1.2,
                  overflow: 'hidden',
                  clipPath: `inset(0px ${tile.maxW - desiredW}px ${tile.maxH - desiredH}px 0px round ${vmin * 1.2}px)`,
                  boxShadow: `0 ${vmin * 0.4}px ${vmin * 1.5}px rgba(0,0,0,0.4)`,
                  willChange: 'clip-path',
                  backfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={tileImage(tile.index + 1, tile.maxW * 2, tile.maxH * 2)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                  }}
                />
              </div>
            </StaggeredMotion>
          );
        })}
      </div>
    </div>
  );
};
