import { assertUnreachable } from '@l2beat/shared-pure'
import { LivenessRecordWithSubtype } from '../repositories/LivenessRepository'

export function groupByType(
  records: LivenessRecordWithSubtype[],
): [
  LivenessRecordWithSubtype[],
  LivenessRecordWithSubtype[],
  LivenessRecordWithSubtype[],
] {
  const batchSubmissions: LivenessRecordWithSubtype[] = []
  const stateUpdates: LivenessRecordWithSubtype[] = []
  const proofSubmissions: LivenessRecordWithSubtype[] = []

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
