import type { ChainConfig } from '@l2beat/config'
import {
  assert,
  AssetId,
  type EscrowEntry,
  type Token,
  UnixTime,
} from '@l2beat/shared-pure'
import type { BackendProject, BackendProjectEscrow } from '../../BackendProject'
import { getEscrowUntilTimestamp } from '../../utils/getEscrowUntilTimestamp'

export function getEscrowEntry(
  chain: ChainConfig,
  token: Token,
  escrow: BackendProjectEscrow,
  project: BackendProject,
): EscrowEntry {
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')

  const address = token.address ?? 'native'
  const assetId = AssetId.create(chain.name, address)
  const bridgedUsing = escrow.bridgedUsing
  const includeInTotal = token.excludeFromTotal
    ? false
    : (escrow.includeInTotal ?? true)
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const sinceTimestamp = UnixTime.max(
    UnixTime.max(chain.minTimestampForTvl, token.sinceTimestamp),
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
    project: project.projectId,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
