import { notUndefined } from '@l2beat/shared-pure'
import { uniqBy } from 'lodash'
import type { Project, TvsToken } from '@l2beat/config'
import { getDb } from '~/server/database'
import { getTvsTargetTimestamp } from '../utils/get-tvs-target-timestamp'

export type ProjectTokens = Record<TvsToken['source'], ProjectToken[]>
export type ProjectToken = TvsToken & {
  address: string
  iconUrl: string
  usdValue: number
}

export async function getTokensForProject(
  project: Project<'tvsConfig'>,
): Promise<ProjectTokens> {
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
        address: 'example',
        iconUrl:
          'https://coin-images.coingecko.com/coins/images/14238/large/logo_black.png?1715198164',
        usdValue: tokenValue.valueForProject,
      }
    })
    .filter(notUndefined)

  withUsdValue.sort((a, b) => b.usdValue - a.usdValue)

  const unique = uniqBy(withUsdValue, (e) => e.id)

  return groupBySource(unique)
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
