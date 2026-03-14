import type { RouterInputs } from '@l2beat/interop-backoffice'
import { formatSeconds } from '@l2beat/shared-pure'

export type MessageDetailsFilters = RouterInputs['summary']['messagesDetails']

export function buildMessageDetailsPath(filters: MessageDetailsFilters) {
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
    return `/interop/messages/${encodedType}`
  }

  return `/interop/messages/${encodedType}?${query}`
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

export function formatMessageTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString()
}

export function toCsvIsoTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toISOString()
}

export function formatMessageDuration(duration: number | undefined) {
  if (duration === undefined) {
    return '-'
  }

  return formatSeconds(duration)
}

export function shortenHash(hash: string, prefixLength = 10, suffixLength = 8) {
  if (hash.length <= prefixLength + suffixLength + 1) {
    return hash
  }

  return `${hash.slice(0, prefixLength)}...${hash.slice(-suffixLength)}`
}
