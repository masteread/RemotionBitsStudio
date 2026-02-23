'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProjectStore } from '@/stores/project-store';
import { ExamplesDropdown } from './ExamplesDropdown';
import { Sparkles, Loader2 } from 'lucide-react';

export function PromptInput() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedSceneId = useProjectStore((s) => s.project.selectedSceneId);
  const setSceneStatus = useProjectStore((s) => s.setSceneStatus);
  const applyGeneratedScene = useProjectStore((s) => s.applyGeneratedScene);
  const updateScene = useProjectStore((s) => s.updateScene);
  const scenes = useProjectStore((s) => s.project.scenes);

  const addScene = useProjectStore((s) => s.addScene);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    const targetSceneId = selectedSceneId || addScene();

    setIsGenerating(true);
    setSceneStatus(targetSceneId, 'generating');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          projectContext: {
            sceneCount: scenes.length,
            fps: 30,
            width: 1920,
            height: 1080,
          },
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Generation failed');
      }

      const data = await res.json();
      applyGeneratedScene(targetSceneId, data.scene, prompt.trim());
      updateScene(targetSceneId, { generatedCode: data.code });
      setPrompt('');
    } catch (err) {
      setSceneStatus(
        targetSceneId,
        'error',
        err instanceof Error ? err.message : 'Unknown error'
      );
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

  return (
    <div className="border-t border-border bg-background p-3">
      <div className="mx-auto flex max-w-4xl items-end gap-2">
        <ExamplesDropdown onSelectPrompt={setPrompt} />
        <div className="relative flex-1">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedSceneId ? "Describe what you want to change in this scene..." : "Describe a new scene or click Get Inspired..."}
            className="min-h-[44px] resize-none text-sm pr-28 focus-visible:ring-brand/50"
            rows={1}
            disabled={isGenerating}
            aria-label="Scene prompt"
          />
          {!prompt && (
            <span className="pointer-events-none absolute bottom-3 right-3 text-[10px] text-muted-foreground/50 font-mono">
              {navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl'}+Enter
            </span>
          )}
        </div>
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="shrink-0 gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
          aria-label="Generate scene"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? 'Generating...' : selectedSceneId ? 'Modify' : 'Generate Scene'}
        </Button>
      </div>
    </div>
  );
}
