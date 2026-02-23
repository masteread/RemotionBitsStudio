'use client';

import React, { useEffect, useState } from 'react';
import { PromptPanel } from './PromptPanel';
import { PreviewPanel } from './PreviewPanel';
import { CodePanel } from './CodePanel';
import { Timeline } from '../timeline/Timeline';
import { PromptInput } from './PromptInput';
import { ExportDialog } from './ExportDialog';
import { useProjectStore } from '@/stores/project-store';
import { PanelRightClose, PanelRightOpen, Video } from 'lucide-react';
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
      <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
        {/* Skeleton header */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-muted animate-skeleton" />
            <div className="h-4 w-24 rounded bg-muted animate-skeleton" />
          </div>
          <div className="h-8 w-20 rounded bg-muted animate-skeleton" />
        </header>
        {/* Skeleton body */}
        <div className="flex-1 grid grid-cols-[260px_1fr_300px] overflow-hidden min-h-0">
          <div className="border-r border-border p-3 space-y-2">
            <div className="h-4 w-16 rounded bg-muted animate-skeleton" />
            <div className="h-16 w-full rounded bg-muted animate-skeleton" />
            <div className="h-16 w-full rounded bg-muted animate-skeleton" />
          </div>
          <div className="flex items-center justify-center">
            <div className="h-48 w-80 rounded bg-muted animate-skeleton" />
          </div>
          <div className="border-l border-border p-3 space-y-2">
            <div className="h-4 w-24 rounded bg-muted animate-skeleton" />
            <div className="h-3 w-full rounded bg-muted/60 animate-skeleton" />
            <div className="h-3 w-4/5 rounded bg-muted/60 animate-skeleton" />
            <div className="h-3 w-full rounded bg-muted/60 animate-skeleton" />
          </div>
        </div>
        {/* Skeleton timeline */}
        <div className="border-t border-border h-[120px] p-3">
          <div className="h-full w-full rounded bg-muted animate-skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-brand-foreground">
            <Video className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">
            Remotion AI
          </span>
          <span className="text-muted-foreground/40">|</span>
          <input
            className="bg-transparent text-sm text-muted-foreground outline-none rounded px-1.5 py-0.5 border border-transparent hover:border-border focus:border-brand/50 focus:text-foreground transition-colors"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            aria-label="Project name"
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportDialog />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground"
            onClick={() => setShowCode((v) => !v)}
            aria-label={showCode ? 'Hide code panel' : 'Show code panel'}
          >
            {showCode ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            {showCode ? 'Hide Code' : 'Show Code'}
          </Button>
        </div>
      </header>

      {/* Main panels - CSS grid layout */}
      <div className={`flex-1 grid overflow-hidden min-h-0 ${showCode ? 'grid-cols-[minmax(220px,260px)_1fr_minmax(240px,300px)]' : 'grid-cols-[minmax(220px,260px)_1fr]'}`}>
        <PromptPanel />
        <PreviewPanel />
        {showCode && <CodePanel />}
      </div>

      {/* Timeline */}
      <Timeline />

      {/* Prompt input */}
      <PromptInput />
    </div>
  );
}
