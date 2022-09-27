import { HttpClient } from '@l2beat/common'
import { ApiActivity } from '@l2beat/types'

export async function getApiActivity(apiUrl: string): Promise<ApiActivity> {
  const url = apiUrl + '/api/activity'

  const http = new HttpClient()
  const response = await http.fetch(url)
  if (!response.ok) {
    throw new Error(
      `Could not get data from api (received status ${response.status})`,
    )
  }
  const json: unknown = await response.json()
  const data = ApiActivity.parse(json)

  return data
}
