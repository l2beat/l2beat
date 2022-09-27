import { HttpClient } from '@l2beat/common'
import { ApiActivity, UnixTime } from '@l2beat/types'

const MOCK_DATA = {
  combined: {
    types: ['timestamp', 'daily tx count'] as ['timestamp', 'daily tx count'],
    data: [
      [new UnixTime(1664251200), 10000],
      [new UnixTime(1664254800), 10300],
      [new UnixTime(1664258400), 11000],
      [new UnixTime(1664262000), 12000],
    ] as [UnixTime, number][],
  },
  projects: {},
}

export async function getApiActivity(apiUrl: string): Promise<ApiActivity> {
  const url = apiUrl + '/api/activity'

  const http = new HttpClient()
  const response = await http.fetch(url)
  if (!response.ok) {
    return MOCK_DATA
  }
  const json: unknown = await response.json()
  const data = ApiActivity.parse(json)

  return data
}
