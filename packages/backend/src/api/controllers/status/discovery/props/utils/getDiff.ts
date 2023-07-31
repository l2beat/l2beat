import {
  diffDiscovery,
  DiscoveryConfig,
  DiscoveryDiff,
} from '@l2beat/discovery'
import { ChainId, DiscoveryOutput } from '@l2beat/shared-pure'

import { UpdateMonitorRepository } from '../../../../../../peripherals/database/discovery/UpdateMonitorRepository'

export async function getDiff(
  updateMonitorRepository: UpdateMonitorRepository,
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
  chainId: ChainId,
) {
  const db = await updateMonitorRepository.findLatest(config.name, chainId)

  let diff: DiscoveryDiff[] = []
  if (db?.discovery.contracts) {
    diff = diffDiscovery(discovery.contracts, db.discovery.contracts, config)
  }
  return diff
}
