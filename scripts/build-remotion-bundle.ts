// Script to build the Remotion bundle for video export
// Run with: npx tsx scripts/build-remotion-bundle.ts

import path from 'path';
import { bundle } from '@remotion/bundler';

async function main() {
  console.log('Building Remotion bundle...');

  const bundlePath = await bundle({
    entryPoint: path.resolve(process.cwd(), 'src/remotion/index.ts'),
    webpackOverride: (config) => config,
  });

  console.log(`Bundle created at: ${bundlePath}`);
  return bundlePath;
}

main().catch((err) => {
  console.error('Bundle failed:', err);
  process.exit(1);
});
