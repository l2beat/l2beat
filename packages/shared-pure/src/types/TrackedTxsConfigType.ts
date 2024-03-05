export type TrackedTxsConfigType = 'liveness'

export function isTrackedTxsConfigType(
  value: string,
): value is TrackedTxsConfigType {
  return value === 'liveness'
}

export function TrackedTxsConfigType(value: string): TrackedTxsConfigType {
  if (!isTrackedTxsConfigType(value)) {
    throw new Error(`Invalid tracked txs config type: ${value}`)
  }
  return value
}
