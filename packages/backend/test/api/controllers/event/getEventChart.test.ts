import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getEventChart } from '../../../../src/api/controllers/event/getEventChart'
import { AggregatedEventRecord } from '../../../../src/peripherals/database/EventRepository'

const START = UnixTime.fromDate(new Date('2022-05-17'))
const EVENT_A = 'event-a'
const EVENT_B = 'event-b'
const mockEvent = (
  offset: number,
  name: string,
  count: number,
): AggregatedEventRecord => {
  return {
    timestamp: START.add(offset, 'hours'),
    name,
    projectId: ProjectId('project-a'),
    count,
  }
}

describe(getEventChart.name, () => {
  it('empty input', () => {
    const result = getEventChart([], [])

    expect(result).toEqual({
      types: ['timestamp'],
      data: [],
    })
  })

  it('correctly constructs chart data', () => {
    const records: AggregatedEventRecord[] = [
      mockEvent(0, EVENT_A, 100),
      mockEvent(1, EVENT_A, 100),
      mockEvent(2, EVENT_A, 100),
      mockEvent(0, EVENT_B, 200),
      mockEvent(1, EVENT_B, 200),
      mockEvent(2, EVENT_B, 200),
    ]
    const eventNames = [EVENT_A, EVENT_B]

    const result = getEventChart(records, eventNames)

    expect(result).toEqual({
      types: ['timestamp', EVENT_A, EVENT_B],
      data: [
        [START, 100, 200],
        [START.add(1, 'hours'), 100, 200],
        [START.add(2, 'hours'), 100, 200],
      ],
    })
  })

  it('skips events not provided in eventNames', () => {
    const records: AggregatedEventRecord[] = [
      mockEvent(0, EVENT_A, 100),
      mockEvent(1, EVENT_A, 100),
      mockEvent(2, EVENT_A, 100),
      mockEvent(0, EVENT_B, 200),
      mockEvent(1, EVENT_B, 200),
      mockEvent(2, EVENT_B, 200),
    ]
    const eventNames = [EVENT_A]

    const result = getEventChart(records, eventNames)

    expect(result).toEqual({
      types: ['timestamp', EVENT_A],
      data: [
        [START, 100],
        [START.add(1, 'hours'), 100],
        [START.add(2, 'hours'), 100],
      ],
    })
  })
})
