import { ChainConfig } from '@l2beat/config'
import {
  assert,
  AssetId,
  CirculatingSupplyEntry,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { BackendProject } from '../../BackendProject'
import { chainConverter } from '../../utils'

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
    chain: chainName,
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
