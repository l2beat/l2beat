import type { ChainConfig } from '@l2beat/config'
import {
  assert,
  AssetId,
  type ElasticChainL2Token,
  type Token,
  UnixTime,
} from '@l2beat/shared-pure'
import type { BackendProject, BackendProjectEscrow } from '../../BackendProject'
import { getEscrowUntilTimestamp } from '../../utils/getEscrowUntilTimestamp'

export function getElasticChainL2TokenEntry(
  chain: ChainConfig,
  token: Token,
  escrow: BackendProjectEscrow,
  project: BackendProject,
): ElasticChainL2Token {
  assert(escrow.sharedEscrow?.type === 'ElasticChain')
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
  assert(token.address, 'Token address is required for ElasticChain escrow')

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

  // We are hardcoding assetId because elasticChainL2Token is a canonical token
  const assetId = AssetId.create('ethereum', token.address)
  const type = 'elasticChainL2Token'
  const dataSource = `${project.projectId}_elastic_chain`

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
    l2BridgeAddress: escrow.sharedEscrow.l2BridgeAddress,
    project: project.projectId,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
