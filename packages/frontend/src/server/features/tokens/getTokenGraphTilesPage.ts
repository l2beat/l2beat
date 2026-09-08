import { v } from '@l2beat/validate'
import type { TokenGraphTile } from './buildTokenGraphTiles'
import { getTokenGraphTiles } from './getTokenGraphTiles'

const PAGE_SIZE = 24
const MAX_PAGE_SIZE = 100

export const TokenGraphTilesParams = v.object({
  cursor: v
    .number()
    .check((n) => Number.isInteger(n) && n >= 0)
    .optional(),
  limit: v
    .number()
    .check((n) => Number.isInteger(n) && n >= 1 && n <= MAX_PAGE_SIZE)
    .optional(),
})
export type TokenGraphTilesParams = v.infer<typeof TokenGraphTilesParams>

export interface TokenGraphTilesPage {
  items: TokenGraphTile[]
  nextCursor: number | undefined
  total: number
}

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
