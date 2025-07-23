import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import range from 'lodash/range'
import { aggregatePerDay } from './aggregatePerDay'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(aggregatePerDay.name, () => {
  it('should aggregate per day', () => {
    const project = ProjectId('project')
    const result = aggregatePerDay(project, [
      block(START, 1, 1, 1),
      block(START + 1 * UnixTime.HOUR, 5, 8, 2),
      block(START + 2 * UnixTime.HOUR, 2, 3, 3),
      block(START + 1 * UnixTime.DAY, 2, 2, 4),
      block(START + 1 * UnixTime.DAY + 1 * UnixTime.HOUR, 6, 7, 5),
    ])

    expect(result).toEqual([
      activityRecord(project, START, 8, 12, 1, 3),
      activityRecord(project, START + 1 * UnixTime.DAY, 8, 9, 4, 5),
    ])
  })
})

function block(
  timestamp: UnixTime,
  txsCount: number,
  uopsCount: number | null,
  number: number,
) {
  return {
    timestamp,
    txsCount,
    uopsCount,
    number,
  }
}

export function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
  start = 0,
  end = 10,
) {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    uopsCount,
    start,
    end,
  }
}

export function transactions(count: number) {
  return range(count).map((i) => ({
    to: `0x${i.toString()}`,
    data: `0x${i.toString()}`,
  }))
}
