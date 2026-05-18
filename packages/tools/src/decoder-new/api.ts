import type { ApiQuery, DecodedResult } from '@l2beat/tools-api/types'

export function decode(query: ApiQuery): Promise<DecodedResult> {
  return callDecode(getFullQueryUrl(getQueryParams(query)))
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

export async function callDecode(query: URLSearchParams) {
  const body = {
    hash: query.get('hash') ?? undefined,
    data: query.get('data') ?? undefined,
    to: query.get('to') ?? undefined,
    chainId: query.get('chainId') ?? undefined,
  }

  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://tools-api.l2beat.com/api/decode'
      : 'http://localhost:3000/api/decode'

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  return json as DecodedResult
}

export function getFullQueryUrl(queryParams: string): URLSearchParams {
  const data = localStorage.getItem('data')
  queryParams = queryParams.replace('0xLOCALSTORAGE', data ?? '0x')
  return new URLSearchParams(queryParams)
}

function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex

  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(cleanHex.substring(i, i + 2), 16)
  }
  return bytes
}

function urlSafeBase64Encode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export async function encodeCalldata(calldata: string): Promise<string> {
  if (typeof CompressionStream === 'undefined') {
    throw new Error('CompressionStream is not supported in this environment')
  }

  try {
    const bytes = hexToBytes(calldata)

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes)
        controller.close()
      },
    })

    const compressedStream = stream.pipeThrough(
      new CompressionStream('deflate-raw'),
    )
    const response = new Response(compressedStream)
    const compressedBytes = new Uint8Array(await response.arrayBuffer())
    return urlSafeBase64Encode(compressedBytes)
  } catch (error) {
    throw new Error(
      `Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
