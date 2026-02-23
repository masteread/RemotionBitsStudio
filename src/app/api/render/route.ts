import { NextResponse } from 'next/server';

export async function POST() {
  // Export functionality requires @remotion/renderer running server-side
  // with a pre-built Remotion bundle. This is a placeholder that explains the setup needed.
  return NextResponse.json(
    {
      error:
        'Video export requires server-side Remotion setup. Run `npx remotion bundle src/remotion/index.ts` first, then configure the render route with the bundle path.',
    },
    { status: 501 }
  );
}
