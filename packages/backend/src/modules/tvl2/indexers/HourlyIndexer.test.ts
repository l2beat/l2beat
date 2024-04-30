import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Clock } from '../../../tools/Clock'
import { HourlyIndexer } from './HourlyIndexer'

describe(HourlyIndexer.name, () => {
  it(HourlyIndexer.prototype.initialize.name, async () => {
    const clock = mockObject<Clock>({
      getLastHour: () => UnixTime.ZERO,
      onNewHour: () => () => {},
    })

    const hourlyIndexer = new HourlyIndexer({
      logger: Logger.SILENT,
      clock: clock,
    })

    await hourlyIndexer.initialize()

    expect(clock.onNewHour).toHaveBeenCalledTimes(1)
    expect(clock.getLastHour).toHaveBeenCalledTimes(1)
  })

  it(HourlyIndexer.prototype.tick.name, async () => {
    const hours = 4
    const timestamp = hours * 3600

    const hourlyIndexer = new HourlyIndexer({
      logger: Logger.SILENT,
      clock: mockObject<Clock>({
        getLastHour: () => new UnixTime(timestamp),
      }),
    })

    const result = await hourlyIndexer.tick()

    expect(result).toEqual(hours)
  })
})
