'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/project-store';
import { Copy, Check, Save } from 'lucide-react';

const PLACEHOLDER = '// Select a scene and generate content\n// to see code here';

/** Lightweight regex-based syntax colorizer for JSX/TS code */
function colorizeCode(code: string): React.ReactNode[] {
  const rules: Array<{ pattern: RegExp; className: string }> = [
    // Comments (single-line)
    { pattern: /(\/\/[^\n]*)/g, className: 'text-muted-foreground/60 italic' },
    // Strings (double/single/template)
    { pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, className: 'text-green-400' },
    // JSX closing tags like </div>
    { pattern: /(<\/)([\w.]+)(>)/g, className: '__jsx_close__' },
    // JSX self-closing tags like <Component />
    { pattern: /(<)([\w.]+)([^>]*?)(\/?>)/g, className: '__jsx_open__' },
    // Numbers
    { pattern: /\b(\d+\.?\d*)\b/g, className: 'text-amber-400' },
    // Keywords
    { pattern: /\b(const|let|var|function|return|import|export|from|default|if|else|for|while|new|typeof|instanceof|class|extends|interface|type|async|await|try|catch|throw|switch|case|break|continue)\b/g, className: 'text-purple-400' },
  ];

  // Simple approach: tokenize line by line, apply first matching rule
  const lines = code.split('\n');
  const result: React.ReactNode[] = [];

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (li > 0) result.push('\n');

    // Find all matches with positions
    const tokens: Array<{ start: number; end: number; node: React.ReactNode }> = [];

    for (const rule of rules) {
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(line)) !== null) {
        if (rule.className === '__jsx_close__') {
          // </tag>
          tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            node: (
              <span key={`${li}-${match.index}`}>
                <span className="text-muted-foreground/60">&lt;/</span>
                <span className="text-red-400">{match[2]}</span>
                <span className="text-muted-foreground/60">&gt;</span>
              </span>
            ),
          });
        } else if (rule.className === '__jsx_open__') {
          // <Tag ... > or <Tag ... />
          tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            node: (
              <span key={`${li}-${match.index}`}>
                <span className="text-muted-foreground/60">&lt;</span>
                <span className="text-blue-400">{match[2]}</span>
                <span>{match[3]}</span>
                <span className="text-muted-foreground/60">{match[4]}</span>
              </span>
            ),
          });
        } else {
          tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            node: (
              <span key={`${li}-${match.index}`} className={rule.className}>
                {match[0]}
              </span>
            ),
          });
        }
      }
    }

    // Sort by start, remove overlaps (first match wins)
    tokens.sort((a, b) => a.start - b.start);
    const filtered: typeof tokens = [];
    let lastEnd = 0;
    for (const tok of tokens) {
      if (tok.start >= lastEnd) {
        filtered.push(tok);
        lastEnd = tok.end;
      }
    }

    // Build the line
    let pos = 0;
    for (const tok of filtered) {
      if (tok.start > pos) {
        result.push(line.slice(pos, tok.start));
      }
      result.push(tok.node);
      pos = tok.end;
    }
    if (pos < line.length) {
      result.push(line.slice(pos));
    }
  }

  return result;
}

export function CodePanel() {
  const selectedSceneId = useProjectStore((s) => s.project.selectedSceneId);
  const scenes = useProjectStore((s) => s.project.scenes);
  const updateScene = useProjectStore((s) => s.updateScene);
  const selectedScene = scenes.find((s) => s.id === selectedSceneId);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableCode, setEditableCode] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fullCode = selectedScene?.generatedCode || PLACEHOLDER;
  const status = selectedScene?.status;
  const isPlaceholder = !selectedScene?.generatedCode;

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
      setIsEditing(false);
      setHasUnsavedChanges(false);
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
      if (!isEditing) {
        setEditableCode(fullCode);
        setHasUnsavedChanges(false);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullCode, status]);

  // Sync editable code when switching scenes
  useEffect(() => {
    setEditableCode(fullCode);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  }, [selectedSceneId, fullCode]);

  const colorized = useMemo(() => colorizeCode(displayedCode), [displayedCode]);

  const handleCopy = useCallback(async () => {
    const codeToCopy = isEditing ? editableCode : fullCode;
    await navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fullCode, editableCode, isEditing]);

  const handleStartEditing = useCallback(() => {
    if (isStreaming || isPlaceholder) return;
    setEditableCode(fullCode);
    setIsEditing(true);
    setHasUnsavedChanges(false);
    // Focus textarea after render
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [isStreaming, isPlaceholder, fullCode]);

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableCode(e.target.value);
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedSceneId || !hasUnsavedChanges) return;
    updateScene(selectedSceneId, { generatedCode: editableCode });
    setHasUnsavedChanges(false);
  }, [selectedSceneId, editableCode, hasUnsavedChanges, updateScene]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+S to save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    // Escape to exit editing
    if (e.key === 'Escape') {
      setIsEditing(false);
      if (hasUnsavedChanges) {
        setEditableCode(fullCode);
        setHasUnsavedChanges(false);
      }
    }
    // Tab inserts 2 spaces instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = editableCode.substring(0, start) + '  ' + editableCode.substring(end);
      setEditableCode(newValue);
      setHasUnsavedChanges(true);
      // Restore cursor position after React re-render
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  }, [handleSave, hasUnsavedChanges, fullCode, editableCode]);

  return (
    <div className="flex h-full flex-col border-l border-border overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isEditing ? 'Edit Code' : 'Generated Code'}
          </h2>
          {hasUnsavedChanges && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {isEditing && hasUnsavedChanges && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleSave}
              aria-label="Save code changes"
              title="Save (Cmd+S)"
            >
              <Save className="h-3.5 w-3.5 text-amber-400" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopy}
            disabled={isPlaceholder || isStreaming}
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="flex-1 w-full p-3 text-xs leading-relaxed text-muted-foreground bg-transparent resize-none outline-none font-mono whitespace-pre overflow-auto min-h-0"
          value={editableCode}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!hasUnsavedChanges) setIsEditing(false);
          }}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      ) : (
        <ScrollArea className="flex-1 overflow-hidden min-h-0">
          <pre
            className="p-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap break-words [word-break:break-word] max-w-full cursor-text"
            onClick={handleStartEditing}
            title={!isStreaming && !isPlaceholder ? 'Click to edit code' : undefined}
          >
            <code className="block">{colorized}</code>
            {isStreaming && (
              <span className="inline-block w-[2px] h-[14px] bg-brand/70 align-middle animate-pulse ml-[1px]" />
            )}
          </pre>
        </ScrollArea>
      )}
    </div>
  );
}
