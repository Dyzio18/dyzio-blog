import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getPostBySlug, coreContent } from '@/content/queries';

export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? '';
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0F0E0C',
            color: '#FFFFFF',
            fontSize: 64,
            fontFamily: 'serif',
          }}
        >
          dyzio.me
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const core = coreContent(post);
  const mode = core.mode;
  const isTravel = mode === 'travel';
  const isDev = mode === 'dev';

  const bg = isTravel ? '#C2410C' : isDev ? '#000000' : '#0F0E0C';
  const fg = isTravel ? '#FAF7F2' : isDev ? '#22C55E' : '#FFFFFF';
  const fontFamily = isDev ? 'monospace' : 'serif';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: bg,
          color: fg,
          fontFamily,
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.7, display: 'flex' }}>dyzio.me</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, display: 'flex' }}>
          {core.title}
        </div>
        <div style={{ fontSize: 24, opacity: 0.7, display: 'flex' }}>
          {(core.tags ?? []).slice(0, 4).join(' · ')}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
