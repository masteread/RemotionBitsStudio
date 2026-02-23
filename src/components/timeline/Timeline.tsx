'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useProjectStore } from '@/stores/project-store';
import { TimelineToolbar } from './TimelineToolbar';
import { TimelineRuler } from './TimelineRuler';
import { TimelinePlayhead } from './TimelinePlayhead';
import { TimelineSceneBlock } from './TimelineSceneBlock';
import { ScenePropertiesDropup } from './ScenePropertiesDropup';
import type { Scene } from '@/types/scene';

const BASE_PPF = 4; // base pixels per frame at 1x zoom

export function Timeline() {
  const scenes = useProjectStore((s) => s.project.scenes);
  const selectedSceneId = useProjectStore((s) => s.project.selectedSceneId);
  const fps = useProjectStore((s) => s.project.fps);
  const currentFrame = useProjectStore((s) => s.currentFrame);
  const selectScene = useProjectStore((s) => s.selectScene);
  const reorderScenes = useProjectStore((s) => s.reorderScenes);
  const requestSeek = useProjectStore((s) => s.requestSeek);

  const [zoom, setZoom] = useState(1);
  const [dropupScene, setDropupScene] = useState<Scene | null>(null);
  const [dropupAnchor, setDropupAnchor] = useState<DOMRect | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);

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
      selectScene(sceneId);
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDropupScene(scene);
      setDropupAnchor(rect);
    },
    [scenes, selectScene]
  );

  const handleCloseDropup = useCallback(() => {
    setDropupScene(null);
    setDropupAnchor(null);
  }, []);

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

  // Find the current scene for dropup (may have been updated in store)
  const currentDropupScene = dropupScene
    ? scenes.find((s) => s.id === dropupScene.id) ?? null
    : null;

  if (scenes.length === 0) {
    return (
      <div className="border-t border-border bg-background px-4 py-2">
        <div className="flex h-[88px] items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground">
          Your scenes will appear here
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
              onSelect={handleSceneSelect}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}

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
        />
      )}
    </div>
  );
}
