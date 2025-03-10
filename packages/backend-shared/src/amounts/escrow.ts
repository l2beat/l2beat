import type { ChainConfig, Project, ProjectTvlEscrow } from '@l2beat/config'
import {
  assert,
  AssetId,
  type EscrowEntry,
  type Token,
} from '@l2beat/shared-pure'
import { getEscrowUntilTimestamp } from '../getEscrowUntilTimestamp'

export function getEscrowEntry(
  chain: ChainConfig,
  token: Token,
  escrow: ProjectTvlEscrow,
  project: Project<'tvlConfig', 'chainConfig'>,
): EscrowEntry {
  assert(chain.sinceTimestamp, 'Chain should have sinceTimestamp')

  const address = token.address ?? 'native'
  const assetId = AssetId.create(chain.name, address)
  const bridgedUsing = escrow.bridgedUsing
  const includeInTotal = token.excludeFromTotal
    ? false
    : (escrow.includeInTotal ?? true)
  const isAssociated = !!project.tvlConfig.associatedTokens?.includes(
    token.symbol,
  )
  const sinceTimestamp = Math.max(
    Math.max(chain.sinceTimestamp, token.sinceTimestamp),
    escrow.sinceTimestamp,
  )
  const source = escrow.source ?? 'canonical'
  const type = 'escrow'
  const untilTimestamp = getEscrowUntilTimestamp(
    token.untilTimestamp,
    escrow.untilTimestamp,
  )

  return {
    address: address,
    assetId: assetId,
    bridgedUsing: bridgedUsing,
    category: token.category,
    chain: chain.name,
    dataSource: chain.name,
    decimals: token.decimals,
    escrowAddress: escrow.address,
    includeInTotal: includeInTotal,
    isAssociated: isAssociated,
    project: project.id,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
