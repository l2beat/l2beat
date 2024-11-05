import { type TokenBridgeRecord, type TokenMetaRecord } from '@l2beat/database'
import { z } from 'zod'
import { db } from '~/db'
import { nanoidSchema } from '~/lib/schemas'
import { procedure, router } from '../trpc'

export const tokensRouter = router({
  tokensFlowDiagram: procedure.private
    .input(z.object({ tokenIds: z.array(nanoidSchema) }))
    .query(async ({ input }) => {
      const checkedTokens = new Set<string>()
      const relations: Record<string, TokenBridgeRecord> = {}
      let tokensToCheck: string[] = input.tokenIds

      while (tokensToCheck.length > 0) {
        tokensToCheck.forEach((tokenId) => checkedTokens.add(tokenId))

        const result = await db.tokenBridge.getByTargetTokenIds(tokensToCheck)
        for (const relation of result) {
          relations[relation.id] = relation
        }

        tokensToCheck = result
          .map((r) => r.sourceTokenId)
          .filter((id) => !checkedTokens.has(id))
      }

      const checkedTokensArray = [...checkedTokens]

      const meta = (
        await db.tokenMeta.getByTokenIdsAndSource(
          checkedTokensArray,
          'Aggregate',
        )
      ).reduce(
        (acc, m) => {
          acc[m.tokenId] = m
          return acc
        },
        {} as Record<string, TokenMetaRecord>,
      )

      return {
        nodes: checkedTokensArray.map((tokenId) => ({
          tokenId,
          meta: meta[tokenId],
        })),
        edges: Object.values(relations).map((r) => ({
          source: r.sourceTokenId,
          target: r.targetTokenId,
          bridge: r.externalBridgeId,
        })),
      }
    }),
})
