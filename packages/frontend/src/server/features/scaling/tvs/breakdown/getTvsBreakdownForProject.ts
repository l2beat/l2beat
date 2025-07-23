import type { Project } from '@l2beat/config'
import { EthereumAddress, TokenId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getTvsTargetTimestamp } from '../utils/getTvsTargetTimestamp'
import { getTvsBreakdown } from './getTvsBreakdown'
import type { BreakdownRecord } from './types'

export type ProjectTvsBreakdown = Awaited<ReturnType<typeof getTvsBreakdown>>
type TvsBreakdownForProject = {
  dataTimestamp: number
  breakdown: BreakdownRecord
}

export async function getTvsBreakdownForProject(
  project: Project<'tvsConfig', 'chainConfig' | 'contracts'>,
): Promise<TvsBreakdownForProject> {
  if (env.MOCK) {
    return getMockTvsBreakdownForProjectData()
  }

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

  const breakdown = getTvsBreakdown(
    project,
    tokenValuesMap,
    chains,
    targetTimestamp,
  )

  return {
    dataTimestamp: targetTimestamp,
    breakdown,
  }
}

function getMockTvsBreakdownForProjectData(): TvsBreakdownForProject {
  return {
    dataTimestamp: UnixTime.now(),
    breakdown: {
      canonical: [
        {
          amount: 100,
          id: TokenId('1'),
          usdValue: 100,
          category: 'ether',
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
          category: 'ether',
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
          category: 'other',
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
          category: 'stablecoin',
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
