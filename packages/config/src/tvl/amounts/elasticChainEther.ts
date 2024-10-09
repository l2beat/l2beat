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
  assert(escrow.sharedEscrow?.type === 'ElasticChian')
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
  assert(token.address, 'Token address is required for ElasticChian escrow')

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
    : escrow.includeInTotal ?? true
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)

  // We are hardcoding assetId because elasticChainEther is an canonical token
  const assetId = AssetId.create(ethereum.name, 'native')
  const type = 'elasticChainEther'
  const dataSource = `${project.projectId}_elastic_chain`

  return {
    type: type,
    dataSource: dataSource,
    address: token.address,
    assetId: assetId,
    chain: project.projectId,
    escrowAddress: escrow.address,
    project: project.projectId,
    source: source,
    sinceTimestamp: sinceTimestamp,
    untilTimestamp: untilTimestamp,
    includeInTotal,
    decimals: token.decimals,
    symbol: token.symbol,
    isAssociated,
    category: token.category,
  }
}
