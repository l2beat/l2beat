import type { Project, TvsToken } from '@l2beat/config'
import { notUndefined, ProjectId, type TokenId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import { getLatestTvsTimestamp } from '../utils/getLatestTvsTimestamp'

export type ProjectToken = {
  id: TokenId
  name: string
  symbol: string
  source: TvsToken['source']
  category: TvsToken['category']
  value: number
  iconUrl: string
}

export const ProjectTokensParams = v.object({ projectId: v.string() })
export type ProjectTokensParams = v.infer<typeof ProjectTokensParams>

/**
 * The token picker's list, fetched when the picker is about to open. Sent
 * with the page, arbitrum's 352 tokens were 74 KB of its page data.
 */
export async function getProjectTokens({ projectId }: ProjectTokensParams) {
  const project = await ps.getProject({
    id: ProjectId(projectId),
    optional: ['tvsConfig'],
  })
  return project ? ((await getTokensForProject(project)) ?? []) : []
}

export async function getTokensForProject(
  project: Project<never, 'tvsConfig'>,
): Promise<ProjectToken[] | undefined> {
  if (!project.tvsConfig) return undefined
  if (env.MOCK) {
    return getMockTokensForProject(project)
  }

  const db = getDb()
  const tokenValues = await db.tvsTokenValue.getByProjectAtOrBefore(
    project.id,
    await getLatestTvsTimestamp(),
  )

  const tokenValuesMap = new Map(tokenValues.map((x) => [x.tokenId, x]))

  const projectTokens: ProjectToken[] = project.tvsConfig
    .map((t) => {
      const tokenValue = tokenValuesMap.get(t.id)
      if (!tokenValue) return undefined
      return {
        id: t.id,
        name: t.name,
        symbol: t.symbol,
        source: t.source,
        category: t.category,
        value: tokenValue.valueForProject,
        iconUrl: t.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
      }
    })
    .filter(notUndefined)

  projectTokens.sort((a, b) => b.value - a.value)

  return projectTokens
}

function getMockTokensForProject(
  project: Project<never, 'tvsConfig'>,
): ProjectToken[] | undefined {
  if (!project.tvsConfig) return undefined
  return project.tvsConfig.map((t) => ({
    id: t.id,
    name: t.name,
    symbol: t.symbol,
    source: t.source,
    category: t.category,
    value: 1000,
    iconUrl: t.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
  }))
}
