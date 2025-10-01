import { ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { OpenApi } from '../OpenApi'
import { GenericErrorResponse } from '../types'

const ProjectSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    chainId: v.number().optional(),
  })
  .describe('Project')

const projectService = new ProjectService()

export function addProjectsRoutes(openapi: OpenApi) {
  openapi.get(
    '/projects',
    {
      tags: ['Projects'],
      result: v.array(ProjectSchema),
    },
    async (_, res) => {
      const projects = await projectService.getProjects({
        optional: ['chainConfig'],
      })
      const response = projects.map((project) => ({
        id: project.id,
        slug: project.slug,
        name: project.name,
        chainId: project.chainConfig?.chainId,
      }))
      res.json(response)
    },
  )

  openapi.get(
    '/project/:projectId',
    {
      tags: ['Projects'],
      params: v.object({
        projectId: v.string(),
      }),
      result: ProjectSchema,
      errors: {
        404: GenericErrorResponse,
      },
    },
    async (req, res) => {
      const { projectId } = req.params

      const project = await projectService.getProject({
        id: ProjectId(projectId),
        optional: ['chainConfig'],
      })

      if (!project) {
        res
          .status(404)
          .json({ message: `Project with id ${projectId} does not exist` })
        return
      }

      res.json({
        id: project.id,
        slug: project.slug,
        name: project.name,
        chainId: project.chainConfig?.chainId,
      })
    },
  )
}
