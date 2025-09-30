import { v } from '@l2beat/validate'
import type { OpenApi } from '../OpenApi'

const ProjectSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    chainId: v.number(),
  })
  .describe('Project')

export function addProjectsRoutes(openapi: OpenApi) {
  openapi.get(
    '/projects',
    {
      tags: ['projects'],
      result: v.array(ProjectSchema),
    },
    (_, res) => {
      res.json([{ id: 'hello', slug: 'hello', name: 'hello', chainId: 1 }])
    },
  )

  openapi.get(
    '/project/:projectId',
    {
      tags: ['projects'],
      params: v.object({
        projectId: v.string(),
      }),
      result: ProjectSchema,
    },
    (req, res) => {
      const { projectId } = req.params
      res.json({
        id: projectId,
        slug: projectId,
        name: projectId,
        chainId: 1,
      })
    },
  )
}
