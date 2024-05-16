import { Retries } from '@l2beat/uif'

const ONE_HOUR_MS = 1 * 60 * 60_000

export const DEFAULT_RETRY_FOR_TVL = Retries.exponentialBackOff({
  maxAttempts: Infinity,
  initialTimeoutMs: 1000,
  maxTimeoutMs: ONE_HOUR_MS,
})
