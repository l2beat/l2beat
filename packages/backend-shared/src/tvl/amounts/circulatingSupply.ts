import type { ChainConfig } from '@l2beat/config'
import {
  assert,
  AssetId,
  type CirculatingSupplyEntry,
  type Token,
  UnixTime,
} from '@l2beat/shared-pure'
import type { BackendProject } from '../../BackendProject'

export function getCirculatingSupplyEntry(
  chain: ChainConfig,
  token: Token,
  project: BackendProject,
): CirculatingSupplyEntry {
  assert(token.supply === 'circulatingSupply')
  assert(chain.minTimestampForTvl, 'Chain with token should have minTimestamp')

  const address = token.address ?? 'native'
  const assetId = AssetId.create(chain.name, address)
  const dataSource = 'coingecko'
  const includeInTotal = !token.excludeFromTotal
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )

  return {
    address: address,
    assetId: assetId,
    category: token.category,
    chain: chain.name,
    coingeckoId: token.coingeckoId,
    dataSource: dataSource,
    decimals: token.decimals,
    includeInTotal: includeInTotal,
    isAssociated: isAssociated,
    project: project.projectId,
    sinceTimestamp: sinceTimestamp,
    source: token.source,
    symbol: token.symbol,
    type: token.supply,
    untilTimestamp: token.untilTimestamp,
  }
}
