'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useProjectStore } from '@/stores/project-store';
import { TimelineToolbar } from './TimelineToolbar';
import { TimelineRuler } from './TimelineRuler';
import { TimelinePlayhead } from './TimelinePlayhead';
import { TimelineSceneBlock } from './TimelineSceneBlock';
import { ScenePropertiesDropup } from './ScenePropertiesDropup';
import { Film } from 'lucide-react';
import type { Scene } from '@/types/scene';

const BASE_PPF = 4; // base pixels per frame at 1x zoom

export function Timeline() {
  const scenes = useProjectStore((s) => s.project.scenes);
  const selectedSceneId = useProjectStore((s) => s.project.selectedSceneId);
  const fps = useProjectStore((s) => s.project.fps);
  const currentFrame = useProjectStore((s) => s.currentFrame);
  const selectScene = useProjectStore((s) => s.selectScene);
  const removeScene = useProjectStore((s) => s.removeScene);
  const reorderScenes = useProjectStore((s) => s.reorderScenes);
  const resizeScene = useProjectStore((s) => s.resizeScene);
  const requestSeek = useProjectStore((s) => s.requestSeek);

  const [zoom, setZoom] = useState(1);
  const [dropupScene, setDropupScene] = useState<Scene | null>(null);
  const [dropupAnchor, setDropupAnchor] = useState<DOMRect | null>(null);
  const [dropupInitialMode, setDropupInitialMode] = useState<'select' | 'prompt' | 'manual'>('select');
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  // Resize state
  const [resizeState, setResizeState] = useState<{
    sceneId: string;
    edge: 'left' | 'right';
    startX: number;
    originalDuration: number;
  } | null>(null);
  const [resizePreviewWidth, setResizePreviewWidth] = useState<number | null>(null);
  const resizeRef = useRef(resizeState);
  resizeRef.current = resizeState;
  const resizePreviewRef = useRef(resizePreviewWidth);
  resizePreviewRef.current = resizePreviewWidth;
  const justResizedRef = useRef(false);

  const pixelsPerFrame = BASE_PPF * zoom;

  const totalFrames = useMemo(
    () => Math.max(1, scenes.reduce((sum, s) => sum + s.durationInFrames, 0)),
    [scenes]
  );

  // Cumulative offsets per scene
  const offsets = useMemo(() => {
    const result: number[] = [];
    let acc = 0;
    for (const scene of scenes) {
      result.push(acc);
      acc += scene.durationInFrames;
    }
    return result;
  }, [scenes]);

  const totalWidth = totalFrames * pixelsPerFrame;

  // Zoom
  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(4, z + 0.25)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(0.5, z - 0.25)), []);

  // Seek
  const handleSeek = useCallback(
    (frame: number) => {
      requestSeek(frame);
    },
    [requestSeek]
  );

  // Scene selection + dropup
  const handleSceneSelect = useCallback(
    (sceneId: string, e: React.MouseEvent) => {
      if (justResizedRef.current) {
        justResizedRef.current = false;
        return;
      }
      selectScene(sceneId);
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDropupScene(scene);
      setDropupAnchor(rect);
      setDropupInitialMode('select');
    },
    [scenes, selectScene]
  );

  const handleCloseDropup = useCallback(() => {
    setDropupScene(null);
    setDropupAnchor(null);
    setDropupInitialMode('select');
  }, []);

  const handleDelete = useCallback(
    (sceneId: string) => {
      removeScene(sceneId);
      handleCloseDropup();
    },
    [removeScene, handleCloseDropup]
  );

  const handleModify = useCallback(
    (sceneId: string, mode: 'prompt' | 'manual', anchorRect: DOMRect) => {
      selectScene(sceneId);
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;
      setDropupScene(scene);
      setDropupAnchor(anchorRect);
      setDropupInitialMode(mode);
    },
    [scenes, selectScene]
  );

  // Drag and drop reorder
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, toIndex: number) => {
      e.preventDefault();
      const fromIndex = dragIndexRef.current;
      if (fromIndex === null || fromIndex === toIndex) return;
      reorderScenes(fromIndex, toIndex);
      dragIndexRef.current = null;
      // Close dropup since scene positions changed
      handleCloseDropup();
    },
    [reorderScenes, handleCloseDropup]
  );

  // Resize handlers
  const handleResizeStart = useCallback(
    (sceneId: string, edge: 'left' | 'right', e: React.PointerEvent) => {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;
      setResizeState({
        sceneId,
        edge,
        startX: e.clientX,
        originalDuration: scene.durationInFrames,
      });
      setResizePreviewWidth(scene.durationInFrames * pixelsPerFrame);
      handleCloseDropup();
    },
    [scenes, pixelsPerFrame, handleCloseDropup]
  );

  // Set global cursor during resize
  useEffect(() => {
    if (!resizeState) return;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizeState]);

  useEffect(() => {
    if (!resizeState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rs = resizeRef.current;
      if (!rs) return;
      const deltaPx = e.clientX - rs.startX;
      const deltaFrames = Math.round(deltaPx / pixelsPerFrame);
      let newDuration: number;
      if (rs.edge === 'right') {
        newDuration = rs.originalDuration + deltaFrames;
      } else {
        newDuration = rs.originalDuration - deltaFrames;
      }
      newDuration = Math.max(15, newDuration);
      setResizePreviewWidth(newDuration * pixelsPerFrame);
    };

    const handlePointerUp = () => {
      const rs = resizeRef.current;
      if (!rs) return;
      const pw = resizePreviewRef.current;
      const finalDuration = Math.max(15, Math.round((pw ?? rs.originalDuration * pixelsPerFrame) / pixelsPerFrame));
      resizeScene(rs.sceneId, finalDuration, rs.edge);
      setResizeState(null);
      setResizePreviewWidth(null);
      justResizedRef.current = true;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [resizeState, pixelsPerFrame, resizeScene]);

  // Find the current scene for dropup (may have been updated in store)
  const currentDropupScene = dropupScene
    ? scenes.find((s) => s.id === dropupScene.id) ?? null
    : null;

  if (scenes.length === 0) {
    return (
      <div className="border-t border-border bg-background px-4 py-2">
        <div className="flex h-[88px] items-center justify-center gap-2 rounded border border-dashed border-border text-xs text-muted-foreground">
          <Film className="h-4 w-4" />
          Add scenes to see them on the timeline
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-background">
      {/* Toolbar */}
      <TimelineToolbar
        currentFrame={currentFrame}
        totalFrames={totalFrames}
        fps={fps}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* Scrollable area: ruler + track */}
      <div
        ref={scrollRef}
        className="overflow-x-auto"
        data-timeline-track
      >
        {/* Ruler */}
        <TimelineRuler
          totalFrames={totalFrames}
          fps={fps}
          pixelsPerFrame={pixelsPerFrame}
          scrollLeft={scrollRef.current?.scrollLeft ?? 0}
          onSeek={handleSeek}
        />

        {/* Track area */}
        <div className="relative h-[88px] bg-muted/10" style={{ width: totalWidth, minWidth: '100%' }}>
          {/* Scene blocks */}
          {scenes.map((scene, i) => (
            <TimelineSceneBlock
              key={scene.id}
              scene={scene}
              index={i}
              offsetFrame={offsets[i]}
              pixelsPerFrame={pixelsPerFrame}
              isSelected={scene.id === selectedSceneId}
              previewWidth={resizeState?.sceneId === scene.id ? (resizePreviewWidth ?? undefined) : undefined}
              isAnyResizing={resizeState !== null}
              onSelect={handleSceneSelect}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onResizeStart={handleResizeStart}
              onDelete={() => handleDelete(scene.id)}
              onModify={(mode, anchorRect) => handleModify(scene.id, mode, anchorRect)}
            />
          ))}

          {/* Resize duration tooltip */}
          {resizeState && resizePreviewWidth !== null && (() => {
            const sceneIdx = scenes.findIndex((s) => s.id === resizeState.sceneId);
            if (sceneIdx === -1) return null;
            const offset = offsets[sceneIdx];
            const tooltipLeft = offset * pixelsPerFrame + resizePreviewWidth / 2;
            const durationFrames = Math.max(15, Math.round(resizePreviewWidth / pixelsPerFrame));
            const durationSec = (durationFrames / fps).toFixed(1);
            return (
              <div
                className="absolute top-1 z-20 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground shadow pointer-events-none"
                style={{ left: tooltipLeft }}
              >
                {durationSec}s ({durationFrames}f)
              </div>
            );
          })()}

          {/* Playhead */}
          <TimelinePlayhead
            currentFrame={currentFrame}
            totalFrames={totalFrames}
            pixelsPerFrame={pixelsPerFrame}
            onSeek={handleSeek}
          />
        </div>
      </div>

      {/* Dropup */}
      {currentDropupScene && dropupAnchor && (
        <ScenePropertiesDropup
          scene={currentDropupScene}
          anchorRect={dropupAnchor}
          onClose={handleCloseDropup}
          initialMode={dropupInitialMode}
        />
      )}
    </div>
  );
}
