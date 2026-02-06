import type { DiscoveryOutput } from '@l2beat/discovery'
import { notUndefined } from '@l2beat/shared-pure'
import { uniq } from 'es-toolkit/compat'

export function getReferencedProjects(discovery: DiscoveryOutput): string[] {
  return uniq(
    discovery.entries
      .map((e) => e.targetProject)
      .filter(notUndefined)
      .sort(),
  )
}
