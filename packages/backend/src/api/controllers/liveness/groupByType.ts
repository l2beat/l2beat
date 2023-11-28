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
  return {
    batchSubmissions: {
      records: records
        .filter((record) => record.type === 'DA')
        .sort((a, b) => b.timestamp.toNumber() - a.timestamp.toNumber()),
    },
    stateUpdates: {
      records: records
        .filter((record) => record.type === 'STATE')
        .sort((a, b) => b.timestamp.toNumber() - a.timestamp.toNumber()),
    },
    proofSubmissions: {
      records: records
        .filter((record) => record.type === 'PROOF')
        .sort((a, b) => b.timestamp.toNumber() - a.timestamp.toNumber()),
    },
  }
}
