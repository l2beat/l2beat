import { UnixTime } from '@l2beat/common';

import { EventRecord } from '../../peripherals/database/EventRepository';
import { EventDetails } from './types/EventDetails';

export function generateEventRecords(
  { name, projectId }: EventDetails,
  logs: bigint[],
  timestamps: { timestamp: UnixTime; blockNumber: bigint; }[]
): EventRecord[] {
  if (timestamps[0]?.timestamp.toNumber() % 86400 !== 3600) {
    throw new Error('Algorithm works only if first timestamp is 01:00');
  }

  const sortedLogs = logs.sort((a, b) => Number(a - b));

  let i = 0;
  const hourly: EventRecord[] = [];
  const sixHourly: EventRecord[] = [];
  const daily: EventRecord[] = [];

  for (const { timestamp, blockNumber } of timestamps) {
    let count = 0;
    while (true) {
      if (sortedLogs[i] < blockNumber) {
        count++;
        i++;
      } else {
        break;
      }
    }
    hourly.push({
      timestamp: timestamp,
      name,
      projectId,
      count,
      timeSpan: 'hourly',
    });
    if (timestamp.isSixHourly()) {
      let sum = 0;
      hourly.slice(hourly.length - 6).forEach((r) => (sum += r.count));
      sixHourly.push({
        timestamp: timestamp,
        name,
        projectId,
        count: sum,
        timeSpan: 'sixHourly',
      });
    }
    if (timestamp.isDaily()) {
      let sum = 0;
      hourly.slice(hourly.length - 24).forEach((r) => (sum += r.count));
      daily.push({
        timestamp: timestamp,
        name,
        projectId,
        count: sum,
        timeSpan: 'daily',
      });
    }
  }

  return hourly.concat(sixHourly).concat(daily);
}
