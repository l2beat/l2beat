import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { generateEventRecords } from '../../../src/core/events/generateEventRecords'
import { EventRecord } from '../../../src/peripherals/database/EventRepository'

const NOON = new UnixTime(1660608000)
const EVENT_A = 'event-a'
const PROJECT_A = ProjectId('project-a')

const mockEvent = () => {
  return {
    emitter: EthereumAddress.random(),
    topic: '#',
    name: EVENT_A,
    projectId: PROJECT_A,
    sinceTimestamp: UnixTime.now(),
  }
}

const mockEventRecord = (
  offset: number,
  count: number,
  timeSpan: 'hourly' | 'sixHourly' | 'daily',
): EventRecord => {
  return {
    timestamp: NOON.add(offset, 'hours'),
    name: EVENT_A,
    projectId: PROJECT_A,
    count,
    timeSpan,
  }
}

describe(generateEventRecords.name, () => {
  it('throw if first is not 1:00', () => {
    const timestamps = [{ timestamp: NOON.add(2, 'hours'), blockNumber: 200n }]

    expect(() => generateEventRecords(mockEvent(), [], timestamps)).toThrow(
      'Algorithm works only if first timestamp is 01:00',
    )
  })

  it('only hourly', async () => {
    const timestamps = [
      { timestamp: NOON.add(1, 'hours'), blockNumber: 100n },
      { timestamp: NOON.add(2, 'hours'), blockNumber: 200n },
      { timestamp: NOON.add(3, 'hours'), blockNumber: 300n },
    ]

    const logs = [1n, 50n, 100n, 150n, 200n, 250n]

    const result = generateEventRecords(mockEvent(), logs, timestamps)

    expect(result).toEqual([
      mockEventRecord(1, 2, 'hourly'),
      mockEventRecord(2, 2, 'hourly'),
      mockEventRecord(3, 2, 'hourly'),
    ])
  })

  it('hourly and sixHourly', async () => {
    const timestamps = [
      { timestamp: NOON.add(1, 'hours'), blockNumber: 100n },
      { timestamp: NOON.add(2, 'hours'), blockNumber: 200n },
      { timestamp: NOON.add(3, 'hours'), blockNumber: 300n },
      { timestamp: NOON.add(4, 'hours'), blockNumber: 400n },
      { timestamp: NOON.add(5, 'hours'), blockNumber: 500n },
      { timestamp: NOON.add(6, 'hours'), blockNumber: 600n },
    ]

    const logs = [
      1n,
      50n,
      100n,
      150n,
      200n,
      250n,
      300n,
      350n,
      400n,
      450n,
      500n,
      550n,
    ]

    const result = generateEventRecords(mockEvent(), logs, timestamps)

    expect(result).toEqual([
      mockEventRecord(1, 2, 'hourly'),
      mockEventRecord(2, 2, 'hourly'),
      mockEventRecord(3, 2, 'hourly'),
      mockEventRecord(4, 2, 'hourly'),
      mockEventRecord(5, 2, 'hourly'),
      mockEventRecord(6, 2, 'hourly'),
      mockEventRecord(6, 12, 'sixHourly'),
    ])
  })

  it('hourly, sixHourly and daily ', async () => {
    const timestamps = []
    const logs = []

    for (let i = 1; i <= 25; i++) {
      timestamps.push({
        timestamp: NOON.add(i, 'hours'),
        blockNumber: 100n * BigInt(i),
      })
      logs.push(BigInt(i - 1) * 100n, BigInt(i - 1) * 100n + 50n)
    }

    const result = generateEventRecords(mockEvent(), logs, timestamps)

    expect(result).toEqual([
      mockEventRecord(1, 2, 'hourly'),
      mockEventRecord(2, 2, 'hourly'),
      mockEventRecord(3, 2, 'hourly'),
      mockEventRecord(4, 2, 'hourly'),
      mockEventRecord(5, 2, 'hourly'),
      mockEventRecord(6, 2, 'hourly'),
      mockEventRecord(7, 2, 'hourly'),
      mockEventRecord(8, 2, 'hourly'),
      mockEventRecord(9, 2, 'hourly'),
      mockEventRecord(10, 2, 'hourly'),
      mockEventRecord(11, 2, 'hourly'),
      mockEventRecord(12, 2, 'hourly'),
      mockEventRecord(13, 2, 'hourly'),
      mockEventRecord(14, 2, 'hourly'),
      mockEventRecord(15, 2, 'hourly'),
      mockEventRecord(16, 2, 'hourly'),
      mockEventRecord(17, 2, 'hourly'),
      mockEventRecord(18, 2, 'hourly'),
      mockEventRecord(19, 2, 'hourly'),
      mockEventRecord(20, 2, 'hourly'),
      mockEventRecord(21, 2, 'hourly'),
      mockEventRecord(22, 2, 'hourly'),
      mockEventRecord(23, 2, 'hourly'),
      mockEventRecord(24, 2, 'hourly'),
      mockEventRecord(25, 2, 'hourly'),
      mockEventRecord(6, 12, 'sixHourly'),
      mockEventRecord(12, 12, 'sixHourly'),
      mockEventRecord(18, 12, 'sixHourly'),
      mockEventRecord(24, 12, 'sixHourly'),
      mockEventRecord(24, 48, 'daily'),
    ])
  })

  it('empty logs', () => {
    const timestamps = [
      { timestamp: NOON.add(1, 'hours'), blockNumber: 100n },
      { timestamp: NOON.add(2, 'hours'), blockNumber: 200n },
      { timestamp: NOON.add(3, 'hours'), blockNumber: 300n },
    ]

    const result = generateEventRecords(mockEvent(), [], timestamps)

    expect(result).toEqual([
      mockEventRecord(1, 0, 'hourly'),
      mockEventRecord(2, 0, 'hourly'),
      mockEventRecord(3, 0, 'hourly'),
    ])
  })

  it('empty timestamps', () => {
    const logs: bigint[] = [100n]

    const result = generateEventRecords(mockEvent(), logs, [])

    expect(result).toEqual([])
  })
})
