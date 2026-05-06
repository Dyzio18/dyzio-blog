'use client';

import { FormEvent, useState } from 'react';

interface NewsletterFormProps {
  title?: string;
  description?: string;
  compact?: boolean;
}

type RequestState = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm({
  title = 'Newsletter',
  description = 'Jeśli chcesz, daj mi maila. Odezwę się tylko wtedy, gdy pojawi się coś nowego.',
  compact = false,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<RequestState>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const payload = await response.json().catch(() => ({}));

    if (response.ok) {
      setStatus('success');
      setMessage(payload.message || 'Dzięki, jesteś zapisany.');
      setEmail('');
      return;
    }

    setStatus('error');
    setMessage(payload.error || 'Nie udało się zapisać.');
  }

  return (
    <div
      className={[
        'w-full rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70',
        compact ? 'my-10' : 'max-w-2xl',
      ].join(' ')}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="twoj@email.pl"
          className="min-w-0 flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-500"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-white"
        >
          {status === 'loading' ? 'Zapisuję...' : 'Zapisz się'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm ${
            status === 'error'
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}