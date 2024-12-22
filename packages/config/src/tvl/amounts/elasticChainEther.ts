import {
  assert,
  AssetId,
  ElasticChainEther,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { BackendProject, BackendProjectEscrow } from '../../backend'
import { ethereum } from '../../chains/ethereum'
import { ChainConfig } from '../../common'
import { getEscrowUntilTimestamp } from '../../utils/getEscrowUntilTimestamp'

export function getElasticChainEtherEntry(
  chain: ChainConfig,
  token: Token,
  escrow: BackendProjectEscrow,
  project: BackendProject,
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
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)

  // We are hardcoding assetId because elasticChainEther is a canonical token
  const assetId = AssetId.create(ethereum.name, 'native')
  const type = 'elasticChainEther'
  const dataSource = `${project.projectId}_elastic_chain`

  return {
    address: token.address,
    assetId: assetId,
    category: token.category,
    chain: project.projectId,
    dataSource: dataSource,
    decimals: token.decimals,
    escrowAddress: escrow.address,
    includeInTotal,
    isAssociated,
    project: project.projectId,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
