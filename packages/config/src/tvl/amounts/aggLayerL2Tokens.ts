import { assert, AggLayerL2Token, AssetId, Token } from '@l2beat/shared-pure'
import { BackendProject, BackendProjectEscrow } from '../../backend'
import { ethereum } from '../../chains/ethereum'
import { ChainConfig } from '../../common'
import { getEscrowEntry } from './escrow'

export function getAggLayerL2TokenEntry(
  chain: ChainConfig,
  token: Token,
  escrow: BackendProjectEscrow,
  project: BackendProject,
): AggLayerL2Token {
  assert(escrow.sharedEscrow?.type === 'AggLayer')
  assert(token.address, 'Token address is required for AggLayer escrow')

  return {
    ...getEscrowEntry(chain, token, escrow, project),
    type: 'aggLayerL2Token',
    originNetwork: 0,
    dataSource: `${chain.name}_agglayer`,
    l1Address: token.address,
    assetId: AssetId.create(ethereum.name, token.address),
    chain: project.projectId,
  }
}
