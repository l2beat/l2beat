import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { isConfigToSync } from './isConfigToSync'

describe(isConfigToSync.name, () => {
  const START = UnixTime.now()
  const testCases = [
    {
      name: 'since & until smaller than from',
      latestSynced: undefined, // not relevant
      since: START.add(-2, 'hours'),
      until: START.add(-1, 'hours'),
      from: START,
      to: START.add(1, 'hours'),
      expected: { include: false },
    },
    {
      name: 'since smaller than from | until bigger than from & smaller than to',
      latestSynced: undefined, // not relevant
      since: START.add(-1, 'hours'),
      until: START.add(1, 'hours'),
      from: START,
      to: START.add(2, 'hours'),
      expected: { include: true, syncTo: START.add(1, 'hours') },
    },
    {
      name: 'since smaller than from | until bigger than to',
      latestSynced: undefined, // not relevant
      since: START.add(-1, 'hours'),
      until: START.add(3, 'hours'),
      from: START,
      to: START.add(2, 'hours'),
      expected: { include: true },
    },
    {
      name: 'since bigger than from & smaller than to | until bigger than from & smaller than to',
      latestSynced: undefined, // not relevant
      since: START.add(1, 'hours'),
      until: START.add(2, 'hours'),
      from: START,
      to: START.add(3, 'hours'),
      expected: { include: false, syncTo: START.add(1, 'hours') },
    },
    {
      name: 'since bigger than from & smaller than to | until bigger than to',
      latestSynced: undefined, // not relevant
      since: START.add(1, 'hours'),
      until: START.add(3, 'hours'),
      from: START,
      to: START.add(2, 'hours'),
      expected: { include: false, syncTo: START.add(1, 'hours') },
    },
    {
      name: 'since bigger than to | until bigger than to',
      latestSynced: undefined, // not relevant
      since: START.add(2, 'hours'),
      until: START.add(3, 'hours'),
      from: START,
      to: START.add(1, 'hours'),
      expected: { include: false },
    },
    {
      name: 'lastSynced bigger than from & smaller than to',
      latestSynced: START.add(2, 'hours'),
      since: new UnixTime(0),
      from: START,
      to: START.add(3, 'hours'),
      expected: { include: false, syncTo: START.add(2, 'hours') },
    },
    {
      name: 'lastSynced bigger than from & to',
      latestSynced: START.add(4, 'hours'),
      since: new UnixTime(0),
      from: START,
      to: START.add(3, 'hours'),
      expected: { include: false },
    },
    {
      name: 'lastSynced equal to until - config fully synced',
      latestSynced: START.add(4, 'hours'),
      since: START.add(-2, 'hours'), // not relevant
      until: START.add(4, 'hours'),
      from: START,
      to: START.add(24, 'hours'),
      expected: { include: false },
    },
    {
      name: 'since & from equal',
      since: new UnixTime(1685377367),
      from: new UnixTime(1685377367),
      to: new UnixTime(1685404800),
      expected: { include: true },
    },
  ]

  for (const testCase of testCases) {
    it(testCase.name, () => {
      expect(
        isConfigToSync(
          mockObject<TrackedTxConfigEntry>({
            sinceTimestampInclusive: testCase.since,
            untilTimestampExclusive: testCase.until,
          }),
          mockObject<TrackedTxsConfigRecord>({
            lastSyncedTimestamp: testCase.latestSynced,
          }),
          testCase.from,
          testCase.to,
        ),
      ).toEqual(testCase.expected)
    })

    it('throws if there is a gap between lastSyncedTimestamp and from', () => {
      expect(() =>
        isConfigToSync(
          mockObject<TrackedTxConfigEntry>({
            sinceTimestampInclusive: new UnixTime(0),
            untilTimestampExclusive: undefined,
          }),
          mockObject<TrackedTxsConfigRecord>({
            lastSyncedTimestamp: START.add(-1, 'hours'),
          }),
          START,
          START.add(3, 'hours'),
        ),
      ).toThrow('gap between lastSyncedTimestamp and from')
    })
  }
})
