import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Project, Scene, SceneElement } from '@/types/scene';
import type { GeneratedScene } from '@/lib/ai/scene-schema';

const MAX_UNDO = 3;

interface ProjectState {
  project: Project;
  // Multi-select state
  multiSelectMode: boolean;
  selectedSceneIds: string[];
  // Frame tracking (not persisted)
  currentFrame: number;
  seekRequest: number | null;
  // Undo/redo stacks (not persisted)
  undoStack: Project[];
  redoStack: Project[];
  // Actions
  setProjectName: (name: string) => void;
  addScene: (scene?: Partial<Scene>) => string;
  removeScene: (sceneId: string) => void;
  removeMultipleScenes: () => void;
  selectScene: (sceneId: string | null) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  reorderScenes: (fromIndex: number, toIndex: number) => void;
  applyGeneratedScene: (sceneId: string, generated: GeneratedScene, prompt: string) => void;
  setSceneStatus: (sceneId: string, status: Scene['status'], error?: string) => void;
  getSelectedScene: () => Scene | undefined;
  getTotalDurationInFrames: () => number;
  toggleMultiSelectMode: () => void;
  toggleSceneSelection: (sceneId: string) => void;
  setCurrentFrame: (frame: number) => void;
  resizeScene: (sceneId: string, newDuration: number, edge: 'left' | 'right') => void;
  requestSeek: (frame: number) => void;
  clearSeekRequest: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

function createDefaultProject(): Project {
  return {
    id: nanoid(),
    name: 'Untitled Project',
    fps: 30,
    width: 1920,
    height: 1080,
    selectedSceneId: null,
    scenes: [],
  };
}

export const useProjectStore = create<ProjectState>()(
  persist(
    immer((set, get) => {
      // Helper: snapshot current project into undo stack, clear redo
      const pushUndo = () => {
        const snapshot = JSON.parse(JSON.stringify(get().project)) as Project;
        set((state) => {
          state.undoStack.push(snapshot);
          if (state.undoStack.length > MAX_UNDO) {
            state.undoStack.shift();
          }
          state.redoStack = [];
        });
      };

      return {
      project: createDefaultProject(),
      multiSelectMode: false,
      selectedSceneIds: [] as string[],
      currentFrame: 0,
      seekRequest: null as number | null,
      undoStack: [] as Project[],
      redoStack: [] as Project[],

      setProjectName: (name) => {
        pushUndo();
        set((state) => {
          state.project.name = name;
        });
      },

      addScene: (partial) => {
        const id = nanoid();
        const sceneCount = get().project.scenes.length;
        pushUndo();
        set((state) => {
          state.project.scenes.push({
            id,
            name: partial?.name ?? `Scene ${sceneCount + 1}`,
            prompt: partial?.prompt ?? '',
            durationInFrames: partial?.durationInFrames ?? 150,
            backgroundColor: partial?.backgroundColor ?? '#000000',
            elements: partial?.elements ?? [],
            generatedCode: partial?.generatedCode ?? '',
            status: partial?.status ?? 'idle',
          });
          state.project.selectedSceneId = id;
        });
        return id;
      },

      removeScene: (sceneId) => {
        pushUndo();
        set((state) => {
          const idx = state.project.scenes.findIndex((s) => s.id === sceneId);
          if (idx === -1) return;
          state.project.scenes.splice(idx, 1);
          if (state.project.selectedSceneId === sceneId) {
            state.project.selectedSceneId =
              state.project.scenes[Math.min(idx, state.project.scenes.length - 1)]?.id ?? null;
          }
        });
      },

      removeMultipleScenes: () => {
        pushUndo();
        set((state) => {
          const idsToRemove = state.selectedSceneIds;
          if (idsToRemove.length === 0) return;
          const remaining = state.project.scenes.filter((s) => !idsToRemove.includes(s.id));
          state.project.scenes = remaining;
          if (state.project.selectedSceneId && idsToRemove.includes(state.project.selectedSceneId)) {
            state.project.selectedSceneId = remaining[0]?.id ?? null;
          }
          state.selectedSceneIds = [];
          state.multiSelectMode = false;
        });
      },

      toggleMultiSelectMode: () =>
        set((state) => {
          state.multiSelectMode = !state.multiSelectMode;
          if (!state.multiSelectMode) {
            state.selectedSceneIds = [];
          }
        }),

      toggleSceneSelection: (sceneId) =>
        set((state) => {
          const idx = state.selectedSceneIds.indexOf(sceneId);
          if (idx >= 0) {
            state.selectedSceneIds.splice(idx, 1);
          } else {
            state.selectedSceneIds.push(sceneId);
          }
        }),

      selectScene: (sceneId) =>
        set((state) => {
          state.project.selectedSceneId = sceneId;
        }),

      updateScene: (sceneId, updates) => {
        pushUndo();
        set((state) => {
          const scene = state.project.scenes.find((s) => s.id === sceneId);
          if (!scene) return;
          Object.assign(scene, updates);
        });
      },

      reorderScenes: (fromIndex, toIndex) => {
        pushUndo();
        set((state) => {
          const [removed] = state.project.scenes.splice(fromIndex, 1);
          state.project.scenes.splice(toIndex, 0, removed);
        });
      },

      applyGeneratedScene: (sceneId, generated, prompt) => {
        pushUndo();
        set((state) => {
          const scene = state.project.scenes.find((s) => s.id === sceneId);
          if (!scene) return;
          scene.name = generated.name;
          scene.durationInFrames = generated.durationInFrames;
          scene.backgroundColor = generated.backgroundColor;
          scene.elements = generated.elements as SceneElement[];
          scene.prompt = prompt;
          scene.status = 'ready';
          scene.error = undefined;
        });
      },

      setSceneStatus: (sceneId, status, error) =>
        set((state) => {
          const scene = state.project.scenes.find((s) => s.id === sceneId);
          if (!scene) return;
          scene.status = status;
          if (error !== undefined) scene.error = error;
        }),

      getSelectedScene: () => {
        const { project } = get();
        return project.scenes.find((s) => s.id === project.selectedSceneId);
      },

      getTotalDurationInFrames: () => {
        return get().project.scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
      },

      setCurrentFrame: (frame) =>
        set((state) => {
          state.currentFrame = frame;
        }),

      resizeScene: (sceneId, newDuration, edge) => {
        pushUndo();
        set((state) => {
          const scene = state.project.scenes.find((s) => s.id === sceneId);
          if (!scene) return;
          const MIN_DURATION = 15;
          const clamped = Math.max(MIN_DURATION, Math.round(newDuration));
          const oldDuration = scene.durationInFrames;

          if (edge === 'right') {
            scene.durationInFrames = clamped;
            // Clamp or remove elements that exceed the new duration
            scene.elements = scene.elements.filter((el) => el.startFrame < clamped);
            for (const el of scene.elements) {
              if (el.startFrame + el.durationInFrames > clamped) {
                el.durationInFrames = clamped - el.startFrame;
              }
            }
          } else {
            // Left edge: shift elements by the delta
            const delta = oldDuration - clamped;
            scene.durationInFrames = clamped;
            for (const el of scene.elements) {
              el.startFrame -= delta;
              if (el.startFrame < 0) {
                el.durationInFrames += el.startFrame; // reduce by the overshoot
                el.startFrame = 0;
              }
            }
            // Remove elements that ended up with non-positive duration
            scene.elements = scene.elements.filter((el) => el.durationInFrames > 0);
          }
        });
      },

      requestSeek: (frame) =>
        set((state) => {
          state.seekRequest = frame;
        }),

      clearSeekRequest: () =>
        set((state) => {
          state.seekRequest = null;
        }),

      undo: () => {
        const { undoStack } = get();
        if (undoStack.length === 0) return;
        const currentSnapshot = JSON.parse(JSON.stringify(get().project)) as Project;
        const previous = undoStack[undoStack.length - 1];
        set((state) => {
          state.redoStack.push(currentSnapshot);
          if (state.redoStack.length > MAX_UNDO) {
            state.redoStack.shift();
          }
          state.undoStack.pop();
          state.project = previous as Project;
        });
      },

      redo: () => {
        const { redoStack } = get();
        if (redoStack.length === 0) return;
        const currentSnapshot = JSON.parse(JSON.stringify(get().project)) as Project;
        const next = redoStack[redoStack.length - 1];
        set((state) => {
          state.undoStack.push(currentSnapshot);
          if (state.undoStack.length > MAX_UNDO) {
            state.undoStack.shift();
          }
          state.redoStack.pop();
          state.project = next as Project;
        });
      },

      reset: () =>
        set((state) => {
          const fresh = createDefaultProject();
          state.project = fresh;
          state.undoStack = [];
          state.redoStack = [];
        }),
    };
    }),
    {
      name: 'remotion-ai-editor-project',
      partialize: (state) => ({ project: state.project }),
    }
  )
);
