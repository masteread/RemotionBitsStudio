'use client';

import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineToolbarProps {
  currentFrame: number;
  totalFrames: number;
  fps: number;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

function formatTimecode(frame: number, fps: number): string {
  const totalSeconds = frame / fps;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const sStr = s.toFixed(1).padStart(4, '0');
  return `${m}:${sStr}`;
}

export function TimelineToolbar({
  currentFrame,
  totalFrames,
  fps,
  zoom,
  onZoomIn,
  onZoomOut,
}: TimelineToolbarProps) {
  return (
    <div className="flex h-7 shrink-0 items-center justify-between border-b border-border px-3 text-xs">
      <span className="font-mono text-muted-foreground">
        {formatTimecode(currentFrame, fps)} / {formatTimecode(totalFrames, fps)}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
          aria-label="Zoom out timeline"
        >
          <ZoomOut className="size-3.5" />
        </Button>
        <span className="w-10 text-center font-mono text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onZoomIn}
          disabled={zoom >= 4}
          aria-label="Zoom in timeline"
        >
          <ZoomIn className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
