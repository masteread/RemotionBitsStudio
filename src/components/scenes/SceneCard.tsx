'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useProjectStore } from '@/stores/project-store';
import type { Scene } from '@/types/scene';

interface Props {
  scene: Scene;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const statusColors: Record<Scene['status'], string> = {
  idle: 'bg-muted text-muted-foreground',
  generating: 'bg-yellow-500/20 text-yellow-400',
  ready: 'bg-green-500/20 text-green-400',
  error: 'bg-red-500/20 text-red-400',
};

export function SceneCard({ scene, index, isSelected, onSelect }: Props) {
  const removeScene = useProjectStore((s) => s.removeScene);
  const multiSelectMode = useProjectStore((s) => s.multiSelectMode);
  const selectedSceneIds = useProjectStore((s) => s.selectedSceneIds);
  const toggleSceneSelection = useProjectStore((s) => s.toggleSceneSelection);

  const isChecked = selectedSceneIds.includes(scene.id);

  const handleClick = () => {
    if (multiSelectMode) {
      toggleSceneSelection(scene.id);
    } else {
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`group w-full rounded-md border p-2 text-left transition-colors cursor-pointer overflow-hidden ${
        multiSelectMode && isChecked
          ? 'border-destructive/50 bg-destructive/10'
          : isSelected && !multiSelectMode
            ? 'border-primary/50 bg-primary/10'
            : 'border-transparent hover:border-border hover:bg-muted/50'
      }`}
    >
      {/* Top row: checkbox + index + name + remove */}
      <div className="flex items-center gap-1.5">
        {multiSelectMode && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => toggleSceneSelection(scene.id)}
            onClick={(e) => e.stopPropagation()}
            className="h-3.5 w-3.5 shrink-0 rounded border-border accent-destructive cursor-pointer"
          />
        )}
        <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs font-medium">{scene.name}</span>
        {!multiSelectMode && (
          <span
            role="button"
            tabIndex={0}
            className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded text-xs opacity-0 group-hover:opacity-100 hover:bg-muted cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              removeScene(scene.id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                removeScene(scene.id);
              }
            }}
          >
            ×
          </span>
        )}
      </div>

      {/* Prompt preview */}
      {scene.prompt && (
        <p className="mt-1 truncate text-[11px] text-muted-foreground">
          {scene.prompt}
        </p>
      )}

      {/* Bottom row: meta + status badge */}
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground">
          {scene.durationInFrames}f · {scene.elements.length} elem
        </span>
        <Badge variant="outline" className={`shrink-0 text-[10px] px-1.5 py-0 leading-4 ${statusColors[scene.status]}`}>
          {scene.status}
        </Badge>
      </div>
    </div>
  );
}
