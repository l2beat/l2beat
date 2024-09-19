import {
  assert,
  AggLayerNativeEtherWrapped,
  AssetId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { BackendProject, BackendProjectEscrow } from '../../backend'
import { ethereum } from '../../chains/ethereum'
import { ChainConfig } from '../../common'

export function getAggLayerNativeEtherWrappedEntry(
  chain: ChainConfig,
  l1WETH: Token,
  escrow: BackendProjectEscrow,
  project: BackendProject,
): AggLayerNativeEtherWrapped {
  assert(escrow.sharedEscrow?.type === 'AggLayer')
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
  assert(escrow.sharedEscrow.wethAddress, 'WETH address is required')
  assert(l1WETH.address, 'Ethereum WETH token not found')

  return {
    type: 'aggLayerNativeEtherWrapped',
    dataSource: `${chain.name}_agglayer`,
    wethAddress: escrow.sharedEscrow.wethAddress,
    project: project.projectId,
    assetId: AssetId.create(ethereum.name, l1WETH.address),
    escrowAddress: escrow.address,
    chain: project.projectId,
    symbol: 'ETH',
    source: 'canonical',
    includeInTotal: true,
    sinceTimestamp: UnixTime.max(
      chain.minTimestampForTvl,
      escrow.sinceTimestamp,
    ),
    decimals: 18,
    isAssociated: false,
    category: 'ether',
  }
}
