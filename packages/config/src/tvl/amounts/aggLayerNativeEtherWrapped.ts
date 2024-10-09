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

  // We are hardcoding assetId because aggLayerNativeEtherWrapped is an canonical token
  const assetId = AssetId.create(ethereum.name, l1WETH.address)
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
    type: type,
    dataSource: dataSource,
    wethAddress: escrow.sharedEscrow.wethAddress,
    project: project.projectId,
    assetId: assetId,
    escrowAddress: escrow.address,
    chain: project.projectId,
    symbol: symbol,
    source: source,
    includeInTotal: includeInTotal,
    sinceTimestamp: sinceTimestamp,
    untilTimestamp: untilTimestamp,
    decimals: decimals,
    isAssociated: isAssociated,
    category: category,
  }
}
