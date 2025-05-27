import { assertUnreachable } from '@l2beat/shared-pure'
import type { LivenessRecordWithConfig } from './mapToRecordWithConfig'

export function groupByType(
  records: LivenessRecordWithConfig[],
): [
  LivenessRecordWithConfig[],
  LivenessRecordWithConfig[],
  LivenessRecordWithConfig[],
] {
  const batchSubmissions: LivenessRecordWithConfig[] = []
  const stateUpdates: LivenessRecordWithConfig[] = []
  const proofSubmissions: LivenessRecordWithConfig[] = []

  for (const record of records) {
    switch (record.subtype) {
      case 'batchSubmissions':
        batchSubmissions.push(record)
        break
      case 'stateUpdates':
        stateUpdates.push(record)
        break
      case 'proofSubmissions':
        proofSubmissions.push(record)
        break
      default:
        assertUnreachable(record.subtype)
    }
  }

  return [batchSubmissions, stateUpdates, proofSubmissions]
}
