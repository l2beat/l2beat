import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'

import { isNineAM } from './isNineAM'

describe(isNineAM.name, () => {
  it('UTC', () => {
    const nineUTC = UnixTime.fromDate(new Date('2021-01-01T09:00:00.000+00:00'))
    expect(isNineAM(nineUTC, 'UTC')).toBe(true)
  })

  it('PL', () => {
    const sevenUTC = UnixTime.fromDate(
      new Date('2021-01-01T06:00:00.000+00:00'),
    )
    expect(isNineAM(sevenUTC, 'CET')).toBe(true)
  })

  it('works for "uneven" hours', () => {
    const nineUTC = UnixTime.fromDate(new Date('2021-01-01T09:01:10.000+00:00'))
    expect(isNineAM(nineUTC, 'UTC')).toBe(true)
  })
})
