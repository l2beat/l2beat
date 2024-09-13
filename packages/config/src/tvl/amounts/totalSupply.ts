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

  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )

  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const includeInTotal = true

  return {
    assetId: AssetId.create(
      chainConverter.toName(token.chainId),
      token.address,
    ),
    chain: chainConverter.toName(token.chainId),
    project: project.projectId,
    decimals: token.decimals,
    symbol: token.symbol,
    category: token.category,
    type: 'totalSupply',
    address: token.address,
    sinceTimestamp,
    untilTimestamp: token.untilTimestamp,
    includeInTotal,
    isAssociated,
    source: token.source,
    dataSource: chain.name,
  }
}
