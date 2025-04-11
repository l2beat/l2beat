import type { Project, TvsToken } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getTvsTargetTimestamp } from '../utils/get-tvs-target-timestamp'
import { env } from '~/env'

export type ProjectTokens = Record<TvsToken['source'], ProjectToken[]>
export type ProjectToken = TvsToken & {
  usdValue: number
}

export async function getTokensForProject(
  project: Project<'tvsConfig'>,
): Promise<ProjectTokens> {
  if (env.MOCK) {
    return getMockTokensForProject(project)
  }

  const db = getDb()
  const tokenValues = await db.tvsTokenValue.getByProjectAndTimestamp(
    project.id,
    getTvsTargetTimestamp(),
  )

  const tokenValuesMap = new Map(tokenValues.map((x) => [x.tokenId, x]))

  const withUsdValue: ProjectToken[] = project.tvsConfig
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

function groupBySource(tokens: ProjectToken[]) {
  const canonical: ProjectToken[] = []
  const native: ProjectToken[] = []
  const external: ProjectToken[] = []

  for (const token of tokens) {
    switch (token.source) {
      case 'canonical':
        canonical.push(token)
        break
      case 'native':
        native.push(token)
        break
      case 'external':
        external.push(token)
        break
    }
  }

  return {
    canonical,
    native,
    external,
  }
}

function getMockTokensForProject(project: Project<'tvsConfig'>) {
  return groupBySource(
    project.tvsConfig.map((t) => ({
      ...t,
      usdValue: 1000,
    })),
  )
}
