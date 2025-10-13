import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { OpenApi } from '../../OpenApi'
import { GenericErrorResponse } from '../../types'
import { getTvsData } from './getTvsData'
import { TvsRangeSchema, TvsResultSchema } from './types'

export function addTvsRoutes(
  openapi: OpenApi,
  ps: ProjectService,
  db: Database,
) {
  openapi.get(
    '/tvs',
    {
      summary: 'Total Value Secured with ability to control the time range',
      tags: ['tvs'],
      query: v.object({
        range: TvsRangeSchema.optional(),
      }),
      result: TvsResultSchema,
    },
    async (req, res) => {
      const { range } = req.query

      const projectIds = await getTvsProjects(ps)

      const data = await getTvsData(db, range ?? '30d', projectIds)

      res.json(data)
    },
  )

  openapi.get(
    '/tvs/:projectId',
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
      const { range } = req.query

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

      const data = await getTvsData(db, range ?? '30d', [project.id])

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
