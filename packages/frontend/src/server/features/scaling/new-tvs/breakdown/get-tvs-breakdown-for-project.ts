import type { Project } from '@l2beat/config'
import { TokenId, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTvsTargetTimestamp } from '../utils/get-tvs-target-timestamp'
import { getTvsBreakdown } from './get-tvs-breakdown'
import { ps } from '~/server/projects'

export type ProjectTvsBreakdown = Awaited<ReturnType<typeof getTvsBreakdown>>

export async function getTvsBreakdownForProject(
  project: Project<'tvsConfig', 'chainConfig' | 'contracts'>,
) {
  if (env.MOCK) {
    return getMockTvsBreakdownForProjectData()
  }
  return getCachedTvsBreakdownForProjectData(project)
}

type TvsBreakdownForProject = Awaited<
  ReturnType<typeof getCachedTvsBreakdownForProjectData>
>
export const getCachedTvsBreakdownForProjectData = cache(
  async (project: Project<'tvsConfig', 'chainConfig' | 'contracts'>) => {
    const chains = (
      await ps.getProjects({
        select: ['chainConfig'],
      })
    ).map((x) => x.chainConfig)

    const targetTimestamp = getTvsTargetTimestamp()
    const db = getDb()
    const tokenValues = await db.tvsTokenValue.getByProjectAndTimestamp(
      project.id,
      targetTimestamp,
    )

    const tokenValuesMap = new Map(
      tokenValues.map((x) => [TokenId(x.tokenId), x]),
    )

    const breakdown = await getTvsBreakdown(
      project.tvsConfig,
      tokenValuesMap,
      chains,
      project.chainConfig?.gasTokens,
    )

    return {
      dataTimestamp: targetTimestamp,
      breakdown,
    }
  },
  ['getCachedTvsBreakdownForProjectx'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockTvsBreakdownForProjectData(): TvsBreakdownForProject {
  return {
    dataTimestamp: UnixTime.now(),
    breakdown: {
      canonical: [
        {
          amount: 100,
          id: TokenId('1'),
          usdValue: 100,
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'ETH',
          source: 'canonical',
          isAssociated: true,
        },
        {
          amount: 100,
          id: TokenId('4'),
          usdValue: 100,
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'ETH',
          source: 'canonical',
          isAssociated: true,
        },
      ],
      native: [
        {
          amount: 100,
          id: TokenId('2'),
          usdValue: 100,
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'TKN',
          source: 'native',
          isAssociated: true,
        },
      ],
      external: [
        {
          amount: 100,
          id: TokenId('3'),
          usdValue: 100,
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'TKN',
          source: 'external',
          isAssociated: true,
        },
      ],
    },
  }
}
