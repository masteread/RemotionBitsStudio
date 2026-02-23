import type React from 'react';

// Text compositions
import {
  FadeIn,
  BlurIn,
  SlideFromLeft,
  WordByWord,
  CharByChar,
  GlitchIn,
  GlitchCycle,
} from './compositions/text';

// Typewriter compositions
import {
  BasicTypewriter,
  CLISimulation,
  MultiTextTypewriter,
  VariableSpeedTypewriter,
  TypingCodeBlock,
} from './compositions/typewriter';

// Gradient compositions
import {
  LinearGradient,
  RadialGradient,
  ConicGradient,
} from './compositions/gradient';

// Particle compositions
import {
  Snow,
  Fireflies,
  ParticlesFountain,
  GridParticles,
  FlyingThroughWords,
} from './compositions/particles';

// Staggered motion compositions
import {
  StaggeredFadeIn,
  CardStack3D,
  GridStagger,
  ListReveal,
  EasingsVisualizer,
  FractureReassemble,
  MosaicReframe,
} from './compositions/staggered';

// Counter compositions
import { BasicCounter, CounterConfetti } from './compositions/counter';

// Code compositions
import { MatrixRainComp, BasicCodeBlock } from './compositions/code';

// 3D scene compositions
import {
  Basic3DScene,
  Elements3D,
  Carousel3D,
  CubeNavigation,
  KenBurns,
  Terminal3D,
  ScrollingColumns3D,
  RemotionBitsShowcase,
} from './compositions/scene3d';

export interface SceneExample {
  category: string;
  icon: string;
  label: string;
  description: string;
  prompt: string;
  component: React.FC;
  durationInFrames: number;
  width?: number;
  height?: number;
}

export const sceneExamples: SceneExample[] = [
  // =============================================
  // ANIMATED TEXT
  // =============================================
  {
    category: 'Animated Text',
    icon: 'Type',
    label: 'Fade In',
    description: 'Text that appears with a smooth fade in',
    prompt: '"Hello World" text with smooth fade in, centered, white on black background',
    component: FadeIn,
    durationInFrames: 90,
  },
  {
    category: 'Animated Text',
    icon: 'Type',
    label: 'Blur In',
    description: 'Text that appears from blur with word-by-word stagger',
    prompt: '"Text Transition" text that appears from blur with word-by-word stagger, centered',
    component: BlurIn,
    durationInFrames: 90,
  },
  {
    category: 'Animated Text',
    icon: 'Type',
    label: 'Slide from Left',
    description: 'Text that slides in from the left',
    prompt: '"Sliding Text" text that enters from the left with easing, centered',
    component: SlideFromLeft,
    durationInFrames: 90,
  },
  {
    category: 'Animated Text',
    icon: 'Type',
    label: 'Word by Word',
    description: 'Words that appear one by one with stagger',
    prompt: '"This appears word by word" text where each word appears with stagger',
    component: WordByWord,
    durationInFrames: 120,
  },
  {
    category: 'Animated Text',
    icon: 'Type',
    label: 'Character by Character',
    description: 'Characters that appear one by one with scale',
    prompt: '"Character Animation" text where each character appears with stagger and scale',
    component: CharByChar,
    durationInFrames: 120,
  },
  {
    category: 'Animated Text',
    icon: 'Type',
    label: 'Glitch In',
    description: 'Text with glitch effect that stabilizes',
    prompt: '"SYSTEM ONLINE" text with glitch effect that stabilizes, monospace font',
    component: GlitchIn,
    durationInFrames: 90,
  },
  {
    category: 'Animated Text',
    icon: 'Type',
    label: 'Glitch Cycle',
    description: 'Text that cycles between words with glitch',
    prompt: 'Text that alternates between "INITIALIZING", "LOADING ASSETS", "SYSTEM ONLINE", "WELCOME USER" with glitch',
    component: GlitchCycle,
    durationInFrames: 240,
  },

  // =============================================
  // TYPEWRITER
  // =============================================
  {
    category: 'TypeWriter',
    icon: 'Keyboard',
    label: 'Basic Typewriter',
    description: 'Text typed out character by character',
    prompt: 'TypeWriter that types "Ah, those sunny days!" with cursor',
    component: BasicTypewriter,
    durationInFrames: 150,
  },
  {
    category: 'TypeWriter',
    icon: 'Keyboard',
    label: 'CLI Simulation',
    description: 'Terminal simulation with commands and output',
    prompt: 'Terminal-style TypeWriter that types "npm install remotion-bits" with installation output',
    component: CLISimulation,
    durationInFrames: 450,
  },
  {
    category: 'TypeWriter',
    icon: 'Keyboard',
    label: 'Multi-Text Typewriter',
    description: 'Types and deletes multiple phrases in a loop',
    prompt: 'TypeWriter that alternates between "First sentence.", "Second longer sentence.", "Looping..." in a loop',
    component: MultiTextTypewriter,
    durationInFrames: 300,
  },
  {
    category: 'TypeWriter',
    icon: 'Keyboard',
    label: 'Variable Speed Typewriter',
    description: 'Variable speed with typo errors',
    prompt: 'TypeWriter with variable speed and error rate, red text, monospace font',
    component: VariableSpeedTypewriter,
    durationInFrames: 400,
  },
  {
    category: 'TypeWriter',
    icon: 'Keyboard',
    label: 'Typing Code Block',
    description: 'Code typed out like in an editor with syntax highlighting',
    prompt: 'Code TypeWriter with syntax highlighting, dark theme, TypeScript',
    component: TypingCodeBlock,
    durationInFrames: 180,
  },

  // =============================================
  // GRADIENT TRANSITION
  // =============================================
  {
    category: 'Gradients',
    icon: 'Palette',
    label: 'Linear Gradient',
    description: 'Smooth transition between linear gradients',
    prompt: 'Animated linear gradient transitioning between dark blue/purple and light blue/blue',
    component: LinearGradient,
    durationInFrames: 90,
  },
  {
    category: 'Gradients',
    icon: 'Palette',
    label: 'Radial Gradient',
    description: 'Radial gradient with position transition',
    prompt: 'Radial gradient transitioning between yellow/light blue and pink/dark purple',
    component: RadialGradient,
    durationInFrames: 90,
  },
  {
    category: 'Gradients',
    icon: 'Palette',
    label: 'Conic Gradient',
    description: 'Conic gradient rotating continuously',
    prompt: 'Green/black conic gradient rotating 360 degrees continuously',
    component: ConicGradient,
    durationInFrames: 60,
  },

  // =============================================
  // PARTICLE SYSTEM
  // =============================================
  {
    category: 'Particles',
    icon: 'Sparkles',
    label: 'Snow',
    description: 'Snowflakes falling with wiggle and gravity',
    prompt: 'Snow particles with size variants falling with lateral wiggle on dark blue background',
    component: Snow,
    durationInFrames: 300,
  },
  {
    category: 'Particles',
    icon: 'Sparkles',
    label: 'Fireflies',
    description: 'Glowing fireflies floating erratically',
    prompt: 'Green-yellow firefly particles with glow and wiggle, floating in the dark',
    component: Fireflies,
    durationInFrames: 300,
  },
  {
    category: 'Particles',
    icon: 'Sparkles',
    label: 'Particles Fountain',
    description: 'Particle fountain with burst and gravity',
    prompt: 'Particles bursting upward from the bottom like a fountain with gravity and size variants',
    component: ParticlesFountain,
    durationInFrames: 180,
  },
  {
    category: 'Particles',
    icon: 'Sparkles',
    label: 'Grid Particles',
    description: 'Particles moving in a grid pattern',
    prompt: 'Particles appearing in a grid that periodically jump to adjacent cells',
    component: GridParticles,
    durationInFrames: 200,
  },
  {
    category: 'Particles',
    icon: 'Sparkles',
    label: 'Flying Through Words',
    description: 'Words flying toward the camera in 3D',
    prompt: 'AI model words flying toward the camera in 3D perspective with fade',
    component: FlyingThroughWords,
    durationInFrames: 300,
  },

  // =============================================
  // STAGGERED MOTION
  // =============================================
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'Staggered Fade In',
    description: 'Elements appearing sequentially with fade and motion',
    prompt: 'Colored boxes appearing sequentially with fade in and upward motion',
    component: StaggeredFadeIn,
    durationInFrames: 90,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: '3D Card Stack',
    description: 'Card stack that fans out',
    prompt: 'Numbered cards entering from below and fanning out with spring',
    component: CardStack3D,
    durationInFrames: 120,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'Grid Stagger',
    description: '4x4 grid appearing from the center',
    prompt: '16-element grid appearing with stagger from the center with scale and spring',
    component: GridStagger,
    durationInFrames: 90,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'List Reveal',
    description: 'App-style list appearing sequentially',
    prompt: 'Menu items with icons appearing sequentially with scale and fade',
    component: ListReveal,
    durationInFrames: 90,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'Easings Visualizer',
    description: 'Visualization of different easing curves',
    prompt: 'Squares moving horizontally showing different easing curves',
    component: EasingsVisualizer,
    durationInFrames: 90,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'Fracture Reassemble',
    description: 'Mosaic that fractures and reassembles in 3D',
    prompt: 'Image grid that scatters in 3D with random rotations and reassembles',
    component: FractureReassemble,
    durationInFrames: 180,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'Mosaic Reframe',
    description: 'Mosaic that switches between grid layouts',
    prompt: 'Images transitioning between uniform grid, featured mosaic, and diagonal cascade',
    component: MosaicReframe,
    durationInFrames: 270,
    width: 1080,
    height: 1080,
  },

  // =============================================
  // ANIMATED COUNTER
  // =============================================
  {
    category: 'Counter',
    icon: 'Hash',
    label: 'Animated Counter',
    description: 'Animated counter interpolating between values',
    prompt: 'Animated counter going from 0 to 10 to 50 and back to 10, with "width:" prefix and "px" suffix',
    component: BasicCounter,
    durationInFrames: 120,
  },
  {
    category: 'Counter',
    icon: 'Hash',
    label: 'Counter Confetti',
    description: 'Counter reaching 1000 with confetti explosion',
    prompt: 'Large counter going from 0 to 1000 with confetti exploding from the sides on arrival',
    component: CounterConfetti,
    durationInFrames: 180,
  },

  // =============================================
  // CODE / MATRIX
  // =============================================
  {
    category: 'Code',
    icon: 'Binary',
    label: 'Matrix Rain',
    description: 'Matrix-style falling characters',
    prompt: 'Matrix Rain effect with green characters falling on black background',
    component: MatrixRainComp,
    durationInFrames: 300,
  },
  {
    category: 'Code',
    icon: 'Code',
    label: 'Code Block',
    description: 'Code block with line-by-line reveal',
    prompt: 'TypeScript code block with syntax highlighting and animated line-by-line reveal',
    component: BasicCodeBlock,
    durationInFrames: 120,
  },

  // =============================================
  // 3D SCENES
  // =============================================
  {
    category: '3D',
    icon: 'Box',
    label: 'Basic 3D Scene',
    description: '3D camera navigating between steps',
    prompt: '3D scene with camera navigating between "Control", "Camera", "Action" with Z depth',
    component: Basic3DScene,
    durationInFrames: 150,
  },
  {
    category: '3D',
    icon: 'Box',
    label: '3D Elements',
    description: 'Camera flying through 3D elements',
    prompt: 'Camera flying through 3D geometric shapes showing words at each step',
    component: Elements3D,
    durationInFrames: 200,
  },
  {
    category: '3D',
    icon: 'Box',
    label: '3D Carousel',
    description: 'Spinning 3D carousel with cards',
    prompt: 'Card carousel spinning in a 3D circle with zoom in/out per step',
    component: Carousel3D,
    durationInFrames: 300,
  },
  {
    category: '3D',
    icon: 'Box',
    label: 'Cube Navigation 3D',
    description: '3D cube navigating between faces',
    prompt: '3D cube with content on each face, camera navigating between front, right, back, left, top, bottom',
    component: CubeNavigation,
    durationInFrames: 480,
  },
  {
    category: '3D',
    icon: 'Box',
    label: 'Ken Burns Effect',
    description: 'Ken Burns effect with images in 3D',
    prompt: 'Images with slow Ken Burns zoom transitioning between photos with fade in/out',
    component: KenBurns,
    durationInFrames: 300,
  },
  {
    category: '3D',
    icon: 'Box',
    label: '3D Terminal',
    description: 'Terminals floating in 3D space with TypeWriter',
    prompt: 'Multiple 3D terminal windows with TypeWriter commands, camera navigating between them',
    component: Terminal3D,
    durationInFrames: 300,
  },
  {
    category: '3D',
    icon: 'Box',
    label: 'Scrolling Columns',
    description: 'Card columns scrolling in 3D',
    prompt: 'Colored card columns scrolling at different speeds in 3D scene with camera pan',
    component: ScrollingColumns3D,
    durationInFrames: 300,
  },

  // =============================================
  // COMPOSITIONS
  // =============================================
  {
    category: 'Compositions',
    icon: 'Film',
    label: 'Remotion Bits',
    description: 'Remotion Bits showcase with animated 3D text',
    prompt: '"Remotion Bits" title with gradient, blur in, and 3D transition to tagline',
    component: RemotionBitsShowcase,
    durationInFrames: 150,
  },
];

export function getCategories(): { name: string; icon: string; examples: SceneExample[] }[] {
  const categoryMap = new Map<string, { icon: string; examples: SceneExample[] }>();

  for (const example of sceneExamples) {
    const existing = categoryMap.get(example.category);
    if (existing) {
      existing.examples.push(example);
    } else {
      categoryMap.set(example.category, { icon: example.icon, examples: [example] });
    }
  }

  return Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    icon: data.icon,
    examples: data.examples,
  }));
}
