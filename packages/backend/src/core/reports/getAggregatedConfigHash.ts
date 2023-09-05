import { hashJson } from '@l2beat/shared-pure'
import { sortBy } from 'lodash'

import { AssetUpdater } from '../assets'

// the USDC on Arbitrum changed type from EBV to NMV
const AGGREGATED_REPORT_LOGIC_VERSION = 2

export function getAggregatedConfigHash(updaters: AssetUpdater[]) {
  const chainIds = sortBy(updaters.map((x) => x.getChainId()))
  const configHashes = sortBy(updaters.map((x) => x.getConfigHash()))

  return hashJson([
    chainIds.map(Number),
    configHashes.map(String),
    AGGREGATED_REPORT_LOGIC_VERSION,
  ])
}
