import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { InMemoryCache } from '@l2beat/shared-pure'
import { type ProjectId, TokenId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { OpenApi } from '../../OpenApi'
import { GenericErrorResponse } from '../../types'
import {
  findProject,
  projectNotFoundDescription,
} from '../../utils/findProject'
import { getTokenTvsData } from './getTokenTvsData'
import { getTvsData } from './getTvsData'
import {
  type TokenExclusions,
  TokenTvsResultSchema,
  TvsQuerySchema,
  TvsRangeSchema,
  TvsResultSchema,
} from './types'

export function addTvsRoutes(
  openapi: OpenApi,
  ps: ProjectService,
  db: Database,
  cache: InMemoryCache,
) {
  openapi.get(
    '/v1/tvs',
    {
      summary: 'Total Value Secured with ability to control the time range',
      description: TVS_CHART_DESCRIPTION,
      tags: ['tvs'],
      query: TvsQuerySchema,
      queryDescriptions: TVS_QUERY_DESCRIPTIONS,
      result: TvsResultSchema,
    },
    async (req, res) => {
      const { range = '30d' } = req.query
      const exclusions = parseTokenExclusions(req.query)

      const data = await cache.get(
        {
          key: ['tvs', range, ...tokenExclusionsCacheKey(exclusions)],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        async () => {
          const projectIds = await getTvsProjects(ps)

          return getTvsData(db, range, projectIds, exclusions)
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
      description: TVS_CHART_DESCRIPTION,
      tags: ['tvs'],
      params: v.object({
        projectId: v.string(),
      }),
      query: TvsQuerySchema,
      queryDescriptions: TVS_QUERY_DESCRIPTIONS,
      result: TvsResultSchema,
      errors: {
        404: GenericErrorResponse,
      },
      errorDescriptions: { 404: projectNotFoundDescription('TVS data') },
    },
    async (req, res) => {
      const { projectId } = req.params
      const { range = '30d' } = req.query
      const exclusions = parseTokenExclusions(req.query)
      const { project, notFoundMessage } = await findProject(ps, projectId, {
        select: ['tvsConfig'],
        dataName: 'TVS data',
      })

      if (!project) {
        res.status(404).json({ message: notFoundMessage })
        return
      }

      const data = await cache.get(
        {
          key: [
            'tvs',
            projectId,
            range,
            ...tokenExclusionsCacheKey(exclusions),
          ],
          ttl: 5 * UnixTime.MINUTE,
          staleWhileRevalidate: 5 * UnixTime.MINUTE,
        },
        () => getTvsData(db, range, [project.id], exclusions),
      )

      res.json(data)
    },
  )

  openapi.get(
    '/v1/tvs/token/:tokenId',
    {
      summary:
        'Total Value Secured for a specific token with ability to control the time range.',
      description: 'This endpoint may be affected by changes in the future.',
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
    whereNot: ['archivedAt'],
  })

  return projects.map((p) => p.id)
}

const TVS_CHART_DESCRIPTION = [
  'Points are spaced by the resolution of the range: hourly up to 7 days, six-hourly below 180 days, daily otherwise.',
  'A timestamp with no data has no point: it is missing, not zero. Read each point by its `timestamp`, since the spacing can have gaps.',
  'The timestamp of the last point is the time the data is synced until, the same value the website reports as `syncedUntil`. For a sum of many projects it is the latest time any of them has data for, so a project that lags behind is left out of the newest points.',
  '`ethPrice` is the USD price of ETH at that point, the one the website uses to show TVS in ETH: divide `totalTvs` by it. It is `null` when the price is unknown.',
  'Unlike the website, this endpoint counts restricted RWA tokens by default. To count tokens the way the website does, pass `excludeRwaRestrictedTokens=true`. The sum of all projects also includes projects the website does not list under scaling.',
].join('\n\n')

const TVS_QUERY_DESCRIPTIONS = {
  excludeAssociatedTokens:
    'When `true`, leaves out tokens associated with the project, such as its own governance token. Defaults to `false`, like the website.',
  excludeRwaRestrictedTokens:
    'When `true`, leaves out restricted real-world-asset tokens, which only approved holders may own. Defaults to `false`, which counts them. The website defaults to `true`: pass `true` to filter tokens the way it does.',
}

function parseTokenExclusions(
  query: v.infer<typeof TvsQuerySchema>,
): TokenExclusions {
  return {
    excludeAssociatedTokens: query.excludeAssociatedTokens === 'true',
    excludeRwaRestrictedTokens: query.excludeRwaRestrictedTokens === 'true',
  }
}

function tokenExclusionsCacheKey(exclusions: TokenExclusions): string[] {
  return [
    `excludeAssociatedTokens=${exclusions.excludeAssociatedTokens}`,
    `excludeRwaRestrictedTokens=${exclusions.excludeRwaRestrictedTokens}`,
  ]
}
