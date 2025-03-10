import type { Project } from '@l2beat/config'
import {
  AssetId,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getConfigMapping } from '../utils/get-config-mapping'
import { getTvsBreakdown } from './get-tvs-breakdown'

export type ProjectTvsBreakdown = Awaited<ReturnType<typeof getTvsBreakdown>>

export async function getTvsBreakdownForProject(
  project: Project<'tvlConfig', 'chainConfig'>,
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
  async (project: Project<'tvlConfig', 'chainConfig'>) => {
    const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
      (p) => p.chainConfig,
    )
    const tokenList = await ps.getTokens()
    const tokenMap = new Map(tokenList.map((t) => [t.id, t]))

    const configMapping = getConfigMapping(project, chains, tokenList)
    return getTvsBreakdown(
      configMapping,
      chains,
      project.id,
      tokenMap,
      project.chainConfig?.gasTokens,
    )
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
          assetId: AssetId('1'),
          chain: {
            id: ChainId.ETHEREUM,
            name: 'Ethereum',
          },
          usdValue: 100,
          usdPrice: '1',
          escrows: [
            {
              amount: 100,
              usdValue: 100,
              escrowAddress: EthereumAddress.random(),
            },
          ],
          url: 'https://example.com',
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'ETH',
          name: 'Ether',
          supply: 'totalSupply',
        },
        {
          amount: 100,
          assetId: AssetId('4'),
          chain: {
            id: ChainId.ETHEREUM,
            name: 'Ethereum',
          },
          usdValue: 100,
          usdPrice: '1',
          escrows: [
            {
              amount: 70,
              usdValue: 70,
              escrowAddress: EthereumAddress.random(),
            },
            {
              amount: 30,
              usdValue: 30,
              escrowAddress: EthereumAddress.random(),
            },
          ],
          url: 'https://example.com',
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'ETH',
          name: 'Ether',
          supply: 'totalSupply',
        },
      ],
      native: [
        {
          amount: 100,
          assetId: AssetId('2'),
          chain: {
            id: ChainId.ETHEREUM,
            name: 'Ethereum',
          },
          usdValue: 100,
          usdPrice: '1',
          url: 'https://example.com',
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'TKN',
          name: 'Token',
          supply: 'totalSupply',
        },
      ],
      external: [
        {
          amount: 100,
          assetId: AssetId('3'),
          chain: {
            id: ChainId.ETHEREUM,
            name: 'Ethereum',
          },
          usdValue: 100,
          usdPrice: '1',
          url: 'https://example.com',
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'TKN',
          name: 'Token',
          supply: 'totalSupply',
          bridgedUsing: {
            bridges: [
              {
                name: 'Bridge Name',
              },
              {
                name: 'Bridge listed on L2BEAT',
                slug: 'polygon-pos',
              },
            ],
          },
        },
      ],
    },
  }
}
