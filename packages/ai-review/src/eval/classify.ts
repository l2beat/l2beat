import type { Stratum } from './types.js'

const PREFIXES: Record<Exclude<Stratum, 'other'>, string[]> = {
  backend: [
    'packages/backend/',
    'packages/backend-tools/',
    'packages/token-backend/',
    'packages/uif/',
    'packages/database/',
    'packages/public-api/',
    'packages/tools-api/',
    'packages/shared/',
    'packages/shared-pure/',
  ],
  frontend: [
    'packages/frontend/',
    'packages/protocolbeat/',
    'packages/token-ui/',
    'packages/uops-dashboard/',
    'packages/backoffice/',
  ],
  config: ['packages/config/', 'packages/discovery/', 'packages/l2b/'],
}

export function classifyStratum(changedFiles: string[]): Stratum {
  const counts: Record<Stratum, number> = {
    backend: 0,
    frontend: 0,
    config: 0,
    other: 0,
  }
  for (const file of changedFiles) {
    counts[classifyFile(file)]++
  }
  let best: Stratum = 'other'
  let bestCount = 0
  for (const stratum of ['backend', 'frontend', 'config'] as const) {
    if (counts[stratum] > bestCount) {
      best = stratum
      bestCount = counts[stratum]
    }
  }
  return best
}

function classifyFile(file: string): Stratum {
  for (const stratum of ['backend', 'frontend', 'config'] as const) {
    if (PREFIXES[stratum].some((p) => file.startsWith(p))) {
      return stratum
    }
  }
  return 'other'
}
