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

export function getEscrowEntry(
  chain: ChainConfig,
  token: Token,
  escrow: BackendProjectEscrow,
  project: BackendProject,
): EscrowEntry {
  return {
    ...getEscrowTokenInfo(chain, token, escrow, project),
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

function getEscrowTokenInfo(
  chain: ChainConfig,
  token: Token,
  escrow: BackendProjectEscrow,
  project: BackendProject,
) {
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
  const tokenSinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )
  const sinceTimestamp = UnixTime.max(
    tokenSinceTimestamp,
    escrow.sinceTimestamp,
  )

  const untilTimestamp = getUntilTimestamp(
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
  }
}

function getUntilTimestamp(
  tokenUntil: UnixTime | undefined,
  escrowUntil: UnixTime | undefined,
): UnixTime | undefined {
  if (tokenUntil === undefined && escrowUntil === undefined) {
    return undefined
  }

  if (tokenUntil === undefined) {
    return escrowUntil
  }

  if (escrowUntil === undefined) {
    return tokenUntil
  }

  return UnixTime.max(tokenUntil, escrowUntil)
}
