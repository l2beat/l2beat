import type { ChainConfig, Project, ProjectTvlEscrow } from '@l2beat/config'
import {
  assert,
  AssetId,
  type PremintedEntry,
  type Token,
} from '@l2beat/shared-pure'
import { getEscrowUntilTimestamp } from '../getEscrowUntilTimestamp'

export function getPremintedEntry(
  chain: ChainConfig,
  token: Token & { isPreminted: boolean },
  escrow: ProjectTvlEscrow,
  project: Project<'tvlConfig', 'chainConfig'>,
): PremintedEntry {
  assert(token.isPreminted)
  assert(chain.sinceTimestamp, 'Chain should have sinceTimestamp')

  const address = token.address ?? 'native'
  const assetId = AssetId.create(chain.name, address)
  const dataSource = `${chain.name}_preminted_${token.address}`
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
    project: project.id,
    sinceTimestamp: sinceTimestamp,
    source: source,
    symbol: token.symbol,
    type: type,
    untilTimestamp: untilTimestamp,
  }
}
