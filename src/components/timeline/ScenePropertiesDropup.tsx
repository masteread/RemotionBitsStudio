'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Sparkles, PenLine, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  const applyGeneratedScene = useProjectStore((s) => s.applyGeneratedScene);
  const setSceneStatus = useProjectStore((s) => s.setSceneStatus);
  const scenes = useProjectStore((s) => s.project.scenes);
  const fps = useProjectStore((s) => s.project.fps);
  const panelRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<'select' | 'prompt' | 'manual'>('select');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setSceneStatus(scene.id, 'generating');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          projectContext: {
            sceneCount: scenes.length,
            fps,
            width: 1920,
            height: 1080,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Generation failed');
      }

      const data = await res.json();
      applyGeneratedScene(scene.id, data.scene, prompt.trim());
      updateScene(scene.id, { generatedCode: data.code });
      setPrompt('');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setSceneStatus(scene.id, 'error', message);
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

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
        <div className="flex items-center gap-1.5 truncate">
          {mode !== 'select' && (
            <button
              onClick={() => setMode('select')}
              className="rounded p-0.5 hover:bg-muted"
              aria-label="Back to mode selection"
            >
              <ArrowLeft className="size-3.5" />
            </button>
          )}
          <span className="truncate text-xs font-semibold">
            {mode === 'select' && scene.name}
            {mode === 'prompt' && 'Change with Prompt'}
            {mode === 'manual' && 'Manual Editing'}
          </span>
        </div>
        <button onClick={onClose} className="rounded p-0.5 hover:bg-muted" aria-label="Close properties">
          <X className="size-3.5" />
        </button>
      </div>

      {/* Select mode */}
      {mode === 'select' && (
        <div className="p-3 space-y-2">
          <button
            onClick={() => setMode('prompt')}
            className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-left hover:bg-muted transition-colors"
          >
            <Sparkles className="size-5 shrink-0 text-purple-500" />
            <div>
              <div className="text-sm font-medium">Change with Prompt</div>
              <div className="text-xs text-muted-foreground">Use AI to modify this scene</div>
            </div>
          </button>
          <button
            onClick={() => setMode('manual')}
            className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-left hover:bg-muted transition-colors"
          >
            <PenLine className="size-5 shrink-0 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Manual Editing</div>
              <div className="text-xs text-muted-foreground">Edit properties directly</div>
            </div>
          </button>
        </div>
      )}

      {/* Prompt mode */}
      {mode === 'prompt' && (
        <div className="p-3 space-y-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe how to change this scene... (Cmd+Enter to generate)"
            className="min-h-[80px] resize-none text-sm"
            rows={3}
            disabled={isGenerating}
          />
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
            size="sm"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      )}

      {/* Manual mode */}
      {mode === 'manual' && (
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
      )}
    </div>
  );
}
