import { hashJson } from '@l2beat/shared-pure'
import { sortBy } from 'lodash'

import { AssetUpdater } from '../assets'

// removed the OP & ARB hardcoded reports
const AGGREGATED_REPORT_LOGIC_VERSION = 3

export function getAggregatedConfigHash(updaters: AssetUpdater[]) {
  const chainIds = sortBy(updaters.map((x) => x.getChainId()))
  const configHashes = sortBy(updaters.map((x) => x.getConfigHash()))

  return hashJson([
    chainIds.map(Number),
    configHashes.map(String),
    AGGREGATED_REPORT_LOGIC_VERSION,
  ])
}
