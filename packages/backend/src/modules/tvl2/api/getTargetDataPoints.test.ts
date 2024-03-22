import { UnixTime } from '@l2beat/shared-pure'
import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect } from 'earl'

import { Clock } from '../../../tools/Clock'
import { getTargetDataPoints } from './getTargetDataPoints'

describe(getTargetDataPoints.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })
  it('correctly returns data points', () => {
    const now = setTime('00:00:00')

    const totalDays = 365
    const sixHourlyStartDay = 93
    const hourlyStartDay = 10
    const daily = totalDays - sixHourlyStartDay + 1 // include also the -365th day
    const sixHourly = (sixHourlyStartDay - hourlyStartDay) * 4
    const hourly = 10 * 24
    const expected = daily + sixHourly + hourly

    const clock = new Clock(UnixTime.ZERO, 60 * 60)

    const token = {
      sinceTimestamp: UnixTime.fromDate(now).add(-totalDays, 'days'),
    }

    const result = getTargetDataPoints(token, clock)

    expect(result).toEqual(expected)
  })

  function setTime(hhmmss: string) {
    const newLocal = new Date(`2022-06-29T${hhmmss}.000Z`)
    const newTime = newLocal
    time.setSystemTime(newTime)
    return newTime
  }
})
