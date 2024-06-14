import Router from '@koa/router'
import {
  EthereumAddress,
  ProjectId,
  stringAs,
  stringAsBoolean,
} from '@l2beat/shared-pure'
import { z } from 'zod'

import { assert } from '@l2beat/backend-tools'
import { withTypedContext } from '../../../api/types'
import { Clock } from '../../../tools/Clock'
import { AggregatedService } from './services/AggregatedService'
import { BreakdownService } from './services/BreakdownService'
import { TokenService } from './services/TokenService'
import { TvlService } from './services/TvlService'
import { ApiProject, AssociatedToken } from './utils/types'

export function createTvlRouter(
  tvlService: TvlService,
  aggregatedService: AggregatedService,
  tokenService: TokenService,
  breakdownService: BreakdownService,
  projects: ApiProject[],
  associatedTokens: AssociatedToken[],
  clock: Clock,
) {
  const router = new Router()

  router.get(
    '/api/tvl',
    withTypedContext(
      z.object({
        query: z.object({
          excludeAssociatedTokens: stringAsBoolean(false),
        }),
      }),
      async (ctx) => {
        // If this endpoint is too slow and aggregation layer is to be implemented,
        // remember to add "isAssociated" to createValueId.ts
        if (ctx.query.excludeAssociatedTokens) {
          const excluded = await tvlService.getExcludedTvl(
            clock.getLastHour().add(-1, 'hours'),
            projects,
            associatedTokens,
          )
          ctx.body = excluded
        } else {
          const tvl = await tvlService.getTvl(
            clock.getLastHour().add(-1, 'hours'),
            projects,
          )
          ctx.body = tvl
        }
      },
    ),
  )

  router.get(
    '/api/tvl/aggregate',
    withTypedContext(
      z.object({
        query: z.object({
          projectSlugs: z.string(),
          excludeAssociatedTokens: stringAsBoolean(false),
        }),
      }),
      async (ctx) => {
        const projectSlugs = ctx.query.projectSlugs
          .split(',')
          .map((slug) => slug.trim())

        const filteredProjects = projects.filter((p) =>
          projectSlugs.includes(p.slug),
        )

        const projectIds = filteredProjects.map((p) => p.id.toString())

        const filteredAssociatedTokens = associatedTokens.filter((e) =>
          ctx.query.excludeAssociatedTokens
            ? projectIds.includes(e.project)
            : false,
        )

        const tvl = await aggregatedService.getAggregatedTvl(
          clock.getLastHour().add(-1, 'hours'),
          filteredProjects,
          filteredAssociatedTokens,
        )
        ctx.body = tvl
      },
    ),
  )

  router.get(
    '/api/tvl/token',
    withTypedContext(
      z.object({
        query: z.object({
          project: stringAs(ProjectId),
          chain: z.string(),
          address: z.union([stringAs(EthereumAddress), z.literal('native')]),
        }),
      }),
      async (ctx) => {
        const { chain, project, address } = ctx.query

        const apiProject = projects.find((p) => p.id === project)
        assert(apiProject, 'Project not found!')

        ctx.body = await tokenService.getTokenChart(
          clock.getLastHour().add(-1, 'hours'),
          apiProject,
          { chain, address },
        )
      },
    ),
  )

  router.get('/api/tvl/breakdown', async (ctx) => {
    const breakdown = await breakdownService.getTvlBreakdown(
      // TODO: This is a temporary solution. We should use the last hour
      // instead of the hour before the last hour.
      // This should be fixed by interpolating the data for the last hour when not every project has data for it.
      clock
        .getLastHour()
        .add(-1, 'hours'),
    )

    ctx.body = breakdown
  })

  return router
}
