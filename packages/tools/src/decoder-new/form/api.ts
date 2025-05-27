import type { ApiQuery, DecodedResult } from '@l2beat/tools-api/types'

export function decode(query: ApiQuery): Promise<DecodedResult> {
  return callDecode(getQueryParams(query))
}

export function getQueryParams(query: ApiQuery) {
  const params: Record<string, string> = {}
  if (query.hash) params.hash = query.hash
  if (query.data) params.data = query.data
  if (query.to) params.to = query.to
  if (query.chainId) params.chainId = query.chainId.toString()
  const search = new URLSearchParams(params)
  return search.toString()
}

export async function callDecode(queryParams: string) {
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://tools-api.l2beat.com/api/decode'
      : 'http://localhost:3000/api/decode'

  const res = await fetch(`${apiUrl}?${queryParams}`)
  const data = await res.json()
  return data as DecodedResult
}
