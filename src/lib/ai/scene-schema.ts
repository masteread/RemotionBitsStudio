import { z } from 'zod';

const easingNameSchema = z.enum([
  'linear',
  'easeIn',
  'easeOut',
  'easeInOut',
  'easeInCubic',
  'easeOutCubic',
  'easeInOutCubic',
  'spring',
]);

const positionSchema = z.object({
  x: z.number().default(0),
  y: z.number().default(0),
});

const baseElementSchema = z.object({
  id: z.string(),
  startFrame: z.number().int().min(0),
  durationInFrames: z.number().int().min(1),
  position: positionSchema,
  zIndex: z.number().int().default(0),
});

const twoNumberTuple = z.tuple([z.number(), z.number()]);

// --- AnimatedText ---
const animatedTextConfigSchema = z.object({
  text: z.string(),
  fontSize: z.number().min(8).max(400).default(64),
  fontWeight: z.number().min(100).max(900).default(700),
  color: z.string().default('#ffffff'),
  split: z.enum(['none', 'word', 'character', 'line']).default('word'),
  splitStagger: z.number().min(0).max(30).default(5),
  easing: easingNameSchema.default('easeOut'),
  animation: z.object({
    opacity: twoNumberTuple.optional(),
    y: twoNumberTuple.optional(),
    x: twoNumberTuple.optional(),
    scale: twoNumberTuple.optional(),
    rotate: twoNumberTuple.optional(),
    blur: twoNumberTuple.optional(),
  }),
});

const animatedTextElementSchema = baseElementSchema.extend({
  type: z.literal('AnimatedText'),
  config: animatedTextConfigSchema,
});

// --- TypeWriter ---
const typeWriterConfigSchema = z.object({
  text: z.union([z.string(), z.array(z.string())]),
  typeSpeed: z.number().min(1).max(30).default(3),
  deleteSpeed: z.number().min(1).max(30).default(2),
  pauseAfterType: z.number().min(0).default(30),
  fontSize: z.number().min(8).max(400).default(48),
  color: z.string().default('#ffffff'),
  cursor: z.boolean().default(true),
  loop: z.boolean().default(false),
  errorRate: z.number().min(0).max(1).default(0),
});

const typeWriterElementSchema = baseElementSchema.extend({
  type: z.literal('TypeWriter'),
  config: typeWriterConfigSchema,
});

// --- GradientTransition ---
const gradientTransitionConfigSchema = z.object({
  gradients: z.array(z.string()).min(2),
  easing: easingNameSchema.default('linear'),
  width: z.number().default(1920),
  height: z.number().default(1080),
});

const gradientTransitionElementSchema = baseElementSchema.extend({
  type: z.literal('GradientTransition'),
  config: gradientTransitionConfigSchema,
});

// --- ParticleSystem ---
const particleVariantSchema = z.object({
  size: z.number().min(1).max(200),
  color: z.string(),
  style: z.enum(['solid', 'gradient', 'glow']).default('solid'),
  opacity: z.number().min(0).max(1).optional(),
});

const particleSystemConfigSchema = z.object({
  spawnRate: z.number().min(0.1).max(50).default(5),
  maxParticles: z.number().min(1).max(500).default(100),
  particleLifespan: z.number().min(1).default(60),
  particleSize: z.number().min(1).max(200).default(10),
  particleColor: z.string().default('#ffffff'),
  particleStyle: z.enum(['solid', 'gradient', 'glow']).default('solid').optional(),
  particleVariants: z.array(particleVariantSchema).optional(),
  velocity: z.object({
    x: z.number().default(0),
    y: z.number().default(-2),
    z: z.number().optional(),
    varianceX: z.number().optional(),
    varianceY: z.number().optional(),
    varianceZ: z.number().optional(),
  }),
  gravity: z.object({
    x: z.number().default(0),
    y: z.number().default(0.5),
  }),
  drag: z.number().min(0).max(1).default(0.95),
  opacity: z.array(z.number()).min(1).default([1, 0]),
  spawnArea: z.object({
    width: z.number().default(200),
    height: z.number().default(50),
    depth: z.number().optional(),
  }),
  perspective: z.number().optional(),
  particleTexts: z.array(z.string()).optional(),
  particleFontSize: z.number().optional(),
  wiggle: z.object({
    magnitude: z.number().min(0).max(20),
    frequency: z.number().min(0).max(5),
  }).optional(),
  drift: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  startFrame: z.number().int().min(0).optional(),
  transition: z.object({
    opacity: z.array(z.number()).optional(),
    duration: z.number().optional(),
  }).optional(),
});

const particleSystemElementSchema = baseElementSchema.extend({
  type: z.literal('ParticleSystem'),
  config: particleSystemConfigSchema,
});

// --- StaggeredMotion ---
const staggeredMotionConfigSchema = z.object({
  items: z.array(z.string()).min(1),
  stagger: z.number().min(0).max(30).default(5),
  staggerDirection: z.enum(['forward', 'reverse', 'center', 'random']).default('forward'),
  fontSize: z.number().min(8).max(400).default(48),
  color: z.string().default('#ffffff'),
  easing: easingNameSchema.default('easeOut'),
  animation: z.object({
    opacity: twoNumberTuple.optional(),
    y: twoNumberTuple.optional(),
    x: twoNumberTuple.optional(),
    scale: twoNumberTuple.optional(),
  }),
});

const staggeredMotionElementSchema = baseElementSchema.extend({
  type: z.literal('StaggeredMotion'),
  config: staggeredMotionConfigSchema,
});

// --- Scene Element Union ---
export const sceneElementSchema = z.discriminatedUnion('type', [
  animatedTextElementSchema,
  typeWriterElementSchema,
  gradientTransitionElementSchema,
  particleSystemElementSchema,
  staggeredMotionElementSchema,
]);

// --- Scene ---
export const sceneSchema = z.object({
  name: z.string(),
  durationInFrames: z.number().int().min(1).max(9000),
  backgroundColor: z.string().default('#000000'),
  elements: z.array(sceneElementSchema),
});

// Type for what Gemini returns (no id, status, etc.)
export type GeneratedScene = z.infer<typeof sceneSchema>;

export {
  easingNameSchema,
  animatedTextConfigSchema,
  typeWriterConfigSchema,
  gradientTransitionConfigSchema,
  particleSystemConfigSchema,
  staggeredMotionConfigSchema,
};
