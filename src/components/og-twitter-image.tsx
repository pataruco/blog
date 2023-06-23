import { Inter } from 'next/font/google';
import { ImageResponse } from 'next/server';

// Route segment config
// export const runtime = 'edge';

// Image metadata
export const alt = 'Pedro Martín Valera';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <h1
        style={{
          fontSize: 82,
          fontWeight: 700,
          letterSpacing: '-1.64px',
          lineHeight: '90.2px',
          maxWidth: '688px',
          fontFamily: 'Inter',
        }}
      >
        Pedro <br />
        Martín Valera
      </h1>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    },
  );
}
