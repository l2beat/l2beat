import { resolvedLayer2s } from '@l2beat/config/projects'
import { notUndefined } from '@l2beat/shared-pure'
import { type FinalityProjectConfig } from '../get-finality'

// Backend configurations also include feature flags
export function getFinalityConfigurations(): FinalityProjectConfig[] {
  return resolvedLayer2s
    .map((layer2) => {
      if (
        !layer2.config.finality ||
        layer2.config.finality === 'coming soon' ||
        layer2.isArchived
      ) {
        return
      }

      return {
        projectId: layer2.id,
        ...layer2.config.finality,
      }
    })
    .filter(notUndefined)
}
