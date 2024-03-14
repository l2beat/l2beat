import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { LivenessConfigurationRecord } from '../repositories/LivenessConfigurationRepository'
import { getLivenessSyncedUntil } from './getLivenessSyncedUntil'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

describe(getLivenessSyncedUntil.name, () => {
  it('returns undefined if no configurations', () => {
    const result = getLivenessSyncedUntil([])
    expect(result).toEqual(undefined)
  })

  it('returns undefined if no lastSyncedTimestamp', () => {
    const result = getLivenessSyncedUntil([
      mockObject<LivenessConfigurationRecord>({
        lastSyncedTimestamp: undefined,
        untilTimestamp: undefined,
      }),
    ])

    expect(result).toEqual(undefined)
  })

  it('returns earliest lastSyncedTimestamp of configurations without untilTimestamp', () => {
    const result = getLivenessSyncedUntil([
      mockObject<LivenessConfigurationRecord>({
        lastSyncedTimestamp: undefined,
        untilTimestamp: undefined,
      }),
      mockObject<LivenessConfigurationRecord>({
        lastSyncedTimestamp: FROM,
        untilTimestamp: undefined,
      }),
      mockObject<LivenessConfigurationRecord>({
        lastSyncedTimestamp: FROM.add(2, 'hours'),
        untilTimestamp: undefined,
      }),
    ])

    expect(result).toEqual(FROM)
  })

  it('returns earliest lastSyncedTimestamp of configurations with untilTimestamp', () => {
    const result = getLivenessSyncedUntil([
      mockObject<LivenessConfigurationRecord>({
        lastSyncedTimestamp: undefined,
        untilTimestamp: undefined,
      }),
      mockObject<LivenessConfigurationRecord>({
        lastSyncedTimestamp: FROM.add(1, 'hours'),
        untilTimestamp: FROM.add(5, 'hours'),
      }),
      mockObject<LivenessConfigurationRecord>({
        lastSyncedTimestamp: FROM.add(2, 'hours'),
        untilTimestamp: FROM.add(6, 'hours'),
      }),
      mockObject<LivenessConfigurationRecord>({
        lastSyncedTimestamp: FROM.add(4, 'hours'),
        untilTimestamp: FROM.add(6, 'hours'),
      }),
    ])

    expect(result).toEqual(FROM.add(1, 'hours'))
  })
})
