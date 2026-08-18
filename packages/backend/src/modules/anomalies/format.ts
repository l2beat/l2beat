import {
  formatSeconds,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'

export function formatSubtype(subtype: TrackedTxsConfigSubtype): string {
  switch (subtype) {
    case 'batchSubmissions':
      return 'batch submissions'
    case 'stateUpdates':
      return 'state updates'
    case 'proofSubmissions':
      return 'proof submissions'
    default:
      return subtype
  }
}

export function formatDuration(duration: number): string {
  return formatSeconds(duration, { fullUnit: true })
}
