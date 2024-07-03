import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { alignTimestamp } from './alignTimestamp'

describe(alignTimestamp.name, () => {
  const cases = [
    {
      name: 'Greater than hourly cutoff',
      timestamp: new UnixTime(100),
      hourlyCutOff: new UnixTime(1),
      sixHourlyCutoff: UnixTime.ZERO,
      expected: new UnixTime(100).toEndOf('hour'),
    },
    {
      name: 'Greater than sixHourly cutoff',
      timestamp: new UnixTime(100),
      hourlyCutOff: new UnixTime(100_000),
      sixHourlyCutoff: new UnixTime(1),
      expected: new UnixTime(100).toEndOf('six hours'),
    },
    {
      name: 'Greater than sixHourly cutoff but after .toEndOf is greater than hourlyCutoff',
      timestamp: new UnixTime(100), // .toEndOf('six hours') is 21600
      hourlyCutOff: new UnixTime(1000),
      sixHourlyCutoff: new UnixTime(1),
      expected: new UnixTime(1000),
    },
    {
      name: 'Before six hourly',
      timestamp: new UnixTime(100),
      hourlyCutOff: new UnixTime(200_00),
      sixHourlyCutoff: new UnixTime(100_000),
      expected: new UnixTime(100).toEndOf('day'),
    },
    {
      name: 'Before six hourly but after .toEndOf is greater than sixHourlyCutoff',
      timestamp: new UnixTime(100), // .toEndOf('six hours') is 86400
      hourlyCutOff: new UnixTime(200_00),
      sixHourlyCutoff: new UnixTime(10_000),
      expected: new UnixTime(10_000),
    },
  ]
  // Keep in mind those test cases are a little bit abstract
  // In real world scenario the cutoffs will be much closer to the .endOf result
  // e.g. .toEndOf = 14.08.2024 00:00 & sixHourlyCutoff 13.08.2024 18:00

  for (const c of cases) {
    it(c.name, () => {
      const result = alignTimestamp(
        c.timestamp,
        c.hourlyCutOff,
        c.sixHourlyCutoff,
      )

      expect(result).toEqual(c.expected)
    })
  }
})
