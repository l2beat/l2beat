import type {
  ProjectLiquidStakingContracts,
  ProjectLiquidStakingMarketQuote,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { MARKET_SALE } from './marketQuotes'

/**
 * Raise a pool type's version when its quote starts to mean something else,
 * so the projects that quote it read their history again.
 */
const QUOTE_VERSION: Partial<
  Record<ProjectLiquidStakingMarketQuote['type'], number>
> = {
  // 2: no quote while the wrapped WETH it pays in can't be unwrapped.
  balancerV3: 2,
}

/**
 * Everything a stored snapshot depends on makes the id: the protocol's
 * addresses, the pools quoted, how they are quoted and the size sold.
 * Changing one re-reads the project's history, so a pool added late also
 * covers the past hours it could have filled. Keys and pools are sorted, so
 * reordering them in a project file keeps the id.
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
      .map((quote) => {
        const version = QUOTE_VERSION[quote.type]
        return JSON.stringify(
          sortKeys(version === undefined ? quote : { ...quote, version }),
        )
      })
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
