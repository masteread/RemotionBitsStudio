'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/project-store';
import { Copy, Check } from 'lucide-react';

const PLACEHOLDER = '// Select a scene and generate content\n// to see code here';

export function CodePanel() {
  const selectedSceneId = useProjectStore((s) => s.project.selectedSceneId);
  const scenes = useProjectStore((s) => s.project.scenes);
  const selectedScene = scenes.find((s) => s.id === selectedSceneId);
  const [copied, setCopied] = useState(false);

  const fullCode = selectedScene?.generatedCode || PLACEHOLDER;
  const status = selectedScene?.status;

  const [displayedCode, setDisplayedCode] = useState(fullCode);
  const [isStreaming, setIsStreaming] = useState(false);
  const wasGeneratingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track when generation starts — clear the panel and show cursor
  useEffect(() => {
    if (status === 'generating') {
      wasGeneratingRef.current = true;
      setDisplayedCode('');
      setIsStreaming(true);
    }
  }, [status]);

  // Handle code updates
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (wasGeneratingRef.current && status === 'ready' && fullCode && fullCode !== PLACEHOLDER) {
      // Fresh generation completed — stream the code in
      wasGeneratingRef.current = false;
      setDisplayedCode('');
      setIsStreaming(true);
      let index = 0;

      intervalRef.current = setInterval(() => {
        const chunk = Math.floor(Math.random() * 4) + 2;
        index = Math.min(index + chunk, fullCode.length);
        setDisplayedCode(fullCode.slice(0, index));

        if (index >= fullCode.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsStreaming(false);
        }
      }, 8);
    } else if (!wasGeneratingRef.current) {
      // Scene switch or initial load — show immediately
      setDisplayedCode(fullCode);
      setIsStreaming(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fullCode, status]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fullCode]);

  return (
    <div className="flex h-full flex-col border-l border-border overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Generated Code
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleCopy}
          disabled={!selectedScene?.generatedCode || isStreaming}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <pre className="p-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
          <code>{displayedCode}</code>
          {isStreaming && (
            <span className="inline-block w-[2px] h-[14px] bg-muted-foreground/70 align-middle animate-pulse ml-[1px]" />
          )}
        </pre>
      </ScrollArea>
    </div>
  );
}
