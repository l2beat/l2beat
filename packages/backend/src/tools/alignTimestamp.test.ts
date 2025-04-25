import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { alignTimestamp } from './alignTimestamp'

describe(alignTimestamp.name, () => {
  const cases = [
    {
      name: 'Greater than hourly cutoff',
      timestamp: UnixTime(100),
      hourlyCutOff: UnixTime(1),
      sixHourlyCutoff: 0,
      expected: UnixTime.toEndOf(100, 'hour'),
    },
    {
      name: 'Greater than sixHourly cutoff',
      timestamp: UnixTime(100),
      hourlyCutOff: UnixTime(100_000),
      sixHourlyCutoff: UnixTime(1),
      expected: UnixTime.toEndOf(100, 'six hours'),
    },
    {
      name: 'Greater than sixHourly cutoff but after .toEndOf is greater than hourlyCutoff',
      timestamp: UnixTime(100), // .toEndOf('six hours') is 21600
      hourlyCutOff: UnixTime(1000),
      sixHourlyCutoff: UnixTime(1),
      expected: UnixTime(1000),
    },
    {
      name: 'Before six hourly',
      timestamp: UnixTime(100),
      hourlyCutOff: UnixTime(200_00),
      sixHourlyCutoff: UnixTime(100_000),
      expected: UnixTime.toEndOf(100, 'day'),
    },
    {
      name: 'Before six hourly but after .toEndOf is greater than sixHourlyCutoff',
      timestamp: UnixTime(100), // .toEndOf('six hours') is 86400
      hourlyCutOff: UnixTime(200_00),
      sixHourlyCutoff: UnixTime(10_000),
      expected: UnixTime(10_000),
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
