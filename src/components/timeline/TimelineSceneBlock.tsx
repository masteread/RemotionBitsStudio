'use client';

import React from 'react';
import type { Scene } from '@/types/scene';

const SCENE_COLORS = [
  { bg: 'bg-blue-500/30', border: 'border-blue-500/50', accent: 'bg-blue-400/60' },
  { bg: 'bg-purple-500/30', border: 'border-purple-500/50', accent: 'bg-purple-400/60' },
  { bg: 'bg-green-500/30', border: 'border-green-500/50', accent: 'bg-green-400/60' },
  { bg: 'bg-orange-500/30', border: 'border-orange-500/50', accent: 'bg-orange-400/60' },
  { bg: 'bg-pink-500/30', border: 'border-pink-500/50', accent: 'bg-pink-400/60' },
  { bg: 'bg-cyan-500/30', border: 'border-cyan-500/50', accent: 'bg-cyan-400/60' },
];

interface TimelineSceneBlockProps {
  scene: Scene;
  index: number;
  offsetFrame: number;
  pixelsPerFrame: number;
  isSelected: boolean;
  previewWidth?: number;
  isAnyResizing?: boolean;
  onSelect: (sceneId: string, e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onResizeStart: (sceneId: string, edge: 'left' | 'right', e: React.PointerEvent) => void;
}

export function TimelineSceneBlock({
  scene,
  index,
  offsetFrame,
  pixelsPerFrame,
  isSelected,
  previewWidth,
  isAnyResizing,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
  onResizeStart,
}: TimelineSceneBlockProps) {
  const color = SCENE_COLORS[index % SCENE_COLORS.length];
  const width = previewWidth ?? scene.durationInFrames * pixelsPerFrame;
  const left = offsetFrame * pixelsPerFrame;
  const showSubTracks = width > 100;

  const formatDuration = (frames: number) => {
    const s = frames / 30;
    return `${s.toFixed(1)}s`;
  };

  return (
    <div
      className={`absolute top-0 h-full cursor-pointer rounded border ${color.bg} ${color.border} ${
        isSelected ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''
      } ${scene.status === 'generating' ? 'animate-pulse' : ''} transition-shadow`}
      style={{ left, width, minWidth: 40 }}
      draggable={!isAnyResizing}
      onClick={(e) => onSelect(scene.id, e)}
      onDragStart={(e) => {
        if (isAnyResizing) { e.preventDefault(); return; }
        onDragStart(e, index);
      }}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
    >
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 z-10 h-full w-1.5 cursor-col-resize group"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onResizeStart(scene.id, 'left', e);
        }}
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <div className="h-full w-0.5 bg-transparent group-hover:bg-primary transition-colors" />
      </div>

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 z-10 h-full w-1.5 cursor-col-resize group"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onResizeStart(scene.id, 'right', e);
        }}
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <div className="ml-auto h-full w-0.5 bg-transparent group-hover:bg-primary transition-colors" />
      </div>

      {/* Shimmer overlay during generation */}
      {scene.status === 'generating' && (
        <div className="absolute inset-0 overflow-hidden rounded pointer-events-none">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      {/* Scene label */}
      <div className="flex h-5 items-center justify-between px-1.5">
        <span className="truncate text-[10px] font-medium">{scene.name}</span>
        {width > 60 && (
          <span className="shrink-0 text-[9px] text-muted-foreground">
            {formatDuration(scene.durationInFrames)}
          </span>
        )}
      </div>

      {/* Element sub-tracks */}
      {showSubTracks && scene.elements.length > 0 && (
        <div className="mt-0.5 space-y-px px-1">
          {scene.elements.slice(0, 4).map((el) => {
            const elLeft = (el.startFrame / scene.durationInFrames) * 100;
            const elWidth = (el.durationInFrames / scene.durationInFrames) * 100;
            return (
              <div key={el.id} className="relative h-2.5 overflow-hidden rounded-sm">
                <div
                  className={`absolute top-0 h-full rounded-sm ${color.accent}`}
                  style={{
                    left: `${elLeft}%`,
                    width: `${Math.min(elWidth, 100 - elLeft)}%`,
                  }}
                />
                {width > 150 && (
                  <span
                    className="absolute left-0 top-0 truncate px-0.5 text-[7px] leading-[10px] text-foreground/70"
                    style={{ marginLeft: `${elLeft}%` }}
                  >
                    {el.type}
                  </span>
                )}
              </div>
            );
          })}
          {scene.elements.length > 4 && (
            <span className="text-[7px] text-muted-foreground">
              +{scene.elements.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
