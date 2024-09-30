import {
  assert,
  AssetId,
  EscrowEntry,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  BackendProject,
  BackendProjectEscrow,
  chainConverter,
} from '../../backend'
import { ChainConfig } from '../../common'
import { getEscrowUntilTimestamp } from '../../utils/getEscrowUntilTimestamp'

export function getEscrowEntry(
  chain: ChainConfig,
  token: Token,
  escrow: BackendProjectEscrow,
  project: BackendProject,
): EscrowEntry {
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
  const tokenSinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )
  const sinceTimestamp = UnixTime.max(
    tokenSinceTimestamp,
    escrow.sinceTimestamp,
  )

  const untilTimestamp = getEscrowUntilTimestamp(
    token.untilTimestamp,
    escrow.untilTimestamp,
  )

  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const includeInTotal = escrow.includeInTotal ?? true
  const bridgedUsing = escrow.bridgedUsing
  const source = escrow.source ?? 'canonical'

  return {
    sinceTimestamp,
    untilTimestamp,
    includeInTotal: token.excludeFromTotal ? false : includeInTotal,
    isAssociated,
    bridgedUsing,
    source,
    type: 'escrow',
    address: token.address ?? 'native',
    escrowAddress: escrow.address,
    dataSource: chain.name,
    assetId: AssetId.create(
      chainConverter.toName(token.chainId),
      token.address,
    ),
    chain: chainConverter.toName(token.chainId),
    project: project.projectId,
    decimals: token.decimals,
    symbol: token.symbol,
    category: token.category,
  }
}
