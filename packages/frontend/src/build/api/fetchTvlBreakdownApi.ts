import { layer2s as allLayer2s } from '@l2beat/config'
import {
  AssetId,
  ChainId,
  EthereumAddress,
  ProjectAssetsBreakdownApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchTvlBreakdownApi(
  backend: Config['backend'],
  apiUrl: string,
  http: JsonHttpClient,
): Promise<ProjectAssetsBreakdownApiResponse> {
  if (backend.mock) {
    return getMockTvlBreakdownApiResponse()
  }
  const url = apiUrl + '/api/project-assets-breakdown'
  const json = await http.fetchJson(url)
  return ProjectAssetsBreakdownApiResponse.parse(json)
}

function getMockTvlBreakdownApiResponse(): ProjectAssetsBreakdownApiResponse {
  const result: ProjectAssetsBreakdownApiResponse = {
    dataTimestamp: UnixTime.fromDate(new Date()),
    breakdowns: {},
  }

  for (const project of allLayer2s) {
    result.breakdowns[project.id.toString()] = {
      native: [
        {
          assetId: AssetId.ARB,
          usdValue: '100',
          amount: '100',
          chainId: ChainId.ETHEREUM,
          usdPrice: '1',
        },
      ],
      canonical: {
        [String(EthereumAddress.random())]: [
          {
            assetId: AssetId.ETH,
            usdValue: '100',
            amount: '100',
            chainId: ChainId.ETHEREUM,
            usdPrice: '1',
          },
        ],
      },
      external: [
        {
          assetId: AssetId.USDC,
          usdValue: '100',
          amount: '100',
          chainId: ChainId.ETHEREUM,
          usdPrice: '1',
        },
      ],
    }
  }

  return result
}
