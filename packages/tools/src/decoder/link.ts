import type { FormValues } from './form/Form'

export type DecoderLink =
  | { type: 'transaction'; hash: `0x${string}`; chainId: number | undefined }
  | {
      type: 'calldata'
      data: string
      to: `0x${string}` | undefined
      chainId: number
    }
  | { type: 'invalid' }

const HASH_BYTES = 32
const ADDRESS_BYTES = 20
const CHAIN_ID_DEFAULT = 1
export const CALLDATA_BYTES_MAX = 64 * 1024
const LEGACY_LOCAL_STORAGE_DATA = '0xLOCALSTORAGE'

// Calldata links live in the fragment, which never reaches Vercel's 14 KB URL limit.
export function linkParams(search: string, fragment: string) {
  return new URLSearchParams(search.length > 0 ? search : fragment.slice(1))
}

export function readLink(search: URLSearchParams): DecoderLink | undefined {
  if (search.size === 0) return undefined

  const chainId = parseChainId(search.get('chainId'))
  if (chainId === 'invalid') return { type: 'invalid' }

  const hash = search.get('hash')
  if (hash !== null) {
    const parsedHash = parseHex(hash, HASH_BYTES)
    if (parsedHash === undefined) return { type: 'invalid' }
    return {
      type: 'transaction',
      hash: parsedHash,
      chainId: chainId === 0 ? undefined : chainId,
    }
  }

  const data = search.get('data')
  if (data === null) return { type: 'invalid' }
  const to = search.get('to')
  const parsedTo = to === null ? undefined : parseHex(to, ADDRESS_BYTES)
  if (to !== null && parsedTo === undefined) return { type: 'invalid' }
  return {
    type: 'calldata',
    data,
    to: parsedTo,
    chainId: chainId ?? CHAIN_ID_DEFAULT,
  }
}

export async function writeLink(values: FormValues): Promise<string> {
  const params = new URLSearchParams()
  if (values.hash) {
    params.set('hash', values.hash)
    if (values.chainId !== 0) params.set('chainId', values.chainId.toString())
    return `?${params.toString()}`
  }
  params.set('data', await compressCalldata(values.data as `0x${string}`))
  if (values.address) params.set('to', values.address)
  params.set('chainId', values.chainId.toString())
  return `#${params.toString()}`
}

// decoder-new kept long calldata in local storage and put a marker in the link.
export function readLinkData(data: string) {
  if (data !== LEGACY_LOCAL_STORAGE_DATA) return data
  return localStorage.getItem('data') ?? ''
}

function parseChainId(value: string | null): number | undefined | 'invalid' {
  if (value === null) return undefined
  const chainId = Number(value)
  if (value === '' || !Number.isSafeInteger(chainId) || chainId < 0) {
    return 'invalid'
  }
  return chainId
}

function parseHex(value: string, bytes: number): `0x${string}` | undefined {
  const lower = value.toLowerCase()
  if (!lower.startsWith('0x')) return undefined
  if (lower.length !== 2 + bytes * 2) return undefined
  for (const char of lower.slice(2)) {
    if (!'0123456789abcdef'.includes(char)) return undefined
  }
  return lower as `0x${string}`
}

export async function compressCalldata(calldata: `0x${string}`) {
  const bytes = hexToBytes(calldata)
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new CompressionStream('deflate-raw'))
  const compressed = new Uint8Array(await new Response(stream).arrayBuffer())
  return toBase64Url(compressed)
}

export async function decompressCalldata(
  encoded: string,
): Promise<`0x${string}`> {
  const stream = new Blob([fromBase64Url(encoded)])
    .stream()
    .pipeThrough(new DecompressionStream('deflate-raw'))
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    length += value.length
    if (length > CALLDATA_BYTES_MAX) {
      await reader.cancel()
      throw new Error('Calldata too long', { cause: { CALLDATA_BYTES_MAX } })
    }
    chunks.push(value)
  }
  return bytesToHex(chunks)
}

function hexToBytes(hex: `0x${string}`) {
  const bytes = new Uint8Array((hex.length - 2) / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(2 + i * 2, 4 + i * 2), 16)
  }
  return bytes
}

function bytesToHex(chunks: Uint8Array[]): `0x${string}` {
  let hex = '0x'
  for (const chunk of chunks) {
    for (const byte of chunk) {
      hex += byte.toString(16).padStart(2, '0')
    }
  }
  return hex as `0x${string}`
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function fromBase64Url(encoded: string) {
  const base64 = encoded.replaceAll('-', '+').replaceAll('_', '/')
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
