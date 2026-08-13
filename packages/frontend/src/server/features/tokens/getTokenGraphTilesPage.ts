import { v } from '@l2beat/validate'
import type { TokenGraphTile } from './buildTokenGraphTiles'
import { getTokenGraphTiles } from './getTokenGraphTiles'

export const TokenTilesParams = v.object({
  cursor: v.number().optional(),
  limit: v.number().optional(),
})
export type TokenTilesParams = v.infer<typeof TokenTilesParams>

export interface TokenTilesPage {
  items: TokenGraphTile[]
  nextCursor: number | undefined
  total: number
}

export const TOKEN_TILES_PAGE_SIZE = 24

/**
 * A page of cards. The whole catalogue is ~3.5MB of tiles, so it never travels
 * in one response — sorting and slicing both happen in memory over the cached
 * list, the same way `getInteropTokensInfinite` pages its tokens.
 *
 * Tokens with no relation at all are left out: there is no picture to draw.
 */
export async function getTokenGraphTilesPage(
  params: TokenTilesParams,
): Promise<TokenTilesPage> {
  const all = await getTokenGraphTiles()
  const matching = all.filter((tile) => tile.hasRelations)

  const start = params.cursor ?? 0
  const limit = params.limit ?? TOKEN_TILES_PAGE_SIZE
  const items = matching.slice(start, start + limit)
  const nextCursor = start + limit < matching.length ? start + limit : undefined

  return {
    items,
    nextCursor,
    total: matching.length,
  }
}
