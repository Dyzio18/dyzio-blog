import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-display-lg font-extrabold text-gray-900 dark:text-gray-100">
      {children}
    </h1>
  );
}
