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
  const includeInTotal = token.excludeFromTotal
    ? false
    : escrow.includeInTotal ?? true
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)

  // We are hardcoding assetId because elasticChainEther is an canonical token
  const assetId = AssetId.create(ethereum.name, token.address)
  const type = 'elasticChainEther'
  const dataSource = `${chain.name}_elastic_chain`

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
    includeInTotal,
    decimals: token.decimals,
    symbol: token.symbol,
    isAssociated,
    category: token.category,
  }
}
