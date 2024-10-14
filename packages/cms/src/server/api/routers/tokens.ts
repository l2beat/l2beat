import { z } from 'zod'
import { procedure, router } from '../trpc'
import { db } from '~/db'
import { type TokenMetaRecord, type TokenBridgeRecord } from '@l2beat/database'

export const tokensRouter = router({
  getTokenBackedPath: procedure.THIS_SHOULD_BE_PRIVATE_BUT_IS_NOT_YET.input(
    z.object({ tokenId: z.string().length(21) }),
  ).query(async ({ input }) => {
    const checkedTokens = new Set<string>()
    const relations: Record<string, TokenBridgeRecord> = {}
    const tokensToCheck: string[] = [input.tokenId]

    while (tokensToCheck.length > 0) {
      tokensToCheck.forEach((tokenId) => checkedTokens.add(tokenId))

      const result = await db.tokenBridge.getByTargetTokenIds(tokensToCheck)
      for (const relation of result) {
        relations[relation.id] = relation
        if (!checkedTokens.has(relation.sourceTokenId)) {
          tokensToCheck.push(relation.sourceTokenId)
        }
      }
    }

    const checkedTokensArray = [...checkedTokens]

    const meta = (
      await db.tokenMeta.getByTokenIdsAndSource(checkedTokensArray, 'Aggregate')
    ).reduce(
      (acc, m) => {
        acc[m.tokenId] = m
        return acc
      },
      {} as Record<string, TokenMetaRecord>,
    )

    return {
      points: checkedTokensArray.map((tokenId) => ({
        tokenId,
        meta: meta[tokenId],
      })),
      lines: Object.values(relations).map((r) => ({
        source: r.sourceTokenId,
        target: r.targetTokenId,
        bridge: r.externalBridgeId,
      })),
    }
  }),
})
