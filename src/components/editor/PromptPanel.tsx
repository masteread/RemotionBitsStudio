'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/project-store';
import { SceneCard } from '../scenes/SceneCard';

export function PromptPanel() {
  const scenes = useProjectStore((s) => s.project.scenes);
  const selectedSceneId = useProjectStore((s) => s.project.selectedSceneId);
  const addScene = useProjectStore((s) => s.addScene);
  const selectScene = useProjectStore((s) => s.selectScene);
  const multiSelectMode = useProjectStore((s) => s.multiSelectMode);
  const selectedSceneIds = useProjectStore((s) => s.selectedSceneIds);
  const toggleMultiSelectMode = useProjectStore((s) => s.toggleMultiSelectMode);
  const removeMultipleScenes = useProjectStore((s) => s.removeMultipleScenes);

  const selectionCount = selectedSceneIds.length;
  const canDelete = selectionCount > 0 && selectionCount < scenes.length;

  return (
    <div className="flex h-full flex-col border-r border-border overflow-hidden min-w-0">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Scenes
        </h2>
        <div className="flex items-center gap-1">
          {scenes.length > 1 && (
            <Button
              variant={multiSelectMode ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs"
              onClick={toggleMultiSelectMode}
            >
              {multiSelectMode ? 'Cancel' : 'Select'}
            </Button>
          )}
          {!multiSelectMode && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                addScene();
              }}
            >
              + New
            </Button>
          )}
        </div>
      </div>

      {multiSelectMode && (
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5 bg-muted/30 shrink-0">
          <span className="text-xs text-muted-foreground">
            {selectionCount} selected
          </span>
          <Button
            variant="destructive"
            size="xs"
            disabled={!canDelete}
            onClick={removeMultipleScenes}
          >
            Delete{selectionCount > 0 ? ` (${selectionCount})` : ''}
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1">
        {scenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="text-2xl">🎬</div>
            <p className="text-sm text-muted-foreground">
              No scenes yet
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => addScene()}
            >
              + Create your first scene
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1 p-2">
            {scenes.map((scene, index) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                index={index}
                isSelected={scene.id === selectedSceneId}
                onSelect={() => selectScene(scene.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
