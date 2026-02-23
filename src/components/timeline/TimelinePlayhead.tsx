'use client';

import React, { useCallback, useRef } from 'react';

interface TimelinePlayheadProps {
  currentFrame: number;
  totalFrames: number;
  pixelsPerFrame: number;
  onSeek: (frame: number) => void;
}

export function TimelinePlayhead({
  currentFrame,
  totalFrames,
  pixelsPerFrame,
  onSeek,
}: TimelinePlayheadProps) {
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      // Walk up to find the scrollable track container
      const track = (e.target as HTMLElement).closest('[data-timeline-track]');
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollLeft = (track as HTMLElement).scrollLeft || 0;
      const x = e.clientX - rect.left + scrollLeft;
      const frame = Math.round(x / pixelsPerFrame);
      onSeek(Math.max(0, Math.min(frame, totalFrames - 1)));
    },
    [pixelsPerFrame, totalFrames, onSeek]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const left = currentFrame * pixelsPerFrame;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-30"
      style={{ left: 0 }}
    >
      <div
        className="pointer-events-auto absolute top-0 cursor-col-resize"
        style={{ left: left - 5, width: 11 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Triangle handle */}
        <div className="mx-auto h-0 w-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-red-500" />
      </div>
      {/* Vertical line */}
      <div
        className="pointer-events-none absolute top-0 h-full w-px bg-red-500"
        style={{ left }}
      />
    </div>
  );
}
