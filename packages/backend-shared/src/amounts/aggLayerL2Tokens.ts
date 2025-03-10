import type { ChainConfig, Project, ProjectTvlEscrow } from '@l2beat/config'
import {
  assert,
  type AggLayerL2Token,
  AssetId,
  type Token,
} from '@l2beat/shared-pure'
import { getEscrowUntilTimestamp } from '../getEscrowUntilTimestamp'

export function getAggLayerL2TokenEntry(
  chain: ChainConfig,
  token: Token,
  escrow: ProjectTvlEscrow,
  project: Project<'tvlConfig', 'chainConfig'>,
): AggLayerL2Token {
  assert(escrow.sharedEscrow?.type === 'AggLayer')
  assert(chain.sinceTimestamp, 'Chain should have sinceTimestamp')
  assert(token.address, 'Token address is required for AggLayer escrow')

  const source = escrow.source ?? 'canonical'
  const sinceTimestamp = Math.max(
    Math.max(chain.sinceTimestamp, token.sinceTimestamp),
    escrow.sinceTimestamp,
  )
  const untilTimestamp = getEscrowUntilTimestamp(
    token.untilTimestamp,
    escrow.untilTimestamp,
  )
  const includeInTotal = token.excludeFromTotal
    ? false
    : (escrow.includeInTotal ?? true)
  const isAssociated = !!project.tvlConfig.associatedTokens?.includes(
    token.symbol,
  )

  // We are hardcoding assetId because aggLayerL2Token is a canonical token
  const assetId = AssetId.create('ethereum', token.address)
  const type = 'aggLayerL2Token'
  const originNetwork = 0
  const dataSource = `${chain.name}_agglayer`

  return {
    assetId: assetId,
    category: token.category,
    chain: project.id,
    dataSource: dataSource,
    decimals: token.decimals,
    escrowAddress: escrow.address,
    includeInTotal,
    isAssociated,
    l1Address: token.address,
    originNetwork: originNetwork,
    project: project.id,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
