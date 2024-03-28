import {
  EthereumAddress,
  ImplementationChangeReportApiResponse,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchImplementationChangeReport(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<ImplementationChangeReportApiResponse> {
  if (backend.mock) {
    return getMockImplementationChangeApiResponse()
  }

  const url = `${backend.apiUrl}/implementation-change-report`
  const json = await http.fetchJson(url)
  return ImplementationChangeReportApiResponse.parse(json)
}

function getMockImplementationChangeApiResponse(): ImplementationChangeReportApiResponse {
  return {
    projects: {
      arbitrum: {
        ethereum: [
          {
            containingContract: EthereumAddress(
              '0xE6841D92B0C345144506576eC13ECf5103aC7f49',
            ),
            newImplementations: [EthereumAddress.random()],
          },
          {
            containingContract: EthereumAddress(
              '0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a',
            ),
            newImplementations: [EthereumAddress.random()],
          },
        ],
      },
    },
  }
}
