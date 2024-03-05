export type TrackedTxsConfigSubtype =
  | 'stateUpdates'
  | 'batchSubmissions'
  | 'proofSubmissions'

export function isTrackedTxsConfigSubtype(
  value: string,
): value is TrackedTxsConfigSubtype {
  return (
    value === 'stateUpdates' ||
    value === 'batchSubmissions' ||
    value === 'proofSubmissions'
  )
}

export function TrackedTxsConfigSubtype(
  value: string,
): TrackedTxsConfigSubtype {
  if (!isTrackedTxsConfigSubtype(value)) {
    throw new Error(`Invalid tracked txs config subtype: ${value}`)
  }
  return value
}
