'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PropertyField } from './PropertyField';
import { ElementEditor } from './ElementEditor';
import { useProjectStore } from '@/stores/project-store';
import type { Scene, SceneElement } from '@/types/scene';

interface ScenePropertiesDropupProps {
  scene: Scene;
  anchorRect: DOMRect;
  onClose: () => void;
}

export function ScenePropertiesDropup({ scene, anchorRect, onClose }: ScenePropertiesDropupProps) {
  const updateScene = useProjectStore((s) => s.updateScene);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // Delay to avoid the triggering click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleKey);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const updateField = useCallback(
    (key: keyof Scene, value: unknown) => {
      updateScene(scene.id, { [key]: value } as Partial<Scene>);
    },
    [scene.id, updateScene]
  );

  const handleElementUpdate = useCallback(
    (updatedElement: SceneElement) => {
      const elements = scene.elements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      );
      updateScene(scene.id, { elements });
    },
    [scene.id, scene.elements, updateScene]
  );

  // Position the panel above the anchor
  const panelWidth = 320;
  let left = anchorRect.left + anchorRect.width / 2 - panelWidth / 2;
  // Clamp to viewport
  left = Math.max(8, Math.min(left, window.innerWidth - panelWidth - 8));
  const bottom = window.innerHeight - anchorRect.top + 8;

  return (
    <div
      ref={panelRef}
      className="fixed z-50 flex w-80 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-xl"
      style={{ left, bottom, maxHeight: '50vh' }}
    >
      {/* Header */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-border px-3">
        <span className="truncate text-xs font-semibold">{scene.name}</span>
        <button onClick={onClose} className="rounded p-0.5 hover:bg-muted">
          <X className="size-3.5" />
        </button>
      </div>

      <Tabs defaultValue="scene" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="mx-2 mt-2 h-7 shrink-0">
          <TabsTrigger value="scene" className="h-6 text-xs">Scene</TabsTrigger>
          <TabsTrigger value="elements" className="h-6 text-xs">
            Elements ({scene.elements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scene" className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-2">
          <div className="space-y-1.5">
            <PropertyField
              label="Name"
              type="text"
              value={scene.name}
              onChange={(v) => updateField('name', v)}
            />
            <PropertyField
              label="Duration (frames)"
              type="number"
              value={scene.durationInFrames}
              min={1}
              onChange={(v) => updateField('durationInFrames', v)}
            />
            <PropertyField
              label="Background"
              type="color"
              value={scene.backgroundColor}
              onChange={(v) => updateField('backgroundColor', v)}
            />
          </div>
        </TabsContent>

        <TabsContent value="elements" className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-2">
          {scene.elements.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No elements in this scene
            </p>
          ) : (
            <div className="space-y-1.5">
              {scene.elements.map((el) => (
                <ElementEditor
                  key={el.id}
                  element={el}
                  onUpdate={handleElementUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
