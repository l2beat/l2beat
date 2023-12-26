import { hashJson } from '@l2beat/shared-pure'
import { sortBy } from 'lodash'

import { ReportUpdater } from '../assets'

// the USDC on Arbitrum changed type from EBV to NMV
const AGGREGATED_REPORT_LOGIC_VERSION = 3

export function getAggregatedConfigHash(updaters: ReportUpdater[]) {
  const chainIds = sortBy(updaters.map((x) => x.getChainId()))
  const configHashes = sortBy(updaters.map((x) => x.getConfigHash()))

  return hashJson([
    chainIds.map(Number),
    configHashes.map(String),
    AGGREGATED_REPORT_LOGIC_VERSION,
  ])
}
