import { LivenessType, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { calculateAnomalies } from './calculateAnomalies'
import { LivenessRecordWithInterval } from './calculateIntervalWithAverages'

describe(calculateAnomalies.name, () => {
  it('returns the anomalies', () => {
    const RECORDS: LivenessRecordWithInterval[] = [
      ANOMALY_RECORD,
      ...GOOD_RECORDS,
    ]

    const result = calculateAnomalies({
      batchSubmissions: {
        records: RECORDS,
        last30Days: undefined,
        last90Days: undefined,
        allTime: undefined,
      },
      stateUpdates: {
        records: [],
        last30Days: undefined,
        last90Days: undefined,
        allTime: undefined,
      },
      proofSubmissions: {
        records: [],
        last30Days: undefined,
        last90Days: undefined,
        allTime: undefined,
      },
    })

    expect(result.anomalies).toEqual([
      {
        timestamp: ANOMALY_RECORD.timestamp,
        durationInSeconds: ANOMALY_RECORD.previousRecordInterval,
        type: ANOMALY_RECORD.type,
      },
    ])
  })
})

const lastHour = UnixTime.now().toStartOf('hour')

const ANOMALY_RECORD = {
  timestamp: lastHour,
  type: LivenessType('DA'),
  previousRecordInterval: 50 * 24 * 3600,
}

const GOOD_RECORDS = Array.from({ length: 4000 }).map((_, i) => ({
  timestamp: lastHour.add(-i, 'hours'),
  type: LivenessType('DA'),
  previousRecordInterval: 3600,
}))
