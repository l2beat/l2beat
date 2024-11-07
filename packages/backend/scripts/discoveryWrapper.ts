import { DiscoveryModuleConfig, discover } from '@l2beat/discovery'
import { updateDiffHistory } from './updateDiffHistory'

export async function discoverAndUpdateDiffHistory(
  config: DiscoveryModuleConfig,
) {
  await discover(config)
  await updateDiffHistory(config.project, config.chain.name)
}
