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

  // We are hardcoding assetId because aggLayerL2Token is an canonical token
  const assetId = AssetId.create(ethereum.name, token.address)
  const type = 'aggLayerL2Token'
  const originNetwork = 0
  const dataSource = `${chain.name}_agglayer`

  return {
    type: type,
    originNetwork: originNetwork,
    dataSource: dataSource,
    l1Address: token.address,
    assetId: assetId,
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
