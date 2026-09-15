import type { RegistryJson } from './types.js'

/**
 * Transitive `fork_of` chain of a repository, nearest ancestor first. Cycles
 * and unknown repositories end the chain.
 */
export function ancestors(
  registry: RegistryJson,
  repository: string,
): string[] {
  const chain: string[] = []
  const seen = new Set<string>([repository])
  let current = registry.repositories[repository]?.fork_of
  while (current && !seen.has(current)) {
    chain.push(current)
    seen.add(current)
    current = registry.repositories[current]?.fork_of
  }
  return chain
}
