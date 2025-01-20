import { ChainConfig } from '@l2beat/config'
import {
  assert,
  AssetId,
  Token,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { BackendProject } from '../../BackendProject'
import { chainConverter } from '../../chainConverter'

export function getTotalSupplyEntry(
  chain: ChainConfig,
  token: Token,
  project: BackendProject,
): TotalSupplyEntry {
  assert(token.supply === 'totalSupply' && token.address)
  assert(chain.minTimestampForTvl, 'Chain with token should have minTimestamp')

  const chainName = chainConverter.toName(token.chainId)
  const assetId = AssetId.create(chainName, token.address)
  const includeInTotal = !token.excludeFromTotal
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )
  const type = 'totalSupply'

  return {
    address: token.address,
    assetId: assetId,
    category: token.category,
    chain: chainName,
    dataSource: chain.name,
    decimals: token.decimals,
    includeInTotal: includeInTotal,
    isAssociated: isAssociated,
    project: project.projectId,
    sinceTimestamp: sinceTimestamp,
    source: token.source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: token.untilTimestamp,
  }
}
