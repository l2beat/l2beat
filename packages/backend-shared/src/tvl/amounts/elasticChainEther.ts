import type { ChainConfig, Project, ProjectTvlEscrow } from '@l2beat/config'
import {
  assert,
  AssetId,
  type ElasticChainEther,
  type Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { getEscrowUntilTimestamp } from '../../utils/getEscrowUntilTimestamp'

export function getElasticChainEtherEntry(
  chain: ChainConfig,
  token: Token,
  escrow: ProjectTvlEscrow,
  project: Project<'tvlConfig', 'chainConfig'>,
): ElasticChainEther {
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
  const isAssociated = !!project.tvlConfig.associatedTokens?.includes(
    token.symbol,
  )

  // We are hardcoding assetId because elasticChainEther is a canonical token
  const assetId = AssetId.create('ethereum', 'native')
  const type = 'elasticChainEther'
  const dataSource = `${project.id}_elastic_chain`

  return {
    address: token.address,
    assetId: assetId,
    category: token.category,
    chain: project.id,
    dataSource: dataSource,
    decimals: token.decimals,
    escrowAddress: escrow.address,
    includeInTotal,
    isAssociated,
    project: project.id,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
