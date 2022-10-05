import { Retries } from '@l2beat/common'

export const BACK_OFF_AND_DROP = Retries.exponentialBackOff(100, {
  maxDistance: 3_000,
  maxAttempts: 8,
})
