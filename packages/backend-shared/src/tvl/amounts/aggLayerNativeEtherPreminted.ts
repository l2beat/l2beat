import type { ChainConfig } from '@l2beat/config'
import {
  assert,
  type AggLayerNativeEtherPreminted,
  AssetId,
  UnixTime,
} from '@l2beat/shared-pure'
import type { BackendProject, BackendProjectEscrow } from '../../BackendProject'
import { AGGLAYER_L2BRIDGE_ADDRESS } from '../aggLayer'

export function getAggLayerNativeEtherPremintedEntry(
  chain: ChainConfig,
  escrow: BackendProjectEscrow,
  project: BackendProject,
): AggLayerNativeEtherPreminted {
  assert(escrow.sharedEscrow?.type === 'AggLayer')
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')

  // We are hardcoding assetId because aggLayerNativeEtherPreminted is a canonical token
  const assetId = AssetId.create('ethereum', 'native')
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
  const untilTimestamp = escrow.untilTimestamp

  return {
    assetId: assetId,
    category: category,
    chain: project.projectId,
    dataSource: dataSource,
    decimals: decimals,
    escrowAddress: escrow.address,
    includeInTotal: includeInTotal,
    isAssociated: isAssociated,
    l2BridgeAddress: AGGLAYER_L2BRIDGE_ADDRESS,
    premintedAmount: premintedAmount,
    project: project.projectId,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
