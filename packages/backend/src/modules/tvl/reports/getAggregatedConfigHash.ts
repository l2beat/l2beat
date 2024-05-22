import { hashJson } from '@l2beat/shared'
import { sortBy } from 'lodash'

import { ReportUpdater } from '../assets'

// LayerZero tokens changed type to EBV
const AGGREGATED_REPORT_LOGIC_VERSION = 4

export function getAggregatedConfigHash(updaters: ReportUpdater[]) {
  const chainIds = sortBy(updaters.map((x) => x.getChainId()))
  const configHashes = sortBy(updaters.map((x) => x.getConfigHash()))

  return hashJson([
    chainIds.map(Number),
    configHashes.map(String),
    AGGREGATED_REPORT_LOGIC_VERSION,
  ])
}
