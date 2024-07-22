import { layer2s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { type FinalityProjectConfig } from './get-finality'

export function getFinalityConfigurations(): FinalityProjectConfig[] {
  return layer2s
    .map((layer2) => {
      if (
        !layer2.config.finality ||
        // TODO: ugh, this is a hack to disable finality for now
        // !flags.isEnabled('finality', layer2.id.toString()) ||
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
