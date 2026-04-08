import { formatSeconds } from '@l2beat/shared-pure'
import type { MessageDetailsInput } from './types'

export function buildMessageDetailsPath(filters: MessageDetailsInput) {
  const params = new URLSearchParams()

  if (filters.plugin) {
    params.set('plugin', filters.plugin)
  }
  if (filters.srcChain) {
    params.set('srcChain', filters.srcChain)
  }
  if (filters.dstChain) {
    params.set('dstChain', filters.dstChain)
  }

  const query = params.toString()
  const encodedType = encodeURIComponent(filters.type)

  if (query.length === 0) {
    return `/messages/${encodedType}`
  }

  return `/messages/${encodedType}?${query}`
}

export function parseOptionalSearchParam(value: string | null) {
  if (value === null || value.trim().length === 0) {
    return undefined
  }

  return value
}

export function decodeRouteParam(value: string | undefined) {
  if (value === undefined) {
    return undefined
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function toCsvIsoTimestamp(timestamp: number | undefined) {
  if (timestamp === undefined || Number.isNaN(timestamp)) {
    return '-'
  }

  return new Date(timestamp * 1000).toISOString()
}

export function formatMessageTimestamp(timestamp: number | undefined) {
  const isoTimestamp = toCsvIsoTimestamp(timestamp)

  if (isoTimestamp === '-') {
    return '-'
  }

  return isoTimestamp.slice(0, 19).replace('T', ' ')
}

export function formatMessageDuration(duration: number | undefined) {
  if (duration === undefined || Number.isNaN(duration)) {
    return '-'
  }

  return formatSeconds(duration)
}

export function formatKnownAppCoverage(count: number, knownAppCount: number) {
  if (count === 0) {
    return '-'
  }

  return `${((knownAppCount / count) * 100).toFixed(1)}%`
}

export function shortenHash(hash: string, prefixLength = 10, suffixLength = 8) {
  if (hash.length <= prefixLength + suffixLength + 1) {
    return hash
  }

  return `${hash.slice(0, prefixLength)}...${hash.slice(-suffixLength)}`
}

export function formatMessageLabel(value: string | undefined) {
  if (value === undefined || value.trim().length === 0) {
    return '-'
  }

  return value
}
