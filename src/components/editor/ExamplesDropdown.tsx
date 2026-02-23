'use client';

import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Lightbulb,
  Type,
  Keyboard,
  Palette,
  Sparkles,
  List,
  Film,
  Hash,
  Binary,
  Code,
  Columns3,
  Box,
} from 'lucide-react';
import { getCategories, type SceneExample } from '@/lib/examples/scene-examples';
import { ExamplePreview } from './ExamplePreview';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Type,
  Keyboard,
  Palette,
  Sparkles,
  List,
  Film,
  Hash,
  Binary,
  Code,
  Columns: Columns3,
  Box,
};

interface ExamplesDropdownProps {
  onSelectPrompt: (prompt: string) => void;
}

export function ExamplesDropdown({ onSelectPrompt }: ExamplesDropdownProps) {
  const [open, setOpen] = useState(false);
  const [hoveredExample, setHoveredExample] = useState<SceneExample | null>(null);
  const categories = getCategories();

  const handleSelect = (example: SceneExample) => {
    onSelectPrompt(example.prompt);
    setOpen(false);
    setHoveredExample(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          title="Ver ejemplos de efectos"
          aria-label="Browse effect examples"
        >
          <Lightbulb className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-auto max-w-[680px] p-0"
      >
        <div className="flex">
          {/* Left panel: categories and examples */}
          <ScrollArea className="h-[400px] w-[300px] border-r border-border">
            <div className="p-3">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Ejemplos de Efectos
              </h3>
              {categories.map((category) => {
                const Icon = iconMap[category.icon] || Sparkles;
                return (
                  <div key={category.name} className="mb-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {category.name}
                    </div>
                    {category.examples.map((example) => (
                      <button
                        key={example.label}
                        className="w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent"
                        onClick={() => handleSelect(example)}
                        onMouseEnter={() => setHoveredExample(example)}
                      >
                        <div className="font-medium text-foreground">{example.label}</div>
                        <div className="text-xs text-muted-foreground">{example.description}</div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Right panel: live preview */}
          <div className="flex w-[340px] items-center justify-center p-3">
            {hoveredExample ? (
              <div className="flex flex-col gap-2">
                <ExamplePreview example={hoveredExample} />
                <p className="text-center text-xs text-muted-foreground">
                  {hoveredExample.label}
                </p>
              </div>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Pasa el cursor sobre un ejemplo para ver el preview
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
