// This module is intended for server-side use only.
// It uses @remotion/bundler and @remotion/renderer to produce MP4 output.
//
// Usage:
//   1. Build the Remotion bundle: npx remotion bundle src/remotion/index.ts --out-dir public/remotion-bundle
//   2. Call renderVideo() with the bundle path and scene props
//
// Note: This requires a Chromium binary that @remotion/renderer will download on first use.

import path from 'path';

export interface RenderOptions {
  bundlePath: string;
  compositionId: string;
  inputProps: Record<string, unknown>;
  outputPath: string;
  fps?: number;
  width?: number;
  height?: number;
}

export async function renderVideo(options: RenderOptions): Promise<string> {
  // Dynamic imports to avoid bundling server-only modules in client code
  const { renderMedia, selectComposition } = await import('@remotion/renderer');

  const composition = await selectComposition({
    serveUrl: options.bundlePath,
    id: options.compositionId,
    inputProps: options.inputProps,
  });

  const outputPath = options.outputPath || path.join(process.cwd(), 'out', 'video.mp4');

  await renderMedia({
    composition: {
      ...composition,
      fps: options.fps ?? composition.fps,
      width: options.width ?? composition.width,
      height: options.height ?? composition.height,
    },
    serveUrl: options.bundlePath,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: options.inputProps,
  });

  return outputPath;
}
