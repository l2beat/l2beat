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
import { Tvl2Controller } from './Tvl2Controller'
import { AggregateTvlService } from './services/AggregateTvlService'
import { TokenService } from './services/TokenService'
import { ApiProject, AssociatedToken } from './utils/types'

export function createTvl2Router(
  controller: Tvl2Controller,
  aggregatedTvlService: AggregateTvlService,
  tokenService: TokenService,
  projects: ApiProject[],
  associatedTokens: AssociatedToken[],
  clock: Clock,
) {
  const router = new Router()

  router.get(
    ['/api/tvl', '/api/tvl2'],
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
          const excluded = await controller.getExcludedTvl(
            clock.getLastHour().add(-1, 'hours'),
            projects,
          )
          ctx.body = excluded
        } else {
          const tvl = await controller.getTvl(
            clock.getLastHour().add(-1, 'hours'),
          )
          ctx.body = tvl
        }
      },
    ),
  )

  router.get(
    ['/api/tvl/aggregate', '/api/tvl2/aggregate'],
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

        const projectIds = projects.map((p) => p.id.toString())

        const filteredAssociatedTokens = associatedTokens.filter((e) =>
          projectIds.includes(e.project),
        )

        const tvl = await aggregatedTvlService.getAggregatedTvl(
          clock.getLastHour().add(-1, 'hours'),
          filteredProjects,
          filteredAssociatedTokens,
        )
        ctx.body = tvl
      },
    ),
  )

  router.get(
    '/api/tvl2/token',
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
          { chain, address },
          apiProject,
          clock.getLastHour().add(-1, 'hours'),
        )
      },
    ),
  )

  router.get(
    ['/api/project-assets-breakdown', '/api/tvl2/breakdown'],
    async (ctx) => {
      const breakdown = await controller.getTvlBreakdown(
        // TODO: This is a temporary solution. We should use the last hour
        // instead of the hour before the last hour.
        // This should be fixed by interpolating the data for the last hour when not every project has data for it.
        clock
          .getLastHour()
          .add(-1, 'hours'),
      )

      ctx.body = breakdown
    },
  )

  return router
}
