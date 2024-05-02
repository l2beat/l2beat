import { DiscoveryDiff, diffDiscovery } from '@l2beat/discovery'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId } from '@l2beat/shared-pure'

import { UpdateMonitorRepository } from '../../../repositories/UpdateMonitorRepository'

export async function getDiff(
  updateMonitorRepository: UpdateMonitorRepository,
  discovery: DiscoveryOutput,
  chainId: ChainId,
) {
  const db = await updateMonitorRepository.findLatest(discovery.name, chainId)

  let diff: DiscoveryDiff[] = []
  if (db?.discovery.contracts) {
    diff = diffDiscovery(discovery.contracts, db.discovery.contracts)
  }
  return diff
}
