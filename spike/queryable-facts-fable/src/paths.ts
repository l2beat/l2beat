// Where things are: the rule files, the examples, the expected tuples, the compiler cache, the outputs.

import { resolve } from 'path'

/**
 * The spike's folder. Under tsx (CommonJS) it is the parent of this file; under Vite's module runner
 * (ESM, no __dirname) it is the working directory, which `pnpm dev` runs from; QF_ROOT overrides both.
 */
export const ROOT =
  process.env.QF_ROOT ??
  (typeof __dirname === 'string' ? resolve(__dirname, '..') : process.cwd())
export const RULES_DIR = resolve(ROOT, 'rules')
export const EXAMPLES_DIR = resolve(ROOT, 'examples')
export const EXPECTED_DIR = resolve(ROOT, 'expected')
export const CACHE_DIR = resolve(ROOT, '.cache')
export const OUT_DIR = resolve(ROOT, 'out')
