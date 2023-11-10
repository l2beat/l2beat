import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { isTimestampInRange } from './isTimestampInRange'

describe(isTimestampInRange.name, () => {
  const START = UnixTime.now()
  const testCases = [
    {
      name: 'since & until smaller than from',
      latestSynced: undefined, // not relevant
      since: START.add(-2, 'hours'),
      until: START.add(-1, 'hours'),
      from: START,
      to: START.add(1, 'hours'),
      expected: false,
    },
    {
      name: 'since smaller than from | until bigger than from & smaller than to',
      latestSynced: undefined, // not relevant
      since: START.add(-1, 'hours'),
      until: START.add(1, 'hours'),
      from: START,
      to: START.add(2, 'hours'),
      expected: true,
    },
    {
      name: 'since smaller than from | until bigger than to',
      latestSynced: undefined, // not relevant
      since: START.add(-1, 'hours'),
      until: START.add(3, 'hours'),
      from: START,
      to: START.add(2, 'hours'),
      expected: true,
    },
    {
      name: 'since bigger than from & smaller than to | until bigger than from & smaller than to',
      latestSynced: undefined, // not relevant
      since: START.add(1, 'hours'),
      until: START.add(2, 'hours'),
      from: START,
      to: START.add(3, 'hours'),
      expected: true,
    },
    {
      name: 'since bigger than from & smaller than to | until bigger than to',
      latestSynced: undefined, // not relevant
      since: START.add(1, 'hours'),
      until: START.add(3, 'hours'),
      from: START,
      to: START.add(2, 'hours'),
      expected: true,
    },
    {
      name: 'since bigger than to | until bigger than to',
      latestSynced: undefined, // not relevant
      since: START.add(2, 'hours'),
      until: START.add(3, 'hours'),
      from: START,
      to: START.add(1, 'hours'),
      expected: false,
    },
    {
      name: 'lastSynced smaller than from & to',
      latestSynced: START.add(-1, 'hours'),
      since: new UnixTime(0),
      from: START,
      to: START.add(3, 'hours'),
      expected: true,
    },
    {
      name: 'lastSynced bigger than from & smaller than to',
      latestSynced: START.add(2, 'hours'),
      since: new UnixTime(0),
      from: START,
      to: START.add(3, 'hours'),
      expected: true,
    },
    {
      name: 'lastSynced bigger than from & to',
      latestSynced: START.add(4, 'hours'),
      since: new UnixTime(0),
      from: START,
      to: START.add(3, 'hours'),
      expected: false,
    },
  ]

  for (const testCase of testCases) {
    it(testCase.name, () => {
      expect(
        isTimestampInRange(
          testCase.since,
          testCase.until,
          testCase.latestSynced,
          testCase.from,
          testCase.to,
        ),
      ).toEqual(testCase.expected)
    })
  }
})
