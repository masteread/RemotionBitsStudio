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
    category: 'Texto Animado',
    icon: 'Type',
    label: 'Fade In',
    description: 'Texto que aparece con fade in suave',
    prompt: 'Texto "Hello World" con fade in suave, centrado, blanco sobre fondo negro',
    component: FadeIn,
    durationInFrames: 90,
  },
  {
    category: 'Texto Animado',
    icon: 'Type',
    label: 'Blur In',
    description: 'Texto que aparece desde blur con stagger por palabra',
    prompt: 'Texto "Text Transition" que aparece desde blur con stagger word by word, centrado',
    component: BlurIn,
    durationInFrames: 90,
  },
  {
    category: 'Texto Animado',
    icon: 'Type',
    label: 'Slide from Left',
    description: 'Texto que entra deslizandose desde la izquierda',
    prompt: 'Texto "Sliding Text" que entra desde la izquierda con easing, centrado',
    component: SlideFromLeft,
    durationInFrames: 90,
  },
  {
    category: 'Texto Animado',
    icon: 'Type',
    label: 'Word by Word',
    description: 'Palabras que aparecen una por una con stagger',
    prompt: 'Texto "This appears word by word" donde cada palabra aparece con stagger',
    component: WordByWord,
    durationInFrames: 120,
  },
  {
    category: 'Texto Animado',
    icon: 'Type',
    label: 'Character by Character',
    description: 'Caracteres que aparecen uno por uno con escala',
    prompt: 'Texto "Character Animation" donde cada caracter aparece con stagger y escala',
    component: CharByChar,
    durationInFrames: 120,
  },
  {
    category: 'Texto Animado',
    icon: 'Type',
    label: 'Glitch In',
    description: 'Texto con efecto glitch que se estabiliza',
    prompt: 'Texto "SYSTEM ONLINE" con efecto glitch que se estabiliza, fuente monospace',
    component: GlitchIn,
    durationInFrames: 90,
  },
  {
    category: 'Texto Animado',
    icon: 'Type',
    label: 'Glitch Cycle',
    description: 'Texto que cicla entre palabras con glitch',
    prompt: 'Texto que alterna entre "INITIALIZING", "LOADING ASSETS", "SYSTEM ONLINE", "WELCOME USER" con glitch',
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
    description: 'Texto que se escribe caracter por caracter',
    prompt: 'TypeWriter que escribe "Ah, those sunny days!" con cursor',
    component: BasicTypewriter,
    durationInFrames: 150,
  },
  {
    category: 'TypeWriter',
    icon: 'Keyboard',
    label: 'CLI Simulation',
    description: 'Simulacion de terminal con comandos y output',
    prompt: 'TypeWriter estilo terminal que escribe "npm install remotion-bits" con output de instalacion',
    component: CLISimulation,
    durationInFrames: 450,
  },
  {
    category: 'TypeWriter',
    icon: 'Keyboard',
    label: 'Multi-Text Typewriter',
    description: 'Escribe y borra multiples frases en loop',
    prompt: 'TypeWriter que alterna entre "First sentence.", "Second longer sentence.", "Looping..." en loop',
    component: MultiTextTypewriter,
    durationInFrames: 300,
  },
  {
    category: 'TypeWriter',
    icon: 'Keyboard',
    label: 'Variable Speed Typewriter',
    description: 'Velocidad variable con errores de tipeo',
    prompt: 'TypeWriter con velocidad variable y tasa de errores, texto rojo, fuente monospace',
    component: VariableSpeedTypewriter,
    durationInFrames: 400,
  },
  {
    category: 'TypeWriter',
    icon: 'Keyboard',
    label: 'Typing Code Block',
    description: 'Codigo que se escribe como en un editor con syntax highlighting',
    prompt: 'TypeWriter de codigo con syntax highlighting, tema oscuro, TypeScript',
    component: TypingCodeBlock,
    durationInFrames: 180,
  },

  // =============================================
  // GRADIENT TRANSITION
  // =============================================
  {
    category: 'Gradientes',
    icon: 'Palette',
    label: 'Linear Gradient',
    description: 'Transicion suave entre gradientes lineales',
    prompt: 'Gradiente lineal animado que transiciona entre azul oscuro/morado y celeste/azul',
    component: LinearGradient,
    durationInFrames: 90,
  },
  {
    category: 'Gradientes',
    icon: 'Palette',
    label: 'Radial Gradient',
    description: 'Gradiente radial con transicion de posicion',
    prompt: 'Gradiente radial que transiciona entre amarillo/celeste y rosa/morado oscuro',
    component: RadialGradient,
    durationInFrames: 90,
  },
  {
    category: 'Gradientes',
    icon: 'Palette',
    label: 'Conic Gradient',
    description: 'Gradiente conico rotando continuamente',
    prompt: 'Gradiente conico verde/negro que rota 360 grados continuamente',
    component: ConicGradient,
    durationInFrames: 60,
  },

  // =============================================
  // PARTICLE SYSTEM
  // =============================================
  {
    category: 'Particulas',
    icon: 'Sparkles',
    label: 'Snow',
    description: 'Copos de nieve cayendo con wiggle y gravedad',
    prompt: 'Particulas de nieve con variantes de tamaño cayendo con wiggle lateral sobre fondo azul oscuro',
    component: Snow,
    durationInFrames: 300,
  },
  {
    category: 'Particulas',
    icon: 'Sparkles',
    label: 'Fireflies',
    description: 'Luciernagas con brillo flotando erráticamente',
    prompt: 'Particulas como luciernagas verde-amarillas con glow y wiggle, flotando en la oscuridad',
    component: Fireflies,
    durationInFrames: 300,
  },
  {
    category: 'Particulas',
    icon: 'Sparkles',
    label: 'Particles Fountain',
    description: 'Fuente de particulas con burst y gravedad',
    prompt: 'Particulas que explotan hacia arriba desde abajo como fuente con gravedad y variantes de tamaño',
    component: ParticlesFountain,
    durationInFrames: 180,
  },
  {
    category: 'Particulas',
    icon: 'Sparkles',
    label: 'Grid Particles',
    description: 'Particulas que se mueven en patron de grilla',
    prompt: 'Particulas que aparecen en grilla y saltan a celdas adyacentes periodicamente',
    component: GridParticles,
    durationInFrames: 200,
  },
  {
    category: 'Particulas',
    icon: 'Sparkles',
    label: 'Flying Through Words',
    description: 'Palabras que vuelan hacia la camara en 3D',
    prompt: 'Palabras de modelos de IA volando hacia la camara en perspectiva 3D con fade',
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
    description: 'Elementos que aparecen secuencialmente con fade y movimiento',
    prompt: 'Cajas de colores que aparecen secuencialmente con fade in y movimiento hacia arriba',
    component: StaggeredFadeIn,
    durationInFrames: 90,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: '3D Card Stack',
    description: 'Pila de tarjetas que se despliegan en abanico',
    prompt: 'Tarjetas numeradas que entran desde abajo y se despliegan en abanico con spring',
    component: CardStack3D,
    durationInFrames: 120,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'Grid Stagger',
    description: 'Grilla 4x4 que aparece desde el centro',
    prompt: 'Grilla de 16 elementos que aparecen con stagger desde el centro con escala y spring',
    component: GridStagger,
    durationInFrames: 90,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'List Reveal',
    description: 'Lista tipo app que aparece secuencialmente',
    prompt: 'Lista de items de menu con iconos que aparecen secuencialmente con escala y fade',
    component: ListReveal,
    durationInFrames: 90,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'Easings Visualizer',
    description: 'Visualizacion de diferentes curvas de easing',
    prompt: 'Cuadrados que se mueven horizontalmente mostrando diferentes curvas de easing',
    component: EasingsVisualizer,
    durationInFrames: 90,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'Fracture Reassemble',
    description: 'Mosaico que se fragmenta y reensambla en 3D',
    prompt: 'Grilla de imagenes que se dispersa en 3D con rotaciones aleatorias y se reensambla',
    component: FractureReassemble,
    durationInFrames: 180,
    width: 1080,
    height: 1080,
  },
  {
    category: 'Staggered Motion',
    icon: 'List',
    label: 'Mosaic Reframe',
    description: 'Mosaico que cambia entre layouts de grilla',
    prompt: 'Imagenes que transicionan entre grilla uniforme, mosaico con feature, y cascada diagonal',
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
    description: 'Contador animado que interpola entre valores',
    prompt: 'Contador animado que va de 0 a 10 a 50 y regresa a 10, con prefijo "width:" y sufijo "px"',
    component: BasicCounter,
    durationInFrames: 120,
  },
  {
    category: 'Counter',
    icon: 'Hash',
    label: 'Counter Confetti',
    description: 'Contador que llega a 1000 con explosion de confetti',
    prompt: 'Contador grande que va de 0 a 1000 con confetti explotando desde los lados al llegar',
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
    description: 'Lluvia de caracteres estilo Matrix',
    prompt: 'Efecto Matrix Rain con caracteres verdes cayendo sobre fondo negro',
    component: MatrixRainComp,
    durationInFrames: 300,
  },
  {
    category: 'Code',
    icon: 'Code',
    label: 'Code Block',
    description: 'Bloque de codigo con reveal linea por linea',
    prompt: 'Bloque de codigo TypeScript con syntax highlighting y reveal animado linea por linea',
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
    description: 'Camara 3D que navega entre steps',
    prompt: 'Escena 3D con camara que navega entre "Control", "Camera", "Action" con profundidad Z',
    component: Basic3DScene,
    durationInFrames: 150,
  },
  {
    category: '3D',
    icon: 'Box',
    label: '3D Elements',
    description: 'Camara volando entre elementos 3D',
    prompt: 'Camara que vuela a traves de figuras geometricas 3D mostrando palabras en cada step',
    component: Elements3D,
    durationInFrames: 200,
  },
  {
    category: '3D',
    icon: 'Box',
    label: '3D Carousel',
    description: 'Carrusel 3D girando con tarjetas',
    prompt: 'Carrusel de tarjetas girando en circulo 3D con zoom in/out por steps',
    component: Carousel3D,
    durationInFrames: 300,
  },
  {
    category: '3D',
    icon: 'Box',
    label: 'Cube Navigation 3D',
    description: 'Cubo 3D navegando entre caras',
    prompt: 'Cubo 3D con contenido en cada cara, camara navegando entre front, right, back, left, top, bottom',
    component: CubeNavigation,
    durationInFrames: 480,
  },
  {
    category: '3D',
    icon: 'Box',
    label: 'Ken Burns Effect',
    description: 'Efecto Ken Burns con imagenes en 3D',
    prompt: 'Imagenes con zoom lento tipo Ken Burns transicionando entre fotos con fade in/out',
    component: KenBurns,
    durationInFrames: 300,
  },
  {
    category: '3D',
    icon: 'Box',
    label: '3D Terminal',
    description: 'Terminales flotando en espacio 3D con TypeWriter',
    prompt: 'Multiples ventanas de terminal 3D con comandos escritos en TypeWriter, camara navegando entre ellas',
    component: Terminal3D,
    durationInFrames: 300,
  },
  {
    category: '3D',
    icon: 'Box',
    label: 'Scrolling Columns',
    description: 'Columnas de tarjetas scrolleando en 3D',
    prompt: 'Columnas de tarjetas de colores scrolleando a diferentes velocidades en escena 3D con paneo de camara',
    component: ScrollingColumns3D,
    durationInFrames: 300,
  },

  // =============================================
  // COMPOSICIONES
  // =============================================
  {
    category: 'Composiciones',
    icon: 'Film',
    label: 'Remotion Bits',
    description: 'Showcase de Remotion Bits con texto 3D animado',
    prompt: 'Titulo "Remotion Bits" con gradiente, blur in, y transicion 3D hacia tagline',
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
