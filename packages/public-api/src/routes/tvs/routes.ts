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
      operationId: 'getTvsChart',
      summary: 'Total Value Secured with ability to control the time range',
      description: [TVS_SUM_DESCRIPTION, TVS_CHART_DESCRIPTION].join('\n\n'),
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
      operationId: 'getProjectTvsChart',
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
      operationId: 'getTokenTvsChart',
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
      errorDescriptions: { 404: 'No token has this id.' },
    },
    async (req, res) => {
      const { tokenId } = req.params
      const { range = '30d' } = req.query

      // Anyone can call this, so an id is checked before it costs a query
      // and a cache entry
      const tokenIds = await cache.get(
        { key: ['tvs', 'token-ids'], ttl: UnixTime.DAY },
        () => getTvsTokenIds(ps),
      )
      if (!tokenIds.has(tokenId)) {
        res.status(404).json({ message: `No token has the id "${tokenId}"` })
        return
      }

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
  // Scaling projects only, like the website's scaling TVS and like
  // /v1/activity. DeFi and privacy projects have TVS configs too, and their
  // value is not secured by a scaling project.
  const projects = await ps.getProjects({
    select: ['tvsConfig'],
    where: ['scalingInfo'],
    whereNot: ['archivedAt'],
  })

  return projects.map((p) => p.id)
}

/** The ids of the tokens in any project's TVS config, archived ones too. */
async function getTvsTokenIds(ps: ProjectService): Promise<Set<string>> {
  const projects = await ps.getProjects({ select: ['tvsConfig'] })

  return new Set(projects.flatMap((p) => p.tvsConfig.map((token) => token.id)))
}

const TVS_CHART_DESCRIPTION = [
  'Points are spaced by the resolution of the range: hourly up to 7 days, six-hourly below 180 days, daily otherwise.',
  'A timestamp with no data has no point: it is missing, not zero. Read each point by its `timestamp`, since the spacing can have gaps.',
  'The timestamp of the last point is the time the data is synced until, the same value the website reports as `syncedUntil`. For a sum of many projects it is the latest time any of them has data for, so a project that lags behind is left out of the newest points.',
  '`ethPrice` is the USD price of ETH at that point, the one the website uses to show TVS in ETH: divide `totalTvs` by it. It is `null` when the price is unknown.',
  'Tokens are counted the way the website and `/v1/projects` count them by default: associated tokens are in, restricted RWA tokens are out. The two `exclude` parameters change that.',
].join('\n\n')

const TVS_SUM_DESCRIPTION =
  'The sum covers the layer 2 and layer 3 projects that are not archived, the same set as `/v1/activity`.'

const TVS_QUERY_DESCRIPTIONS = {
  excludeAssociatedTokens:
    'When `true`, leaves out tokens associated with the project, such as its own governance token. Defaults to `false`, like the website.',
  excludeRwaRestrictedTokens:
    'When `true`, leaves out restricted real-world-asset tokens, which only approved holders may own. Defaults to `true`, like the website. Pass `false` to count them.',
}

function parseTokenExclusions(
  query: v.infer<typeof TvsQuerySchema>,
): TokenExclusions {
  return {
    excludeAssociatedTokens: query.excludeAssociatedTokens === 'true',
    excludeRwaRestrictedTokens: query.excludeRwaRestrictedTokens !== 'false',
  }
}

function tokenExclusionsCacheKey(exclusions: TokenExclusions): string[] {
  return [
    `excludeAssociatedTokens=${exclusions.excludeAssociatedTokens}`,
    `excludeRwaRestrictedTokens=${exclusions.excludeRwaRestrictedTokens}`,
  ]
}
