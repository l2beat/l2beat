import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { OpenApi } from '../OpenApi'
import { GenericErrorResponse } from '../types'
import { getActivityData } from './getActivityData'
import { ActivityRangeSchema, ActivityResultSchema } from './types'

export function addActivityRoutes(
  openapi: OpenApi,
  ps: ProjectService,
  db: Database,
) {
  openapi.get(
    '/activity',
    {
      summary: 'Activity data with ability to control the time range.',
      tags: ['activity'],
      query: v.object({
        range: ActivityRangeSchema.optional(),
      }),
      result: ActivityResultSchema,
    },
    async (req, res) => {
      const { range } = req.query

      const projectIds = await getActivityProjects(ps)

      const data = await getActivityData(db, range ?? '30d', projectIds)

      res.json(data)
    },
  )

  openapi.get(
    '/activity/:projectId',
    {
      summary:
        'Activity data for a specific project with ability to control the time range.',
      tags: ['tvs'],
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
      const { range } = req.query

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

      const data = await getActivityData(db, range ?? '30d', [project.id])

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
