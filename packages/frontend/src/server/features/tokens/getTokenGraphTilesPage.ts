import { v } from '@l2beat/validate'
import type { TokenGraphTile } from './buildTokenGraphTiles'
import { getTokenGraphTiles } from './getTokenGraphTiles'

const PAGE_SIZE = 24

export const TokenGraphTilesParams = v.object({
  cursor: v
    .number()
    .check((n) => Number.isInteger(n) && n >= 0)
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
}: TokenGraphTilesParams): Promise<TokenGraphTilesPage> {
  const tiles = await getTokenGraphTiles()
  const end = cursor + PAGE_SIZE
  return {
    items: tiles.slice(cursor, end),
    nextCursor: end < tiles.length ? end : undefined,
    total: tiles.length,
  }
}
