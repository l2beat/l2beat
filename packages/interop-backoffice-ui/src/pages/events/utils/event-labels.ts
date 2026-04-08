import type { InteropEventKind } from '../types'

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
