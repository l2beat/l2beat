import type { ChainConfig, Project, ProjectTvlEscrow } from '@l2beat/config'
import {
  assert,
  AssetId,
  type ElasticChainL2Token,
  type Token,
} from '@l2beat/shared-pure'
import { getEscrowUntilTimestamp } from '../getEscrowUntilTimestamp'

export function getElasticChainL2TokenEntry(
  chain: ChainConfig,
  token: Token,
  escrow: ProjectTvlEscrow,
  project: Project<'tvlConfig', 'chainConfig'>,
): ElasticChainL2Token {
  assert(escrow.sharedEscrow?.type === 'ElasticChain')
  assert(chain.sinceTimestamp, 'Chain should have sinceTimestamp')
  assert(token.address, 'Token address is required for ElasticChain escrow')

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

  // We are hardcoding assetId because elasticChainL2Token is a canonical token
  const assetId = AssetId.create('ethereum', token.address)
  const type = 'elasticChainL2Token'
  const dataSource = `${project.id}_elastic_chain`

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
    l2BridgeAddress: escrow.sharedEscrow.l2BridgeAddress,
    project: project.id,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
