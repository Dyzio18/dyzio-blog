import React from 'react';
import * as _jsx_runtime from 'react/jsx-runtime';
import type { MDXComponents } from 'mdx/types';

type TocHeading = { value: string; url: string; depth: number; };

interface MDXRendererProps {
  code: string;
  components?: MDXComponents;
  toc?: TocHeading[];
  [key: string]: unknown;
}

/**
 * Server Component MDX renderer for @mdx-js/mdx v2 "function-body" output.
 * Runs only on the server — no serialization needed, so component maps can be passed freely.
 * The compiled code destructures {Fragment, jsx, jsxs} from arguments[0], so we pass
 * _jsx_runtime (not React) as the first argument.
 */
function getMDXComponent(code: string): React.ComponentType<Record<string, unknown>> {
  const fn = new Function('_jsx_runtime', 'React', code);
  return fn(_jsx_runtime, React).default;
}

export function MDXLayoutRenderer({ code, components, ...rest }: MDXRendererProps) {
  const Mdx = getMDXComponent(code);
  return React.createElement(Mdx, { components, ...rest });
}
