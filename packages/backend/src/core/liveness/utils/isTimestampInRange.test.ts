import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { isTimestampInRange } from './isTimestampInRange'

describe(isTimestampInRange.name, () => {
  const START = UnixTime.now()
  const testCases = [
    {
      name: 'until smaller than from',
      until: START.add(-1, 'hours'),
      from: START,
      to: START.add(1, 'hours'),
      expected: false,
    },
    {
      name: 'until bigger than to',
      until: START.add(2, 'hours'),
      from: START,
      to: START.add(1, 'hours'),
      expected: true,
    },
    {
      name: 'until bigger than from & smaller than to',
      until: START.add(1, 'hours'),
      from: START,
      to: START.add(2, 'hours'),
      expected: true,
    },
    {
      name: 'until is undefined',
      until: undefined,
      from: START,
      to: START.add(2, 'hours'),
      expected: true,
    },
    {
      name: 'until is equal from',
      until: START,
      from: START,
      to: START.add(2, 'hours'),
      expected: true,
    },
    {
      name: 'until is equal to',
      until: START.add(2, 'hours'),
      from: START,
      to: START.add(2, 'hours'),
      expected: true,
    },
  ]

  for (const testCase of testCases) {
    it(testCase.name, () => {
      expect(
        isTimestampInRange(testCase.until, testCase.from, testCase.to),
      ).toEqual(testCase.expected)
    })
  }
})
