import { LivenessRecordWithType } from '../../../peripherals/database/LivenessRepository'

export interface GroupedByType {
  batchSubmissions: {
    records: LivenessRecordWithType[]
  }
  stateUpdates: {
    records: LivenessRecordWithType[]
  }
  proofSubmissions: {
    records: LivenessRecordWithType[]
  }
}

export function groupByType(records: LivenessRecordWithType[]): GroupedByType {
  const result: GroupedByType = {
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
