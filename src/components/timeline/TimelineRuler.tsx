'use client';

import React, { useCallback } from 'react';

interface TimelineRulerProps {
  totalFrames: number;
  fps: number;
  pixelsPerFrame: number;
  scrollLeft: number;
  onSeek: (frame: number) => void;
}

export function TimelineRuler({
  totalFrames,
  fps,
  pixelsPerFrame,
  scrollLeft,
  onSeek,
}: TimelineRulerProps) {
  const totalWidth = totalFrames * pixelsPerFrame;
  const minorInterval = fps >= 60 ? 10 : 5;
  const majorInterval = fps; // 1 second

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left + scrollLeft;
      const frame = Math.round(x / pixelsPerFrame);
      onSeek(Math.max(0, Math.min(frame, totalFrames - 1)));
    },
    [pixelsPerFrame, scrollLeft, totalFrames, onSeek]
  );

  const marks: React.ReactNode[] = [];
  for (let f = 0; f <= totalFrames; f += minorInterval) {
    const isMajor = f % majorInterval === 0;
    const left = f * pixelsPerFrame;
    marks.push(
      <div
        key={f}
        className="absolute top-0"
        style={{ left }}
      >
        <div
          className={`${isMajor ? 'h-3 bg-muted-foreground/60' : 'h-1.5 bg-muted-foreground/30'}`}
          style={{ width: 1 }}
        />
        {isMajor && (
          <span className="absolute left-1 top-0 text-[9px] text-muted-foreground">
            {Math.floor(f / fps)}s
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative h-6 shrink-0 cursor-pointer border-b border-border bg-muted/30"
      onClick={handleClick}
    >
      <div className="relative h-full" style={{ width: totalWidth }}>
        {marks}
      </div>
    </div>
  );
}
