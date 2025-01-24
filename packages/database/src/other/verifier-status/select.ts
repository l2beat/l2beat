import type { VerifierStatus } from '../../kysely/generated/types'

export const selectVerifierStatus = [
  'address',
  'chainId',
  'lastUsed',
  'lastUpdated',
] as const satisfies (keyof VerifierStatus)[]
