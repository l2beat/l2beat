import type { Project, TvsToken } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getStaticAsset } from '~/server/features/utils/getProjectIcon'
import { getTvsTargetTimestamp } from '../utils/getTvsTargetTimestamp'

export type ProjectTokens = Record<TvsToken['source'], ProjectToken[]>
export type ProjectToken = TvsToken & {
  usdValue: number
  iconUrl: string
}

export async function getTokensForProject(
  project: Project<never, 'tvsConfig'>,
): Promise<ProjectTokens | undefined> {
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

  const withUsdValue = project.tvsConfig
    .map((t) => {
      const tokenValue = tokenValuesMap.get(t.id)
      if (!tokenValue) return undefined
      return {
        ...t,
        usdValue: tokenValue.valueForProject,
      }
    })
    .filter(notUndefined)

  withUsdValue.sort((a, b) => b.usdValue - a.usdValue)

  return groupBySource(withUsdValue)
}

function groupBySource(
  tokens: (Omit<ProjectToken, 'iconUrl'> & { iconUrl?: string })[],
) {
  const canonical: ProjectToken[] = []
  const native: ProjectToken[] = []
  const external: ProjectToken[] = []

  const placeholderIcon = getStaticAsset('/images/token-placeholder.png')
  for (const token of tokens) {
    switch (token.source) {
      case 'canonical':
        canonical.push({
          ...token,
          iconUrl: token.iconUrl ?? placeholderIcon,
        })
        break
      case 'native':
        native.push({
          ...token,
          iconUrl: token.iconUrl ?? placeholderIcon,
        })
        break
      case 'external':
        external.push({
          ...token,
          iconUrl: token.iconUrl ?? placeholderIcon,
        })
        break
    }
  }

  return {
    canonical,
    native,
    external,
  }
}

function getMockTokensForProject(project: Project<never, 'tvsConfig'>) {
  if (!project.tvsConfig) return undefined
  return groupBySource(
    project.tvsConfig.map((t) => ({
      ...t,
      iconUrl: t.iconUrl ?? getStaticAsset('/images/token-placeholder.png'),
      usdValue: 1000,
    })),
  )
}
