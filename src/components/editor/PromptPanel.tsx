'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/project-store';
import { SceneCard } from '../scenes/SceneCard';
import { Video, Sparkles, Plus } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-muted">
              <Video className="h-6 w-6 text-brand" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Start creating</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Add a scene or describe one with AI
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-xs border-dashed"
                onClick={() => addScene()}
              >
                <Plus className="h-3.5 w-3.5" />
                Empty scene
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-xs border-dashed text-brand hover:text-brand"
                onClick={() => {
                  addScene();
                  // Focus the prompt input
                  const textarea = document.querySelector<HTMLTextAreaElement>('textarea[aria-label="Scene prompt"]');
                  textarea?.focus();
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate with AI
              </Button>
            </div>
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
