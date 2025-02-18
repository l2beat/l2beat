import type { ChainConfig } from '@l2beat/config'
import {
  assert,
  AssetId,
  type PremintedEntry,
  type Token,
  UnixTime,
} from '@l2beat/shared-pure'
import type { BackendProject, BackendProjectEscrow } from '../../BackendProject'
import { getEscrowUntilTimestamp } from '../../utils/getEscrowUntilTimestamp'

export function getPremintedEntry(
  chain: ChainConfig,
  token: Token & { isPreminted: boolean },
  escrow: BackendProjectEscrow,
  project: BackendProject,
): PremintedEntry {
  assert(token.isPreminted)
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')

  const address = token.address ?? 'native'
  const assetId = AssetId.create(chain.name, address)
  const dataSource = `${chain.name}_preminted_${token.address}`
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
  const type = 'preminted'
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
    coingeckoId: token.coingeckoId,
    dataSource: dataSource,
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
