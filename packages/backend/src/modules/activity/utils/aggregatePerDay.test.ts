import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { range } from 'lodash'
import { aggregatePerDay } from './aggregatePerDay'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(aggregatePerDay.name, () => {
  it('should aggregate per day', () => {
    const project = ProjectId('project')
    const result = aggregatePerDay(project, [
      block(START, 1, 1),
      block(START.add(1, 'hours'), 5, 2),
      block(START.add(2, 'hours'), 2, 3),
      block(START.add(1, 'days'), 2, 4),
      block(START.add(1, 'days').add(1, 'hours'), 6, 5),
    ])

    expect(result).toEqual([
      activityRecord(project, START, 8, 1, 3),
      activityRecord(project, START.add(1, 'days'), 8, 4, 5),
    ])
  })
})

function block(timestamp: UnixTime, txsCount: number, number: number) {
  return {
    timestamp,
    txsCount,
    number,
  }
}

export function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  start: number = 0,
  end: number = 10,
) {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    start,
    end,
  }
}

export function transactions(count: number) {
  return range(count).map((i) => `0x${i.toString()}`)
}
