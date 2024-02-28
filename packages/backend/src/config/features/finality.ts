import { Layer2FinalityConfig, layer2s } from '@l2beat/config'
import { notUndefined, ProjectId } from '@l2beat/shared-pure'

import { FeatureFlags } from '../FeatureFlags'

export type FinalityIndexerConfig = Layer2FinalityConfig & {
  projectId: ProjectId
}

export function getFinalityIndexerConfigurations(
  flags: FeatureFlags,
): FinalityIndexerConfig[] {
  return layer2s
    .map((layer2) => {
      if (
        !layer2.config.finality ||
        !flags.isEnabled('finality', layer2.id.toString()) ||
        layer2.config.finality.type === 'OPStack'
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
