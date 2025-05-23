import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

export function getDefaultSubtype(
  configuredSubtypes: TrackedTxsConfigSubtype[],
): TrackedTxsConfigSubtype {
  if (configuredSubtypes.includes('batchSubmissions')) return 'batchSubmissions'
  if (configuredSubtypes.includes('proofSubmissions')) return 'proofSubmissions'
  return 'stateUpdates'
}
