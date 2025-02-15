import { toBackendProject } from '@l2beat/backend-shared'
import type { Layer2, Layer3 } from '@l2beat/config'
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

export type ProjectTvsBreakdown = Awaited<
  ReturnType<ReturnType<typeof getTvsBreakdown>>
>

export async function getTvsBreakdownForProject(
  ...parameters: Parameters<typeof getCachedTvsBreakdownForProjectData>
) {
  if (env.MOCK) {
    return getMockTvsBreakdownForProjectData()
  }
  return getCachedTvsBreakdownForProjectData(...parameters)
}

type TvsBreakdownForProject = Awaited<
  ReturnType<typeof getCachedTvsBreakdownForProjectData>
>
export const getCachedTvsBreakdownForProjectData = cache(
  async (project: Layer2 | Layer3) => {
    const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
      (p) => p.chainConfig,
    )

    const backendProject = toBackendProject(project)
    const configMapping = getConfigMapping(backendProject, chains)

    return getTvsBreakdown(configMapping, chains)(backendProject.projectId)
  },
  ['getCachedTvsBreakdownForProject'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockTvsBreakdownForProjectData(): TvsBreakdownForProject {
  return {
    dataTimestamp: UnixTime.now().toNumber(),
    breakdown: {
      canonical: [
        {
          amount: 100,
          assetId: AssetId('1'),
          chainId: ChainId.ETHEREUM,
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
          supply: 'totalSupply',
        },
        {
          amount: 100,
          assetId: AssetId('4'),
          chainId: ChainId.ETHEREUM,
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
          supply: 'totalSupply',
        },
      ],
      native: [
        {
          amount: 100,
          assetId: AssetId('2'),
          chainId: ChainId.ETHEREUM,
          usdValue: 100,
          usdPrice: '1',
          url: 'https://example.com',
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'TKN',
          supply: 'totalSupply',
        },
      ],
      external: [
        {
          amount: 100,
          assetId: AssetId('3'),
          chainId: ChainId.ETHEREUM,
          usdValue: 100,
          usdPrice: '1',
          url: 'https://example.com',
          iconUrl:
            'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
          symbol: 'TKN',
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
