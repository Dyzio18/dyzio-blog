import { ReactNode } from 'react';

export default function Bleed({ children }: { children: ReactNode }) {
  return <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2">{children}</div>;
}