import { assertUnreachable } from '@l2beat/shared-pure'
import {
  LivenessRecordWithSubtype,
  LivenessTransactionsRecordWithSubtype,
} from '../repositories/LivenessRepository'

export function groupByType<
  T extends LivenessRecordWithSubtype | LivenessTransactionsRecordWithSubtype,
>(records: T[]): [T[], T[], T[]] {
  const batchSubmissions: T[] = []
  const stateUpdates: T[] = []
  const proofSubmissions: T[] = []

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
