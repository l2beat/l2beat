import { type SavedConfiguration, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { TrackedTxConfigEntry } from '@l2beat/shared'
import { getSyncedUntil } from './getSyncedUntil'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

type Configuration = Omit<
  SavedConfiguration<TrackedTxConfigEntry>,
  'properties'
>

describe(getSyncedUntil.name, () => {
  it('returns undefined if no configurations', () => {
    const result = getSyncedUntil([])
    expect(result).toEqual(undefined)
  })

  it('returns undefined if no lastSyncedTimestamp', () => {
    const result = getSyncedUntil([
      mockObject<Configuration>({
        currentHeight: null,
        maxHeight: null,
      }),
    ])

    expect(result).toEqual(undefined)
  })

  it('returns earliest lastSyncedTimestamp of configurations without untilTimestamp', () => {
    const result = getSyncedUntil([
      mockObject<Configuration>({
        currentHeight: null,
        maxHeight: null,
      }),
      mockObject<Configuration>({
        currentHeight: FROM,
        maxHeight: null,
      }),
      mockObject<Configuration>({
        currentHeight: FROM + UnixTime(2, 'hours'),
        maxHeight: null,
      }),
    ])

    expect(result).toEqual(FROM)
  })

  it('returns earliest lastSyncedTimestamp of configurations with untilTimestamp', () => {
    const result = getSyncedUntil([
      mockObject<Configuration>({
        currentHeight: null,
        maxHeight: null,
      }),
      mockObject<Configuration>({
        currentHeight: FROM + UnixTime(1, 'hours'),
        maxHeight: FROM + UnixTime(5, 'hours'),
      }),
      mockObject<Configuration>({
        currentHeight: FROM + UnixTime(2, 'hours'),
        maxHeight: FROM + UnixTime(6, 'hours'),
      }),
      mockObject<Configuration>({
        currentHeight: FROM + UnixTime(4, 'hours'),
        maxHeight: FROM + UnixTime(6, 'hours'),
      }),
    ])

    expect(result).toEqual(FROM + UnixTime(1, 'hours'))
  })
})
