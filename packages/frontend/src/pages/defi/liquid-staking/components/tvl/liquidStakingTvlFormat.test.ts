import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { EM_DASH } from '~/consts/characters'
import { formatChangePeriod } from './liquidStakingTvlFormat'

describe(formatChangePeriod.name, () => {
  const change = (days: number) => ({
    value: 0,
    eth: 0,
    since: 0,
    until: days * UnixTime.DAY,
  })

  it('gives a period shorter than about a year in days', () => {
    expect(formatChangePeriod(change(29))).toEqual('29d')
  })

  it('keeps the preset label when a preset is only a few days short', () => {
    expect(
      formatChangePeriod(change(29), {
        preset: '30d',
        latestTimestamp: 29 * UnixTime.DAY,
      }),
    ).toEqual('30d')
    expect(
      formatChangePeriod(change(88), {
        preset: '90d',
        latestTimestamp: 88 * UnixTime.DAY,
      }),
    ).toEqual('90d')
    expect(
      formatChangePeriod(change(179), {
        preset: '180d',
        latestTimestamp: 179 * UnixTime.DAY,
      }),
    ).toEqual('180d')
  })

  it('falls back to actual days when a preset covers far fewer days', () => {
    expect(
      formatChangePeriod(change(45), {
        preset: '90d',
        latestTimestamp: 45 * UnixTime.DAY,
      }),
    ).toEqual('45d')
  })

  it('shows the date span when the range ends before the latest day', () => {
    const since = UnixTime.fromDate(new Date('2025-01-01T00:00:00Z'))
    const until = UnixTime.fromDate(new Date('2025-03-31T00:00:00Z'))
    const latestTimestamp = UnixTime.fromDate(new Date('2026-11-25T00:00:00Z'))

    expect(
      formatChangePeriod(
        { value: 0, eth: 0, since, until },
        { preset: 'custom', latestTimestamp },
      ),
    ).toEqual(`1 Jan ${EM_DASH} 31 Mar 2025`)
  })

  it('gives a longer one in years to a tenth', () => {
    expect(formatChangePeriod(change(363))).toEqual('1y')
    expect(formatChangePeriod(change(1_059))).toEqual('2.9y')
  })
})
