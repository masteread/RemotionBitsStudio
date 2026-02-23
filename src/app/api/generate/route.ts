import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { generateScene } from '@/lib/ai/gemini-client';
import { sceneToCode } from '@/lib/scene/scene-to-code';
import type { Scene, SceneElement } from '@/types/scene';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, projectContext } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const generated = await generateScene({
      prompt,
      projectContext: projectContext ?? { sceneCount: 1, fps: 30, width: 1920, height: 1080 },
    });

    // Ensure all elements have unique IDs
    const elements: SceneElement[] = generated.elements.map((el) => ({
      ...el,
      id: el.id || nanoid(),
    })) as SceneElement[];

    const sceneForCode: Scene = {
      id: nanoid(),
      name: generated.name,
      prompt,
      durationInFrames: generated.durationInFrames,
      backgroundColor: generated.backgroundColor,
      elements,
      generatedCode: '',
      status: 'ready',
    };

    const code = sceneToCode(sceneForCode);

    return NextResponse.json({
      scene: {
        name: generated.name,
        durationInFrames: generated.durationInFrames,
        backgroundColor: generated.backgroundColor,
        elements,
      },
      code,
    });
  } catch (error) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
