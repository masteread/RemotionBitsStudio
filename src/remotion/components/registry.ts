import type { ComponentType } from 'react';
import type { SceneElementType, SceneElement } from '@/types/scene';
import { AnimatedTextRenderer } from './AnimatedTextRenderer';
import { TypeWriterRenderer } from './TypeWriterRenderer';
import { GradientTransitionRenderer } from './GradientTransitionRenderer';
import { ParticleSystemRenderer } from './ParticleSystemRenderer';
import { StaggeredMotionRenderer } from './StaggeredMotionRenderer';
import { AnimatedCounterRenderer } from './AnimatedCounterRenderer';
import { MatrixRainRenderer } from './MatrixRainRenderer';
import { CodeBlockRenderer } from './CodeBlockRenderer';
import { Scene3DRenderer } from './Scene3DRenderer';
import { ScrollingColumnsRenderer } from './ScrollingColumnsRenderer';

type RendererProps<T extends SceneElement = SceneElement> = {
  element: T;
};

const registry: Record<SceneElementType, ComponentType<RendererProps<never>>> = {
  AnimatedText: AnimatedTextRenderer as ComponentType<RendererProps<never>>,
  TypeWriter: TypeWriterRenderer as ComponentType<RendererProps<never>>,
  GradientTransition: GradientTransitionRenderer as ComponentType<RendererProps<never>>,
  ParticleSystem: ParticleSystemRenderer as ComponentType<RendererProps<never>>,
  StaggeredMotion: StaggeredMotionRenderer as ComponentType<RendererProps<never>>,
  AnimatedCounter: AnimatedCounterRenderer as ComponentType<RendererProps<never>>,
  MatrixRain: MatrixRainRenderer as ComponentType<RendererProps<never>>,
  CodeBlock: CodeBlockRenderer as ComponentType<RendererProps<never>>,
  Scene3D: Scene3DRenderer as ComponentType<RendererProps<never>>,
  ScrollingColumns: ScrollingColumnsRenderer as ComponentType<RendererProps<never>>,
};

export function getRenderer(type: SceneElementType) {
  return registry[type];
}

export { registry };
