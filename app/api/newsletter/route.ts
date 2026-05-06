import { NextRequest, NextResponse } from 'next/server';
import siteMetadata from '@/data/siteMetadata';

const BUTTONDOWN_API_URL = 'https://api.buttondown.email/v1/subscribers';

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  if (siteMetadata.newsletter?.provider !== 'buttondown') {
    return NextResponse.json(
      { error: 'Unsupported newsletter provider.' },
      { status: 501 }
    );
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'BUTTONDOWN_API_KEY is not configured.' },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Podaj poprawny adres e-mail.' }, { status: 400 });
  }

  const response = await fetch(BUTTONDOWN_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    return NextResponse.json({ ok: true, message: 'Dzięki, jesteś zapisany.' });
  }

  const errorText = await response.text();
  const normalizedError = errorText.toLowerCase();

  if (normalizedError.includes('already') || normalizedError.includes('exists')) {
    return NextResponse.json({ ok: true, message: 'Ten adres jest już zapisany.' });
  }

  return NextResponse.json(
    { error: 'Nie udało się zapisać. Spróbuj ponownie później.' },
    { status: response.status || 500 }
  );
}
