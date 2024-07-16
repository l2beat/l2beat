import { VerifierStatus } from '../kysely/generated/types'

export const selectVerifierStatus = [
  'address',
  'chain_id',
  'last_used',
  'last_updated',
] as const satisfies (keyof VerifierStatus)[]
