import { ComponentPropsWithoutRef } from 'react';

export default function Pre({ className = '', ...props }: ComponentPropsWithoutRef<'pre'>) {
  return (
    <pre
      className={[
        'my-6 overflow-x-auto rounded-2xl border border-gray-200 bg-gray-950 px-4 py-4 text-sm text-gray-100 shadow-sm dark:border-gray-800',
        className,
      ].join(' ')}
      {...props}
    />
  );
}