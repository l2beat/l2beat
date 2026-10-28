import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { clusterEvents, codeEvents, getHistoryPoints } from './historyPoints'
import type { PerimeterMember } from './perimeterTimeline'

const DAY = UnixTime.DAY
const A = ChainSpecificAddress('eth:0x000000000000000000000000000000000000000A')
const B = ChainSpecificAddress('eth:0x000000000000000000000000000000000000000B')

const LAUNCH = 0
const NOW = 30 * DAY

const members: PerimeterMember[] = [
  {
    address: A,
    name: 'A',
    since: LAUNCH,
    code: [
      { from: LAUNCH, addresses: [A] },
      { from: 10 * DAY, addresses: [A] },
      { from: 10 * DAY + 3600, addresses: [A] },
      { from: 11 * DAY + 1, addresses: [A] },
    ],
  },
  {
    address: B,
    name: 'B',
    since: 5 * DAY,
    until: 20 * DAY,
    code: [{ from: 5 * DAY, addresses: [B] }],
  },
]

describe(getHistoryPoints.name, () => {
  it('places the launch, report dates, clustered code changes and now', () => {
    const points = getHistoryPoints(
      members,
      LAUNCH,
      [-1, 2 * DAY, 15 * DAY, 99 * DAY],
      NOW,
    )
    const at = (t: number) => ({ timestamp: t, stateAt: t, auditsAt: t })
    expect(points).toEqual([
      at(LAUNCH),
      at(2 * DAY),
      at(5 * DAY),
      {
        timestamp: 10 * DAY,
        stateAt: 10 * DAY + 3600,
        auditsAt: 10 * DAY + 3600,
      },
      at(11 * DAY + 1),
      at(15 * DAY),
      at(20 * DAY),
      at(NOW),
    ])
  })

  it('merges a report date and a cluster on the same second', () => {
    const points = getHistoryPoints(members, LAUNCH, [10 * DAY], NOW)
    expect(points.find((p) => p.timestamp === 10 * DAY)).toEqual({
      timestamp: 10 * DAY,
      stateAt: 10 * DAY + 3600,
      auditsAt: 10 * DAY + 3600,
    })
  })
})

describe(codeEvents.name, () => {
  it('lists member starts after the launch, ends and upgrades up to now', () => {
    expect(codeEvents(members, LAUNCH, 12 * DAY)).toEqual([
      5 * DAY,
      10 * DAY,
      10 * DAY + 3600,
      11 * DAY + 1,
    ])
    expect(codeEvents(members, LAUNCH, NOW)).toEqual([
      5 * DAY,
      10 * DAY,
      10 * DAY + 3600,
      11 * DAY + 1,
      20 * DAY,
    ])
  })
})

describe(clusterEvents.name, () => {
  it('starts a cluster when an event is more than a day after the start', () => {
    expect(clusterEvents([1, 2, DAY + 1, DAY + 2, 3 * DAY])).toEqual([
      [1, 2, DAY + 1],
      [DAY + 2],
      [3 * DAY],
    ])
  })
})
