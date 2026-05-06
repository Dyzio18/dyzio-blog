/* eslint-disable @next/next/no-img-element */

import type { ImgHTMLAttributes } from 'react';

export default function MdxImage({ alt = '', className = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      alt={alt}
      loading="lazy"
      className={`my-8 w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800 ${className}`.trim()}
      {...props}
    />
  );
}