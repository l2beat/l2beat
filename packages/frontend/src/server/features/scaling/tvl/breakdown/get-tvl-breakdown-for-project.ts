import { toBackendProject } from '@l2beat/backend-shared'
import { type Layer2, type Layer3 } from '@l2beat/config'
import {
  AssetId,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getConfigMapping } from '../utils/get-config-mapping'
import { getTvlBreakdown } from './get-tvl-breakdown'

export type ProjectTvlBreakdown = Awaited<
  ReturnType<ReturnType<typeof getTvlBreakdown>>
>

export async function getTvlBreakdownForProject(
  ...parameters: Parameters<typeof getCachedTvlBreakdownForProjectData>
) {
  if (env.MOCK) {
    return getMockTvlBreakdownForProjectData()
  }
  return getCachedTvlBreakdownForProjectData(...parameters)
}

type TvlBreakdownForProject = Awaited<
  ReturnType<typeof getCachedTvlBreakdownForProjectData>
>
export const getCachedTvlBreakdownForProjectData = cache(
  async (project: Layer2 | Layer3) => {
    const backendProject = toBackendProject(project)
    const configMapping = getConfigMapping(backendProject)

    return getTvlBreakdown(configMapping)(backendProject.projectId)
  },
  ['getCachedTvlBreakdownForProject'],
  {
    tags: ['tvl'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockTvlBreakdownForProjectData(): TvlBreakdownForProject {
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
          explorerUrl: 'https://explorer.com',
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
          explorerUrl: 'https://explorer.com',
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
          explorerUrl: 'https://explorer.com',
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
          explorerUrl: 'https://explorer.com',
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
