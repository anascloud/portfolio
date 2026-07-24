// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchWithChallenge } from '../../../../services/challenge.service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const apiPath = path.join('/');
  const body = await req.text();

  const res = await fetchWithChallenge(
    `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/${apiPath}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const apiPath = path.join('/');

  const res = await fetchWithChallenge(
    `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/${apiPath}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}