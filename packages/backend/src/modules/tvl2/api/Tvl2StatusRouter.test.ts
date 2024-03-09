import { TokenQuery, UnixTime } from '@l2beat/shared-pure'
import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect, mockObject } from 'earl'

import { Clock } from '../../../tools/Clock'
import { getTargetDataPoints } from './Tvl2StatusRouter'

describe(getTargetDataPoints.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })
  it('returns hourly granularity for last 7D', () => {
    setTime('00:00:00')

    const now = UnixTime.now().add(-7, 'days').toStartOf('hour')
    const clock = new Clock(now, 60 * 60)

    const token = mockObject<TokenQuery>({
      sinceTimestamp: new UnixTime(0),
    })

    const result = getTargetDataPoints(token, clock)
    const expected = 7 * 24
    expect(result).toEqual(expected)
  })

  it('correctly returns data points', () => {
    setTime('00:00:00')

    const totalDays = 365
    const sixHourlyStartDay = 93
    const hourlyStartDay = 10
    const daily = totalDays - sixHourlyStartDay - 1 // one daily is also six hourly
    const sixHourly = (sixHourlyStartDay - hourlyStartDay) * 4
    const hourly = 10 * 24
    const expected = daily + sixHourly + hourly

    const now = UnixTime.now().add(-totalDays, 'days').toStartOf('hour')
    const clock = new Clock(now, 60 * 60)

    const token = mockObject<TokenQuery>({
      sinceTimestamp: new UnixTime(0),
    })

    const result = getTargetDataPoints(token, clock)

    expect(result).toEqual(expected)
  })

  it('takes token sinceTimestamp into account', () => {
    setTime('00:00:00')

    const totalDays = 185
    const sixHourlyStartDay = 93
    const hourlyStartDay = 10
    const daily = totalDays - sixHourlyStartDay - 1 // one daily is also six hourly
    const sixHourly = (sixHourlyStartDay - hourlyStartDay) * 4
    const hourly = 10 * 24
    const expected = daily + sixHourly + hourly

    const now = new UnixTime(0)
    const clock = new Clock(now, 60 * 60)

    const token = mockObject<TokenQuery>({
      sinceTimestamp: UnixTime.now().add(-totalDays, 'days').toStartOf('hour'),
    })

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
