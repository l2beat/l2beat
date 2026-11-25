import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { InMemoryCache } from '@l2beat/shared-pure'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { OpenApi } from '../../OpenApi'
import { GenericErrorResponse } from '../../types'
import {
  findProject,
  PROJECT_ID_OR_SLUG_DESCRIPTION,
  projectNotFoundDescription,
} from '../../utils/findProject'
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
      description: ACTIVITY_CHART_DESCRIPTION,
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
      description: ACTIVITY_CHART_DESCRIPTION,
      tags: ['activity'],
      params: v.object({
        projectId: v.string(),
      }),
      paramDescriptions: { projectId: PROJECT_ID_OR_SLUG_DESCRIPTION },
      query: v.object({
        range: ActivityRangeSchema.optional(),
      }),
      result: ActivityResultSchema,
      errors: {
        404: GenericErrorResponse,
      },
      errorDescriptions: { 404: projectNotFoundDescription('activity data') },
    },
    async (req, res) => {
      const { projectId } = req.params
      const { range = '30d' } = req.query

      const { project, notFoundMessage } = await findProject(ps, projectId, {
        select: ['activityConfig'],
        dataName: 'activity data',
      })

      if (!project) {
        res.status(404).json({ message: notFoundMessage })
        return
      }

      const data = await cache.get(
        {
          key: ['activity', project.id, range],
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
    where: ['scalingInfo'],
    whereNot: ['archivedAt'],
  })

  return projects.map((p) => p.id)
}

const ACTIVITY_CHART_DESCRIPTION = [
  'One point per day. Counts are `null` for days the data is not synced for yet: they are missing, not zero. A synced day with no transactions is `0`.',
  'For a sum of many projects, a day counts as synced once any of them is synced for it, so a project that lags behind is left out of the newest days.',
].join('\n\n')
