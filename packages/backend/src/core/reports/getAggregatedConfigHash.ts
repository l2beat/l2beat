import { hashJson } from '@l2beat/shared-pure'

import { AssetUpdater } from '../assets'

const AGGREGATED_REPORT_LOGIC_VERSION = 0

export function getAggregatedConfigHash(updaters: AssetUpdater[]) {
  const chainIds = updaters.map((x) => x.getChainId)
  const configHashes = updaters.map((x) => x.getConfigHash)

  return hashJson([
    chainIds.map(Number),
    configHashes.map(String),
    AGGREGATED_REPORT_LOGIC_VERSION,
  ])
}
