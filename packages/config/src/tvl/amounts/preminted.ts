import {
  assert,
  AssetId,
  PremintedEntry,
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
export function getPremintedEntry(
  chain: ChainConfig,
  token: Token & { isPreminted: boolean },
  escrow: BackendProjectEscrow,
  project: BackendProject,
): PremintedEntry {
  assert(token.isPreminted)

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
    type: 'preminted',
    address: token.address ?? 'native',
    escrowAddress: escrow.address,
    coingeckoId: token.coingeckoId,
    dataSource: `${chain.name}_preminted_${token.address}`,
    sinceTimestamp,
    untilTimestamp,
    includeInTotal: token.excludeFromTotal ? false : includeInTotal,
    isAssociated,
    bridgedUsing,
    source,
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
