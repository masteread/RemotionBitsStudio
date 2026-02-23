interface ProjectContext {
  sceneCount: number;
  fps: number;
  width: number;
  height: number;
}

export function buildUserPrompt(prompt: string, context: ProjectContext): string {
  return `Create a scene for the following prompt:

"${prompt}"

Project context:
- Canvas: ${context.width}x${context.height} pixels
- FPS: ${context.fps}
- This is scene #${context.sceneCount} in the project

Generate a rich, visually appealing scene. Use multiple layered elements for depth.
Return ONLY valid JSON matching the scene schema.`;
}
