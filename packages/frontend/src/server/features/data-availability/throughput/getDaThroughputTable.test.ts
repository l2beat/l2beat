import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getLatestTimestampByDaLayer } from './getDaThroughputTable'

describe(getLatestTimestampByDaLayer.name, () => {
  it('gets the latest timestamp from the selected data set', () => {
    const records = [
      record('avail', UnixTime(100)),
      record('celestia', UnixTime(300)),
      record('avail', UnixTime(200)),
    ]

    expect(getLatestTimestampByDaLayer(records, 'avail')).toEqual(UnixTime(200))
  })
})

function record(daLayer: string, timestamp: UnixTime): DataAvailabilityRecord {
  return {
    configurationId: 'configuration-id',
    projectId: 'project',
    timestamp,
    totalSize: 1n,
    daLayer,
  }
}
