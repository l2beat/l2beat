import { ProjectRiskViewEntry } from '../../common'

export function NATIVE_AND_CANONICAL(
  nativeTokens: string,
  isAre: 'is' | 'are' = 'is',
): ProjectRiskViewEntry {
  return {
    value: 'Native & Canonical',
    description: `${nativeTokens} transferred via this bridge ${isAre} used to pay for gas and other tokens transferred are considered canonical on the destination chain.`,
    sentiment: 'good',
  }
}

export const CANONICAL: ProjectRiskViewEntry = {
  value: 'Canonical',
  description:
    'Tokens transferred are considered canonical on the destination chain.',
  sentiment: 'good',
}

export const CANONICAL_OR_WRAPPED: ProjectRiskViewEntry = {
  value: 'Canonical or Wrapped',
  description:
    'Some tokens transferred are considered canonical but some tokens are not. Users who wish to obtain the canonical counterparts need to do so by trading.',
  sentiment: 'warning',
}

export const WRAPPED: ProjectRiskViewEntry = {
  value: 'Wrapped',
  description:
    'Tokens transferred by the bridge are not canonical. Users who wish to obtain the canonical counterparts need to do so by trading.',
  sentiment: 'bad',
}

export const UPGRADABLE_NO: ProjectRiskViewEntry = {
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
