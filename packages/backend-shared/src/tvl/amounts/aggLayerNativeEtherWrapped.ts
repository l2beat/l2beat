import type { ChainConfig } from '@l2beat/config'
import {
  assert,
  type AggLayerNativeEtherWrapped,
  AssetId,
  type Token,
  UnixTime,
} from '@l2beat/shared-pure'
import type { BackendProject, BackendProjectEscrow } from '../../BackendProject'

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

  // We are hardcoding assetId because aggLayerNativeEtherWrapped is a canonical token
  const assetId = AssetId.create('ethereum', l1WETH.address)
  const type = 'aggLayerNativeEtherWrapped'
  const dataSource = `${chain.name}_agglayer`
  const symbol = 'ETH'
  const source = 'canonical'
  const includeInTotal = true
  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    escrow.sinceTimestamp,
  )
  const untilTimestamp = escrow.untilTimestamp
  const decimals = 18
  const isAssociated = false
  const category = 'ether'

  return {
    assetId: assetId,
    category: category,
    chain: project.projectId,
    dataSource: dataSource,
    decimals: decimals,
    escrowAddress: escrow.address,
    includeInTotal: includeInTotal,
    isAssociated: isAssociated,
    project: project.projectId,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: symbol,
    type: type,
    untilTimestamp: untilTimestamp,
    wethAddress: escrow.sharedEscrow.wethAddress,
  }
}
