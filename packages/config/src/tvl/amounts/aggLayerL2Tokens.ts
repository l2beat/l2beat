import {
  assert,
  AggLayerL2Token,
  AssetId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { BackendProject, BackendProjectEscrow } from '../../backend'
import { ethereum } from '../../chains/ethereum'
import { ChainConfig } from '../../common'

export function getAggLayerL2TokenEntry(
  chain: ChainConfig,
  token: Token,
  escrow: BackendProjectEscrow,
  project: BackendProject,
): AggLayerL2Token {
  assert(escrow.sharedEscrow?.type === 'AggLayer')
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
  assert(token.address, 'Token address is required for AggLayer escrow')

  const source = escrow.source ?? 'canonical'
  const sinceTimestamp = UnixTime.max(
    UnixTime.max(chain.minTimestampForTvl, token.sinceTimestamp),
    escrow.sinceTimestamp,
  )
  const includeInTotal = token.excludeFromTotal
    ? false
    : escrow.includeInTotal ?? true
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)

  return {
    type: 'aggLayerL2Token',
    originNetwork: 0,
    dataSource: `${chain.name}_agglayer`,
    l1Address: token.address,
    assetId: AssetId.create(ethereum.name, token.address),
    chain: project.projectId,
    escrowAddress: escrow.address,
    project: project.projectId,
    source: source,
    sinceTimestamp: sinceTimestamp,
    includeInTotal,
    decimals: token.decimals,
    symbol: token.symbol,
    isAssociated,
    category: token.category,
  }
}
