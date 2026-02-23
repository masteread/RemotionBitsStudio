# RemotionBitsStudio

An open-source AI-powered video editor built with [Next.js](https://nextjs.org), [Remotion](https://www.remotion.dev), and [remotion-bits](https://www.remotion-bits.com). Describe what you want in natural language and the AI generates motion graphics scenes using Google Gemini.

## What is this project?

RemotionBitsStudio is a visual editor that lets you create animated videos through AI prompts. Instead of writing code manually, you describe a scene (e.g., _"A cinematic title reveal with particle effects"_) and the AI generates the Remotion composition for you, complete with animations, timing, and layered elements.

**Key capabilities:**

- **AI Scene Generation** — Type a prompt, get a fully animated scene powered by Google Gemini
- **Live Preview** — See your scenes in real-time with the embedded Remotion Player
- **10 Element Types** — Text animations, typewriter, gradients, particles, 3D scenes, code blocks, counters, matrix rain, staggered motion, and scrolling columns
- **Timeline Editor** — Sequence multiple scenes, drag to reorder, zoom in/out, adjust durations
- **Code Output** — View and copy the generated React/Remotion code for each scene
- **50+ Examples** — Pre-built compositions to learn from and use as starting points
- **Auto-Save** — Projects persist automatically in localStorage

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Shadcn/UI, Radix UI |
| State | Zustand with Immer (localStorage persistence) |
| AI | Google Gemini 2.5 Flash via `@google/genai` |
| Video Engine | Remotion 4 (`@remotion/player`, `@remotion/renderer`) |
| Animations | [remotion-bits](https://www.remotion-bits.com) |
| Validation | Zod 4 |
| Icons | Lucide React |

## Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- **A Google Gemini API key** (free tier available)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/masteread/RemotionBitsStudio.git
cd RemotionBitsStudio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your Gemini API key

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Or create it manually:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

**How to get a Gemini API key:**

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key and paste it in your `.env.local` file

> **Important:** Never commit your `.env.local` file. It is already included in `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Architecture Overview

```
User types a prompt
        |
        v
  POST /api/generate
        |
        v
  Google Gemini API
  (generates structured JSON scene)
        |
        v
  Zod validation
  (ensures correct schema)
        |
        v
  Zustand store
  (updates project state)
        |
        v
  +------------------+--------------------+
  |                  |                    |
  v                  v                    v
Preview Panel    Code Panel          Timeline
(Remotion Player) (generated JSX)   (scene sequencing)
```

### The Generation Pipeline

1. **Prompt Input** — The user enters a natural language description of the scene they want
2. **AI Processing** — The prompt is sent to Google Gemini with a system prompt that defines the available element types, canvas dimensions (1920x1080), and animation properties
3. **Structured Output** — Gemini returns a JSON object with scene name, duration, background color, and an array of elements with their types, positions, timing, and configurations
4. **Validation** — The response is validated against a Zod schema to ensure type safety
5. **Code Generation** — The scene JSON is converted into readable React/Remotion JSX code
6. **Preview** — The Remotion Player renders the scene in real-time in the editor
7. **Persistence** — The project auto-saves to localStorage

### Supported Element Types

| Type | Description | Source |
|---|---|---|
| `AnimatedText` | Text with split (word/char/line), stagger, easing, glitch effects | remotion-bits |
| `TypeWriter` | Typing effect with cursor, variable speed, error simulation | remotion-bits |
| `GradientTransition` | Animated transitions between gradient backgrounds | remotion-bits |
| `ParticleSystem` | Physics-based particles with gravity, spawning, and opacity keyframes | remotion-bits |
| `StaggeredMotion` | Sequenced animations with directional stagger (forward, reverse, center, random) | remotion-bits |
| `AnimatedCounter` | Smooth number interpolation with prefix/postfix | remotion-bits |
| `MatrixRain` | Matrix-style falling characters | remotion-bits |
| `CodeBlock` | Syntax-highlighted code with line numbers and themes | remotion-bits |
| `Scene3D` | Multi-step 3D camera navigation with perspective | remotion-bits |
| `ScrollingColumns` | Multi-column scrolling animations | remotion-bits |

### Editor Interface

The editor is divided into four main areas:

- **Left Panel (Scenes)** — List of all scenes in your project. Add, delete, or select scenes. Supports multi-select for batch operations.
- **Center Panel (Preview)** — Live Remotion Player with playback controls. Shows the current scene or the full composition in sequence.
- **Right Panel (Code)** — The generated React/Remotion code for the selected scene. Copy it to use in your own Remotion projects.
- **Bottom (Timeline)** — Frame-based timeline showing all scenes in sequence. Drag to reorder, click to edit properties, zoom in/out for precision.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main app entry
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind styles
│   └── api/
│       ├── generate/route.ts       # AI generation endpoint
│       └── render/route.ts         # Video export endpoint
├── components/
│   ├── editor/                     # Main editor panels
│   │   ├── EditorLayout.tsx        # Layout container
│   │   ├── PreviewPanel.tsx        # Remotion Player
│   │   ├── PromptPanel.tsx         # Scene list sidebar
│   │   ├── CodePanel.tsx           # Generated code display
│   │   ├── PromptInput.tsx         # AI prompt textarea
│   │   ├── ExamplesDropdown.tsx    # Example compositions menu
│   │   └── ExamplePreview.tsx      # Example preview dialog
│   ├── timeline/                   # Timeline components
│   │   ├── Timeline.tsx            # Main timeline
│   │   ├── TimelineToolbar.tsx     # Zoom and controls
│   │   ├── TimelineRuler.tsx       # Frame markers
│   │   ├── TimelineSceneBlock.tsx  # Scene blocks
│   │   └── TimelinePlayhead.tsx    # Playback cursor
│   ├── scenes/                     # Scene management
│   │   ├── SceneCard.tsx           # Individual scene card
│   │   └── SceneList.tsx           # Scene list container
│   └── ui/                         # Shadcn/UI components
├── lib/
│   ├── ai/
│   │   ├── gemini-client.ts        # Gemini API client
│   │   ├── system-prompt.ts        # AI system instructions
│   │   ├── prompt-builder.ts       # Prompt context builder
│   │   └── scene-schema.ts         # Zod validation schemas
│   ├── scene/
│   │   └── scene-to-code.ts        # Scene JSON to React code
│   ├── export/
│   │   └── renderer.ts            # Remotion rendering utils
│   └── examples/
│       ├── scene-examples.ts       # Example registry
│       └── compositions/           # 50+ example compositions
├── remotion/
│   ├── Root.tsx                    # Remotion composition root
│   ├── MainComposition.tsx         # Scene sequencer (Series)
│   ├── SceneRenderer.tsx           # Element type dispatcher
│   └── components/
│       ├── registry.ts             # Element type registry
│       ├── AnimatedTextRenderer.tsx
│       ├── TypeWriterRenderer.tsx
│       ├── GradientTransitionRenderer.tsx
│       ├── ParticleSystemRenderer.tsx
│       ├── StaggeredMotionRenderer.tsx
│       ├── AnimatedCounterRenderer.tsx
│       ├── MatrixRainRenderer.tsx
│       ├── CodeBlockRenderer.tsx
│       ├── Scene3DRenderer.tsx
│       └── ScrollingColumnsRenderer.tsx
├── stores/
│   └── project-store.ts            # Zustand state management
└── types/
    └── scene.ts                    # TypeScript interfaces
```

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Make your changes
4. Run `npm run lint` to check for issues
5. Commit your changes: `git commit -m "Add my feature"`
6. Push to your fork: `git push origin my-feature`
7. Open a Pull Request

### Ideas for contributions

- Add new element types (charts, images, SVG animations)
- Improve the timeline with drag-to-resize scene durations
- Add undo/redo support
- Implement video export (MP4) via the render API route
- Add support for custom fonts
- Multi-project support
- Collaborative editing

## License

This is an open-source project. Feel free to use, modify, and distribute it.

## Links

- [Remotion Documentation](https://www.remotion.dev/docs)
- [remotion-bits](https://www.remotion-bits.com)
- [Google AI Studio (Gemini API)](https://aistudio.google.com/apikey)
- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/UI](https://ui.shadcn.com)
