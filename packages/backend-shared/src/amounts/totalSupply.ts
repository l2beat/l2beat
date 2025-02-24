import type { ChainConfig, Project } from '@l2beat/config'
import {
  assert,
  AssetId,
  type Token,
  type TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'

export function getTotalSupplyEntry(
  chain: ChainConfig,
  token: Token,
  project: Project<'tvlConfig', 'chainConfig'>,
): TotalSupplyEntry {
  assert(token.supply === 'totalSupply' && token.address)
  assert(chain.minTimestampForTvl, 'Chain with token should have minTimestamp')

  const assetId = AssetId.create(chain.name, token.address)
  const includeInTotal = !token.excludeFromTotal
  const isAssociated = !!project.tvlConfig.associatedTokens?.includes(
    token.symbol,
  )
  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )
  const type = 'totalSupply'

  return {
    address: token.address,
    assetId: assetId,
    category: token.category,
    chain: chain.name,
    dataSource: chain.name,
    decimals: token.decimals,
    includeInTotal: includeInTotal,
    isAssociated: isAssociated,
    project: project.id,
    sinceTimestamp: sinceTimestamp,
    source: token.source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: token.untilTimestamp,
  }
}
