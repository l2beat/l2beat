import type { TableReadyValue } from '../types'

const CANONICAL: TableReadyValue = {
  value: 'Canonical',
  description:
    'Tokens transferred are considered canonical on the destination chain.',
  sentiment: 'good',
}

const CANONICAL_OR_WRAPPED: TableReadyValue = {
  value: 'Canonical or Wrapped',
  description:
    'Some tokens transferred are considered canonical but some tokens are not. Users who wish to obtain the canonical counterparts need to do so by trading.',
  sentiment: 'warning',
}

const WRAPPED: TableReadyValue = {
  value: 'Wrapped',
  description:
    'Tokens transferred by the bridge are not canonical. Users who wish to obtain the canonical counterparts need to do so by trading.',
  sentiment: 'bad',
}

export const BRIDGE_RISK_VIEW = {
  CANONICAL,
  CANONICAL_OR_WRAPPED,
  WRAPPED,
}
