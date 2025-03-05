import { expect } from 'earl'

import { UnixTime } from '../types'
import { clampRangeToDay } from './clampToDayRange'

describe(clampRangeToDay.name, () => {
  it('the same day', () => {
    const from = UnixTime.fromDate(new Date('2022-01-01T12:00:00Z'))

    const result = clampRangeToDay(from, from + UnixTime(1, 'hours'))

    expect(result).toEqual({
      from,
      to: UnixTime.fromDate(new Date('2022-01-01T13:00:00Z')),
    })
  })

  it('different days', () => {
    const from = UnixTime.fromDate(new Date('2022-01-01T12:00:00Z'))
    const to = UnixTime.fromDate(new Date('2022-01-02T12:00:00Z'))

    const result = clampRangeToDay(from, to)
    expect(result).toEqual({
      from,
      to: UnixTime.fromDate(new Date('2022-01-02T00:00:00Z')),
    })
  })
})
