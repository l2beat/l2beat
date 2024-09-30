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

  const bridgedUsing = escrow.bridgedUsing
  const includeInTotal = escrow.includeInTotal ?? true
  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const sinceTimestamp = UnixTime.max(
    UnixTime.max(chain.minTimestampForTvl, token.sinceTimestamp),
    escrow.sinceTimestamp,
  )
  const source = escrow.source ?? 'canonical'
  const untilTimestamp = getEscrowUntilTimestamp(
    token.untilTimestamp,
    escrow.untilTimestamp,
  )

  return {
    address: token.address ?? 'native',
    assetId: AssetId.create(
      chainConverter.toName(token.chainId),
      token.address,
    ),
    bridgedUsing,
    category: token.category,
    chain: chainConverter.toName(token.chainId),
    coingeckoId: token.coingeckoId,
    dataSource: `${chain.name}_preminted_${token.address}`,
    decimals: token.decimals,
    escrowAddress: escrow.address,
    includeInTotal: token.excludeFromTotal ? false : includeInTotal,
    isAssociated,
    project: project.projectId,
    sinceTimestamp,
    source,
    symbol: token.symbol,
    type: 'preminted',
    untilTimestamp,
  }
}
