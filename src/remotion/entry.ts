// Entry point for Remotion server-side bundling.
// This file is NOT imported by Next.js — it is only used by @remotion/bundler.
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
