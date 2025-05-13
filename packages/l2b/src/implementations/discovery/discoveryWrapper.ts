import {
  type DiscoveryModuleConfig,
  discover,
  modelPermissionsCommand,
} from '@l2beat/discovery'
import { updateDiffHistory } from './updateDiffHistory'

export async function discoverAndUpdateDiffHistory(
  config: DiscoveryModuleConfig,
  description?: string,
) {
  await discover(config)
  await modelPermissionsCommand(config.project)
  await updateDiffHistory(config.project, description, config.overwriteCache)
}
