export interface Project {
  id: string;
  name: string;
  fps: 30 | 60;
  width: number;
  height: number;
  scenes: Scene[];
  selectedSceneId: string | null;
}

export interface Scene {
  id: string;
  name: string;
  prompt: string;
  durationInFrames: number;
  backgroundColor: string;
  elements: SceneElement[];
  generatedCode: string;
  status: 'idle' | 'generating' | 'ready' | 'error';
  error?: string;
}

export interface ElementPosition {
  x: number;
  y: number;
}

export interface BaseElement {
  id: string;
  startFrame: number;
  durationInFrames: number;
  position: ElementPosition;
  zIndex: number;
}

// --- AnimatedText ---
export interface AnimatedTextConfig {
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  split: 'none' | 'word' | 'character' | 'line';
  splitStagger: number;
  easing: EasingName;
  animation: {
    opacity?: [number, number];
    y?: [number, number];
    x?: [number, number];
    scale?: [number, number];
    rotate?: [number, number];
    blur?: [number, number];
  };
  glitch?: number | number[];
  cycle?: {
    texts: string[];
    itemDuration: number;
  };
}

export interface AnimatedTextElement extends BaseElement {
  type: 'AnimatedText';
  config: AnimatedTextConfig;
}

// --- TypeWriter ---
export interface TypeWriterConfig {
  text: string | string[];
  typeSpeed: number;
  deleteSpeed: number;
  pauseAfterType: number;
  fontSize: number;
  color: string;
  cursor: boolean;
  loop: boolean;
  errorRate: number;
}

export interface TypeWriterElement extends BaseElement {
  type: 'TypeWriter';
  config: TypeWriterConfig;
}

// --- GradientTransition ---
export interface GradientTransitionConfig {
  gradients: string[];
  easing: EasingName;
  width: number;
  height: number;
}

export interface GradientTransitionElement extends BaseElement {
  type: 'GradientTransition';
  config: GradientTransitionConfig;
}

// --- ParticleSystem ---
export interface ParticleVariant {
  size: number;
  color: string;
  style: 'solid' | 'gradient' | 'glow';
  opacity?: number;
}

export interface ParticleSystemConfig {
  spawnRate: number;
  maxParticles: number;
  particleLifespan: number;
  particleSize: number;
  particleColor: string;
  particleStyle?: 'solid' | 'gradient' | 'glow';
  particleVariants?: ParticleVariant[];
  velocity: { x: number; y: number; z?: number; varianceX?: number; varianceY?: number; varianceZ?: number };
  gravity: { x: number; y: number };
  drag: number;
  opacity: number[];
  spawnArea: { width: number; height: number; depth?: number };
  perspective?: number;
  particleTexts?: string[];
  particleFontSize?: number;
  wiggle?: { magnitude: number; frequency: number };
  drift?: { x: number; y: number };
  startFrame?: number;
  transition?: { opacity?: number[]; duration?: number };
}

export interface ParticleSystemElement extends BaseElement {
  type: 'ParticleSystem';
  config: ParticleSystemConfig;
}

// --- StaggeredMotion ---
export interface StaggeredMotionConfig {
  items: string[];
  stagger: number;
  staggerDirection: 'forward' | 'reverse' | 'center' | 'random';
  fontSize: number;
  color: string;
  easing: EasingName;
  animation: {
    opacity?: [number, number];
    y?: [number, number];
    x?: [number, number];
    scale?: [number, number];
  };
}

export interface StaggeredMotionElement extends BaseElement {
  type: 'StaggeredMotion';
  config: StaggeredMotionConfig;
}

// --- AnimatedCounter ---
export interface AnimatedCounterConfig {
  values: number | number[];
  prefix?: string;
  postfix?: string;
  toFixed?: number;
  fontSize: number;
  fontWeight: number;
  color: string;
  easing: EasingName;
}

export interface AnimatedCounterElement extends BaseElement {
  type: 'AnimatedCounter';
  config: AnimatedCounterConfig;
}

// --- MatrixRain ---
export interface MatrixRainConfig {
  fontSize: number;
  color: string;
  speed: number;
  density: number;
  streamLength: number;
  charset?: string;
}

export interface MatrixRainElement extends BaseElement {
  type: 'MatrixRain';
  config: MatrixRainConfig;
}

// --- CodeBlock ---
export interface CodeBlockConfig {
  code: string;
  language: string;
  theme: 'dark' | 'light';
  showLineNumbers: boolean;
  fontSize: number;
  lineHeight: number;
  padding: number;
}

export interface CodeBlockElement extends BaseElement {
  type: 'CodeBlock';
  config: CodeBlockConfig;
}

// --- Scene3D ---
export interface Scene3DStep {
  duration: number;
  x?: number;
  y?: number;
  z?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  content: string;
  contentStyle?: Record<string, string | number>;
}

export interface Scene3DConfig {
  perspective: number;
  transitionDuration: number;
  easing: EasingName;
  stepDuration: number;
  steps: Scene3DStep[];
  width: number;
  height: number;
}

export interface Scene3DElement extends BaseElement {
  type: 'Scene3D';
  config: Scene3DConfig;
}

// --- ScrollingColumns ---
export interface ScrollingColumnDef {
  colors: string[];
  labels?: string[];
  speed?: number;
  direction?: 'up' | 'down';
}

export interface ScrollingColumnsConfig {
  columns: ScrollingColumnDef[];
  gap: number;
  columnGap: number;
  width: number;
  height: number;
}

export interface ScrollingColumnsElement extends BaseElement {
  type: 'ScrollingColumns';
  config: ScrollingColumnsConfig;
}

// --- Union type ---
export type SceneElement =
  | AnimatedTextElement
  | TypeWriterElement
  | GradientTransitionElement
  | ParticleSystemElement
  | StaggeredMotionElement
  | AnimatedCounterElement
  | MatrixRainElement
  | CodeBlockElement
  | Scene3DElement
  | ScrollingColumnsElement;

export type SceneElementType = SceneElement['type'];

export type EasingName =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'spring';
