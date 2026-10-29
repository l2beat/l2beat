import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import { optionToRange } from '~/utils/range/range'
import { getActivityResolution } from './getActivityResolution'

describe(getActivityResolution.name, () => {
  let time: InstalledClock

  afterEach(() => {
    time.uninstall()
  })

  // Range options end 75 minutes back, so just after midnight they end on
  // the day before and start a day earlier than at noon
  for (const now of ['2026-10-27T12:00:00.000Z', '2026-10-27T00:30:00.000Z']) {
    it(`reads hours for 1D and 7D, and days for longer ranges, at ${now}`, () => {
      time = install()
      time.setSystemTime(new Date(now))

      expect(getActivityResolution(optionToRange('1d'))).toEqual('hour')
      expect(getActivityResolution(optionToRange('7d'))).toEqual('hour')
      expect(getActivityResolution(optionToRange('30d'))).toEqual('day')
      expect(getActivityResolution(optionToRange('max'))).toEqual('day')
    })
  }
})
