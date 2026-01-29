import type { ProjectContract, ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { InMemoryCache } from '../../cache/InMemoryCache'
import type { OpenApi } from '../../OpenApi'
import { GenericErrorResponse } from '../../types'
import { getTokensData } from './getTokensData'
import {
  ContractSchema,
  DetailedProjectSchema,
  ProjectSchema,
  TokenSchema,
} from './types'

export function addProjectsRoutes(
  openapi: OpenApi,
  ps: ProjectService,
  db: Database,
  cache: InMemoryCache,
) {
  openapi.get(
    '/v1/projects',
    {
      summary: 'List all projects',
      tags: ['projects'],
      result: v.array(ProjectSchema),
    },
    async (_, res) => {
      const projects = await ps.getProjects({
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
    '/v1/project/:projectId',
    {
      summary: 'Get a project by ID',
      tags: ['projects'],
      params: v.object({
        projectId: v.string(),
      }),
      result: DetailedProjectSchema,
      errors: {
        404: GenericErrorResponse,
      },
    },
    async (req, res) => {
      const { projectId } = req.params

      const project = await ps.getProject({
        id: ProjectId(projectId),
        optional: [
          'scalingInfo',
          'chainConfig',
          'bridgeInfo',
          'ecosystemInfo',
          'display',
          'isUpcoming',
          'archivedAt',
        ],
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
        type: project.scalingInfo?.type,
        isUpcoming: project.isUpcoming,
        isArchived: project.archivedAt !== undefined,
        category: project.bridgeInfo?.category,
        hostChain: project.scalingInfo?.hostChain.name,
        stacks: project.scalingInfo?.stacks ?? [],
        ecosystem: project.ecosystemInfo?.id,
        gasTokens: project.chainConfig?.gasTokens ?? [],
        stage: project.scalingInfo?.stage,
        purposes: project.scalingInfo?.purposes ?? [],
        badges: project.display?.badges.map((badge) => badge.name) ?? [],
      })
    },
  )

  openapi.get(
    '/v1/project/:projectId/contracts',
    {
      summary: ' List of contracts associated with the project and the chains',
      tags: ['projects'],
      params: v.object({
        projectId: v.string(),
      }),
      result: v.array(ContractSchema),
      errors: {
        404: GenericErrorResponse,
      },
    },
    async (req, res) => {
      const { projectId } = req.params

      const project = await ps.getProject({
        id: ProjectId(projectId),
        optional: ['chainConfig', 'contracts'],
      })

      if (!project) {
        res.status(404).json()
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
    },
    async (req, res) => {
      const { projectId } = req.params

      const project = await ps.getProject({
        id: ProjectId(projectId),
        optional: ['tvsConfig'],
      })

      if (!project) {
        res.status(404).json()
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
