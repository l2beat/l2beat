import type { Project, TvsToken } from '@l2beat/config'
import { notUndefined, type TokenId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getStaticAsset } from '~/server/features/utils/getProjectIcon'
import { getTvsTargetTimestamp } from '../utils/getTvsTargetTimestamp'

export type ProjectToken = {
  id: TokenId
  name: string
  symbol: string
  source: TvsToken['source']
  category: TvsToken['category']
  value: number
  iconUrl: string
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
    getTvsTargetTimestamp(),
  )

  const tokenValuesMap = new Map(tokenValues.map((x) => [x.tokenId, x]))
  const placeholderIcon = getStaticAsset('/images/token-placeholder.png')

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
        iconUrl: t.iconUrl ?? placeholderIcon,
      }
    })
    .filter(notUndefined)

  projectTokens.sort((a, b) => b.value - a.value)

  return projectTokens
}

function getMockTokensForProject(project: Project<never, 'tvsConfig'>) {
  if (!project.tvsConfig) return undefined
  return project.tvsConfig.map((t) => ({
    ...t,
    iconUrl: t.iconUrl ?? getStaticAsset('/images/token-placeholder.png'),
    value: 1000,
  }))
}
