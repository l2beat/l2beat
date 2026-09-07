import { v } from '@l2beat/validate'
import type { TokenGraphTile } from './buildTokenGraphTiles'
import { getTokenGraphTiles } from './getTokenGraphTiles'

export const TokenGraphTilesParams = v.object({
  cursor: v.number().optional(),
  limit: v.number().optional(),
})
export type TokenGraphTilesParams = v.infer<typeof TokenGraphTilesParams>

export interface TokenGraphTilesPage {
  items: TokenGraphTile[]
  nextCursor: number | undefined
  total: number
}

const PAGE_SIZE = 24

/**
 * A page of cards, sliced in memory over the cached list the same way
 * `getInteropTokensInfinite` pages its tokens. Thousands of tiles never travel
 * in one response.
 */
export async function getTokenGraphTilesPage({
  cursor = 0,
  limit = PAGE_SIZE,
}: TokenGraphTilesParams): Promise<TokenGraphTilesPage> {
  const tiles = await getTokenGraphTiles()
  return {
    items: tiles.slice(cursor, cursor + limit),
    nextCursor: cursor + limit < tiles.length ? cursor + limit : undefined,
    total: tiles.length,
  }
}
