import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { getConfigurationsSyncedUntil } from './get-configurations-synced-until'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

type Configuration = {
  minHeight: number
  maxHeight: number | null
  currentHeight: number | null
}

describe(getConfigurationsSyncedUntil.name, () => {
  it('returns undefined if no configurations', () => {
    const result = getConfigurationsSyncedUntil([])
    expect(result).toEqual(undefined)
  })

  it('returns undefined if no lastSyncedTimestamp', () => {
    const result = getConfigurationsSyncedUntil([
      mockObject<Configuration>({
        currentHeight: null,
        maxHeight: null,
      }),
    ])

    expect(result).toEqual(undefined)
  })

  it('returns earliest lastSyncedTimestamp of configurations without untilTimestamp', () => {
    const result = getConfigurationsSyncedUntil([
      mockObject<Configuration>({
        currentHeight: null,
        maxHeight: null,
      }),
      mockObject<Configuration>({
        currentHeight: FROM.toNumber(),
        maxHeight: null,
      }),
      mockObject<Configuration>({
        currentHeight: FROM.add(2, 'hours').toNumber(),
        maxHeight: null,
      }),
    ])

    expect(result).toEqual(FROM)
  })

  it('returns earliest lastSyncedTimestamp of configurations with untilTimestamp', () => {
    const result = getConfigurationsSyncedUntil([
      mockObject<Configuration>({
        currentHeight: null,
        maxHeight: null,
      }),
      mockObject<Configuration>({
        currentHeight: FROM.add(1, 'hours').toNumber(),
        maxHeight: FROM.add(5, 'hours').toNumber(),
      }),
      mockObject<Configuration>({
        currentHeight: FROM.add(2, 'hours').toNumber(),
        maxHeight: FROM.add(6, 'hours').toNumber(),
      }),
      mockObject<Configuration>({
        currentHeight: FROM.add(4, 'hours').toNumber(),
        maxHeight: FROM.add(6, 'hours').toNumber(),
      }),
    ])

    expect(result).toEqual(FROM.add(1, 'hours'))
  })
})
