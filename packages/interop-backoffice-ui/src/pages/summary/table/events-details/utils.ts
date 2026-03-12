import type { RouterInputs } from '@l2beat/interop-backoffice'

export type InteropEventKind = RouterInputs['summary']['eventsDetails']['kind']

const EVENT_KIND_LABELS: Record<InteropEventKind, string> = {
  all: 'All',
  matched: 'Matched',
  unmatched: 'Unmatched',
  'old-unmatched': 'Unmatched (>2h ago)',
  unsupported: 'Unsupported',
}

export function getEventKindLabel(kind: InteropEventKind) {
  return EVENT_KIND_LABELS[kind]
}

export function formatEventTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString()
}

export function toCsvIsoTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toISOString()
}

export function shortenHash(hash: string, prefixLength = 10, suffixLength = 8) {
  if (hash.length <= prefixLength + suffixLength + 1) {
    return hash
  }

  return `${hash.slice(0, prefixLength)}...${hash.slice(-suffixLength)}`
}
