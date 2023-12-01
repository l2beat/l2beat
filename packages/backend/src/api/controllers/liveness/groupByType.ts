import { groupBy } from 'lodash'

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
  const grouped = groupBy(records, 'type')

  return {
    batchSubmissions: {
      records: grouped.DA,
    },
    stateUpdates: {
      records: grouped.STATE,
    },
    proofSubmissions: {
      records: grouped.PROOF,
    },
  }
}
