import { GoogleGenAI } from '@google/genai';
import { sceneSchema, type GeneratedScene } from './scene-schema';
import { SYSTEM_PROMPT } from './system-prompt';
import { buildUserPrompt } from './prompt-builder';

interface GenerateOptions {
  prompt: string;
  projectContext: {
    sceneCount: number;
    fps: number;
    width: number;
    height: number;
  };
}

export async function generateScene(options: GenerateOptions): Promise<GeneratedScene> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });
  const userPrompt = buildUserPrompt(options.prompt, options.projectContext);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Gemini returned invalid JSON');
  }

  const result = sceneSchema.safeParse(parsed);
  if (!result.success) {
    console.error('Zod validation errors:', JSON.stringify(result.error.issues, null, 2));
    console.error('Raw Gemini response:', text.slice(0, 2000));
    throw new Error(`Invalid scene structure: ${result.error.issues[0]?.message}`);
  }

  return result.data;
}
