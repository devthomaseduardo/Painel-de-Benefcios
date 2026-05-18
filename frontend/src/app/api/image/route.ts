import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) return new NextResponse('Not found', { status: 404 });
  
  try {
    const file = readFileSync(path);
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    return new NextResponse('Error loading image', { status: 500 });
  }
}
