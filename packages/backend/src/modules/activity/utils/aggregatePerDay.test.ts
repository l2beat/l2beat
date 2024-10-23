import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { range } from 'lodash'
import { aggregatePerDay } from './aggregatePerDay'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(aggregatePerDay.name, () => {
  it('should aggregate per day', () => {
    const project = ProjectId('project')
    const result = aggregatePerDay(project, [
      block(START, 1, 1, 1),
      block(START.add(1, 'hours'), 5, 8, 2),
      block(START.add(2, 'hours'), 2, 3, 3),
      block(START.add(1, 'days'), 2, 2, 4),
      block(START.add(1, 'days').add(1, 'hours'), 6, 7, 5),
    ])

    expect(result).toEqual([
      activityRecord(project, START, 8, 12, 1, 3),
      activityRecord(project, START.add(1, 'days'), 8, 9, 4, 5),
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
  start: number = 0,
  end: number = 10,
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
