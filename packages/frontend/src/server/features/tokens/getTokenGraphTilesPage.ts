import { v } from '@l2beat/validate'
import type { TokenGraphTile } from './buildTokenGraphTiles'
import { getTokenGraphTiles } from './getTokenGraphTiles'

export const TokenTilesParams = v.object({
  cursor: v.number().optional(),
  limit: v.number().optional(),
  chain: v.string().optional(),
  plugin: v.string().optional(),
  mechanism: v
    .union([v.literal('lockAndMint'), v.literal('burnAndMint')])
    .optional(),
  /** Off by default: a token with no relation has no picture to show. */
  includeWithoutRelations: v.boolean().optional(),
})
export type TokenTilesParams = v.infer<typeof TokenTilesParams>

export interface TokenTilesFacets {
  chains: [string, number][]
  plugins: [string, number][]
}

export interface TokenTilesPage {
  items: TokenGraphTile[]
  nextCursor: number | undefined
  total: number
  /** Sent with the first page only; the same for every page of a filter set. */
  facets: TokenTilesFacets | undefined
}

export const TOKEN_TILES_PAGE_SIZE = 24

/**
 * A page of cards. The whole catalogue is ~3.5MB of tiles, so it never travels
 * in one response — filtering, sorting and slicing all happen in memory over
 * the cached list, the same way `getInteropTokensInfinite` pages its tokens.
 */
export async function getTokenGraphTilesPage(
  params: TokenTilesParams,
): Promise<TokenTilesPage> {
  const all = await getTokenGraphTiles()
  const matching = all.filter((tile) => matches(tile, params))

  const start = params.cursor ?? 0
  const limit = params.limit ?? TOKEN_TILES_PAGE_SIZE
  const items = matching.slice(start, start + limit)
  const nextCursor = start + limit < matching.length ? start + limit : undefined

  return {
    items,
    nextCursor,
    total: matching.length,
    facets: start === 0 ? getFacets(all) : undefined,
  }
}

function matches(tile: TokenGraphTile, params: TokenTilesParams): boolean {
  if (!params.includeWithoutRelations && !tile.hasRelations) return false
  if (params.chain && !tile.chainIds.includes(params.chain)) return false
  if (params.plugin && !tile.plugins.includes(params.plugin)) return false
  if (params.mechanism && !tile.mechanisms.includes(params.mechanism)) {
    return false
  }
  return true
}

/**
 * Options are counted over tokens that have relations, since those are the only
 * ones a filter can usefully narrow — otherwise every chain would advertise
 * hundreds of single-deployment tokens with nothing to show.
 */
function getFacets(all: TokenGraphTile[]): TokenTilesFacets {
  const withRelations = all.filter((tile) => tile.hasRelations)
  return {
    chains: countBy(withRelations.flatMap((tile) => tile.chainIds)),
    plugins: countBy(withRelations.flatMap((tile) => tile.plugins)),
  }
}

function countBy(values: string[]): [string, number][] {
  const counts = new Map<string, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  return [...counts].toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}
