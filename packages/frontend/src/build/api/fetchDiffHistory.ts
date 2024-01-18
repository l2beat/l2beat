import {
  DiffHistoryApiResponse,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchDiffHistory(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<DiffHistoryApiResponse> {
  if (backend.mock) {
    return getMockDiffHistoryApiResponse()
  }

  const url = `${backend.apiUrl}/diff-history`
  const json = await http.fetchJson(url)
  return DiffHistoryApiResponse.parse(json)
}

const ADDRESS_A = EthereumAddress.random()
const ADDRESS_B = EthereumAddress.random()
const ADDRESS_C = EthereumAddress.random()

const TIMESTAMP_A = UnixTime.fromDate(new Date(2021, 1, 1))
  .toNumber()
  .toString()
const TIMESTAMP_B = UnixTime.fromDate(new Date(2021, 2, 2))
  .toNumber()
  .toString()

function getMockDiffHistoryApiResponse(): DiffHistoryApiResponse {
  return [
    {
      project: ProjectId.ARBITRUM.toString(),
      changes: [
        {
          timestamp: TIMESTAMP_A,
          diffs: [
            { name: 'A', address: ADDRESS_A, type: 'created' },
            { name: 'B', address: ADDRESS_B, type: 'deleted' },
          ],
        },
        {
          timestamp: TIMESTAMP_B,
          diffs: [{ name: 'C', address: ADDRESS_C, type: 'created' }],
        },
      ],
    },
  ]
}
