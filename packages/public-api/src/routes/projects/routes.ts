import type { ProjectContract, ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { InMemoryCache } from '@l2beat/shared-pure'
import { assert, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { OpenApi } from '../../OpenApi'
import { GenericErrorResponse } from '../../types'
import {
  findProject,
  projectNotFoundDescription,
} from '../../utils/findProject'
import { getProjectsData } from './getProjectsData'
import { getTokensData } from './getTokensData'
import { ContractSchema, ProjectSchema, TokenSchema } from './types'

export function addProjectsRoutes(
  openapi: OpenApi,
  ps: ProjectService,
  db: Database,
  cache: InMemoryCache,
) {
  const listProjects = () =>
    cache.get(
      {
        key: ['projects'],
        ttl: 5 * UnixTime.MINUTE,
        staleWhileRevalidate: 5 * UnixTime.MINUTE,
      },
      () => getProjectsData(ps, db),
    )

  openapi.get(
    '/v1/projects',
    {
      operationId: 'listProjects',
      summary: 'List all projects',
      description: PROJECT_DESCRIPTION,
      tags: ['projects'],
      query: v.object({
        isArchived: v.enum(['true', 'false']).optional(),
      }),
      queryDescriptions: {
        isArchived:
          'When `false`, lists only active projects; when `true`, only archived ones. Lists both when left out.',
      },
      result: v.array(ProjectSchema),
    },
    async (req, res) => {
      const { isArchived } = req.query
      const projects = await listProjects()
      res.json(
        isArchived === undefined
          ? projects
          : projects.filter((p) => p.isArchived === (isArchived === 'true')),
      )
    },
  )

  openapi.get(
    '/v1/project/:projectId',
    {
      operationId: 'getProject',
      summary: 'Get a project by ID',
      description: PROJECT_DESCRIPTION,
      tags: ['projects'],
      params: v.object({
        projectId: v.string(),
      }),
      result: ProjectSchema,
      errors: {
        404: GenericErrorResponse,
      },
      errorDescriptions: { 404: projectNotFoundDescription() },
    },
    async (req, res) => {
      const { projectId } = req.params

      const { project, notFoundMessage } = await findProject(ps, projectId, {})

      if (!project) {
        res.status(404).json({ message: notFoundMessage })
        return
      }

      const data = (await listProjects()).find((p) => p.id === project.id)
      assert(data, 'Project missing from the projects list')
      res.json(data)
    },
  )

  openapi.get(
    '/v1/project/:projectId/contracts',
    {
      operationId: 'listProjectContracts',
      summary: 'List of contracts associated with the project and the chains',
      tags: ['projects'],
      params: v.object({
        projectId: v.string(),
      }),
      result: v.array(ContractSchema),
      errors: {
        404: GenericErrorResponse,
      },
      errorDescriptions: { 404: projectNotFoundDescription() },
    },
    async (req, res) => {
      const { projectId } = req.params

      const { project, notFoundMessage } = await findProject(ps, projectId, {
        optional: ['chainConfig', 'contracts'],
      })

      if (!project) {
        res.status(404).json({ message: notFoundMessage })
        return
      }

      if (!project.contracts) {
        res.json([])
        return
      }

      const contracts = Object.entries(project.contracts.addresses).flatMap(
        ([chain, contracts]) =>
          contracts.map((contract: ProjectContract) => {
            const chainSpecificAddress = ChainSpecificAddress(contract.address)

            return {
              name: contract.name,
              contractAddress:
                ChainSpecificAddress.address(chainSpecificAddress),
              chain: chain,
            }
          }),
      )

      res.json(contracts)
    },
  )

  openapi.get(
    '/v1/project/:projectId/tokens',
    {
      operationId: 'listProjectTokens',
      summary: 'List of tokens associated with the project',
      description: 'This endpoint may be affected by changes in the future.',
      tags: ['projects'],
      params: v.object({
        projectId: v.string(),
      }),
      result: v.array(TokenSchema),
      errors: {
        404: GenericErrorResponse,
      },
      errorDescriptions: { 404: projectNotFoundDescription() },
    },
    async (req, res) => {
      const { projectId } = req.params

      const { project, notFoundMessage } = await findProject(ps, projectId, {
        optional: ['tvsConfig', 'tvsTokenAddresses', 'chainConfig'],
      })

      if (!project) {
        res.status(404).json({ message: notFoundMessage })
        return
      }

      if (!project.tvsConfig) {
        res.json([])
        return
      }

      const data = await cache.get(
        {
          key: ['projects', 'tokens', projectId],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        () => getTokensData(db, project),
      )

      res.json(data)
    },
  )
}

const PROJECT_DESCRIPTION = [
  '`stage`, `risks` and `isUnderReview` are the assessment the ETHBEAT website shows. Only layer 2 and layer 3 projects have a stage and risks.',
  '`tvs` is `null` when we do not track TVS for the project or have not synced it yet. It leaves out restricted RWA tokens, like the website and like `/v1/tvs/{projectId}` by default.',
].join('\n\n')
