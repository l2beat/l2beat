import { UnixTime } from '@l2beat/types'

import { EventRecord } from '../../peripherals/database/EventRepository'
import { EventDetails } from './types/EventDetails'

export function generateEventRecords(
  { name, projectId }: EventDetails,
  logs: bigint[],
  timestamps: { timestamp: UnixTime; blockNumber: bigint }[],
): EventRecord[] {
  if (timestamps.length === 0) {
    return []
  }
  if (timestamps[0]?.timestamp.toNumber() % 86400 !== 3600) {
    throw new Error('Algorithm works only if first timestamp is 01:00')
  }

  const sortedLogs = logs.sort((a, b) => Number(a - b))

  let i = 0
  const hourly: EventRecord[] = []
  const sixHourly: EventRecord[] = []
  const daily: EventRecord[] = []

  let hourlyCount = 0
  let sixHourlyCount = 0
  let dailyCount = 0

  for (const { timestamp, blockNumber } of timestamps) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      if (i >= sortedLogs.length) {
        break
      }
      if (sortedLogs[i] < blockNumber) {
        hourlyCount++
        sixHourlyCount++
        dailyCount++
        i++
      } else {
        break
      }
    }
    hourly.push({
      timestamp: timestamp,
      name,
      projectId,
      count: hourlyCount,
      timeSpan: 'hourly',
    })
    hourlyCount = 0
    if (timestamp.isFull('six hours')) {
      sixHourly.push({
        timestamp: timestamp,
        name,
        projectId,
        count: sixHourlyCount,
        timeSpan: 'sixHourly',
      })
      sixHourlyCount = 0
    }
    if (timestamp.isFull('day')) {
      daily.push({
        timestamp: timestamp,
        name,
        projectId,
        count: dailyCount,
        timeSpan: 'daily',
      })
      dailyCount = 0
    }
  }

  return hourly.concat(sixHourly).concat(daily)
}
