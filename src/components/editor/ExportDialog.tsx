'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/project-store';

export function ExportDialog() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const scenes = useProjectStore((s) => s.project.scenes);
  const fps = useProjectStore((s) => s.project.fps);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setError(null);

    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes, fps }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Export failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.mp4';
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            {scenes.length} scene(s) · {fps} FPS · 1920×1080
          </div>

          {isExporting && (
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Rendering...</p>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {progress === 100 && (
            <p className="text-sm text-green-400">Export complete!</p>
          )}

          <Button
            onClick={handleExport}
            disabled={isExporting || scenes.length === 0}
            className="w-full"
          >
            {isExporting ? 'Exporting...' : 'Export MP4'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
