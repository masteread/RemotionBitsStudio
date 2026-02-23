import type { Scene, SceneElement } from '@/types/scene';

function indent(str: string, level: number): string {
  return str
    .split('\n')
    .map((line) => '  '.repeat(level) + line)
    .join('\n');
}

function elementToJSX(element: SceneElement, indentLevel: number): string {
  const ind = '  '.repeat(indentLevel);
  const props = [
    `from={${element.startFrame}}`,
    `durationInFrames={${element.durationInFrames}}`,
  ];

  switch (element.type) {
    case 'AnimatedText': {
      const c = element.config;
      const animEntries = Object.entries(c.animation)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}: [${(v as number[]).join(', ')}]`)
        .join(', ');
      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <div style={{ position: 'absolute', left: ${element.position.x}, top: ${element.position.y} }}>
${ind}    <AnimatedText
${ind}      transition={{
${ind}        split: '${c.split}',
${ind}        splitStagger: ${c.splitStagger},
${ind}        easing: '${c.easing}',
${ind}        duration: ${element.durationInFrames},
${ind}        ${animEntries}
${ind}      }}
${ind}      style={{ fontSize: ${c.fontSize}, fontWeight: ${c.fontWeight}, color: '${c.color}' }}
${ind}    >
${ind}      ${c.text}
${ind}    </AnimatedText>
${ind}  </div>
${ind}</Sequence>`;
    }
    case 'TypeWriter': {
      const c = element.config;
      const textProp = Array.isArray(c.text)
        ? `{${JSON.stringify(c.text)}}`
        : `"${c.text}"`;
      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <div style={{ position: 'absolute', left: ${element.position.x}, top: ${element.position.y}, fontSize: ${c.fontSize}, color: '${c.color}' }}>
${ind}    <TypeWriter text=${textProp} typeSpeed={${c.typeSpeed}} cursor={${c.cursor}} loop={${c.loop}} />
${ind}  </div>
${ind}</Sequence>`;
    }
    case 'GradientTransition': {
      const c = element.config;
      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <GradientTransition
${ind}    gradient={${JSON.stringify(c.gradients)}}
${ind}    duration={${element.durationInFrames}}
${ind}    easing="${c.easing}"
${ind}    style={{ width: ${c.width}, height: ${c.height} }}
${ind}  />
${ind}</Sequence>`;
    }
    case 'ParticleSystem': {
      const c = element.config;

      // Build velocity prop
      const velParts = [`x: ${c.velocity.x}`, `y: ${c.velocity.y}`];
      if (c.velocity.z !== undefined) velParts.push(`z: ${c.velocity.z}`);
      if (c.velocity.varianceX !== undefined) velParts.push(`varianceX: ${c.velocity.varianceX}`);
      if (c.velocity.varianceY !== undefined) velParts.push(`varianceY: ${c.velocity.varianceY}`);
      if (c.velocity.varianceZ !== undefined) velParts.push(`varianceZ: ${c.velocity.varianceZ}`);
      const velStr = `{ ${velParts.join(', ')} }`;

      // Build area prop
      const areaParts = [`width: ${c.spawnArea.width}`, `height: ${c.spawnArea.height}`];
      if (c.spawnArea.depth !== undefined) areaParts.push(`depth: ${c.spawnArea.depth}`);
      const areaStr = `{ ${areaParts.join(', ')} }`;

      // Build spawner extra props
      const spawnerExtras: string[] = [];
      if (c.startFrame) spawnerExtras.push(`startFrame={${c.startFrame}}`);
      if (c.transition) spawnerExtras.push(`transition={${JSON.stringify(c.transition)}}`);
      const spawnerExtraStr = spawnerExtras.length > 0 ? ' ' + spawnerExtras.join(' ') : '';

      // Build particle elements
      const style = c.particleStyle ?? 'solid';
      const variants = c.particleVariants && c.particleVariants.length > 0 ? c.particleVariants : null;
      let particleElements: string;

      if (variants) {
        particleElements = variants.map((v) => {
          const s = v.style ?? style;
          if (s === 'gradient') {
            return `${ind}      <div style={{ width: ${v.size}, height: ${v.size}, borderRadius: '50%', background: 'radial-gradient(circle, ${v.color}, transparent 70%)'${v.opacity !== undefined ? `, opacity: ${v.opacity}` : ''} }} />`;
          } else if (s === 'glow') {
            return `${ind}      <div style={{ width: ${v.size}, height: ${v.size}, borderRadius: '50%', backgroundColor: '${v.color}', boxShadow: '0 0 ${v.size * 2}px ${v.size}px ${v.color}99'${v.opacity !== undefined ? `, opacity: ${v.opacity}` : ''} }} />`;
          }
          return `${ind}      <div style={{ width: ${v.size}, height: ${v.size}, borderRadius: '50%', backgroundColor: '${v.color}'${v.opacity !== undefined ? `, opacity: ${v.opacity}` : ''} }} />`;
        }).join('\n');
      } else if (style === 'gradient') {
        particleElements = `${ind}      <div style={{ width: ${c.particleSize}, height: ${c.particleSize}, borderRadius: '50%', background: 'radial-gradient(circle, ${c.particleColor}, transparent 70%)' }} />`;
      } else if (style === 'glow') {
        particleElements = `${ind}      <div style={{ width: ${c.particleSize}, height: ${c.particleSize}, borderRadius: '50%', backgroundColor: '${c.particleColor}', boxShadow: '0 0 ${c.particleSize * 2}px ${c.particleSize}px ${c.particleColor}99' }} />`;
      } else {
        particleElements = `${ind}      <div style={{ width: ${c.particleSize}, height: ${c.particleSize}, borderRadius: '50%', backgroundColor: '${c.particleColor}' }} />`;
      }

      // Build behaviors
      const bi = `${ind}      `; // indent for inside <Particles>
      let behaviors = `${bi}<Behavior gravity={{ x: ${c.gravity.x}, y: ${c.gravity.y} }} drag={${c.drag}} opacity={[${c.opacity.join(', ')}]} />`;
      if (c.wiggle) {
        behaviors += `\n${bi}<Behavior wiggle={{ magnitude: ${c.wiggle.magnitude}, frequency: ${c.wiggle.frequency} }} />`;
      }
      if (c.drift) {
        behaviors += `\n${bi}<Behavior handler={(p) => { p.velocity.x += ${c.drift.x}; p.velocity.y += ${c.drift.y}; }} />`;
      }

      // Perspective wrapper
      const perspectiveStyle = c.perspective ? ` style={{ perspective: ${c.perspective} }}` : '';

      // Indent particle elements to match new nesting
      const reindentedParticles = particleElements.split('\n').map(l => `${ind}  ${l.trimStart()}`).join('\n');

      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <AbsoluteFill>
${ind}    <Particles${perspectiveStyle}>
${ind}      <Spawner rate={${c.spawnRate}} max={${c.maxParticles}} lifespan={${c.particleLifespan}} velocity={${velStr}} area={${areaStr}} position={{ x: ${element.position.x}, y: ${element.position.y} }}${spawnerExtraStr}>
${reindentedParticles}
${ind}      </Spawner>
${behaviors}
${ind}    </Particles>
${ind}  </AbsoluteFill>
${ind}</Sequence>`;
    }
    case 'StaggeredMotion': {
      const c = element.config;
      const animEntries = Object.entries(c.animation)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}: [${(v as number[]).join(', ')}]`)
        .join(', ');
      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <StaggeredMotion
${ind}    transition={{ stagger: ${c.stagger}, staggerDirection: '${c.staggerDirection}', easing: '${c.easing}', ${animEntries} }}
${ind}  >
${ind}    {${JSON.stringify(c.items)}.map((item, i) => (
${ind}      <div key={i} style={{ fontSize: ${c.fontSize}, color: '${c.color}' }}>{item}</div>
${ind}    ))}
${ind}  </StaggeredMotion>
${ind}</Sequence>`;
    }
    case 'AnimatedCounter': {
      const c = element.config;
      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <div style={{ position: 'absolute', left: ${element.position.x}, top: ${element.position.y}, fontSize: ${c.fontSize}, fontWeight: ${c.fontWeight}, color: '${c.color}' }}>
${ind}    <AnimatedCounter transition={{ values: ${JSON.stringify(c.values)}, easing: '${c.easing}', duration: ${element.durationInFrames} }}${c.prefix ? ` prefix="${c.prefix}"` : ''}${c.postfix ? ` postfix="${c.postfix}"` : ''}${c.toFixed ? ` toFixed={${c.toFixed}}` : ''} />
${ind}  </div>
${ind}</Sequence>`;
    }
    case 'MatrixRain': {
      const c = element.config;
      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <MatrixRain fontSize={${c.fontSize}} color="${c.color}" speed={${c.speed}} density={${c.density}} streamLength={${c.streamLength}} />
${ind}</Sequence>`;
    }
    case 'CodeBlock': {
      const c = element.config;
      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <div style={{ position: 'absolute', left: ${element.position.x}, top: ${element.position.y} }}>
${ind}    <CodeBlock code={${JSON.stringify(c.code)}} language="${c.language}" theme="${c.theme}" showLineNumbers={${c.showLineNumbers}} fontSize={${c.fontSize}} />
${ind}  </div>
${ind}</Sequence>`;
    }
    case 'Scene3D': {
      const c = element.config;
      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <Scene3D perspective={${c.perspective}} transitionDuration={${c.transitionDuration}} easing="${c.easing}" stepDuration={${c.stepDuration}}>
${ind}    {/* ${c.steps.length} steps */}
${ind}  </Scene3D>
${ind}</Sequence>`;
    }
    case 'ScrollingColumns': {
      const c = element.config;
      return `${ind}<Sequence ${props.join(' ')} layout="none">
${ind}  <ScrollingColumns columns={${JSON.stringify(c.columns)}} gap={${c.gap}} columnGap={${c.columnGap}} />
${ind}</Sequence>`;
    }
  }
}

export function sceneToCode(scene: Scene): string {
  const imports = new Set<string>();
  imports.add("import { AbsoluteFill, Sequence } from 'remotion';");

  for (const el of scene.elements) {
    switch (el.type) {
      case 'AnimatedText':
        imports.add("import { AnimatedText } from 'remotion-bits';");
        break;
      case 'TypeWriter':
        imports.add("import { TypeWriter } from 'remotion-bits';");
        break;
      case 'GradientTransition':
        imports.add("import { GradientTransition } from 'remotion-bits';");
        break;
      case 'ParticleSystem':
        imports.add("import { Particles, Spawner, Behavior } from 'remotion-bits';");
        break;
      case 'StaggeredMotion':
        imports.add("import { StaggeredMotion } from 'remotion-bits';");
        break;
      case 'AnimatedCounter':
        imports.add("import { AnimatedCounter } from 'remotion-bits';");
        break;
      case 'MatrixRain':
        imports.add("import { MatrixRain } from 'remotion-bits';");
        break;
      case 'CodeBlock':
        imports.add("import { CodeBlock } from 'remotion-bits';");
        break;
      case 'Scene3D':
        imports.add("import { Scene3D, Step } from 'remotion-bits';");
        break;
      case 'ScrollingColumns':
        imports.add("import { ScrollingColumns } from 'remotion-bits';");
        break;
    }
  }

  const elementsJSX = scene.elements
    .map((el) => elementToJSX(el, 2))
    .join('\n\n');

  return `${[...imports].join('\n')}

export const ${scene.name.replace(/[^a-zA-Z0-9]/g, '')}Scene = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '${scene.backgroundColor}' }}>
${elementsJSX}
    </AbsoluteFill>
  );
};`;
}
