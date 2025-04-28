import type { ApiQuery, DecodedResult } from '@l2beat/tools-api/types'

export async function decode(query: ApiQuery): Promise<DecodedResult> {
  const apiUrl = 'http://localhost:3000/api/decode'
  const params: Record<string, string> = {}
  if (query.hash) params.hash = query.hash
  if (query.data) params.data = query.data
  if (query.to) params.to = query.to
  if (query.chainId) params.chainId = query.chainId.toString()
  const search = new URLSearchParams(params)
  const res = await fetch(`${apiUrl}?${search}`)
  const data = await res.json()
  return data as DecodedResult
}
