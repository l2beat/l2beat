import {
  assert,
  AssetId,
  CirculatingSupplyEntry,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { BackendProject, chainConverter } from '../../backend'
import { ChainConfig } from '../../common'

export function getCirculatingSupplyEntry(
  chain: ChainConfig,
  token: Token,
  project: BackendProject,
): CirculatingSupplyEntry {
  assert(token.supply === 'circulatingSupply')
  assert(chain.minTimestampForTvl, 'Chain with token should have minTimestamp')

  const includeInTotal = true
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )

  return {
    address: token.address ?? 'native',
    assetId: AssetId.create(
      chainConverter.toName(token.chainId),
      token.address,
    ),
    category: token.category,
    chain: chainConverter.toName(token.chainId),
    coingeckoId: token.coingeckoId,
    dataSource: 'coingecko',
    decimals: token.decimals,
    includeInTotal,
    isAssociated,
    project: project.projectId,
    sinceTimestamp,
    source: token.source,
    symbol: token.symbol,
    type: 'circulatingSupply',
    untilTimestamp: token.untilTimestamp,
  }
}
