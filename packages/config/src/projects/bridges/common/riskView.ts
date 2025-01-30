import type { TableReadyValue } from '../../../types'

function NATIVE_AND_CANONICAL(
  gasTokens: string[],
  isAre: 'is' | 'are' = 'is',
): TableReadyValue {
  return {
    value: 'Native & Canonical',
    description: `${gasTokens.join(', ')} transferred via this bridge ${isAre} used to pay for gas and other tokens transferred are considered canonical on the destination chain.`,
    sentiment: 'good',
  }
}

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

const UPGRADABLE_NO: TableReadyValue = {
  value: 'No',
  description: 'The code that secures the system can never change.',
  sentiment: 'good',
}

export const RISK_VIEW = {
  NATIVE_AND_CANONICAL,
  CANONICAL,
  CANONICAL_OR_WRAPPED,
  WRAPPED,
  UPGRADABLE_NO,
}
