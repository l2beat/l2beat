import {
  assert,
  AggLayerNativeEtherPreminted,
  AssetId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BackendProject, BackendProjectEscrow } from '../../backend'
import { ethereum } from '../../chains/ethereum'
import { ChainConfig } from '../../common'
import { AGGLAYER_L2BRIDGE_ADDRESS } from '../aggLayer'

export function getAggLayerNativeEtherPremintedEntry(
  chain: ChainConfig,
  escrow: BackendProjectEscrow,
  project: BackendProject,
): AggLayerNativeEtherPreminted {
  assert(escrow.sharedEscrow?.type === 'AggLayer')
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')

  return {
    type: 'aggLayerNativeEtherPreminted',
    dataSource: `${chain.name}_agglayer`,
    l2BridgeAddress: AGGLAYER_L2BRIDGE_ADDRESS,
    premintedAmount: escrow.sharedEscrow.premintedAmount
      ? BigInt(escrow.sharedEscrow.premintedAmount)
      : BigInt(0),
    assetId: AssetId.create(ethereum.name, 'native'),
    chain: project.projectId,
    project: project.projectId,
    source: 'canonical',
    category: 'ether',
    decimals: 18,
    includeInTotal: true,
    isAssociated: false,
    symbol: 'ETH',
    sinceTimestamp: UnixTime.max(
      chain.minTimestampForTvl,
      escrow.sinceTimestamp,
    ),
  }
}
