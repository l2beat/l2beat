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

  // We are hardcoding assetId because aggLayerNativeEtherPreminted is an canonical token
  const assetId = AssetId.create(ethereum.name, 'native')
  const type = 'aggLayerNativeEtherPreminted'
  const dataSource = `${chain.name}_agglayer`
  const premintedAmount = escrow.sharedEscrow.premintedAmount
    ? BigInt(escrow.sharedEscrow.premintedAmount)
    : BigInt(0)
  const source = 'canonical'
  const category = 'ether'
  const decimals = 18
  const includeInTotal = true
  const isAssociated = false
  const symbol = 'ETH'
  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    escrow.sinceTimestamp,
  )

  return {
    type: type,
    dataSource: dataSource,
    l2BridgeAddress: AGGLAYER_L2BRIDGE_ADDRESS,
    premintedAmount: premintedAmount,
    escrowAddress: escrow.address,
    assetId: assetId,
    chain: project.projectId,
    project: project.projectId,
    source: source,
    category: category,
    decimals: decimals,
    includeInTotal: includeInTotal,
    isAssociated: isAssociated,
    symbol: symbol,
    sinceTimestamp: sinceTimestamp,
  }
}
