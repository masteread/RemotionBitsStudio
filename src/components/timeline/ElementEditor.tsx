'use client';

import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PropertyField } from './PropertyField';
import type { SceneElement, EasingName } from '@/types/scene';

const EASING_OPTIONS = [
  { label: 'Linear', value: 'linear' },
  { label: 'Ease In', value: 'easeIn' },
  { label: 'Ease Out', value: 'easeOut' },
  { label: 'Ease In-Out', value: 'easeInOut' },
  { label: 'Ease In Cubic', value: 'easeInCubic' },
  { label: 'Ease Out Cubic', value: 'easeOutCubic' },
  { label: 'Ease In-Out Cubic', value: 'easeInOutCubic' },
  { label: 'Spring', value: 'spring' },
];

const SPLIT_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Word', value: 'word' },
  { label: 'Character', value: 'character' },
  { label: 'Line', value: 'line' },
];

const STAGGER_DIR_OPTIONS = [
  { label: 'Forward', value: 'forward' },
  { label: 'Reverse', value: 'reverse' },
  { label: 'Center', value: 'center' },
  { label: 'Random', value: 'random' },
];

interface ElementEditorProps {
  element: SceneElement;
  onUpdate: (updated: SceneElement) => void;
}

export function ElementEditor({ element, onUpdate }: ElementEditorProps) {
  const [open, setOpen] = useState(false);

  const updateBase = useCallback(
    (key: string, value: unknown) => {
      if (key === 'position.x') {
        onUpdate({ ...element, position: { ...element.position, x: value as number } });
      } else if (key === 'position.y') {
        onUpdate({ ...element, position: { ...element.position, y: value as number } });
      } else {
        onUpdate({ ...element, [key]: value } as SceneElement);
      }
    },
    [element, onUpdate]
  );

  const updateConfig = useCallback(
    (key: string, value: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cfg = (element as any).config;
      const config = { ...cfg, [key]: value };
      onUpdate({ ...element, config } as unknown as SceneElement);
    },
    [element, onUpdate]
  );

  const updateNestedConfig = useCallback(
    (parent: string, key: string, value: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cfg = (element as any).config;
      const parentObj = { ...(cfg[parent] as Record<string, unknown>), [key]: value };
      const config = { ...cfg, [parent]: parentObj };
      onUpdate({ ...element, config } as unknown as SceneElement);
    },
    [element, onUpdate]
  );

  const renderBaseFields = () => (
    <>
      <PropertyField label="Start Frame" type="number" value={element.startFrame} min={0} onChange={(v) => updateBase('startFrame', v)} />
      <PropertyField label="Duration" type="number" value={element.durationInFrames} min={1} onChange={(v) => updateBase('durationInFrames', v)} />
      <PropertyField label="Position X" type="number" value={element.position.x} onChange={(v) => updateBase('position.x', v)} />
      <PropertyField label="Position Y" type="number" value={element.position.y} onChange={(v) => updateBase('position.y', v)} />
      <PropertyField label="Z-Index" type="number" value={element.zIndex} min={0} onChange={(v) => updateBase('zIndex', v)} />
    </>
  );

  const renderConfigFields = () => {
    switch (element.type) {
      case 'AnimatedText':
        return (
          <>
            <PropertyField label="Text" type="text" value={element.config.text} onChange={(v) => updateConfig('text', v)} />
            <PropertyField label="Font Size" type="number" value={element.config.fontSize} min={8} max={400} onChange={(v) => updateConfig('fontSize', v)} />
            <PropertyField label="Font Weight" type="number" value={element.config.fontWeight} min={100} max={900} step={100} onChange={(v) => updateConfig('fontWeight', v)} />
            <PropertyField label="Color" type="color" value={element.config.color} onChange={(v) => updateConfig('color', v)} />
            <PropertyField label="Split" type="select" value={element.config.split} options={SPLIT_OPTIONS} onChange={(v) => updateConfig('split', v)} />
            <PropertyField label="Stagger" type="number" value={element.config.splitStagger} min={0} step={1} onChange={(v) => updateConfig('splitStagger', v)} />
            <PropertyField label="Easing" type="select" value={element.config.easing} options={EASING_OPTIONS} onChange={(v) => updateConfig('easing', v as EasingName)} />
            <div className="mt-1 text-[10px] font-medium text-muted-foreground">Animation [from, to]</div>
            {element.config.animation.opacity && (
              <>
                <PropertyField label="Opacity From" type="number" value={element.config.animation.opacity[0]} min={0} max={1} step={0.1} onChange={(v) => updateNestedConfig('animation', 'opacity', [v, element.config.animation.opacity![1]])} />
                <PropertyField label="Opacity To" type="number" value={element.config.animation.opacity[1]} min={0} max={1} step={0.1} onChange={(v) => updateNestedConfig('animation', 'opacity', [element.config.animation.opacity![0], v])} />
              </>
            )}
            {element.config.animation.y && (
              <>
                <PropertyField label="Y From" type="number" value={element.config.animation.y[0]} onChange={(v) => updateNestedConfig('animation', 'y', [v, element.config.animation.y![1]])} />
                <PropertyField label="Y To" type="number" value={element.config.animation.y[1]} onChange={(v) => updateNestedConfig('animation', 'y', [element.config.animation.y![0], v])} />
              </>
            )}
            {element.config.animation.x && (
              <>
                <PropertyField label="X From" type="number" value={element.config.animation.x[0]} onChange={(v) => updateNestedConfig('animation', 'x', [v, element.config.animation.x![1]])} />
                <PropertyField label="X To" type="number" value={element.config.animation.x[1]} onChange={(v) => updateNestedConfig('animation', 'x', [element.config.animation.x![0], v])} />
              </>
            )}
            {element.config.animation.scale && (
              <>
                <PropertyField label="Scale From" type="number" value={element.config.animation.scale[0]} min={0} step={0.1} onChange={(v) => updateNestedConfig('animation', 'scale', [v, element.config.animation.scale![1]])} />
                <PropertyField label="Scale To" type="number" value={element.config.animation.scale[1]} min={0} step={0.1} onChange={(v) => updateNestedConfig('animation', 'scale', [element.config.animation.scale![0], v])} />
              </>
            )}
            {element.config.animation.rotate && (
              <>
                <PropertyField label="Rotate From" type="number" value={element.config.animation.rotate[0]} onChange={(v) => updateNestedConfig('animation', 'rotate', [v, element.config.animation.rotate![1]])} />
                <PropertyField label="Rotate To" type="number" value={element.config.animation.rotate[1]} onChange={(v) => updateNestedConfig('animation', 'rotate', [element.config.animation.rotate![0], v])} />
              </>
            )}
            {element.config.animation.blur && (
              <>
                <PropertyField label="Blur From" type="number" value={element.config.animation.blur[0]} min={0} onChange={(v) => updateNestedConfig('animation', 'blur', [v, element.config.animation.blur![1]])} />
                <PropertyField label="Blur To" type="number" value={element.config.animation.blur[1]} min={0} onChange={(v) => updateNestedConfig('animation', 'blur', [element.config.animation.blur![0], v])} />
              </>
            )}
          </>
        );

      case 'TypeWriter':
        return (
          <>
            <PropertyField label="Text" type="text" value={Array.isArray(element.config.text) ? element.config.text.join(', ') : element.config.text} onChange={(v) => { const str = String(v); updateConfig('text', str.includes(',') ? str.split(',').map((s) => s.trim()) : str); }} />
            <PropertyField label="Type Speed" type="number" value={element.config.typeSpeed} min={1} onChange={(v) => updateConfig('typeSpeed', v)} />
            <PropertyField label="Delete Speed" type="number" value={element.config.deleteSpeed} min={1} onChange={(v) => updateConfig('deleteSpeed', v)} />
            <PropertyField label="Pause After" type="number" value={element.config.pauseAfterType} min={0} onChange={(v) => updateConfig('pauseAfterType', v)} />
            <PropertyField label="Font Size" type="number" value={element.config.fontSize} min={8} max={400} onChange={(v) => updateConfig('fontSize', v)} />
            <PropertyField label="Color" type="color" value={element.config.color} onChange={(v) => updateConfig('color', v)} />
            <PropertyField label="Cursor" type="boolean" value={element.config.cursor} onChange={(v) => updateConfig('cursor', v)} />
            <PropertyField label="Loop" type="boolean" value={element.config.loop} onChange={(v) => updateConfig('loop', v)} />
            <PropertyField label="Error Rate" type="number" value={element.config.errorRate} min={0} max={1} step={0.01} onChange={(v) => updateConfig('errorRate', v)} />
          </>
        );

      case 'GradientTransition':
        return (
          <>
            <PropertyField label="Gradients" type="text" value={element.config.gradients.join(', ')} onChange={(v) => updateConfig('gradients', String(v).split(',').map((s) => s.trim()))} />
            <PropertyField label="Easing" type="select" value={element.config.easing} options={EASING_OPTIONS} onChange={(v) => updateConfig('easing', v as EasingName)} />
            <PropertyField label="Width" type="number" value={element.config.width} min={1} onChange={(v) => updateConfig('width', v)} />
            <PropertyField label="Height" type="number" value={element.config.height} min={1} onChange={(v) => updateConfig('height', v)} />
          </>
        );

      case 'ParticleSystem':
        return (
          <>
            <PropertyField label="Spawn Rate" type="number" value={element.config.spawnRate} min={1} onChange={(v) => updateConfig('spawnRate', v)} />
            <PropertyField label="Max Particles" type="number" value={element.config.maxParticles} min={1} onChange={(v) => updateConfig('maxParticles', v)} />
            <PropertyField label="Lifespan" type="number" value={element.config.particleLifespan} min={1} onChange={(v) => updateConfig('particleLifespan', v)} />
            <PropertyField label="Size" type="number" value={element.config.particleSize} min={1} onChange={(v) => updateConfig('particleSize', v)} />
            <PropertyField label="Color" type="color" value={element.config.particleColor} onChange={(v) => updateConfig('particleColor', v)} />
            <PropertyField label="Velocity X" type="number" value={element.config.velocity.x} step={0.1} onChange={(v) => updateNestedConfig('velocity', 'x', v)} />
            <PropertyField label="Velocity Y" type="number" value={element.config.velocity.y} step={0.1} onChange={(v) => updateNestedConfig('velocity', 'y', v)} />
            <PropertyField label="Gravity X" type="number" value={element.config.gravity.x} step={0.01} onChange={(v) => updateNestedConfig('gravity', 'x', v)} />
            <PropertyField label="Gravity Y" type="number" value={element.config.gravity.y} step={0.01} onChange={(v) => updateNestedConfig('gravity', 'y', v)} />
            <PropertyField label="Drag" type="number" value={element.config.drag} min={0} max={1} step={0.01} onChange={(v) => updateConfig('drag', v)} />
          </>
        );

      case 'StaggeredMotion':
        return (
          <>
            <PropertyField label="Items" type="text" value={element.config.items.join(', ')} onChange={(v) => updateConfig('items', String(v).split(',').map((s) => s.trim()))} />
            <PropertyField label="Stagger" type="number" value={element.config.stagger} min={0} onChange={(v) => updateConfig('stagger', v)} />
            <PropertyField label="Direction" type="select" value={element.config.staggerDirection} options={STAGGER_DIR_OPTIONS} onChange={(v) => updateConfig('staggerDirection', v)} />
            <PropertyField label="Font Size" type="number" value={element.config.fontSize} min={8} max={400} onChange={(v) => updateConfig('fontSize', v)} />
            <PropertyField label="Color" type="color" value={element.config.color} onChange={(v) => updateConfig('color', v)} />
            <PropertyField label="Easing" type="select" value={element.config.easing} options={EASING_OPTIONS} onChange={(v) => updateConfig('easing', v as EasingName)} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded border border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-7 w-full items-center gap-1 px-2 text-xs font-medium hover:bg-muted/50"
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        <span className="truncate">{element.type}</span>
        <span className="ml-auto text-[10px] text-muted-foreground">#{element.id.slice(0, 5)}</span>
      </button>
      {open && (
        <div className="space-y-1 border-t border-border p-2">
          {renderBaseFields()}
          <div className="my-1 border-t border-border" />
          {renderConfigFields()}
        </div>
      )}
    </div>
  );
}
