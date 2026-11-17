import type {
  ProjectLiquidStakingContracts,
  ProjectLiquidStakingMarketQuote,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { MARKET_SALE } from './marketQuotes'

/**
 * Everything a stored snapshot depends on makes the id: the protocol's
 * addresses, the pools quoted and the size sold. Changing one re-reads the
 * project's history, so a pool added late also covers the past hours it
 * could have filled. Keys and pools are sorted, so reordering them in a
 * project file keeps the id.
 */
export function getLiquidStakingConfigurationId(
  projectId: ProjectId,
  contracts: ProjectLiquidStakingContracts,
  marketQuotes: ProjectLiquidStakingMarketQuote[],
): string {
  const identity = {
    projectId,
    contracts: sortKeys(contracts),
    marketQuotes: marketQuotes
      .map((quote) => JSON.stringify(sortKeys(quote)))
      .sort(),
    marketSale: MARKET_SALE.toString(),
  }
  return createHash('sha1')
    .update(JSON.stringify(identity))
    .digest('hex')
    .slice(0, 12)
}

function sortKeys(record: object): object {
  return Object.fromEntries(
    Object.entries(record).sort(([a], [b]) => a.localeCompare(b)),
  )
}
