import { isEqual } from 'earl'

export function reconcileNetworks<T extends { chain: string }>(
  previousNetworks: T[] | undefined,
  latestNetworks: T[],
): {
  removed: string[]
  updated: T[]
} {
  if (previousNetworks === undefined) {
    return { removed: [], updated: latestNetworks }
  }

  const removed = []
  for (const previous of previousNetworks) {
    if (!latestNetworks.find((l) => l.chain === previous.chain)) {
      removed.push(previous)
    }
  }

  for (const latest of latestNetworks) {
    const prev = previousNetworks.find((p) => p.chain === latest.chain)

    if (prev === undefined || !isEqual(latest, prev)) {
      return {
        removed: removed.map((r) => r.chain),
        updated: [...latestNetworks, ...removed],
      }
    }
  }

  return {
    removed: removed.map((r) => r.chain),
    updated: [],
  }
}
