import { Logger } from '@l2beat/backend-tools'
import { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { range } from 'lodash'
import { TxsCountProvider } from './TxsCountProvider'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(TxsCountProvider.name, () => {
  describe(TxsCountProvider.prototype.aggregatePerDay.name, () => {
    it('should aggregate per day', () => {
      const testTxsCountProvider = new TestTxsCountProvider(
        Logger.SILENT,
        ProjectId('a'),
      )

      const result = testTxsCountProvider.aggregatePerDay([
        block(START, 1, 1),
        block(START.add(1, 'hours'), 5, 2),
        block(START.add(2, 'hours'), 2, 3),
        block(START.add(1, 'days'), 2, 4),
        block(START.add(1, 'days').add(1, 'hours'), 6, 5),
      ])

      expect(result).toEqual([
        activityRecord('a', START, 8, 1, 3),
        activityRecord('a', START.add(1, 'days'), 8, 4, 5),
      ])
    })
  })
})

class TestTxsCountProvider extends TxsCountProvider {
  constructor(logger: Logger, projectId: ProjectId) {
    super({ logger, projectId })
  }

  override getTxsCount(): Promise<ActivityRecord[]> {
    return Promise.resolve([])
  }
}

function block(timestamp: UnixTime, count: number, number: number) {
  return {
    timestamp,
    count,
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
