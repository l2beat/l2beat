import {
  assert,
  AssetId,
  Token,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { BackendProject, chainConverter } from '../../backend'
import { ChainConfig } from '../../common'

export function getTotalSupplyEntry(
  chain: ChainConfig,
  token: Token,
  project: BackendProject,
): TotalSupplyEntry {
  assert(token.supply === 'totalSupply' && token.address)
  assert(chain.minTimestampForTvl, 'Chain with token should have minTimestamp')

  const includeInTotal = true
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )

  return {
    address: token.address,
    assetId: AssetId.create(
      chainConverter.toName(token.chainId),
      token.address,
    ),
    category: token.category,
    chain: chainConverter.toName(token.chainId),
    dataSource: chain.name,
    decimals: token.decimals,
    includeInTotal,
    isAssociated,
    project: project.projectId,
    sinceTimestamp,
    source: token.source,
    symbol: token.symbol,
    type: 'totalSupply',
    untilTimestamp: token.untilTimestamp,
  }
}
