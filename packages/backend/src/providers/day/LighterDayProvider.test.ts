import type { LighterClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { LighterDayProvider } from './LighterDayProvider'

describe(LighterDayProvider.name, () => {
  describe(LighterDayProvider.prototype.getHourlyCounts.name, () => {
    it('returns the hours of the days in range (from inclusive, to exclusive)', async () => {
      const lighterClient = mockObject<LighterClient>({
        getHourlyStats: mockFn().resolvesTo([
          hour(2 * UnixTime.DAY - UnixTime.HOUR, 1),
          hour(2 * UnixTime.DAY, 2),
          hour(3 * UnixTime.DAY - UnixTime.HOUR, 3),
          hour(3 * UnixTime.DAY, 4),
        ]),
      })

      const provider = new LighterDayProvider(lighterClient)
      const result = await provider.getHourlyCounts(2, 3)

      expect(result).toEqual([
        hour(2 * UnixTime.DAY, 2),
        hour(3 * UnixTime.DAY - UnixTime.HOUR, 3),
      ])
    })
  })
})

function hour(timestamp: UnixTime, count: number) {
  return { timestamp, count, uopsCount: count * 10 }
}
