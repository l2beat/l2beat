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
  T extends { type: string } = LivenessRecordWithSubtype,
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

  records.forEach((record) => {
    if (record.type === 'DA') {
      result.batchSubmissions.records.push(record)
    } else if (record.type === 'STATE') {
      result.stateUpdates.records.push(record)
    } else {
      result.proofSubmissions.records.push(record)
    }
  })

  return result
}
