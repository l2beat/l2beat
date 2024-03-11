import { assertUnreachable, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

import { LivenessRecordWithSubtype } from '../repositories/LivenessRepository'

export interface GroupedByType<T = LivenessRecordWithSubtype> {
  batchSubmissions: {
    records: T[]
  }
  stateUpdates: {
    records: T[]
  }
  proofSubmissions: {
    records: T[]
  }
}

export function groupByType<
  T extends { subtype: TrackedTxsConfigSubtype } = LivenessRecordWithSubtype,
>(records: T[]): GroupedByType<T> {
  const result: GroupedByType<T> = {
    batchSubmissions: {
      records: [],
    },
    stateUpdates: {
      records: [],
    },
    proofSubmissions: {
      records: [],
    },
  }

  for (const record of records) {
    switch (record.subtype) {
      case 'batchSubmissions':
        result.batchSubmissions.records.push(record)
        break
      case 'stateUpdates':
        result.stateUpdates.records.push(record)
        break
      case 'proofSubmissions':
        result.proofSubmissions.records.push(record)
        break
      default:
        assertUnreachable(record.subtype)
    }
  }

  return result
}
