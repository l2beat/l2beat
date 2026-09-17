import type { TrackedTxConfigEntry } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import type { SavedConfiguration } from '../../../tools/uif/multi/types'
import { getSyncedUntil } from './getSyncedUntil'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

type Configuration = Omit<
  SavedConfiguration<TrackedTxConfigEntry>,
  'properties'
>

describe(getSyncedUntil.name, () => {
  it('returns undefined if no configurations', () => {
    const result = getSyncedUntil([])
    expect(result).toBe(undefined)
  })

  it('returns undefined if no lastSyncedTimestamp', () => {
    const result = getSyncedUntil([
      {
        currentHeight: null,
        maxHeight: null,
      } as unknown as Configuration,
    ])

    expect(result).toBe(undefined)
  })

  it('returns earliest lastSyncedTimestamp of configurations without untilTimestamp', () => {
    const result = getSyncedUntil([
      {
        currentHeight: null,
        maxHeight: null,
      } as unknown as Configuration,
      {
        currentHeight: FROM,
        maxHeight: null,
      } as unknown as Configuration,
      {
        currentHeight: FROM + 2 * UnixTime.HOUR,
        maxHeight: null,
      } as unknown as Configuration,
    ])

    expect(result).toEqual(FROM)
  })

  it('returns earliest lastSyncedTimestamp of configurations with untilTimestamp', () => {
    const result = getSyncedUntil([
      {
        currentHeight: null,
        maxHeight: null,
      } as unknown as Configuration,
      {
        currentHeight: FROM + 1 * UnixTime.HOUR,
        maxHeight: FROM + 5 * UnixTime.HOUR,
      } as unknown as Configuration,
      {
        currentHeight: FROM + 2 * UnixTime.HOUR,
        maxHeight: FROM + 6 * UnixTime.HOUR,
      } as unknown as Configuration,
      {
        currentHeight: FROM + 4 * UnixTime.HOUR,
        maxHeight: FROM + 6 * UnixTime.HOUR,
      } as unknown as Configuration,
    ])

    expect(result).toEqual(FROM + 1 * UnixTime.HOUR)
  })
})
