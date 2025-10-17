import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { InMemoryCache } from '../../cache/InMemoryCache'
import type { OpenApi } from '../../OpenApi'
import { GenericErrorResponse } from '../../types'
import { getActivityData } from './getActivityData'
import { ActivityRangeSchema, ActivityResultSchema } from './types'

export function addActivityRoutes(
  openapi: OpenApi,
  ps: ProjectService,
  db: Database,
  cache: InMemoryCache,
) {
  openapi.get(
    '/v1/activity',
    {
      summary: 'Activity data with ability to control the time range.',
      tags: ['activity'],
      query: v.object({
        range: ActivityRangeSchema.optional(),
      }),
      result: ActivityResultSchema,
    },
    async (req, res) => {
      const { range = '30d' } = req.query

      const data = await cache.get(
        {
          key: ['activity', range],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        async () => {
          const projectIds = await getActivityProjects(ps)
          return getActivityData(db, range, projectIds)
        },
      )

      res.json(data)
    },
  )

  openapi.get(
    '/v1/activity/:projectId',
    {
      summary:
        'Activity data for a specific project with ability to control the time range.',
      tags: ['activity'],
      params: v.object({
        projectId: v.string(),
      }),
      query: v.object({
        range: ActivityRangeSchema.optional(),
      }),
      result: ActivityResultSchema,
      errors: {
        404: GenericErrorResponse,
      },
    },
    async (req, res) => {
      const { projectId } = req.params
      const { range = '30d' } = req.query

      const project = await ps.getProject({
        id: ProjectId(projectId),
        select: ['activityConfig'],
      })

      if (!project) {
        res
          .status(404)
          .json({ message: `Project with id ${projectId} does not exist` })
        return
      }

      const data = await cache.get(
        {
          key: ['activity', projectId, range],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        () => getActivityData(db, range, [project.id]),
      )

      res.json(data)
    },
  )
}

async function getActivityProjects(ps: ProjectService): Promise<ProjectId[]> {
  const projects = await ps.getProjects({
    select: ['activityConfig'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  return projects.map((p) => p.id)
}
