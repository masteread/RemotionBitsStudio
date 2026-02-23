import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Cache the bundle path across requests so we only bundle once
let bundlePromise: Promise<string> | null = null;

async function getBundlePath(): Promise<string> {
  if (bundlePromise) return bundlePromise;

  bundlePromise = (async () => {
    const { bundle } = await import('@remotion/bundler');
    const entryPoint = path.join(process.cwd(), 'src', 'remotion', 'entry.ts');

    const bundlePath = await bundle({
      entryPoint,
      webpackOverride: (config) => ({
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config.resolve?.alias ?? {}),
            '@': path.join(process.cwd(), 'src'),
          },
        },
      }),
    });

    return bundlePath;
  })();

  return bundlePromise;
}

export async function POST(req: Request) {
  try {
    const { scenes, fps } = await req.json();

    if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
      return NextResponse.json(
        { error: 'No scenes provided' },
        { status: 400 }
      );
    }

    const bundlePath = await getBundlePath();

    const { renderMedia, selectComposition } = await import(
      '@remotion/renderer'
    );

    const totalFrames = scenes.reduce(
      (sum: number, s: { durationInFrames: number }) =>
        sum + s.durationInFrames,
      0
    );

    const composition = await selectComposition({
      serveUrl: bundlePath,
      id: 'main',
      inputProps: { scenes },
    });

    const outputPath = path.join(
      process.cwd(),
      'out',
      `video-${Date.now()}.mp4`
    );
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    await renderMedia({
      composition: {
        ...composition,
        fps: fps ?? 30,
        durationInFrames: totalFrames,
      },
      serveUrl: bundlePath,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: { scenes },
    });

    const fileBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="output.mp4"',
      },
    });
  } catch (err) {
    console.error('Render error:', err);
    bundlePromise = null; // Reset bundle cache on error so next attempt re-bundles
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Render failed' },
      { status: 500 }
    );
  }
}
