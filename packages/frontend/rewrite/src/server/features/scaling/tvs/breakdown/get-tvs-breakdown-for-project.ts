import type { Project } from '@l2beat/config'
import { EthereumAddress, TokenId, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { getDb } from 'rewrite/src/server/database'
import { ps } from 'rewrite/src/server/projects'
import { env } from '~/env'
import { getTvsTargetTimestamp } from '../utils/get-tvs-target-timestamp'
import { getTvsBreakdown } from './get-tvs-breakdown'

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
    const db = getDb()
    const targetTimestamp = getTvsTargetTimestamp()

    const [projects, tokenValues] = await Promise.all([
      ps.getProjects({
        select: ['chainConfig'],
      }),
      db.tvsTokenValue.getByProjectAtOrBefore(project.id, targetTimestamp),
    ])

    const chains = projects.map((x) => x.chainConfig)
    const tokenValuesMap = new Map(
      tokenValues.map((x) => [TokenId(x.tokenId), x]),
    )

    const breakdown = await getTvsBreakdown(
      project,
      tokenValuesMap,
      chains,
      targetTimestamp,
    )

    return {
      dataTimestamp: targetTimestamp,
      breakdown,
    }
  },
  ['getCachedTvsBreakdownForProject'],
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
          formula: {
            type: 'balanceOfEscrow',
            sinceTimestamp: 0,
            decimals: 18,
            address: EthereumAddress(
              '0x0000000000000000000000000000000000000000',
            ),
            escrowAddress: EthereumAddress(
              '0x0000000000000000000000000000000000000000',
            ),
            chain: 'ethereum',
          },
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

          formula: {
            type: 'balanceOfEscrow',
            address: EthereumAddress(
              '0x0000000000000000000000000000000000000000',
            ),
            sinceTimestamp: 0,
            decimals: 18,
            escrowAddress: EthereumAddress(
              '0x0000000000000000000000000000000000000000',
            ),
            chain: 'ethereum',
          },
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
          formula: {
            type: 'balanceOfEscrow',
            address: EthereumAddress(
              '0x0000000000000000000000000000000000000000',
            ),
            escrowAddress: EthereumAddress(
              '0x0000000000000000000000000000000000000000',
            ),
            sinceTimestamp: 0,
            decimals: 18,
            chain: 'ethereum',
          },
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
          formula: {
            type: 'balanceOfEscrow',
            address: EthereumAddress(
              '0x0000000000000000000000000000000000000000',
            ),
            escrowAddress: EthereumAddress(
              '0x0000000000000000000000000000000000000000',
            ),
            sinceTimestamp: 0,
            decimals: 18,
            chain: 'ethereum',
          },
        },
      ],
    },
  }
}
