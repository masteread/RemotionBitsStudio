'use client';

import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { Player, type PlayerRef, type CallbackListener } from '@remotion/player';
import { MainComposition } from '@/remotion/MainComposition';
import { useProjectStore } from '@/stores/project-store';

export function PreviewPanel() {
  const scenes = useProjectStore((s) => s.project.scenes);
  const fps = useProjectStore((s) => s.project.fps);
  const width = useProjectStore((s) => s.project.width);
  const height = useProjectStore((s) => s.project.height);
  const setCurrentFrame = useProjectStore((s) => s.setCurrentFrame);
  const seekRequest = useProjectStore((s) => s.seekRequest);
  const clearSeekRequest = useProjectStore((s) => s.clearSeekRequest);
  const playerRef = useRef<PlayerRef>(null);

  const totalDuration = useMemo(
    () => Math.max(1, scenes.reduce((sum, s) => sum + s.durationInFrames, 0)),
    [scenes]
  );

  const inputProps = useMemo(() => ({ scenes }), [scenes]);

  const handlePlayerRef = useCallback((ref: PlayerRef) => {
    playerRef.current = ref;
  }, []);

  // Sync frame updates from Player -> store
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handler = (e: { detail: { frame: number } }) => {
      setCurrentFrame(e.detail.frame);
    };

    player.addEventListener('frameupdate', handler as CallbackListener<'frameupdate'>);
    return () => {
      player.removeEventListener('frameupdate', handler as CallbackListener<'frameupdate'>);
    };
  }, [setCurrentFrame]);

  // Sync seek requests from store -> Player
  useEffect(() => {
    if (seekRequest !== null && playerRef.current) {
      playerRef.current.seekTo(seekRequest);
      clearSeekRequest();
    }
  }, [seekRequest, clearSeekRequest]);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-[960px]">
        <div className="overflow-hidden rounded-lg border border-border shadow-lg">
          <Player
            ref={handlePlayerRef}
            component={MainComposition}
            inputProps={inputProps}
            durationInFrames={totalDuration}
            fps={fps}
            compositionWidth={width}
            compositionHeight={height}
            style={{ width: '100%' }}
            controls
            autoPlay
            loop
            acknowledgeRemotionLicense
          />
        </div>
      </div>
    </div>
  );
}
