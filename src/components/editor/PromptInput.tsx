'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProjectStore } from '@/stores/project-store';
import { ExamplesDropdown } from './ExamplesDropdown';

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
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the scene you want to create... (Cmd+Enter to generate)"
          className="min-h-[44px] resize-none text-sm"
          rows={1}
          disabled={isGenerating}
        />
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="shrink-0"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </div>
  );
}
