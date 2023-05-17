import { DiscoveryOutput } from '@l2beat/shared'

import { DiscoveryConfig } from '../../../../../../core/discovery/config/DiscoveryConfig'
import {
  diffDiscovery,
  DiscoveryDiff,
} from '../../../../../../core/discovery/output/diffDiscovery'
import { UpdateMonitorRepository } from '../../../../../../peripherals/database/discovery/UpdateMonitorRepository'

export async function getDiff(
  updateMonitorRepository: UpdateMonitorRepository,
  discovery: DiscoveryOutput,
  config: DiscoveryConfig,
) {
  const db = await updateMonitorRepository.findLatest(config.name)

  let diff: DiscoveryDiff[] = []
  if (db?.discovery.contracts) {
    diff = diffDiscovery(discovery.contracts, db.discovery.contracts, config)
  }
  return diff
}
