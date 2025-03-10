import type { ChainConfig, Project, ProjectTvlEscrow } from '@l2beat/config'
import {
  assert,
  type AggLayerNativeEtherWrapped,
  AssetId,
  type Token,
} from '@l2beat/shared-pure'

export function getAggLayerNativeEtherWrappedEntry(
  chain: ChainConfig,
  l1WETH: Token,
  escrow: ProjectTvlEscrow,
  project: Project<'tvlConfig', 'chainConfig'>,
): AggLayerNativeEtherWrapped {
  assert(escrow.sharedEscrow?.type === 'AggLayer')
  assert(chain.sinceTimestamp, 'Chain should have sinceTimestamp')
  assert(escrow.sharedEscrow.wethAddress, 'WETH address is required')
  assert(l1WETH.address, 'Ethereum WETH token not found')

  // We are hardcoding assetId because aggLayerNativeEtherWrapped is a canonical token
  const assetId = AssetId.create('ethereum', l1WETH.address)
  const type = 'aggLayerNativeEtherWrapped'
  const dataSource = `${chain.name}_agglayer`
  const symbol = 'ETH'
  const source = 'canonical'
  const includeInTotal = true
  const sinceTimestamp = Math.max(chain.sinceTimestamp, escrow.sinceTimestamp)
  const untilTimestamp = escrow.untilTimestamp
  const decimals = 18
  const isAssociated = false
  const category = 'ether'

  return {
    assetId: assetId,
    category: category,
    chain: project.id,
    dataSource: dataSource,
    decimals: decimals,
    escrowAddress: escrow.address,
    includeInTotal: includeInTotal,
    isAssociated: isAssociated,
    project: project.id,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: symbol,
    type: type,
    untilTimestamp: untilTimestamp,
    wethAddress: escrow.sharedEscrow.wethAddress,
  }
}
