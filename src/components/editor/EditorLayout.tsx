'use client';

import React, { useEffect, useState } from 'react';
import { PromptPanel } from './PromptPanel';
import { PreviewPanel } from './PreviewPanel';
import { CodePanel } from './CodePanel';
import { Timeline } from '../timeline/Timeline';
import { PromptInput } from './PromptInput';
import { useProjectStore } from '@/stores/project-store';
import { Code, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EditorLayout() {
  const projectName = useProjectStore((s) => s.project.name);
  const setProjectName = useProjectStore((s) => s.setProjectName);
  const [showCode, setShowCode] = useState(true);

  // Handle Zustand hydration from localStorage
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-tight text-primary">
            Remotion AI
          </span>
          <input
            className="bg-transparent text-sm text-muted-foreground outline-none focus:text-foreground"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
      </header>

      {/* Main panels - CSS grid layout */}
      <div className="flex-1 grid grid-cols-[minmax(220px,260px)_1fr_minmax(240px,300px)] overflow-hidden min-h-0">
        <PromptPanel />
        <PreviewPanel />
        <CodePanel />
      </div>

      {/* Timeline */}
      <Timeline />

      {/* Prompt input */}
      <PromptInput />
    </div>
  );
}
