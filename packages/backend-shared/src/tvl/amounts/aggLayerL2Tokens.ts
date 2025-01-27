import type { ChainConfig } from '@l2beat/config'
import {
  assert,
  type AggLayerL2Token,
  AssetId,
  type Token,
  UnixTime,
} from '@l2beat/shared-pure'
import type { BackendProject, BackendProjectEscrow } from '../../BackendProject'
import { getEscrowUntilTimestamp } from '../../utils/getEscrowUntilTimestamp'

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
  const untilTimestamp = getEscrowUntilTimestamp(
    token.untilTimestamp,
    escrow.untilTimestamp,
  )
  const includeInTotal = token.excludeFromTotal
    ? false
    : (escrow.includeInTotal ?? true)
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)

  // We are hardcoding assetId because aggLayerL2Token is a canonical token
  const assetId = AssetId.create('ethereum', token.address)
  const type = 'aggLayerL2Token'
  const originNetwork = 0
  const dataSource = `${chain.name}_agglayer`

  return {
    assetId: assetId,
    category: token.category,
    chain: project.projectId,
    dataSource: dataSource,
    decimals: token.decimals,
    escrowAddress: escrow.address,
    includeInTotal,
    isAssociated,
    l1Address: token.address,
    originNetwork: originNetwork,
    project: project.projectId,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
