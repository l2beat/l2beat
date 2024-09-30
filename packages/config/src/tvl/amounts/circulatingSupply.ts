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

  const address = token.address ?? 'native'
  const chainName = chainConverter.toName(token.chainId)
  const assetId = AssetId.create(chainName, address)
  const dataSource = 'coingecko'
  const includeInTotal = true
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )

  return {
    address,
    assetId,
    category: token.category,
    chain: chainName,
    coingeckoId: token.coingeckoId,
    dataSource,
    decimals: token.decimals,
    includeInTotal,
    isAssociated,
    project: project.projectId,
    sinceTimestamp,
    source: token.source,
    symbol: token.symbol,
    type: token.supply,
    untilTimestamp: token.untilTimestamp,
  }
}
