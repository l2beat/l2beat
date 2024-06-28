import { z } from 'zod'
import { procedure, router } from '../trpc'
import { TvlApiResponse } from '@l2beat/shared-pure'
import { db } from '~/server/database'

export const tvlRouter = router({
  summary: procedure
    .input(
      z.object({
        excludeAssociatedTokens: z.boolean().optional(),
        projectSlugs: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      const searchParams = new URLSearchParams({
        ...(input.excludeAssociatedTokens
          ? { excludeAssociatedTokens: 'true' }
          : {}),
        ...(input.projectSlugs
          ? { filteredSlugs: input.projectSlugs.join(',') }
          : {}),
      })
      const res = await fetch(
        `https://api.l2beat.com/api/tvl/summary?${searchParams.toString()}`,
      )
      const data = TvlApiResponse.parse(await res.json())


      const response = {
        layer2s: {
          daily:,
          sixHourly:,
          hourly:,
        },
        projects: {
          arbitrum: 20000000,
          optimism: 30000000
        }
      }
    }),
})
