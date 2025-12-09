import type { ProjectService } from '@l2beat/config'
import type { QueryExecutor } from '@l2beat/dal'
import type { Database } from '@l2beat/database'
import { ProjectId, TokenId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { InMemoryCache } from '../../cache/InMemoryCache'
import type { OpenApi } from '../../OpenApi'
import { GenericErrorResponse } from '../../types'
import { getTokenTvsData } from './getTokenTvsData'
import { getTvsData } from './getTvsData'
import { TokenTvsResultSchema, TvsRangeSchema, TvsResultSchema } from './types'

export function addTvsRoutes(
  openapi: OpenApi,
  ps: ProjectService,
  db: Database,
  queryExecutor: QueryExecutor,
  cache: InMemoryCache,
) {
  openapi.get(
    '/v1/tvs',
    {
      summary: 'Total Value Secured with ability to control the time range',
      tags: ['tvs'],
      query: v.object({
        range: TvsRangeSchema.optional(),
      }),
      result: TvsResultSchema,
    },
    async (req, res) => {
      const { range = '30d' } = req.query

      const data = await cache.get(
        {
          key: ['tvs', range],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        async () => {
          const projectIds = await getTvsProjects(ps)

          return getTvsData(queryExecutor, range, projectIds)
        },
      )

      res.json(data)
    },
  )

  openapi.get(
    '/v1/tvs/:projectId',
    {
      summary:
        'Total Value Secured for a specific project with ability to control the time range.',
      tags: ['tvs'],
      params: v.object({
        projectId: v.string(),
      }),
      query: v.object({
        range: TvsRangeSchema.optional(),
      }),
      result: TvsResultSchema,
      errors: {
        404: GenericErrorResponse,
      },
    },
    async (req, res) => {
      const { projectId } = req.params
      const { range = '30d' } = req.query
      const project = await ps.getProject({
        id: ProjectId(projectId),
        select: ['tvsConfig'],
      })

      if (!project) {
        res
          .status(404)
          .json({ message: `Project with id ${projectId} does not exist` })
        return
      }

      const data = await cache.get(
        {
          key: ['tvs', projectId, range],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        () => getTvsData(queryExecutor, range, [project.id]),
      )

      res.json(data)
    },
  )

  openapi.get(
    '/v1/tvs/token/:tokenId',
    {
      summary:
        'Total Value Secured for a specific token with ability to control the time range.',
      tags: ['tvs'],
      params: v.object({
        tokenId: v.string(),
      }),
      query: v.object({
        range: TvsRangeSchema.optional(),
      }),
      result: TokenTvsResultSchema,
      errors: {
        404: GenericErrorResponse,
      },
    },
    async (req, res) => {
      const { tokenId } = req.params
      const { range = '30d' } = req.query

      const data = await cache.get(
        {
          key: ['tvs', tokenId, range],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        () => getTokenTvsData(db, range, TokenId(tokenId)),
      )

      res.json(data)
    },
  )
}

async function getTvsProjects(ps: ProjectService): Promise<ProjectId[]> {
  const projects = await ps.getProjects({
    select: ['tvsConfig'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  return projects.map((p) => p.id)
}
